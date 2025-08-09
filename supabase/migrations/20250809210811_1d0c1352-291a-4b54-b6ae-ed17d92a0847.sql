-- Fix search_path for security functions
CREATE OR REPLACE FUNCTION public.increment_copy_clicks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.platform_metrics (metric_name, metric_value)
  VALUES ('copy_clicks', 1)
  ON CONFLICT (metric_name)
  DO UPDATE SET 
    metric_value = public.platform_metrics.metric_value + 1,
    updated_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION public.update_active_users_count(new_count INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.platform_metrics (metric_name, metric_value)
  VALUES ('active_users', new_count)
  ON CONFLICT (metric_name)
  DO UPDATE SET 
    metric_value = new_count,
    updated_at = now();
END;
$$;