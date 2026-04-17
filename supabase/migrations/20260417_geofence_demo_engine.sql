-- ═══════════════════════════════════════════════════════════════
-- DEMO ENGINE v2 — GeoFence Migration
-- Proyecto: ooepkqxwywfcfhkpzphe
-- Ejecutar en: https://supabase.com/dashboard/project/ooepkqxwywfcfhkpzphe/sql
-- ═══════════════════════════════════════════════════════════════

-- 1. Nuevas columnas en demo_links (no-destructivo)
ALTER TABLE public.demo_links
  ADD COLUMN IF NOT EXISTS is_geo_fenced BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS geo_zone_name TEXT,
  ADD COLUMN IF NOT EXISTS geo_lat DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS geo_lng DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS geo_radius_km DOUBLE PRECISION DEFAULT 1.5;

-- 2. Tabla de zonas seguras (GeoMap admin)
CREATE TABLE IF NOT EXISTS public.geo_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  radius_km DOUBLE PRECISION NOT NULL DEFAULT 1.5,
  color TEXT DEFAULT '#10B981',
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS para geo_zones
ALTER TABLE public.geo_zones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage geo_zones" ON public.geo_zones;
CREATE POLICY "Admins can manage geo_zones"
  ON public.geo_zones FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public can read active geo_zones" ON public.geo_zones;
CREATE POLICY "Public can read active geo_zones"
  ON public.geo_zones FOR SELECT
  USING (is_active = TRUE);

-- 3. Seed de zonas
INSERT INTO public.geo_zones (name, lat, lng, radius_km, color, description)
VALUES
  ('Campus UAO UAZ (Begonias, Guadalupe)', 22.752317, -102.531238, 1.5, '#10B981', 'Campus principal UAO Universidad Autónoma de Zacatecas'),
  ('Oficina Dentaxy — Zacatecas Centro', 22.7709, -102.5832, 1.2, '#3B82F6', 'Sede principal Dentaxy Technologies'),
  ('CROID Clínica', 22.7650, -102.5600, 0.5, '#8B5CF6', 'Clínica CROID — demo autorizado')
ON CONFLICT DO NOTHING;

-- 4. Actualizar RPC create_demo_link con parámetros geo
CREATE OR REPLACE FUNCTION public.create_demo_link(
  p_token TEXT,
  p_admin_id UUID,
  p_expires_at TIMESTAMPTZ,
  p_max_uses INTEGER DEFAULT 1,
  p_allowed_modules TEXT[] DEFAULT '{}',
  p_requires_token BOOLEAN DEFAULT TRUE,
  p_requires_user_info BOOLEAN DEFAULT TRUE,
  p_is_geo_fenced BOOLEAN DEFAULT FALSE,
  p_geo_zone_name TEXT DEFAULT NULL,
  p_geo_lat DOUBLE PRECISION DEFAULT NULL,
  p_geo_lng DOUBLE PRECISION DEFAULT NULL,
  p_geo_radius_km DOUBLE PRECISION DEFAULT 1.5
)
RETURNS TABLE(success BOOLEAN, token TEXT, error_message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.demo_links (
    token, created_by, expires_at, max_uses,
    allowed_modules, requires_token, requires_user_info,
    is_geo_fenced, geo_zone_name, geo_lat, geo_lng, geo_radius_km
  ) VALUES (
    p_token, p_admin_id, p_expires_at, p_max_uses,
    p_allowed_modules, p_requires_token, p_requires_user_info,
    p_is_geo_fenced, p_geo_zone_name, p_geo_lat, p_geo_lng, p_geo_radius_km
  );
  RETURN QUERY SELECT TRUE, p_token, NULL::TEXT;
EXCEPTION WHEN OTHERS THEN
  RETURN QUERY SELECT FALSE, NULL::TEXT, SQLERRM;
END;
$$;

-- Verificación
SELECT 'Migración GeoFence OK' AS status;
SELECT column_name FROM information_schema.columns
WHERE table_name = 'demo_links' AND column_name LIKE 'geo_%';
