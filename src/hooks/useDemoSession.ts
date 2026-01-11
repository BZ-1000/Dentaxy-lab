import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
      verifySession(token);
    }
  }, []);

  // Validate a demo link token for a specific module
  const validateLink = useCallback(async (token: string, module: string): Promise<ValidateLinkResult> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('validate_demo_link', {
        p_token: token,
        p_module: module,
      });

      if (error) throw error;

      const result = data?.[0] || { success: false, demo_link_id: null, error_message: 'Error desconocido', expires_at: null };
      return result as ValidateLinkResult;
    } catch (error) {
      console.error('Error validating link:', error);
      return {
        success: false,
        demo_link_id: null,
        error_message: 'Error de conexión. Intenta de nuevo.',
        expires_at: null,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new demo session
  const createSession = useCallback(async (
    token: string,
    fullName: string,
    location: { lat: number; lng: number; city?: string; country?: string },
    module: string
  ): Promise<CreateSessionResult> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('create_demo_session', {
        p_token: token,
        p_full_name: fullName,
        p_location: location,
        p_module: module,
        p_user_agent: navigator.userAgent,
      });

      if (error) throw error;

      const result = data?.[0] || { success: false, session_token: null, expires_at: null, error_message: 'Error desconocido' };
      
      if (result.success && result.session_token) {
        sessionStorage.setItem('demo_session_token', result.session_token);
        sessionStorage.setItem('demo_module', module);
        setState({
          isValid: true,
          sessionToken: result.session_token,
          moduleAccessed: module,
          fullName: fullName,
          expiresAt: result.expires_at ? new Date(result.expires_at) : null,
          error: null,
        });
      }

      return result as CreateSessionResult;
    } catch (error: unknown) {
      console.error('Error creating session:', error);
      // Provide more specific error messages
      let errorMsg = 'Error de conexión. Intenta de nuevo.';
      if (error && typeof error === 'object' && 'message' in error) {
        const msg = (error as { message: string }).message;
        if (msg.includes('gen_random_bytes')) {
          errorMsg = 'Error interno del servidor. Por favor intenta de nuevo.';
        } else if (msg.includes('network') || msg.includes('fetch')) {
          errorMsg = 'Error de red. Verifica tu conexión a internet.';
        }
      }
      return {
        success: false,
        session_token: null,
        expires_at: null,
        error_message: errorMsg,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verify an existing session token
  const verifySession = useCallback(async (token: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('verify_demo_session', {
        p_session_token: token,
      });

      if (error) throw error;

      const result = (data?.[0] || { is_valid: false, module_accessed: null, full_name: null, expires_at: null, error_message: null }) as VerifySessionResult;
      
      if (result.is_valid) {
        setState({
          isValid: true,
          sessionToken: token,
          moduleAccessed: result.module_accessed,
          fullName: result.full_name,
          expiresAt: result.expires_at ? new Date(result.expires_at) : null,
          error: null,
        });
        return true;
      } else {
        // Clear invalid session
        sessionStorage.removeItem('demo_session_token');
        sessionStorage.removeItem('demo_module');
        setState({
          isValid: false,
          sessionToken: null,
          moduleAccessed: null,
          fullName: null,
          expiresAt: null,
          error: result.error_message,
        });
        return false;
      }
    } catch (error) {
      console.error('Error verifying session:', error);
      setState((prev) => ({ ...prev, isValid: false, error: 'Error de conexión' }));
      return false;
    } finally {
      setIsLoading(false);
    }
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
