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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;

    const { credential, deviceName } = await req.json();

    if (!credential || !credential.id || !credential.response) {
      return new Response(
        JSON.stringify({ error: 'Invalid credential data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get and verify challenge
    const { data: challengeData } = await serviceClient
      .from('system_state')
      .select('value')
      .eq('key', `webauthn_challenge_${userId}`)
      .single();

    if (!challengeData) {
      return new Response(
        JSON.stringify({ error: 'Challenge expired or not found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const storedChallenge = (challengeData.value as { challenge: string; created_at: string });
    const challengeAge = Date.now() - new Date(storedChallenge.created_at).getTime();
    
    if (challengeAge > 5 * 60 * 1000) { // 5 minutes
      await serviceClient
        .from('system_state')
        .delete()
        .eq('key', `webauthn_challenge_${userId}`);
      
      return new Response(
        JSON.stringify({ error: 'Challenge expired' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Store the credential
    const { error: insertError } = await serviceClient
      .from('webauthn_credentials')
      .insert({
        user_id: userId,
        credential_id: credential.id,
        public_key: credential.response.publicKey || credential.response.attestationObject,
        counter: 0,
        device_name: deviceName || 'Unknown Device',
        transports: credential.response.transports || [],
      });

    if (insertError) {
      console.error('Error storing credential:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to store credential' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean up challenge
    await serviceClient
      .from('system_state')
      .delete()
      .eq('key', `webauthn_challenge_${userId}`);

    // Log audit event
    await serviceClient.rpc('log_audit_event', {
      p_user_id: userId,
      p_action: 'WEBAUTHN_CREDENTIAL_REGISTERED',
      p_resource_type: 'webauthn',
      p_details: { device_name: deviceName },
    });

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error verifying registration:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
