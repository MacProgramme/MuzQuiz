// app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { GameMode } from '@/types';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [nickname, setNickname] = useState('');
  const [code, setCode] = useState('');
  const [mode, setMode] = useState<GameMode>('buzz');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!(data.user && !data.user.is_anonymous));
    });
  }, []);

  const genCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  const createRoom = async () => {
    if (!nickname.trim()) { setErr('Entre ton pseudo !'); return; }
    setLoading(true);
    setErr('');

    const { data: { user } } = await supabase.auth.getUser();
    let userId = user?.id;
    if (!userId) {
      const { data } = await supabase.auth.signInAnonymously();
      userId = data.user?.id;
    }
    if (!userId) { setErr("Erreur d'authentification"); setLoading(false); return; }

    const roomCode = genCode();
    const { data: room, error } = await supabase
      .from('rooms')
      .insert({ code: roomCode, host_id: userId, mode, timer_duration: 20, max_players: 8, sound_enabled: true })
      .select('*')
      .single();

    if (error || !room) { setErr('Erreur lors de la création. Réessaie.'); setLoading(false); return; }

    await supabase.from('room_players').insert({
      room_id: room.id,
      user_id: userId,
      nickname: nickname.trim(),
      is_host: true,
    });

    setLoading(false);
    router.push(`/room/${roomCode}?nickname=${encodeURIComponent(nickname.trim())}`);
  };

  const joinRoom = async () => {
    if (!nickname.trim()) { setErr('Entre ton pseudo !'); return; }
    if (!code.trim()) { setErr('Entre le code de la salle !'); return; }
    router.push(`/room/${code.toUpperCase()}?nickname=${encodeURIComponent(nickname.trim())}`);
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 50%, #0D1B3E 100%)' }}>

      {/* Bouton Mon compte */}
      <div className="absolute top-5 right-5">
        <Link href={isLoggedIn ? '/profile' : '/login'}
          className="text-sm font-bold px-4 py-2 rounded-xl transition-all hover:opacity-90"
          style={{
            background: isLoggedIn ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.07)',
            color: isLoggedIn ? '#8B5CF6' : 'rgba(240,244,255,0.6)',
            border: `1px solid ${isLoggedIn ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.1)'}`,
          }}>
          {isLoggedIn ? '👤 Mon compte' : 'Connexion'}
        </Link>
      </div>

      {/* Logo + Moustache SVG */}
      <div className="flex flex-col items-center mb-2">
        <h1 className="muz-logo text-6xl font-black tracking-tight" style={{ fontFamily: 'var(--font-black-han)' }}>
          MUZQUIZ
        </h1>
        {/* Moustache SVG logo */}
        <svg
          viewBox="0 0 1280 640"
          className="muz-shake"
          style={{ width: '180px', marginTop: '4px', filter: 'drop-shadow(0 0 14px rgba(255,0,170,0.65))' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="muz-logo-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF00AA" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#00E5D1" />
            </linearGradient>
          </defs>
          <g transform="translate(0,640) scale(0.1,-0.1)" fill="url(#muz-logo-grad)" stroke="none">
            <path d="M5078 4980 c-350 -37 -700 -176 -1079 -431 -212 -142 -402 -292 -804 -634 -426 -362 -624 -510 -885 -657 -301 -171 -525 -263 -788 -325 -100 -23 -139 -27 -262 -27 -124 0 -154 3 -204 22 -89 33 -137 65 -199 132 -97 104 -150 250 -151 410 -1 116 23 178 91 241 79 72 155 100 443 162 132 28 199 56 246 104 63 63 41 97 -104 158 -158 66 -295 85 -442 61 -288 -47 -514 -194 -699 -452 -254 -356 -307 -752 -151 -1116 295 -687 1406 -1140 2966 -1209 818 -36 1849 104 2378 322 193 79 297 142 532 321 76 58 233 136 309 153 84 20 192 23 224 6 13 -7 62 -41 110 -76 806 -589 2529 -867 4021 -649 664 97 1218 291 1600 562 118 83 298 262 368 364 237 347 265 713 82 1078 -96 191 -259 388 -429 516 -97 74 -276 165 -366 188 -194 49 -363 16 -487 -94 -52 -46 -108 -124 -108 -152 0 -40 130 -81 426 -137 166 -31 240 -59 302 -115 100 -91 119 -254 46 -399 -30 -58 -144 -180 -241 -258 -208 -165 -447 -201 -728 -107 -97 32 -275 122 -376 190 -119 80 -514 380 -1009 767 -212 166 -456 352 -542 414 -513 365 -931 561 -1363 638 -112 20 -162 23 -360 23 -175 0 -253 -4 -325 -18 -230 -42 -451 -114 -659 -213 -152 -73 -166 -73 -301 0 -203 109 -468 198 -672 226 -114 16 -311 21 -410 11z"/>
          </g>
        </svg>
      </div>
      <p className="text-sm mb-10" style={{ color: 'rgba(240,244,255,0.4)' }}>
        Quiz & Blind Test en temps réel
      </p>

      {/* Card principale */}
      <div className="muz-card w-full max-w-md p-8">

        {/* Tabs */}
        <div className="flex mb-6 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {(['create', 'join'] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setErr(''); }}
              className="flex-1 py-3 text-sm font-bold transition-all"
              style={{
                background: tab === t ? '#FF00AA' : 'transparent',
                color: tab === t ? 'white' : 'rgba(240,244,255,0.5)',
                borderRadius: '0.6rem',
              }}>
              {t === 'create' ? '✚ Créer une salle' : '→ Rejoindre'}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {/* Input pseudo */}
          <input
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (tab === 'create' ? createRoom() : joinRoom())}
            placeholder="Ton pseudo"
            maxLength={16}
            className="w-full px-4 py-3 rounded-xl font-medium outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1.5px solid rgba(139,92,246,0.3)',
              color: '#F0F4FF',
            }}
            onFocus={e => e.target.style.borderColor = '#FF00AA'}
            onBlur={e => e.target.style.borderColor = 'rgba(139,92,246,0.3)'}
          />

          {/* Mode de jeu (créer) */}
          {tab === 'create' && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(240,244,255,0.4)' }}>
                Mode de jeu
              </p>
              <div className="flex gap-3">
                {[
                  { value: 'qcm' as GameMode, icon: '🎵', label: 'Quiz Blind Test', sub: '4 choix simultané' },
                  { value: 'buzz' as GameMode, icon: '🔔', label: 'Buzz Quiz', sub: 'Buzz puis 4 choix' },
                ].map(m => (
                  <button key={m.value} onClick={() => setMode(m.value)}
                    className="flex-1 flex flex-col items-center gap-1 py-4 rounded-xl transition-all"
                    style={{
                      border: mode === m.value ? '2px solid #FF00AA' : '2px solid rgba(139,92,246,0.2)',
                      background: mode === m.value ? 'rgba(255,0,170,0.1)' : 'rgba(255,255,255,0.04)',
                    }}>
                    <span className="text-2xl">{m.icon}</span>
                    <span className="font-black text-sm" style={{ color: mode === m.value ? '#FF00AA' : '#F0F4FF' }}>
                      {m.label}
                    </span>
                    <span className="text-xs" style={{ color: 'rgba(240,244,255,0.35)' }}>{m.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input code (rejoindre) */}
          {tab === 'join' && (
            <input
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && joinRoom()}
              placeholder="CODE DE LA SALLE"
              maxLength={8}
              className="w-full px-4 py-3 rounded-xl font-mono text-lg font-black tracking-widest uppercase outline-none transition-all text-center"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1.5px solid rgba(0,229,209,0.3)',
                color: '#00E5D1',
                letterSpacing: '0.2em',
              }}
              onFocus={e => e.target.style.borderColor = '#00E5D1'}
              onBlur={e => e.target.style.borderColor = 'rgba(0,229,209,0.3)'}
            />
          )}

          {err && (
            <p className="text-center text-sm font-bold" style={{ color: '#FF00AA' }}>{err}</p>
          )}

          {/* Bouton principal */}
          <button
            onClick={tab === 'create' ? createRoom : joinRoom}
            disabled={loading}
            className={`muz-btn-${tab === 'create' ? 'pink' : 'cyan'} py-4 rounded-xl text-lg font-black tracking-wide disabled:opacity-50`}
          >
            {loading ? '...' : tab === 'create' ? 'Créer la salle →' : 'Rejoindre →'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <Link href="/pricing"
        className="mt-6 text-sm font-bold transition-all hover:opacity-100"
        style={{ color: 'rgba(139,92,246,0.7)' }}>
        Voir les abonnements →
      </Link>
      <p className="text-xs mt-2" style={{ color: 'rgba(240,244,255,0.25)' }}>
        Gratuit • Jouez maintenant avec vos amis
      </p>
    </main>
  );
}
