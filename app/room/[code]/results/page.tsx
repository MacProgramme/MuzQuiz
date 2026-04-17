// app/room/[code]/results/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Player } from '@/types';
import Link from 'next/link';

const MEDALS = ['🥇', '🥈', '🥉'];
const MEDAL_COLORS = ['#F59E0B', '#9CA3AF', '#CD7C3A'];

export default function ResultsPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      const { data: room } = await supabase
        .from('rooms')
        .select('id')
        .eq('code', code.toUpperCase())
        .single();

      if (!room) { setLoading(false); return; }

      const { data } = await supabase
        .from('room_players')
        .select('*')
        .eq('room_id', room.id)
        .order('score', { ascending: false });

      if (data) setPlayers(data);
      setLoading(false);
    };

    fetchResults();
  }, [code]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: '#0D1B3E' }}>
        <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: '#FF00AA', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const winner = players[0];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>

      {/* Logo */}
      <h1 className="muz-logo text-4xl font-black mb-6" style={{ fontFamily: 'var(--font-black-han)' }}>
        MUZQUIZ
      </h1>

      {/* Vainqueur */}
      {winner && (
        <div className="text-center mb-8 muz-pop">
          <div className="text-7xl mb-3" style={{ filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.6))' }}>
            🏆
          </div>
          <div className="text-3xl font-black mb-1" style={{ color: '#F0F4FF' }}>
            {winner.nickname}
          </div>
          <div className="font-bold text-lg" style={{ color: '#FF00AA' }}>
            {winner.score} points
          </div>
          <div className="text-sm mt-1" style={{ color: 'rgba(240,244,255,0.4)' }}>Vainqueur !</div>
        </div>
      )}

      {/* Classement */}
      <div className="muz-card w-full max-w-md p-5 mb-8">
        <h2 className="text-xs font-black uppercase tracking-widest mb-5"
          style={{ color: 'rgba(240,244,255,0.35)' }}>
          Classement final
        </h2>
        <div className="flex flex-col gap-2">
          {players.map((p, i) => (
            <div key={p.id}
              className="flex items-center justify-between py-3 px-4 rounded-xl"
              style={{
                background: i === 0 ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.03)',
                border: i === 0 ? '1px solid rgba(245,158,11,0.25)' : '1px solid rgba(255,255,255,0.06)',
              }}>
              <div className="flex items-center gap-3">
                <span className="text-xl w-8 text-center" style={{ color: MEDAL_COLORS[i] ?? 'rgba(240,244,255,0.5)' }}>
                  {MEDALS[i] ?? `${i + 1}.`}
                </span>
                <div>
                  <span className="font-bold" style={{ color: i === 0 ? '#F59E0B' : '#F0F4FF' }}>
                    {p.nickname}
                  </span>
                  {p.is_host && (
                    <span className="ml-2 text-xs" style={{ color: '#8B5CF6' }}>(hôte)</span>
                  )}
                </div>
              </div>
              <span className="font-black text-lg" style={{ color: i === 0 ? '#F59E0B' : 'rgba(240,244,255,0.7)' }}>
                {p.score} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Boutons */}
      <div className="flex flex-col items-center gap-3 w-full max-w-md">
        <button
          onClick={() => router.push('/')}
          className="muz-btn-pink w-full py-4 rounded-xl text-lg font-black">
          Nouvelle partie →
        </button>
        <Link href="/"
          className="text-sm" style={{ color: 'rgba(240,244,255,0.35)' }}>
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
