/**
 * WebAuthn Client Library for Dentaxy
 * Maneja registro y autenticación de Passkeys usando la API nativa del navegador
 * Sin dependencias externas - 100% API Web nativa
 */

import { supabase } from '@/integrations/supabase/client';

// ============================================================================
// Tipos
// ============================================================================

export interface PasskeyInfo {
    id: string;
    credential_id: string;
    device_name: string;
    created_at: string;
    last_used_at: string | null;
    is_active: boolean;
}

// ============================================================================
// Utilidades de conversión Base64URL <-> ArrayBuffer
// ============================================================================

function arrayBufferToBase64url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let str = '';
    for (const byte of bytes) {
        str += String.fromCharCode(byte);
    }
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64urlToArrayBuffer(base64url: string): ArrayBuffer {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

function generateChallenge(): ArrayBuffer {
    return crypto.getRandomValues(new Uint8Array(32)).buffer;
}

// ============================================================================
// Soporte del navegador
// ============================================================================

/**
 * Verifica si el navegador soporta WebAuthn
 */
export function isWebAuthnSupported(): boolean {
    return !!(
        window.PublicKeyCredential &&
        navigator.credentials &&
        navigator.credentials.create
    );
}

/**
 * Verifica si el navegador soporta autenticación condicional (UI nativa)
 */
export async function isConditionalMediationAvailable(): Promise<boolean> {
    if (!window.PublicKeyCredential || !PublicKeyCredential.isConditionalMediationAvailable) {
        return false;
    }
    return await PublicKeyCredential.isConditionalMediationAvailable();
}

// ============================================================================
// Registro de Passkeys
// ============================================================================

/**
 * Registra un nuevo Passkey para el usuario actual
 * En modo bypass: usa API nativa directa + localStorage
 * En modo producción: usa Edge Functions de Supabase
 * @param deviceName Nombre del dispositivo (ej: "MacBook Pro")
 */
export async function registerPasskey(deviceName: string = 'Mi Dispositivo'): Promise<{
    success: boolean;
    error?: string;
}> {
    try {
        // Verificar si estamos en modo bypass (desarrollo)
        const bypassActive = localStorage.getItem('admin_bypass') === 'true';
        if (bypassActive) {
            console.log('🔐 [BYPASS MODE] Registrando passkey localmente...');
            return await registerPasskeyBypass(deviceName);
        }

        // 1. Verificar que hay un usuario autenticado
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return { success: false, error: 'Usuario no autenticado' };
        }

        // 2. Solicitar challenge al servidor (Edge Function)
        const { data: challengeData, error: challengeError } = await supabase.functions.invoke(
            'register-passkey-challenge',
            {
                body: { userId: user.id, deviceName }
            }
        );

        if (challengeError || !challengeData) {
            console.error('Error al obtener challenge:', challengeError);
            console.warn('⚠️ Edge Functions no disponibles. Activando modo bypass local...');

            // Auto-activar bypass mode si las Edge Functions no están disponibles
            localStorage.setItem('admin_bypass', 'true');
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (currentUser) {
                localStorage.setItem('admin_bypass_uid', currentUser.id);
            }

            // Reintentar con bypass
            return await registerPasskeyBypass(deviceName);
        }

        // 3. Crear credencial usando el challenge del servidor
        const publicKeyOptions: PublicKeyCredentialCreationOptions = {
            challenge: base64urlToArrayBuffer(challengeData.options.challenge),
            rp: {
                name: challengeData.options.rp.name,
                id: window.location.hostname,
            },
            user: {
                id: new TextEncoder().encode(challengeData.options.user.id),
                name: challengeData.options.user.name,
                displayName: challengeData.options.user.displayName,
            },
            pubKeyCredParams: challengeData.options.pubKeyCredParams,
            timeout: 60000,
            attestation: 'none',
            authenticatorSelection: {
                authenticatorAttachment: 'platform',
                userVerification: 'required',
                residentKey: 'preferred',
            },
        };

        console.log('🔐 Solicitando creación de Passkey...');
        const credential = await navigator.credentials.create({
            publicKey: publicKeyOptions,
        }) as PublicKeyCredential;

        if (!credential) {
            return { success: false, error: 'No se pudo crear la credencial' };
        }

        const response = credential.response as AuthenticatorAttestationResponse;

        // 4. Enviar credencial al servidor para verificación
        const credentialData = {
            id: credential.id,
            rawId: arrayBufferToBase64url(credential.rawId),
            type: credential.type,
            response: {
                clientDataJSON: arrayBufferToBase64url(response.clientDataJSON),
                attestationObject: arrayBufferToBase64url(response.attestationObject),
                transports: response.getTransports?.() || [],
            },
        };

        const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
            'register-passkey-verify',
            {
                body: {
                    userId: user.id,
                    credential: credentialData,
                    deviceName,
                    challengeId: challengeData.challengeId
                }
            }
        );

        if (verifyError || !verifyData?.success) {
            console.error('Error al verificar credencial:', verifyError);
            return { success: false, error: 'Error al registrar Passkey' };
        }

        console.log('✅ Passkey registrado exitosamente en servidor');
        return { success: true };

    } catch (error: any) {
        console.error('Error en registerPasskey:', error);
        return { success: false, error: getFriendlyErrorMessage(error) };
    }
}

/**
 * Registra un passkey en modo bypass (desarrollo) sin Edge Functions
 * Usa la API nativa del navegador directamente
 */
async function registerPasskeyBypass(deviceName: string = 'Mi Dispositivo'): Promise<{ success: boolean; error?: string }> {
    try {
        const bypassUid = localStorage.getItem('admin_bypass_uid');
        if (!bypassUid) {
            return { success: false, error: 'No hay UID de bypass configurado' };
        }

        // Generar opciones de registro usando API nativa
        const publicKeyOptions: PublicKeyCredentialCreationOptions = {
            rp: { name: 'Dentaxy', id: window.location.hostname },
            user: {
                id: new TextEncoder().encode(bypassUid),
                name: 'admin@dentaxy.com',
                displayName: 'Admin'
            },
            challenge: generateChallenge(),
            pubKeyCredParams: [
                { type: 'public-key', alg: -7 },   // ES256
                { type: 'public-key', alg: -257 }   // RS256
            ],
            timeout: 60000,
            attestation: 'none',
            authenticatorSelection: {
                authenticatorAttachment: 'platform',
                userVerification: 'required',
                residentKey: 'preferred'
            }
        };

        console.log('🔐 [BYPASS] Solicitando creación de credencial biométrica...');
        const credential = await navigator.credentials.create({
            publicKey: publicKeyOptions,
        }) as PublicKeyCredential;

        if (!credential) {
            return { success: false, error: 'No se pudo crear la credencial' };
        }

        // Guardar en localStorage (simulando BD)
        const passkeys = JSON.parse(localStorage.getItem('bypass_passkeys') || '[]');
        const newPasskey = {
            id: credential.id,
            rawId: arrayBufferToBase64url(credential.rawId),
            deviceName: deviceName,
            createdAt: new Date().toISOString(),
            userId: bypassUid
        };

        passkeys.push(newPasskey);
        localStorage.setItem('bypass_passkeys', JSON.stringify(passkeys));
        markAsCurrentDevice(credential.id);

        console.log('✅ [BYPASS] Passkey registrado localmente:', credential.id);
        return { success: true };

    } catch (error: any) {
        console.error('Error en registerPasskeyBypass:', error);
        if (error.name === 'NotAllowedError') {
            return { success: false, error: 'Operación cancelada por el usuario' };
        }
        return { success: false, error: error.message || 'Error al registrar' };
    }
}

// ============================================================================
// Autenticación con Passkeys
// ============================================================================

/**
 * Autentica al usuario usando un Passkey existente
 * Soporta modo bypass (desarrollo) que usa passkeys almacenadas en localStorage
 * @returns Session data if successful
 */
export async function authenticateWithPasskey(): Promise<{
    success: boolean;
    session?: any;
    error?: string;
}> {
    try {
        // Verificar si estamos en modo bypass o si hay passkeys locales
        const bypassActive = localStorage.getItem('admin_bypass') === 'true';
        const localPasskeys = JSON.parse(localStorage.getItem('bypass_passkeys') || '[]');

        if (bypassActive || localPasskeys.length > 0) {
            console.log('🔐 [BYPASS MODE] Autenticando con passkey local...');
            return await authenticateWithPasskeyBypass();
        }

        // --- Flujo normal con Edge Functions ---
        // 1. Solicitar challenge de autenticación
        const { data: challengeData, error: challengeError } = await supabase.functions.invoke(
            'authenticate-passkey-challenge',
            { body: {} }
        );

        if (challengeError || !challengeData) {
            console.error('Error al obtener challenge de auth:', challengeError);
            console.warn('⚠️ Edge Functions no disponibles. Intentando modo bypass...');

            if (localPasskeys.length > 0) {
                return await authenticateWithPasskeyBypass();
            }

            return { success: false, error: 'No hay passkeys registradas. Registra un dispositivo primero desde el panel admin.' };
        }

        // 2. Solicitar autenticación biométrica con API nativa
        const publicKeyOptions: PublicKeyCredentialRequestOptions = {
            challenge: base64urlToArrayBuffer(challengeData.options.challenge),
            rpId: window.location.hostname,
            timeout: 60000,
            userVerification: 'required',
            allowCredentials: challengeData.options.allowCredentials?.map((cred: any) => ({
                id: base64urlToArrayBuffer(cred.id),
                type: cred.type,
                transports: cred.transports,
            })),
        };

        console.log('🔓 Solicitando autenticación biométrica...');
        const credential = await navigator.credentials.get({
            publicKey: publicKeyOptions,
        }) as PublicKeyCredential;

        if (!credential) {
            return { success: false, error: 'No se pudo obtener la credencial' };
        }

        const response = credential.response as AuthenticatorAssertionResponse;

        // 3. Enviar credencial al servidor
        const credentialData = {
            id: credential.id,
            rawId: arrayBufferToBase64url(credential.rawId),
            type: credential.type,
            response: {
                clientDataJSON: arrayBufferToBase64url(response.clientDataJSON),
                authenticatorData: arrayBufferToBase64url(response.authenticatorData),
                signature: arrayBufferToBase64url(response.signature),
                userHandle: response.userHandle ? arrayBufferToBase64url(response.userHandle) : null,
            },
        };

        const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
            'authenticate-passkey-verify',
            {
                body: {
                    credential: credentialData,
                    challengeId: challengeData.challengeId
                }
            }
        );

        if (verifyError || !verifyData?.success) {
            console.error('Error al verificar autenticación:', verifyError);
            return { success: false, error: 'Autenticación fallida' };
        }

        // 4. Refrescar sesión
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
            return { success: false, error: 'Error al obtener sesión' };
        }

        console.log('✅ Autenticación biométrica exitosa');
        return { success: true, session };

    } catch (error: any) {
        console.error('Error en authenticateWithPasskey:', error);
        return { success: false, error: getFriendlyErrorMessage(error) };
    }
}

/**
 * Autentica usando passkeys almacenadas localmente (modo bypass/desarrollo)
 * Solicita al navegador la verificación biométrica REAL del dispositivo
 * y valida que la credencial coincida con una passkey registrada localmente
 */
async function authenticateWithPasskeyBypass(): Promise<{
    success: boolean;
    session?: any;
    error?: string;
}> {
    try {
        const localPasskeys = JSON.parse(localStorage.getItem('bypass_passkeys') || '[]');

        if (localPasskeys.length === 0) {
            return {
                success: false,
                error: 'No hay passkeys registradas. Ve a Configuración > Seguridad para registrar un dispositivo.'
            };
        }

        // Construir las credenciales permitidas desde localStorage
        const allowCredentials: PublicKeyCredentialDescriptor[] = localPasskeys.map((pk: any) => ({
            id: base64urlToArrayBuffer(pk.rawId || pk.id),
            type: 'public-key' as const,
            transports: ['internal' as AuthenticatorTransport],
        }));

        // Crear opciones de autenticación con la API nativa
        const publicKeyOptions: PublicKeyCredentialRequestOptions = {
            challenge: generateChallenge(),
            rpId: window.location.hostname,
            allowCredentials,
            timeout: 60000,
            userVerification: 'required',
        };

        console.log('🔓 [BYPASS] Solicitando autenticación biométrica del dispositivo...');
        const credential = await navigator.credentials.get({
            publicKey: publicKeyOptions,
        }) as PublicKeyCredential;

        if (!credential) {
            return { success: false, error: 'No se pudo obtener la credencial' };
        }

        // Verificar que la credencial corresponde a una passkey registrada
        const matchedPasskey = localPasskeys.find((pk: any) => pk.id === credential.id);

        if (!matchedPasskey) {
            return {
                success: false,
                error: 'La credencial no coincide con ningún dispositivo registrado.'
            };
        }

        // Actualizar último uso
        matchedPasskey.lastUsedAt = new Date().toISOString();
        localStorage.setItem('bypass_passkeys', JSON.stringify(localPasskeys));
        markAsCurrentDevice(credential.id);

        // Activar bypass session
        localStorage.setItem('admin_bypass', 'true');
        const bypassUid = matchedPasskey.userId || localStorage.getItem('admin_bypass_uid') || 'bypass-user';
        localStorage.setItem('admin_bypass_uid', bypassUid);

        console.log('✅ [BYPASS] Autenticación biométrica exitosa');

        // Retornar sesión simulada para el modo bypass
        return {
            success: true,
            session: {
                user: {
                    id: bypassUid,
                    email: 'admin@dentaxy.com',
                },
                bypass: true,
            }
        };

    } catch (error: any) {
        console.error('Error en authenticateWithPasskeyBypass:', error);

        if (error.name === 'NotAllowedError') {
            return { success: false, error: 'Autenticación cancelada por el usuario.' };
        }

        return { success: false, error: getFriendlyErrorMessage(error) };
    }
}

// ============================================================================
// Gestión de Passkeys
// ============================================================================

/**
 * Obtiene la lista de Passkeys del usuario actual
 */
export async function listUserPasskeys(): Promise<PasskeyInfo[]> {
    try {
        // Verificar si estamos en modo bypass
        const bypassActive = localStorage.getItem('admin_bypass') === 'true';
        if (bypassActive) {
            console.log('🔐 [BYPASS MODE] Listando passkeys desde localStorage...');
            const passkeys = JSON.parse(localStorage.getItem('bypass_passkeys') || '[]');
            return passkeys.map((pk: any) => ({
                id: pk.id,
                credential_id: pk.id,
                device_name: pk.deviceName || 'Dispositivo Local',
                created_at: pk.createdAt,
                last_used_at: pk.lastUsedAt || null,
                is_active: true
            }));
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('user_passkeys')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error al listar passkeys:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error en listUserPasskeys:', error);
        return [];
    }
}

/**
 * Elimina (desactiva) un Passkey específico
 */
export async function deletePasskey(passkeyId: string): Promise<{
    success: boolean;
    error?: string;
}> {
    try {
        // Verificar si estamos en modo bypass
        const bypassActive = localStorage.getItem('admin_bypass') === 'true';
        if (bypassActive) {
            console.log('🔐 [BYPASS MODE] Eliminando passkey desde localStorage...');
            const passkeys = JSON.parse(localStorage.getItem('bypass_passkeys') || '[]');
            const filtered = passkeys.filter((pk: any) => pk.id !== passkeyId);
            localStorage.setItem('bypass_passkeys', JSON.stringify(filtered));
            return { success: true };
        }

        const { error } = await supabase
            .from('user_passkeys')
            .update({ is_active: false })
            .eq('id', passkeyId);

        if (error) {
            console.error('Error al eliminar passkey:', error);
            return { success: false, error: 'Error al eliminar Passkey' };
        }

        return { success: true };
    } catch (error: any) {
        console.error('Error en deletePasskey:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Renombra un Passkey existente
 */
export async function updatePasskeyName(
    passkeyId: string,
    newName: string
): Promise<{ success: boolean; error?: string }> {
    try {
        if (!newName.trim()) {
            return { success: false, error: 'El nombre no puede estar vacío' };
        }

        // Modo bypass
        const bypassActive = localStorage.getItem('admin_bypass') === 'true';
        if (bypassActive) {
            const passkeys = JSON.parse(localStorage.getItem('bypass_passkeys') || '[]');
            const pk = passkeys.find((p: any) => p.id === passkeyId);
            if (pk) {
                pk.deviceName = newName.trim();
                localStorage.setItem('bypass_passkeys', JSON.stringify(passkeys));
            }
            return { success: true };
        }

        const { error } = await supabase
            .from('user_passkeys')
            .update({ device_name: newName.trim() })
            .eq('id', passkeyId);

        if (error) {
            console.error('Error al renombrar passkey:', error);
            return { success: false, error: 'Error al actualizar nombre' };
        }

        return { success: true };
    } catch (error: any) {
        console.error('Error en updatePasskeyName:', error);
        return { success: false, error: error.message };
    }
}

// ============================================================================
// Políticas Biométricas y Reautenticación
// ============================================================================

/**
 * Verifica si una acción requiere reautenticación biométrica
 */
export async function checkBiometricPolicy(actionName: string): Promise<{
    requiresBiometric: boolean;
    requiresReauth: boolean;
    reauthTimeoutSeconds: number;
}> {
    try {
        const { data, error } = await supabase
            .from('biometric_policies')
            .select('*')
            .eq('action_name', actionName)
            .single();

        if (error || !data) {
            return {
                requiresBiometric: false,
                requiresReauth: false,
                reauthTimeoutSeconds: 0
            };
        }

        return {
            requiresBiometric: data.requires_biometric,
            requiresReauth: data.requires_reauth,
            reauthTimeoutSeconds: data.reauth_timeout_seconds
        };
    } catch (error) {
        console.error('Error al verificar política:', error);
        return {
            requiresBiometric: false,
            requiresReauth: false,
            reauthTimeoutSeconds: 0
        };
    }
}

/**
 * Reautentica al usuario usando biometría (step-up authentication)
 * Soporta modo bypass local
 */
export async function reauthenticateWithPasskey(actionName: string): Promise<{
    success: boolean;
    reauthToken?: string;
    error?: string;
}> {
    try {
        // Modo bypass: usar autenticación local
        const bypassActive = localStorage.getItem('admin_bypass') === 'true';
        const localPasskeys = JSON.parse(localStorage.getItem('bypass_passkeys') || '[]');

        if (bypassActive || localPasskeys.length > 0) {
            console.log('🔐 [BYPASS] Reautenticación biométrica para:', actionName);
            const result = await authenticateWithPasskeyBypass();
            if (result.success) {
                return {
                    success: true,
                    reauthToken: `bypass_reauth_${Date.now()}`
                };
            }
            return { success: false, error: result.error };
        }

        // Verificar que hay sesión activa
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'Usuario no autenticado' };
        }

        // Solicitar challenge de reautenticación
        const { data: challengeData, error: challengeError } = await supabase.functions.invoke(
            'reauthenticate-passkey',
            { body: { actionName } }
        );

        if (challengeError || !challengeData) {
            console.error('Error al obtener challenge de reauth:', challengeError);
            return { success: false, error: 'Error al iniciar reautenticación' };
        }

        // Solicitar autenticación biométrica con API nativa
        const publicKeyOptions: PublicKeyCredentialRequestOptions = {
            challenge: base64urlToArrayBuffer(challengeData.options.challenge),
            rpId: window.location.hostname,
            timeout: 60000,
            userVerification: 'required',
            allowCredentials: challengeData.options.allowCredentials?.map((cred: any) => ({
                id: base64urlToArrayBuffer(cred.id),
                type: cred.type,
                transports: cred.transports,
            })),
        };

        console.log('🔐 Solicitando reautenticación para:', actionName);
        const credential = await navigator.credentials.get({
            publicKey: publicKeyOptions,
        }) as PublicKeyCredential;

        if (!credential) {
            return { success: false, error: 'No se pudo obtener la credencial' };
        }

        const response = credential.response as AuthenticatorAssertionResponse;

        // Verificar credencial
        const credentialData = {
            id: credential.id,
            rawId: arrayBufferToBase64url(credential.rawId),
            type: credential.type,
            response: {
                clientDataJSON: arrayBufferToBase64url(response.clientDataJSON),
                authenticatorData: arrayBufferToBase64url(response.authenticatorData),
                signature: arrayBufferToBase64url(response.signature),
                userHandle: response.userHandle ? arrayBufferToBase64url(response.userHandle) : null,
            },
        };

        const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
            'reauthenticate-passkey',
            {
                body: {
                    actionName,
                    credential: credentialData,
                    challengeId: challengeData.challengeId,
                    verify: true
                }
            }
        );

        if (verifyError || !verifyData?.success) {
            console.error('Error al verificar reautenticación:', verifyError);
            return { success: false, error: 'Reautenticación fallida' };
        }

        console.log('✅ Reautenticación exitosa para:', actionName);
        return {
            success: true,
            reauthToken: verifyData.reauthToken
        };

    } catch (error: any) {
        console.error('Error en reauthenticateWithPasskey:', error);
        return { success: false, error: getFriendlyErrorMessage(error) };
    }
}

/**
 * Wrapper de alto nivel: verifica política y ejecuta reauth si es necesario
 */
export async function verifyBiometricPolicy<T>(
    actionName: string,
    callback: () => Promise<T>
): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
        const policy = await checkBiometricPolicy(actionName);

        if (!policy.requiresBiometric) {
            const data = await callback();
            return { success: true, data };
        }

        if (policy.requiresReauth) {
            const lastReauth = localStorage.getItem(`reauth_${actionName}`);
            const now = Date.now();

            if (lastReauth) {
                const elapsed = now - parseInt(lastReauth);
                const timeoutMs = policy.reauthTimeoutSeconds * 1000;

                if (elapsed < timeoutMs) {
                    console.log('✓ Reauth reciente válida, ejecutando acción');
                    const data = await callback();
                    return { success: true, data };
                }
            }
        }

        const reauthResult = await reauthenticateWithPasskey(actionName);
        if (!reauthResult.success) {
            return { success: false, error: reauthResult.error };
        }

        localStorage.setItem(`reauth_${actionName}`, Date.now().toString());

        const data = await callback();
        return { success: true, data };

    } catch (error: any) {
        console.error('Error en verifyBiometricPolicy:', error);
        return { success: false, error: error.message };
    }
}

// ============================================================================
// Utilidades de Dispositivo
// ============================================================================

/**
 * Traduce errores técnicos de WebAuthn a mensajes amigables
 */
export function getFriendlyErrorMessage(error: any): string {
    if (!error) return 'Error desconocido';

    if (error.name === 'NotAllowedError') {
        return 'Operación cancelada por el usuario o tiempo de espera agotado.';
    }
    if (error.name === 'InvalidStateError') {
        return 'Este dispositivo ya está registrado para este usuario.';
    }
    if (error.name === 'SecurityError') {
        return 'Error de seguridad. Verifica que el origen sea seguro (HTTPS).';
    }
    if (error.name === 'NotSupportedError') {
        return 'Tu dispositivo no soporta esta función de seguridad.';
    }
    if (error.message?.includes('timed out')) {
        return 'Se agotó el tiempo de espera. Inténtalo de nuevo.';
    }

    return error.message || 'Ocurrió un error inesperado al procesar la solicitud.';
}

/**
 * Obtiene ID semi-único del dispositivo actual basado en User Agent
 */
export function getCurrentDeviceId(): string {
    const ua = navigator.userAgent;
    const platform = navigator.platform;
    const deviceSignature = `${platform}|${ua.substring(0, 100)}`;

    let hash = 0;
    for (let i = 0; i < deviceSignature.length; i++) {
        const char = deviceSignature.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    return `device_${Math.abs(hash).toString(16)}`;
}

/**
 * Verifica si un passkey corresponde al dispositivo actual
 */
export async function isCurrentDevice(passkeyId: string): Promise<boolean> {
    try {
        const currentDeviceId = getCurrentDeviceId();
        const stored = localStorage.getItem(`passkey_device_${passkeyId}`);
        return stored === currentDeviceId;
    } catch (error) {
        console.error('Error en isCurrentDevice:', error);
        return false;
    }
}

/**
 * Marca un passkey como asociado al dispositivo actual
 */
export function markAsCurrentDevice(passkeyId: string): void {
    const deviceId = getCurrentDeviceId();
    localStorage.setItem(`passkey_device_${passkeyId}`, deviceId);
}
