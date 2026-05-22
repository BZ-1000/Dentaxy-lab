/**
 * SeedLogin.tsx — Dentaxy Seed V2
 * Flujo de acceso:
 *  1. Usuario ingresa el código universal de preventa
 *  2. Se solicita autenticación vía Google (para obtener identidad + permisos de Drive)
 *  3. Acceso concedido al SeedLanding/Workspace
 */
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Mail, ArrowRight, X, Lock,
  KeyRound, CheckCircle2, Loader2, Sparkles,
  ChevronRight, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import WaitlistMasterModal from '@/components/waitlist/WaitlistMasterModal';
import { supabase } from '@/integrations/supabase/client';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore, DoctorProfile } from '@/store/useAuthStore';
import { toast } from 'sonner';
import SeedEcosystemLoader from '@/components/seed/SeedEcosystemLoader';
import "./Seed.css";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────────────────────

const WAITLIST_COUNT = 843;

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const scaleIn = { hidden: { opacity: 0, scale: 0.93 }, visible: { opacity: 1, scale: 1 } };

// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE USER MOCK TYPE
// ─────────────────────────────────────────────────────────────────────────────

interface GoogleUser extends DoctorProfile {}

// ─────────────────────────────────────────────────────────────────────────────
// (StepCodigo removed as per user request)
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — GOOGLE SIGN IN
// ─────────────────────────────────────────────────────────────────────────────

const StepGoogle: React.FC<{ onNext: (user: GoogleUser) => void }> = ({ onNext }) => {
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoResponse.json();
        
        const user: GoogleUser = {
          name: userInfo.name || userInfo.given_name,
          email: userInfo.email,
          picture: userInfo.picture,
          googleAccessToken: tokenResponse.access_token
        };
        
        onNext(user);
      } catch (err) {
        console.error('Error fetching user info:', err);
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google Sign-In Error:', error);
      toast.error('Error al conectar con Google', { description: 'Revisa tu conexión o intenta nuevamente.' });
      setLoading(false);
    },
    onNonOAuthError: (error) => {
      console.error('Google Non-OAuth Error (e.g. popup closed):', error);
      toast.error('Autenticación cancelada', { description: 'El panel de Google fue cerrado o bloqueado por el navegador.' });
      setLoading(false);
    },
    scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/calendar.events',
  });

  const handleGoogle = () => {
    setLoading(true);
    login();
  };

  return (
    <motion.div
      initial="hidden" animate="visible" exit={{ opacity: 0, y: -16 }}
      variants={stagger}
      className="space-y-8 flex flex-col items-center text-center max-w-md w-full"
    >
      {/* Eliminado el check de preventa verificado */}

      {/* Google Logo + Texto */}
      <motion.div variants={fadeUp} className="space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Conecta tu <span className="gradient-text">Google Account</span>
        </h2>
        <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
          Tu cuenta de Google es el corazón de tu Dentaxy Seed. Tus expedientes se organizarán
          automáticamente en <strong className="text-blue-600">tu propia Google Drive</strong>, con total privacidad y soberanía de tus datos.
        </p>
      </motion.div>

      {/* Permisos que pedimos explicados */}
      <motion.div variants={fadeUp} className="w-full space-y-2">
        {[
          { label: 'Tu nombre y foto de perfil', sub: 'Para personalizar tu espacio de trabajo' },
          { label: 'Acceso a archivos de Drive (solo los de Dentaxy)', sub: 'Nunca vemos archivos de tu Drive previos' },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 text-left px-4 py-3 rounded-xl bg-blue-50/60 border border-blue-100">
            <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-500">{item.sub}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* CTA Google */}
      <motion.div variants={fadeUp} className="w-full">
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full h-14 rounded-2xl bg-white border-2 border-neutral-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100 text-gray-700 font-bold text-base flex items-center justify-center gap-3 transition-all duration-300"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          ) : (
            <>
              {/* Google SVG Logo */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuar con Google
            </>
          )}
        </button>
        <p className="text-xs text-gray-400 mt-3">
          {loading ? 'Conectando con Google...' : 'Se te pedirán permisos de forma segura en una ventana de Google.'}
        </p>
      </motion.div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — BIENVENIDA PERSONALIZADA
// ─────────────────────────────────────────────────────────────────────────────

const StepBienvenida: React.FC<{ user: GoogleUser; onEnter: () => void }> = ({ user, onEnter }) => (
  <motion.div
    initial="hidden" animate="visible"
    variants={stagger}
    className="space-y-8 flex flex-col items-center text-center max-w-md w-full"
  >
    {/* Avatar */}
    <motion.div variants={scaleIn} className="relative">
      <img
        src={user.picture}
        alt={user.name}
        className="w-24 h-24 rounded-3xl border-4 border-white shadow-2xl shadow-blue-200 object-cover"
      />
      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
        <CheckCircle2 className="w-4 h-4 text-white" />
      </div>
    </motion.div>

    <motion.div variants={fadeUp} className="space-y-2">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.6, delay: 0.3 }}
        className="text-4xl"
      >
        🌱
      </motion.div>
      <h2 className="text-3xl font-bold text-gray-900">
        Bienvenido, <span className="seed-text">{user.name.split(' ')[0]}</span>
      </h2>
      <p className="text-sm text-gray-500">
        {user.email}
      </p>
    </motion.div>

    <motion.p variants={fadeUp} className="text-gray-500 text-sm max-w-xs">
      Tu espacio Dentaxy Seed está listo para explorarse. Descubre cómo transformaremos tu práctica clínica.
    </motion.p>

    <motion.div variants={fadeUp} className="w-full">
      <Button
        onClick={onEnter}
        className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
      >
        <Sparkles className="w-5 h-5" />
        Entrar a Dentaxy Seed
        <ArrowRight className="w-5 h-5" />
      </Button>
    </motion.div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MODAL ADMIN
// ─────────────────────────────────────────────────────────────────────────────

const AdminModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    if (username === 'admin' && password === 'admin') {
      navigate('/seed/overview', { replace: true });
    } else {
      setError('Credenciales no reconocidas.');
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-neutral-900/30 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-white/90 backdrop-blur-xl w-full max-w-[390px] p-8 rounded-[2rem] shadow-2xl border border-white/60 relative"
      >
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-full flex items-center justify-center transition-colors">
          <X className="w-4 h-4 text-neutral-500" />
        </button>
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6 text-neutral-700" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">Admin Seed</h2>
          <p className="text-sm text-neutral-500 mt-1">Solo para administración interna</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="ID de Usuario" value={username} onChange={e => setUsername(e.target.value)} className="h-12 rounded-xl" />
          <Input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} className="h-12 rounded-xl" />
          {error && <p className="text-xs text-red-600 bg-red-50 text-center py-2 rounded-lg">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-neutral-900 text-white">
            {loading ? 'Verificando...' : 'Acceder'}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

type Step = 'google' | 'bienvenida' | 'loading';

export default function SeedLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('google');
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  const handleGoogleSuccess = useCallback((u: GoogleUser) => {
    setUser(u);
    setStep('bienvenida');
  }, []);

  const authLogin = useAuthStore(state => state.login);

  const handleEnter = () => {
    if (user) {
      sessionStorage.setItem('seed_user', JSON.stringify(user));
      authLogin(user); // Guardar en el store global de Zustand
    }
    setStep('loading');
  };

  const handleLoaderComplete = () => {
    navigate('/seed', { replace: true });
  };

  // Si estamos en el step 'loading', renderizamos solo el loader a pantalla completa
  if (step === 'loading') {
    return (
      <SeedEcosystemLoader
        onComplete={handleLoaderComplete}
        userName={user?.name}
      />
    );
  }

  return (
    <div className="seed-theme min-h-screen w-full bg-white flex flex-col overflow-hidden selection:bg-blue-500/20">
      <AnimatePresence>
        {showAdmin && <AdminModal onClose={() => setShowAdmin(false)} />}
      </AnimatePresence>

      {/* Header mínimo */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-100 shadow-sm"
        >
          ← Inicio
        </button>
        <button
          onClick={() => setShowAdmin(true)}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors px-3 py-1.5 rounded-full"
        >
          <Lock className="w-3 h-3" /> Admin
        </button>
      </header>

      {/* Background decorativo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/6 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50/40 rounded-full blur-3xl" />
      </div>

      {/* Indicador de pasos */}
      <div className="fixed top-16 left-0 right-0 flex justify-center gap-2 pt-4 z-30">
        {(['google', 'bienvenida'] as Step[]).map((s, i) => (
          <motion.div
            key={s}
            animate={{ width: step === s ? 24 : 8, opacity: i <= ['google', 'bienvenida'].indexOf(step) ? 1 : 0.3 }}
            className={`h-2 rounded-full transition-all ${step === s ? 'bg-blue-600' : 'bg-blue-200'}`}
          />
        ))}
      </div>

      {/* Área de contenido centrada */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-24">
        <AnimatePresence mode="wait">

          {step === 'google' && (
            <motion.div key="google" className="w-full flex items-center justify-center">
              <StepGoogle onNext={handleGoogleSuccess} />
            </motion.div>
          )}

          {step === 'bienvenida' && user && (
            <motion.div key="bienvenida" className="w-full flex items-center justify-center">
              <StepBienvenida user={user} onEnter={handleEnter} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
