-- Corregir política de INSERT demasiado permisiva
-- La inserción SOLO debe ocurrir a través de la función create_demo_session (SECURITY DEFINER)
-- Por lo tanto, bloqueamos inserciones directas y solo permitimos via función

DROP POLICY IF EXISTS "Public can insert demo sessions via function" ON public.demo_sessions;

-- No se necesita política de INSERT pública porque la función create_demo_session
-- usa SECURITY DEFINER y bypassa RLS automáticamente

-- Mejorar la política de SELECT para que solo puedan ver su propia sesión por token
DROP POLICY IF EXISTS "Anyone can view their own session by token" ON public.demo_sessions;

-- Esta política permite consultar solo con el token correcto (la función verify_demo_session usa SECURITY DEFINER)