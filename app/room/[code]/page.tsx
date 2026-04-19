// app/room/[code]/page.tsx
"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
import { PublicScreenView } from '@/components/PublicScreenView';
import { PhoneControllerView, ScorePreview } from '@/components/PhoneControllerView';
import { BUZZ_QUESTIONS, QCM_QUESTIONS, FREE_QUESTION_LIMIT } from '@/lib/questions';
import { Buzz, QCMAnswer, Player, isBuzzMechanic } from '@/types';
import { MuzquizLogo } from '@/components/MuzquizLogo';
import { RoomQRCode } from '@/components/RoomQRCode';

// --- Confettis lors de la révélation ---
const CONFETTI_COLORS = ['#FF00AA', '#00E5D1', '#8B5CF6', '#F59E0B', '#FF6B6B', '#4ECDC4', '#FFE66D'];
const CONFETTI_PIECES = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
  delay: (Math.random() * 0.9).toFixed(2),
  dur: (1.6 + Math.random() * 1).toFixed(2),
  size: Math.round(Math.random() * 9 + 5),
  isCircle: Math.random() > 0.4,
}));

function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {CONFETTI_PIECES.map(p => (
        <div
          key={p.id}
          className="muz-confetti"
          style={{
            left: `${p.x}%`,
            top: '-16px',
            width: p.size,
            height: p.size,
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

// --- Composant countdown animé (5 secondes) ---
function RevealCountdown({ players, correctPlayerIds, pointsEarned = {} }: {
  players: Player[];
  correctPlayerIds: string[];
  pointsEarned?: Record<string, number>;
}) {
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
          const pts = pointsEarned[p.id];
          return (
            <div key={p.id} className="relative flex flex-col items-center px-3 py-2 rounded-xl"
              style={{
                background: correct ? 'rgba(0,229,209,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${correct ? 'rgba(0,229,209,0.4)' : 'rgba(255,255,255,0.08)'}`,
              }}>
              <span className="text-xs font-bold" style={{ color: correct ? '#00E5D1' : 'rgba(240,244,255,0.4)' }}>
                {p.nickname}
              </span>
              {correct && pts !== undefined && (
                <span className="muz-score-float absolute -top-4 font-black text-sm"
                  style={{ color: '#00E5D1', textShadow: '0 0 10px rgba(0,229,209,0.8)' }}>
                  +{pts}
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
  // Ref pour détecter les vrais changements de question dans onRoomUpdate
  const prevQuestionRef = useRef<number | undefined>(undefined);
  // Timestamp du début de la question courante (mis à jour pour tous les clients)
  const [questionStartedAt, setQuestionStartedAt] = useState<number>(Date.now());

  const {
    room, players, myPlayer, buzz, setBuzz,
    qcmAnswers, setQcmAnswers, qcmRevealed, setQcmRevealed,
    earnedThisRound, setEarnedThisRound,
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

  // Quitter la salle (joueur invité uniquement)
  const leaveRoom = async () => {
    if (!myPlayer || myPlayer.is_host) return;
    await supabase.from('room_players').delete().eq('id', myPlayer.id);
    router.push('/');
  };
  const isFreeLimit = room ? room.current_question >= FREE_QUESTION_LIMIT : false;

  useRealtime({
    roomId: room?.id ?? '',
    onRoomUpdate: (r) => {
      setRoom(r);
      // Réinitialiser l'état de jeu UNIQUEMENT quand la question change
      // (pas sur is_paused, score, ou autres champs de la salle)
      if (prevQuestionRef.current !== r.current_question) {
        prevQuestionRef.current = r.current_question;
        setQuestionStartedAt(Date.now());
        setBuzz(null);
        setQcmAnswers([]);
        setQcmRevealed(false);
        setShowLeaderboard(false);
        setTimerKey(k => k + 1);
      }
      if (r.status === 'finished') router.push(`/room/${code}/results`);
    },
    onPlayersUpdate: setPlayers,
    onBuzz: (b: Buzz) => setBuzz(b),
    onQCMAnswer: (a: QCMAnswer) => setQcmAnswers(prev => {
      if (prev.some(x => x.id === a.id)) return prev;
      return [...prev, a];
    }),
    onNextQuestion: () => { setBuzz(null); setQcmAnswers([]); },
    onQCMReveal: (earned) => {
      setQcmRevealed(true);
      // Synchroniser les points pour les clients non-hôtes
      setEarnedThisRound(earned);
    },
  });

  // Afficher le classement 5s après la révélation (tous les clients, y compris l'hôte)
  useEffect(() => {
    if (!qcmRevealed) return;
    const t = setTimeout(() => setShowLeaderboard(true), 5000);
    return () => clearTimeout(t);
  }, [qcmRevealed]);

  // Auto-révéler QCM quand tous les joueurs ont répondu
  useEffect(() => {
    if (!room || isBuzzMechanic(room.mode) || !myPlayer?.is_host || qcmRevealed) return;
    // En mode écran public, l'hôte ne joue pas — on l'exclut du décompte
    const activePlayers = room.public_screen ? players.filter(p => !p.is_host) : players;
    if (activePlayers.length > 0 && qcmAnswers.length >= activePlayers.length) {
      revealQCMAndNext();
    }
  }, [qcmAnswers, players, room, myPlayer, qcmRevealed]);

  // Auto-révéler Buzz Quiz quand le joueur buzzé a répondu
  useEffect(() => {
    if (!room || !isBuzzMechanic(room.mode) || !buzz || !myPlayer?.is_host || qcmRevealed) return;
    if (qcmAnswers.length >= 1) {
      revealQCMAndNext();
    }
  }, [qcmAnswers, room, buzz, myPlayer, qcmRevealed]);

  // Garder les refs à jour pour le cleanup
  useEffect(() => { roomRef.current = room; }, [room]);
  useEffect(() => { myPlayerRef.current = myPlayer; }, [myPlayer]);

  // Auto-fermeture si la salle d'attente est vide (seulement l'hôte) pendant 10s
  useEffect(() => {
    if (!myPlayer?.is_host || !room || room.status !== 'waiting') return;
    if (players.length <= 1) {
      const t = setTimeout(() => {
        supabase.from('rooms').update({ status: 'finished' }).eq('id', room.id);
      }, 10000);
      return () => clearTimeout(t);
    }
  }, [players, room?.status, myPlayer?.is_host]);

  // Auto-fermeture : si l'hôte quitte la page (navigation) → fermer la salle
  // Mais PAS sur F5/refresh — on distingue grâce à sessionStorage
  useEffect(() => {
    // Nettoyer le flag de rechargement au montage (on vient de recharger → salle toujours ouverte)
    sessionStorage.removeItem('muz_reloading');

    const handleBeforeUnload = () => {
      // F5 ou fermeture d'onglet : marquer pour que le cleanup ne ferme pas la salle
      sessionStorage.setItem('muz_reloading', '1');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);

      const isReloading = sessionStorage.getItem('muz_reloading') === '1';
      if (!isReloading) {
        // Vraie navigation côté client (Link, router.push) → fermer la salle
        const r = roomRef.current;
        const p = myPlayerRef.current;
        if (p?.is_host && r && r.status !== 'finished') {
          supabase.from('rooms').update({ status: 'finished' }).eq('id', r.id);
        }
      }
      // Sur F5/fermeture : la salle reste ouverte, l'hôte peut revenir
      // Les salles orphelines sont nettoyées depuis la page profil
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

  // Score toujours à jour (players est mis à jour via realtime, myPlayer ne l'est pas)
  const liveMyPlayer = players.find(p => p.id === myPlayer.id) ?? myPlayer;

  const currentQForPublic = questions[room.current_question] ?? null;
  const correctPlayerIdsForPublic = qcmAnswers.filter(a => a.is_correct).map(a => a.player_id);

  // earnedThisRound est calculé une seule fois dans useRoom au moment de la révélation

  // --- MODE ÉCRAN PUBLIC ---
  if (room.public_screen) {
    if (!myPlayer.is_host) {
      return (
        <PhoneControllerView
          room={room}
          myPlayer={liveMyPlayer}
          players={players}
          buzz={buzz}
          qcmAnswers={qcmAnswers}
          qcmRevealed={qcmRevealed}
          showLeaderboard={showLeaderboard}
          currentQuestion={currentQForPublic}
          pressBuzzer={pressBuzzer}
          submitQCMAnswer={submitQCMAnswer}
          questionStartedAt={questionStartedAt}
        />
      );
    }
    return (
      <PublicScreenView
        room={room}
        players={players}
        myPlayer={myPlayer}
        currentQuestion={currentQForPublic}
        buzz={buzz}
        qcmAnswers={qcmAnswers}
        qcmRevealed={qcmRevealed}
        showLeaderboard={showLeaderboard}
        timerKey={timerKey}
        startGame={startGame}
        revealQCMAndNext={revealQCMAndNext}
        pauseGame={pauseGame}
        resumeGame={resumeGame}
        endGame={endGame}
      />
    );
  }

  // --- Salle d'attente ---
  if (room.status === 'waiting') {
    const modeLabel = isBuzzMechanic(room.mode) ? 'Buzz Quiz' : 'Quiz Blind Test';

    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 muz-fade-in"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>

        {showSettings && myPlayer.is_host && (
          <SettingsModal
            settings={{ timer_duration: room.timer_duration, sound_enabled: room.sound_enabled }}
            onSave={saveSettings}
            onClose={() => setShowSettings(false)}
          />
        )}

        <div className="text-center">
          <MuzquizLogo width={140} textSize="2rem" animate />
          <div className="flex items-center justify-center gap-2 mb-3">
            <MuzquizLogo width={18} showText={false} />
            <span className="font-bold" style={{ color: '#8B5CF6' }}>{modeLabel}</span>
          </div>

          {/* QR code (affiché sur mobile en premier, sur PC en plus petit) */}
          <div className="flex flex-col items-center gap-4">
            <RoomQRCode code={code} size={160} />

            {/* Code texte — toujours accessible */}
            <div className="px-6 py-3 rounded-2xl"
              style={{ background: 'rgba(0,229,209,0.06)', border: '1.5px solid rgba(0,229,209,0.2)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(0,229,209,0.4)' }}>
                Code de la salle
              </p>
              <div className="font-black font-mono tracking-[0.25em] text-2xl" style={{ color: '#00E5D1' }}>{code}</div>
            </div>
            <p className="text-xs" style={{ color: 'rgba(240,244,255,0.25)' }}>
              Scanne le QR ou partage le code
            </p>
          </div>
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
          <div className="flex flex-col items-center gap-3 w-full max-w-md">
            <div className="flex gap-3 w-full">
              <button onClick={() => setShowSettings(true)}
                className="w-14 h-14 rounded-xl text-xl font-bold transition-all hover:scale-105 flex-shrink-0"
                style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#8B5CF6' }}>
                ⚙
              </button>
              <button onClick={startGame} className="muz-btn-pink flex-1 py-4 rounded-xl text-base font-black">
                Lancer ({players.length} joueur{players.length > 1 ? 's' : ''}) →
              </button>
            </div>
            <button
              onClick={async () => {
                if (!confirm('Fermer la salle ?')) return;
                await endGame();
                router.push('/');
              }}
              className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80"
              style={{ background: 'rgba(255,0,170,0.08)', color: 'rgba(255,0,170,0.6)', border: '1px solid rgba(255,0,170,0.2)' }}>
              Fermer la salle
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 w-full max-w-md">
            <div className="flex items-center gap-2 px-5 py-3 rounded-full"
              style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#8B5CF6' }} />
              <p className="text-sm" style={{ color: 'rgba(240,244,255,0.5)' }}>En attente que l'hôte lance la partie...</p>
            </div>
            <button
              onClick={() => { if (confirm('Quitter la salle ?')) leaveRoom(); }}
              className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80"
              style={{ background: 'rgba(255,0,170,0.06)', color: 'rgba(255,0,170,0.5)', border: '1px solid rgba(255,0,170,0.15)' }}>
              Quitter la salle
            </button>
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
        <MuzquizLogo width={100} showText={false} />
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

      {/* Confettis lors de la révélation */}
      <Confetti active={qcmRevealed} />

      {/* Bandeau PAUSE visible pour tous */}
      {room.is_paused && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center pointer-events-none">
          <div className="px-10 py-5 rounded-2xl text-center muz-pop"
            style={{ background: 'rgba(13,27,62,0.95)', border: '2px solid rgba(245,158,11,0.5)', backdropFilter: 'blur(8px)' }}>
            <div className="flex justify-center mb-2"><MuzquizLogo width={80} showText={false} /></div>
            <p className="text-2xl font-black" style={{ color: '#F59E0B' }}>Partie en pause</p>
            {!myPlayer.is_host && (
              <p className="text-sm mt-1" style={{ color: 'rgba(240,244,255,0.5)' }}>
                En attente de l'hôte…
              </p>
            )}
          </div>
        </div>
      )}

      {/* (menu flottant supprimé — contrôles dans le header) */}

      {/* Classement inter-question */}
      <InterLeaderboard
        players={players}
        correctPlayerIds={correctPlayerIds}
        visible={showLeaderboard}
        pointsEarned={earnedThisRound}
      />

      {/* Header */}
      <div style={{ background: '#112247', borderBottom: '1px solid rgba(139,92,246,0.2)' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <MuzquizLogo width={36} showText={false} />
            <span className="text-xs font-mono tracking-widest px-2 py-0.5 rounded"
              style={{ background: 'rgba(0,229,209,0.1)', color: '#00E5D1', border: '1px solid rgba(0,229,209,0.2)' }}>
              {code}
            </span>
          </div>
          <Timer key={timerKey} duration={room.timer_duration}
            running={room.is_paused ? false : qcmRevealed ? false : isBuzzMechanic(room.mode) ? !buzz : !myQCMAnswer}
            onExpire={() => {
              if (myPlayer.is_host && !qcmRevealed && !room.is_paused) revealQCMAndNext();
            }} />
          <span className="text-xs font-bold px-2 py-1 rounded-full"
            style={{ background: 'rgba(139,92,246,0.15)', color: '#8B5CF6' }}>
            Q {room.current_question + 1}/{questions.length}
          </span>
        </div>

        {/* Bouton quitter pour les invités */}
        {!myPlayer.is_host && (
          <div className="flex px-4 pb-2">
            <button
              onClick={() => { if (confirm('Quitter la partie ?')) leaveRoom(); }}
              className="px-3 py-1.5 rounded-xl font-bold text-xs transition-all hover:opacity-80"
              style={{ background: 'rgba(255,0,170,0.06)', color: 'rgba(255,0,170,0.5)', border: '1px solid rgba(255,0,170,0.15)' }}>
              Quitter
            </button>
          </div>
        )}

        {/* Barre de contrôles hôte — même style que PublicScreenView */}
        {myPlayer.is_host && (
          <div className="flex items-center gap-2 px-4 pb-2">
            {room.is_paused ? (
              <button onClick={resumeGame}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all hover:opacity-90"
                style={{ background: 'rgba(0,229,209,0.15)', color: '#00E5D1', border: '1px solid rgba(0,229,209,0.3)' }}>
                ▶ Reprendre
              </button>
            ) : (
              <button onClick={pauseGame}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all hover:opacity-90"
                style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}>
                Pause
              </button>
            )}
            <button onClick={() => { if (confirm('Terminer la partie ?')) endGame(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all hover:opacity-90"
              style={{ background: 'rgba(255,0,170,0.08)', color: '#FF00AA', border: '1px solid rgba(255,0,170,0.2)' }}>
              Terminer
            </button>
          </div>
        )}
      </div>

      {/* Scoreboard */}
      <Scoreboard players={players} buzzedId={buzz?.player_id} />

      {/* Zone de jeu */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">

        <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(255,0,170,0.6)' }}>
          {isBuzzMechanic(room.mode) ? 'Buzz Quiz' : 'Quiz Blind Test'} — Question {room.current_question + 1}
        </p>

        {/* Question */}
        <div className="muz-card text-center px-6 py-5 w-full max-w-lg">
          <h2 className="text-xl font-bold leading-snug" style={{ color: '#F0F4FF' }}>{currentQ.q}</h2>
        </div>

        {/* ===== MODE BUZZ QUIZ ===== */}
        {isBuzzMechanic(room.mode) && (
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
                  {buzzedByMe ? 'À toi de répondre !' : `${buzzedPlayer?.nickname ?? '???'} a buzzé !`}
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
                <RevealCountdown players={players} correctPlayerIds={correctPlayerIds} pointsEarned={earnedThisRound} />
              </>
            )}
          </>
        )}

        {/* ===== MODE QUIZ BLIND TEST ===== */}
        {!isBuzzMechanic(room.mode) && 'choices' in currentQ && (
          <>
            {!qcmRevealed && (
              <>
                <div className="text-xs font-bold" style={{ color: 'rgba(240,244,255,0.4)' }}>
                  {answeredCount} / {players.length} joueur{players.length > 1 ? 's' : ''} ont répondu
                </div>
                {!myQCMAnswer && (
                  <ScorePreview questionStartedAt={questionStartedAt} timerDuration={room.timer_duration} isPaused={room.is_paused} />
                )}
              </>
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
              <RevealCountdown players={players} correctPlayerIds={correctPlayerIds} pointsEarned={earnedThisRound} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
