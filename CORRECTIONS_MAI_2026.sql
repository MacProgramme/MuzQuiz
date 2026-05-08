-- ═══════════════════════════════════════════════════════════════════════
-- CORRECTIONS QUIZ MAI 2026
-- 10 erreurs factuelles identifiées lors de la révision des 310 questions
-- À exécuter dans l'éditeur SQL Supabase
-- ═══════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────
-- 1er MAI — Q9 (index 8) : Le plus long fleuve du monde
-- ERREUR : correct=1 (Nil) → CORRECTION : correct=0 (Amazone)
-- Le consensus scientifique actuel reconnaît l'Amazone comme le plus long
-- ─────────────────────────────────────────────────────────────────────
UPDATE daily_quizzes
SET questions = jsonb_set(questions::jsonb, '{8,correct}', '0'::jsonb)::json
WHERE date = '2026-05-01';

-- ─────────────────────────────────────────────────────────────────────
-- 9 MAI — Q8 (index 7) : Jeu vidéo le plus vendu de tous les temps
-- ERREUR : correct=2 (Minecraft ~300 M) → CORRECTION : correct=1 (Tetris ~520 M)
-- Tetris dépasse 520 millions d'exemplaires toutes plateformes confondues
-- ─────────────────────────────────────────────────────────────────────
UPDATE daily_quizzes
SET questions = jsonb_set(questions::jsonb, '{7,correct}', '1'::jsonb)::json
WHERE date = '2026-05-09';

-- ─────────────────────────────────────────────────────────────────────
-- 11 MAI — Q7 (index 6) : "Mammifère qui ne peut pas voler"
-- ERREUR : Pingouin, Autruche et Manchot sont des OISEAUX, pas des mammifères
-- CORRECTION : Réécriture — "Quel oiseau est totalement incapable de voler ?"
-- ─────────────────────────────────────────────────────────────────────
UPDATE daily_quizzes
SET questions = jsonb_set(
  questions::jsonb,
  '{6}',
  '{"question":"Quel oiseau est totalement incapable de voler ?","choices":["Faucon","Albatros","Manchot","Cigogne"],"correct":2}'::jsonb
)::json
WHERE date = '2026-05-11';

-- ─────────────────────────────────────────────────────────────────────
-- 15 MAI — Q1 (index 0) : Surnom "Le Grand Charles"
-- ERREUR : "Le Grand Charles" désigne Charles de Gaulle, pas un chanteur
-- CORRECTION : Charles Trenet est surnommé "Le Fou Chantant"
-- ─────────────────────────────────────────────────────────────────────
UPDATE daily_quizzes
SET questions = jsonb_set(
  questions::jsonb,
  '{0}',
  '{"question":"Quel chanteur français est surnommé Le Fou Chantant ?","choices":["Charles Trenet","Charles Aznavour","Georges Brassens","Jacques Brel"],"correct":0}'::jsonb
)::json
WHERE date = '2026-05-15';

-- ─────────────────────────────────────────────────────────────────────
-- 16 MAI — Q5 (index 4) : Choix dupliqués
-- ERREUR : choices[2]="Noah (même)" et choices[3]="Yannick Noah" sont identiques
-- CORRECTION : Remplacement par de vraies alternatives
-- ─────────────────────────────────────────────────────────────────────
UPDATE daily_quizzes
SET questions = jsonb_set(
  questions::jsonb,
  '{4}',
  '{"question":"Quel sportif français a remporté Roland-Garros le plus de fois ?","choices":["Henri Leconte","Yannick Noah","Henri Lacoste","Gustavo Kuerten"],"correct":1}'::jsonb
)::json
WHERE date = '2026-05-16';

-- ─────────────────────────────────────────────────────────────────────
-- 18 MAI — Q10 (index 9) : Continent dans l'hémisphère Sud
-- ERREUR : L'Australie est également entièrement dans l'hémisphère Sud
--          → deux bonnes réponses possibles (Australie et Antarctique)
-- CORRECTION : Reformulation autour de la couverture glaciaire unique
-- ─────────────────────────────────────────────────────────────────────
UPDATE daily_quizzes
SET questions = jsonb_set(
  questions::jsonb,
  '{9}',
  '{"question":"Quel est le seul continent entièrement recouvert de glace ?","choices":["Afrique","Australie","Asie","Antarctique"],"correct":3}'::jsonb
)::json
WHERE date = '2026-05-18';

-- ─────────────────────────────────────────────────────────────────────
-- 21 MAI — Q8 (index 7) : Logo / mascotte de Reddit
-- ERREUR : correct=0 ("alien vert") → la mascotte Snoo est orange/blanc
-- CORRECTION : correct=2 ("extraterrestre orange")
-- ─────────────────────────────────────────────────────────────────────
UPDATE daily_quizzes
SET questions = jsonb_set(questions::jsonb, '{7,correct}', '2'::jsonb)::json
WHERE date = '2026-05-21';

-- ─────────────────────────────────────────────────────────────────────
-- 24 MAI — Q6 (index 5) : Du Guesclin à Azincourt
-- ERREUR 1 : Du Guesclin est mort en 1380 ; Azincourt date de 1415 (35 ans après)
-- ERREUR 2 : choices[0]="Bertrand du Guesclin" et choices[3]="Du Guesclin" sont identiques
-- CORRECTION : Question sur le surnom historique de Du Guesclin
-- ─────────────────────────────────────────────────────────────────────
UPDATE daily_quizzes
SET questions = jsonb_set(
  questions::jsonb,
  '{5}',
  '{"question":"Quel héros médiéval français est surnommé le Connétable de France ?","choices":["Bertrand du Guesclin","Jeanne d''Arc","Bayard","Roland"],"correct":0}'::jsonb
)::json
WHERE date = '2026-05-24';

-- ─────────────────────────────────────────────────────────────────────
-- 29 MAI — Q9 (index 8) : Actrice dans Aliens + T2 + Titanic
-- ERREUR : Aucune actrice ne joue dans les 3 films simultanément
--   Aliens (1986) → Sigourney Weaver
--   Terminator 2 (1991) → Linda Hamilton
--   Titanic (1997) → Kate Winslet
-- CORRECTION : Question sur Linda Hamilton dans la saga Terminator
-- ─────────────────────────────────────────────────────────────────────
UPDATE daily_quizzes
SET questions = jsonb_set(
  questions::jsonb,
  '{8}',
  '{"question":"Quelle actrice joue Sarah Connor dans les deux premiers films Terminator ?","choices":["Sigourney Weaver","Linda Hamilton","Kate Winslet","Jamie Lee Curtis"],"correct":1}'::jsonb
)::json
WHERE date = '2026-05-29';

-- ─────────────────────────────────────────────────────────────────────
-- 31 MAI — Q3 (index 2) : Question Dubrovnik en doublon
-- DOUBLON : "Dans quel pays se trouve la ville de Dubrovnik ?" posée le 27 MAI (Q3)
-- CORRECTION : Remplacée par une question sur la géographie africaine
-- ─────────────────────────────────────────────────────────────────────
UPDATE daily_quizzes
SET questions = jsonb_set(
  questions::jsonb,
  '{2}',
  '{"question":"Quel est le plus grand pays d''Afrique par superficie ?","choices":["République Démocratique du Congo","Soudan","Libye","Algérie"],"correct":3}'::jsonb
)::json
WHERE date = '2026-05-31';

-- ═══════════════════════════════════════════════════════════════════════
-- FIN — 10 corrections appliquées
-- ═══════════════════════════════════════════════════════════════════════
