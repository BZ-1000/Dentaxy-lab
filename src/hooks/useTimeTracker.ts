import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface DailyActivity {
  date: string;
  minutes: number;
  formattedDate: string;
  dayName: string;
}

export const useTimeTracker = () => {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState<DailyActivity[]>([]);
  const [currentSessionMinutes, setCurrentSessionMinutes] = useState(0);
  const [totalTodayMinutes, setTotalTodayMinutes] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveRef = useRef<number>(0);

  // Generar datos de los últimos 7 días
  const generateWeeklyData = useCallback(async () => {
    const data: DailyActivity[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
      const formattedDate = date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short' 
      });

      let minutes = 0;
      
      if (user) {
        try {
          const { data: activityData, error } = await supabase
            .from('user_daily_activity')
            .select('total_seconds')
            .eq('user_id', user.id)
            .eq('activity_date', dateStr)
            .single();

          if (!error && activityData) {
            minutes = Math.round(activityData.total_seconds / 60);
          }
        } catch (error) {
          console.log('No activity data for', dateStr);
        }
      }

      data.push({
        date: dateStr,
        minutes,
        formattedDate,
        dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1)
      });
    }
    
    setWeeklyData(data);
    setTotalTodayMinutes(data[6]?.minutes || 0);
  }, [user]);

  // Guardar tiempo en la base de datos
  const saveTimeToDatabase = useCallback(async (seconds: number) => {
    if (!user || seconds < 30) return; // Solo guardar si hay al menos 30 segundos

    try {
      await supabase.rpc('increment_user_daily_activity', {
        p_seconds: seconds
      });
    } catch (error) {
      console.error('Error saving time:', error);
    }
  }, [user]);

  // Iniciar tracking
  const startTracking = useCallback(() => {
    if (!user || isTracking) return;
    
    startTimeRef.current = Date.now();
    setIsTracking(true);

    intervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const minutes = Math.floor(elapsed / 60);
        setCurrentSessionMinutes(minutes);

        // Guardar cada 2 minutos
        if (elapsed - lastSaveRef.current >= 120) {
          const secondsToSave = elapsed - lastSaveRef.current;
          saveTimeToDatabase(secondsToSave);
          lastSaveRef.current = elapsed;
          
          // Actualizar datos locales
          setTotalTodayMinutes(prev => prev + Math.floor(secondsToSave / 60));
          setWeeklyData(prev => {
            const newData = [...prev];
            if (newData[6]) {
              newData[6].minutes += Math.floor(secondsToSave / 60);
            }
            return newData;
          });
        }
      }
    }, 1000);
  }, [user, isTracking, saveTimeToDatabase]);

  // Detener tracking
  const stopTracking = useCallback(async () => {
    if (!isTracking || !startTimeRef.current) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const remainingSeconds = elapsed - lastSaveRef.current;
    
    if (remainingSeconds >= 30) {
      await saveTimeToDatabase(remainingSeconds);
      setTotalTodayMinutes(prev => prev + Math.floor(remainingSeconds / 60));
    }

    setIsTracking(false);
    setCurrentSessionMinutes(0);
    startTimeRef.current = null;
    lastSaveRef.current = 0;
  }, [isTracking, saveTimeToDatabase]);

  // Efectos
  useEffect(() => {
    generateWeeklyData();
  }, [generateWeeklyData]);

  useEffect(() => {
    if (user) {
      startTracking();
    } else {
      stopTracking();
    }

    // Cleanup al desmontar
    return () => {
      stopTracking();
    };
  }, [user, startTracking, stopTracking]);

  // Detectar cuando el usuario sale de la página
  useEffect(() => {
    const handleBeforeUnload = () => {
      stopTracking();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTracking();
      } else if (user && !isTracking) {
        startTracking();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, isTracking, startTracking, stopTracking]);

  return {
    weeklyData,
    currentSessionMinutes,
    totalTodayMinutes,
    isTracking
  };
};