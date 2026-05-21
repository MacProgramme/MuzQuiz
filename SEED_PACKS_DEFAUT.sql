-- ================================================================
-- SEED : 5 packs de questions par défaut MUZQUIZ
-- À exécuter UNE SEULE FOIS dans Supabase → SQL Editor
-- Les packs sont publics (lecture pour tous) car RLS = SELECT true
-- Propriétaire = compte admin antoine.gegedu27@gmail.com
-- ================================================================

DO $$
DECLARE
  admin_id   UUID;
  pack_cg    UUID;
  pack_cine  UUID;
  pack_sport UUID;
  pack_bt80  UUID;
  pack_bt2k  UUID;
BEGIN

  -- Récupérer l'UUID de l'admin
  SELECT id INTO admin_id FROM auth.users WHERE email = 'antoine.gegedu27@gmail.com' LIMIT 1;
  IF admin_id IS NULL THEN RAISE EXCEPTION 'Admin non trouvé'; END IF;

  -- ══════════════════════════════════════════════════════════════
  -- PACK 1 : Culture Générale (QCM)
  -- ══════════════════════════════════════════════════════════════
  INSERT INTO question_packs (id, owner_id, name, description, mode)
  VALUES (gen_random_uuid(), admin_id, '🌍 Culture Générale', 'Quiz de culture générale — histoire, géographie, sciences, art.', 'qcm')
  RETURNING id INTO pack_cg;

  INSERT INTO custom_questions (pack_id, owner_id, question, choice_a, choice_b, choice_c, choice_d, correct_index) VALUES
  (pack_cg, admin_id, 'Quelle est la capitale de l''Australie ?',             'Sydney',         'Melbourne',      'Canberra',       'Brisbane',       2),
  (pack_cg, admin_id, 'Quel est le plus grand océan du monde ?',              'Atlantique',     'Indien',         'Pacifique',      'Arctique',       2),
  (pack_cg, admin_id, 'En quelle année a eu lieu la Révolution française ?',  '1776',           '1789',           '1793',           '1804',           1),
  (pack_cg, admin_id, 'Qui a peint la Joconde ?',                             'Michel-Ange',    'Raphaël',        'Botticelli',     'Léonard de Vinci', 3),
  (pack_cg, admin_id, 'Quel est le symbole chimique de l''or ?',              'Ag',             'Fe',             'Au',             'Cu',             2),
  (pack_cg, admin_id, 'Quelle est la formule chimique de l''eau ?',           'HO',             'H2O',            'H3O',            'OH2',            1),
  (pack_cg, admin_id, 'Combien de continents y a-t-il sur Terre ?',           '5',              '6',              '7',              '8',              2),
  (pack_cg, admin_id, 'Quel pays a inventé les Jeux Olympiques ?',            'Rome',           'Grèce',          'Égypte',         'Perse',          1),
  (pack_cg, admin_id, 'Quelle est la vitesse de la lumière (km/s) ?',         '200 000 km/s',   '250 000 km/s',   '300 000 km/s',   '350 000 km/s',   2),
  (pack_cg, admin_id, 'Qui a écrit Roméo et Juliette ?',                      'Molière',        'Dickens',        'Hugo',           'Shakespeare',    3),
  (pack_cg, admin_id, 'Quel est le plus long fleuve du monde ?',              'Amazone',        'Nil',            'Mississippi',    'Yangtsé',        1),
  (pack_cg, admin_id, 'Combien de cordes a une guitare classique ?',          '4',              '5',              '6',              '7',              2),
  (pack_cg, admin_id, 'Qui a peint la Chapelle Sixtine ?',                    'Léonard de Vinci','Raphaël',       'Michel-Ange',    'Botticelli',     2),
  (pack_cg, admin_id, 'Quelle est la planète la plus proche du Soleil ?',     'Vénus',          'Mars',           'Mercure',        'Jupiter',        2),
  (pack_cg, admin_id, 'Dans quel pays se trouve le mont Everest ?',           'Inde',           'Chine',          'Tibet',          'Népal',          3);

  -- ══════════════════════════════════════════════════════════════
  -- PACK 2 : Cinéma & Séries (QCM)
  -- ══════════════════════════════════════════════════════════════
  INSERT INTO question_packs (id, owner_id, name, description, mode)
  VALUES (gen_random_uuid(), admin_id, '🎬 Cinéma & Séries', 'Films cultes, réalisateurs, répliques et séries télévisées.', 'qcm')
  RETURNING id INTO pack_cine;

  INSERT INTO custom_questions (pack_id, owner_id, question, choice_a, choice_b, choice_c, choice_d, correct_index) VALUES
  (pack_cine, admin_id, 'Qui réalise la saga "Le Seigneur des Anneaux" ?',    'Steven Spielberg',  'James Cameron',  'Peter Jackson',  'Ridley Scott',   2),
  (pack_cine, admin_id, 'Dans quel film entend-on "You shall not pass!" ?',   'Harry Potter',      'Le Seigneur des Anneaux', 'Merlin',  'The Witcher',    1),
  (pack_cine, admin_id, 'Quel acteur joue Tony Stark / Iron Man ?',           'Chris Evans',       'Chris Hemsworth','Robert Downey Jr.','Mark Ruffalo', 2),
  (pack_cine, admin_id, 'Dans quelle série voit-on la maison de papier ?',   'Narcos',            'La Casa de Papel','Élite',          'Money Heist',    1),
  (pack_cine, admin_id, 'Quel film remporte l''Oscar 2020 du meilleur film ?','Joker',             '1917',           'Parasite',       'The Irishman',   2),
  (pack_cine, admin_id, 'Qui joue Hermione Granger dans Harry Potter ?',      'Emma Watson',       'Emma Stone',     'Emma Roberts',   'Keira Knightley',0),
  (pack_cine, admin_id, '"May the Force be with you" vient de quel film ?',   'Star Trek',         'Star Wars',      'Dune',           'Avatar',         1),
  (pack_cine, admin_id, 'Dans "Titanic", qui joue le rôle de Rose ?',         'Cate Blanchett',    'Kate Winslet',   'Natalie Portman','Julia Roberts',  1),
  (pack_cine, admin_id, 'Quel studio a créé Toy Story ?',                     'DreamWorks',        'Disney',         'Pixar',          'Blue Sky',       2),
  (pack_cine, admin_id, 'Dans quel pays se déroule la série "Dark" ?',        'Autriche',          'Suisse',         'Allemagne',      'Suède',          2),
  (pack_cine, admin_id, 'Quel film met en scène le personnage de Forrest ?',  'Cast Away',         'Big',            'Forrest Gump',   'Rain Man',       2),
  (pack_cine, admin_id, '"I''ll be back" est la réplique de quel personnage ?','RoboCop',          'Rambo',          'Terminator',     'Predator',       2);

  -- ══════════════════════════════════════════════════════════════
  -- PACK 3 : Sport & Champions (QCM)
  -- ══════════════════════════════════════════════════════════════
  INSERT INTO question_packs (id, owner_id, name, description, mode)
  VALUES (gen_random_uuid(), admin_id, '⚽ Sport & Champions', 'Football, tennis, olympisme et sports collectifs.', 'qcm')
  RETURNING id INTO pack_sport;

  INSERT INTO custom_questions (pack_id, owner_id, question, choice_a, choice_b, choice_c, choice_d, correct_index) VALUES
  (pack_sport, admin_id, 'Combien de joueurs dans une équipe de football ?',   '9',         '10',        '11',          '12',             2),
  (pack_sport, admin_id, 'Qui détient le record de Ballons d''or (2024) ?',    'Cristiano Ronaldo', 'Messi', 'Pelé',     'Zidane',         1),
  (pack_sport, admin_id, 'Dans quel pays sont nés les Jeux Olympiques modernes ?', 'France', 'Angleterre', 'Grèce',    'Suisse',         2),
  (pack_sport, admin_id, 'Quel pays a gagné la Coupe du Monde 2018 ?',         'Croatie',   'Belgique',  'France',      'Angleterre',     2),
  (pack_sport, admin_id, 'Au tennis, comment appelle-t-on un score 0 ?',       'Blanc',     'Zéro',      'Love',        'Nul',            2),
  (pack_sport, admin_id, 'Combien de tours fait le Tour de France ?',          '15',        '18',        '21',          '25',             2),
  (pack_sport, admin_id, 'Quel sport se joue avec un volant ?',                'Squash',    'Badminton', 'Ping-pong',   'Padel',          1),
  (pack_sport, admin_id, 'Quel pays domine le rugby mondial en 2023 ?',        'Australie', 'Angleterre','Afrique du Sud','Nouvelle-Zélande', 2),
  (pack_sport, admin_id, 'Combien de points vaut un essai au rugby ?',         '3',         '4',         '5',           '7',              2),
  (pack_sport, admin_id, 'Quel est le plus grand stade du monde ?',            'Camp Nou',  'Rose Bowl',  'Wembley',    'Rungrado (Corée)', 3),
  (pack_sport, admin_id, 'À quelle distance se tire un penalty au foot ?',     '10 m',      '11 m',      '12 m',        '16 m',           1),
  (pack_sport, admin_id, 'Quel nageur a remporté 23 médailles d''or olympiques ?', 'Ryan Lochte', 'Michael Phelps', 'Ian Thorpe', 'Mark Spitz', 1);

  -- ══════════════════════════════════════════════════════════════
  -- PACK 4 : Blind Test Classiques (années 80-90-2000)
  -- ══════════════════════════════════════════════════════════════
  INSERT INTO question_packs (id, owner_id, name, description, mode)
  VALUES (gen_random_uuid(), admin_id, '🎸 Blind Test Classiques', 'Les tubes indémodables des années 80, 90 et 2000.', 'blind_test')
  RETURNING id INTO pack_bt80;

  INSERT INTO custom_questions (pack_id, owner_id, question, choice_a, choice_b, choice_c, choice_d, correct_index, youtube_url, audio_start_time) VALUES
  (pack_bt80, admin_id, 'Quel groupe chante ce titre ?', 'The Beatles', 'Led Zeppelin', 'Queen', 'The Rolling Stones', 2,
   'https://www.youtube.com/watch?v=fJ9rUzIMcZQ', 49),  -- Bohemian Rhapsody - Queen

  (pack_bt80, admin_id, 'Quel artiste interprète ce titre ?', 'Nirvana', 'Pearl Jam', 'Soundgarden', 'Alice in Chains', 0,
   'https://www.youtube.com/watch?v=hTWKbfoikeg', 30),  -- Smells Like Teen Spirit - Nirvana

  (pack_bt80, admin_id, 'Qui chante ce tube des années 80 ?', 'Elton John', 'David Bowie', 'Rod Stewart', 'Michael Jackson', 3,
   'https://www.youtube.com/watch?v=sOnqjkJTMaA', 40),  -- Thriller - Michael Jackson

  (pack_bt80, admin_id, 'Quel groupe joue ce riff culte ?', 'Guns N'' Roses', 'Aerosmith', 'Bon Jovi', 'Metallica', 0,
   'https://www.youtube.com/watch?v=1w7OgIMMRc4', 15),  -- Sweet Child O Mine - Guns N Roses

  (pack_bt80, admin_id, 'Qui interprète cette chanson française légendaire ?', 'Dalida', 'Édith Piaf', 'Barbara', 'Juliette Gréco', 1,
   'https://www.youtube.com/watch?v=U0QgOaQWm6w', 10),  -- La vie en rose - Édith Piaf

  (pack_bt80, admin_id, 'Quel groupe chante ce titre ?', 'The Who', 'Queen', 'AC/DC', 'Guns N'' Roses', 1,
   'https://www.youtube.com/watch?v=HgzGwKwLmgM', 20),  -- Don't Stop Me Now - Queen

  (pack_bt80, admin_id, 'Qui chante "I Will Always Love You" ?', 'Mariah Carey', 'Celine Dion', 'Whitney Houston', 'Tina Turner', 2,
   'https://www.youtube.com/watch?v=3JWTaaS7LdU', 55),  -- Whitney Houston

  (pack_bt80, admin_id, 'Quel groupe a sorti ce hit des 90s ?', 'Blur', 'Radiohead', 'Oasis', 'The Verve', 2,
   'https://www.youtube.com/watch?v=6hzrDeceEKc', 15),  -- Wonderwall - Oasis

  (pack_bt80, admin_id, 'Quel rappeur interprète Lose Yourself ?', 'Jay-Z', 'Eminem', '50 Cent', 'Dr. Dre', 1,
   'https://www.youtube.com/watch?v=_Yhyp-_hX2s', 20),  -- Lose Yourself - Eminem

  (pack_bt80, admin_id, 'Quel groupe californien joue ce titre ?', 'Green Day', 'Blink-182', 'Red Hot Chili Peppers', 'Weezer', 2,
   'https://www.youtube.com/watch?v=lwpHPCEKnUc', 25);  -- Under the Bridge - RHCP

  -- ══════════════════════════════════════════════════════════════
  -- PACK 5 : Blind Test Hits Actuels (2010-2024)
  -- ══════════════════════════════════════════════════════════════
  INSERT INTO question_packs (id, owner_id, name, description, mode)
  VALUES (gen_random_uuid(), admin_id, '🎵 Blind Test Hits Actuels', 'Les tubes incontournables de 2010 à aujourd''hui.', 'blind_test')
  RETURNING id INTO pack_bt2k;

  INSERT INTO custom_questions (pack_id, owner_id, question, choice_a, choice_b, choice_c, choice_d, correct_index, youtube_url, audio_start_time) VALUES
  (pack_bt2k, admin_id, 'Qui chante ce tube mondial ?', 'Rihanna', 'Beyoncé', 'Adele', 'Amy Winehouse', 2,
   'https://www.youtube.com/watch?v=rYEDA3JcQqw', 45),  -- Rolling in the Deep - Adele

  (pack_bt2k, admin_id, 'Quel artiste interprète ce hit ?', 'Justin Bieber', 'Ed Sheeran', 'Sam Smith', 'Harry Styles', 1,
   'https://www.youtube.com/watch?v=JGwWNGJdvx8', 30),  -- Shape of You - Ed Sheeran

  (pack_bt2k, admin_id, 'Qui chante ce titre avec Bruno Mars ?', 'Pharrell Williams', 'Mark Ronson', 'Jay-Z', 'Kanye West', 1,
   'https://www.youtube.com/watch?v=OPf0YbXqDm0', 35),  -- Uptown Funk - Mark Ronson

  (pack_bt2k, admin_id, 'Quel artiste belge chante ce titre ?', 'Aloïse Sauvage', 'Grand Corps Malade', 'Stromae', 'Vald', 2,
   'https://www.youtube.com/watch?v=oiKj0Z_Xnjc', 20),  -- Papaoutai - Stromae

  (pack_bt2k, admin_id, 'Qui interprète cette chanson joyeuse ?', 'Bruno Mars', 'Pharrell Williams', 'Justin Timberlake', 'Daft Punk', 1,
   'https://www.youtube.com/watch?v=y6Sxv-sUYtM', 25),  -- Happy - Pharrell Williams

  (pack_bt2k, admin_id, 'Quel artiste chante "Despacito" ?', 'J Balvin', 'Bad Bunny', 'Luis Fonsi', 'Maluma', 2,
   'https://www.youtube.com/watch?v=ktvTqknDobU', 15),  -- Despacito - Luis Fonsi

  (pack_bt2k, admin_id, 'Qui interprète "Chandelier" ?', 'Lorde', 'Lana Del Rey', 'Sia', 'Halsey', 2,
   'https://www.youtube.com/watch?v=2vjPBrBU-TM', 35),  -- Chandelier - Sia

  (pack_bt2k, admin_id, 'Quel artiste a sorti "Blinding Lights" ?', 'Drake', 'Post Malone', 'The Weeknd', 'Travis Scott', 2,
   'https://www.youtube.com/watch?v=4NRXx6U8ABQ', 20),  -- Blinding Lights - The Weeknd

  (pack_bt2k, admin_id, 'Qui chante "Je veux" ?', 'Stromae', 'Zaz', 'Carla Bruni', 'Camille', 1,
   'https://www.youtube.com/watch?v=1cnEXXlNNpw', 20),  -- Je veux - Zaz

  (pack_bt2k, admin_id, 'Quel artiste a sorti "Bad Guy" ?', 'Halsey', 'Olivia Rodrigo', 'Dua Lipa', 'Billie Eilish', 3,
   'https://www.youtube.com/watch?v=DyDfgMOUjCI', 15);  -- Bad Guy - Billie Eilish

  RAISE NOTICE '✅ 5 packs créés avec succès !';
  RAISE NOTICE '  Pack 1 (Culture Générale) : %', pack_cg;
  RAISE NOTICE '  Pack 2 (Cinéma & Séries)  : %', pack_cine;
  RAISE NOTICE '  Pack 3 (Sport & Champions) : %', pack_sport;
  RAISE NOTICE '  Pack 4 (Blind Test 80-00)  : %', pack_bt80;
  RAISE NOTICE '  Pack 5 (Blind Test Actuels) : %', pack_bt2k;

END $$;
