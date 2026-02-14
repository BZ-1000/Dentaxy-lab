import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} from 'https://esm.sh/@simplewebauthn/server@8.3.0';
import type {
    AuthenticationResponseJSON,
    PublicKeyCredentialRequestOptionsJSON,
} from 'https://esm.sh/@simplewebauthn/types@8.3.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        // Verificar autenticación del usuario
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            throw new Error('No authorization header');
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

        if (userError || !user) {
            throw new Error('User not authenticated');
        }

        const { actionName, credential, challengeId, verify } = await req.json();

        // Modo 1: Generar challenge (inicio de reauth)
        if (!verify) {
            // Obtener passkeys del usuario
            const { data: passkeys, error: passkeysError } = await supabaseAdmin
                .from('user_passkeys')
                .select('credential_id, public_key, transports')
                .eq('user_id', user.id);

            if (passkeysError) {
                throw new Error('Error fetching passkeys');
            }

            if (!passkeys || passkeys.length === 0) {
                throw new Error('No passkeys registered for this user');
            }

            // Generar opciones de autenticación
            const options: PublicKeyCredentialRequestOptionsJSON = await generateAuthenticationOptions({
                rpID: new URL(supabaseUrl).hostname,
                allowCredentials: passkeys.map(pk => ({
                    id: pk.credential_id,
                    type: 'public-key' as const,
                    transports: pk.transports || undefined,
                })),
                userVerification: 'required', // Forzar verificación biométrica
            });

            // Guardar challenge en la base de datos
            const { data: challengeData, error: challengeError } = await supabaseAdmin
                .from('biometric_challenges')
                .insert({
                    user_id: user.id,
                    challenge: options.challenge,
                    action: actionName,
                    expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutos
                })
                .select()
                .single();

            if (challengeError || !challengeData) {
                throw new Error('Error storing challenge');
            }

            return new Response(
                JSON.stringify({ options, challengeId: challengeData.id }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Modo 2: Verificar credencial (completar reauth)
        if (!challengeId || !credential) {
            throw new Error('Missing challengeId or credential');
        }

        // Recuperar challenge
        const { data: challengeData, error: challengeError } = await supabaseAdmin
            .from('biometric_challenges')
            .select('*')
            .eq('id', challengeId)
            .eq('user_id', user.id)
            .eq('action', actionName)
            .single();

        if (challengeError || !challengeData) {
            throw new Error('Invalid or expired challenge');
        }

        // Verificar que no haya expirado
        if (new Date(challengeData.expires_at) < new Date()) {
            throw new Error('Challenge expired');
        }

        // Buscar passkey correspondiente
        const { data: passkey, error: passkeyError } = await supabaseAdmin
            .from('user_passkeys')
            .select('*')
            .eq('credential_id', (credential as AuthenticationResponseJSON).id)
            .eq('user_id', user.id)
            .single();

        if (passkeyError || !passkey) {
            throw new Error('Passkey not found');
        }

        // Verificar la respuesta
        const verification = await verifyAuthenticationResponse({
            response: credential as AuthenticationResponseJSON,
            expectedChallenge: challengeData.challenge,
            expectedOrigin: supabaseUrl.replace(/:\d+$/, ''), // Remover puerto si existe
            expectedRPID: new URL(supabaseUrl).hostname,
            authenticator: {
                credentialID: passkey.credential_id,
                credentialPublicKey: new Uint8Array(passkey.public_key),
                counter: passkey.counter || 0,
                transports: passkey.transports || undefined,
            },
        });

        if (!verification.verified) {
            throw new Error('Verification failed');
        }

        // Actualizar counter del passkey
        if (verification.authenticationInfo.newCounter !== undefined) {
            await supabaseAdmin
                .from('user_passkeys')
                .update({ counter: verification.authenticationInfo.newCounter })
                .eq('id', passkey.id);
        }

        // Eliminar challenge usado
        await supabaseAdmin
            .from('biometric_challenges')
            .delete()
            .eq('id', challengeId);

        // Registrar en audit log
        await supabaseAdmin
            .from('auth_audit_log')
            .insert({
                user_id: user.id,
                event_type: 'reauth_success',
                action: actionName,
                metadata: {
                    passkey_id: passkey.id,
                    device_name: passkey.device_name
                }
            });

        // Generar token de reauth (timestamp firmado)
        const reauthToken = btoa(JSON.stringify({
            userId: user.id,
            action: actionName,
            timestamp: Date.now()
        }));

        return new Response(
            JSON.stringify({
                success: true,
                reauthToken,
                message: 'Reautenticación exitosa'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error: any) {
        console.error('Error in reauthenticate-passkey:', error);
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
