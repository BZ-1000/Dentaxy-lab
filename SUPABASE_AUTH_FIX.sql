-- ========================================================
-- SCRIPT DE RECUPERACIÓN Y CONFIGURACIÓN ADMIN ROBUST
-- ========================================================
-- Este script asegura que el usuario administrador exista en Supabase Auth
-- con el UID y la contraseña correctos para habilitar la biometría.

DO $$
DECLARE
    v_user_id UUID := '982e88ff-cde9-4597-8f30-4d0831a7dfd1';
    v_email TEXT := 'zavalabraudoc@gmail.com';
    v_password_hash TEXT := crypt('Singularidad.1000', gen_salt('bf'));
BEGIN
    -- 1. Intentar insertar en auth.users si no existe
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = v_user_id) THEN
        INSERT INTO auth.users (
            id, 
            instance_id, 
            email, 
            encrypted_password, 
            email_confirmed_at, 
            raw_app_meta_data, 
            raw_user_meta_data, 
            is_super_admin, 
            role,
            aud,
            confirmation_token,
            recovery_token,
            email_change_token_new,
            email_change
        )
        VALUES (
            v_user_id,
            '00000000-0000-0000-0000-000000000000',
            v_email,
            v_password_hash,
            now(),
            '{"provider":"email","providers":["email"]}',
            '{"full_name":"Admin Dentaxy"}',
            false,
            'authenticated',
            'authenticated',
            '',
            '',
            '',
            ''
        );
        RAISE NOTICE 'Usuario admin creado con éxito.';
    ELSE
        -- 2. Si existe, actualizar contraseña por si acaso
        UPDATE auth.users 
        SET encrypted_password = v_password_hash,
            email_confirmed_at = COALESCE(email_confirmed_at, now()),
            raw_app_meta_data = '{"provider":"email","providers":["email"]}'
        WHERE id = v_user_id;
        RAISE NOTICE 'Usuario admin existente actualizado con nueva contraseña.';
    END IF;

    -- 3. Asegurar que tenga una identidad vinculada (necesario para login estándar)
    IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = v_user_id) THEN
        INSERT INTO auth.identities (
            id,
            user_id,
            identity_data,
            provider,
            last_sign_in_at,
            created_at,
            updated_at
        )
        VALUES (
            gen_random_uuid(),
            v_user_id,
            format('{"sub":"%s","email":"%s"}', v_user_id, v_email)::jsonb,
            'email',
            now(),
            now(),
            now()
        );
        RAISE NOTICE 'Identidad de email creada.';
    END IF;

END $$;

-- Verificación final
SELECT id, email, email_confirmed_at FROM auth.users WHERE email = 'zavalabraudoc@gmail.com';
