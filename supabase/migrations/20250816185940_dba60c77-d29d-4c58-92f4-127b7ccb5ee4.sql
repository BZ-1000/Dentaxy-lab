-- Fix security warnings from linter

-- Fix WARN 2 & 3: Function Search Path Mutable
DROP FUNCTION IF EXISTS public.log_audit_event(uuid, text, text, text, jsonb, inet, text);
DROP FUNCTION IF EXISTS public.check_rate_limit(text, text, integer, integer);

-- Recreate functions with proper search_path
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
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id, action, resource_type, resource_id, details, ip_address, user_agent
  ) VALUES (
    p_user_id, p_action, p_resource_type, p_resource_id, p_details, p_ip_address, p_user_agent
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier text,
  p_action text,
  p_limit integer,
  p_window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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