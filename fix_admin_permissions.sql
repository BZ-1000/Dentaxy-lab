-- ========================================
-- FIX ADMIN PERMISSIONS
-- ========================================

-- Ensure the user exists and has the correct role (if applicable)
-- Note: User creation is handled by Auth, this just ensures policies are correct.

DO $$
BEGIN
    -- Check if user exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '982e88ff-cde9-4597-8f30-4d0831a7dfd1') THEN
        RAISE NOTICE 'User 982e88ff-cde9-4597-8f30-4d0831a7dfd1 does not exist in auth.users.';
    ELSE
        RAISE NOTICE 'User 982e88ff-cde9-4597-8f30-4d0831a7dfd1 found.';
    END IF;
END $$;

-- Policy Update for Admin Access (if not using the DENTAXY_AUTH_SCHEMA directly)
-- This is a manual override to ensure access

-- Grant access to user_passkeys
CREATE POLICY "Admins can view all passkeys (Fix)"
    ON public.user_passkeys FOR SELECT
    USING (
        auth.uid() = '982e88ff-cde9-4597-8f30-4d0831a7dfd1'
    );

-- Grant access to audit logs
CREATE POLICY "Admins can view audit log (Fix)"
    ON public.auth_audit_log FOR SELECT
    USING (
        auth.uid() = '982e88ff-cde9-4597-8f30-4d0831a7dfd1'
    );
