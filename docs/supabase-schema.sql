-- Mindly_new Supabase 스키마 (참고용)
-- .env에 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY 설정 후 사용

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  nickname text,
  created_at timestamptz default now()
);

create table if not exists journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  date date not null,
  text text not null,
  created_at timestamptz default now()
);

create table if not exists mood_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  date date not null,
  mood text check (mood in ('positive', 'stress', 'neutral')),
  mind_energy int,
  preset text,
  created_at timestamptz default now()
);

create table if not exists missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  date date not null,
  ai_coaching boolean default false,
  breathe boolean default false,
  journal boolean default false,
  bonus_claimed boolean default false
);

create table if not exists recovery_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  date date not null unique,
  tasks jsonb not null,
  score int default 0,
  updated_at timestamptz default now()
);

create table if not exists recovery_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  date date not null,
  task_id text not null,
  completed_at timestamptz default now()
);

create table if not exists weekly_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  week_label text not null,
  positive_days int,
  stress_days int,
  patterns jsonb,
  insights jsonb,
  recommendations jsonb,
  generated_at timestamptz default now()
);

create table if not exists ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  date date not null,
  preset text,
  summary text,
  created_at timestamptz default now()
);
