-- ============================================================
-- MUZQUIZ — Migration : Questions personnalisées + Abonnements
-- À exécuter dans Supabase > SQL Editor (bouton +, nouveau tab)
-- ============================================================

-- 1. Ajouter le tier d'abonnement aux profils
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT NOT NULL DEFAULT 'free'
  CHECK (subscription_tier IN ('free', 'pro', 'premium'));

-- 2. Table des packs de questions
CREATE TABLE IF NOT EXISTS question_packs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  mode        TEXT NOT NULL CHECK (mode IN ('qcm', 'buzz')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE question_packs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut lire les packs"
  ON question_packs FOR SELECT USING (true);

CREATE POLICY "Le propriétaire gère ses packs"
  ON question_packs FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- 3. Table des questions dans les packs
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

CREATE POLICY "Tout le monde peut lire les questions"
  ON custom_questions FOR SELECT USING (true);

CREATE POLICY "Le propriétaire gère ses questions"
  ON custom_questions FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- 4. Ajouter pack_id à la table rooms (nullable)
ALTER TABLE rooms
  ADD COLUMN IF NOT EXISTS pack_id UUID REFERENCES question_packs(id);

-- ============================================================
-- C'est tout !
-- ============================================================
