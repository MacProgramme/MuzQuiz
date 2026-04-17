// hooks/useRoom.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Room, Player, Buzz, QCMAnswer, GameMode } from '@/types';
import { BUZZ_QUESTIONS, QCM_QUESTIONS } from '@/lib/questions';

export function useRoom(code: string, nickname: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [myPlayer, setMyPlayer] = useState<Player | null>(null);
  const [buzz, setBuzz] = useState<Buzz | null>(null);
  const [qcmAnswers, setQcmAnswers] = useState<QCMAnswer[]>([]);
  const [qcmRevealed, setQcmRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code || !nickname) return;
    initRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, nickname]);

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

    // Vérifier si le joueur existe déjà (cas de l'hôte)
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
    const questions = QCM_QUESTIONS;
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
  }, [room, myPlayer, qcmAnswers]);

  const revealQCMAndNext = useCallback(async () => {
    if (!room || !myPlayer?.is_host) return;
    setQcmRevealed(true);

    // Attribuer les points pour les bonnes réponses
    const correctAnswers = qcmAnswers.filter(a => a.is_correct);
    for (const ans of correctAnswers) {
      const { data: p } = await supabase.from('room_players').select('score').eq('id', ans.player_id).single();
      if (p) await supabase.from('room_players').update({ score: p.score + 100 }).eq('id', ans.player_id);
    }

    // Attendre 2s puis passer à la question suivante
    setTimeout(async () => {
      await nextQuestion(room);
      setQcmRevealed(false);
      setQcmAnswers([]);
    }, 2500);
  }, [room, myPlayer, qcmAnswers]);

  const nextQuestion = async (currentRoom: Room) => {
    const questions = currentRoom.mode === 'qcm' ? QCM_QUESTIONS : BUZZ_QUESTIONS;
    const nextQ = currentRoom.current_question + 1;
    const status = nextQ >= questions.length ? 'finished' : 'playing';
    await supabase.from('rooms').update({ current_question: nextQ, status }).eq('id', currentRoom.id);
  };

  // Lancer la partie (hôte)
  const startGame = useCallback(async () => {
    if (!room || !myPlayer?.is_host) return;
    await supabase.from('rooms').update({ status: 'playing', current_question: 0 }).eq('id', room.id);
  }, [room, myPlayer]);

  // Sauvegarder les settings (hôte)
  const saveSettings = useCallback(async (settings: { timer_duration: number; max_players: number; sound_enabled: boolean }) => {
    if (!room || !myPlayer?.is_host) return;
    await supabase.from('rooms').update(settings).eq('id', room.id);
    setRoom(r => r ? { ...r, ...settings } : r);
  }, [room, myPlayer]);

  return {
    room, players, myPlayer,
    buzz, setBuzz,
    qcmAnswers, setQcmAnswers,
    qcmRevealed, setQcmRevealed,
    loading, error,
    pressBuzzer, judgeAnswer,
    submitQCMAnswer, revealQCMAndNext,
    startGame, saveSettings,
    setRoom, setPlayers,
  };
}
