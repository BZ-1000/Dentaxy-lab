/**
 * DentaXy Seed — useSpotlight Hook
 * 
 * Este hook calcula la posición relativa del cursor dentro de un elemento
 * HTML (card de glassmorphism) y devuelve variables CSS customizadas.
 * Permite crear un brillo neón radial interactivo que persigue al cursor.
 * 
 * Idioma: Español (Regla de Marca Dentaxy)
 */

import { useState, useRef, MouseEvent as ReactMouseEvent } from "react";

export interface SpotlightStyles {
  "--mouse-x": string;
  "--mouse-y": string;
}

export function useSpotlight() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [spotlightStyle, setSpotlightStyle] = useState<SpotlightStyles>({
    "--mouse-x": "0px",
    "--mouse-y": "0px"
  });

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSpotlightStyle({
      "--mouse-x": `${x}px`,
      "--mouse-y": `${y}px`
    });
  };

  const handleMouseLeave = () => {
    // Al salir, ocultamos o colocamos el reflector fuera del plano visual directo
    setSpotlightStyle({
      "--mouse-x": "-9999px",
      "--mouse-y": "-9999px"
    });
  };

  return {
    containerRef,
    spotlightStyle,
    handleMouseMove,
    handleMouseLeave
  };
}
export default useSpotlight;
