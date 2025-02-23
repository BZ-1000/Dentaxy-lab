
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Spline from '@splinetool/react-spline';

const Landing = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Fondo con Spline */}
      <div className="absolute inset-0 h-[120%] w-full -translate-y-[10%]">
        <Spline scene="https://prod.spline.design/HEkikR70XhoXCBC9/scene.splinecode" />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
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

          {/* Botón con efecto neón */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Button
              onClick={() => navigate('/app')}
              className="relative group px-8 py-6 text-lg font-semibold transition-all duration-300 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 rounded-xl"
            >
              <span className="relative z-10">Acceder a Beta</span>
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 opacity-70 blur-lg transition-all duration-300 group-hover:opacity-100" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
