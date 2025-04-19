
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Error al iniciar sesión:', error);
        
        // Mensajes específicos para diferentes errores
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Credenciales inválidas. Por favor verifica tu email y contraseña.');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Email no confirmado. Por favor verifica tu bandeja de entrada para confirmar tu email.');
        } else {
          toast.error(`Error al iniciar sesión: ${error.message}`);
        }
      } else if (data.session) {
        toast.success('¡Inicio de sesión exitoso!');
        navigate('/app');
      }
    } catch (error: any) {
      console.error('Error inesperado:', error);
      toast.error(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      console.log("Google redirect URL:", redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        }
      });

      if (error) {
        console.error('Error al iniciar sesión con Google:', error);
        toast.error(`Error al iniciar sesión con Google: ${error.message}`);
      } else {
        toast.success('Redirigiendo a Google para iniciar sesión...');
      }
    } catch (error: any) {
      console.error('Error inesperado:', error);
      toast.error(error.message || 'Error al iniciar sesión con Google');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-sm bg-white/95 shadow-lg border border-gray-100">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-gray-800">Iniciar Sesión</CardTitle>
            <CardDescription className="text-gray-600">
              Ingresa tus credenciales para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-700">Contraseña</Label>
                    <Link 
                      to="/auth/reset-password" 
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </div>
            </form>
            <div className="relative flex items-center justify-center">
              <div className="h-px flex-1 bg-gray-200"></div>
              <span className="mx-4 text-sm text-gray-500">o continúa con</span>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center gap-3 py-6"
              onClick={handleGoogleLogin}
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-gray-800 font-medium text-base">Iniciar sesión con Google</span>
            </Button>
          </CardContent>
          <CardFooter className="text-center">
            <div className="w-full text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link 
                to="/auth/register" 
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Regístrate
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
