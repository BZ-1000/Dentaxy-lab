/**
 * DentaXy Seed — SvgTemplates Components
 * 
 * Contiene gráficos vectoriales interactivos y animados (circuitos, redes
 * de precisión cibernética, y cargadores de carga local de Google Drive)
 * creados con Framer Motion para dar la sensación premium de CTO.
 * 
 * Idioma: Español (Regla de Marca Dentaxy)
 */

import React from "react";
import { motion } from "framer-motion";
import { neonPathDraw } from "./AnimationToolkit";

/**
 * 1. CyberGridBlueprint
 * Un fondo decorativo SVG con rejilla cibernética y círculos concéntricos
 * interactivos con brillo neón.
 */
export const CyberGridBlueprint: React.FC = () => {
  return (
    <svg 
      className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        </pattern>
        <radialGradient id="radial-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#030306" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Relleno con rejilla */}
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      
      {/* Resplandor radial central */}
      <rect width="100%" height="100%" fill="url(#radial-glow)" />

      {/* Círculos Blueprint animados */}
      <motion.circle 
        cx="50%" 
        cy="45%" 
        r="280" 
        fill="none" 
        stroke="rgba(34, 197, 94, 0.05)" 
        strokeWidth="1.5"
        strokeDasharray="8 8"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, ease: "linear", repeat: Infinity }}
      />
      <motion.circle 
        cx="50%" 
        cy="45%" 
        r="140" 
        fill="none" 
        stroke="rgba(59, 130, 246, 0.05)" 
        strokeWidth="1"
        strokeDasharray="4 4"
        animate={{ rotate: -360 }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      />
    </svg>
  );
};

/**
 * 2. BioluminescentConnectionLines
 * Líneas de circuito SVG que se encienden dinámicamente con luz de neón.
 * Simula el flujo del formulario al Drive del usuario.
 */
export const BioluminescentConnectionLines: React.FC = () => {
  return (
    <svg 
      className="w-full h-24 overflow-visible pointer-events-none" 
      viewBox="0 0 400 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="neon-glow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#22C55E" stopOpacity="1" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Camino de conexión secundario (opaco de fondo) */}
      <path 
        d="M10 50 Q 100 10, 200 50 T 390 50" 
        stroke="rgba(255, 255, 255, 0.05)" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />

      {/* Camino animado con luz neón fluyente */}
      <motion.path 
        d="M10 50 Q 100 10, 200 50 T 390 50" 
        stroke="url(#neon-glow-gradient)" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        variants={neonPathDraw}
        initial="hidden"
        animate="visible"
      />

      {/* Pulso de luz flotante (partícula) */}
      <motion.circle
        r="4"
        fill="#22C55E"
        style={{
          boxShadow: "0 0 12px #22C55E"
        }}
        animate={{
          offsetDistance: ["0%", "100%"]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </svg>
  );
};

/**
 * 3. DriveSyncPulse
 * Círculo de sincronización de Google Drive animado para
 * representar el guardado local ultra-seguro y rápido.
 */
export const DriveSyncPulse: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      {/* Anillos de luz circulares elásticos en loop */}
      <motion.div 
        className="absolute w-full h-full rounded-full border border-green-500/20"
        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute w-20 h-20 rounded-full border border-blue-500/10"
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.1, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      
      {/* Icono central de Drive */}
      <div className="relative z-10 flex items-center justify-center w-14 h-14 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl">
        <img src="/logos/google-drive.png" className="w-8 h-8 object-contain" alt="Google Drive" />
      </div>
    </div>
  );
};
export default SvgTemplates;
