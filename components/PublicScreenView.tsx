// components/PublicScreenView.tsx
"use client";

import { useEffect, useState } from 'react';
import { Room, Player, Buzz, QCMAnswer, BuzzQuestion, QCMQuestion, isBuzzMechanic, isBlindTestMode } from '@/types';
import { MuzquizLogo } from '@/components/MuzquizLogo';
import { MustacheMedal } from '@/components/MustacheMedal';
import { RoomQRCode } from '@/components/RoomQRCode';
import { QuestionImage } from '@/components/QuestionImage';
import { YouTubePlayer } from '@/components/YouTubePlayer';

const COLORS = ['#FF00AA', '#00E5D1', '#8B5CF6', '#F59E0B'];
const LABELS = ['A', 'B', 'C', 'D'];

/* ── Confettis ── */
const CONFETTI_COLORS = ['#FF00AA', '#00E5D1', '#8B5CF6', '#F59E0B', '#FF6B6B', '#4ECDC4', '#FFE66D'];
const CONFETTI_PIECES = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
  delay: (Math.random() * 0.9).toFixed(2),
  dur: (1.6 + Math.random() * 1).toFixed(2),
  size: Math.round(Math.random() * 12 + 6),
  isCircle: Math.random() > 0.4,
}));

function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {CONFETTI_PIECES.map(p => (
        <div key={p.id} className="muz-confetti"
          style={{
            left: `${p.x}%`, top: '-16px',
            width: p.size, height: p.size,
            background: p.color,
            borderRadius: p.isCircle ? '50%' : '2px',
            ['--cdel' as any]: `${p.delay}s`,
            ['--cdur' as any]: `${p.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

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
  totalQuestions: number;
  hostPacks: { id: string; name: string; mode: string; question_count: number }[];
  selectPack: (packId: string | null, packMode?: string) => Promise<void>;
  startGame: () => void;
  revealQCMAndNext: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  hostInviteCode?: string | null;
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
  showLeaderboard, timerKey, totalQuestions, hostPacks, selectPack,
  startGame, revealQCMAndNext, pauseGame, resumeGame, endGame,
  hostInviteCode,
}: Props) {
  const displayCode = hostInviteCode ?? room.code;
  // En mode écran public, l'hôte ne joue pas → exclure du classement
  const sorted = [...players].filter(p => !p.is_host).sort((a, b) => b.score - a.score);
  const answeredIds = new Set(qcmAnswers.map(a => a.player_id));
  const answeredCount = answeredIds.size;
  const buzzerPlayer = players.find(p => p.id === buzz?.player_id);

  // Dropdown sélecteur de pack
  const [packDropdownOpen, setPackDropdownOpen] = useState(false);
  const [packSearch, setPackSearch] = useState('');

  /* ===== SALLE D'ATTENTE ===== */
  if (room.status === 'waiting') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center muz-fade-in"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>
        <MuzquizLogo width={200} textSize="3.5rem" animate />
        <p className="text-lg mb-10" style={{ color: 'rgba(240,244,255,0.4)' }}>
          {isBuzzMechanic(room.mode) ? 'Buzz Quiz' : 'Quiz Blind Test'} · Mode écran public
        </p>

        {/* Code + QR côte à côte */}
        <div className="flex items-center gap-8 mb-10">
          {/* Grand code salle */}
          <div className="px-14 py-7 rounded-3xl muz-code-pulse"
            style={{ background: 'rgba(0,229,209,0.06)', border: '2px solid rgba(0,229,209,0.3)' }}>
            <p className="text-sm font-black uppercase tracking-widest text-center mb-2" style={{ color: 'rgba(0,229,209,0.6)' }}>
              CODE DE LA SALLE
            </p>
            <p className="font-black font-mono tracking-[0.3em]" style={{ fontSize: '4.5rem', color: '#00E5D1', lineHeight: 1 }}>
              {displayCode}
            </p>
            <p className="text-sm text-center mt-3" style={{ color: 'rgba(240,244,255,0.35)' }}>
              muzquiz.app
            </p>
          </div>

          {/* Séparateur */}
          <div style={{ color: 'rgba(240,244,255,0.15)', fontSize: '1.5rem', fontWeight: 900 }}>ou</div>

          {/* QR code */}
          <div className="flex flex-col items-center gap-3 muz-zoom-in" style={{ animationDelay: '0.15s' }}>
            <div className="rounded-2xl p-3" style={{ background: '#F0F4FF' }}>
              <RoomQRCode code={displayCode} size={160} />
            </div>
            <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(0,229,209,0.6)' }}>
              Scanner avec l'appareil photo
            </p>
          </div>
        </div>

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

        {/* Sélecteur de pack (hôte uniquement) — même dropdown que le mode normal */}
        {myPlayer.is_host && hostPacks.length > 0 && (
          <div className="w-full max-w-xl px-4 mb-6">
            <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3 text-center" style={{ color: 'rgba(240,244,255,0.4)' }}>
                Questions personnalisées
              </p>
              <div className="relative">
                <button
                  onClick={() => setPackDropdownOpen(v => !v)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all hover:opacity-90"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(139,92,246,0.3)', color: '#F0F4FF' }}>
                  <span className="flex-1 text-sm font-bold truncate"
                    style={{ color: room.pack_id ? '#FF00AA' : '#8B5CF6' }}>
                    {room.pack_id ? (hostPacks.find(p => p.id === room.pack_id)?.name ?? 'Pack sélectionné') : 'Questions MUZQUIZ (défaut)'}
                  </span>
                  <span style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.9rem' }}>
                    {packDropdownOpen ? '▲' : '▼'}
                  </span>
                </button>
                {packDropdownOpen && (
                  <div className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden z-20"
                    style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(13,27,62,0.98)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                    {hostPacks.length > 4 && (
                      <div className="p-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                        <input
                          autoFocus
                          value={packSearch}
                          onChange={e => setPackSearch(e.target.value)}
                          placeholder="Rechercher un pack…"
                          className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#F0F4FF' }}
                        />
                      </div>
                    )}
                    <div className="max-h-52 overflow-y-auto">
                      <button
                        onClick={() => { selectPack(null); setPackDropdownOpen(false); setPackSearch(''); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all hover:bg-white/5">
                        <span className="text-sm font-bold" style={{ color: !room.pack_id ? '#8B5CF6' : '#F0F4FF' }}>
                          Questions MUZQUIZ (défaut)
                        </span>
                        {!room.pack_id && <span className="ml-auto text-xs font-black" style={{ color: '#8B5CF6' }}>✓</span>}
                      </button>
                      {hostPacks
                        .filter(p => {
                          const roomIsBlind = isBlindTestMode(room.mode as any);
                          const packIsBlind = isBlindTestMode(p.mode as any);
                          return roomIsBlind === packIsBlind;
                        })
                        .filter(p => packSearch.trim() === '' || p.name.toLowerCase().includes(packSearch.toLowerCase()))
                        .map(pack => (
                          <button key={pack.id}
                            onClick={() => { selectPack(pack.id, pack.mode); setPackDropdownOpen(false); setPackSearch(''); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all hover:bg-white/5">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold truncate" style={{ color: room.pack_id === pack.id ? '#FF00AA' : '#F0F4FF' }}>
                                {pack.name}
                              </p>
                              <p className="text-xs" style={{ color: 'rgba(240,244,255,0.35)' }}>
                                {pack.question_count} questions
                              </p>
                            </div>
                            {room.pack_id === pack.id && <span className="text-xs font-black" style={{ color: '#FF00AA' }}>✓</span>}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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
          Classement
        </h2>
        <div className="flex flex-col gap-4 w-full max-w-2xl">
          {sorted.slice(0, 5).map((p, i) => (
            <div key={p.id} className="flex items-center gap-5 px-8 py-5 rounded-2xl"
              style={{
                background: i === 0 ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${i === 0 ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.07)'}`,
              }}>
              <div style={{ minWidth: '3rem', display: 'flex', alignItems: 'center' }}>
                {i < 3
                  ? <MustacheMedal rank={(i + 1) as 1|2|3} width={52} />
                  : <span className="font-black" style={{ fontSize: '1.5rem', color: 'rgba(240,244,255,0.5)' }}>#{i + 1}</span>
                }
              </div>
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
          Résultats finaux
        </h1>
        <div className="flex flex-col gap-4 w-full max-w-2xl">
          {sorted.map((p, i) => (
            <div key={p.id} className="flex items-center gap-5 px-8 py-4 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ minWidth: '3rem', display: 'flex', alignItems: 'center' }}>
                {i < 3
                  ? <MustacheMedal rank={(i + 1) as 1|2|3} width={44} />
                  : <span className="font-black" style={{ fontSize: '1.3rem', color: 'rgba(240,244,255,0.5)' }}>#{i + 1}</span>
                }
              </div>
              <span className="flex-1 font-black" style={{ fontSize: '1.3rem', color: '#F0F4FF' }}>{p.nickname}</span>
              <span className="font-black" style={{ fontSize: '1.3rem', color: '#8B5CF6' }}>{p.score} pts</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  /* ===== MODE QCM / QUIZ / BLIND TEST — EN JEU ===== */
  if (!isBuzzMechanic(room.mode)) {
    const answerCounts = currentQuestion.choices.map((_, i) =>
      qcmAnswers.filter(a => a.answer_index === i).length
    );
    return (
      <div className="min-h-screen flex flex-col"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>

        {/* Confettis */}
        <Confetti active={qcmRevealed} />

        {/* Overlay PAUSE */}
        {room.is_paused && (
          <>
            <div className="fixed inset-0 z-30 pointer-events-none"
              style={{ backdropFilter: 'blur(8px)', background: 'rgba(13,27,62,0.6)' }} />
            <div className="fixed inset-0 z-40 flex items-center justify-center">
              <div className="px-16 py-10 rounded-3xl text-center"
                style={{ background: 'rgba(13,27,62,0.97)', border: '2px solid rgba(245,158,11,0.5)', boxShadow: '0 0 60px rgba(245,158,11,0.2)' }}>
                <MuzquizLogo width={100} showText={false} />
                <p className="font-black mt-4" style={{ fontSize: '3rem', color: '#F59E0B' }}>⏸ PAUSE</p>
                {myPlayer.is_host && (
                  <button onClick={resumeGame}
                    className="mt-6 px-10 py-4 rounded-2xl font-black text-xl"
                    style={{ background: 'rgba(0,229,209,0.2)', color: '#00E5D1', border: '2px solid rgba(0,229,209,0.5)' }}>
                    ▶ Reprendre
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Barre du haut */}
        <div className="flex items-center justify-between px-8 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <MuzquizLogo width={50} textSize="1rem" horizontal />
          <div className="flex items-center gap-4">
            <span className="text-base font-bold px-4 py-1.5 rounded-full"
              style={{ background: 'rgba(139,92,246,0.15)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.3)' }}>
              Q {(room.current_question ?? 0) + 1} / {totalQuestions}
            </span>
            <span className="text-base font-bold" style={{ color: 'rgba(240,244,255,0.4)' }}>
              {answeredCount}/{players.filter(p => !p.is_host).length} ont répondu
            </span>
          </div>
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
                Pause
              </button>
            )}
            <button onClick={endGame}
              className="px-4 py-2 rounded-xl font-bold text-sm"
              style={{ background: 'rgba(255,0,170,0.08)', color: 'rgba(255,0,170,0.6)', border: '1px solid rgba(255,0,170,0.2)' }}>
              Terminer
            </button>
          </div>
        </div>

        {/* Lecteur audio (blind test) */}
        {(currentQuestion as any).youtube_url && isBlindTestMode(room.mode) && (
          <div className="px-12 pb-2 max-w-xl mx-auto w-full">
            <YouTubePlayer url={(currentQuestion as any).youtube_url} autoPlay />
          </div>
        )}

        {/* Image de question (QCM mode) */}
        {(currentQuestion as any).image_url && (currentQuestion as any).question_type !== 'normal' && (
          <div className="px-12 pb-2">
            <QuestionImage
              imageUrl={(currentQuestion as any).image_url}
              questionType={(currentQuestion as any).question_type}
              timerKey={timerKey}
              timerDuration={room.timer_duration}
              isPaused={room.is_paused}
              large
            />
          </div>
        )}

        {/* Question */}
        <div className="flex items-center justify-center px-12 py-8" style={{ minHeight: (currentQuestion as any).image_url ? '120px' : '200px' }}>
          <p className="font-black text-center leading-tight"
            style={{ fontSize: '2.5rem', color: '#F0F4FF', maxWidth: '900px' }}>
            {currentQuestion.q}
          </p>
        </div>

        {/* Timer */}
        <div className="flex justify-center mb-6">
          {!qcmRevealed && !room.is_paused && (
            <BigTimer key={timerKey} duration={room.timer_duration} running={true}
              onExpire={() => { if (myPlayer.is_host) revealQCMAndNext(); }} />
          )}
        </div>

        {/* Grille de réponses 2×2 */}
        <div className="grid grid-cols-2 gap-5 px-8 pb-6 flex-1">
          {currentQuestion.choices.map((choice, i) => {
            const isCorrect = qcmRevealed && i === currentQuestion.correct;
            const isWrong = qcmRevealed && i !== currentQuestion.correct;
            const count = answerCounts[i];
            return (
              <div key={i} className="flex items-center gap-4 rounded-2xl px-8 py-5 transition-all"
                style={{
                  background: isCorrect ? 'rgba(0,229,209,0.25)' : isWrong ? 'rgba(255,255,255,0.04)' : COLORS[i] + 'cc',
                  opacity: isWrong ? 0.35 : 1,
                  border: `3px solid ${isCorrect ? '#00E5D1' : 'transparent'}`,
                  boxShadow: isCorrect ? '0 0 30px rgba(0,229,209,0.4)' : 'none',
                  minHeight: '90px',
                }}>
                <span className="font-black text-white opacity-70 flex-shrink-0" style={{ fontSize: '1.6rem' }}>
                  {LABELS[i]}
                </span>
                <span className="flex-1 font-black text-white break-words" style={{ fontSize: '1.4rem', lineHeight: 1.2 }}>
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

  /* ===== MODE BUZZ / BUZZ_QUIZ / BUZZ_BLIND_TEST — EN JEU ===== */
  if (isBuzzMechanic(room.mode)) {
    const q = currentQuestion as BuzzQuestion;
    const buzzerAnswer = qcmAnswers.find(a => a.player_id === buzzerPlayer?.id);
    return (
      <div className="min-h-screen flex flex-col"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>

        {/* Confettis */}
        <Confetti active={qcmRevealed} />

        {/* Overlay PAUSE */}
        {room.is_paused && (
          <>
            <div className="fixed inset-0 z-30 pointer-events-none"
              style={{ backdropFilter: 'blur(8px)', background: 'rgba(13,27,62,0.6)' }} />
            <div className="fixed inset-0 z-40 flex items-center justify-center">
              <div className="px-16 py-10 rounded-3xl text-center"
                style={{ background: 'rgba(13,27,62,0.97)', border: '2px solid rgba(245,158,11,0.5)', boxShadow: '0 0 60px rgba(245,158,11,0.2)' }}>
                <MuzquizLogo width={100} showText={false} />
                <p className="font-black mt-4" style={{ fontSize: '3rem', color: '#F59E0B' }}>⏸ PAUSE</p>
                {myPlayer.is_host && (
                  <button onClick={resumeGame}
                    className="mt-6 px-10 py-4 rounded-2xl font-black text-xl"
                    style={{ background: 'rgba(0,229,209,0.2)', color: '#00E5D1', border: '2px solid rgba(0,229,209,0.5)' }}>
                    ▶ Reprendre
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Barre du haut */}
        <div className="flex items-center justify-between px-8 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <MuzquizLogo width={50} textSize="1rem" horizontal />
          <span className="text-base font-bold px-4 py-1.5 rounded-full"
            style={{ background: 'rgba(139,92,246,0.15)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.3)' }}>
            Q {(room.current_question ?? 0) + 1} / {totalQuestions}
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
                Pause
              </button>
            )}
          </div>
        </div>

        {/* Lecteur audio (buzz blind test) */}
        {(currentQuestion as any).youtube_url && isBlindTestMode(room.mode) && (
          <div className="px-12 pb-2 max-w-xl mx-auto w-full">
            <YouTubePlayer url={(currentQuestion as any).youtube_url} autoPlay />
          </div>
        )}

        {/* Image de question (Buzz mode) */}
        {(currentQuestion as any).image_url && (currentQuestion as any).question_type !== 'normal' && (
          <div className="px-12 pb-2">
            <QuestionImage
              imageUrl={(currentQuestion as any).image_url}
              questionType={(currentQuestion as any).question_type}
              timerKey={timerKey}
              timerDuration={room.timer_duration}
              isPaused={room.is_paused}
              large
            />
          </div>
        )}

        {/* Question — grande */}
        <div className="flex-1 flex items-center justify-center px-12 py-8">
          <p className="font-black text-center leading-tight"
            style={{ fontSize: (currentQuestion as any).image_url ? '2.2rem' : '3rem', color: '#F0F4FF', maxWidth: '900px' }}>
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
                    <div key={i} className="flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-white"
                      style={{
                        background: isCorrect ? 'rgba(0,229,209,0.25)' : isWrong ? 'rgba(255,0,170,0.2)' : isChosen ? COLORS[i] : COLORS[i] + '66',
                        border: isChosen ? '3px solid white' : isCorrect ? '3px solid #00E5D1' : '3px solid transparent',
                        boxShadow: isCorrect ? '0 0 20px rgba(0,229,209,0.4)' : 'none',
                      }}>
                      <span className="opacity-70 flex-shrink-0 font-black" style={{ fontSize: '1.3rem' }}>{LABELS[i]}</span>
                      <span className="break-words" style={{ fontSize: '1.2rem' }}>{choice}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center mb-8">
              <p className="font-black" style={{ fontSize: '1.5rem', color: 'rgba(240,244,255,0.3)' }}>
                Buzzez sur votre téléphone !
              </p>
            </div>
          )}

          {/* Timer */}
          {!buzz && !room.is_paused && (
            <div className="flex justify-center mb-4">
              <BigTimer key={timerKey} duration={room.timer_duration} running={!buzz}
                onExpire={() => { if (myPlayer.is_host) revealQCMAndNext(); }} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
