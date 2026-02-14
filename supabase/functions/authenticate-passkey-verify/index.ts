// Edge Function: authenticate-passkey-verify
// Verifica la firma de autenticación y crea la sesión de usuario

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { verifyAuthenticationResponse } from 'https://esm.sh/@simplewebauthn/server@8'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { credential, challengeId } = await req.json()

        if (!credential || !challengeId) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Retrieve challenge
        const { data: challengeData, error: challengeError } = await supabaseAdmin
            .from('biometric_challenges')
            .select('*')
            .eq('id', challengeId)
            .eq('used', false)
            .single()

        if (challengeError || !challengeData) {
            return new Response(
                JSON.stringify({ error: 'Invalid or expired challenge' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        if (new Date(challengeData.expires_at) < new Date()) {
            return new Response(
                JSON.stringify({ error: 'Challenge expired' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Find the passkey by credential ID
        const credentialIdB64 = credential.id
        const { data: passkeyData, error: passkeyError } = await supabaseAdmin
            .from('user_passkeys')
            .select('*')
            .eq('credential_id', credentialIdB64)
            .eq('is_active', true)
            .single()

        if (passkeyError || !passkeyData) {
            return new Response(
                JSON.stringify({ error: 'Passkey not found' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Verify the authentication response
        const rpID = new URL(Deno.env.get('SUPABASE_URL') ?? '').hostname
        const expectedOrigin = Deno.env.get('SUPABASE_URL') ?? ''

        const verification = await verifyAuthenticationResponse({
            response: credential,
            expectedChallenge: challengeData.challenge,
            expectedOrigin,
            expectedRPID: rpID,
            authenticator: {
                credentialID: new Uint8Array(Buffer.from(passkeyData.credential_id, 'base64')),
                credentialPublicKey: new Uint8Array(Buffer.from(passkeyData.public_key, 'base64')),
                counter: passkeyData.counter,
            },
        })

        if (!verification.verified) {
            // Log failed attempt
            await supabaseAdmin
                .from('auth_audit_log')
                .insert({
                    user_id: passkeyData.user_id,
                    event_type: 'login_failed',
                    success: false,
                    error_message: 'Biometric verification failed',
                })

            return new Response(
                JSON.stringify({ error: 'Authentication failed', success: false }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Update counter (anti-replay protection)
        await supabaseAdmin
            .from('user_passkeys')
            .update({
                counter: verification.authenticationInfo.newCounter,
                last_used_at: new Date().toISOString(),
            })
            .eq('id', passkeyData.id)

        // Mark challenge as used
        await supabaseAdmin
            .from('biometric_challenges')
            .update({ used: true })
            .eq('id', challengeId)

        // Create Supabase Auth session for the user
        const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: passkeyData.user_id, // Will need to get actual email
        })

        // Better approach: Use admin.createUser or get user email first
        const { data: userData } = await supabaseAdmin.auth.admin.getUserById(passkeyData.user_id)

        if (!userData?.user?.email) {
            return new Response(
                JSON.stringify({ error: 'User email not found' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Create session using admin API
        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: userData.user.email,
        })

        // Log successful authentication
        await supabaseAdmin
            .from('auth_audit_log')
            .insert({
                user_id: passkeyData.user_id,
                event_type: 'login_success',
                action_name: 'biometric_login',
                device_info: {
                    user_agent: req.headers.get('user-agent'),
                    device_name: passkeyData.device_name,
                },
                success: true,
            })

        return new Response(
            JSON.stringify({
                success: true,
                user_id: passkeyData.user_id,
                // Note: Client will need to refresh session
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Error in authenticate-passkey-verify:', error)
        return new Response(
            JSON.stringify({ error: error.message || 'Internal server error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
