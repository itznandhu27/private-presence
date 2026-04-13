-- ============================================================
-- PRIVATE PRESENCE — Supabase Database Setup
-- Run this entire file in: Supabase → SQL Editor → New query
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1. USERS TABLE
--    Mirrors auth.users; stores allowed emails
-- ────────────────────────────────────────────────────────────
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique
);

-- Auto-populate when a user signs up via Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ────────────────────────────────────────────────────────────
-- 2. PRESENCE TABLE
-- ────────────────────────────────────────────────────────────
create table if not exists public.presence (
  user_id uuid primary key references public.users(id) on delete cascade,
  status text not null default 'offline' check (status in ('active', 'idle', 'offline')),
  last_seen timestamptz not null default now()
);


-- ────────────────────────────────────────────────────────────
-- 3. MESSAGES TABLE
-- ────────────────────────────────────────────────────────────
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.users(id) on delete cascade,
  content text not null,
  -- content is stored plaintext for MVP
  -- to add encryption: store encrypted blob here + a separate key table
  created_at timestamptz not null default now()
);


-- ────────────────────────────────────────────────────────────
-- 4. TIME TRACKING TABLE
-- ────────────────────────────────────────────────────────────
create table if not exists public.time_tracking (
  id uuid primary key default gen_random_uuid(),
  date date not null unique default current_date,
  shared_time integer not null default 0  -- stored in seconds
);


-- ────────────────────────────────────────────────────────────
-- 5. SIGNALS TABLE ("I'm thinking of you")
-- ────────────────────────────────────────────────────────────
create table if not exists public.signals (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Auto-cleanup: delete signals older than 1 minute to keep table clean
create or replace function public.cleanup_old_signals()
returns void as $$
begin
  delete from public.signals where created_at < now() - interval '1 minute';
end;
$$ language plpgsql security definer;


-- ────────────────────────────────────────────────────────────
-- 6. ROW LEVEL SECURITY (RLS)
--    Only the 2 allowed users can read/write data
-- ────────────────────────────────────────────────────────────

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.presence enable row level security;
alter table public.messages enable row level security;
alter table public.time_tracking enable row level security;
alter table public.signals enable row level security;

-- USERS: logged-in users can read all users (need to see the other person)
create policy "Users can read all users"
  on public.users for select
  to authenticated
  using (true);

-- PRESENCE: logged-in users can read all presence, but only update their own
create policy "Users can read all presence"
  on public.presence for select
  to authenticated
  using (true);

create policy "Users can upsert own presence"
  on public.presence for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own presence"
  on public.presence for update
  to authenticated
  using (auth.uid() = user_id);

-- MESSAGES: logged-in users can read all messages and insert their own
create policy "Users can read messages"
  on public.messages for select
  to authenticated
  using (true);

create policy "Users can send messages"
  on public.messages for insert
  to authenticated
  with check (auth.uid() = sender_id);

-- TIME TRACKING: logged-in users can read and update
create policy "Users can read time tracking"
  on public.time_tracking for select
  to authenticated
  using (true);

create policy "Users can insert time tracking"
  on public.time_tracking for insert
  to authenticated
  with check (true);

create policy "Users can update time tracking"
  on public.time_tracking for update
  to authenticated
  using (true);

-- SIGNALS: logged-in users can read all and insert their own
create policy "Users can read signals"
  on public.signals for select
  to authenticated
  using (true);

create policy "Users can send signals"
  on public.signals for insert
  to authenticated
  with check (auth.uid() = sender_id);


-- ────────────────────────────────────────────────────────────
-- 7. REALTIME — enable for live updates
-- ────────────────────────────────────────────────────────────
-- Run these one at a time if needed:
-- alter publication supabase_realtime add table public.presence;
-- alter publication supabase_realtime add table public.messages;
-- alter publication supabase_realtime add table public.time_tracking;
-- alter publication supabase_realtime add table public.signals;


-- ────────────────────────────────────────────────────────────
-- 8. DONE ✓
--    Next step: Create 2 users in Authentication → Users
--    Use the exact emails your app users will log in with
-- ────────────────────────────────────────────────────────────
