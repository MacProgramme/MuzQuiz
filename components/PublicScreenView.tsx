// components/PublicScreenView.tsx
"use client";

import { useEffect, useState } from 'react';
import { Room, Player, Buzz, QCMAnswer, BuzzQuestion, QCMQuestion } from '@/types';
import { MuzquizLogo } from '@/components/MuzquizLogo';

const COLORS = ['#FF00AA', '#00E5D1', '#8B5CF6', '#F59E0B'];
const LABELS = ['A', 'B', 'C', 'D'];

/* Moustache SVG — identique à PhoneControllerView */
function MustacheIcon({ color = '#fff', size = 48 }: { color?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 1280 640"
      style={{ width: size, height: size * 0.5, flexShrink: 0, filter: `drop-shadow(0 0 8px ${color}99)` }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(0,640) scale(0.1,-0.1)" fill={color} stroke="none">
        <path d="M5078 4980 c-350 -37 -700 -176 -1079 -431 -212 -142 -402 -292 -804 -634 -426 -362 -624 -510 -885 -657 -301 -171 -525 -263 -788 -325 -100 -23 -139 -27 -262 -27 -124 0 -154 3 -204 22 -89 33 -137 65 -199 132 -97 104 -150 250 -151 410 -1 116 23 178 91 241 79 72 155 100 443 162 132 28 199 56 246 104 63 63 41 97 -104 158 -158 66 -295 85 -442 61 -288 -47 -514 -194 -699 -452 -254 -356 -307 -752 -151 -1116 295 -687 1406 -1140 2966 -1209 818 -36 1849 104 2378 322 193 79 297 142 532 321 76 58 233 136 309 153 84 20 192 23 224 6 13 -7 62 -41 110 -76 806 -589 2529 -867 4021 -649 664 97 1218 291 1600 562 118 83 298 262 368 364 237 347 265 713 82 1078 -96 191 -259 388 -429 516 -97 74 -276 165 -366 188 -194 49 -363 16 -487 -94 -52 -46 -108 -124 -108 -152 0 -40 130 -81 426 -137 166 -31 240 -59 302 -115 100 -91 119 -254 46 -399 -30 -58 -144 -180 -241 -258 -208 -165 -447 -201 -728 -107 -97 32 -275 122 -376 190 -119 80 -514 380 -1009 767 -212 166 -456 352 -542 414 -513 365 -931 561 -1363 638 -112 20 -162 23 -360 23 -175 0 -253 -4 -325 -18 -230 -42 -451 -114 -659 -213 -152 -73 -166 -73 -301 0 -203 109 -468 198 -672 226 -114 16 -311 21 -410 11z"/>
      </g>
    </svg>
  );
}

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
  // En mode écran public, l'hôte ne joue pas → exclure du classement
  const sorted = [...players].filter(p => !p.is_host).sort((a, b) => b.score - a.score);
  const answeredIds = new Set(qcmAnswers.map(a => a.player_id));
  const answeredCount = answeredIds.size;
  const buzzerPlayer = players.find(p => p.id === buzz?.player_id);

  /* ===== SALLE D'ATTENTE ===== */
  if (room.status === 'waiting') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>
        <MuzquizLogo width={200} textSize="3.5rem" animate />
        <p className="text-lg mb-10" style={{ color: 'rgba(240,244,255,0.4)' }}>
          {room.mode === 'qcm' ? 'Quiz Blind Test' : 'Buzz Quiz'} · Mode écran public
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

        {/* Liste des joueurs (hôte exclu — il n'est pas un joueur) */}
        <div className="flex flex-wrap gap-3 justify-center max-w-3xl mb-10 px-8">
          {players.filter(p => !p.is_host).length === 0 ? (
            <p style={{ color: 'rgba(240,244,255,0.3)' }}>En attente de joueurs…</p>
          ) : players.filter(p => !p.is_host).map(p => (
            <div key={p.id} className="px-5 py-2 rounded-xl font-bold text-lg"
              style={{ background: 'rgba(255,255,255,0.07)', color: '#F0F4FF', border: '1px solid rgba(255,255,255,0.1)' }}>
              {p.nickname}
            </div>
          ))}
        </div>

        {/* Bouton démarrer (hôte) */}
        {myPlayer.is_host && players.filter(p => !p.is_host).length >= 1 && (
          <button onClick={startGame}
            className="muz-btn-pink px-14 py-5 rounded-2xl font-black"
            style={{ fontSize: '1.5rem' }}>
            {(() => { const n = players.filter(p => !p.is_host).length; return `Lancer la partie (${n} joueur${n > 1 ? 's' : ''}) →`; })()}
          </button>
        )}
        {myPlayer.is_host && players.filter(p => !p.is_host).length === 0 && (
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
          <MuzquizLogo width={50} textSize="1rem" horizontal />
          <span className="text-base font-bold" style={{ color: 'rgba(240,244,255,0.4)' }}>
            Question {(room.current_question ?? 0) + 1} · {answeredCount}/{players.filter(p => !p.is_host).length} ont répondu
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
                  background: isCorrect ? 'rgba(0,229,209,0.25)' : isWrong ? 'rgba(255,255,255,0.04)' : COLORS[i] + 'cc',
                  opacity: isWrong ? 0.35 : 1,
                  border: `3px solid ${isCorrect ? '#00E5D1' : 'transparent'}`,
                  boxShadow: isCorrect ? '0 0 30px rgba(0,229,209,0.4)' : 'none',
                  minHeight: '110px',
                }}>
                <MustacheIcon color={isCorrect ? '#00E5D1' : 'white'} size={56} />
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
          <MuzquizLogo width={50} textSize="1rem" horizontal />
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
                {buzzerPlayer.nickname} a buzzé !
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
                        background: isCorrect ? 'rgba(0,229,209,0.25)' : isWrong ? 'rgba(255,0,170,0.2)' : isChosen ? COLORS[i] : COLORS[i] + '66',
                        fontSize: '1.2rem',
                        border: isChosen ? '3px solid white' : isCorrect ? '3px solid #00E5D1' : '3px solid transparent',
                        boxShadow: isCorrect ? '0 0 20px rgba(0,229,209,0.4)' : 'none',
                      }}>
                      <MustacheIcon color={isCorrect ? '#00E5D1' : 'white'} size={40} />
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
