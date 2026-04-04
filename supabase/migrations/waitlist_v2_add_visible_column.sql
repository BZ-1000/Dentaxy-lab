-- ═══════════════════════════════════════════════════════════════════════
-- MIGRACIÓN: Waitlist v2.1
-- Tabla: dentaxy_modules
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════

-- 1. Añadir columna waitlist_visible
ALTER TABLE dentaxy_modules
  ADD COLUMN IF NOT EXISTS waitlist_visible BOOLEAN NOT NULL DEFAULT true;

COMMENT ON COLUMN dentaxy_modules.waitlist_visible IS
  'Controla si el módulo aparece en el modal de Lista de Espera público. true=visible, false=oculto. Gestionado desde /admin/waitlist.';

-- 2. Insertar / sincronizar los 8 módulos del ecosistema
INSERT INTO dentaxy_modules (name, display_name, description, status, is_enabled, waitlist_visible)
VALUES
  ('Seed',   'Dentaxy Seed',   'Software inicial para gestión de historias clínicas',        'active',   true,  true),
  ('Shop',   'Dentaxy Shop',   'Marketplace de insumos dentales con logística integrada',    'inactive', false, true),
  ('Lab',    'Dentaxy Lab',    'Gestión de trabajos protésicos y comunicación con labs',     'inactive', false, true),
  ('Club',   'Dentaxy Club',   'Red social y comunidad odontológica en tiempo real',         'inactive', false, true),
  ('News',   'Dentaxy News',   'Noticias odontológicas filtradas por IA',                    'inactive', false, true),
  ('Aura',   'Dentaxy Aura',   'Portafolio de prestigio y certificaciones verificadas',      'inactive', false, true),
  ('Space',  'Dentaxy Space',  'Generador de páginas web profesionales para clínicas',       'inactive', false, true),
  ('MyLana', 'Dentaxy MyLana', 'Control financiero clínico con proyecciones de crecimiento', 'inactive', false, true)
ON CONFLICT (name) DO NOTHING;
-- ON CONFLICT DO NOTHING: respeta datos existentes, solo inserta si no hay registro

-- 3. Índice de performance para la consulta de toggles
CREATE INDEX IF NOT EXISTS idx_dentaxy_modules_waitlist
  ON dentaxy_modules (name, waitlist_visible);

-- 4. Verificar resultado
SELECT name, display_name, status, is_enabled, waitlist_visible
FROM dentaxy_modules
WHERE name IN ('Seed','Shop','Lab','Club','News','Aura','Space','MyLana')
ORDER BY name;
