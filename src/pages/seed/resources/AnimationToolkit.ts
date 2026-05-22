/**
 * DentaXy Seed — Animation & Motion Toolkit
 * 
 * Este archivo contiene las variantes de Framer Motion más avanzadas,
 * configuraciones de resortes (springs) ultra-fluidas y cálculos elásticos
 * diseñados para crear una experiencia inmersiva "Dark/Vibrant" de nivel CTO.
 * 
 * Idioma: Español (Regla de Marca Dentaxy)
 */

import { Variants } from "framer-motion";

// ── CONFIGURACIONES DE RESORTE ULTRA-PREMIUM ──
export const SPRING_CONFIGS = {
  cosmic: { type: "spring", stiffness: 70, damping: 14, mass: 0.8 },
  elastic: { type: "spring", stiffness: 200, damping: 12, mass: 0.6 },
  gentle: { type: "spring", stiffness: 100, damping: 20, mass: 1 },
  magnetic: { type: "spring", stiffness: 150, damping: 15, mass: 0.5 }
};

// ── VARIANTES DE FRAMER MOTION (Nivel de Estudio) ──

/**
 * 1. Desvanecimiento y Desplazamiento Cósmico (Fade Up)
 * Ideal para encabezados, párrafos y elementos de texto principales.
 */
export const cosmicFadeUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 35, 
    filter: "blur(8px)" 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: SPRING_CONFIGS.cosmic
  }
};

/**
 * 2. Contenedor de Flujo Escalonado (Stagger)
 * Para orquestar la aparición secuencial de elementos hijos en grids o listas.
 */
export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren
    }
  }
});

/**
 * 3. Entrada de Escala Elástica (Scale In)
 * Perfecto para badges, botones principales y cards del Bento Grid.
 */
export const elasticScaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.85, 
    filter: "blur(4px)" 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    filter: "blur(0px)",
    transition: SPRING_CONFIGS.elastic
  }
};

/**
 * 4. Deslizamiento Lateral Fluido (Slide In Left / Right)
 */
export const slideInFromLeft: Variants = {
  hidden: { opacity: 0, x: -60, filter: "blur(6px)" },
  visible: { 
    opacity: 1, 
    x: 0, 
    filter: "blur(0px)",
    transition: SPRING_CONFIGS.cosmic 
  }
};

export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 60, filter: "blur(6px)" },
  visible: { 
    opacity: 1, 
    x: 0, 
    filter: "blur(0px)",
    transition: SPRING_CONFIGS.cosmic 
  }
};

/**
 * 5. Trazado de Líneas SVG (Path Drawing)
 * Anima el contorno de un vector SVG como si se estuviera dibujando con luz neón.
 */
export const neonPathDraw: Variants = {
  hidden: { 
    pathLength: 0, 
    opacity: 0.1 
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: "spring", duration: 2, bounce: 0 },
      opacity: { duration: 0.5 }
    }
  }
};

/**
 * 6. Respiración Bioluminiscente (Pulse Glow)
 * Un loop infinito de brillo para orbes en segundo plano y badges activos.
 */
export const bioluminescentPulse: Variants = {
  animate: {
    scale: [1, 1.05, 0.98, 1.03, 1],
    opacity: [0.3, 0.5, 0.25, 0.45, 0.3],
    filter: [
      "blur(60px) brightness(1)",
      "blur(70px) brightness(1.2)",
      "blur(55px) brightness(0.9)",
      "blur(65px) brightness(1.1)",
      "blur(60px) brightness(1)"
    ],
    transition: {
      duration: 8,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "mirror"
    }
  }
};

/**
 * 7. Animaciones de Hover Estilo Liquid Glass
 * Efectos de flotación suave y brillo magnético.
 */
export const liquidGlassHover: Variants = {
  initial: { 
    y: 0, 
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.4)" 
  },
  hover: { 
    y: -6, 
    boxShadow: "0 20px 40px rgba(34, 197, 94, 0.15)",
    borderColor: "rgba(34, 197, 94, 0.35)",
    transition: { type: "spring", stiffness: 200, damping: 15 }
  }
};
