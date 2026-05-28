"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
  cardClassName,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
  cardClassName?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.8, 0.95] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [15, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="w-full flex items-center justify-center relative p-2 md:p-6 overflow-visible"
      ref={containerRef}
      style={{
        minHeight: "140vh",
      }}
    >
      <div
        className="py-10 md:py-20 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <div
          className="w-full relative z-20 pointer-events-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          <Card rotate={rotate} translate={translate} scale={scale} className={`${cardClassName || ''} pointer-events-auto`}>
            {children}
          </Card>
        </div>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
        pointerEvents: "none"
      }}
      className="max-w-7xl mx-auto text-center relative z-30 pointer-events-none"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  translate,
  children,
  className,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 4.0, ease: "easeOut" }}
      style={{
        rotateX: rotate, // rotate in X
        scale,
        boxShadow:
          "0 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05), 0 12px 24px rgba(0, 0, 0, 0.05)",
      }}
      className={`max-w-[1350px] md:-mt-36 -mt-16 mx-auto h-[26rem] md:h-[38rem] w-full relative z-20 ${className || ''}`}
    >
      {/* Texto "POWERED BY Google" al estilo de SEED */}
      <div 
        className="absolute -top-[28px] left-1/2 -translate-x-1/2 text-center pointer-events-none select-none z-30 whitespace-nowrap flex items-center justify-center"
        style={{
          fontFamily: "var(--s-font-display, 'Orbitron', sans-serif)",
          fontSize: "10px",
          fontWeight: 500,
          color: "#71717a", /* Un gris medio refinado, suave y perfectamente legible */
        }}
      >
        <span style={{ letterSpacing: "0.3em", textIndent: "0.3em", marginRight: "2px" }}>POWERED BY</span>
        <span style={{
          fontFamily: "var(--s-font-display, 'Orbitron', sans-serif)",
          fontSize: "12px", /* Ajuste óptico (12px) para igualar visualmente la altura de las mayúsculas */
          fontWeight: 500,
          letterSpacing: "0.02em",
          display: "inline-flex",
          gap: "1px",
          verticalAlign: "middle"
        }}>
          <span style={{ color: "#3b82f6", textShadow: "0 0 2px rgba(59, 130, 246, 0.4)" }}>G</span>
          <span style={{ color: "#ef4444", textShadow: "0 0 2px rgba(239, 68, 68, 0.4)" }}>o</span>
          <span style={{ color: "#f59e0b", textShadow: "0 0 2px rgba(245, 158, 11, 0.4)" }}>o</span>
          <span style={{ color: "#3b82f6", textShadow: "0 0 2px rgba(59, 130, 246, 0.4)" }}>g</span>
          <span style={{ color: "#10b981", textShadow: "0 0 2px rgba(16, 185, 129, 0.4)" }}>l</span>
          <span style={{ color: "#ef4444", textShadow: "0 0 2px rgba(239, 68, 68, 0.4)" }}>e</span>
        </span>
      </div>
      {/* ── EFECTO DE LUZ NEÓN DUAL (NÚCLEO BLANCO INTENSO CON AURA VERDE DE ALTO CONTRASTE) ── */}
      
      {/* A. Capas de Brillo Verde de Alto Contraste (Alrededor del Blanco, desvanecido lateral suave) */}
      
      {/* @keyframes — padre único, solo opacity, rango estrecho (sin rayas) */}
      <style>{`
        @keyframes neonGroupBreathe {
          0%            { opacity: 0.65; }
          25%, 75%      { opacity: 1.00; }
          100%          { opacity: 0.65; }
        }
      `}</style>

      {/* Padre animado: los 3 glows verdes pulsan como UNA sola unidad.
          Sin desfase entre capas → sin interferencia → sin rayas de tigre */}
      <div
        className="absolute pointer-events-none z-[-2]"
        style={{
          inset: 0,
          animation: "neonGroupBreathe 12s ease-in-out 0s infinite",
          willChange: "opacity",
        }}
      >
      {/* 1. Halo verde gigante exterior difuso (Desvanecimiento lateral orgánico) */}
      <div 
        className="absolute -top-[160px] left-1/2 -translate-x-1/2 w-[120%] max-w-[1600px] h-[300px] pointer-events-none blur-[70px] opacity-100 rounded-full"
        style={{
          background: "radial-gradient(ellipse at center bottom, rgba(52, 211, 153, 1) 0%, rgba(16, 185, 129, 0.95) 35%, rgba(52, 211, 153, 0.3) 70%, rgba(0, 0, 0, 0) 100%)"
        }}
      />
      {/* 2. Aura verde brillante intermedia de alta densidad */}
      <div 
        className="absolute -top-[90px] left-1/2 -translate-x-1/2 w-[95%] max-w-[1250px] h-[160px] pointer-events-none blur-[30px] opacity-90 rounded-full"
        style={{
          background: "radial-gradient(ellipse at center bottom, rgba(52, 211, 153, 1) 0%, rgba(16, 185, 129, 0.8) 45%, rgba(0, 0, 0, 0) 90%)"
        }}
      />
      {/* 3. Domo Verde Central Estirado (Exclusivo en el centro hacia arriba, sin ensanchar los bordes) */}
      <div 
        className="absolute -top-[210px] left-1/2 -translate-x-1/2 w-[45%] max-w-[600px] h-[320px] pointer-events-none blur-[50px] opacity-100 rounded-full"
        style={{
          background: "radial-gradient(ellipse at center bottom, rgba(52, 211, 153, 1) 0%, rgba(16, 185, 129, 0.75) 45%, rgba(0, 0, 0, 0) 85%)"
        }}
      />
      </div>

      {/* B. Capas de Luz Blanca Central Superior (Restauradas a blanco puro original) */}
      {/* 1. Núcleo blanco brillante principal (Más ancho a los lados) */}
      <div 
        className="absolute -top-[60px] left-1/2 -translate-x-1/2 w-[100%] max-w-[1350px] h-[100px] pointer-events-none z-[-1] blur-[20px] opacity-100 rounded-full"
        style={{
          background: "radial-gradient(ellipse at center bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.95) 40%, rgba(255, 255, 255, 0.5) 75%, rgba(255, 255, 255, 0) 100%)"
        }}
      />
      {/* 2. Haz de luz blanca pura de alta potencia central (Más ancho a los lados) */}
      <div 
        className="absolute -top-[35px] left-1/2 -translate-x-1/2 w-[80%] max-w-[1100px] h-[60px] pointer-events-none z-[-1] blur-[12px] opacity-100 rounded-full"
        style={{
          background: "radial-gradient(ellipse at center bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0) 90%)"
        }}
      />
      {/* 3. Domo Blanco Central Estirado (Exclusivo en el centro hacia arriba, sin ensanchar los bordes) */}
      <div 
        className="absolute -top-[120px] left-1/2 -translate-x-1/2 w-[35%] max-w-[480px] h-[180px] pointer-events-none z-[-1] blur-[22px] opacity-100 rounded-full"
        style={{
          background: "radial-gradient(ellipse at center bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 45%, rgba(255, 255, 255, 0) 85%)"
        }}
      />

      {/* ── C. DISECCIÓN DE LUZ VERDE NEÓN EN LA ESQUINA SUPERIOR DERECHA (Debajo de la Mano de Robot, por fuera del demo) ── */}
      {/* 1. Núcleo ultra-brillante neón en la esquina superior derecha (destello de alta energía) */}
      <div 
        className="absolute -top-[50px] -right-[40px] w-[200px] h-[200px] pointer-events-none z-[-2] blur-[15px] opacity-100 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(52, 211, 153, 1) 0%, rgba(16, 185, 129, 0.95) 40%, rgba(16, 185, 129, 0) 80%)"
        }}
      />
      {/* 2. Aura verde intermedia concentrada de alta densidad en la esquina superior derecha */}
      <div 
        className="absolute -top-[90px] -right-[80px] w-[380px] h-[380px] pointer-events-none z-[-2] blur-[30px] opacity-95 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(52, 211, 153, 1) 0%, rgba(16, 185, 129, 0.8) 50%, rgba(16, 185, 129, 0.15) 75%, transparent 100%)"
        }}
      />
      {/* 3. Halo verde gigante expansivo exterior en la esquina superior derecha */}
      <div 
        className="absolute -top-[140px] -right-[150px] w-[550px] h-[550px] pointer-events-none z-[-2] blur-[60px] opacity-90 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(52, 211, 153, 0.9) 0%, rgba(16, 185, 129, 0.6) 45%, rgba(0, 0, 0, 0) 85%)"
        }}
      />

      {/* ── D. DISECCIÓN DE LUZ VERDE NEÓN EN LA ESQUINA SUPERIOR IZQUIERDA (Debajo de la Mano Humana, por fuera del demo) ── */}
      {/* 1. Núcleo ultra-brillante neón en la esquina superior izquierda (destello de alta energía) */}
      <div 
        className="absolute -top-[50px] -left-[40px] w-[200px] h-[200px] pointer-events-none z-[-2] blur-[15px] opacity-100 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(52, 211, 153, 1) 0%, rgba(16, 185, 129, 0.95) 40%, rgba(16, 185, 129, 0) 80%)"
        }}
      />
      {/* 2. Aura verde intermedia concentrada de alta densidad en la esquina superior izquierda */}
      <div 
        className="absolute -top-[90px] -left-[80px] w-[380px] h-[380px] pointer-events-none z-[-2] blur-[30px] opacity-95 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(52, 211, 153, 1) 0%, rgba(16, 185, 129, 0.8) 50%, rgba(16, 185, 129, 0.15) 75%, transparent 100%)"
        }}
      />
      {/* 3. Halo verde gigante expansivo exterior en la esquina superior izquierda */}
      <div 
        className="absolute -top-[140px] -left-[150px] w-[550px] h-[550px] pointer-events-none z-[-2] blur-[60px] opacity-90 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(52, 211, 153, 0.9) 0%, rgba(16, 185, 129, 0.6) 45%, rgba(0, 0, 0, 0) 85%)"
        }}
      />

      {/* ── C. EFECTO DE BRILLO VERTICAL LATERAL (ESTIRA EL DEGRADADO HACIA ABAJO POR LOS COSTADOS) ── */}
      {/* LATERAL IZQUIERDO */}
      {/* 1. Halo verde brillante lateral izquierdo */}
      <div 
        className="absolute top-0 -left-[45px] w-[90px] h-[420px] pointer-events-none z-[-2] blur-[35px] opacity-100"
        style={{
          background: "linear-gradient(to bottom, rgba(52, 211, 153, 1) 0%, rgba(52, 211, 153, 0.95) 30%, rgba(16, 185, 129, 0.35) 65%, rgba(0, 0, 0, 0) 100%)"
        }}
      />
      {/* 2. Núcleo blanco/verde neón concentrado lateral izquierdo (Ancho reducido a 18px con transición ultra-rápida) */}
      <div 
        className="absolute top-0 -left-[9px] w-[18px] h-[260px] pointer-events-none z-[-1] blur-[10px] opacity-95"
        style={{
          background: "linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 4%, rgba(52, 211, 153, 1) 15%, rgba(16, 185, 129, 0.6) 55%, rgba(0, 0, 0, 0) 100%)"
        }}
      />

      {/* LATERAL DERECHO (Debajo de la Mano del Robot) */}
      {/* 1. Halo verde brillante lateral derecho */}
      <div 
        className="absolute top-0 -right-[45px] w-[90px] h-[420px] pointer-events-none z-[-2] blur-[35px] opacity-100"
        style={{
          background: "linear-gradient(to bottom, rgba(52, 211, 153, 1) 0%, rgba(16, 185, 129, 0.8) 35%, rgba(16, 185, 129, 0.25) 70%, rgba(0, 0, 0, 0) 100%)"
        }}
      />
      {/* 2. Núcleo blanco/verde neón concentrado lateral derecho */}
      <div 
        className="absolute top-0 -right-[20px] w-[40px] h-[260px] pointer-events-none z-[-1] blur-[16px] opacity-95"
        style={{
          background: "linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(52, 211, 153, 0.95) 35%, rgba(16, 185, 129, 0.5) 65%, rgba(0, 0, 0, 0) 100%)"
        }}
      />


      {/* ── CUERPO SÓLIDO DEL DEMO (Escudo z-10 que cubre los brillos por completo) ── */}
      <div 
        style={{
          boxShadow: "0 0 50px rgba(16, 185, 129, 0.15), 0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        }}
        className="h-full w-full p-2 md:p-[14px] bg-[#1C1C26]/85 backdrop-blur-md rounded-[24px] shadow-2xl relative z-10 overflow-hidden"
      >
        <div className="h-full w-full overflow-hidden rounded-2xl bg-[#12121A] md:rounded-2xl">
          {children}
        </div>
      </div>
    </motion.div>
  );
};
