-- Migration : score dégressif — plafond 100 → 1000
-- À exécuter dans Supabase SQL Editor

-- 1. Supprimer l'ancienne contrainte CHECK
ALTER TABLE daily_quiz_scores
  DROP CONSTRAINT IF EXISTS daily_quiz_scores_score_check;

-- 2. Ajouter la nouvelle contrainte (max 1000 pour 10 questions × 100 pts)
ALTER TABLE daily_quiz_scores
  ADD CONSTRAINT daily_quiz_scores_score_check CHECK (score >= 0 AND score <= 1000);

-- 3. Ajouter la colonne youtube_url si elle n'existe pas encore
ALTER TABLE custom_questions
  ADD COLUMN IF NOT EXISTS youtube_url TEXT DEFAULT NULL;
