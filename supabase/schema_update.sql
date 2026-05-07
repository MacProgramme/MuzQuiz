-- ============================================================
-- BUZZY — Mise à jour du schéma (à exécuter dans SQL Editor)
-- ============================================================

-- Ajouter le mode de jeu et les paramètres à la table rooms
alter table rooms add column if not exists mode text default 'buzz' check (mode in ('buzz', 'qcm'));
alter table rooms add column if not exists timer_duration int default 20;
alter table rooms add column if not exists max_players int default 8;
alter table rooms add column if not exists sound_enabled boolean default true;

-- Table des réponses QCM
create table if not exists qcm_answers (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references rooms on delete cascade,
  player_id uuid references room_players on delete cascade,
  question_index int not null,
  answer_index int not null,
  is_correct boolean default false,
  answered_at timestamptz default now(),
  unique(room_id, player_id, question_index)
);

-- Activer le temps réel
alter publication supabase_realtime add table qcm_answers;

-- Politiques de sécurité
alter table qcm_answers enable row level security;
create policy "QCM answers lisibles par tous" on qcm_answers for select using (true);
create policy "QCM answers: insertion libre" on qcm_answers for insert with check (true);
