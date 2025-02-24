
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      toast.success('¡Cuenta creada exitosamente! Por favor verifica tu email.');
      navigate('/auth/login');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-white/10 bg-black/50 p-6 backdrop-blur-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Crear Cuenta
          </h2>
        </div>

        <form onSubmit={handleRegister} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-white/10 text-white"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 bg-white/10 text-white"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-white text-black hover:bg-white/90"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-black px-2 text-white">O continuar con</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleGoogleRegister}
            className="w-full border border-white/20 bg-transparent text-white hover:bg-white/10"
          >
            <img src="https://www.google.com/favicon.ico" className="mr-2 h-4 w-4" />
            Google
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-white/60">
          ¿Ya tienes una cuenta?{' '}
          <button
            onClick={() => navigate('/auth/login')}
            className="font-medium text-white hover:text-white/90"
          >
            Inicia Sesión
          </button>
        </p>
      </div>
    </div>
  );
}
