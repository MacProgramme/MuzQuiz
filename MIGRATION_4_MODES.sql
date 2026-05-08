-- ============================================================
-- MIGRATION : 4 modes de jeu (mode = TEXT, pas enum)
-- À exécuter dans Supabase > SQL Editor
-- ============================================================

-- 1. Table rooms — supprimer l'ancienne contrainte et en créer une nouvelle
ALTER TABLE rooms DROP CONSTRAINT IF EXISTS rooms_mode_check;
ALTER TABLE rooms
  ADD CONSTRAINT rooms_mode_check
  CHECK (mode IN ('qcm', 'buzz', 'quiz', 'blind_test', 'buzz_quiz', 'buzz_blind_test'));

-- 2. Table question_packs — même chose
ALTER TABLE question_packs DROP CONSTRAINT IF EXISTS question_packs_mode_check;
ALTER TABLE question_packs
  ADD CONSTRAINT question_packs_mode_check
  CHECK (mode IN ('qcm', 'buzz', 'quiz', 'blind_test', 'buzz_quiz', 'buzz_blind_test'));

-- 3. Vérification : afficher les modes existants
SELECT DISTINCT mode FROM rooms ORDER BY mode;
