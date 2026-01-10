import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WebAuthnCredential {
  id: string;
  device_name: string | null;
  created_at: string | null;
  last_used_at: string | null;
}

export function useWebAuthn() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [credentials, setCredentials] = useState<WebAuthnCredential[]>([]);

  const isSupported = () => {
    return window.PublicKeyCredential !== undefined;
  };

  const fetchCredentials = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('webauthn_credentials')
      .select('id, device_name, created_at, last_used_at')
      .eq('user_id', user.id);

    if (data) {
      setCredentials(data);
    }
  }, []);

  const registerPasskey = useCallback(async (deviceName?: string) => {
    if (!isSupported()) {
      toast.error('WebAuthn no está soportado en este navegador');
      return false;
    }

    setIsRegistering(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Debes iniciar sesión primero');
        return false;
      }

      // Get registration options from server
      const optionsResponse = await supabase.functions.invoke('webauthn-register-options', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (optionsResponse.error) {
        throw new Error(optionsResponse.error.message || 'Error al obtener opciones de registro');
      }

      const options = optionsResponse.data;

      // Convert base64url to ArrayBuffer for WebAuthn API
      const challenge = Uint8Array.from(atob(options.challenge.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
      const userId = new TextEncoder().encode(options.user.id);

      const publicKeyOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: options.rp.name,
          id: window.location.hostname,
        },
        user: {
          id: userId,
          name: options.user.name,
          displayName: options.user.displayName,
        },
        pubKeyCredParams: options.pubKeyCredParams,
        timeout: options.timeout,
        attestation: options.attestation as AttestationConveyancePreference,
        authenticatorSelection: {
          authenticatorAttachment: 'platform' as AuthenticatorAttachment,
          userVerification: 'required' as UserVerificationRequirement,
          residentKey: 'preferred' as ResidentKeyRequirement,
        },
        excludeCredentials: options.excludeCredentials?.map((cred: { id: string; type: string }) => ({
          id: Uint8Array.from(atob(cred.id.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)),
          type: cred.type,
        })),
      };

      // Create credential
      const credential = await navigator.credentials.create({
        publicKey: publicKeyOptions,
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('No se pudo crear la credencial');
      }

      const response = credential.response as AuthenticatorAttestationResponse;

      // Convert ArrayBuffer to base64url
      const arrayBufferToBase64url = (buffer: ArrayBuffer) => {
        const bytes = new Uint8Array(buffer);
        let str = '';
        for (const byte of bytes) {
          str += String.fromCharCode(byte);
        }
        return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
      };

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

      // Verify with server
      const verifyResponse = await supabase.functions.invoke('webauthn-register-verify', {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { credential: credentialData, deviceName: deviceName || navigator.userAgent.substring(0, 50) },
      });

      if (verifyResponse.error) {
        throw new Error(verifyResponse.error.message || 'Error al verificar registro');
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
  }, [fetchCredentials]);

  const authenticateWithPasskey = useCallback(async (userId: string) => {
    if (!isSupported()) {
      toast.error('WebAuthn no está soportado en este navegador');
      return false;
    }

    setIsAuthenticating(true);

    try {
      // Get authentication options from server
      const optionsResponse = await supabase.functions.invoke('webauthn-auth-options', {
        body: { userId },
      });

      if (optionsResponse.error) {
        throw new Error(optionsResponse.error.message || 'Error al obtener opciones de autenticación');
      }

      const options = optionsResponse.data;

      // Convert for WebAuthn API
      const challenge = Uint8Array.from(atob(options.challenge.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));

      const publicKeyOptions: PublicKeyCredentialRequestOptions = {
        challenge,
        timeout: options.timeout,
        rpId: window.location.hostname,
        allowCredentials: options.allowCredentials?.map((cred: { id: string; type: string; transports?: string[] }) => ({
          id: Uint8Array.from(atob(cred.id.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)),
          type: cred.type,
          transports: cred.transports as AuthenticatorTransport[],
        })),
        userVerification: 'required' as UserVerificationRequirement,
      };

      // Get credential
      const credential = await navigator.credentials.get({
        publicKey: publicKeyOptions,
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('No se pudo obtener la credencial');
      }

      const response = credential.response as AuthenticatorAssertionResponse;

      const arrayBufferToBase64url = (buffer: ArrayBuffer) => {
        const bytes = new Uint8Array(buffer);
        let str = '';
        for (const byte of bytes) {
          str += String.fromCharCode(byte);
        }
        return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
      };

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

      // Verify with server
      const verifyResponse = await supabase.functions.invoke('webauthn-auth-verify', {
        body: { userId, credential: credentialData },
      });

      if (verifyResponse.error) {
        throw new Error(verifyResponse.error.message || 'Error al verificar autenticación');
      }

      toast.success('Autenticación biométrica exitosa');
      return verifyResponse.data;
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
  }, []);

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
