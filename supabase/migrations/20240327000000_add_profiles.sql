
-- Crear tabla de perfiles
create table public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    username text,
    updated_at timestamp with time zone,
    constraint username_length check (char_length(username) >= 3)
);

-- Establecer políticas RLS
alter table public.profiles enable row level security;

create policy "Los perfiles públicos son visibles para todos."
    on profiles for select
    using ( true );

create policy "Los usuarios pueden insertar sus propios perfiles."
    on profiles for insert
    with check ( auth.uid() = id );

create policy "Los usuarios pueden actualizar sus propios perfiles."
    on profiles for update
    using ( auth.uid() = id );

-- Función para manejar nuevos usuarios
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.profiles (id)
    values (new.id);
    return new;
end;
$$;

-- Trigger para crear perfil automáticamente
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
