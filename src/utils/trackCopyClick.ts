import { supabase } from '@/integrations/supabase/client';

export const trackCopyClick = async () => {
  try {
    await supabase.rpc('increment_copy_clicks');
  } catch (error) {
    console.error('Error tracking copy click:', error);
  }
};