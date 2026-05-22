import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Seed.css";

/* ── Variantes framer-motion ── */
const toothV = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1.5, ease: [0.34, 1.56, 0.64, 1] } },
};
const humanHandV = {
  hidden: { x: "-30vw", opacity: 0 },
  visible: { x: "0vw", opacity: 1, transition: { duration: 2.2, delay: 1.5, ease: [0.16, 1, 0.3, 1] } },
};
const robotHandV = {
  hidden: { x: "30vw", opacity: 0 },
  visible: { x: "0vw", opacity: 1, transition: { duration: 2.2, delay: 1.5, ease: [0.16, 1, 0.3, 1] } },
};
const navV = {
  hidden: { opacity: 0, y: -18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 3.3 } },
};
const contentV = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, delay: 3.5, ease: "easeOut" } },
};
const chipContainerV = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 3.8 } },
};
const chipV = {
  hidden: { opacity: 0, y: 12, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
};

export default function SeedLanding() {
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);

  // --- MODO CANVA ---
  const [editMode, setEditMode] = useState(false);
  const [sizes, setSizes] = useState({
    tooth: 220,
    humanHand: 55, // vw
    robotHand: 55, // vw
    textWidth: 580 // px
  });
  
  const handleSizeChange = (key: string, value: number) => {
    setSizes(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('s-visible');
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.s-fade').forEach(el => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="seed-v2 relative overflow-x-hidden w-full">

      {/* ══════════════════════════════════════════════
          1. HERO SECTION — Dark Futuristic Animated
          ══════════════════════════════════════════════ */}
      <section
        className="seed-section hero-dark-section"
        style={{ paddingTop: 0, position: 'relative' }}
      >


        {/* ── NAVBAR (aparece después de la animación) ── */}
        <motion.nav
          className="hero-dark-nav"
          variants={navV}
          initial="hidden"
          animate="visible"
        >
          {/* Logo */}
          <div className="logo-dark">
            DENTAXY
            <span className="logo-seed-badge-dark">SEED</span>
          </div>

          {/* Links centrales */}
          <div className="hidden md:flex items-center gap-6">
            {["Sistema", "Módulos", "Flujo", "Ecosistema", "Precios"].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="nav-link-dark"
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate('/seed/login')}
            className="btn-dark-primary"
            style={{ padding: '10px 24px', fontSize: '11px' }}
          >
            Obtener acceso →
          </button>
        </motion.nav>

        {/* ── CAPA VISUAL: Diente Central ── */}
        <motion.div
          className="hero-tooth-wrap"
          variants={editMode ? {} : toothV}
          initial={editMode ? "visible" : "hidden"}
          animate="visible"
          drag={editMode}
          dragMomentum={false}
          style={{ cursor: editMode ? 'grab' : 'auto' }}
        >
          <div className="tooth-glow-anim" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src="/Seed/diente.png" alt="Diente flotante" style={{ width: editMode ? `${sizes.tooth}px` : 'clamp(140px, 20vw, 220px)', objectFit: 'contain', pointerEvents: editMode ? 'none' : 'auto' }} />
          </div>
        </motion.div>

        {/* ── CAPA VISUAL: Mano Humana (izquierda → centro) ── */}
        <motion.img
          src="/Seed/mano-humano.png"
          alt="Mano humana"
          className="hero-hand-human"
          variants={editMode ? {} : humanHandV}
          initial={editMode ? "visible" : "hidden"}
          animate="visible"
          drag={editMode}
          dragMomentum={false}
          style={{ 
            translateY: "-50%", 
            mixBlendMode: "screen", 
            width: editMode ? `${sizes.humanHand}vw` : undefined,
            cursor: editMode ? 'grab' : 'auto',
            pointerEvents: editMode ? 'auto' : 'none'
          }}
        />

        {/* ── CAPA VISUAL: Mano Robótica (derecha → centro) ── */}
        <motion.img
          src="/Seed/mano-robot.png"
          alt="Mano robótica"
          className="hero-hand-robot"
          variants={editMode ? {} : robotHandV}
          initial={editMode ? "visible" : "hidden"}
          animate="visible"
          drag={editMode}
          dragMomentum={false}
          style={{ 
            translateY: "-50%", 
            mixBlendMode: "screen",
            width: editMode ? `${sizes.robotHand}vw` : undefined,
            cursor: editMode ? 'grab' : 'auto',
            pointerEvents: editMode ? 'auto' : 'none'
          }}
        />

        {/* ── CONTENIDO: Texto principal (aparece al final) ── */}
        <motion.div
          className="hero-dark-content"
          variants={editMode ? {} : contentV}
          initial={editMode ? "visible" : "hidden"}
          animate="visible"
          drag={editMode}
          dragMomentum={false}
          style={{ cursor: editMode ? 'grab' : 'auto', pointerEvents: editMode ? 'auto' : 'none' }}
        >
          {/* Eyebrow monospace */}
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.20em',
            textTransform: 'uppercase',
            color: '#10b981',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span style={{ width: 20, height: 1, background: '#10b981', display: 'inline-block' }} />
            Software clínico · Powered by Google Workspace
          </div>

          {/* Título futurista monoespaciado */}
          <h1 className="hero-title-mono" style={{ marginBottom: '16px' }}>
            EL SOFTWARE DENTAL<br />
            QUE <span className="accent-green">PIENSA</span> POR TI.
          </h1>

          {/* Subtítulo */}
          <p className="hero-subtitle-mono" style={{ maxWidth: editMode ? `${sizes.textWidth}px` : '580px', marginBottom: '28px' }}>
            Llenas el formulario — Seed redacta la historia clínica,<br />
            agenda citas y guarda en tu Google Drive. Sin instalar nada.
          </p>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '28px' }}>
            <button
              onClick={() => navigate('/seed/login')}
              className="btn-dark-primary"
            >
              Obtener mi Seed →
            </button>
            <button className="btn-dark-ghost">
              Ver cómo funciona
            </button>
          </div>

          {/* Chips glassmorphism blanco */}
          <motion.div
            style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
            variants={chipContainerV}
            initial="hidden"
            animate="visible"
          >
            {[
              { icon: "◈", text: "HISTORIA AUTOMÁTICA" },
              { icon: "◈", text: "AGENDA GOOGLE" },
              { icon: "◈", text: "DRIVE SYNC" },
              { icon: "◈", text: "CERO DATOS" },
              { icon: "◈", text: "SIN INSTALAR" },
            ].map((chip, i) => (
              <motion.div key={i} className="glass-chip-dark" variants={chipV}>
                <span style={{ color: '#10b981', fontSize: '11px' }}>{chip.icon}</span>
                {chip.text}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── PANEL MODO CANVA ── */}
        <button 
          onClick={() => setEditMode(!editMode)}
          style={{ position: 'absolute', top: 20, right: 20, zIndex: 9999, background: editMode ? '#EA4335' : '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'monospace', fontSize: 12 }}
        >
          {editMode ? "Cerrar Modo Canva" : "Modo Canva"}
        </button>

        {editMode && (
          <div style={{ position: 'absolute', top: 60, right: 20, zIndex: 9999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', border: '1px solid #333', padding: '20px', borderRadius: '12px', color: '#fff', fontFamily: 'monospace', fontSize: 11, width: 280, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3 style={{ margin: 0, color: '#10b981', fontSize: 14 }}>Ajuste de Tamaños</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between' }}><span>Diente (px)</span> <span>{sizes.tooth}px</span></label>
              <input type="range" min="50" max="400" value={sizes.tooth} onChange={(e) => handleSizeChange('tooth', parseInt(e.target.value))} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between' }}><span>Mano Humana (vw)</span> <span>{sizes.humanHand}vw</span></label>
              <input type="range" min="20" max="100" value={sizes.humanHand} onChange={(e) => handleSizeChange('humanHand', parseInt(e.target.value))} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between' }}><span>Mano Robot (vw)</span> <span>{sizes.robotHand}vw</span></label>
              <input type="range" min="20" max="100" value={sizes.robotHand} onChange={(e) => handleSizeChange('robotHand', parseInt(e.target.value))} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between' }}><span>Ancho Texto (px)</span> <span>{sizes.textWidth}px</span></label>
              <input type="range" min="300" max="900" value={sizes.textWidth} onChange={(e) => handleSizeChange('textWidth', parseInt(e.target.value))} />
            </div>
            
            <p style={{ margin: 0, color: '#888', fontStyle: 'italic', marginTop: '10px' }}>
              Arrastra directamente las manos y el diente en la pantalla para moverlos.
            </p>
          </div>
        )}
      </section>



      {/* ── 2. ¿QUÉ ES? ── */}
      <section id="qué-es" className="seed-section px-6 z-10">
        <div className="max-w-[1100px] w-full mx-auto">
          <div className="s-fade mb-12 text-center">
            <div className="eyebrow justify-center">¿Qué es DentaXy Seed?</div>
            <h2 className="heading-lg">No es una plantilla.<br/>Es tu <span className="heading-accent">consultorio digital</span>.</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="s-fade glass-card p-8">
              <div className="pill bg-[#FCE8E6] text-[#EA4335] mb-6 border-[#FCE8E6]">❌ El problema hoy</div>
              <ul className="space-y-4">
                {["Historias clínicas escritas a mano o en Word", "Las mismas frases repetidas consulta tras consulta", "Expedientes en carpetas imposibles de buscar", "Citas en papel, WhatsApp o en tu cabeza", "Software que guarda datos en nubes que no controlas"].map((text, i) => (
                  <li key={i} className="flex gap-3 text-[14px] font-medium text-[var(--s-ink3)]">
                    <span className="text-[#EA4335] font-bold">✗</span> {text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="s-fade glass-card glass-card-accent p-8 relative">
              <div className="pill bg-[#F0FDF4] text-[#10b981] mb-6 border-[#F0FDF4]">✓ Con DentaXy Seed</div>
              <ul className="space-y-4">
                {["La historia clínica se redacta automáticamente", "Expedientes organizados y búsqueda instantánea", "Agenda integrada con Google Calendar", "Todo guardado en tu Google Drive por folio", "Cero datos en nuestros servidores"].map((text, i) => (
                  <li key={i} className="flex gap-3 text-[14px] font-medium text-[var(--s-ink2)]">
                    <span className="text-[#10b981] font-bold">✓</span> {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="s-fade max-w-[800px] mx-auto quote-glass text-center">
            "El doctor llena el formulario. <strong className="text-[var(--s-grass)] font-bold">DentaXy Seed hace la redacción.</strong> El expediente aparece en tu Drive. Eso es todo."
          </div>
        </div>
      </section>

      {/* ── 3. MÓDULOS ── */}
      <section id="módulos" className="seed-section px-6 z-10">
        <div className="max-w-[1100px] w-full mx-auto">
          <div className="s-fade mb-12 text-center">
            <div className="eyebrow justify-center">Software completo</div>
            <h2 className="heading-lg">Todo lo que necesita<br/>tu consultorio, <span className="heading-accent">en uno</span>.</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "📋", title: "Historia Automática", desc: "Seed genera la redacción en tiempo real sección por sección." },
              { icon: "📁", title: "Expediente Digital", desc: "Cada paciente tiene su expediente completo y buscable en tu Drive." },
              { icon: "📅", title: "Agenda Clínica", desc: "Crea citas. Se sincroniza con tu Google Calendar automáticamente." },
              { icon: "💰", title: "Control Financiero", desc: "Registra cobros y genera un resumen financiero integrado con Sheets." },
              { icon: "📝", title: "Pre-consulta", desc: "El paciente llena su ficha desde su teléfono antes de llegar." },
              { icon: "🎤", title: "Asistente de Voz", desc: "Opera DentaXy con la voz mientras tienes las manos ocupadas." }
            ].map((mod, i) => (
              <div key={i} className="s-fade mod-card glass-card p-6 group flex flex-col items-center text-center">
                <div className="text-[28px] mb-3 bg-white/50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm">{mod.icon}</div>
                <h3 className="font-bold text-[16px] mb-2 text-[var(--s-ink)]">{mod.title}</h3>
                <p className="text-[13px] leading-relaxed text-[var(--s-ink3)]">{mod.desc}</p>
                {/* VISUAL: Pequeño mockup aquí en un futuro */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. CÓMO FUNCIONA ── */}
      <section id="cómo-funciona" className="seed-section px-6 z-10">
         <div className="max-w-[1100px] w-full mx-auto">
            <div className="s-fade mb-16 text-center">
              <div className="eyebrow justify-center">Cómo funciona</div>
              <h2 className="heading-lg">De la llegada del paciente<br/>al <span className="heading-accent">expediente guardado</span>.</h2>
            </div>

            <div className="s-fade relative hidden md:grid grid-cols-5 gap-4 mb-16">
              <div className="step-connector"></div>
              {[
                { icon: "🔑", title: "1. Entras a tu espacio", desc: "tu-consultorio.dentaxy.com" },
                { icon: "👤", title: "2. Paciente", desc: "Inicia ficha en segundos" },
                { icon: "✏️", title: "3. Formulario", desc: "Redacta en tiempo real" },
                { icon: "📄", title: "4. Expediente", desc: "Historia completa lista" },
                { icon: "☁️", title: "5. Drive", desc: "Automático y organizado" }
              ].map((step, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full glass-card flex items-center justify-center text-[20px] mb-4 shadow-lg bg-white/80">
                    {step.icon}
                  </div>
                  <h4 className="font-bold text-[14px] mb-1">{step.title}</h4>
                  <p className="text-[12px] text-[var(--s-ink3)] px-2">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="w-full visual-placeholder h-[180px]">
               {/* VISUAL: Animación interactiva del flujo 1 al 5 */}
            </div>
         </div>
      </section>

      {/* ── 5. GOOGLE ECOSYSTEM ── */}
      <section id="google-ecosystem" className="seed-section px-6 z-10">
        <div className="max-w-[1100px] w-full mx-auto">
          <div className="s-fade mb-12 text-center">
            <div className="eyebrow justify-center">Google Workspace</div>
            <h2 className="heading-lg">Google trabaja para ti.<br/><span className="heading-accent">Sin que lo veas.</span></h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Google Drive", color: "bg-[#1A73E8]", desc: "Almacenamiento de expedientes" },
              { name: "Google Calendar", color: "bg-[#EA4335]", desc: "Gestión de citas y agenda" },
              { name: "Google Sheets", color: "bg-[#10b981]", desc: "Finanzas y reportes" },
              { name: "Google Docs", color: "bg-[#1A73E8]", desc: "Expedientes editables" },
              { name: "Google Forms", color: "bg-[#7B4FA8]", desc: "Formularios de pre-consulta" },
              { name: "Google OAuth", color: "bg-[#F9AB00]", desc: "Autenticación segura" }
            ].map((g, i) => (
              <div key={i} className="s-fade glass-card-sm p-6">
                <div className={`g-card-strip w-12 ${g.color}`}></div>
                <h4 className="font-bold text-[15px] mb-2">{g.name}</h4>
                <p className="text-[13px] text-[var(--s-ink3)]">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. SOBERANÍA DE DATOS ── */}
      <section id="tus-datos" className="seed-section px-6 z-10">
         <div className="max-w-[1000px] w-full mx-auto glass-card p-10 md:p-14 flex flex-col md:flex-row gap-10 items-center">
            <div className="s-fade flex-1 text-center md:text-left">
              <h2 className="heading-lg mb-6">Ningún dato toca <span className="heading-accent">nuestros servidores</span>.</h2>
              <p className="body-lg mb-8">DentaXy Seed es el motor. El almacén eres tú. Todo se va directamente a tu Google Drive.</p>
              <div className="pill pill-green">Soberanía Total LFPDPPP</div>
            </div>
            
            <div className="s-fade flex-1 w-full bg-white/40 rounded-[20px] p-6 border border-white/60">
               <div className="data-row">
                 <span className="text-[var(--s-ink3)]">Llenas formulario</span>
                 <span className="font-bold text-[var(--s-grass)]">Tu dispositivo</span>
               </div>
               <div className="data-row">
                 <span className="text-[var(--s-ink3)]">Redacción IA</span>
                 <span className="font-bold text-[var(--s-grass)]">Tu dispositivo (Local)</span>
               </div>
               <div className="data-row">
                 <span className="text-[var(--s-ink3)]">Expediente final</span>
                 <span className="font-bold text-[var(--s-green)]">Tu Google Drive</span>
               </div>
               <div className="data-row">
                 <span className="text-[var(--s-ink3)]">Servidores DentaXy</span>
                 <span className="font-bold text-[var(--s-red)]">0 datos clínicos</span>
               </div>
            </div>
         </div>
      </section>

      {/* ── 7. PRECIOS & FOOTER ── */}
      <section id="precios" className="seed-section px-6 z-10 pt-10">
        <div className="max-w-[1100px] w-full mx-auto flex-1 flex flex-col justify-center">
          <div className="s-fade mb-10 text-center">
            <div className="eyebrow justify-center">Preventa Especial</div>
            <h2 className="heading-lg">Elige el plan que va<br/>con <span className="heading-accent">tu consultorio</span>.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Solo */}
            <div className="s-fade glass-card-sm p-8 flex flex-col">
               <div className="text-[12px] font-bold text-[var(--s-ink4)] uppercase tracking-wider mb-2">Solo</div>
               <div className="text-[40px] font-bold mb-1"><span className="text-[18px] align-top relative top-2">$</span>149</div>
               <div className="text-[12px] text-[var(--s-ink3)] mb-6">MXN al mes · Preventa</div>
               <div className="flex-1 space-y-3 mb-6">
                 <div className="text-[13px]">✓ Historia automática</div>
                 <div className="text-[13px]">✓ Expedientes en Drive</div>
                 <div className="text-[13px]">✓ Agenda Calendar</div>
               </div>
               <button className="btn-liquid btn-ghost w-full py-2.5 text-[13px]">Obtener Solo</button>
            </div>

            {/* Clínica */}
            <div className="s-fade glass-card pricing-featured p-8 flex flex-col relative scale-105 z-10">
               <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--s-grass)] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-4 rounded-full">Más popular</div>
               <div className="text-[12px] font-bold text-[var(--s-grass)] uppercase tracking-wider mb-2">Clínica</div>
               <div className="text-[40px] font-bold mb-1"><span className="text-[18px] align-top relative top-2">$</span>249</div>
               <div className="text-[12px] text-[var(--s-ink3)] mb-6">MXN al mes · Preventa</div>
               <div className="flex-1 space-y-3 mb-6">
                 <div className="text-[13px] font-bold text-[var(--s-grass)]">✓ Todo lo del plan Solo</div>
                 <div className="text-[13px]">✓ Asistente de voz</div>
                 <div className="text-[13px]">✓ Control financiero</div>
                 <div className="text-[13px]">✓ 3 usuarios</div>
               </div>
               <button className="btn-liquid btn-primary w-full py-2.5 text-[13px]">Obtener Clínica</button>
            </div>

            {/* Pro */}
            <div className="s-fade glass-card-sm p-8 flex flex-col">
               <div className="text-[12px] font-bold text-[var(--s-ink4)] uppercase tracking-wider mb-2">Pro</div>
               <div className="text-[40px] font-bold mb-1"><span className="text-[18px] align-top relative top-2">$</span>349</div>
               <div className="text-[12px] text-[var(--s-ink3)] mb-6">MXN al mes · Preventa</div>
               <div className="flex-1 space-y-3 mb-6">
                 <div className="text-[13px] font-bold text-[var(--s-ink)]">✓ Todo lo de Clínica</div>
                 <div className="text-[13px]">✓ Usuarios ilimitados</div>
                 <div className="text-[13px]">✓ Teleconsulta Meet</div>
                 <div className="text-[13px]">✓ Perfil en Aura</div>
               </div>
               <button className="btn-liquid btn-ghost w-full py-2.5 text-[13px]">Obtener Pro</button>
            </div>
          </div>

          <div className="s-fade guarantee-row pb-6">
            <span>Sin contrato forzoso</span>
            <span>Cancela cuando quieras</span>
            <span>Tus datos siempre en tu Drive</span>
          </div>
        </div>

        {/* FOOTER integrado al final de la sección de precios */}
        <footer className="w-full border-t border-[var(--s-border)] bg-white/40 backdrop-blur-md px-6 py-8">
          <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div className="font-bold text-[14px]">
              DentaXy <span className="text-[var(--s-green)]">Seed</span>
            </div>
            <div className="text-[11px] text-[var(--s-ink4)]">
              © 2026 DentaXy · Una obra de VanGox · Zacatecas, México
            </div>
            <button onClick={() => navigate('/seed/login')} className="btn-liquid btn-ghost py-2 px-5 text-[11px]">
              Acceder a mi consultorio
            </button>
          </div>
        </footer>
      </section>

    </div>
  );
}
