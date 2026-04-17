// app/room/[code]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useRoom } from '@/hooks/useRoom';
import { useRealtime } from '@/hooks/useRealtime';
import { BuzzerButton } from '@/components/BuzzerButton';
import { QCMChoices } from '@/components/QCMChoices';
import { Timer } from '@/components/Timer';
import { Scoreboard } from '@/components/Scoreboard';
import { SettingsModal } from '@/components/SettingsModal';
import { BUZZ_QUESTIONS, QCM_QUESTIONS, FREE_QUESTION_LIMIT } from '@/lib/questions';
import { Buzz, QCMAnswer } from '@/types';

export default function RoomPage() {
  const { code } = useParams<{ code: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const nickname = searchParams.get('nickname') ?? 'Joueur';
  const [showSettings, setShowSettings] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  const {
    room, players, myPlayer, buzz, setBuzz,
    qcmAnswers, setQcmAnswers, qcmRevealed, setQcmRevealed,
    loading, error,
    pressBuzzer, judgeAnswer,
    submitQCMAnswer, revealQCMAndNext,
    startGame, saveSettings,
    setRoom, setPlayers,
  } = useRoom(code, nickname);

  const questions = room?.mode === 'qcm' ? QCM_QUESTIONS : BUZZ_QUESTIONS;
  const isFreeLimit = room ? room.current_question >= FREE_QUESTION_LIMIT : false;

  useRealtime({
    roomId: room?.id ?? '',
    onRoomUpdate: (r) => {
      setRoom(r);
      setBuzz(null);
      setQcmAnswers([]);
      setQcmRevealed(false);
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
    // Tous les joueurs (pas seulement l'hôte) voient la révélation
    onQCMReveal: () => setQcmRevealed(true),
  });

  useEffect(() => {
    if (!room || room.mode !== 'qcm' || !myPlayer?.is_host || qcmRevealed) return;
    if (qcmAnswers.length >= players.length && players.length > 0) {
      revealQCMAndNext();
    }
  }, [qcmAnswers, players, room, myPlayer, qcmRevealed]);

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
      <button onClick={() => router.push('/')}
        className="text-sm underline" style={{ color: '#8B5CF6' }}>
        Retour à l'accueil
      </button>
    </div>
  );

  if (!room || !myPlayer) return null;

  // --- Salle d'attente ---
  if (room.status === 'waiting') {
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

        {/* Logo + mode */}
        <div className="text-center">
          <h1 className="muz-logo text-4xl font-black mb-1" style={{ fontFamily: 'var(--font-black-han)' }}>
            MUZQUIZ
          </h1>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span>{room.mode === 'buzz' ? '🔔' : '🎯'}</span>
            <span className="font-bold" style={{ color: '#8B5CF6' }}>
              Mode {room.mode === 'buzz' ? 'Buzz' : 'QCM'}
            </span>
          </div>
          {/* Code salle */}
          <div className="mt-3 px-6 py-3 rounded-2xl inline-block"
            style={{ background: 'rgba(0,229,209,0.08)', border: '2px solid rgba(0,229,209,0.3)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(0,229,209,0.5)' }}>
              Code de la salle
            </p>
            <div className="font-black font-mono tracking-[0.25em] text-3xl" style={{ color: '#00E5D1' }}>
              {code}
            </div>
          </div>
          <p className="text-xs mt-2" style={{ color: 'rgba(240,244,255,0.3)' }}>
            Partage ce code avec tes amis !
          </p>
        </div>

        {/* Liste joueurs */}
        <div className="muz-card w-full max-w-md p-5">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(240,244,255,0.4)' }}>
            Joueurs ({players.length}/{room.max_players})
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
                    style={{ background: 'rgba(255,0,170,0.15)', color: '#FF00AA' }}>
                    hôte
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Boutons hôte */}
        {myPlayer.is_host ? (
          <div className="flex gap-3">
            <button onClick={() => setShowSettings(true)}
              className="w-14 h-14 rounded-xl text-xl font-bold transition-all hover:scale-105"
              style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#8B5CF6' }}>
              ⚙️
            </button>
            <button onClick={startGame}
              className="muz-btn-pink px-8 py-4 rounded-xl text-base font-black">
              Lancer la partie ({players.length} joueur{players.length > 1 ? 's' : ''}) →
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-5 py-3 rounded-full"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#8B5CF6' }} />
            <p className="text-sm" style={{ color: 'rgba(240,244,255,0.5)' }}>
              En attente que l'hôte lance la partie...
            </p>
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

  // --- Gate gratuit ---
  if (isFreeLimit) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-6"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>
        <div className="text-6xl">🔒</div>
        <div className="text-center">
          <h2 className="text-2xl font-black mb-2" style={{ color: '#F0F4FF' }}>Limite gratuite atteinte</h2>
          <p style={{ color: 'rgba(240,244,255,0.5)' }}>Tu as joué {FREE_QUESTION_LIMIT} questions gratuites.</p>
          <p className="mb-6" style={{ color: 'rgba(240,244,255,0.5)' }}>Passe à un abonnement pour continuer !</p>
        </div>
        <a href="/pricing" className="muz-btn-pink px-8 py-4 rounded-xl text-lg font-black">
          Voir les abonnements →
        </a>
        <button onClick={() => router.push('/')}
          className="text-sm underline" style={{ color: 'rgba(240,244,255,0.4)' }}>
          Retour à l'accueil
        </button>
      </div>
    );
  }

  // --- Interface de jeu ---
  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#0D1B3E' }}>

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
        <Timer key={timerKey} duration={room.timer_duration} running={room.mode === 'buzz' ? !buzz : !qcmRevealed} onExpire={() => {
          if (room.mode === 'qcm' && myPlayer.is_host && !qcmRevealed) revealQCMAndNext();
        }} />
        <span className="text-xs font-bold px-2 py-1 rounded-full"
          style={{ background: 'rgba(139,92,246,0.15)', color: '#8B5CF6' }}>
          Q {room.current_question + 1}/{questions.length}
        </span>
      </div>

      {/* Scoreboard */}
      <Scoreboard players={players} buzzedId={buzz?.player_id} />

      {/* Question + jeu */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">

        {/* Numéro de question */}
        <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(255,0,170,0.6)' }}>
          Question {room.current_question + 1}
        </p>

        {/* Texte question */}
        <div className="muz-card text-center px-6 py-5 w-full max-w-lg">
          <h2 className="text-xl font-bold leading-snug" style={{ color: '#F0F4FF' }}>
            {currentQ.q}
          </h2>
        </div>

        {/* === MODE BUZZ === */}
        {room.mode === 'buzz' && (
          <>
            {buzz && (
              <div className={`px-5 py-2 rounded-full font-bold text-sm muz-pop`}
                style={{
                  background: buzzedByMe ? 'rgba(255,0,170,0.2)' : 'rgba(0,229,209,0.1)',
                  border: `1px solid ${buzzedByMe ? 'rgba(255,0,170,0.5)' : 'rgba(0,229,209,0.3)'}`,
                  color: buzzedByMe ? '#FF00AA' : '#00E5D1',
                }}>
                {buzzedByMe ? '🎤 Donnez votre réponse !' : `🔔 ${buzzedPlayer?.nickname ?? '???'} a buzzé !`}
              </div>
            )}

            {myPlayer.is_host && buzz && 'a' in currentQ && (
              <div className="px-5 py-3 rounded-xl text-sm"
                style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', color: 'rgba(240,244,255,0.7)' }}>
                Réponse : <span className="font-black" style={{ color: '#8B5CF6' }}>{(currentQ as any).a}</span>
              </div>
            )}

            <BuzzerButton
              onBuzz={pressBuzzer}
              disabled={!!buzz}
              buzzedByMe={buzzedByMe}
              buzzedByOther={buzz && !buzzedByMe ? buzzedPlayer?.nickname ?? null : null}
            />

            {myPlayer.is_host && buzz && (
              <div className="flex gap-3">
                <button onClick={() => judgeAnswer(true)}
                  className="px-6 py-3 rounded-xl font-black text-sm transition-all hover:scale-105"
                  style={{ background: 'rgba(0,229,209,0.15)', border: '1px solid rgba(0,229,209,0.4)', color: '#00E5D1' }}>
                  ✓ Bonne réponse (+100 pts)
                </button>
                <button onClick={() => judgeAnswer(false)}
                  className="px-6 py-3 rounded-xl font-black text-sm transition-all hover:scale-105"
                  style={{ background: 'rgba(255,0,170,0.1)', border: '1px solid rgba(255,0,170,0.3)', color: '#FF00AA' }}>
                  ✗ Mauvaise
                </button>
              </div>
            )}
          </>
        )}

        {/* === MODE QCM === */}
        {room.mode === 'qcm' && 'choices' in currentQ && (
          <>
            <div className="text-xs font-bold" style={{ color: qcmRevealed ? '#00E5D1' : 'rgba(240,244,255,0.4)' }}>
              {qcmRevealed
                ? '✅ Résultats !'
                : `${answeredCount} / ${players.length} joueur${players.length > 1 ? 's' : ''} ont répondu`}
            </div>

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
              <button onClick={revealQCMAndNext}
                className="muz-btn-cyan px-6 py-3 rounded-xl font-black text-sm mt-2">
                Révéler la réponse →
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
