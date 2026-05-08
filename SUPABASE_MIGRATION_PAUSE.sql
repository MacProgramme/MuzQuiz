-- ============================================================
-- MUZQUIZ — Migration : Pause de partie
-- À exécuter dans Supabase > SQL Editor (+ bouton)
-- ============================================================

ALTER TABLE rooms
  ADD COLUMN IF NOT EXISTS is_paused BOOLEAN NOT NULL DEFAULT false;
