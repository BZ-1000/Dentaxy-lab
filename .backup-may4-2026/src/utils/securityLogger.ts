// Security-focused logging utility
export const securityLogger = {
  logAuthEvent: (event: string, userId?: string, details?: Record<string, any>) => {
    // Only log non-sensitive information
    const sanitizedDetails = details ? {
      ...details,
      // Remove any potential sensitive data
      password: undefined,
      token: undefined,
      secret: undefined,
      key: undefined
    } : {};
    
    console.log(`[SECURITY] ${event}`, {
      userId: userId || 'anonymous',
      timestamp: new Date().toISOString(),
      ...sanitizedDetails
    });
  },

  logError: (error: string, context?: string) => {
    console.error(`[SECURITY-ERROR] ${context || 'Unknown'}: ${error}`, {
      timestamp: new Date().toISOString()
    });
  },

  logSuspiciousActivity: (activity: string, details?: Record<string, any>) => {
    console.warn(`[SECURITY-ALERT] ${activity}`, {
      timestamp: new Date().toISOString(),
      ...details
    });
  }
};