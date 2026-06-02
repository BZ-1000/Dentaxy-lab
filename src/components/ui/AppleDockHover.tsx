import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface AppleDockHoverProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  hoverY?: number;
  isClickable?: boolean;
}

/**
 * AppleDockHover
 * Componente de envoltura premium que replica exactamente la física de resorte ultra-fluida
 * del Dock inferior de Apple (mass: 0.1, stiffness: 150, damping: 12) al pasar el cursor sobre un elemento.
 */
export const AppleDockHover: React.FC<AppleDockHoverProps> = ({
  children,
  className = '',
  hoverScale = 1.05,
  hoverY = -12,
  isClickable = false
}) => {
  // Parámetros de física de resorte idénticos al AppleStyleDock de Dentaxy
  const springConfig = { mass: 0.1, stiffness: 150, damping: 12 };

  // Valores de movimiento interactivos
  const isHovered = useMotionValue(0);

  // Mapeo suave de escala y desplazamiento vertical Y basado en hover
  const scaleTarget = useTransform(isHovered, [0, 1], [1, hoverScale]);
  const yTarget = useTransform(isHovered, [0, 1], [0, hoverY]);

  // Aplicación de resortes reactivos hiper-fluidos
  const scale = useSpring(scaleTarget, springConfig);
  const y = useSpring(yTarget, springConfig);

  return (
    <motion.div
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      style={{
        scale,
        y
      }}
      className={`w-full h-full overflow-visible transition-shadow ${isClickable ? 'cursor-pointer' : 'cursor-default'} ${className}`}
    >
      {children}
    </motion.div>
  );
};
