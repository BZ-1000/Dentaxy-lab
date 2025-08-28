import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useSubscription = () => {
  const [loading, setLoading] = useState(false);
  const { session, checkSubscription } = useAuth();
  const { toast } = useToast();

  const createCheckoutSession = async (planType: string) => {
    if (!session) {
      toast({
        title: "Autenticación requerida",
        description: "Debes iniciar sesión para suscribirte",
        variant: "destructive",
      });
      return null;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan_type: planType },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        toast({
          title: "Error",
          description: "No se pudo crear la sesión de pago",
          variant: "destructive",
        });
        return null;
      }

      // Handle free plan response
      if (data.error && data.error.includes("Free plan")) {
        toast({
          title: "Acceso concedido",
          description: "Accediendo a la aplicación...",
        });
        return data.redirect_url || '/app';
      }

      return data.url;
    } catch (error) {
      console.error('Error in createCheckoutSession:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    if (!session) {
      toast({
        title: "Autenticación requerida",
        description: "Debes iniciar sesión para acceder al portal",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error opening customer portal:', error);
        toast({
          title: "Error",
          description: "No se pudo abrir el portal del cliente",
          variant: "destructive",
        });
        return;
      }

      // Open in new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error in openCustomerPortal:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscription = async () => {
    await checkSubscription();
    toast({
      title: "Estado actualizado",
      description: "Se ha verificado el estado de tu suscripción",
    });
  };

  return {
    loading,
    createCheckoutSession,
    openCustomerPortal,
    refreshSubscription,
  };
};