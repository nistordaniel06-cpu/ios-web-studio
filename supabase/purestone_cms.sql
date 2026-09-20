-- PureStone CMS schema
create table if not exists public.purestone_content (
  id text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.purestone_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.purestone_content enable row level security;
alter table public.purestone_admins enable row level security;

create policy "purestone_content_public_read"
on public.purestone_content for select
to anon, authenticated
using (true);

create policy "purestone_admins_self_read"
on public.purestone_admins for select
to authenticated
using (user_id = auth.uid());

create policy "purestone_content_admin_insert"
on public.purestone_content for insert
to authenticated
with check (exists (select 1 from public.purestone_admins a where a.user_id = auth.uid()));

create policy "purestone_content_admin_update"
on public.purestone_content for update
to authenticated
using (exists (select 1 from public.purestone_admins a where a.user_id = auth.uid()))
with check (exists (select 1 from public.purestone_admins a where a.user_id = auth.uid()));

create policy "purestone_content_admin_delete"
on public.purestone_content for delete
to authenticated
using (exists (select 1 from public.purestone_admins a where a.user_id = auth.uid()));

insert into public.purestone_content (id, content)
values ('site', '{}'::jsonb)
on conflict (id) do nothing;
