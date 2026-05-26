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

// ── Extraction ID vidéo (exportée pour réutilisation dans questions/page.tsx) ─
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

// ── Chargement unique de l'API (singleton robuste) ───────────────────────────
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
  /**
   * Contrôle la lecture :
   *  - undefined / non fourni → boutons manuels Play/Pause
   *  - false  → le player charge en SILENCE (préchargement pendant le countdown)
   *  - true   → démarre la lecture dès que le player est prêt (ou immédiatement
   *              s'il l'est déjà). Passe de false→true quand le countdown finit.
   */
  shouldPlay?: boolean;
  /** @deprecated — utiliser shouldPlay. Conservé pour compatibilité. */
  autoPlay?: boolean;
  onPlay?: () => void;
  /** Timestamp (secondes) où la musique doit démarrer. 0 = début. */
  startTime?: number;
}

type Status = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

// ── Composant ─────────────────────────────────────────────────────────────────
export function YouTubePlayer({ url, shouldPlay, autoPlay = false, onPlay, startTime = 0 }: Props) {
  const [status, setStatus]             = useState<Status>('idle');
  const [videoVisible, setVideoVisible] = useState(false);
  const playerRef    = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const readyRef     = useRef(false);
  const pendingPlay  = useRef(false);
  const mountedRef   = useRef(true);

  // Ref qui garde toujours la valeur courante de shouldPlay
  // sans provoquer de remontage du player quand elle change.
  const shouldPlayRef = useRef<boolean>(shouldPlay ?? autoPlay);
  shouldPlayRef.current = shouldPlay ?? autoPlay;

  const videoId = extractYoutubeId(url);

  // ── Créer / recréer le player quand la vidéo change ──────────────────────
  useEffect(() => {
    mountedRef.current = true;
    if (!videoId) return;

    // Détruire l'ancien player si présent
    try { playerRef.current?.destroy?.(); } catch {}
    playerRef.current = null;
    readyRef.current  = false;

    // Doit-on jouer dès que le player est prêt ?
    const playImmediately = shouldPlayRef.current;
    pendingPlay.current   = playImmediately;

    if (containerRef.current) containerRef.current.innerHTML = '';
    setStatus(playImmediately ? 'loading' : 'idle');
    setVideoVisible(false);

    const slot = document.createElement('div');
    containerRef.current?.appendChild(slot);

    loadYTAPI().then(() => {
      if (!mountedRef.current || !slot.parentElement) return;

      playerRef.current = new window.YT.Player(slot, {
        videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          // autoplay: 0 — on ne laisse pas YouTube décider.
          // Le player charge et buffère en silence ;
          // on appelle playVideo() manuellement au bon moment.
          autoplay: 0,
          controls: 1,
          rel: 0,
          playsinline: 1,
          modestbranding: 1,
          iv_load_policy: 3,
          fs: 0,
          start: startTime > 0 ? startTime : 0,
        },
        events: {
          onReady: () => {
            if (!mountedRef.current) return;
            readyRef.current = true;
            if (startTime > 0) {
              playerRef.current?.seekTo?.(startTime, true);
            }
            // Jouer si demandé (soit au montage, soit entre-temps via shouldPlay)
            if (pendingPlay.current || shouldPlayRef.current) {
              pendingPlay.current = false;
              playerRef.current?.playVideo?.();
            }
          },
          onStateChange: (e: any) => {
            if (!mountedRef.current) return;
            const s: number = e.data;
            if (s === 1) { setStatus('playing'); onPlay?.(); }  // PLAYING
            else if (s === 2) setStatus('paused');               // PAUSED
            else if (s === 0) setStatus('idle');                 // ENDED
            else if (s === 3) setStatus('loading');              // BUFFERING
          },
          onError: () => {
            if (!mountedRef.current) return;
            setStatus('error');
          },
        },
      });
    });

    return () => {
      mountedRef.current = false;
      try { playerRef.current?.destroy?.(); } catch {}
      playerRef.current   = null;
      readyRef.current    = false;
      pendingPlay.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]); // NE PAS ajouter shouldPlay ici — effet séparé ci-dessous

  // ── Réagir aux changements de shouldPlay SANS remonter le player ──────────
  // Typiquement : countdown finit → shouldPlay passe de false à true
  useEffect(() => {
    if (shouldPlay === undefined) return; // mode manuel, on ne fait rien

    if (shouldPlay) {
      if (readyRef.current && playerRef.current) {
        // Player déjà prêt (il a chargé pendant le countdown) → lecture immédiate
        if (startTime > 0) playerRef.current.seekTo(startTime, true);
        playerRef.current.playVideo();
        setStatus('loading'); // confirmé par onStateChange → PLAYING
      } else {
        // Player pas encore prêt → onReady l'activera
        pendingPlay.current = true;
        setStatus('loading');
      }
    }
    // shouldPlay → false : on ne met pas en pause automatiquement
    // (l'hôte peut contrôler manuellement)
  }, [shouldPlay, startTime]);

  // ── Contrôles manuels ─────────────────────────────────────────────────────
  const handlePlay = useCallback(() => {
    if (!videoId) return;
    if (readyRef.current && playerRef.current) {
      if (startTime > 0) playerRef.current.seekTo(startTime, true);
      playerRef.current.playVideo();
      setStatus('loading');
    } else {
      setStatus('loading');
      pendingPlay.current = true;
      loadYTAPI();
    }
  }, [videoId, startTime]);

  const handlePause = useCallback(() => {
    playerRef.current?.pauseVideo?.();
    setStatus('paused');
  }, []);

  const handleStop = useCallback(() => {
    playerRef.current?.stopVideo?.();
    setStatus('idle');
    setVideoVisible(false);
  }, []);

  // ── URL invalide ──────────────────────────────────────────────────────────
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

      {/* Container YouTube — toujours dans le DOM pour maintenir la lecture.
          Visible = aspect-ratio 16:9. Caché = 0px mais pas display:none. */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: videoVisible ? undefined : 0,
          aspectRatio: videoVisible ? '16/9' : undefined,
          overflow: 'hidden',
          borderRadius: videoVisible ? '0.75rem' : 0,
          visibility: videoVisible ? 'visible' : 'hidden',
          transition: 'height 0.3s',
          pointerEvents: videoVisible ? 'auto' : 'none',
        }}
      />

      {/* ── Barre de contrôle ── */}
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
        {/* Icône animée */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: status === 'playing' ? '#FF00AA' : 'rgba(255,255,255,0.08)' }}
        >
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
              : status === 'error'   ? 'Vidéo indisponible — appuie sur ▶ pour réessayer'
              : 'Prêt'}
          </p>
        </div>

        {/* Boutons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {(status === 'idle' || status === 'error') && (
            <button
              onClick={handlePlay}
              className="flex items-center justify-center font-black text-sm px-4 py-2 rounded-xl transition-all hover:opacity-90"
              style={{ background: '#FF00AA', color: 'white', minWidth: 72 }}
            >
              ▶ Play
            </button>
          )}
          {status === 'loading' && (
            <div className="w-7 h-7 rounded-full border-2 animate-spin flex-shrink-0"
              style={{ borderColor: '#FF00AA', borderTopColor: 'transparent' }} />
          )}
          {status === 'playing' && (
            <>
              <button
                onClick={handlePause}
                className="flex items-center justify-center font-bold text-sm px-3 py-2 rounded-xl transition-all hover:opacity-90"
                style={{ background: 'rgba(255,0,170,0.18)', color: '#FF00AA', border: '1px solid rgba(255,0,170,0.35)' }}
                title="Pause"
              >⏸</button>
              <button
                onClick={handleStop}
                className="flex items-center justify-center font-bold text-sm px-3 py-2 rounded-xl transition-all hover:opacity-90"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(240,244,255,0.5)' }}
                title="Stop"
              >⏹</button>
            </>
          )}
          {status === 'paused' && (
            <>
              <button
                onClick={handlePlay}
                className="flex items-center justify-center font-black text-sm px-4 py-2 rounded-xl transition-all hover:opacity-90"
                style={{ background: '#FF00AA', color: 'white', minWidth: 72 }}
              >▶ Play</button>
              <button
                onClick={handleStop}
                className="flex items-center justify-center font-bold text-sm px-3 py-2 rounded-xl transition-all hover:opacity-90"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(240,244,255,0.5)' }}
                title="Stop"
              >⏹</button>
            </>
          )}
        </div>
      </div>

      {/* ── Toggle vidéo (affiché seulement si le player a été lancé) ── */}
      {status !== 'idle' && status !== 'error' && (
        <button
          onClick={() => setVideoVisible(v => !v)}
          className="self-start text-xs font-bold px-3 py-1 rounded-lg transition-all hover:opacity-80"
          style={{
            background: videoVisible ? 'rgba(255,0,170,0.1)' : 'rgba(255,255,255,0.06)',
            color: videoVisible ? '#FF00AA' : 'rgba(240,244,255,0.4)',
            border: `1px solid ${videoVisible ? 'rgba(255,0,170,0.3)' : 'rgba(255,255,255,0.1)'}`,
          }}
        >
          {videoVisible ? '🙈 Masquer la vidéo' : '👁 Afficher la vidéo'}
        </button>
      )}
    </div>
  );
}
