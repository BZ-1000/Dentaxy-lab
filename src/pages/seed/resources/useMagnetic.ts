/**
 * DentaXy Seed — useMagnetic Hook
 * 
 * Este hook añade un efecto de atracción magnética física a cualquier elemento.
 * El elemento flotará de forma elástica y fluida hacia el cursor del usuario
 * al entrar en contacto, devolviéndose al origen con un muelle de amortiguación.
 * 
 * Idioma: Español (Regla de Marca Dentaxy)
 */

import { useRef, useState, MouseEvent as ReactMouseEvent } from "react";
import { useMotionValue, useSpring } from "framer-motion";

export function useMagnetic(strength = 0.35) {
  const elementRef = useRef<HTMLButtonElement | HTMLDivElement | null>(null);
  
  // Usamos Framer Motion MotionValues para animaciones a 60fps+ fuera del hilo principal de React
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Configuración de muelle magnético súper elástico
  const springConfig = { stiffness: 120, damping: 15, mass: 0.6 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: ReactMouseEvent | MouseEvent) => {
    if (!elementRef.current) return;

    const { clientX, clientY } = e;
    const rect = elementRef.current.getBoundingClientRect();
    
    // Calcular el punto central del elemento
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Distancia del cursor al centro
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    // Aplicar fuerza de tracción
    x.set(distanceX * strength);
    y.set(distanceY * strength);
  };

  const handleMouseLeave = () => {
    // Al salir, el elemento regresa elásticamente a su posición central
    x.set(0);
    y.set(0);
  };

  return {
    elementRef,
    x: springX,
    y: springY,
    handleMouseMove,
    handleMouseLeave
  };
}

export default useMagnetic;
