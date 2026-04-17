// components/InterLeaderboard.tsx
"use client";

import { useEffect, useState } from 'react';
import { Player } from '@/types';

interface RankedPlayer extends Player {
  rank: number;
  prevRank: number;
  delta: number; // score delta vs previous snapshot
}

interface Props {
  players: Player[];
  correctPlayerIds: string[];
  visible: boolean;
}

function RankArrow({ diff }: { diff: number }) {
  if (diff < 0) {
    // Monté dans le classement (rang diminué = meilleur)
    return <span style={{ color: '#00E5D1', fontSize: '1rem', fontWeight: 900 }}>▲</span>;
  }
  if (diff > 0) {
    // Descendu
    return <span style={{ color: '#FF00AA', fontSize: '1rem', fontWeight: 900 }}>▼</span>;
  }
  return <span style={{ color: 'rgba(240,244,255,0.3)', fontSize: '0.85rem' }}>—</span>;
}

const COUNTDOWN_DURATION = 10;

export function InterLeaderboard({ players, correctPlayerIds, visible }: Props) {
  const [ranked, setRanked] = useState<RankedPlayer[]>([]);
  const [count, setCount] = useState(COUNTDOWN_DURATION);

  // Countdown 10 → 0 quand visible
  useEffect(() => {
    if (!visible) { setCount(COUNTDOWN_DURATION); return; }
    setCount(COUNTDOWN_DURATION);
    const interval = setInterval(() => {
      setCount(c => {
        if (c <= 1) { clearInterval(interval); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    // Trier par score actuel (le plus élevé en premier)
    const sorted = [...players].sort((a, b) => b.score - a.score);

    // Calculer les rangs précédents (avant le +100 de cette question)
    const prevScores = players.map(p => ({
      ...p,
      prevScore: correctPlayerIds.includes(p.id) ? p.score - 100 : p.score,
    }));
    const prevSorted = [...prevScores].sort((a, b) => b.prevScore - a.prevScore);

    const result: RankedPlayer[] = sorted.map((p, idx) => {
      const rank = idx + 1;
      const prevIdx = prevSorted.findIndex(pp => pp.id === p.id);
      const prevRank = prevIdx + 1;
      const delta = correctPlayerIds.includes(p.id) ? 100 : 0;
      return { ...p, rank, prevRank, delta };
    });

    setRanked(result);
  }, [visible, players, correctPlayerIds]);

  if (!visible) return null;

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6"
      style={{ background: 'rgba(13,27,62,0.97)', backdropFilter: 'blur(8px)' }}
    >
      {/* Titre */}
      <div className="mb-6 text-center">
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(240,244,255,0.4)' }}>
          Classement
        </p>
        <h2 className="text-3xl font-black" style={{ color: '#F0F4FF' }}>
          En ce moment…
        </h2>
      </div>

      {/* Liste des joueurs */}
      <div className="w-full max-w-sm flex flex-col gap-2">
        {ranked.map((p, i) => {
          const rankDiff = p.prevRank - p.rank; // positif = monté
          const delay = `${i * 80}ms`;

          return (
            <div
              key={p.id}
              className="muz-slide-in flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{
                animationDelay: delay,
                background: p.rank <= 3
                  ? 'rgba(139,92,246,0.12)'
                  : 'rgba(255,255,255,0.04)',
                border: p.rank === 1
                  ? '1.5px solid rgba(245,158,11,0.5)'
                  : p.rank === 2
                  ? '1.5px solid rgba(156,163,175,0.4)'
                  : p.rank === 3
                  ? '1.5px solid rgba(180,83,9,0.4)'
                  : '1.5px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Rang */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                style={{
                  background: p.rank === 1 ? '#F59E0B'
                    : p.rank === 2 ? '#9CA3AF'
                    : p.rank === 3 ? '#B45309'
                    : 'rgba(255,255,255,0.08)',
                  color: p.rank <= 3 ? '#0D1B3E' : '#F0F4FF',
                  fontSize: p.rank <= 3 ? '1.1rem' : '0.8rem',
                }}
              >
                {p.rank <= 3 ? medals[p.rank - 1] : `#${p.rank}`}
              </div>

              {/* Pseudo */}
              <span className="flex-1 font-bold text-sm truncate" style={{ color: '#F0F4FF' }}>
                {p.nickname}
              </span>

              {/* Delta score */}
              {p.delta > 0 && (
                <span
                  className="text-xs font-black px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: 'rgba(0,229,209,0.15)', color: '#00E5D1', border: '1px solid rgba(0,229,209,0.3)' }}
                >
                  +{p.delta}
                </span>
              )}

              {/* Score total */}
              <span className="font-black text-base flex-shrink-0" style={{ color: '#8B5CF6', minWidth: '3.5rem', textAlign: 'right' }}>
                {p.score}
              </span>

              {/* Flèche direction */}
              <div className="w-5 flex-shrink-0 flex items-center justify-center">
                <RankArrow diff={-rankDiff} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Countdown vers la prochaine question */}
      <div className="mt-6 flex flex-col items-center gap-2">
        {/* Barre de progression */}
        <div className="w-48 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(139,92,246,0.15)' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${(count / COUNTDOWN_DURATION) * 100}%`,
              background: count <= 3 ? '#FF00AA' : count <= 6 ? '#F59E0B' : '#8B5CF6',
              transition: 'width 0.95s linear, background 0.3s ease',
            }}
          />
        </div>
        <p className="text-xs font-bold" style={{ color: 'rgba(139,92,246,0.6)' }}>
          Prochaine question dans{' '}
          <span style={{
            color: count <= 3 ? '#FF00AA' : count <= 6 ? '#F59E0B' : '#8B5CF6',
            fontWeight: 900,
            fontSize: '1rem',
          }}>
            {count}s
          </span>
        </p>
      </div>
    </div>
  );
}
