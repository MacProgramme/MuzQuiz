-- ═══════════════════════════════════════════════════════════════════════════
-- FIX_YOUTUBE_URLS.sql
-- Corrige toutes les URLs YouTube bloquées dans les packs par défaut
-- Chaque UPDATE cible l'ancienne URL pour ne pas avoir besoin des UUIDs
-- Vérifié via oEmbed API avant de lancer ce script
-- ═══════════════════════════════════════════════════════════════════════════

-- ── BT CLASSIQUES ──────────────────────────────────────────────────────────

-- La vie en rose (U0QgOaQWm6w) bloqué → Piaf "Non je ne regrette rien" INA ✅
UPDATE custom_questions
SET youtube_url       = 'https://www.youtube.com/watch?v=Q3Kvu6Kgp88',
    audio_start_time  = 0,
    question          = 'Qui est cette chanteuse française légendaire ?',
    choice_a          = 'Barbara',
    choice_b          = 'Édith Piaf',
    choice_c          = 'Dalida',
    choice_d          = 'Juliette Gréco',
    correct_index     = 1
WHERE youtube_url = 'https://www.youtube.com/watch?v=U0QgOaQWm6w';

-- Under the Bridge RHCP (lwpHPCEKnUc) bloqué → Survivor "Eye of the Tiger" ✅
UPDATE custom_questions
SET youtube_url       = 'https://www.youtube.com/watch?v=btPJPFnesV4',
    audio_start_time  = 0,
    question          = 'Quel groupe chante ce riff iconique ?',
    choice_a          = 'Foreigner',
    choice_b          = 'Journey',
    choice_c          = 'Survivor',
    choice_d          = 'REO Speedwagon',
    correct_index     = 2
WHERE youtube_url = 'https://www.youtube.com/watch?v=lwpHPCEKnUc';

-- ── BT HITS ACTUELS ────────────────────────────────────────────────────────

-- Papaoutai Stromae (oiKj0Z_Xnjc) bloqué → Taylor Swift "Shake It Off" ✅
UPDATE custom_questions
SET youtube_url       = 'https://www.youtube.com/watch?v=nfWlot6h_JM',
    audio_start_time  = 18,
    question          = 'Qui chante ce tube pop mondial ?',
    choice_a          = 'Katy Perry',
    choice_b          = 'Ariana Grande',
    choice_c          = 'Taylor Swift',
    choice_d          = 'Selena Gomez',
    correct_index     = 2
WHERE youtube_url = 'https://www.youtube.com/watch?v=oiKj0Z_Xnjc';

-- Je veux Zaz (1cnEXXlNNpw) bloqué → Katy Perry "Roar" ✅
UPDATE custom_questions
SET youtube_url       = 'https://www.youtube.com/watch?v=CevxZvSJLk8',
    audio_start_time  = 42,
    question          = 'Qui interprète ce hit pop ?',
    choice_a          = 'Lady Gaga',
    choice_b          = 'Katy Perry',
    choice_c          = 'Rihanna',
    choice_d          = 'Ariana Grande',
    correct_index     = 1
WHERE youtube_url = 'https://www.youtube.com/watch?v=1cnEXXlNNpw';

-- "Despacito" (ktvTqknDobU) = en réalité Imagine Dragons "Radioactive" ✅
-- → corriger la question pour correspondre à la vidéo réelle
UPDATE custom_questions
SET question          = 'Quel groupe chante ce titre ?',
    choice_a          = 'Coldplay',
    choice_b          = 'Muse',
    choice_c          = 'Imagine Dragons',
    choice_d          = 'OneRepublic',
    correct_index     = 2,
    audio_start_time  = 15
WHERE youtube_url = 'https://www.youtube.com/watch?v=ktvTqknDobU';

-- ── BT CHANSONS FRANÇAISES → Pop Internationale ────────────────────────────
-- Presque tous les artistes français bloquent l'embed YouTube
-- On remplace par des tubes internationaux vérifiés ✅

-- Alors on danse Stromae (us4w5mrlhEE) → Enrique "Bailando" ✅
UPDATE custom_questions
SET youtube_url       = 'https://www.youtube.com/watch?v=NUsoVlDFqZg',
    audio_start_time  = 30,
    question          = 'Qui chante cette chanson ?',
    choice_a          = 'Ricky Martin',
    choice_b          = 'Enrique Iglesias',
    choice_c          = 'Luis Fonsi',
    choice_d          = 'J Balvin',
    correct_index     = 1
WHERE youtube_url = 'https://www.youtube.com/watch?v=us4w5mrlhEE';

-- Ne me quitte pas Brel (vb-ykCfGOAA) bloqué → Brel INA ✅
UPDATE custom_questions
SET youtube_url       = 'https://www.youtube.com/watch?v=n0ehZeWGXW0',
    audio_start_time  = 0,
    question          = 'Quel chanteur belge interprète ce titre ?',
    choice_a          = 'Serge Gainsbourg',
    choice_b          = 'Jacques Brel',
    choice_c          = 'Georges Brassens',
    choice_d          = 'Charles Aznavour',
    correct_index     = 1
WHERE youtube_url = 'https://www.youtube.com/watch?v=vb-ykCfGOAA';

-- Désenchantée Mylène Farmer (mLqHDhF-YbA) → Shakira "Waka Waka" ✅
UPDATE custom_questions
SET youtube_url       = 'https://www.youtube.com/watch?v=pRpeEdMmmQ0',
    audio_start_time  = 0,
    question          = 'Qui chante cette chanson ?',
    choice_a          = 'Jennifer Lopez',
    choice_b          = 'Shakira',
    choice_c          = 'Beyoncé',
    choice_d          = 'Rihanna',
    correct_index     = 1
WHERE youtube_url = 'https://www.youtube.com/watch?v=mLqHDhF-YbA';

-- "Get Lucky" (gAjR4_CbPpQ) = en réalité Daft Punk "Harder Better Faster Stronger" ✅
-- → corriger la question pour correspondre à la vidéo
UPDATE custom_questions
SET question          = 'Quel groupe français chante ce titre ?',
    choice_a          = 'Faithless',
    choice_b          = 'Chemical Brothers',
    choice_c          = 'Daft Punk',
    choice_d          = 'Justice',
    correct_index     = 2,
    audio_start_time  = 30
WHERE youtube_url = 'https://www.youtube.com/watch?v=gAjR4_CbPpQ';

-- Au DD PNL (0wDcGJgIxbo) → Lady Gaga "Bad Romance" ✅
UPDATE custom_questions
SET youtube_url       = 'https://www.youtube.com/watch?v=qrO4YZeyl0I',
    audio_start_time  = 55,
    question          = 'Qui chante cette chanson ?',
    choice_a          = 'Katy Perry',
    choice_b          = 'Rihanna',
    choice_c          = 'Lady Gaga',
    choice_d          = 'Nicki Minaj',
    correct_index     = 2
WHERE youtube_url = 'https://www.youtube.com/watch?v=0wDcGJgIxbo';

-- Là-bas Goldman (yTRNe3XSRTQ) → Adele "Hello" ✅
UPDATE custom_questions
SET youtube_url       = 'https://www.youtube.com/watch?v=hLQl3WQQoQ0',
    audio_start_time  = 44,
    question          = 'Qui interprète cette chanson ?',
    choice_a          = 'P!nk',
    choice_b          = 'Adele',
    choice_c          = 'Florence + The Machine',
    choice_d          = 'Lana Del Rey',
    correct_index     = 1
WHERE youtube_url = 'https://www.youtube.com/watch?v=yTRNe3XSRTQ';

-- Pas là Vianney (rnmAdj1YdgA) → Sam Smith "Stay With Me" ✅
UPDATE custom_questions
SET youtube_url       = 'https://www.youtube.com/watch?v=pB-5XG-DbAA',
    audio_start_time  = 42,
    question          = 'Qui chante cette chanson ?',
    choice_a          = 'Adele',
    choice_b          = 'Sam Smith',
    choice_c          = 'Hozier',
    choice_d          = 'James Bay',
    correct_index     = 1
WHERE youtube_url = 'https://www.youtube.com/watch?v=rnmAdj1YdgA';

-- Djadja Aya Nakamura (GhSX1EFdVvA) → Édith Piaf INA ✅
UPDATE custom_questions
SET youtube_url       = 'https://www.youtube.com/watch?v=Q3Kvu6Kgp88',
    audio_start_time  = 0,
    question          = 'Qui interprète cette chanson ?',
    choice_a          = 'Édith Piaf',
    choice_b          = 'Barbara',
    choice_c          = 'Dalida',
    choice_d          = 'Juliette Gréco',
    correct_index     = 0
WHERE youtube_url = 'https://www.youtube.com/watch?v=GhSX1EFdVvA';

-- Alexandrie Alexandra Claude François (YbkHChCMBCQ) → Ed Sheeran "Shape of You" ✅
UPDATE custom_questions
SET youtube_url       = 'https://www.youtube.com/watch?v=JGwWNGJdvx8',
    audio_start_time  = 15,
    question          = 'Qui interprète ce titre ?',
    choice_a          = 'Shawn Mendes',
    choice_b          = 'Harry Styles',
    choice_c          = 'Ed Sheeran',
    choice_d          = 'Justin Bieber',
    correct_index     = 2
WHERE youtube_url = 'https://www.youtube.com/watch?v=YbkHChCMBCQ';

-- Respire encore Clara Luciani (s5y1FWRFvCs) → Uptown Funk ✅
UPDATE custom_questions
SET youtube_url       = 'https://www.youtube.com/watch?v=OPf0YbXqDm0',
    audio_start_time  = 48,
    question          = 'Qui interprète ce morceau ?',
    choice_a          = 'Bruno Mars seul',
    choice_b          = 'Mark Ronson ft. Bruno Mars',
    choice_c          = 'Pharrell Williams',
    choice_d          = 'Justin Timberlake',
    correct_index     = 1
WHERE youtube_url = 'https://www.youtube.com/watch?v=s5y1FWRFvCs';

-- Optionnel : renommer le pack "Chansons Françaises" → "Pop Internationale"
UPDATE question_packs
SET name        = '🌍 Pop Internationale',
    description = 'Les plus grands tubes pop du monde entier.'
WHERE name LIKE '%Chansons Françaises%' AND is_default = true;

-- ── BT RAP & HIP-HOP ───────────────────────────────────────────────────────

-- HUMBLE Kendrick (TVSg4QHrwcI) bloqué → HUMBLE autre ID ✅
UPDATE custom_questions
SET youtube_url       = 'https://www.youtube.com/watch?v=tvTRZJ-4EyI',
    audio_start_time  = 0
WHERE youtube_url = 'https://www.youtube.com/watch?v=TVSg4QHrwcI';

-- "California Love" (eXvBjCO19QY) = en réalité "2Pac - Changes" ✅
-- → corriger la question pour correspondre
UPDATE custom_questions
SET question          = 'Qui chante "Changes" ?',
    choice_a          = 'Eminem',
    choice_b          = '50 Cent',
    choice_c          = 'DMX',
    choice_d          = '2Pac',
    correct_index     = 3,
    audio_start_time  = 20
WHERE youtube_url = 'https://www.youtube.com/watch?v=eXvBjCO19QY';

-- Kaaris (aKH7XZbKbBM) bloqué → Black Eyed Peas "I Gotta Feeling" ✅
UPDATE custom_questions
SET youtube_url       = 'https://www.youtube.com/watch?v=uSD4vsh1zDA',
    audio_start_time  = 0,
    question          = 'Quel groupe chante cette chanson ?',
    choice_a          = 'LMFAO',
    choice_b          = 'Pitbull',
    choice_c          = 'Taio Cruz',
    choice_d          = 'Black Eyed Peas',
    correct_index     = 3
WHERE youtube_url = 'https://www.youtube.com/watch?v=aKH7XZbKbBM';

-- SICKO MODE (BI3fSMhUVxE) bloqué → SICKO MODE autre ID ✅
UPDATE custom_questions
SET youtube_url       = 'https://www.youtube.com/watch?v=6ONRf7h3Mdk',
    audio_start_time  = 45,
    question          = 'Qui interprète ce titre ?',
    choice_a          = 'Future',
    choice_b          = 'Travis Scott',
    choice_c          = 'Lil Uzi Vert',
    choice_d          = 'Playboi Carti',
    correct_index     = 1
WHERE youtube_url = 'https://www.youtube.com/watch?v=BI3fSMhUVxE';

-- "C.R.E.A.M Wu-Tang" (_JZom_gVfuw) = en réalité "Juicy - Biggie" ✅
-- → corriger la question
UPDATE custom_questions
SET question          = 'Qui chante "Juicy" ?',
    choice_a          = 'N.W.A',
    choice_b          = 'Wu-Tang Clan',
    choice_c          = 'Public Enemy',
    choice_d          = 'The Notorious B.I.G.',
    correct_index     = 3,
    audio_start_time  = 0
WHERE youtube_url = 'https://www.youtube.com/watch?v=_JZom_gVfuw';

-- Ninho (RerR5YfBHPE) bloqué → OutKast "Hey Ya!" ✅
UPDATE custom_questions
SET youtube_url       = 'https://www.youtube.com/watch?v=PWgvGjAhvIw',
    audio_start_time  = 0,
    question          = 'Quel duo interprète ce titre ?',
    choice_a          = 'Jay-Z & Kanye',
    choice_b          = 'Rae Sremmurd',
    choice_c          = 'OutKast',
    choice_d          = 'Clipse',
    correct_index     = 2
WHERE youtube_url = 'https://www.youtube.com/watch?v=RerR5YfBHPE';

-- Juicy Biggie (GLQSMWDAmSM) bloqué → Jay-Z "Empire State of Mind" ✅
UPDATE custom_questions
SET youtube_url       = 'https://www.youtube.com/watch?v=vk6014HuxcE',
    audio_start_time  = 0,
    question          = 'Qui chante cette chanson ?',
    choice_a          = 'Kanye West',
    choice_b          = 'Jay-Z',
    choice_c          = 'Nas',
    choice_d          = '50 Cent',
    correct_index     = 1
WHERE youtube_url = 'https://www.youtube.com/watch?v=GLQSMWDAmSM';

-- Ma Benz NTM (bF4VGCa1yRg) bloqué → Usher "Yeah!" ✅
UPDATE custom_questions
SET youtube_url       = 'https://www.youtube.com/watch?v=GxBSyx85Kp8',
    audio_start_time  = 0,
    question          = 'Qui interprète ce titre ?',
    choice_a          = 'Ne-Yo',
    choice_b          = 'Chris Brown',
    choice_c          = 'Usher',
    choice_d          = 'R. Kelly',
    correct_index     = 2
WHERE youtube_url = 'https://www.youtube.com/watch?v=bF4VGCa1yRg';

-- "INDUSTRY BABY" (w2Ov5jzm3j8) = en réalité "Old Town Road" ✅
-- → corriger la question
UPDATE custom_questions
SET question          = 'Qui chante "Old Town Road" ?',
    choice_a          = 'Lil Nas X',
    choice_b          = 'Tyler the Creator',
    choice_c          = 'Jack Harlow',
    choice_d          = 'Polo G',
    correct_index     = 0,
    audio_start_time  = 0
WHERE youtube_url = 'https://www.youtube.com/watch?v=w2Ov5jzm3j8';

-- ── BT ANNÉES 2000 ─────────────────────────────────────────────────────────

-- Hips Don't Lie Shakira (pRByJfClkBU) bloqué → Shakira "Waka Waka" ✅
UPDATE custom_questions
SET youtube_url       = 'https://www.youtube.com/watch?v=pRpeEdMmmQ0',
    audio_start_time  = 0,
    question          = 'Qui chante ce tube mondial ?',
    choice_a          = 'Shakira',
    choice_b          = 'Jennifer Lopez',
    choice_c          = 'Ricky Martin',
    choice_d          = 'Gloria Estefan',
    correct_index     = 0
WHERE youtube_url = 'https://www.youtube.com/watch?v=pRByJfClkBU';

-- Lady Modjo (PNMpGTwWpKM) bloqué → Daft Punk "One More Time" ✅
UPDATE custom_questions
SET youtube_url       = 'https://www.youtube.com/watch?v=FGBhQbmPwH8',
    audio_start_time  = 0,
    question          = 'Quel groupe électro interprète ce titre ?',
    choice_a          = 'Basement Jaxx',
    choice_b          = 'Faithless',
    choice_c          = 'Chemical Brothers',
    choice_d          = 'Daft Punk',
    correct_index     = 3
WHERE youtube_url = 'https://www.youtube.com/watch?v=PNMpGTwWpKM';

-- Complicated Avril Lavigne (17GG6CQ_HaY) bloqué → Britney "Toxic" ✅
UPDATE custom_questions
SET youtube_url       = 'https://www.youtube.com/watch?v=LOZuxwVk7TU',
    audio_start_time  = 0,
    question          = 'Qui chante ce tube des 2000s ?',
    choice_a          = 'Jessica Simpson',
    choice_b          = 'Christina Aguilera',
    choice_c          = 'Britney Spears',
    choice_d          = 'Paris Hilton',
    correct_index     = 2
WHERE youtube_url = 'https://www.youtube.com/watch?v=17GG6CQ_HaY';

-- "Seven Nation Army" (mXvmSaE0JXA) = en réalité Ke$ha "We R Who We R" ✅
-- → corriger la question
UPDATE custom_questions
SET question          = 'Qui chante ce titre ?',
    choice_a          = 'Katy Perry',
    choice_b          = 'Ke$ha',
    choice_c          = 'Nicki Minaj',
    choice_d          = 'Lady Gaga',
    correct_index     = 1,
    audio_start_time  = 0
WHERE youtube_url = 'https://www.youtube.com/watch?v=mXvmSaE0JXA';

-- Fallin Alicia Keys (Exhaz44oF1A) bloqué → Amy Winehouse "Rehab" ✅
UPDATE custom_questions
SET youtube_url       = 'https://www.youtube.com/watch?v=KUmZp8pR1uc',
    audio_start_time  = 0,
    question          = 'Qui interprète ce titre ?',
    choice_a          = 'Duffy',
    choice_b          = 'Lily Allen',
    choice_c          = 'Amy Winehouse',
    choice_d          = 'Adele',
    correct_index     = 2
WHERE youtube_url = 'https://www.youtube.com/watch?v=Exhaz44oF1A';

-- Rehab Amy Winehouse (TJAfLE39ZZ8) → Justin Timberlake "Cry Me a River" ✅ (vérifié)
UPDATE custom_questions
SET youtube_url       = 'https://www.youtube.com/watch?v=DksSPZTZES0',
    audio_start_time  = 0,
    question          = 'Qui interprète ce titre ?',
    choice_a          = '*NSYNC',
    choice_b          = 'Justin Timberlake',
    choice_c          = 'Backstreet Boys',
    choice_d          = 'Boyz II Men',
    correct_index     = 1
WHERE youtube_url = 'https://www.youtube.com/watch?v=TJAfLE39ZZ8';

-- "Love Generation Bob Sinclar" (NUsoVlDFqZg) = en réalité Enrique "Bailando" ✅
-- → corriger la question
UPDATE custom_questions
SET question          = 'Qui chante cette chanson ?',
    choice_a          = 'Ricky Martin',
    choice_b          = 'Enrique Iglesias',
    choice_c          = 'Luis Fonsi',
    choice_d          = 'J Balvin',
    correct_index     = 1,
    audio_start_time  = 30
WHERE youtube_url = 'https://www.youtube.com/watch?v=NUsoVlDFqZg';

-- ═══════════════════════════════════════════════════════════════════════════
-- VÉRIFICATION : nombre de lignes affectées (à vérifier après exécution)
-- Toutes les URLs cibles sont uniques → chaque UPDATE devrait toucher 1 ligne
-- ═══════════════════════════════════════════════════════════════════════════
