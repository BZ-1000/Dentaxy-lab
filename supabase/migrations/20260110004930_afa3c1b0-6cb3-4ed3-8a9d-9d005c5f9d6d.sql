-- Crear tabla para credenciales de admin (separada de auth.users)
CREATE TABLE IF NOT EXISTS public.admin_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  user_id UUID UNIQUE, -- Opcional: enlace a admin_roles
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  failed_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE
);

-- Habilitar RLS
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;

-- Solo el sistema puede leer/escribir (via SECURITY DEFINER functions)
CREATE POLICY "No direct access to admin_credentials"
  ON public.admin_credentials
  FOR ALL
  USING (false);

-- Insertar credenciales del admin BZ.1000 con contraseña hasheada
-- Usando pgcrypto para hashear la contraseña
INSERT INTO public.admin_credentials (username, password_hash, display_name)
VALUES (
  'BZ.1000',
  crypt('singularidad.1000', gen_salt('bf', 12)),
  'BZ.1000'
);

-- Función para verificar login de admin
CREATE OR REPLACE FUNCTION public.verify_admin_login(
  p_username TEXT,
  p_password TEXT
)
RETURNS TABLE (
  success BOOLEAN,
  admin_id UUID,
  display_name TEXT,
  error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin admin_credentials%ROWTYPE;
BEGIN
  -- Buscar admin por username
  SELECT * INTO v_admin
  FROM admin_credentials
  WHERE username = p_username;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'Usuario no encontrado'::TEXT;
    RETURN;
  END IF;
  
  -- Verificar si está bloqueado
  IF v_admin.locked_until IS NOT NULL AND v_admin.locked_until > now() THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'Cuenta bloqueada temporalmente'::TEXT;
    RETURN;
  END IF;
  
  -- Verificar contraseña
  IF v_admin.password_hash = crypt(p_password, v_admin.password_hash) THEN
    -- Login exitoso - resetear intentos fallidos
    UPDATE admin_credentials
    SET 
      failed_attempts = 0,
      locked_until = NULL,
      last_login_at = now()
    WHERE id = v_admin.id;
    
    RETURN QUERY SELECT true, v_admin.id, v_admin.display_name, NULL::TEXT;
  ELSE
    -- Login fallido - incrementar intentos
    UPDATE admin_credentials
    SET 
      failed_attempts = failed_attempts + 1,
      locked_until = CASE 
        WHEN failed_attempts >= 4 THEN now() + interval '15 minutes'
        ELSE NULL
      END
    WHERE id = v_admin.id;
    
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'Contraseña incorrecta'::TEXT;
  END IF;
END;
$$;

-- Función para obtener admin_id por username (para WebAuthn)
CREATE OR REPLACE FUNCTION public.get_admin_by_username(p_username TEXT)
RETURNS UUID
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM admin_credentials WHERE username = p_username;
$$;