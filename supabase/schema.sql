-- AmadaAurora: tabelas, segurança e funções de família.
-- Rode este arquivo uma vez no SQL Editor do projeto Supabase.

create extension if not exists pgcrypto;

-- Uma linha por família. O estado inteiro do app fica em "estado".
create table if not exists public.familias (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique default upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 8)),
  estado jsonb not null default '{}'::jsonb,
  atualizado_em timestamptz not null default now()
);

-- Quem pertence a qual família (mamãe e papai).
create table if not exists public.membros (
  familia_id uuid not null references public.familias(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  primary key (familia_id, user_id)
);

alter table public.familias enable row level security;
alter table public.membros enable row level security;

-- Só os membros leem e alteram a família.
drop policy if exists "membros leem a familia" on public.familias;
create policy "membros leem a familia" on public.familias
  for select using (
    exists (select 1 from public.membros m where m.familia_id = familias.id and m.user_id = auth.uid())
  );

drop policy if exists "membros alteram a familia" on public.familias;
create policy "membros alteram a familia" on public.familias
  for update using (
    exists (select 1 from public.membros m where m.familia_id = familias.id and m.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.membros m where m.familia_id = familias.id and m.user_id = auth.uid())
  );

-- Cada pessoa vê só o próprio vínculo.
drop policy if exists "ver o proprio vinculo" on public.membros;
create policy "ver o proprio vinculo" on public.membros
  for select using (user_id = auth.uid());

-- Cria uma família nova e coloca quem chamou como primeiro membro.
create or replace function public.criar_familia()
returns public.familias
language plpgsql
security definer
set search_path = public
as $$
declare
  f public.familias;
begin
  if auth.uid() is null then
    raise exception 'Entre antes de criar a família';
  end if;
  insert into public.familias default values returning * into f;
  insert into public.membros (familia_id, user_id) values (f.id, auth.uid());
  return f;
end;
$$;

-- Entra numa família existente pelo código de 8 caracteres.
create or replace function public.entrar_na_familia(p_codigo text)
returns public.familias
language plpgsql
security definer
set search_path = public
as $$
declare
  f public.familias;
begin
  if auth.uid() is null then
    raise exception 'Entre antes de entrar na família';
  end if;
  select * into f from public.familias where codigo = upper(trim(p_codigo));
  if not found then
    raise exception 'Código não encontrado';
  end if;
  insert into public.membros (familia_id, user_id) values (f.id, auth.uid())
  on conflict do nothing;
  return f;
end;
$$;

grant execute on function public.criar_familia() to authenticated;
grant execute on function public.entrar_na_familia(text) to authenticated;
