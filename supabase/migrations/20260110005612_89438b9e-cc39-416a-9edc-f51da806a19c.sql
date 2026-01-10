-- Habilitar extensión pgcrypto para funciones de hash
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Actualizar la contraseña del admin (ahora que pgcrypto está disponible)
UPDATE public.admin_credentials
SET password_hash = crypt('singularidad.1000', gen_salt('bf', 12))
WHERE username = 'BZ.1000';