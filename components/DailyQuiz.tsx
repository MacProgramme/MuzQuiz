// components/DailyQuiz.tsx
"use client";

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { MuzquizLogo } from '@/components/MuzquizLogo';

// ─── Types ────────────────────────────────────────────────────────────────────
interface DailyQuestion {
  id: number;
  question: string;
  choices: [string, string, string, string];
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

type QuizState = 'loading' | 'intro' | 'playing' | 'review' | 'done';

const LABELS = ['A', 'B', 'C', 'D'];
const CHOICE_COLORS = ['#8B5CF6', '#FF00AA', '#00E5D1', '#F59E0B'];
const MEDALS = ['🥇', '🥈', '🥉'];

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
  const [y, m] = ym.split('-');
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}

// ─── Composant Classement ─────────────────────────────────────────────────────
function Leaderboard({ userId, month }: { userId: string; month: string }) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myEntry, setMyEntry] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await (supabase as any).rpc('get_monthly_leaderboard', { target_month: month });
      if (data) {
        const all: LeaderboardEntry[] = data;
        setEntries(all.slice(0, 10));
        const me = all.find((e: LeaderboardEntry) => e.user_id === userId);
        // Si le joueur n'est pas dans le top 10 mais a un score
        if (!me || Number(me.rank) > 10) {
          // Chercher son rang réel
          const { data: myData } = await (supabase as any).rpc('get_monthly_leaderboard', { target_month: month });
          if (myData) {
            const found = myData.find((e: LeaderboardEntry) => e.user_id === userId);
            if (found && Number(found.rank) > 10) setMyEntry(found);
          }
        }
      }
      setLoading(false);
    };
    load();
  }, [userId, month]);

  if (loading) return (
    <div className="flex justify-center py-8">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: '#8B5CF6', borderTopColor: 'transparent' }} />
    </div>
  );

  if (entries.length === 0) return (
    <div className="text-center py-6">
      <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>
        Aucun score ce mois-ci — sois le premier ! 🚀
      </p>
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
      {entries.map((e, i) => {
        const isMe = e.user_id === userId;
        const medal = i < 3 ? MEDALS[i] : null;
        return (
          <div key={e.user_id}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
            style={{
              background: isMe
                ? 'rgba(139,92,246,0.15)'
                : i === 0 ? 'rgba(245,158,11,0.1)'
                : 'rgba(255,255,255,0.04)',
              border: isMe
                ? '1.5px solid rgba(139,92,246,0.5)'
                : i === 0 ? '1.5px solid rgba(245,158,11,0.4)'
                : '1.5px solid rgba(255,255,255,0.06)',
              boxShadow: i === 0 ? '0 0 16px rgba(245,158,11,0.1)' : 'none',
            }}>
            {/* Rang */}
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
              style={{
                background: i === 0 ? '#F59E0B' : i === 1 ? '#9CA3AF' : i === 2 ? '#B45309' : isMe ? '#8B5CF6' : 'rgba(255,255,255,0.08)',
                color: i < 3 || isMe ? '#0D1B3E' : '#F0F4FF',
                fontSize: medal ? '1.1rem' : '0.75rem',
                boxShadow: i === 0 ? '0 0 12px rgba(245,158,11,0.5)' : 'none',
              }}>
              {medal ?? `#${e.rank}`}
            </div>
            {/* Avatar initiale */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
              style={{ background: e.avatar_color ?? '#8B5CF6', color: '#0D1B3E' }}>
              {e.nickname[0]?.toUpperCase()}
            </div>
            {/* Pseudo */}
            <span className="flex-1 font-bold text-sm truncate"
              style={{ color: isMe ? '#8B5CF6' : '#F0F4FF' }}>
              {e.nickname} {isMe && <span className="text-xs opacity-60">(toi)</span>}
            </span>
            {/* Score */}
            <span className="font-black text-base flex-shrink-0"
              style={{ color: i === 0 ? '#F59E0B' : isMe ? '#8B5CF6' : '#F0F4FF' }}>
              {Number(e.total_score)} pts
            </span>
          </div>
        );
      })}

      {/* Rang du joueur si hors top 10 */}
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
  const [state, setState] = useState<QuizState>('loading');
  const [date, setDate] = useState('');
  const [theme, setTheme] = useState('');
  const [questions, setQuestions] = useState<DailyQuestion[]>([]);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [myTodayScore, setMyTodayScore] = useState<number | null>(null);
  const [lastWinner, setLastWinner] = useState<MonthlyWinner | null>(null);
  const [loadError, setLoadError] = useState('');

  // Quiz en cours
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [feedbackPhase, setFeedbackPhase] = useState(false);

  // Résultats
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const load = useCallback(async () => {
    setState('loading');
    setLoadError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch('/api/daily-quiz', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setLoadError(data.error ?? 'Erreur de chargement');
        setState('intro');
        return;
      }

      setDate(data.date);
      setTheme(data.theme);
      setQuestions(data.questions);
      setAlreadyCompleted(data.alreadyCompleted);
      if (data.myScore !== null) setMyTodayScore(data.myScore);

      // Charger le vainqueur du mois dernier
      const { data: winner } = await supabase
        .from('monthly_winners')
        .select('*')
        .eq('month', lastMonthStr())
        .single();
      if (winner) setLastWinner(winner as MonthlyWinner);

      // Si nouveau mois et pas encore de vainqueur → calculer et sauvegarder
      if (!winner) {
        const lm = lastMonthStr();
        const { data: lb } = await (supabase as any).rpc('get_monthly_leaderboard', { target_month: lm });
        if (lb && lb.length > 0) {
          const top = lb[0] as LeaderboardEntry;
          const { data: inserted } = await supabase
            .from('monthly_winners')
            .insert({
              month: lm,
              user_id: top.user_id,
              nickname: top.nickname,
              avatar_color: top.avatar_color,
              total_score: Number(top.total_score),
            })
            .select('*')
            .single();
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

  const startQuiz = () => {
    setCurrentQ(0);
    setSelected(null);
    setAnswers([]);
    setFeedbackPhase(false);
    setFinalScore(null);
    setResults([]);
    setCorrectAnswers([]);
    setSubmitError('');
    setState('playing');
  };

  const selectAnswer = (idx: number) => {
    if (feedbackPhase || selected !== null) return;
    setSelected(idx);
    setFeedbackPhase(true);
  };

  const nextQuestion = () => {
    const newAnswers = [...answers, selected!];
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setFeedbackPhase(false);
    } else {
      // Fin du quiz → soumettre
      submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (finalAnswers: number[]) => {
    setSubmitting(true);
    setState('review');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch('/api/daily-quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ answers: finalAnswers, nickname }),
      });
      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error ?? 'Erreur de soumission');
        setState('playing');
        return;
      }

      setFinalScore(data.score);
      setResults(data.results);
      setCorrectAnswers(data.correctAnswers);
      setAlreadyCompleted(true);
      setMyTodayScore(data.score);
      setState('done');
    } catch (e: any) {
      setSubmitError(e.message ?? 'Erreur réseau');
      setState('playing');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (state === 'loading') return (
    <div className="flex flex-col items-center gap-3 py-8">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: '#FF00AA', borderTopColor: 'transparent' }} />
      <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>Chargement du quiz du jour…</p>
    </div>
  );

  // ─── En cours de quiz ──────────────────────────────────────────────────────
  if (state === 'playing') {
    const q = questions[currentQ];
    const progress = ((currentQ) / questions.length) * 100;

    return (
      <div className="flex flex-col gap-4 muz-fade-in">
        {/* En-tête quiz */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,0,170,0.6)' }}>
              Quiz du Jour — {theme}
            </p>
            <p className="font-black text-lg" style={{ color: '#F0F4FF' }}>
              Question {currentQ + 1} / {questions.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold" style={{ color: 'rgba(240,244,255,0.4)' }}>Score</p>
            <p className="font-black text-xl" style={{ color: '#8B5CF6' }}>
              {answers.filter((a, i) => a === (correctAnswers[i] ?? -1)).length * 10}
            </p>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #FF00AA, #8B5CF6)' }} />
        </div>

        {/* Question */}
        <div className="muz-card px-5 py-5 text-center">
          <p className="text-lg font-bold leading-snug" style={{ color: '#F0F4FF' }}>{q.question}</p>
        </div>

        {/* Choix */}
        <div className="grid grid-cols-1 gap-2">
          {q.choices.map((choice, i) => {
            let bg = 'rgba(255,255,255,0.05)';
            let border = 'rgba(255,255,255,0.1)';
            let color = '#F0F4FF';

            if (feedbackPhase && selected === i) {
              // Sélectionné — on ne montre pas encore si correct (reveal after submit)
              bg = `${CHOICE_COLORS[i]}22`;
              border = CHOICE_COLORS[i];
              color = CHOICE_COLORS[i];
            }

            return (
              <button key={i}
                onClick={() => selectAnswer(i)}
                disabled={feedbackPhase}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all hover:opacity-90 disabled:cursor-default"
                style={{ background: bg, border: `1.5px solid ${border}` }}>
                <span className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                  style={{
                    background: feedbackPhase && selected === i ? CHOICE_COLORS[i] : 'rgba(255,255,255,0.08)',
                    color: feedbackPhase && selected === i ? '#0D1B3E' : 'rgba(240,244,255,0.5)',
                  }}>
                  {LABELS[i]}
                </span>
                <span className="font-bold text-sm" style={{ color }}>{choice}</span>
              </button>
            );
          })}
        </div>

        {/* Bouton suivant */}
        {feedbackPhase && (
          <button onClick={nextQuestion} disabled={submitting}
            className="w-full py-3 rounded-xl font-black text-sm transition-all muz-pop"
            style={{ background: '#FF00AA', color: 'white' }}>
            {submitting ? '...' : currentQ < questions.length - 1 ? 'Question suivante →' : 'Voir les résultats →'}
          </button>
        )}

        {submitError && (
          <p className="text-center text-sm font-bold" style={{ color: '#FF00AA' }}>{submitError}</p>
        )}
      </div>
    );
  }

  // ─── Chargement résultats ──────────────────────────────────────────────────
  if (state === 'review') return (
    <div className="flex flex-col items-center gap-3 py-8">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: '#8B5CF6', borderTopColor: 'transparent' }} />
      <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>Calcul du score…</p>
    </div>
  );

  // ─── Résultats ─────────────────────────────────────────────────────────────
  if (state === 'done' && finalScore !== null) {
    const pct = finalScore;
    const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '🎯' : pct >= 50 ? '💪' : pct >= 30 ? '😅' : '💡';
    const msg = pct >= 90 ? 'Parfait !' : pct >= 70 ? 'Excellent !' : pct >= 50 ? 'Bien joué !' : pct >= 30 ? 'Continue !' : 'Tu progresseras !';
    const correctCount = results.filter(Boolean).length;

    return (
      <div className="flex flex-col gap-4 muz-fade-in">
        {/* Score */}
        <div className="muz-card p-6 text-center"
          style={{ background: 'rgba(139,92,246,0.12)', border: '2px solid rgba(139,92,246,0.4)' }}>
          <div className="text-5xl mb-2">{emoji}</div>
          <p className="text-xl font-black mb-1" style={{ color: '#8B5CF6' }}>{msg}</p>
          <div className="text-6xl font-black my-3" style={{ color: '#F0F4FF' }}>{finalScore}<span className="text-2xl opacity-50">/100</span></div>
          <p className="text-sm" style={{ color: 'rgba(240,244,255,0.5)' }}>
            {correctCount} / {questions.length} bonnes réponses
          </p>
        </div>

        {/* Détail des réponses */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(240,244,255,0.4)' }}>
            Détail des réponses
          </p>
          <div className="flex flex-col gap-2">
            {questions.map((q, i) => {
              const isCorrect = results[i];
              const myAnswer = answers[i];
              const correctAnswer = correctAnswers[i];
              return (
                <div key={i} className="p-3 rounded-xl"
                  style={{
                    background: isCorrect ? 'rgba(0,229,209,0.08)' : 'rgba(255,0,170,0.08)',
                    border: `1px solid ${isCorrect ? 'rgba(0,229,209,0.25)' : 'rgba(255,0,170,0.25)'}`,
                  }}>
                  <div className="flex items-start gap-2">
                    <span className="text-base flex-shrink-0">{isCorrect ? '✅' : '❌'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold mb-1 line-clamp-2" style={{ color: '#F0F4FF' }}>{q.question}</p>
                      {!isCorrect && (
                        <p className="text-xs" style={{ color: 'rgba(240,244,255,0.5)' }}>
                          Ta réponse : <span style={{ color: '#FF00AA' }}>{q.choices[myAnswer]}</span>
                        </p>
                      )}
                      <p className="text-xs" style={{ color: '#00E5D1' }}>
                        ✓ {q.choices[correctAnswer]}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Classement mensuel */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(240,244,255,0.4)' }}>
            Classement — {monthLabel(currentMonthStr())}
          </p>
          <Leaderboard userId={userId} month={currentMonthStr()} />
        </div>
      </div>
    );
  }

  // ─── Intro + Classement ────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-5 muz-fade-in">

      {/* Bannière vainqueur du mois dernier */}
      {lastWinner && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl muz-pop"
          style={{ background: 'rgba(245,158,11,0.12)', border: '1.5px solid rgba(245,158,11,0.4)' }}>
          <span className="text-2xl flex-shrink-0">👑</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(245,158,11,0.7)' }}>
              Vainqueur de {monthLabel(lastWinner.month)}
            </p>
            <p className="font-black text-sm" style={{ color: '#F59E0B' }}>
              {lastWinner.nickname}
            </p>
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
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: alreadyCompleted ? 'rgba(0,229,209,0.2)' : 'rgba(255,0,170,0.2)' }}>
            <span className="text-xl">{alreadyCompleted ? '✅' : '🧠'}</span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest"
              style={{ color: alreadyCompleted ? 'rgba(0,229,209,0.7)' : 'rgba(255,0,170,0.7)' }}>
              Quiz du Jour
            </p>
            <p className="font-black text-base" style={{ color: '#F0F4FF' }}>
              {theme || '…'}
            </p>
          </div>
        </div>

        {loadError && (
          <p className="text-sm font-bold mb-3" style={{ color: '#FF00AA' }}>{loadError}</p>
        )}

        {alreadyCompleted ? (
          <div className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ background: 'rgba(0,229,209,0.1)', border: '1px solid rgba(0,229,209,0.2)' }}>
            <p className="font-bold text-sm" style={{ color: '#00E5D1' }}>Score d'aujourd'hui</p>
            <p className="font-black text-2xl" style={{ color: '#00E5D1' }}>{myTodayScore}/100</p>
          </div>
        ) : (
          <button onClick={startQuiz} disabled={!!loadError || questions.length === 0}
            className="w-full py-3.5 rounded-xl font-black text-base transition-all disabled:opacity-40"
            style={{ background: '#FF00AA', color: 'white' }}>
            {questions.length === 0 ? 'Chargement…' : `▶ Jouer — ${questions.length} questions`}
          </button>
        )}
      </div>

      {/* Classement mensuel */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(240,244,255,0.4)' }}>
            Classement — {monthLabel(currentMonthStr())}
          </p>
          <span className="text-xs font-bold px-2 py-1 rounded-full"
            style={{ background: 'rgba(139,92,246,0.12)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.2)' }}>
            Top 10
          </span>
        </div>
        <Leaderboard userId={userId} month={currentMonthStr()} />
      </div>
    </div>
  );
}
