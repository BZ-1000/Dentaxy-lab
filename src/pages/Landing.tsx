
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MenuBar } from '@/components/ui/glow-menu';
import { RainbowButton } from '@/components/ui/rainbow-button';
import Spline from '@splinetool/react-spline';
import { Home, Settings, Bell, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Landing = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [activeItem, setActiveItem] = useState<string>("Home");
  const [authDialog, setAuthDialog] = useState<{ isOpen: boolean; mode: "login" | "register" }>({
    isOpen: false,
    mode: "login"
  });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    
    // Obtener el usuario actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Suscribirse a cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Has cerrado sesión correctamente');
    } catch (error: any) {
      toast.error('Error al cerrar sesión');
    }
  };

  // Crear los items del menú dinámicamente basados en el estado de autenticación
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
      label: user ? user.email : "Profile",
      href: "#",
      gradient:
        "radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.06) 50%, rgba(185,28,28,0) 100%)",
      iconColor: "text-red-500",
    },
  ];

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Fondo con Spline */}
      <div className="absolute inset-0 h-[120%] w-full -translate-y-[10%]">
        <Spline scene="https://prod.spline.design/Z0KpFO88CUhof5lJ/scene.splinecode" />
      </div>

      {/* Header con logo y texto */}
      <div className="relative z-10 flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <img src="/diente.png" alt="Logo" className="h-8 w-8 text-white" />
          <span className="text-sm sm:text-base font-semibold text-white text-shadow">
            Dental Basics Academy
          </span>
        </div>
        <div className="flex gap-4">
          {user ? (
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-white hover:text-white hover:bg-white/10 border border-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={() => setAuthDialog({ isOpen: true, mode: "login" })}
                className="text-white hover:text-white hover:bg-white/10 border border-white/20"
              >
                Iniciar Sesión
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setAuthDialog({ isOpen: true, mode: "register" })}
                className="text-white hover:text-white hover:bg-white/10 border border-white/20"
              >
                Registrarse
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Menú centrado y en la capa superior */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
        <MenuBar
          items={menuItems}
          activeItem={activeItem}
          onItemClick={setActiveItem}
          className="py-1 text-shadow"
        />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          {/* Título futurista */}
          <h1 className="mb-16 font-mono text-8xl font-black tracking-wider text-white text-shadow-xl sm:text-9xl">
            DENTAXY
          </h1>

          {/* Botón con efecto rainbow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <RainbowButton
              onClick={() => navigate('/app')}
              className="text-lg py-6 shadow-2xl"
            >
              Acceder a Beta
            </RainbowButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Dialog de autenticación */}
      <AuthDialog
        isOpen={authDialog.isOpen}
        onClose={() => setAuthDialog({ ...authDialog, isOpen: false })}
        defaultMode={authDialog.mode}
      />
    </div>
  );
};

export default Landing;
