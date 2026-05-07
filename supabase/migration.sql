-- ============================================================
-- MUZQUIZ — Migration : nouvelles colonnes + table qcm_answers
-- Colle ce script dans : Supabase > SQL Editor > Run
-- ============================================================

-- 1. Ajouter les nouvelles colonnes à la table rooms
alter table rooms
  add column if not exists mode text default 'buzz' check (mode in ('buzz', 'qcm')),
  add column if not exists timer_duration int default 20,
  add column if not exists max_players int default 8,
  add column if not exists sound_enabled boolean default true;

-- 2. Créer la table des réponses QCM
create table if not exists qcm_answers (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references rooms on delete cascade,
  player_id uuid references room_players on delete cascade,
  question_index int not null,
  answer_index int not null,
  is_correct boolean not null,
  answered_at timestamptz default now()
);

-- 3. Activer le temps réel sur qcm_answers
alter publication supabase_realtime add table qcm_answers;

-- 4. Politiques de sécurité pour qcm_answers
alter table qcm_answers enable row level security;

create policy "QCM answers lisibles par tous" on qcm_answers for select using (true);
create policy "QCM answers: insertion libre" on qcm_answers for insert with check (true);

-- ============================================================
-- C'est tout ! Le jeu est maintenant prêt à tourner.
-- ============================================================
