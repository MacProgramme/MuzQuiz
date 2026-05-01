-- ================================================================
--  MUZQUIZ — SCHÉMA SUPABASE COMPLET
--  Ce fichier est l'unique source de vérité pour la base de données.
--  Il remplace tous les anciens fichiers SQL éparpillés.
--
--  UTILISATION :
--    → Supabase > SQL Editor > Coller > Run
--    Toutes les instructions sont idempotentes (IF NOT EXISTS /
--    ON CONFLICT DO NOTHING / CREATE OR REPLACE) : tu peux
--    relancer le script sans risque sur une base déjà peuplée.
--
--  ORDRE D'EXÉCUTION :
--    1. Tables principales
--    2. Tables secondaires
--    3. Realtime
--    4. RLS + Policies
--    5. Storage (buckets + policies)
--    6. Trigger auto-profil
--    7. Fonctions RPC
--    8. Données initiales (admins premium)
-- ================================================================


-- ================================================================
-- 1. TABLES PRINCIPALES
-- ================================================================

-- ── Salles de jeu ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rooms (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  code             TEXT        UNIQUE NOT NULL,
  host_id          UUID        REFERENCES auth.users NOT NULL,
  status           TEXT        DEFAULT 'waiting'
                               CHECK (status IN ('waiting','playing','finished')),
  mode             TEXT        DEFAULT 'buzz'
                               CHECK (mode IN ('qcm','buzz','quiz','blind_test','buzz_quiz','buzz_blind_test')),
  current_question INT         DEFAULT 0,
  timer_duration   INT         DEFAULT 20,
  max_players      INT         DEFAULT 100,
  sound_enabled    BOOLEAN     DEFAULT true,
  is_paused        BOOLEAN     NOT NULL DEFAULT false,
  public_screen    BOOLEAN     NOT NULL DEFAULT false,
  pack_id          UUID,       -- référence question_packs (ajoutée après)
  next_code        TEXT        DEFAULT NULL,  -- code de la salle replay
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── Joueurs dans une salle ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS room_players (
  id        UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id   UUID        REFERENCES rooms ON DELETE CASCADE,
  user_id   UUID        REFERENCES auth.users,
  nickname  TEXT        NOT NULL,
  score     INT         DEFAULT 0,
  is_host   BOOLEAN     DEFAULT false,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Buzz (qui a buzzé en premier) ─────────────────────────────
CREATE TABLE IF NOT EXISTS buzzes (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id        UUID        REFERENCES rooms ON DELETE CASCADE,
  player_id      UUID        REFERENCES room_players ON DELETE CASCADE,
  question_index INT         NOT NULL,
  buzzed_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Réponses QCM ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS qcm_answers (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id        UUID        REFERENCES rooms ON DELETE CASCADE,
  player_id      UUID        REFERENCES room_players ON DELETE CASCADE,
  question_index INT         NOT NULL,
  answer_index   INT         NOT NULL,
  is_correct     BOOLEAN     NOT NULL DEFAULT false,
  answered_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (room_id, player_id, question_index)
);


-- ================================================================
-- 2. TABLES PROFILS & ABONNEMENTS
-- ================================================================

-- ── Profils utilisateurs ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id                UUID  REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nickname          TEXT  NOT NULL DEFAULT '',
  avatar_color      TEXT  NOT NULL DEFAULT '#8B5CF6',
  avatar_url        TEXT,
  subscription_tier TEXT  NOT NULL DEFAULT 'free'
                          CHECK (subscription_tier IN ('free','pro','premium')),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);


-- ================================================================
-- 3. TABLES QUESTIONS PERSONNALISÉES
-- ================================================================

-- ── Packs de questions ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS question_packs (
  id          UUID  DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id    UUID  REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name        TEXT  NOT NULL,
  description TEXT  NOT NULL DEFAULT '',
  mode        TEXT  NOT NULL
              CHECK (mode IN ('qcm','buzz','quiz','blind_test','buzz_quiz','buzz_blind_test')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Questions dans les packs ──────────────────────────────────
CREATE TABLE IF NOT EXISTS custom_questions (
  id            UUID  DEFAULT gen_random_uuid() PRIMARY KEY,
  pack_id       UUID  REFERENCES question_packs(id) ON DELETE CASCADE NOT NULL,
  owner_id      UUID  REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question      TEXT  NOT NULL,
  choice_a      TEXT  NOT NULL,
  choice_b      TEXT  NOT NULL,
  choice_c      TEXT  NOT NULL,
  choice_d      TEXT  NOT NULL,
  correct_index INT   NOT NULL CHECK (correct_index BETWEEN 0 AND 3),
  image_url     TEXT  DEFAULT NULL,
  question_type TEXT  DEFAULT 'normal'
                CHECK (question_type IN ('normal','image','blur_reveal')),
  youtube_url   TEXT  DEFAULT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Clé étrangère rooms → question_packs (ajoutée séparément car tables créées après rooms)
ALTER TABLE rooms
  ADD COLUMN IF NOT EXISTS pack_id UUID REFERENCES question_packs(id);


-- ================================================================
-- 4. TABLES QUIZ DU JOUR
-- ================================================================

-- ── Quiz du jour (1 ligne par date) ───────────────────────────
CREATE TABLE IF NOT EXISTS daily_quizzes (
  id         UUID  DEFAULT gen_random_uuid() PRIMARY KEY,
  date       DATE  NOT NULL UNIQUE,
  theme      TEXT  NOT NULL,
  questions  JSONB NOT NULL,   -- tableau [{question, choices, correct, image_url?, question_type?}]
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Scores quotidiens par joueur ──────────────────────────────
CREATE TABLE IF NOT EXISTS daily_quiz_scores (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users NOT NULL,
  nickname     TEXT NOT NULL,
  date         DATE NOT NULL,
  score        INT  NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 1000),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT daily_quiz_scores_user_date_unique UNIQUE (user_id, date)
);

-- ── Archive des vainqueurs mensuels ───────────────────────────
CREATE TABLE IF NOT EXISTS monthly_winners (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  month        TEXT NOT NULL UNIQUE,   -- format YYYY-MM
  user_id      UUID,
  nickname     TEXT,
  avatar_color TEXT,
  total_score  INT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);


-- ================================================================
-- 5. REALTIME
-- ================================================================

-- Chaque table est ajoutée individuellement dans un bloc DO
-- pour ignorer l'erreur "already member" si elle est déjà présente.
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE room_players;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE buzzes;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE qcm_answers;
EXCEPTION WHEN others THEN NULL; END $$;


-- ================================================================
-- 6. ROW LEVEL SECURITY
-- ================================================================

ALTER TABLE rooms             ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_players      ENABLE ROW LEVEL SECURITY;
ALTER TABLE buzzes             ENABLE ROW LEVEL SECURITY;
ALTER TABLE qcm_answers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_packs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_questions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quizzes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quiz_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_winners   ENABLE ROW LEVEL SECURITY;

-- ── rooms ──────────────────────────────────────────────────────
DROP POLICY IF EXISTS "rooms: lecture publique"                   ON rooms;
DROP POLICY IF EXISTS "rooms: création par l'hôte authentifié"   ON rooms;
DROP POLICY IF EXISTS "rooms: modification par l'hôte"           ON rooms;
CREATE POLICY "rooms: lecture publique"
  ON rooms FOR SELECT USING (true);
CREATE POLICY "rooms: création par l'hôte authentifié"
  ON rooms FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "rooms: modification par l'hôte"
  ON rooms FOR UPDATE USING (auth.uid() = host_id);

-- ── room_players ───────────────────────────────────────────────
DROP POLICY IF EXISTS "room_players: lecture publique"            ON room_players;
DROP POLICY IF EXISTS "room_players: insertion libre"             ON room_players;
DROP POLICY IF EXISTS "room_players: mise à jour libre"           ON room_players;
DROP POLICY IF EXISTS "room_players: suppression par le joueur"   ON room_players;
CREATE POLICY "room_players: lecture publique"
  ON room_players FOR SELECT USING (true);
CREATE POLICY "room_players: insertion libre"
  ON room_players FOR INSERT WITH CHECK (true);
CREATE POLICY "room_players: mise à jour libre"
  ON room_players FOR UPDATE USING (true);
CREATE POLICY "room_players: suppression par le joueur"
  ON room_players FOR DELETE USING (auth.uid() = user_id);

-- ── buzzes ─────────────────────────────────────────────────────
DROP POLICY IF EXISTS "buzzes: lecture publique"  ON buzzes;
DROP POLICY IF EXISTS "buzzes: insertion libre"   ON buzzes;
CREATE POLICY "buzzes: lecture publique"
  ON buzzes FOR SELECT USING (true);
CREATE POLICY "buzzes: insertion libre"
  ON buzzes FOR INSERT WITH CHECK (true);

-- ── qcm_answers ────────────────────────────────────────────────
DROP POLICY IF EXISTS "qcm_answers: lecture publique"  ON qcm_answers;
DROP POLICY IF EXISTS "qcm_answers: insertion libre"   ON qcm_answers;
CREATE POLICY "qcm_answers: lecture publique"
  ON qcm_answers FOR SELECT USING (true);
CREATE POLICY "qcm_answers: insertion libre"
  ON qcm_answers FOR INSERT WITH CHECK (true);

-- ── profiles ───────────────────────────────────────────────────
DROP POLICY IF EXISTS "profiles: lecture publique"                           ON profiles;
DROP POLICY IF EXISTS "profiles: insertion par l'utilisateur"                ON profiles;
DROP POLICY IF EXISTS "profiles: modification par l'utilisateur (sans tier)" ON profiles;
CREATE POLICY "profiles: lecture publique"
  ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles: insertion par l'utilisateur"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles: modification par l'utilisateur (sans tier)"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND subscription_tier = (SELECT subscription_tier FROM profiles WHERE id = auth.uid())
  );

-- ── question_packs ─────────────────────────────────────────────
DROP POLICY IF EXISTS "question_packs: lecture publique"         ON question_packs;
DROP POLICY IF EXISTS "question_packs: gestion par le propriétaire" ON question_packs;
CREATE POLICY "question_packs: lecture publique"
  ON question_packs FOR SELECT USING (true);
CREATE POLICY "question_packs: gestion par le propriétaire"
  ON question_packs FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- ── custom_questions ───────────────────────────────────────────
DROP POLICY IF EXISTS "custom_questions: lecture publique"              ON custom_questions;
DROP POLICY IF EXISTS "custom_questions: gestion par le propriétaire"   ON custom_questions;
CREATE POLICY "custom_questions: lecture publique"
  ON custom_questions FOR SELECT USING (true);
CREATE POLICY "custom_questions: gestion par le propriétaire"
  ON custom_questions FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- ── daily_quizzes ──────────────────────────────────────────────
DROP POLICY IF EXISTS "daily_quizzes: lecture publique"      ON daily_quizzes;
DROP POLICY IF EXISTS "daily_quizzes: insertion permissive"  ON daily_quizzes;
CREATE POLICY "daily_quizzes: lecture publique"
  ON daily_quizzes FOR SELECT USING (true);
CREATE POLICY "daily_quizzes: insertion permissive"
  ON daily_quizzes FOR INSERT WITH CHECK (true);

-- ── daily_quiz_scores ──────────────────────────────────────────
DROP POLICY IF EXISTS "daily_quiz_scores: lecture publique"              ON daily_quiz_scores;
DROP POLICY IF EXISTS "daily_quiz_scores: insertion par l'utilisateur"   ON daily_quiz_scores;
CREATE POLICY "daily_quiz_scores: lecture publique"
  ON daily_quiz_scores FOR SELECT USING (true);
CREATE POLICY "daily_quiz_scores: insertion par l'utilisateur"
  ON daily_quiz_scores FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ── monthly_winners ────────────────────────────────────────────
DROP POLICY IF EXISTS "monthly_winners: lecture publique"      ON monthly_winners;
DROP POLICY IF EXISTS "monthly_winners: insertion permissive"  ON monthly_winners;
CREATE POLICY "monthly_winners: lecture publique"
  ON monthly_winners FOR SELECT USING (true);
CREATE POLICY "monthly_winners: insertion permissive"
  ON monthly_winners FOR INSERT WITH CHECK (true);


-- ================================================================
-- 7. STORAGE (buckets + policies)
-- ================================================================

-- ── Bucket avatars ─────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 5242880,
        ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "avatars: lecture publique"
  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "avatars: upload par le propriétaire"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "avatars: mise à jour par le propriétaire"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "avatars: suppression par le propriétaire"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ── Bucket question-images ─────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('question-images', 'question-images', true, 5242880,
        ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "question-images: lecture publique"
  ON storage.objects FOR SELECT USING (bucket_id = 'question-images');

CREATE POLICY "question-images: upload authentifié"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'question-images');

CREATE POLICY "question-images: suppression par le propriétaire"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'question-images' AND auth.uid() = owner);

CREATE POLICY "question-images: mise à jour par le propriétaire"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'question-images' AND auth.uid() = owner);


-- ================================================================
-- 8. TRIGGER AUTO-CRÉATION DE PROFIL
--    Crée automatiquement un profil à chaque nouvel utilisateur
--    (Google OAuth, email/password, etc.)
-- ================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, avatar_color, subscription_tier)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1),
      'Joueur'
    ),
    COALESCE(NEW.raw_user_meta_data->>'avatar_color', '#8B5CF6'),
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

-- Créer les profils manquants pour les comptes déjà existants
INSERT INTO public.profiles (id, nickname, avatar_color, subscription_tier)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name',
           split_part(u.email, '@', 1), 'Joueur'),
  '#8B5CF6',
  'free'
FROM auth.users u
WHERE u.is_anonymous IS NOT TRUE
  AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id);


-- ================================================================
-- 9. FONCTIONS RPC
-- ================================================================

-- ── Classement mensuel du Quiz du Jour ────────────────────────
CREATE OR REPLACE FUNCTION get_monthly_leaderboard(target_month TEXT)
RETURNS TABLE (
  user_id      UUID,
  nickname     TEXT,
  avatar_color TEXT,
  total_score  BIGINT,
  rank         BIGINT
)
LANGUAGE SQL SECURITY DEFINER AS $$
  SELECT
    p.id            AS user_id,
    p.nickname,
    COALESCE(p.avatar_color, '#8B5CF6') AS avatar_color,
    SUM(s.score)    AS total_score,
    RANK() OVER (ORDER BY SUM(s.score) DESC) AS rank
  FROM daily_quiz_scores s
  JOIN profiles p ON p.id = s.user_id
  WHERE TO_CHAR(s.completed_at AT TIME ZONE 'Europe/Paris', 'YYYY-MM') = target_month
  GROUP BY p.id, p.nickname, p.avatar_color
  ORDER BY total_score DESC
  LIMIT 11;
$$;

-- ── Changement de tier par un admin ───────────────────────────
CREATE OR REPLACE FUNCTION public.admin_set_tier(target_user_id UUID, new_tier TEXT)
RETURNS VOID AS $$
BEGIN
  IF (SELECT email FROM auth.users WHERE id = auth.uid())
     NOT IN ('antoine.gegedu27@gmail.com', 'dimitte-14@hotmail.fr') THEN
    RAISE EXCEPTION 'Accès refusé : admin uniquement';
  END IF;
  UPDATE public.profiles SET subscription_tier = new_tier WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ================================================================
-- 10. INDEX (performances)
-- ================================================================

CREATE INDEX IF NOT EXISTS idx_daily_quiz_scores_date  ON daily_quiz_scores(date);
CREATE INDEX IF NOT EXISTS idx_daily_quiz_scores_user  ON daily_quiz_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_quiz_scores_month ON daily_quiz_scores(completed_at);
CREATE INDEX IF NOT EXISTS idx_rooms_code              ON rooms(code);
CREATE INDEX IF NOT EXISTS idx_room_players_room       ON room_players(room_id);


-- ================================================================
-- 11. DONNÉES INITIALES — Comptes admins en Premium
-- ================================================================

UPDATE public.profiles
SET subscription_tier = 'premium'
WHERE id IN (
  SELECT id FROM auth.users
  WHERE email IN ('antoine.gegedu27@gmail.com', 'dimitte-14@hotmail.fr')
);


-- ================================================================
-- 12. CODES PROMO
-- ================================================================

-- Table des codes promo
CREATE TABLE IF NOT EXISTS promo_codes (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  code        TEXT        UNIQUE NOT NULL,
  tier        TEXT        NOT NULL DEFAULT 'premium'
                          CHECK (tier IN ('free','pro','premium')),
  expires_at  TIMESTAMPTZ NOT NULL,
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Table des utilisations (une ligne par joueur par code)
CREATE TABLE IF NOT EXISTS promo_code_uses (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  code_id    UUID        REFERENCES promo_codes(id) ON DELETE CASCADE NOT NULL,
  user_id    UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  used_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (code_id, user_id)
);

ALTER TABLE promo_codes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_code_uses  ENABLE ROW LEVEL SECURITY;

-- Les codes sont lisibles par tous (pour vérifier l'existence)
DROP POLICY IF EXISTS "promo_codes: lecture publique"       ON promo_codes;
CREATE POLICY "promo_codes: lecture publique"
  ON promo_codes FOR SELECT USING (true);

-- Seuls les admins (service role) peuvent créer/modifier/supprimer
-- (via l'API route qui utilise SUPABASE_SERVICE_ROLE_KEY)

-- promo_code_uses : l'utilisateur peut lire ses propres utilisations
DROP POLICY IF EXISTS "promo_code_uses: lecture personnelle" ON promo_code_uses;
CREATE POLICY "promo_code_uses: lecture personnelle"
  ON promo_code_uses FOR SELECT USING (auth.uid() = user_id);

-- L'insertion se fait via l'API route avec le service role
-- donc pas de policy INSERT nécessaire côté client


-- ================================================================
-- ✅ FIN DU SCHÉMA
--
--  CHECKLIST après exécution :
--  □ Authentication > Providers > Anonymous Sign Ins → activé
--  □ Authentication > Providers > Google OAuth → configuré
--  □ Authentication > URL Configuration → domaine Vercel ajouté
--  □ Vérifier les buckets "avatars" et "question-images" dans Storage
-- ================================================================
