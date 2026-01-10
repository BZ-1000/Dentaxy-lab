import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AdminSession {
  id: string;
  expires_at: string;
  last_activity: string;
  is_active: boolean;
  requires_reauth: boolean;
}

interface SystemState {
  lockdown_mode: boolean;
  chat_enabled: boolean;
  demo_creation_enabled: boolean;
  security_level: 'normal' | 'elevated' | 'critical';
}

interface AdminSecurityContextType {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  adminRole: string | null;
  session: AdminSession | null;
  systemState: SystemState;
  sessionTimeRemaining: number;
  isLoading: boolean;
  requiresReauth: boolean;
  refreshSession: () => Promise<void>;
  requestReauth: () => void;
  completeReauth: () => void;
  activateKillSwitch: () => Promise<void>;
  deactivateKillSwitch: () => Promise<void>;
}

const defaultSystemState: SystemState = {
  lockdown_mode: false,
  chat_enabled: true,
  demo_creation_enabled: true,
  security_level: 'normal',
};

const AdminSecurityContext = createContext<AdminSecurityContextType | undefined>(undefined);

export const AdminSecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [session, setSession] = useState<AdminSession | null>(null);
  const [systemState, setSystemState] = useState<SystemState>(defaultSystemState);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [requiresReauth, setRequiresReauth] = useState(false);

  const checkAdminStatus = useCallback(async () => {
    if (!user) {
      setIsAdmin(false);
      setIsSuperAdmin(false);
      setAdminRole(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data: roleData, error } = await supabase
        .rpc('get_admin_role', { user_uuid: user.id });

      if (error) throw error;

      const role = roleData as string | null;
      setAdminRole(role);
      setIsAdmin(role === 'admin' || role === 'super_admin');
      setIsSuperAdmin(role === 'super_admin');
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setIsSuperAdmin(false);
      setAdminRole(null);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchSystemState = useCallback(async () => {
    if (!isAdmin) return;

    try {
      const { data, error } = await supabase
        .from('system_state')
        .select('key, value');

      if (error) throw error;

      const newState = { ...defaultSystemState };
      data?.forEach((item: { key: string; value: { active?: boolean; level?: string } }) => {
        switch (item.key) {
          case 'lockdown_mode':
            newState.lockdown_mode = item.value?.active ?? false;
            break;
          case 'chat_enabled':
            newState.chat_enabled = item.value?.active ?? true;
            break;
          case 'demo_creation_enabled':
            newState.demo_creation_enabled = item.value?.active ?? true;
            break;
          case 'security_level':
            newState.security_level = (item.value?.level as SystemState['security_level']) ?? 'normal';
            break;
        }
      });
      setSystemState(newState);
    } catch (error) {
      console.error('Error fetching system state:', error);
    }
  }, [isAdmin]);

  const refreshSession = useCallback(async () => {
    if (!user || !isAdmin) return;

    try {
      const { data, error } = await supabase
        .from('admin_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setSession(data as AdminSession);
        const expiresAt = new Date(data.expires_at).getTime();
        const now = Date.now();
        setSessionTimeRemaining(Math.max(0, Math.floor((expiresAt - now) / 1000)));
        setRequiresReauth(data.requires_reauth);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  }, [user, isAdmin]);

  const requestReauth = useCallback(() => {
    setRequiresReauth(true);
  }, []);

  const completeReauth = useCallback(() => {
    setRequiresReauth(false);
  }, []);

  const activateKillSwitch = useCallback(async () => {
    if (!user || !isSuperAdmin) return;

    try {
      const { error } = await supabase.rpc('activate_kill_switch', {
        admin_user_id: user.id,
      });

      if (error) throw error;

      await fetchSystemState();
    } catch (error) {
      console.error('Error activating kill switch:', error);
      throw error;
    }
  }, [user, isSuperAdmin, fetchSystemState]);

  const deactivateKillSwitch = useCallback(async () => {
    if (!user || !isSuperAdmin) return;

    try {
      const { error } = await supabase.rpc('deactivate_kill_switch', {
        admin_user_id: user.id,
      });

      if (error) throw error;

      await fetchSystemState();
    } catch (error) {
      console.error('Error deactivating kill switch:', error);
      throw error;
    }
  }, [user, isSuperAdmin, fetchSystemState]);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  useEffect(() => {
    if (isAdmin) {
      fetchSystemState();
      refreshSession();
    }
  }, [isAdmin, fetchSystemState, refreshSession]);

  // Session timer countdown
  useEffect(() => {
    if (sessionTimeRemaining <= 0) return;

    const interval = setInterval(() => {
      setSessionTimeRemaining((prev) => {
        if (prev <= 1) {
          setRequiresReauth(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionTimeRemaining]);

  // Real-time system state updates
  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('system-state-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'system_state' },
        () => {
          fetchSystemState();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, fetchSystemState]);

  return (
    <AdminSecurityContext.Provider
      value={{
        isAdmin,
        isSuperAdmin,
        adminRole,
        session,
        systemState,
        sessionTimeRemaining,
        isLoading,
        requiresReauth,
        refreshSession,
        requestReauth,
        completeReauth,
        activateKillSwitch,
        deactivateKillSwitch,
      }}
    >
      {children}
    </AdminSecurityContext.Provider>
  );
};

export const useAdminSecurity = () => {
  const context = useContext(AdminSecurityContext);
  if (context === undefined) {
    throw new Error('useAdminSecurity must be used within an AdminSecurityProvider');
  }
  return context;
};
