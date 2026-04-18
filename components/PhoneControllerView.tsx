// components/PhoneControllerView.tsx
"use client";

import { Room, Player, Buzz, QCMAnswer, BuzzQuestion, QCMQuestion } from '@/types';

const COLORS = ['#EF4444', '#3B82F6', '#EAB308', '#22C55E'];
const SHAPES = ['▲', '◆', '●', '■'];
const LABELS = ['A', 'B', 'C', 'D'];

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
}

export function PhoneControllerView({
  room, myPlayer, players, buzz, qcmAnswers, qcmRevealed, showLeaderboard,
  currentQuestion, pressBuzzer, submitQCMAnswer,
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
      <div className="min-h-screen flex flex-col items-center justify-center p-8"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>
        <div className="text-6xl mb-4">🎮</div>
        <h1 className="text-2xl font-black mb-2 text-center" style={{ color: '#F0F4FF' }}>
          Prêt à jouer !
        </h1>
        <p className="text-lg font-black mb-1" style={{ color: '#8B5CF6' }}>{myPlayer.nickname}</p>
        <p className="text-sm text-center" style={{ color: 'rgba(240,244,255,0.4)' }}>
          En attente que l'hôte lance la partie…
        </p>
        <div className="mt-8 flex items-center gap-2">
          {['#FF00AA', '#8B5CF6', '#00E5D1'].map((c, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full animate-bounce"
              style={{ background: c, animationDelay: `${i * 150}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  /* ---- TERMINÉE ---- */
  if (room.status === 'finished') {
    const medal = myRank === 1 ? '🥇' : myRank === 2 ? '🥈' : myRank === 3 ? '🥉' : `#${myRank}`;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>
        <div className="text-7xl mb-4">{medal}</div>
        <h1 className="text-3xl font-black mb-2" style={{ color: '#F0F4FF' }}>
          {myRank === 1 ? '🎉 Victoire !' : 'Partie terminée !'}
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

  /* ---- MODE BUZZ ---- */
  if (room.mode === 'buzz') {
    // Quelqu'un d'autre a buzzé
    if (someoneBuzzed && !hasBuzzed) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8"
          style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>
          <div className="text-5xl mb-4">🔔</div>
          <p className="text-2xl font-black text-center" style={{ color: '#FF00AA' }}>
            {buzzerName} a buzzé en premier !
          </p>
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
            <div>
              <p className="text-xs font-bold" style={{ color: 'rgba(240,244,255,0.4)' }}>{myPlayer.nickname}</p>
              <p className="font-black text-xl" style={{ color: '#8B5CF6' }}>{myPlayer.score} pts</p>
            </div>
            <div className="px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,0,170,0.15)', color: '#FF00AA', border: '1px solid rgba(255,0,170,0.3)' }}>
              <p className="text-xs font-black">🔔 Vous avez buzzé !</p>
            </div>
          </div>

          {answered ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-6xl mb-4">{qcmRevealed ? (myAnswer?.is_correct ? '✅' : '❌') : '✅'}</div>
              <p className="text-xl font-black" style={{ color: '#F0F4FF' }}>
                {qcmRevealed ? (myAnswer?.is_correct ? 'Bonne réponse !' : 'Pas tout à fait…') : 'Réponse envoyée !'}
              </p>
            </div>
          ) : (
            <>
              <p className="text-center font-bold mb-6" style={{ color: 'rgba(240,244,255,0.5)' }}>
                Choisissez votre réponse
              </p>
              <div className="grid grid-cols-2 gap-4 flex-1">
                {currentQuestion.choices.map((choice, i) => (
                  <button key={i}
                    onClick={() => submitQCMAnswer(i)}
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl p-4 font-black text-white active:scale-95 transition-all"
                    style={{
                      background: COLORS[i],
                      minHeight: '120px',
                      boxShadow: `0 4px 20px ${COLORS[i]}44`,
                    }}>
                    <span className="text-2xl">{SHAPES[i]}</span>
                    <span className="text-sm text-center leading-tight">{choice}</span>
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
          <div>
            <p className="text-sm font-bold" style={{ color: 'rgba(240,244,255,0.5)' }}>{myPlayer.nickname}</p>
            <p className="font-black text-xl" style={{ color: '#8B5CF6' }}>{myPlayer.score} pts · #{myRank}</p>
          </div>
        </div>
        <button
          onClick={pressBuzzer}
          className="w-56 h-56 rounded-full font-black text-white flex flex-col items-center justify-center gap-2 active:scale-95 transition-all"
          style={{
            background: 'linear-gradient(135deg, #FF00AA, #8B5CF6)',
            boxShadow: '0 0 60px rgba(255,0,170,0.5), 0 0 120px rgba(255,0,170,0.2)',
            fontSize: '2rem',
          }}>
          🔔<br />
          <span className="text-2xl font-black">BUZZ !</span>
        </button>
      </div>
    );
  }

  /* ---- MODE QCM ---- */
  const answered = !!myAnswer;

  // Déjà répondu + révélé
  if (qcmRevealed && answered) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>
        <div className="text-7xl mb-4">{myAnswer.is_correct ? '✅' : '❌'}</div>
        <h1 className="text-2xl font-black text-center mb-3" style={{ color: '#F0F4FF' }}>
          {myAnswer.is_correct ? 'Bonne réponse !' : 'Pas tout à fait…'}
        </h1>
        <p className="font-black text-2xl" style={{ color: '#8B5CF6' }}>{myPlayer.score} pts</p>
      </div>
    );
  }

  // Réponse envoyée, en attente de la révélation
  if (answered) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8"
        style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>
        <div className="text-7xl mb-4">✅</div>
        <h1 className="text-xl font-black mb-2" style={{ color: '#F0F4FF' }}>Réponse enregistrée !</h1>
        <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>En attente des autres joueurs…</p>
      </div>
    );
  }

  // Pas encore répondu → 4 gros boutons
  return (
    <div className="min-h-screen flex flex-col p-4"
      style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>
      {/* Header */}
      <div className="flex items-center justify-between pt-4 pb-6">
        <div>
          <p className="text-xs font-bold" style={{ color: 'rgba(240,244,255,0.4)' }}>{myPlayer.nickname}</p>
          <p className="font-black text-xl" style={{ color: '#8B5CF6' }}>{myPlayer.score} pts · #{myRank}</p>
        </div>
        <p className="text-sm font-bold" style={{ color: 'rgba(240,244,255,0.4)' }}>
          Q{(room.current_question ?? 0) + 1}
        </p>
      </div>

      <p className="text-center font-bold mb-5" style={{ color: 'rgba(240,244,255,0.5)' }}>
        Choisissez votre réponse
      </p>

      {/* 2×2 grille de boutons */}
      <div className="grid grid-cols-2 gap-4 flex-1">
        {currentQuestion?.choices.map((choice, i) => (
          <button key={i}
            onClick={() => submitQCMAnswer(i)}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl p-4 font-black text-white active:scale-95 transition-all"
            style={{
              background: COLORS[i],
              minHeight: '130px',
              boxShadow: `0 4px 20px ${COLORS[i]}44`,
            }}>
            <span className="text-3xl">{SHAPES[i]}</span>
            <span className="text-sm text-center leading-tight">{choice}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
