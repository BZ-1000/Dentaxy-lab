// Edge Function: register-passkey-challenge
// Genera un challenge único para el registro de un nuevo Passkey

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { generateRegistrationOptions } from 'https://esm.sh/@simplewebauthn/server@8'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { userId, deviceName } = await req.json()

        if (!userId) {
            return new Response(
                JSON.stringify({ error: 'userId is required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Initialize Supabase client with service role
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Get user info
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
        if (userError || !userData) {
            return new Response(
                JSON.stringify({ error: 'User not found' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Get existing passkeys for this user (for excludeCredentials)
        const { data: existingPasskeys } = await supabaseAdmin
            .from('user_passkeys')
            .select('credential_id')
            .eq('user_id', userId)
            .eq('is_active', true)

        const excludeCredentials = existingPasskeys?.map(pk => ({
            id: pk.credential_id,
            type: 'public-key' as const,
            transports: ['internal', 'usb', 'nfc', 'ble'] as AuthenticatorTransport[],
        })) || []

        // Determine RP ID and Origin based on request (support localhost)
        const origin = req.headers.get('origin') || ''
        let rpID = new URL(Deno.env.get('SUPABASE_URL') ?? '').hostname

        // Allow localhost for development
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
            rpID = 'localhost'
        } else if (origin.includes('dentaxy.com')) {
            rpID = 'dentaxy.com' // Adjust for production
        }

        console.log(`[Register] Origin: ${origin}, RP ID: ${rpID}`)

        // Generate registration options
        const options = generateRegistrationOptions({
            rpName: 'Dentaxy Admin',
            rpID,
            userID: userId,
            userName: userData.user.email ?? 'admin',
            userDisplayName: deviceName || 'Dentaxy User',
            attestationType: 'none', // 'direct' if you want attestation
            excludeCredentials,
            authenticatorSelection: {
                residentKey: 'preferred',
                userVerification: 'preferred',
                authenticatorAttachment: 'platform', // Prefer platform authenticators (biometrics)
            },
        })

        // Store challenge in database (expires in 2 minutes)
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString()
        const { data: challengeData, error: challengeError } = await supabaseAdmin
            .from('biometric_challenges')
            .insert({
                user_id: userId,
                challenge: options.challenge,
                expires_at: expiresAt,
            })
            .select('id')
            .single()

        if (challengeError) {
            console.error('Error storing challenge:', challengeError)
            return new Response(
                JSON.stringify({ error: 'Failed to create challenge' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        return new Response(
            JSON.stringify({
                options,
                challengeId: challengeData.id,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Error in register-passkey-challenge:', error)
        return new Response(
            JSON.stringify({ error: error.message || 'Internal server error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
