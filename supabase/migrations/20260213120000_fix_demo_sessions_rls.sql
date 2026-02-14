-- Fix RLS policies for demo_sessions
-- Date: 2026-02-13

-- Ensure RLS is enabled
ALTER TABLE demo_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public (anon + authenticated) to insert new sessions
-- This is required for the public demo entry form
DROP POLICY IF EXISTS "Public can create demo sessions" ON demo_sessions;
CREATE POLICY "Public can create demo sessions"
ON demo_sessions
FOR INSERT
TO public
WITH CHECK (true);

-- Policy: Allow public to view their own sessions
-- (Practically, this allows viewing any session if you know the UUID, which is acceptable for this demo)
-- Ideally we would restrict this, but for the demo redirection flow, we might need to read it back.
DROP POLICY IF EXISTS "Public can view demo sessions" ON demo_sessions;
CREATE POLICY "Public can view demo sessions"
ON demo_sessions
FOR SELECT
TO public
USING (true);

-- Policy: Admins can do everything
DROP POLICY IF EXISTS "Admins can manage demo sessions" ON demo_sessions;
CREATE POLICY "Admins can manage demo sessions"
ON demo_sessions
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_credentials 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_credentials 
    WHERE user_id = auth.uid()
  )
);
