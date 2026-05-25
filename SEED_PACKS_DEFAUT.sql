-- ================================================================
-- SEED : 10 packs de questions par défaut MUZQUIZ
-- 5 packs QCM + 5 packs Blind Test
-- À exécuter UNE SEULE FOIS dans Supabase → SQL Editor
-- Les packs sont publics (lecture pour tous) car RLS = SELECT true
-- Propriétaire = compte admin antoine.gegedu27@gmail.com
-- ================================================================

DO $$
DECLARE
  admin_id     UUID;
  -- QCM packs
  pack_cg      UUID;
  pack_cine    UUID;
  pack_sport   UUID;
  pack_science UUID;
  pack_histoire UUID;
  -- Blind Test packs
  pack_bt_classiques UUID;
  pack_bt_actuels    UUID;
  pack_bt_french     UUID;
  pack_bt_rap        UUID;
  pack_bt_2000s      UUID;
BEGIN

  -- Récupérer l'UUID de l'admin
  SELECT id INTO admin_id FROM auth.users WHERE email = 'antoine.gegedu27@gmail.com' LIMIT 1;
  IF admin_id IS NULL THEN RAISE EXCEPTION 'Admin non trouvé'; END IF;

  -- ══════════════════════════════════════════════════════════════
  -- QCM 1 : Culture Générale
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
  -- QCM 2 : Cinéma & Séries
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
  -- QCM 3 : Sport & Champions
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
  -- QCM 4 : Science & Technologie
  -- ══════════════════════════════════════════════════════════════
  INSERT INTO question_packs (id, owner_id, name, description, mode)
  VALUES (gen_random_uuid(), admin_id, '🔬 Science & Technologie', 'Physique, biologie, informatique et grandes découvertes scientifiques.', 'qcm')
  RETURNING id INTO pack_science;

  INSERT INTO custom_questions (pack_id, owner_id, question, choice_a, choice_b, choice_c, choice_d, correct_index) VALUES
  (pack_science, admin_id, 'Qui a inventé le téléphone ?',                          'Thomas Edison',    'Nikola Tesla',     'Alexander Graham Bell', 'Guglielmo Marconi', 2),
  (pack_science, admin_id, 'Quel est le nombre d''os dans le corps humain adulte ?', '186',              '206',              '226',                   '256',               1),
  (pack_science, admin_id, 'En quelle année a été inventé internet (World Wide Web) ?', '1983',          '1989',             '1991',                  '1995',              1),
  (pack_science, admin_id, 'Qui a découvert la pénicilline ?',                       'Marie Curie',      'Louis Pasteur',    'Alexander Fleming',     'Albert Einstein',   2),
  (pack_science, admin_id, 'Quelle planète est surnommée la "planète rouge" ?',      'Jupiter',          'Saturne',          'Mars',                  'Mercure',           2),
  (pack_science, admin_id, 'Quelle est l''unité de mesure de la fréquence ?',        'Volt',             'Watt',             'Hertz',                 'Ohm',               2),
  (pack_science, admin_id, 'Quel gaz constitue environ 78% de l''atmosphère ?',      'Oxygène',          'Dioxyde de carbone','Argon',                'Azote',             3),
  (pack_science, admin_id, 'Quelle entreprise a créé le système Android ?',          'Apple',            'Microsoft',        'Google',                'Samsung',           2),
  (pack_science, admin_id, 'Combien de chromosomes a un être humain normal ?',       '23',               '44',               '46',                    '48',                2),
  (pack_science, admin_id, 'Quel scientifique a théorisé la relativité générale ?',  'Newton',           'Einstein',         'Hawking',               'Bohr',              1),
  (pack_science, admin_id, 'Quelle est la particule fondamentale de l''atome ?',     'Electron et proton','Quark',           'Neutron',               'Photon',            1),
  (pack_science, admin_id, 'En quelle année l''homme a-t-il marché sur la Lune ?',   '1965',             '1967',             '1969',                  '1972',              2);

  -- ══════════════════════════════════════════════════════════════
  -- QCM 5 : Histoire & Civilisations
  -- ══════════════════════════════════════════════════════════════
  INSERT INTO question_packs (id, owner_id, name, description, mode)
  VALUES (gen_random_uuid(), admin_id, '🏛️ Histoire & Civilisations', 'De l''Antiquité à nos jours — événements marquants et grandes figures.', 'qcm')
  RETURNING id INTO pack_histoire;

  INSERT INTO custom_questions (pack_id, owner_id, question, choice_a, choice_b, choice_c, choice_d, correct_index) VALUES
  (pack_histoire, admin_id, 'En quelle année a eu lieu la prise de la Bastille ?',     '1785',           '1789',           '1792',           '1799',           1),
  (pack_histoire, admin_id, 'Quel empire a construit le Colisée à Rome ?',             'Empire grec',    'Empire romain',  'Empire ottoman', 'Empire byzantin',1),
  (pack_histoire, admin_id, 'Qui était le premier président des États-Unis ?',          'Abraham Lincoln','Thomas Jefferson','George Washington','Benjamin Franklin',2),
  (pack_histoire, admin_id, 'En quelle année a eu lieu la Seconde Guerre mondiale (début) ?', '1936',    '1939',           '1940',           '1941',           1),
  (pack_histoire, admin_id, 'Quel mur est tombé en 1989 ?',                             'Mur de Chine',  'Mur d''Hadrien', 'Mur de Berlin',  'Mur de Jéricho', 2),
  (pack_histoire, admin_id, 'Qui a découvert l''Amérique selon la tradition historique ?', 'Amerigo Vespucci', 'Christophe Colomb', 'Vasco de Gama', 'Marco Polo', 1),
  (pack_histoire, admin_id, 'Quelle civilisation a construit les pyramides de Gizeh ?', 'Sumérienne',    'Mésopotamienne', 'Égyptienne',     'Nubienne',       2),
  (pack_histoire, admin_id, 'En quelle année a eu lieu la Révolution russe ?',          '1905',           '1911',           '1917',           '1923',           2),
  (pack_histoire, admin_id, 'Qui était Napoléon Bonaparte ?',                            'Roi de France', 'Général et Empereur', 'Cardinal', 'Duc de Bretagne', 1),
  (pack_histoire, admin_id, 'Quel pays a lancé le premier satellite artificiel Spoutnik ?', 'États-Unis', 'Allemagne',      'URSS',           'Chine',          2),
  (pack_histoire, admin_id, 'En quelle année la France a-t-elle aboli l''esclavage définitivement ?', '1789', '1815',        '1848',           '1905',           2),
  (pack_histoire, admin_id, 'Qui était Jeanne d''Arc ?',                                 'Une reine de France', 'Une sainte guerrière', 'Une alchimiste', 'Une poétesse', 1);

  -- ══════════════════════════════════════════════════════════════
  -- BLIND TEST 1 : Classiques (années 80-90-2000)
  -- ══════════════════════════════════════════════════════════════
  INSERT INTO question_packs (id, owner_id, name, description, mode)
  VALUES (gen_random_uuid(), admin_id, '🎸 Blind Test Classiques', 'Les tubes indémodables des années 80, 90 et 2000.', 'blind_test')
  RETURNING id INTO pack_bt_classiques;

  INSERT INTO custom_questions (pack_id, owner_id, question, choice_a, choice_b, choice_c, choice_d, correct_index, youtube_url, audio_start_time) VALUES
  (pack_bt_classiques, admin_id, 'Quel groupe chante ce titre ?',               'The Beatles',    'Led Zeppelin',  'Queen',              'The Rolling Stones', 2,
   'https://www.youtube.com/watch?v=fJ9rUzIMcZQ', 49),   -- Bohemian Rhapsody - Queen

  (pack_bt_classiques, admin_id, 'Quel artiste interprète ce titre ?',          'Nirvana',        'Pearl Jam',     'Soundgarden',        'Alice in Chains',    0,
   'https://www.youtube.com/watch?v=hTWKbfoikeg', 30),   -- Smells Like Teen Spirit - Nirvana

  (pack_bt_classiques, admin_id, 'Qui chante ce tube des années 80 ?',          'Elton John',     'David Bowie',   'Rod Stewart',        'Michael Jackson',    3,
   'https://www.youtube.com/watch?v=sOnqjkJTMaA', 40),   -- Thriller - Michael Jackson

  (pack_bt_classiques, admin_id, 'Quel groupe joue ce riff culte ?',            'Guns N'' Roses', 'Aerosmith',     'Bon Jovi',           'Metallica',          0,
   'https://www.youtube.com/watch?v=1w7OgIMMRc4', 15),   -- Sweet Child O Mine - Guns N Roses

  (pack_bt_classiques, admin_id, 'Qui interprète cette chanson française légendaire ?', 'Dalida', 'Édith Piaf',   'Barbara',            'Juliette Gréco',     1,
   'https://www.youtube.com/watch?v=U0QgOaQWm6w', 10),   -- La vie en rose - Édith Piaf

  (pack_bt_classiques, admin_id, 'Quel groupe chante ce titre ?',               'The Who',        'Queen',         'AC/DC',              'Guns N'' Roses',     1,
   'https://www.youtube.com/watch?v=HgzGwKwLmgM', 20),   -- Don't Stop Me Now - Queen

  (pack_bt_classiques, admin_id, 'Qui chante "I Will Always Love You" ?',       'Mariah Carey',   'Celine Dion',   'Whitney Houston',    'Tina Turner',        2,
   'https://www.youtube.com/watch?v=3JWTaaS7LdU', 55),   -- Whitney Houston

  (pack_bt_classiques, admin_id, 'Quel groupe a sorti ce hit des 90s ?',        'Blur',           'Radiohead',     'Oasis',              'The Verve',          2,
   'https://www.youtube.com/watch?v=6hzrDeceEKc', 15),   -- Wonderwall - Oasis

  (pack_bt_classiques, admin_id, 'Quel rappeur interprète Lose Yourself ?',     'Jay-Z',          'Eminem',        '50 Cent',            'Dr. Dre',            1,
   'https://www.youtube.com/watch?v=_Yhyp-_hX2s', 20),   -- Lose Yourself - Eminem

  (pack_bt_classiques, admin_id, 'Quel groupe californien joue ce titre ?',     'Green Day',      'Blink-182',     'Red Hot Chili Peppers','Weezer',           2,
   'https://www.youtube.com/watch?v=lwpHPCEKnUc', 25);   -- Under the Bridge - RHCP

  -- ══════════════════════════════════════════════════════════════
  -- BLIND TEST 2 : Hits Actuels (2010-2024)
  -- ══════════════════════════════════════════════════════════════
  INSERT INTO question_packs (id, owner_id, name, description, mode)
  VALUES (gen_random_uuid(), admin_id, '🎵 Blind Test Hits Actuels', 'Les tubes incontournables de 2010 à aujourd''hui.', 'blind_test')
  RETURNING id INTO pack_bt_actuels;

  INSERT INTO custom_questions (pack_id, owner_id, question, choice_a, choice_b, choice_c, choice_d, correct_index, youtube_url, audio_start_time) VALUES
  (pack_bt_actuels, admin_id, 'Qui chante ce tube mondial ?',                   'Rihanna',        'Beyoncé',       'Adele',              'Amy Winehouse',      2,
   'https://www.youtube.com/watch?v=rYEDA3JcQqw', 45),   -- Rolling in the Deep - Adele

  (pack_bt_actuels, admin_id, 'Quel artiste interprète ce hit ?',               'Justin Bieber',  'Ed Sheeran',    'Sam Smith',          'Harry Styles',       1,
   'https://www.youtube.com/watch?v=JGwWNGJdvx8', 30),   -- Shape of You - Ed Sheeran

  (pack_bt_actuels, admin_id, 'Qui chante ce titre avec Bruno Mars ?',          'Pharrell Williams','Mark Ronson',  'Jay-Z',              'Kanye West',         1,
   'https://www.youtube.com/watch?v=OPf0YbXqDm0', 35),   -- Uptown Funk - Mark Ronson

  (pack_bt_actuels, admin_id, 'Quel artiste belge chante ce titre ?',           'Aloïse Sauvage', 'Grand Corps Malade','Stromae',         'Vald',               2,
   'https://www.youtube.com/watch?v=oiKj0Z_Xnjc', 20),   -- Papaoutai - Stromae

  (pack_bt_actuels, admin_id, 'Qui interprète cette chanson joyeuse ?',         'Bruno Mars',     'Pharrell Williams','Justin Timberlake','Daft Punk',         1,
   'https://www.youtube.com/watch?v=y6Sxv-sUYtM', 25),   -- Happy - Pharrell Williams

  (pack_bt_actuels, admin_id, 'Quel artiste chante "Despacito" ?',              'J Balvin',       'Bad Bunny',     'Luis Fonsi',         'Maluma',             2,
   'https://www.youtube.com/watch?v=ktvTqknDobU', 15),   -- Despacito - Luis Fonsi

  (pack_bt_actuels, admin_id, 'Qui interprète "Chandelier" ?',                  'Lorde',          'Lana Del Rey',  'Sia',                'Halsey',             2,
   'https://www.youtube.com/watch?v=2vjPBrBU-TM', 35),   -- Chandelier - Sia

  (pack_bt_actuels, admin_id, 'Quel artiste a sorti "Blinding Lights" ?',       'Drake',          'Post Malone',   'The Weeknd',         'Travis Scott',       2,
   'https://www.youtube.com/watch?v=4NRXx6U8ABQ', 20),   -- Blinding Lights - The Weeknd

  (pack_bt_actuels, admin_id, 'Qui chante "Je veux" ?',                         'Stromae',        'Zaz',           'Carla Bruni',        'Camille',            1,
   'https://www.youtube.com/watch?v=1cnEXXlNNpw', 20),   -- Je veux - Zaz

  (pack_bt_actuels, admin_id, 'Quel artiste a sorti "Bad Guy" ?',               'Halsey',         'Olivia Rodrigo','Dua Lipa',           'Billie Eilish',      3,
   'https://www.youtube.com/watch?v=DyDfgMOUjCI', 15);   -- Bad Guy - Billie Eilish

  -- ══════════════════════════════════════════════════════════════
  -- BLIND TEST 3 : Chansons Françaises
  -- ══════════════════════════════════════════════════════════════
  INSERT INTO question_packs (id, owner_id, name, description, mode)
  VALUES (gen_random_uuid(), admin_id, '🇫🇷 Blind Test Chansons Françaises', 'Les plus grands tubes de la chanson française, de tous les âges.', 'blind_test')
  RETURNING id INTO pack_bt_french;

  INSERT INTO custom_questions (pack_id, owner_id, question, choice_a, choice_b, choice_c, choice_d, correct_index, youtube_url, audio_start_time) VALUES
  (pack_bt_french, admin_id, 'Qui chante ce tube français ?',                   'Stromae',        'Maître Gims',   'Soprano',            'Louane',             0,
   'https://www.youtube.com/watch?v=us4w5mrlhEE', 25),   -- Alors on danse - Stromae

  (pack_bt_french, admin_id, 'Quel artiste interprète ce titre ?',              'Serge Gainsbourg','Jacques Brel',  'Georges Brassens',   'Charles Aznavour',   1,
   'https://www.youtube.com/watch?v=vb-ykCfGOAA', 15),   -- Ne me quitte pas - Jacques Brel

  (pack_bt_french, admin_id, 'Qui chante ce slow culte ?',                      'Mylène Farmer',  'Indochine',     'Patricia Kaas',      'Vanessa Paradis',    0,
   'https://www.youtube.com/watch?v=mLqHDhF-YbA', 30),   -- Désenchantée - Mylène Farmer

  (pack_bt_french, admin_id, 'Quel groupe français chante ce titre ?',          'Daft Punk',      'Air',           'Phoenix',            'Justice',            0,
   'https://www.youtube.com/watch?v=gAjR4_CbPpQ', 20),   -- Get Lucky - Daft Punk

  (pack_bt_french, admin_id, 'Qui interprète ce rap français ?',                'Jul',            'Nekfeu',        'PNL',                'Booba',              2,
   'https://www.youtube.com/watch?v=0wDcGJgIxbo', 20),   -- Au DD - PNL

  (pack_bt_french, admin_id, 'Quel artiste chante cette chanson ?',             'Francis Cabrel', 'Jean-Jacques Goldman', 'Michel Sardou',  'Alain Souchon',      1,
   'https://www.youtube.com/watch?v=yTRNe3XSRTQ', 10),   -- Là-bas - Jean-Jacques Goldman

  (pack_bt_french, admin_id, 'Qui chante ce tube de la variété française ?',    'Kendji Girac',   'Slimane',       'Vianney',            'Claudio Capéo',      2,
   'https://www.youtube.com/watch?v=rnmAdj1YdgA', 20),   -- Pas là - Vianney

  (pack_bt_french, admin_id, 'Quel duo chante ce titre ?',                      'Aya Nakamura & Ninho', 'Nicki Minaj & Drake', 'Dadju & Rihanna', 'Soprano & Jul', 0,
   'https://www.youtube.com/watch?v=GhSX1EFdVvA', 15),   -- Djadja - Aya Nakamura

  (pack_bt_french, admin_id, 'Qui interprète cette chanson nostalgique ?',      'Claude François', 'Michel Delpech', 'Serge Gainsbourg',  'Antoine',            0,
   'https://www.youtube.com/watch?v=YbkHChCMBCQ', 20),   -- Alexandrie Alexandra - Claude François

  (pack_bt_french, admin_id, 'Quel artiste chante ce titre récent ?',           'Angèle',         'Eddy de Pretto','Clara Luciani',      'Hoshi',              2,
   'https://www.youtube.com/watch?v=s5y1FWRFvCs', 20);   -- Respire encore - Clara Luciani

  -- ══════════════════════════════════════════════════════════════
  -- BLIND TEST 4 : Rap & Hip-Hop
  -- ══════════════════════════════════════════════════════════════
  INSERT INTO question_packs (id, owner_id, name, description, mode)
  VALUES (gen_random_uuid(), admin_id, '🎤 Blind Test Rap & Hip-Hop', 'Les classiques et hits du rap français et international.', 'blind_test')
  RETURNING id INTO pack_bt_rap;

  INSERT INTO custom_questions (pack_id, owner_id, question, choice_a, choice_b, choice_c, choice_d, correct_index, youtube_url, audio_start_time) VALUES
  (pack_bt_rap, admin_id, 'Quel rappeur américain chante ce titre ?',           'Kanye West',     'Jay-Z',         'Kendrick Lamar',     'Drake',              2,
   'https://www.youtube.com/watch?v=TVSg4QHrwcI', 25),   -- HUMBLE - Kendrick Lamar

  (pack_bt_rap, admin_id, 'Qui interprète ce classique du rap ?',               'Eminem',         '50 Cent',       'DMX',                '2Pac',               3,
   'https://www.youtube.com/watch?v=eXvBjCO19QY', 20),   -- California Love - 2Pac

  (pack_bt_rap, admin_id, 'Quel rappeur français chante ce titre ?',            'SCH',            'Niro',          'Kaaris',             'Alkpote',            2,
   'https://www.youtube.com/watch?v=aKH7XZbKbBM', 15),   -- Kaaris - Tchoin

  (pack_bt_rap, admin_id, 'Qui interprète ce hit rap ?',                        'Future',         'Travis Scott',  'Lil Uzi Vert',       'Playboi Carti',      1,
   'https://www.youtube.com/watch?v=BI3fSMhUVxE', 30),   -- SICKO MODE - Travis Scott

  (pack_bt_rap, admin_id, 'Quel groupe de rap chante ce titre ?',               'N.W.A',          'Wu-Tang Clan',  'Public Enemy',       'Run-DMC',            1,
   'https://www.youtube.com/watch?v=_JZom_gVfuw', 20),   -- C.R.E.A.M - Wu-Tang Clan

  (pack_bt_rap, admin_id, 'Quel rappeur français interprète ce titre ?',        'Lacrim',         'Maes',          'Ninho',              'Lorenzo',            2,
   'https://www.youtube.com/watch?v=RerR5YfBHPE', 20),   -- Moshpit - Ninho

  (pack_bt_rap, admin_id, 'Qui chante ce tube rap old school ?',                'Biggie',         'Jay-Z',         'Nas',                'Ice Cube',           0,
   'https://www.youtube.com/watch?v=GLQSMWDAmSM', 15),   -- Juicy - Biggie Smalls

  (pack_bt_rap, admin_id, 'Quel rappeur interprète "In My Feelings" ?',         'Post Malone',    'Cardi B',       'Drake',              'Lil Wayne',          2,
   'https://www.youtube.com/watch?v=DRS_PpOrUZ4', 20),   -- In My Feelings - Drake

  (pack_bt_rap, admin_id, 'Qui chante ce classique rap français ?',             'IAM',            'NTM',           'Lunatic',            'La Rumeur',          1,
   'https://www.youtube.com/watch?v=bF4VGCa1yRg', 15),   -- Ma Benz - NTM

  (pack_bt_rap, admin_id, 'Quel artiste chante ce titre rap récent ?',          'Lil Nas X',      'Tyler the Creator', 'Jack Harlow',     'Polo G',             0,
   'https://www.youtube.com/watch?v=w2Ov5jzm3j8', 20);   -- INDUSTRY BABY - Lil Nas X

  -- ══════════════════════════════════════════════════════════════
  -- BLIND TEST 5 : Années 2000 (Pop & RnB)
  -- ══════════════════════════════════════════════════════════════
  INSERT INTO question_packs (id, owner_id, name, description, mode)
  VALUES (gen_random_uuid(), admin_id, '💿 Blind Test Années 2000', 'Pop, RnB et électro — les tubes des années 2000 qui ont marqué une génération.', 'blind_test')
  RETURNING id INTO pack_bt_2000s;

  INSERT INTO custom_questions (pack_id, owner_id, question, choice_a, choice_b, choice_c, choice_d, correct_index, youtube_url, audio_start_time) VALUES
  (pack_bt_2000s, admin_id, 'Qui chante ce tube RnB des 2000s ?',              'Usher',          'Chris Brown',   'Ne-Yo',              'Trey Songz',         0,
   'https://www.youtube.com/watch?v=GxBSyx85Kp8', 30),   -- Yeah! - Usher

  (pack_bt_2000s, admin_id, 'Quel groupe pop interprète ce titre ?',           'Backstreet Boys','NSYNC',         'Westlife',           'Take That',          0,
   'https://www.youtube.com/watch?v=4fndeDfaWCg', 15),   -- I Want It That Way - Backstreet Boys

  (pack_bt_2000s, admin_id, 'Qui chante ce hit pop mondial ?',                 'Shakira',        'Jennifer Lopez','Ricky Martin',       'Gloria Estefan',     0,
   'https://www.youtube.com/watch?v=pRByJfClkBU', 20),   -- Hips Don't Lie - Shakira

  (pack_bt_2000s, admin_id, 'Quel artiste interprète ce tube électro ?',       'Daft Punk',      'Chemical Brothers', 'Faithless',       'Modjo',              3,
   'https://www.youtube.com/watch?v=PNMpGTwWpKM', 25),   -- Lady (Hear Me Tonight) - Modjo

  (pack_bt_2000s, admin_id, 'Qui chante ce tube pop des 2000s ?',              'Nelly Furtado',  'Alanis Morissette', 'Avril Lavigne',   'Pink',               2,
   'https://www.youtube.com/watch?v=17GG6CQ_HaY', 20),   -- Complicated - Avril Lavigne

  (pack_bt_2000s, admin_id, 'Quel groupe joue ce titre rock des 2000s ?',      'Foo Fighters',   'The Strokes',   'White Stripes',      'Arctic Monkeys',     2,
   'https://www.youtube.com/watch?v=mXvmSaE0JXA', 20),   -- Seven Nation Army - White Stripes

  (pack_bt_2000s, admin_id, 'Qui interprète "Crazy in Love" ?',                'Rihanna',        'Mariah Carey',  'Beyoncé',            'Alicia Keys',        2,
   'https://www.youtube.com/watch?v=ViwtNLUqkMY', 20),   -- Crazy in Love - Beyoncé

  (pack_bt_2000s, admin_id, 'Quel artiste chante ce classique R&B ?',          'Maxwell',        'D''Angelo',     'Alicia Keys',        'John Legend',        2,
   'https://www.youtube.com/watch?v=Exhaz44oF1A', 20),   -- Fallin'' - Alicia Keys

  (pack_bt_2000s, admin_id, 'Qui chante ce tube des 2000s ?',                  'Amy Winehouse',  'Duffy',         'Lily Allen',         'Kate Nash',          0,
   'https://www.youtube.com/watch?v=TJAfLE39ZZ8', 35),   -- Rehab - Amy Winehouse

  (pack_bt_2000s, admin_id, 'Quel DJ chante ce tube électro ?',                'Bob Sinclar',    'David Guetta',  'Martin Solveig',     'Cassius',            1,
   'https://www.youtube.com/watch?v=NUsoVlDFqZg', 20);   -- Love Generation - Bob Sinclar

  RAISE NOTICE '✅ 10 packs créés avec succès !';
  RAISE NOTICE '=== QCM (5 packs) ===';
  RAISE NOTICE '  QCM 1 (Culture Générale)         : %', pack_cg;
  RAISE NOTICE '  QCM 2 (Cinéma & Séries)          : %', pack_cine;
  RAISE NOTICE '  QCM 3 (Sport & Champions)        : %', pack_sport;
  RAISE NOTICE '  QCM 4 (Science & Technologie)    : %', pack_science;
  RAISE NOTICE '  QCM 5 (Histoire & Civilisations) : %', pack_histoire;
  RAISE NOTICE '=== BLIND TEST (5 packs) ===';
  RAISE NOTICE '  BT 1 (Classiques 80-90-2000)     : %', pack_bt_classiques;
  RAISE NOTICE '  BT 2 (Hits Actuels 2010-2024)    : %', pack_bt_actuels;
  RAISE NOTICE '  BT 3 (Chansons Françaises)       : %', pack_bt_french;
  RAISE NOTICE '  BT 4 (Rap & Hip-Hop)             : %', pack_bt_rap;
  RAISE NOTICE '  BT 5 (Années 2000 Pop & RnB)     : %', pack_bt_2000s;

END $$;
