// app/room/[code]/results/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Player } from '@/types';

const PODIUM_HEIGHTS = [160, 210, 120]; // 2nd, 1st, 3rd (px)
const PODIUM_ORDER = [1, 0, 2]; // indices dans le tableau players pour l'ordre visuel: gauche=2e, centre=1er, droite=3e
const PODIUM_COLORS = [
  { bg: '#9CA3AF', text: '#1a1a2e', label: '#6B7280', border: 'rgba(156,163,175,0.4)' }, // 2e — argent
  { bg: '#F59E0B', text: '#1a1a2e', label: '#B45309', border: 'rgba(245,158,11,0.5)' }, // 1er — or
  { bg: '#CD7C3A', text: '#1a1a2e', label: '#92400E', border: 'rgba(180,83,9,0.4)' }, // 3e — bronze
];
const CROWNS = ['👑', '🥇', '🥈', '🥉'];
const MEDALS_LIST = ['🥇', '🥈', '🥉'];

export default function ResultsPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);

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

  // Déclenche l'animation d'apparition après le chargement
  useEffect(() => {
    if (!loading && players.length > 0) {
      const t = setTimeout(() => setRevealed(true), 200);
      return () => clearTimeout(t);
    }
  }, [loading, players]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: '#0D1B3E' }}>
        <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: '#FF00AA', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const top3 = players.slice(0, 3);
  const rest = players.slice(3);

  return (
    <div className="min-h-screen flex flex-col items-center p-6 pb-12"
      style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 60%, #0D1B3E 100%)' }}>

      {/* Logo */}
      <div className="mt-6 mb-4 text-center">
        <h1 className="muz-logo text-4xl font-black" style={{ fontFamily: 'var(--font-black-han)' }}>
          MUZQUIZ
        </h1>
        <p className="text-sm font-bold mt-1" style={{ color: 'rgba(240,244,255,0.4)' }}>
          Résultats finaux
        </p>
      </div>

      {/* ===== PODIUM ===== */}
      <div className="flex items-end justify-center gap-3 mt-8 mb-2 w-full max-w-sm">
        {PODIUM_ORDER.map((playerIdx, visualIdx) => {
          const player = top3[playerIdx];
          if (!player) return (
            <div key={`empty-${visualIdx}`} style={{ width: 88 }} />
          );

          const height = PODIUM_HEIGHTS[visualIdx];
          const colors = PODIUM_COLORS[visualIdx];
          const rank = playerIdx + 1;
          const delay = `${visualIdx * 150}ms`;

          return (
            <div key={player.id} className="flex flex-col items-center" style={{ width: 96 }}>
              {/* Couronne / médaille flottante */}
              {revealed && (
                <div
                  className="muz-crown text-3xl mb-2"
                  style={{ animationDelay: `${parseInt(delay) + 300}ms` }}
                >
                  {rank === 1 ? '👑' : MEDALS_LIST[rank - 1]}
                </div>
              )}

              {/* Pseudo */}
              <div
                className="text-center mb-2 px-1"
                style={{
                  opacity: revealed ? 1 : 0,
                  transition: `opacity 0.5s ease ${delay}`,
                }}
              >
                <p className="font-black text-xs leading-tight truncate w-full text-center"
                  style={{ color: rank === 1 ? '#F59E0B' : '#F0F4FF' }}>
                  {player.nickname}
                </p>
                <p className="font-bold text-xs mt-0.5"
                  style={{ color: rank === 1 ? '#F59E0B' : 'rgba(240,244,255,0.5)' }}>
                  {player.score} pts
                </p>
              </div>

              {/* Colonne du podium */}
              <div
                className="muz-podium-rise w-full rounded-t-xl flex items-start justify-center pt-3"
                style={{
                  height: revealed ? height : 0,
                  background: `linear-gradient(180deg, ${colors.bg}cc 0%, ${colors.bg}88 100%)`,
                  border: `2px solid ${colors.border}`,
                  borderBottom: 'none',
                  animationDelay: delay,
                  boxShadow: rank === 1 ? '0 0 30px rgba(245,158,11,0.3)' : 'none',
                }}
              >
                <span className="font-black text-2xl" style={{ color: colors.text, opacity: 0.9 }}>
                  {rank}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ligne de sol */}
      <div className="w-full max-w-sm h-1 rounded-full mb-8"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)' }} />

      {/* ===== Autres joueurs (4e et au-delà) ===== */}
      {rest.length > 0 && (
        <div className="w-full max-w-sm mb-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-center"
            style={{ color: 'rgba(240,244,255,0.3)' }}>
            Autres joueurs
          </p>
          <div className="flex flex-col gap-2">
            {rest.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  opacity: revealed ? 1 : 0,
                  transition: `opacity 0.4s ease ${(i + 3) * 100 + 400}ms`,
                }}
              >
                <span className="font-black text-sm w-8 text-center" style={{ color: 'rgba(240,244,255,0.35)' }}>
                  #{i + 4}
                </span>
                <span className="flex-1 font-bold text-sm" style={{ color: '#F0F4FF' }}>
                  {p.nickname}
                </span>
                <span className="font-black text-base" style={{ color: '#8B5CF6' }}>
                  {p.score} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== Boutons ===== */}
      <div className="flex flex-col items-center gap-3 w-full max-w-sm">
        <button
          onClick={() => router.push('/')}
          className="muz-btn-pink w-full py-4 rounded-xl text-lg font-black">
          Nouvelle partie →
        </button>
        <button
          onClick={() => router.push('/')}
          className="text-sm font-bold transition-all hover:opacity-100"
          style={{ color: 'rgba(240,244,255,0.35)' }}>
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
