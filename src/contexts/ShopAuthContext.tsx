import React, { createContext, useContext, ReactNode } from 'react';
import { useShopAuth } from '@/hooks/useShopAuth';
import { Navigate } from 'react-router-dom';

interface ShopAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const ShopAuthContext = createContext<ShopAuthContextType | undefined>(undefined);

export const useShopAuthContext = () => {
  const context = useContext(ShopAuthContext);
  if (!context) {
    throw new Error('useShopAuthContext must be used within a ShopAuthProvider');
  }
  return context;
};

interface ShopAuthProviderProps {
  children: ReactNode;
}

export const ShopAuthProvider: React.FC<ShopAuthProviderProps> = ({ children }) => {
  const auth = useShopAuth();

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/shop" replace />;
  }

  return (
    <ShopAuthContext.Provider value={auth}>
      {children}
    </ShopAuthContext.Provider>
  );
};
