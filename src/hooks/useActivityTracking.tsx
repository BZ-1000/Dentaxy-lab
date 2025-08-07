import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useActivityTracking = () => {
  const { user } = useAuth();
  const sessionStartRef = useRef<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Start session
    sessionStartRef.current = new Date();

    // Track activity events
    const trackActivity = () => {
      setIsActive(true);
    };

    const handleVisibilityChange = () => {
      setIsActive(!document.hidden);
    };

    // Add event listeners
    window.addEventListener('mousemove', trackActivity);
    window.addEventListener('keydown', trackActivity);
    window.addEventListener('click', trackActivity);
    window.addEventListener('scroll', trackActivity);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Update session every minute
    intervalRef.current = setInterval(async () => {
      if (!sessionStartRef.current) return;

      const now = new Date();
      const durationMinutes = Math.floor(
        (now.getTime() - sessionStartRef.current.getTime()) / 60000
      );

      if (durationMinutes > 0) {
        try {
          // Check if session exists for today
          const today = new Date().toISOString().split('T')[0];
          const { data: existingSession } = await supabase
            .from('user_activity_sessions')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', today)
            .order('session_start', { ascending: false })
            .limit(1)
            .single();

          if (existingSession && !existingSession.session_end) {
            // Update existing session
            await supabase
              .from('user_activity_sessions')
              .update({
                session_end: now.toISOString(),
                duration_minutes: durationMinutes
              })
              .eq('id', existingSession.id);
          } else {
            // Create new session
            await supabase
              .from('user_activity_sessions')
              .insert({
                user_id: user.id,
                session_start: sessionStartRef.current.toISOString(),
                session_end: now.toISOString(),
                duration_minutes: durationMinutes,
                date: today
              });
          }
        } catch (error) {
          console.error('Error updating activity session:', error);
        }
      }
    }, 60000); // Every minute

    return () => {
      // Cleanup
      window.removeEventListener('mousemove', trackActivity);
      window.removeEventListener('keydown', trackActivity);
      window.removeEventListener('click', trackActivity);
      window.removeEventListener('scroll', trackActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // End session on unmount
      if (sessionStartRef.current) {
        const durationMinutes = Math.floor(
          (new Date().getTime() - sessionStartRef.current.getTime()) / 60000
        );
        
        if (durationMinutes > 0) {
          supabase
            .from('user_activity_sessions')
            .insert({
              user_id: user.id,
              session_start: sessionStartRef.current.toISOString(),
              session_end: new Date().toISOString(),
              duration_minutes: durationMinutes,
              date: new Date().toISOString().split('T')[0]
            });
        }
      }
    };
  }, [user]);

  return { isActive };
};