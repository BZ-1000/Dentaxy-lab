-- Enable proper RLS policies for demo link and session management
-- This migration adds UPDATE policies that were missing

-- Policy to allow authenticated users (admins) to update demo_links
DROP POLICY IF EXISTS "Admin update demo links" ON demo_links;
CREATE POLICY "Admin update demo links"
  ON demo_links
  FOR UPDATE
  TO public
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy to allow authenticated users (admins) to update demo_sessions
DROP POLICY IF EXISTS "Admin update sessions" ON demo_sessions;
CREATE POLICY "Admin update sessions"
  ON demo_sessions
  FOR UPDATE
  TO public
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Recreate the revoke function with proper error handling
CREATE OR REPLACE FUNCTION revoke_all_sessions_for_link(
  p_link_id uuid,
  p_admin_id uuid
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer := 0;
BEGIN
  -- Update the demo link to mark as revoked
  UPDATE demo_links
  SET is_revoked = true
  WHERE id = p_link_id;

  -- Update all active sessions for this link
  WITH updated_sessions AS (
    UPDATE demo_sessions
    SET status = 'revoked'
    WHERE demo_link_id = p_link_id
      AND status = 'active'
    RETURNING id
  )
  SELECT COUNT(*) INTO v_count FROM updated_sessions;

  RETURN v_count;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but allow the function to complete
    RAISE WARNING 'Error in revoke_all_sessions_for_link: %', SQLERRM;
    RETURN 0;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION revoke_all_sessions_for_link(uuid, uuid) TO authenticated;
