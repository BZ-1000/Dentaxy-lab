import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import HeroAnimation from "@/components/seed/HeroAnimation";
import AnimatedDemoUI from "@/components/seed/AnimatedDemoUI";
import { WorkflowSection } from "@/components/seed/WorkflowSection";
import { AppleDockHover } from "@/components/ui/AppleDockHover";
import "./Seed.css";
import {
  CircleX, CircleCheck, FileText, FolderOpen, CalendarDays,
  Wallet, ClipboardList, Mic, ArrowRight, Shield, BadgeCheck,
  Unlock, CalendarX, Cloud, ChevronRight, Zap, Lock,
  HardDrive, Users, Sparkles, Star, Check, RefreshCw
} from "lucide-react";


/* ── Animaciones Scroll Premium (Ida y Venida) ── */
const RevealDiv = ({ className = "", children, delay = 0, ...props }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, margin: "0px 0px -10% 0px" }}
    transition={{ type: "spring", stiffness: 100, damping: 20, delay: delay * 0.1 }}
    className={`transform-gpu will-change-[opacity,transform] ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

const BentoCard = ({ className = "", children, delay = 0, ...props }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, margin: "0px 0px -10% 0px" }}
    whileHover={{ scale: 1.015, y: -4, transition: { type: "spring", stiffness: 160, damping: 15 } }}
    transition={{ type: "spring", stiffness: 100, damping: 20, delay: delay * 0.1 }}
    className={`transform-gpu will-change-[opacity,transform] cursor-pointer bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 hover:bg-[#111111] hover:border-[rgba(0,201,128,0.25)] hover:shadow-lg hover:shadow-[rgba(0,201,128,0.08)] transition-colors duration-300 ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

const LightBentoCard = ({ className = "", children, delay = 0, ...props }: any) => {
  const classes = className.split(" ");
  const colSpanClass = classes.find(c => c.includes("col-span")) || "";
  const groupClass = classes.find(c => c === "group") || "";
  const remainingClasses = classes.filter(c => !c.includes("col-span") && c !== "group").join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "0px 0px -10% 0px" }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: delay * 0.1 }}
      className={`relative h-full ${colSpanClass} ${groupClass}`}
    >
      <AppleDockHover hoverScale={1.015} hoverY={-4} className="h-full">
        <div
          className={`h-full bg-zinc-50 border border-zinc-200/60 rounded-2xl p-6 hover:bg-white hover:border-[#00C980]/40 hover:shadow-[0_12px_30px_rgba(0,201,128,0.06)] transition-all duration-300 antialiased ${remainingClasses}`}
          style={{ 
            backfaceVisibility: "hidden", 
            transform: "translateZ(0)",
            WebkitFontSmoothing: "antialiased"
          }}
          {...props}
        >
          {children}
        </div>
      </AppleDockHover>
    </motion.div>
  );
};

const ScrollIntroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Tarjeta contenedor
  const cardScale   = useTransform(scrollYProgress, [0, 0.45], [0.93, 1.0]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.4, 0.75, 0.95], [0, 1, 1, 0]);

  // Frase (primer plano - movimiento rápido)
  const phraseY       = useTransform(scrollYProgress, [0, 0.35, 0.65], [120, 0, -180]);
  const phraseOpacity = useTransform(scrollYProgress, [0, 0.25, 0.42, 0.65], [0, 1, 1, 0]);

  // Marca DENTAXY (fondo - movimiento lento, sin blur)
  const dentaxyY       = useTransform(scrollYProgress, [0.38, 0.68, 0.95], [160, 0, -60]);
  const dentaxyScale   = useTransform(scrollYProgress, [0.38, 0.68, 0.95], [0.85, 1.0, 1.05]);
  const dentaxyOpacity = useTransform(scrollYProgress, [0.38, 0.58, 0.9], [0, 1, 0.85]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[100vh] bg-black flex items-center justify-center py-12 md:py-24 px-4 md:px-8 overflow-visible relative z-10"
    >
      <motion.div
        style={{ scale: cardScale, opacity: cardOpacity }}
        className="w-full max-w-[1400px] h-full rounded-[32px] md:rounded-[48px] border border-zinc-800/40 bg-zinc-950 overflow-hidden relative flex items-center justify-center shadow-2xl"
      >
        {/* Glow verde Dentaxy */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,201,128,0.03)_0%,transparent_70%)] pointer-events-none" />

        {/* Frase del pasado */}
        <motion.div
          style={{ y: phraseY, opacity: phraseOpacity }}
          className="absolute text-center px-6 max-w-4xl z-10 pointer-events-none"
        >
          <p className="text-xl sm:text-2xl md:text-3xl font-mono tracking-wide text-zinc-300 font-light leading-relaxed">
            Ayer era papel, hoy es software, el futuro es...
          </p>
        </motion.div>

        {/* Marca DENTAXY */}
        <motion.div
          style={{ y: dentaxyY, scale: dentaxyScale, opacity: dentaxyOpacity }}
          className="absolute text-center w-full z-0 pointer-events-none flex flex-col items-center justify-center"
        >
          <h1
            style={{
              fontFamily: "'Bruno Ace SC', sans-serif",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
              fontSize: "clamp(72px, 15vw, 200px)",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              userSelect: "none",
            }}
          >
            DENTAXY
          </h1>
        </motion.div>
      </motion.div>
    </div>
  );
};

const ThreeCardsShowcase = () => {
  const cardsData = [
    {
      phase: "PASADO",
      title: "Papel (Ayer)",
      points: [
        "Archivo físico voluminoso e imposible de escalar.",
        "Búsqueda manual que consume minutos por paciente.",
        "Riesgo permanente de pérdida por daño, robo o desastre.",
        "Sin respaldo: si se destruye, desaparece para siempre.",
        "Ilegible, inconsistente entre dentistas.",
        "Imposible compartir o auditar clínicamente."
      ],
      footer: "Total dependencia de procesos manuales.",
      themeColor: "text-red-600",
      badgeClass: "bg-red-100 text-red-700 border-red-200/80 font-bold",
      bulletIcon: "✖",
      bulletClass: "text-red-600 text-[15px] leading-none select-none mt-0.5"
    },
    {
      phase: "PRESENTE",
      title: "Software Estándar (Hoy)",
      points: [
        "Introducción manual de datos en cada campo.",
        "Interfaces fragmentadas: un módulo por tarea, sin cohesión.",
        "Copias de seguridad manuales, en silos desconectados.",
        "Sin inteligencia clínica: el sistema no te guía, solo almacena.",
        "Redacción libre = errores, omisiones y textos inconsistentes.",
        "Análisis de datos prácticamente nulo o externo al flujo clínico.",
        "Aprendizaje lento: cada consultorio lo usa diferente."
      ],
      footer: "Digital, pero propenso a errores de entrada y curvas de aprendizaje lentas.",
      themeColor: "text-blue-650",
      badgeClass: "bg-blue-100 text-blue-700 border-blue-200/80 font-bold",
      bulletIcon: "✖",
      bulletClass: "text-blue-600 text-[15px] leading-none select-none mt-0.5"
    },
    {
      phase: "FUTURO",
      title: "DENTAXY",
      points: [
        "Flujo clínico guiado en 20 pasos: estructurado, predecible y sin omisiones.",
        "Motor de redacción sofisticado y determinista: texto clínico profesional generado automáticamente, sin improvisaciones.",
        "Odontograma digital con 33+ hallazgos clínicos codificados en FDI.",
        "Diagnóstico y plan de tratamiento redactados en segundos desde los datos reales del paciente.",
        "Cero ambigüedad: cada expediente sigue la misma lógica clínica rigurosa.",
        "Respaldo automático, seguro y accesible desde cualquier dispositivo.",
        "Diseñado por y para dentistas mexicanos desde el primer día."
      ],
      footer: "Flujo de trabajo inteligente y verificado, libre de errores.",
      themeColor: "text-[#00a86b]",
      badgeClass: "bg-[#00C980]/15 text-[#00a86b] border-[#00C980]/40 font-bold",
      bulletIcon: "✔",
      bulletClass: "text-[#00C980] text-[15px] leading-none select-none mt-0.5"
    }
  ];

  return (
    <section className="bg-black pt-20 md:pt-36 pb-16 md:pb-28 mt-0 relative z-10 w-full overflow-hidden">
      <div className="max-w-[1200px] w-full mx-auto px-6">
        {/* Título de sección sutil y premium */}
        <RevealDiv className="text-center mb-16 md:mb-24">
          <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#00C980] uppercase mb-3 block">
            Tres eras. Una sola dirección.
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tighter text-white leading-tight">
            El expediente clínico evolucionó. ¿Tu consultorio también?
          </h2>
        </RevealDiv>

        {/* Grid de las tres tarjetas estilo móviles (alto adaptado a aspect-[9/16.9] para el texto expandido) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 justify-center items-stretch">
          {cardsData.map((card, idx) => (
            <RevealDiv 
              key={idx} 
              delay={idx + 1}
              className="relative w-full max-w-[360px] mx-auto flex"
            >
              {/* Animación física de resorte Apple Dock para un hover ultra-fluido y elástico */}
              <AppleDockHover hoverScale={1.035} hoverY={-12} className="relative flex w-full">
                {/* Tarjeta externa que simula el borde físico del teléfono */}
                <div 
                  className="w-full aspect-[9/17] rounded-[40px] md:rounded-[48px] bg-zinc-950 p-3 shadow-2xl relative border border-zinc-800/40 flex flex-col hover:shadow-[0_30px_60px_rgba(0,201,128,0.06)] transition-shadow duration-500"
                  style={{
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255,255,255,0.05)"
                  }}
                >
                  {/* Pantalla interna (Card original en blanco bg-[#f4f4f5] optimizada para alta densidad) */}
                  <div className="w-full h-full rounded-[32px] md:rounded-[40px] bg-[#f4f4f5] relative overflow-hidden flex flex-col justify-between p-5 pt-6 pb-5">
                    
                    {/* Speaker Notch / Dynamic Island del smartphone */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-4 bg-zinc-950 rounded-full flex items-center justify-center z-30 shadow-inner">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-850 absolute right-4"></div>
                    </div>

                    {/* Cabecera / Status Bar */}
                    <div className="w-full flex justify-between items-center mt-1 z-10 text-[10px] font-mono text-zinc-500 font-medium px-1">
                      <span>9:41</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-2 bg-zinc-900 rounded-sm"></span>
                      </div>
                    </div>

                    {/* Contenido Principal */}
                    <div className="w-full flex-1 flex flex-col justify-start z-10 pt-6 pb-2">
                      
                      {/* Badge de Fase (PASADO / PRESENTE / FUTURO) */}
                      <div className="mb-3">
                        <span className={`inline-block font-mono text-[9px] font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${card.badgeClass}`}>
                          {card.phase}
                        </span>
                      </div>

                      {/* Título de la tarjeta (Letras ultra visibles) */}
                      <h3 className="text-base md:text-lg font-sans font-bold tracking-tight text-zinc-950 mb-4">
                        {card.title}
                      </h3>

                      {/* Lista de Puntos (Textos negros en tamaño compacto de alta legibilidad y alineación compacta) */}
                      <ul className="space-y-2.5 text-left overflow-y-auto max-h-[340px] pr-1 scrollbar-thin">
                        {card.points.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2.5">
                            <span className={`flex-shrink-0 ${card.bulletClass}`}>
                              {card.bulletIcon}
                            </span>
                            <span className="text-[10.5px] md:text-[11.5px] text-black leading-relaxed font-sans font-normal">
                              {point}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pie de Pantalla / Texto Inferior (Letras negras limpias) */}
                    <div className="w-full z-10 pt-3 border-t border-zinc-200/80 pb-2">
                      <p className="text-[10px] md:text-[11px] text-black font-sans font-normal leading-normal">
                        {card.footer}
                      </p>
                    </div>

                    {/* Barra de inicio inferior física */}
                    <div className="w-28 h-1 bg-zinc-950 rounded-full mx-auto mt-0.5 z-10 opacity-40"></div>
                  </div>
                </div>
              </AppleDockHover>
            </RevealDiv>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function SeedLanding() {
  const navigate = useNavigate();

  const [demoTrigger, setDemoTrigger] = useState(0);
  const [demoComplete, setDemoComplete] = useState(false);

  // Estado para las FAQ
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Estado para la sección interactiva de infraestructura y reconocimientos
  const [activeValidationIdx, setActiveValidationIdx] = useState<number>(0);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="seed-v2 relative overflow-x-clip w-full">
      {/* ══════════════════════════════════════════════
          1. HERO SECTION — Dark Futuristic
          ══════════════════════════════════════════════ */}
      <HeroAnimation
        dienteImg="/Seed/diente.png"
        manoHumanaImg="/Seed/hand2.png"
        manoRobotImg="/Seed/mano-robot.png"
        className="seed-section hero-dark-section"
      />

      {/* ══════════════════════════════════════════════
          2.0 SECCIÓN NEGRA PANTALLA COMPLETA
          ══════════════════════════════════════════════ */}
      <ScrollIntroSection />

      {/* ══════════════════════════════════════════════
          2.1 TRES TARJETAS EN BLANCO (ESTILO PANTALLAS MÓVILES)
          ══════════════════════════════════════════════ */}
      <ThreeCardsShowcase />

      <section id="que-es" className="bg-black relative z-10 w-full pb-20 pt-16">
        <div className="max-w-[1200px] w-full mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Columna Izquierda: Copy */}
            <RevealDiv className="max-w-xl lg:col-span-5">
              <div className="font-mono text-[10px] sm:text-xs font-bold tracking-widest text-[#00C980] uppercase mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00C980] animate-pulse"></span>
                <span style={{ fontFamily: "'Bruno Ace SC', sans-serif" }}>DentaXy Seed</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-sans font-light tracking-tighter text-white leading-[1.1] mb-6">
                Tu consultorio lleva años con un problema que ya tiene solución.
              </h2>
              <p className="font-mono text-base text-zinc-400 leading-relaxed mb-8">
                Mientras el papel te roba tiempo, Seed redacta, organiza y guarda. 
                De forma determinista, local e instantánea.
              </p>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/seed/login')}
                  className="bg-[#00C980] hover:bg-[#00b371] text-black font-mono text-sm px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                >
                  Probar Seed <ArrowRight size={16} />
                </button>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-zinc-200 flex items-center justify-center text-xs">👨‍⚕️</div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-zinc-200 flex items-center justify-center text-xs">👩‍⚕️</div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-[10px] font-mono text-zinc-600">+50</div>
                </div>
              </div>
            </RevealDiv>

            {/* Columna Derecha: Consola */}
            <RevealDiv delay={1} className="relative group lg:col-span-7">
              <div className="relative w-full lg:w-[130%] max-w-[calc(100vw-2rem)] lg:max-w-[calc(100vw-3rem)] lg:translate-x-6 z-20">
                {/* ── ELEMENTOS TRASEROS CROMADOS Y DE CONTRASTE HIPER-BRILLANTES CON PULSO TRASERO ── */}
                
                {/* Luz Azul/Blanca superior: Pulso diagonal profundo original desde la esquina */}
                <motion.div 
                  className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-white/35 via-[#3B82F6]/35 to-transparent blur-[60px] pointer-events-none z-0"
                  animate={{
                    x: [0, -140, 0],
                    y: [0, 140, 0],
                    scale: [1, 1.15, 1],
                    opacity: [0.8, 1.0, 0.8]
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />

                {/* Luz Azul/Blanca inferior: Pulso diagonal hacia el centro */}
                <motion.div 
                  className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-white/30 via-[#3B82F6]/25 to-transparent blur-[60px] pointer-events-none z-0"
                  animate={{
                    x: [0, 140, 0],
                    y: [0, -140, 0],
                    scale: [1, 1.15, 1],
                    opacity: [0.8, 1.0, 0.8]
                  }}
                  transition={{
                    duration: 9,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Luz Central izquierda: Pulso sutil */}
                <motion.div 
                  className="absolute top-[30%] left-[10%] w-80 h-80 rounded-full bg-gradient-to-r from-[#3B82F6]/15 via-white/10 to-transparent blur-[70px] pointer-events-none z-0"
                  animate={{
                    x: [0, 70, 0],
                    y: [0, -40, 0],
                    scale: [1, 1.08, 1],
                    opacity: [0.6, 0.85, 0.6]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
                
                {/* ── GLASSMORPHIC CONTAINER (Cristal esmerilado blanco ultra-realista con biseles reflectantes y acabado pulido liso) ── */}
                <div className="relative z-10 bg-gradient-to-br from-white/[0.24] via-white/[0.06] to-white/[0.02] backdrop-blur-[40px] border border-white/[0.28] rounded-xl p-6 overflow-hidden h-[600px] flex flex-col shadow-[0_35px_60px_-15px_rgba(0,0,0,0.9),inset_0_1px_3px_rgba(255,255,255,0.55),inset_0_-1px_1px_rgba(0,0,0,0.2)]">
                  
                  {/* Capa de reflejo de luz diagonal de cristal liso y pulido */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.01] to-white/[0.08] pointer-events-none z-0" />
                  
                  {/* Header Consola */}
                  <div className="relative z-10 flex items-center justify-between border-b border-zinc-900/[0.10] pb-4 mb-4">
                    <div className="flex gap-1.5 flex-1">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] opacity-95 hover:opacity-100 transition-opacity"></div>
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] opacity-95 hover:opacity-100 transition-opacity"></div>
                      <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] opacity-95 hover:opacity-100 transition-opacity"></div>
                    </div>
                  
                  <div className="flex-1 flex justify-center">
                    {demoComplete && (
                      <button 
                        onClick={() => { setDemoComplete(false); setDemoTrigger(t => t + 1); }}
                        className="font-mono text-xs tracking-widest uppercase text-white/95 hover:text-white transition-colors active:scale-95 flex items-center gap-2 font-bold"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-white/95 hover:text-white" />
                        Repetir Animación
                      </button>
                    )}
                  </div>

                  <div className="font-mono text-[10px] text-white/85 font-bold flex-1 text-right">engine_v2.0.4 // LOCAL_MODE</div>
                </div>
                
                {/* Body Consola Animado */}
                <div className="flex-1 overflow-hidden relative mt-2 -mx-2 -mb-2 rounded-b-lg">
                  <AnimatedDemoUI animationTrigger={demoTrigger} onAnimationComplete={() => setDemoComplete(true)} />
                </div>
              </div>
              </div>
            </RevealDiv>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2.5 ESPACIO EN BLANCO (Negro Puro)
          ══════════════════════════════════════════════ */}
      <section className="relative z-10 w-full bg-black h-20" />

      {/* ══════════════════════════════════════════════
          3. MÓDULOS — Bento Grid Light
          ══════════════════════════════════════════════ */}
      <section id="software" className="bg-black relative z-10 w-full py-12">
        <div className="max-w-[1400px] w-full mx-auto px-6">
          <RevealDiv className="w-full bg-white rounded-[32px] md:rounded-[48px] border border-zinc-200/80 shadow-[0_24px_80px_rgba(0,0,0,0.06)] p-6 md:py-12 md:px-12 relative overflow-hidden bg-[radial-gradient(circle_at_center,rgba(0,201,128,0.015)_0%,transparent_70%)]">
            
            <div className="mb-8 md:mb-12">
              <h2 className="text-3xl font-light tracking-tighter text-zinc-900 mb-4 font-sans leading-tight">
                <strong className="font-bold text-zinc-950">Software completo</strong>. <br/>Cero distracciones.
              </h2>
              <p className="font-mono text-base text-zinc-700 leading-relaxed max-w-xl">
                Diseñado estructuralmente como módulos independientes que corren directamente en tu navegador.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Bento 1: Privacidad */}
              <LightBentoCard delay={1} className="md:col-span-2 group">
                <div className="flex flex-col md:flex-row gap-8 h-full">
                  <div className="flex-1">
                    <Lock size={20} className="text-zinc-900 mb-6" />
                    <h3 className="text-xl font-light tracking-tight text-zinc-900 mb-2 font-sans"><strong className="font-bold text-zinc-950">Privacidad</strong> Absoluta</h3>
                    <p className="font-mono text-sm text-zinc-700 leading-relaxed mb-6 mt-1">
                      DentaXy no envía tus datos a servidores externos. Todo el procesamiento de texto clínico se hace mediante un motor determinista dentro del código local de tu página.
                    </p>
                    <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase px-3 py-1 bg-zinc-100 border border-zinc-200/80 rounded-full text-zinc-700 font-sans font-light">
                      <Shield size={12} className="text-zinc-500"/> Cumplimiento <strong className="font-bold text-[#00C980]">LFPDPPP</strong>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-full md:w-48 bg-zinc-950 border border-zinc-900 rounded-lg p-4 font-mono text-[10px] text-zinc-400">
                    <div className="mb-2 text-[#00C980] font-bold">NETWORK TRAFFIC</div>
                    <div className="flex justify-between border-b border-zinc-900 py-1"><span>api.openai.com</span><span className="text-[#00C980]">0 B</span></div>
                    <div className="flex justify-between border-b border-zinc-900 py-1"><span>api.anthropic.com</span><span className="text-[#00C980]">0 B</span></div>
                    <div className="flex justify-between py-1 font-bold text-white"><span>local_engine</span><span className="text-[#00C980]">ACTIVE</span></div>
                  </div>
                </div>
              </LightBentoCard>

              {/* Bento 2: Expediente */}
              <LightBentoCard delay={2} className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <img src="/logos/google-drive.png" className="w-10 h-10 object-contain" alt="Google Drive" />
                    <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-bold">Google Drive</span>
                  </div>
                  <h3 className="text-xl font-light tracking-tight text-zinc-900 mb-2 font-sans"><strong className="font-bold text-zinc-950">Drive</strong> Sync</h3>
                  <p className="font-mono text-sm text-zinc-700 leading-relaxed mt-1">
                    Cada paciente tiene su expediente completo guardado directamente en tu Google Drive.
                  </p>
                </div>
                <div className="text-4xl font-light text-zinc-400 mt-6 font-mono">∞</div>
              </LightBentoCard>

              {/* Bento 3: Agenda */}
              <LightBentoCard delay={3}>
                <div className="flex items-center gap-3 mb-6">
                  <img src="/logos/google-calendar.png" className="w-10 h-10 object-contain" alt="Google Calendar" />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-bold">Google Calendar</span>
                </div>
                <h3 className="text-xl font-light tracking-tight text-zinc-900 mb-2 font-sans"><strong className="font-bold text-zinc-950">Agenda</strong> Inteligente</h3>
                <p className="font-mono text-sm text-zinc-700 leading-relaxed mt-1">
                  Sincronización en tiempo real con Google Calendar. Sin duplicar trabajo.
                </p>
              </LightBentoCard>

              {/* Bento 4: Finanzas */}
              <LightBentoCard delay={4}>
                <div className="flex items-center gap-3 mb-6">
                  <img src="/logos/google-sheets.png" className="w-10 h-10 object-contain" alt="Google Sheets" />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-bold">Google Sheets</span>
                </div>
                <h3 className="text-xl font-light tracking-tight text-zinc-900 mb-2 font-sans"><strong className="font-bold text-zinc-950">Finanzas</strong> Locales</h3>
                <p className="font-mono text-sm text-zinc-700 leading-relaxed mt-1">
                  Control de cobros integrado directamente con Google Sheets.
                </p>
              </LightBentoCard>

              {/* Bento 5: Asistente */}
              <LightBentoCard delay={5}>
                <Mic size={20} className="text-zinc-900 mb-6" />
                <h3 className="text-xl font-light tracking-tight text-zinc-900 mb-2 font-sans"><strong className="font-bold text-zinc-950">Comandos</strong> de Voz</h3>
                <p className="font-mono text-sm text-zinc-700 leading-relaxed mt-1">
                  Navega y llena secciones críticas sin tocar el teclado.
                </p>
              </LightBentoCard>
            </div>

          </RevealDiv>
        </div>
      </section>



      <WorkflowSection />

      {/* ══════════════════════════════════════════════
          4.2 PATROCINIO GOOGLE Y RECONOCIMIENTOS (Paso 4)
          ══════════════════════════════════════════════ */}
      <section className="bg-zinc-950 relative z-10 w-full py-24 border-t border-[rgba(255,255,255,0.06)] overflow-hidden">
        {/* Luz de fondo sutil */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(255,255,255,0.015)_0%,transparent_70%)] pointer-events-none z-0" />
        
        {(() => {
          const validationCards = [
            {
              phase: "Infraestructura Oficial",
              title: "Patrocinado por Google",
              badgeText: "Google Partner",
              badgeClass: "bg-blue-500/15 text-blue-400 border-blue-500/30",
              description: "DentaXy es una plataforma patrocinada tecnológicamente por Google. Con base en esta alianza y buscando la máxima fiabilidad, decidimos que todo el poder interno del ecosistema DentaXy se apoye en los servicios y tecnologías de Google. Almacenamiento, base de datos federada y control de agenda corren sobre la infraestructura en la que todos confían, garantizando soberanía de datos y seguridad absoluta.",
              footerLeft: "Google Workspace & Cloud",
              footerRight: "Soberanía de Datos",
              rightBg: "bg-[#bae6fd]", // Soft blue
              rightBorder: "border-sky-300",
              rightRotation: "lg:rotate-[-6deg]",
              rightPosition: "lg:left-[20px] lg:top-[90px] z-[11]",
              isGoogle: true,
              illustration: (
                <div className="w-full h-32 bg-blue-500/10 rounded-xl flex items-center justify-center relative overflow-hidden border border-blue-500/20">
                  <svg className="w-12 h-12 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
                  </svg>
                  <div className="absolute top-2 right-2 font-mono text-[8px] text-blue-700 bg-blue-200 px-1 py-0.5 rounded font-bold border border-blue-300">CLOUD</div>
                </div>
              )
            },
            {
              phase: "Investigación Científica",
              title: "XXII Jornadas de Investigación Internacional de Odontología 2025",
              badgeText: "Primer Lugar 🏆",
              badgeClass: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
              description: "Ganador del primer lugar en el certamen científico de la Universidad Autónoma de Zacatecas (UAZ). Premio otorgado por el impacto clínico, la descentralización digital del expediente y la propuesta tecnológica de Seed frente a jurados internacionales.",
              footerLeft: "UAZ • Comité Evaluador 2025",
              footerRight: "Zacatecas, México",
              rightBg: "bg-[#fef08a]", // Soft yellow/gold (previously green)
              rightBorder: "border-yellow-300",
              rightRotation: "lg:rotate-[-2deg]",
              rightPosition: "lg:left-[130px] lg:top-[50px] z-[12]",
              isGoogle: false,
              illustration: (
                <div className="w-full h-32 bg-yellow-500/10 rounded-xl flex items-center justify-center relative overflow-hidden border border-yellow-500/20">
                  <svg className="w-12 h-12 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.75V8.25h1.875c.621 0 1.125-.504 1.125-1.125V3.75h-9v3.375c0 .621.504 1.125 1.125 1.125h1.875v5.25h-.75c-.621 0-1.125.504-1.125 1.125v3.375m9 0h-9M9 3.75h6" />
                  </svg>
                  <div className="absolute top-2 right-2 font-mono text-[8px] text-yellow-700 bg-yellow-200 px-1 py-0.5 rounded font-bold border border-yellow-300">PREMIO</div>
                </div>
              )
            },
            {
              phase: "Aceleración Tecnológica",
              title: "Tech Talk con Google México & POSIBLE",
              badgeText: "Top 25 Nacional ⚡",
              badgeClass: "bg-pink-500/15 text-pink-400 border-pink-500/30",
              description: "Seleccionado a nivel nacional dentro de los 25 mejores proyectos de alto impacto tecnológico en el programa POSIBLE. Presentación oficial en el foro de tecnología y salud celebrado en las oficinas centrales de Google México en la CDMX.",
              footerLeft: "Google México • POSIBLE",
              footerRight: "CDMX, México",
              rightBg: "bg-[#fbcfe8]", // Soft pink (previously yellow)
              rightBorder: "border-pink-300",
              rightRotation: "lg:rotate-[4deg]",
              rightPosition: "lg:left-[240px] lg:top-[10px] z-[13]",
              isGoogle: false,
              illustration: (
                <div className="w-full h-32 bg-pink-500/10 rounded-xl flex items-center justify-center relative overflow-hidden border border-pink-500/20">
                  <svg className="w-12 h-12 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                  <div className="absolute top-2 right-2 font-mono text-[8px] text-pink-700 bg-pink-200 px-1 py-0.5 rounded font-bold border border-pink-300">TECH TALK</div>
                </div>
              )
            }
          ];

          const selectedCard = validationCards[activeValidationIdx];

          return (
            <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10">
              
              <div className="grid lg:grid-cols-12 gap-16 items-center justify-center">
                
                {/* Columna Izquierda: Detalle de Validación (Card Principal) - Más ancha y alta */}
                <div className="lg:col-span-7 flex justify-center items-center w-full">
                  <div className="w-full max-w-[620px]">
                    <motion.div
                      key={activeValidationIdx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className={`${selectedCard.rightBg} border ${selectedCard.rightBorder} rounded-3xl p-8 md:p-10 flex flex-col justify-between relative overflow-hidden group shadow-xl min-h-[520px] text-zinc-950`}
                    >
                      {/* Glow sutil de color dinámico */}
                      <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/30 rounded-full blur-3xl pointer-events-none transition-all duration-500" />
                      
                      <div>
                        <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase mb-3 block text-zinc-600">
                          {selectedCard.phase}
                        </span>
                        
                        <div className="flex flex-col gap-2 mb-4">
                          <h3 className="text-2xl md:text-3xl font-bold text-zinc-950 leading-tight font-sans">
                            {selectedCard.title}
                          </h3>
                          <div>
                            <span className="inline-block font-mono text-[9.5px] font-bold px-2.5 py-0.5 rounded bg-zinc-950 text-white">
                              {selectedCard.badgeText}
                            </span>
                          </div>
                        </div>

                        <p className="font-mono text-xs sm:text-sm text-zinc-800 leading-relaxed mb-8">
                          {selectedCard.description}
                        </p>
                      </div>

                      {/* Detalle específico según tarjeta */}
                      {selectedCard.isGoogle ? (
                        /* Iconos de Google Workspace con logos reales */
                        <div className="bg-white/40 border border-black/10 rounded-2xl p-4 relative overflow-hidden flex items-center justify-around gap-2 shadow-inner mt-auto">
                          {/* Drive */}
                          <div className="flex flex-col items-center gap-1.5">
                            <div className="w-10 h-10 rounded-xl bg-white border border-black/10 flex items-center justify-center shadow-sm p-1.5">
                              <img src="/logos/google-drive.png" alt="Google Drive" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-[8px] font-mono text-zinc-700 font-bold uppercase tracking-wider">Drive</span>
                          </div>

                          {/* Calendar */}
                          <div className="flex flex-col items-center gap-1.5">
                            <div className="w-10 h-10 rounded-xl bg-white border border-black/10 flex items-center justify-center shadow-sm p-1.5">
                              <img src="/logos/google-calendar.png" alt="Google Calendar" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-[8px] font-mono text-zinc-700 font-bold uppercase tracking-wider">Calendar</span>
                          </div>

                          {/* Sheets */}
                          <div className="flex flex-col items-center gap-1.5">
                            <div className="w-10 h-10 rounded-xl bg-white border border-black/10 flex items-center justify-center shadow-sm p-1.5">
                              <img src="/logos/google-sheets.png" alt="Google Sheets" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-[8px] font-mono text-zinc-700 font-bold uppercase tracking-wider">Sheets</span>
                          </div>

                          {/* Cloud */}
                          <div className="flex flex-col items-center gap-1.5">
                            <div className="w-10 h-10 rounded-xl bg-white border border-black/10 flex items-center justify-center shadow-sm p-1.5">
                              <img src="/logos/google-cloud.png" alt="Google Cloud" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-[8px] font-mono text-zinc-700 font-bold uppercase tracking-wider">Cloud</span>
                          </div>

                          {/* Gmail */}
                          <div className="flex flex-col items-center gap-1.5">
                            <div className="w-10 h-10 rounded-xl bg-white border border-black/10 flex items-center justify-center shadow-sm p-1.5">
                              <img src="/logos/gmail.png" alt="Gmail" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-[8px] font-mono text-zinc-700 font-bold uppercase tracking-wider">Gmail</span>
                          </div>
                        </div>
                      ) : (
                        /* Metadatos de Certamen UAZ o POSIBLE */
                        <div className="border-t border-black/10 pt-4 mt-auto flex items-center justify-between">
                          <span className="text-[10px] font-mono text-zinc-600">{selectedCard.footerLeft}</span>
                          <span className="text-xs font-bold text-zinc-950">{selectedCard.footerRight}</span>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>

                {/* Lado Derecho: Selector de 3 Secciones Diagonales Overlapping - Con AppleDockHover y alto contraste */}
                <div className="lg:col-span-5 flex justify-center items-center w-full min-h-[380px] lg:min-h-[460px] relative">
                  
                  {/* Contenedor Responsivo para Móviles y Escritorio */}
                  <div className="flex flex-col md:flex-row lg:block gap-6 w-full max-w-[480px] relative lg:h-[420px] items-center justify-center">
                    {validationCards.map((card, idx) => {
                      const isActive = activeValidationIdx === idx;
                      
                      // Determinar z-index dinámico según selección para traer al frente
                      let zIndexClass = "z-[10]";
                      if (isActive) zIndexClass = "z-[30]";
                      else if ((activeValidationIdx + 1) % 3 === idx) zIndexClass = "z-[20]";
                      
                      return (
                        <motion.div
                          key={idx}
                          onClick={() => setActiveValidationIdx(idx)}
                          className={`
                            w-[245px] ${card.rightRotation} ${card.rightPosition} ${zIndexClass}
                            relative lg:absolute
                          `}
                        >
                          <AppleDockHover hoverScale={isActive ? 1.07 : 1.03} hoverY={isActive ? -8 : -4}>
                            <div
                              className={`
                                w-full rounded-3xl p-5 border cursor-pointer select-none transition-all duration-500 text-zinc-950
                                ${card.rightBg} ${isActive ? 'border-zinc-950 shadow-2xl ring-4 ring-black/10' : 'border-zinc-400/35 shadow-md'}
                              `}
                              style={{
                                boxShadow: isActive ? "0 20px 40px -10px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)" : "0 10px 20px -10px rgba(0,0,0,0.1)",
                              }}
                            >
                              {/* Contenido Card Derecho */}
                              <div className="flex flex-col h-full justify-between">
                                {/* Ilustración de la Card */}
                                {card.illustration}
                                
                                {/* Información */}
                                <div className="mt-2 text-zinc-950">
                                  <span className="font-mono text-[9px] font-bold tracking-wider text-zinc-600 uppercase">
                                    {card.phase}
                                  </span>
                                  <h4 className="text-sm font-bold text-zinc-950 leading-tight mt-1 mb-1 font-sans">
                                    {card.badgeText}
                                  </h4>
                                  <p className="text-[10px] text-zinc-800 leading-normal font-sans font-medium line-clamp-3">
                                    {card.description}
                                  </p>
                                </div>
                                
                                {/* Indicador de Activo */}
                                <div className="flex justify-end items-center mt-3 pt-2 border-t border-black/10">
                                  {isActive ? (
                                    <span className="text-[9px] font-mono font-bold text-zinc-950 flex items-center gap-1">
                                      Seleccionado <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-ping"></span>
                                    </span>
                                  ) : (
                                    <span className="text-[9px] font-mono text-zinc-550">
                                      Click para ver
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </AppleDockHover>
                        </motion.div>
                      );
                    })}
                  </div>

                </div>

              </div>
            </div>
          );
        })()}
      </section>

      {/* ══════════════════════════════════════════════
          4.5 AUTORIDAD DEL CREADOR (Paso 5)
          ══════════════════════════════════════════════ */}
      <section className="bg-black relative z-10 w-full py-24 border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[1000px] w-full mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            {/* Story Image Placeholder */}
            <div className="md:col-span-5 relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#00C980] to-[#3B82F6] rounded-2xl blur opacity-15"></div>
              <div className="relative bg-[#0d0d0d] border border-[rgba(0,201,128,0.15)] rounded-xl p-8 text-center text-white overflow-hidden shadow-lg h-[320px] flex flex-col justify-center items-center">
                <span className="text-6xl mb-4">⚕️</span>
                <span className="font-mono text-xs tracking-wider uppercase text-zinc-400">Validación Médica Real</span>
                <h4 className="font-light text-xl mt-2 text-white font-sans">Diseñado por <strong className="font-bold text-[#00C980]">Médicos</strong></h4>
                <p className="font-mono text-xs text-zinc-300 leading-relaxed max-w-[200px] mt-3">
                  No por <strong className="font-bold text-white">programadores</strong> ajenos al <strong className="font-bold text-white">dolor del sillón</strong> dental.
                </p>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#00C980]/10 rounded-full blur-xl"></div>
              </div>
            </div>

            {/* Story Text */}
            <div className="md:col-span-7 flex flex-col justify-center">
              <span className="eyebrow">Empatía Clínica</span>
              <h2 className="display-lg mb-6 font-sans font-light text-white">Nacimos en el <strong className="font-bold text-[#00C980]">dolor</strong> de la <strong className="font-bold text-white">trinchera clínica</strong></h2>
              <p className="font-mono text-base text-zinc-400 leading-relaxed mb-4">
                Llenar un periodontograma no debería requerir un posgrado en informática. Escribir a mano notas clínicas duplicadas solo para guardarlas en carpetas de papel que se llenan de polvo es ineficiente y arriesgado.
              </p>
              <p className="font-mono text-base text-zinc-400 leading-relaxed mb-6">
                DentaXy no fue conceptualizado por una corporación de software estadounidense. Nació de la desesperación de médicos cirujanos mexicanos que vivieron el dolor del papeleo burocrático bajo la norma NOM-004-SSA3-2012. 
                Se diseñó para ser el software clínico que nosotros mismos quisiéramos usar: instantáneo, offline, 100% privado y sumamente rápido.
              </p>
              <div className="quote-block">
                "La medicina es fluidez y atención al paciente. Todo software que se interponga entre el odontólogo y la mirada de su paciente, ha fracasado. Seed es invisible, corre a tu ritmo."
                <span className="block font-bold text-xs text-white mt-2 not-italic font-mono">— Fundador Clínico de DentaXy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4.8 OBJECIONES RESPONDIDAS (Paso 6 - Bento Grid)
          ══════════════════════════════════════════════ */}
      <section className="bg-black relative z-10 w-full py-20 border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[1200px] w-full mx-auto px-6">
          <div className="text-center mb-16">
            <span className="eyebrow">Cero Dudas, Cero Riesgos</span>
            <h2 className="display-lg mb-4 font-sans font-light text-white">Todo lo que <strong className="font-bold text-[#00C980]">necesitas saber</strong></h2>
            <p className="font-mono text-base text-zinc-400 leading-relaxed max-w-xl mx-auto">
              Respondemos las preguntas difíciles sin tecnicismos ni evasivas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 hover:border-[#00C980]/30 hover:bg-[#111111] transition-all">
              <div className="icon-wrap mb-6">
                <Shield size={20} />
              </div>
              <h3 className="text-lg font-light text-white mb-2 font-sans">¿Cumple la <strong className="font-bold text-[#00C980]">NOM-004-SSA3-2012</strong>?</h3>
              <p className="font-mono text-sm text-zinc-500 leading-relaxed mt-1">
                Sí. Todos los expedientes, consentimientos informados firmados digitalmente y notas SOAP de evolución se ajustan a las 21 secciones obligatorias del marco legal y de salud en México.
              </p>
            </div>

            <div className="bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 hover:border-[#00C980]/30 hover:bg-[#111111] transition-all">
              <div className="icon-wrap icon-wrap-blue mb-6">
                <Cloud size={20} />
              </div>
              <h3 className="text-lg font-light text-white mb-2 font-sans">¿Y si <strong className="font-bold text-white">no tengo Internet</strong>?</h3>
              <p className="font-mono text-sm text-zinc-500 leading-relaxed mt-1">
                El sistema ejecuta todo el motor de redacción clínica en el procesador local de tu dispositivo. Puedes registrar consultas completas offline, y se sincronizarán en Drive al reconectar.
              </p>
            </div>

            <div className="bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 hover:border-[#00C980]/30 hover:bg-[#111111] transition-all">
              <div className="icon-wrap icon-wrap-ink mb-6">
                <HardDrive size={20} />
              </div>
              <h3 className="text-lg font-light text-white mb-2 font-sans">¿Quién es <strong className="font-bold text-white">dueño de mis datos</strong>?</h3>
              <p className="font-mono text-sm text-zinc-500 leading-relaxed mt-1">
                Tú. Los datos clínicos de tus pacientes se guardan directamente en tu cuenta personal de Google Drive. DentaXy no almacena nada en servidores propios. Privacidad absoluta y soberanía digital real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          5. PRICING — B2B SaaS Style (Paso 7 - Precios y Anclaje)
          ══════════════════════════════════════════════ */}
      <section id="precios" className="bg-black relative z-10 w-full py-24 border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[1100px] w-full mx-auto px-6">
          <RevealDiv className="text-center mb-16">
            <span className="eyebrow">Planes Claros e Inversión Rentable</span>
            <h2 className="display-lg mb-4 font-sans font-light text-white">
              Invierte en <strong className="font-bold text-white">fluidez</strong>, elimina la <strong className="font-bold text-white">burocracia</strong>
            </h2>
            <p className="font-mono text-base text-zinc-400 leading-relaxed max-w-xl mx-auto">
              Mientras el papel te cuesta miles de pesos al año en horas perdidas, DentaXy Seed se paga solo desde el primer día.
            </p>
          </RevealDiv>

          <div className="grid md:grid-cols-3 gap-8 items-stretch mb-20">
            {/* Plan Semilla */}
            <RevealDiv delay={1} className="bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 flex flex-col justify-between">
              <div>
                <span className="label-sm text-zinc-400 font-mono">Para Empezar</span>
                <h3 className="text-xl font-light text-white mt-1 mb-4 font-sans">Plan <strong className="font-bold text-white">Semilla</strong></h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-xl font-bold text-white">$</span>
                  <span className="price-tag">199</span>
                  <span className="price-period">/ mes</span>
                </div>
                <div className="font-mono text-[9px] text-zinc-500 pb-6 border-b border-[rgba(255,255,255,0.06)] mb-6">MXN · Primeros 50 fundadores</div>
                
                <ul className="space-y-3 mb-8">
                  {[
                    "Historia Clínica general completa",
                    "Motor de redacción determinista",
                    "Odontograma SVG interactivo",
                    "Sincronización con Google Drive",
                    "Cumplimiento básico de la NOM-004",
                    "Soporte por correo electrónico"
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 font-mono text-[11.5px] text-zinc-400">
                      <Check size={13} className="text-[#00C980] mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <button 
                onClick={() => navigate('/seed/login')}
                className="w-full btn btn-ghost btn-sm"
              >
                Comenzar Semilla
              </button>
            </RevealDiv>

            {/* Plan Raíz - MÁS ELEGIDO */}
            <RevealDiv delay={2} className="bg-zinc-950 border-2 border-[#00C980] rounded-xl p-8 flex flex-col justify-between relative shadow-[0_12px_40px_rgba(0,201,128,0.12)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00C980] text-zinc-950 font-mono text-[9px] font-bold uppercase px-3 py-1 rounded-full tracking-wider">
                Recomendado
              </div>
              <div>
                <span className="label-sm text-[#00C980] font-mono">El Pack Completo</span>
                <h3 className="text-xl font-light text-white mt-1 mb-4 font-sans">Plan <strong className="font-bold text-white">Raíz</strong></h3>
                <div className="flex items-baseline gap-1 mb-2 text-white">
                  <span className="text-xl font-bold">$</span>
                  <span className="price-tag text-white">299</span>
                  <span className="price-period text-zinc-500">/ mes</span>
                </div>
                <div className="font-mono text-[9px] text-zinc-500 pb-6 border-b border-zinc-800 mb-6">MXN · Un solo médico</div>
                
                <ul className="space-y-3 mb-8">
                  {[
                    "Todo lo del Plan Semilla",
                    "8 Especialidades Clínicas integradas",
                    "Periodontograma interactivo de voz",
                    "Visor DICOM gratuito integrado",
                    "Sincronización con Google Calendar",
                    "Control de cobros en Google Sheets",
                    "Soporte preferente vía WhatsApp"
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 font-mono text-[11.5px] text-zinc-300">
                      <Check size={13} className="text-[#00C980] mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <button 
                onClick={() => navigate('/seed/login')}
                className="w-full btn btn-primary btn-sm shadow-[0_4px_20px_rgba(0,201,128,0.3)]"
              >
                Obtener Plan Raíz
              </button>
            </RevealDiv>

            {/* Plan Clínica */}
            <RevealDiv delay={3} className="bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 flex flex-col justify-between">
              <div>
                <span className="label-sm text-zinc-400 font-mono">Para Equipos</span>
                <h3 className="text-xl font-light text-white mt-1 mb-4 font-sans">Plan <strong className="font-bold text-white">Clínica</strong></h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-xl font-bold text-white">$</span>
                  <span className="price-tag">499</span>
                  <span className="price-period">/ mes</span>
                </div>
                <div className="font-mono text-[9px] text-zinc-500 pb-6 border-b border-[rgba(255,255,255,0.06)] mb-6">MXN · Hasta 5 doctores activos</div>
                
                <ul className="space-y-3 mb-8">
                  {[
                    "Todo lo del Plan Raíz",
                    "Soporte para hasta 5 médicos activos",
                    "Panel administrativo del supervisor",
                    "Nómina y comisiones básicas",
                    "Estadísticas clínicas globales",
                    "Google Drive corporativo multi-cuenta",
                    "Capacitación de personal incluida"
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 font-mono text-[11.5px] text-zinc-400">
                      <Check size={13} className="text-[#00C980] mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <button 
                onClick={() => navigate('/seed/login')}
                className="w-full btn btn-ghost btn-sm"
              >
                Contactar Clínica
              </button>
            </RevealDiv>
          </div>

          {/* ══════════════════════════════════════════════
              5.5 URGENCIA Y GARANTÍA (Paso 8)
              ══════════════════════════════════════════════ */}
          <div className="bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex-1">
              <span className="chip chip-red font-mono mb-3">OFERTA LIMITADA DE PREVENTA</span>
              <h4 className="font-light text-lg text-white mb-1 font-sans">¡Quedan solo <strong className="font-bold text-white">12 de 50 accesos</strong> fundadores!</h4>
              <p className="font-mono text-sm text-zinc-500 leading-relaxed mt-1">
                Asegura tu precio especial de preventa de $199/mes de forma permanente. El costo aumentará en la siguiente fecha de lanzamiento.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center flex-shrink-0 bg-[#2b0000] border border-red-900/40 p-4 rounded-xl text-center min-w-[140px]">
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest font-mono">Quedan</span>
              <span className="text-3xl font-extrabold text-red-500 font-mono my-0.5">12</span>
              <span className="text-[10px] text-zinc-400 font-mono">cupos de preventa</span>
            </div>
          </div>

          {/* Garantía de Soberanía Digital */}
          <div className="text-center mt-12 max-w-xl mx-auto">
            <Shield size={24} className="text-[#00C980] mx-auto mb-3" />
            <h4 className="font-light text-sm text-white mb-1 font-sans">Garantía de <strong className="font-bold text-white">Soberanía Digital</strong></h4>
            <p className="font-mono text-base text-zinc-400 leading-relaxed max-w-xl mx-auto">
              Tus expedientes son tuyos. Si en algún momento decides cancelar tu suscripción, tus datos siguen en tu cuenta de Google Drive y puedes descargarlos en un clic. Sin contratos de exclusividad, sin trabas ni plazos forzosos.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          6. CTA FINAL CON IDENTIDAD (Paso 9)
          ══════════════════════════════════════════════ */}
      <section className="bg-black relative z-10 w-full py-24 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[300px] bg-gradient-to-r from-transparent via-[#00C980] to-transparent rotate-12 blur-3xl"></div>
        </div>
        <div className="max-w-[800px] w-full mx-auto px-6 relative z-10">
          <span className="chip chip-green font-mono uppercase tracking-widest mb-6">Únete a la Revolución Médica</span>
          <h2 className="display-lg text-white mb-6 font-sans font-light">
            Para los <strong className="font-bold text-white">dentistas</strong> que decidieron <strong className="font-bold text-white">dejar atrás el papel</strong>
          </h2>
          <p className="font-mono text-base text-zinc-300 leading-relaxed max-w-lg mx-auto mb-8">
            No le pidas permiso a la burocracia. Empieza a digitalizar tu consulta hoy mismo con la máxima seguridad y velocidad local.
          </p>
          <button 
            onClick={() => navigate('/seed/login')}
            className="btn btn-primary btn-lg shadow-[0_8px_30px_rgba(0,201,128,0.4)]"
          >
            Digitalizar Mi Práctica Ahora <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          7. FAQ ACORDEÓN (Paso 10 - Fondo de Embudo)
          ══════════════════════════════════════════════ */}
      <section id="faq" className="bg-black relative z-10 w-full py-24 border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[1200px] w-full mx-auto px-6">
          <div className="text-center mb-16">
            <span className="eyebrow">Dudas de Fondo Resueltas</span>
            <h2 className="display-lg mb-4 font-sans font-light text-white">Preguntas <strong className="font-bold text-[#00C980]">Frecuentes</strong></h2>
            <p className="font-mono text-base text-zinc-400 leading-relaxed max-w-xl mx-auto">
              Todo lo que necesitas saber sobre la seguridad, portabilidad y facturación de DentaXy Seed.
            </p>
          </div>

          <div className="faq-accordion">
            {[
              {
                q: "¿Cómo se importan mis datos actuales desde Excel o Word?",
                a: "Nuestro equipo de soporte se encarga de migrar tus datos de pacientes sin costo adicional. Simplemente nos proporcionas tus archivos y nosotros los estructuramos y subimos directamente a tus expedientes en Google Drive de forma privada."
              },
              {
                q: "¿Es compatible con tablets, iPads y teléfonos móviles en el sillón dental?",
                a: "Sí. DentaXy Seed es una aplicación responsiva y adaptada a la web moderna. Puedes abrirla en Safari en un iPad o en Google Chrome en cualquier tablet Android para registrar datos cómodamente mientras atiendes en el sillón dental."
              },
              {
                q: "¿Cómo funciona la facturación fiscal del SAT mexicano?",
                a: "El módulo financiero exporta tus reportes en un formato 100% compatible con los sistemas de facturación en México. Puedes emitir tus notas de cobro y exportar reportes detallados para presentárselos a tu contador o subirlos al SAT."
              },
              {
                q: "¿Qué sucede si Google Drive falla o se queda sin espacio?",
                a: "Drive tiene una fiabilidad del 99.99%. Si llegas al límite de espacio gratuito (15 GB, suficiente para más de 10,000 expedientes clínicos en formato DentaXy), puedes ampliar tu espacio en Google One por $34 MXN al mes. DentaXy jamás te cobrará extra por el almacenamiento de datos."
              },
              {
                q: "¿Cómo es que el motor de redacción determinista local es tan rápido?",
                a: "En lugar de enviar los datos del formulario a servidores externos de Inteligencia Artificial (lo cual es lento y viola la privacidad médica), nuestro código contiene un motor local que procesa las selecciones del formulario y ensambla el texto clínico exacto de forma instantánea en tu dispositivo."
              },
              {
                q: "¿Tienen contratos de permanencia o plazos forzosos?",
                a: "Para nada. Creemos en la libertad del dentista. Puedes cancelar tu suscripción mensual cuando quieras sin penalizaciones ni letras chiquitas. Eres dueño absoluto de tus expedientes."
              }
            ].map((faq, i) => (
              <div 
                key={i} 
                className={`faq-item-landing ${activeFaq === i ? 'active' : ''}`}
              >
                <button 
                  onClick={() => toggleFaq(i)}
                  className="faq-trigger-landing"
                >
                  <span className="faq-question-landing text-white hover:text-[#00C980] transition-colors">{faq.q}</span>
                  <ChevronRight size={18} className="faq-icon-landing" />
                </button>
                <div className="faq-content-landing">
                  <p className="faq-answer-landing font-mono text-sm text-zinc-400 leading-relaxed mt-1">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════ */}
      <footer className="bg-black border-t border-[rgba(255,255,255,0.06)] py-12 relative z-10">
        <div className="max-w-[1200px] w-full mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold tracking-tight text-white">
            DentaXy <span className="text-[#00C980]">Seed</span>
          </div>
          <div className="font-mono text-[10px] text-zinc-500">
            © 2026 DentaXy · Tecnología Determinista Local · Zacatecas, México
          </div>
          <button
            onClick={() => navigate('/seed/login')}
            className="font-mono text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
          >
            Acceder al Sistema <ChevronRight size={12} />
          </button>
        </div>
      </footer>
    </div>
  );
}
