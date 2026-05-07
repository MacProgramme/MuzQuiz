// components/AudioPlayer.tsx
// Lecteur audio HTML5 pour les blind tests.
// Utilise un fichier hébergé sur Supabase Storage (MP3/OGG/WAV).
// Aucun problème d'autoplay : play() est appelé dans le gestionnaire du clic (geste utilisateur).
"use client";

import { useState, useRef, useEffect } from 'react';

interface Props {
  url: string;
  onPlay?: () => void;
}

export function AudioPlayer({ url, onPlay }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'stopped'>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Réinitialise le lecteur quand l'URL change (nouvelle question)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    setStatus('idle');
  }, [url]);

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const handlePlay = () => {
    if (!audioRef.current) {
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => setStatus('stopped');
      audio.onerror = () => setStatus('idle');
    }

    setStatus('loading');
    const audio = audioRef.current;
    audio.currentTime = 0;

    // Appel SYNCHRONE dans le handler du clic → navigateur autorise la lecture
    audio.play()
      .then(() => {
        setStatus('playing');
        onPlay?.();
      })
      .catch(() => {
        setStatus('idle');
      });
  };

  const handleStop = () => {
    audioRef.current?.pause();
    setStatus('stopped');
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">

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
        {/* Icône animée */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: status === 'playing' ? '#FF00AA' : 'rgba(255,255,255,0.08)' }}
        >
          {status === 'playing' ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <style>{`
                @keyframes ab1 { 0%,100%{height:4px;y:7px} 50%{height:14px;y:2px} }
                @keyframes ab2 { 0%,100%{height:10px;y:4px} 50%{height:4px;y:7px} }
                @keyframes ab3 { 0%,100%{height:6px;y:6px} 50%{height:12px;y:3px} }
              `}</style>
              <rect x="1"   y="7" width="3" height="4"  rx="1.5" fill="white"
                style={{ animation: 'ab1 0.8s ease-in-out infinite' }} />
              <rect x="7.5" y="4" width="3" height="10" rx="1.5" fill="white"
                style={{ animation: 'ab2 0.8s ease-in-out infinite 0.2s' }} />
              <rect x="14"  y="6" width="3" height="6"  rx="1.5" fill="white"
                style={{ animation: 'ab3 0.8s ease-in-out infinite 0.4s' }} />
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
            {status === 'playing'
              ? 'Identifie la musique !'
              : status === 'loading'
              ? 'Connexion au fichier audio…'
              : 'Appuie pour écouter'}
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
            style={{
              background: 'rgba(255,0,170,0.2)',
              color: '#FF00AA',
              border: '1px solid rgba(255,0,170,0.3)',
              minWidth: 72,
            }}
          >
            ⏹ Stop
          </button>
        )}
      </div>
    </div>
  );
}
