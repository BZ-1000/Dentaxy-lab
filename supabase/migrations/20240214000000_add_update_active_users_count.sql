-- Create a function to update the active users metric
-- This avoids the 404 error when the frontend tries to call this RPC
CREATE OR REPLACE FUNCTION update_active_users_count(new_count integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert or update the metric for 'active_users'
  INSERT INTO platform_metrics (metric_name, metric_value, updated_at)
  VALUES ('active_users', new_count, now())
  ON CONFLICT (metric_name)
  DO UPDATE SET
    metric_value = EXCLUDED.metric_value,
    updated_at = now();
END;
$$;

-- Grant execute permission to authenticated users properly
GRANT EXECUTE ON FUNCTION update_active_users_count(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION update_active_users_count(integer) TO anon;
GRANT EXECUTE ON FUNCTION update_active_users_count(integer) TO service_role;
