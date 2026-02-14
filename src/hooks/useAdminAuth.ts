import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminAuthState {
  isAuthenticated: boolean;
  adminId: string | null;
  displayName: string | null;
  isLoading: boolean;
}

export function useAdminAuth() {
  const [state, setState] = useState<AdminAuthState>({
    isAuthenticated: false,
    adminId: null,
    displayName: null,
    isLoading: true,
  });

  // Check for existing session on mount and listen for changes
  useEffect(() => {
    const checkSession = async () => {
      try {
        // 1. Verificar bypass temporal (Prioridad para desarrollo)
        const bypassActive = localStorage.getItem('admin_bypass') === 'true';
        const bypassUid = localStorage.getItem('admin_bypass_uid');

        if (bypassActive && bypassUid) {
          setState({
            isAuthenticated: true,
            adminId: bypassUid,
            displayName: 'Admin (Bypass)',
            isLoading: false,
          });
          return;
        }

        // 2. Verificar sesión de Supabase Auth
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.user) {
          setState({
            isAuthenticated: true,
            adminId: session.user.id,
            displayName: session.user.email,
            isLoading: false,
          });
        } else {
          setState({
            isAuthenticated: false,
            adminId: null,
            displayName: null,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Session check error:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkSession();

    // Suscribirse a cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state change:', event);

      if (session?.user) {
        setState({
          isAuthenticated: true,
          adminId: session.user.id,
          displayName: session.user.email,
          isLoading: false,
        });
      } else if (localStorage.getItem('admin_bypass') !== 'true') {
        // Solo resetear si no hay bypass activo
        setState({
          isAuthenticated: false,
          adminId: null,
          displayName: null,
          isLoading: false,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error('Error de acceso', {
          description: error.message === 'Invalid login credentials'
            ? 'Usuario o contraseña incorrectos'
            : error.message
        });
        return false;
      }

      if (data.session) {
        toast.success(`Bienvenido, ${data.user.email}`);
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Error inseperado en el servidor');
      return false;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem('admin_bypass');
    localStorage.removeItem('admin_bypass_uid');

    const { error } = await supabase.auth.signOut();
    if (error) console.error('Logout error:', error);

    setState({
      isAuthenticated: false,
      adminId: null,
      displayName: null,
      isLoading: false,
    });

    toast.success('Sesión cerrada');
  }, []);

  const refreshSession = useCallback(async () => {
    await supabase.auth.refreshSession();
  }, []);

  return {
    ...state,
    login,
    logout,
    refreshSession,
  };
}
