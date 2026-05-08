-- ============================================================
-- MUZQUIZ — Migration : Photo de profil
-- À exécuter dans Supabase > SQL Editor
-- ============================================================

-- 1. Colonne avatar_url sur profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Bucket de stockage public pour les avatars (5 Mo max)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars', 'avatars', true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 3. Politiques de stockage
DROP POLICY IF EXISTS "Avatars publics" ON storage.objects;
CREATE POLICY "Avatars publics"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Upload avatar perso" ON storage.objects;
CREATE POLICY "Upload avatar perso"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Mise a jour avatar perso" ON storage.objects;
CREATE POLICY "Mise a jour avatar perso"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Supprimer avatar perso" ON storage.objects;
CREATE POLICY "Supprimer avatar perso"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
