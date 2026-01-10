import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Fingerprint, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const AdminLogin: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // If user is logged in, redirect to dashboard (AdminLayout will check admin status)
  if (user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-8"
      >
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">
            <Shield className="h-8 w-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">Admin Panel</h1>
          <p className="mt-2 text-sm text-zinc-500">Acceso restringido a administradores</p>
        </div>

        <div className="mt-8 space-y-4">
          <Button
            variant="outline"
            className="w-full gap-3 border-zinc-700 bg-zinc-800/50 py-6 text-zinc-100 hover:bg-zinc-800"
            onClick={() => window.location.href = '/app'}
          >
            <Fingerprint className="h-5 w-5" />
            Iniciar sesión para acceder
          </Button>
          
          <p className="text-center text-xs text-zinc-600">
            Requiere cuenta con rol de administrador
          </p>
        </div>

        <div className="mt-8 rounded-lg bg-zinc-800/30 p-4">
          <p className="text-xs text-zinc-500">
            <span className="font-medium text-zinc-400">Nota:</span> El acceso biométrico (WebAuthn/Passkeys) estará disponible después de la configuración inicial.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
