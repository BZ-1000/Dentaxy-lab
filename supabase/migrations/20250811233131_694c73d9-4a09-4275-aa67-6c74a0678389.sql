-- Ensure the platform_metrics table exists with proper structure
CREATE TABLE IF NOT EXISTS public.platform_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT UNIQUE NOT NULL,
  metric_value INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create or replace the function to update active users count
CREATE OR REPLACE FUNCTION public.update_active_users_count(new_count INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.platform_metrics (metric_name, metric_value, updated_at)
  VALUES ('active_users', new_count, now())
  ON CONFLICT (metric_name)
  DO UPDATE SET 
    metric_value = EXCLUDED.metric_value,
    updated_at = EXCLUDED.updated_at;
END;
$$;

-- Create or replace the function to increment copy clicks
CREATE OR REPLACE FUNCTION public.increment_copy_clicks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.platform_metrics (metric_name, metric_value, updated_at)
  VALUES ('copy_clicks', 1, now())
  ON CONFLICT (metric_name)
  DO UPDATE SET 
    metric_value = platform_metrics.metric_value + 1,
    updated_at = now();
END;
$$;

-- Enable Row Level Security
ALTER TABLE public.platform_metrics ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read metrics
CREATE POLICY "Everyone can view platform metrics" 
ON public.platform_metrics 
FOR SELECT 
USING (true);

-- Create policy to allow system updates (authenticated users can update via functions)
CREATE POLICY "System can update platform metrics" 
ON public.platform_metrics 
FOR ALL
USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Insert initial metrics if they don't exist
INSERT INTO public.platform_metrics (metric_name, metric_value, updated_at)
VALUES 
  ('active_users', 0, now()),
  ('copy_clicks', 0, now()),
  ('total_users', 0, now()),
  ('ai_generations_count', 0, now())
ON CONFLICT (metric_name) DO NOTHING;

-- Create trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_platform_metrics_updated_at
    BEFORE UPDATE ON public.platform_metrics
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();