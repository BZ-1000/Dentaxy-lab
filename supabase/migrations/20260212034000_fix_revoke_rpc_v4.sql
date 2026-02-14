create or replace function revoke_all_sessions_for_link(
  p_link_id uuid,
  p_admin_id uuid
)
returns integer
language plpgsql
security definer
as $$
declare
  v_count integer;
begin
  -- Simple, direct update without dependencies
  -- 1. Mark link as revoked
  update demo_links
  set is_revoked = true
  where id = p_link_id;

  -- 2. Revoke associated active sessions
  with revoked_sessions as (
    update demo_sessions
    set status = 'revoked'
    where demo_link_id = p_link_id
    and status = 'active'
    returning id
  )
  select count(*) into v_count from revoked_sessions;

  -- 3. Optional: Try to log, but do not fail if it fails
  begin
    insert into audit_logs (
      action,
      resource_type,
      resource_id,
      user_id,
      details
    ) 
    select 
      'revoke_demo_link', 
      'demo_link',
      p_link_id::text,
      user_id, -- Attempt to find admin user id
      jsonb_build_object('pk_admin_id', p_admin_id, 'revoked_count', v_count)
    from admin_credentials 
    where id = p_admin_id;
  exception when others then
    -- Ignore logging errors completely
    null;
  end;

  return v_count;
end;
$$;
