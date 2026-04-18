-- ============================================================
-- MUZQUIZ — Migration complète (tout en un)
-- Coller et exécuter dans Supabase > SQL Editor
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1. TABLE PROFILS
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS profiles (
  id                UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nickname          TEXT NOT NULL DEFAULT '',
  avatar_color      TEXT NOT NULL DEFAULT '#8B5CF6',
  subscription_tier TEXT NOT NULL DEFAULT 'free'
                    CHECK (subscription_tier IN ('free', 'pro', 'premium')),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Ajouter subscription_tier si la table existait déjà sans cette colonne
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT NOT NULL DEFAULT 'free'
  CHECK (subscription_tier IN ('free', 'pro', 'premium'));

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);


-- ────────────────────────────────────────────────────────────
-- 2. COLONNES SUPPLÉMENTAIRES SUR ROOMS
-- ────────────────────────────────────────────────────────────

ALTER TABLE rooms ADD COLUMN IF NOT EXISTS is_paused     BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS public_screen  BOOLEAN NOT NULL DEFAULT false;


-- ────────────────────────────────────────────────────────────
-- 3. PACKS DE QUESTIONS
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS question_packs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  mode        TEXT NOT NULL CHECK (mode IN ('qcm', 'buzz')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE question_packs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tout le monde peut lire les packs" ON question_packs;
CREATE POLICY "Tout le monde peut lire les packs"
  ON question_packs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Le propriétaire gère ses packs" ON question_packs;
CREATE POLICY "Le propriétaire gère ses packs"
  ON question_packs FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);


-- ────────────────────────────────────────────────────────────
-- 4. QUESTIONS PERSONNALISÉES
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS custom_questions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pack_id       UUID REFERENCES question_packs(id) ON DELETE CASCADE NOT NULL,
  owner_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question      TEXT NOT NULL,
  choice_a      TEXT NOT NULL,
  choice_b      TEXT NOT NULL,
  choice_c      TEXT NOT NULL,
  choice_d      TEXT NOT NULL,
  correct_index INT  NOT NULL CHECK (correct_index BETWEEN 0 AND 3),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE custom_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tout le monde peut lire les questions" ON custom_questions;
CREATE POLICY "Tout le monde peut lire les questions"
  ON custom_questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Le propriétaire gère ses questions" ON custom_questions;
CREATE POLICY "Le propriétaire gère ses questions"
  ON custom_questions FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);


-- Ajouter pack_id à rooms (après que question_packs existe)
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS pack_id UUID REFERENCES question_packs(id);


-- ────────────────────────────────────────────────────────────
-- 5. TRIGGER AUTO-CRÉATION DE PROFIL
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, avatar_color, subscription_tier)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',   -- Pseudo choisi à l'inscription / nom Google
      NEW.raw_user_meta_data->>'name',         -- Autre OAuth
      split_part(NEW.email, '@', 1),           -- Partie avant @ de l'email
      'Joueur'                                 -- Fallback
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_color', -- Couleur choisie à l'inscription
      '#8B5CF6'                                -- Violet par défaut
    ),
    'free'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ────────────────────────────────────────────────────────────
-- 6. CRÉER LES PROFILS MANQUANTS (comptes déjà existants)
-- ────────────────────────────────────────────────────────────

INSERT INTO public.profiles (id, nickname, avatar_color, subscription_tier)
SELECT
  u.id,
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'name',
    split_part(u.email, '@', 1),
    'Joueur'
  ),
  COALESCE(
    u.raw_user_meta_data->>'avatar_color',
    '#8B5CF6'
  ),
  'free'
FROM auth.users u
WHERE u.is_anonymous IS NOT TRUE
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = u.id
  );


-- ============================================================
-- C'est tout ! La base de données est prête.
-- ============================================================
