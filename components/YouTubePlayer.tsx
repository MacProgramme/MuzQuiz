// components/YouTubePlayer.tsx
// Lecteur YouTube audio pour les blind tests.
// Utilise l'API IFrame YouTube officielle pour que playVideo()
// soit appelé dans le contexte du geste utilisateur (évite le blocage autoplay).
"use client";

import { useState, useEffect, useRef } from 'react';

// ── Helpers ───────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

// Charge le script de l'API IFrame YouTube une seule fois pour toute la page
let _ytApiResolvers: (() => void)[] = [];
let _ytApiReady = false;

function loadYTAPI(): Promise<void> {
  if (_ytApiReady) return Promise.resolve();
  return new Promise((resolve) => {
    _ytApiResolvers.push(resolve);
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) return;
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => {
      _ytApiReady = true;
      _ytApiResolvers.forEach(r => r());
      _ytApiResolvers = [];
    };
  });
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  url: string;
  onPlay?: () => void;
}

// ── Composant ─────────────────────────────────────────────────────────────────

export function YouTubePlayer({ url, onPlay }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'stopped'>('idle');
  const playerRef    = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const readyRef     = useRef(false);   // l'API est prête ET le player est créé
  const videoId = extractVideoId(url);

  // ── Initialisation du player à la question ────────────────────────────────
  useEffect(() => {
    if (!videoId) return;
    setStatus('idle');
    readyRef.current = false;

    let destroyed = false;

    // Crée un div enfant — YT le remplace par son iframe
    const slot = document.createElement('div');
    containerRef.current?.appendChild(slot);

    loadYTAPI().then(() => {
      if (destroyed || !slot.parentElement) return;

      playerRef.current = new window.YT.Player(slot, {
        videoId,
        width: 240,
        height: 135,
        playerVars: {
          autoplay: 0,
          controls: 0,
          rel: 0,
          playsinline: 1,
          modestbranding: 1,
          disablekb: 1,
        },
        events: {
          onReady: () => {
            if (!destroyed) readyRef.current = true;
          },
          onError: () => {
            // Vidéo indisponible ou embedding désactivé
            if (!destroyed) setStatus('idle');
          },
        },
      });
    });

    return () => {
      destroyed = true;
      readyRef.current = false;
      try { playerRef.current?.destroy?.(); } catch (_) {}
      playerRef.current = null;
      slot.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  // ── Contrôles ─────────────────────────────────────────────────────────────
  const handlePlay = () => {
    if (!readyRef.current || !playerRef.current) {
      // Player pas encore prêt : on charge l'API et on attend
      setStatus('loading');
      loadYTAPI().then(() => {
        // À ce stade readyRef devrait être true (onReady a été appelé)
        playerRef.current?.playVideo?.();
        setStatus('playing');
        onPlay?.();
      });
      return;
    }
    // Appel SYNCHRONE dans le handler du clic → navigateur autorise la lecture
    playerRef.current.playVideo();
    setStatus('playing');
    onPlay?.();
  };

  const handleStop = () => {
    playerRef.current?.pauseVideo?.();
    setStatus('stopped');
  };

  if (!videoId) return null;

  return (
    <div className="flex flex-col items-center gap-2 w-full">

      {/* Container YT — visuellement caché, toujours dans le DOM */}
      <div
        ref={containerRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          overflow: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
          // Doit rester dans le flux pour que le navigateur
          // n'optimise pas (ne pas utiliser display:none)
        }}
      />

      {/* Barre de contrôle visible */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl w-full"
        style={{
          background: status === 'playing'
            ? 'rgba(255,0,170,0.12)'
            : 'rgba(255,255,255,0.05)',
          border: `1.5px solid ${status === 'playing' ? 'rgba(255,0,170,0.4)' : 'rgba(255,255,255,0.1)'}`,
          transition: 'all 0.2s',
        }}
      >
        {/* Icône */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: status === 'playing' ? '#FF00AA' : 'rgba(255,255,255,0.08)' }}
        >
          {status === 'playing' ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <style>{`
                @keyframes yt-bar1 { 0%,100%{height:4px;y:7px} 50%{height:14px;y:2px} }
                @keyframes yt-bar2 { 0%,100%{height:10px;y:4px} 50%{height:4px;y:7px} }
                @keyframes yt-bar3 { 0%,100%{height:6px;y:6px} 50%{height:12px;y:3px} }
              `}</style>
              <rect x="1"  y="7" width="3" height="4"  rx="1.5" fill="white" style={{ animation: 'yt-bar1 0.8s ease-in-out infinite' }} />
              <rect x="7.5" y="4" width="3" height="10" rx="1.5" fill="white" style={{ animation: 'yt-bar2 0.8s ease-in-out infinite 0.2s' }} />
              <rect x="14" y="6" width="3" height="6"  rx="1.5" fill="white" style={{ animation: 'yt-bar3 0.8s ease-in-out infinite 0.4s' }} />
            </svg>
          ) : status === 'loading' ? (
            <div className="w-4 h-4 rounded-full border-2 animate-spin"
              style={{ borderColor: '#FF00AA', borderTopColor: 'transparent' }} />
          ) : (
            <span style={{ color: 'rgba(240,244,255,0.5)', fontSize: '1.1rem' }}>♪</span>
          )}
        </div>

        {/* Texte */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest"
            style={{ color: status === 'playing' ? 'rgba(255,0,170,0.8)' : 'rgba(240,244,255,0.4)' }}>
            {status === 'playing' ? 'En cours…' : status === 'loading' ? 'Chargement…' : 'Blind Test'}
          </p>
          <p className="text-sm font-bold truncate"
            style={{ color: status === 'playing' ? '#F0F4FF' : 'rgba(240,244,255,0.5)' }}>
            {status === 'playing' ? 'Identifie la musique !' : status === 'loading' ? 'Connexion à YouTube…' : 'Appuie pour écouter'}
          </p>
        </div>

        {/* Bouton Play / Stop */}
        {status !== 'playing' ? (
          <button
            onClick={handlePlay}
            disabled={status === 'loading'}
            className="flex items-center justify-center font-black text-sm px-4 py-2 rounded-xl flex-shrink-0 transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: '#FF00AA', color: 'white', minWidth: 72 }}
          >
            ▶ Play
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="flex items-center justify-center font-bold text-sm px-4 py-2 rounded-xl flex-shrink-0 transition-all hover:opacity-90"
            style={{ background: 'rgba(255,0,170,0.2)', color: '#FF00AA', border: '1px solid rgba(255,0,170,0.3)', minWidth: 72 }}
          >
            ⏹ Stop
          </button>
        )}
      </div>
    </div>
  );
}
