import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import './Landing.css'; // Asegúrate de tener este archivo CSS en la misma carpeta

const Landing = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="landing-container">
      {/* Encabezado de Navegación */}
      <nav className="navbar">
        <div className="logo">ZYNO</div>
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">Features</a></li>
          <li><a href="#">Specs</a></li>
        </ul>
      </nav>

      {/* Contenido principal */}
      <div className="main-content">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="main-title"
        >
          ZYNO
        </motion.h1>

        {/* Botón con efecto neón */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="button-container"
        >
          <Button
            onClick={() => navigate('/app')}
            className="neon-button"
          >
            <span className="button-text">Acceder a Beta</span>
          </Button>
        </motion.div>
      </div>

      {/* Efectos de Luz */}
      <div className="light left-light"></div>
      <div className="light right-light"></div>
    </div>
  );
};

export default Landing;
