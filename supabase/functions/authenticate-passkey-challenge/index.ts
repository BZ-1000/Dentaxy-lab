// Edge Function: authenticate-passkey-challenge
// Genera un challenge para autenticación con Passkey existente

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { generateAuthenticationOptions } from 'https://esm.sh/@simplewebauthn/server@8'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Get all active passkeys (we don't know which user yet)
        // In production, you might want to scope this better
        const { data: passkeys } = await supabaseAdmin
            .from('user_passkeys')
            .select('credential_id, transports')
            .eq('is_active', true)

        const allowCredentials = passkeys?.map(pk => ({
            id: pk.credential_id,
            type: 'public-key' as const,
            transports: pk.transports || ['internal', 'usb', 'nfc', 'ble'] as AuthenticatorTransport[],
        })) || []

        // Generate authentication options
        const options = generateAuthenticationOptions({
            rpID: new URL(Deno.env.get('SUPABASE_URL') ?? '').hostname,
            allowCredentials,
            userVerification: 'preferred',
        })

        // Store challenge temporarily (no user_id yet since we don't know who's authenticating)
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString()
        const { data: challengeData, error: challengeError } = await supabaseAdmin
            .from('biometric_challenges')
            .insert({
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
        console.error('Error in authenticate-passkey-challenge:', error)
        return new Response(
            JSON.stringify({ error: error.message || 'Internal server error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
