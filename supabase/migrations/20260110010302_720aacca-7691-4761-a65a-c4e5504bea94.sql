-- Asegurar que las funciones de pgcrypto se resuelvan en el schema correcto (Supabase usa schema 'extensions')

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
SET search_path = public, extensions
AS $$
DECLARE
  v_admin admin_credentials%ROWTYPE;
BEGIN
  SELECT * INTO v_admin
  FROM admin_credentials
  WHERE username = p_username;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'Credenciales inválidas'::TEXT;
    RETURN;
  END IF;

  IF v_admin.locked_until IS NOT NULL AND v_admin.locked_until > now() THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'Cuenta bloqueada temporalmente'::TEXT;
    RETURN;
  END IF;

  IF v_admin.password_hash = crypt(p_password, v_admin.password_hash) THEN
    UPDATE admin_credentials
    SET failed_attempts = 0,
        locked_until = NULL,
        last_login_at = now()
    WHERE id = v_admin.id;

    RETURN QUERY SELECT true, v_admin.id, v_admin.display_name, NULL::TEXT;
  ELSE
    UPDATE admin_credentials
    SET failed_attempts = failed_attempts + 1,
        locked_until = CASE WHEN failed_attempts >= 4 THEN now() + interval '15 minutes' ELSE NULL END
    WHERE id = v_admin.id;

    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'Credenciales inválidas'::TEXT;
  END IF;
END;
$$;

-- Re-hashear la contraseña en el schema correcto (por si quedó con hash inválido en ejecuciones anteriores)
UPDATE public.admin_credentials
SET password_hash = extensions.crypt('singularidad.1000', extensions.gen_salt('bf', 12))
WHERE username = 'BZ.1000';

-- Asegurar permisos de ejecución para PostgREST
GRANT EXECUTE ON FUNCTION public.verify_admin_login(TEXT, TEXT) TO anon, authenticated;