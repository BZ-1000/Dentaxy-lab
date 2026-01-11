-- =============================================
-- FASE 1: SISTEMA DE SESIONES DE DEMO ZERO-TRUST
-- =============================================

-- Crear tabla demo_sessions para rastrear sesiones activas
CREATE TABLE public.demo_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  demo_link_id UUID REFERENCES demo_links(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  location JSONB NOT NULL, -- {lat, lng, city, country, accuracy}
  module_accessed TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT now(),
  last_activity_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'completed')),
  ip_address INET,
  user_agent TEXT,
  session_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indices para consultas rapidas
CREATE INDEX idx_demo_sessions_status ON demo_sessions(status);
CREATE INDEX idx_demo_sessions_link ON demo_sessions(demo_link_id);
CREATE INDEX idx_demo_sessions_expires ON demo_sessions(expires_at);
CREATE INDEX idx_demo_sessions_token ON demo_sessions(session_token);

-- Habilitar RLS
ALTER TABLE public.demo_sessions ENABLE ROW LEVEL SECURITY;

-- Politicas RLS para demo_sessions
CREATE POLICY "Admins can view all demo sessions"
ON public.demo_sessions
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update demo sessions"
ON public.demo_sessions
FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Public can insert demo sessions via function"
ON public.demo_sessions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view their own session by token"
ON public.demo_sessions
FOR SELECT
USING (true);

-- =============================================
-- FUNCION: validate_demo_link
-- Valida un link de demo y verifica permisos
-- =============================================
CREATE OR REPLACE FUNCTION public.validate_demo_link(
  p_token TEXT,
  p_module TEXT
)
RETURNS TABLE(
  success BOOLEAN,
  demo_link_id UUID,
  error_message TEXT,
  expires_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_link demo_links%ROWTYPE;
BEGIN
  -- Buscar el link
  SELECT * INTO v_link
  FROM demo_links
  WHERE token = p_token;

  -- Verificar que existe
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::UUID, 'Link inválido o no encontrado'::TEXT, NULL::TIMESTAMPTZ;
    RETURN;
  END IF;

  -- Verificar que no está revocado
  IF v_link.is_revoked = true THEN
    RETURN QUERY SELECT false, NULL::UUID, 'Este link ha sido revocado'::TEXT, NULL::TIMESTAMPTZ;
    RETURN;
  END IF;

  -- Verificar que no ha expirado
  IF v_link.expires_at < now() THEN
    RETURN QUERY SELECT false, NULL::UUID, 'Este link ha expirado'::TEXT, NULL::TIMESTAMPTZ;
    RETURN;
  END IF;

  -- Verificar límite de usos
  IF v_link.max_uses IS NOT NULL AND v_link.current_uses >= v_link.max_uses THEN
    RETURN QUERY SELECT false, NULL::UUID, 'Se alcanzó el límite de usos de este link'::TEXT, NULL::TIMESTAMPTZ;
    RETURN;
  END IF;

  -- Verificar que el módulo está permitido
  IF v_link.allowed_modules IS NOT NULL AND NOT (p_module = ANY(v_link.allowed_modules)) THEN
    RETURN QUERY SELECT false, NULL::UUID, 'Este link no tiene acceso a este módulo'::TEXT, NULL::TIMESTAMPTZ;
    RETURN;
  END IF;

  -- Todo válido
  RETURN QUERY SELECT true, v_link.id, NULL::TEXT, v_link.expires_at;
END;
$$;

-- =============================================
-- FUNCION: create_demo_session
-- Crea una sesión de demo después de validación
-- =============================================
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
SET search_path = public
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

  -- Generar token de sesión único
  v_session_token := encode(gen_random_bytes(32), 'hex');
  v_link_expires := v_validation.expires_at;

  -- Incrementar contador de usos
  UPDATE demo_links
  SET current_uses = COALESCE(current_uses, 0) + 1
  WHERE id = v_validation.demo_link_id;

  -- Crear la sesión
  INSERT INTO demo_sessions (
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
  INSERT INTO audit_logs (action, resource_type, resource_id, details)
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

-- =============================================
-- FUNCION: verify_demo_session
-- Verifica si una sesión sigue activa
-- =============================================
CREATE OR REPLACE FUNCTION public.verify_demo_session(
  p_session_token TEXT
)
RETURNS TABLE(
  is_valid BOOLEAN,
  module_accessed TEXT,
  full_name TEXT,
  expires_at TIMESTAMPTZ,
  error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session demo_sessions%ROWTYPE;
BEGIN
  SELECT * INTO v_session
  FROM demo_sessions
  WHERE session_token = p_session_token;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::TEXT, NULL::TEXT, NULL::TIMESTAMPTZ, 'Sesión no encontrada'::TEXT;
    RETURN;
  END IF;

  IF v_session.status != 'active' THEN
    RETURN QUERY SELECT false, NULL::TEXT, NULL::TEXT, NULL::TIMESTAMPTZ, 'Sesión ' || v_session.status::TEXT;
    RETURN;
  END IF;

  IF v_session.expires_at < now() THEN
    -- Auto-expirar la sesión
    UPDATE demo_sessions SET status = 'expired' WHERE id = v_session.id;
    RETURN QUERY SELECT false, NULL::TEXT, NULL::TEXT, NULL::TIMESTAMPTZ, 'Sesión expirada'::TEXT;
    RETURN;
  END IF;

  -- Actualizar última actividad
  UPDATE demo_sessions SET last_activity_at = now() WHERE id = v_session.id;

  RETURN QUERY SELECT true, v_session.module_accessed, v_session.full_name, v_session.expires_at, NULL::TEXT;
END;
$$;

-- =============================================
-- FUNCION: expire_demo_session
-- Expira una sesión manualmente (admin)
-- =============================================
CREATE OR REPLACE FUNCTION public.expire_demo_session(
  p_session_id UUID,
  p_admin_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(p_admin_id) THEN
    RAISE EXCEPTION 'Solo administradores pueden expirar sesiones';
  END IF;

  UPDATE demo_sessions
  SET status = 'expired'
  WHERE id = p_session_id AND status = 'active';

  INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details)
  VALUES (p_admin_id, 'DEMO_SESSION_EXPIRED', 'demo_session', p_session_id::TEXT, '{"manual": true}');

  RETURN FOUND;
END;
$$;

-- =============================================
-- FUNCION: revoke_demo_session
-- Revoca una sesión manualmente (admin)
-- =============================================
CREATE OR REPLACE FUNCTION public.revoke_demo_session(
  p_session_id UUID,
  p_admin_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(p_admin_id) THEN
    RAISE EXCEPTION 'Solo administradores pueden revocar sesiones';
  END IF;

  UPDATE demo_sessions
  SET status = 'revoked'
  WHERE id = p_session_id AND status = 'active';

  INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details)
  VALUES (p_admin_id, 'DEMO_SESSION_REVOKED', 'demo_session', p_session_id::TEXT, '{"severity": "warning"}');

  RETURN FOUND;
END;
$$;

-- =============================================
-- FUNCION: revoke_all_sessions_for_link
-- Revoca todas las sesiones de un link (admin)
-- =============================================
CREATE OR REPLACE FUNCTION public.revoke_all_sessions_for_link(
  p_link_id UUID,
  p_admin_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  IF NOT public.is_admin(p_admin_id) THEN
    RAISE EXCEPTION 'Solo administradores pueden revocar sesiones';
  END IF;

  UPDATE demo_sessions
  SET status = 'revoked'
  WHERE demo_link_id = p_link_id AND status = 'active';

  GET DIAGNOSTICS v_count = ROW_COUNT;

  -- También revocar el link
  UPDATE demo_links
  SET is_revoked = true
  WHERE id = p_link_id;

  INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details)
  VALUES (p_admin_id, 'DEMO_LINK_REVOKED_WITH_SESSIONS', 'demo_link', p_link_id::TEXT, 
    jsonb_build_object('sessions_revoked', v_count));

  RETURN v_count;
END;
$$;