import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, User, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useShopAuth } from '@/hooks/useShopAuth';
import OrganicShopFrame from '@/components/shop/OrganicShopFrame';

type ModalState = 'none' | 'admin' | 'presale' | 'waitlist';

const ShopLogin = () => {
  const [openModal, setOpenModal] = useState<ModalState>('none');
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useShopAuth();

  // Login State (Admin)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Presale Login State
  const [presaleCode, setPresaleCode] = useState('');
  const [presaleError, setPresaleError] = useState('');
  const [presaleSubmitting, setPresaleSubmitting] = useState(false);

  // Waitlist State
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySubmitting, setNotifySubmitting] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);

  // Contador de inscritos (simulado - en producción vendría del backend)
  const [waitlistCount] = useState(127);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/shop/tienda', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const success = login(username, password);
    if (success) {
      navigate('/shop/tienda', { replace: true });
    } else {
      setError('Credenciales incorrectas');
      setIsSubmitting(false);
    }
  };

  const handlePresaleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPresaleError('');
    setPresaleSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // TODO: Implementar lógica de validación de código de preventa
    setPresaleError('Código de preventa no válido');
    setPresaleSubmitting(false);
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotifySubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setNotifySubmitting(false);
    setNotifySuccess(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 via-emerald-500 to-green-600">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden font-sans selection:bg-white/20 selection:text-white flex flex-col bg-gradient-to-br from-teal-400 via-emerald-500 to-green-600">

      {/* Componente de Marco Orgánico Global */}
      <OrganicShopFrame
        onHomeClick={() => navigate('/')}
        onAdminClick={() => setOpenModal('admin')}
        waitlistCount={waitlistCount}
      />

      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 -left-48 w-96 h-96 bg-teal-300/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-0 -right-48 w-[30rem] h-[30rem] bg-emerald-300/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-br from-teal-200/20 to-emerald-200/20 rounded-full blur-3xl"
        />
      </div>

      {/* Giant Background Typography - REDUCED SIZE */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 select-none overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="text-[18vw] font-black text-white tracking-tighter leading-none whitespace-nowrap blur-sm"
        >
          DENTAXY
        </motion.h1>
      </div>

      {/* Main Content Area - Full Screen Centered Lower */}
      <div className="relative z-10 w-full h-screen flex flex-col items-center justify-center px-6 pt-20">

        {/* Title Group - Reorganized */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center mb-12 space-y-2"
        >
          <div className="flex items-center justify-center gap-4 opacity-100 mb-2">
            <span className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-white text-sm font-bold tracking-widest uppercase border border-white/20">
              Official Store
            </span>
          </div>

          <h2 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white drop-shadow-2xl">
            Shop
          </h2>

          <p className="text-white/90 text-lg md:text-xl font-light tracking-wide max-w-xl mx-auto mt-6 leading-relaxed">
            Sistema de Suministro Inteligente<br />
            <span className="font-semibold text-white">para Profesionales</span>
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col gap-4 w-full max-w-sm items-center"
        >
          {/* Preventa - Primary Action */}
          <Button
            onClick={() => setOpenModal('presale')}
            className="w-full h-16 bg-white text-emerald-700 hover:bg-neutral-50 rounded-[2rem] text-lg font-bold tracking-wide shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <ShieldCheck className="mr-3 w-6 h-6" />
            Acceso a Preventa
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* Waitlist - Secondary Action */}
          <Button
            onClick={() => setOpenModal('waitlist')}
            className="w-full h-14 bg-emerald-900/30 backdrop-blur-md text-white hover:bg-emerald-900/50 border border-white/20 hover:border-white/40 rounded-[2rem] text-sm font-medium transition-all duration-300"
          >
            <Mail className="mr-2 w-4 h-4" />
            Notificarme Disponibilidad
          </Button>
        </motion.div>
      </div>

      {/* MODAL OVERLAYS */}
      <AnimatePresence mode="wait">

        {/* ADMIN LOGIN MODAL */}
        {openModal === 'admin' && (
          <motion.div
            key="admin-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpenModal('none')}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white/95 backdrop-blur-2xl border border-white/40 p-10 md:p-12 rounded-3xl shadow-2xl shadow-black/10 relative"
            >
              <button
                onClick={() => setOpenModal('none')}
                className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-neutral-900 transition-colors rounded-full hover:bg-neutral-50"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 mb-4">
                  <User className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Acceso Administrativo</h3>
                <p className="text-neutral-500 text-sm">Credenciales autorizadas únicamente</p>
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-5">
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-14 px-6 bg-neutral-50 border-neutral-200 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 rounded-2xl text-base transition-all"
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 px-6 bg-neutral-50 border-neutral-200 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 rounded-2xl text-base transition-all"
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600 text-sm text-center font-medium">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-2xl text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {isSubmitting ? 'Verificando...' : 'Iniciar Sesión'}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* PRESALE MODAL */}
        {openModal === 'presale' && (
          <motion.div
            key="presale-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpenModal('none')}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white/95 backdrop-blur-2xl border border-white/40 p-10 md:p-12 rounded-3xl shadow-2xl shadow-black/10 relative"
            >
              <button
                onClick={() => {
                  setOpenModal('none');
                  setPresaleCode('');
                  setPresaleError('');
                }}
                className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-neutral-900 transition-colors rounded-full hover:bg-neutral-50"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 mb-4">
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Acceso a Preventa</h3>
                <p className="text-neutral-500 text-sm">Ingresa tu código de acceso exclusivo</p>
              </div>

              <form onSubmit={handlePresaleSubmit} className="space-y-6">
                <Input
                  type="text"
                  placeholder="CÓDIGO-PREVENTA-XXXX"
                  value={presaleCode}
                  onChange={(e) => setPresaleCode(e.target.value.toUpperCase())}
                  className="h-14 px-6 bg-neutral-50 border-neutral-200 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 rounded-2xl text-base font-mono tracking-wider text-center transition-all"
                  required
                />

                {presaleError && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-amber-700 text-sm text-center font-medium">{presaleError}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={presaleSubmitting}
                  className="w-full h-14 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-2xl text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {presaleSubmitting ? 'Validando...' : 'Validar Código'}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-neutral-200">
                <p className="text-xs text-neutral-400 text-center">
                  ¿No tienes código? Contacta a tu representante Dentaxy o regístrate en la lista de espera.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* WAITLIST MODAL */}
        {openModal === 'waitlist' && (
          <motion.div
            key="waitlist-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpenModal('none')}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white/95 backdrop-blur-2xl border border-white/40 p-10 md:p-12 rounded-3xl shadow-2xl shadow-black/10 relative"
            >
              <button
                onClick={() => {
                  setOpenModal('none');
                  setNotifySuccess(false);
                  setNotifyEmail('');
                }}
                className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-neutral-900 transition-colors rounded-full hover:bg-neutral-50"
              >
                <X className="w-6 h-6" />
              </button>

              {!notifySuccess ? (
                <>
                  <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 mb-4">
                      <Mail className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900 mb-2">Lista de Espera</h3>
                    <p className="text-neutral-500 text-sm">Sé el primero en saber cuando lancemos oficialmente</p>
                  </div>

                  <form onSubmit={handleWaitlistSubmit} className="space-y-6">
                    <Input
                      type="email"
                      placeholder="tu@correo.com"
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      className="h-14 px-6 bg-neutral-50 border-neutral-200 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 rounded-2xl text-base transition-all"
                      required
                    />

                    <Button
                      type="submit"
                      disabled={notifySubmitting}
                      className="w-full h-14 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-2xl text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      {notifySubmitting ? 'Registrando...' : 'Unirme a la Lista'}
                    </Button>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-4xl shadow-lg">
                    ✓
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-3">¡Listo!</h3>
                  <p className="text-neutral-600 mb-8 text-sm leading-relaxed">
                    Te hemos agregado a la lista de espera.<br />
                    Te notificaremos cuando Dentaxy Shop esté disponible.
                  </p>
                  <Button
                    onClick={() => setOpenModal('none')}
                    variant="ghost"
                    className="text-neutral-700 hover:bg-neutral-100 rounded-xl px-6"
                  >
                    Cerrar
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default ShopLogin;
