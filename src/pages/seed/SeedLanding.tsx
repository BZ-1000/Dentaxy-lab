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

/* ── Fade-in on scroll ── */
function useSectionFade() {
  const ref = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    ref.current = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("s-visible"); }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".s-fade").forEach(el => ref.current?.observe(el));
    return () => ref.current?.disconnect();
  }, []);
}

/* ── Helpers ── */
const FadeDiv = ({ className = "", children, delay = 0, ...props }: any) => (
  <div className={`s-fade s-fade-delay-${delay} ${className}`} {...props}>{children}</div>
);

export default function SeedLanding() {
  const navigate = useNavigate();
  useSectionFade();

  const [demoTrigger, setDemoTrigger] = useState(0);
  const [demoComplete, setDemoComplete] = useState(false);

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
          2. ¿QUÉ ES? — Factory.ai Light Theme
          ══════════════════════════════════════════════ */}
      <section id="que-es" className="bg-white relative z-10 w-full pb-20 pt-16">
        <div className="max-w-[1200px] w-full mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Columna Izquierda: Copy */}
            <FadeDiv className="max-w-xl lg:col-span-5">
              <div className="font-mono text-[10px] sm:text-xs font-bold tracking-widest text-[#00C980] uppercase mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00C980] animate-pulse"></span>
                DentaXy Seed
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-zinc-900 leading-[1.1] mb-6">
                Tu consultorio lleva años con un problema que ya tiene solución.
              </h2>
              <p className="font-mono text-sm text-zinc-500 leading-relaxed mb-8">
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
            </FadeDiv>

            {/* Columna Derecha: Consola */}
            <FadeDiv delay={1} className="relative group lg:col-span-7">
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
            </FadeDiv>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          3. MÓDULOS — Bento Grid Light
          ══════════════════════════════════════════════ */}
      <section id="software" className="bg-white relative z-10 w-full py-20 border-t border-zinc-100">
        <div className="max-w-[1200px] w-full mx-auto px-6">
          <FadeDiv className="mb-12">
            <h2 className="text-3xl font-extrabold tracking-tighter text-zinc-900 mb-4">
              Software completo. <br/>Cero distracciones.
            </h2>
            <p className="font-mono text-sm text-zinc-500 max-w-xl">
              Diseñado estructuralmente como módulos independientes que corren directamente en tu navegador.
            </p>
          </FadeDiv>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Bento 1: Privacidad */}
            <FadeDiv delay={1} className="md:col-span-2 bg-zinc-50 border border-zinc-200 rounded-xl p-8 hover:bg-white hover:shadow-sm hover:border-zinc-300 transition-all group">
              <div className="flex flex-col md:flex-row gap-8 h-full">
                <div className="flex-1">
                  <Lock size={20} className="text-zinc-800 mb-6" />
                  <h3 className="text-xl font-bold tracking-tight text-zinc-900 mb-2">Privacidad Absoluta</h3>
                  <p className="font-mono text-xs text-zinc-500 leading-relaxed mb-6">
                    DentaXy no envía tus datos a servidores externos. Todo el procesamiento de texto clínico se hace mediante un motor determinista dentro del código local de tu página.
                  </p>
                  <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase px-3 py-1 bg-zinc-200 rounded-full text-zinc-700">
                    <Shield size={12}/> Cumplimiento LFPDPPP
                  </div>
                </div>
                <div className="flex-shrink-0 w-full md:w-48 bg-white border border-zinc-200 rounded-lg p-4 font-mono text-[10px] text-zinc-500 shadow-inner">
                  <div className="mb-2 text-zinc-400">NETWORK TRAFFIC</div>
                  <div className="flex justify-between border-b border-zinc-100 py-1"><span>api.openai.com</span><span className="text-[#00C980]">0 B</span></div>
                  <div className="flex justify-between border-b border-zinc-100 py-1"><span>api.anthropic.com</span><span className="text-[#00C980]">0 B</span></div>
                  <div className="flex justify-between py-1 font-bold"><span>local_engine</span><span className="text-zinc-800">ACTIVE</span></div>
                </div>
              </div>
            </FadeDiv>

            {/* Bento 2: Expediente */}
            <FadeDiv delay={2} className="bg-zinc-50 border border-zinc-200 rounded-xl p-8 hover:bg-white hover:shadow-sm hover:border-zinc-300 transition-all flex flex-col justify-between">
              <div>
                <FolderOpen size={20} className="text-zinc-800 mb-6" />
                <h3 className="text-xl font-bold tracking-tight text-zinc-900 mb-2">Drive Sync</h3>
                <p className="font-mono text-xs text-zinc-500 leading-relaxed">
                  Cada paciente tiene su expediente completo guardado directamente en tu Google Drive.
                </p>
              </div>
              <div className="text-4xl font-light text-zinc-300 mt-6 font-mono">∞</div>
            </FadeDiv>

            {/* Bento 3: Agenda */}
            <FadeDiv delay={3} className="bg-zinc-50 border border-zinc-200 rounded-xl p-8 hover:bg-white hover:shadow-sm hover:border-zinc-300 transition-all">
              <CalendarDays size={20} className="text-zinc-800 mb-6" />
              <h3 className="text-xl font-bold tracking-tight text-zinc-900 mb-2">Agenda</h3>
              <p className="font-mono text-xs text-zinc-500 leading-relaxed">
                Sincronización en tiempo real con Google Calendar. Sin duplicar trabajo.
              </p>
            </FadeDiv>

            {/* Bento 4: Finanzas */}
            <FadeDiv delay={4} className="bg-zinc-50 border border-zinc-200 rounded-xl p-8 hover:bg-white hover:shadow-sm hover:border-zinc-300 transition-all">
              <Wallet size={20} className="text-zinc-800 mb-6" />
              <h3 className="text-xl font-bold tracking-tight text-zinc-900 mb-2">Finanzas</h3>
              <p className="font-mono text-xs text-zinc-500 leading-relaxed">
                Control de cobros integrado directamente con Google Sheets.
              </p>
            </FadeDiv>

            {/* Bento 5: Asistente */}
            <FadeDiv delay={5} className="bg-zinc-50 border border-zinc-200 rounded-xl p-8 hover:bg-white hover:shadow-sm hover:border-zinc-300 transition-all">
              <Mic size={20} className="text-zinc-800 mb-6" />
              <h3 className="text-xl font-bold tracking-tight text-zinc-900 mb-2">Comandos de Voz</h3>
              <p className="font-mono text-xs text-zinc-500 leading-relaxed">
                Navega y llena secciones críticas sin tocar el teclado.
              </p>
            </FadeDiv>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4. CÓMO FUNCIONA — Pestañas Interactivas
          ══════════════════════════════════════════════ */}
      <section id="como-funciona" className="bg-white relative z-10 w-full py-20 border-t border-zinc-100">
        <div className="max-w-[1200px] w-full mx-auto px-6">
          <FadeDiv className="mb-12">
            <h2 className="text-3xl font-extrabold tracking-tighter text-zinc-900 mb-4">
              Un flujo de trabajo optimizado.
            </h2>
          </FadeDiv>

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
                  <div className="font-mono text-xs text-zinc-500 mt-1">{tab.desc}</div>
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
                  <div className="p-3 bg-zinc-50 border border-zinc-100 font-mono text-xs text-zinc-700 leading-relaxed mt-4 rounded">
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
          5. PRICING — B2B SaaS Style
          ══════════════════════════════════════════════ */}
      <section id="precios" className="bg-zinc-50 relative z-10 w-full py-24 border-t border-zinc-200">
        <div className="max-w-[1000px] w-full mx-auto px-6">
          <FadeDiv className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tighter text-zinc-900 mb-4">
              Simple, predecible y sin sorpresas.
            </h2>
            <p className="font-mono text-sm text-zinc-500">Preventa Especial 2026</p>
          </FadeDiv>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Solo */}
            <FadeDiv delay={1} className="bg-white border border-zinc-200 rounded-xl p-8 flex flex-col">
              <div className="font-mono text-xs text-zinc-500 mb-4 uppercase tracking-wider">Plan Solo</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-xl font-bold text-zinc-900">$</span>
                <span className="text-5xl font-extrabold tracking-tighter text-zinc-900">149</span>
              </div>
              <div className="font-mono text-[10px] text-zinc-400 mb-8 pb-8 border-b border-zinc-100">MXN / mes · Facturación anual</div>
              
              <ul className="flex-1 space-y-4 mb-8">
                {["Historia clínica automática", "Expedientes en Drive propio", "Agenda Google Calendar"].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 font-mono text-xs text-zinc-600">
                    <Check size={14} className="text-[#00C980] mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-mono text-xs font-bold py-3 rounded-lg transition-colors">
                Comenzar Solo
              </button>
            </FadeDiv>

            {/* Clínica */}
            <FadeDiv delay={2} className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 flex flex-col relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00C980] text-zinc-900 font-mono text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                Más Elegido
              </div>
              <div className="font-mono text-xs text-zinc-400 mb-4 uppercase tracking-wider">Plan Clínica</div>
              <div className="flex items-baseline gap-1 mb-2 text-white">
                <span className="text-xl font-bold">$</span>
                <span className="text-5xl font-extrabold tracking-tighter">249</span>
              </div>
              <div className="font-mono text-[10px] text-zinc-500 mb-8 pb-8 border-b border-zinc-800">MXN / mes · Facturación anual</div>
              
              <ul className="flex-1 space-y-4 mb-8">
                {[
                  {txt: "Todo lo del plan Solo", bold: true},
                  {txt: "Asistente de voz", bold: false},
                  {txt: "Control financiero Sheets", bold: false},
                  {txt: "Hasta 3 usuarios", bold: false}
                ].map((f, i) => (
                  <li key={i} className={`flex items-start gap-3 font-mono text-xs ${f.bold ? 'text-white' : 'text-zinc-400'}`}>
                    <Check size={14} className="text-[#00C980] mt-0.5" />
                    {f.txt}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-white hover:bg-zinc-100 text-zinc-900 font-mono text-xs font-bold py-3 rounded-lg transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                Obtener Clínica
              </button>
            </FadeDiv>
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
