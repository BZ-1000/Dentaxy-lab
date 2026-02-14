-- SCRIPT DE REPARACIÓN RÁPIDA - EJECUTAR EN SUPABASE SQL EDITOR
-- Esto soluciona el error al cambiar el modo de acceso

DO $$
BEGIN
    -- 1. Agregar columna free_access si no existe
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'dentaxy_modules' 
        AND column_name = 'free_access'
    ) THEN
        ALTER TABLE public.dentaxy_modules 
        ADD COLUMN free_access BOOLEAN DEFAULT false;
        
        RAISE NOTICE '✅ Columna free_access agregada exitosamente';
    ELSE
        RAISE NOTICE 'ℹ️ La columna free_access ya existe';
    END IF;

    -- 2. Asegurar que los permisos son correctos
    GRANT SELECT, UPDATE ON public.dentaxy_modules TO authenticated;
    GRANT SELECT, UPDATE ON public.dentaxy_modules TO service_role;
    
    -- 3. Crear índice para mejorar rendimiento (opcional pero recomendado)
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE schemaname = 'public'
        AND tablename = 'dentaxy_modules'
        AND indexname = 'idx_dentaxy_modules_free_access'
    ) THEN
        CREATE INDEX idx_dentaxy_modules_free_access 
        ON public.dentaxy_modules(free_access);
    END IF;

END $$;

-- 4. Verificar el estado actual
SELECT name, is_enabled, status, free_access 
FROM public.dentaxy_modules 
ORDER BY name;
