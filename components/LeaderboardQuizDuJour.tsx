// components/LeaderboardQuizDuJour.tsx
"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MustacheMedal } from '@/components/MustacheMedal';
import { MuzquizLogo } from '@/components/MuzquizLogo';

// ─── Types ────────────────────────────────────────────────────────────────────
interface DailyEntry {
  user_id: string;
  nickname: string;
  avatar_color: string;
  score: number;
  rank: number;
}

interface MonthlyEntry {
  user_id: string;
  nickname: string;
  avatar_color: string;
  total_score: number;
  rank: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function todayStr(): string {
  const now = new Date();
  const paris = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
  return `${paris.getFullYear()}-${String(paris.getMonth() + 1).padStart(2, '0')}-${String(paris.getDate()).padStart(2, '0')}`;
}

function currentMonthStr(): string {
  const now = new Date();
  const paris = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
  return `${paris.getFullYear()}-${String(paris.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(ym: string): string {
  const [y, mo] = ym.split('-');
  return new Date(Number(y), Number(mo) - 1, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}

// ─── Row commun ───────────────────────────────────────────────────────────────
function Row({
  rank,
  userId,
  nickname,
  avatarColor,
  scoreLabel,
  isMe,
}: {
  rank: number;
  userId: string;
  nickname: string;
  avatarColor: string;
  scoreLabel: string;
  isMe: boolean;
}) {
  const isFirst = rank === 1;
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl"
      style={{
        background: isMe
          ? 'rgba(139,92,246,0.15)'
          : isFirst
          ? 'rgba(245,158,11,0.1)'
          : 'rgba(255,255,255,0.04)',
        border: isMe
          ? '1.5px solid rgba(139,92,246,0.5)'
          : isFirst
          ? '1.5px solid rgba(245,158,11,0.4)'
          : '1.5px solid rgba(255,255,255,0.06)',
        boxShadow: isFirst ? '0 0 16px rgba(245,158,11,0.1)' : 'none',
      }}
    >
      {/* Médaille ou numéro */}
      {rank <= 3 ? (
        <div className="flex items-center justify-center flex-shrink-0" style={{ width: 38 }}>
          <MustacheMedal rank={rank as 1 | 2 | 3} width={38} />
        </div>
      ) : (
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-black flex-shrink-0"
          style={{
            background: isMe ? '#8B5CF6' : 'rgba(255,255,255,0.08)',
            color: '#F0F4FF',
            fontSize: '0.75rem',
          }}
        >
          #{rank}
        </div>
      )}

      {/* Avatar initiale */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
        style={{ background: avatarColor ?? '#8B5CF6', color: '#0D1B3E' }}
      >
        {nickname[0]?.toUpperCase()}
      </div>

      {/* Pseudo */}
      <span className="flex-1 font-bold text-sm truncate" style={{ color: isMe ? '#8B5CF6' : '#F0F4FF' }}>
        {nickname} {isMe && <span className="text-xs opacity-60">(toi)</span>}
      </span>

      {/* Score */}
      <span
        className="font-black text-base flex-shrink-0"
        style={{ color: isFirst ? '#F59E0B' : isMe ? '#8B5CF6' : '#F0F4FF' }}
      >
        {scoreLabel}
      </span>
    </div>
  );
}

// ─── Onglet Aujourd'hui ───────────────────────────────────────────────────────
function DailyTab({ userId }: { userId: string }) {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [myEntry, setMyEntry] = useState<DailyEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await (supabase as any).rpc('get_daily_leaderboard', {
        target_date: todayStr(),
      });
      if (data) {
        const all: DailyEntry[] = data;
        setEntries(all.slice(0, 10));
        const me = all.find((e) => e.user_id === userId);
        if (me && Number(me.rank) > 10) setMyEntry(me);
      }
      setLoading(false);
    };
    load();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: '#8B5CF6', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>
          Personne n'a encore joué aujourd'hui — sois le premier ! 🚀
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map((e) => (
        <Row
          key={e.user_id}
          rank={Number(e.rank)}
          userId={e.user_id}
          nickname={e.nickname}
          avatarColor={e.avatar_color}
          scoreLabel={`${e.score} pts`}
          isMe={e.user_id === userId}
        />
      ))}

      {myEntry && (
        <>
          <div className="text-center text-xs py-1" style={{ color: 'rgba(240,244,255,0.3)' }}>• • •</div>
          <Row
            rank={Number(myEntry.rank)}
            userId={myEntry.user_id}
            nickname={myEntry.nickname}
            avatarColor={myEntry.avatar_color}
            scoreLabel={`${myEntry.score} pts`}
            isMe={true}
          />
        </>
      )}
    </div>
  );
}

// ─── Onglet Ce mois ───────────────────────────────────────────────────────────
function MonthlyTab({ userId }: { userId: string }) {
  const [entries, setEntries] = useState<MonthlyEntry[]>([]);
  const [myEntry, setMyEntry] = useState<MonthlyEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const month = currentMonthStr();

  useEffect(() => {
    const load = async () => {
      const { data } = await (supabase as any).rpc('get_monthly_leaderboard', {
        target_month: month,
      });
      if (data) {
        const all: MonthlyEntry[] = data;
        setEntries(all.slice(0, 10));
        const me = all.find((e) => e.user_id === userId);
        if (me && Number(me.rank) > 10) setMyEntry(me);
      }
      setLoading(false);
    };
    load();
  }, [userId, month]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: '#8B5CF6', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>
          Aucun score ce mois-ci — sois le premier ! 🚀
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map((e) => (
        <Row
          key={e.user_id}
          rank={Number(e.rank)}
          userId={e.user_id}
          nickname={e.nickname}
          avatarColor={e.avatar_color}
          scoreLabel={`${Number(e.total_score)} pts`}
          isMe={e.user_id === userId}
        />
      ))}

      {myEntry && (
        <>
          <div className="text-center text-xs py-1" style={{ color: 'rgba(240,244,255,0.3)' }}>• • •</div>
          <Row
            rank={Number(myEntry.rank)}
            userId={myEntry.user_id}
            nickname={myEntry.nickname}
            avatarColor={myEntry.avatar_color}
            scoreLabel={`${Number(myEntry.total_score)} pts`}
            isMe={true}
          />
        </>
      )}
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
export function LeaderboardQuizDuJour({ userId }: { userId: string }) {
  const [tab, setTab] = useState<'day' | 'month'>('day');
  const month = currentMonthStr();

  return (
    <div
      className="muz-card p-5"
      style={{ border: '1.5px solid rgba(0,229,209,0.2)', background: 'rgba(0,229,209,0.03)' }}
    >
      {/* Titre */}
      <div className="flex items-center gap-2 mb-4">
        <MuzquizLogo width={32} showText={false} color="#00E5D1" />
        <h2 className="font-black text-base" style={{ color: '#00E5D1' }}>
          Classement Quiz du Jour
        </h2>
      </div>

      {/* Onglets */}
      <div
        className="flex rounded-xl p-1 mb-4 gap-1"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      >
        <button
          onClick={() => setTab('day')}
          className="flex-1 py-2 rounded-lg font-black text-sm transition-all"
          style={{
            background: tab === 'day' ? '#00E5D1' : 'transparent',
            color: tab === 'day' ? '#0D1B3E' : 'rgba(240,244,255,0.5)',
          }}
        >
          Aujourd'hui
        </button>
        <button
          onClick={() => setTab('month')}
          className="flex-1 py-2 rounded-lg font-black text-sm transition-all capitalize"
          style={{
            background: tab === 'month' ? '#00E5D1' : 'transparent',
            color: tab === 'month' ? '#0D1B3E' : 'rgba(240,244,255,0.5)',
          }}
        >
          {monthLabel(month)}
        </button>
      </div>

      {/* Contenu */}
      {tab === 'day' ? <DailyTab userId={userId} /> : <MonthlyTab userId={userId} />}
    </div>
  );
}
