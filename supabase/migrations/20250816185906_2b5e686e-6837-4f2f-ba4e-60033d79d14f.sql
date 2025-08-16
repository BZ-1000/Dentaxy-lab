-- Fix #1: Tighten RLS policies on platform_metrics table
DROP POLICY IF EXISTS "System can update platform metrics" ON public.platform_metrics;

-- Create more restrictive policies
CREATE POLICY "Only authenticated users can view platform metrics"
ON public.platform_metrics
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "System functions can update platform metrics"
ON public.platform_metrics
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "System functions can update existing platform metrics"
ON public.platform_metrics
FOR UPDATE
TO service_role
USING (true);

-- Fix #2: Create audit log table for security monitoring
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only allow system to insert audit logs
CREATE POLICY "System can insert audit logs"
ON public.audit_logs
FOR INSERT
TO service_role
WITH CHECK (true);

-- Users can only view their own audit logs
CREATE POLICY "Users can view their own audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Fix #3: Create rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL, -- user_id, ip_address, etc.
  action text NOT NULL,
  count integer DEFAULT 0,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(identifier, action)
);

-- Enable RLS on rate limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only system can manage rate limits
CREATE POLICY "System can manage rate limits"
ON public.rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Fix #4: Create function to log audit events
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_user_id uuid,
  p_action text,
  p_resource_type text,
  p_resource_id text DEFAULT NULL,
  p_details jsonb DEFAULT '{}'::jsonb,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id, action, resource_type, resource_id, details, ip_address, user_agent
  ) VALUES (
    p_user_id, p_action, p_resource_type, p_resource_id, p_details, p_ip_address, p_user_agent
  );
END;
$$;

-- Fix #5: Create rate limiting function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier text,
  p_action text,
  p_limit integer,
  p_window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_count integer;
  window_start timestamp with time zone;
BEGIN
  window_start := now() - (p_window_minutes || ' minutes')::interval;
  
  -- Clean up old entries
  DELETE FROM public.rate_limits 
  WHERE window_start < (now() - (p_window_minutes || ' minutes')::interval);
  
  -- Get current count for this identifier/action
  SELECT count, window_start INTO current_count, window_start
  FROM public.rate_limits
  WHERE identifier = p_identifier AND action = p_action;
  
  IF current_count IS NULL THEN
    -- First request in window
    INSERT INTO public.rate_limits (identifier, action, count, window_start)
    VALUES (p_identifier, p_action, 1, now())
    ON CONFLICT (identifier, action)
    DO UPDATE SET count = 1, window_start = now();
    RETURN true;
  ELSIF current_count >= p_limit THEN
    -- Rate limit exceeded
    RETURN false;
  ELSE
    -- Increment counter
    UPDATE public.rate_limits
    SET count = count + 1
    WHERE identifier = p_identifier AND action = p_action;
    RETURN true;
  END IF;
END;
$$;