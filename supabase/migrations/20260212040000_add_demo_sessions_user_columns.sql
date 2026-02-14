-- Add missing columns to demo_sessions table for user data collection
-- This migration ensures the table structure matches the frontend expectations

-- Add full_name column (replaces/supplements user_name)
ALTER TABLE demo_sessions
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Add location column as JSONB to store GPS coordinates and address
ALTER TABLE demo_sessions
ADD COLUMN IF NOT EXISTS location JSONB;

-- Add status column if it doesn't exist (for revocation tracking)
ALTER TABLE demo_sessions
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Create index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_demo_sessions_status ON demo_sessions(status);

-- Create index on demo_link_id for faster joins
CREATE INDEX IF NOT EXISTS idx_demo_sessions_demo_link_id ON demo_sessions(demo_link_id);

-- Add comment to explain location structure
COMMENT ON COLUMN demo_sessions.location IS 'JSONB containing GPS data: {lat, lng, city, state, country, full_address, source}';
COMMENT ON COLUMN demo_sessions.full_name IS 'Full name of the demo user (required if demo link has requires_user_info enabled)';
