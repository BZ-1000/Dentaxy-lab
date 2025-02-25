
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MenuBar } from '@/components/ui/glow-menu';
import { RainbowButton } from '@/components/ui/rainbow-button';
import Spline from '@splinetool/react-spline';
import { Home, Settings, Bell, User, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Session } from '@supabase/supabase-js';

const menuItems = [
  {
    icon: Home,
    label: "Home",
    href: "#",
    gradient:
      "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
    iconColor: "text-blue-500",
  },
  {
    icon: Bell,
    label: "Notifications",
    href: "#",
    gradient:
      "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)",
    iconColor: "text-orange-500",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "#",
    gradient:
      "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)",
    iconColor: "text-green-500",
  },
  {
    icon: User,
    label: "Profile",
    href: "#",
    gradient:
      "radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.06) 50%, rgba(185,28,28,0) 100%)",
    iconColor: "text-red-500",
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [activeItem, setActiveItem] = useState<string>("Home");
  const [authDialog, setAuthDialog] = useState<{ isOpen: boolean; mode: "login" | "register" }>({
    isOpen: false,
    mode: "login"
  });
  const [username, setUsername] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkUsername(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      if (session) {
        checkUsername(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUsername = async (userId: string) => {
    try {
      type UserProfile = {
        id: string;
        username: string;
        created_at: string;
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .select<'user_profiles', UserProfile>('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.username) {
        setUsername(data.username);
      } else {
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error checking username:', error);
    }
  };

  const handleSaveUsername = async () => {
    if (!session || !username.trim()) {
      toast.error('Por favor ingresa un nombre de usuario');
      return;
    }

    setLoading(true);
    try {
      type UserProfileInsert = {
        id: string;
        username: string;
      };

      const { error } = await supabase
        .from('user_profiles')
        .insert<UserProfileInsert>([{
          id: session.user.id,
          username: username.trim()
        }]);

      if (error) throw error;

      setShowPopup(false);
      toast.success('¡Nombre de usuario guardado exitosamente!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    setAuthDialog({ isOpen: true, mode: "login" });
  };

  const handleRegister = () => {
    setAuthDialog({ isOpen: true, mode: "register" });
  };

  const handleAuthSuccess = () => {
    setAuthDialog({ isOpen: false, mode: "login" });
  };

  const handleBetaAccess = () => {
    if (!session) {
      toast.error('Debes iniciar sesión para acceder a la versión beta');
      setAuthDialog({ isOpen: true, mode: "login" });
      return;
    }
    navigate('/app');
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute inset-0 flex items-center justify-center bg-black z-10"
      />

      <motion.div
        initial={{ opacity: 0, zIndex: 50 }}
        animate={{ opacity: 1, zIndex: 0 }}
        transition={{ delay: 1, duration: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <motion.div className="flex items-center gap-4">
          <motion.img
            src="/diente.png"
            alt="Logo"
            className="h-8 w-8 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          />
          <div className="text-sm sm:text-base font-semibold text-white text-shadow flex space-x-1">
            {"Dental Basics Academy".split('').map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 + index * 0.05, duration: 0.5 }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
        className="absolute inset-0 h-[120%] w-full -translate-y-[10%] z-0"
      >
        <Spline scene="https://prod.spline.design/Z0KpFO88CUhof5lJ/scene.splinecode" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5, duration: 0.5 }}
        className="relative z-50 flex items-center justify-between px-6 py-3"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5.5, duration: 1 }}
          className="flex items-center gap-4"
        >
          <img src="/diente.png" alt="Logo" className="h-8 w-8 text-white" />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 6, duration: 1 }}
            className="text-sm sm:text-base font-semibold text-white text-shadow"
          >
            Dental Basics Academy
          </motion.span>
        </motion.div>
        <div className="flex gap-4">
          {!session ? (
            <>
              <Button
                variant="ghost"
                onClick={handleLogin}
                className="text-white hover:text-white hover:bg-white/10 border border-white/20"
              >
                Iniciar Sesión
              </Button>
              <Button
                variant="ghost"
                onClick={handleRegister}
                className="text-white hover:text-white hover:bg-white/10 border border-white/20"
              >
                Registrarse
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-white">
                {username || 'Usuario'}
              </span>
              <Button
                variant="ghost"
                onClick={() => navigate('/app')}
                className="text-white hover:text-white hover:bg-white/10 border border-white/20"
              >
                Dashboard
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 6, duration: 0.5 }}
        className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50"
      >
        <MenuBar
          items={menuItems.map(item =>
            item.label === "Profile" ? { ...item, label: username || "Profile" } : item
          )}
          activeItem={activeItem}
          onItemClick={setActiveItem}
          className="py-1 text-shadow"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 6.5, duration: 0.8, ease: "easeOut" }}
        className="relative z-40 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 pt-20"
      >
        <div className="text-center">
          <h1 className="mb-16 font-mono text-8xl font-black tracking-wider text-white text-shadow-xl sm:text-9xl">
            DENTA
            <span className="font-orbitron">X</span>
            Y
          </h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 7.3, duration: 0.5 }}
          >
            <RainbowButton
              onClick={handleBetaAccess}
              className="text-sm py-6 shadow-2xl z-50"
            >
              Prueba BETA
            </RainbowButton>
          </motion.div>
        </div>
      </motion.div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-black/90 p-8 rounded-lg border border-white/20 shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">¡Bienvenido!</h2>
            <p className="text-white/80 mb-6">Por favor, ingresa tu nombre de usuario para continuar.</p>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Button 
                onClick={handleSaveUsername} 
                className="w-full bg-white text-black hover:bg-white/90 transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                    Guardando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Guardar
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <AuthDialog
        isOpen={authDialog.isOpen}
        onClose={() => setAuthDialog({ ...authDialog, isOpen: false })}
        defaultMode={authDialog.mode}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Landing;
