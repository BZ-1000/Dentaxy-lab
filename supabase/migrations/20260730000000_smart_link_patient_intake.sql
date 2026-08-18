-- ============================================================================
-- DENTAXY TECHNOLOGIES — ARQUITECTURA DE ENLACE INTELIGENTE (FASE 1 - REVISADO)
-- Cumplimiento: NOM-004-SSA3-2012 (Expediente Clínico Electrónico en México)
-- Control: Enlace Activable / Desactivable a voluntad por el Doctor (Zero-Trust)
-- ============================================================================

-- 1. EXTENSIONES REQUERIDAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABLA DE PLANTILLAS CLÍNICAS (clinical_templates)
CREATE TABLE IF NOT EXISTS public.clinical_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    specialty_type VARCHAR(50) NOT NULL UNIQUE, -- 'URGENCIAS' | 'GENERAL'
    title VARCHAR(150) NOT NULL,
    description TEXT,
    questions_schema JSONB NOT NULL, -- Estructura fija de preguntas NOM-004
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA DE SESIONES Y LINKS DE PACIENTE (patient_sessions)
-- ⚡ Cambio de especificación: Enlace activable/desactivable manualmente por el doctor
CREATE TABLE IF NOT EXISTS public.patient_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(64) UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(24), 'hex'),
    doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    patient_folder_id VARCHAR(255) NOT NULL, -- ID del expediente/carpeta local o Drive
    patient_name VARCHAR(255),
    specialty_type VARCHAR(50) NOT NULL CHECK (specialty_type IN ('URGENCIAS', 'GENERAL')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE, -- Activable / Desactivable por el doctor
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'COMPLETED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_activated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Índices para búsqueda ultrarrápida en móviles
CREATE INDEX IF NOT EXISTS idx_patient_sessions_token ON public.patient_sessions(token);
CREATE INDEX IF NOT EXISTS idx_patient_sessions_doctor ON public.patient_sessions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_patient_sessions_active ON public.patient_sessions(is_active, status);

-- 4. TABLA DE RESPUESTAS DEL PACIENTE (patient_responses)
CREATE TABLE IF NOT EXISTS public.patient_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.patient_sessions(id) ON DELETE CASCADE,
    responses_json JSONB NOT NULL, -- Respuestas estructuradas (Sí/No, Selección múltiple)
    clinical_photo_url TEXT NOT NULL, -- Foto clínica obligatoria del paciente
    ip_hash VARCHAR(64), -- Trazabilidad legal NOM-004
    device_info JSONB, -- Sistema operativo, navegador, resolución móvil
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice de respuestas
CREATE INDEX IF NOT EXISTS idx_patient_responses_session ON public.patient_responses(session_id);

-- 5. SEMBRADO DE PLANTILLAS NOM-004 (Urgencias y General)
INSERT INTO public.clinical_templates (specialty_type, title, description, questions_schema)
VALUES 
(
    'URGENCIAS',
    'Cuestionario de Evaluación Dental de Urgencias',
    'Evaluación rápida de dolor agudo, trauma y hemorragia conforme a NOM-004-SSA3-2012',
    '{
        "questions": [
            { "id": "urg_motivo", "type": "choice", "label": "¿Cuál es el dolor o problema principal en este momento?", "options": ["Dolor intenso espontáneo", "Dolor al masticar/frío/caliente", "Diente roto o zafado por golpe", "Inflamación/Hinchazón en cara o encía", "Sangrado constante"], "required": true },
            { "id": "urg_escala_dolor", "type": "range", "label": "Escala del dolor (1 al 10)", "min": 1, "max": 10, "required": true },
            { "id": "urg_tiempo", "type": "choice", "label": "¿Hace cuánto comenzó el malestar?", "options": ["Hace pocas horas", "1 a 2 días", "3 a 7 días", "Más de una semana"], "required": true },
            { "id": "urg_traumatismo", "type": "boolean", "label": "¿Sufrió algún golpe o accidente en la boca/rostro?", "required": true },
            { "id": "urg_hemorragia", "type": "boolean", "label": "¿Tiene sangrado activo en este momento?", "required": true },
            { "id": "urg_alergia_med", "type": "boolean", "label": "¿Es alérgico a la penicilina o algún medicamento?", "required": true },
            { "id": "urg_sistemica_critica", "type": "boolean", "label": "¿Padece del corazón, diabetes descontrolada o presión alta?", "required": true }
        ]
    }'::jsonb
),
(
    'GENERAL',
    'Historia Clínica General y Primera Vez',
    'Cuestionario clínico preventivo y antecedentes patológicos conforme a NOM-004-SSA3-2012',
    '{
        "questions": [
            { "id": "gen_antecedentes", "type": "multi_choice", "label": "¿Padece o ha padecido alguna de estas enfermedades?", "options": ["Diabetes", "Hipertensión", "Problemas Cardíacos", "Problemas Hepáticos", "Enfermedad Renal", "Ninguna"], "required": true },
            { "id": "gen_alergias", "type": "multi_choice", "label": "¿Tiene alguna alergia conocida?", "options": ["Medicamentos (Penicilina/Ibuprofeno)", "Alimentos", "Látex", "Ninguna"], "required": true },
            { "id": "gen_medicamentos_actuales", "type": "boolean_text", "label": "¿Está tomando algún medicamento recetado actualmente?", "placeholder": "Especifique el medicamento si aplica", "required": true },
            { "id": "gen_cirugias_anestesia", "type": "boolean", "label": "¿Ha tenido cirugías o problemas con la anestesia dental en el pasado?", "required": true },
            { "id": "gen_habitos", "type": "boolean", "label": "¿Fuma, consume alcohol frecuentemente o mastica tabaco?", "required": true },
            { "id": "gen_embarazo_lactancia", "type": "choice", "label": "¿Se encuentra actualmente embarazada o en periodo de lactancia?", "options": ["Sí (Embarazada)", "Sí (Lactando)", "No", "No aplica"], "required": true }
        ]
    }'::jsonb
)
ON CONFLICT (specialty_type) 
DO UPDATE SET 
    questions_schema = EXCLUDED.questions_schema,
    updated_at = NOW();

-- 6. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.clinical_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_responses ENABLE ROW LEVEL SECURITY;

-- 7. POLÍTICAS RLS (Seguridad Robusta Zero-Trust)

-- A) clinical_templates: Lectura pública de plantillas
CREATE POLICY "Permitir lectura publica de plantillas clínicas"
    ON public.clinical_templates FOR SELECT
    TO public
    USING (true);

-- B) patient_sessions: El doctor administra sus sesiones asignadas
CREATE POLICY "Doctor administra sus sesiones de paciente"
    ON public.patient_sessions FOR ALL
    TO authenticated
    USING (auth.uid() = doctor_id)
    WITH CHECK (auth.uid() = doctor_id);

-- C) patient_responses: El doctor consulta respuestas de sus pacientes
CREATE POLICY "Doctor lee las respuestas de sus pacientes"
    ON public.patient_responses FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.patient_sessions ps
            WHERE ps.id = patient_responses.session_id
            AND ps.doctor_id = auth.uid()
        )
    );

-- 8. FUNCIONES RPC DE CONTROL Y CONSUMO (Zero-Trust API)

-- A) Verificar si el token está activo cuando el paciente entra desde el móvil
CREATE OR REPLACE FUNCTION public.verify_patient_token(p_token VARCHAR)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_session RECORD;
    v_template JSONB;
BEGIN
    SELECT ps.* INTO v_session
    FROM public.patient_sessions ps
    WHERE ps.token = p_token;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('valid', false, 'reason', 'TOKEN_NOT_FOUND');
    END IF;

    -- Verificar si el doctor ha desactivado este enlace
    IF NOT v_session.is_active OR v_session.status = 'INACTIVE' THEN
        RETURN jsonb_build_object(
            'valid', false, 
            'reason', 'TOKEN_INACTIVE',
            'patient_name', v_session.patient_name,
            'message', 'El enlace ha sido desactivado por tu odontólogo.'
        );
    END IF;

    -- Obtener el esquema de preguntas correspondiente
    SELECT questions_schema INTO v_template
    FROM public.clinical_templates
    WHERE specialty_type = v_session.specialty_type;

    RETURN jsonb_build_object(
        'valid', true,
        'session_id', v_session.id,
        'patient_name', v_session.patient_name,
        'specialty_type', v_session.specialty_type,
        'is_active', v_session.is_active,
        'status', v_session.status,
        'template', v_template
    );
END;
$$;

-- B) Enviar respuesta del paciente (Transacción segura)
CREATE OR REPLACE FUNCTION public.submit_patient_response(
    p_token VARCHAR,
    p_responses_json JSONB,
    p_clinical_photo_url TEXT,
    p_device_info JSONB DEFAULT '{}'::jsonb,
    p_auto_deactivate BOOLEAN DEFAULT FALSE -- Si el doctor configuró auto-desactivar al responder
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_session RECORD;
    v_response_id UUID;
BEGIN
    -- Validar que el token existe y está activo
    SELECT ps.* INTO v_session
    FROM public.patient_sessions ps
    WHERE ps.token = p_token AND ps.is_active IS TRUE AND ps.status = 'ACTIVE'
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Este enlace se encuentra desactivado o no existe');
    END IF;

    -- 1. Registrar la respuesta
    INSERT INTO public.patient_responses (
        session_id,
        responses_json,
        clinical_photo_url,
        device_info,
        submitted_at
    ) VALUES (
        v_session.id,
        p_responses_json,
        p_clinical_photo_url,
        p_device_info,
        NOW()
    )
    RETURNING id INTO v_response_id;

    -- 2. Actualizar estado de la sesión
    UPDATE public.patient_sessions
    SET 
        status = CASE WHEN p_auto_deactivate THEN 'COMPLETED' ELSE 'ACTIVE' END,
        is_active = CASE WHEN p_auto_deactivate THEN FALSE ELSE TRUE END,
        completed_at = NOW()
    WHERE id = v_session.id;

    RETURN jsonb_build_object(
        'success', true,
        'response_id', v_response_id,
        'message', 'Respuestas guardadas exitosamente en la ficha clínica del paciente'
    );
END;
$$;

-- C) Función para que el Doctor active o desactive el link en 1 clic desde Dentaxy
CREATE OR REPLACE FUNCTION public.toggle_patient_session_active(
    p_session_id UUID,
    p_is_active BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_updated RECORD;
BEGIN
    UPDATE public.patient_sessions
    SET 
        is_active = p_is_active,
        status = CASE WHEN p_is_active THEN 'ACTIVE' ELSE 'INACTIVE' END,
        last_activated_at = CASE WHEN p_is_active THEN NOW() ELSE last_activated_at END
    WHERE id = p_session_id AND doctor_id = auth.uid()
    RETURNING * INTO v_updated;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Sesión no encontrada o sin permisos');
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'session_id', v_updated.id,
        'is_active', v_updated.is_active,
        'status', v_updated.status
    );
END;
$$;

-- 9. PERMISOS DE EJECUCIÓN
GRANT EXECUTE ON FUNCTION public.verify_patient_token(VARCHAR) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_patient_response(VARCHAR, JSONB, TEXT, JSONB, BOOLEAN) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.toggle_patient_session_active(UUID, BOOLEAN) TO authenticated;
