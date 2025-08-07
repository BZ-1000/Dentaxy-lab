import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useAIButtonTracking = () => {
  const { user } = useAuth();

  const trackAIButtonUsage = async (sectionName: string) => {
    if (!user) return;

    try {
      // Insert usage record
      await supabase
        .from('ai_button_usage')
        .insert({
          user_id: user.id,
          section_name: sectionName,
          date: new Date().toISOString().split('T')[0]
        });

      // Update global counter
      const { data: currentMetric } = await supabase
        .from('platform_metrics')
        .select('metric_value')
        .eq('metric_name', 'ai_generations_count')
        .single();

      if (currentMetric) {
        await supabase
          .from('platform_metrics')
          .update({
            metric_value: currentMetric.metric_value + 1,
            updated_at: new Date().toISOString()
          })
          .eq('metric_name', 'ai_generations_count');
      }
    } catch (error) {
      console.error('Error tracking AI button usage:', error);
    }
  };

  return { trackAIButtonUsage };
};