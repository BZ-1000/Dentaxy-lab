-- ==============================================================================
-- 20260417_token_autocleanup.sql
-- Modifica el RPC increment_demo_uses para convertir los tokens en elementos 
-- efímeros (Auto-limpieza).
-- ==============================================================================

-- 1. Asegurar que las sesiones no se borren cuando el token se destruya.
-- Se cambia la ForeignKey de demo_sessions para usar ON DELETE SET NULL.
DO $$ 
DECLARE 
  fk_name text;
BEGIN
  SELECT constraint_name INTO fk_name 
  FROM information_schema.key_column_usage 
  WHERE table_name = 'demo_sessions' AND column_name = 'demo_link_id';

  IF fk_name IS NOT NULL THEN
    EXECUTE 'ALTER TABLE demo_sessions DROP CONSTRAINT ' || fk_name;
    EXECUTE 'ALTER TABLE demo_sessions ADD CONSTRAINT ' || fk_name || ' FOREIGN KEY (demo_link_id) REFERENCES demo_links(id) ON DELETE SET NULL';
  END IF;
END $$;

-- 2. Modificar el RPC para interceptar el incremento de usos
-- Si un token alcanza su límite máximo de usos, se borra de la Base de Datos.
-- Adicionalmente, el RPC realiza un "barrido" silencioso de cualquier otro
-- token en la tabla que ya haya expirado.
CREATE OR REPLACE FUNCTION public.increment_demo_uses(p_token TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_link_id UUID;
  v_current_uses INT;
  v_max_uses INT;
BEGIN
  -- 1) Barrido silencioso de basura expirada (Zero-Cost Analytics Cleanup)
  DELETE FROM public.demo_links WHERE expires_at < NOW();

  -- 2) Ejecutar la propia lógica del token invocado
  SELECT id, current_uses, max_uses INTO v_link_id, v_current_uses, v_max_uses
  FROM public.demo_links
  WHERE token = p_token;

  IF v_link_id IS NOT NULL THEN
     -- Si el uso actual + 1 alcanza o supera el límite permitido, es su último uso.
     IF (v_current_uses + 1) >= v_max_uses THEN
         -- Destrucción del token (Single-Use efímero)
         DELETE FROM public.demo_links WHERE id = v_link_id;
     ELSE
         -- Aún le quedan usos > continuar incrementando
         UPDATE public.demo_links 
         SET current_uses = current_uses + 1 
         WHERE id = v_link_id;
     END IF;
  END IF;
END;
$$;

-- Asegurar permisos de ejecución al cliente anónimo para consumir demos
GRANT EXECUTE ON FUNCTION public.increment_demo_uses(TEXT) TO anon;
