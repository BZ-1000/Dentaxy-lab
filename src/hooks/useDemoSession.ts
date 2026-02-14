
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DemoSessionState {
  isValid: boolean;
  sessionToken: string | null;
  moduleAccessed: string | null;
  fullName: string | null;
  expiresAt: Date | null;
  error: string | null;
}

interface ValidateLinkResult {
  success: boolean;
  demo_link_id: string | null;
  error_message: string | null;
  expires_at: string | null;
}

interface CreateSessionResult {
  success: boolean;
  session_token: string | null;
  expires_at: string | null;
  error_message: string | null;
}

interface VerifySessionResult {
  is_valid: boolean;
  module_accessed: string | null;
  full_name: string | null;
  expires_at: string | null;
  error_message: string | null;
}

export function useDemoSession() {
  const [state, setState] = useState<DemoSessionState>({
    isValid: false,
    sessionToken: null,
    moduleAccessed: null,
    fullName: null,
    expiresAt: null,
    error: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const token = sessionStorage.getItem('demo_session_token');
    if (token) {
      // Basic client-side check, robust check would require server call if we stored session tokens
      // For now we trust the session storage if present (and maybe check expiry locally)
      setState(prev => ({ ...prev, isValid: true, sessionToken: token }));
    }
  }, []);

  // Validate a demo link token for a specific module
  const validateLink = useCallback(async (token: string, module: string): Promise<ValidateLinkResult> => {
    setIsLoading(true);
    try {
      console.log('Validating link:', token);

      const { data: linkData, error } = await supabase
        .from('demo_links')
        .select('*')
        .eq('token', token)
        .maybeSingle();

      if (error) {
        console.error('Error fetching link:', error);
        throw new Error('Error al verificar el token');
      }

      if (!linkData) {
        return { success: false, demo_link_id: null, error_message: 'Token inválido o no encontrado', expires_at: null };
      }

      if (linkData.is_revoked) {
        return { success: false, demo_link_id: null, error_message: 'Este token ha sido revocado', expires_at: null };
      }

      if (new Date(linkData.expires_at) < new Date()) {
        return { success: false, demo_link_id: null, error_message: 'Este token ha expirado', expires_at: null };
      }

      if (linkData.current_uses >= linkData.max_uses) {
        return { success: false, demo_link_id: null, error_message: 'Este token ha alcanzado el límite de usos', expires_at: null };
      }

      if (linkData.allowed_modules && linkData.allowed_modules.length > 0) {
        if (!linkData.allowed_modules.includes(module)) {
          // If module is not explicitly allowed, but maybe it's a "hub" token?
          // For strictness, fail. But usually tokens allow specific modules.
          return { success: false, demo_link_id: null, error_message: 'Este token no es válido para este módulo', expires_at: null };
        }
      }

      return {
        success: true,
        demo_link_id: linkData.id,
        error_message: null,
        expires_at: linkData.expires_at,
      };

    } catch (error: any) {
      console.error('Error validating link:', error);
      return {
        success: false,
        demo_link_id: null,
        error_message: error.message || 'Error de conexión',
        expires_at: null,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new demo session
  const createSession = useCallback(async (
    token: string, // This is the demo link token (e.g. "abc-123") or 'open_access'
    fullName: string,
    location: { lat: number; lng: number; city?: string; country?: string },
    module: string
  ): Promise<CreateSessionResult> => {
    setIsLoading(true);
    try {
      // 1. Get the demo link ID first (to link session)
      let linkId = null;
      let expiresAt = null;

      if (token !== 'open_access') {
        const { data: linkData, error } = await supabase
          .from('demo_links')
          .select('id, expires_at, token')
          .eq('token', token)
          .maybeSingle();

        if (error || !linkData) throw new Error('Token inválido al crear sesión');

        linkId = linkData.id;
        expiresAt = linkData.expires_at;

        // 2. Increment usage SECURELY via RPC
        const { error: incError } = await supabase.rpc('increment_demo_uses', { p_token: linkData.token });
        if (incError) console.error('Error incrementing usage:', incError);
      }

      // 3. Create session record
      const locationStr = `${location.city || ''}, ${location.country || ''}`;

      const { data: sessionData, error: sessionError } = await supabase
        .from('demo_sessions')
        .insert({
          demo_link_id: linkId,
          module_id: module,
          user_name: fullName,
          user_location: locationStr,
          metadata: {
            user_agent: navigator.userAgent,
            lat: location.lat,
            lng: location.lng
          }
        })
        .select('id') // We need ID to use as session token
        .single();

      if (sessionError) {
        console.error('Session creation error:', sessionError);
        throw new Error('Error al registrar la sesión');
      }

      const sessionToken = sessionData.id; // Use uuid as session token

      sessionStorage.setItem('demo_session_token', sessionToken);
      sessionStorage.setItem('demo_module', module);

      setState({
        isValid: true,
        sessionToken: sessionToken,
        moduleAccessed: module,
        fullName: fullName,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        error: null,
      });

      return {
        success: true,
        session_token: sessionToken,
        expires_at: expiresAt,
        error_message: null
      };

    } catch (error: any) {
      console.error('Error creating session:', error);
      return {
        success: false,
        session_token: null,
        expires_at: null,
        error_message: error.message || 'Error al crear la sesión',
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verify an existing session token (Client side only for now as we don't have verify endpoint)
  const verifySession = useCallback(async (token: string): Promise<boolean> => {
    // In a real app we might check if session ID exists in DB
    // For now, trust local storage if we just set it
    return true;
  }, []);

  // Clear session (logout from demo)
  const clearSession = useCallback(() => {
    sessionStorage.removeItem('demo_session_token');
    sessionStorage.removeItem('demo_module');
    setState({
      isValid: false,
      sessionToken: null,
      moduleAccessed: null,
      fullName: null,
      expiresAt: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    isLoading,
    validateLink,
    createSession,
    verifySession,
    clearSession,
  };
}
