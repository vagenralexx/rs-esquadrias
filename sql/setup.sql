-- ============================================================
-- SETUP COMPLETO DO BANCO DE DADOS
-- Execute no Supabase SQL Editor:
-- https://supabase.com/dashboard/project/buykmrxavdzadcapdseo/sql/new
-- ============================================================

-- 1. Cria a tabela profiles
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  name text not null default '',
  role text not null default 'viewer' check (role in ('master', 'editor', 'viewer')),
  created_at timestamptz default now()
);

-- 2. Habilita RLS
alter table public.profiles enable row level security;

-- 3. Remove policies antigas
drop policy if exists "profiles_select" on public.profiles;
drop policy if exists "profiles_insert" on public.profiles;
drop policy if exists "profiles_update" on public.profiles;
drop policy if exists "profiles_delete" on public.profiles;

-- 4. Recria as policies
create policy "profiles_select" on public.profiles for select to authenticated using (true);
create policy "profiles_insert" on public.profiles for insert to authenticated with check (true);

-- Apenas master pode atualizar qualquer perfil (inclui mudar role).
-- Usuários comuns só podem atualizar seus próprios dados e NÃO podem mudar o campo role.
create policy "profiles_update" on public.profiles
  for update to authenticated
  using (
    auth.uid() = id
    OR (select role from public.profiles where id = auth.uid()) = 'master'
  )
  with check (
    -- master pode tudo
    (select role from public.profiles where id = auth.uid()) = 'master'
    -- não-master só pode alterar o próprio registro, mantendo o role atual
    OR (
      auth.uid() = id
      AND role = (select role from public.profiles where id = auth.uid())
    )
  );

create policy "profiles_delete" on public.profiles for delete to authenticated
  using ((select role from public.profiles where id = auth.uid()) = 'master');

-- 5. Função que cria o profile automaticamente ao criar user no Auth
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'viewer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- 6. Recria a trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ============================================================
-- TABELA DE CONFIGURAÇÕES DO SITE
-- ============================================================
create table if not exists public.site_config (
  key text primary key,
  value text not null default ''
);

alter table public.site_config enable row level security;

drop policy if exists "site_config_select" on public.site_config;
drop policy if exists "site_config_upsert" on public.site_config;

create policy "site_config_select" on public.site_config for select using (true);
create policy "site_config_upsert" on public.site_config for all to authenticated using (true) with check (true);

-- Valores padrão
insert into public.site_config (key, value) values
  ('address', 'R. Sebastião Mattos, 386, Munhoz - MG, 37620-000'),
  ('phone', '(35) 99720-0066'),
  ('email', 'contato@rsesquadrias.com.br'),
  ('instagram', 'https://www.instagram.com/rsesquadriasevidracaria_/'),
  ('maps', 'https://www.google.com/maps?q=-22.6104739,-46.366385'),
  ('maps_embed', 'https://maps.google.com/maps?q=-22.6104739,-46.366385&z=17&output=embed')
on conflict (key) do nothing;

-- ============================================================
-- TABELA DE PORTFÓLIO
-- ============================================================
create table if not exists public.portfolio (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null,
  image_url text not null,
  "order" integer not null default 0,
  created_at timestamptz default now()
);

alter table public.portfolio enable row level security;

drop policy if exists "portfolio_select" on public.portfolio;
drop policy if exists "portfolio_all" on public.portfolio;

-- Qualquer visitante pode ver
create policy "portfolio_select" on public.portfolio for select using (true);
-- Só autenticados podem inserir/atualizar/deletar
create policy "portfolio_all" on public.portfolio for all to authenticated using (true) with check (true);

-- ============================================================
-- STORAGE BUCKET (execute separado no SQL editor)
-- ============================================================
-- O bucket 'images' precisa ser criado pelo Dashboard:
-- Storage → New bucket → nome: images → Public: ON
--
-- Depois rode este SQL para liberar upload autenticado:
insert into storage.buckets (id, name, public) values ('images', 'images', true)
on conflict (id) do nothing;

drop policy if exists "images_select" on storage.objects;
drop policy if exists "images_insert" on storage.objects;
drop policy if exists "images_delete" on storage.objects;

create policy "images_select" on storage.objects for select using (bucket_id = 'images');
create policy "images_insert" on storage.objects for insert to authenticated with check (bucket_id = 'images');
create policy "images_delete" on storage.objects for delete to authenticated using (bucket_id = 'images');

-- ============================================================
-- APÓS CRIAR O USUÁRIO NO DASHBOARD, PROMOVA PARA MASTER:
-- Troque o email abaixo pelo seu email
-- ============================================================

-- update public.profiles set role = 'master' where email = 'seu-email@aqui.com';
