// This hook is deprecated - subscription functionality has been removed
// Kept as stub for compatibility with existing imports

import { useState } from 'react';

export const useSubscription = () => {
  const [loading] = useState(false);

  return {
    loading,
    createCheckoutSession: async () => null,
    openCustomerPortal: async () => {},
    refreshSubscription: async () => {},
  };
};
