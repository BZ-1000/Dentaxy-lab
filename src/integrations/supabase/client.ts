
import { createClient } from '@supabase/supabase-js';

// Supabase URL and anon key are stored in env variables
const supabaseUrl = 'https://tlgofrhdhfklmjioearg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZ29mcmhkaGZrbG1qaW9lYXJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4NjA2ODEsImV4cCI6MjA1MzQzNjY4MX0.KIc6WzuoSPGFUGcyluoJc5ANXXyit4jBEedFZyE_lBk';

// Get the base URL for redirects
export const getURL = () => {
  let url = window?.location?.origin || 'https://dentaxy.com';
  
  // Make sure to include a trailing '/'
  return url.charAt(url.length - 1) === '/' ? url : `${url}/`;
};

// Create Supabase client with PKCE auth flow
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: {
      getItem: (key) => {
        // Get the user ID from the key if it exists
        // Format: sb-{projectRef}-auth-token-{userId}
        const userId = getUserIdFromKey(key) || 'anonymous';
        
        // Use a user-specific key for storage
        const userSpecificKey = `${key}_${userId}`;
        const storedSession = localStorage.getItem(userSpecificKey) || localStorage.getItem(key);
        
        return storedSession;
      },
      setItem: (key, value) => {
        // Extract userId from the JWT to create a user-specific storage key
        try {
          const session = JSON.parse(value);
          const userId = session?.user?.id;
          
          if (userId) {
            // Store with user-specific key
            const userSpecificKey = `${key}_${userId}`;
            localStorage.setItem(userSpecificKey, value);
          }
          
          // Also store in the original key for backward compatibility
          localStorage.setItem(key, value);
        } catch (err) {
          // If parsing fails, just store with the original key
          localStorage.setItem(key, value);
        }
      },
      removeItem: (key) => {
        // Get the user ID if it exists in the session
        const userId = getUserIdFromKey(key) || 'anonymous';
        const userSpecificKey = `${key}_${userId}`;
        
        // Remove both the user-specific and original keys
        localStorage.removeItem(userSpecificKey);
        localStorage.removeItem(key);
      }
    }
  }
});

// Function to extract user ID from a storage key
function getUserIdFromKey(key: string): string | null {
  // Try to get the current session from localStorage to extract the user ID
  try {
    const sessionStr = localStorage.getItem(key);
    if (!sessionStr) return null;
    
    const session = JSON.parse(sessionStr);
    return session?.user?.id || null;
  } catch (err) {
    return null;
  }
}

// Utility function to clear all user-specific data from localStorage
export const clearUserData = (userId?: string) => {
  // If userId is provided, only clear data for that user
  if (userId) {
    const prefixToFind = `_${userId}`;
    // Find all keys that belong to this user
    Object.keys(localStorage).forEach(key => {
      if (key.includes(prefixToFind)) {
        localStorage.removeItem(key);
      }
    });
    
    localStorage.removeItem(`dentaxy_username_${userId}`);
  } else {
    // Clear all dentaxy-related data
    localStorage.removeItem('dentaxy_username');
    
    // Find and clear all user-specific keys
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-') || key.startsWith('dentaxy_')) {
        localStorage.removeItem(key);
      }
    });
  }
};
