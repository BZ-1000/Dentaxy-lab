-- Crear función SECURITY DEFINER para crear demo links
-- Esto bypassa RLS y valida que el admin_id sea válido
CREATE OR REPLACE FUNCTION public.create_demo_link(
  p_token TEXT,
  p_admin_id UUID,
  p_expires_at TIMESTAMPTZ,
  p_max_uses INTEGER DEFAULT 1,
  p_allowed_modules TEXT[] DEFAULT NULL
)
RETURNS TABLE(success BOOLEAN, link_id UUID, error_message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin BOOLEAN;
  v_new_id UUID;
BEGIN
  -- Verificar que el admin_id existe en admin_credentials
  SELECT EXISTS(SELECT 1 FROM admin_credentials WHERE id = p_admin_id) INTO v_is_admin;
  
  IF NOT v_is_admin THEN
    RETURN QUERY SELECT false, NULL::UUID, 'No autorizado: admin no válido'::TEXT;
    RETURN;
  END IF;

  -- Insertar el nuevo demo link
  INSERT INTO demo_links (token, created_by, expires_at, max_uses, allowed_modules)
  VALUES (p_token, p_admin_id, p_expires_at, p_max_uses, p_allowed_modules)
  RETURNING id INTO v_new_id;

  -- Registrar en audit_logs
  INSERT INTO audit_logs (action, resource_type, resource_id, user_id, details)
  VALUES (
    'DEMO_LINK_CREATED',
    'demo_link',
    p_token,
    p_admin_id,
    jsonb_build_object(
      'expires_at', p_expires_at,
      'max_uses', p_max_uses,
      'modules', p_allowed_modules
    )
  );

  RETURN QUERY SELECT true, v_new_id, NULL::TEXT;
END;
$$;