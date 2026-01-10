
-- Sistema de roles administrativos
CREATE TYPE public.admin_role AS ENUM ('super_admin', 'admin', 'observer');

CREATE TABLE public.admin_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role admin_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id)
);

-- Credenciales WebAuthn/Passkeys
CREATE TABLE public.webauthn_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    credential_id TEXT NOT NULL UNIQUE,
    public_key TEXT NOT NULL,
    counter INTEGER DEFAULT 0,
    transports TEXT[],
    device_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    last_used_at TIMESTAMPTZ
);

-- Sesiones administrativas con TTL corto
CREATE TABLE public.admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    device_fingerprint TEXT NOT NULL,
    ip_address INET,
    location JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    last_activity TIMESTAMPTZ DEFAULT now(),
    is_active BOOLEAN DEFAULT true,
    requires_reauth BOOLEAN DEFAULT false
);

-- Links de demo temporales
CREATE TABLE public.demo_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token TEXT NOT NULL UNIQUE,
    created_by UUID REFERENCES auth.users(id),
    expires_at TIMESTAMPTZ NOT NULL,
    max_uses INTEGER DEFAULT 1,
    current_uses INTEGER DEFAULT 0,
    allowed_modules TEXT[],
    geo_restrictions JSONB,
    device_restrictions JSONB,
    is_revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    metadata JSONB
);

-- Accesos de demo (tracking)
CREATE TABLE public.demo_accesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    demo_link_id UUID REFERENCES public.demo_links(id) ON DELETE CASCADE,
    ip_address INET,
    device_fingerprint TEXT,
    location JSONB,
    user_agent TEXT,
    accessed_at TIMESTAMPTZ DEFAULT now(),
    modules_accessed TEXT[]
);

-- Gestión de módulos Dentaxy
CREATE TABLE public.dentaxy_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'beta', 'blocked', 'classified')),
    is_enabled BOOLEAN DEFAULT true,
    classification_level TEXT DEFAULT 'public' CHECK (classification_level IN ('public', 'internal', 'classified')),
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Módulo Alumnos - Zonas de Geofencing
CREATE TABLE public.student_access_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    institution TEXT,
    geo_polygon JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    access_window_start TIMESTAMPTZ,
    access_window_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Chat estudiantil
CREATE TABLE public.student_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_id UUID REFERENCES public.student_access_zones(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT false,
    deleted_by UUID REFERENCES auth.users(id),
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Usuarios bloqueados del chat
CREATE TABLE public.student_chat_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    zone_id UUID REFERENCES public.student_access_zones(id) ON DELETE CASCADE,
    blocked_by UUID REFERENCES auth.users(id),
    reason TEXT,
    blocked_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ,
    is_permanent BOOLEAN DEFAULT false
);

-- Estado global del sistema (Kill Switch y configuración)
CREATE TABLE public.system_state (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insertar estados iniciales del sistema
INSERT INTO public.system_state (key, value) VALUES
    ('lockdown_mode', '{"active": false}'),
    ('chat_enabled', '{"active": true}'),
    ('demo_creation_enabled', '{"active": true}'),
    ('security_level', '{"level": "normal"}');

-- Insertar módulos iniciales de Dentaxy
INSERT INTO public.dentaxy_modules (name, display_name, description, status, classification_level, icon) VALUES
    ('motor_neuronal', 'Motor Neuronal', 'Sistema de IA clínica para asistencia en diagnóstico', 'active', 'public', 'Brain'),
    ('academico', 'Módulo Académico', 'Herramientas educativas para estudiantes de odontología', 'beta', 'public', 'GraduationCap'),
    ('enterprise', 'Enterprise Suite', 'Funcionalidades avanzadas para clínicas y hospitales', 'active', 'internal', 'Building2'),
    ('visualizacion_3d', 'Visualización 3D', 'Visor de modelos STL y DICOM dental', 'active', 'public', 'Box'),
    ('proyecto_stark', 'Proyecto Stark', 'Módulo clasificado en desarrollo', 'classified', 'classified', 'Shield');

-- Funciones de seguridad

-- Verificar si es admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles
    WHERE user_id = user_uuid
    AND role IN ('super_admin', 'admin')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Verificar si es super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles
    WHERE user_id = user_uuid
    AND role = 'super_admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Obtener rol del usuario actual
CREATE OR REPLACE FUNCTION public.get_admin_role(user_uuid UUID)
RETURNS TEXT AS $$
  SELECT role::TEXT FROM public.admin_roles
  WHERE user_id = user_uuid
  LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Activar Kill Switch
CREATE OR REPLACE FUNCTION public.activate_kill_switch(admin_user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Solo super_admin puede activar
  IF NOT public.is_super_admin(admin_user_id) THEN
    RAISE EXCEPTION 'Only super_admin can activate kill switch';
  END IF;

  -- Revocar todos los demos activos
  UPDATE public.demo_links SET is_revoked = true WHERE is_revoked = false;
  
  -- Invalidar todas las sesiones admin excepto la del usuario actual
  UPDATE public.admin_sessions 
  SET is_active = false 
  WHERE user_id != admin_user_id;
  
  -- Desactivar chat estudiantil
  UPDATE public.system_state 
  SET value = '{"active": false}', updated_by = admin_user_id, updated_at = now()
  WHERE key = 'chat_enabled';
  
  -- Activar modo lockdown
  UPDATE public.system_state 
  SET value = jsonb_build_object('active', true, 'activated_at', now(), 'activated_by', admin_user_id),
      updated_by = admin_user_id,
      updated_at = now()
  WHERE key = 'lockdown_mode';
  
  -- Registrar en audit log
  INSERT INTO public.audit_logs (action, resource_type, user_id, details)
  VALUES ('KILL_SWITCH_ACTIVATED', 'system', admin_user_id, '{"severity": "critical"}');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Desactivar Kill Switch
CREATE OR REPLACE FUNCTION public.deactivate_kill_switch(admin_user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Solo super_admin puede desactivar
  IF NOT public.is_super_admin(admin_user_id) THEN
    RAISE EXCEPTION 'Only super_admin can deactivate kill switch';
  END IF;

  -- Reactivar chat estudiantil
  UPDATE public.system_state 
  SET value = '{"active": true}', updated_by = admin_user_id, updated_at = now()
  WHERE key = 'chat_enabled';
  
  -- Desactivar modo lockdown
  UPDATE public.system_state 
  SET value = jsonb_build_object('active', false, 'deactivated_at', now(), 'deactivated_by', admin_user_id),
      updated_by = admin_user_id,
      updated_at = now()
  WHERE key = 'lockdown_mode';
  
  -- Registrar en audit log
  INSERT INTO public.audit_logs (action, resource_type, user_id, details)
  VALUES ('KILL_SWITCH_DEACTIVATED', 'system', admin_user_id, '{"severity": "info"}');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies

-- admin_roles: Solo super_admin puede ver/modificar
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can view all admin roles"
ON public.admin_roles FOR SELECT
USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can manage admin roles"
ON public.admin_roles FOR ALL
USING (public.is_super_admin(auth.uid()));

-- webauthn_credentials: Usuarios pueden ver solo sus propias credenciales
ALTER TABLE public.webauthn_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own credentials"
ON public.webauthn_credentials FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own credentials"
ON public.webauthn_credentials FOR ALL
USING (auth.uid() = user_id);

-- admin_sessions: Solo admins pueden ver sesiones
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view sessions"
ON public.admin_sessions FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage their own sessions"
ON public.admin_sessions FOR ALL
USING (auth.uid() = user_id OR public.is_super_admin(auth.uid()));

-- demo_links: Solo admins pueden gestionar
ALTER TABLE public.demo_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view demo links"
ON public.demo_links FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can create demo links"
ON public.demo_links FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update demo links"
ON public.demo_links FOR UPDATE
USING (public.is_admin(auth.uid()));

-- demo_accesses: Solo admins pueden ver
ALTER TABLE public.demo_accesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view demo accesses"
ON public.demo_accesses FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can insert demo access"
ON public.demo_accesses FOR INSERT
WITH CHECK (true);

-- dentaxy_modules: Todos pueden ver, solo admins pueden modificar
ALTER TABLE public.dentaxy_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view enabled modules"
ON public.dentaxy_modules FOR SELECT
USING (is_enabled = true OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage modules"
ON public.dentaxy_modules FOR ALL
USING (public.is_admin(auth.uid()));

-- student_access_zones: Solo admins pueden gestionar
ALTER TABLE public.student_access_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage access zones"
ON public.student_access_zones FOR ALL
USING (public.is_admin(auth.uid()));

-- student_chat_messages: Usuarios autenticados pueden ver, admins pueden moderar
ALTER TABLE public.student_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view messages"
ON public.student_chat_messages FOR SELECT
USING (auth.uid() IS NOT NULL AND is_deleted = false);

CREATE POLICY "Authenticated users can send messages"
ON public.student_chat_messages FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage messages"
ON public.student_chat_messages FOR ALL
USING (public.is_admin(auth.uid()));

-- student_chat_blocks: Solo admins pueden gestionar bloqueos
ALTER TABLE public.student_chat_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage chat blocks"
ON public.student_chat_blocks FOR ALL
USING (public.is_admin(auth.uid()));

-- system_state: Solo admins pueden leer, solo super_admin puede modificar
ALTER TABLE public.system_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view system state"
ON public.system_state FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Super admins can update system state"
ON public.system_state FOR UPDATE
USING (public.is_super_admin(auth.uid()));

-- Indexes para performance
CREATE INDEX idx_admin_sessions_user_active ON public.admin_sessions(user_id, is_active);
CREATE INDEX idx_admin_sessions_expires ON public.admin_sessions(expires_at);
CREATE INDEX idx_demo_links_token ON public.demo_links(token);
CREATE INDEX idx_demo_links_expires ON public.demo_links(expires_at, is_revoked);
CREATE INDEX idx_demo_accesses_link ON public.demo_accesses(demo_link_id);
CREATE INDEX idx_student_chat_messages_zone ON public.student_chat_messages(zone_id, created_at);
CREATE INDEX idx_webauthn_credentials_user ON public.webauthn_credentials(user_id);
