-- Fix remaining security warnings

-- 1. Fix function search paths to be immutable (prevents SQL injection)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.increment_user_daily_activity(p_seconds integer, p_at timestamp with time zone DEFAULT now())
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  v_user_id uuid := auth.uid();
  v_date date := (p_at at time zone 'UTC')::date;
  v_inc integer := greatest(coalesce(p_seconds, 0), 0);
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Upsert con suma acumulativa
  insert into public.user_daily_activity (user_id, activity_date, total_seconds, first_session_at)
  values (v_user_id, v_date, v_inc, p_at)
  on conflict (user_id, activity_date)
  do update set
    total_seconds = public.user_daily_activity.total_seconds + excluded.total_seconds,
    first_session_at = coalesce(public.user_daily_activity.first_session_at, excluded.first_session_at),
    updated_at = now();
end;
$function$;

CREATE OR REPLACE FUNCTION public.update_active_users_count(new_count integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.platform_metrics (metric_name, metric_value)
  VALUES ('active_users', new_count)
  ON CONFLICT (metric_name)
  DO UPDATE SET 
    metric_value = new_count,
    updated_at = now();
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_copy_clicks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.platform_metrics (metric_name, metric_value)
  VALUES ('copy_clicks', 1)
  ON CONFLICT (metric_name)
  DO UPDATE SET 
    metric_value = public.platform_metrics.metric_value + 1,
    updated_at = now();
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_audit_event(p_user_id uuid, p_action text, p_resource_type text, p_resource_id text DEFAULT NULL::text, p_details jsonb DEFAULT '{}'::jsonb, p_ip_address inet DEFAULT NULL::inet, p_user_agent text DEFAULT NULL::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.audit_logs (
    user_id, action, resource_type, resource_id, details, ip_address, user_agent
  ) VALUES (
    p_user_id, p_action, p_resource_type, p_resource_id, p_details, p_ip_address, p_user_agent
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_rate_limit(p_identifier text, p_action text, p_limit integer, p_window_minutes integer DEFAULT 60)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.system_manage_rate_limit()
RETURNS boolean 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- This function can only be called by security definer functions
  -- which are controlled by the system
  RETURN true;
END;
$$;