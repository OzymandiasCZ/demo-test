create table if not exists public.notes (
  id bigint generated always as identity primary key,
  text text not null,
  created_at timestamptz not null default now()
);
alter table public.notes enable row level security;
grant usage on schema public to service_role;
grant all on table public.notes to service_role;
grant usage, select on all sequences in schema public to service_role;

-- Aplikace přistupuje k tabulce výhradně serverově přes service_role (obchází RLS).
-- Role anon/authenticated (publishable/anon klíč, Data API) nesmí mít žádná práva.
-- RLS je zapnuté a záměrně bez policies (deny-all) jako druhá vrstva ochrany.
revoke all on table public.notes from anon, authenticated;
