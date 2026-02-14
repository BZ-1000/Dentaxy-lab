-- Improved revoke function with strict user resolution for audit logs
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
  v_real_user_id uuid;
begin
  -- 1. Try to resolve the real auth user id from admin_credentials
  -- This ensures we satisfy any FK constraints on audit_logs.user_id
  select user_id into v_real_user_id
  from admin_credentials
  where id = p_admin_id;

  -- 2. Update the demo link
  update demo_links
  set is_revoked = true
  where id = p_link_id;

  -- 3. Revoke sessions
  with revoked_sessions as (
    update demo_sessions
    set status = 'revoked'
    where demo_link_id = p_link_id
    and status = 'active'
    returning id
  )
  select count(*) into v_count from revoked_sessions;

  -- 4. Log safely
  begin
    insert into audit_logs (
      action,
      resource_type,
      resource_id,
      user_id,
      details
    ) values (
      'revoke_demo_link',
      'demo_link',
      p_link_id::text,
      v_real_user_id, -- use the resolved ID
      jsonb_build_object(
        'revoked_sessions_count', v_count,
        'admin_credential_id', p_admin_id
      )
    );
  exception when others then
    -- ignore log errors to ensures the main action succeeds
    raise notice 'Audit log failed (revoke_demo_link): %', SQLERRM;
  end;

  return v_count;
end;
$$;
