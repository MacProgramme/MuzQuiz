// components/TestDailyQuiz.tsx
// ⚠️ COMPOSANT DE TEST — À SUPPRIMER AVANT LE LANCEMENT
// Quiz parallèle au vrai quiz du jour : mêmes questions, rejouable à l'infini, pas de sauvegarde en DB.
"use client";

import { useEffect, useState, useCallback, useRef } from 'react';

const TIMER_DURATION  = 20;   // secondes par question
const FEEDBACK_DELAY  = 1500; // ms avant passage à la question suivante
const LABELS          = ['A', 'B', 'C', 'D'];
const CHOICE_COLORS   = ['#8B5CF6', '#FF00AA', '#00E5D1', '#F59E0B'];

interface TestQuestion {
  id: number;
  question: string;
  choices: [string, string, string, string];
  correct: number;
}

type Phase = 'loading' | 'intro' | 'playing' | 'done';

function scoreForAnswer(correct: boolean, timeLeft: number): number {
  if (!correct) return 0;
  return Math.max(10, Math.round(100 * timeLeft / TIMER_DURATION));
}

interface Props {
  userId: string;
  nickname: string;
}

export function TestDailyQuiz({ userId, nickname }: Props) {
  const [phase, setPhase]         = useState<Phase>('loading');
  const [theme, setTheme]         = useState('');
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [loadError, setLoadError] = useState('');

  // Quiz en cours
  const [currentQ, setCurrentQ]   = useState(0);
  const [timeLeft, setTimeLeft]   = useState(TIMER_DURATION);
  const [locked, setLocked]       = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [timedOut, setTimedOut]   = useState(false);
  const [showCorrect, setShowCorrect] = useState(false); // révèle la bonne réponse pendant le feedback

  // Accumulation
  const answersRef   = useRef<number[]>([]);
  const timingsRef   = useRef<number[]>([]);
  const scoresRef    = useRef<number[]>([]); // score par question (calculé côté client)

  // Résultats
  const [finalScore, setFinalScore]     = useState(0);
  const [results, setResults]           = useState<boolean[]>([]);
  const [runCount, setRunCount]         = useState(0); // nb de parties jouées

  // ── Chargement ──────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setPhase('loading');
    setLoadError('');
    try {
      const res  = await fetch('/api/test-quiz');
      const data = await res.json();
      if (!res.ok || data.error) {
        setLoadError(data.error ?? 'Quiz non disponible');
        setPhase('intro');
        return;
      }
      setTheme(data.theme);
      setQuestions(data.questions);
      setPhase('intro');
    } catch (e: any) {
      setLoadError(e.message ?? 'Erreur réseau');
      setPhase('intro');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Démarrer / Rejouer ──────────────────────────────────────────────────────
  const startQuiz = () => {
    answersRef.current  = [];
    timingsRef.current  = [];
    scoresRef.current   = [];
    setCurrentQ(0);
    setTimeLeft(TIMER_DURATION);
    setLocked(false);
    setSelectedIdx(null);
    setTimedOut(false);
    setShowCorrect(false);
    setFinalScore(0);
    setResults([]);
    setPhase('playing');
  };

  // ── Fin de quiz (calcul local) ──────────────────────────────────────────────
  const finishQuiz = useCallback((allAnswers: number[], allScores: number[]) => {
    const res = questions.map((q, i) => allAnswers[i] === q.correct);
    setResults(res);
    setFinalScore(allScores.reduce((a, b) => a + b, 0));
    setRunCount(c => c + 1);
    setPhase('done');
  }, [questions]);

  // ── Avancer à la question suivante ──────────────────────────────────────────
  const advanceQ = useCallback(() => {
    const answered = answersRef.current.length;
    if (answered < questions.length) {
      setCurrentQ(answered);
      setTimeLeft(TIMER_DURATION);
      setLocked(false);
      setSelectedIdx(null);
      setTimedOut(false);
      setShowCorrect(false);
    } else {
      finishQuiz(answersRef.current, scoresRef.current);
    }
  }, [questions.length, finishQuiz]);

  // ── Verrouiller une réponse ─────────────────────────────────────────────────
  const lockAnswer = useCallback((idx: number | null, tl: number) => {
    const q       = questions[answersRef.current.length];
    const correct = idx !== null && idx === q.correct;
    const pts     = scoreForAnswer(correct, tl);

    answersRef.current  = [...answersRef.current,  idx ?? -1];
    timingsRef.current  = [...timingsRef.current,  tl];
    scoresRef.current   = [...scoresRef.current,   pts];

    setSelectedIdx(idx);
    setLocked(true);
    if (idx === null) setTimedOut(true);
    // Révèle immédiatement la bonne réponse
    setShowCorrect(true);

    setTimeout(advanceQ, FEEDBACK_DELAY);
  }, [questions, advanceQ]);

  const selectAnswer = useCallback((idx: number) => {
    if (locked) return;
    lockAnswer(idx, timeLeft);
  }, [locked, timeLeft, lockAnswer]);

  // ── Timer ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing' || locked) return;
    if (timeLeft <= 0) { lockAnswer(null, 0); return; }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, locked, phase, lockAnswer]);

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDU
  // ═══════════════════════════════════════════════════════════════════════════

  const badge = (
    <span className="text-xs font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
      style={{ background: 'rgba(245,158,11,0.2)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.4)' }}>
      🧪 TEST
    </span>
  );

  if (phase === 'loading') return (
    <div className="muz-card p-5 opacity-60">
      <div className="flex items-center gap-2 mb-2">{badge}<span className="text-xs font-bold" style={{ color: 'rgba(240,244,255,0.4)' }}>Quiz parallèle</span></div>
      <div className="flex justify-center py-4">
        <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: '#F59E0B', borderTopColor: 'transparent' }} />
      </div>
    </div>
  );

  // ── Intro ───────────────────────────────────────────────────────────────────
  if (phase === 'intro') return (
    <div className="muz-card p-5" style={{ border: '1.5px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.05)' }}>
      <div className="flex items-center gap-2 mb-3">{badge}
        <span className="text-xs font-bold" style={{ color: 'rgba(240,244,255,0.4)' }}>Quiz parallèle — rejouable à l'infini</span>
      </div>
      {loadError ? (
        <p className="text-sm" style={{ color: '#FF00AA' }}>{loadError}</p>
      ) : (
        <>
          <p className="font-black text-base mb-1" style={{ color: '#F0F4FF' }}>{theme}</p>
          <p className="text-xs mb-3" style={{ color: 'rgba(240,244,255,0.4)' }}>
            {questions.length} questions · score dégressif · bonne réponse révélée après chaque question
          </p>
          {runCount > 0 && (
            <p className="text-xs mb-2 font-bold" style={{ color: 'rgba(245,158,11,0.7)' }}>
              Dernière partie : {finalScore} pts
            </p>
          )}
          <button onClick={startQuiz}
            className="w-full py-3 rounded-xl font-black text-sm transition-all"
            style={{ background: '#F59E0B', color: '#0D1B3E' }}>
            {runCount === 0 ? '▶ Jouer' : '🔁 Rejouer'}
          </button>
        </>
      )}
    </div>
  );

  // ── Quiz en cours ────────────────────────────────────────────────────────────
  if (phase === 'playing') {
    const q          = questions[currentQ];
    const timerPct   = (timeLeft / TIMER_DURATION) * 100;
    const timerColor = timerPct > 50 ? '#00E5D1' : timerPct > 25 ? '#F59E0B' : '#FF00AA';
    const progress   = (currentQ / questions.length) * 100;
    const runningScore = scoresRef.current.reduce((a, b) => a + b, 0);

    return (
      <div className="muz-card p-5 muz-fade-in" style={{ border: '1.5px solid rgba(245,158,11,0.3)' }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {badge}
            <span className="text-xs font-bold" style={{ color: '#F0F4FF' }}>
              {currentQ + 1}<span style={{ color: 'rgba(240,244,255,0.3)' }}>/{questions.length}</span>
            </span>
          </div>
          <span className="font-black text-sm" style={{ color: '#F59E0B' }}>
            {runningScore} pts
          </span>
        </div>

        {/* Barre progression globale */}
        <div className="w-full h-1 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'rgba(245,158,11,0.6)' }} />
        </div>

        {/* Timer */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xl font-black tabular-nums" style={{ color: timerColor }}>{timeLeft}s</span>
            <span className="text-xs" style={{ color: 'rgba(240,244,255,0.3)' }}>vite = plus de points</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full rounded-full"
              style={{
                width: `${timerPct}%`,
                background: timerColor,
                transition: locked ? 'none' : 'width 1s linear, background 0.5s',
              }} />
          </div>
        </div>

        {/* Question */}
        <div className="px-4 py-4 rounded-2xl text-center mb-3"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="font-bold text-sm leading-snug" style={{ color: '#F0F4FF' }}>{q.question}</p>
        </div>

        {/* Choix */}
        <div className="flex flex-col gap-2">
          {q.choices.map((choice, i) => {
            const isSelected  = selectedIdx === i;
            const isCorrect   = i === q.correct;
            let bg     = 'rgba(255,255,255,0.04)';
            let border = 'rgba(255,255,255,0.1)';
            let col    = 'rgba(240,244,255,0.8)';

            if (showCorrect && isCorrect) {
              bg     = 'rgba(0,229,209,0.15)';
              border = '#00E5D1';
              col    = '#00E5D1';
            } else if (showCorrect && isSelected && !isCorrect) {
              bg     = 'rgba(255,0,170,0.12)';
              border = '#FF00AA';
              col    = '#FF00AA';
            } else if (!showCorrect && isSelected) {
              bg     = `${CHOICE_COLORS[i]}22`;
              border = CHOICE_COLORS[i];
              col    = CHOICE_COLORS[i];
            }

            return (
              <button key={i}
                onClick={() => selectAnswer(i)}
                disabled={locked}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all disabled:cursor-default"
                style={{ background: bg, border: `1.5px solid ${border}`, opacity: locked && !isSelected && !isCorrect ? 0.35 : 1 }}>
                <span className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0"
                  style={{
                    background: showCorrect && isCorrect ? '#00E5D1' : showCorrect && isSelected && !isCorrect ? '#FF00AA' : !showCorrect && isSelected ? CHOICE_COLORS[i] : 'rgba(255,255,255,0.08)',
                    color: (showCorrect && isCorrect) || (showCorrect && isSelected) || (!showCorrect && isSelected) ? '#0D1B3E' : 'rgba(240,244,255,0.5)',
                  }}>
                  {LABELS[i]}
                </span>
                <span className="font-bold text-sm" style={{ color: col }}>{choice}</span>
                {showCorrect && isCorrect && (
                  <span className="ml-auto text-xs font-black flex-shrink-0" style={{ color: '#00E5D1' }}>✓</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback bas */}
        {locked && (
          <div className="text-center mt-3">
            {timedOut
              ? <p className="text-xs font-black" style={{ color: '#FF00AA' }}>⏱ Temps écoulé !</p>
              : selectedIdx === q.correct
              ? <p className="text-xs font-black" style={{ color: '#00E5D1' }}>
                  ✓ Correct ! +{scoresRef.current[scoresRef.current.length - 1]} pts
                </p>
              : <p className="text-xs font-black" style={{ color: '#FF00AA' }}>✗ Raté</p>
            }
          </div>
        )}
      </div>
    );
  }

  // ── Résultats ───────────────────────────────────────────────────────────────
  if (phase === 'done') {
    const maxScore    = questions.length * 100;
    const correctCount = results.filter(Boolean).length;
    const pct         = (finalScore / maxScore) * 100;
    const emoji       = pct >= 90 ? '🏆' : pct >= 70 ? '🎯' : pct >= 50 ? '💪' : pct >= 30 ? '😅' : '💡';

    return (
      <div className="muz-card p-5 muz-fade-in" style={{ border: '1.5px solid rgba(245,158,11,0.3)' }}>
        <div className="flex items-center gap-2 mb-4">{badge}
          <span className="text-xs font-bold" style={{ color: 'rgba(240,244,255,0.4)' }}>Résultats</span>
        </div>

        {/* Score */}
        <div className="text-center py-4 px-4 rounded-2xl mb-4"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
          <div className="text-3xl mb-1">{emoji}</div>
          <div className="text-5xl font-black" style={{ color: '#F59E0B' }}>
            {finalScore}<span className="text-lg opacity-40 ml-1">pts</span>
          </div>
          <p className="text-xs mt-2" style={{ color: 'rgba(240,244,255,0.4)' }}>
            {correctCount}/{questions.length} bonnes réponses · max {maxScore} pts
          </p>
        </div>

        {/* Détail par question */}
        <div className="flex flex-col gap-1.5 mb-4">
          {questions.map((q, i) => {
            const isCorrect  = results[i];
            const myAnswer   = answersRef.current[i];
            const pts        = scoresRef.current[i];
            return (
              <div key={i} className="flex items-start gap-2 px-3 py-2.5 rounded-xl"
                style={{
                  background: isCorrect ? 'rgba(0,229,209,0.06)' : 'rgba(255,0,170,0.06)',
                  border: `1px solid ${isCorrect ? 'rgba(0,229,209,0.2)' : 'rgba(255,0,170,0.18)'}`,
                }}>
                <span className="flex-shrink-0 text-sm">{isCorrect ? '✅' : '❌'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold line-clamp-2" style={{ color: '#F0F4FF' }}>{q.question}</p>
                  {!isCorrect && myAnswer >= 0 && (
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(240,244,255,0.4)' }}>
                      Ta réponse : <span style={{ color: '#FF00AA' }}>{q.choices[myAnswer]}</span>
                    </p>
                  )}
                  {!isCorrect && (
                    <p className="text-xs" style={{ color: '#00E5D1' }}>✓ {q.choices[q.correct]}</p>
                  )}
                </div>
                {isCorrect && (
                  <span className="flex-shrink-0 text-xs font-black" style={{ color: '#00E5D1' }}>+{pts}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Rejouer */}
        <button onClick={startQuiz}
          className="w-full py-3 rounded-xl font-black text-sm transition-all"
          style={{ background: '#F59E0B', color: '#0D1B3E' }}>
          🔁 Rejouer
        </button>
      </div>
    );
  }

  return null;
}
