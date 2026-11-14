create table if not exists public.nutriquest_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state_json jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.nutriquest_profiles enable row level security;
drop policy if exists "Users can read their own NutriQuest data" on public.nutriquest_profiles;
create policy "Users can read their own NutriQuest data" on public.nutriquest_profiles for select using (auth.uid() = user_id);
drop policy if exists "Users can insert their own NutriQuest data" on public.nutriquest_profiles;
create policy "Users can insert their own NutriQuest data" on public.nutriquest_profiles for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update their own NutriQuest data" on public.nutriquest_profiles;
create policy "Users can update their own NutriQuest data" on public.nutriquest_profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
grant select, insert, update on public.nutriquest_profiles to authenticated;
