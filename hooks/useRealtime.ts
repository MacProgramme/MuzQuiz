// hooks/useRealtime.ts
"use client";

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Room, Player, Buzz, QCMAnswer } from '@/types';

interface Props {
  roomId: string;
  onRoomUpdate: (room: Room) => void;
  onPlayersUpdate: (players: Player[]) => void;
  onBuzz: (buzz: Buzz) => void;
  onQCMAnswer: (answer: QCMAnswer) => void;
  onNextQuestion: () => void;
}

export function useRealtime({ roomId, onRoomUpdate, onPlayersUpdate, onBuzz, onQCMAnswer, onNextQuestion }: Props) {
  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`room-${roomId}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'rooms',
        filter: `id=eq.${roomId}`,
      }, (payload) => {
        onRoomUpdate(payload.new as Room);
      })
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'room_players',
        filter: `room_id=eq.${roomId}`,
      }, async () => {
        const { data } = await supabase
          .from('room_players')
          .select('*')
          .eq('room_id', roomId)
          .order('score', { ascending: false });
        if (data) onPlayersUpdate(data);
      })
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'buzzes',
        filter: `room_id=eq.${roomId}`,
      }, (payload) => {
        onBuzz(payload.new as Buzz);
      })
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'qcm_answers',
        filter: `room_id=eq.${roomId}`,
      }, (payload) => {
        onQCMAnswer(payload.new as QCMAnswer);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [roomId]);
}
