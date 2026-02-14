-- Migration: Add user info tracking to demo system
-- Date: 2026-02-11

-- Add requires_user_info to demo_links (controls if demo asks for user data)
ALTER TABLE demo_links 
ADD COLUMN IF NOT EXISTS requires_user_info BOOLEAN DEFAULT true;

-- Add comment
COMMENT ON COLUMN demo_links.requires_user_info IS 'If false, demo does not require token or user information for access (open season mode)';

-- Add user tracking columns to demo_sessions
ALTER TABLE demo_sessions 
ADD COLUMN IF NOT EXISTS user_name TEXT,
ADD COLUMN IF NOT EXISTS user_location TEXT,
ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Add comments
COMMENT ON COLUMN demo_sessions.user_name IS 'Name provided by demo user (optional)';
COMMENT ON COLUMN demo_sessions.user_location IS 'Location/city provided by demo user (optional)';
COMMENT ON COLUMN demo_sessions.user_email IS 'Email for receiving Dentaxy updates (optional, requires consent)';
