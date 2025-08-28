-- Phase 1: Lock down sensitive tables and risky policies

-- 1) Remove public read access to secrets table
DROP POLICY IF EXISTS "Allow all users to read secrets" ON public.secrets;

-- 2) Prevent client-side privilege escalation on subscribers
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.subscribers;
-- Keep SELECT policy as-is to allow owners to read their own subscription

-- 3) Prevent client-side writes to usage_limits (edge functions should handle updates)
DROP POLICY IF EXISTS "Users can insert their own usage limits" ON public.usage_limits;
DROP POLICY IF EXISTS "Users can update their own usage limits" ON public.usage_limits;
-- Keep SELECT policy as-is so the user can see their limits

-- 4) Remove public analytics exposure (if not intended): ai_button_usage
DROP POLICY IF EXISTS "Everyone can view AI button usage for feed" ON public.ai_button_usage;
-- Keep owner INSERT/SELECT policies
