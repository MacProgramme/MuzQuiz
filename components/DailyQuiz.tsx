// components/DailyQuiz.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { MuzquizLogo } from '@/components/MuzquizLogo';
import { MustacheMedal } from '@/components/MustacheMedal';

// ─── Constantes ───────────────────────────────────────────────────────────────
const TIMER_DURATION = 20; // secondes par question
const FEEDBACK_DELAY = 2200; // ms d'affichage avant de passer à la question suivante
const LABELS       = ['A', 'B', 'C', 'D'];
const CHOICE_COLORS = ['#8B5CF6', '#FF00AA', '#00E5D1', '#F59E0B'];

// ─── Countdown vers une date cible ────────────────────────────────────────────
function useCountdownToDateParis(targetDate: string | null) {
  const getMsLeft = () => {
    if (!targetDate) return 0;
    const now = new Date();
    const nowParis = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
    const [y, mo, d] = targetDate.split('-').map(Number);
    const targetMidnight = new Date(nowParis);
    targetMidnight.setFullYear(y, mo - 1, d);
    targetMidnight.setHours(0, 0, 0, 0);
    return Math.max(0, targetMidnight.getTime() - nowParis.getTime());
  };
  const [msLeft, setMsLeft] = useState(getMsLeft);
  useEffect(() => {
    setMsLeft(getMsLeft());
    const t = setInterval(() => setMsLeft(getMsLeft()), 1000);
    return () => clearInterval(t);
  }, [targetDate]);
  const days = Math.floor(msLeft / 86_400_000);
  const h    = Math.floor((msLeft % 86_400_000) / 3_600_000);
  const m    = Math.floor((msLeft % 3_600_000)  / 60_000);
  const s    = Math.floor((msLeft % 60_000)     / 1000);
  return { days, h, m, s };
}

function NextQuizCountdown({ targetDate }: { targetDate: string | null }) {
  const { days, h, m, s } = useCountdownToDateParis(targetDate);
  const pad = (n: number) => String(n).padStart(2, '0');
  const units = days > 0
    ? [{ val: days, label: 'j' }, { val: h, label: 'h' }, { val: m, label: 'min' }]
    : [{ val: h, label: 'h' }, { val: m, label: 'min' }, { val: s, label: 's' }];
  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <MuzquizLogo width={40} showText={false} color="rgba(255,0,170,0.5)" />
      <p className="text-xs font-bold uppercase tracking-widest text-center"
        style={{ color: 'rgba(240,244,255,0.4)' }}>Prochain quiz dans</p>
      <div className="flex items-center gap-2">
        {units.map(({ val, label }) => (
          <div key={label} className="flex flex-col items-center">
            <div className="text-3xl font-black tabular-nums px-3 py-2 rounded-xl"
              style={{ color: '#FF00AA', background: 'rgba(255,0,170,0.1)', border: '1.5px solid rgba(255,0,170,0.25)', minWidth: 56, textAlign: 'center' }}>
              {pad(val)}
            </div>
            <span className="text-xs mt-1" style={{ color: 'rgba(240,244,255,0.35)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface DailyQuestion {
  id: number;
  question: string;
  choices: [string, string, string, string];
  correct: number;
}

interface LeaderboardEntry {
  user_id: string;
  nickname: string;
  avatar_color: string;
  total_score: number;
  rank: number;
}

interface MonthlyWinner {
  month: string;
  user_id: string;
  nickname: string;
  avatar_color: string;
  total_score: number;
}

type QuizState = 'loading' | 'intro' | 'playing' | 'submitting' | 'done';

function currentMonthStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function lastMonthStr(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function monthLabel(ym: string): string {
  const [y, mo] = ym.split('-');
  return new Date(Number(y), Number(mo) - 1, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}

// ─── Classement mensuel ───────────────────────────────────────────────────────
function Leaderboard({ userId, month }: { userId: string; month: string }) {
  const [entries, setEntries]   = useState<LeaderboardEntry[]>([]);
  const [myEntry, setMyEntry]   = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await (supabase as any).rpc('get_monthly_leaderboard', { target_month: month });
      if (data) {
        const all: LeaderboardEntry[] = data;
        setEntries(all.slice(0, 10));
        const me = all.find((e: LeaderboardEntry) => e.user_id === userId);
        if (me && Number(me.rank) > 10) setMyEntry(me);
      }
      setLoading(false);
    };
    load();
  }, [userId, month]);

  if (loading) return (
    <div className="flex justify-center py-8">
      <div className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: '#8B5CF6', borderTopColor: 'transparent' }} />
    </div>
  );

  if (entries.length === 0) return (
    <div className="text-center py-6">
      <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>Aucun score ce mois-ci — sois le premier ! 🚀</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
      {entries.map((e, i) => {
        const isMe = e.user_id === userId;
        return (
          <div key={e.user_id}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{
              background: isMe ? 'rgba(139,92,246,0.15)' : i === 0 ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.04)',
              border: isMe ? '1.5px solid rgba(139,92,246,0.5)' : i === 0 ? '1.5px solid rgba(245,158,11,0.4)' : '1.5px solid rgba(255,255,255,0.06)',
              boxShadow: i === 0 ? '0 0 16px rgba(245,158,11,0.1)' : 'none',
            }}>
            {i < 3 ? (
              <div className="flex items-center justify-center flex-shrink-0" style={{ width: 38 }}>
                <MustacheMedal rank={(i + 1) as 1|2|3} width={38} />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                style={{ background: isMe ? '#8B5CF6' : 'rgba(255,255,255,0.08)', color: '#F0F4FF', fontSize: '0.75rem' }}>
                #{e.rank}
              </div>
            )}
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
              style={{ background: e.avatar_color ?? '#8B5CF6', color: '#0D1B3E' }}>
              {e.nickname[0]?.toUpperCase()}
            </div>
            <span className="flex-1 font-bold text-sm truncate" style={{ color: isMe ? '#8B5CF6' : '#F0F4FF' }}>
              {e.nickname} {isMe && <span className="text-xs opacity-60">(toi)</span>}
            </span>
            <span className="font-black text-base flex-shrink-0"
              style={{ color: i === 0 ? '#F59E0B' : isMe ? '#8B5CF6' : '#F0F4FF' }}>
              {Number(e.total_score)} pts
            </span>
          </div>
        );
      })}

      {myEntry && (
        <>
          <div className="text-center text-xs py-1" style={{ color: 'rgba(240,244,255,0.3)' }}>• • •</div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1.5px solid rgba(139,92,246,0.35)' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0"
              style={{ background: '#8B5CF6', color: '#0D1B3E' }}>
              #{myEntry.rank}
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
              style={{ background: myEntry.avatar_color ?? '#8B5CF6', color: '#0D1B3E' }}>
              {myEntry.nickname[0]?.toUpperCase()}
            </div>
            <span className="flex-1 font-bold text-sm truncate" style={{ color: '#8B5CF6' }}>
              {myEntry.nickname} <span className="text-xs opacity-60">(toi)</span>
            </span>
            <span className="font-black text-base" style={{ color: '#8B5CF6' }}>
              {Number(myEntry.total_score)} pts
            </span>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
interface Props {
  userId: string;
  nickname: string;
  avatarColor: string;
}

export function DailyQuiz({ userId, nickname, avatarColor }: Props) {
  // ── État global ──────────────────────────────────────────────────────────
  const [state, setState]               = useState<QuizState>('loading');
  const [date, setDate]                 = useState('');
  const [theme, setTheme]               = useState('');
  const [questions, setQuestions]       = useState<DailyQuestion[]>([]);
  const [alreadyCompleted, setAlready]  = useState(false);
  const [myTodayScore, setMyTodayScore] = useState<number | null>(null);
  const [lastWinner, setLastWinner]     = useState<MonthlyWinner | null>(null);
  const [loadError, setLoadError]       = useState('');
  const [nextQuizDate, setNextQuizDate] = useState<string | null>(null);

  // ── État Quiz ────────────────────────────────────────────────────────────
  const [currentQ, setCurrentQ]         = useState(0);
  const [timeLeft, setTimeLeft]         = useState(TIMER_DURATION);
  const [locked, setLocked]             = useState(false); // true = feedback phase
  const [selectedIdx, setSelectedIdx]   = useState<number | null>(null);
  const [timedOut, setTimedOut]         = useState(false);

  // Accumulation via refs pour éviter les stale closures
  const answersRef  = useRef<number[]>([]);
  const timingsRef  = useRef<number[]>([]);

  // ── Résultats ────────────────────────────────────────────────────────────
  const [finalScore, setFinalScore]       = useState<number | null>(null);
  const [correctCount, setCorrectCount]   = useState(0);
  const [submitError, setSubmitError]     = useState('');

  // ── Chargement ────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setState('loading');
    setLoadError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch('/api/daily-quiz', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      let data: any = {};
      try { data = await res.json(); } catch {
        setLoadError('Quiz non disponible pour aujourd\'hui');
        const today = new Date().toLocaleDateString('fr-CA', { timeZone: 'Europe/Paris' });
        const { data: nextRow } = await supabase.from('daily_quizzes').select('date')
          .gt('date', today).order('date', { ascending: true }).limit(1).single();
        setNextQuizDate(nextRow?.date ?? null);
        setState('intro');
        return;
      }

      if (!res.ok || data.error) {
        setLoadError(data.error ?? 'Quiz non disponible pour aujourd\'hui');
        const today = new Date().toLocaleDateString('fr-CA', { timeZone: 'Europe/Paris' });
        const { data: nextRow } = await supabase.from('daily_quizzes').select('date')
          .gt('date', today).order('date', { ascending: true }).limit(1).single();
        setNextQuizDate(nextRow?.date ?? null);
        setState('intro');
        return;
      }

      setDate(data.date);
      setTheme(data.theme);
      setQuestions(data.questions);
      setAlready(data.alreadyCompleted);
      if (data.myScore !== null) setMyTodayScore(data.myScore);

      // Vainqueur du mois dernier
      const { data: winner } = await supabase.from('monthly_winners')
        .select('*').eq('month', lastMonthStr()).single();
      if (winner) setLastWinner(winner as MonthlyWinner);
      else {
        const lm = lastMonthStr();
        const { data: lb } = await (supabase as any).rpc('get_monthly_leaderboard', { target_month: lm });
        if (lb && lb.length > 0) {
          const top = lb[0] as LeaderboardEntry;
          const { data: inserted } = await supabase.from('monthly_winners')
            .insert({ month: lm, user_id: top.user_id, nickname: top.nickname, avatar_color: top.avatar_color, total_score: Number(top.total_score) })
            .select('*').single();
          if (inserted) setLastWinner(inserted as MonthlyWinner);
        }
      }
      setState('intro');
    } catch (e: any) {
      setLoadError(e.message ?? 'Erreur réseau');
      setState('intro');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Démarrer le quiz ──────────────────────────────────────────────────────
  const startQuiz = () => {
    answersRef.current  = [];
    timingsRef.current  = [];
    setCurrentQ(0);
    setTimeLeft(TIMER_DURATION);
    setLocked(false);
    setSelectedIdx(null);
    setTimedOut(false);
    setFinalScore(null);
    setCorrectCount(0);
    setSubmitError('');
    setState('playing');
  };

  // ── Soumission ────────────────────────────────────────────────────────────
  const submitQuiz = useCallback(async (answers: number[], timings: number[]) => {
    setState('submitting');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch('/api/daily-quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ answers, timings, nickname }),
      });
      const data = await res.json();
      if (!res.ok) { setSubmitError(data.error ?? 'Erreur'); setState('intro'); return; }
      setFinalScore(data.score);
      setCorrectCount(data.correctCount);
      setAlready(true);
      setMyTodayScore(data.score);
      setState('done');
    } catch (e: any) {
      setSubmitError(e.message ?? 'Erreur réseau');
      setState('intro');
    }
  }, [nickname]);

  // ── Avancer à la question suivante ────────────────────────────────────────
  const advanceQ = useCallback(() => {
    const answered = answersRef.current.length;
    if (answered < questions.length) {
      setCurrentQ(answered);
      setTimeLeft(TIMER_DURATION);
      setLocked(false);
      setSelectedIdx(null);
      setTimedOut(false);
    } else {
      submitQuiz(answersRef.current, timingsRef.current);
    }
  }, [questions.length, submitQuiz]);

  // ── Verrouiller une réponse ───────────────────────────────────────────────
  const lockAnswer = useCallback((idx: number | null, tl: number) => {
    answersRef.current  = [...answersRef.current,  idx ?? -1];
    timingsRef.current  = [...timingsRef.current,  tl];
    setSelectedIdx(idx);
    setLocked(true);
    if (idx === null) setTimedOut(true);
    setTimeout(advanceQ, FEEDBACK_DELAY);
  }, [advanceQ]);

  // ── Click sur une réponse ────────────────────────────────────────────────
  const selectAnswer = useCallback((idx: number) => {
    if (locked) return;
    lockAnswer(idx, timeLeft);
  }, [locked, timeLeft, lockAnswer]);

  // ── Timer par question ────────────────────────────────────────────────────
  useEffect(() => {
    if (state !== 'playing' || locked) return;
    if (timeLeft <= 0) { lockAnswer(null, 0); return; }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, locked, state, lockAnswer]);

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDU
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Chargement initial ────────────────────────────────────────────────────
  if (state === 'loading') return (
    <div className="flex flex-col items-center gap-3 py-8">
      <div className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: '#FF00AA', borderTopColor: 'transparent' }} />
      <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>Chargement du quiz du jour…</p>
    </div>
  );

  // ── Quiz en cours ─────────────────────────────────────────────────────────
  if (state === 'playing') {
    const q         = questions[currentQ];
    const timerPct  = (timeLeft / TIMER_DURATION) * 100;
    const timerColor = timerPct > 50 ? '#00E5D1' : timerPct > 25 ? '#F59E0B' : '#FF00AA';
    const progress   = (currentQ / questions.length) * 100;

    return (
      <div className="flex flex-col gap-4 muz-fade-in">

        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,0,170,0.6)' }}>
            {theme}
          </p>
          <span className="font-black text-sm" style={{ color: '#F0F4FF' }}>
            {currentQ + 1} <span style={{ color: 'rgba(240,244,255,0.3)' }}>/ {questions.length}</span>
          </span>
        </div>

        {/* Barre de progression globale */}
        <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #FF00AA, #8B5CF6)' }} />
        </div>

        {/* Timer */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-2xl font-black tabular-nums" style={{ color: timerColor, transition: 'color 0.5s' }}>
              {timeLeft}s
            </span>
            <span className="text-xs font-bold" style={{ color: 'rgba(240,244,255,0.3)' }}>
              ⏱ Réponds vite pour plus de points !
            </span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${timerPct}%`,
                background: timerColor,
                transition: locked ? 'none' : 'width 1s linear, background 0.5s',
                boxShadow: `0 0 8px ${timerColor}88`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="muz-card px-5 py-6 text-center">
          <p className="text-lg font-bold leading-snug" style={{ color: '#F0F4FF' }}>
            {q.question}
          </p>
        </div>

        {/* Choix */}
        <div className="flex flex-col gap-2.5">
          {q.choices.map((choice, i) => {
            const isSelected = selectedIdx === i;
            const isCorrect  = i === q.correct;
            const isWrong    = locked && isSelected && !isCorrect;
            const highlight  = locked && isCorrect;

            let bg     = 'rgba(255,255,255,0.05)';
            let border = 'rgba(255,255,255,0.1)';
            let color  = '#F0F4FF';
            let badgeBg    = 'rgba(255,255,255,0.08)';
            let badgeColor = 'rgba(240,244,255,0.5)';
            let opacity    = locked && !isCorrect && !isSelected ? 0.35 : 1;

            if (locked && isCorrect) {
              bg = 'rgba(0,229,209,0.15)'; border = '#00E5D1'; color = '#00E5D1';
              badgeBg = '#00E5D1'; badgeColor = '#0D1B3E';
            } else if (isWrong) {
              bg = 'rgba(255,0,170,0.12)'; border = '#FF00AA'; color = '#FF00AA';
              badgeBg = '#FF00AA'; badgeColor = '#0D1B3E';
            }

            return (
              <button key={i}
                onClick={() => selectAnswer(i)}
                disabled={locked}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all active:scale-[0.98] disabled:cursor-default"
                style={{ background: bg, border: `1.5px solid ${border}`, opacity }}>
                <span className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                  style={{ background: badgeBg, color: badgeColor }}>
                  {locked && isCorrect ? '✓' : locked && isWrong ? '✗' : LABELS[i]}
                </span>
                <span className="font-bold text-sm" style={{ color }}>{choice}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback bas de page */}
        {locked && (
          <div className="text-center py-1 muz-pop">
            {timedOut
              ? <p className="text-sm font-black" style={{ color: '#FF00AA' }}>⏱ Temps écoulé !</p>
              : selectedIdx === q.correct
              ? <p className="text-sm font-black" style={{ color: '#00E5D1' }}>✓ Bonne réponse !</p>
              : <p className="text-sm font-black" style={{ color: '#FF00AA' }}>✗ Mauvaise réponse</p>
            }
          </div>
        )}

        {submitError && (
          <p className="text-center text-sm font-bold" style={{ color: '#FF00AA' }}>{submitError}</p>
        )}
      </div>
    );
  }

  // ── Soumission en cours ───────────────────────────────────────────────────
  if (state === 'submitting') return (
    <div className="flex flex-col items-center gap-3 py-8">
      <div className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: '#8B5CF6', borderTopColor: 'transparent' }} />
      <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>Calcul du score…</p>
    </div>
  );

  // ── Résultats + classement ────────────────────────────────────────────────
  if (state === 'done' && finalScore !== null) {
    const maxScore = questions.length * 100;
    const pct = (finalScore / maxScore) * 100;
    const mustacheColor = pct >= 90 ? '#F59E0B' : pct >= 70 ? '#00E5D1' : pct >= 50 ? '#8B5CF6' : pct >= 30 ? '#FF00AA' : 'rgba(240,244,255,0.4)';
    const msg   = pct >= 90 ? 'Parfait !'  : pct >= 70 ? 'Excellent !' : pct >= 50 ? 'Bien joué !' : pct >= 30 ? 'Continue !' : 'Tu progresseras !';

    return (
      <div className="flex flex-col gap-5 muz-fade-in">

        {/* Score final */}
        <div className="muz-card p-6 text-center muz-pop"
          style={{ background: 'rgba(139,92,246,0.12)', border: '2px solid rgba(139,92,246,0.4)' }}>
          <div className="flex justify-center mb-2">
            <MuzquizLogo width={48} showText={false} color={mustacheColor} />
          </div>
          <p className="text-base font-black mb-3" style={{ color: '#8B5CF6' }}>{msg}</p>
          <div className="text-6xl font-black" style={{ color: '#F0F4FF' }}>
            {finalScore}
            <span className="text-xl opacity-40 ml-1">pts</span>
          </div>
          <p className="text-sm mt-2" style={{ color: 'rgba(240,244,255,0.4)' }}>
            {correctCount} / {questions.length} bonnes réponses
          </p>
          <p className="text-xs mt-1" style={{ color: 'rgba(240,244,255,0.25)' }}>
            max {maxScore} pts · score basé sur la vitesse de réponse
          </p>
        </div>

      </div>
    );
  }

  // ── Intro + Classement ────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-5 muz-fade-in">

      {/* Vainqueur du mois dernier */}
      {lastWinner && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl muz-pop"
          style={{ background: 'rgba(245,158,11,0.12)', border: '1.5px solid rgba(245,158,11,0.4)' }}>
          <span className="text-2xl flex-shrink-0">👑</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(245,158,11,0.7)' }}>
              Vainqueur de {monthLabel(lastWinner.month)}
            </p>
            <p className="font-black text-sm" style={{ color: '#F59E0B' }}>{lastWinner.nickname}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-black text-lg" style={{ color: '#F59E0B' }}>{lastWinner.total_score}</p>
            <p className="text-xs" style={{ color: 'rgba(245,158,11,0.6)' }}>pts</p>
          </div>
        </div>
      )}

      {/* Card quiz du jour */}
      <div className="muz-card p-5"
        style={{
          background: alreadyCompleted ? 'rgba(0,229,209,0.06)' : 'rgba(255,0,170,0.06)',
          border: `1.5px solid ${alreadyCompleted ? 'rgba(0,229,209,0.25)' : 'rgba(255,0,170,0.25)'}`,
        }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: alreadyCompleted ? 'rgba(0,229,209,0.2)' : 'rgba(255,0,170,0.2)' }}>
            {loadError
              ? <span className="text-xl">⏳</span>
              : <MuzquizLogo width={36} showText={false} color={alreadyCompleted ? '#00E5D1' : '#FF00AA'} />
            }
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest"
              style={{ color: alreadyCompleted ? 'rgba(0,229,209,0.7)' : 'rgba(255,0,170,0.7)' }}>
              Quiz du Jour
            </p>
            <p className="font-black text-base" style={{ color: '#F0F4FF' }}>
              {loadError
                ? nextQuizDate
                  ? `Prochain quiz le ${new Date(nextQuizDate + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`
                  : 'Bientôt disponible'
                : theme || '…'}
            </p>
          </div>
        </div>

        {loadError ? (
          <NextQuizCountdown targetDate={nextQuizDate} />
        ) : alreadyCompleted ? (
          <div className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ background: 'rgba(0,229,209,0.1)', border: '1px solid rgba(0,229,209,0.2)' }}>
            <p className="font-bold text-sm" style={{ color: '#00E5D1' }}>Score d'aujourd'hui</p>
            <p className="font-black text-2xl" style={{ color: '#00E5D1' }}>{myTodayScore} pts</p>
          </div>
        ) : (
          <button onClick={startQuiz} disabled={questions.length === 0}
            className="w-full py-3.5 rounded-xl font-black text-base transition-all disabled:opacity-40"
            style={{ background: '#FF00AA', color: 'white' }}>
            {questions.length === 0 ? 'Chargement…' : `▶ Jouer — ${questions.length} questions`}
          </button>
        )}
      </div>

    </div>
  );
}
