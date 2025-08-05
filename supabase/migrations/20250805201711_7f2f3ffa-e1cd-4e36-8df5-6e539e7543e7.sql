-- Create subscribers table for managing Stripe subscriptions
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  plan_type TEXT, -- 'express', 'professional', 'pro_monthly', 'student_semester'
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create usage_limits table for tracking plan usage
CREATE TABLE public.usage_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL,
  period_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  period_end TIMESTAMPTZ NOT NULL,
  histories_generated INTEGER NOT NULL DEFAULT 0,
  ai_generations_used INTEGER NOT NULL DEFAULT 0,
  max_histories INTEGER NOT NULL DEFAULT 999999, -- unlimited by default
  max_ai_generations INTEGER NOT NULL DEFAULT 999999, -- unlimited by default
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_limits ENABLE ROW LEVEL SECURITY;

-- Create policies for subscribers table
CREATE POLICY "Users can view their own subscription" 
ON public.subscribers 
FOR SELECT 
USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Users can update their own subscription" 
ON public.subscribers 
FOR UPDATE 
USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Users can insert their own subscription" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (user_id = auth.uid() OR email = auth.email());

-- Create policies for usage_limits table
CREATE POLICY "Users can view their own usage limits" 
ON public.usage_limits 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own usage limits" 
ON public.usage_limits 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own usage limits" 
ON public.usage_limits 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_subscribers_updated_at
BEFORE UPDATE ON public.subscribers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_usage_limits_updated_at
BEFORE UPDATE ON public.usage_limits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();