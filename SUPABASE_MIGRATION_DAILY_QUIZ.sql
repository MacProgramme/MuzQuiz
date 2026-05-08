-- =====================================================================
-- MIGRATION : Quiz du Jour + Classement mensuel
-- À exécuter dans l'éditeur SQL de Supabase
-- =====================================================================

-- 1. Cache des questions quotidiennes (1 ligne par jour)
create table if not exists daily_quizzes (
  id          uuid     default gen_random_uuid() primary key,
  date        date     not null unique,
  theme       text     not null,
  questions   jsonb    not null, -- tableau de 10 questions avec correct_index
  created_at  timestamptz default now()
);

-- 2. Scores des joueurs par jour
create table if not exists daily_quiz_scores (
  id           uuid     default gen_random_uuid() primary key,
  user_id      uuid     references auth.users not null,
  nickname     text     not null,
  date         date     not null,
  score        int      not null default 0 check (score >= 0 and score <= 100),
  completed_at timestamptz default now(),
  constraint daily_quiz_scores_user_date_unique unique(user_id, date)
);

-- 3. Archive des vainqueurs mensuels
create table if not exists monthly_winners (
  id           uuid     default gen_random_uuid() primary key,
  month        text     not null unique,  -- format YYYY-MM
  user_id      uuid,
  nickname     text,
  avatar_color text,
  total_score  int,
  created_at   timestamptz default now()
);

-- ─── RLS ──────────────────────────────────────────────────────────────
alter table daily_quizzes        enable row level security;
alter table daily_quiz_scores    enable row level security;
alter table monthly_winners      enable row level security;

-- daily_quizzes : lecture publique, écriture permissive (l'API gère la logique)
create policy "daily_quizzes: lecture" on daily_quizzes for select using (true);
create policy "daily_quizzes: insert"  on daily_quizzes for insert with check (true);

-- daily_quiz_scores : lecture publique, insertion par utilisateur authentifié
create policy "daily_quiz_scores: lecture"  on daily_quiz_scores for select using (true);
create policy "daily_quiz_scores: insert"   on daily_quiz_scores for insert with check (auth.uid() = user_id);
create policy "daily_quiz_scores: no update" on daily_quiz_scores for update using (false);

-- monthly_winners : lecture publique, insertion permissive
create policy "monthly_winners: lecture" on monthly_winners for select using (true);
create policy "monthly_winners: insert"  on monthly_winners for insert with check (true);

-- ─── Fonction RPC : classement mensuel ────────────────────────────────
create or replace function get_monthly_leaderboard(target_month text)
returns table(
  user_id      uuid,
  nickname     text,
  avatar_color text,
  total_score  bigint,
  rank         bigint
)
language sql
security definer
as $$
  select
    p.id          as user_id,
    p.nickname,
    coalesce(p.avatar_color, '#8B5CF6') as avatar_color,
    sum(s.score)  as total_score,
    rank() over (order by sum(s.score) desc) as rank
  from daily_quiz_scores s
  join profiles p on p.id = s.user_id
  where to_char(s.completed_at at time zone 'Europe/Paris', 'YYYY-MM') = target_month
  group by p.id, p.nickname, p.avatar_color
  order by total_score desc
  limit 11
$$;

-- ─── Indexes ──────────────────────────────────────────────────────────
create index if not exists idx_daily_quiz_scores_date    on daily_quiz_scores(date);
create index if not exists idx_daily_quiz_scores_user    on daily_quiz_scores(user_id);
create index if not exists idx_daily_quiz_scores_month   on daily_quiz_scores(completed_at);
