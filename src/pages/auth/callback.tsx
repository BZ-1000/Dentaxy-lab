
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback processing for Dentaxy.com...");
        setProcessing(true);
        
        // Check if we need to get the session (for OAuth providers)
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error al obtener la sesión:', error);
          setError('Error al procesar la autenticación');
          toast.error('Error al procesar la autenticación');
          setTimeout(() => navigate('/auth/login'), 2000);
          return;
        }
        
        if (data?.session) {
          // The user is authenticated, check for redirect URL or go to app
          const redirectPath = localStorage.getItem('redirectAfterLogin') || '/app';
          localStorage.removeItem('redirectAfterLogin'); // Clear stored path
          
          console.log("Authentication successful, redirecting to:", redirectPath);
          toast.success('¡Autenticación exitosa!');
          navigate(redirectPath, { replace: true });
          return;
        }
        
        // Try to exchange the code if there's no session yet
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        if (hashParams.get('access_token') || queryParams.get('code')) {
          // There's an access token or auth code in the URL, Supabase should be processing it
          console.log('Procesando autenticación con código/token...');
          
          // Wait for Supabase to process the auth
          setTimeout(async () => {
            const { data: sessionData } = await supabase.auth.getSession();
            if (sessionData?.session) {
              const redirectPath = localStorage.getItem('redirectAfterLogin') || '/app';
              localStorage.removeItem('redirectAfterLogin');
              
              toast.success('¡Autenticación exitosa!');
              navigate(redirectPath, { replace: true });
            } else {
              console.error('No se pudo obtener la sesión después del callback');
              setError('Error durante la autenticación');
              toast.error('Error durante la autenticación');
              navigate('/auth/login', { replace: true });
            }
            setProcessing(false);
          }, 1500);
        } else {
          // No session and no access token in URL, redirect to login
          console.error('No se encontró información de autenticación');
          setError('Enlace de autenticación inválido');
          toast.error('Enlace de autenticación inválido');
          setTimeout(() => navigate('/auth/login', { replace: true }), 2000);
          setProcessing(false);
        }
      } catch (err) {
        console.error('Error en el callback de autenticación:', err);
        setError('Error inesperado durante la autenticación');
        toast.error('Error inesperado durante la autenticación');
        setTimeout(() => navigate('/auth/login', { replace: true }), 2000);
        setProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate, location]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-800 to-black">
      <div className="text-center text-white max-w-md px-4">
        {processing ? (
          <>
            <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-xl">Verificando autenticación...</p>
            <p className="mt-2 text-sm text-blue-300">Esto solo tomará un momento</p>
          </>
        ) : error ? (
          <>
            <div className="w-16 h-16 text-red-500 mx-auto">❌</div>
            <p className="mt-4 text-xl">{error}</p>
            <p className="mt-2 text-sm text-blue-300">Redirigiendo...</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 text-green-500 mx-auto">✓</div>
            <p className="mt-4 text-xl">¡Autenticación exitosa!</p>
            <p className="mt-2 text-sm text-blue-300">Redirigiendo a la aplicación...</p>
          </>
        )}
      </div>
    </div>
  );
}
