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
        willChange: "transform",
      }}
      className={`max-w-[1600px] md:-mt-36 -mt-16 mx-auto h-[30rem] md:h-[42rem] w-full relative z-20 ${className || ''}`}
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
      {/* ── CUERPO SÓLIDO DEL DEMO (Efectos de luz verde eliminados) ── */}
      <div
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.55)",
          transform: "translate3d(0,0,0)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden" as any,
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
