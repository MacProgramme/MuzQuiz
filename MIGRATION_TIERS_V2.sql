-- ═══════════════════════════════════════════════════════════════════════
-- MIGRATION — Nouveaux tiers d'abonnement (v2)
-- Anciens tiers : free | pro | premium
-- Nouveaux tiers : decouverte | essentiel | pro | expert
--
-- À exécuter dans l'éditeur SQL Supabase
-- ═══════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────
-- 1. PROFILS — Renommer les anciens tiers
-- ─────────────────────────────────────────────────────────────────────

-- Étape 1a : Supprimer temporairement la contrainte CHECK
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;

-- Étape 1b : Renommer les valeurs existantes
UPDATE public.profiles SET subscription_tier = 'decouverte' WHERE subscription_tier = 'free';
UPDATE public.profiles SET subscription_tier = 'expert'     WHERE subscription_tier = 'premium';
-- 'pro' reste 'pro' — aucune action nécessaire

-- Étape 1c : Recréer la contrainte CHECK avec les nouvelles valeurs
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_subscription_tier_check
  CHECK (subscription_tier IN ('decouverte','essentiel','pro','expert'));

-- Étape 1d : Mettre à jour la valeur par défaut
ALTER TABLE public.profiles
  ALTER COLUMN subscription_tier SET DEFAULT 'decouverte';

-- ─────────────────────────────────────────────────────────────────────
-- 2. CODES PROMO — Renommer les anciens tiers
-- ─────────────────────────────────────────────────────────────────────

-- Étape 2a : Supprimer temporairement la contrainte CHECK
ALTER TABLE public.promo_codes
  DROP CONSTRAINT IF EXISTS promo_codes_tier_check;

-- Étape 2b : Renommer les valeurs existantes
UPDATE public.promo_codes SET tier = 'expert' WHERE tier = 'premium';
UPDATE public.promo_codes SET tier = 'expert' WHERE tier = 'free';
-- 'pro' reste 'pro'

-- Étape 2c : Recréer la contrainte CHECK
ALTER TABLE public.promo_codes
  ADD CONSTRAINT promo_codes_tier_check
  CHECK (tier IN ('essentiel','pro','expert'));

-- Étape 2d : Mettre à jour la valeur par défaut
ALTER TABLE public.promo_codes
  ALTER COLUMN tier SET DEFAULT 'expert';

-- ─────────────────────────────────────────────────────────────────────
-- 3. TRIGGER — Mettre à jour le defaut dans la fonction handle_new_user
-- ─────────────────────────────────────────────────────────────────────
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
    'decouverte'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─────────────────────────────────────────────────────────────────────
-- 4. COMPTES ADMINS — Mettre à niveau en Expert
-- ─────────────────────────────────────────────────────────────────────
UPDATE public.profiles
SET subscription_tier = 'expert'
WHERE id IN (
  SELECT id FROM auth.users
  WHERE email IN ('antoine.gegedu27@gmail.com', 'dimitte-14@hotmail.fr')
);

-- ─────────────────────────────────────────────────────────────────────
-- 5. CLASSEMENT JOURNALIER — Nouvelle fonction RPC
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_daily_leaderboard(target_date DATE)
RETURNS TABLE (
  user_id      UUID,
  nickname     TEXT,
  avatar_color TEXT,
  score        INT,
  rank         BIGINT
)
LANGUAGE SQL SECURITY DEFINER AS $$
  SELECT
    p.id            AS user_id,
    p.nickname,
    COALESCE(p.avatar_color, '#8B5CF6') AS avatar_color,
    s.score,
    RANK() OVER (ORDER BY s.score DESC) AS rank
  FROM daily_quiz_scores s
  JOIN profiles p ON p.id = s.user_id
  WHERE s.date = target_date
  ORDER BY s.score DESC
  LIMIT 11;
$$;

-- ═══════════════════════════════════════════════════════════════════════
-- FIN DE LA MIGRATION
-- Vérification : SELECT DISTINCT subscription_tier FROM profiles;
--             → doit retourner uniquement : decouverte, essentiel, pro, expert
-- ═══════════════════════════════════════════════════════════════════════
