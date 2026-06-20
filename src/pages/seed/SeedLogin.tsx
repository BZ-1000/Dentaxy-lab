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
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn('VITE_GOOGLE_CLIENT_ID no configurado. Usando simulación local...');
      setTimeout(() => {
        const mockUser: GoogleUser = {
          name: 'Dr. Alejandro Silva (UAZ)',
          email: 'alejandro.silva@uaz.edu.mx',
          picture: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&h=256&q=80',
          googleAccessToken: 'mock-google-token-uaz-12345'
        };
        onNext(mockUser);
        setLoading(false);
        toast.success('Sesión simulada correctamente', { description: 'Estás usando el perfil de simulación local.' });
      }, 1000);
      return;
    }

    try {
      login();
    } catch (e) {
      console.error('Error al iniciar login con Google:', e);
      // Fallback automático por error de inicialización
      setTimeout(() => {
        const mockUser: GoogleUser = {
          name: 'Dr. Alejandro Silva (UAZ)',
          email: 'alejandro.silva@uaz.edu.mx',
          picture: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&h=256&q=80',
          googleAccessToken: 'mock-google-token-uaz-12345'
        };
        onNext(mockUser);
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <motion.div
      initial="hidden" animate="visible" exit={{ opacity: 0, y: -20 }}
      variants={stagger}
      className="space-y-8 flex flex-col items-center text-center max-w-md w-full"
    >
      {/* Google Logo + Texto */}
      <motion.div variants={fadeUp} className="space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          Conecta tu <span className="gradient-text">Google Account</span>
        </h2>
        <p className="text-gray-500 max-w-sm text-sm leading-relaxed mx-auto">
          Tu cuenta de Google es el corazón de tu Dentaxy Seed. Tus expedientes se organizarán
          automáticamente en <strong>tu propia Google Drive</strong>, con total privacidad y soberanía de tus datos.
        </p>
      </motion.div>

      {/* Grid del Ecosistema de Google - Iconos grandes con nombres al lado */}
      <motion.div 
        variants={fadeUp} 
        className="grid grid-cols-2 gap-3.5 w-full mt-2"
      >
        <div className="flex items-center gap-3 bg-neutral-50/70 hover:bg-neutral-50 p-3 rounded-2xl border border-neutral-100 hover:scale-[1.02] hover:shadow-md hover:shadow-neutral-200/50 transition-all duration-300 group">
          <img src="/logos/google-drive.png" alt="Google Drive" className="w-12 h-12 object-contain group-hover:scale-105 transition-transform" />
          <div className="text-left leading-tight">
            <p className="text-sm font-bold text-gray-800">Google Drive</p>
            <p className="text-[10px] text-gray-400 font-medium">Expedientes Clínicos</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-neutral-50/70 hover:bg-neutral-50 p-3 rounded-2xl border border-neutral-100 hover:scale-[1.02] hover:shadow-md hover:shadow-neutral-200/50 transition-all duration-300 group">
          <img src="/logos/google-calendar.png" alt="Google Calendar" className="w-12 h-12 object-contain group-hover:scale-105 transition-transform" />
          <div className="text-left leading-tight">
            <p className="text-sm font-bold text-gray-800">Google Calendar</p>
            <p className="text-[10px] text-gray-400 font-medium">Agenda de Citas</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-neutral-50/70 hover:bg-neutral-50 p-3 rounded-2xl border border-neutral-100 hover:scale-[1.02] hover:shadow-md hover:shadow-neutral-200/50 transition-all duration-300 group">
          <img src="/logos/gmail.png" alt="Google Gmail" className="w-12 h-12 object-contain group-hover:scale-105 transition-transform" />
          <div className="text-left leading-tight">
            <p className="text-sm font-bold text-gray-800">Google Gmail</p>
            <p className="text-[10px] text-gray-400 font-medium">Notificaciones</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-neutral-50/70 hover:bg-neutral-50 p-3 rounded-2xl border border-neutral-100 hover:scale-[1.02] hover:shadow-md hover:shadow-neutral-200/50 transition-all duration-300 group">
          <img src="/logos/google-sheets.png" alt="Google Sheets" className="w-12 h-12 object-contain group-hover:scale-105 transition-transform" />
          <div className="text-left leading-tight">
            <p className="text-sm font-bold text-gray-800">Google Sheets</p>
            <p className="text-[10px] text-gray-400 font-medium">Estadísticas Clínicas</p>
          </div>
        </div>
      </motion.div>

      {/* Permisos requeridos explicados de forma premium */}
      <motion.div variants={fadeUp} className="w-full space-y-2">
        {[
          { label: 'Tu identidad y perfil básico', sub: 'Personalización inmediata de tu consultorio' },
          { label: 'Acceso exclusivo a la carpeta Dentaxy', sub: 'Privacidad absoluta en tu propia nube' },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 text-left px-4 py-3 rounded-2xl bg-blue-50/50 border border-blue-100/50">
            <CheckCircle2 className="w-4.5 h-4.5 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-gray-800">{item.label}</p>
              <p className="text-[11px] text-gray-500">{item.sub}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* CTA Google */}
      <motion.div variants={fadeUp} className="w-full">
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full h-14 rounded-2xl bg-white border-2 border-neutral-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 text-gray-700 font-bold text-base flex items-center justify-center gap-3 transition-all duration-300 group"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          ) : (
            <>
              {/* Google Ecosistema SVG Logo */}
              <svg className="w-5 h-5 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
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

        {/* Enlace de simulación fallback para desarrollo local */}
        <button
          onClick={() => {
            setLoading(true);
            setTimeout(() => {
              const mockUser: GoogleUser = {
                name: 'Dr. Alejandro Silva (UAZ)',
                email: 'alejandro.silva@uaz.edu.mx',
                picture: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&h=256&q=80',
                googleAccessToken: 'mock-google-token-uaz-12345'
              };
              onNext(mockUser);
              setLoading(false);
              toast.success('Acceso simulado (Modo Desarrollo)', { description: 'Has ingresado con un perfil de prueba.' });
            }, 800);
          }}
          className="mt-4 text-xs text-blue-500 hover:text-blue-600 hover:underline transition-all block mx-auto font-medium"
        >
          Entrar en modo simulación (Desarrollo local)
        </button>
      </motion.div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

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

type Step = 'google';

const loginSlideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 120 : -120,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: "spring", stiffness: 140, damping: 15 },
      opacity: { duration: 0.25 }
    }
  },
  exit: (dir: number) => ({
    x: dir < 0 ? 120 : -120,
    opacity: 0,
    transition: {
      x: { duration: 0.25, ease: "easeIn" },
      opacity: { duration: 0.15 }
    }
  })
};

export default function SeedLogin() {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate('/seed?login=true', { replace: true });
  }, [navigate]);

  return (
    <div className="h-screen w-full bg-[#0c0c0f] flex flex-col items-center justify-center text-white font-mono">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 rounded-full text-emerald-500 animate-spin" />
        <span className="text-xs font-medium text-slate-400 tracking-wider">REDIRECCIONANDO...</span>
      </div>
    </div>
  );
}
