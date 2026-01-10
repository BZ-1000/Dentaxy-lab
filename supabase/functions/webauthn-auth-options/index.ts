import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateChallenge(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get user's credentials
    const { data: credentials, error: credError } = await serviceClient
      .from('webauthn_credentials')
      .select('credential_id, transports')
      .eq('user_id', userId);

    if (credError || !credentials || credentials.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No passkeys registered for this user' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const challenge = generateChallenge();

    // Store challenge temporarily
    await serviceClient
      .from('system_state')
      .upsert({
        key: `webauthn_auth_challenge_${userId}`,
        value: { challenge, created_at: new Date().toISOString() },
        updated_by: userId,
      });

    const authOptions = {
      challenge,
      timeout: 60000,
      rpId: new URL(Deno.env.get('SUPABASE_URL')!).hostname.replace('tlgofrhdhfklmjioearg.supabase.co', 'lovable.dev'),
      allowCredentials: credentials.map(cred => ({
        id: cred.credential_id,
        type: 'public-key',
        transports: cred.transports || ['internal', 'hybrid'],
      })),
      userVerification: 'required',
    };

    return new Response(
      JSON.stringify(authOptions),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating auth options:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
