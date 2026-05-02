// components/PhoneControllerView.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { Room, Player, Buzz, QCMAnswer, BuzzQuestion, QCMQuestion, isBuzzMechanic } from '@/types';
import { MuzquizLogo } from '@/components/MuzquizLogo';
import { MustacheMedal, MEDAL_COLORS } from '@/components/MustacheMedal';

const COLORS = ['#FF00AA', '#00E5D1', '#8B5CF6', '#F59E0B'];
const LABELS = ['A', 'B', 'C', 'D'];

// Moustache SVG — même style que QCMChoices.tsx
function MustacheIcon({ color = '#fff', size = 36, animate = false }: { color?: string; size?: number; animate?: boolean }) {
  return (
    <svg
      viewBox="0 0 1280 640"
      className={animate ? 'muz-mustache-anim' : ''}
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
  myPlayer: Player;
  players: Player[];
  buzz: Buzz | null;
  qcmAnswers: QCMAnswer[];
  qcmRevealed: boolean;
  showLeaderboard: boolean;
  currentQuestion: BuzzQuestion | QCMQuestion | null;
  pressBuzzer: () => void;
  submitQCMAnswer: (index: number) => void;
  questionStartedAt?: number;
}

// Preview animé du score potentiel en temps réel
export function ScorePreview({ questionStartedAt, timerDuration, isPaused = false }: { questionStartedAt: number; timerDuration: number; isPaused?: boolean }) {
  const [pts, setPts] = useState(100);
  // Garder en mémoire le temps écoulé quand on met en pause
  const pausedElapsedRef = useRef<number | null>(null);

  useEffect(() => {
    const totalMs = timerDuration * 1000;

    if (isPaused) {
      // Figer la valeur courante — ne plus la mettre à jour
      if (pausedElapsedRef.current === null) {
        pausedElapsedRef.current = Math.max(0, Date.now() - questionStartedAt);
      }
      return;
    }

    // Reprendre : oublier l'instant de pause
    pausedElapsedRef.current = null;

    const tick = () => {
      const elapsed = Math.max(0, Date.now() - questionStartedAt);
      const ratio = Math.min(1, elapsed / totalMs);
      setPts(Math.max(20, Math.round(100 - 80 * ratio)));
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [questionStartedAt, timerDuration, isPaused]);

  // Couleur glisse du cyan (100 pts) au magenta (20 pts)
  const ratio = (100 - pts) / 80;
  const r = Math.round(0 + 255 * ratio);
  const g = Math.round(229 - 229 * ratio);
  const b = Math.round(209 + (170 - 209) * ratio);
  const color = `rgb(${r},${g},${b})`;

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full"
      style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${color}44` }}>
      <span className="text-xs font-bold" style={{ color: 'rgba(240,244,255,0.4)' }}>Si tu réponds maintenant :</span>
      <span className="text-lg font-black tabular-nums" style={{ color, textShadow: `0 0 12px ${color}88` }}>
        +{pts} pts
      </span>
    </div>
  );
}

/* ---- Compte à rebours visible après avoir répondu ---- */
export function RemainingTimer({ questionStartedAt, timerDuration, isPaused = false }: { questionStartedAt: number; timerDuration: number; isPaused?: boolean }) {
  const [remaining, setRemaining] = useState(timerDuration);

  useEffect(() => {
    if (isPaused) return;
    const tick = () => {
      const elapsed = (Date.now() - questionStartedAt) / 1000;
      setRemaining(Math.max(0, Math.ceil(timerDuration - elapsed)));
    };
    tick();
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, [questionStartedAt, timerDuration, isPaused]);

  const ratio = remaining / timerDuration;
  const color = remaining <= 5 ? '#FF00AA' : remaining <= 10 ? '#F59E0B' : '#00E5D1';

  return (
    <div className="flex flex-col items-center gap-1 mt-2">
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(240,244,255,0.35)' }}>
        Temps restant
      </p>
      <span
        className={`font-black tabular-nums text-4xl ${remaining <= 5 ? 'animate-pulse' : ''}`}
        style={{ color, textShadow: remaining <= 5 ? `0 0 20px ${color}` : 'none', fontFamily: 'var(--font-black-han)' }}
      >
        {remaining}s
      </span>
      <div className="h-2 rounded-full overflow-hidden mt-1" style={{ width: 160, background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full transition-all duration-200"
          style={{ width: `${ratio * 100}%`, background: color, boxShadow: `0 0 8px ${color}88` }}
        />
      </div>
    </div>
  );
}

export function PhoneControllerView({
  room, myPlayer, players, buzz, qcmAnswers, qcmRevealed, showLeaderboard,
  currentQuestion, pressBuzzer, submitQCMAnswer, questionStartedAt,
}: Props) {
  const myAnswer = qcmAnswers.find(a => a.player_id === myPlayer.id);
  const myRank = [...players].sort((a, b) => b.score - a.score)
    .findIndex(p => p.id === myPlayer.id) + 1;
  const hasBuzzed = buzz?.player_id === myPlayer.id;
  const someoneBuzzed = !!buzz;
  const buzzerName = players.find(p => p.id === buzz?.player_id)?.nickname ?? 'Quelqu\'un';

  /* ---- ATTENTE ---- */
  if (room.status === 'waiting') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 muz-fade-in"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>
        <div className="mb-5 muz-shake"><MuzquizLogo width={88} showText={false} /></div>
        <h1 className="text-2xl font-black mb-2 text-center muz-fade-in-1" style={{ color: '#F0F4FF' }}>
          Prêt à jouer !
        </h1>
        <p className="text-lg font-black mb-1 muz-fade-in-2" style={{ color: '#8B5CF6' }}>{myPlayer.nickname}</p>
        <p className="text-sm text-center muz-fade-in-3" style={{ color: 'rgba(240,244,255,0.4)' }}>
          En attente que l'hôte lance la partie…
        </p>
        <div className="mt-10 flex items-center gap-3 muz-fade-in-4">
          {['#FF00AA', '#8B5CF6', '#00E5D1'].map((c, i) => (
            <div key={i} className="w-3 h-3 rounded-full animate-bounce"
              style={{ background: c, animationDelay: `${i * 180}ms`, boxShadow: `0 0 10px ${c}88` }} />
          ))}
        </div>
      </div>
    );
  }

  /* ---- TERMINÉE ---- */
  if (room.status === 'finished') {
    const rankColor = myRank <= 3 ? MEDAL_COLORS[myRank as 1|2|3].fill : 'rgba(240,244,255,0.5)';
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>
        <div className="mb-4 flex justify-center">
          {myRank <= 3
            ? <MustacheMedal rank={myRank as 1|2|3} width={100} />
            : <span className="font-black text-5xl" style={{ color: rankColor }}>#{myRank}</span>
          }
        </div>
        <h1 className="text-3xl font-black mb-2" style={{ color: '#F0F4FF' }}>
          {myRank === 1 ? 'Victoire !' : 'Partie terminée !'}
        </h1>
        <p className="text-2xl font-black mb-3" style={{ color: '#8B5CF6' }}>{myPlayer.score} pts</p>
        <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>
          {myRank}e sur {players.length} joueur{players.length > 1 ? 's' : ''}
        </p>
      </div>
    );
  }

  /* ---- CLASSEMENT INTER-QUESTION ---- */
  if (showLeaderboard) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>
        <p className="text-sm font-bold uppercase tracking-widest mb-3"
          style={{ color: 'rgba(240,244,255,0.4)' }}>Ton score</p>
        <div className="text-6xl font-black mb-3" style={{ color: '#F59E0B' }}>{myPlayer.score}</div>
        <div className="text-2xl font-black px-5 py-2 rounded-full"
          style={{ background: 'rgba(139,92,246,0.15)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.3)' }}>
          #{myRank}
        </div>
      </div>
    );
  }

  /* ---- MODE BUZZ / BUZZ_QUIZ / BUZZ_BLIND_TEST ---- */
  if (isBuzzMechanic(room.mode)) {
    // Quelqu'un d'autre a buzzé
    if (someoneBuzzed && !hasBuzzed) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-4"
          style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>
          <div className="mb-2"><MuzquizLogo width={80} showText={false} /></div>
          <p className="text-2xl font-black text-center" style={{ color: '#FF00AA' }}>
            {buzzerName} a buzzé en premier !
          </p>
          <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>En attente de sa réponse…</p>
          {questionStartedAt !== undefined && (
            <RemainingTimer questionStartedAt={questionStartedAt} timerDuration={room.timer_duration} isPaused={room.is_paused} />
          )}
        </div>
      );
    }

    // J'ai buzzé → je dois répondre
    if (hasBuzzed && currentQuestion) {
      const answered = !!myAnswer;
      return (
        <div className="min-h-screen flex flex-col p-4"
          style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>
          <div className="flex items-center justify-between pt-4 pb-6">
            <p className="text-xs font-bold" style={{ color: 'rgba(240,244,255,0.4)' }}>{myPlayer.nickname}</p>
            <div className="px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,0,170,0.15)', color: '#FF00AA', border: '1px solid rgba(255,0,170,0.3)' }}>
              <p className="text-xs font-black">Vous avez buzzé !</p>
            </div>
          </div>

          {answered ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              {qcmRevealed && myAnswer?.is_correct ? (
                <>
                  <MustacheIcon color="#00E5D1" size={80} animate />
                  <p className="text-2xl font-black" style={{ color: '#00E5D1' }}>Bonne réponse !</p>
                </>
              ) : qcmRevealed ? (
                <>
                  <MuzquizLogo width={80} showText={false} />
                  <p className="text-2xl font-black" style={{ color: '#FF00AA' }}>Pas tout à fait…</p>
                </>
              ) : (
                /* Réponse envoyée — afficher la bonne réponse en attendant la révélation */
                <div className="flex-1 flex flex-col gap-3 w-full">
                  {questionStartedAt !== undefined && (
                    <div className="flex justify-center mb-1">
                      <RemainingTimer questionStartedAt={questionStartedAt} timerDuration={room.timer_duration} isPaused={room.is_paused} />
                    </div>
                  )}
                  <p className="text-center text-sm font-black mb-1"
                    style={{ color: myAnswer?.is_correct ? '#00E5D1' : '#FF00AA' }}>
                    {myAnswer?.is_correct ? '✓ Bonne réponse !' : '✗ Mauvaise réponse'}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {currentQuestion.choices.map((choice, i) => {
                      const isCorrect  = i === currentQuestion.correct;
                      const isSelected = i === myAnswer?.answer_index;
                      const isWrong    = isSelected && !isCorrect;
                      let bg = 'rgba(255,255,255,0.04)'; let border = 'rgba(255,255,255,0.08)';
                      let textColor = 'rgba(240,244,255,0.3)'; let opacity = 0.4;
                      if (isCorrect)     { bg = 'rgba(0,229,209,0.15)';  border = '#00E5D1'; textColor = '#00E5D1'; opacity = 1; }
                      else if (isWrong)  { bg = 'rgba(255,0,170,0.12)';  border = '#FF00AA'; textColor = '#FF00AA'; opacity = 1; }
                      return (
                        <div key={i} className="flex items-center gap-2 px-3 py-3 rounded-2xl"
                          style={{ background: bg, border: `1.5px solid ${border}`, opacity }}>
                          <span className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0"
                            style={{ background: isCorrect ? '#00E5D1' : isWrong ? '#FF00AA' : 'rgba(255,255,255,0.08)', color: (isCorrect || isWrong) ? '#0D1B3E' : 'rgba(240,244,255,0.4)' }}>
                            {isCorrect ? '✓' : isWrong ? '✗' : LABELS[i]}
                          </span>
                          <span className="text-xs font-bold leading-tight break-words" style={{ color: textColor }}>{choice}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {questionStartedAt !== undefined && (
                <div className="flex justify-center mb-2">
                  <RemainingTimer questionStartedAt={questionStartedAt} timerDuration={room.timer_duration} isPaused={room.is_paused} />
                </div>
              )}
              <p className="text-center font-bold mb-4" style={{ color: 'rgba(240,244,255,0.5)' }}>
                Choisissez votre réponse
              </p>
              <div className="grid grid-cols-2 gap-4 flex-1">
                {currentQuestion.choices.map((choice, i) => (
                  <button key={i}
                    onClick={() => submitQCMAnswer(i)}
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl p-4 font-black text-white active:scale-95 transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${COLORS[i]}cc, ${COLORS[i]})`,
                      minHeight: '90px',
                      boxShadow: `0 4px 24px ${COLORS[i]}55`,
                    }}>
                    <span className="text-xs font-black uppercase tracking-wider opacity-80">{LABELS[i]}</span>
                    <span className="text-sm text-center leading-tight break-words w-full">{choice}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      );
    }

    // Personne n'a encore buzzé → gros bouton buzz
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>
        <div className="flex items-center justify-between w-full max-w-sm mb-10">
          <p className="text-sm font-bold" style={{ color: 'rgba(240,244,255,0.5)' }}>{myPlayer.nickname}</p>
        </div>
        <button
          onClick={pressBuzzer}
          className="w-56 h-56 rounded-full font-black text-white flex flex-col items-center justify-center gap-2 active:scale-95 transition-all"
          style={{
            background: 'linear-gradient(135deg, #FF00AA, #8B5CF6)',
            boxShadow: '0 0 60px rgba(255,0,170,0.5), 0 0 120px rgba(255,0,170,0.2)',
            fontSize: '2rem',
          }}>
          <MuzquizLogo width={56} showText={false} />
          <span className="text-2xl font-black">BUZZ !</span>
        </button>
        {questionStartedAt !== undefined && (
          <div className="mt-6">
            <ScorePreview questionStartedAt={questionStartedAt} timerDuration={room.timer_duration} isPaused={room.is_paused} />
          </div>
        )}
      </div>
    );
  }

  /* ---- MODE QCM ---- */
  const answered = !!myAnswer;

  // Déjà répondu + révélé
  if (qcmRevealed && answered) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-4"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>
        {myAnswer.is_correct ? (
          <>
            <MustacheIcon color="#00E5D1" size={100} animate />
            <h1 className="text-3xl font-black" style={{ color: '#00E5D1' }}>Bonne réponse !</h1>
          </>
        ) : (
          <>
            <span className="text-7xl">❌</span>
            <h1 className="text-2xl font-black" style={{ color: '#FF00AA' }}>Pas tout à fait…</h1>
          </>
        )}
      </div>
    );
  }

  // Réponse envoyée, en attente de la révélation — afficher la bonne réponse
  if (answered && currentQuestion) {
    return (
      <div className="min-h-screen flex flex-col p-6 gap-4"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>
        {questionStartedAt !== undefined && (
          <div className="flex justify-center mt-4">
            <RemainingTimer questionStartedAt={questionStartedAt} timerDuration={room.timer_duration} isPaused={room.is_paused} />
          </div>
        )}
        <p className="text-center text-base font-black"
          style={{ color: myAnswer?.is_correct ? '#00E5D1' : '#FF00AA' }}>
          {myAnswer?.is_correct ? '✓ Bonne réponse !' : '✗ Mauvaise réponse'}
        </p>
        <div className="grid grid-cols-2 gap-3 flex-1">
          {currentQuestion.choices.map((choice, i) => {
            const isCorrect  = i === currentQuestion.correct;
            const isSelected = i === myAnswer?.answer_index;
            const isWrong    = isSelected && !isCorrect;
            let bg = 'rgba(255,255,255,0.04)'; let border = 'rgba(255,255,255,0.08)';
            let textColor = 'rgba(240,244,255,0.3)'; let opacity = 0.35;
            if (isCorrect)    { bg = 'rgba(0,229,209,0.15)';  border = '#00E5D1'; textColor = '#00E5D1'; opacity = 1; }
            else if (isWrong) { bg = 'rgba(255,0,170,0.12)';  border = '#FF00AA'; textColor = '#FF00AA'; opacity = 1; }
            return (
              <div key={i} className="flex items-center gap-2 px-3 py-3 rounded-2xl"
                style={{ background: bg, border: `1.5px solid ${border}`, opacity }}>
                <span className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0"
                  style={{ background: isCorrect ? '#00E5D1' : isWrong ? '#FF00AA' : 'rgba(255,255,255,0.08)', color: (isCorrect || isWrong) ? '#0D1B3E' : 'rgba(240,244,255,0.4)' }}>
                  {isCorrect ? '✓' : isWrong ? '✗' : LABELS[i]}
                </span>
                <span className="text-xs font-bold leading-tight break-words" style={{ color: textColor }}>{choice}</span>
              </div>
            );
          })}
        </div>
        <p className="text-center text-xs pb-2" style={{ color: 'rgba(240,244,255,0.25)' }}>
          En attente des autres joueurs…
        </p>
      </div>
    );
  }

  // Pas encore répondu → 4 gros boutons avec moustaches
  return (
    <div className="min-h-screen flex flex-col p-4"
      style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>
      {/* Header */}
      <div className="flex items-center justify-between pt-4 pb-6">
        <div>
          <p className="text-xs font-bold" style={{ color: 'rgba(240,244,255,0.4)' }}>{myPlayer.nickname}</p>
        </div>
        <p className="text-sm font-bold" style={{ color: 'rgba(240,244,255,0.4)' }}>
          Q{(room.current_question ?? 0) + 1}
        </p>
      </div>

      {questionStartedAt !== undefined && (
        <div className="mb-3">
          <ScorePreview questionStartedAt={questionStartedAt} timerDuration={room.timer_duration} />
        </div>
      )}

      <p className="text-center font-bold mb-5" style={{ color: 'rgba(240,244,255,0.5)' }}>
        Choisissez votre réponse
      </p>

      {/* 2×2 grille de boutons avec moustaches */}
      <div className="grid grid-cols-2 gap-4 flex-1">
        {currentQuestion?.choices.map((choice, i) => (
          <button key={i}
            onClick={() => submitQCMAnswer(i)}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl p-4 font-black text-white active:scale-95 transition-all"
            style={{
              background: `linear-gradient(135deg, ${COLORS[i]}cc, ${COLORS[i]})`,
              minHeight: '90px',
              boxShadow: `0 4px 24px ${COLORS[i]}55`,
            }}>
            <span className="text-xs font-black uppercase tracking-wider opacity-70">{LABELS[i]}</span>
            <span className="text-sm text-center leading-tight break-words w-full">{choice}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
