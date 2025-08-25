import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  loading: boolean;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  subscription: SubscriptionData;
  checkSubscription: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
    loading: false,
  });
  const { toast } = useToast();

  const checkSubscription = async () => {
    if (!session) return;
    
    try {
      setSubscription(prev => ({ ...prev, loading: true }));
      
      console.log('Checking subscription for user:', session.user.email);
      
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        console.error('Full error details:', JSON.stringify(error, null, 2));
        toast({
          title: "Error de configuración",
          description: "No se pudo verificar el estado de la suscripción. Verifica la configuración de Stripe.",
          variant: "destructive",
        });
        setSubscription(prev => ({ ...prev, loading: false }));
        return;
      }

      console.log('Subscription check result:', data);
      setSubscription({
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier || null,
        subscription_end: data.subscription_end || null,
        loading: false,
      });
    } catch (error) {
      console.error('Error in checkSubscription:', error);
      setSubscription(prev => ({ ...prev, loading: false }));
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear all local storage
      localStorage.removeItem('userSession');
      localStorage.removeItem('dentaxy_username');
      localStorage.removeItem('currentFormData');
      localStorage.removeItem('formBackup');
      
      // Reset subscription state
      setSubscription({
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
        loading: false,
      });
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      // Force logout even if there's an error
      localStorage.clear();
      setSession(null);
      setSubscription({
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
        loading: false,
      });
      
      toast({
        title: "Sesión cerrada",
        description: "Tu sesión ha sido cerrada",
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        if (mounted) {
          setSession(session);
          if (session) {
            localStorage.setItem('userSession', JSON.stringify(session));
          } else {
            localStorage.removeItem('userSession');
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Listen for auth changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        
        if (session) {
          localStorage.setItem('userSession', JSON.stringify(session));
      // Suscripción: se maneja en el efecto que observa `session`

        } else {
          localStorage.removeItem('userSession');
          localStorage.removeItem('dentaxy_username');
          setSubscription({
            subscribed: false,
            subscription_tier: null,
            subscription_end: null,
            loading: false,
          });
        }
        
        setLoading(false);
      }
    );

    // Initialize auth
    initializeAuth();

    return () => {
      mounted = false;
      authSubscription.unsubscribe();
    };
  }, []);

  // Check subscription when session changes
  useEffect(() => {
    if (session) {
      checkSubscription();
    }
  }, [session]);

  const value = {
    session,
    user: session?.user || null,
    loading,
    subscription,
    checkSubscription,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};