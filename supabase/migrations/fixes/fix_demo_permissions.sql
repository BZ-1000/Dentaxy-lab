
-- Fix RLS and permissions for Demo System

-- 1. Ensure anon has usage on schema (usually standard but good to verify)
GRANT USAGE ON SCHEMA public TO anon;

-- 2. demo_links permissions
GRANT SELECT ON public.demo_links TO anon;

-- Drop verify policy if it exists to replace it with a robust one
DROP POLICY IF EXISTS "Public verify tokens" ON public.demo_links;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.demo_links;

-- Create policy allowing anyone to read demo_links (logic is handled by app checking token)
-- We need this because we select by token.
CREATE POLICY "Public verify tokens" 
ON public.demo_links 
FOR SELECT 
TO public 
USING (true);

-- 3. demo_sessions permissions
GRANT INSERT ON public.demo_sessions TO anon;

-- Drop insert policy
DROP POLICY IF EXISTS "Public create sessions" ON public.demo_sessions;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.demo_sessions;

-- Create policy allowing anyone to insert sessions
CREATE POLICY "Public create sessions" 
ON public.demo_sessions 
FOR INSERT 
TO public 
WITH CHECK (true);

-- 4. Also Ensure demo_links update (increment uses) is allowed?
-- ModulesHub.tsx lines 312-315: .update({ current_uses: linkData.current_uses + 1 })
-- This runs as anon! 
-- We need UPDATE permission for anon on demo_links?
-- Or better, we should use an RPC for "consume_token" to avoid giving UPDATE permission on the table to public.
-- Giving UPDATE permission on demo_links to public is dangerous if not restricted.

-- Check if we have UPDATE policy
-- ModulesHub.tsx DOES update the table directly.
-- IF we don't have UPDATE policy, line 312 will FAIL.
-- Check if the token was fetched but update failed? 
-- If update fails, the validation might have succeeded but then usage count didn't increase?
-- Or if the update call is awaited and fails, it throws error.

-- Let's check ModulesHub.tsx:
-- 311:       // Increment usage count (RPC is safer but direct update for now)
-- 312:       await supabase
-- 313:         .from('demo_links')
-- 314:         .update({ current_uses: linkData.current_uses + 1 })
-- 315:         .eq('id', linkData.id);

-- If this update fails due to RLS, it might throw error (although update usually returns count, it might not throw if RLS filters it out, but if no policy allows UPDATE, it returns 0 rows updated).
-- Wait, if it returns 0 rows updated, it doesn't throw.
-- But if RLS DENIES it, it fails silently (returns data: []).
-- The code doesn't check for error on update strictly?
-- 317:       toast.success("Acceso autorizado. Iniciando demo...");
-- So if update fails, it still logs in?
-- BUT user says "token invalido". This error comes from EARLIER in the process.

-- Conclusion: The immediate error is SELECT.
-- But we ALSO need to fix UPDATE for the future.
-- Ideally we switch to RPC for incrementing.

-- Implementation:
-- I will add an UPDATE policy for now, restricted to incrementing usage?
-- It's hard to restrict column updates via RLS purely.
-- Safer to use RPC. I should create an RPC `increment_demo_uses`.
-- And Update ModulesHub.tsx to use it.

-- For now, let's fix the SELECT issue which is the blocker.
-- And I will Create the RPC `increment_demo_use` and switch ModulesHub to use it, 
-- because granting UPDATE to anon on `demo_links` is a security risk (they could change `expires_at` etc).

CREATE OR REPLACE FUNCTION public.increment_demo_uses(p_token TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.demo_links
  SET current_uses = current_uses + 1
  WHERE token = p_token;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_demo_uses(TEXT) TO anon;
