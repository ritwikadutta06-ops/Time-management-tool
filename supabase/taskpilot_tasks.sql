-- TaskPilot lightweight sync table (works without auth)
-- Run this in Supabase SQL editor if you want cloud sync for TaskPilot tasks.

create table if not exists public.taskpilot_tasks (
  id uuid primary key,
  client_id text not null,
  title text not null,
  due_at timestamptz,
  priority text not null check (priority in ('low', 'medium', 'high')),
  status text not null check (status in ('todo', 'done')),
  add_to_calendar boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_taskpilot_tasks_client_id
on public.taskpilot_tasks(client_id);

alter table public.taskpilot_tasks enable row level security;

drop policy if exists "Public sync access for taskpilot tasks" on public.taskpilot_tasks;
create policy "Public sync access for taskpilot tasks"
on public.taskpilot_tasks
for all
using (true)
with check (true);
