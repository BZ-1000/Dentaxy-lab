-- ─────────────────────────────────────────────────────────────────────────────
-- DENTAXY SEED: Tabla de Prospectos y Clientes
-- Archivo: 20260422_seed_prospects.sql
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS seed_prospects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Identidad del Doctor (Google OAuth)
  google_email TEXT NOT NULL,
  google_name TEXT,
  google_picture TEXT,

  -- Especialidad seleccionada
  especialidad TEXT NOT NULL,

  -- Datos de la Clínica
  clinica_nombre TEXT NOT NULL,
  clinica_logo_url TEXT,       -- URL en Supabase Storage
  historia_url TEXT,           -- URL del PDF/imagen original en Storage

  -- Subdominio
  subdominio TEXT UNIQUE,
  subdominio_activo BOOLEAN DEFAULT false,

  -- Output de IA (JSON completo de Gemini)
  ai_output JSONB DEFAULT NULL,
  ai_processed BOOLEAN DEFAULT false,
  ai_error TEXT DEFAULT NULL,

  -- Estado comercial
  estado TEXT NOT NULL DEFAULT 'prospecto',
  -- prospecto | pagado | activo | cancelado

  stripe_session_id TEXT DEFAULT NULL,

  -- Notas internas del admin
  notas_admin TEXT DEFAULT NULL
);

-- Auto-update del timestamp
CREATE OR REPLACE FUNCTION update_seed_prospects_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_seed_prospects_updated ON seed_prospects;
CREATE TRIGGER trg_seed_prospects_updated
  BEFORE UPDATE ON seed_prospects
  FOR EACH ROW EXECUTE FUNCTION update_seed_prospects_timestamp();

-- Índices útiles
CREATE INDEX IF NOT EXISTS idx_seed_prospects_estado ON seed_prospects(estado);
CREATE INDEX IF NOT EXISTS idx_seed_prospects_email ON seed_prospects(google_email);
CREATE INDEX IF NOT EXISTS idx_seed_prospects_created ON seed_prospects(created_at DESC);

-- RLS
ALTER TABLE seed_prospects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_full_access" ON seed_prospects
  FOR ALL TO service_role USING (true);

CREATE POLICY "anon_insert_prospects" ON seed_prospects
  FOR INSERT TO anon WITH CHECK (true);
