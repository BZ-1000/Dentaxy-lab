import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface FutureButtonProps {
  onClick?: () => void;
  className?: string;
  size?: "sm" | "lg";
  label?: string;
}

/**
 * Componente FutureButton con el color Verde Eléctrico de Alto Contraste (#00F260),
 * neumorfismo suave y proyección de luz LED verde hacia abajo.
 * El círculo negro tiene exactamente el mismo alto que el botón y está pegado al borde izquierdo.
 */
export const FutureButton = ({ onClick, className = "", size = "lg", label = "Guíame al futuro" }: FutureButtonProps) => {
  const isSm = size === "sm";

  // Dimensiones del contenedor y botón
  const buttonDimensions = isSm 
    ? "h-10 w-[175px]" 
    : "h-12 w-[215px]";

  // Variantes del círculo negro (del mismo alto del botón: 40px para sm, 48px para lg)
  const bgVariants = {
    rest: isSm 
      ? { width: 40, height: 40, left: 0, top: 0 }
      : { width: 48, height: 48, left: 0, top: 0 },
    hover: { width: "100%", height: "100%", left: 0, top: 0 }
  };

  // Variantes de la flecha (desplazamiento exacto en hover)
  // En reposo parte de 0 (borde izquierdo). En hover se mueve al extremo derecho del ancho del botón.
  const arrowVariants = {
    rest: { x: 0, rotate: 0 },
    hover: isSm 
      ? { x: 129, rotate: 45 }
      : { x: 161, rotate: 45 }
  };

  // Variantes del texto (desplazamiento para dejar espacio a la flecha en hover)
  const textVariants = {
    rest: isSm 
      ? { x: -10 } 
      : { x: -16 },
    hover: isSm 
      ? { x: -34 }
      : { x: -44 }
  };

  return (
    <div className={`relative group shrink-0 ${buttonDimensions} ${className}`}>
      {/* ── LUZ DE NEÓN PROYECTADA EXCLUSIVAMENTE HACIA ABAJO (Verde Mano Robot #00f5a0) ── */}
      <div 
        className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-[82%] h-2.5 bg-[#00f5a0] rounded-full blur-[10px] opacity-65 group-hover:opacity-90 transition-all duration-300 -z-10 group-hover:scale-x-105"
        style={{
          boxShadow: isSm 
            ? "0 8px 20px rgba(0, 245, 160, 0.45), 0 12px 30px rgba(0, 245, 160, 0.25)"
            : "0 10px 25px rgba(0, 245, 160, 0.5), 0 16px 40px rgba(0, 245, 160, 0.3)"
        }}
      />

      {/* Botón interactivo principal (p-0 para permitir que el círculo toque los bordes) */}
      <motion.button 
        onClick={onClick}
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="relative w-full h-full flex items-center bg-[#00f5a0] rounded-full overflow-hidden select-none cursor-pointer border-none outline-none p-0 transition-shadow duration-300"
        style={{
          boxShadow: isSm 
            ? "0 4px 14px rgba(0, 245, 160, 0.35)"
            : "0 6px 20px rgba(0, 245, 160, 0.4)"
        }}
      >
        {/* Fondo negro expandible que en hover cubre todo el botón verde */}
        {/* justify-start para evitar que el flex desplace la flecha con la expansión de ancho */}
        <motion.div 
          variants={bgVariants}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          className="absolute bg-black rounded-full z-0 flex items-center justify-start p-0"
        >
          {/* Flecha dentro del contenedor negro (del mismo tamaño que el círculo rest para centrarla perfectamente) */}
          <motion.div
            variants={arrowVariants}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className={`flex items-center justify-center text-white shrink-0 ${isSm ? "w-10 h-10" : "w-12 h-12"}`}
          >
            <ArrowUpRight 
              className={isSm ? "w-[24px] h-[24px]" : "w-[28px] h-[28px]"} 
              strokeWidth={2} 
            />
          </motion.div>
        </motion.div>

        {/* Texto (z-10 para quedar sobre el fondo negro cuando se expande) */}
        <div className={`relative z-10 flex items-center justify-end w-full h-full pointer-events-none ${isSm ? "pr-3.5" : "pr-4"}`}>
          <motion.span 
            variants={textVariants}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className={`text-black group-hover:text-white transition-colors duration-300 font-bold tracking-wide ${isSm ? "text-[15px]" : "text-[15px]"}`}
          >
            {label}
          </motion.span>
        </div>
      </motion.button>
    </div>
  );
};

export default FutureButton;
