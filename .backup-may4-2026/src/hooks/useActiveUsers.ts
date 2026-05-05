import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useActiveUsers = () => {
  useEffect(() => {
    // Generate a unique session ID for this browser tab
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const channel = supabase.channel('user-presence', {
      config: {
        presence: {
          key: sessionId
        }
      }
    });

    const updateActiveUsersCount = async (count: number) => {
      try {
        await supabase.rpc('update_active_users_count', { new_count: count });
      } catch (error) {
        console.error('Error updating active users count:', error);
      }
    };

    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const activeCount = Object.keys(presenceState).length;
        updateActiveUsersCount(activeCount);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left:', leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track this session as active
          await channel.track({
            session_id: sessionId,
            online_at: new Date().toISOString(),
            url: window.location.href,
            user_agent: navigator.userAgent.substring(0, 100)
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
};