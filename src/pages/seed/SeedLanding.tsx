import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HeroAnimation from "@/components/seed/HeroAnimation";
import "./Seed.css";
import {
  CircleX, CircleCheck, FileText, FolderOpen, CalendarDays,
  Wallet, ClipboardList, Mic, ArrowRight, Shield, BadgeCheck,
  Unlock, CalendarX, Cloud, ChevronRight, Zap, Lock,
  HardDrive, Users, Sparkles, Star
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
          2. ¿QUÉ ES? — Problema vs Solución
          ══════════════════════════════════════════════ */}
      <section id="que-es" className="seed-section first-after-hero">
        <div className="max-w-[1100px] w-full mx-auto py-16">

          {/* Header */}
          <FadeDiv className="text-center mb-14">
            <div className="eyebrow justify-center">¿Qué es DentaXy Seed?</div>
            <h2 className="display-lg mb-4">
              Tu consultorio lleva años con<br/>
              un problema que <span className="text-accent">ya tiene solución</span>.
            </h2>
            <p className="body-lg max-w-[560px] mx-auto">
              Mientras el papel te roba tiempo, DentaXy Seed redacta, organiza y guarda. Automáticamente.
            </p>
          </FadeDiv>

          {/* Problema / Solución */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 relative z-10">
            {/* Elemento decorativo conector */}
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center z-20 text-[var(--s-ink4)] font-bold text-xs" style={{fontFamily:'var(--s-body)'}}>
              VS
            </div>

            {/* Columna Problema */}
            <FadeDiv delay={1} className="card-alt p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-150" />
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="icon-wrap icon-wrap-red icon-wrap-circle float-anim shadow-sm" style={{width: 56, height: 56}}>
                  <CircleX size={26} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="label-sm text-red-500" style={{color: 'var(--s-red)'}}>El problema hoy</div>
                  <h3 className="display-md" style={{fontSize: 22, marginTop: 2}}>Caos y papel</h3>
                </div>
              </div>
              <ul className="space-y-5 relative z-10">
                {[
                  "Historias clínicas escritas a mano o en Word",
                  "Las mismas frases repetidas consulta tras consulta",
                  "Expedientes en carpetas imposibles de buscar",
                  "Citas en papel, WhatsApp o en tu cabeza",
                  "Software que guarda datos en nubes ajenas",
                ].map((txt, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CircleX size={18} className="flex-shrink-0 mt-0.5" style={{color:'var(--s-red)', opacity:0.6}} strokeWidth={2}/>
                    <span className="body-md" style={{color:'var(--s-ink3)'}}>{txt}</span>
                  </li>
                ))}
              </ul>
              {/* Visual 3D simulado */}
              <div className="mt-8 pt-6 border-t border-[var(--s-border)] opacity-60">
                <div className="flex justify-between items-center px-2">
                  <div className="h-2 w-16 bg-red-100 rounded-full" />
                  <div className="h-2 w-24 bg-red-50 rounded-full" />
                  <div className="h-2 w-12 bg-gray-200 rounded-full" />
                </div>
              </div>
            </FadeDiv>

            {/* Columna Solución */}
            <FadeDiv delay={2} className="card-green-tint p-8 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full rounded-l-2xl z-20" style={{background:'var(--s-grad)'}} />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-[var(--s-green)] opacity-[0.07] rounded-full blur-3xl -mr-20 -mb-20 transition-transform duration-700 group-hover:scale-150" />
              
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="relative float-anim" style={{animationDelay: '1s'}}>
                  <div className="absolute inset-0 bg-[var(--s-green)] rounded-full blur-md opacity-40 animate-pulse" />
                  <div className="icon-wrap icon-wrap-circle relative z-10 shadow-lg" style={{background:'var(--s-grad)', color:'#fff', width: 56, height: 56}}>
                    <Sparkles size={26} strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <div className="label-sm" style={{color:'var(--s-green-d)'}}>Con DentaXy Seed</div>
                  <h3 className="display-md" style={{fontSize: 22, marginTop: 2}}>Flujo inteligente</h3>
                </div>
              </div>
              <ul className="space-y-5 relative z-10">
                {[
                  "La historia clínica se redacta automáticamente",
                  "Expedientes organizados y búsqueda instantánea",
                  "Agenda integrada con Google Calendar",
                  "Todo guardado en tu Google Drive por folio",
                  "Cero datos clínicos en nuestros servidores",
                ].map((txt, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CircleCheck size={18} className="flex-shrink-0 mt-0.5" style={{color:'var(--s-green)'}} strokeWidth={2.5}/>
                    <span className="body-md" style={{color:'var(--s-ink)', fontWeight:500}}>{txt}</span>
                  </li>
                ))}
              </ul>
              {/* Visual 3D simulado */}
              <div className="mt-8 pt-6 border-t border-[rgba(0,201,128,0.15)]">
                <div className="flex justify-between items-end px-2 h-8">
                  <div className="w-1/6 bg-[var(--s-green-l)] rounded-t-sm h-[40%]" />
                  <div className="w-1/6 bg-[var(--s-green-l)] rounded-t-sm h-[60%]" />
                  <div className="w-1/6 bg-[var(--s-green-l)] rounded-t-sm h-[80%]" />
                  <div className="w-1/6 bg-[var(--s-green)] rounded-t-sm h-[100%] shadow-[0_0_12px_rgba(0,201,128,0.4)]" />
                </div>
              </div>
            </FadeDiv>
          </div>

          {/* Quote con prueba social */}
          <FadeDiv delay={3} className="max-w-[800px] mx-auto mt-6">
            <div className="quote-block shadow-sm relative overflow-hidden bg-white/80 backdrop-blur-xl">
              <div className="absolute right-0 top-0 text-[120px] font-serif leading-none opacity-5 text-[var(--s-green)] pointer-events-none" style={{marginTop: '-20px', marginRight: '10px'}}>"</div>
              <div className="flex flex-col md:flex-row items-start gap-6 mb-3">
                {/* Avatar placeholder mejorado */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm">
                    <div className="bg-[var(--s-green-l)] text-[var(--s-green-d)] rounded-full w-6 h-6 flex items-center justify-center font-bold text-[10px]">
                      ✔
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="mb-4" style={{fontSize: 17, fontStyle: 'italic', color: 'var(--s-ink2)', lineHeight: 1.6}}>
                    "El doctor llena el formulario. <strong style={{color:'var(--s-green-d)', fontStyle:'normal'}}>DentaXy Seed hace la redacción de forma instantánea.</strong> El expediente aparece en tu Drive. Es literalmente así de simple."
                  </p>
                  <div>
                    <div style={{fontWeight:700, fontSize:15, fontStyle:'normal', color:'var(--s-ink)'}}>Dr. González</div>
                    <div className="flex flex-wrap gap-2 items-center mt-1" style={{fontSize:12, color:'var(--s-ink4)', fontStyle:'normal'}}>
                      <span className="font-medium">Universidad Autónoma de Zacatecas</span>
                      <span className="hidden md:inline">•</span>
                      <span>Clínica CROID</span>
                      <div className="flex gap-0.5 ml-auto">
                        {[1,2,3,4,5].map(s=><Star key={s} size={14} fill="var(--s-green)" color="var(--s-green)"/>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeDiv>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          3. MÓDULOS — Bento Grid
          ══════════════════════════════════════════════ */}
      <section id="software" className="seed-section">
        <div className="max-w-[1100px] w-full mx-auto py-16">
          <FadeDiv className="text-center mb-12">
            <div className="eyebrow justify-center">Software completo</div>
            <h2 className="display-lg">
              Todo lo que tu consultorio necesita,<br/>
              <span className="text-accent">en una sola pantalla</span>.
            </h2>
          </FadeDiv>

          {/* Bento Grid */}
          <div className="bento-grid relative z-10">
            {/* Hero Card — Historia Automática */}
            <FadeDiv delay={1} className="bento-hero card-premium p-8 flex flex-col md:flex-row gap-8 items-center overflow-hidden group">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br from-[var(--s-green)] to-blue-400 opacity-10 blur-3xl rounded-full transition-transform duration-700 group-hover:scale-125" />
              
              <div className="flex-1 relative z-10">
                <div className="icon-wrap icon-wrap-lg mb-6 shadow-sm relative group-hover:shadow-md transition-shadow">
                  <div className="absolute inset-0 bg-[var(--s-green)] rounded-xl blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                  <FileText size={32} strokeWidth={1.5} className="relative z-10"/>
                </div>
                <h3 className="display-md mb-3">Historia Automática</h3>
                <p className="body-md mb-6 max-w-md">
                  Seed genera la redacción completa en tiempo real, sección por sección, mientras el doctor llena el formulario. Sin tipear una sola palabra.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="chip chip-green shadow-sm"><Zap size={12}/>21 secciones</span>
                  <span className="chip chip-ink bg-white/50 backdrop-blur-sm shadow-sm"><Lock size={12}/>100% local</span>
                </div>
              </div>
              
              {/* Visual Interactivo / Mockup */}
              <div className="flex-shrink-0 w-full md:w-[260px] h-[220px] bg-gradient-to-br from-gray-50 to-gray-100 border border-white rounded-2xl shadow-inner relative overflow-hidden flex items-center justify-center">
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--s-green)] to-transparent opacity-50" />
                <div className="float-anim flex flex-col gap-3 w-3/4">
                  <div className="h-4 bg-white rounded shadow-sm w-full" />
                  <div className="h-4 bg-white rounded shadow-sm w-5/6" />
                  <div className="h-4 bg-[var(--s-green-l)] rounded shadow-sm w-4/6" />
                  <div className="h-4 bg-white rounded shadow-sm w-full mt-2" />
                  <div className="h-4 bg-white rounded shadow-sm w-3/4" />
                </div>
              </div>
            </FadeDiv>

            {/* Expediente Digital */}
            <FadeDiv delay={2} className="card-premium p-6 flex flex-col relative overflow-hidden group">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-[var(--s-green)]/5 blur-2xl rounded-full transition-transform duration-500 group-hover:scale-150" />
              <div className="icon-wrap mb-5 relative">
                <FolderOpen size={20} strokeWidth={1.5} className="relative z-10"/>
              </div>
              <h3 className="display-md mb-2" style={{fontSize:20}}>Expediente Digital</h3>
              <p className="body-md flex-1 relative z-10">Cada paciente tiene su expediente completo y buscable directamente en tu Drive.</p>
              <div className="mt-5 pt-5 relative z-10 border-t border-[rgba(0,0,0,0.05)]">
                <div className="stat-number green group-hover:scale-105 transition-transform origin-left" style={{fontSize:48}}>∞</div>
                <div className="stat-label">Pacientes sin límite</div>
              </div>
            </FadeDiv>

            {/* Agenda */}
            <FadeDiv delay={2} className="card-premium p-6 flex flex-col relative overflow-hidden group">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/5 blur-2xl rounded-full transition-transform duration-500 group-hover:scale-150" />
              <div className="icon-wrap mb-5 relative">
                <CalendarDays size={20} strokeWidth={1.5} className="relative z-10"/>
              </div>
              <h3 className="display-md mb-2" style={{fontSize:20}}>Agenda Clínica</h3>
              <p className="body-md flex-1 relative z-10">Crea citas. Se sincroniza automáticamente con Google Calendar en tiempo real.</p>
              <div className="mt-5 pt-5 relative z-10 border-t border-[rgba(0,0,0,0.05)]">
                <div className="stat-number green group-hover:scale-105 transition-transform origin-left" style={{fontSize:48}}>0</div>
                <div className="stat-label">Apps extra necesarias</div>
              </div>
            </FadeDiv>

            {/* Control Financiero */}
            <FadeDiv delay={3} className="card-alt p-6 flex flex-col relative overflow-hidden group hover:bg-white/90">
              <div className="absolute -right-10 -top-10 w-24 h-24 bg-emerald-500/10 blur-xl rounded-full transition-transform duration-500 group-hover:scale-150" />
              <div className="icon-wrap icon-wrap-blue mb-4 relative z-10"><Wallet size={20} strokeWidth={1.5}/></div>
              <h3 className="display-md mb-2 relative z-10" style={{fontSize:20}}>Control Financiero</h3>
              <p className="body-md relative z-10">Registra cobros y genera un resumen financiero integrado con Sheets.</p>
            </FadeDiv>

            {/* Pre-consulta */}
            <FadeDiv delay={3} className="card-alt p-6 flex flex-col relative overflow-hidden group hover:bg-white/90">
              <div className="absolute -right-10 -top-10 w-24 h-24 bg-purple-500/10 blur-xl rounded-full transition-transform duration-500 group-hover:scale-150" />
              <div className="icon-wrap mb-4 relative z-10" style={{background:'#F3E8FF', color:'#9333EA'}}><ClipboardList size={20} strokeWidth={1.5}/></div>
              <h3 className="display-md mb-2 relative z-10" style={{fontSize:20}}>Pre-consulta</h3>
              <p className="body-md relative z-10">El paciente llena su ficha desde su teléfono antes de llegar.</p>
            </FadeDiv>

            {/* Asistente de Voz */}
            <FadeDiv delay={4} className="card-alt p-6 flex flex-col relative overflow-hidden group hover:bg-white/90">
              <div className="absolute -right-10 -top-10 w-24 h-24 bg-orange-500/10 blur-xl rounded-full transition-transform duration-500 group-hover:scale-150" />
              <div className="icon-wrap mb-4 relative z-10" style={{background:'#FFEDD5', color:'#EA580C'}}><Mic size={20} strokeWidth={1.5}/></div>
              <h3 className="display-md mb-2 relative z-10" style={{fontSize:20}}>Asistente de Voz</h3>
              <p className="body-md relative z-10">Opera DentaXy con la voz mientras tienes las manos ocupadas.</p>
            </FadeDiv>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4. CÓMO FUNCIONA — Timeline + Google
          ══════════════════════════════════════════════ */}
      <section id="como-funciona" className="seed-section relative z-10">
        <div className="max-w-[1100px] w-full mx-auto py-16">
          <FadeDiv className="text-center mb-14">
            <div className="eyebrow justify-center">Cómo funciona</div>
            <h2 className="display-lg">
              De la llegada del paciente<br/>
              al <span className="text-accent">expediente guardado</span>.
            </h2>
          </FadeDiv>

          {/* Timeline horizontal */}
          <div className="s-fade hidden md:grid grid-cols-5 gap-4 mb-20 relative">
            <div className="step-line" style={{top: 32}} />
            {[
              { icon: <Lock size={20} strokeWidth={1.5}/>, num:"01", title:"Entras a tu espacio", desc:"tu-consultorio.dentaxy.com" },
              { icon: <Users size={20} strokeWidth={1.5}/>, num:"02", title:"Paciente", desc:"Inicia ficha en segundos" },
              { icon: <FileText size={20} strokeWidth={1.5}/>, num:"03", title:"Formulario", desc:"Redacta en tiempo real" },
              { icon: <ClipboardList size={20} strokeWidth={1.5}/>, num:"04", title:"Expediente", desc:"Historia completa lista" },
              { icon: <HardDrive size={20} strokeWidth={1.5}/>, num:"05", title:"Drive", desc:"Automático y organizado" },
            ].map((step, i) => (
              <FadeDiv key={i} delay={(i+1) as any} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full card-premium flex items-center justify-center mb-5 relative group-hover:scale-110 transition-transform duration-300"
                     style={{color:'var(--s-green)'}}>
                  <div className="absolute inset-0 rounded-full border border-[var(--s-green)] opacity-20 scale-110 group-hover:scale-125 transition-transform" />
                  {step.icon}
                </div>
                <div className="mono-data mb-2 bg-gray-100 rounded-full px-2 py-0.5" style={{color:'var(--s-green-d)', fontSize:10}}>{step.num}</div>
                <h4 className="label-sm mb-1" style={{color:'var(--s-ink)', textTransform:'none', letterSpacing:0, fontSize:14, fontWeight:700}}>{step.title}</h4>
                <p className="body-md" style={{fontSize:13}}>{step.desc}</p>
              </FadeDiv>
            ))}
          </div>

          {/* Google Ecosystem */}
          <FadeDiv className="text-center mb-10">
            <div className="eyebrow justify-center">Google Workspace Integrado</div>
            <h3 className="display-md mb-3">Google trabaja para ti. <span className="text-accent">Sin que lo notes.</span></h3>
            <p className="body-md max-w-lg mx-auto">DentaXy Seed se conecta invisiblemente con tu ecosistema Google existente. Sin migraciones complejas ni costos extra de almacenamiento.</p>
          </FadeDiv>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name:"Google Drive", icon:<HardDrive size={24} strokeWidth={1.5}/>, desc:"Expedientes", color:"#1A73E8" },
              { name:"Calendar", icon:<CalendarDays size={24} strokeWidth={1.5}/>, desc:"Agenda", color:"#EA4335" },
              { name:"Sheets", icon:<Wallet size={24} strokeWidth={1.5}/>, desc:"Finanzas", color:"#0F9D58" },
              { name:"Docs", icon:<FileText size={24} strokeWidth={1.5}/>, desc:"Expedientes", color:"#4285F4" },
              { name:"Forms", icon:<ClipboardList size={24} strokeWidth={1.5}/>, desc:"Pre-consulta", color:"#7248B9" },
              { name:"OAuth", icon:<Shield size={24} strokeWidth={1.5}/>, desc:"Seguridad", color:"#F9AB00" },
            ].map((g, i) => (
              <FadeDiv key={i} delay={(i % 3 + 1) as any}
                className="card-premium p-5 flex flex-col items-center text-center gap-3 hover:-translate-y-2 transition-transform bg-white/70 backdrop-blur-xl group">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 rounded-lg transition-opacity" style={{backgroundColor: g.color}} />
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm relative overflow-hidden"
                     style={{background:`${g.color}15`, color: g.color}}>
                  <div className="absolute inset-0 opacity-20 blur-md group-hover:opacity-40 transition-opacity" style={{backgroundColor: g.color}} />
                  <span className="relative z-10">{g.icon}</span>
                </div>
                <div>
                  <div style={{fontSize:13, fontWeight:700, color:'var(--s-ink2)'}}>{g.name}</div>
                  <div style={{fontSize:11, color:'var(--s-ink4)'}}>{g.desc}</div>
                </div>
              </FadeDiv>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          5. PRIVACIDAD — "El 0%" (Dashboard Style)
          ══════════════════════════════════════════════ */}
      <section id="privacidad" className="seed-section relative z-10">
        <div className="max-w-[1000px] w-full mx-auto py-16">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Lado izquierdo — el gran "0" con anillo holográfico */}
            <FadeDiv className="text-center md:text-left relative">
              <div className="eyebrow">Soberanía de Datos</div>
              
              <div className="relative inline-block mb-4">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full border-[3px] border-dashed border-[var(--s-green)]/30 animate-[spin_20s_linear_infinite]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] rounded-full border border-[var(--s-green)]/10 animate-[spin_30s_linear_infinite_reverse]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[var(--s-green)]/10 blur-2xl rounded-full" />
                <div className="stat-number green relative z-10" style={{fontSize: 'clamp(100px, 16vw, 180px)', textShadow: '0 10px 40px rgba(0,201,128,0.2)'}}>0<span className="text-[0.6em] text-[var(--s-green-d)]">%</span></div>
              </div>
              
              <div className="display-md mb-4 leading-tight">De tus datos clínicos<br/>en nuestros servidores.</div>
              <p className="body-lg mb-8 max-w-md">
                DentaXy Seed es el motor. El almacén eres tú. Todo se va directamente a tu Google Drive. Nosotros nunca tocamos los expedientes de tus pacientes.
              </p>
              <div className="flex gap-3 flex-wrap justify-center md:justify-start">
                <span className="chip chip-green shadow-sm text-xs px-4 py-2">
                  <BadgeCheck size={14}/> Cumplimiento Total
                </span>
                <span className="chip chip-ink bg-white shadow-sm text-xs px-4 py-2">Ley LFPDPPP</span>
              </div>
            </FadeDiv>

            {/* Lado derecho — Terminal de datos (ProHealth Style) */}
            <FadeDiv delay={2} className="card-alt p-8 relative overflow-hidden bg-white/60 backdrop-blur-2xl">
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
              <div className="flex items-center justify-between mb-8">
                <div className="label-sm flex items-center gap-2" style={{color:'var(--s-ink3)'}}>
                  <div className="w-2 h-2 rounded-full bg-[var(--s-green)] animate-pulse" />
                  Monitor de Flujo de Datos
                </div>
                <div className="text-[10px] font-mono text-gray-400">STATUS: SECURE</div>
              </div>

              <div className="space-y-6 relative z-10">
                {[
                  { label:"Captura de formulario", dest:"Dispositivo local", green:true, progress: "100%" },
                  { label:"Procesamiento IA", dest:"Motor local (Client-side)", green:true, progress: "100%" },
                  { label:"Almacenamiento final", dest:"Google Drive del Doctor", green:true, progress: "100%" },
                  { label:"Nube de DentaXy", dest:"0 bytes almacenados", red:true, progress: "2%" },
                ].map((row, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-end mb-2">
                      <span className="body-md font-medium text-[var(--s-ink2)]">{row.label}</span>
                      <span className="mono-data flex items-center gap-1.5 text-[11px]" style={{
                        color: row.red ? 'var(--s-red)' : 'var(--s-green-d)'
                      }}>
                        {row.green && <CircleCheck size={12} strokeWidth={2.5}/>}
                        {row.red && <CircleX size={12} strokeWidth={2.5}/>}
                        {row.dest}
                      </span>
                    </div>
                    {/* Barra de progreso estilo dashboard */}
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000 ease-out" 
                           style={{
                             width: row.progress, 
                             background: row.red ? 'var(--s-red)' : 'var(--s-grad)',
                             boxShadow: row.green ? '0 0 10px rgba(0,201,128,0.5)' : 'none'
                           }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </FadeDiv>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          6. PRICING — Plans Premium
          ══════════════════════════════════════════════ */}
      <section id="precios" className="seed-section relative z-10">
        <div className="max-w-[1100px] w-full mx-auto py-16 flex flex-col relative">
          
          {/* Orbe masivo de fondo para pricing */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[var(--s-green)]/10 blur-[100px] rounded-full pointer-events-none z-0" />

          <FadeDiv className="text-center mb-16 relative z-10">
            <div className="eyebrow justify-center">Preventa Especial 2026</div>
            <h2 className="display-lg">
              Elige el plan que evoluciona<br/>con <span className="text-accent">tu consultorio</span>.
            </h2>
            <p className="body-lg mt-4 max-w-xl mx-auto">Precios fijos de preventa para primeros adoptantes. Cero comisiones ocultas, cero contratos forzosos.</p>
          </FadeDiv>

          {/* Tarjetas */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12 items-center relative z-10">

            {/* Solo */}
            <FadeDiv delay={1} className="card-premium p-8 flex flex-col h-[500px]">
              <div className="label-sm mb-3" style={{color:'var(--s-ink4)'}}>Plan Solo</div>
              <div className="mb-2 flex items-start">
                <span className="price-currency mt-2">$</span>
                <span className="price-tag">149</span>
              </div>
              <div className="price-period mb-8 border-b border-gray-100 pb-6">MXN / mes · Cobro anual</div>
              <ul className="flex-1 space-y-4 mb-8">
                {["Historia clínica automática","Expedientes en Drive propio","Agenda Google Calendar"].map((f,i)=>(
                  <li key={i} className="flex items-start gap-3 body-md text-[var(--s-ink2)]">
                    <div className="mt-0.5 bg-gray-100 rounded-full p-0.5"><CircleCheck size={14} style={{color:'var(--s-ink3)'}} strokeWidth={2.5}/></div>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="btn btn-ghost w-full py-4 text-[15px]">
                Comenzar con Solo
              </button>
            </FadeDiv>

            {/* Clínica — Destacado / Glow Líquido */}
            <FadeDiv delay={2} className="card-featured laser-border p-10 flex flex-col relative h-[540px] z-20 bg-white"
              style={{animation:'glowPulse 4s ease-in-out infinite'}}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 chip chip-green shadow-md px-5 py-1.5"
                   style={{fontSize:11, fontWeight:800, letterSpacing:'0.1em'}}>
                <Star size={12} fill="var(--s-green)" color="var(--s-green)"/> MÁS ELEGIDO
              </div>
              <div className="label-sm mb-3" style={{color:'var(--s-green-d)'}}>Plan Clínica</div>
              <div className="mb-2 flex items-start">
                <span className="price-currency mt-2">$</span>
                <span className="price-tag text-[64px]">249</span>
              </div>
              <div className="price-period mb-8 border-b border-[var(--s-green-l)] pb-6">MXN / mes · Cobro anual</div>
              <ul className="flex-1 space-y-4 mb-8">
                {[
                  {txt:"Todo lo del plan Solo", bold:true},
                  {txt:"Asistente de voz DentaXy", bold:false},
                  {txt:"Control financiero Sheets", bold:false},
                  {txt:"3 usuarios simultáneos", bold:false},
                ].map((f,i)=>(
                  <li key={i} className="flex items-start gap-3 body-md" style={{fontWeight: f.bold ? 700 : 500, color: 'var(--s-ink)'}}>
                    <div className="mt-0.5 bg-[var(--s-green-l)] rounded-full p-0.5"><CircleCheck size={14} style={{color:'var(--s-green)'}} strokeWidth={3}/></div>
                    {f.txt}
                  </li>
                ))}
              </ul>
              <button className="btn btn-primary w-full py-4 text-[15px] shadow-[0_8px_20px_rgba(0,201,128,0.4)]">
                Obtener Clínica <ArrowRight size={18}/>
              </button>
            </FadeDiv>

            {/* Pro */}
            <FadeDiv delay={3} className="card-premium p-8 flex flex-col h-[500px]">
              <div className="label-sm mb-3" style={{color:'var(--s-ink4)'}}>Plan Pro</div>
              <div className="mb-2 flex items-start">
                <span className="price-currency mt-2">$</span>
                <span className="price-tag">349</span>
              </div>
              <div className="price-period mb-8 border-b border-gray-100 pb-6">MXN / mes · Cobro anual</div>
              <ul className="flex-1 space-y-4 mb-8">
                {[
                  {txt:"Todo lo de Clínica", bold:true},
                  {txt:"Usuarios ilimitados", bold:false},
                  {txt:"Teleconsulta integrada", bold:false},
                  {txt:"Perfil destacado en Aura", bold:false},
                ].map((f,i)=>(
                  <li key={i} className="flex items-start gap-3 body-md text-[var(--s-ink2)]">
                    <div className="mt-0.5 bg-gray-100 rounded-full p-0.5"><CircleCheck size={14} style={{color:'var(--s-ink3)'}} strokeWidth={2.5}/></div>
                    {f.txt}
                  </li>
                ))}
              </ul>
              <button className="btn btn-ghost w-full py-4 text-[15px]">
                Contactar Ventas
              </button>
            </FadeDiv>
          </div>

          {/* Garantías Premium */}
          <FadeDiv delay={4} className="guarantee-row bg-white/50 backdrop-blur-md border border-white rounded-full py-4 px-8 shadow-sm max-w-3xl mx-auto relative z-10">
            <div className="guarantee-item text-[13px] text-[var(--s-ink2)]">
              <Unlock size={16} style={{color:'var(--s-green)'}}/> Sin contrato forzoso
            </div>
            <div className="w-px h-6 bg-gray-300"/>
            <div className="guarantee-item text-[13px] text-[var(--s-ink2)]">
              <CalendarX size={16} style={{color:'var(--s-green)'}}/> Cancela cuando quieras
            </div>
            <div className="w-px h-6 bg-gray-300"/>
            <div className="guarantee-item text-[13px] text-[var(--s-ink2)]">
              <Shield size={16} style={{color:'var(--s-green)'}}/> Garantía de 30 días
            </div>
          </FadeDiv>
        </div>

        {/* FOOTER */}
        <footer className="w-full border-t px-6 py-8 mt-auto" style={{borderColor:'var(--s-border)', background:'var(--s-bg)'}}>
          <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div style={{fontFamily:'var(--s-font)', fontWeight:800, fontSize:16, letterSpacing:'-0.02em', color:'var(--s-ink)'}}>
              DentaXy <span style={{color:'var(--s-green)'}}>Seed</span>
            </div>
            <div className="body-md" style={{fontSize:11, color:'var(--s-ink4)'}}>
              © 2026 DentaXy · Una obra de VanGox · Zacatecas, México
            </div>
            <button
              onClick={() => navigate('/seed/login')}
              className="btn btn-green-outline btn-sm"
            >
              Acceder a mi consultorio <ChevronRight size={14}/>
            </button>
          </div>
        </footer>
      </section>

    </div>
  );
}
