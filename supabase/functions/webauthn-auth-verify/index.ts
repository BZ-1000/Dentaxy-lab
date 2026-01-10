import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, credential } = await req.json();

    if (!userId || !credential) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Verify challenge
    const { data: challengeData } = await serviceClient
      .from('system_state')
      .select('value')
      .eq('key', `webauthn_auth_challenge_${userId}`)
      .single();

    if (!challengeData) {
      return new Response(
        JSON.stringify({ error: 'Challenge expired or not found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const storedChallenge = (challengeData.value as { challenge: string; created_at: string });
    const challengeAge = Date.now() - new Date(storedChallenge.created_at).getTime();
    
    if (challengeAge > 5 * 60 * 1000) {
      await serviceClient
        .from('system_state')
        .delete()
        .eq('key', `webauthn_auth_challenge_${userId}`);
      
      return new Response(
        JSON.stringify({ error: 'Challenge expired' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify credential exists for user
    const { data: storedCredential, error: credError } = await serviceClient
      .from('webauthn_credentials')
      .select('*')
      .eq('user_id', userId)
      .eq('credential_id', credential.id)
      .single();

    if (credError || !storedCredential) {
      return new Response(
        JSON.stringify({ error: 'Invalid credential' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update counter and last used
    await serviceClient
      .from('webauthn_credentials')
      .update({
        counter: (storedCredential.counter || 0) + 1,
        last_used_at: new Date().toISOString(),
      })
      .eq('id', storedCredential.id);

    // Clean up challenge
    await serviceClient
      .from('system_state')
      .delete()
      .eq('key', `webauthn_auth_challenge_${userId}`);

    // Create admin session
    const deviceFingerprint = credential.id.substring(0, 64);
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours

    await serviceClient
      .from('admin_sessions')
      .insert({
        user_id: userId,
        device_fingerprint: deviceFingerprint,
        expires_at: expiresAt.toISOString(),
        is_active: true,
      });

    // Log audit event
    await serviceClient.rpc('log_audit_event', {
      p_user_id: userId,
      p_action: 'WEBAUTHN_AUTH_SUCCESS',
      p_resource_type: 'admin_session',
      p_details: { device_name: storedCredential.device_name },
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        sessionExpires: expiresAt.toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error verifying authentication:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
