// app/room/[code]/page.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useRoom } from '@/hooks/useRoom';
import { useRealtime } from '@/hooks/useRealtime';
import { BuzzerButton } from '@/components/BuzzerButton';
import { QCMChoices } from '@/components/QCMChoices';
import { Timer } from '@/components/Timer';
import { Scoreboard } from '@/components/Scoreboard';
import { SettingsModal } from '@/components/SettingsModal';
import { InterLeaderboard } from '@/components/InterLeaderboard';
import { BUZZ_QUESTIONS, QCM_QUESTIONS, FREE_QUESTION_LIMIT } from '@/lib/questions';
import { Buzz, QCMAnswer, Player } from '@/types';

// --- Composant countdown animé (5 secondes) ---
function RevealCountdown({ players, correctPlayerIds }: { players: Player[]; correctPlayerIds: string[] }) {
  const [count, setCount] = useState(5);
  const r = 26;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    if (count <= 0) return;
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count]);

  const offset = circ * (count / 5);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg">
      {/* Scores animés */}
      <div className="flex flex-wrap justify-center gap-3">
        {players.map(p => {
          const correct = correctPlayerIds.includes(p.id);
          return (
            <div key={p.id} className="relative flex flex-col items-center px-3 py-2 rounded-xl"
              style={{
                background: correct ? 'rgba(0,229,209,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${correct ? 'rgba(0,229,209,0.4)' : 'rgba(255,255,255,0.08)'}`,
              }}>
              <span className="text-xs font-bold" style={{ color: correct ? '#00E5D1' : 'rgba(240,244,255,0.4)' }}>
                {p.nickname}
              </span>
              {correct && (
                <span className="muz-score-float absolute -top-4 font-black text-sm"
                  style={{ color: '#00E5D1', textShadow: '0 0 10px rgba(0,229,209,0.8)' }}>
                  +100
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Cercle countdown */}
      <div className="flex flex-col items-center gap-1">
        <svg width="72" height="72" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
          <circle cx="32" cy="32" r={r} fill="none" stroke="#8B5CF6" strokeWidth="5"
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round" transform="rotate(-90 32 32)"
            style={{ transition: 'stroke-dashoffset 0.95s linear' }}
          />
          <text x="32" y="38" textAnchor="middle" fill="#F0F4FF" fontSize="20" fontWeight="900"
            style={{ fontFamily: 'var(--font-black-han)' }}>
            {count}
          </text>
        </svg>
        <p className="text-xs font-bold" style={{ color: 'rgba(240,244,255,0.35)' }}>
          prochaine question...
        </p>
      </div>
    </div>
  );
}

export default function RoomPage() {
  const { code } = useParams<{ code: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const nickname = searchParams.get('nickname') ?? 'Joueur';
  const [showSettings, setShowSettings] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showHostMenu, setShowHostMenu] = useState(false);

  // Refs pour l'auto-fermeture (évite les stale closures dans le cleanup)
  const roomRef = useRef<typeof room>(null);
  const myPlayerRef = useRef<typeof myPlayer>(null);

  const {
    room, players, myPlayer, buzz, setBuzz,
    qcmAnswers, setQcmAnswers, qcmRevealed, setQcmRevealed,
    customQuestions,
    loading, error,
    pressBuzzer, submitQCMAnswer, revealQCMAndNext,
    startGame, saveSettings,
    pauseGame, resumeGame, endGame,
    setRoom, setPlayers,
  } = useRoom(code, nickname);

  const questions = room?.pack_id
    ? customQuestions
    : room?.mode === 'qcm' ? QCM_QUESTIONS : BUZZ_QUESTIONS;
  const isFreeLimit = room ? room.current_question >= FREE_QUESTION_LIMIT : false;

  useRealtime({
    roomId: room?.id ?? '',
    onRoomUpdate: (r) => {
      setRoom(r);
      setBuzz(null);
      setQcmAnswers([]);
      setQcmRevealed(false);
      setShowLeaderboard(false);
      setTimerKey(k => k + 1);
      if (r.status === 'finished') router.push(`/room/${code}/results`);
    },
    onPlayersUpdate: setPlayers,
    onBuzz: (b: Buzz) => setBuzz(b),
    onQCMAnswer: (a: QCMAnswer) => setQcmAnswers(prev => {
      if (prev.some(x => x.id === a.id)) return prev;
      return [...prev, a];
    }),
    onNextQuestion: () => { setBuzz(null); setQcmAnswers([]); },
    onQCMReveal: () => setQcmRevealed(true),
  });

  // Afficher le classement 5s après la révélation (tous les clients, y compris l'hôte)
  useEffect(() => {
    if (!qcmRevealed) return;
    const t = setTimeout(() => setShowLeaderboard(true), 5000);
    return () => clearTimeout(t);
  }, [qcmRevealed]);

  // Auto-révéler QCM quand tous les joueurs ont répondu
  useEffect(() => {
    if (!room || room.mode !== 'qcm' || !myPlayer?.is_host || qcmRevealed) return;
    if (qcmAnswers.length >= players.length && players.length > 0) {
      revealQCMAndNext();
    }
  }, [qcmAnswers, players, room, myPlayer, qcmRevealed]);

  // Auto-révéler Buzz Quiz quand le joueur buzzé a répondu
  useEffect(() => {
    if (!room || room.mode !== 'buzz' || !buzz || !myPlayer?.is_host || qcmRevealed) return;
    if (qcmAnswers.length >= 1) {
      revealQCMAndNext();
    }
  }, [qcmAnswers, room, buzz, myPlayer, qcmRevealed]);

  // Garder les refs à jour pour le cleanup
  useEffect(() => { roomRef.current = room; }, [room]);
  useEffect(() => { myPlayerRef.current = myPlayer; }, [myPlayer]);

  // Auto-fermeture : si l'hôte quitte la page et que la salle n'est pas terminée → la fermer
  useEffect(() => {
    return () => {
      const r = roomRef.current;
      const p = myPlayerRef.current;
      if (p?.is_host && r && r.status !== 'finished') {
        supabase.from('rooms').update({ status: 'finished' }).eq('id', r.id);
      }
    };
  }, []); // uniquement au démontage

  // --- Chargement ---
  if (loading) return (
    <div className="flex items-center justify-center h-screen flex-col gap-4" style={{ background: '#0D1B3E' }}>
      <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
        style={{ borderColor: '#FF00AA', borderTopColor: 'transparent' }} />
      <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>Connexion à la salle...</p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-screen flex-col gap-4" style={{ background: '#0D1B3E' }}>
      <p className="font-bold" style={{ color: '#FF00AA' }}>{error}</p>
      <button onClick={() => router.push('/')} className="text-sm underline" style={{ color: '#8B5CF6' }}>
        Retour à l'accueil
      </button>
    </div>
  );

  if (!room || !myPlayer) return null;

  // --- Salle d'attente ---
  if (room.status === 'waiting') {
    const modeLabel = room.mode === 'qcm' ? 'Quiz Blind Test' : 'Buzz Quiz';
    const modeIcon = room.mode === 'qcm' ? '🎵' : '🔔';

    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>

        {showSettings && myPlayer.is_host && (
          <SettingsModal
            settings={{ timer_duration: room.timer_duration, max_players: room.max_players, sound_enabled: room.sound_enabled }}
            onSave={saveSettings}
            onClose={() => setShowSettings(false)}
          />
        )}

        <div className="text-center">
          <h1 className="muz-logo text-4xl font-black mb-1" style={{ fontFamily: 'var(--font-black-han)' }}>MUZQUIZ</h1>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span>{modeIcon}</span>
            <span className="font-bold" style={{ color: '#8B5CF6' }}>{modeLabel}</span>
          </div>
          <div className="mt-3 px-6 py-3 rounded-2xl inline-block"
            style={{ background: 'rgba(0,229,209,0.08)', border: '2px solid rgba(0,229,209,0.3)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(0,229,209,0.5)' }}>Code de la salle</p>
            <div className="font-black font-mono tracking-[0.25em] text-3xl" style={{ color: '#00E5D1' }}>{code}</div>
          </div>
          <p className="text-xs mt-2" style={{ color: 'rgba(240,244,255,0.3)' }}>Partage ce code avec tes amis !</p>
        </div>

        <div className="muz-card w-full max-w-md p-5">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(240,244,255,0.4)' }}>
            Joueurs ({players.length})
          </p>
          <div className="flex flex-col gap-2">
            {players.map(p => (
              <div key={p.id} className="flex items-center gap-3 py-2 rounded-xl px-3"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: p.is_host ? '#FF00AA' : '#00E5D1', boxShadow: `0 0 8px ${p.is_host ? '#FF00AA' : '#00E5D1'}` }} />
                <span className="font-bold flex-1" style={{ color: '#F0F4FF' }}>{p.nickname}</span>
                {p.is_host && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ background: 'rgba(255,0,170,0.15)', color: '#FF00AA' }}>hôte</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {myPlayer.is_host ? (
          <div className="flex gap-3">
            <button onClick={() => setShowSettings(true)}
              className="w-14 h-14 rounded-xl text-xl font-bold transition-all hover:scale-105"
              style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#8B5CF6' }}>
              ⚙️
            </button>
            <button onClick={startGame} className="muz-btn-pink px-8 py-4 rounded-xl text-base font-black">
              Lancer la partie ({players.length} joueur{players.length > 1 ? 's' : ''}) →
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-5 py-3 rounded-full"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#8B5CF6' }} />
            <p className="text-sm" style={{ color: 'rgba(240,244,255,0.5)' }}>En attente que l'hôte lance la partie...</p>
          </div>
        )}
      </div>
    );
  }

  const currentQ = questions[room.current_question];
  if (!currentQ) return null;

  const buzzedPlayer = buzz ? players.find(p => p.id === buzz.player_id) : null;
  const buzzedByMe = buzz?.player_id === myPlayer.id;
  const myQCMAnswer = qcmAnswers.find(a => a.player_id === myPlayer.id);
  const answeredCount = qcmAnswers.length;
  const correctPlayerIds = qcmAnswers.filter(a => a.is_correct).map(a => a.player_id);

  // --- Gate gratuit ---
  if (isFreeLimit) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-6"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>
        <div className="text-6xl">🔒</div>
        <div className="text-center">
          <h2 className="text-2xl font-black mb-2" style={{ color: '#F0F4FF' }}>Limite gratuite atteinte</h2>
          <p style={{ color: 'rgba(240,244,255,0.5)' }}>Passe à un abonnement pour continuer !</p>
        </div>
        <a href="/pricing" className="muz-btn-pink px-8 py-4 rounded-xl text-lg font-black">Voir les abonnements →</a>
        <button onClick={() => router.push('/')} className="text-sm underline" style={{ color: 'rgba(240,244,255,0.4)' }}>
          Retour à l'accueil
        </button>
      </div>
    );
  }

  // --- Interface de jeu ---
  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#0D1B3E' }}>

      {/* Bandeau PAUSE visible pour tous */}
      {room.is_paused && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center pointer-events-none">
          <div className="px-10 py-5 rounded-2xl text-center muz-pop"
            style={{ background: 'rgba(13,27,62,0.95)', border: '2px solid rgba(245,158,11,0.5)', backdropFilter: 'blur(8px)' }}>
            <div className="text-5xl mb-2">⏸</div>
            <p className="text-2xl font-black" style={{ color: '#F59E0B' }}>Partie en pause</p>
            {!myPlayer.is_host && (
              <p className="text-sm mt-1" style={{ color: 'rgba(240,244,255,0.5)' }}>
                En attente de l'hôte…
              </p>
            )}
          </div>
        </div>
      )}

      {/* Menu hôte flottant */}
      {myPlayer.is_host && (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
          {showHostMenu && (
            <div className="flex flex-col gap-2 muz-pop mb-1">
              {room.is_paused ? (
                <button onClick={() => { resumeGame(); setShowHostMenu(false); }}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm"
                  style={{ background: '#00E5D1', color: '#0D1B3E', boxShadow: '0 4px 16px rgba(0,229,209,0.4)' }}>
                  ▶ Reprendre
                </button>
              ) : (
                <button onClick={() => { pauseGame(); setShowHostMenu(false); }}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm"
                  style={{ background: '#F59E0B', color: '#0D1B3E', boxShadow: '0 4px 16px rgba(245,158,11,0.4)' }}>
                  ⏸ Mettre en pause
                </button>
              )}
              <button onClick={() => { endGame(); setShowHostMenu(false); }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm"
                style={{ background: 'rgba(255,0,170,0.15)', color: '#FF00AA', border: '1px solid rgba(255,0,170,0.4)' }}>
                🚪 Terminer la partie
              </button>
            </div>
          )}
          <button onClick={() => setShowHostMenu(m => !m)}
            className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xl transition-all"
            style={{
              background: showHostMenu ? '#FF00AA' : 'rgba(255,0,170,0.2)',
              border: '2px solid rgba(255,0,170,0.5)',
              boxShadow: '0 4px 16px rgba(255,0,170,0.3)',
              color: showHostMenu ? 'white' : '#FF00AA',
            }}>
            {showHostMenu ? '✕' : '⚙'}
          </button>
        </div>
      )}

      {/* Classement inter-question */}
      <InterLeaderboard
        players={players}
        correctPlayerIds={correctPlayerIds}
        visible={showLeaderboard}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3"
        style={{ background: '#112247', borderBottom: '1px solid rgba(139,92,246,0.2)' }}>
        <div className="flex items-center gap-2">
          <span className="font-black muz-logo text-xl" style={{ fontFamily: 'var(--font-black-han)' }}>MUZ</span>
          <span className="text-xs font-mono tracking-widest px-2 py-0.5 rounded"
            style={{ background: 'rgba(0,229,209,0.1)', color: '#00E5D1', border: '1px solid rgba(0,229,209,0.2)' }}>
            {code}
          </span>
        </div>
        <Timer key={timerKey} duration={room.timer_duration}
          running={room.is_paused ? false : qcmRevealed ? false : room.mode === 'buzz' ? !buzz : !myQCMAnswer}
          onExpire={() => {
            if (myPlayer.is_host && !qcmRevealed && !room.is_paused) revealQCMAndNext();
          }} />
        <span className="text-xs font-bold px-2 py-1 rounded-full"
          style={{ background: 'rgba(139,92,246,0.15)', color: '#8B5CF6' }}>
          Q {room.current_question + 1}/{questions.length}
        </span>
      </div>

      {/* Scoreboard */}
      <Scoreboard players={players} buzzedId={buzz?.player_id} />

      {/* Zone de jeu */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">

        <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(255,0,170,0.6)' }}>
          {room.mode === 'buzz' ? '🔔 Buzz Quiz' : '🎵 Quiz Blind Test'} — Question {room.current_question + 1}
        </p>

        {/* Question */}
        <div className="muz-card text-center px-6 py-5 w-full max-w-lg">
          <h2 className="text-xl font-bold leading-snug" style={{ color: '#F0F4FF' }}>{currentQ.q}</h2>
        </div>

        {/* ===== MODE BUZZ QUIZ ===== */}
        {room.mode === 'buzz' && (
          <>
            {/* Phase 1 : personne n'a buzzé */}
            {!buzz && !qcmRevealed && (
              <BuzzerButton
                onBuzz={pressBuzzer}
                disabled={false}
                buzzedByMe={false}
                buzzedByOther={null}
              />
            )}

            {/* Phase 2 : quelqu'un a buzzé, en attente de réponse */}
            {buzz && !qcmRevealed && (
              <>
                {/* Bannière buzz */}
                <div className="px-5 py-2 rounded-full font-bold text-sm muz-pop"
                  style={{
                    background: buzzedByMe ? 'rgba(255,0,170,0.2)' : 'rgba(0,229,209,0.1)',
                    border: `1px solid ${buzzedByMe ? 'rgba(255,0,170,0.5)' : 'rgba(0,229,209,0.3)'}`,
                    color: buzzedByMe ? '#FF00AA' : '#00E5D1',
                  }}>
                  {buzzedByMe ? '🎤 À toi de répondre !' : `🔔 ${buzzedPlayer?.nickname ?? '???'} a buzzé !`}
                </div>

                {/* Choix QCM — actifs pour le buzzé, grisés pour les autres */}
                <QCMChoices
                  choices={(currentQ as any).choices}
                  selectedIndex={myQCMAnswer?.answer_index ?? null}
                  correctIndex={null}
                  answeredBy={qcmAnswers.map(a => a.answer_index)}
                  totalPlayers={1}
                  onChoose={submitQCMAnswer}
                  revealed={false}
                  disabledForNonBuzzer={!buzzedByMe}
                />

                {!buzzedByMe && (
                  <p className="text-xs" style={{ color: 'rgba(240,244,255,0.35)' }}>
                    En attente de la réponse de {buzzedPlayer?.nickname}...
                  </p>
                )}
              </>
            )}

            {/* Phase 3 : révélation */}
            {qcmRevealed && (
              <>
                <QCMChoices
                  choices={(currentQ as any).choices}
                  selectedIndex={qcmAnswers.find(a => a.player_id === buzz?.player_id)?.answer_index ?? null}
                  correctIndex={(currentQ as any).correct}
                  answeredBy={[]}
                  totalPlayers={1}
                  onChoose={() => {}}
                  revealed={true}
                  disabledForNonBuzzer={false}
                />
                <RevealCountdown players={players} correctPlayerIds={correctPlayerIds} />
              </>
            )}
          </>
        )}

        {/* ===== MODE QUIZ BLIND TEST ===== */}
        {room.mode === 'qcm' && 'choices' in currentQ && (
          <>
            {!qcmRevealed && (
              <div className="text-xs font-bold" style={{ color: 'rgba(240,244,255,0.4)' }}>
                {answeredCount} / {players.length} joueur{players.length > 1 ? 's' : ''} ont répondu
              </div>
            )}

            <QCMChoices
              choices={(currentQ as any).choices}
              selectedIndex={myQCMAnswer?.answer_index ?? null}
              correctIndex={qcmRevealed ? (currentQ as any).correct : null}
              answeredBy={qcmAnswers.map(a => a.answer_index)}
              totalPlayers={players.length}
              onChoose={submitQCMAnswer}
              revealed={qcmRevealed}
            />

            {myPlayer.is_host && !qcmRevealed && answeredCount > 0 && (
              <button onClick={revealQCMAndNext} className="muz-btn-cyan px-6 py-3 rounded-xl font-black text-sm mt-2">
                Révéler la réponse →
              </button>
            )}

            {qcmRevealed && (
              <RevealCountdown players={players} correctPlayerIds={correctPlayerIds} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
