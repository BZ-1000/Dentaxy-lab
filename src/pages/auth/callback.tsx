
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const url = new URL(window.location.href);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = url.searchParams;

        // 1) Handle explicit OAuth errors from provider
        const oauthError = queryParams.get('error_description') || queryParams.get('error');
        if (oauthError) {
          console.error('OAuth error:', oauthError);
          toast.error(`Error de autenticación: ${oauthError}`);
          navigate('/auth/login');
          return;
        }

        // 2) PKCE flow: exchange authorization code for session if present
        const code = queryParams.get('code');
        if (code) {
          try {
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) throw error;
            if (data?.session) {
              toast.success('¡Autenticación exitosa!');
              navigate('/app', { replace: true });
              return;
            }
          } catch (err: any) {
            console.error('Error al intercambiar el código PKCE:', err);
            toast.error('No se pudo completar la autenticación (PKCE).');
            navigate('/auth/login');
            return;
          }
        }

        // 3) Implicit flow (hash tokens) or previously processed session
        const { data: sessionResult, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Error al obtener la sesión:', sessionError);
          toast.error('Error al procesar la autenticación');
          navigate('/auth/login');
          return;
        }

        if (sessionResult?.session) {
          toast.success('¡Autenticación exitosa!');
          navigate('/app', { replace: true });
          return;
        }

        if (hashParams.get('access_token')) {
          // Give supabase a moment to persist the hash tokens
          setTimeout(async () => {
            const { data: refreshed } = await supabase.auth.getSession();
            if (refreshed?.session) {
              toast.success('¡Autenticación exitosa!');
              navigate('/app', { replace: true });
            } else {
              console.error('No se pudo obtener la sesión después del callback (hash)');
              toast.error('Error durante la autenticación');
              navigate('/auth/login');
            }
          }, 600);
          return;
        }

        // 4) Nothing useful found
        console.error('No se encontró información de autenticación en la URL');
        toast.error('Enlace de autenticación inválido');
        navigate('/auth/login');
      } catch (err) {
        console.error('Error en el callback de autenticación:', err);
        toast.error('Error inesperado durante la autenticación');
        navigate('/auth/login');
      }
    };

    handleAuthCallback();
  }, [navigate, location]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-800 to-black">
      <div className="text-center text-white">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-xl">Verificando autenticación...</p>
      </div>
    </div>
  );
}
