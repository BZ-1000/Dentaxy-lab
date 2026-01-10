import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminPasskeyCredential {
  id: string;
  device_name: string | null;
  created_at: string | null;
  last_used_at: string | null;
}

export function useAdminPasskey(adminId: string | null) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [credentials, setCredentials] = useState<AdminPasskeyCredential[]>([]);

  const isSupported = () => {
    return window.PublicKeyCredential !== undefined;
  };

  const fetchCredentials = useCallback(async () => {
    if (!adminId) return;

    const { data } = await supabase
      .from('webauthn_credentials')
      .select('id, device_name, created_at, last_used_at')
      .eq('user_id', adminId);

    if (data) {
      setCredentials(data);
    }
  }, [adminId]);

  const registerPasskey = useCallback(async (deviceName?: string) => {
    if (!isSupported()) {
      toast.error('WebAuthn no está soportado en este navegador');
      return false;
    }

    if (!adminId) {
      toast.error('No hay sesión de admin activa');
      return false;
    }

    setIsRegistering(true);

    try {
      // Generate challenge locally for admin (no supabase auth required)
      const challenge = crypto.getRandomValues(new Uint8Array(32));
      const challengeBase64 = btoa(String.fromCharCode(...challenge))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

      const publicKeyOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: 'Dentaxy Admin',
          id: window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode(adminId),
          name: 'Admin',
          displayName: deviceName || 'Administrador',
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' },   // ES256
          { alg: -257, type: 'public-key' }, // RS256
        ],
        timeout: 60000,
        attestation: 'none' as AttestationConveyancePreference,
        authenticatorSelection: {
          authenticatorAttachment: 'platform' as AuthenticatorAttachment,
          userVerification: 'required' as UserVerificationRequirement,
          residentKey: 'preferred' as ResidentKeyRequirement,
        },
      };

      // Create credential
      const credential = await navigator.credentials.create({
        publicKey: publicKeyOptions,
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('No se pudo crear la credencial');
      }

      const response = credential.response as AuthenticatorAttestationResponse;

      // Convert to base64url
      const arrayBufferToBase64url = (buffer: ArrayBuffer) => {
        const bytes = new Uint8Array(buffer);
        let str = '';
        for (const byte of bytes) {
          str += String.fromCharCode(byte);
        }
        return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
      };

      // Extract public key from attestation object (simplified for demo)
      const publicKeyBase64 = arrayBufferToBase64url(response.getPublicKey?.() || response.attestationObject);

      // Store credential in database
      const { error } = await supabase
        .from('webauthn_credentials')
        .insert({
          user_id: adminId,
          credential_id: credential.id,
          public_key: publicKeyBase64,
          device_name: deviceName || navigator.userAgent.substring(0, 50),
          transports: response.getTransports?.() || [],
          counter: 0,
        });

      if (error) {
        throw new Error('Error al guardar la credencial');
      }

      toast.success('Passkey registrada exitosamente');
      await fetchCredentials();
      return true;
    } catch (error) {
      console.error('Error registering passkey:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          toast.error('Registro cancelado por el usuario');
        } else if (error.name === 'InvalidStateError') {
          toast.error('Esta passkey ya está registrada');
        } else {
          toast.error(error.message || 'Error al registrar passkey');
        }
      }
      return false;
    } finally {
      setIsRegistering(false);
    }
  }, [adminId, fetchCredentials]);

  const authenticateWithPasskey = useCallback(async () => {
    if (!isSupported()) {
      toast.error('WebAuthn no está soportado en este navegador');
      return false;
    }

    if (!adminId) {
      toast.error('No hay admin ID');
      return false;
    }

    setIsAuthenticating(true);

    try {
      // Get stored credentials for this admin
      const { data: storedCreds } = await supabase
        .from('webauthn_credentials')
        .select('credential_id, transports')
        .eq('user_id', adminId);

      if (!storedCreds || storedCreds.length === 0) {
        toast.error('No hay passkeys registradas');
        return false;
      }

      const challenge = crypto.getRandomValues(new Uint8Array(32));

      const publicKeyOptions: PublicKeyCredentialRequestOptions = {
        challenge,
        timeout: 60000,
        rpId: window.location.hostname,
        allowCredentials: storedCreds.map((cred) => ({
          id: Uint8Array.from(atob(cred.credential_id.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)),
          type: 'public-key' as const,
          transports: cred.transports as AuthenticatorTransport[],
        })),
        userVerification: 'required' as UserVerificationRequirement,
      };

      const credential = await navigator.credentials.get({
        publicKey: publicKeyOptions,
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('No se pudo obtener la credencial');
      }

      // Update last used
      await supabase
        .from('webauthn_credentials')
        .update({ last_used_at: new Date().toISOString() })
        .eq('credential_id', credential.id);

      toast.success('Autenticación biométrica exitosa');
      return true;
    } catch (error) {
      console.error('Error authenticating with passkey:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          toast.error('Autenticación cancelada');
        } else {
          toast.error(error.message || 'Error de autenticación');
        }
      }
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  }, [adminId]);

  const deleteCredential = useCallback(async (credentialId: string) => {
    const { error } = await supabase
      .from('webauthn_credentials')
      .delete()
      .eq('id', credentialId);

    if (error) {
      toast.error('Error al eliminar passkey');
      return false;
    }

    toast.success('Passkey eliminada');
    await fetchCredentials();
    return true;
  }, [fetchCredentials]);

  return {
    isSupported: isSupported(),
    isRegistering,
    isAuthenticating,
    credentials,
    fetchCredentials,
    registerPasskey,
    authenticateWithPasskey,
    deleteCredential,
  };
}
