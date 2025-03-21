
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        toast.error(error.message);
        console.error('Error al registrarse:', error);
      } else {
        toast.success('¡Registro exitoso! Por favor, verifica tu correo electrónico.');
        navigate('/auth/verify-email', { state: { email } });
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al registrarse');
      console.error('Error inesperado:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
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
        console.error('Error al registrarse con Google:', error);
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al registrarse con Google');
      console.error('Error inesperado:', error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-sm bg-white shadow-xl border border-gray-100">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">Crear Cuenta</CardTitle>
            <CardDescription className="text-gray-600">
              Ingresa tus datos para crear una nueva cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleRegister}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white border-gray-300"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white border-gray-300"
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700">Confirmar Contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white border-gray-300"
                    required
                    minLength={6}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading}
                >
                  {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
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
              className="w-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 flex items-center justify-center"
              onClick={handleGoogleRegister}
            >
              <div className="flex items-center">
                <img src="https://www.google.com/favicon.ico" className="mr-2 h-5 w-5" alt="Google logo" />
                <span className="font-medium">Registrarse con Google</span>
              </div>
            </Button>
          </CardContent>
          <CardFooter className="text-center">
            <div className="w-full text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link 
                to="/auth/login" 
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
              >
                Iniciar Sesión
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
