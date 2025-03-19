
import { createClient } from '@supabase/supabase-js';

// Supabase URL and anon key are stored in env variables
const supabaseUrl = 'https://tlgofrhdhfklmjioearg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZ29mcmhkaGZrbG1qaW9lYXJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4NjA2ODEsImV4cCI6MjA1MzQzNjY4MX0.KIc6WzuoSPGFUGcyluoJc5ANXXyit4jBEedFZyE_lBk';

const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : 'https://dentaxy.com/auth/callback';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    redirectTo: redirectTo
  }
});

export const getURL = () => {
  let url =
    'https://dentaxy.com' ?? // Custom domain if available
    'https://dentaxy.com'; // Fallback to production URL
    
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  return url;
};
