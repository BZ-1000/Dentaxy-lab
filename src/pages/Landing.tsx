import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import './Landing.css'; // Asegúrate de tener este archivo CSS en la misma carpeta

export default function Home() {
  return (
    <main className="spline-container">
      <spline-viewer url="https://prod.spline.design/HEkikR70XhoXCBC9/scene.splinecode"></spline-viewer>
      <div className="content-overlay">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="main-title"
        >
          DENTAXY
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="button-container"
        >
          <Button
            onClick={() => window.location.href = '/app'}
            className="neon-button"
          >
            <span className="button-text">Acceder a Beta</span>
          </Button>
        </motion.div>
      </div>
    </main>
  );
}
