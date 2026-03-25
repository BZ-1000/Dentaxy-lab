-- ============================================================
-- Dentaxy: Editor de Presentación
-- Tabla: presentation_slides
-- Almacena cada diapositiva con su snapshot de tldraw (JSONB)
-- ============================================================

CREATE TABLE IF NOT EXISTS presentation_slides (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slide_order INT  NOT NULL DEFAULT 0,
  title       TEXT NOT NULL DEFAULT 'Nueva Diapositiva',
  -- Snapshot completo serializado de tldraw (shapes, bindings, assets)
  tldraw_snapshot JSONB,
  -- Thumbnail SVG mini para preview en el panel de slides
  thumbnail_svg   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para ordenar slides eficientemente
CREATE INDEX IF NOT EXISTS idx_presentation_slides_order
  ON presentation_slides (slide_order ASC);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_presentation_slides_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_presentation_slides_updated_at
  BEFORE UPDATE ON presentation_slides
  FOR EACH ROW EXECUTE FUNCTION update_presentation_slides_updated_at();

-- ── RLS ──────────────────────────────────────────────────────
ALTER TABLE presentation_slides ENABLE ROW LEVEL SECURITY;

-- Solo admins autenticados pueden leer y modificar slides
-- (usamos la misma lógica que el resto del panel admin)
CREATE POLICY "admin_read_slides"
  ON presentation_slides FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "admin_write_slides"
  ON presentation_slides FOR ALL
  USING (auth.role() = 'authenticated');

-- Insertar slide inicial de bienvenida para no empezar en blanco
INSERT INTO presentation_slides (slide_order, title, tldraw_snapshot)
VALUES (0, 'Portada', NULL)
ON CONFLICT DO NOTHING;
