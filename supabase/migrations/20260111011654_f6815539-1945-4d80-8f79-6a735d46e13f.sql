-- Fix create_demo_session: gen_random_bytes is in extensions schema (search_path previously excluded it)

CREATE OR REPLACE FUNCTION public.create_demo_session(
  p_token TEXT,
  p_full_name TEXT,
  p_location JSONB,
  p_module TEXT,
  p_user_agent TEXT DEFAULT NULL,
  p_ip_address INET DEFAULT NULL
)
RETURNS TABLE(
  success BOOLEAN,
  session_token TEXT,
  expires_at TIMESTAMPTZ,
  error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_validation RECORD;
  v_session_token TEXT;
  v_link_expires TIMESTAMPTZ;
BEGIN
  -- Validar el link primero
  SELECT * INTO v_validation
  FROM public.validate_demo_link(p_token, p_module);

  IF NOT v_validation.success THEN
    RETURN QUERY SELECT false, NULL::TEXT, NULL::TIMESTAMPTZ, v_validation.error_message;
    RETURN;
  END IF;

  -- Generar token de sesión único (requiere pgcrypto en schema extensions)
  v_session_token := encode(extensions.gen_random_bytes(32), 'hex');
  v_link_expires := v_validation.expires_at;

  -- Incrementar contador de usos
  UPDATE public.demo_links
  SET current_uses = COALESCE(current_uses, 0) + 1
  WHERE id = v_validation.demo_link_id;

  -- Crear la sesión
  INSERT INTO public.demo_sessions (
    demo_link_id,
    full_name,
    location,
    module_accessed,
    expires_at,
    session_token,
    user_agent,
    ip_address
  ) VALUES (
    v_validation.demo_link_id,
    p_full_name,
    p_location,
    p_module,
    v_link_expires,
    v_session_token,
    p_user_agent,
    p_ip_address
  );

  -- Registrar en audit_logs
  INSERT INTO public.audit_logs (action, resource_type, resource_id, details)
  VALUES (
    'DEMO_SESSION_CREATED',
    'demo_session',
    v_session_token,
    jsonb_build_object(
      'full_name', p_full_name,
      'module', p_module,
      'location', p_location,
      'link_id', v_validation.demo_link_id
    )
  );

  RETURN QUERY SELECT true, v_session_token, v_link_expires, NULL::TEXT;
END;
$$;