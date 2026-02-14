// Edge Function: register-passkey-verify
// Verifica la respuesta del navegador y almacena la credencial pública

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { verifyRegistrationResponse } from 'https://esm.sh/@simplewebauthn/server@8'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { userId, credential, deviceName, challengeId } = await req.json()

        if (!userId || !credential || !challengeId) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Retrieve and validate challenge
        const { data: challengeData, error: challengeError } = await supabaseAdmin
            .from('biometric_challenges')
            .select('*')
            .eq('id', challengeId)
            .eq('user_id', userId)
            .eq('used', false)
            .single()

        if (challengeError || !challengeData) {
            return new Response(
                JSON.stringify({ error: 'Invalid or expired challenge' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Check if challenge expired
        if (new Date(challengeData.expires_at) < new Date()) {
            return new Response(
                JSON.stringify({ error: 'Challenge expired' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Verify the registration response
        const origin = req.headers.get('origin') || ''
        let rpID = new URL(Deno.env.get('SUPABASE_URL') ?? '').hostname
        let expectedOrigin = Deno.env.get('SUPABASE_URL') ?? ''

        // Allow localhost for development
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
            rpID = 'localhost'
            expectedOrigin = origin // Validar contra el origen real (ej: http://localhost:8080)
        } else if (origin.includes('dentaxy.com')) {
            rpID = 'dentaxy.com'
            expectedOrigin = 'https://dentaxy.com' // O la URL real de producción
            // También podría ser la URL del request origin si confiamos en ella
            if (origin === 'https://dentaxy.com' || origin === 'https://www.dentaxy.com') {
                expectedOrigin = origin;
            }
        }

        console.log(`[Verify] Expected Origin: ${expectedOrigin}, RP ID: ${rpID}`)

        const verification = await verifyRegistrationResponse({
            response: credential,
            expectedChallenge: challengeData.challenge,
            expectedOrigin,
            expectedRPID: rpID,
        })

        if (!verification.verified || !verification.registrationInfo) {
            return new Response(
                JSON.stringify({ error: 'Verification failed', success: false }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const { credentialPublicKey, credentialID, counter } = verification.registrationInfo

        // Store the passkey in database
        const { error: insertError } = await supabaseAdmin
            .from('user_passkeys')
            .insert({
                user_id: userId,
                credential_id: Buffer.from(credentialID).toString('base64'),
                public_key: Buffer.from(credentialPublicKey).toString('base64'),
                counter,
                device_name: deviceName || 'Unknown Device',
                transports: credential.response.transports || [],
            })

        if (insertError) {
            console.error('Error storing passkey:', insertError)
            return new Response(
                JSON.stringify({ error: 'Failed to store passkey' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Mark challenge as used
        await supabaseAdmin
            .from('biometric_challenges')
            .update({ used: true })
            .eq('id', challengeId)

        // Log audit event
        await supabaseAdmin
            .from('auth_audit_log')
            .insert({
                user_id: userId,
                event_type: 'passkey_registered',
                device_info: {
                    device_name: deviceName,
                    user_agent: req.headers.get('user-agent'),
                },
                success: true,
            })

        return new Response(
            JSON.stringify({ success: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Error in register-passkey-verify:', error)
        return new Response(
            JSON.stringify({ error: error.message || 'Internal server error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
