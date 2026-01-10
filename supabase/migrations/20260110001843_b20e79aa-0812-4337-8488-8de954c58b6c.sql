
-- Arreglar search_path en todas las funciones de seguridad

-- is_admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles
    WHERE user_id = user_uuid
    AND role IN ('super_admin', 'admin')
  );
$$;

-- is_super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles
    WHERE user_id = user_uuid
    AND role = 'super_admin'
  );
$$;

-- get_admin_role
CREATE OR REPLACE FUNCTION public.get_admin_role(user_uuid UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::TEXT FROM public.admin_roles
  WHERE user_id = user_uuid
  LIMIT 1;
$$;

-- activate_kill_switch
CREATE OR REPLACE FUNCTION public.activate_kill_switch(admin_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_super_admin(admin_user_id) THEN
    RAISE EXCEPTION 'Only super_admin can activate kill switch';
  END IF;

  UPDATE public.demo_links SET is_revoked = true WHERE is_revoked = false;
  
  UPDATE public.admin_sessions 
  SET is_active = false 
  WHERE user_id != admin_user_id;
  
  UPDATE public.system_state 
  SET value = '{"active": false}', updated_by = admin_user_id, updated_at = now()
  WHERE key = 'chat_enabled';
  
  UPDATE public.system_state 
  SET value = jsonb_build_object('active', true, 'activated_at', now(), 'activated_by', admin_user_id),
      updated_by = admin_user_id,
      updated_at = now()
  WHERE key = 'lockdown_mode';
  
  INSERT INTO public.audit_logs (action, resource_type, user_id, details)
  VALUES ('KILL_SWITCH_ACTIVATED', 'system', admin_user_id, '{"severity": "critical"}');
END;
$$;

-- deactivate_kill_switch
CREATE OR REPLACE FUNCTION public.deactivate_kill_switch(admin_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_super_admin(admin_user_id) THEN
    RAISE EXCEPTION 'Only super_admin can deactivate kill switch';
  END IF;

  UPDATE public.system_state 
  SET value = '{"active": true}', updated_by = admin_user_id, updated_at = now()
  WHERE key = 'chat_enabled';
  
  UPDATE public.system_state 
  SET value = jsonb_build_object('active', false, 'deactivated_at', now(), 'deactivated_by', admin_user_id),
      updated_by = admin_user_id,
      updated_at = now()
  WHERE key = 'lockdown_mode';
  
  INSERT INTO public.audit_logs (action, resource_type, user_id, details)
  VALUES ('KILL_SWITCH_DEACTIVATED', 'system', admin_user_id, '{"severity": "info"}');
END;
$$;

-- Arreglar políticas RLS permisivas (eliminar las que tienen WITH CHECK true para INSERT)

-- demo_accesses: Restringir INSERT a solo cuando hay un demo_link válido
DROP POLICY IF EXISTS "Anyone can insert demo access" ON public.demo_accesses;
CREATE POLICY "Valid demo access insert"
ON public.demo_accesses FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.demo_links 
    WHERE id = demo_link_id 
    AND is_revoked = false 
    AND expires_at > now()
  )
);

-- student_chat_messages: Asegurar que el usuario no está bloqueado
DROP POLICY IF EXISTS "Authenticated users can send messages" ON public.student_chat_messages;
CREATE POLICY "Users can send messages if not blocked"
ON public.student_chat_messages FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND auth.uid() = user_id
  AND NOT EXISTS (
    SELECT 1 FROM public.student_chat_blocks
    WHERE student_chat_blocks.user_id = auth.uid()
    AND (zone_id IS NULL OR student_chat_blocks.zone_id = student_chat_messages.zone_id)
    AND (is_permanent = true OR expires_at > now())
  )
);

-- Agregar policy SELECT para student_access_zones para usuarios autenticados
CREATE POLICY "Users can view active access zones"
ON public.student_access_zones FOR SELECT
USING (is_active = true OR public.is_admin(auth.uid()));

-- Agregar policy INSERT para system_state (solo super_admin)
CREATE POLICY "Super admins can insert system state"
ON public.system_state FOR INSERT
WITH CHECK (public.is_super_admin(auth.uid()));
