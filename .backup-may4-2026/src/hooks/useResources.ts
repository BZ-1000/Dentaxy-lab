import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EducationalResource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'book' | 'guide' | 'video' | 'course';
  category: 'clinica' | 'diagnostico' | 'tratamiento' | 'investigacion' | 'general';
  url?: string;
  image_url?: string;
  author?: string;
  publication_date?: string;
  is_featured: boolean;
  created_at: string;
}

export const useResources = () => {
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data, error } = await supabase
          .from('educational_resources')
          .select('*')
          .order('is_featured', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) throw error;
        setResources(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading resources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('educational_resources_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'educational_resources'
        },
        () => {
          fetchResources();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { resources, loading, error };
};