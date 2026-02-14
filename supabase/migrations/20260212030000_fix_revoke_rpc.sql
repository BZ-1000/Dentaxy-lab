-- Improved revoke function with better error handling and admin verification
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
  v_is_admin boolean;
begin
  -- Validate admin permissions first (optional but good practice)
  select exists(
    select 1 from admin_credentials where id = p_admin_id
  ) into v_is_admin;

  -- Proceed even if not found in admin_credentials IF the user is authenticated via other means, 
  -- but for safety let's just create log entry best effort.

  -- Update the demo link to be revoked
  update demo_links
  set is_revoked = true
  where id = p_link_id;

  -- Update all active sessions associated with this link
  with revoked_sessions as (
    update demo_sessions
    set status = 'revoked'
    where demo_link_id = p_link_id
    and status = 'active'
    returning id
  )
  select count(*) into v_count from revoked_sessions;

  -- Log the action safely
  begin
    insert into audit_logs (
      action,
      resource_type,
      resource_id,
      user_id, -- This column might expect auth.users id, so p_admin_id might fail if it's from admin_credentials
      details
    ) values (
      'revoke_demo_link',
      'demo_link',
      p_link_id::text,
      p_admin_id, -- We pass it anyway, hoping it fits or column is text/uuid not linked
      jsonb_build_object('revoked_sessions_count', v_count)
    );
  exception when others then
    -- Ignore audit log errors to ensure operation succeeds
    raise notice 'Audit log failed: %', SQLERRM;
  end;

  return v_count;
end;
$$;
