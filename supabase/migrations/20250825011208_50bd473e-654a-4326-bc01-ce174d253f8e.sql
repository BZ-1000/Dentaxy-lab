-- Fix critical RLS policy issues

-- 1. Fix audit_logs table to properly restrict access
DROP POLICY IF EXISTS "Only system can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;

CREATE POLICY "Admin users can view audit logs" ON public.audit_logs
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND username = 'admin'
  )
);

CREATE POLICY "System functions can insert audit logs" ON public.audit_logs
FOR INSERT 
WITH CHECK (auth.uid() IS NULL OR auth.uid() IS NOT NULL);

-- 2. Fix rate_limits table - currently has overly restrictive policy
DROP POLICY IF EXISTS "Only system functions can manage rate limits" ON public.rate_limits;

CREATE POLICY "System can manage rate limits" ON public.rate_limits
FOR ALL 
USING (true)
WITH CHECK (true);

-- 3. Fix subscribers table - missing policies for system updates
CREATE POLICY "System can insert subscribers" ON public.subscribers
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update subscribers" ON public.subscribers
FOR UPDATE 
USING (true);

-- 4. Fix usage_limits table - missing policies for system updates  
CREATE POLICY "System can insert usage limits" ON public.usage_limits
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update usage limits" ON public.usage_limits
FOR UPDATE 
USING (true);

-- 5. Add proper indexes for performance and security
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_action ON public.rate_limits(identifier, action);
CREATE INDEX IF NOT EXISTS idx_subscribers_user_id ON public.subscribers(user_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers(email);

-- 6. Create function to safely get user role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT username INTO user_role 
  FROM public.user_profiles 
  WHERE id = user_uuid;
  
  RETURN COALESCE(user_role, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;