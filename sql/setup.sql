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
      AND "role" = (select role from public.profiles where id = auth.uid())
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
  ('maps_embed', 'https://maps.google.com/maps?q=-22.6104739,-46.366385&z=17&output=embed'),
  ('notification_email', ''),
  ('hero_image', ''),
  ('services_list', 'Esquadrias de Alumínio,Vidros de Segurança,Espelhos Premium,Box de Banheiro,Pele de Vidro / Fachada,Portões de Alumínio,Outro')
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
-- TABELA DE MÉTRICAS DE VISITAS AO SITE
-- ============================================================
create table if not exists public.page_views (
  id uuid default gen_random_uuid() primary key,
  session_id text not null,
  page text not null default '/',
  created_at timestamptz default now()
);

alter table public.page_views enable row level security;

drop policy if exists "page_views_insert" on public.page_views;
drop policy if exists "page_views_select" on public.page_views;

-- Qualquer visitante (anônimo) pode registrar visualização
create policy "page_views_insert" on public.page_views for insert with check (true);
-- Apenas usuários autenticados (admins) podem consultar
create policy "page_views_select" on public.page_views for select to authenticated using (true);

-- ============================================================
-- TABELA DE PARCEIROS
-- ============================================================
create table if not exists public.partners (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null default '',
  address text not null default '',
  phone text not null default '',
  whatsapp text not null default '',
  logo_url text not null default '',
  "order" integer not null default 0,
  active boolean not null default true,
  created_at timestamptz default now()
);

alter table public.partners enable row level security;

drop policy if exists "partners_select" on public.partners;
drop policy if exists "partners_all" on public.partners;

-- Qualquer visitante pode ver parceiros ativos
create policy "partners_select" on public.partners for select using (active = true);
-- Só autenticados podem gerenciar
create policy "partners_all" on public.partners for all to authenticated using (true) with check (true);

-- ============================================================
-- TABELA DE LEADS
-- ============================================================
create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text not null,
  email text,
  service text not null default '',
  message text not null default '',
  source text not null default '',
  status text not null default 'new' check (status in ('new', 'saved', 'archived')),
  notes text not null default '',
  created_at timestamptz default now()
);

alter table public.leads enable row level security;

drop policy if exists "leads_insert" on public.leads;
drop policy if exists "leads_select" on public.leads;
drop policy if exists "leads_all" on public.leads;

-- Qualquer visitante (anônimo) pode inserir lead
create policy "leads_insert" on public.leads for insert with check (true);
-- Só autenticados podem ver e gerenciar
create policy "leads_select" on public.leads for select to authenticated using (true);
create policy "leads_all" on public.leads for all to authenticated using (true) with check (true);

-- ============================================================
-- TABELA DE AVALIAÇÕES (REVIEWS)
-- ============================================================
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  author_name text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  body text not null default '',
  "order" integer not null default 0,
  active boolean not null default true,
  created_at timestamptz default now()
);

alter table public.reviews enable row level security;

drop policy if exists "reviews_select" on public.reviews;
drop policy if exists "reviews_all" on public.reviews;

create policy "reviews_select" on public.reviews for select using (active = true);
create policy "reviews_all" on public.reviews for all to authenticated using (true) with check (true);

insert into public.reviews (author_name, rating, body, "order", active) values
  ('Sophia Moraes', 5, 'Um ótimo atendimento, recomendo!', 1, true),
  ('Aparecida Fogaça', 5, 'Excelente atendimento e serviço, super indico.', 2, true),
  ('João Almeida', 5, 'Muito bom serviço e excelente atendimento.', 3, true),
  ('Vovó Lola', 5, 'Atendimento impecável, trabalho de qualidade!', 4, true)
on conflict do nothing;

-- ============================================================
-- MIGRATIONS (execute em DBs existentes que já rodaram o setup)
-- ============================================================
alter table public.leads add column if not exists status text not null default 'new' check (status in ('new', 'saved', 'archived'));
alter table public.leads add column if not exists notes text not null default '';

insert into public.site_config (key, value) values
  ('notification_email', ''),
  ('hero_image', ''),
  ('services_list', 'Esquadrias de Alumínio,Vidros de Segurança,Espelhos Premium,Box de Banheiro,Pele de Vidro / Fachada,Portões de Alumínio,Outro')
on conflict (key) do nothing;

-- ============================================================
-- TRIGGER: Notificação de novo lead por email (Edge Function)
-- ============================================================

-- Habilita pg_net (já disponível em todos os projetos Supabase)
create extension if not exists pg_net schema extensions;

-- Função trigger que chama a Edge Function notify-new-lead
create or replace function public.notify_new_lead_fn()
returns trigger language plpgsql security definer as $$
begin
  perform extensions.http_post(
    url := 'https://buykmrxavdzadcapdseo.supabase.co/functions/v1/notify-new-lead',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1eWttcnhhdmR6YWRjYXBkc2VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5ODU0NTYsImV4cCI6MjA5MDU2MTQ1Nn0.DyQH6lXurs4X0m9T7XqeGgz8rul33WCG9fQwsc8aN_8'
    ),
    body := jsonb_build_object('record', row_to_json(NEW))
  );
  return NEW;
end;
$$;

drop trigger if exists notify_new_lead_trigger on public.leads;
create trigger notify_new_lead_trigger
  after insert on public.leads
  for each row execute function public.notify_new_lead_fn();

-- ============================================================
-- APÓS CRIAR O USUÁRIO NO DASHBOARD, PROMOVA PARA MASTER:
-- Troque o email abaixo pelo seu email
-- ============================================================

-- update public.profiles set role = 'master' where email = 'seu-email@aqui.com';

-- ============================================================
-- TABELA DE AVALIAÇÕES (REVIEWS)
-- ============================================================
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  author_name text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  body text not null default '',
  "order" integer not null default 0,
  active boolean not null default true,
  created_at timestamptz default now()
);

alter table public.reviews enable row level security;

drop policy if exists "reviews_select" on public.reviews;
drop policy if exists "reviews_all" on public.reviews;

create policy "reviews_select" on public.reviews for select using (active = true);
create policy "reviews_all" on public.reviews for all to authenticated using (true) with check (true);

insert into public.reviews (author_name, rating, body, "order", active) values
  ('Sophia Moraes', 5, 'Um ótimo atendimento, recomendo!', 1, true),
  ('Aparecida Fogaça', 5, 'Excelente atendimento e serviço, super indico.', 2, true),
  ('João Almeida', 5, 'Muito bom serviço e excelente atendimento.', 3, true),
  ('Vovó Lola', 5, 'Atendimento impecável, trabalho de qualidade!', 4, true)
on conflict do nothing;

-- ============================================================
-- MIGRATION: Campo notes na tabela leads
-- ============================================================
alter table public.leads add column if not exists notes text not null default '';

-- ============================================================
-- SEED: Novas chaves em site_config
-- ============================================================
insert into public.site_config (key, value) values
  ('notification_email', ''),
  ('hero_image', ''),
  ('services_list', 'Esquadrias de Alumínio,Vidros de Segurança,Espelhos Premium,Box de Banheiro,Pele de Vidro / Fachada,Portões de Alumínio,Outro')
on conflict (key) do nothing;
