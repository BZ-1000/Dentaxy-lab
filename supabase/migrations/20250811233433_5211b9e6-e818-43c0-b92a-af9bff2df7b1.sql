-- Update RLS policies to allow function execution for anonymous users
DROP POLICY IF EXISTS "System can update platform metrics" ON public.platform_metrics;

CREATE POLICY "System can update platform metrics" 
ON public.platform_metrics 
FOR ALL
USING (true)
WITH CHECK (true);

-- Ensure functions are accessible to all users (authenticated and anonymous)
GRANT EXECUTE ON FUNCTION public.update_active_users_count(integer) TO public;
GRANT EXECUTE ON FUNCTION public.increment_copy_clicks() TO public;

-- Grant usage on the platform_metrics table to anonymous users through functions
GRANT SELECT ON public.platform_metrics TO anon;
GRANT INSERT, UPDATE ON public.platform_metrics TO anon;