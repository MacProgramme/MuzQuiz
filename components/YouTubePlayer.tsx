// components/YouTubePlayer.tsx
// Lecteur YouTube audio-seulement pour les blind tests.
// L'iframe est rendue en 1×1px invisible — le son joue, la vidéo ne spoile pas.
"use client";

import { useState, useEffect, useRef } from 'react';

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

interface Props {
  url: string;
  /** Si true, montre un lecteur plein (pour l'hôte/écran public) */
  large?: boolean;
  /** Callback quand la lecture commence */
  onPlay?: () => void;
}

export function YouTubePlayer({ url, large = false, onPlay }: Props) {
  const [status, setStatus] = useState<'idle' | 'playing' | 'stopped'>('idle');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoId = extractVideoId(url);

  // Réinitialise quand l'URL change (question suivante)
  useEffect(() => {
    setStatus('idle');
  }, [url]);

  if (!videoId) return null;

  const embedSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&rel=0&modestbranding=1&enablejsapi=1`;

  const handlePlay = () => {
    setStatus('playing');
    onPlay?.();
  };

  const handleStop = () => {
    setStatus('stopped');
    // Envoie pause via postMessage à l'iframe YouTube
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: 'pauseVideo' }),
      '*'
    );
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {/* Iframe cachée – audio seulement, pas de spoil visuel */}
      {status === 'playing' && (
        <iframe
          ref={iframeRef}
          src={embedSrc}
          width="1"
          height="1"
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
          allow="autoplay; encrypted-media"
          title="YouTube audio player"
        />
      )}

      {/* Contrôles affichés */}
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
        {/* Icône musique animée */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: status === 'playing' ? '#FF00AA' : 'rgba(255,255,255,0.08)' }}
        >
          {status === 'playing' ? (
            // Barres animées
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <style>{`
                @keyframes yt-bar1 { 0%,100%{height:4px;y:7px} 50%{height:14px;y:2px} }
                @keyframes yt-bar2 { 0%,100%{height:10px;y:4px} 50%{height:4px;y:7px} }
                @keyframes yt-bar3 { 0%,100%{height:6px;y:6px} 50%{height:12px;y:3px} }
              `}</style>
              <rect x="1" y="7" width="3" height="4" rx="1.5" fill="white" style={{ animation: 'yt-bar1 0.8s ease-in-out infinite' }} />
              <rect x="7.5" y="4" width="3" height="10" rx="1.5" fill="white" style={{ animation: 'yt-bar2 0.8s ease-in-out infinite 0.2s' }} />
              <rect x="14" y="6" width="3" height="6" rx="1.5" fill="white" style={{ animation: 'yt-bar3 0.8s ease-in-out infinite 0.4s' }} />
            </svg>
          ) : (
            <span style={{ color: 'rgba(240,244,255,0.5)', fontSize: '1.1rem' }}>♪</span>
          )}
        </div>

        {/* Texte */}
        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: status === 'playing' ? 'rgba(255,0,170,0.8)' : 'rgba(240,244,255,0.4)' }}
          >
            {status === 'playing' ? 'En cours…' : 'Blind Test'}
          </p>
          <p
            className="text-sm font-bold truncate"
            style={{ color: status === 'playing' ? '#F0F4FF' : 'rgba(240,244,255,0.5)' }}
          >
            {status === 'playing' ? 'Identifie la musique !' : 'Appuie pour écouter'}
          </p>
        </div>

        {/* Bouton play / stop */}
        {status !== 'playing' ? (
          <button
            onClick={handlePlay}
            className="flex items-center justify-center font-black text-sm px-4 py-2 rounded-xl flex-shrink-0 transition-all hover:opacity-90"
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
