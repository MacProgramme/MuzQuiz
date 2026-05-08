// types/index.ts

export type RoomStatus = 'waiting' | 'playing' | 'finished';
// 4 modes + anciens identifiants (backward compat)
export type GameMode = 'quiz' | 'blind_test' | 'buzz_quiz' | 'buzz_blind_test' | 'qcm' | 'buzz';
export type SubscriptionTier = 'decouverte' | 'essentiel' | 'pro' | 'expert';

/** Vrai si le mode utilise la mécanique "buzz d'abord" */
export const isBuzzMechanic = (mode: GameMode): boolean =>
  mode === 'buzz_quiz' || mode === 'buzz_blind_test' || mode === 'buzz';

/** Vrai si le mode utilise les questions blind test (musique) */
export const isBlindTestMode = (mode: GameMode): boolean =>
  mode === 'blind_test' || mode === 'buzz_blind_test';

/**
 * Normalise les anciennes valeurs de tier (avant migration DB) vers les nouvelles.
 * 'free' → 'decouverte', 'premium' → 'expert', valeurs inconnues → 'decouverte'.
 */
export function normalizeTier(raw: string | null | undefined): SubscriptionTier {
  if (raw === 'free')    return 'decouverte';
  if (raw === 'premium') return 'expert';
  const valid: SubscriptionTier[] = ['decouverte', 'essentiel', 'pro', 'expert'];
  if (valid.includes(raw as SubscriptionTier)) return raw as SubscriptionTier;
  return 'decouverte';
}

/** Label affiché pour chaque mode */
export const MODE_DISPLAY: Record<GameMode, string> = {
  quiz:            'Quiz',
  blind_test:      'Blind Test',
  buzz_quiz:       'Buzz Quiz',
  buzz_blind_test: 'Buzz Blind Test',
  qcm:             'Quiz Blind Test',
  buzz:            'Buzz Quiz',
};

export const TIER_LIMITS: Record<SubscriptionTier, {
  canCreate: boolean;           // tous les tiers peuvent créer des packs (illimités)
  canUseCSV: boolean;           // peut importer depuis un fichier CSV/Excel
  canUseImage: boolean;         // peut créer des questions avec image (image / flou→net)
  maxAiPerMonth: number;        // nombre de générations IA autorisées par mois (0 = aucune)
  maxAiQuestionsPerGen: number; // questions max par génération IA
  maxPlayers: number;           // joueurs max dans une salle
}> = {
  //  Moustachu Découverte — Gratuit
  //  Packs illimités · Création manuelle texte uniquement · 10 joueurs max
  decouverte: { canCreate: true, canUseCSV: false, canUseImage: false, maxAiPerMonth: 0,  maxAiQuestionsPerGen: 0,  maxPlayers: 10  },

  //  Moustachu Essentiel — 9,99 €/mois
  //  Packs illimités · Manuel + CSV + Image + IA (10 q, 10 fois/mois) · 20 joueurs max
  essentiel:  { canCreate: true, canUseCSV: true,  canUseImage: true,  maxAiPerMonth: 10, maxAiQuestionsPerGen: 10, maxPlayers: 20  },

  //  Moustachu Pro — 19,99 €/mois
  //  Packs illimités · Manuel + CSV + Image + IA (20 q, 40 fois/mois) · 100 joueurs max
  pro:        { canCreate: true, canUseCSV: true,  canUseImage: true,  maxAiPerMonth: 40, maxAiQuestionsPerGen: 20, maxPlayers: 100 },

  //  Moustachu Expert — 29,99 €/mois
  //  Packs illimités · Manuel + CSV + Image + IA (20 q, 80 fois/mois) · 250 joueurs max
  expert:     { canCreate: true, canUseCSV: true,  canUseImage: true,  maxAiPerMonth: 80, maxAiQuestionsPerGen: 20, maxPlayers: 250 },
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

export type QuestionType = 'normal' | 'image' | 'blur_reveal';

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
  image_url?: string | null;
  question_type?: QuestionType;
  youtube_url?: string | null;
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
  image_url?: string | null;
  question_type?: QuestionType;
  youtube_url?: string | null;
}

export interface QCMQuestion {
  type: 'qcm';
  q: string;
  choices: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  image_url?: string | null;
  question_type?: QuestionType;
  youtube_url?: string | null;
}

export type Question = BuzzQuestion | QCMQuestion;

export interface RoomSettings {
  timer_duration: number;
  max_players: number;
  sound_enabled: boolean;
}
