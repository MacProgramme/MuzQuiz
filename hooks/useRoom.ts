// hooks/useRoom.ts
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Room, Player, Buzz, QCMAnswer, GameMode, BuzzQuestion, QCMQuestion } from '@/types';
import { BUZZ_QUESTIONS, QCM_QUESTIONS } from '@/lib/questions';

export function useRoom(code: string, nickname: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [myPlayer, setMyPlayer] = useState<Player | null>(null);
  const [buzz, setBuzz] = useState<Buzz | null>(null);
  const [qcmAnswers, setQcmAnswers] = useState<QCMAnswer[]>([]);
  const [qcmRevealed, setQcmRevealed] = useState(false);
  const [customQuestions, setCustomQuestions] = useState<(BuzzQuestion | QCMQuestion)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Canal broadcast pour envoyer la révélation à tous
  const broadcastChannelRef = useRef<any>(null);

  useEffect(() => {
    if (!code || !nickname) return;
    initRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, nickname]);

  // Créer le canal broadcast dès qu'on a l'id de la salle
  useEffect(() => {
    if (!room?.id) return;
    // Nom différent de useRealtime pour éviter les conflits
    const ch = supabase.channel(`muz-bc-${room.id}`);
    ch.subscribe();
    broadcastChannelRef.current = ch;
    return () => {
      supabase.removeChannel(ch);
      broadcastChannelRef.current = null;
    };
  }, [room?.id]);

  const initRoom = async () => {
    setLoading(true);

    const { data: roomData, error: roomErr } = await supabase
      .from('rooms')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (roomErr || !roomData) {
      setError('Salle introuvable. Vérifie le code et réessaie.');
      setLoading(false);
      return;
    }
    setRoom(roomData);

    const { data: { user } } = await supabase.auth.getUser();
    let userId = user?.id;
    if (!userId) {
      const { data: anonData } = await supabase.auth.signInAnonymously();
      userId = anonData.user?.id;
    }
    if (!userId) {
      setError("Erreur d'authentification. Recharge la page.");
      setLoading(false);
      return;
    }

    const { data: existingPlayer } = await supabase
      .from('room_players')
      .select('*')
      .eq('room_id', roomData.id)
      .eq('user_id', userId)
      .single();

    if (existingPlayer) {
      setMyPlayer(existingPlayer);
    } else {
      const { data: playerData } = await supabase
        .from('room_players')
        .insert({ room_id: roomData.id, user_id: userId, nickname, is_host: false })
        .select('*')
        .single();
      if (playerData) setMyPlayer(playerData);
    }

    const { data: playersData } = await supabase
      .from('room_players')
      .select('*')
      .eq('room_id', roomData.id);
    if (playersData) setPlayers(playersData);

    // Charger les questions custom si un pack est sélectionné
    if (roomData.pack_id) {
      const { data: cqs } = await supabase
        .from('custom_questions')
        .select('*')
        .eq('pack_id', roomData.pack_id)
        .order('created_at', { ascending: true });
      if (cqs && cqs.length > 0) {
        const formatted = cqs.map((q: any) => ({
          type: roomData.mode,
          q: q.question,
          choices: [q.choice_a, q.choice_b, q.choice_c, q.choice_d] as [string, string, string, string],
          correct: q.correct_index as 0 | 1 | 2 | 3,
          a: q.choice_a,
        }));
        setCustomQuestions(formatted as any);
      }
    }

    setLoading(false);
  };

  // === BUZZ MODE ===
  const pressBuzzer = useCallback(async () => {
    if (!room || !myPlayer || buzz) return;
    const { data } = await supabase
      .from('buzzes')
      .insert({ room_id: room.id, player_id: myPlayer.id, question_index: room.current_question })
      .select('*')
      .single();
    if (data) setBuzz(data);
  }, [room, myPlayer, buzz]);

  const judgeAnswer = useCallback(async (correct: boolean) => {
    if (!room || !buzz || !myPlayer?.is_host) return;
    if (correct) {
      const { data: p } = await supabase.from('room_players').select('score').eq('id', buzz.player_id).single();
      if (p) await supabase.from('room_players').update({ score: p.score + 100 }).eq('id', buzz.player_id);
    }
    await nextQuestion(room);
    setBuzz(null);
  }, [room, buzz, myPlayer]);

  // === QCM MODE ===
  const submitQCMAnswer = useCallback(async (answerIndex: number) => {
    if (!room || !myPlayer || qcmAnswers.some(a => a.player_id === myPlayer.id)) return;
    // En mode buzz, seul le joueur buzzé peut répondre
    if (room.mode === 'buzz' && buzz?.player_id !== myPlayer.id) return;
    const questions = room.mode === 'qcm' ? QCM_QUESTIONS : BUZZ_QUESTIONS;
    const currentQ = questions[room.current_question];
    if (!currentQ) return;

    const isCorrect = answerIndex === currentQ.correct;
    const { data } = await supabase
      .from('qcm_answers')
      .insert({
        room_id: room.id,
        player_id: myPlayer.id,
        question_index: room.current_question,
        answer_index: answerIndex,
        is_correct: isCorrect,
      })
      .select('*')
      .single();

    if (data) setQcmAnswers(prev => [...prev, data]);
  }, [room, myPlayer, qcmAnswers, buzz]);

  const revealQCMAndNext = useCallback(async () => {
    if (!room || !myPlayer?.is_host) return;

    // Révéler localement
    setQcmRevealed(true);

    // Broadcaster la révélation à tous les autres joueurs
    broadcastChannelRef.current?.send({
      type: 'broadcast',
      event: 'qcm_reveal',
      payload: {},
    });

    // Attribuer les points pour les bonnes réponses
    const correctAnswers = qcmAnswers.filter(a => a.is_correct);
    for (const ans of correctAnswers) {
      const { data: p } = await supabase.from('room_players').select('score').eq('id', ans.player_id).single();
      if (p) await supabase.from('room_players').update({ score: p.score + 100 }).eq('id', ans.player_id);
    }

    // Après 10s (5s reveal + 5s classement) : question suivante
    setTimeout(async () => {
      await nextQuestion(room);
      setQcmRevealed(false);
      setQcmAnswers([]);
    }, 10000);
  }, [room, myPlayer, qcmAnswers]);

  const nextQuestion = async (currentRoom: Room) => {
    const questions = currentRoom.pack_id
      ? customQuestions
      : currentRoom.mode === 'qcm' ? QCM_QUESTIONS : BUZZ_QUESTIONS;
    const nextQ = currentRoom.current_question + 1;
    const status = nextQ >= questions.length ? 'finished' : 'playing';
    await supabase.from('rooms').update({ current_question: nextQ, status }).eq('id', currentRoom.id);
  };

  const startGame = useCallback(async () => {
    if (!room || !myPlayer?.is_host) return;
    await supabase.from('rooms').update({ status: 'playing', current_question: 0, is_paused: false }).eq('id', room.id);
  }, [room, myPlayer]);

  const pauseGame = useCallback(async () => {
    if (!room || !myPlayer?.is_host) return;
    await supabase.from('rooms').update({ is_paused: true }).eq('id', room.id);
  }, [room, myPlayer]);

  const resumeGame = useCallback(async () => {
    if (!room || !myPlayer?.is_host) return;
    await supabase.from('rooms').update({ is_paused: false }).eq('id', room.id);
  }, [room, myPlayer]);

  const endGame = useCallback(async () => {
    if (!room || !myPlayer?.is_host) return;
    await supabase.from('rooms').update({ status: 'finished', is_paused: false }).eq('id', room.id);
  }, [room, myPlayer]);

  const saveSettings = useCallback(async (settings: { timer_duration: number; sound_enabled: boolean }) => {
    if (!room || !myPlayer?.is_host) return;
    await supabase.from('rooms').update(settings).eq('id', room.id);
    setRoom(r => r ? { ...r, ...settings } : r);
  }, [room, myPlayer]);

  return {
    room, players, myPlayer,
    buzz, setBuzz,
    qcmAnswers, setQcmAnswers,
    qcmRevealed, setQcmRevealed,
    customQuestions,
    loading, error,
    pressBuzzer, judgeAnswer,
    submitQCMAnswer, revealQCMAndNext,
    startGame, saveSettings,
    pauseGame, resumeGame, endGame,
    setRoom, setPlayers,
  };
}
