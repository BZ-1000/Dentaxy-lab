-- Function to revoke a demo link and all its active sessions
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

  -- Log the action
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
    p_admin_id,
    jsonb_build_object('revoked_sessions_count', v_count)
  );

  return v_count;
end;
$$;

-- Function to expire a specific demo session
create or replace function expire_demo_session(
  p_session_id uuid,
  p_admin_id uuid
)
returns void
language plpgsql
security definer
as $$
begin
  update demo_sessions
  set status = 'expired',
      expires_at = now()
  where id = p_session_id;

  insert into audit_logs (
    action,
    resource_type,
    resource_id,
    user_id
  ) values (
    'expire_demo_session',
    'demo_session',
    p_session_id::text,
    p_admin_id
  );
end;
$$;

-- Function to revoke a specific demo session
create or replace function revoke_demo_session(
  p_session_id uuid,
  p_admin_id uuid
)
returns void
language plpgsql
security definer
as $$
begin
  update demo_sessions
  set status = 'revoked'
  where id = p_session_id;

  insert into audit_logs (
    action,
    resource_type,
    resource_id,
    user_id
  ) values (
    'revoke_demo_session',
    'demo_session',
    p_session_id::text,
    p_admin_id
  );
end;
$$;
