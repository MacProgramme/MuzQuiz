-- ============================================================
-- MUZQUIZ — Passer les admins en Premium + Bloquer l'auto-upgrade
-- À exécuter dans Supabase > SQL Editor
-- ============================================================


-- 1. Passer les deux comptes admins en Premium
UPDATE public.profiles
SET subscription_tier = 'premium'
WHERE id IN (
  SELECT id FROM auth.users
  WHERE email IN ('antoine.gegedu27@gmail.com', 'dimitte-14@hotmail.fr')
);


-- 2. Bloquer la modification de subscription_tier par les utilisateurs eux-mêmes
--    (Seul un trigger système / admin peut changer le tier)

-- Remplacer la politique UPDATE actuelle par une version qui exclut subscription_tier
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Nouvelle politique : l'utilisateur peut modifier son profil SAUF changer son tier
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND subscription_tier = (SELECT subscription_tier FROM profiles WHERE id = auth.uid())
  );


-- 3. Fonction dédiée pour que les admins puissent changer le tier (appelée côté app)
--    Note : à utiliser depuis une Edge Function ou via le dashboard Supabase directement
CREATE OR REPLACE FUNCTION public.admin_set_tier(target_user_id UUID, new_tier TEXT)
RETURNS VOID AS $$
BEGIN
  -- Vérifier que l'appelant est admin
  IF (SELECT email FROM auth.users WHERE id = auth.uid())
     NOT IN ('antoine.gegedu27@gmail.com', 'dimitte-14@hotmail.fr') THEN
    RAISE EXCEPTION 'Accès refusé : admin uniquement';
  END IF;

  UPDATE public.profiles
  SET subscription_tier = new_tier
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================
-- C'est tout !
-- - Les deux comptes sont maintenant Premium
-- - Les utilisateurs ne peuvent plus changer leur propre tier
-- - La page profil affiche le tier en lecture seule
-- ============================================================
