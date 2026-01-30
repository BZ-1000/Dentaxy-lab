import { useState, useEffect, useCallback } from 'react';

const SHOP_CREDENTIALS = {
  username: 'admin',
  password: 'dentaxy123.-'
};

const SESSION_KEY = 'dentaxy_shop_session';
const SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

interface ShopSession {
  isAuthenticated: boolean;
  expiresAt: number;
  username: string;
}

export const useShopAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  const checkSession = useCallback(() => {
    try {
      const sessionData = sessionStorage.getItem(SESSION_KEY);
      if (!sessionData) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return false;
      }

      const session: ShopSession = JSON.parse(sessionData);
      const now = Date.now();

      if (session.isAuthenticated && session.expiresAt > now) {
        setIsAuthenticated(true);
        setUsername(session.username);
        setIsLoading(false);
        return true;
      } else {
        // Session expired
        sessionStorage.removeItem(SESSION_KEY);
        setIsAuthenticated(false);
        setIsLoading(false);
        return false;
      }
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }
  }, []);

  const login = useCallback((inputUsername: string, inputPassword: string): boolean => {
    if (
      inputUsername === SHOP_CREDENTIALS.username &&
      inputPassword === SHOP_CREDENTIALS.password
    ) {
      const session: ShopSession = {
        isAuthenticated: true,
        expiresAt: Date.now() + SESSION_DURATION,
        username: inputUsername
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setIsAuthenticated(true);
      setUsername(inputUsername);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    setUsername(null);
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return {
    isAuthenticated,
    isLoading,
    username,
    login,
    logout,
    checkSession
  };
};
