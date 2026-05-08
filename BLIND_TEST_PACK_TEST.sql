-- ════════════════════════════════════════════════════════════════════════
--  MUZQUIZ — Pack test Blind Test (10 questions)
--  À exécuter dans Supabase > SQL Editor > Run
--
--  Ce script crée :
--    1. Un pack "🎵 Blind Test — Hits Incontournables" en mode blind_test
--    2. 10 questions "Quel est cette musique ?" avec lecteur YouTube
--
--  ⚠️  Les URLs YouTube peuvent nécessiter une vérification/mise à jour
--      si une vidéo a été supprimée depuis. Remplace le v=XXXXXXX dans
--      /questions pour corriger une URL.
-- ════════════════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_owner_id UUID;
  v_pack_id  UUID;
BEGIN

  -- ── Récupérer l'ID du compte admin ──────────────────────────────────
  SELECT id INTO v_owner_id
  FROM auth.users
  WHERE email = 'antoine.gegedu27@gmail.com'
  LIMIT 1;

  IF v_owner_id IS NULL THEN
    RAISE EXCEPTION 'Compte introuvable : antoine.gegedu27@gmail.com';
  END IF;

  -- ── Créer le pack ────────────────────────────────────────────────────
  INSERT INTO question_packs (owner_id, name, description, mode)
  VALUES (
    v_owner_id,
    '🎵 Blind Test — Hits Incontournables',
    '10 tubes mondiaux à identifier. Le lecteur se lance automatiquement — trouvez l''artiste et le titre !',
    'blind_test'
  )
  RETURNING id INTO v_pack_id;

  -- ── Insérer les 10 questions ─────────────────────────────────────────
  INSERT INTO custom_questions
    (pack_id, owner_id, question, choice_a, choice_b, choice_c, choice_d, correct_index, question_type, youtube_url)
  VALUES

  -- Q1 — Bohemian Rhapsody (correcte : A)
  (v_pack_id, v_owner_id,
   'Quel est cette musique ?',
   'Bohemian Rhapsody — Queen',
   'Stairway to Heaven — Led Zeppelin',
   'Hotel California — Eagles',
   'Don''t Stop Me Now — Queen',
   0, 'normal',
   'https://www.youtube.com/watch?v=fJ9rUzIMcZQ'),

  -- Q2 — Shape of You (correcte : B)
  (v_pack_id, v_owner_id,
   'Quel est cette musique ?',
   'Stay With Me — Sam Smith',
   'Shape of You — Ed Sheeran',
   'Perfect — Ed Sheeran',
   'Blinding Lights — The Weeknd',
   1, 'normal',
   'https://www.youtube.com/watch?v=JGwWNGJdvx8'),

  -- Q3 — Uptown Funk (correcte : C)
  (v_pack_id, v_owner_id,
   'Quel est cette musique ?',
   '24K Magic — Bruno Mars',
   'Happy — Pharrell Williams',
   'Uptown Funk — Mark Ronson ft. Bruno Mars',
   'Can''t Stop the Feeling — Justin Timberlake',
   2, 'normal',
   'https://www.youtube.com/watch?v=OPf0YbXqDm0'),

  -- Q4 — Despacito (correcte : D)
  (v_pack_id, v_owner_id,
   'Quel est cette musique ?',
   'Gasolina — Daddy Yankee',
   'Bailando — Enrique Iglesias',
   'Waka Waka — Shakira',
   'Despacito — Luis Fonsi ft. Daddy Yankee',
   3, 'normal',
   'https://www.youtube.com/watch?v=kTJczUoc26U'),

  -- Q5 — Thriller (correcte : A)
  (v_pack_id, v_owner_id,
   'Quel est cette musique ?',
   'Thriller — Michael Jackson',
   'Billie Jean — Michael Jackson',
   'Beat It — Michael Jackson',
   'Man in the Mirror — Michael Jackson',
   0, 'normal',
   'https://www.youtube.com/watch?v=sOnqjkJTMaA'),

  -- Q6 — Rolling in the Deep (correcte : B)
  (v_pack_id, v_owner_id,
   'Quel est cette musique ?',
   'Someone Like You — Adele',
   'Rolling in the Deep — Adele',
   'Hello — Adele',
   'Skyfall — Adele',
   1, 'normal',
   'https://www.youtube.com/watch?v=rYEDA3JcQqw'),

  -- Q7 — Happy (correcte : C)
  (v_pack_id, v_owner_id,
   'Quel est cette musique ?',
   'Get Lucky — Daft Punk ft. Pharrell Williams',
   'Blurred Lines — Robin Thicke',
   'Happy — Pharrell Williams',
   'Can''t Stop the Feeling — Justin Timberlake',
   2, 'normal',
   'https://www.youtube.com/watch?v=ZbZSe6N_BXs'),

  -- Q8 — Blinding Lights (correcte : D)
  (v_pack_id, v_owner_id,
   'Quel est cette musique ?',
   'Save Your Tears — The Weeknd',
   'Starboy — The Weeknd',
   'Can''t Feel My Face — The Weeknd',
   'Blinding Lights — The Weeknd',
   3, 'normal',
   'https://www.youtube.com/watch?v=4NRXx6U8ABQ'),

  -- Q9 — Africa (correcte : A)
  (v_pack_id, v_owner_id,
   'Quel est cette musique ?',
   'Africa — Toto',
   'Don''t Stop Believin'' — Journey',
   'Come Sail Away — Styx',
   'Rosanna — Toto',
   0, 'normal',
   'https://www.youtube.com/watch?v=FTQbiNvZqaY'),

  -- Q10 — Sweet Child O' Mine (correcte : B)
  (v_pack_id, v_owner_id,
   'Quel est cette musique ?',
   'Welcome to the Jungle — Guns N'' Roses',
   'Sweet Child O'' Mine — Guns N'' Roses',
   'Paradise City — Guns N'' Roses',
   'November Rain — Guns N'' Roses',
   1, 'normal',
   'https://www.youtube.com/watch?v=1w7OgIMMRc4');

  RAISE NOTICE 'Pack créé avec succès ! ID = %', v_pack_id;

END $$;

-- ════════════════════════════════════════════════════════════════════════
-- Vérification
-- SELECT p.name, p.mode, COUNT(q.id) AS nb_questions
-- FROM question_packs p
-- LEFT JOIN custom_questions q ON q.pack_id = p.id
-- WHERE p.name ILIKE '%Blind Test%'
-- GROUP BY p.id, p.name, p.mode;
-- ════════════════════════════════════════════════════════════════════════
