"use client";
import React, { useRef, useState, useEffect } from "react";
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

  const rotate = useTransform(scrollYProgress, [0, 1], [24, 0]);
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [glowActive, setGlowActive] = useState(true);

  useEffect(() => {
    const handleScroll = () => setGlowActive(window.scrollY < 80);
    // Estado inicial
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 4.0, ease: "easeOut" }}
      style={{
        rotateX: rotate, // rotate in X
        scale,
        boxShadow:
          "0 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05), 0 12px 24px rgba(0, 0, 0, 0.05)",
        willChange: "transform",
      }}
      className={`max-w-[1600px] md:-mt-52 -mt-24 mx-auto h-[32rem] md:h-[45rem] w-full relative z-20 ${className || ''}`}
    >
      {/* Estilos CSS inyectados para el haz de luz pulsátil perimetral (SVG Path Flow) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes emerald-dash-flow {
          0% {
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.65;
            stroke-width: 14;
          }
          50% {
            opacity: 0.95;
            stroke-width: 22;
          }
        }
        @keyframes env-pulse {
          0%, 100% {
            opacity: 0.20;
          }
          50% {
            opacity: 0.45;
          }
        }
        @keyframes card-glow-breath {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        .emerald-flow-pulse {
          animation: emerald-dash-flow 8s linear infinite;
          animation-play-state: inherit;
        }
        .emerald-flow-pulse.shadow-glow {
          animation: emerald-dash-flow 8s linear infinite, glow-pulse 4s ease-in-out infinite;
          animation-play-state: inherit;
        }
        .emerald-flow-pulse.environmental-glow {
          animation: emerald-dash-flow 8s linear infinite, env-pulse 5s ease-in-out infinite;
          animation-play-state: inherit;
        }
      `}} />

      {/* ── EFECTO DE LUZ PULSÁTIL PERIMETRAL DE PRECISIÓN (Capa trasera z-0 con respiración de opacidad cero) ── */}
      <div 
        className="absolute inset-[-10px] z-0 pointer-events-none overflow-visible select-none"
        style={{
          animation: "card-glow-breath 9s ease-in-out infinite",
          animationPlayState: glowActive ? "running" : "paused",
          opacity: glowActive ? undefined : 0,
          willChange: "opacity",
        }}
      >
        <svg className="w-full h-full" style={{ overflow: "visible" }}>
          <defs>
            {/* Gradiente de luz: Verde Esmeralda Suave -> Verde Vibrante -> Blanco Esmeralda Brillante -> Emerald -> Verde Suave */}
            <linearGradient id="emerald-pulse-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.55" />
              <stop offset="30%" stopColor="#00f5a0" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#e6fff4" stopOpacity="1" /> {/* Blanco Esmeralda Brillante */}
              <stop offset="70%" stopColor="#00f5a0" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          
          {/* HACES QUE CORREN POR EL PERÍMETRO (Solidificados y continuos) */}
          {/* Haz 1 - Línea de contorno base y ráfaga de precisión */}
          <rect
            x="10"
            y="10"
            width="calc(100% - 20px)"
            height="calc(100% - 20px)"
            rx="24"
            fill="none"
            stroke="url(#emerald-pulse-grad)"
            strokeWidth="5.5"
            pathLength="100"
            className="emerald-flow-pulse"
            style={{
              willChange: "stroke-dashoffset",
            }}
          />

          {/* Haz 1 - Difuminación y halo de pulso brillante */}
          <rect
            x="10"
            y="10"
            width="calc(100% - 20px)"
            height="calc(100% - 20px)"
            rx="24"
            fill="none"
            stroke="url(#emerald-pulse-grad)"
            strokeWidth="18"
            pathLength="100"
            className="emerald-flow-pulse shadow-glow"
            style={{
              filter: "blur(12px)",
              willChange: "stroke-dashoffset, opacity, stroke-width",
            }}
          />

          {/* Aura Ambiental perimetral suave de color verde esmeralda */}
          <rect
            x="10"
            y="10"
            width="calc(100% - 20px)"
            height="calc(100% - 20px)"
            rx="24"
            fill="none"
            stroke="#00f5a0"
            strokeWidth="30"
            pathLength="100"
            className="emerald-flow-pulse environmental-glow"
            style={{
              filter: "blur(32px)",
              willChange: "stroke-dashoffset, opacity",
            }}
          />
        </svg>
      </div>

      {/* ── CUERPO DEL DEMO EN CRISTAL PURO TEMPLADO HIPER-TRANSPARENTE ── */}
      <div
        style={{
          transform: "translate3d(0,0,0)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden" as any,
        }}
        className="h-full w-full p-6 pt-5 bg-gradient-to-br from-white/[0.07] via-white/[0.02] to-transparent backdrop-blur-[24px] border border-white/[0.12] rounded-[24px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.95),inset_0_1px_2px_rgba(255,255,255,0.20),inset_0_-1px_1px_rgba(0,0,0,0.4)] relative z-10 overflow-hidden flex flex-col"
      >
        {/* Capa de reflejo de luz diagonal de cristal liso y pulido */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.01] to-white/[0.08] pointer-events-none z-0" />

        {/* Cabecera del Cristal al estilo Mac (Idéntica a la consola) */}
        <div className="relative z-20 flex items-center justify-between border-b border-zinc-900/[0.10] pb-4 mb-4 w-full">
          {/* Botones de Mac */}
          <div className="flex gap-1.5 flex-1 items-center">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] opacity-95 hover:opacity-100 transition-opacity"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] opacity-95 hover:opacity-100 transition-opacity"></div>
            <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] opacity-95 hover:opacity-100 transition-opacity"></div>
          </div>

          {/* POWERED BY Google en el Centro */}
          <div className="flex-1 flex justify-center items-center">
            <div 
              className="text-center pointer-events-none select-none whitespace-nowrap flex items-center justify-center"
              style={{
                fontFamily: "var(--s-font-display, 'Orbitron', sans-serif)",
                fontSize: "10px",
                fontWeight: 500,
                color: "rgba(255, 255, 255, 0.95)",
              }}
            >
              <span style={{ letterSpacing: "0.3em", textIndent: "0.3em", marginRight: "2px" }}>POWERED BY</span>
              <span style={{
                fontFamily: "var(--s-font-display, 'Orbitron', sans-serif)",
                fontSize: "12px",
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
          </div>

          {/* Info de Motor a la Derecha */}
          <div className="font-mono text-[10px] text-white/85 font-bold flex-1 text-right">engine_v2.0.4 // LOCAL_MODE</div>
        </div>

        {/* Contenedor del Cuerpo */}
        <div className="flex-1 w-full overflow-hidden rounded-2xl bg-[#12121A] md:rounded-2xl relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  );
};
