import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useActiveUsers = () => {
  useEffect(() => {
    const channel = supabase.channel('user-presence', {
      config: {
        presence: {
          key: 'user_id'
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
          // Track this user as active
          await channel.track({
            user_id: 'user_' + Math.random().toString(36).substr(2, 9),
            online_at: new Date().toISOString()
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
};