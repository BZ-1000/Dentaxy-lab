import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Lock, User, AlertCircle, ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useShopAuth } from '@/hooks/useShopAuth';

const ShopLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useShopAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/shop/tienda', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // UX Delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const success = login(username, password);

    if (success) {
      navigate('/shop/tienda', { replace: true });
    } else {
      setError('Credenciales incorrectas');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-white font-sans selection:bg-emerald-100 selection:text-emerald-900">

      {/* Left Column - Login Area */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-center items-center px-8 sm:px-12 lg:px-16 xl:px-24 relative bg-white">

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 rounded-full px-4 py-2 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="font-medium text-sm">Volver</span>
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md space-y-10"
        >
          {/* Header */}
          <div className="space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center justify-center lg:justify-start w-full lg:w-auto">
              <span className="text-2xl font-bold tracking-tight text-neutral-900">Dentaxy Shop</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 tracking-tight leading-tight">
              Bienvenido de nuevo
            </h1>
            <p className="text-neutral-500 text-lg leading-relaxed">
              Ingresa tus credenciales para acceder al portal de compras exclusivo.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="group">
                <label className="block text-sm font-medium text-neutral-700 mb-2 ml-1">Usuario</label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-14 px-5 bg-neutral-50 border border-transparent focus:bg-white focus:border-neutral-200 focus:ring-4 focus:ring-neutral-100 text-neutral-900 text-base rounded-2xl transition-all duration-200"
                  required
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-neutral-700 mb-2 ml-1">Contraseña</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 px-5 bg-neutral-50 border border-transparent focus:bg-white focus:border-neutral-200 focus:ring-4 focus:ring-neutral-100 text-neutral-900 text-base rounded-2xl transition-all duration-200"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-2 text-red-600 text-sm font-medium pt-2"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-neutral-900 hover:bg-black text-white font-medium text-base rounded-2xl transition-all duration-300 shadow-xl shadow-neutral-900/10 active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                    <span>Procesando...</span>
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </div>
          </form>

          <p className="text-center lg:text-left text-xs text-neutral-400 mt-8">
            © 2026 Dentaxy Technologies. Acceso privado.
          </p>
        </motion.div>
      </div>

      {/* Right Column - Visual Teaser */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] relative bg-neutral-100 overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src="/home/bz1000/.gemini/antigravity/brain/f18b4913-f7f3-41be-98ed-a40fa9e1d004/dentaxy_light_premium_supplies_1769752919665.png"
            alt="Dentaxy Premium"
            className="w-full h-full object-cover"
          />
          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 p-16 z-10 text-white">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-xl"
          >
            <div className="inline-block px-3 py-1 mb-6 border border-white/30 rounded-full backdrop-blur-md bg-white/10">
              <span className="text-xs font-semibold tracking-wider uppercase">Próximamente</span>
            </div>
            <h2 className="text-4xl xl:text-5xl font-semibold leading-tight mb-6 tracking-tight">
              Preparando la excelencia para tu consulta.
            </h2>
            <p className="text-lg text-white/90 font-light leading-relaxed max-w-lg">
              Estamos curando meticulosamente una selección de insumos dentales de la más alta calidad y estándares globales.
            </p>
          </motion.div>
        </div>
      </div>

    </div>
  );
};

export default ShopLogin;
