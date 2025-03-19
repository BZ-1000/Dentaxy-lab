
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for session from the OAuth callback and URL parameters
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error al obtener la sesión:', error);
          toast.error('Error al procesar la autenticación');
          navigate('/auth/login');
          return;
        }
        
        if (data?.session) {
          // The user is authenticated, redirect to dashboard
          toast.success('¡Autenticación exitosa!');
          navigate('/app');
        } else {
          // Try to exchange the code if there's no session yet
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const queryParams = new URLSearchParams(window.location.search);
          
          if (hashParams.get('access_token') || queryParams.get('code')) {
            // There's an access token or auth code in the URL, Supabase should be processing it
            console.log('Procesando autenticación...');
            
            // Wait a moment for Supabase to process the auth
            setTimeout(async () => {
              const { data: sessionData } = await supabase.auth.getSession();
              if (sessionData?.session) {
                toast.success('¡Autenticación exitosa!');
                navigate('/app');
              } else {
                navigate('/auth/login');
              }
            }, 1000);
          } else {
            // No session and no access token in URL, redirect to login
            navigate('/auth/login');
          }
        }
      } catch (err) {
        console.error('Error en el callback de autenticación:', err);
        toast.error('Error inesperado durante la autenticación');
        navigate('/auth/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-xl">Verificando autenticación...</p>
      </div>
    </div>
  );
}
