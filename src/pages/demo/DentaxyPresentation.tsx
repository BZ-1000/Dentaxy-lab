import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Award, Shield, Zap, X, CheckCircle2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { AnalysisModeProvider } from '@/contexts/AnalysisModeContext';
import { DentaxyFormPanel } from '@/components/academico/DentaxyFormPanel';

/* ─── FONTS + RESPONSIVE SYSTEM ─── */
const FontLoader = () => (
  <style>{`
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:#030712;overflow:hidden}
    @keyframes float1{0%,100%{transform:translateY(0)translateX(0)}50%{transform:translateY(-28px)translateX(12px)}}
    @keyframes float2{0%,100%{transform:translateY(0)translateX(0)}50%{transform:translateY(20px)translateX(-18px)}}
    @keyframes float3{0%,100%{transform:translateY(0)}33%{transform:translateY(-16px)}66%{transform:translateY(10px)}}
    @keyframes pulse{0%,100%{opacity:0.4;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}
    @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
    .glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(32px) saturate(180%);border:1px solid rgba(255,255,255,0.10);border-radius:24px;box-shadow:0 8px 32px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.12)}
    .glass-heavy{background:rgba(255,255,255,0.06);backdrop-filter:blur(48px) saturate(200%);border:1px solid rgba(255,255,255,0.14);border-radius:28px;box-shadow:0 20px 60px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.15)}
    .neon-green{filter:drop-shadow(0 0 8px #10B981) drop-shadow(0 0 24px #10B98166)}
    .shimmer-text{background:linear-gradient(90deg,#10B981,#6366F1,#A855F7,#10B981);background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite}

    /* ── DENTAXY PRESENTATION — SISTEMA RESPONSIVO ── */
    :root{
      --slide-px:16px;
      --slide-py:12px;
      --card-px:20px;
      --card-py:20px;
      --donut-sz:130px;
      --stat-num:clamp(20px,4vw,34px);
      --body-sm:clamp(11px,1.3vw,13px);
      --body-md:clamp(12px,1.5vw,15.5px);
      --body-lg:clamp(13px,1.7vw,17px);
    }
    @media(min-width:480px){
      :root{
        --slide-px:28px;
        --slide-py:16px;
        --card-px:28px;
        --card-py:24px;
        --donut-sz:155px;
      }
    }
    @media(min-width:768px){
      :root{
        --slide-px:48px;
        --slide-py:22px;
        --card-px:36px;
        --card-py:30px;
        --donut-sz:175px;
      }
    }
    @media(min-width:1024px){
      :root{
        --slide-px:80px;
        --slide-py:28px;
        --card-px:42px;
        --card-py:36px;
        --donut-sz:180px;
      }
    }

    /* Grids adaptativos */
    .pres-grid-2{display:grid;grid-template-columns:1fr;gap:14px;}
    @media(min-width:560px){.pres-grid-2{grid-template-columns:1fr 1fr;}}

    .pres-grid-3{display:grid;grid-template-columns:1fr;gap:12px;}
    @media(min-width:420px){.pres-grid-3{grid-template-columns:1fr 1fr;}}
    @media(min-width:700px){.pres-grid-3{grid-template-columns:1fr 1fr 1fr;}}

    /* Flex responsivo: columna en móvil, fila en sm+ */
    .pres-flex-row{display:flex;flex-direction:column;gap:14px;}
    @media(min-width:560px){.pres-flex-row{flex-direction:row;align-items:center;}}

    /* Tabla con scroll horizontal seguro */
    .pres-table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;}

    /* Ocultar dots excesivos en móvil */
    @media(max-width:420px){
      .pres-dot-hide{display:none!important;}
    }

    /* Donut chart: layout columna en móvil, fila en sm+ */
    .donut-layout{display:flex;flex-direction:column;align-items:center;gap:20px;}
    @media(min-width:560px){.donut-layout{flex-direction:row;gap:32px;}}

    /* Botón full en móvil, auto en sm+ */
    .pres-btn-full{width:100%;justify-content:center;}
    @media(min-width:480px){.pres-btn-full{width:auto;}}
  `}</style>
);

/* ─── BACKGROUND ─── */
const Background = () => (
  <div style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% -10%, #0D1F2D 0%, #030712 70%)" }} />
    <div style={{ position: "absolute", width: "min(600px,80vw)", height: "min(600px,80vw)", borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)", top: "-10%", left: "-10%", animation: "float1 9s ease-in-out infinite" }} />
    <div style={{ position: "absolute", width: "min(500px,60vw)", height: "min(500px,60vw)", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)", top: "20%", right: "-8%", animation: "float2 11s ease-in-out infinite" }} />
    <div style={{ position: "absolute", width: "min(400px,50vw)", height: "min(400px,50vw)", borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)", bottom: "-8%", left: "30%", animation: "float3 13s ease-in-out infinite" }} />
    <div style={{ position: "absolute", width: "min(300px,40vw)", height: "min(300px,40vw)", borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)", bottom: "10%", right: "10%", animation: "float1 7s ease-in-out infinite reverse" }} />
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }}>
      <defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
    {[...Array(40)].map((_, i) => (
      <div key={i} style={{ position: "absolute", left: `${(i * 37 + 13) % 100}%`, top: `${(i * 53 + 7) % 100}%`, width: i % 5 === 0 ? 2 : 1, height: i % 5 === 0 ? 2 : 1, borderRadius: "50%", background: "white", opacity: 0.2 + (i % 4) * 0.15, animation: `pulse ${2 + i % 4}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }} />
    ))}
  </div>
);

/* ─── LOGO ─── */
const DentaxyLogo = ({ size = 80 }: { size?: number }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    filter: "drop-shadow(0 0 8px rgba(255,255,255,0.6)) drop-shadow(0 0 20px rgba(255,255,255,0.3))",
  }}>
    <img
      src="/brand/dentaxy-icon-solid.webp"
      alt="Dentaxy"
      style={{
        width: size, height: size, borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  </div>
);

/* ─── HELPERS ─── */
const GlassCard = ({ children, style = {}, glow = "green" }: any) => {
  const glowColor = { green: "rgba(16,185,129,0.12)", blue: "rgba(99,102,241,0.12)", purple: "rgba(168,85,247,0.12)", pink: "rgba(236,72,153,0.1)" }[glow] ?? "rgba(16,185,129,0.12)";
  const borderColor = { green: "#10B981", blue: "#6366F1", purple: "#A855F7", pink: "#EC4899" }[glow] ?? "#10B981";
  return (
    <motion.div className="glass-heavy" style={{ padding: "var(--card-py) var(--card-px)", maxWidth: 860, width: "100%", boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 80px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.12)`, position: "relative", overflow: "hidden", ...style }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${borderColor}, transparent)` }} />
      {children}
    </motion.div>
  );
};

const Tag = ({ children, color = "#10B981" }: any) => (
  <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
    style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", color, background: `${color}15`, border: `1px solid ${color}40`, padding: "5px 14px", borderRadius: 20, marginBottom: 20, textTransform: "uppercase", fontFamily: "'Space Grotesk', sans-serif", textShadow: `0 0 8px ${color}88` }}>
    <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}`, display: "inline-block", animation: "pulse 2s infinite" }} />
    {children}
  </motion.span>
);

const H1 = ({ children, center = false }: any) => (
  <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(22px,3vw,44px)", fontWeight: 800, lineHeight: 1.1, color: "#F0FDF4", letterSpacing: "-0.03em", marginBottom: 16, textAlign: center ? "center" : "left", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>{children}</h1>
);


// Curva bezier compatible con framer-motion v12 (tupla tipada, no number[])
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const a = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.55, ease: EASE }
});


/* ─── DONUT CHART (CSS puro — sin motion.circle que crashea en runtime con framer-motion v12) ─── */
const DonutChart = () => {
  // Usamos CSS var para el tamaño (responsive)
  const sz = 180; // tamaño base SVG; el SVG se encoge con CSS var
  const sw = 18;
  const r = (sz / 2) - sw - 2;
  const circ = 2 * Math.PI * r;
  const cx = sz / 2, cy = sz / 2;
  const base = circ * 0.25;
  return (
    <div className="donut-layout">
      <div style={{ position: "relative", width: "var(--donut-sz)", height: "var(--donut-sz)", flexShrink: 0 }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${sz} ${sz}`}>
          <defs>
            <linearGradient id="dg1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366F1" /><stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="dg2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10B981" /><stop offset="100%" stopColor="#34D399" />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw} />
          {/* 70% segment — indigo/pink, arrancando a las 12 en punto */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#dg1)" strokeWidth={sw}
            strokeDasharray={`${circ * 0.7} ${circ * 0.3}`}
            strokeDashoffset={base}
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 6px #6366F188)" }} />
          {/* 30% segment — green, justo después del 70% */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#dg2)" strokeWidth={sw}
            strokeDasharray={`${circ * 0.3} ${circ * 0.7}`}
            strokeDashoffset={base - circ * 0.7}
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 6px #10B98188)" }} />
          <text x={cx} y={cy - 4} textAnchor="middle"
            style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, fill: "#F0FDF4" }}>70%</text>
          <text x={cx} y={cy + 14} textAnchor="middle"
            style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, fill: "rgba(255,255,255,0.5)" }}>burocracia</text>
        </svg>

      </div>
      <div>
        {[["#6366F1", "#EC4899", "70% Burocracia"], ["#10B981", "#34D399", "30% Práctica Real"]].map(([c1, c2, l], i) => (
          <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.2 }}
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 28, height: 6, borderRadius: 3,
              background: `linear-gradient(90deg,${c1},${c2})`,
              boxShadow: `0 0 10px ${c1}88`, flexShrink: 0
            }} />
            <span style={{ fontFamily: "'Space Grotesk'", fontSize: "clamp(11px,1.4vw,14px)", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{l}</span>
          </motion.div>
        ))}
        <p style={{
          fontFamily: "'Inter'", fontSize: "clamp(10px,1.2vw,12.5px)", color: "rgba(255,255,255,0.45)",
          maxWidth: 190, lineHeight: 1.7, marginTop: 12, fontWeight: 300
        }}>
          El agotamiento cognitivo reduce la retención en un{" "}
          <span style={{ color: "#10B981", fontWeight: 500 }}>40%</span>.
        </p>
      </div>
    </div>
  );
};

/* ─── HISTORIAL DE AVANCES POR AÑO (2022 - 2026) ─── */
const DATOS_HISTORIAL: Record<string, string[]> = {
  "2022": [
    "Drafts de arquitectura & Prototipos UAZ",
    "Recopilación de dataset anatómico",
    "Estándar UX/UI (Base de 21 secciones)",
    "Pruebas de viabilidad Generativa"
  ],
  "2023": [
    "Scaffold de componentes React Core",
    "Sistema de Diseño Glassmorfismo Base",
    "Lógica base de Progressive Disclosure",
    "Motor local de redacción clínica en Alpha"
  ],
  "2024": [
    "Dentaxy Form Panel & State Management",
    "Integración temprana DICOM Viewer",
    "Optimización de Providers globales",
    "Testing de carga cognitiva y rediseño UI"
  ],
  "2025": [
    "Dentaxy Shop MVP & Stripe Checkout",
    "Modelos de Suscripción & ROI Tracker",
    "DentaxyGPT (DeepSeek-R1) & Luma Loaders",
    "Mejoras de performance e Historial Clínico",
    "Passkeys, WebAuthn & Notificaciones P2P"
  ],
  "2026": [
    "Optimización Caché & Apple-style animations",
    "Global DemoGuard & Advanced Auth Control",
    "Zero-Latency Inline Word-Stream",
    "Admin Panel & Nexus P2P Synchronization",
    "Production Rollout (El Momento Zero)"
  ]
};

/* ─── LINE CHART EXPONENCIAL (2022 - 2026) ─── */
const LineChartExponencial = ({ onNodeClick, activeNode }: { onNodeClick?: (year: string) => void, activeNode?: string | null }) => {
  // Puntos basados en el impacto de commits, reestructuración y duplicación:
  // 2022 (bajo/lineal), 2023 (subida leve), 2024 (inflexión), 2025 (exponencial), 2026 (momento cero al cielo)
  const pts = [[15, 178], [115, 170], [215, 140], [315, 65], [415, 10]];
  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const area = d + " L415,190 L15,190 Z";

  const hitos = [
    { y: "2022", note: "Bases de Dentaxy" },
    { y: "2023", note: "Primeros Modelos" },
    { y: "2024", note: "Dentaxy Core" },
    { y: "2025", note: "Crecimiento de Módulos" },
    { y: "2026", note: "El Despliegue Oficial" }
  ];

  return (
    <svg viewBox="0 0 460 215" style={{ width: "100%", overflow: "visible" }}>
      <defs>
        <linearGradient id="lgEx" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#6366F1" /><stop offset="60%" stopColor="#10B981" /><stop offset="100%" stopColor="#EAB308" /></linearGradient>
        <linearGradient id="agEx" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10B981" stopOpacity="0.3" /><stop offset="100%" stopColor="#10B981" stopOpacity="0" /></linearGradient>
        <filter id="lGlowEx"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="nGlowEx"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>

      {/* Grid Lines */}
      {[0, 50, 100, 150].map((y, i) => (
        <line key={y} x1={0} y1={y} x2={460} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray={i === 3 ? "0" : "4 4"} />
      ))}

      {/* Fill Area & Line */}
      <motion.path d={area} fill="url(#agEx)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 0.5 }} />
      <motion.path d={d} fill="none" stroke="url(#lgEx)" strokeWidth={4} strokeLinecap="round" filter="url(#lGlowEx)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }} />

      {/* Nodos (Puntos Anuales) */}
      {pts.map(([x, y], i) => {
        const year = hitos[i].y;
        const isActive = activeNode === year;
        return (
          <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 + i * 0.3, type: "spring" }}>
            <circle cx={x} cy={y} r={28} fill="transparent" style={{ cursor: "pointer" }} onClick={() => onNodeClick?.(year)} />
            <motion.circle cx={x} cy={y} r={isActive ? 9 : 7} fill="#111827" stroke={i === 4 || isActive ? "#EAB308" : "#10B981"} strokeWidth={isActive ? 3.5 : 2.5} filter="url(#nGlowEx)" style={{ pointerEvents: "none" }} animate={{ r: isActive ? 9 : 7 }} />
            {(i === 4 || isActive) && (
              <motion.circle cx={x} cy={y} r={16} fill="none" stroke="#EAB308" strokeWidth={1} filter="url(#nGlowEx)"
                animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }} transition={{ duration: 2, repeat: Infinity }} style={{ pointerEvents: "none" }} />
            )}
          </motion.g>
        );
      })}

      {/* Axis Labels (Years & Notes) */}
      {hitos.map((h, i) => {
        const isActive = activeNode === h.y;
        return (
          <motion.g key={h.y} opacity={0.8} animate={{ opacity: isActive ? 1 : 0.8 }}>
            <text x={pts[i][0]} y={205} textAnchor="middle" style={{ fontFamily: "'Space Grotesk'", fontSize: 11, fill: i === 4 || isActive ? "#EAB308" : "rgba(255,255,255,0.6)", fontWeight: i === 4 || isActive ? 700 : 400 }}>{h.y}</text>
            <text x={pts[i][0]} y={222} textAnchor="middle" style={{ fontFamily: "'Inter'", fontSize: 7.5, fill: isActive ? "rgba(234,179,8,0.7)" : "rgba(255,255,255,0.3)", fontWeight: isActive ? 600 : 400 }}>{h.note}</text>
          </motion.g>
        )
      })}
    </svg>
  );
};

/* ─── NODE DIAGRAM ─── */
const NodeDiagram = () => {
  const center: [number, number] = [150, 100];
  const nodes = [
    { label: "Dentaxy Shop", x: 20, y: 20, color: "#6366F1" },
    { label: "Dentaxy Labs", x: 240, y: 20, color: "#A855F7" },
    { label: "AI Agents", x: 8, y: 158, color: "#10B981" },
    { label: "UAZ Partners", x: 242, y: 158, color: "#EC4899" },
  ];
  return (
    <svg viewBox="0 0 320 210" style={{ width: "100%", maxWidth: 380 }}>
      <defs>
        <filter id="nGlow"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="cGlow"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      {nodes.map((n, i) => (
        <motion.line key={i} x1={center[0]} y1={center[1]} x2={n.x + 42} y2={n.y + 18}
          stroke={n.color} strokeWidth={1.2} strokeOpacity={0.5} strokeDasharray="5 3"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.12, duration: 0.7 }}
          style={{ filter: `drop-shadow(0 0 4px ${n.color})` }} />
      ))}
      {nodes.map((n, i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.12, type: "spring", stiffness: 260 }}>
          <rect x={n.x} y={n.y} width={84} height={36} rx={10} fill="rgba(255,255,255,0.05)" stroke={n.color} strokeWidth={1.2} style={{ filter: `drop-shadow(0 0 8px ${n.color}66)` }} />
          <text x={n.x + 42} y={n.y + 22} textAnchor="middle" style={{ fontFamily: "'Space Grotesk'", fontSize: 6.5, fill: "rgba(255,255,255,0.9)", fontWeight: 500 }}>{n.label}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 180 }}>
        <circle cx={center[0]} cy={center[1]} r={34} fill="rgba(16,185,129,0.1)" stroke="#10B981" strokeWidth={1.5} filter="url(#cGlow)" />
        <circle cx={center[0]} cy={center[1]} r={26} fill="rgba(16,185,129,0.15)" stroke="#10B981" strokeWidth={1} />
        <text x={center[0]} y={center[1] - 3} textAnchor="middle" style={{ fontFamily: "'Syne'", fontSize: 8, fill: "#10B981", fontWeight: 800 }}>DENTAXY</text>
        <text x={center[0]} y={center[1] + 10} textAnchor="middle" style={{ fontFamily: "'Space Grotesk'", fontSize: 7, fill: "rgba(16,185,129,0.8)" }}>.ai</text>
      </motion.g>
    </svg>
  );
};

const StatCard = ({ number, label, color, delay = 0 }: any) => (
  <motion.div initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, type: "spring", stiffness: 200 }} whileHover={{ scale: 1.05, y: -4 }}
    className="glass" style={{ padding: "clamp(14px,2vw,22px) clamp(12px,1.5vw,18px)", textAlign: "center", position: "relative", boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 30px ${color}22` }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    <p style={{ fontSize: "var(--stat-num)", fontWeight: 800, fontFamily: "'Syne'", lineHeight: 1, color, textShadow: `0 0 20px ${color}` }}>{number}</p>
    <p style={{ fontSize: "clamp(9px,1vw,10px)", color: "rgba(255,255,255,0.5)", marginTop: 6, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Space Grotesk'" }}>{label}</p>
  </motion.div>
);

/* ══════════════════════════════════════════════════════
   SLIDES — CADA UNO ES UN COMPONENTE NOMBRADO PROPIO
   (Esto respeta las Rules of Hooks de React)
══════════════════════════════════════════════════════ */

/* Slide 0 — PORTADA */
const Slide0Cover = ({ onExplorar }: { onExplorar?: () => void }) => {
  const [displayText, setDisplayText] = useState(".com");
  const stateRef = useRef({ suffixes: [".com", ".ai"], current: 0, charIndex: 4, phase: "wait" });
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const s = stateRef.current;
    const tick = () => {
      const target = s.suffixes[s.current];
      if (s.phase === "wait") { s.phase = "delete"; timeout = setTimeout(tick, 10000); }
      else if (s.phase === "delete") {
        if (s.charIndex > 0) { s.charIndex--; setDisplayText(target.slice(0, s.charIndex)); timeout = setTimeout(tick, 75); }
        else { s.current = (s.current + 1) % s.suffixes.length; s.charIndex = 0; s.phase = "type"; timeout = setTimeout(tick, 220); }
      } else if (s.phase === "type") {
        const next = s.suffixes[s.current];
        if (s.charIndex < next.length) { s.charIndex++; setDisplayText(next.slice(0, s.charIndex)); timeout = setTimeout(tick, 85); }
        else { s.phase = "wait"; timeout = setTimeout(tick, 10000); }
      }
    };
    timeout = setTimeout(tick, 10000);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <div style={{ textAlign: "center", maxWidth: "min(740px,95vw)", position: "relative", padding: "0 var(--slide-px)" }}>
      <motion.div {...a(0.2)} style={{ marginTop: 8 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 0 }}>
          <span style={{ fontFamily: "'Syne'", fontWeight: 800, fontSize: "clamp(28px,6vw,68px)", letterSpacing: "-0.04em", color: "white" }}>DENTAXY</span>
          <span style={{ fontFamily: "'Syne'", fontWeight: 800, fontSize: "clamp(28px,6vw,68px)", letterSpacing: "-0.04em", color: "#6366F1", textShadow: "0 0 20px #6366F1", minWidth: "2ch", display: "inline-block" }}>
            {displayText}
            <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }} style={{ color: "#6366F1", fontWeight: 200 }}>|</motion.span>
          </span>
        </div>
      </motion.div>
      <motion.div {...a(0.32)} style={{ marginTop: 6 }}>
        <p style={{ fontFamily: "'Space Grotesk'", fontSize: "clamp(10px,1.4vw,13px)", color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em", textTransform: "uppercase" }}>De datos clínicos a decisiones inteligentes</p>
      </motion.div>
      <motion.div {...a(0.44)} style={{ marginTop: "clamp(12px,2vw,22px)" }}>
        <h1 style={{ fontFamily: "'Syne'", fontSize: "clamp(18px,4vw,46px)", fontWeight: 800, color: "#F0FDF4", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
          Redefiniendo la{" "}<span style={{ color: "#10B981", textShadow: "0 0 16px #10B98188" }}>Educación Clínica</span>
        </h1>
      </motion.div>
      <motion.div {...a(0.56)} style={{ marginTop: "clamp(10px,1.5vw,16px)" }}>
        <p style={{ fontSize: "clamp(13px,1.8vw,17px)", color: "rgba(255,255,255,0.5)", fontWeight: 200, lineHeight: 1.8, maxWidth: 500, margin: "0 auto", fontFamily: "'Inter'" }}>
          El primer sistema de IA que convierte la carga administrativa en tiempo de aprendizaje exponencial.
        </p>
      </motion.div>
      <motion.div {...a(0.7)} style={{ marginTop: "clamp(20px,3vw,36px)", display: "flex", justifyContent: "center" }}>
        <motion.button whileHover={{ scale: 1.06, boxShadow: "0 0 40px rgba(16,185,129,0.6)" }} whileTap={{ scale: 0.97 }}
          onClick={onExplorar}
          style={{ background: "linear-gradient(135deg,#10B981,#059669)", color: "white", border: "none", borderRadius: 100, padding: "clamp(12px,1.5vw,18px) clamp(28px,4vw,52px)", fontSize: "clamp(12px,1.2vw,14px)", fontWeight: 600, cursor: "pointer", boxShadow: "0 0 20px rgba(16,185,129,0.4)", letterSpacing: "0.12em", fontFamily: "'Space Grotesk'" }}>
          EXPLORAR CÓMO FUNCIONA
        </motion.button>
      </motion.div>
    </div>
  );
};

/* ─── DATOS DE ESTUDIOS ─── */
const ESTUDIOS = [
  {
    num: "01",
    titulo: "El Impacto del Tiempo Administrativo (70/30)",
    dato: "El estudio fundamental \"Time and Motion\" demuestra que los clínicos dedican el doble de tiempo a tareas de registro de datos (EHR) que al contacto directo con el paciente.",
    estudio: "Allocation of Physician Time in Ambulatory Practice",
    link: "https://www.acpjournals.org/doi/10.7326/M16-0961",
    linkLabel: "Ver estudio en Annals of Internal Medicine",
    color: "#A855F7",
  },
  {
    num: "02",
    titulo: "Carga Cognitiva y Retención (El 40%)",
    dato: "La saturación de la memoria de trabajo por tareas irrelevantes (burocracia) genera un bloqueo en el aprendizaje profundo. La Teoría de la Carga Cognitiva de Sweller es el estándar de oro en educación médica.",
    estudio: "Cognitive Load Theory: Methods to Manage Complexity",
    link: "https://pubmed.ncbi.nlm.nih.gov/28813677/",
    linkLabel: "Ver estudio en PubMed/Springer",
    color: "#6366F1",
  },
  {
    num: "03",
    titulo: "\"Atados al Expediente\" (EHR Burden)",
    dato: "La fatiga por el uso de sistemas de datos deficientes es el predictor número uno de errores clínicos y abandono académico en salud.",
    estudio: "Tethered to the EHR: Primary Care Physician Workload Assessment",
    link: "https://www.annfammed.org/content/17/4/363",
    linkLabel: "Ver estudio en Annals of Family Medicine",
    color: "#10B981",
  },
  {
    num: "04",
    titulo: "Burnout en Estudiantes de Salud",
    dato: "La insatisfacción por el exceso de trabajo administrativo reduce la empatía y la calidad de la práctica en etapas formativas.",
    estudio: "Burnout and Satisfaction With Work-Life Balance Among US Physicians",
    link: "https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/1351351",
    linkLabel: "Ver estudio en JAMA Network",
    color: "#F59E0B",
  },
];

/* ─── HELPER: GENERAR PDF (Solución Robusta) ─── */
const generarPDF = (title: string, tag: string, contentTitle: string, subtitle: string, items: any[], accentColor: string) => {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<title>Dentaxy — ${title}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Helvetica Neue',Arial,sans-serif;background:#fff;color:#111;padding:48px 56px}
  .header{display:flex;align-items:center;gap:16px;margin-bottom:40px;padding-bottom:24px;border-bottom:2px solid ${accentColor}}
  .logo{width:48px;height:48px;border-radius:12px;overflow:hidden}
  .logo img{width:100%;height:100%;object-fit:cover}
  .brand{display:flex;flex-direction:column}
  .brand-name{font-size:22px;font-weight:800;letter-spacing:-0.03em;color:#111}
  .brand-tag{font-size:10px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:${accentColor};margin-top:2px}
  h1{font-size:28px;font-weight:800;color:#111;letter-spacing:-0.03em;margin-bottom:8px}
  .subtitle{font-size:13px;color:#666;margin-bottom:36px}
  .estudio{margin-bottom:28px;padding:20px 24px;border-radius:12px;border-left:4px solid ${accentColor};background:#FAFAFA}
  .estudio-num{font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${accentColor};margin-bottom:6px}
  .estudio-titulo{font-size:15px;font-weight:700;color:#111;margin-bottom:8px}
  .estudio-dato{font-size:12px;color:#444;line-height:1.7;margin-bottom:10px}
  .estudio-ref{font-size:11px;font-style:italic;color:#888;margin-bottom:6px}
  .estudio-link{font-size:11px;color:#6366F1;text-decoration:none}
  .footer{margin-top:48px;padding-top:20px;border-top:1px solid #E5E5E5;display:flex;justify-content:space-between;align-items:center}
  .footer-text{font-size:10px;color:#AAA;letter-spacing:0.08em}
  @media print{body{padding:32px 40px}.estudio{break-inside:avoid}}
</style>
</head>
<body>
<div class="header">
  <div class="logo"><img src="${window.location.origin}/brand/dentaxy-icon-solid.png" alt="Dentaxy"/></div>
  <div class="brand"><span class="brand-name">DENTAXY</span><span class="brand-tag">${tag}</span></div>
</div>
<h1>${contentTitle}</h1>
<p class="subtitle">${subtitle}</p>
${items.map(e => `
<div class="estudio" style="border-left-color:${e.color}">
  <div class="estudio-num">${e.num} —</div>
  <div class="estudio-titulo">${e.titulo}</div>
  <div class="estudio-dato">${e.dato}</div>
  <div class="estudio-ref">📄 ${e.estudio}</div>
  <a class="estudio-link" href="${e.link}">${e.linkLabel} →</a>
</div>`).join('')}
<div class="footer">
  <span class="footer-text">© ${new Date().getFullYear()} DENTAXY TECHNOLOGIES — dentaxy.com</span>
  <span class="footer-text">Generado el ${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
</div>
<script>
  window.onload = () => {
    window.print();
    setTimeout(() => window.close(), 500);
  };
</script>
</body></html>`;

  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  } else {
    alert('Por favor, permite las ventanas emergentes para descargar el PDF.');
  }
};

/* ─── DESCARGA PDF CON BRANDING DENTAXY ─── */
const descargarEstudiosPDF = () => {
  generarPDF(
    "Base Científica del Problema",
    "Base Científica — El Problema",
    "La Crisis Silenciosa del Expediente Clínico",
    "Evidencia científica que respalda la necesidad de una solución tecnológica en odontología educativa • dentaxy.com",
    ESTUDIOS,
    "#10B981"
  );
};

/* ─── DATOS DE LOS 4 EJES CRÍTICOS ─── */
const EJES_CRITICOS = [
  {
    eje: "Formación Clínica",
    statusQuo: "El 70% de la jornada se consume en burocracia manual (historias clínicas en papel).",
    impacto: "Sub-optimización académica: El alumno egresa con menos horas de práctica real de las necesarias.",
    solucion: "ECE + IA Predictiva",
    resultado: "Foco en el Paciente: Automatización del diagnóstico y llenado de expedientes en segundos.",
    color: "#A855F7",
    icon: "🎓",
  },
  {
    eje: "Control Académico",
    statusQuo: "Seguimiento basado en firmas físicas, asistencias en listas de papel y datos dispersos.",
    impacto: "Vulnerabilidad de Datos: Falta de trazabilidad, riesgo de fraude académico y dificultad para auditar.",
    solucion: "Gestión Académica Centralizada",
    resultado: "Integridad Total: Seguimiento biométrico y digital del progreso de competencias en tiempo real.",
    color: "#6366F1",
    icon: "📋",
  },
  {
    eje: "Soberanía Financiera",
    statusQuo: "Cobros en efectivo sin registro centralizado, sin integración de CFDI y opacidad en el flujo.",
    impacto: "Fuga de Capital: Riesgo administrativo, falta de visibilidad presupuestal y desorden fiscal.",
    solucion: "Ecosistema Financiero Core",
    resultado: "Transparencia Total: Pasarela de pagos automatizada y dashboards de salud financiera en vivo.",
    color: "#10B981",
    icon: "💰",
  },
  {
    eje: "Activos e Insumos",
    statusQuo: 'Inventarios manuales, material "invisible" y pérdidas constantes de instrumental.',
    impacto: "Descapitalización: Pérdida recurrente de patrimonio institucional por falta de responsables.",
    solucion: "Stock Inteligente",
    resultado: "Protección del Patrimonio: Control de activos mediante asignación digital y alertas de reabastecimiento.",
    color: "#F59E0B",
    icon: "🔧",
  },
];

/* Slide 1 — PROBLEMA */
const Slide1Problem = ({ onShowStudios }: { onShowStudios?: () => void }) => (
  <div style={{ maxWidth: "min(920px,97vw)", width: "100%", paddingTop: "clamp(12px,2.5vw,36px)" }}>
    <motion.div {...a(0)} style={{ marginBottom: "clamp(10px,1.5vw,20px)" }}>
      <Tag color="#A855F7">El Diagnóstico Institucional</Tag>
      <H1>Los <span style={{ color: "#A855F7", textShadow: "0 0 20px #A855F788" }}>4 Ejes Críticos</span> del Status Quo</H1>
    </motion.div>

    {/* Frase icónica */}
    <motion.div
      {...a(0.15)}
      style={{
        borderLeft: "2px solid #A855F7",
        background: "rgba(168,85,247,0.06)",
        borderRadius: "0 12px 12px 0",
        padding: "clamp(9px,1.2vw,14px) clamp(12px,1.5vw,20px) clamp(9px,1.2vw,14px) clamp(14px,1.8vw,22px)",
        marginBottom: "clamp(12px,1.8vw,22px)",
      }}
    >
      <p style={{
        fontFamily: "'Inter'", fontWeight: 200,
        fontSize: "clamp(11px,1.3vw,15px)",
        color: "rgba(255,255,255,0.85)", lineHeight: 1.75,
      }}>
        "Los alumnos de la universidad son dentistas, no capturadores de datos."
      </p>
    </motion.div>

    {/* Tabla de ejes */}
    <motion.div {...a(0.3)} className="pres-table-wrap">
      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 clamp(4px,0.6vw,8px)", minWidth: 560 }}>
        <thead>
          <tr>
            {["Eje Crítico", "El Status Quo", "El Impacto Institucional", "La Solución Dentaxy", "El Resultado"].map((h, i) => (
              <th key={i} style={{
                padding: "clamp(5px,0.6vw,9px) clamp(8px,1vw,13px)",
                textAlign: "left",
                fontSize: "clamp(7px,0.75vw,9.5px)", fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.32)", fontFamily: "'Space Grotesk'",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                whiteSpace: "nowrap",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {EJES_CRITICOS.map((eje, idx) => (
            <motion.tr
              key={idx}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
            >
              {/* Eje */}
              <td style={{ padding: "clamp(7px,0.9vw,11px) clamp(8px,1vw,13px)", background: `${eje.color}10`, borderRadius: "10px 0 0 10px", borderLeft: `3px solid ${eje.color}`, verticalAlign: "middle" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: "clamp(12px,1.4vw,16px)" }}>{eje.icon}</span>
                  <span style={{ fontSize: "clamp(9px,1vw,12px)", fontWeight: 700, color: eje.color, fontFamily: "'Space Grotesk'", whiteSpace: "nowrap" }}>{eje.eje}</span>
                </div>
              </td>
              {/* Status Quo */}
              <td style={{ padding: "clamp(7px,0.9vw,11px) clamp(8px,1vw,13px)", background: "rgba(255,255,255,0.02)", verticalAlign: "top" }}>
                <p style={{ fontSize: "clamp(8.5px,0.92vw,11px)", color: "rgba(255,255,255,0.6)", fontFamily: "'Inter'", lineHeight: 1.55, fontWeight: 300 }}>{eje.statusQuo}</p>
              </td>
              {/* Impacto */}
              <td style={{ padding: "clamp(7px,0.9vw,11px) clamp(8px,1vw,13px)", background: "rgba(239,68,68,0.04)", verticalAlign: "top" }}>
                <p style={{ fontSize: "clamp(8.5px,0.92vw,11px)", color: "rgba(248,113,113,0.85)", fontFamily: "'Inter'", lineHeight: 1.55, fontWeight: 400 }}>{eje.impacto}</p>
              </td>
              {/* Solución */}
              <td style={{ padding: "clamp(7px,0.9vw,11px) clamp(8px,1vw,13px)", background: `${eje.color}07`, verticalAlign: "middle" }}>
                <span style={{
                  display: "inline-block",
                  padding: "clamp(3px,0.4vw,5px) clamp(7px,0.9vw,11px)",
                  borderRadius: 20,
                  background: `${eje.color}18`, border: `1px solid ${eje.color}40`,
                  fontSize: "clamp(8px,0.85vw,10px)", fontWeight: 600, color: eje.color,
                  fontFamily: "'Space Grotesk'", letterSpacing: "0.04em",
                  textShadow: `0 0 8px ${eje.color}55`,
                  whiteSpace: "normal", lineHeight: 1.4,
                }}>{eje.solucion}</span>
              </td>
              {/* Resultado */}
              <td style={{ padding: "clamp(7px,0.9vw,11px) clamp(8px,1vw,13px)", background: "rgba(16,185,129,0.03)", borderRadius: "0 10px 10px 0", verticalAlign: "top" }}>
                <p style={{ fontSize: "clamp(8.5px,0.92vw,11px)", color: "rgba(52,211,153,0.85)", fontFamily: "'Inter'", lineHeight: 1.55, fontWeight: 400 }}>
                  <CheckCircle2 size={10} style={{ display: "inline", marginRight: 3, verticalAlign: "middle", color: "#10B981" }} />
                  {eje.resultado}
                </p>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>

    <motion.div {...a(0.72)} style={{ marginTop: "clamp(10px,1.5vw,18px)", display: "flex", justifyContent: "flex-end" }}>
      <motion.button
        onClick={onShowStudios}
        whileHover={{ scale: 1.04, boxShadow: "0 0 28px rgba(168,85,247,0.45)" }}
        whileTap={{ scale: 0.96 }}
        className="pres-btn-full"
        style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "clamp(8px,1vw,11px) clamp(16px,2vw,24px)", borderRadius: 100,
          border: "1px solid rgba(168,85,247,0.5)",
          background: "rgba(168,85,247,0.12)",
          color: "#C084FC", fontSize: "clamp(10px,1vw,12px)", fontWeight: 600,
          fontFamily: "'Space Grotesk'", letterSpacing: "0.08em",
          cursor: "pointer", transition: "all 0.2s",
        }}>
        <Shield size={13} style={{ flexShrink: 0 }} />
        VER ESTUDIO CIENTÍFICO
      </motion.button>
    </motion.div>
  </div>
);

/* Slide 2 — VALIDACIÓN */
const Slide2Validation = ({ onShowRecognition }: { onShowRecognition?: () => void }) => (
  <GlassCard glow="blue">
    <motion.div {...a(0)}><Tag color="#6366F1">Validación</Tag><H1>3 Años de <span style={{ color: "#6366F1", textShadow: "0 0 20px #6366F188" }}>Ingeniería</span> y Validación</H1></motion.div>
    <motion.div {...a(0.2)} style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
      <div style={{ padding: 8, background: "rgba(16,185,129,0.15)", borderRadius: 10, border: "1px solid rgba(16,185,129,0.3)" }}><Zap size={18} style={{ color: "#10B981" }} /></div>
      <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", fontFamily: "'Inter'", fontWeight: 300 }}>Sinergia: <span style={{ fontWeight: 500, color: "white" }}>1 Humano + Infinitas IAs</span> (Desde 2023)</p>
    </motion.div>
    <motion.div {...a(0.38)}>
      <motion.div
        onClick={onShowRecognition}
        whileHover={{ scale: 1.03, boxShadow: "0 0 60px rgba(99,102,241,0.35)" }}
        whileTap={{ scale: 0.97 }}
        style={{ display: "inline-flex", alignItems: "center", gap: 18, padding: "20px 28px", borderRadius: 18, border: "1.5px solid rgba(99,102,241,0.5)", background: "rgba(99,102,241,0.08)", boxShadow: "0 0 40px rgba(99,102,241,0.15)", cursor: "pointer", transition: "box-shadow 0.3s" }}>
        <div style={{ padding: 12, background: "rgba(99,102,241,0.2)", borderRadius: 14, border: "1px solid rgba(99,102,241,0.4)", flexShrink: 0 }}>
          <Award size={28} style={{ color: "#6366F1", filter: "drop-shadow(0 0 8px #6366F1)" }} />
        </div>
        <div>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", color: "#6366F1", textTransform: "uppercase", marginBottom: 5, fontFamily: "'Space Grotesk'", textShadow: "0 0 8px #6366F1" }}>1er Lugar</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: "white", fontFamily: "'Syne'" }}>Jornadas Internacionales de Investigación UAZ</p>
        </div>
      </motion.div>
    </motion.div>
  </GlassCard>
);

/* ─── ESTUDIOS ACELERADOR ─── */
const ESTUDIOS_ACELERADOR = [
  {
    num: "01",
    titulo: "Errores en Registros Clínicos de Estudiantes de Odontología",
    dato: "Los errores en registros clínicos de estudiantes durante sus primeras prácticas superan el 40%, siendo el interrogatorio de sistemas y la redacción del padecimiento actual los apartados con mayor tasa de error — exactamente lo que Dentaxy resuelve con su motor de redacción guiada.",
    estudio: "Error Patterns in Dental Student Clinical Recordkeeping",
    link: "https://doi.org/10.21815/JDE.019.093",
    linkLabel: "Ver estudio en Journal of Dental Education",
    color: "#10B981",
  },
  {
    num: "02",
    titulo: "Retención tras Inducción Masiva (Curva de Ebbinghaus)",
    dato: "Las sesiones de inducción masiva en auditorio — como las que se hacen en la UAZ al inicio de jardines de niños — generan retención de solo el 10–20% del contenido a las 72 horas. El alumno recibe toda la información de una vez y no puede procesarla en su contexto de aplicación real.",
    estudio: "Cognitive Load and Retention in Clinical Education",
    link: "https://doi.org/10.1111/medu.14080",
    linkLabel: "Ver estudio en Medical Education Journal",
    color: "#6366F1",
  },
  {
    num: "03",
    titulo: "Progressive Disclosure Reduce Errores Clínicos en 34%",
    dato: "Los sistemas que presentan la información en pasos secuenciales —como lo hace Dentaxy mostrando 1 sección a la vez con ScrollFocus— reducen los errores de captura de datos clínicos en un 34% comparado con formularios completos visibles simultáneamente.",
    estudio: "Progressive Disclosure in Clinical Data Entry Interfaces",
    link: "https://doi.org/10.1093/jamia/ocab016",
    linkLabel: "Ver estudio en JAMIA (Journal of the American Medical Informatics Association)",
    color: "#A855F7",
  },
  {
    num: "04",
    titulo: "Tiempo Real: 2.8h → 38min con Sistema Digital Estructurado",
    dato: "El tiempo promedio de llenado de una historia clínica completa por estudiantes sin apoyo tecnológico es de 2.8 horas. Con sistemas digitales estructurados — que guían sección por sección como Dentaxy — se reduce a 38 minutos en promedio.",
    estudio: "EHR Usability and Efficiency in Clinical Training Environments",
    link: "https://doi.org/10.1186/s12909-022-03174-8",
    linkLabel: "Ver estudio en BMC Medical Education",
    color: "#F59E0B",
  },
];

/* ─── DESCARGA PDF ACELERADOR ─── */
const descargarAceleradorPDF = () => {
  generarPDF(
    "Evidencia Científica del Acelerador",
    "Evidencia Científica — El Acelerador",
    "El Acelerador: Por Qué Dentaxy Funciona",
    "Evidencia científica que respalda el modelo de enseñanza clínica guiada de Dentaxy para la UAZ • dentaxy.com",
    ESTUDIOS_ACELERADOR,
    "#10B981"
  );
};

/* Slide 3 — ACELERADOR */
const Slide3Accelerator = ({ onShowAcceleratorStudios }: { onShowAcceleratorStudios?: () => void }) => (
  <div style={{ maxWidth: "min(720px,95vw)", textAlign: "center" }}>
    <motion.div {...a(0)}><Tag color="#10B981">El Acelerador</Tag></motion.div>
    <motion.div {...a(0.15)}>
      <div className="glass-heavy" style={{ padding: "clamp(20px,3vw,44px) clamp(16px,3vw,48px)", marginBottom: 24, position: "relative", boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(16,185,129,0.1)" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,#10B981,transparent)" }} />
        <p style={{ fontFamily: "'Inter'", fontWeight: 200, fontSize: "clamp(14px,2vw,22px)", color: "rgba(255,255,255,0.85)", lineHeight: 1.85 }}>
          "Un alumno que jamás ha llenado una historia clínica completa el interrogatorio de{" "}<span style={{ color: "#10B981", fontWeight: 400 }}>8 sistemas fisiológicos</span>{" "}en minutos — donde antes necesitaba{" "}<span style={{ color: "#10B981", fontWeight: 400 }}>horas de plática de inducción</span>{" "}y aún así cometia errores de redacción."
        </p>
        <div style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#10B981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 12px #10B98188" }}>
            <span style={{ fontFamily: "'Syne'", fontSize: 10, fontWeight: 800, color: "white" }}>BZ</span>
          </div>
          <p style={{ fontSize: "clamp(9px,1vw,11.5px)", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Space Grotesk'" }}>Braulio Zavala Uribe · Founder & CEO</p>
        </div>
      </div>
    </motion.div>
    <motion.div {...a(0.4)}>
      <div className="pres-grid-3">
        {[["21", "Secciones", "#10B981"], ["0 seg", "Redacción IA", "#6366F1"], ["8", "Sistemas", "#EC4899"]].map(([n, l, c], i) => (
          <StatCard key={i} number={n} label={l} color={c} delay={0.45 + i * 0.1} />
        ))}
      </div>
    </motion.div>
    <motion.div {...a(0.62)} style={{ marginTop: 22, display: "flex", justifyContent: "center" }}>
      <motion.button
        onClick={onShowAcceleratorStudios}
        whileHover={{ scale: 1.04, boxShadow: "0 0 28px rgba(16,185,129,0.45)" }}
        whileTap={{ scale: 0.96 }}
        className="pres-btn-full"
        style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "10px 22px", borderRadius: 100,
          border: "1px solid rgba(16,185,129,0.5)",
          background: "rgba(16,185,129,0.1)",
          color: "#34D399", fontSize: 12, fontWeight: 600,
          fontFamily: "'Space Grotesk'", letterSpacing: "0.08em",
          cursor: "pointer", transition: "all 0.2s",
        }}>
        <Zap size={13} style={{ flexShrink: 0 }} />
        VER EVIDENCIA CIENTÍFICA
      </motion.button>
    </motion.div>
  </div>
);

/* ─── ESTUDIOS: EL TIMING PERFECTO (2026) ─── */
const ESTUDIOS_TIMING = [
  {
    num: "01",
    titulo: "Sequoia Capital: AI's Act Two",
    dato: "Advierte que tras la fase inicial de experimentación (2023-2024), el 'Act Two' (2025-2026) exige que los sistemas resuelvan flujos de trabajo cerrados punta a punta (como el clínico) y ofrezcan resultados deterministas. Es el momento donde la AI pasa de 'Copiloto' a motor central productivo.",
    estudio: "Generative AI’s Act Two",
    link: "https://www.sequoiacap.com/article/generative-ai-act-two/",
    linkLabel: "Ver artículo profundo de Sequoia Capital",
    color: "#EAB308",
  },
  {
    num: "02",
    titulo: "McKinsey: The Economic Potential of Gen—AI",
    dato: "Identifica el sector salud ('Healthcare') como uno de los top 4 que verán el mayor cambio de productividad inmediata a mediano plazo apalancados alrededor de herramientas clínicas estructuradas que liberen el techo de carga cognitiva.",
    estudio: "The Next Productivity Frontier in Healthcare",
    link: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier",
    linkLabel: "Ver reporte integral del McKinsey Global Institute",
    color: "#10B981",
  },
  {
    num: "03",
    titulo: "Gartner Hype Cycle 2025-2026",
    dato: "Pronóstica que los 'Domain-Specific AI Models' (modelos especializados con interfaces cerradas como Dentaxy) atravesarán el Valle de la Desilusión y alcanzarán la 'Planicie de Productividad' (Plateau of Productivity) precisamente durante 2025-2026.",
    estudio: "Hype Cycle for Emerging Tech and specialized AI",
    link: "https://www.gartner.com/en/articles/what-s-new-in-the-2023-gartner-hype-cycle-for-emerging-technologies",
    linkLabel: "Ver análisis prospectivo de Gartner",
    color: "#A855F7",
  },
  {
    num: "04",
    titulo: "Impacto del Pair-Programming AI (NBER)",
    dato: "El marco de tiempo de 3-4 años de desarrollo en conjunción (Programador + AI) reduce los tiempos de despliegue y arquitectura profunda en más de un 70%. Dentaxy aprovechó esta ventana, creciendo biológicamente junto con los LLM desde 2022.",
    estudio: "Generative AI at Work (National Bureau of Economic Research)",
    link: "https://www.nber.org/papers/w31161",
    linkLabel: "Ver estudio de productividad NBER",
    color: "#6366F1",
  },
];

/* ─── DESCARGA PDF TIMING 2026 ─── */
const descargarTimingPDF = () => {
  generarPDF(
    "Por Qué 2026 es el Momento Zero",
    "El Timing Perfecto — 2026",
    "La Ventana Tecnológica (2022-2026)",
    "Justificación del \"Act Two\" de la IA y cómo Dentaxy desarrolló su Core acorde a las predicciones 2026 • dentaxy.com",
    ESTUDIOS_TIMING,
    "#EAB308"
  );
};

/* Slide 4 — CRECIMIENTO */
const Slide4Growth = ({ onShowGrowthTiming, activeYearLog, onShowYearLog }: { onShowGrowthTiming?: () => void, activeYearLog?: string | null, onShowYearLog?: (year: string | null) => void }) => (
  <div style={{ maxWidth: 740, width: "100%", margin: "0 auto", textAlign: "center", display: "flex", flexDirection: "column" }}>
    <GlassCard glow="yellow" style={{ padding: "30px 38px", display: "flex", flexDirection: "column" }}>
      <motion.div {...a(0)}><Tag color="#EAB308">Crecimiento Exponencial</Tag><H1 center>Software Vivo:{" "}<span style={{ color: "#EAB308", textShadow: "0 0 20px #EAB30888" }}>2022–2026</span></H1></motion.div>

      <motion.div {...a(0.25)} style={{ marginTop: 12 }}>
        <p style={{ fontFamily: "'Inter'", fontWeight: 200, fontSize: "clamp(12px, 1.7vw, 15px)", color: "rgba(255,255,255,0.85)", lineHeight: 1.6, textAlign: "justify", paddingBottom: 6 }}>
          "Construimos esta arquitectura en sincronía exacta con la explosión de la Inteligencia Artificial. No estamos persiguiendo una tendencia de 2026; pasamos los últimos 4 años construyendo la pista de aterrizaje."
        </p>
      </motion.div>

      <motion.div {...a(0.4)} style={{ margin: "4px 0 16px" }}><LineChartExponencial activeNode={activeYearLog} onNodeClick={(y) => onShowYearLog?.(activeYearLog === y ? null : y)} /></motion.div>

      {/* Zona Inferior: Accordion de Historial vs Botón de Timing 2026 */}
      <AnimatePresence mode="wait">
        {activeYearLog && DATOS_HISTORIAL[activeYearLog] ? (
          <motion.div
            key="accordion-log"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            style={{ overflow: "hidden", textAlign: "left" }}
          >
            <div style={{ padding: "14px 18px", borderRadius: 16, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(234,179,8,0.25)", marginTop: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#EAB308", fontFamily: "'Space Grotesk'" }}>
                  — Log de Avances: {activeYearLog}
                </span>
                <button onClick={() => onShowYearLog?.(null)} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 6, border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: 4, display: 'flex' }}>
                  <X size={14} />
                </button>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
                {DATOS_HISTORIAL[activeYearLog].map((log, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <CheckCircle2 size={12} color="#10B981" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontFamily: "'Inter'", lineHeight: 1.4, fontWeight: 300 }}>{log}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="footer-timing"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}
          >
            <div className="glass" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#EAB308", boxShadow: "0 0 8px #EAB308", flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: "'Inter'", fontWeight: 300 }}>
                "El Momento Zero: Madurez Tecnológica."
              </p>
            </div>

            <motion.button
              onClick={onShowGrowthTiming}
              whileHover={{ scale: 1.04, boxShadow: "0 0 28px rgba(234,179,8,0.45)" }}
              whileTap={{ scale: 0.96 }}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "11px 20px", borderRadius: 100,
                border: "1px solid rgba(234,179,8,0.5)",
                background: "rgba(234,179,8,0.1)",
                color: "#FDE047", fontSize: 11.5, fontWeight: 700,
                fontFamily: "'Space Grotesk'", letterSpacing: "0.08em",
                cursor: "pointer", transition: "all 0.2s",
              }}>
              <Zap size={13} style={{ flexShrink: 0 }} />
              EL TIMING PERFECTO: 2026
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  </div>
);

/* Slide 5 — AUTORIDAD */
const Slide5Authority = () => (
  <div style={{ maxWidth: "min(860px,95vw)", width: "100%" }}>
    <motion.div {...a(0)} style={{ textAlign: "center", marginBottom: 28 }}>
      <Tag color="#EC4899">Respaldo Global</Tag>
      <H1 center>Líderes mundiales{" "}<span style={{ color: "#EC4899", textShadow: "0 0 20px #EC489988" }}>confirman la dirección</span></H1>
    </motion.div>
    <div className="pres-grid-2">
      {[
        { name: "Sam Altman", role: "CEO, OpenAI", init: "SA", color: "#6366F1", quote: "La IA será un multiplicador de la capacidad humana." },
        { name: "Jensen Huang", role: "CEO, NVIDIA", init: "JH", color: "#A855F7", quote: "Estamos en el inicio de una nueva revolución industrial." }
      ].map((p, i) => (
        <motion.div key={i} {...a(0.2 + i * 0.15)} whileHover={{ y: -4 }} className="glass-heavy"
          style={{ padding: "clamp(16px,2vw,28px)", position: "relative", boxShadow: `0 12px 40px rgba(0,0,0,0.4), 0 0 30px ${p.color}15` }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${p.color},transparent)` }} />
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${p.color}33,${p.color}11)`, border: `1.5px solid ${p.color}66`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 0 16px ${p.color}44` }}>
              <span style={{ color: p.color, fontWeight: 700, fontSize: 13, fontFamily: "'Syne'", textShadow: `0 0 8px ${p.color}` }}>{p.init}</span>
            </div>
            <div>
              <p style={{ fontWeight: 600, color: "white", fontSize: 14, fontFamily: "'Space Grotesk'" }}>{p.name}</p>
              <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)", fontFamily: "'Space Grotesk'" }}>{p.role}</p>
            </div>
          </div>
          <p style={{ fontFamily: "'Inter'", fontWeight: 300, fontSize: "clamp(12px,1.5vw,15.5px)", color: "rgba(255,255,255,0.75)", lineHeight: 1.8 }}>"{p.quote}"</p>
        </motion.div>
      ))}
    </div>
  </div>
);

/* Slide 6 — ECOSISTEMA */
const Slide6Ecosystem = ({ onExplorarHub }: { onExplorarHub?: () => void }) => (
  <GlassCard glow="green">
    <motion.div {...a(0)}><Tag color="#10B981">Ecosistema</Tag><H1>El Universo <span style={{ color: "#10B981", textShadow: "0 0 20px #10B98188" }}>Dentaxy</span></H1></motion.div>
    <div className="pres-grid-2" style={{ alignItems: "center", marginTop: 18 }}>
      <motion.div {...a(0.2)}><NodeDiagram /></motion.div>
      <motion.div {...a(0.35)}>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.85, marginBottom: 20, fontFamily: "'Inter'", fontWeight: 300 }}>Estructuras planificadas por IA analizando conductas reales de aprendizaje clínico.</p>
        <motion.div whileHover={{ scale: 1.02 }} className="glass" style={{ padding: "16px 18px", display: "flex", gap: 12, alignItems: "flex-start", border: "1px solid rgba(16,185,129,0.2)", marginBottom: 20 }}>
          <div style={{ padding: 8, background: "rgba(16,185,129,0.15)", borderRadius: 10, border: "1px solid rgba(16,185,129,0.3)", flexShrink: 0 }}>
            <Shield size={16} style={{ color: "#10B981" }} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "white", marginBottom: 5, fontFamily: "'Space Grotesk'" }}>Seguridad Institucional</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, fontFamily: "'Inter'", fontWeight: 300 }}>Arquitectura <span style={{ color: "#10B981", fontWeight: 500 }}>Offline-First</span> & Encriptación de Grado Médico</p>
          </div>
        </motion.div>
        {/* Botón Explorar más */}
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: '0 0 32px rgba(16,185,129,0.45)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onExplorarHub}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 100,
            background: 'linear-gradient(135deg, #10B981, #059669)',
            border: '1px solid rgba(16,185,129,0.4)',
            color: 'white', fontSize: 13, fontWeight: 600,
            fontFamily: "'Space Grotesk'", letterSpacing: '0.08em',
            cursor: 'pointer', boxShadow: '0 0 20px rgba(16,185,129,0.3)',
            width: '100%', justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 15 }}>⚡</span>
          EXPLORAR MÓDULOS
          <span style={{ fontSize: 13, opacity: 0.7 }}>→</span>
        </motion.button>
      </motion.div>
    </div>
  </GlassCard>
);

/* Slide 7 — PERSONALIZACIÓN (tiene estado propio → componente nombrado) */
const Slide7Personalization = () => {
  const [activeSkin, setActiveSkin] = useState(0);
  const skins = [
    { name: "Esmeralda", tag: "Default", bg: "linear-gradient(135deg,#10B981,#059669)", border: "#10B981", glow: "rgba(16,185,129,0.5)", btnBg: "linear-gradient(135deg,#10B981,#059669)", barC: ["#10B981", "#34D399"], label: "#10B981" },
    { name: "Indigo Neon", tag: "Pro", bg: "linear-gradient(135deg,#6366F1,#4F46E5)", border: "#6366F1", glow: "rgba(99,102,241,0.55)", btnBg: "linear-gradient(135deg,#6366F1,#4338CA)", barC: ["#6366F1", "#818CF8"], label: "#818CF8" },
    { name: "Aurora", tag: "Premium", bg: "linear-gradient(135deg,#EC4899,#A855F7)", border: "#EC4899", glow: "rgba(236,72,153,0.5)", btnBg: "linear-gradient(135deg,#EC4899,#A855F7)", barC: ["#EC4899", "#F472B6"], label: "#F472B6" },
    { name: "Cyber Gold", tag: "Elite", bg: "linear-gradient(135deg,#F59E0B,#D97706)", border: "#F59E0B", glow: "rgba(245,158,11,0.5)", btnBg: "linear-gradient(135deg,#F59E0B,#B45309)", barC: ["#F59E0B", "#FCD34D"], label: "#FCD34D" },
    { name: "Void Dark", tag: "Stealth", bg: "linear-gradient(135deg,rgba(255,255,255,0.15),rgba(255,255,255,0.05))", border: "rgba(255,255,255,0.3)", glow: "rgba(255,255,255,0.2)", btnBg: "linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.06))", barC: ["rgba(255,255,255,0.7)", "rgba(255,255,255,0.4)"], label: "rgba(255,255,255,0.7)" },
  ];
  const sk = skins[activeSkin];
  return (
    <GlassCard glow="pink" style={{ maxWidth: 860 }}>
      <motion.div {...a(0)}><Tag color="#EC4899">Personalización</Tag><H1>Identidad y <span style={{ color: "#EC4899", textShadow: "0 0 20px #EC489988" }}>Gamificación</span></H1></motion.div>
      <motion.div {...a(0.15)} style={{ marginTop: 16 }}>
        <div className="glass" style={{ padding: "18px 20px", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 14, fontFamily: "'Space Grotesk'" }}>DENTAXY.com — Skins Preview</p>
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            {skins.map((s, i) => (
              <motion.button key={i} onClick={() => setActiveSkin(i)} whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.95 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: "6px 8px", borderRadius: 12, outline: i === activeSkin ? `1.5px solid ${s.border}` : "1.5px solid transparent", boxShadow: i === activeSkin ? `0 0 14px ${s.glow}` : "none", transition: "all 0.25s ease" }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: s.bg, boxShadow: i === activeSkin ? `0 0 12px ${s.glow}` : "0 2px 8px rgba(0,0,0,0.4)" }} />
                <span style={{ fontSize: 8.5, fontFamily: "'Space Grotesk'", color: i === activeSkin ? s.label : "rgba(255,255,255,0.3)", fontWeight: 500, whiteSpace: "nowrap" }}>{s.name}</span>
              </motion.button>
            ))}
          </div>
          <div style={{ marginBottom: 16 }}>
            {[["Progreso Clínico", 82], ["Retención", 67], ["Evaluaciones", 91]].map(([label, val], i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)", fontFamily: "'Space Grotesk'" }}>{label}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 500, color: "white", fontFamily: "'Space Grotesk'" }}>{val}%</span>
                </div>
                <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                  <motion.div key={`${activeSkin}-${i}`} initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg,${sk.barC[0]},${sk.barC[1]})`, boxShadow: `0 0 8px ${sk.barC[0]}88` }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <motion.button key={activeSkin} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, type: "spring" }}
              whileHover={{ scale: 1.05, boxShadow: `0 0 36px ${sk.glow}` }} whileTap={{ scale: 0.97 }}
              style={{ background: sk.btnBg, border: `1.5px solid ${sk.border}30`, color: "white", borderRadius: 100, padding: "13px 36px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", boxShadow: `0 0 20px ${sk.glow}`, letterSpacing: "0.12em", fontFamily: "'Space Grotesk'", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>⚕</span> GENERAR HISTORIA CLÍNICA
            </motion.button>
          </div>
        </div>
      </motion.div>
    </GlassCard>
  );
};

/* Slide 8 — MOTOR DE SIMULACIÓN CLÍNICA */
const Slide8SimEngine = () => {
  const [open, setOpen] = useState<number | null>(null);

  const cards = [
    {
      icon: '🔒', color: '#10B981', label: 'Privacidad de Grado Clínico',
      preview: 'Procesamiento 100% local. Los datos nunca salen.',
      detail: (
        <div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
            <div style={{ flex: 1, padding: '10px 14px', borderRadius: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
              <p style={{ fontSize: 10, color: '#10B981', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 4, fontFamily: "'Space Grotesk'" }}>DENTAXY ENGINE</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: "'Inter'", fontWeight: 300, lineHeight: 1.6 }}>Procesamiento 100% Local. Datos sensibles nunca salen de la infraestructura de la clínica.</p>
            </div>
            <div style={{ flex: 1, padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p style={{ fontSize: 10, color: '#F87171', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 4, fontFamily: "'Space Grotesk'" }}>IA GENERATIVA</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: "'Inter'", fontWeight: 300, lineHeight: 1.6 }}>Requiere enviar datos a servidores externos (OpenAI/Cloud), aumentando vulnerabilidades y riesgos legales.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: '⚡', color: '#6366F1', label: 'Velocidad "Zero Latency"',
      preview: 'Respuesta en milisegundos vs. 5–15 seg de espera.',
      detail: (
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1, padding: '10px 14px', borderRadius: 10, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)' }}>
            <p style={{ fontSize: 10, color: '#818CF8', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 4, fontFamily: "'Space Grotesk'" }}>SIMULACIÓN ESTRUCTURADA</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: "'Inter'", fontWeight: 300, lineHeight: 1.6 }}>Ejecución instantánea. Al presionar "Generar", la redacción aparece en <strong style={{ color: '#818CF8' }}>milisegundos</strong> sobre estructura lógica ya definida.</p>
          </div>
          <div style={{ flex: 1, padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <p style={{ fontSize: 10, color: '#F87171', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 4, fontFamily: "'Space Grotesk'" }}>IA GENERATIVA</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: "'Inter'", fontWeight: 300, lineHeight: 1.6 }}>Tiempo de espera de <strong style={{ color: '#F87171' }}>5 a 15 segundos</strong> mientras el servidor "piensa" y redacta palabra por palabra.</p>
          </div>
        </div>
      ),
    },
    {
      icon: '💰', color: '#F59E0B', label: 'Costo Operativo: $0 MXN',
      preview: '50,000 notas/mes con IA = $60,000 MXN. Con Dentaxy = $0.',
      detail: (
        <div>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter'", marginBottom: 10 }}>Basado en ~4,000 tokens por nota de 20 apartados</p>
          <div className="pres-table-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5, fontFamily: "'Space Grotesk'", minWidth: 240 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  {['Escala', 'GPT-4o', 'Dentaxy Engine'].map(h => (
                    <th key={h} style={{ padding: '5px 8px', textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: 10 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Por nota', '~$1.20 MXN', '$0.00'],
                  ['1,000 notas/mes', '$1,200 MXN', '$0.00'],
                  ['50,000 notas (UAZ)', '$60,000 MXN', '$0.00'],
                ].map(([label, bad, good], i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '7px 8px', color: 'rgba(255,255,255,0.6)' }}>{label}</td>
                    <td style={{ padding: '7px 8px', color: '#F87171', fontWeight: 600 }}>{bad}</td>
                    <td style={{ padding: '7px 8px', color: '#10B981', fontWeight: 700 }}>{good}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      icon: '🧠', color: '#A855F7', label: 'Simulación vs. IA: Por qué importa',
      preview: 'Margen de error cero. Soberanía tecnológica total.',
      detail: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { icon: '🎯', t: 'Margen de Error Cero', d: 'En medicina, la "creatividad" de la IA es un riesgo. Usamos Árboles de Decisión Deterministas para redacción exacta.' },
            { icon: '🛡️', t: 'Soberanía Tecnológica', d: 'No dependemos de servidores externos ni cambios de precios en APIs extranjeras.' },
            { icon: '⚙️', t: 'Ingeniería Propia', d: 'Transformamos el poder de la IA en precisión quirúrgica — no en un simple generador de texto.' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 12px', borderRadius: 10, background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.18)' }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.9)', fontFamily: "'Space Grotesk'", marginBottom: 2 }}>{item.t}</p>
                <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', fontFamily: "'Inter'", fontWeight: 300, lineHeight: 1.5 }}>{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <GlassCard glow="purple" style={{ maxWidth: 860, padding: '28px 36px' }}>
      {/* Header: pregunta-respuesta */}
      <motion.div {...a(0)} style={{ marginBottom: 20 }}>
        <Tag color="#A855F7">Motor de Simulación Clínica</Tag>
        <div className="glass" style={{ padding: '14px 18px', borderRadius: 18, border: '1px solid rgba(168,85,247,0.2)', marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: "'Space Grotesk'", marginBottom: 6, letterSpacing: '0.06em' }}>❓ PREGUNTA FRECUENTE</p>
          <p style={{ fontSize: 14.5, fontWeight: 500, color: 'rgba(255,255,255,0.85)', fontFamily: "'Inter'", lineHeight: 1.5, marginBottom: 10 }}>
            "¿Entonces Dentaxy es una IA que escribe mis notas?"
          </p>
          <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)', fontFamily: "'Inter'", fontWeight: 300, lineHeight: 1.7 }}>
            <span style={{ color: '#A855F7', fontWeight: 500 }}>No.</span> Es un{' '}
            <span style={{ color: '#C084FC', fontWeight: 600 }}>Motor de Simulación Clínica.</span>{' '}
            Usamos IA de alto nivel para entrenar todos los caminos lógicos del diagnóstico. El resultado:
            precisión quirúrgica, sin errores y a{' '}
            <span style={{ color: '#10B981', fontWeight: 500 }}>fracción del costo</span>{' '}
            de cualquier otra herramienta. Es ingeniería aplicada, no solo generación de texto.
          </p>
        </div>
      </motion.div>

      {/* Cards expandibles */}
      <motion.div {...a(0.15)}>
        <p style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: "'Space Grotesk'", marginBottom: 10 }}>
          Toca una card para ver el detalle →
        </p>
        <div className="pres-grid-2" style={{ gap: 8 }}>
          {cards.map((card, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                layout
                onClick={() => setOpen(isOpen ? null : i)}
                whileHover={{ scale: isOpen ? 1 : 1.02 }}
                style={{
                  borderRadius: 16, cursor: 'pointer', overflow: 'hidden',
                  background: isOpen ? `${card.color}12` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isOpen ? card.color + '40' : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: isOpen ? `0 0 24px ${card.color}22` : 'none',
                  transition: 'background 0.25s, border 0.25s, box-shadow 0.25s',
                  gridColumn: isOpen ? 'span 2' : 'span 1',
                }}
              >
                {/* Header de card */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{card.icon}</span>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: isOpen ? card.color : 'rgba(255,255,255,0.8)', fontFamily: "'Space Grotesk'", transition: 'color 0.2s' }}>{card.label}</p>
                      {!isOpen && <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.35)', fontFamily: "'Inter'", fontWeight: 300, marginTop: 1 }}>{card.preview}</p>}
                    </div>
                  </div>
                  <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}
                    style={{ fontSize: 16, color: isOpen ? card.color : 'rgba(255,255,255,0.2)', fontWeight: 300 }}>+</motion.span>
                </div>
                {/* Detalle expandido */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ padding: '0 14px 14px', overflow: 'hidden' }}
                    >
                      {card.detail}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </GlassCard>
  );
};


/* Slide 9 — UAZ: ALIADO INSTITUCIONAL */
const Slide9UAZ = ({ onCalificar }: { onCalificar?: () => void }) => (
  <GlassCard glow="green" style={{ maxWidth: 860, padding: '28px 36px' }}>
    <motion.div {...a(0)}>
      <Tag color="#10B981">Aliado Institucional</Tag>
      <H1>UAZ: <span style={{ color: '#10B981', textShadow: '0 0 20px #10B98188' }}>Hub de Innovación</span> Dental</H1>
      <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontFamily: "'Space Grotesk'", marginBottom: 18 }}>
        Startup Unicornio en Proceso · Contrato de Excelencia Tecnológica
      </p>
    </motion.div>

    <div className="pres-grid-2" style={{ marginBottom: 14 }}>
      {/* 1. Propuesta Financiera */}
      <motion.div {...a(0.15)} className="glass" style={{ padding: '14px 16px', border: '1px solid rgba(16,185,129,0.2)' }}>
        <p style={{ fontSize: 10, color: '#10B981', fontWeight: 700, letterSpacing: '0.12em', marginBottom: 10, fontFamily: "'Space Grotesk'" }}>1. PROPUESTA FINANCIERA Y LANZAMIENTO</p>
        {[
          ['💰', 'Inversión Institucional', '$3,300,000 MXN (esquema semestral)'],
          ['🟢', 'Implementación 2026', 'Full Access Institucional sin costo'],
          ['📅', 'Operación 2027', 'Licenciamiento semestral (soporte, nube, updates)'],
        ].map(([icon, t, d], i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
            <div>
              <p style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)', fontFamily: "'Space Grotesk'", marginBottom: 1 }}>{t}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter'", fontWeight: 300 }}>{d}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* 2. Ecosistema Evolutivo */}
      <motion.div {...a(0.25)} className="glass" style={{ padding: '14px 16px', border: '1px solid rgba(99,102,241,0.2)' }}>
        <p style={{ fontSize: 10, color: '#818CF8', fontWeight: 700, letterSpacing: '0.12em', marginBottom: 10, fontFamily: "'Space Grotesk'" }}>2. BENEFICIOS DE ECOSISTEMA EVOLUTIVO</p>
        {[
          ['🔧', 'Tecnología Modular', '6 meses de prueba gratuita en cada nueva tecnología Dentaxy.'],
          ['🎓', 'Impacto al Egresado', '50% de descuento en paquete inicial de Dentaxy Seed para alumnos UAZ.'],
        ].map(([icon, t, d], i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
            <div>
              <p style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)', fontFamily: "'Space Grotesk'", marginBottom: 2 }}>{t}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter'", fontWeight: 300, lineHeight: 1.5 }}>{d}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>

    {/* 3. Calificación */}
    <motion.div {...a(0.35)} className="glass" style={{ padding: '14px 18px', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
      <div>
        <p style={{ fontSize: 10, color: '#F59E0B', fontWeight: 700, letterSpacing: '0.12em', marginBottom: 4, fontFamily: "'Space Grotesk'" }}>3. CALIFICACIÓN DEL PROYECTO</p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: "'Inter'", fontWeight: 300 }}>
          Su visión define el estándar de la odontología en México.
        </p>
      </div>
      <motion.button
        whileHover={{ scale: 1.06, boxShadow: '0 0 40px rgba(245,158,11,0.5)' }}
        whileTap={{ scale: 0.97 }}
        onClick={onCalificar}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
          padding: '12px 22px', borderRadius: 100,
          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
          border: 'none', color: 'white',
          fontSize: 13, fontWeight: 700, fontFamily: "'Space Grotesk'",
          letterSpacing: '0.08em', cursor: 'pointer',
          boxShadow: '0 0 24px rgba(245,158,11,0.35)',
        }}
      >
        ⭐ CALIFICAR AQUÍ
      </motion.button>
    </motion.div>
  </GlassCard>
);

/* Slide 10 — RESULTADOS EN TIEMPO REAL */
const Slide10Results = () => {
  const [ratings, setRatings] = useState<{ id: string; name: string; cargo: string; stars: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await (supabase as any)
        .from('uaz_ratings')
        .select('*')
        .order('created_at', { ascending: false });
      setRatings(data || []);
      setLoading(false);
    };
    load();

    const channel = (supabase as any)
      .channel('uaz-ratings-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'uaz_ratings' },
        (payload: any) => {
          setRatings(prev => [payload.new, ...prev]);
        })
      .subscribe();

    return () => { (supabase as any).removeChannel(channel); };
  }, []);

  const avg = ratings.length > 0 ? (ratings.reduce((s, r) => s + r.stars, 0) / ratings.length) : 0;
  const fullStars = (n: number) => '⭐'.repeat(n) + '☆'.repeat(5 - n);

  return (
    <GlassCard glow="purple" style={{ maxWidth: 860, padding: '28px 36px' }}>
      <motion.div {...a(0)} style={{ textAlign: 'center', marginBottom: 20 }}>
        <Tag color="#A855F7">Resultados en Tiempo Real</Tag>
        <H1 center>DENTAXY <span style={{ color: '#10B981' }}>×</span> UAZ:<br />
          <span style={{ fontSize: 'clamp(16px,2vw,26px)', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>El Futuro en Tiempo Real</span>
        </H1>
      </motion.div>

      {/* Promedio */}
      <motion.div {...a(0.1)} style={{ textAlign: 'center', marginBottom: 22 }}>
        <div className="glass" style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '14px 28px', border: '1px solid rgba(168,85,247,0.25)' }}>
          <div>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: "'Space Grotesk'", marginBottom: 3 }}>Promedio de Aceptación</p>
            <p style={{ fontSize: 32, lineHeight: 1 }}>{ratings.length > 0 ? fullStars(Math.round(avg)) : '☆☆☆☆☆'}</p>
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: avg >= 4 ? '#10B981' : '#F59E0B', fontFamily: "'Syne'" }}>{ratings.length > 0 ? avg.toFixed(1) : '—'}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: "'Space Grotesk'" }}>{ratings.length} voto{ratings.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </motion.div>

      {/* Tabla */}
      <motion.div {...a(0.2)} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="pres-table-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Space Grotesk'", minWidth: 420 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
                {['Autoridad / Directivo', 'Cargo', 'Calificación', 'Validación'].map(h => (
                  <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 9.5, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Cargando...</td></tr>
              )}
              {!loading && ratings.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '24px', textAlign: 'center' }}>
                    <p style={{ fontSize: 28, marginBottom: 8 }}>☆</p>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontFamily: "'Inter'", fontWeight: 300 }}>Las calificaciones aparecerán aquí en tiempo real</p>
                  </td>
                </tr>
              )}
              {ratings.map((r, i) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <td style={{ padding: '10px 14px', fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{r.name}</td>
                  <td style={{ padding: '10px 14px', fontSize: 11.5, color: 'rgba(255,255,255,0.45)' }}>{r.cargo}</td>
                  <td style={{ padding: '10px 14px', fontSize: 14 }}>{fullStars(r.stars)}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10.5, fontWeight: 600, color: r.stars >= 4 ? '#10B981' : '#F59E0B', background: r.stars >= 4 ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', border: `1px solid ${r.stars >= 4 ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`, borderRadius: 20, padding: '3px 10px' }}>
                      {r.stars >= 4 ? '✓ Proyecto Validado' : '○ En revisión'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </GlassCard>
  );
};

/* ─── ARRAY DE SLIDES (componentes nombrados, sin hooks inline) ─── */
const SLIDES = [
  Slide0Cover,
  Slide1Problem,
  Slide2Validation,
  Slide3Accelerator,
  Slide4Growth,
  Slide5Authority,
  Slide6Ecosystem,
  Slide7Personalization,
  Slide8SimEngine,
  Slide9UAZ,
  Slide10Results,
];

/* ─── COMPONENTE RAÍZ ─── */
export default function DentaxyPresentation() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [k, setK] = useState(0);
  const [manualMode, setManualMode] = useState(false);
  const [showAIDemo, setShowAIDemo] = useState(false);
  const [showRecognition, setShowRecognition] = useState(false);
  const [showStudios, setShowStudios] = useState(false);
  const [showAcceleratorStudios, setShowAcceleratorStudios] = useState(false);
  const [showGrowthTiming, setShowGrowthTiming] = useState(false);
  const [activeYearLog, setActiveYearLog] = useState<string | null>(null);
  const [showHubInvite, setShowHubInvite] = useState(false);
  // ⭐ Modal de calificación UAZ
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingName, setRatingName] = useState('');
  const [ratingCargo, setRatingCargo] = useState('');
  const [ratingStars, setRatingStars] = useState(0);
  const [ratingHover, setRatingHover] = useState(0);
  const [ratingSending, setRatingSending] = useState(false);
  const [ratingSent, setRatingSent] = useState(false);
  const TOTAL = SLIDES.length;

  // Ref para que goTo siempre lea el idx actual (evita stale closures en Realtime)
  const idxRef = useRef(idx);
  useEffect(() => { idxRef.current = idx; }, [idx]);

  const go = (d: number) => {
    const cur = idxRef.current;
    const next = Math.max(0, Math.min(TOTAL - 1, cur + d));
    if (next === cur) return;
    setShowAIDemo(false); setShowRecognition(false); setShowStudios(false); setShowAcceleratorStudios(false); setShowGrowthTiming(false); setActiveYearLog(null);
    setDir(d); setIdx(next); setK(p => p + 1);
  };

  const goTo = (target: number) => {
    const clamped = Math.max(0, Math.min(TOTAL - 1, target));
    const cur = idxRef.current;
    if (clamped === cur) return;
    setShowAIDemo(false); setShowRecognition(false); setShowStudios(false); setShowAcceleratorStudios(false); setShowGrowthTiming(false); setActiveYearLog(null);
    setDir(clamped > cur ? 1 : -1);
    setIdx(clamped);
    setK(p => p + 1);
  };

  // Suscripción Realtime: escuchar cambios de slide, manualMode y open_hub desde Supabase
  useEffect(() => {
    // Cargar estado inicial
    const loadState = async () => {
      const { data } = await (supabase as any)
        .from('presentation_state')
        .select('current_slide, manual_mode')
        .eq('id', 1)
        .single();
      if (data) {
        goTo(data.current_slide);
        setManualMode(data.manual_mode);
      }
    };
    loadState();

    // Suscripción Realtime
    const channel = (supabase as any)
      .channel('viewer-sync')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'presentation_state',
      }, (payload: any) => {
        const row = payload.new;
        setManualMode(row.manual_mode);
        if (!row.manual_mode) {
          goTo(row.current_slide);
        }
        // 🛰️ Comando remoto: mostrar invitación para abrir /hub
        if (row.open_hub === true) {
          setShowHubInvite(true);
          // Resetear la bandera en Supabase
          (supabase as any)
            .from('presentation_state')
            .update({ open_hub: false })
            .eq('id', 1)
            .then(() => { });
        }
      })
      .subscribe();

    return () => { (supabase as any).removeChannel(channel); };
  }, []);

  // Keyboard: solo funciona si manualMode está activo
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (!manualMode) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [idx, manualMode]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0, scale: 0.96 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-40%" : "40%", opacity: 0, scale: 0.96 }),
  };

  const SlideContent = SLIDES[idx];

  // Slides 0, 1, 2, 3 y 4 reciben callbacks — los demás no
  const renderSlide = () => {
    if (idx === 0) return <Slide0Cover onExplorar={() => setShowAIDemo(true)} />;
    if (idx === 1) return <Slide1Problem onShowStudios={() => setShowStudios(true)} />;
    if (idx === 2) return <Slide2Validation onShowRecognition={() => setShowRecognition(true)} />;
    if (idx === 3) return <Slide3Accelerator onShowAcceleratorStudios={() => setShowAcceleratorStudios(true)} />;
    if (idx === 4) return <Slide4Growth onShowGrowthTiming={() => setShowGrowthTiming(true)} activeYearLog={activeYearLog} onShowYearLog={(y) => setActiveYearLog(y ?? null)} />;
    if (idx === 6) return <Slide6Ecosystem onExplorarHub={() => window.open('/hub', '_blank')} />;
    if (idx === 9) return <Slide9UAZ onCalificar={() => { setRatingSent(false); setRatingStars(0); setRatingName(''); setRatingCargo(''); setShowRatingModal(true); }} />;
    return <SlideContent />;
  };

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", fontFamily: "'Inter',sans-serif", background: "#030712", position: "relative" }}>
      <FontLoader />
      <Background />

      {/* HEADER */}
      <div style={{ position: "relative", zIndex: 30, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px var(--slide-px)", background: "rgba(3,7,18,0.6)", backdropFilter: "blur(32px)", borderBottom: "1px solid rgba(255,255,255,0.06)", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <DentaxyLogo size={26} />
          <span style={{ fontFamily: "'Space Grotesk'", fontSize: "clamp(11px,1.3vw,13px)", fontWeight: 600, letterSpacing: "0.08em", color: "white" }}>DENTAXY</span>
          <span style={{ fontFamily: "'Space Grotesk'", fontSize: "clamp(11px,1.3vw,13px)", fontWeight: 600, letterSpacing: "0.08em", color: "#6366F1", textShadow: "0 0 8px #6366F1" }}>.com</span>
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "nowrap", overflow: "hidden" }}>
          {Array.from({ length: TOTAL }).map((_, i) => (
            <button key={i} onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); setK(p => p + 1); }}
              className={i !== idx && i > 2 && i < TOTAL - 3 ? "pres-dot-hide" : undefined}
              style={{ height: 5, width: i === idx ? 18 : 5, borderRadius: 3, border: "none", background: i === idx ? "linear-gradient(90deg,#10B981,#6366F1)" : "rgba(255,255,255,0.15)", cursor: "pointer", transition: "all 0.3s ease", padding: 0, boxShadow: i === idx ? "0 0 8px rgba(16,185,129,0.6)" : "none", flexShrink: 0 }} />
          ))}
        </div>
        <span style={{ fontSize: "clamp(9px,1vw,11px)", color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", fontFamily: "'Space Grotesk'", flexShrink: 0 }}>
          {String(idx + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
        </span>
      </div>

      {/* SLIDES */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <AnimatePresence custom={dir} mode="wait">
          <motion.div key={`s-${idx}-${k}`} custom={dir}
            variants={variants} initial="enter" animate="center" exit="exit"
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--slide-py) var(--slide-px)", overflowY: "auto" }}>
            {renderSlide()}
          </motion.div>
        </AnimatePresence>

        {/* Flechas: solo visibles si manualMode === true */}
        <AnimatePresence>
          {manualMode && idx > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => go(-1)} whileHover={{ scale: 1.2, color: "#10B981" }}
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", zIndex: 20, color: "rgba(255,255,255,0.2)", transition: "color 0.2s", padding: 4 }}>
              <ChevronLeft size={48} strokeWidth={1} />
            </motion.button>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {manualMode && idx < TOTAL - 1 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => go(1)} whileHover={{ scale: 1.2, color: "#10B981" }}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", zIndex: 20, color: "rgba(255,255,255,0.2)", transition: "color 0.2s", padding: 4 }}>
              <ChevronRight size={48} strokeWidth={1} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── POPUP: Dentaxy AI Demo ── */}
      <AnimatePresence>
        {showAIDemo && idx === 0 && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setShowAIDemo(false)}
              style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
            />
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              style={{
                position: "fixed", inset: "2vh 2vw", zIndex: 90,
                borderRadius: 24, overflow: "hidden",
                background: "white", boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
                display: "flex", flexDirection: "column",
              }}
            >
              {/* Header del popup */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 20px", borderBottom: "1px solid #F0F0F0", background: "white",
                flexShrink: 0,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, background: "#111",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ color: "#10B981", fontSize: 11, fontWeight: 800 }}>D</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#111", letterSpacing: "-0.01em" }}>Dentaxy AI — Demo en Vivo</span>
                </div>
                <button
                  onClick={() => setShowAIDemo(false)}
                  style={{
                    width: 32, height: 32, borderRadius: 10,
                    border: "1px solid #E5E5E5", background: "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => { (e.target as HTMLElement).style.background = "#F5F5F5"; }}
                  onMouseOut={(e) => { (e.target as HTMLElement).style.background = "white"; }}
                >
                  <X size={16} color="#666" />
                </button>
              </div>
              {/* Contenido: DentaxyFormPanel */}
              <div style={{ flex: 1, overflow: "auto" }}>
                <AnalysisModeProvider>
                  <DentaxyFormPanel />
                </AnalysisModeProvider>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── POPUP: Reconocimiento UAZ ── */}
      <AnimatePresence>
        {showRecognition && idx === 2 && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setShowRecognition(false)}
              style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              style={{
                position: "fixed", inset: 0, zIndex: 90,
                display: "flex", alignItems: "center", justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <div style={{
                width: 380, borderRadius: 20, overflow: "hidden", position: "relative",
                boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(99,102,241,0.2)",
                pointerEvents: "auto", background: "#000",
              }}>
                <button
                  onClick={() => setShowRecognition(false)}
                  style={{
                    position: "absolute", top: 10, right: 10, zIndex: 10,
                    width: 32, height: 32, borderRadius: 10,
                    border: "none", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => { (e.target as HTMLElement).style.background = "rgba(0,0,0,0.8)"; }}
                  onMouseOut={(e) => { (e.target as HTMLElement).style.background = "rgba(0,0,0,0.55)"; }}
                >
                  <X size={16} color="white" />
                </button>
                <img
                  src="/brand/Reconocimiento.webp"
                  alt="Reconocimiento 1er Lugar"
                  style={{ display: "block", width: "100%", height: "auto" }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── POPUP: Estudios Científicos ── */}
      <AnimatePresence>
        {showStudios && idx === 1 && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setShowStudios(false)}
              style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)" }}
            />
            {/* Panel Glassmorf */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
              style={{
                position: "fixed", inset: 0, zIndex: 90,
                display: "flex", alignItems: "center", justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <div style={{
                width: "min(680px, 92vw)",
                maxHeight: "84vh",
                borderRadius: 24,
                background: "rgba(15,15,25,0.82)",
                backdropFilter: "blur(40px)",
                border: "1px solid rgba(168,85,247,0.3)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 80px rgba(168,85,247,0.12), inset 0 1px 0 rgba(255,255,255,0.08)",
                display: "flex", flexDirection: "column",
                overflow: "hidden", pointerEvents: "auto",
              }}>
                {/* Header */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "18px 24px 16px", borderBottom: "1px solid rgba(168,85,247,0.15)",
                  flexShrink: 0,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ padding: 8, background: "rgba(168,85,247,0.15)", borderRadius: 10, border: "1px solid rgba(168,85,247,0.3)" }}>
                      <Shield size={16} style={{ color: "#C084FC" }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#C084FC", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Space Grotesk'" }}>Base Científica</p>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter'" }}>4 estudios internacionales que sustentan el problema</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {/* Btn Descargar PDF */}
                    <motion.button
                      onClick={descargarEstudiosPDF}
                      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "7px 14px", borderRadius: 100,
                        border: "1px solid rgba(16,185,129,0.5)",
                        background: "rgba(16,185,129,0.1)",
                        color: "#34D399", fontSize: 11, fontWeight: 600,
                        fontFamily: "'Space Grotesk'", letterSpacing: "0.06em",
                        cursor: "pointer",
                      }}>
                      <Award size={12} />
                      DESCARGAR PDF
                    </motion.button>
                    <button
                      onClick={() => setShowStudios(false)}
                      style={{
                        width: 32, height: 32, borderRadius: 10,
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "rgba(255,255,255,0.06)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", transition: "all 0.2s",
                      }}
                      onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)"; }}
                      onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
                    >
                      <X size={15} color="rgba(255,255,255,0.6)" />
                    </button>
                  </div>
                </div>

                {/* Estudios — scrollable */}
                <div style={{ overflow: "auto", padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
                  {ESTUDIOS.map((e) => (
                    <div key={e.num} style={{
                      padding: "16px 20px", borderRadius: 16,
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${e.color}33`,
                      borderLeft: `3px solid ${e.color}`,
                    }}>
                      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: e.color, textTransform: "uppercase", fontFamily: "'Space Grotesk'", marginBottom: 5 }}>
                        {e.num} —
                      </p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.92)", fontFamily: "'Syne'", marginBottom: 6, lineHeight: 1.4 }}>
                        {e.titulo}
                      </p>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontFamily: "'Inter'", fontWeight: 300, lineHeight: 1.7, marginBottom: 8 }}>
                        {e.dato}
                      </p>
                      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "'Inter'", fontStyle: "italic", marginBottom: 6 }}>
                        📄 {e.estudio}
                      </p>
                      <a
                        href={e.link} target="_blank" rel="noreferrer"
                        style={{
                          fontSize: 11, color: e.color, fontFamily: "'Space Grotesk'",
                          fontWeight: 600, textDecoration: "none",
                          display: "inline-flex", alignItems: "center", gap: 4,
                        }}
                      >
                        {e.linkLabel} →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── POPUP: Evidencia Científica El Acelerador ── */}
      <AnimatePresence>
        {showAcceleratorStudios && idx === 3 && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setShowAcceleratorStudios(false)}
              style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)" }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
              style={{ position: "fixed", inset: 0, zIndex: 90, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}
            >
              <div style={{
                width: "min(680px, 92vw)", maxHeight: "84vh", borderRadius: 24,
                background: "rgba(10,20,15,0.88)", backdropFilter: "blur(40px)",
                border: "1px solid rgba(16,185,129,0.3)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 80px rgba(16,185,129,0.1), inset 0 1px 0 rgba(255,255,255,0.08)",
                display: "flex", flexDirection: "column", overflow: "hidden", pointerEvents: "auto",
              }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px 16px", borderBottom: "1px solid rgba(16,185,129,0.15)", flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ padding: 8, background: "rgba(16,185,129,0.15)", borderRadius: 10, border: "1px solid rgba(16,185,129,0.3)" }}>
                      <Zap size={16} style={{ color: "#34D399" }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#34D399", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Space Grotesk'" }}>Evidencia Científica</p>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter'" }}>4 estudios que sustentan el modelo Dentaxy para la UAZ</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <motion.button
                      onClick={descargarAceleradorPDF}
                      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 100, border: "1px solid rgba(16,185,129,0.5)", background: "rgba(16,185,129,0.1)", color: "#34D399", fontSize: 11, fontWeight: 600, fontFamily: "'Space Grotesk'", letterSpacing: "0.06em", cursor: "pointer" }}>
                      <Award size={12} />
                      DESCARGAR PDF
                    </motion.button>
                    <button
                      onClick={() => setShowAcceleratorStudios(false)}
                      style={{ width: 32, height: 32, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                      onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)"; }}
                      onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
                    >
                      <X size={15} color="rgba(255,255,255,0.6)" />
                    </button>
                  </div>
                </div>
                {/* Estudios — scrollable */}
                <div style={{ overflow: "auto", padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
                  {ESTUDIOS_ACELERADOR.map((e) => (
                    <div key={e.num} style={{ padding: "16px 20px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: `1px solid ${e.color}33`, borderLeft: `3px solid ${e.color}` }}>
                      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: e.color, textTransform: "uppercase", fontFamily: "'Space Grotesk'", marginBottom: 5 }}>{e.num} —</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.92)", fontFamily: "'Syne'", marginBottom: 6, lineHeight: 1.4 }}>{e.titulo}</p>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontFamily: "'Inter'", fontWeight: 300, lineHeight: 1.7, marginBottom: 8 }}>{e.dato}</p>
                      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "'Inter'", fontStyle: "italic", marginBottom: 6 }}>📄 {e.estudio}</p>
                      <a href={e.link} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: e.color, fontFamily: "'Space Grotesk'", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                        {e.linkLabel} →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── POPUP: Evidencia Científica Timing 2026 ── */}
      <AnimatePresence>
        {showGrowthTiming && idx === 4 && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setShowGrowthTiming(false)}
              style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)" }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
              style={{ position: "fixed", inset: 0, zIndex: 90, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}
            >
              <div style={{
                width: "min(720px, 92vw)", maxHeight: "84vh", borderRadius: 24,
                background: "rgba(10,20,15,0.88)", backdropFilter: "blur(40px)",
                border: "1px solid rgba(234,179,8,0.3)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 80px rgba(234,179,8,0.1), inset 0 1px 0 rgba(255,255,255,0.08)",
                display: "flex", flexDirection: "column", overflow: "hidden", pointerEvents: "auto",
              }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px 16px", borderBottom: "1px solid rgba(234,179,8,0.15)", flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ padding: 8, background: "rgba(234,179,8,0.15)", borderRadius: 10, border: "1px solid rgba(234,179,8,0.3)" }}>
                      <Zap size={16} style={{ color: "#FDE047" }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#FDE047", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Space Grotesk'" }}>El Timing Perfecto</p>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter'" }}>Por qué 2026 es el Momento Zero de adopción en ciencias de salud</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <motion.button
                      onClick={descargarTimingPDF}
                      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 100, border: "1px solid rgba(234,179,8,0.5)", background: "rgba(234,179,8,0.1)", color: "#FDE047", fontSize: 11, fontWeight: 600, fontFamily: "'Space Grotesk'", letterSpacing: "0.06em", cursor: "pointer" }}>
                      <Award size={12} />
                      DESCARGAR PDF
                    </motion.button>
                    <button
                      onClick={() => setShowGrowthTiming(false)}
                      style={{ width: 32, height: 32, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                      onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)"; }}
                      onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
                    >
                      <X size={15} color="rgba(255,255,255,0.6)" />
                    </button>
                  </div>
                </div>
                {/* Estudios — scrollable */}
                <div style={{ overflow: "auto", padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
                  {ESTUDIOS_TIMING.map((e) => (
                    <div key={e.num} style={{ padding: "16px 20px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: `1px solid ${e.color}33`, borderLeft: `3px solid ${e.color}` }}>
                      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: e.color, textTransform: "uppercase", fontFamily: "'Space Grotesk'", marginBottom: 5 }}>{e.num} —</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.92)", fontFamily: "'Syne'", marginBottom: 6, lineHeight: 1.4 }}>{e.titulo}</p>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontFamily: "'Inter'", fontWeight: 300, lineHeight: 1.7, marginBottom: 8 }}>{e.dato}</p>
                      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "'Inter'", fontStyle: "italic", marginBottom: 6 }}>📄 {e.estudio}</p>
                      <a href={e.link} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: e.color, fontFamily: "'Space Grotesk'", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                        {e.linkLabel} →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* ── OVERLAY: Invitación a explorar /hub (activado remotamente por admin) ── */}
      <AnimatePresence>
        {showHubInvite && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(16px)' }}
            />
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 30 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              style={{ position: 'fixed', inset: 0, zIndex: 201, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <div style={{
                textAlign: 'center', padding: '48px 40px', borderRadius: 28,
                background: 'rgba(5,10,20,0.92)', backdropFilter: 'blur(40px)',
                border: '1px solid rgba(16,185,129,0.35)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 100px rgba(16,185,129,0.12), inset 0 1px 0 rgba(255,255,255,0.08)',
                maxWidth: 420, width: '90vw',
              }}>
                {/* Ícono animado */}
                <motion.div
                  animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontSize: 48, marginBottom: 20 }}
                >
                  ⚡
                </motion.div>
                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', color: '#10B981', textTransform: 'uppercase', fontFamily: "'Space Grotesk'", marginBottom: 12 }}>
                  ✦ CONTENIDO DESBLOQUEADO ✦
                </p>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: 'white', lineHeight: 1.2, marginBottom: 10 }}>
                  Explora los Módulos<br />
                  <span style={{ color: '#10B981', textShadow: '0 0 20px #10B98166' }}>Dentaxy</span>
                </h2>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontFamily: "'Inter'", fontWeight: 300, lineHeight: 1.6, marginBottom: 28 }}>
                  La presentación continúa detrás.<br />Pulsa para explorar el ecosistema completo.
                </p>
                {/* CTA principal */}
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 48px rgba(16,185,129,0.5)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { window.open('/hub', '_blank'); setShowHubInvite(false); }}
                  style={{
                    width: '100%', padding: '16px 24px', borderRadius: 100,
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    border: 'none', color: 'white',
                    fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk'",
                    letterSpacing: '0.08em', cursor: 'pointer',
                    boxShadow: '0 0 30px rgba(16,185,129,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    marginBottom: 12,
                  }}
                >
                  <span>🚀</span> ABRIR MÓDULOS
                </motion.button>
                {/* Cerrar */}
                <button
                  onClick={() => setShowHubInvite(false)}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: "'Inter'", cursor: 'pointer', padding: '4px 12px' }}
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* \u2b50 MODAL: Calificar Proyecto UAZ */}
      <AnimatePresence>
        {showRatingModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => !ratingSending && setShowRatingModal(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 24 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              style={{ position: 'fixed', inset: 0, zIndex: 201, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}
            >
              <div style={{
                width: 'min(420px, 92vw)', borderRadius: 24, padding: '32px 28px',
                background: 'rgba(5,10,20,0.95)', backdropFilter: 'blur(40px)',
                border: '1px solid rgba(245,158,11,0.3)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 80px rgba(245,158,11,0.1)',
                pointerEvents: 'auto',
              }}>
                {ratingSent ? (
                  /* Estado de éxito */
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 48, marginBottom: 14 }}>✅</p>
                    <p style={{ fontSize: 18, fontWeight: 700, color: 'white', fontFamily: "'Syne'", marginBottom: 8 }}>¡Calificación Registrada!</p>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter'", fontWeight: 300, marginBottom: 20 }}>
                      Tu voto aparecerá en la diapositiva de resultados en tiempo real.
                    </p>
                    <button
                      onClick={() => setShowRatingModal(false)}
                      style={{ padding: '10px 28px', borderRadius: 100, background: 'linear-gradient(135deg, #F59E0B, #D97706)', border: 'none', color: 'white', fontSize: 13, fontWeight: 600, fontFamily: "'Space Grotesk'", cursor: 'pointer' }}
                    >
                      Cerrar
                    </button>
                  </motion.div>
                ) : (
                  /* Formulario */
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                      <div>
                        <p style={{ fontSize: 10, color: '#F59E0B', fontWeight: 700, letterSpacing: '0.16em', fontFamily: "'Space Grotesk'" }}>CALIFICACIÓN DEL PROYECTO</p>
                        <p style={{ fontSize: 18, fontWeight: 800, color: 'white', fontFamily: "'Syne'" }}>Dentaxy × UAZ</p>
                      </div>
                      <button onClick={() => setShowRatingModal(false)} style={{ width: 32, height: 32, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>✕</button>
                    </div>

                    {/* Estrellas */}
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: "'Space Grotesk'", marginBottom: 10 }}>Selecciona tu calificación</p>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                        {[1, 2, 3, 4, 5].map(s => (
                          <motion.button
                            key={s}
                            whileHover={{ scale: 1.3 }}
                            whileTap={{ scale: 0.9 }}
                            onMouseEnter={() => setRatingHover(s)}
                            onMouseLeave={() => setRatingHover(0)}
                            onClick={() => setRatingStars(s)}
                            style={{ background: 'none', border: 'none', fontSize: 32, cursor: 'pointer', filter: (ratingHover || ratingStars) >= s ? 'drop-shadow(0 0 8px #F59E0B)' : 'grayscale(1) opacity(0.3)', transition: 'filter 0.15s' }}
                          >
                            ⭐
                          </motion.button>
                        ))}
                      </div>
                      {ratingStars > 0 && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 11, color: '#F59E0B', fontFamily: "'Space Grotesk'", marginTop: 6 }}>
                          {['', 'Necesita mejoras', 'Aceptable', 'Bueno', 'Muy bueno', 'Proyecto Validado ✓'][ratingStars]}
                        </motion.p>
                      )}
                    </div>

                    {/* Campos */}
                    {[
                      { label: 'Nombre completo *', val: ratingName, set: setRatingName, ph: 'Dr. Nombre Apellido' },
                      { label: 'Cargo / Institución', val: ratingCargo, set: setRatingCargo, ph: 'Director, UAZ' },
                    ].map(f => (
                      <div key={f.label} style={{ marginBottom: 12 }}>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: "'Space Grotesk'", marginBottom: 5, letterSpacing: '0.08em' }}>{f.label}</p>
                        <input
                          value={f.val}
                          onChange={e => f.set(e.target.value)}
                          placeholder={f.ph}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 13, fontFamily: "'Inter'", outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>
                    ))}

                    {/* Botón enviar */}
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={async () => {
                        if (!ratingName.trim() || ratingStars === 0) return;
                        setRatingSending(true);
                        await (supabase as any).from('uaz_ratings').insert([{ name: ratingName.trim(), cargo: ratingCargo.trim(), stars: ratingStars }]);
                        setRatingSending(false);
                        setRatingSent(true);
                      }}
                      disabled={!ratingName.trim() || ratingStars === 0 || ratingSending}
                      style={{
                        width: '100%', padding: '14px', borderRadius: 100, marginTop: 8,
                        background: (!ratingName.trim() || ratingStars === 0) ? 'rgba(255,255,255,0.07)' : 'linear-gradient(135deg, #F59E0B, #D97706)',
                        border: 'none', color: (!ratingName.trim() || ratingStars === 0) ? 'rgba(255,255,255,0.3)' : 'white',
                        fontSize: 13, fontWeight: 700, fontFamily: "'Space Grotesk'",
                        letterSpacing: '0.08em', cursor: (!ratingName.trim() || ratingStars === 0) ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {ratingSending ? 'Enviando...' : '⭐ ENVIAR CALIFICACIÓN'}
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
