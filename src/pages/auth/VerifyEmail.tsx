
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token_hash') || params.get('token');
        const type = params.get('type') || 'email';
        
        console.log('Verification params:', { token, type });
        
        if (!token) {
          setError('Enlace de verificación inválido. Por favor, solicita un nuevo correo de verificación.');
          setVerifying(false);
          return;
        }

        // For the VerifyEmail page, we just show the confirmation UI
        // and let the user decide when to proceed to the actual verification
        setVerifying(false);
      } catch (error: any) {
        console.error('Error de verificación:', error);
        setError(error.message);
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [location.search]);

  const handleConfirmEmail = () => {
    // Get the token and type from the URL
    const params = new URLSearchParams(location.search);
    const token = params.get('token_hash') || params.get('token');
    const type = params.get('type') || 'email';
    
    // Redirect to the callback URL with the token and type
    navigate(`/auth/callback?token_hash=${token}&type=${type}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-800 to-black p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-white/10 bg-black/50 p-8 backdrop-blur-xl text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Dental Basics Academy IA</h1>
          <h2 className="text-2xl font-semibold mb-6">Verificación de Correo</h2>
          
          {verifying ? (
            <div className="flex flex-col items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-blue-500"></div>
              <p className="mt-4">Verificando tu correo electrónico...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-xl font-medium mt-2">Error de Verificación</h3>
              </div>
              <p className="mb-6">{error}</p>
              <Button onClick={() => navigate('/auth/login')} className="bg-white text-black hover:bg-white/90">
                Volver al Inicio de Sesión
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-blue-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-medium mt-2">Confirma tu Correo Electrónico</h3>
              </div>
              <p className="mb-6">Estás a un paso de completar la verificación de tu correo electrónico.</p>
              <Button onClick={handleConfirmEmail} className="bg-blue-500 text-white hover:bg-blue-600 mb-4 w-full">
                Confirmar mi Correo
              </Button>
              <p className="text-sm opacity-80">Al confirmar, verificarás tu cuenta y podrás acceder a todas las funcionalidades de Dental Basics Academy IA.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
