import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminAuthState {
  isAuthenticated: boolean;
  adminId: string | null;
  displayName: string | null;
  isLoading: boolean;
}

const ADMIN_SESSION_KEY = 'dentaxy_admin_session';
const SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 hours

interface StoredSession {
  adminId: string;
  displayName: string;
  expiresAt: number;
}

export function useAdminAuth() {
  const [state, setState] = useState<AdminAuthState>({
    isAuthenticated: false,
    adminId: null,
    displayName: null,
    isLoading: true,
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      try {
        const stored = sessionStorage.getItem(ADMIN_SESSION_KEY);
        if (stored) {
          const session: StoredSession = JSON.parse(stored);
          if (session.expiresAt > Date.now()) {
            setState({
              isAuthenticated: true,
              adminId: session.adminId,
              displayName: session.displayName,
              isLoading: false,
            });
            return;
          }
          // Session expired
          sessionStorage.removeItem(ADMIN_SESSION_KEY);
        }
      } catch (e) {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
      }
      setState(prev => ({ ...prev, isLoading: false }));
    };

    checkSession();
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const { data, error } = await supabase.rpc('verify_admin_login', {
        p_username: username,
        p_password: password,
      });

      if (error) {
        console.error('Login error:', error);
        toast.error('Error de conexión');
        return false;
      }

      const result = data?.[0];
      
      if (!result?.success) {
        toast.error(result?.error_message || 'Credenciales inválidas');
        return false;
      }

      // Create session
      const session: StoredSession = {
        adminId: result.admin_id,
        displayName: result.display_name,
        expiresAt: Date.now() + SESSION_DURATION,
      };

      sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));

      setState({
        isAuthenticated: true,
        adminId: result.admin_id,
        displayName: result.display_name,
        isLoading: false,
      });

      toast.success(`Bienvenido, ${result.display_name}`);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Error al iniciar sesión');
      return false;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setState({
      isAuthenticated: false,
      adminId: null,
      displayName: null,
      isLoading: false,
    });
    toast.success('Sesión cerrada');
  }, []);

  const refreshSession = useCallback(() => {
    try {
      const stored = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (stored) {
        const session: StoredSession = JSON.parse(stored);
        session.expiresAt = Date.now() + SESSION_DURATION;
        sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  return {
    ...state,
    login,
    logout,
    refreshSession,
  };
}
