-- ========================================
-- DENTAXY AUTH SCHEMA - Sistema Biométrico
-- ========================================
-- Extensión del schema maestro para autenticación WebAuthn/FIDO2
-- Ejecutar DESPUÉS de DENTAXY_SCHEMA_MAESTRO.sql

-- ========================================
-- 1. TABLAS DE AUTENTICACIÓN BIOMÉTRICA
-- ========================================

-- Tabla: user_passkeys
-- Almacena las credenciales públicas (Passkeys) de los usuarios
CREATE TABLE IF NOT EXISTS public.user_passkeys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    credential_id TEXT UNIQUE NOT NULL, -- ID de la credencial WebAuthn
    public_key TEXT NOT NULL, -- Clave pública (base64)
    counter BIGINT DEFAULT 0, -- Contador de usos (anti-replay)
    device_name TEXT, -- Nombre del dispositivo (ej: "MacBook Pro", "Pixel 8")
    transports TEXT[], -- ej: ['usb', 'nfc', 'ble', 'internal']
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_used_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true
);

-- Índices para user_passkeys
CREATE INDEX IF NOT EXISTS idx_user_passkeys_user_id ON public.user_passkeys(user_id);
CREATE INDEX IF NOT EXISTS idx_user_passkeys_credential_id ON public.user_passkeys(credential_id);

COMMENT ON TABLE public.user_passkeys IS 'Credenciales WebAuthn (Passkeys) registradas por usuarios';
COMMENT ON COLUMN public.user_passkeys.counter IS 'Contador de autenticaciones para prevenir replay attacks';


-- Tabla: biometric_policies
-- Define qué acciones del sistema requieren autenticación biométrica
CREATE TABLE IF NOT EXISTS public.biometric_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action_name TEXT UNIQUE NOT NULL, -- ej: 'admin.delete_data', 'dicom.access_viewer'
    display_name TEXT NOT NULL,
    description TEXT,
    requires_biometric BOOLEAN DEFAULT false, -- Si requiere biometría
    requires_reauth BOOLEAN DEFAULT false, -- Si requiere autenticación reciente
    reauth_timeout_seconds INTEGER DEFAULT 300, -- Tiempo válido de sesión (5 min)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para biometric_policies
CREATE INDEX IF NOT EXISTS idx_biometric_policies_action ON public.biometric_policies(action_name);

COMMENT ON TABLE public.biometric_policies IS 'Define políticas de autenticación biométrica por acción del sistema';


-- Tabla: biometric_challenges
-- Almacena challenges temporales para el flujo de autenticación
CREATE TABLE IF NOT EXISTS public.biometric_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge TEXT NOT NULL, -- Challenge único (base64)
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para limpiar challenges expirados
CREATE INDEX IF NOT EXISTS idx_challenges_expires ON public.biometric_challenges(expires_at);

COMMENT ON TABLE public.biometric_challenges IS 'Challenges temporales para autenticación WebAuthn (válidos 2 minutos)';


-- Tabla: auth_audit_log
-- Log de eventos de autenticación para auditoría
CREATE TABLE IF NOT EXISTS public.auth_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL, -- 'passkey_registered', 'login_success', 'login_failed', 'reauthenticated'
    action_name TEXT, -- Acción que disparó el evento (si aplica)
    device_info JSONB, -- User agent, IP, etc.
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para audit log
CREATE INDEX IF NOT EXISTS idx_audit_user ON public.auth_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.auth_audit_log(created_at DESC);

COMMENT ON TABLE public.auth_audit_log IS 'Registro de auditoría de eventos de autenticación';


-- ========================================
-- 2. POLÍTICAS RLS (Row Level Security)
-- ========================================

-- user_passkeys: Solo el usuario puede ver/gestionar sus propios passkeys
ALTER TABLE public.user_passkeys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own passkeys"
    ON public.user_passkeys FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own passkeys"
    ON public.user_passkeys FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own passkeys"
    ON public.user_passkeys FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own passkeys"
    ON public.user_passkeys FOR DELETE
    USING (auth.uid() = user_id);

-- Admins pueden ver todos los passkeys (para gestión)
CREATE POLICY "Admins can view all passkeys"
    ON public.user_passkeys FOR SELECT
    USING (
        auth.uid() IN (
            SELECT id FROM auth.users WHERE email = 'admin@dentaxy.com' 
            UNION SELECT '982e88ff-cde9-4597-8f30-4d0831a7dfd1'::uuid
        )
    );


-- biometric_policies: Lectura pública, escritura solo admins
ALTER TABLE public.biometric_policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view policies"
    ON public.biometric_policies FOR SELECT
    USING (true);

CREATE POLICY "Only authenticated users can modify policies"
    ON public.biometric_policies FOR ALL
    USING (auth.role() = 'authenticated');


-- biometric_challenges: Solo el usuario puede ver sus challenges
ALTER TABLE public.biometric_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own challenges"
    ON public.biometric_challenges FOR SELECT
    USING (auth.uid() = user_id);

-- Service role puede crear challenges (desde Edge Functions)
CREATE POLICY "Service can create challenges"
    ON public.biometric_challenges FOR INSERT
    WITH CHECK (true);


-- auth_audit_log: Solo lectura para admins
ALTER TABLE public.auth_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit log"
    ON public.auth_audit_log FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Service can insert audit entries"
    ON public.auth_audit_log FOR INSERT
    WITH CHECK (true);


-- ========================================
-- 3. SEED DE POLÍTICAS DEFAULT
-- ========================================

INSERT INTO public.biometric_policies (action_name, display_name, description, requires_biometric, requires_reauth, reauth_timeout_seconds)
VALUES
    ('admin.access_panel', 'Acceso al Panel Admin', 'Entrar al panel de administración', true, false, 0),
    ('admin.delete_demo_link', 'Eliminar Demo Link', 'Eliminar un link de demo', true, true, 300),
    ('admin.update_module_status', 'Cambiar Estado de Módulo', 'Activar/desactivar módulos del ecosistema', true, true, 300),
    ('admin.manage_users', 'Gestionar Usuarios', 'Crear, editar o eliminar usuarios', true, true, 180),
    ('dicom.access_viewer', 'Acceso a DICOM Viewer', 'Ver imágenes médicas DICOM', false, false, 0),
    ('enterprise.export_patient_data', 'Exportar Datos de Pacientes', 'Exportar información clínica sensible', true, true, 120),
    ('admin.modify_biometric_policies', 'Modificar Políticas Biométricas', 'Cambiar requisitos de autenticación', true, true, 180)
ON CONFLICT (action_name) DO NOTHING;


-- ========================================
-- 4. FUNCIONES AUXILIARES
-- ========================================

-- Función: clean_expired_challenges
-- Limpia challenges expirados automáticamente
CREATE OR REPLACE FUNCTION public.clean_expired_challenges()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM public.biometric_challenges
    WHERE expires_at < NOW();
END;
$$;

COMMENT ON FUNCTION public.clean_expired_challenges IS 'Limpia challenges de autenticación expirados';


-- ========================================
-- 5. GRANTS (Permisos adicionales)
-- ========================================

-- Permitir al service_role acceso completo (para Edge Functions)
GRANT ALL ON public.user_passkeys TO service_role;
GRANT ALL ON public.biometric_policies TO service_role;
GRANT ALL ON public.biometric_challenges TO service_role;
GRANT ALL ON public.auth_audit_log TO service_role;

-- Authenticated users pueden leer políticas
GRANT SELECT ON public.biometric_policies TO authenticated;


-- ========================================
-- FINALIZADO
-- ========================================

-- Verificación
SELECT 'Auth Schema instalado correctamente' AS status;
SELECT COUNT(*) AS total_policies FROM public.biometric_policies;
