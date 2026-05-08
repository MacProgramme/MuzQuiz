-- ============================================================
-- MUZQUIZ — Fix du trigger : récupérer aussi la couleur d'avatar
-- À exécuter dans Supabase > SQL Editor
-- ============================================================

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
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- C'est tout ! Le trigger existant sera mis à jour.
-- ============================================================
