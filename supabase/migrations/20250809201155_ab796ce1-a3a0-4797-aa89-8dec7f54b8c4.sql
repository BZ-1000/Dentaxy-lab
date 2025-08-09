
-- 1) Tabla para acumular actividad diaria por usuario
create table if not exists public.user_daily_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  activity_date date not null default (current_date at time zone 'UTC'),
  total_seconds integer not null default 0, -- almacenamos segundos para precisión; convertimos a minutos en UI
  first_session_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, activity_date)
);

-- Índices útiles (unique ya indexa user_id, activity_date; añadimos uno por user_id si se consulta mucho por rango)
create index if not exists idx_user_daily_activity_user_date on public.user_daily_activity (user_id, activity_date);

-- 2) Trigger para updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_user_daily_activity_updated_at on public.user_daily_activity;
create trigger trg_user_daily_activity_updated_at
before update on public.user_daily_activity
for each row
execute procedure public.set_updated_at();

-- 3) Habilitar RLS y políticas
alter table public.user_daily_activity enable row level security;

-- Ver sus propios datos
drop policy if exists "Users can view own daily activity" on public.user_daily_activity;
create policy "Users can view own daily activity"
on public.user_daily_activity
for select
using (auth.uid() = user_id);

-- Insertar sus propios datos
drop policy if exists "Users can insert own daily activity" on public.user_daily_activity;
create policy "Users can insert own daily activity"
on public.user_daily_activity
for insert
with check (auth.uid() = user_id);

-- Actualizar sus propios datos
drop policy if exists "Users can update own daily activity" on public.user_daily_activity;
create policy "Users can update own daily activity"
on public.user_daily_activity
for update
using (auth.uid() = user_id);

-- 4) Función segura para incrementar segundos del día, sin exponer user_id
create or replace function public.increment_user_daily_activity(p_seconds integer, p_at timestamptz default now())
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_date date := (p_at at time zone 'UTC')::date;
  v_inc integer := greatest(coalesce(p_seconds, 0), 0);
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Upsert con suma acumulativa
  insert into public.user_daily_activity (user_id, activity_date, total_seconds, first_session_at)
  values (v_user_id, v_date, v_inc, p_at)
  on conflict (user_id, activity_date)
  do update set
    total_seconds = public.user_daily_activity.total_seconds + excluded.total_seconds,
    first_session_at = coalesce(public.user_daily_activity.first_session_at, excluded.first_session_at),
    updated_at = now();
end;
$$;

-- 5) Realtime: asegurar envío de fila completa en updates
alter table public.user_daily_activity replica identity full;

-- Agregar la tabla a la publicación supabase_realtime (idempotente)
-- Nota: si ya estaba añadida, esta instrucción la mantiene sin duplicar
alter publication supabase_realtime add table public.user_daily_activity;
