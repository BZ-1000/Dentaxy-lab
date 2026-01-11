-- Fix create_demo_link to avoid FK violation on demo_links.created_by
-- created_by has a FK to public.users, while our admin identifier is admin_credentials.id.
-- We map to admin_credentials.user_id (nullable). If null, we insert NULL which satisfies the FK.

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

  -- Map admin_credentials.id -> admin_credentials.user_id (FK-compatible with demo_links.created_by)
  SELECT user_id
  INTO v_created_by
  FROM public.admin_credentials
  WHERE id = p_admin_id;

  INSERT INTO public.demo_links (token, created_by, expires_at, max_uses, allowed_modules)
  VALUES (p_token, v_created_by, p_expires_at, p_max_uses, p_allowed_modules)
  RETURNING id INTO v_new_id;

  -- Audit (store both ids for traceability)
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
      'admin_credential_id', p_admin_id,
      'created_by_user_id', v_created_by
    )
  );

  RETURN QUERY SELECT true, v_new_id, NULL::TEXT;
END;
$$;