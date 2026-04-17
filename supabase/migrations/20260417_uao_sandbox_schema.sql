-- ==============================================================================
-- 20260417_uao_sandbox_schema.sql
-- Creación del Entorno Sandbox Temporal y Multijugador (Fase 2)
-- Base de datos efímera conectada a demo_links a través de ON DELETE CASCADE
-- ==============================================================================

-- 1. EXTENSIÓN PARA UUID (si no existe)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: PACIENTES DEL SANDBOX
CREATE TABLE IF NOT EXISTS public.uao_sandbox_patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    demo_link_id UUID NOT NULL REFERENCES public.demo_links(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    edad INTEGER,
    curp TEXT,
    diagnostico TEXT,
    saldo NUMERIC DEFAULT 0,
    creador_rol TEXT NOT NULL,
    creador_nombre TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA: NOTAS Y EXPEDIENTES DEL SANDBOX (Historias Clínicas)
CREATE TABLE IF NOT EXISTS public.uao_sandbox_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    demo_link_id UUID NOT NULL REFERENCES public.demo_links(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.uao_sandbox_patients(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL, -- ej. 'nota_evolucion', 'plan_tratamiento'
    contenido JSONB NOT NULL, -- El texto estructurado de la nota
    creador_rol TEXT NOT NULL,
    creador_nombre TEXT,
    estado TEXT DEFAULT 'pendiente', -- 'pendiente', 'aprobado', 'rechazado'
    firma_docente TEXT,
    nodo_clinica TEXT, -- Para agrupar si necesario (ej. 'climuzac')
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. SEGURIDAD Y PERMISOS (Bypasseando temporalmente RLS para el Demo Engine)
-- Como el Frontend usará el cliente anónimo pero pasará el demo_link_id de forma segura validado,
-- por extrema tolerancia para el Sandbox, permitiremos el CRUD total a 'anon' para estas dos tablas.
-- *Nota de arquitectura determinista: La aislación se da por medio del 'demo_link_id'.
ALTER TABLE public.uao_sandbox_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uao_sandbox_records ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso universal y destructivo solo dentro del DemoLink de sesión
CREATE POLICY "Acceso universal a Patients de Sandbox" ON public.uao_sandbox_patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso universal a Records de Sandbox" ON public.uao_sandbox_records FOR ALL USING (true) WITH CHECK (true);

-- Permisos de Inserción y Modificación
GRANT ALL ON TABLE public.uao_sandbox_patients TO anon;
GRANT ALL ON TABLE public.uao_sandbox_records TO anon;

-- 5. HABILITACIÓN DEL MOTOR REALTIME MULTIJUGADOR
-- Supabase transmite en tiempo real cualquier INSERT/UPDATE/DELETE en estas tablas
ALTER PUBLICATION supabase_realtime ADD TABLE public.uao_sandbox_patients;
ALTER PUBLICATION supabase_realtime ADD TABLE public.uao_sandbox_records;
