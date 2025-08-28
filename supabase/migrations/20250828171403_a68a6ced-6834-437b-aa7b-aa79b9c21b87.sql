-- Fix existing database functions to have proper search_path (security requirement)
CREATE OR REPLACE FUNCTION public.system_manage_rate_limit()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- This function can only be called by security definer functions
  -- which are controlled by the system
  RETURN true;
END;
$function$;

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

-- Fix subscribers table RLS policies to be more secure
-- First drop existing policies that are too permissive
DROP POLICY IF EXISTS "System can insert subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "System can update subscribers" ON public.subscribers;

-- Create secure policies for subscribers table
-- Only allow service role (edge functions) to manage subscription data
CREATE POLICY "Service role can manage all subscriber operations"
ON public.subscribers
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Block all anonymous access to prevent data leaks
CREATE POLICY "Block anonymous access to subscribers"
ON public.subscribers
FOR ALL
TO anon
USING (false)
WITH CHECK (false);