-- Migración para crear la tabla de integraciones de los doctores (OAuth 2.0)
-- Permite almacenar el refresh_token de Google Drive asociado a cada médico.

CREATE TABLE IF NOT EXISTS public.doctor_integrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    doctor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL DEFAULT 'google_drive',
    refresh_token TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(doctor_id, provider)
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_doctor_integrations_doctor_id ON public.doctor_integrations(doctor_id);

-- Comentarios
COMMENT ON TABLE public.doctor_integrations IS 'Almacena tokens de integraciones de terceros (ej. Google Drive) por médico';

-- ========================================
-- POLÍTICAS RLS (Row Level Security)
-- ========================================

ALTER TABLE public.doctor_integrations ENABLE ROW LEVEL SECURITY;

-- 1. El usuario puede ver su propia integración
CREATE POLICY "Users can view own integrations"
    ON public.doctor_integrations FOR SELECT
    USING (auth.uid() = doctor_id);

-- 2. El usuario puede insertar/actualizar su propia integración
CREATE POLICY "Users can insert own integrations"
    ON public.doctor_integrations FOR INSERT
    WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Users can update own integrations"
    ON public.doctor_integrations FOR UPDATE
    USING (auth.uid() = doctor_id);

-- 3. Service role (Backend / Vercel Serverless) tiene acceso completo para leer/actualizar
CREATE POLICY "Service role full access"
    ON public.doctor_integrations FOR ALL
    USING (true);

-- Permisos
GRANT ALL ON public.doctor_integrations TO authenticated;
GRANT ALL ON public.doctor_integrations TO service_role;
