// components/InterLeaderboard.tsx
"use client";

import { useEffect, useState } from 'react';
import { Player } from '@/types';
import { MustacheMedal } from '@/components/MustacheMedal';

interface RankedPlayer extends Player {
  rank: number;
  prevRank: number;
  delta: number;
}

interface Props {
  players: Player[];
  correctPlayerIds: string[];
  visible: boolean;
  pointsEarned?: Record<string, number>;
  /** ID du joueur local — filtre l'affichage : top 3 + mon rang seulement */
  myPlayerId?: string;
}

function RankArrow({ diff }: { diff: number }) {
  if (diff > 0) return <span style={{ color: '#00E5D1', fontSize: '1rem', fontWeight: 900 }}>▲</span>;
  if (diff < 0) return <span style={{ color: '#FF00AA', fontSize: '1rem', fontWeight: 900 }}>▼</span>;
  return <span style={{ color: 'rgba(240,244,255,0.3)', fontSize: '0.85rem' }}>—</span>;
}

// ── PlayerRow défini HORS du composant parent pour éviter le remount à chaque re-render ──
// (si défini à l'intérieur, React le considère comme un nouveau type à chaque tick de la seconde
//  → unmount/remount → l'animation CSS rejoue → clignotement)
interface PlayerRowProps {
  p: RankedPlayer;
  myPlayerId?: string;
  top3Length: number;
  stepMs: number;
}

function PlayerRow({ p, myPlayerId, top3Length, stepMs }: PlayerRowProps) {
  const isMe    = p.id === myPlayerId;
  const isFirst = p.rank === 1;
  const delayMs = (top3Length - p.rank) * stepMs; // rang 3 = 0ms, rang 1 = 2×step

  return (
    <div className="muz-lb-item" style={{ animationDelay: `${Math.max(0, delayMs)}ms` }}>
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl"
        style={{
          background: isMe
            ? 'rgba(139,92,246,0.18)'
            : isFirst
            ? 'rgba(245,158,11,0.15)'
            : p.rank === 2 ? 'rgba(156,163,175,0.08)'
            : p.rank === 3 ? 'rgba(180,83,9,0.08)'
            : 'rgba(255,255,255,0.04)',
          border: isMe
            ? '1.5px solid rgba(139,92,246,0.6)'
            : isFirst
            ? '1.5px solid rgba(245,158,11,0.6)'
            : p.rank === 2 ? '1.5px solid rgba(156,163,175,0.3)'
            : p.rank === 3 ? '1.5px solid rgba(180,83,9,0.3)'
            : '1.5px solid rgba(255,255,255,0.06)',
          boxShadow: isFirst ? '0 0 20px rgba(245,158,11,0.15)' : 'none',
        }}
      >
        {/* Rang */}
        {p.rank <= 3 ? (
          <div className="flex items-center justify-center flex-shrink-0" style={{ width: 40 }}>
            <MustacheMedal rank={p.rank as 1|2|3} width={40} />
          </div>
        ) : (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-black flex-shrink-0"
            style={{ background: isMe ? '#8B5CF6' : 'rgba(255,255,255,0.08)', color: '#F0F4FF', fontSize: '0.8rem' }}
          >
            #{p.rank}
          </div>
        )}

        {/* Pseudo */}
        <span className="flex-1 font-bold text-sm truncate"
          style={{ color: isMe ? '#8B5CF6' : '#F0F4FF', fontWeight: isFirst || isMe ? 900 : 700 }}>
          {p.nickname}{isMe && <span className="text-xs opacity-60 ml-1">(toi)</span>}
        </span>

        {/* +pts */}
        {p.delta > 0 && (
          <span className="text-xs font-black px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ background: 'rgba(0,229,209,0.15)', color: '#00E5D1', border: '1px solid rgba(0,229,209,0.3)' }}>
            +{p.delta}
          </span>
        )}

        {/* Score */}
        <span className="font-black text-base flex-shrink-0"
          style={{ color: isMe ? '#8B5CF6' : '#F0F4FF', minWidth: '3.5rem', textAlign: 'right' }}>
          {p.score}
        </span>

        {/* Flèche */}
        <div className="w-5 flex-shrink-0 flex items-center justify-center">
          <RankArrow diff={p.prevRank - p.rank} />
        </div>
      </div>
    </div>
  );
}

const COUNTDOWN_DURATION = 5;

export function InterLeaderboard({ players, correctPlayerIds, visible, pointsEarned = {}, myPlayerId }: Props) {
  const [ranked, setRanked] = useState<RankedPlayer[]>([]);
  const [count, setCount] = useState(COUNTDOWN_DURATION);

  useEffect(() => {
    if (!visible) return;
    const sorted = [...players].sort((a, b) => b.score - a.score);
    const prevScores = players.map(p => {
      const earned = correctPlayerIds.includes(p.id) ? (pointsEarned[p.id] ?? 0) : 0;
      return { ...p, prevScore: p.score - earned };
    });
    const prevSorted = [...prevScores].sort((a, b) => b.prevScore - a.prevScore);
    const result: RankedPlayer[] = sorted.map((p, idx) => ({
      ...p,
      rank: idx + 1,
      prevRank: prevSorted.findIndex(pp => pp.id === p.id) + 1,
      delta: correctPlayerIds.includes(p.id) ? (pointsEarned[p.id] ?? 0) : 0,
    }));
    setRanked(result);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, players, JSON.stringify(pointsEarned), JSON.stringify(correctPlayerIds)]);

  useEffect(() => {
    if (!visible) { setCount(COUNTDOWN_DURATION); return; }
    setCount(COUNTDOWN_DURATION);
    const interval = setInterval(() => {
      setCount(c => { if (c <= 1) { clearInterval(interval); return 0; } return c - 1; });
    }, 1000);
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible || ranked.length === 0) return null;

  // ── Filtrage : top 3 + mon rang si je suis 4e ou plus ──────────────────────
  const top3 = ranked.filter(p => p.rank <= 3);
  const me   = myPlayerId ? ranked.find(p => p.id === myPlayerId) : null;
  const meOutsideTop3 = me && me.rank > 3;

  const stepMs = Math.min(400, Math.floor(2800 / Math.max(top3.length, 1)));

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6"
      style={{ background: 'rgba(13,27,62,0.97)', backdropFilter: 'blur(10px)' }}
    >
      {/* Titre */}
      <div className="mb-6 text-center">
        <p className="text-xs font-bold uppercase tracking-widest mb-1"
          style={{ color: 'rgba(240,244,255,0.4)' }}>Classement</p>
        <h2 className="text-3xl font-black" style={{ color: '#F0F4FF', fontFamily: 'var(--font-black-han)' }}>
          Top 3
        </h2>
      </div>

      {/* Top 3 */}
      <div className="w-full max-w-sm flex flex-col gap-2">
        {top3.map(p => (
          <PlayerRow key={p.id} p={p} myPlayerId={myPlayerId} top3Length={top3.length} stepMs={stepMs} />
        ))}

        {/* Mon rang si je suis hors top 3 */}
        {meOutsideTop3 && me && (
          <>
            <div className="text-center text-xs py-1" style={{ color: 'rgba(240,244,255,0.25)' }}>• • •</div>
            <PlayerRow p={me} myPlayerId={myPlayerId} top3Length={top3.length} stepMs={stepMs} />
          </>
        )}
      </div>

      {/* Countdown */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="w-48 h-1.5 rounded-full overflow-hidden"
          style={{ background: 'rgba(139,92,246,0.15)' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${(count / COUNTDOWN_DURATION) * 100}%`,
              background: count <= 2 ? '#FF00AA' : count <= 3 ? '#F59E0B' : '#8B5CF6',
              transition: 'width 0.95s linear, background 0.3s ease',
            }}
          />
        </div>
        <p className="text-xs font-bold" style={{ color: 'rgba(139,92,246,0.6)' }}>
          Prochaine question dans{' '}
          <span style={{
            color: count <= 2 ? '#FF00AA' : count <= 3 ? '#F59E0B' : '#8B5CF6',
            fontWeight: 900, fontSize: '1rem',
          }}>
            {count}s
          </span>
        </p>
      </div>
    </div>
  );
}
