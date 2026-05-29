// components/YouTubePlayer.tsx
// Lecteur YouTube IFrame API pour les blind tests.
// La musique streame depuis YouTube — aucun fichier stocké sur nos serveurs.
// YouTube gère ses accords SACEM/SCPP/SPPF. On est juste un intégrateur.
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

// ── Extraction ID vidéo ───────────────────────────────────────────────────────
export function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /[?&]v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m?.[1]) return m[1];
  }
  return null;
}

// ── Chargement unique de l'API (singleton) ────────────────────────────────────
let _ytResolvers: (() => void)[] = [];
let _ytReady = false;

function loadYTAPI(): Promise<void> {
  if (_ytReady) return Promise.resolve();
  return new Promise((resolve) => {
    _ytResolvers.push(resolve);
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) return;
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      _ytReady = true;
      _ytResolvers.forEach(r => r());
      _ytResolvers = [];
    };
  });
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  url: string;
  /** Lance automatiquement la musique dès que le player est prêt */
  autoPlay?: boolean;
  /** Quand passe à true, déclenche la lecture sur le player existant (préchargé) */
  shouldPlay?: boolean;
  onPlay?: () => void;
  /** Appelé quand YouTube bloque la vidéo (embedding désactivé, vidéo supprimée…) */
  onVideoError?: () => void;
  /**
   * Appelé quand le player a RÉELLEMENT bufférisé la vidéo à startTime.
   * En mode preload (autoPlay=false + onPlayerReady fourni), le player joue
   * la vidéo en mute pour remplir le buffer, puis se met en pause.
   * Ainsi, quand shouldPlay passe à true, la lecture démarre instantanément.
   */
  onPlayerReady?: () => void;
  /** Timestamp (secondes) où démarrer. 0 = début. */
  startTime?: number;
}

type Status = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

// ── Composant ─────────────────────────────────────────────────────────────────
export function YouTubePlayer({ url, autoPlay = false, shouldPlay = false, onPlay, onVideoError, onPlayerReady, startTime = 0 }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [retryCount, setRetryCount]     = useState(0);
  const playerRef         = useRef<any>(null);
  const containerRef      = useRef<HTMLDivElement>(null);
  const readyRef          = useRef(false);
  const pendingPlay       = useRef(false);
  const mountedRef        = useRef(true);

  // ── Preload mode refs ────────────────────────────────────────────────────────
  // isPreloadModeRef : true quand on bufférise en mute avant de signaler prêt
  const isPreloadModeRef  = useRef(false);
  // seenBufferingRef : true dès qu'on a vu un état BUFFERING (3) après le seekTo,
  //   ce qui garantit que le prochain état PLAYING (1) est bien au bon timestamp
  const seenBufferingRef  = useRef(false);
  // Fallback : si l'état PLAYING ne vient jamais (réseau lent), on signale prêt au bout de 8s
  const preloadFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const videoId = extractYoutubeId(url);

  // ── Signaler le préchargement terminé ────────────────────────────────────────
  const signalPreloadDone = useCallback(() => {
    if (!isPreloadModeRef.current) return;
    isPreloadModeRef.current = false;
    if (preloadFallbackRef.current) {
      clearTimeout(preloadFallbackRef.current);
      preloadFallbackRef.current = null;
    }
    // Remettre en pause, couper le mute, puis signaler
    try { playerRef.current?.pauseVideo?.(); } catch {}
    try { playerRef.current?.unMute?.(); } catch {}
    onPlayerReady?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Créer le player quand l'URL ou retryCount change ─────────────────────────
  useEffect(() => {
    mountedRef.current = true;
    if (!videoId) return;

    // Annuler tout fallback preload en cours
    if (preloadFallbackRef.current) { clearTimeout(preloadFallbackRef.current); preloadFallbackRef.current = null; }

    try { playerRef.current?.destroy?.(); } catch {}
    playerRef.current   = null;
    readyRef.current    = false;
    pendingPlay.current = autoPlay;

    // Mode preload : onPlayerReady fourni + pas d'autoPlay demandé
    const isPreloadMode = !autoPlay && !!onPlayerReady;
    isPreloadModeRef.current = isPreloadMode;
    seenBufferingRef.current = false;

    if (containerRef.current) containerRef.current.innerHTML = '';
    setStatus(autoPlay ? 'loading' : 'idle');

    const slot = document.createElement('div');
    containerRef.current?.appendChild(slot);

    loadYTAPI().then(() => {
      if (!mountedRef.current || !slot.parentElement) return;

      playerRef.current = new window.YT.Player(slot, {
        videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          // En mode preload : autoplay:1 + mute:1 pour déclencher la bufférisation
          // réelle à startTime sans que l'utilisateur n'entende rien.
          autoplay: (autoPlay || isPreloadMode) ? 1 : 0,
          mute:     isPreloadMode ? 1 : 0,
          controls: 1,
          rel: 0,
          playsinline: 1,
          modestbranding: 1,
          iv_load_policy: 3,
          fs: 0,
        },
        events: {
          onReady: () => {
            if (!mountedRef.current) return;
            readyRef.current = true;

            if (startTime > 0) {
              playerRef.current?.seekTo?.(startTime, true);
            }

            if (isPreloadModeRef.current) {
              // Mode preload : la vidéo tourne déjà en mute (autoplay:1).
              // On a demandé un seekTo → on attend l'état BUFFERING puis PLAYING
              // dans onStateChange pour savoir que le buffer est vraiment prêt.
              // Si startTime=0, on n'attend pas le BUFFERING (vidéo déjà en tête).
              if (startTime === 0) seenBufferingRef.current = true;

              // Fallback de sécurité : 8 secondes max
              preloadFallbackRef.current = setTimeout(() => {
                if (!mountedRef.current) return;
                signalPreloadDone();
              }, 8000);
            } else {
              // Mode normal (autoPlay ou non) : comportement classique
              if (pendingPlay.current) {
                pendingPlay.current = false;
                // autoplay:1 a déjà lancé la lecture
              } else {
                playerRef.current?.pauseVideo?.();
              }
              onPlayerReady?.();
            }
          },

          onStateChange: (e: any) => {
            if (!mountedRef.current) return;
            const s: number = e.data;

            // ── Logique de preload ──────────────────────────────────────────
            if (isPreloadModeRef.current) {
              if (s === 3) {
                // BUFFERING : la vidéo est en train de charger (après seekTo ou démarrage)
                seenBufferingRef.current = true;
              } else if (s === 1 && seenBufferingRef.current) {
                // PLAYING après un buffering : le buffer est là, on peut mettre en pause
                signalPreloadDone();
              }
              // On ne met pas à jour le status UI pendant le preload
              return;
            }

            // ── Logique normale ─────────────────────────────────────────────
            if (s === 1) { setStatus('playing'); onPlay?.(); }
            else if (s === 2) setStatus('paused');
            else if (s === 0) setStatus('idle');
            else if (s === 3) setStatus('loading');
          },

          onError: () => {
            if (!mountedRef.current) return;
            if (preloadFallbackRef.current) { clearTimeout(preloadFallbackRef.current); preloadFallbackRef.current = null; }
            isPreloadModeRef.current = false;
            if (playerRef.current) playerRef.current._errored = true;
            setStatus('error');
            onVideoError?.();
          },
        },
      });
    });

    return () => {
      mountedRef.current = false;
      if (preloadFallbackRef.current) { clearTimeout(preloadFallbackRef.current); preloadFallbackRef.current = null; }
      try { playerRef.current?.destroy?.(); } catch {}
      playerRef.current    = null;
      readyRef.current     = false;
      pendingPlay.current  = false;
      isPreloadModeRef.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, autoPlay, retryCount]);

  // ── Déclenchement externe (shouldPlay) ──────────────────────────────────────
  useEffect(() => {
    if (!videoId) return;
    if (shouldPlay) {
      if (playerRef.current?._errored) return;
      if (readyRef.current && playerRef.current) {
        // Assurer que le player est démuté (il pouvait être en mute pendant le preload)
        try { playerRef.current.unMute?.(); } catch {}
        if (startTime > 0) playerRef.current.seekTo(startTime, true);
        playerRef.current.playVideo();
        setStatus('loading');
      } else {
        pendingPlay.current = true;
      }
    } else {
      pendingPlay.current = false;
      if (readyRef.current && playerRef.current) {
        playerRef.current.pauseVideo?.();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldPlay]);

  // ── Contrôles manuels ────────────────────────────────────────────────────────
  const handlePlay = useCallback(() => {
    if (!videoId) return;
    if (readyRef.current && playerRef.current && !playerRef.current._errored) {
      try { playerRef.current.unMute?.(); } catch {}
      if (startTime > 0) playerRef.current.seekTo(startTime, true);
      playerRef.current.playVideo();
      setStatus('loading');
    } else {
      setRetryCount(c => c + 1);
    }
  }, [videoId, startTime]);

  const handlePause = useCallback(() => {
    playerRef.current?.pauseVideo?.();
    setStatus('paused');
  }, []);

  const handleStop = useCallback(() => {
    playerRef.current?.stopVideo?.();
    setStatus('idle');
  }, []);

  // ── URL invalide ─────────────────────────────────────────────────────────────
  if (!videoId) {
    return (
      <div className="px-4 py-3 rounded-xl text-xs font-bold"
        style={{ background: 'rgba(255,0,170,0.08)', color: '#FF00AA', border: '1px solid rgba(255,0,170,0.25)' }}>
        ⚠ URL YouTube invalide pour cette question
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">

      {/* Container YouTube — toujours dans le DOM, toujours caché (audio uniquement) */}
      <div
        ref={containerRef}
        style={{
          position: 'fixed', top: '-9999px', left: '-9999px',
          width: 1, height: 1, overflow: 'hidden', pointerEvents: 'none',
        }}
      />

      {/* Barre de contrôle */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl w-full"
        style={{
          background: status === 'playing' ? 'rgba(255,0,170,0.12)'
            : status === 'error' ? 'rgba(255,0,170,0.06)'
            : 'rgba(255,255,255,0.05)',
          border: `1.5px solid ${
            status === 'playing' ? 'rgba(255,0,170,0.4)'
            : status === 'error' ? 'rgba(255,0,170,0.3)'
            : 'rgba(255,255,255,0.1)'
          }`,
          transition: 'all 0.25s',
        }}
      >
        {/* Icône */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: status === 'playing' ? '#FF00AA' : 'rgba(255,255,255,0.08)' }}>
          {status === 'playing' ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <style>{`
                @keyframes ytb1{0%,100%{height:4px;y:7px}50%{height:14px;y:2px}}
                @keyframes ytb2{0%,100%{height:10px;y:4px}50%{height:4px;y:7px}}
                @keyframes ytb3{0%,100%{height:6px;y:6px}50%{height:12px;y:3px}}
              `}</style>
              <rect x="1"   y="7" width="3" height="4"  rx="1.5" fill="white" style={{ animation: 'ytb1 0.8s ease-in-out infinite' }} />
              <rect x="7.5" y="4" width="3" height="10" rx="1.5" fill="white" style={{ animation: 'ytb2 0.8s ease-in-out infinite 0.2s' }} />
              <rect x="14"  y="6" width="3" height="6"  rx="1.5" fill="white" style={{ animation: 'ytb3 0.8s ease-in-out infinite 0.4s' }} />
            </svg>
          ) : status === 'loading' ? (
            <div className="w-4 h-4 rounded-full border-2 animate-spin"
              style={{ borderColor: '#FF00AA', borderTopColor: 'transparent' }} />
          ) : status === 'error' ? (
            <span style={{ color: '#FF00AA', fontSize: '1rem' }}>⚠</span>
          ) : (
            <span style={{ color: 'rgba(240,244,255,0.5)', fontSize: '1.1rem' }}>♪</span>
          )}
        </div>

        {/* Texte d'état */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest"
            style={{ color: status === 'playing' ? 'rgba(255,0,170,0.8)' : 'rgba(240,244,255,0.4)' }}>
            {status === 'playing' ? 'En cours…'
              : status === 'loading' ? 'Chargement…'
              : status === 'paused'  ? 'En pause'
              : status === 'error'   ? 'Erreur YouTube'
              : 'Blind Test'}
          </p>
          <p className="text-sm font-bold truncate"
            style={{ color: status === 'playing' ? '#F0F4FF' : 'rgba(240,244,255,0.5)' }}>
            {status === 'playing' ? 'Identifie la musique !'
              : status === 'loading' ? 'Démarrage…'
              : status === 'paused'  ? 'Appuie sur ▶ pour reprendre'
              : status === 'error'   ? 'Vidéo bloquée par YouTube (label musical)'
              : 'Prêt'}
          </p>
        </div>

        {/* Boutons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {(status === 'idle' || status === 'error') && (
            <button onClick={handlePlay}
              className="flex items-center justify-center font-black text-sm px-4 py-2 rounded-xl transition-all hover:opacity-90"
              style={{ background: '#FF00AA', color: 'white', minWidth: 72 }}>
              ▶ Play
            </button>
          )}
          {status === 'loading' && (
            <div className="w-7 h-7 rounded-full border-2 animate-spin flex-shrink-0"
              style={{ borderColor: '#FF00AA', borderTopColor: 'transparent' }} />
          )}
          {status === 'playing' && (
            <>
              <button onClick={handlePause}
                className="flex items-center justify-center font-bold text-sm px-3 py-2 rounded-xl transition-all hover:opacity-90"
                style={{ background: 'rgba(255,0,170,0.18)', color: '#FF00AA', border: '1px solid rgba(255,0,170,0.35)' }}
                title="Pause">⏸</button>
              <button onClick={handleStop}
                className="flex items-center justify-center font-bold text-sm px-3 py-2 rounded-xl transition-all hover:opacity-90"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(240,244,255,0.5)' }}
                title="Stop">⏹</button>
            </>
          )}
          {status === 'paused' && (
            <>
              <button onClick={handlePlay}
                className="flex items-center justify-center font-bold text-sm px-4 py-2 rounded-xl transition-all hover:opacity-90"
                style={{ background: '#FF00AA', color: 'white', minWidth: 72 }}>
                ▶ Play
              </button>
              <button onClick={handleStop}
                className="flex items-center justify-center font-bold text-sm px-3 py-2 rounded-xl transition-all hover:opacity-90"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(240,244,255,0.5)' }}
                title="Stop">⏹</button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
