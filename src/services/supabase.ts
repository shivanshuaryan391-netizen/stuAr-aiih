import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey && url.startsWith('http'))

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null

/**
 * Database schema (run in Supabase SQL editor to enable cloud sync):
 *
 * create table profiles (id uuid primary key references auth.users, name text, bio text default '',
 *   institution text default '', learner_type text default '', goal text default '', updated_at timestamptz default now());
 * create table chats (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users,
 *   title text, messages jsonb default '[]', model text default 'openrouter/auto', updated_at timestamptz default now());
 * create table history (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users,
 *   type text, label text, xp int default 0, created_at timestamptz default now());
 * create table study_plans (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users,
 *   title text, content text, created_at timestamptz default now());
 * create table tasks (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users,
 *   title text, done boolean default false, priority text default 'medium', due date, created_at timestamptz default now());
 * create table achievements (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users,
 *   achievement_id text, unlocked_at timestamptz default now());
 * create table bookmarks (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users,
 *   tool_id text, created_at timestamptz default now());
 * alter table each enable row level security; create policy "own rows" using (auth.uid() = user_id);
 */
