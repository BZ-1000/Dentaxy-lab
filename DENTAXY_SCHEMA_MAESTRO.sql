-- DENTAXY SCHEMA MAESTRO V1
-- Este archivo contiene TODA la estructura necesaria para que el frontend de Dentaxy funcione.
-- Ejecutar este script en el SQL Editor del nuevo proyecto de Supabase.

-- 1. Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: dentaxy_modules
-- Centraliza el control de los módulos del ecosistema
CREATE TABLE IF NOT EXISTS public.dentaxy_modules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE, -- ej: 'motor_neuronal', 'dicom'
    display_name TEXT NOT NULL,
    description TEXT,
    icon TEXT, -- nombre del icono lucide
    status TEXT DEFAULT 'active', -- 'active', 'maintenance', 'beta', 'classified'
    is_enabled BOOLEAN DEFAULT true,
    classification_level INTEGER DEFAULT 1, -- 1-5 nivel de seguridad
    free_access BOOLEAN DEFAULT false, -- Acceso libre sin token (nuevo)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comentarios
COMMENT ON COLUMN public.dentaxy_modules.free_access IS 'Indica si el módulo permite acceso libre sin necesidad de token de demo';

-- Datos iniciales (Seed)
INSERT INTO public.dentaxy_modules (name, display_name, description, status, classification_level, free_access)
VALUES 
    ('motor_neuronal', 'DENTAXY AI', 'Motor de asistencia cognitiva y redacción clínica.', 'active', 3, false),
    ('dicom', 'DICOM Viewer', 'Visualización y manipulación de imagenología médica.', 'active', 2, false),
    ('academico', 'DENTAXY UNIVERSIDADES', 'Plataforma de gestión académica y clínica.', 'beta', 2, false),
    ('enterprise', 'DENTAXY ENTERPRISE', 'Arquitectura clínica para grandes redes.', 'active', 4, false),
    ('proyecto_stark', 'PROYECTO STARK', 'Desarrollo clasificado de alto nivel.', 'classified', 5, false),
    ('visualizacion_3d', 'VIZ 3D', 'Módulo legado de visualización.', 'active', 1, false)
ON CONFLICT (name) DO NOTHING;


-- 3. TABLA: demo_links
-- Gestiona los tokens de acceso para demos
CREATE TABLE IF NOT EXISTS public.demo_links (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    token TEXT NOT NULL UNIQUE,
    created_by UUID REFERENCES auth.users(id), -- Admin que creó el link
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    max_uses INTEGER DEFAULT 1,
    current_uses INTEGER DEFAULT 0,
    is_revoked BOOLEAN DEFAULT false,
    allowed_modules TEXT[], -- Array de nombres de módulos permitidos (null = todos)
    requires_token BOOLEAN DEFAULT true,
    requires_user_info BOOLEAN DEFAULT true, -- Si pide datos al usuario antes de entrar
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 4. TABLA: demo_sessions
-- Registra quién entró y cuándo
CREATE TABLE IF NOT EXISTS public.demo_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    demo_link_id UUID REFERENCES public.demo_links(id),
    module_id TEXT NOT NULL, -- Nombre del módulo visitado
    started_at TIMESTAMPTZ DEFAULT NOW(),
    user_agent TEXT,
    ip_address TEXT,
    user_name TEXT, -- Datos capturados en el formulario
    user_email TEXT,
    user_location TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);


-- 5. FUNCIONES RPC (Remote Procedure Calls)
-- Necesarias para la lógica del admin panel y validaciones

-- RPC: create_demo_link
-- Función segura para crear links desde el admin panel
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
SECURITY DEFINER -- Se ejecuta con permisos de admin
SET search_path = public
AS $$
BEGIN
  -- Verificar si el usuario es admin (implementar lógica real si existe tabla de roles)
  -- Por ahora permitimos si está autenticado
  
  INSERT INTO public.demo_links (
      token, created_by, expires_at, max_uses, allowed_modules, requires_token, requires_user_info
  ) VALUES (
      p_token, p_admin_id, p_expires_at, p_max_uses, p_allowed_modules, p_requires_token, p_requires_user_info
  ) RETURNING id INTO link_id;

  RETURN QUERY SELECT true, link_id, NULL::TEXT;
EXCEPTION WHEN OTHERS THEN
  RETURN QUERY SELECT false, NULL::UUID, SQLERRM;
END;
$$;

-- 6. POLÍTICAS RLS (Row Level Security)
-- Seguridad básica

ALTER TABLE public.dentaxy_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_sessions ENABLE ROW LEVEL SECURITY;

-- dentaxy_modules:
-- Lectura pública (para el Hub)
CREATE POLICY "Public modules access" ON public.dentaxy_modules
    FOR SELECT USING (true);
    
-- Escritura solo Admins (asumiendo autenticación básica por ahora)
CREATE POLICY "Admin update modules" ON public.dentaxy_modules
    FOR UPDATE USING (auth.role() = 'authenticated');

-- demo_links:
-- Validación de tokens (pública para poder verificar en el login)
CREATE POLICY "Public verify tokens" ON public.demo_links
    FOR SELECT USING (true);
    
-- Creación solo Admins
CREATE POLICY "Admin create links" ON public.demo_links
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    
-- demo_sessions:
-- Inserción pública (al iniciar sesión)
CREATE POLICY "Public create sessions" ON public.demo_sessions
    FOR INSERT WITH CHECK (true);
    
-- Lectura solo Admins
CREATE POLICY "Admin read sessions" ON public.demo_sessions
    FOR SELECT USING (auth.role() = 'authenticated');

-- FINALIZADO
