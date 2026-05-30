import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HeroAnimation from "@/components/seed/HeroAnimation";
import AnimatedDemoUI from "@/components/seed/AnimatedDemoUI";
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
    className={`transform-gpu will-change-[opacity,transform] cursor-pointer bg-zinc-50 border border-zinc-200 rounded-xl p-8 hover:bg-white hover:border-emerald-300/60 hover:shadow-lg hover:shadow-emerald-500/5 transition-colors duration-300 ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

export default function SeedLanding() {
  const navigate = useNavigate();

  const [demoTrigger, setDemoTrigger] = useState(0);
  const [demoComplete, setDemoComplete] = useState(false);

  // Estados para la calculadora de aversión a la pérdida
  const [horasPerdidas, setHorasPerdidas] = useState(4.5);
  const [costoHora, setCostoHora] = useState(500);

  // Estado para las FAQ
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const perdidaMensual = Math.round(horasPerdidas * 4 * costoHora);
  const perdidaAnual = Math.round(perdidaMensual * 12);

  return (
    <div className="seed-v2 relative overflow-x-hidden w-full">

      {/* ════ ORBES DE LUZ (BLOBS DE FONDO) ════ */}
      <div className="blob-container">
        {/* Blobs superiores (Cian y Verde) */}
        <div className="blob blob-cyan" style={{ width: '600px', height: '600px', top: '10%', left: '-10%' }} />
        <div className="blob blob-emerald" style={{ width: '500px', height: '500px', top: '25%', right: '-5%' }} />
        
        {/* Blobs centrales */}
        <div className="blob blob-cyan" style={{ width: '700px', height: '700px', top: '50%', right: '-15%' }} />
        <div className="blob blob-emerald" style={{ width: '400px', height: '400px', top: '65%', left: '10%' }} />
        
        {/* Blobs inferiores */}
        <div className="blob blob-emerald" style={{ width: '800px', height: '800px', bottom: '-10%', left: '20%' }} />
      </div>

      {/* ══════════════════════════════════════════════
          1. HERO SECTION — Dark Futuristic
          ══════════════════════════════════════════════ */}
      <HeroAnimation
        dienteImg="/Seed/diente.png"
        manoHumanaImg="/Seed/mano-humano.png"
        manoRobotImg="/Seed/mano-robot.png"
        className="seed-section hero-dark-section"
      />

      {/* ══════════════════════════════════════════════
          1.5 CALCULADORA DE COSTO REAL (Paso 2 - Aversión a la Pérdida)
          ══════════════════════════════════════════════ */}
      <section className="seed-section first-after-hero relative z-10 w-full bg-zinc-100 pb-20 pt-16 border-b border-zinc-200">
        <div className="max-w-[900px] w-full mx-auto px-6 text-center">
          <RevealDiv className="mb-12">
            <span className="eyebrow">El Costo Oculto de la Burocracia</span>
            <h2 className="display-lg calc-title mb-4 font-sans font-light">
              ¿Cuánto te <strong className="font-bold text-zinc-950">cuesta realmente</strong> el <strong className="font-bold text-zinc-950">papel</strong>?
            </h2>
            <p className="font-mono text-base text-zinc-800 leading-relaxed max-w-2xl mx-auto">
              Escribir expedientes a mano o usar softwares lentos no es gratis: te roba horas de consulta. Mueve los sliders para calcular tu pérdida financiera en tiempo real:
            </p>
          </RevealDiv>

          <RevealDiv className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] mt-8" delay={1}>
            <div className="grid md:grid-cols-2 gap-6 calc-grid-layout text-left items-stretch">
              {/* Controles Sliders - Tarjeta Premium Sólida Izquierda */}
              <div className="glass-card-apple rounded-2xl p-6 sm:p-8 flex flex-col justify-center">
                <div className="calc-slider-group">
                  <div className="calc-slider-label">
                    <span>Horas perdidas en papeleo/semana</span>
                    <span className="calc-slider-value">{horasPerdidas} hrs</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={horasPerdidas}
                    onChange={(e) => setHorasPerdidas(parseFloat(e.target.value))}
                    className="calc-input-range"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 mt-1 font-mono">
                    <span>1h (Mínimo)</span>
                    <span>4.5h (Promedio nacional)</span>
                    <span>10h</span>
                  </div>
                </div>

                <div className="calc-slider-group mt-6">
                  <div className="calc-slider-label">
                    <span>Costo de tu hora de consulta (MXN)</span>
                    <span className="calc-slider-value">${costoHora}</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="1500"
                    step="50"
                    value={costoHora}
                    onChange={(e) => setCostoHora(parseInt(e.target.value))}
                    className="calc-input-range"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 mt-1 font-mono">
                    <span>$200</span>
                    <span>$500 (Básico)</span>
                    <span>$1,500</span>
                  </div>
                </div>
              </div>

              {/* Resultado visual - Tarjeta Premium Sólida Derecha (Tinte Rojo) */}
              <div className="glass-card-apple-red rounded-2xl p-6 sm:p-8 flex flex-col justify-between items-center text-center">
                <div className="w-full">
                  <span className="label-sm text-red-500 font-bold mb-2 block uppercase tracking-wider text-[11px]">Tu fuga financiera anual estimada</span>
                  <div className="calc-loss-value text-red-500 font-extrabold tracking-tighter text-4xl sm:text-5xl leading-none">
                    ${perdidaAnual.toLocaleString("es-MX")} MXN
                  </div>
                  <div className="text-sm font-semibold text-zinc-800 mt-2">
                    (${perdidaMensual.toLocaleString("es-MX")} MXN al mes tirados)
                  </div>
                  <p className="calc-loss-desc font-mono text-sm text-zinc-500 leading-relaxed mt-3 max-w-[320px] mx-auto">
                    Este dinero se evapora en horas de redacción clínica que podrías facturar atendiendo pacientes o disfrutando con tu familia.
                  </p>
                </div>
                
                {/* Caja Suscripción Seed - Tinte Verde Sólido Suave */}
                <div className="bg-[#00C980]/10 border border-[#00C980]/20 rounded-xl p-4 mt-6 w-full flex justify-between items-center text-xs font-semibold text-zinc-700 shadow-sm">
                  <span className="font-mono text-zinc-500">Suscripción Seed:</span>
                  <span className="text-[#00C980] font-bold text-sm">$299 MXN/mes</span>
                </div>
              </div>
            </div>
          </RevealDiv>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. ¿QUÉ ES? — Factory.ai Light Theme
          ══════════════════════════════════════════════ */}
      <section id="que-es" className="bg-white relative z-10 w-full pb-20 pt-16">
        <div className="max-w-[1200px] w-full mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Columna Izquierda: Copy */}
            <RevealDiv className="max-w-xl lg:col-span-5">
              <div className="font-mono text-[10px] sm:text-xs font-bold tracking-widest text-[#00C980] uppercase mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00C980] animate-pulse"></span>
                DentaXy Seed
              </div>
              <h2 className="text-4xl sm:text-5xl font-sans font-light tracking-tighter text-zinc-900 leading-[1.1] mb-6">
                Tu <strong className="font-bold text-zinc-950">consultorio</strong> lleva años con un <strong className="font-bold text-zinc-950">problema</strong> que ya tiene <strong className="font-bold text-zinc-950">solución</strong>.
              </h2>
              <p className="font-mono text-base text-zinc-800 leading-relaxed mb-8">
                Mientras el papel te roba tiempo, Seed redacta, organiza y guarda. 
                De forma determinista, local e instantánea.
              </p>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/seed/login')}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-sm px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
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
                <div className="absolute -inset-1 bg-gradient-to-r from-zinc-200 to-zinc-100 rounded-2xl blur opacity-50 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-zinc-50 border border-zinc-200 rounded-xl p-6 shadow-sm overflow-hidden h-[600px] flex flex-col">
                {/* Header Consola */}
                <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-4">
                  <div className="flex gap-1.5 flex-1">
                    <div className="w-3 h-3 rounded-full bg-zinc-300"></div>
                    <div className="w-3 h-3 rounded-full bg-zinc-300"></div>
                    <div className="w-3 h-3 rounded-full bg-zinc-300"></div>
                  </div>
                  
                  <div className="flex-1 flex justify-center">
                    {demoComplete && (
                      <button 
                        onClick={() => { setDemoComplete(false); setDemoTrigger(t => t + 1); }}
                        className="font-mono text-xs tracking-widest uppercase text-zinc-500 hover:text-zinc-900 transition-colors active:scale-95 flex items-center gap-2"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Repetir Animación
                      </button>
                    )}
                  </div>

                  <div className="font-mono text-[10px] text-zinc-400 flex-1 text-right">engine_v2.0.4 // LOCAL_MODE</div>
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
          3. MÓDULOS — Bento Grid Light
          ══════════════════════════════════════════════ */}
      <section id="software" className="bg-white relative z-10 w-full py-20 border-t border-zinc-100">
        <div className="max-w-[1200px] w-full mx-auto px-6">
          <RevealDiv className="mb-12">
            <h2 className="text-3xl font-light tracking-tighter text-zinc-900 mb-4 font-sans">
              <strong className="font-bold text-zinc-950">Software completo</strong>. <br/>Cero distracciones.
            </h2>
            <p className="font-mono text-base text-zinc-800 leading-relaxed max-w-xl">
              Diseñado estructuralmente como módulos independientes que corren directamente en tu navegador.
            </p>
          </RevealDiv>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Bento 1: Privacidad */}
            <BentoCard delay={1} className="md:col-span-2 group">
              <div className="flex flex-col md:flex-row gap-8 h-full">
                <div className="flex-1">
                  <Lock size={20} className="text-zinc-800 mb-6" />
                  <h3 className="text-xl font-light tracking-tight text-zinc-900 mb-2 font-sans"><strong className="font-bold text-zinc-950">Privacidad</strong> Absoluta</h3>
                  <p className="font-mono text-sm text-zinc-600 leading-relaxed mb-6 mt-1">
                    DentaXy no envía tus datos a servidores externos. Todo el procesamiento de texto clínico se hace mediante un motor determinista dentro del código local de tu página.
                  </p>
                  <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase px-3 py-1 bg-zinc-200 rounded-full text-zinc-700 font-sans font-light">
                    <Shield size={12}/> Cumplimiento <strong className="font-bold text-zinc-950">LFPDPPP</strong>
                  </div>
                </div>
                <div className="flex-shrink-0 w-full md:w-48 bg-white border border-zinc-200 rounded-lg p-4 font-mono text-[10px] text-zinc-500 shadow-inner">
                  <div className="mb-2 text-zinc-400">NETWORK TRAFFIC</div>
                  <div className="flex justify-between border-b border-zinc-100 py-1"><span>api.openai.com</span><span className="text-[#00C980]">0 B</span></div>
                  <div className="flex justify-between border-b border-zinc-100 py-1"><span>api.anthropic.com</span><span className="text-[#00C980]">0 B</span></div>
                  <div className="flex justify-between py-1 font-bold"><span>local_engine</span><span className="text-zinc-800">ACTIVE</span></div>
                </div>
              </div>
            </BentoCard>

            {/* Bento 2: Expediente */}
            <BentoCard delay={2} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <img src="/logos/google-drive.png" className="w-10 h-10 object-contain" alt="Google Drive" />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-bold">Google Drive</span>
                </div>
                <h3 className="text-xl font-light tracking-tight text-zinc-900 mb-2 font-sans"><strong className="font-bold text-zinc-950">Drive</strong> Sync</h3>
                <p className="font-mono text-sm text-zinc-600 leading-relaxed mt-1">
                  Cada paciente tiene su expediente completo guardado directamente en tu Google Drive.
                </p>
              </div>
              <div className="text-4xl font-light text-zinc-300 mt-6 font-mono">∞</div>
            </BentoCard>

            {/* Bento 3: Agenda */}
            <BentoCard delay={3}>
              <div className="flex items-center gap-3 mb-6">
                <img src="/logos/google-calendar.png" className="w-10 h-10 object-contain" alt="Google Calendar" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-bold">Google Calendar</span>
              </div>
              <h3 className="text-xl font-light tracking-tight text-zinc-900 mb-2 font-sans"><strong className="font-bold text-zinc-950">Agenda</strong> Inteligente</h3>
              <p className="font-mono text-sm text-zinc-600 leading-relaxed mt-1">
                Sincronización en tiempo real con Google Calendar. Sin duplicar trabajo.
              </p>
            </BentoCard>

            {/* Bento 4: Finanzas */}
            <BentoCard delay={4}>
              <div className="flex items-center gap-3 mb-6">
                <img src="/logos/google-sheets.png" className="w-10 h-10 object-contain" alt="Google Sheets" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-bold">Google Sheets</span>
              </div>
              <h3 className="text-xl font-light tracking-tight text-zinc-900 mb-2 font-sans"><strong className="font-bold text-zinc-950">Finanzas</strong> Locales</h3>
              <p className="font-mono text-sm text-zinc-600 leading-relaxed mt-1">
                Control de cobros integrado directamente con Google Sheets.
              </p>
            </BentoCard>

            {/* Bento 5: Asistente */}
            <BentoCard delay={5}>
              <Mic size={20} className="text-zinc-800 mb-6" />
              <h3 className="text-xl font-light tracking-tight text-zinc-900 mb-2 font-sans"><strong className="font-bold text-zinc-950">Comandos</strong> de Voz</h3>
              <p className="font-mono text-sm text-zinc-600 leading-relaxed mt-1">
                Navega y llena secciones críticas sin tocar el teclado.
              </p>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          3.5 DETALLE CLÍNICO: 8 Especialidades & 21 Secciones CORE (Paso 3)
          ══════════════════════════════════════════════ */}
      <section id="clinico" className="bg-zinc-50 relative z-10 w-full py-24 border-t border-zinc-200">
        <div className="max-w-[1200px] w-full mx-auto px-6">
          <RevealDiv className="text-center mb-16">
            <span className="eyebrow">Poder Clínico Sin Precedentes</span>
            <h2 className="display-lg mb-4 font-sans font-light">Un <strong className="font-bold text-zinc-950">motor</strong>, todas las <strong className="font-bold text-zinc-950">especialidades</strong></h2>
            <p className="font-mono text-base text-zinc-800 leading-relaxed max-w-2xl mx-auto">
              DentaXy Seed no es un editor de texto genérico. Cuenta con módulos hiper-especializados y un sistema que cumple estrictamente con el marco legal mexicano.
            </p>
          </RevealDiv>

          {/* Grid de 8 Especialidades */}
          <div className="mb-20">
            <div className="flex justify-between items-end mb-8 border-b border-zinc-200 pb-4">
              <div>
                <span className="label-sm font-bold text-zinc-400">Especialidades Integradas</span>
                <h3 className="display-md mt-1 font-sans font-light"><strong className="font-bold text-zinc-950">Cero costo</strong> adicional</h3>
              </div>
              <span className="chip chip-green font-mono">8 Especialidades CORE</span>
            </div>

            <div className="spec-grid-landing">
              {[
                {
                  emoji: "🦷",
                  titlePre: "Odontología ",
                  titleBold: "General",
                  desc: "Ficha de identificación, motivo de consulta, examen intraoral/extraoral y ATM.",
                  color: "#00E676",
                  glowColor: "#00FF87"
                },
                {
                  emoji: "🔬",
                  titlePre: "",
                  titleBold: "Endodoncia",
                  desc: "Pruebas de sensibilidad térmica/mecánica, conductometría e historial pulpar detallado.",
                  color: "#00B0FF",
                  glowColor: "#00E5FF"
                },
                {
                  emoji: "📏",
                  titlePre: "",
                  titleBold: "Ortodoncia",
                  desc: "Análisis de oclusión, perfiles faciales, modelos de yeso y trazos cefalométricos interactivos.",
                  color: "#FFAB00",
                  glowColor: "#FFD600"
                },
                {
                  emoji: "🩸",
                  titlePre: "",
                  titleBold: "Periodoncia",
                  desc: "Periodontograma interactivo por voz, registro de bolsas, movilidad, recesión y sangrado.",
                  color: "#FF1744",
                  glowColor: "#FF5252"
                },
                {
                  emoji: "👶",
                  titlePre: "",
                  titleBold: "Odontopediatría",
                  desc: "Control de conducta, mapa dental deciduo infantil, control de crecimiento y prevención.",
                  color: "#D500F9",
                  glowColor: "#F50057"
                },
                {
                  emoji: "🔪",
                  titlePre: "Cirugía ",
                  titleBold: "Maxilofacial",
                  desc: "Evaluación de riesgo quirúrgico (ASA), tiempos de coagulación y notas quirúrgicas detalladas.",
                  color: "#FF4081",
                  glowColor: "#FF80AB"
                },
                {
                  emoji: "🔩",
                  titlePre: "",
                  titleBold: "Implantología",
                  desc: "Planeación de pilares, implantes guiados por radiografía, marca/lote y torque de inserción.",
                  color: "#1DE9B6",
                  glowColor: "#64FFDA"
                },
                {
                  emoji: "👑",
                  titlePre: "",
                  titleBold: "Prostodoncia",
                  desc: "Prótesis fija, removible o total, registros de mordida, colorímetro y pruebas de laboratorio.",
                  color: "#00E5FF",
                  glowColor: "#80DEEA"
                }
              ].map((spec, i) => (
                <div 
                  key={i} 
                  className="spec-card-landing group"
                  style={{ "--s-accent": spec.color } as React.CSSProperties}
                >
                  {/* Barra de Luz Superior Vibrante (LED) */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-[5px] transition-all duration-300 group-hover:h-[7px]"
                    style={{ 
                      background: `linear-gradient(90deg, ${spec.color} 0%, ${spec.glowColor} 100%)`,
                      boxShadow: `0 1px 6px ${spec.color}40`
                    }}
                  />

                  <div className="spec-icon-box">{spec.emoji}</div>
                  <h4 className="spec-title-landing font-sans font-light">
                    {spec.titlePre}<strong className="font-bold text-zinc-950">{spec.titleBold}</strong>
                  </h4>
                  <p className="spec-desc-landing font-mono text-[13px] text-zinc-600 leading-relaxed mt-1">{spec.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 21 Secciones de la Historia Clínica CORE */}
          <div>
            <div className="flex justify-between items-end mb-8 border-b border-zinc-200 pb-4">
              <div>
                <span className="label-sm font-bold text-zinc-400">Marco de Trabajo Legal</span>
                <h3 className="display-md mt-1 font-sans font-light">Cumplimiento <strong className="font-bold text-zinc-950">estricto NOM-004</strong></h3>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#00C980] bg-[#00C980]/10 px-3 py-1 rounded-full border border-[#00C980]/20">
                <Shield size={12}/> Expediente Clínico Mexicano
              </div>
            </div>

            <div className="core-grid-landing">
              {[
                { num: "01", titlePre: "", titleBold: "Ficha de Identificación", desc: "Datos generales del paciente y contactos de emergencia." },
                { num: "02", titlePre: "", titleBold: "Motivo de Consulta", desc: "Redacción exacta de la queja principal del paciente." },
                { num: "03", titlePre: "Antecedentes ", titleBold: "Heredofamiliares", desc: "Mapa de riesgos y patologías genéticas familiares." },
                { num: "04", titlePre: "Antecedentes ", titleBold: "No Patológicos", desc: "Hábitos de higiene oral, alimentación y estilo de vida." },
                { num: "05", titlePre: "Antecedentes ", titleBold: "Patológicos", desc: "Alergias, enfermedades crónicas y cirugías previas." },
                { num: "06", titlePre: "Interrogatorio por ", titleBold: "Sistemas", desc: "Revisión cardiovascular, respiratoria e inmunológica." },
                { num: "07", titlePre: "", titleBold: "Signos Vitales", desc: "Presión arterial, temperatura, frecuencia cardíaca y respiratoria." },
                { num: "08", titlePre: "Exploración ", titleBold: "Extraoral", desc: "Análisis de ATM, contorno facial, ganglios y cuello." },
                { num: "09", titlePre: "Exploración ", titleBold: "Intraoral", desc: "Estado de mucosas, carrillos, lengua y paladar." },
                { num: "10", titlePre: "Odontograma ", titleBold: "SVG 3D", desc: "Esquema interactivo para marcar caries, restauraciones y ausencias." },
                { num: "11", titlePre: "Periodontograma por ", titleBold: "Voz", desc: "Dictado manos libres para registrar bolsas y movilidad." },
                { num: "12", titlePre: "Interpretación de ", titleBold: "Rayos X", desc: "Lectura estructurada de radiografías periapicales y panorámicas." },
                { num: "13", titlePre: "Visor ", titleBold: "DICOM Integrado", desc: "Carga radiografías en alta definición local sin servidores." },
                { num: "14", titlePre: "Diagnóstico Clínico ", titleBold: "(CIE-10)", desc: "Codificación estándar internacional de patologías orales." },
                { num: "15", titlePre: "Pronóstico de ", titleBold: "Evolución", desc: "Juicio clínico sobre el futuro de las piezas y tratamiento." },
                { num: "16", titlePre: "Plan de ", titleBold: "Tratamiento", desc: "Fases ordenadas de intervención médica y dental." },
                { num: "17", titlePre: "Presupuesto ", titleBold: "Vinculado", desc: "Generación de cobros asociados a las fases de tratamiento." },
                { num: "18", titlePre: "", titleBold: "Consentimiento Informado", desc: "Firma biométrica del paciente conforme a la NOM-004." },
                { num: "19", titlePre: "Nota de Evolución ", titleBold: "SOAP", desc: "Seguimiento subjetivo, objetivo, análisis y plan por sesión." },
                { num: "20", titlePre: "Recetario ", titleBold: "Inteligente", desc: "Emisión de recetas impresas o PDF listas para SAT." },
                { num: "21", titlePre: "Alta Médica y ", titleBold: "Seguimiento", desc: "Cierre de expediente por éxito de tratamiento y control posterior." }
              ].map((item, i) => (
                <div key={i} className="core-card-landing">
                  <div className="core-num-landing">{item.num}</div>
                  <div className="core-content-landing">
                    <h4 className="core-title-landing font-sans font-light">
                      {item.titlePre}<strong className="font-bold text-zinc-950">{item.titleBold}</strong>
                    </h4>
                    <p className="core-desc-landing font-mono text-[11px] text-zinc-500 leading-normal mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4. CÓMO FUNCIONA — Pestañas Interactivas
          ══════════════════════════════════════════════ */}
      <section id="como-funciona" className="bg-white relative z-10 w-full py-20 border-t border-zinc-100">
        <div className="max-w-[1200px] w-full mx-auto px-6">
          <RevealDiv className="mb-12">
            <h2 className="text-3xl font-light tracking-tighter text-zinc-900 mb-4 font-sans">
              Un <strong className="font-bold text-zinc-950">flujo de trabajo</strong> optimizado.
            </h2>
          </RevealDiv>

          <div className="flex flex-col md:flex-row gap-8 min-h-[400px]">
            {/* Menú Vertical */}
            <div className="w-full md:w-1/3 flex flex-col gap-2">
              {[
                { id: "01", title: "Llegada del Paciente", desc: "Formulario móvil o tablet" },
                { id: "02", title: "Consulta Rápida", desc: "Selección en interfaz clínica" },
                { id: "03", title: "Motor de Redacción", desc: "Ensamblaje determinista local" },
                { id: "04", title: "Archivo en Drive", desc: "Expediente listo y seguro" },
              ].map((tab, idx) => (
                <div key={idx} className={`p-4 border-l-2 cursor-pointer transition-colors ${idx === 2 ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:bg-zinc-50'}`}>
                  <div className="font-mono text-[10px] text-zinc-400 mb-1">Paso {tab.id}</div>
                  <div className="font-bold text-sm text-zinc-900">{tab.title}</div>
                  <div className="font-mono text-base text-zinc-800 leading-relaxed mt-1">{tab.desc}</div>
                </div>
              ))}
            </div>

            {/* Ventana Dinámica (Estado Estático para demostración) */}
            <div className="w-full md:w-2/3 bg-zinc-50 border border-zinc-200 rounded-xl p-8 flex items-center justify-center relative overflow-hidden">
              {/* Contenido mock del Paso 3 */}
              <div className="w-full max-w-md bg-white border border-zinc-200 rounded shadow-sm p-5 relative z-10">
                <div className="font-mono text-[10px] text-zinc-400 border-b border-zinc-100 pb-2 mb-4 uppercase">
                  engine_output.txt
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-zinc-100 rounded"></div>
                  <div className="h-2 w-5/6 bg-zinc-100 rounded"></div>
                  <div className="h-2 w-full bg-zinc-100 rounded"></div>
                  <div className="h-2 w-3/4 bg-zinc-200 rounded mt-4"></div>
                  <div className="p-3 bg-zinc-50 border border-zinc-100 font-mono text-base text-zinc-800 leading-relaxed mt-4 rounded">
                    El paciente refiere dolor punzante en zona molar inferior derecha desde hace 3 días. No responde a analgésicos comunes.
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-32 bg-gradient-to-r from-transparent via-[#00C980]/5 to-transparent rotate-12 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4.2 PRUEBA SOCIAL Y ALIANZAS (Paso 4)
          ══════════════════════════════════════════════ */}
      <section className="bg-zinc-50 relative z-10 w-full py-20 border-t border-zinc-200">
        <div className="max-w-[1200px] w-full mx-auto px-6">
          <div className="text-center mb-16">
            <span className="eyebrow">Validación de la Industria</span>
            <h2 className="display-lg mb-4 font-sans font-light">Respaldado por las <strong className="font-bold text-zinc-950">mejores instituciones</strong></h2>
            <p className="font-mono text-base text-zinc-800 leading-relaxed max-w-xl mx-auto">
              Estudiantes, catedráticos y clínicas de alta especialidad ya confían en la infraestructura digital descentralizada de DentaXy.
            </p>
          </div>

          {/* Logos/Insignias */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center mb-16 opacity-85">
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg text-zinc-900 tracking-wider">UAZ</span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 mt-1">Univ. Autónoma de Zacatecas</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg text-zinc-900 tracking-wider">CROID</span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 mt-1">Clínica de Especialidades</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg text-zinc-900 tracking-wider">NOM-004</span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#00C980] mt-1 font-bold">100% CUMPLIMIENTO</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg text-zinc-900 tracking-wider">LFPDPPP</span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#00C980] mt-1 font-bold">DATOS PROTEGIDOS</span>
            </div>
          </div>

          {/* Testimonios */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                stars: 5,
                text: "Como estudiante de la UAZ, llenar expedientes clínicos a mano me tomaba hasta 40 minutos por paciente. Con Seed, realizo el odontograma por voz en 3 minutos y el expediente se redacta solo en mi Google Drive.",
                author: "Dr. Carlos Medina",
                role: "Estudiante de Odontología UAZ",
                avatar: "👨‍⚕️"
              },
              {
                stars: 5,
                text: "En CROID manejamos un flujo constante de pacientes. DentaXy nos dio la seguridad que ningún otro software en la nube pudo dar: la soberanía de nuestros datos médicos en nuestra propia cuenta corporativa de Drive.",
                author: "Dra. Sofía Alatorre",
                role: "Directora Clínica CROID",
                avatar: "👩‍⚕️"
              },
              {
                stars: 5,
                text: "La simulación de redacción clínica es asombrosa. Funciona al instante y sin conexión a internet. Ya no dependemos de que falle la red a mitad de consulta para tener la nota SOAP lista.",
                author: "Dr. Miguel Ángel Ortiz",
                role: "Docente y Cirujano Dentista",
                avatar: "👨‍⚕️"
              }
            ].map((test, i) => (
              <div key={i} className="card-premium p-8 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: test.stars }).map((_, s) => (
                      <Star key={s} size={14} className="fill-[#00C980] text-[#00C980]" />
                    ))}
                  </div>
                  <p className="font-mono text-base text-zinc-800 leading-relaxed italic mb-6">
                    "{test.text}"
                  </p>
                </div>
                <div className="flex items-center gap-3 border-t border-zinc-100 pt-4">
                  <span className="text-2xl">{test.avatar}</span>
                  <div>
                    <div className="font-bold text-sm text-zinc-900">{test.author}</div>
                    <div className="font-mono text-[10px] text-zinc-400">{test.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4.5 AUTORIDAD DEL CREADOR (Paso 5)
          ══════════════════════════════════════════════ */}
      <section className="bg-white relative z-10 w-full py-24 border-t border-zinc-200">
        <div className="max-w-[1000px] w-full mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            {/* Story Image Placeholder */}
            <div className="md:col-span-5 relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#00C980] to-[#3B82F6] rounded-2xl blur opacity-15"></div>
              <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-white overflow-hidden shadow-lg h-[320px] flex flex-col justify-center items-center">
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
              <h2 className="display-lg mb-6 font-sans font-light">Nacimos en el <strong className="font-bold text-zinc-950">dolor</strong> de la <strong className="font-bold text-zinc-950">trinchera clínica</strong></h2>
              <p className="font-mono text-base text-zinc-800 leading-relaxed mb-4">
                Llenar un periodontograma no debería requerir un posgrado en informática. Escribir a mano notas clínicas duplicadas solo para guardarlas en carpetas de papel que se llenan de polvo es ineficiente y arriesgado.
              </p>
              <p className="font-mono text-base text-zinc-800 leading-relaxed mb-6">
                DentaXy no fue conceptualizado por una corporación de software estadounidense. Nació de la desesperación de médicos cirujanos mexicanos que vivieron el dolor del papeleo burocrático bajo la norma NOM-004-SSA3-2012. 
                Se diseñó para ser el software clínico que nosotros mismos quisiéramos usar: instantáneo, offline, 100% privado y sumamente rápido.
              </p>
              <div className="quote-block">
                "La medicina es fluidez y atención al paciente. Todo software que se interponga entre el odontólogo y la mirada de su paciente, ha fracasado. Seed es invisible, corre a tu ritmo."
                <span className="block font-bold text-xs text-zinc-800 mt-2 not-italic font-mono">— Fundador Clínico de DentaXy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4.8 OBJECIONES RESPONDIDAS (Paso 6 - Bento Grid)
          ══════════════════════════════════════════════ */}
      <section className="bg-zinc-50 relative z-10 w-full py-20 border-t border-zinc-200">
        <div className="max-w-[1200px] w-full mx-auto px-6">
          <div className="text-center mb-16">
            <span className="eyebrow">Cero Dudas, Cero Riesgos</span>
            <h2 className="display-lg mb-4 font-sans font-light">Todo lo que <strong className="font-bold text-zinc-950">necesitas saber</strong></h2>
            <p className="font-mono text-base text-zinc-800 leading-relaxed max-w-xl mx-auto">
              Respondemos las preguntas difíciles sin tecnicismos ni evasivas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-8 hover:shadow-sm transition-all">
              <div className="icon-wrap mb-6">
                <Shield size={20} />
              </div>
              <h3 className="text-lg font-light text-zinc-900 mb-2 font-sans">¿Cumple la <strong className="font-bold text-zinc-950">NOM-004-SSA3-2012</strong>?</h3>
              <p className="font-mono text-sm text-zinc-500 leading-relaxed mt-1">
                Sí. Todos los expedientes, consentimientos informados firmados digitalmente y notas SOAP de evolución se ajustan a las 21 secciones obligatorias del marco legal y de salud en México.
              </p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-8 hover:shadow-sm transition-all">
              <div className="icon-wrap icon-wrap-blue mb-6">
                <Cloud size={20} />
              </div>
              <h3 className="text-lg font-light text-zinc-900 mb-2 font-sans">¿Y si <strong className="font-bold text-zinc-950">no tengo Internet</strong>?</h3>
              <p className="font-mono text-sm text-zinc-500 leading-relaxed mt-1">
                El sistema ejecuta todo el motor de redacción clínica en el procesador local de tu dispositivo. Puedes registrar consultas completas offline, y se sincronizarán en Drive al reconectar.
              </p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-8 hover:shadow-sm transition-all">
              <div className="icon-wrap icon-wrap-ink mb-6">
                <HardDrive size={20} />
              </div>
              <h3 className="text-lg font-light text-zinc-900 mb-2 font-sans">¿Quién es <strong className="font-bold text-zinc-950">dueño de mis datos</strong>?</h3>
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
      <section id="precios" className="bg-zinc-50 relative z-10 w-full py-24 border-t border-zinc-200">
        <div className="max-w-[1100px] w-full mx-auto px-6">
          <RevealDiv className="text-center mb-16">
            <span className="eyebrow">Planes Claros e Inversión Rentable</span>
            <h2 className="display-lg mb-4 font-sans font-light">
              Invierte en <strong className="font-bold text-zinc-950">fluidez</strong>, elimina la <strong className="font-bold text-zinc-950">burocracia</strong>
            </h2>
            <p className="font-mono text-base text-zinc-800 leading-relaxed max-w-xl mx-auto">
              Mientras el papel te cuesta miles de pesos al año en horas perdidas, DentaXy Seed se paga solo desde el primer día.
            </p>
          </RevealDiv>

          <div className="grid md:grid-cols-3 gap-8 items-stretch mb-20">
            {/* Plan Semilla */}
            <RevealDiv delay={1} className="bg-white border border-zinc-200 rounded-xl p-8 flex flex-col justify-between">
              <div>
                <span className="label-sm text-zinc-400 font-mono">Para Empezar</span>
                <h3 className="text-xl font-light text-zinc-950 mt-1 mb-4 font-sans">Plan <strong className="font-bold text-zinc-950">Semilla</strong></h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-xl font-bold text-zinc-900">$</span>
                  <span className="price-tag">199</span>
                  <span className="price-period">/ mes</span>
                </div>
                <div className="font-mono text-[9px] text-zinc-400 pb-6 border-b border-zinc-100 mb-6">MXN · Primeros 50 fundadores</div>
                
                <ul className="space-y-3 mb-8">
                  {[
                    "Historia Clínica general completa",
                    "Motor de redacción determinista",
                    "Odontograma SVG interactivo",
                    "Sincronización con Google Drive",
                    "Cumplimiento básico de la NOM-004",
                    "Soporte por correo electrónico"
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 font-mono text-[11.5px] text-zinc-600">
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
            <RevealDiv delay={3} className="bg-white border border-zinc-200 rounded-xl p-8 flex flex-col justify-between">
              <div>
                <span className="label-sm text-zinc-400 font-mono">Para Equipos</span>
                <h3 className="text-xl font-light text-zinc-950 mt-1 mb-4 font-sans">Plan <strong className="font-bold text-zinc-950">Clínica</strong></h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-xl font-bold text-zinc-900">$</span>
                  <span className="price-tag">499</span>
                  <span className="price-period">/ mes</span>
                </div>
                <div className="font-mono text-[9px] text-zinc-400 pb-6 border-b border-zinc-100 mb-6">MXN · Hasta 5 doctores activos</div>
                
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
                    <li key={i} className="flex items-start gap-2.5 font-mono text-[11.5px] text-zinc-600">
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
          <div className="bg-white border border-zinc-200 rounded-2xl p-8 max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex-1">
              <span className="chip chip-red font-mono mb-3">OFERTA LIMITADA DE PREVENTA</span>
              <h4 className="font-light text-lg text-zinc-900 mb-1 font-sans">¡Quedan solo <strong className="font-bold text-zinc-950">12 de 50 accesos</strong> fundadores!</h4>
              <p className="font-mono text-sm text-zinc-500 leading-relaxed mt-1">
                Asegura tu precio especial de preventa de $199/mes de forma permanente. El costo aumentará en la siguiente fecha de lanzamiento.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center flex-shrink-0 bg-red-50 border border-red-100 p-4 rounded-xl text-center min-w-[140px]">
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest font-mono">Quedan</span>
              <span className="text-3xl font-extrabold text-red-500 font-mono my-0.5">12</span>
              <span className="text-[10px] text-zinc-400 font-mono">cupos de preventa</span>
            </div>
          </div>

          {/* Garantía de Soberanía Digital */}
          <div className="text-center mt-12 max-w-xl mx-auto">
            <Shield size={24} className="text-[#00C980] mx-auto mb-3" />
            <h4 className="font-light text-sm text-zinc-900 mb-1 font-sans">Garantía de <strong className="font-bold text-zinc-950">Soberanía Digital</strong></h4>
            <p className="font-mono text-base text-zinc-800 leading-relaxed max-w-xl mx-auto">
              Tus expedientes son tuyos. Si en algún momento decides cancelar tu suscripción, tus datos siguen en tu cuenta de Google Drive y puedes descargarlos en un clic. Sin contratos de exclusividad, sin trabas ni plazos forzosos.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          6. CTA FINAL CON IDENTIDAD (Paso 9)
          ══════════════════════════════════════════════ */}
      <section className="bg-zinc-950 relative z-10 w-full py-24 text-center overflow-hidden">
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
      <section id="faq" className="bg-white relative z-10 w-full py-24 border-t border-zinc-200">
        <div className="max-w-[1200px] w-full mx-auto px-6">
          <div className="text-center mb-16">
            <span className="eyebrow">Dudas de Fondo Resueltas</span>
            <h2 className="display-lg mb-4 font-sans font-light">Preguntas <strong className="font-bold text-zinc-950">Frecuentes</strong></h2>
            <p className="font-mono text-base text-zinc-800 leading-relaxed max-w-xl mx-auto">
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
                  <span className="faq-question-landing">{faq.q}</span>
                  <ChevronRight size={18} className="faq-icon-landing" />
                </button>
                <div className="faq-content-landing">
                  <p className="faq-answer-landing font-mono text-sm text-zinc-500 leading-relaxed mt-1">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════ */}
      <footer className="bg-white border-t border-zinc-200 py-12 relative z-10">
        <div className="max-w-[1200px] w-full mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold tracking-tight text-zinc-900">
            DentaXy <span className="text-[#00C980]">Seed</span>
          </div>
          <div className="font-mono text-[10px] text-zinc-400">
            © 2026 DentaXy · Tecnología Determinista Local · Zacatecas, México
          </div>
          <button
            onClick={() => navigate('/seed/login')}
            className="font-mono text-xs text-zinc-600 hover:text-zinc-900 transition-colors flex items-center gap-1"
          >
            Acceder al Sistema <ChevronRight size={12} />
          </button>
        </div>
      </footer>
    </div>
  );
}
