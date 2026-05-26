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
  onPlay?: () => void;
  /** Appelé quand YouTube bloque la vidéo (embedding désactivé, vidéo supprimée…) */
  onVideoError?: () => void;
  /** Timestamp (secondes) où démarrer. 0 = début. */
  startTime?: number;
}

type Status = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

// ── Composant ─────────────────────────────────────────────────────────────────
export function YouTubePlayer({ url, autoPlay = false, onPlay, onVideoError, startTime = 0 }: Props) {
  const [status, setStatus]             = useState<Status>('idle');
  const [videoVisible, setVideoVisible] = useState(false);
  // Incrémenté pour forcer la recréation du player (ex : retry après erreur)
  const [retryCount, setRetryCount]     = useState(0);
  const playerRef    = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const readyRef     = useRef(false);
  const pendingPlay  = useRef(false);
  const mountedRef   = useRef(true);

  const videoId = extractYoutubeId(url);

  // ── Créer le player quand l'URL ou retryCount change ─────────────────────
  useEffect(() => {
    mountedRef.current = true;
    if (!videoId) return;

    try { playerRef.current?.destroy?.(); } catch {}
    playerRef.current = null;
    readyRef.current  = false;
    pendingPlay.current = autoPlay;
    if (containerRef.current) containerRef.current.innerHTML = '';
    setStatus(autoPlay ? 'loading' : 'idle');
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
          // autoplay: 1 autorisé par le navigateur car lancé dans le contexte
          // d'un clic utilisateur récent (bouton "Question suivante").
          autoplay: autoPlay ? 1 : 0,
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
            if (pendingPlay.current) {
              pendingPlay.current = false;
              playerRef.current?.playVideo?.();
            }
          },
          onStateChange: (e: any) => {
            if (!mountedRef.current) return;
            const s: number = e.data;
            if (s === 1) { setStatus('playing'); onPlay?.(); }
            else if (s === 2) setStatus('paused');
            else if (s === 0) setStatus('idle');
            else if (s === 3) setStatus('loading');
          },
          onError: () => {
            if (!mountedRef.current) return;
            if (playerRef.current) playerRef.current._errored = true;
            setStatus('error');
            onVideoError?.();
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
  }, [videoId, autoPlay, retryCount]);

  // ── Contrôles manuels ────────────────────────────────────────────────────
  const handlePlay = useCallback(() => {
    if (!videoId) return;
    // En cas d'erreur : recréer complètement le player (retry propre)
    // En cas de pause/idle : relancer la lecture sur le player existant
    if (readyRef.current && playerRef.current && !playerRef.current._errored) {
      if (startTime > 0) playerRef.current.seekTo(startTime, true);
      playerRef.current.playVideo();
      setStatus('loading');
    } else {
      // Recréer le player (erreur ou player non initialisé)
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
    setVideoVisible(false);
  }, []);

  // ── URL invalide ─────────────────────────────────────────────────────────
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

      {/* Container YouTube — toujours dans le DOM pour maintenir la lecture */}
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
                className="flex items-center justify-center font-black text-sm px-4 py-2 rounded-xl transition-all hover:opacity-90"
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

      {/* Toggle vidéo */}
      {status !== 'idle' && status !== 'error' && (
        <button onClick={() => setVideoVisible(v => !v)}
          className="self-start text-xs font-bold px-3 py-1 rounded-lg transition-all hover:opacity-80"
          style={{
            background: videoVisible ? 'rgba(255,0,170,0.1)' : 'rgba(255,255,255,0.06)',
            color: videoVisible ? '#FF00AA' : 'rgba(240,244,255,0.4)',
            border: `1px solid ${videoVisible ? 'rgba(255,0,170,0.3)' : 'rgba(255,255,255,0.1)'}`,
          }}>
          {videoVisible ? '🙈 Masquer la vidéo' : '👁 Afficher la vidéo'}
        </button>
      )}
    </div>
  );
}