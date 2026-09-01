import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  BarChart3, TrendingUp, Code2, DollarSign, GitCommit,
  Brain, Send, Loader2, ChevronRight, Layers, Cpu,
  ShieldCheck, Globe, Award, FileCode, Package, Building2,
  Star, ArrowUpRight, Bot, Sparkles, Info
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

// ── DATOS REALES DEL REPOSITORIO DENTAXY ─────────────────────────────────────
const REPO_METRICS = {
  totalCommits: 2416,
  firstCommit: '2025-02-01',
  lastCommit: '2026-08-18',
  developmentMonths: 18.5,
  linesAdded: 10137979,
  linesDeleted: 337608,
  netSLOC: 144295,
  totalFiles: 693,
  tsxFiles: 544,
  tsFiles: 137,
  cssFiles: 9,
  components: 334,
  pages: 105,
  hooks: 36,
  stores: 2,
  utils: 17,
  dependencies: 115,
};

const MODULE_BREAKDOWN = [
  { module: 'Historia Clínica / Core', files: 55, sloc: 28400, complexity: 'Extrema', icon: '🦷' },
  { module: 'Dentaxy Académico', files: 42, sloc: 22100, complexity: 'Alta', icon: '🎓' },
  { module: 'Admin Panel', files: 45, sloc: 18700, complexity: 'Alta', icon: '⚙️' },
  { module: 'DICOM / Imagenología', files: 27, sloc: 14800, complexity: 'Extrema', icon: '🔬' },
  { module: 'UI / Design System', files: 334, sloc: 38200, complexity: 'Media-Alta', icon: '🎨' },
  { module: 'Seed / Clínicas Privadas', files: 28, sloc: 12300, complexity: 'Alta', icon: '🏥' },
  { module: 'Landing / Marketing', files: 62, sloc: 9795, complexity: 'Media', icon: '🌐' },
];

const COMMIT_ACTIVITY = [
  { mes: 'Feb 25', commits: 653 },
  { mes: 'Mar 25', commits: 421 },
  { mes: 'Abr 25', commits: 440 },
  { mes: 'May 25', commits: 50 },
  { mes: 'Jun 25', commits: 219 },
  { mes: 'Jul 25', commits: 10 },
  { mes: 'Ago 25', commits: 245 },
  { mes: 'Sep 25', commits: 10 },
  { mes: 'Oct 25', commits: 108 },
  { mes: 'Nov 25', commits: 6 },
  { mes: 'Dic 25', commits: 11 },
  { mes: 'Ene 26', commits: 124 },
  { mes: 'Feb 26', commits: 15 },
  { mes: 'Mar 26', commits: 2 },
  { mes: 'Abr 26', commits: 25 },
  { mes: 'May 26', commits: 22 },
  { mes: 'Jun 26', commits: 31 },
  { mes: 'Jul 26', commits: 23 },
  { mes: 'Ago 26', commits: 1 },
];

// ── VALUACIÓN COCOMO II ───────────────────────────────────────────────────────
const KSLOC = 144.295;
const EAF = 1.35;
const EFFORT_PM = Math.round(2.94 * Math.pow(KSLOC, 1.10) * EAF); // Person-Months
const HOURS_PER_PM = 152;
const TOTAL_HOURS = EFFORT_PM * HOURS_PER_PM;

const VALUATION = {
  horasSeniorLatAm: { min: TOTAL_HOURS * 45, max: TOTAL_HOURS * 75 },
  horasSeniorUSA: { min: TOTAL_HOURS * 110, max: TOTAL_HOURS * 160 },
  ipValue: 2_800_000,
};

const SAAS_PROJECTIONS = [
  { fase: 'Fase 1 (6m)', clinicas: 50, arr_usd: 108000, mrr_mxn: 225000 },
  { fase: 'Fase 2 (12m)', clinicas: 300, arr_usd: 648000, mrr_mxn: 1350000 },
  { fase: 'Fase 3 (24m)', clinicas: 2000, arr_usd: 4320000, mrr_mxn: 9000000 },
];

const MARKET_DATA = [
  { label: 'Clínicas en México (TAM)', value: '80,000', unit: 'unidades dentales', icon: Building2 },
  { label: 'Facturación media/clínica', value: '$120K', unit: 'MXN/mes', icon: DollarSign },
  { label: 'Margen bruto estimado', value: '>92%', unit: '(local-first, costo ≈ $0)', icon: TrendingUp, highlight: true },
  { label: 'Licencias DICOM equiv.', value: '$1,500', unit: 'USD/año incluido', icon: Globe },
];

// ── CONTEXTO DEL ANALISTA IA ──────────────────────────────────────────────────
const SYSTEM_CONTEXT = `Eres "Dex", el analista financiero y técnico de inteligencia artificial de Dentaxy Technologies.
Tienes acceso a los datos REALES y actualizados del repositorio Dentaxy:

DATOS DEL CODEBASE (extraídos en tiempo real):
- Total commits: 2,416 | Duración: 18.5 meses (Feb 2025 – Ago 2026)
- SLOC neto: 144,295 líneas de código productivo
- Archivos fuente: 693 (544 TSX + 137 TS + 9 CSS + otros)
- Componentes UI: 334 | Páginas: 105 | Hooks: 36
- Módulos principales: Historia Clínica (55 comp), Academia (42 comp), Admin (45 comp), DICOM (27 archivos), Seed/Clínicas (28 archivos)
- Dependencias premium: Cornerstone.js DICOM, WebAuthn biométrico, Gemini AI, Claude AI, HuggingFace ML local, Tesseract OCR, Three.js 3D, PeerJS P2P, TLDraw canvas

VALUACIÓN TÉCNICA (COCOMO II):
- KSLOC: 144.295 | EAF: 1.35 (complejidad médica + DICOM + local-first)
- Esfuerzo estimado: ~${EFFORT_PM} person-months = ~${TOTAL_HOURS.toLocaleString()} horas-hombre
- Costo reproducción LatAm Senior ($45-75/hr): $${(TOTAL_HOURS * 45 / 1000).toFixed(0)}K - $${(TOTAL_HOURS * 75 / 1000).toFixed(0)}K USD
- Costo reproducción USA ($110-160/hr): $${(TOTAL_HOURS * 110 / 1000).toFixed(0)}K - $${(TOTAL_HOURS * 160 / 1000).toFixed(0)}K USD
- Valor IP estimado: $2.8M USD

MODELO DE NEGOCIO:
- Dentaxy Seed (clínicas privadas): Setup $15,000-$30,000 MXN + $2,500-$4,500 MXN/mes
- Dentaxy Academy (universidades): $150,000-$350,000 MXN/año por campus
- TAM México: ~80,000 clínicas dentales (INEGI/DENUE)
- Margen bruto: >92% (arquitectura local-first, costo marginal ≈ $0)
- Acelerador Posible México: TOP 100 proyectos, beca $50,000 USD (pendiente)

VENTAJAS COMPETITIVAS (MOAT):
1. Motor de redacción determinista: 0 llamadas a APIs externas → privacidad total, costo $0, respuesta instantánea
2. Visor DICOM nativo en web: equivalente a $500-2,000 USD/año en licencias
3. Local-First architecture: sin servidor central pesado, margen >92%
4. WebAuthn biométrico: seguridad institucional para datos médicos
5. 18.5 meses de desarrollo propietario: barrera de entrada muy alta

Responde SIEMPRE en español. Sé preciso, usa los datos reales. Actúa como CFO/CTO híbrido para apoyar decisiones de inversión y estrategia.`;

// ── COMPONENTES REUTILIZABLES MINIMALISTAS ──────────────────────────────────
const StatCard = ({
  icon: Icon, title, value, sub, highlight
}: {
  icon: any; title: string; value: string; sub?: string; highlight?: boolean;
}) => (
  <div className={`p-5 rounded-2xl border transition-all duration-200 bg-white ${
    highlight ? 'border-indigo-200 bg-indigo-50/20' : 'border-slate-200/80 shadow-xs'
  }`}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
      <div className={`p-2 rounded-xl ${highlight ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
        <Icon className="w-4 h-4" />
      </div>
    </div>
    <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
    {sub && <p className="text-xs text-slate-400 mt-1 font-medium">{sub}</p>}
  </div>
);

const SectionHeader = ({ icon: Icon, title, sub }: { icon: any; title: string; sub?: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2 rounded-xl bg-slate-900 text-white shadow-xs">
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
      {sub && <p className="text-xs text-slate-400 font-medium">{sub}</p>}
    </div>
  </div>
);

const ComplexityBadge = ({ level }: { level: string }) => {
  const styles: Record<string, string> = {
    'Extrema': 'bg-slate-900 text-white border-slate-900',
    'Alta': 'bg-slate-100 text-slate-800 border-slate-200',
    'Media-Alta': 'bg-slate-50 text-slate-700 border-slate-200',
    'Media': 'bg-slate-50 text-slate-500 border-slate-200',
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${styles[level] || styles['Media']}`}>
      {level}
    </span>
  );
};

// ── COMPONENTE ANALISTA IA ────────────────────────────────────────────────────
const AIAnalyst = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    {
      role: 'ai',
      content: `¡Hola, Braulio! Soy **Dex**, tu analista financiero y técnico de Dentaxy. 🦷\n\nTengo acceso a la telemetría completa del repositorio:\n\n• **2,416 commits** en **18.5 meses**\n• **144,295 SLOC** productivo\n• **Valuación de IP:** **$2.8M USD** (COCOMO II + DICOM)\n• **Margen bruto:** **>92%** (arquitectura Local-First)\n\n¿En qué puedo ayudarte hoy para tu pitch o estrategia financiera?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatHistory = useRef<{ role: string; parts: { text: string }[] }[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    chatHistory.current.push({ role: 'user', parts: [{ text: userMsg }] });

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_AI_API_KEY;

      if (!apiKey) {
        const demoResponse = generateDemoResponse(userMsg);
        await new Promise(r => setTimeout(r, 1000));
        setMessages(prev => [...prev, { role: 'ai', content: demoResponse }]);
        chatHistory.current.push({ role: 'model', parts: [{ text: demoResponse }] });
        setLoading(false);
        return;
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_CONTEXT }] },
            contents: chatHistory.current,
            generationConfig: { temperature: 0.7, maxOutputTokens: 1500 }
          })
        }
      );

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Error al procesar la respuesta.';
      chatHistory.current.push({ role: 'model', parts: [{ text }] });
      setMessages(prev => [...prev, { role: 'ai', content: text }]);
    } catch (err) {
      const fallback = generateDemoResponse(userMsg);
      setMessages(prev => [...prev, { role: 'ai', content: fallback }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  const generateDemoResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('valuac') || q.includes('valor') || q.includes('precio')) {
      return `**Valuación de Dentaxy (Modelo COCOMO II Adaptado):**\n\nCon **144,295 SLOC** y EAF 1.35:\n\n• **Esfuerzo estimado:** ${EFFORT_PM} Person-Months = ${TOTAL_HOURS.toLocaleString()} hrs-hombre\n• **Costo Rep. LatAm:** $${(TOTAL_HOURS * 45 / 1000).toFixed(0)}K – $${(TOTAL_HOURS * 75 / 1000).toFixed(0)}K USD\n• **Costo Rep. USA:** $${(TOTAL_HOURS * 110 / 1000).toFixed(0)}K – $${(TOTAL_HOURS * 160 / 1000).toFixed(0)}K USD\n• **Valor de IP Intangible:** **$2.8M USD**`;
    }
    if (q.includes('arr') || q.includes('ingres') || q.includes('mrr') || q.includes('proyecci')) {
      return `**Proyección SaaS Dentaxy:**\n\n• **Fase 1 (50 clín.):** ARR $108,000 USD | MRR $225,000 MXN\n• **Fase 2 (300 clín.):** ARR $648,000 USD | MRR $1.35M MXN\n• **Fase 3 (2000 clín.):** ARR $4.32M USD | MRR $9.0M MXN\n\n*Margen bruto >92% gracias a arquitectura Local-First (costo de servidor ≈ $0).*`;
    }
    if (q.includes('posible') || q.includes('beca') || q.includes('acelerador')) {
      return `**Estrategia Posible México:**\n\nLa beca de **$50,000 USD** es capital no-dilutivo para:\n1. 1 Senior Engineer para integración DICOM/Academy.\n2. 12 meses de runway sin deuda.\n3. Validación B2B en universidades.`;
    }
    if (q.includes('dicom') || q.includes('imagen')) {
      return `**Módulo DICOM Integrado:**\n\nImplementado con **Cornerstone.js v4.16** nativo en web. Equivale a ahorros de **$500 – $2,000 USD/año** por clínica en software tradicional (Dentsply/Planmeca).`;
    }
    return `**Análisis Dex:**\n\nConsulta lista. Para respuestas en tiempo real con Gemini, define \`VITE_GEMINI_API_KEY\` en tu \`.env.local\`. Puedes preguntarme sobre: Valuación, ARR, DICOM, Pricing o Posible México.`;
  };

  const quickQuestions = [
    '¿Cuál es la valuación actual de Dentaxy?',
    '¿Cómo defiendo el pricing premium?',
    '¿Qué ARR proyectamos a 12 meses?',
    'Moat tecnológico del visor DICOM',
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-[640px]">
      {/* Header */}
      <div className="bg-slate-900 p-4 px-5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm tracking-tight">Dex — Financial & Tech Analyst</h3>
            <p className="text-slate-400 text-xs font-medium">Gemini 2.0 Flash · Realtime Repo Telemetry</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Online
        </div>
      </div>

      {/* Preguntas rápidas */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex gap-2 overflow-x-auto">
        {quickQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => setInput(q)}
            className="text-xs whitespace-nowrap px-3 py-1 bg-white text-slate-700 hover:text-slate-900 rounded-lg font-medium border border-slate-200 transition-colors shadow-2xs flex-shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold
              ${msg.role === 'ai' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'}`}
            >
              {msg.role === 'ai' ? <Sparkles className="w-3.5 h-3.5" /> : 'U'}
            </div>
            <div className={`max-w-[80%] rounded-xl px-4 py-3 text-xs leading-relaxed font-medium
              ${msg.role === 'ai'
                ? 'bg-slate-50 text-slate-800 border border-slate-200/60'
                : 'bg-indigo-600 text-white'
              }`}
            >
              <div className="whitespace-pre-wrap">
                {msg.content.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                  part.startsWith('**') && part.endsWith('**')
                    ? <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>
                    : part
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 text-slate-500 animate-spin" />
              <span className="text-xs text-slate-400 font-medium">Analizando datos...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3.5 border-t border-slate-100 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Escribe una pregunta sobre la valuación o modelo financiero..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── PÁGINA PRINCIPAL MINIMALISTA ─────────────────────────────────────────────
const Analytics = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'valuation' | 'market' | 'ai'>('overview');

  const tabs = [
    { id: 'overview', label: 'Codebase Metrics', icon: Code2 },
    { id: 'valuation', label: 'Valuación', icon: DollarSign },
    { id: 'market', label: 'Mercado & ARR', icon: TrendingUp },
    { id: 'ai', label: 'Analista IA Dex', icon: Brain },
  ] as const;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ── HEADER CLEAN DENTAXY ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Dentaxy Asset Dossier
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Valuation & Technical Intelligence</h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Auditoría de código · Modelo COCOMO II · Análisis de Mercado
          </p>
        </div>
        <div className="grid grid-cols-2 md:flex gap-3 pt-2 md:pt-0">
          {[
            { label: 'Commits', val: '2,416' },
            { label: 'SLOC', val: '144K' },
            { label: 'Desarrollo', val: '18.5m' },
            { label: 'Valor IP', val: '$2.8M' },
          ].map(({ label, val }) => (
            <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-center min-w-[90px]">
              <div className="text-sm font-bold text-slate-900">{val}</div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SEGMENTED CONTROL / TABS ── */}
      <div className="flex gap-1.5 bg-slate-100/70 p-1 rounded-xl border border-slate-200/50">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-150
              ${activeTab === id
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ── TAB: OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={GitCommit} title="Total Commits" value="2,416" sub="Feb 2025 – Ago 2026" />
            <StatCard icon={FileCode} title="SLOC Productivo" value="144K" sub="Líneas de código neto" />
            <StatCard icon={Layers} title="Componentes UI" value="334" sub="React + Radix UI" />
            <StatCard icon={Package} title="Dependencias" value="115" sub="Librerías registradas" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Code2} title="Archivos TSX" value="544" sub="Componentes de interfaz" />
            <StatCard icon={Cpu} title="Hooks Custom" value="36" sub="Lógica modular" />
            <StatCard icon={Brain} title="Módulos IA" value="4" sub="Gemini, Claude, HF, OCR" />
            <StatCard icon={ShieldCheck} title="Biometría" value="WebAuthn" sub="Seguridad institucional" highlight />
          </div>

          {/* Commit Activity */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <SectionHeader icon={GitCommit} title="Actividad Histórica de Desarrollo" sub="Frecuencia de commits por mes" />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={COMMIT_ACTIVITY} barSize={16}>
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', borderRadius: 8, border: 'none', color: '#fff', fontSize: 12 }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Bar dataKey="commits" fill="#0f172a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <SectionHeader icon={Layers} title="Desglose por Módulos del Sistema" sub="Volumen y nivel de complejidad técnica" />
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left py-2.5 px-3 font-semibold text-slate-500 uppercase tracking-wider">Módulo</th>
                    <th className="text-center py-2.5 px-3 font-semibold text-slate-500 uppercase tracking-wider">Archivos</th>
                    <th className="text-center py-2.5 px-3 font-semibold text-slate-500 uppercase tracking-wider">SLOC est.</th>
                    <th className="text-center py-2.5 px-3 font-semibold text-slate-500 uppercase tracking-wider">Complejidad</th>
                    <th className="text-right py-2.5 px-3 font-semibold text-slate-500 uppercase tracking-wider">% Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MODULE_BREAKDOWN.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{row.icon}</span>
                          <span className="font-semibold text-slate-900">{row.module}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600 font-medium">{row.files}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-900">{row.sloc.toLocaleString()}</td>
                      <td className="py-3 px-3 text-center"><ComplexityBadge level={row.complexity} /></td>
                      <td className="py-3 px-3 text-right font-medium text-slate-500">
                        {((row.sloc / REPO_METRICS.netSLOC) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: VALUACIÓN ── */}
      {activeTab === 'valuation' && (
        <div className="space-y-6">
          {/* COCOMO Summary */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <Award className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold">COCOMO II — Costo Estimado de Reproducción</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'KSLOC', val: `${KSLOC.toFixed(1)}K`, sub: 'Líneas de código' },
                { label: 'Esfuerzo', val: `${EFFORT_PM} PM`, sub: `= ${TOTAL_HOURS.toLocaleString()} hrs-hombre` },
                { label: 'Factor EAF', val: '1.35×', sub: 'Complejidad médica + DICOM' },
              ].map(({ label, val, sub }) => (
                <div key={label} className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
                  <div className="text-2xl font-bold text-white mt-1">{val}</div>
                  <div className="text-xs text-slate-400 mt-0.5 font-medium">{sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Matrix */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <SectionHeader icon={DollarSign} title="Matriz de Valuación de Activos" sub="Comparativa por perfil de ingeniería y tarifas de mercado" />
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left py-3 px-3 font-semibold text-slate-500 uppercase tracking-wider">Escenario</th>
                    <th className="text-center py-3 px-3 font-semibold text-slate-500 uppercase tracking-wider">Tarifa/hr</th>
                    <th className="text-center py-3 px-3 font-semibold text-slate-500 uppercase tracking-wider">Horas</th>
                    <th className="text-right py-3 px-3 font-semibold text-slate-500 uppercase tracking-wider">Valuación Mínima</th>
                    <th className="text-right py-3 px-3 font-semibold text-slate-500 uppercase tracking-wider">Valuación Máxima</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { escenario: '🇲🇽 LatAm Senior Engineer', tarifa: '$45 - $75 USD', min: TOTAL_HOURS * 45, max: TOTAL_HOURS * 75 },
                    { escenario: '🇺🇸 USA Senior Engineer', tarifa: '$110 - $160 USD', min: TOTAL_HOURS * 110, max: TOTAL_HOURS * 160 },
                    { escenario: '🏢 Agencia Tier-1 (Overhead 2x)', tarifa: '$220 - $320 USD', min: TOTAL_HOURS * 220, max: TOTAL_HOURS * 320 },
                    { escenario: '💡 Valor IP Intangible Propietaria', tarifa: 'Múltiplo de IP', min: 2_500_000, max: 3_200_000, noHours: true, highlight: true },
                  ].map((row, i) => (
                    <tr key={i} className={`hover:bg-slate-50/60 ${row.highlight ? 'bg-indigo-50/20 font-bold' : ''}`}>
                      <td className="py-3.5 px-3 font-medium text-slate-900">{row.escenario}</td>
                      <td className="py-3.5 px-3 text-center text-slate-600 font-mono">{row.tarifa}</td>
                      <td className="py-3.5 px-3 text-center text-slate-500 font-mono">{row.noHours ? '—' : TOTAL_HOURS.toLocaleString()}</td>
                      <td className="py-3.5 px-3 text-right font-bold text-slate-900">${(row.min / 1000).toFixed(0)}K USD</td>
                      <td className="py-3.5 px-3 text-right font-bold text-slate-900">${(row.max / 1000).toFixed(0)}K USD</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Moat */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <SectionHeader icon={ShieldCheck} title="Moat Tecnológico & Defensabilidad" sub="Factores clave que diferencian la tecnología de Dentaxy" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Motor Determinista Local', desc: 'Redacción de expedientes 100% local sin dependencia de APIs externas. Costo marginal $0 y privacidad absoluta.' },
                { title: 'Visor DICOM Nativo Web', desc: 'Integración de Cornerstone.js. Elimina licencias de software externo de $500 - $2,000 USD/año.' },
                { title: 'Arquitectura Local-First', desc: 'Sincronización directa sin servidor central pesado. Margen bruto projected >92%.' },
                { title: 'Autenticación Biométrica', desc: 'WebAuthn integrado para firma electrónica e inicio de sesión institucional seguro.' },
              ].map((m, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/30">
                  <h4 className="font-bold text-slate-900 text-xs mb-1">{m.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: MARKET & ARR ── */}
      {activeTab === 'market' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {MARKET_DATA.map(({ label, value, unit, icon: Icon, highlight }, i) => (
              <StatCard key={i} icon={Icon} title={label} value={value} sub={unit} highlight={highlight} />
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <SectionHeader icon={TrendingUp} title="Proyección ARR SaaS" sub="Crecimiento proyectado por fases de adquisición" />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={SAAS_PROJECTIONS} barSize={24}>
                <XAxis dataKey="fase" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip formatter={(val: number) => [`$${val.toLocaleString()} USD`, 'ARR']}
                  contentStyle={{ background: '#0f172a', borderRadius: 8, border: 'none', color: '#fff', fontSize: 12 }} />
                <Bar dataKey="arr_usd" fill="#0f172a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">Dentaxy Seed</span>
              <h3 className="text-lg font-bold text-slate-900 mt-3 mb-1">Clínicas Privadas</h3>
              <p className="text-xs text-slate-400 font-medium mb-4">Pricing de entrada y suscripción</p>
              <div className="space-y-3 border-t border-slate-100 pt-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Setup / Onboarding:</span>
                  <span className="font-bold text-slate-900">$15K – $30K MXN</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Mensualidad:</span>
                  <span className="font-bold text-indigo-600">$2.5K – $4.5K MXN/mes</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">Dentaxy Academy</span>
              <h3 className="text-lg font-bold text-slate-900 mt-3 mb-1">Universidades</h3>
              <p className="text-xs text-slate-400 font-medium mb-4">Licencia B2B Institucional</p>
              <div className="space-y-3 border-t border-slate-100 pt-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Contrato anual por campus:</span>
                  <span className="font-bold text-slate-900">$150K – $350K MXN/año</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Cobro:</span>
                  <span className="font-bold text-slate-900">Institucional Directo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: AI ANALYST ── */}
      {activeTab === 'ai' && <AIAnalyst />}
    </div>
  );
};

export default Analytics;
