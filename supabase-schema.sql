create table if not exists public.notes (
  id bigint generated always as identity primary key,
  text text not null,
  created_at timestamptz not null default now()
);
alter table public.notes enable row level security;
