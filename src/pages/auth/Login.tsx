
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
        toast.error(error.message);
        console.error('Error al iniciar sesión:', error);
      } else if (data.session) {
        toast.success('¡Inicio de sesión exitoso!');
        navigate('/app');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión');
      console.error('Error inesperado:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        toast.error(error.message);
        console.error('Error al iniciar sesión con Google:', error);
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión con Google');
      console.error('Error inesperado:', error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md">
        <Card className="shadow-md border border-gray-100 bg-white">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-gray-800">Iniciar Sesión</CardTitle>
            <CardDescription className="text-gray-600">
              Ingresa tus credenciales para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                    className="border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
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
                    className="border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </div>
            </form>
            <div className="relative flex items-center justify-center">
              <div className="h-px flex-1 bg-gray-200"></div>
              <span className="mx-4 text-sm text-gray-400">o continúa con</span>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            
            {/* Google login button with improved visibility */}
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleGoogleLogin}
              className="w-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 flex items-center justify-center gap-2 py-6 transition-all transform hover:scale-[1.01] shadow-sm"
            >
              <div className="flex items-center">
                <img
                  src="https://www.google.com/favicon.ico"
                  className="h-5 w-5 mr-3"
                  alt="Google"
                />
                <span className="font-medium">Iniciar sesión con Google</span>
              </div>
            </Button>
          </CardContent>
          <CardFooter className="text-center">
            <div className="w-full text-sm">
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
