
import { createClient } from '@supabase/supabase-js';

// Credenciales de Supabase - Hardcodeadas directamente desde el dashboard
// URL del proyecto: https://ooepkqxwywfcfhkpzphe.supabase.co
// Anon Key actualizada: 11 de febrero de 2026
const supabaseUrl = 'https://ooepkqxwywfcfhkpzphe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vZXBrcXh3eXdmY2Zoa3B6cGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4NDA5OTgsImV4cCI6MjA4NjQxNjk5OH0.F2eSyL0QNNCq_1bZBLrLzDRmOgno-q2Out3HHumN9r4';

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
    flowType: 'pkce'
  }
});
