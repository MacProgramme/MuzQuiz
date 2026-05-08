-- ============================================================
-- MIGRATION : Fiabilité du "Rejouer avec les mêmes joueurs"
-- À exécuter dans le SQL Editor de Supabase
-- ============================================================

-- Colonne next_code : stocke le code de la salle suivante lors d'un replay
-- Permet aux joueurs de se retrouver même si le broadcast temps-réel est raté
ALTER TABLE rooms
  ADD COLUMN IF NOT EXISTS next_code TEXT DEFAULT NULL;

-- ============================================================
-- FIN DE LA MIGRATION
-- ============================================================
