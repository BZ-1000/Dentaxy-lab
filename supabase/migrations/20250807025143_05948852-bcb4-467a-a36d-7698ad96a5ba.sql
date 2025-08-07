-- Create user activity sessions table
CREATE TABLE public.user_activity_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_end TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI button usage tracking table
CREATE TABLE public.ai_button_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  section_name TEXT NOT NULL,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Create platform metrics table
CREATE TABLE public.platform_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL UNIQUE,
  metric_value INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user ratings table
CREATE TABLE public.user_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create platform updates table
CREATE TABLE public.platform_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  version TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  release_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_activity_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_button_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_updates ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_activity_sessions
CREATE POLICY "Users can view their own activity sessions" 
ON public.user_activity_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity sessions" 
ON public.user_activity_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity sessions" 
ON public.user_activity_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS policies for ai_button_usage
CREATE POLICY "Users can view their own AI button usage" 
ON public.ai_button_usage 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI button usage" 
ON public.ai_button_usage 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Everyone can view AI button usage for feed" 
ON public.ai_button_usage 
FOR SELECT 
USING (true);

-- RLS policies for platform_metrics
CREATE POLICY "Everyone can view platform metrics" 
ON public.platform_metrics 
FOR SELECT 
USING (true);

-- RLS policies for user_ratings
CREATE POLICY "Users can view their own ratings" 
ON public.user_ratings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ratings" 
ON public.user_ratings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" 
ON public.user_ratings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS policies for platform_updates
CREATE POLICY "Everyone can view platform updates" 
ON public.platform_updates 
FOR SELECT 
USING (true);

-- Initialize platform metrics
INSERT INTO public.platform_metrics (metric_name, metric_value) VALUES 
('active_users', 0),
('total_users', 0),
('ai_generations_count', 0);

-- Insert initial platform updates
INSERT INTO public.platform_updates (version, title, description, release_date) VALUES 
('v2.1', 'Dashboard de Productividad', 'Nuevo dashboard con métricas de actividad, ranking de usuarios y feed de actividad de IA en tiempo real.', CURRENT_DATE),
('v2.0', 'Sistema de Tracking', 'Implementación completa del sistema de seguimiento de actividad del usuario y uso de funcionalidades de IA.', CURRENT_DATE - INTERVAL '7 days');

-- Create indexes for better performance
CREATE INDEX idx_user_activity_sessions_user_date ON public.user_activity_sessions(user_id, date);
CREATE INDEX idx_ai_button_usage_date ON public.ai_button_usage(clicked_at DESC);
CREATE INDEX idx_ai_button_usage_user ON public.ai_button_usage(user_id);
CREATE INDEX idx_platform_updates_date ON public.platform_updates(release_date DESC);