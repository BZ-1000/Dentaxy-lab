import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MenuBar } from '@/components/ui/glow-menu';
import { RainbowButton } from '@/components/ui/rainbow-button';
import Spline from '@splinetool/react-spline';
import { Home, Settings, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthDialog } from '@/components/auth/AuthDialog';

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

  useEffect(() => {
    setMounted(true);

    // Importar la fuente Orbitron
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Limpieza al desmontar el componente
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Fondo negro inicial */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute inset-0 flex items-center justify-center bg-black z-10"
      />

      {/* Animación inicial del texto */}
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

      {/* Fondo con Spline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
        className="absolute inset-0 h-[120%] w-full -translate-y-[10%] z-0"
      >
        <Spline scene="https://prod.spline.design/Z0KpFO88CUhof5lJ/scene.splinecode" />
      </motion.div>

      {/* Header con logo y texto */}
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
          <Button
            variant="ghost"
            onClick={() => setAuthDialog({ isOpen: true, mode: "login" })}
            className="text-white hover:text-white hover:bg-white/10 border border-white/20 z-50"
          >
            Iniciar Sesión
          </Button>
          <Button
            variant="ghost"
            onClick={() => setAuthDialog({ isOpen: true, mode: "register" })}
            className="text-white hover:text-white hover:bg-white/10 border border-white/20 z-50"
          >
            Registrarse
          </Button>
        </div>
      </motion.div>

      {/* Menú centrado y en la capa superior */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 6, duration: 0.5 }}
        className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50"
      >
        <MenuBar
          items={menuItems}
          activeItem={activeItem}
          onItemClick={setActiveItem}
          className="py-1 text-shadow"
        />
      </motion.div>

      {/* Contenido principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 6.5, duration: 0.8, ease: "easeOut" }}
        className="relative z-40 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 pt-20"
      >
        <div className="text-center">
          {/* Título futurista */}
          <h1 className="mb-16 font-mono text-8xl font-black tracking-wider text-white text-shadow-xl sm:text-9xl">
            DENTA
            <span className="font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              X
            </span>
            Y
          </h1>

          {/* Botón con efecto rainbow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 7.3, duration: 0.5 }}
          >
            <RainbowButton
              onClick={() => navigate('/app')}
              className="text-sm py-6 shadow-2xl z-50"
            >
              Prueba BETA
            </RainbowButton>
          </motion.div>
        </div>
      </motion.div>

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
