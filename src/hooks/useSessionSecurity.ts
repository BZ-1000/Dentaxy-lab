import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useSessionSecurity = () => {
  const { session } = useAuth();

  useEffect(() => {
    if (!session) return;

    // Session timeout (24 hours)
    const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    // Check session age
    const sessionStart = new Date(session.user.created_at || session.user.email_confirmed_at || Date.now());
    const sessionAge = Date.now() - sessionStart.getTime();
    
    if (sessionAge > SESSION_TIMEOUT) {
      console.warn('Session expired due to age');
      supabase.auth.signOut();
      return;
    }

    // Set up activity monitoring
    let lastActivity = Date.now();
    const INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours

    const updateActivity = () => {
      lastActivity = Date.now();
    };

    const checkInactivity = () => {
      const inactiveTime = Date.now() - lastActivity;
      if (inactiveTime > INACTIVITY_TIMEOUT) {
        console.warn('Session expired due to inactivity');
        supabase.auth.signOut();
      }
    };

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Check inactivity every 5 minutes
    const inactivityCheck = setInterval(checkInactivity, 5 * 60 * 1000);

    // Session validation every 10 minutes
    const sessionValidation = setInterval(async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error || !currentSession) {
          console.warn('Session validation failed');
          supabase.auth.signOut();
        }
      } catch (error) {
        console.error('Session validation error:', error);
        supabase.auth.signOut();
      }
    }, 10 * 60 * 1000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
      clearInterval(inactivityCheck);
      clearInterval(sessionValidation);
    };
  }, [session]);
};