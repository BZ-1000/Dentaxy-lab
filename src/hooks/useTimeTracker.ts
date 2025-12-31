import { useState, useEffect, useRef, useCallback } from 'react';

interface DailyActivity {
  date: string;
  minutes: number;
  formattedDate: string;
  dayName: string;
}

export const useTimeTracker = () => {
  const [weeklyData, setWeeklyData] = useState<DailyActivity[]>([]);
  const [currentSessionMinutes, setCurrentSessionMinutes] = useState(0);
  const [totalTodayMinutes, setTotalTodayMinutes] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generar datos demo de los últimos 7 días
  const generateWeeklyData = useCallback(() => {
    const data: DailyActivity[] = [];
    const today = new Date();
    
    // Demo data con valores aleatorios
    const demoMinutes = [45, 32, 0, 78, 25, 60, 0];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
      const formattedDate = date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short' 
      });

      data.push({
        date: dateStr,
        minutes: i === 0 ? currentSessionMinutes : demoMinutes[6 - i] || 0,
        formattedDate,
        dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1)
      });
    }
    
    setWeeklyData(data);
    setTotalTodayMinutes(data[6]?.minutes || 0);
  }, [currentSessionMinutes]);

  // Iniciar tracking automático para demo
  const startTracking = useCallback(() => {
    if (isTracking) return;
    
    startTimeRef.current = Date.now();
    setIsTracking(true);

    intervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const minutes = Math.floor(elapsed / 60);
        setCurrentSessionMinutes(minutes);
      }
    }, 1000);
  }, [isTracking]);

  // Detener tracking
  const stopTracking = useCallback(() => {
    if (!isTracking || !startTimeRef.current) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsTracking(false);
    startTimeRef.current = null;
  }, [isTracking]);

  // Efectos
  useEffect(() => {
    generateWeeklyData();
  }, [generateWeeklyData]);

  // Auto-iniciar tracking en modo demo
  useEffect(() => {
    startTracking();
    return () => stopTracking();
  }, []);

  return {
    weeklyData,
    currentSessionMinutes,
    totalTodayMinutes,
    isTracking
  };
};