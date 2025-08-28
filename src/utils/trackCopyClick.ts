import { supabase } from '@/integrations/supabase/client';

export const trackCopyClick = async () => {
  try {
    await supabase.rpc('increment_copy_clicks');
    console.log('Copy click tracked successfully');
  } catch (error) {
    console.error('Error tracking copy click:', error);
  }
};