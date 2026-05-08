-- ============================================================
-- MUZQUIZ — Schéma COMPLET (remplace tout)
-- Si tu pars de zéro : colle ce script entier dans
-- Supabase > SQL Editor > Run
--
-- Si tu as déjà le schéma de base (schema.sql exécuté avant) :
-- Utilise plutôt migration.sql à la place.
-- ============================================================

-- Supprimer les anciennes tables si elles existent (repart à zéro)
drop table if exists qcm_answers cascade;
drop table if exists buzzes cascade;
drop table if exists room_players cascade;
drop table if exists rooms cascade;

-- ============================================================
-- TABLE: rooms
-- ============================================================
create table rooms (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  host_id uuid references auth.users not null,
  status text default 'waiting' check (status in ('waiting','playing','finished')),
  current_question int default 0,
  mode text default 'buzz' check (mode in ('buzz','qcm')),
  timer_duration int default 20,
  max_players int default 8,
  sound_enabled boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- TABLE: room_players
-- ============================================================
create table room_players (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references rooms on delete cascade,
  user_id uuid references auth.users,
  nickname text not null,
  score int default 0,
  is_host boolean default false,
  joined_at timestamptz default now()
);

-- ============================================================
-- TABLE: buzzes
-- ============================================================
create table buzzes (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references rooms on delete cascade,
  player_id uuid references room_players on delete cascade,
  question_index int not null,
  buzzed_at timestamptz default now()
);

-- ============================================================
-- TABLE: qcm_answers
-- ============================================================
create table qcm_answers (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references rooms on delete cascade,
  player_id uuid references room_players on delete cascade,
  question_index int not null,
  answer_index int not null,
  is_correct boolean not null,
  answered_at timestamptz default now()
);

-- ============================================================
-- TEMPS RÉEL
-- ============================================================
alter publication supabase_realtime add table rooms;
alter publication supabase_realtime add table room_players;
alter publication supabase_realtime add table buzzes;
alter publication supabase_realtime add table qcm_answers;

-- ============================================================
-- SÉCURITÉ (Row Level Security)
-- ============================================================
alter table rooms enable row level security;
alter table room_players enable row level security;
alter table buzzes enable row level security;
alter table qcm_answers enable row level security;

-- Rooms
create policy "Rooms lisibles par tous" on rooms for select using (true);
create policy "Rooms créables par users connectés" on rooms for insert with check (auth.uid() = host_id);
create policy "Rooms modifiables par l'hôte" on rooms for update using (auth.uid() = host_id);

-- Players
create policy "Players lisibles par tous" on room_players for select using (true);
create policy "Players: insertion libre" on room_players for insert with check (true);
create policy "Players: update score" on room_players for update using (true);

-- Buzzes
create policy "Buzzes lisibles par tous" on buzzes for select using (true);
create policy "Buzzes: insertion libre" on buzzes for insert with check (true);

-- QCM Answers
create policy "QCM answers lisibles par tous" on qcm_answers for select using (true);
create policy "QCM answers: insertion libre" on qcm_answers for insert with check (true);

-- ============================================================
-- RAPPEL : Active la connexion anonyme dans Supabase
-- Authentication > Sign In / Up > Allow anonymous sign-ins > ON
-- ============================================================
