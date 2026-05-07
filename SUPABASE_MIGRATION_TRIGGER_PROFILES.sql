-- ============================================================
-- MUZQUIZ — Trigger auto-création de profil
-- Pour tous les comptes : Google, email, etc.
-- À exécuter dans Supabase > SQL Editor (bouton +)
-- ============================================================

-- Fonction appelée à chaque nouvel utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, avatar_color, subscription_tier)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',   -- Nom Google / pseudo choisi à l'inscription
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
  ON CONFLICT (id) DO NOTHING; -- Ne pas écraser si profil déjà existant
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attacher le trigger sur la table auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Créer les profils manquants pour les comptes déjà existants
-- (comptes Google créés AVANT ce trigger)
-- ============================================================
INSERT INTO public.profiles (id, nickname, avatar_color, subscription_tier)
SELECT
  u.id,
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'name',
    split_part(u.email, '@', 1),
    'Joueur'
  ),
  '#8B5CF6',
  'free'
FROM auth.users u
WHERE u.is_anonymous IS NOT TRUE  -- Exclure les anonymes
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = u.id
  );

-- ============================================================
-- C'est tout ! Tous les comptes existants ont maintenant un profil.
-- ============================================================
