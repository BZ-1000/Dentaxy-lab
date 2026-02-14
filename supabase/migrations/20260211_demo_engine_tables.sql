-- Migration: Demo Engine - Alertas y Control de Sesiones
-- Date: 2026-02-11

-- 1. Actualizar demo_sessions con columnas de bloqueo
ALTER TABLE demo_sessions 
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS blocked_reason TEXT,
ADD COLUMN IF NOT EXISTS blocked_by UUID REFERENCES auth.users(id);

COMMENT ON COLUMN demo_sessions.is_blocked IS 'Si la sesión está bloqueada por el admin';
COMMENT ON COLUMN demo_sessions.blocked_at IS 'Timestamp cuando se bloqueó';
COMMENT ON COLUMN demo_sessions.blocked_reason IS 'Razón del bloqueo';
COMMENT ON COLUMN demo_sessions.blocked_by IS 'Admin que bloqueó la sesión';

-- 2. Crear tabla demo_alerts para mensajería en tiempo real
CREATE TABLE IF NOT EXISTS demo_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES demo_sessions(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('info', 'warning', 'error', 'success')),
  sent_by UUID REFERENCES auth.users(id),
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE demo_alerts IS 'Alertas enviadas a sesiones de demo en tiempo real';
COMMENT ON COLUMN demo_alerts.session_id IS 'Sesión de demo que recibe la alerta';
COMMENT ON COLUMN demo_alerts.alert_type IS 'Tipo de alerta: info, warning, error, success';
COMMENT ON COLUMN demo_alerts.sent_by IS 'Admin que envió la alerta';

-- 3. Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_demo_alerts_session ON demo_alerts(session_id);
CREATE INDEX IF NOT EXISTS idx_demo_alerts_unread ON demo_alerts(read_at) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_demo_sessions_blocked ON demo_sessions(is_blocked) WHERE is_blocked = true;
CREATE INDEX IF NOT EXISTS idx_demo_sessions_active ON demo_sessions(created_at) WHERE created_at > NOW() - INTERVAL '24 hours';

-- 4. RLS Policies para demo_alerts
ALTER TABLE demo_alerts ENABLE ROW LEVEL SECURITY;

-- Admins pueden ver y gestionar todas las alertas
CREATE POLICY "Admins can manage all alerts"
ON demo_alerts
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_credentials 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_credentials 
    WHERE user_id = auth.uid()
  )
);

-- 5. Función para limpiar alertas antiguas (trigger automático)
CREATE OR REPLACE FUNCTION cleanup_old_alerts()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM demo_alerts 
  WHERE sent_at < NOW() - INTERVAL '7 days' 
  AND dismissed_at IS NOT NULL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_cleanup_alerts ON demo_alerts;
CREATE TRIGGER trigger_cleanup_alerts
AFTER INSERT ON demo_alerts
EXECUTE FUNCTION cleanup_old_alerts();

-- 6. Función para obtener sesiones activas (helper para Demo Engine)
CREATE OR REPLACE FUNCTION get_active_demo_sessions()
RETURNS TABLE (
  session_id UUID,
  demo_link_id UUID,
  module_id TEXT,
  user_name TEXT,
  user_location TEXT,
  user_email TEXT,
  is_blocked BOOLEAN,
  blocked_reason TEXT,
  created_at TIMESTAMPTZ,
  duration_minutes INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ds.id as session_id,
    ds.demo_link_id,
    ds.module_id,
    ds.user_name,
    ds.user_location,
    ds.user_email,
    ds.is_blocked,
    ds.blocked_reason,
    ds.created_at,
    EXTRACT(EPOCH FROM (NOW() - ds.created_at))::INTEGER / 60 as duration_minutes
  FROM demo_sessions ds
  WHERE ds.created_at > NOW() - INTERVAL '24 hours'
  ORDER BY ds.created_at DESC;
END;
$$;

-- 7. Función para bloquear sesión (con logging)
CREATE OR REPLACE FUNCTION block_demo_session(
  p_session_id UUID,
  p_reason TEXT,
  p_admin_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin BOOLEAN;
BEGIN
  -- Verificar que es admin
  SELECT EXISTS(
    SELECT 1 FROM admin_credentials 
    WHERE user_id = p_admin_id
  ) INTO v_is_admin;
  
  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;
  
  -- Bloquear sesión
  UPDATE demo_sessions 
  SET 
    is_blocked = true,
    blocked_at = NOW(),
    blocked_reason = p_reason,
    blocked_by = p_admin_id
  WHERE id = p_session_id;
  
  -- Log de auditoría
  INSERT INTO audit_logs (action, resource_type, resource_id, user_id, details)
  VALUES (
    'DEMO_SESSION_BLOCKED',
    'demo_session',
    p_session_id::TEXT,
    p_admin_id,
    jsonb_build_object('reason', p_reason)
  );
  
  RETURN true;
END;
$$;

-- 8. Función para desbloquear sesión
CREATE OR REPLACE FUNCTION unblock_demo_session(
  p_session_id UUID,
  p_admin_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM admin_credentials 
    WHERE user_id = p_admin_id
  ) INTO v_is_admin;
  
  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;
  
  UPDATE demo_sessions 
  SET 
    is_blocked = false,
    blocked_at = NULL,
    blocked_reason = NULL,
    blocked_by = NULL
  WHERE id = p_session_id;
  
  RETURN true;
END;
$$;
