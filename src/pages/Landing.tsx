
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const Landing = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Partículas de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(37,99,235,0.1),rgba(37,99,235,0.05)_15%,rgba(37,99,235,0.025)_25%,transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="animate-float absolute h-1 w-1 rounded-full bg-blue-500/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          {/* Título con efecto neón */}
          <h1 className="mb-8 text-7xl font-bold tracking-tight sm:text-8xl lg:text-9xl">
            <span className="relative inline-block font-knewave bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400 animate-glow">
              DentaXy
              <span className="absolute -inset-2 blur-xl bg-gradient-to-r from-blue-500/30 to-cyan-400/30" />
            </span>
          </h1>

          {/* Subtítulo con fade in */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-12 text-xl text-gray-400 font-mplus"
          >
            La próxima generación de historias clínicas dentales con IA
          </motion.p>

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
