
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type UseDailyActivityTrackerResult = {
  bufferSeconds: number;
  isActive: boolean;
  lastFlushAt: number | null;
};

/**
 * Cuenta segundos SOLO cuando la pestaña está visible y con foco.
 * Hace flush del buffer a Supabase cada ~20s y al perder foco/ocultarse.
 * Requiere usuario autenticado (RLS).
 */
export function useDailyActivityTracker(flushIntervalMs: number = 20000): UseDailyActivityTrackerResult {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [bufferSeconds, setBufferSeconds] = useState(0);
  const [lastFlushAt, setLastFlushAt] = useState<number | null>(null);

  const secTimerRef = useRef<number | null>(null);
  const flushTimerRef = useRef<number | null>(null);
  const flushingRef = useRef(false);

  // Evalúa si debemos contar tiempo (visible + focus)
  const updateActive = () => {
    const active = document.visibilityState === 'visible' && document.hasFocus();
    setIsActive(active);
  };

  // Flush del buffer al backend
  const flush = async () => {
    if (!user) return;
    if (flushingRef.current) return;
    if (bufferSeconds <= 0) return;

    flushingRef.current = true;
    const toSend = bufferSeconds;
    // Optimista: reseteamos el buffer inmediatamente para no duplicar
    setBufferSeconds(0);

    // Rpc segura: usa auth.uid() dentro de la función
    const { error } = await supabase.rpc('increment_user_daily_activity', {
      p_seconds: toSend,
      p_at: new Date().toISOString(),
    });

    if (!error) {
      setLastFlushAt(Date.now());
    } else {
      // Si falla, devolvemos el buffer para no perderlo
      setBufferSeconds((s) => s + toSend);
      // El error seguirá en consola para depurar (no capturamos con try/catch global)
      console.error('increment_user_daily_activity error:', error);
    }

    flushingRef.current = false;
  };

  useEffect(() => {
    updateActive();

    const onFocus = () => updateActive();
    const onBlur = () => {
      updateActive();
      // Intentamos flush rápido al perder foco
      flush();
    };
    const onVisibility = () => {
      updateActive();
      if (document.visibilityState !== 'visible') {
        flush();
      }
    };

    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [user]);

  // Timer por segundo para acumular buffer
  useEffect(() => {
    if (!user) return;

    if (secTimerRef.current) {
      window.clearInterval(secTimerRef.current);
      secTimerRef.current = null;
    }
    secTimerRef.current = window.setInterval(() => {
      if (isActive) {
        setBufferSeconds((s) => s + 1);
      }
    }, 1000);

    return () => {
      if (secTimerRef.current) {
        window.clearInterval(secTimerRef.current);
        secTimerRef.current = null;
      }
    };
  }, [user, isActive]);

  // Flush periódico
  useEffect(() => {
    if (!user) return;

    if (flushTimerRef.current) {
      window.clearInterval(flushTimerRef.current);
      flushTimerRef.current = null;
    }
    flushTimerRef.current = window.setInterval(() => {
      flush();
    }, flushIntervalMs);

    return () => {
      if (flushTimerRef.current) {
        window.clearInterval(flushTimerRef.current);
        flushTimerRef.current = null;
      }
    };
  }, [user, flushIntervalMs]);

  // Best-effort: intentar flush al cerrar pestaña
  useEffect(() => {
    const onBeforeUnload = () => {
      // No podemos asegurar la escritura aquí, pero lo intentamos
      void flush();
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [user, bufferSeconds]);

  return { bufferSeconds, isActive, lastFlushAt };
}
