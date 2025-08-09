
import React from 'react';
import { useDailyActivityTracker } from '@/hooks/useDailyActivityTracker';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Componente invisible que activa el tracking global
 * cuando el usuario está autenticado.
 */
export default function ActivityTracker() {
  const { user } = useAuth();
  const { bufferSeconds, isActive } = useDailyActivityTracker(20000);

  if (!user) return null;

  return null;
}
