// components/PublicScreenView.tsx
"use client";

import { useEffect, useState } from 'react';
import { Room, Player, Buzz, QCMAnswer, BuzzQuestion, QCMQuestion } from '@/types';

const COLORS = ['#EF4444', '#3B82F6', '#EAB308', '#22C55E'];
const SHAPES = ['▲', '◆', '●', '■'];
const LABELS = ['A', 'B', 'C', 'D'];

interface Props {
  room: Room;
  players: Player[];
  myPlayer: Player;
  currentQuestion: BuzzQuestion | QCMQuestion | null;
  buzz: Buzz | null;
  qcmAnswers: QCMAnswer[];
  qcmRevealed: boolean;
  showLeaderboard: boolean;
  timerKey: number;
  startGame: () => void;
  revealQCMAndNext: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
}

/* ---- Timer intégré pour grand écran ---- */
function BigTimer({ duration, running, onExpire }: { duration: number; running: boolean; onExpire: () => void }) {
  const [t, setT] = useState(duration);
  useEffect(() => { setT(duration); }, [duration]);
  useEffect(() => {
    if (!running) return;
    if (t <= 0) { onExpire(); return; }
    const id = setTimeout(() => setT(n => n - 1), 1000);
    return () => clearTimeout(id);
  }, [t, running]);
  const pct = (t / duration) * 100;
  const color = t <= 5 ? '#FF00AA' : t <= 10 ? '#F59E0B' : '#00E5D1';
  return (
    <div className="flex flex-col items-center gap-2">
      <span className={`font-black tabular-nums ${t <= 5 ? 'animate-pulse' : ''}`}
        style={{ fontSize: '5rem', color, textShadow: t <= 5 ? `0 0 30px ${color}` : 'none', fontFamily: 'var(--font-black-han)', lineHeight: 1 }}>
        {t}
      </span>
      <div className="h-3 rounded-full overflow-hidden" style={{ width: '200px', background: 'rgba(255,255,255,0.1)' }}>
        <div className="h-full rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 12px ${color}` }} />
      </div>
    </div>
  );
}

export function PublicScreenView({
  room, players, myPlayer, currentQuestion, buzz, qcmAnswers, qcmRevealed,
  showLeaderboard, timerKey, startGame, revealQCMAndNext, pauseGame, resumeGame, endGame,
}: Props) {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const answeredIds = new Set(qcmAnswers.map(a => a.player_id));
  const answeredCount = answeredIds.size;
  const buzzerPlayer = players.find(p => p.id === buzz?.player_id);

  /* ===== SALLE D'ATTENTE ===== */
  if (room.status === 'waiting') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>
        <h1 className="font-black mb-1" style={{ fontSize: '3.5rem', fontFamily: 'var(--font-black-han)', color: '#FF00AA', textShadow: '0 0 40px rgba(255,0,170,0.4)' }}>
          MUZQUIZ
        </h1>
        <p className="text-lg mb-10" style={{ color: 'rgba(240,244,255,0.4)' }}>
          {room.mode === 'qcm' ? '🎵 Quiz Blind Test' : '🔔 Buzz Quiz'} · Mode écran public
        </p>

        {/* Grand code salle */}
        <div className="px-16 py-8 rounded-3xl mb-6"
          style={{ background: 'rgba(0,229,209,0.06)', border: '2px solid rgba(0,229,209,0.3)', boxShadow: '0 0 60px rgba(0,229,209,0.1)' }}>
          <p className="text-sm font-black uppercase tracking-widest text-center mb-2" style={{ color: 'rgba(0,229,209,0.6)' }}>
            CODE DE LA SALLE
          </p>
          <p className="font-black font-mono tracking-[0.3em]" style={{ fontSize: '5rem', color: '#00E5D1', lineHeight: 1 }}>
            {room.code}
          </p>
        </div>
        <p className="text-base mb-12" style={{ color: 'rgba(240,244,255,0.4)' }}>
          Rejoignez sur <strong style={{ color: '#F0F4FF' }}>muzquiz.app</strong> avec ce code
        </p>

        {/* Liste des joueurs */}
        <div className="flex flex-wrap gap-3 justify-center max-w-3xl mb-10 px-8">
          {players.length === 0 ? (
            <p style={{ color: 'rgba(240,244,255,0.3)' }}>En attente de joueurs…</p>
          ) : players.map(p => (
            <div key={p.id} className="px-5 py-2 rounded-xl font-bold text-lg"
              style={{ background: 'rgba(255,255,255,0.07)', color: '#F0F4FF', border: '1px solid rgba(255,255,255,0.1)' }}>
              {p.nickname}
            </div>
          ))}
        </div>

        {/* Bouton démarrer (hôte) */}
        {myPlayer.is_host && players.length >= 1 && (
          <button onClick={startGame}
            className="muz-btn-pink px-14 py-5 rounded-2xl font-black"
            style={{ fontSize: '1.5rem' }}>
            Lancer la partie ({players.length} joueur{players.length > 1 ? 's' : ''}) →
          </button>
        )}
        {myPlayer.is_host && players.length === 0 && (
          <p className="text-base" style={{ color: 'rgba(240,244,255,0.3)' }}>
            En attente de joueurs…
          </p>
        )}
      </div>
    );
  }

  /* ===== CLASSEMENT INTER-QUESTION ===== */
  if (showLeaderboard) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-12"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>
        <h2 className="font-black mb-10" style={{ fontSize: '2.5rem', color: '#F0F4FF' }}>
          🏆 Classement
        </h2>
        <div className="flex flex-col gap-4 w-full max-w-2xl">
          {sorted.slice(0, 5).map((p, i) => (
            <div key={p.id} className="flex items-center gap-5 px-8 py-5 rounded-2xl"
              style={{
                background: i === 0 ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${i === 0 ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.07)'}`,
              }}>
              <span style={{ fontSize: '2rem', minWidth: '3rem' }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
              </span>
              <span className="flex-1 font-black" style={{ fontSize: '1.5rem', color: '#F0F4FF' }}>{p.nickname}</span>
              <span className="font-black" style={{ fontSize: '1.5rem', color: '#8B5CF6' }}>{p.score} pts</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ===== TERMINÉE ===== */
  if (room.status === 'finished') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-12"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>
        <h1 className="font-black mb-10" style={{ fontSize: '3rem', color: '#F59E0B' }}>
          🏆 Résultats finaux
        </h1>
        <div className="flex flex-col gap-4 w-full max-w-2xl">
          {sorted.map((p, i) => (
            <div key={p.id} className="flex items-center gap-5 px-8 py-4 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '1.8rem', minWidth: '3rem' }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
              </span>
              <span className="flex-1 font-black" style={{ fontSize: '1.3rem', color: '#F0F4FF' }}>{p.nickname}</span>
              <span className="font-black" style={{ fontSize: '1.3rem', color: '#8B5CF6' }}>{p.score} pts</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  /* ===== MODE QCM — EN JEU ===== */
  if (room.mode === 'qcm') {
    const answerCounts = currentQuestion.choices.map((_, i) =>
      qcmAnswers.filter(a => a.answer_index === i).length
    );
    return (
      <div className="min-h-screen flex flex-col"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>

        {/* Barre du haut */}
        <div className="flex items-center justify-between px-8 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="font-black text-xl" style={{ fontFamily: 'var(--font-black-han)', color: '#FF00AA' }}>
            MUZQUIZ
          </span>
          <span className="text-base font-bold" style={{ color: 'rgba(240,244,255,0.4)' }}>
            Question {(room.current_question ?? 0) + 1} · {answeredCount}/{players.length} ont répondu
          </span>
          <div className="flex gap-2">
            {room.is_paused ? (
              <button onClick={resumeGame}
                className="px-4 py-2 rounded-xl font-bold text-sm"
                style={{ background: 'rgba(0,229,209,0.15)', color: '#00E5D1', border: '1px solid rgba(0,229,209,0.3)' }}>
                ▶ Reprendre
              </button>
            ) : (
              <button onClick={pauseGame}
                className="px-4 py-2 rounded-xl font-bold text-sm"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(240,244,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                ⏸ Pause
              </button>
            )}
            <button onClick={endGame}
              className="px-4 py-2 rounded-xl font-bold text-sm"
              style={{ background: 'rgba(255,0,170,0.08)', color: 'rgba(255,0,170,0.6)', border: '1px solid rgba(255,0,170,0.2)' }}>
              🚪 Terminer
            </button>
          </div>
        </div>

        {/* Question */}
        <div className="flex items-center justify-center px-12 py-8" style={{ minHeight: '200px' }}>
          <p className="font-black text-center leading-tight"
            style={{ fontSize: '2.5rem', color: '#F0F4FF', maxWidth: '900px' }}>
            {currentQuestion.q}
          </p>
        </div>

        {/* Timer + pause banner */}
        <div className="flex justify-center mb-6">
          {room.is_paused ? (
            <div className="px-8 py-4 rounded-2xl" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)' }}>
              <p className="text-2xl font-black" style={{ color: '#F59E0B' }}>⏸ Pause</p>
            </div>
          ) : !qcmRevealed ? (
            <BigTimer key={timerKey} duration={room.timer_duration} running={!room.is_paused}
              onExpire={() => { if (myPlayer.is_host) revealQCMAndNext(); }} />
          ) : null}
        </div>

        {/* Grille de réponses 2×2 */}
        <div className="grid grid-cols-2 gap-5 px-8 pb-6 flex-1">
          {currentQuestion.choices.map((choice, i) => {
            const isCorrect = qcmRevealed && i === currentQuestion.correct;
            const isWrong = qcmRevealed && i !== currentQuestion.correct;
            const count = answerCounts[i];
            return (
              <div key={i} className="flex items-center gap-5 rounded-2xl px-8 py-6 transition-all"
                style={{
                  background: isCorrect ? '#22C55E' : isWrong ? 'rgba(255,255,255,0.04)' : COLORS[i] + 'cc',
                  opacity: isWrong ? 0.4 : 1,
                  border: `3px solid ${isCorrect ? '#16A34A' : 'transparent'}`,
                  minHeight: '110px',
                }}>
                <span style={{ fontSize: '2.5rem', color: 'white' }}>{SHAPES[i]}</span>
                <span className="flex-1 font-black text-white" style={{ fontSize: '1.4rem', lineHeight: 1.2 }}>
                  {choice}
                </span>
                {(qcmRevealed || count > 0) && (
                  <span className="font-black text-white opacity-80" style={{ fontSize: '1.5rem' }}>{count}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Bouton révéler (hôte) */}
        {myPlayer.is_host && !qcmRevealed && (
          <div className="px-8 pb-8">
            <button onClick={revealQCMAndNext}
              className="muz-btn-pink w-full rounded-2xl font-black"
              style={{ padding: '1.25rem', fontSize: '1.3rem' }}>
              Révéler les réponses →
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ===== MODE BUZZ — EN JEU ===== */
  if (room.mode === 'buzz') {
    const q = currentQuestion as BuzzQuestion;
    const buzzerAnswer = qcmAnswers.find(a => a.player_id === buzzerPlayer?.id);
    return (
      <div className="min-h-screen flex flex-col"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>

        {/* Barre du haut */}
        <div className="flex items-center justify-between px-8 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="font-black text-xl" style={{ fontFamily: 'var(--font-black-han)', color: '#FF00AA' }}>
            MUZQUIZ
          </span>
          <span className="text-base font-bold" style={{ color: 'rgba(240,244,255,0.4)' }}>
            Question {(room.current_question ?? 0) + 1}
          </span>
          <div className="flex gap-2">
            {room.is_paused ? (
              <button onClick={resumeGame} className="px-4 py-2 rounded-xl font-bold text-sm"
                style={{ background: 'rgba(0,229,209,0.15)', color: '#00E5D1', border: '1px solid rgba(0,229,209,0.3)' }}>
                ▶ Reprendre
              </button>
            ) : (
              <button onClick={pauseGame} className="px-4 py-2 rounded-xl font-bold text-sm"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(240,244,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                ⏸ Pause
              </button>
            )}
          </div>
        </div>

        {/* Question — grande */}
        <div className="flex-1 flex items-center justify-center px-12 py-8">
          <p className="font-black text-center leading-tight"
            style={{ fontSize: '3rem', color: '#F0F4FF', maxWidth: '900px' }}>
            {currentQuestion.q}
          </p>
        </div>

        {/* Statut buzz */}
        <div className="px-8 pb-6">
          {buzzerPlayer ? (
            <div>
              <p className="text-center font-black mb-6" style={{ fontSize: '2rem', color: '#FF00AA' }}>
                🔔 {buzzerPlayer.nickname} a buzzé !
              </p>
              {/* Réponses */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {q.choices.map((choice, i) => {
                  const isChosen = buzzerAnswer?.answer_index === i;
                  const isCorrect = qcmRevealed && i === currentQuestion.correct;
                  const isWrong = qcmRevealed && isChosen && !isCorrect;
                  return (
                    <div key={i} className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-white"
                      style={{
                        background: isCorrect ? '#22C55E' : isWrong ? '#EF4444' : isChosen ? COLORS[i] : COLORS[i] + '66',
                        fontSize: '1.2rem',
                        border: isChosen ? '3px solid white' : '3px solid transparent',
                      }}>
                      <span style={{ fontSize: '1.5rem' }}>{SHAPES[i]}</span>
                      <span>{choice}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center mb-8">
              <p className="font-black" style={{ fontSize: '1.5rem', color: 'rgba(240,244,255,0.3)' }}>
                📱 Buzzez sur votre téléphone !
              </p>
            </div>
          )}

          {/* Timer */}
          {!buzz && !room.is_paused && (
            <div className="flex justify-center mb-4">
              <BigTimer key={timerKey} duration={room.timer_duration} running={!room.is_paused && !buzz}
                onExpire={() => { if (myPlayer.is_host) revealQCMAndNext(); }} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
