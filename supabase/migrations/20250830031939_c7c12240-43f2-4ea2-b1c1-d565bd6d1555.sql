-- Fix infinite recursion in audit_logs RLS policy
-- Create security definer function to get user role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path TO 'public'
AS $$
  SELECT COALESCE(username, 'user')
  FROM public.user_profiles
  WHERE id = auth.uid();
$$;

-- Drop problematic audit_logs policy and recreate with security definer function
DROP POLICY IF EXISTS "Admin users can view audit logs" ON public.audit_logs;

CREATE POLICY "Admin users can view audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (public.get_current_user_role() = 'admin');

-- Fix overly permissive platform_metrics policies
DROP POLICY IF EXISTS "Everyone can view platform metrics" ON public.platform_metrics;
DROP POLICY IF EXISTS "Only authenticated users can view platform metrics" ON public.platform_metrics;

-- Create more restrictive policy for platform_metrics
CREATE POLICY "Authenticated users can view platform metrics"
ON public.platform_metrics
FOR SELECT
TO authenticated
USING (true);

-- Ensure system functions can still manage metrics
CREATE POLICY "System can manage platform metrics"
ON public.platform_metrics
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Add missing RLS policies for tables that need them
-- Fix rate_limits table - should only be accessible to system
DROP POLICY IF EXISTS "System can manage rate limits" ON public.rate_limits;

CREATE POLICY "System can manage rate limits"
ON public.rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Block user access to rate_limits
CREATE POLICY "Block user access to rate limits"
ON public.rate_limits
FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);

-- Improve secrets table security (already locked down but ensure it's bulletproof)
DROP POLICY IF EXISTS "System secrets are not accessible to users" ON public.secrets;

CREATE POLICY "Block all user access to secrets"
ON public.secrets
FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Only service role can access secrets"
ON public.secrets
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Add audit logging trigger for sensitive operations
CREATE OR REPLACE FUNCTION public.audit_sensitive_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log changes to user_profiles, subscribers, user_plans
  IF TG_TABLE_NAME IN ('user_profiles', 'subscribers', 'user_plans') THEN
    INSERT INTO public.audit_logs (
      user_id,
      action,
      resource_type,
      resource_id,
      details
    ) VALUES (
      auth.uid(),
      TG_OP,
      TG_TABLE_NAME,
      COALESCE(NEW.id::text, OLD.id::text),
      jsonb_build_object(
        'old_values', to_jsonb(OLD),
        'new_values', to_jsonb(NEW)
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Add audit triggers to sensitive tables
DROP TRIGGER IF EXISTS audit_user_profiles_trigger ON public.user_profiles;
CREATE TRIGGER audit_user_profiles_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_changes();

DROP TRIGGER IF EXISTS audit_subscribers_trigger ON public.subscribers;
CREATE TRIGGER audit_subscribers_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.subscribers
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_changes();