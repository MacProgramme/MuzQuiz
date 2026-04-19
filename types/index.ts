// types/index.ts

export type RoomStatus = 'waiting' | 'playing' | 'finished';
// 4 modes + anciens identifiants (backward compat)
export type GameMode = 'quiz' | 'blind_test' | 'buzz_quiz' | 'buzz_blind_test' | 'qcm' | 'buzz';
export type SubscriptionTier = 'free' | 'pro' | 'premium';

/** Vrai si le mode utilise la mécanique "buzz d'abord" */
export const isBuzzMechanic = (mode: GameMode): boolean =>
  mode === 'buzz_quiz' || mode === 'buzz_blind_test' || mode === 'buzz';

/** Vrai si le mode utilise les questions blind test (musique) */
export const isBlindTestMode = (mode: GameMode): boolean =>
  mode === 'blind_test' || mode === 'buzz_blind_test';

/** Label affiché pour chaque mode */
export const MODE_DISPLAY: Record<GameMode, string> = {
  quiz:            'Quiz',
  blind_test:      'Blind Test',
  buzz_quiz:       'Buzz Quiz',
  buzz_blind_test: 'Buzz Blind Test',
  qcm:             'Quiz Blind Test',
  buzz:            'Buzz Quiz',
};

export const TIER_LIMITS: Record<SubscriptionTier, { maxPacks: number; maxQuestionsPerPack: number; canCreate: boolean }> = {
  free:    { maxPacks: 0,        maxQuestionsPerPack: 0,        canCreate: false },
  pro:     { maxPacks: 5,        maxQuestionsPerPack: 30,       canCreate: true },
  premium: { maxPacks: Infinity, maxQuestionsPerPack: Infinity, canCreate: true },
};

export interface QuestionPack {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  mode: GameMode;
  created_at: string;
  question_count?: number;
}

export interface CustomQuestion {
  id: string;
  pack_id: string;
  owner_id: string;
  question: string;
  choice_a: string;
  choice_b: string;
  choice_c: string;
  choice_d: string;
  correct_index: 0 | 1 | 2 | 3;
  created_at: string;
}

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
  pack_id: string | null;
  public_screen: boolean;
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
