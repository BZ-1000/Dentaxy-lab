import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, User, ShieldCheck, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useShopAuth } from '@/hooks/useShopAuth';
import OrganicShopFrame from '@/components/shop/OrganicShopFrame';
import WaitlistMasterModal from '@/components/waitlist/WaitlistMasterModal';

type ModalState = 'none' | 'admin' | 'presale';

// Animation Variants (Seed Style)
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

export default function ShopLogin() {
  const [openModal, setOpenModal] = useState<ModalState>('none');
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useShopAuth();

  // Login State (Admin)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Presale State
  const [presaleCode, setPresaleCode] = useState('');
  const [presaleError, setPresaleError] = useState('');
  const [presaleSubmitting, setPresaleSubmitting] = useState(false);

  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistCount] = useState(128);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/shop/tienda', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    const success = login(username, password);
    if (success) {
      navigate('/shop/tienda', { replace: true });
    } else {
      setAuthError('Credenciales no reconocidas.');
      setIsSubmitting(false);
    }
  };

  const handlePresaleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPresaleError('');
    setPresaleSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPresaleError('Código inválido o expirado.');
    setPresaleSubmitting(false);
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen w-full relative bg-[#F5F5F7] overflow-hidden font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      <div className="absolute inset-0 bg-white pointer-events-none" />

      <WaitlistMasterModal isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} preselectedModule="Shop" />
      <OrganicShopFrame
        onHomeClick={() => navigate('/')}
        onAdminClick={() => setOpenModal('admin')}
        waitlistCount={waitlistCount}
      />

      <main className="relative z-10 min-h-screen w-full flex flex-col items-center justify-center p-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col items-center text-center space-y-12 max-w-3xl"
        >
          <div className="space-y-8 flex flex-col items-center">
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-3 px-4 py-2 bg-neutral-50 border border-neutral-100 rounded-full shadow-sm"
            >
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center overflow-hidden">
                    <User className="w-3 h-3 text-neutral-400" />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <p className="text-sm font-medium text-neutral-600">
                  <span className="text-neutral-900 font-bold">{waitlistCount}</span> en espera
                </p>
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-6xl md:text-8xl font-bold tracking-tighter text-neutral-900 font-sans leading-tight"
            >
              Dentaxy<span className="text-emerald-500">.Shop</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-neutral-500 font-light max-w-lg mx-auto leading-relaxed"
            >
              Suministros inteligentes para la odontología moderna.
            </motion.p>
          </div>

          <motion.div
            variants={staggerContainer}
            className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl mt-8"
          >
            <motion.button
              variants={scaleIn}
              onClick={() => setOpenModal('presale')}
              className="flex-1 group relative bg-white border border-neutral-100 p-6 rounded-3xl text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-12px_rgba(16,185,129,0.2)] transition-all duration-500 hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="w-5 h-5 text-emerald-500 -rotate-45" />
              </div>
              <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                <ShieldCheck className="w-7 h-7 text-emerald-600" />
              </div>
              <div className="space-y-1 relative z-10">
                <h3 className="font-bold text-neutral-900 text-xl group-hover:text-emerald-700 transition-colors">Tengo Código</h3>
                <p className="text-sm text-neutral-500">Acceso anticipado a preventa</p>
              </div>
            </motion.button>

            <motion.button
              variants={scaleIn}
              onClick={() => setWaitlistOpen(true)}
              className="flex-1 group relative bg-white border border-neutral-100 p-6 rounded-3xl text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-12px_rgba(37,99,235,0.2)] transition-all duration-500 hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="w-5 h-5 text-blue-500 -rotate-45" />
              </div>
              <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                <Mail className="w-7 h-7 text-blue-600" />
              </div>
              <div className="space-y-1 relative z-10">
                <h3 className="font-bold text-neutral-900 text-xl group-hover:text-blue-700 transition-colors">Lista de Espera</h3>
                <p className="text-sm text-neutral-500">Notificar lanzamiento oficial</p>
              </div>
            </motion.button>
          </motion.div>
        </motion.div>
      </main>

      <AnimatePresence>
        {openModal !== 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-neutral-900/20 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setOpenModal('none')}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/80 backdrop-blur-xl w-full max-w-[400px] p-8 rounded-[2.5rem] shadow-2xl border border-white/50 relative overflow-hidden"
            >
              <button
                onClick={() => setOpenModal('none')}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
              >
                <X className="w-4 h-4 text-neutral-600" />
              </button>

              {openModal === 'admin' && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-14 h-14 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-6 h-6 text-neutral-900" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900">Admin</h2>
                    <p className="text-neutral-500 text-sm">Acceso reservado para administración</p>
                  </div>
                  <form onSubmit={handleAdminSubmit} className="space-y-4">
                    <div className="space-y-3">
                      <Input
                        placeholder="ID de Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="h-12 rounded-xl bg-white/50 border-neutral-200 focus:ring-emerald-500/20"
                      />
                      <Input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 rounded-xl bg-white/50 border-neutral-200 focus:ring-emerald-500/20"
                      />
                    </div>
                    {authError && (
                      <p className="text-xs text-red-500 text-center font-medium bg-red-50 py-2 rounded-lg">
                        {authError}
                      </p>
                    )}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-medium"
                    >
                      {isSubmitting ? 'Verificando...' : 'Acceder'}
                    </Button>
                  </form>
                </div>
              )}

              {openModal === 'presale' && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ShieldCheck className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900">Preventa</h2>
                    <p className="text-neutral-500 text-sm">Introduce tu código de invitación</p>
                  </div>
                  <form onSubmit={handlePresaleSubmit} className="space-y-4">
                    <Input
                      placeholder="XXXX-XXXX-XXXX"
                      className="h-14 text-center text-lg font-mono tracking-widest uppercase rounded-xl bg-white/50 border-neutral-200"
                      value={presaleCode}
                      onChange={(e) => setPresaleCode(e.target.value)}
                    />
                    {presaleError && (
                      <p className="text-xs text-amber-600 text-center bg-amber-50 py-2 rounded-lg font-medium">
                        {presaleError}
                      </p>
                    )}
                    <Button
                      type="submit"
                      disabled={presaleSubmitting}
                      className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg shadow-emerald-200"
                    >
                      {presaleSubmitting ? 'Validando...' : 'Canjear Código'}
                    </Button>
                  </form>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
