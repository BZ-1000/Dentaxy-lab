import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MenuBar } from '@/components/ui/glow-menu';
import { RainbowButton } from '@/components/ui/rainbow-button';
import Spline from '@splinetool/react-spline';
import { Home, Settings, Bell, User } from 'lucide-react';
import { HeroScrollDemo } from '@/components/ui/code.demo'; // Importa el componente

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

const ToothIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8"
  >
    <path d="M12 2C7.58 2 4 4.58 4 9c0 3.42 2.24 7.42 4 10.42.8 1.36 2.62 2.62 4 2 1.38.62 3.2-.64 4-2 1.76-3 4-7 4-10.42C20 4.58 16.42 2 12 2z" />
    <path d="M12 2c-1.8 0-3 1-3 3 0 1.8 1 3 3 3s3-1.2 3-3c0-2-1.2-3-3-3z" />
  </svg>
);

const Landing = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [activeItem, setActiveItem] = useState<string>("Home");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Fondo con Spline */}
      <div className="absolute inset-0 h-full w-full">
        <Spline scene="https://prod.spline.design/Z0KpFO88CUhof5lJ/scene.splinecode" />
      </div>

      {/* Header con logo y menú */}
      <div className="relative z-10 flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <ToothIcon />
          <span className="text-xl font-semibold text-white">
            Dental Basics Academy
          </span>
        </div>
        <MenuBar
          items={menuItems}
          activeItem={activeItem}
          onItemClick={setActiveItem}
          className="ml-2 py-1"
        />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          {/* Título futurista */}
          <h1 className="mb-16 font-mono text-8xl font-black tracking-wider text-white [text-shadow:_0_0_30px_rgb(255_255_255_/_40%)] sm:text-9xl">
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
              className="text-lg py-6"
            >
              Acceder a Beta
            </RainbowButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Integración de HeroScrollDemo */}
      <div className="relative z-10">
        <HeroScrollDemo />
      </div>
    </div>
  );
};

export default Landing;
