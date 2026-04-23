/**
 * @deprecated OBSOLETO — Este componente ya no está registrado en las rutas de App.tsx.
 * El login activo del panel Admin se encuentra en: `pages/admin/LoginPage.tsx`
 * Pendiente de eliminación en el siguiente sprint de limpieza.
 * Última revisión: Abril 2026
 */
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Shield, Fingerprint, Loader2, Lock, User, CheckCircle2, AlertCircle, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAuthContext } from '@/contexts/AdminAuthContext';
import { useWebAuthn } from '@/hooks/useWebAuthn';
import { toast } from 'sonner';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, login } = useAdminAuthContext();
  const { isSupported, isAuthenticating, authenticateWithPasskey } = useWebAuthn();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'password' | 'biometric'>('password');
  const [error, setError] = useState<string | null>(null);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-900" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('Credenciales incompletas');
      return;
    }

    setIsSubmitting(true);
    // No artificial delay needed

    const success = await login(username, password);
    if (!success) {
      setError('Credenciales inválidas. Acceso denegado.');
      setIsSubmitting(false);
    } else {
      // Usar navigate para mantener el estado de la aplicación (SPA)
      navigate('/admin/dashboard');
    }
  };

  const handleBiometricLogin = async () => {
    if (!username.trim()) {
      setError('Identificación requerida para biometría');
      return;
    }
    setError(null);

    const result = await authenticateWithPasskey(username);
    if (result) {
      toast.success('Acceso autorizado por biometría');
    } else {
      setError('No se pudo verificar la identidad.');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fafafa] p-4 font-sans text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* Background Decor */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute -left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-blue-100/40 to-purple-100/40 blur-[100px]" />
        <div className="absolute -right-[10%] bottom-[20%] h-[500px] w-[500px] rounded-full bg-gradient-to-bl from-emerald-100/40 to-sky-100/40 blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.02] mix-blend-multiply" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Glass Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] backdrop-blur-xl">
          {/* Header */}
          <div className="px-8 pt-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-50 to-white shadow-sm ring-1 ring-black/5"
            >
              <Command className="h-8 w-8 text-zinc-900" />
            </motion.div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Dentaxy Admin</h1>
            <p className="mt-2 text-sm text-zinc-500">Network Controller Access</p>
          </div>

          <div className="p-8">
            {/* Method Toggle */}
            <div className="mb-8 flex rounded-xl bg-zinc-100/80 p-1">
              <button
                type="button"
                onClick={() => setLoginMethod('password')}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold uppercase tracking-wide transition-all ${loginMethod === 'password'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
                  }`}
              >
                Acceso Manual
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('biometric')}
                disabled={!isSupported}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold uppercase tracking-wide transition-all ${loginMethod === 'biometric'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
                  } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                Biometría
              </button>
            </div>

            <AnimatePresence mode="wait">
              {loginMethod === 'password' ? (
                <motion.form
                  key="password"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handlePasswordLogin}
                  className="space-y-4"
                >
                  <div className="space-y-4">
                    <div className="group relative">
                      <Label htmlFor="username" className="mb-1.5 block text-xs font-medium text-zinc-500">
                        IDENTIFICADOR
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-zinc-900" />
                        <Input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="ID de Operador"
                          className="h-11 border-zinc-200 bg-white/50 pl-10 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:ring-4 focus:ring-zinc-100"
                          autoComplete="username"
                        />
                      </div>
                    </div>

                    <div className="group relative">
                      <Label htmlFor="password" className="mb-1.5 block text-xs font-medium text-zinc-500">
                        LLAVE DE ACCESO
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-zinc-900" />
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="h-11 border-zinc-200 bg-white/50 pl-10 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:ring-4 focus:ring-zinc-100"
                          autoComplete="current-password"
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-600"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="group mt-2 w-full overflow-hidden bg-zinc-900 py-6 text-white transition-all hover:bg-zinc-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <span className="relative z-10 flex items-center gap-2 font-medium">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          VERIFICANDO...
                        </>
                      ) : (
                        <>
                          INICIAR SESIÓN
                          <Shield className="h-4 w-4 opacity-70 transition-opacity group-hover:opacity-100" />
                        </>
                      )}
                    </span>
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="biometric"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="group relative">
                    <Label htmlFor="bio-username" className="mb-1.5 block text-xs font-medium text-zinc-500">
                      IDENTIFICADOR
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-zinc-900" />
                      <Input
                        id="bio-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="ID de Operador"
                        className="h-11 border-zinc-200 bg-white/50 pl-10 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:ring-4 focus:ring-zinc-100"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-100 bg-zinc-50/50 py-8">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 animate-pulse rounded-full bg-blue-500/10 blur-xl" />
                      <Fingerprint className="relative h-16 w-16 text-zinc-900" strokeWidth={1} />
                    </div>
                    <p className="max-w-[200px] text-center text-xs text-zinc-500">
                      Autenticación segura mediante hardware de dispositivo
                    </p>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-600"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </motion.div>
                  )}

                  <Button
                    type="button"
                    onClick={handleBiometricLogin}
                    disabled={isAuthenticating || !username.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-6 text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:shadow-blue-500/30"
                  >
                    {isAuthenticating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Fingerprint className="mr-2 h-4 w-4" />
                    )}
                    {isAuthenticating ? 'ESCANEANDO...' : 'ESCANEAR BIOMÉTRICO'}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Status */}
          <div className="border-t border-zinc-100 bg-zinc-50/50 px-8 py-4 text-center">
            <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider text-zinc-400">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              System Operational
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-zinc-400">
          © 2026 Dentaxy Technologies Inc.
          <br />
          Todos los accesos son monitoreados.
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
