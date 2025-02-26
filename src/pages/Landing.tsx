import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuBar } from '@/components/ui/glow-menu';
import { RainbowButton } from '@/components/ui/rainbow-button';
import Spline from '@splinetool/react-spline';
import { Home, Settings, Bell, User, Save, LogOut, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';

const menuItems = [
  {
    icon: Home,
    label: "Home",
    href: "#",
    gradient: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
    iconColor: "text-blue-500",
  },
  {
    icon: Bell,
    label: "Notifications",
    href: "#",
    gradient: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)",
    iconColor: "text-orange-500",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "#",
    gradient: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)",
    iconColor: "text-green-500",
  },
  {
    icon: User,
    label: "Profile",
    href: "#",
    gradient: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.06) 50%, rgba(185,28,28,0) 100%)",
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
  const [showPricingPopup, setShowPricingPopup] = useState<boolean>(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasBetaPlan, setHasBetaPlan] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        checkUsername(session.user.id);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session) {
        checkUsername(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUsername = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, username, created_at')
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
      const { error } = await supabase
        .from('user_profiles')
        .upsert([
          {
            id: session.user.id,
            username: username.trim(),
          },
        ], {
          onConflict: 'id'
        });

      if (error) throw error;
      
      setShowPopup(false);
      toast.success('¡Nombre de usuario guardado exitosamente!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (label: string) => {
    setActiveItem(label);
    if (label === "Profile" && session) {
      setShowDropdown(!showDropdown);
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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
    setSession(null);
    setShowDropdown(false);
    setHasBetaPlan(false);
    toast.success('Sesión cerrada exitosamente');
  };

  const handleChangeUsername = () => {
    setShowPopup(true);
    setShowDropdown(false);
  };

  const handleBetaAccess = () => {
    if (!session) {
      toast.error('Debes iniciar sesión para acceder a la versión beta');
      setAuthDialog({ isOpen: true, mode: "login" });
      return;
    }

    if (hasBetaPlan) {
      navigate('/app');
    } else {
      setShowPricingPopup(true);
    }
  };

  const handleSelectBetaPlan = () => {
    setHasBetaPlan(true);
    setShowPricingPopup(false);
    toast.success('¡Plan Beta activado exitosamente!');
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
              {username && <span className="text-white">{username}</span>}
            </div>
          )}
        </div>
      </motion.div>

      {!isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 6, duration: 0.5 }}
          className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50"
        >
          <MenuBar
            items={menuItems}
            activeItem={activeItem}
            onItemClick={handleItemClick}
            className="py-1 text-shadow"
          />
          <AnimatePresence>
            {showDropdown && session && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="absolute top-full right-0 z-[60] w-48 p-2 bg-[#11111198] rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.2)] backdrop-blur-sm flex flex-col gap-2"
              >
                {hasBetaPlan && (
                  <div className="px-2 py-3 text-blue-400 text-sm rounded-lg w-full text-left flex items-center gap-x-2">
                    <Crown className="h-4 w-4" />
                    Plan Beta
                  </div>
                )}
                <motion.button
                  onClick={handleChangeUsername}
                  whileHover={{ backgroundColor: "#11111140" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-2 py-3 text-white text-sm rounded-lg w-full text-left flex items-center gap-x-2"
                >
                  Cambiar nombre
                </motion.button>
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ backgroundColor: "#11111140" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-2 py-3 text-red-500 text-sm rounded-lg w-full text-left flex items-center gap-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 6, duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-t border-white/10 p-4"
        >
          <MenuBar
            items={menuItems}
            activeItem={activeItem}
            onItemClick={handleItemClick}
            className="py-1 text-shadow w-full justify-around"
          />
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full mb-2 left-0 right-0 mx-4 py-2 bg-black/90 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl"
            >
              {session ? (
                <>
                  <button
                    onClick={handleChangeUsername}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors"
                  >
                    Cambiar nombre
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-red-500 hover:bg-white/10 transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors"
                  >
                    Iniciar sesión
                  </button>
                  <button
                    onClick={handleRegister}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors"
                  >
                    Registrarse
                  </button>
                </>
              )}
            </motion.div>
          )}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 6.5, duration: 0.8, ease: "easeOut" }}
        className="relative z-40 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 pt-20"
      >
        <div className="text-center">
          <h1 className="mb-4 font-mono text-8xl font-black tracking-wider text-white text-shadow-xl sm:text-9xl">
            DENTA
            <span className="font-orbitron">X</span>
            Y
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 7, duration: 0.5 }}
            className="text-xs font-thin text-white/70 mb-8"
          >
            Inteligencias artificiales para odontólogos
          </motion.p>
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

      {showPopup && session && (
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

      {showPricingPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-black/90 p-8 rounded-lg border border-white/20 shadow-xl w-full max-w-4xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">Planes Disponibles</h2>
              <Button
                variant="ghost"
                onClick={() => setShowPricingPopup(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative p-6 rounded-xl border border-white/20 backdrop-blur-sm">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                  Disponible
                </div>
                <h3 className="text-xl font-bold text-white mb-4 mt-4">Plan Beta</h3>
                <p className="text-white/60 mb-6">Acceso completo durante la fase beta</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-white/80">
                    <span className="mr-2">✓</span> Acceso a todas las funciones
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="mr-2">✓</span> Soporte prioritario
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="mr-2">✓</span> Beneficios exclusivos
                  </li>
                </ul>
                <Button
                  onClick={handleSelectBetaPlan}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Seleccionar Plan Beta
                </Button>
              </div>
              
              <div className="p-6 rounded-xl border border-white/20 backdrop-blur-sm opacity-50">
                <h3 className="text-xl font-bold text-white mb-4">Plan Básico</h3>
                <p className="text-white/60 mb-6">Próximamente</p>
              </div>
              
              <div className="p-6 rounded-xl border border-white/20 backdrop-blur-sm opacity-50">
                <h3 className="text-xl font-bold text-white mb-4">Plan Premium</h3>
                <p className="text-white/60 mb-6">Próximamente</p>
              </div>
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
