import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { motion, useMotionValue } from "framer-motion";

export const InsightsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // MotionValues del orbe — posición y tamaño controlados por scroll sin re-render de React
  const orbTop = useMotionValue("100%");
  const orbLeft = useMotionValue("50%");
  const orbTransformY = useMotionValue("-38%");
  const orbSize = useMotionValue(280); // px — crece con el scroll

  // Texto — sube desde debajo del viewport
  const textY = useMotionValue("100vh");

  useEffect(() => {
    const mainElement = document.querySelector("main");
    if (!mainElement) return;

    const handleScroll = () => {
      const scrollTop = mainElement.scrollTop;
      const clientHeight = mainElement.clientHeight || window.innerHeight;
      const progress = Math.min(Math.max(scrollTop / clientHeight, 0), 1);

      // ─── Orbe ───
      // Llega a posición final al 80% del scroll; el 20% restante queda quieto
      const op = Math.min(progress / 0.8, 1);
      orbTop.set(`${100 - op * 50}%`);          // 100% → 50%  (sube al centro vertical)
      orbLeft.set(`${50 + op * 25}%`);           // 50%  → 75%  (se mueve a la derecha)
      orbTransformY.set(`${-38 - op * 12}%`);   // -38% → -50% (ajuste de centrado)

      // Tamaño: crece de 280px a 480px mientras sube (scroll-driven)
      const isMd = window.innerWidth >= 768;
      const startSize = isMd ? 340 : 280;
      const endSize   = isMd ? 480 : 340;
      orbSize.set(startSize + op * (endSize - startSize));

      // ─── Texto ───
      // Empieza a subir desde el 5% del scroll con ease-out cúbico
      const tp = Math.min(Math.max((progress - 0.05) / 0.95, 0), 1);
      const eased = 1 - Math.pow(1 - tp, 3);
      textY.set(`${(1 - eased) * 100}vh`);
    };

    handleScroll();
    mainElement.addEventListener("scroll", handleScroll, { passive: true });
    return () => mainElement.removeEventListener("scroll", handleScroll);
  }, [orbTop, orbLeft, orbTransformY, orbSize, textY]);

  return (
    <section
      ref={sectionRef}
      id="insights-section"
      className="w-full h-[calc(100vh-4rem)] bg-white snap-start relative overflow-hidden"
    >
      {/* ── Orbe DEX ── fixed, tamaño y posición controlados por scroll */}
      <motion.div
        id="dentaxy-ai-orb"
        style={{
          position: "fixed",
          left: orbLeft,
          top: orbTop,
          translateX: "-50%",
          translateY: orbTransformY,
          zIndex: 100,
          // Tamaño dinámico vía MotionValue
          width: orbSize,
          height: orbSize,
        }}
        className="rounded-full overflow-hidden"
      >
        <video
          src="/logos/Dentaxy AI.mp4"
          autoPlay
          muted
          playsInline
          loop
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* ── Texto DEX ── sube desde abajo, posicionado en el tercio izquierdo-centro */}
      <motion.div
        style={{ y: textY }}
        className="absolute inset-0 flex items-center z-10 pointer-events-none"
      >
        {/* Contenedor de texto desplazado hacia el centro-derecha del lado izquierdo */}
        <div
          className="pointer-events-auto w-full max-w-[520px]"
          style={{ marginLeft: "clamp(4rem, 16vw, 22rem)" }}
        >
          {/* Badge + meta */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="inline-block px-3.5 py-1.5 bg-[#10b981] text-white rounded text-sm font-semibold uppercase tracking-[0.08em] font-mono shadow-[0_0_12px_rgba(16,185,129,0.35)] border border-emerald-400/25">
              AGENTE DEX
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <span>Redacción Médica IA</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Hace 2 horas
              </span>
            </div>
          </div>

          {/* Texto principal */}
          <div className="space-y-3 mb-7">
            <p className="text-base md:text-lg text-gray-500 font-semibold tracking-wide">
              Hola, doctor.
            </p>
            <h2 className="text-[clamp(36px,5.5vw,56px)] font-extrabold text-slate-900 tracking-tight leading-none">
              Soy DEX 👋
            </h2>
            <p className="text-lg md:text-xl font-bold text-slate-800 tracking-tight leading-snug pt-1">
              Sé que tu tiempo es valioso.
            </p>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed font-medium">
              Estoy aquí para acompañarte en Dentaxy y llevarte directo a lo que necesitas, sin que tengas que buscarlo.
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate("/app")}
            className="w-full bg-black hover:bg-neutral-800 text-white font-bold text-sm px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition-all border border-black"
          >
            Guiarme en Dentaxy →
          </button>
        </div>
      </motion.div>
    </section>
  );
};
