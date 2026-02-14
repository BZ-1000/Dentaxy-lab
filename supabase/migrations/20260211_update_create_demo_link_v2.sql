-- Actualizar create_demo_link v2 para soportar requires_user_info
-- Date: 2026-02-11

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
  -- Verify admin credentials id exists
  SELECT EXISTS(
    SELECT 1
    FROM public.admin_credentials
    WHERE id = p_admin_id
  ) INTO v_is_admin;

  IF NOT v_is_admin THEN
    RETURN QUERY SELECT false, NULL::UUID, 'No autorizado: admin no válido'::TEXT;
    RETURN;
  END IF;

  -- Map admin_credentials.id -> admin_credentials.user_id
  SELECT user_id
  INTO v_created_by
  FROM public.admin_credentials
  WHERE id = p_admin_id;

  -- Verificar que el token no exista
  IF EXISTS(SELECT 1 FROM demo_links WHERE token = p_token) THEN
    RETURN QUERY SELECT false, NULL::UUID, 'Token ya existe'::TEXT;
    RETURN;
  END IF;

  -- Insertar demo link
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
      'admin_credential_id', p_admin_id,
      'created_by_user_id', v_created_by
    )
  );

  RETURN QUERY SELECT true, v_new_id, NULL::TEXT;
EXCEPTION
  WHEN OTHERS THEN
    RETURN QUERY SELECT false, NULL::UUID, SQLERRM::TEXT;
END;
$$;
