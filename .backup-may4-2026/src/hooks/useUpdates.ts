import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PlatformUpdate {
  id: string;
  version: string;
  title: string;
  description: string;
  release_date: string;
  created_at: string;
}

export const useUpdates = () => {
  const [updates, setUpdates] = useState<PlatformUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const { data, error } = await supabase
          .from('platform_updates')
          .select('*')
          .order('release_date', { ascending: false })
          .limit(10);

        if (error) throw error;
        setUpdates(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading updates');
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('platform_updates_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'platform_updates'
        },
        () => {
          fetchUpdates();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { updates, loading, error };
};