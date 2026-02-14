-- Agregar columna requires_token a demo_links para sistema de acceso libre
ALTER TABLE demo_links 
ADD COLUMN IF NOT EXISTS requires_token BOOLEAN DEFAULT true;

COMMENT ON COLUMN demo_links.requires_token IS 'Si es false, el módulo permite acceso directo sin validación de token';

-- Crear índice para queries eficientes
CREATE INDEX IF NOT EXISTS idx_demo_links_requires_token 
ON demo_links(requires_token) WHERE requires_token = false;
