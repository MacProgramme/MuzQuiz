-- ============================================================
-- MIGRATION : Support images pour les questions
-- À exécuter dans le SQL Editor de Supabase
-- ============================================================

-- 1. Bucket Storage "question-images" (public)
-- ─────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'question-images',
  'question-images',
  true,
  5242880,  -- 5 MB max par image
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif']
)
ON CONFLICT (id) DO NOTHING;


-- 2. Politiques RLS sur le bucket
-- ─────────────────────────────────────────────

-- Lecture publique (tout le monde peut voir les images)
CREATE POLICY "Public read question-images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'question-images' );

-- Upload : utilisateurs authentifiés uniquement
CREATE POLICY "Auth upload question-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'question-images' );

-- Suppression : uniquement le propriétaire (owner) de l'objet
CREATE POLICY "Owner delete question-images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'question-images' AND auth.uid() = owner );

-- Update : uniquement le propriétaire
CREATE POLICY "Owner update question-images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'question-images' AND auth.uid() = owner );


-- 3. Colonnes image sur custom_questions
-- ─────────────────────────────────────────────
ALTER TABLE custom_questions
  ADD COLUMN IF NOT EXISTS image_url       TEXT        DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS question_type   TEXT        DEFAULT 'normal'
    CHECK (question_type IN ('normal', 'image', 'blur_reveal'));


-- 4. Realtime sur "buzzes" — déjà activé, rien à faire.
--    Si tu vois une erreur "already member of publication", ignore-la.
--    ALTER PUBLICATION supabase_realtime ADD TABLE buzzes;


-- ============================================================
-- FIN DE LA MIGRATION
-- ============================================================
