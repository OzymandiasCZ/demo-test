create table if not exists public.notes (
  id bigint generated always as identity primary key,
  text text not null,
  created_at timestamptz not null default now()
);
alter table public.notes enable row level security;
grant usage on schema public to service_role;
grant all on table public.notes to service_role;
grant usage, select on all sequences in schema public to service_role;
