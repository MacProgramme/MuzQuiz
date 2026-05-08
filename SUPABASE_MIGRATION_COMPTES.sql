-- ============================================================
-- MUZQUIZ — Migration : Système de comptes joueurs
-- À exécuter dans Supabase > SQL Editor
-- ============================================================

-- Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nickname    TEXT NOT NULL DEFAULT '',
  avatar_color TEXT NOT NULL DEFAULT '#8B5CF6',
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire les profils (pour afficher les pseudos)
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Chaque utilisateur ne peut modifier que son propre profil
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Chaque utilisateur ne peut créer que son propre profil
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- Autoriser les utilisateurs anonymes à jouer (déjà en place)
-- Vérifier que room_players autorise les anon users :
-- ============================================================

-- Si tu as des erreurs RLS sur room_players pour les anonymes,
-- assure-toi que cette policy existe :

-- CREATE POLICY "Anyone can insert room_players"
--   ON room_players FOR INSERT
--   WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Anyone can select room_players"
--   ON room_players FOR SELECT
--   USING (true);

-- ============================================================
-- C'est tout ! La table profiles est prête.
-- ============================================================
