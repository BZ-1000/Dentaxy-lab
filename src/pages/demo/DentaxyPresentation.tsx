import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Award, Shield, Zap, X, CheckCircle2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { AnalysisModeProvider } from '@/contexts/AnalysisModeContext';
import { DentaxyFormPanel } from '@/components/academico/DentaxyFormPanel';

/* ─── FONTS ─── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Grotesk:wght@400;500;600&family=Inter:wght@200;300;400;500&display=swap');
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
  `}</style>
);

/* ─── BACKGROUND ─── */
const Background = () => (
  <div style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% -10%, #0D1F2D 0%, #030712 70%)" }} />
    <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)", top: -100, left: -150, animation: "float1 9s ease-in-out infinite" }} />
    <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)", top: "20%", right: -100, animation: "float2 11s ease-in-out infinite" }} />
    <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)", bottom: -80, left: "30%", animation: "float3 13s ease-in-out infinite" }} />
    <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)", bottom: "10%", right: "10%", animation: "float1 7s ease-in-out infinite reverse" }} />
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
    <motion.div className="glass-heavy" style={{ padding: "36px 42px", maxWidth: 800, width: "100%", boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 80px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.12)`, position: "relative", overflow: "hidden", ...style }}>
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
  const sz = 180, sw = 18;
  const r = (sz / 2) - sw - 2;
  const circ = 2 * Math.PI * r;
  const cx = sz / 2, cy = sz / 2;
  // offset: -90deg en SVG = circ*0.25
  const base = circ * 0.25;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
      <div style={{ position: "relative", width: sz, height: sz }}>
        <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`}>
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
            <span style={{ fontFamily: "'Space Grotesk'", fontSize: 14, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{l}</span>
          </motion.div>
        ))}
        <p style={{
          fontFamily: "'Inter'", fontSize: 12.5, color: "rgba(255,255,255,0.45)",
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
    className="glass" style={{ padding: "22px 18px", textAlign: "center", position: "relative", boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 30px ${color}22` }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    <p style={{ fontSize: 34, fontWeight: 800, fontFamily: "'Syne'", lineHeight: 1, color, textShadow: `0 0 20px ${color}` }}>{number}</p>
    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 6, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Space Grotesk'" }}>{label}</p>
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
    <div style={{ textAlign: "center", maxWidth: 740, position: "relative" }}>
      <motion.div {...a(0.2)} style={{ marginTop: 8 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 0 }}>
          <span style={{ fontFamily: "'Syne'", fontWeight: 800, fontSize: "clamp(36px,6vw,68px)", letterSpacing: "-0.04em", color: "white" }}>DENTAXY</span>
          <span style={{ fontFamily: "'Syne'", fontWeight: 800, fontSize: "clamp(36px,6vw,68px)", letterSpacing: "-0.04em", color: "#6366F1", textShadow: "0 0 20px #6366F1", minWidth: "2ch", display: "inline-block" }}>
            {displayText}
            <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }} style={{ color: "#6366F1", fontWeight: 200 }}>|</motion.span>
          </span>
        </div>
      </motion.div>
      <motion.div {...a(0.32)} style={{ marginTop: 6 }}>
        <p style={{ fontFamily: "'Space Grotesk'", fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em", textTransform: "uppercase" }}>De datos clínicos a decisiones inteligentes</p>
      </motion.div>
      <motion.div {...a(0.44)} style={{ marginTop: 22 }}>
        <h1 style={{ fontFamily: "'Syne'", fontSize: "clamp(22px,4vw,46px)", fontWeight: 800, color: "#F0FDF4", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
          Redefiniendo la{" "}<span style={{ color: "#10B981", textShadow: "0 0 16px #10B98188" }}>Educación Clínica</span>
        </h1>
      </motion.div>
      <motion.div {...a(0.56)} style={{ marginTop: 16 }}>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", fontWeight: 200, lineHeight: 1.8, maxWidth: 500, margin: "0 auto", fontFamily: "'Inter'" }}>
          El primer sistema de IA que convierte la carga administrativa en tiempo de aprendizaje exponencial.
        </p>
      </motion.div>
      <motion.div {...a(0.7)} style={{ marginTop: 36 }}>
        <motion.button whileHover={{ scale: 1.06, boxShadow: "0 0 40px rgba(16,185,129,0.6)" }} whileTap={{ scale: 0.97 }}
          onClick={onExplorar}
          style={{ background: "linear-gradient(135deg,#10B981,#059669)", color: "white", border: "none", borderRadius: 100, padding: "18px 52px", fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 0 20px rgba(16,185,129,0.4)", letterSpacing: "0.12em", fontFamily: "'Space Grotesk'" }}>
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

/* ─── DESCARGA PDF CON BRANDING DENTAXY ─── */
const descargarEstudiosPDF = () => {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<title>Dentaxy — Base Científica del Problema</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Helvetica Neue',Arial,sans-serif;background:#fff;color:#111;padding:48px 56px}
  .header{display:flex;align-items:center;gap:16px;margin-bottom:40px;padding-bottom:24px;border-bottom:2px solid #10B981}
  .logo{width:48px;height:48px;border-radius:12px;overflow:hidden}
  .logo img{width:100%;height:100%;object-fit:cover}
  .brand{display:flex;flex-direction:column}
  .brand-name{font-size:22px;font-weight:800;letter-spacing:-0.03em;color:#111}
  .brand-tag{font-size:10px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#10B981;margin-top:2px}
  h1{font-size:28px;font-weight:800;color:#111;letter-spacing:-0.03em;margin-bottom:8px}
  .subtitle{font-size:13px;color:#666;margin-bottom:36px}
  .estudio{margin-bottom:28px;padding:20px 24px;border-radius:12px;border-left:4px solid #10B981;background:#FAFAFA}
  .estudio-num{font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#10B981;margin-bottom:6px}
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
  <div class="brand"><span class="brand-name">DENTAXY</span><span class="brand-tag">Base Científica — El Problema</span></div>
</div>
<h1>La Crisis Silenciosa del Expediente Clínico</h1>
<p class="subtitle">Evidencia científica que respalda la necesidad de una solución tecnológica en odontología educativa • dentaxy.com</p>
${ESTUDIOS.map(e => `
<div class="estudio" style="border-left-color:${e.color}">
  <div class="estudio-num">${e.num} —</div>
  <div class="estudio-titulo">${e.titulo}</div>
  <div class="estudio-dato">${e.dato}</div>
  <div class="estudio-ref">📄 ${e.estudio}</div>
  <a class="estudio-link" href="${e.link}">${e.linkLabel} →</a>
</div>`).join('')}
<div class="footer">
  <span class="footer-text">© ${new Date().getFullYear()} DENTAXY TECHNOLOGIES — dentaxy.com</span>
  <span class="footer-text">Documento generado el ${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
</div>
</body></html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px';
  document.body.appendChild(iframe);
  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow?.print();
      setTimeout(() => { document.body.removeChild(iframe); URL.revokeObjectURL(url); }, 2000);
    }, 300);
  };
  iframe.src = url;
};

/* Slide 1 — PROBLEMA */
const Slide1Problem = ({ onShowStudios }: { onShowStudios?: () => void }) => (
  <GlassCard glow="purple">
    <motion.div {...a(0)}><Tag color="#A855F7">El Problema</Tag><H1>El <span style={{ color: "#A855F7", textShadow: "0 0 20px #A855F788" }}>Techo de Cristal</span> Clínico</H1></motion.div>
    <motion.div {...a(0.2)} style={{ margin: "24px 0" }}><DonutChart /></motion.div>
    <motion.div {...a(0.45)} style={{ borderLeft: "2px solid #A855F7", background: "rgba(168,85,247,0.05)", borderRadius: "0 12px 12px 0", padding: "16px 16px 16px 20px" }}>
      <p style={{ fontFamily: "'Inter'", fontWeight: 200, fontSize: 17, color: "rgba(255,255,255,0.85)", lineHeight: 1.8 }}>
        "Los alumnos de la UAZ son dentistas, no capturadores de datos."
      </p>
    </motion.div>
    <motion.div {...a(0.58)} style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
      <motion.button
        onClick={onShowStudios}
        whileHover={{ scale: 1.04, boxShadow: "0 0 28px rgba(168,85,247,0.45)" }}
        whileTap={{ scale: 0.96 }}
        style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "10px 22px", borderRadius: 100,
          border: "1px solid rgba(168,85,247,0.5)",
          background: "rgba(168,85,247,0.12)",
          color: "#C084FC", fontSize: 12, fontWeight: 600,
          fontFamily: "'Space Grotesk'", letterSpacing: "0.08em",
          cursor: "pointer", transition: "all 0.2s",
        }}>
        <Shield size={13} style={{ flexShrink: 0 }} />
        VER ESTUDIO CIENTÍFICO
      </motion.button>
    </motion.div>
  </GlassCard>
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
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<title>Dentaxy — Evidencia Científica del Acelerador</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Helvetica Neue',Arial,sans-serif;background:#fff;color:#111;padding:48px 56px}
  .header{display:flex;align-items:center;gap:16px;margin-bottom:40px;padding-bottom:24px;border-bottom:2px solid #10B981}
  .logo{width:48px;height:48px;border-radius:12px;overflow:hidden}
  .logo img{width:100%;height:100%;object-fit:cover}
  .brand{display:flex;flex-direction:column}
  .brand-name{font-size:22px;font-weight:800;letter-spacing:-0.03em;color:#111}
  .brand-tag{font-size:10px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#10B981;margin-top:2px}
  h1{font-size:28px;font-weight:800;color:#111;letter-spacing:-0.03em;margin-bottom:8px}
  .subtitle{font-size:13px;color:#666;margin-bottom:36px}
  .estudio{margin-bottom:28px;padding:20px 24px;border-radius:12px;border-left:4px solid #10B981;background:#FAFAFA}
  .estudio-num{font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#10B981;margin-bottom:6px}
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
  <div class="brand"><span class="brand-name">DENTAXY</span><span class="brand-tag">Evidencia Científica — El Acelerador</span></div>
</div>
<h1>El Acelerador: Por Qué Dentaxy Funciona</h1>
<p class="subtitle">Evidencia científica que respalda el modelo de enseñanza clínica guiada de Dentaxy para la UAZ • dentaxy.com</p>
${ESTUDIOS_ACELERADOR.map(e => `
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
</body></html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px';
  document.body.appendChild(iframe);
  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow?.print();
      setTimeout(() => { document.body.removeChild(iframe); URL.revokeObjectURL(url); }, 2000);
    }, 300);
  };
  iframe.src = url;
};

/* Slide 3 — ACELERADOR */
const Slide3Accelerator = ({ onShowAcceleratorStudios }: { onShowAcceleratorStudios?: () => void }) => (
  <div style={{ maxWidth: 720, textAlign: "center" }}>
    <motion.div {...a(0)}><Tag color="#10B981">El Acelerador</Tag></motion.div>
    <motion.div {...a(0.15)}>
      <div className="glass-heavy" style={{ padding: "44px 48px", marginBottom: 24, position: "relative", boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(16,185,129,0.1)" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,#10B981,transparent)" }} />
        <p style={{ fontFamily: "'Inter'", fontWeight: 200, fontSize: "clamp(16px,2.2vw,22px)", color: "rgba(255,255,255,0.85)", lineHeight: 1.85 }}>
          "Un alumno que jamás ha llenado una historia clínica completa el interrogatorio de{" "}<span style={{ color: "#10B981", fontWeight: 400 }}>8 sistemas fisiológicos</span>{" "}en minutos — donde antes necesitaba{" "}<span style={{ color: "#10B981", fontWeight: 400 }}>horas de plática de inducción</span>{" "}y aún así cometía errores de redacción."
        </p>
        <div style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#10B981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 12px #10B98188" }}>
            <span style={{ fontFamily: "'Syne'", fontSize: 10, fontWeight: 800, color: "white" }}>BZ</span>
          </div>
          <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Space Grotesk'" }}>Braulio Zavala Uribe · Founder & CEO</p>
        </div>
      </div>
    </motion.div>
    <motion.div {...a(0.4)}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
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
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<title>Dentaxy — Por Qué 2026 es el Momento Zero</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Helvetica Neue',Arial,sans-serif;background:#fff;color:#111;padding:48px 56px}
  .header{display:flex;align-items:center;gap:16px;margin-bottom:40px;padding-bottom:24px;border-bottom:2px solid #EAB308}
  .logo{width:48px;height:48px;border-radius:12px;overflow:hidden}
  .logo img{width:100%;height:100%;object-fit:cover}
  .brand{display:flex;flex-direction:column}
  .brand-name{font-size:22px;font-weight:800;letter-spacing:-0.03em;color:#111}
  .brand-tag{font-size:10px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#EAB308;margin-top:2px}
  h1{font-size:28px;font-weight:800;color:#111;letter-spacing:-0.03em;margin-bottom:8px}
  .subtitle{font-size:13px;color:#666;margin-bottom:36px}
  .estudio{margin-bottom:28px;padding:20px 24px;border-radius:12px;border-left:4px solid #EAB308;background:#FAFAFA}
  .estudio-num{font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#EAB308;margin-bottom:6px}
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
  <div class="brand"><span class="brand-name">DENTAXY</span><span class="brand-tag">El Timing Perfecto — 2026</span></div>
</div>
<h1>La Ventana Tecnológica (2022-2026)</h1>
<p class="subtitle">Justificación del "Act Two" de la IA y cómo Dentaxy desarrolló su Core acorde a las predicciones 2026 • dentaxy.com</p>
${ESTUDIOS_TIMING.map(e => `
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
</body></html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px';
  document.body.appendChild(iframe);
  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow?.print();
      setTimeout(() => { document.body.removeChild(iframe); URL.revokeObjectURL(url); }, 2000);
    }, 300);
  };
  iframe.src = url;
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
  <div style={{ maxWidth: 800, width: "100%" }}>
    <motion.div {...a(0)} style={{ textAlign: "center", marginBottom: 28 }}>
      <Tag color="#EC4899">Respaldo Global</Tag>
      <H1 center>Líderes mundiales{" "}<span style={{ color: "#EC4899", textShadow: "0 0 20px #EC489988" }}>confirman la dirección</span></H1>
    </motion.div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {[
        { name: "Sam Altman", role: "CEO, OpenAI", init: "SA", color: "#6366F1", quote: "La IA será un multiplicador de la capacidad humana." },
        { name: "Jensen Huang", role: "CEO, NVIDIA", init: "JH", color: "#A855F7", quote: "Estamos en el inicio de una nueva revolución industrial." }
      ].map((p, i) => (
        <motion.div key={i} {...a(0.2 + i * 0.15)} whileHover={{ y: -4 }} className="glass-heavy"
          style={{ padding: 28, position: "relative", boxShadow: `0 12px 40px rgba(0,0,0,0.4), 0 0 30px ${p.color}15` }}>
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
          <p style={{ fontFamily: "'Inter'", fontWeight: 300, fontSize: 15.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.8 }}>"{p.quote}"</p>
        </motion.div>
      ))}
    </div>
  </div>
);

/* Slide 6 — ECOSISTEMA */
const Slide6Ecosystem = ({ onExplorarHub }: { onExplorarHub?: () => void }) => (
  <GlassCard glow="green">
    <motion.div {...a(0)}><Tag color="#10B981">Ecosistema</Tag><H1>El Universo <span style={{ color: "#10B981", textShadow: "0 0 20px #10B98188" }}>Dentaxy</span></H1></motion.div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center", marginTop: 18 }}>
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
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5, fontFamily: "'Space Grotesk'" }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
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


/* Slide 9 — CIERRE */
const Slide9Closing = () => (
  <div style={{ maxWidth: 700, textAlign: "center" }}>
    <motion.div {...a(0)}>
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
        <DentaxyLogo size={68} />
      </motion.div>
    </motion.div>
    <motion.div {...a(0.15)} style={{ marginTop: 20 }}>
      <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.2em", color: "#10B981", textTransform: "uppercase", marginBottom: 16, fontFamily: "'Space Grotesk'", textShadow: "0 0 8px #10B98188" }}>✦ Startup Unicornio en Proceso · Contrato de Excelencia 3M ✦</p>
      <h1 style={{ fontFamily: "'Syne'", fontSize: "clamp(24px,4vw,48px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.08, marginBottom: 14 }}>
        <span style={{ color: "white" }}>UAZ: </span><span className="shimmer-text">Socio Fundador</span><br />
        <span style={{ color: "rgba(255,255,255,0.85)" }}>y Hub de Innovación Dental de México</span>
      </h1>
      <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, maxWidth: 440, margin: "0 auto 36px", fontFamily: "'Inter'", fontWeight: 200 }}>
        Si no firman hoy, pierden la oportunidad de ser los arquitectos de la odontología del futuro.
      </p>
    </motion.div>
    <motion.div {...a(0.38)}>
      <motion.button whileHover={{ scale: 1.06, boxShadow: "0 0 60px rgba(16,185,129,0.7)" }} whileTap={{ scale: 0.97 }}
        style={{ background: "linear-gradient(135deg,#10B981,#059669)", color: "white", border: "none", borderRadius: 100, padding: "20px 58px", fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 0 30px rgba(16,185,129,0.5)", letterSpacing: "0.12em", fontFamily: "'Space Grotesk'" }}>
        IMPLEMENTAR EN UAZ
      </motion.button>
    </motion.div>
    <motion.div {...a(0.55)} style={{ marginTop: 28 }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
        {[["🔒", "Seguridad Médica", "#10B981"], ["🏆", "1er Lugar UAZ", "#6366F1"], ["🚀", "IA Clínica Activa", "#A855F7"]].map(([icon, t, c], i) => (
          <motion.div key={i} whileHover={{ y: -2 }} className="glass" style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", boxShadow: `0 0 16px ${c}22` }}>
            <span style={{ fontSize: 14 }}>{icon}</span>
            <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)", fontFamily: "'Space Grotesk'" }}>{t}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
);

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
  Slide9Closing,
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
    return <SlideContent />;
  };

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", fontFamily: "'Inter',sans-serif", background: "#030712", position: "relative" }}>
      <FontLoader />
      <Background />

      {/* HEADER */}
      <div style={{ position: "relative", zIndex: 30, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 36px", background: "rgba(3,7,18,0.6)", backdropFilter: "blur(32px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <DentaxyLogo size={30} />
          <span style={{ fontFamily: "'Space Grotesk'", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", color: "white" }}>DENTAXY</span>
          <span style={{ fontFamily: "'Space Grotesk'", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", color: "#6366F1", textShadow: "0 0 8px #6366F1" }}>.com</span>
        </div>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {Array.from({ length: TOTAL }).map((_, i) => (
            <button key={i} onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); setK(p => p + 1); }}
              style={{ height: 6, width: i === idx ? 22 : 6, borderRadius: 3, border: "none", background: i === idx ? "linear-gradient(90deg,#10B981,#6366F1)" : "rgba(255,255,255,0.15)", cursor: "pointer", transition: "all 0.3s ease", padding: 0, boxShadow: i === idx ? "0 0 8px rgba(16,185,129,0.6)" : "none" }} />
          ))}
        </div>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", fontFamily: "'Space Grotesk'" }}>
          {String(idx + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
        </span>
      </div>

      {/* SLIDES */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <AnimatePresence custom={dir} mode="wait">
          <motion.div key={`s-${idx}-${k}`} custom={dir}
            variants={variants} initial="enter" animate="center" exit="exit"
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", padding: "28px 80px" }}>
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

    </div>
  );
}
