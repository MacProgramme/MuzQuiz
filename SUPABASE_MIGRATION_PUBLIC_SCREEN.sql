-- ============================================================
-- MUZQUIZ — Migration : Mode écran public (bar / salle de jeux)
-- À exécuter dans Supabase > SQL Editor
-- ============================================================

ALTER TABLE rooms
  ADD COLUMN IF NOT EXISTS public_screen BOOLEAN NOT NULL DEFAULT false;

-- ============================================================
-- C'est tout ! La colonne public_screen est ajoutée.
-- ============================================================
