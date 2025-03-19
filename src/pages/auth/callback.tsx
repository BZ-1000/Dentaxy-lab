
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay un hash en la URL (#access_token=...)
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error al obtener la sesión:', error);
          navigate('/auth/login');
          return;
        }
        
        if (data?.session) {
          // El usuario está autenticado, redirigir al dashboard
          navigate('/app');
        } else {
          // No hay sesión, redirigir al login
          navigate('/auth/login');
        }
      } catch (err) {
        console.error('Error en el callback de autenticación:', err);
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
