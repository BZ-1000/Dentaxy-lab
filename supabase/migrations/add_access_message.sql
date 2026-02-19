-- ============================================================
-- Migración: access_message en dentaxy_modules
-- Ejecutar en: https://supabase.com/dashboard → SQL Editor
-- Proyecto: ooepkqxwywfcfhkpzphe (Dentaxy Technologies)
-- ============================================================

-- 1. Agregar columna access_message
ALTER TABLE dentaxy_modules 
  ADD COLUMN IF NOT EXISTS access_message TEXT DEFAULT NULL;

-- 2. Verificar la columna (debe aparecer en los resultados)
SELECT 
  column_name, 
  data_type, 
  is_nullable 
FROM information_schema.columns 
WHERE table_name = 'dentaxy_modules' 
  AND column_name IN ('free_access', 'access_message')
ORDER BY column_name;
