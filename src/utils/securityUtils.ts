import { supabase } from '@/integrations/supabase/client';

// Client-side security utilities
export const securityUtils = {
  // Audit logging function for client-side events
  logAuditEvent: async (action: string, resourceType: string, resourceId?: string, details?: Record<string, any>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await supabase.functions.invoke('audit-logger', {
        body: {
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details: details || {}
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  },

  // Sanitize user input to prevent XSS
  sanitizeInput: (input: string): string => {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .trim()
      .substring(0, 10000); // Limit length
  },

  // Validate email format
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 255;
  },

  // Generate secure random string
  generateSecureId: (): string => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  // Check if running in secure context
  isSecureContext: (): boolean => {
    return window.isSecureContext || window.location.protocol === 'https:';
  },

  // Rate limiting helper (client-side)
  createRateLimiter: (maxRequests: number, windowMs: number) => {
    const requests: number[] = [];
    
    return {
      isAllowed: (): boolean => {
        const now = Date.now();
        const windowStart = now - windowMs;
        
        // Remove old requests
        while (requests.length > 0 && requests[0] < windowStart) {
          requests.shift();
        }
        
        if (requests.length >= maxRequests) {
          return false;
        }
        
        requests.push(now);
        return true;
      }
    };
  }
};

// Export individual functions for convenience
export const {
  logAuditEvent,
  sanitizeInput,
  isValidEmail,
  generateSecureId,
  isSecureContext,
  createRateLimiter
} = securityUtils;