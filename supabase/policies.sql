-- Enable Row Level Security

alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.task_comments enable row level security;
alter table public.activity_logs enable row level security;

-- Profiles
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles
for update
using (auth.uid() = id);

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
on public.profiles
for select
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

-- Tasks
drop policy if exists "Users can view related tasks" on public.tasks;
create policy "Users can view related tasks"
on public.tasks
for select
using (
  auth.uid() = created_by
  or auth.uid() = assigned_to
  or exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists "Users can create tasks" on public.tasks;
create policy "Users can create tasks"
on public.tasks
for insert
with check (auth.uid() = created_by);

drop policy if exists "Users can update related tasks" on public.tasks;
create policy "Users can update related tasks"
on public.tasks
for update
using (
  auth.uid() = created_by
  or auth.uid() = assigned_to
  or exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists "Users can delete their own tasks" on public.tasks;
create policy "Users can delete their own tasks"
on public.tasks
for delete
using (
  auth.uid() = created_by
  or exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

-- Comments
drop policy if exists "Users can view comments for visible tasks" on public.task_comments;
create policy "Users can view comments for visible tasks"
on public.task_comments
for select
using (
  exists (
    select 1
    from public.tasks t
    where t.id = task_comments.task_id
      and (
        t.created_by = auth.uid()
        or t.assigned_to = auth.uid()
        or exists (
          select 1
          from public.profiles p
          where p.id = auth.uid() and p.role = 'admin'
        )
      )
  )
);

drop policy if exists "Users can add comments to visible tasks" on public.task_comments;
create policy "Users can add comments to visible tasks"
on public.task_comments
for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.tasks t
    where t.id = task_comments.task_id
      and (
        t.created_by = auth.uid()
        or t.assigned_to = auth.uid()
        or exists (
          select 1
          from public.profiles p
          where p.id = auth.uid() and p.role = 'admin'
        )
      )
  )
);

-- Activity logs
drop policy if exists "Admins can view activity logs" on public.activity_logs;
create policy "Admins can view activity logs"
on public.activity_logs
for select
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists "Users can create their own activity logs" on public.activity_logs;
create policy "Users can create their own activity logs"
on public.activity_logs
for insert
with check (auth.uid() = actor_id);
