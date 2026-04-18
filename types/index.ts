// types/index.ts

export type RoomStatus = 'waiting' | 'playing' | 'finished';
export type GameMode = 'buzz' | 'qcm';

export interface Room {
  id: string;
  code: string;
  host_id: string;
  status: RoomStatus;
  current_question: number;
  mode: GameMode;
  timer_duration: number;
  max_players: number;
  sound_enabled: boolean;
  is_paused: boolean;
  created_at: string;
}

export interface Player {
  id: string;
  room_id: string;
  user_id: string;
  nickname: string;
  score: number;
  is_host: boolean;
}

export interface Buzz {
  id: string;
  room_id: string;
  player_id: string;
  question_index: number;
  buzzed_at: string;
}

export interface QCMAnswer {
  id: string;
  room_id: string;
  player_id: string;
  question_index: number;
  answer_index: number;
  is_correct: boolean;
  answered_at: string;
}

export interface BuzzQuestion {
  type: 'buzz';
  q: string;
  a: string;
  choices: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
}

export interface QCMQuestion {
  type: 'qcm';
  q: string;
  choices: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
}

export type Question = BuzzQuestion | QCMQuestion;

export interface RoomSettings {
  timer_duration: number;
  max_players: number;
  sound_enabled: boolean;
}
