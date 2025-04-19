
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if we have a hash or query parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        console.log('Processing authentication callback...');
        console.log('Hash params:', Object.fromEntries(hashParams));
        console.log('Query params:', Object.fromEntries(queryParams));
        
        // Get the current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          toast.error('Error al procesar la autenticación');
          navigate('/auth/login');
          return;
        }
        
        if (sessionData?.session) {
          console.log('Session exists, redirecting to home');
          toast.success('¡Autenticación exitosa!');
          navigate('/');
          return;
        }
        
        // If no session yet, let Supabase process the callback
        if (hashParams.get('access_token') || queryParams.get('code')) {
          console.log('OAuth token found, waiting for Supabase to process...');
          
          // Wait for Supabase to process the auth
          setTimeout(async () => {
            const { data: refreshedSession, error: refreshError } = await supabase.auth.getSession();
            
            console.log('Checking for session after timeout');
            if (refreshError) {
              console.error('Error refreshing session:', refreshError);
              toast.error('Error al procesar la autenticación');
              navigate('/auth/login');
              return;
            }
            
            if (refreshedSession?.session) {
              console.log('Authentication successful');
              toast.success('¡Autenticación exitosa!');
              navigate('/');
            } else {
              console.error('No session after OAuth callback');
              toast.error('Error durante la autenticación');
              navigate('/auth/login');
            }
          }, 2000);
        } else {
          console.error('No authentication information found');
          toast.error('Enlace de autenticación inválido');
          navigate('/auth/login');
        }
      } catch (err) {
        console.error('Error in auth callback:', err);
        toast.error('Error inesperado durante la autenticación');
        navigate('/auth/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-800 to-black">
      <div className="text-center text-white">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-xl">Verificando autenticación...</p>
        <p className="mt-2 text-sm opacity-70">Por favor espere un momento...</p>
      </div>
    </div>
  );
}
