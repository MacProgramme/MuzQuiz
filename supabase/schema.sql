-- ============================================================
-- BUZZY — Schéma de base de données Supabase
-- Colle ce script dans : Supabase > SQL Editor > Run
-- ============================================================

-- Table des salles de jeu
create table rooms (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  host_id uuid references auth.users not null,
  status text default 'waiting' check (status in ('waiting','playing','finished')),
  current_question int default 0,
  created_at timestamptz default now()
);

-- Table des joueurs dans une salle
create table room_players (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references rooms on delete cascade,
  user_id uuid references auth.users,
  nickname text not null,
  score int default 0,
  is_host boolean default false,
  joined_at timestamptz default now()
);

-- Table des buzz (qui a buzzé en premier)
create table buzzes (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references rooms on delete cascade,
  player_id uuid references room_players on delete cascade,
  question_index int not null,
  buzzed_at timestamptz default now()
);

-- Activer le temps réel sur les tables nécessaires
alter publication supabase_realtime add table rooms;
alter publication supabase_realtime add table room_players;
alter publication supabase_realtime add table buzzes;

-- Politiques de sécurité (RLS)
alter table rooms enable row level security;
alter table room_players enable row level security;
alter table buzzes enable row level security;

-- Rooms
create policy "Rooms lisibles par tous" on rooms for select using (true);
create policy "Rooms créables par users connectés" on rooms for insert with check (auth.uid() = host_id);
create policy "Rooms modifiables par l'hôte" on rooms for update using (auth.uid() = host_id);

-- Players
create policy "Players lisibles par tous" on room_players for select using (true);
create policy "Players: insertion libre" on room_players for insert with check (true);
create policy "Players: update own score" on room_players for update using (true);

-- Buzzes
create policy "Buzzes lisibles par tous" on buzzes for select using (true);
create policy "Buzzes: insertion libre" on buzzes for insert with check (true);

-- ============================================================
-- IMPORTANT : Active aussi la connexion anonyme dans Supabase
-- Authentication → Providers → Anonymous Sign Ins → Enable
-- ============================================================
