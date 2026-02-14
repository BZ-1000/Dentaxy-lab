-- Script para verificar y corregir la función RPC create_demo_link
-- Ejecutar manualmente en Supabase Dashboard > SQL Editor

-- 1. Verificar si la función existe
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'create_demo_link';

-- 2. Si la función no existe o es incorrecta, crearla/actualizarla
-- Esta es la versión correcta con requires_user_info

CREATE OR REPLACE FUNCTION public.create_demo_link(
  p_token TEXT,
  p_admin_id UUID,
  p_expires_at TIMESTAMPTZ,
  p_max_uses INTEGER DEFAULT 1,
  p_allowed_modules TEXT[] DEFAULT NULL,
  p_requires_token BOOLEAN DEFAULT true,
  p_requires_user_info BOOLEAN DEFAULT true
)
RETURNS TABLE(success BOOLEAN, link_id UUID, error_message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin BOOLEAN;
  v_new_id UUID;
  v_created_by UUID;
BEGIN
  -- Verify admin credentials
  SELECT EXISTS(
    SELECT 1
    FROM public.admin_credentials
    WHERE id = p_admin_id
  ) INTO v_is_admin;

  IF NOT v_is_admin THEN
    RETURN QUERY SELECT false, NULL::UUID, 'No autorizado: admin no válido'::TEXT;
    RETURN;
  END IF;

  -- Get user_id from admin_credentials
  SELECT user_id
  INTO v_created_by
  FROM public.admin_credentials
  WHERE id = p_admin_id;

  -- Check if token already exists
  IF EXISTS(SELECT 1 FROM public.demo_links WHERE token = p_token) THEN
    RETURN QUERY SELECT false, NULL::UUID, 'Token ya existe'::TEXT;
    RETURN;
  END IF;

  -- Insert demo link
  INSERT INTO public.demo_links (
    token, 
    created_by, 
    expires_at, 
    max_uses, 
    allowed_modules, 
    requires_token,
    requires_user_info
  )
  VALUES (
    p_token, 
    v_created_by, 
    p_expires_at, 
    p_max_uses, 
    p_allowed_modules, 
    p_requires_token,
    p_requires_user_info
  )
  RETURNING id INTO v_new_id;

  -- Audit log
  INSERT INTO public.audit_logs (action, resource_type, resource_id, user_id, details)
  VALUES (
    'DEMO_LINK_CREATED',
    'demo_link',
    p_token,
    p_admin_id,
    jsonb_build_object(
      'expires_at', p_expires_at,
      'max_uses', p_max_uses,
      'modules', p_allowed_modules,
      'requires_token', p_requires_token,
      'requires_user_info', p_requires_user_info,
      'link_id', v_new_id
    )
  );

  RETURN QUERY SELECT true, v_new_id, NULL::TEXT;
EXCEPTION
  WHEN OTHERS THEN
    RETURN QUERY SELECT false, NULL::UUID, SQLERRM::TEXT;
END;
$$;

-- 3. Verificar columnas necesarias en demo_links
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'demo_links'
AND column_name IN ('requires_user_info', 'requires_token');

-- 4. Si falta la columna requires_user_info, agregarla
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'demo_links'
    AND column_name = 'requires_user_info'
  ) THEN
    ALTER TABLE public.demo_links 
    ADD COLUMN requires_user_info BOOLEAN DEFAULT true;
    RAISE NOTICE 'Columna requires_user_info agregada';
  ELSE
    RAISE NOTICE 'Columna requires_user_info ya existe';
  END IF;
END $$;

-- 5. Verificar que demo_sessions tenga las columnas necesarias
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'demo_sessions'
AND column_name IN ('user_name', 'user_location', 'user_email');

-- 6. Agregar columnas si faltan
DO $$
BEGIN
  -- user_name
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'demo_sessions'
    AND column_name = 'user_name'
  ) THEN
    ALTER TABLE public.demo_sessions ADD COLUMN user_name TEXT;
    RAISE NOTICE 'Columna user_name agregada';
  END IF;

  -- user_location
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'demo_sessions'
    AND column_name = 'user_location'
  ) THEN
    ALTER TABLE public.demo_sessions ADD COLUMN user_location TEXT;
    RAISE NOTICE 'Columna user_location agregada';
  END IF;

  -- user_email
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'demo_sessions'
    AND column_name = 'user_email'
  ) THEN
    ALTER TABLE public.demo_sessions ADD COLUMN user_email TEXT;
    RAISE NOTICE 'Columna user_email agregada';
  END IF;
END $$;

-- 7. Probar la función
SELECT * FROM public.create_demo_link(
  'TEST_TOKEN_' || floor(random() * 10000)::text,
  (SELECT id FROM admin_credentials LIMIT 1),
  NOW() + INTERVAL '1 hour',
  5,
  ARRAY['motor_neuronal'],
  true,
  true
);
