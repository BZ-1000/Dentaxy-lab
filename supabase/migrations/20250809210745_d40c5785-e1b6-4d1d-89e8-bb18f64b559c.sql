-- Create donations table to track donations in real-time
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_name TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 2000, -- Amount in cents (20 MXN = 2000 cents)
  message TEXT DEFAULT NULL,
  session_id TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for donations
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing donations (public for live feed)
CREATE POLICY "Everyone can view donations" 
ON public.donations 
FOR SELECT 
USING (true);

-- Insert copy_clicks metric if it doesn't exist
INSERT INTO public.platform_metrics (metric_name, metric_value)
VALUES ('copy_clicks', 0)
ON CONFLICT (metric_name) DO NOTHING;

-- Create function to increment copy clicks
CREATE OR REPLACE FUNCTION public.increment_copy_clicks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create function to update active users count
CREATE OR REPLACE FUNCTION public.update_active_users_count(new_count INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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