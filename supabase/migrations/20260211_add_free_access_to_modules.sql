-- Agregar columna free_access a dentaxy_modules
-- Esta columna permite que un módulo sea accesible sin token

ALTER TABLE public.dentaxy_modules 
ADD COLUMN IF NOT EXISTS free_access BOOLEAN DEFAULT false;

-- Comentario de la columna
COMMENT ON COLUMN public.dentaxy_modules.free_access IS 
'Indica si el módulo permite acceso libre sin necesidad de token de demo';

-- Actualizar módulos existentes (opcional - todos inician con false)
UPDATE public.dentaxy_modules 
SET free_access = false 
WHERE free_access IS NULL;

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_dentaxy_modules_free_access 
ON public.dentaxy_modules(free_access) 
WHERE free_access = true;

-- Nota: Las políticas RLS ya existentes cubren esta columna
-- Los admins pueden modificar, todos pueden leer
