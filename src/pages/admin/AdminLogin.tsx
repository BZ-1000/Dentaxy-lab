import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Shield, Fingerprint, Loader2, Eye, EyeOff, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAuthContext } from '@/contexts/AdminAuthContext';
import { useWebAuthn } from '@/hooks/useWebAuthn';
import { toast } from 'sonner';

const AdminLogin: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading, login } = useAdminAuthContext();
  const { isSupported, isAuthenticating, authenticateWithPasskey } = useWebAuthn();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'password' | 'biometric'>('password');

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error('Ingresa usuario y contraseña');
      return;
    }

    setIsSubmitting(true);
    await login(username, password);
    setIsSubmitting(false);
  };

  const handleBiometricLogin = async () => {
    if (!username.trim()) {
      toast.error('Ingresa tu nombre de usuario primero');
      return;
    }

    // Get admin ID by username and authenticate
    const result = await authenticateWithPasskey(username);
    if (result) {
      toast.success('Autenticación biométrica exitosa');
      // The passkey verification would need to also create a session
      // For now, fall back to password after biometric
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 ring-1 ring-blue-500/30"
          >
            <Shield className="h-10 w-10 text-blue-400" />
          </motion.div>
          <h1 className="text-3xl font-bold text-zinc-100">Admin Panel</h1>
          <p className="mt-2 text-sm text-zinc-500">Acceso restringido a administradores</p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-8 backdrop-blur-sm">
          {/* Method Toggle */}
          <div className="mb-6 flex rounded-lg bg-zinc-800/50 p-1">
            <button
              type="button"
              onClick={() => setLoginMethod('password')}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${loginMethod === 'password'
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-zinc-400 hover:text-zinc-300'
                }`}
            >
              <Lock className="mr-2 inline-block h-4 w-4" />
              Contraseña
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('biometric')}
              disabled={!isSupported}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${loginMethod === 'biometric'
                ? 'bg-purple-500/20 text-purple-400'
                : 'text-zinc-400 hover:text-zinc-300'
                } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <Fingerprint className="mr-2 inline-block h-4 w-4" />
              Biométrico
            </button>
          </div>

          <AnimatePresence mode="wait">
            {loginMethod === 'password' ? (
              <motion.form
                key="password"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handlePasswordLogin}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-zinc-400">
                    Usuario
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="BZ.1000"
                      className="border-zinc-700 bg-zinc-800/50 pl-10 text-zinc-100 placeholder:text-zinc-600 focus:bg-zinc-800/80 focus:border-blue-500 focus:ring-blue-500/20"
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-zinc-400">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="border-zinc-700 bg-zinc-800/50 pl-10 pr-10 text-zinc-100 placeholder:text-zinc-600 focus:bg-zinc-800/80 focus:border-blue-500 focus:ring-blue-500/20"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 py-6 text-white hover:from-blue-500 hover:to-blue-400"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Iniciar Sesión
                    </>
                  )}
                </Button>
              </motion.form>
            ) : (
              <motion.div
                key="biometric"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="bio-username" className="text-zinc-400">
                    Usuario
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <Input
                      id="bio-username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="BZ.1000"
                      className="border-zinc-700 bg-zinc-800/50 pl-10 text-zinc-100 placeholder:text-zinc-600 focus:border-purple-500 focus:ring-purple-500/20"
                    />
                  </div>
                </div>

                <div className="rounded-lg bg-purple-500/10 p-4 text-center">
                  <Fingerprint className="mx-auto mb-3 h-12 w-12 text-purple-400" />
                  <p className="text-sm text-zinc-400">
                    Usa tu huella dactilar, Face ID o llave de seguridad para autenticarte
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={handleBiometricLogin}
                  disabled={isAuthenticating || !username.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-500 py-6 text-white hover:from-purple-500 hover:to-purple-400"
                >
                  {isAuthenticating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <Fingerprint className="mr-2 h-4 w-4" />
                      Autenticar con Biométrico
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-zinc-600">
                  Debes registrar una passkey desde el panel de configuración
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 rounded-lg border border-zinc-800/30 bg-zinc-900/30 p-4"
        >
          <p className="text-center text-xs text-zinc-500">
            <span className="font-medium text-zinc-400">🔒 Conexión segura</span>
            <br />
            Después de 5 intentos fallidos, la cuenta se bloqueará por 15 minutos.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
