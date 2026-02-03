import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, User, ShieldCheck, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useShopAuth } from '@/hooks/useShopAuth';
import OrganicShopFrame from '@/components/shop/OrganicShopFrame';

type ModalState = 'none' | 'admin' | 'presale' | 'waitlist';

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

  // Waitlist State
  const [email, setEmail] = useState('');
  const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  // Simulated count
  const [waitlistCount] = useState(127);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/shop/tienda', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);
    // Simulate network delay
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

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWaitlistSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setWaitlistSubmitting(false);
    setWaitlistSuccess(true);
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen w-full relative bg-[#F5F5F7] overflow-hidden font-sans selection:bg-emerald-500/20 selection:text-emerald-900">

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-emerald-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[35vw] h-[35vw] bg-blue-100/40 rounded-full blur-[100px]" />
      </div>

      <OrganicShopFrame
        onHomeClick={() => navigate('/')}
        onAdminClick={() => setOpenModal('admin')}
        waitlistCount={waitlistCount}
      />

      {/* Main Content */}
      <main className="relative z-10 h-screen w-full flex flex-col items-center justify-center p-6">

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center text-center space-y-12 max-w-2xl"
        >
          {/* Brand Logo / Icon */}
          <div className="w-24 h-24 bg-white rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] flex items-center justify-center mb-4">
            <img
              src="/brand/dentaxy-icon-solid.webp"
              alt="Dentaxy"
              className="w-12 h-12 object-contain"
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900">
              Dentaxy<span className="text-neutral-400">.Shop</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-500 font-light max-w-md mx-auto leading-relaxed">
              La plataforma exclusiva de suministros para la nueva generación de odontólogos.
            </p>
          </div>

          {/* Action Cards */}
          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg mt-8">
            <button
              onClick={() => setOpenModal('presale')}
              className="flex-1 group bg-white hover:bg-neutral-50 border border-neutral-200 p-6 rounded-3xl text-left shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-neutral-900 text-lg">Preventa</h3>
              <p className="text-sm text-neutral-500 mt-1">Acceso anticipado con código</p>
            </button>

            <button
              onClick={() => setOpenModal('waitlist')}
              className="flex-1 group bg-white hover:bg-neutral-50 border border-neutral-200 p-6 rounded-3xl text-left shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-neutral-900 text-lg">Lista de Espera</h3>
              <p className="text-sm text-neutral-500 mt-1">Notifícame el lanzamiento</p>
            </button>
          </div>

        </motion.div>
      </main>

      {/* MODALS */}
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

              {/* Modal Content Switcher */}
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

              {openModal === 'waitlist' && (
                <div className="space-y-6">
                  {!waitlistSuccess ? (
                    <>
                      <div className="text-center space-y-2">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Mail className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-900">Lista de Espera</h2>
                        <p className="text-neutral-500 text-sm">Recibe noticias exclusivas</p>
                      </div>

                      <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                        <Input
                          type="email"
                          placeholder="tu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12 rounded-xl bg-white/50 border-neutral-200"
                          required
                        />

                        <Button
                          type="submit"
                          disabled={waitlistSubmitting}
                          className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-200"
                        >
                          {waitlistSubmitting ? 'Registrando...' : 'Unirme'}
                        </Button>
                      </form>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ArrowRight className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-neutral-900">¡Suscrito!</h3>
                      <p className="text-neutral-500 mt-2 text-sm">Te mantendremos informado.</p>
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}


