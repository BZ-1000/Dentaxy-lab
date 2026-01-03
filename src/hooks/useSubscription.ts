import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export const useSubscription = () => {
  const [loading, setLoading] = useState(false);

  const createCheckoutSession = async (planType: string) => {
    toast({
      title: "Modo Demo",
      description: "La suscripción no está disponible en el demo",
    });
    return null;
  };

  const openCustomerPortal = async () => {
    toast({
      title: "Modo Demo",
      description: "El portal de cliente no está disponible en el demo",
    });
  };

  const refreshSubscription = async () => {
    toast({
      title: "Modo Demo",
      description: "Estás usando la versión demo",
    });
  };

  return {
    loading,
    createCheckoutSession,
    openCustomerPortal,
    refreshSubscription,
  };
};
