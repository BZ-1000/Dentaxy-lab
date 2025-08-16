import { supabase } from '@/integrations/supabase/client';
import { logAuditEvent } from './securityUtils';

export const trackCopyClick = async () => {
  try {
    await supabase.rpc('increment_copy_clicks');
    console.log('Copy click tracked successfully');
    
    // Log audit event for security monitoring
    await logAuditEvent('copy_click', 'user_interaction', undefined, {
      timestamp: new Date().toISOString(),
      action_type: 'copy_button_click'
    });
  } catch (error) {
    console.error('Error tracking copy click:', error);
  }
};