import React, { useState } from 'react';
import { useSingularityStore, SingularityTheme } from '../store/useSingularityStore';
import { Palette, Target, FileText, Shield, TrendingUp, ChevronDown, ChevronRight } from 'lucide-react';

interface AgentConfig {
    id: string;
    name: string;
    fullName: string;
    role: string;
    color: string;
    icon: React.ReactNode;
    description: string;
    status: 'online' | 'idle' | 'processing';
}

const AGENTS: AgentConfig[] = [
    {
        id: 'aida7',
        name: 'AIDA-7',
        fullName: 'AIDA-7',
        role: 'Creative Director',
        color: '#A78BFA',
        icon: <Palette size={16} />,
        description: 'Diseño visual, temas dinámicos y branding de Dentaxy.',
        status: 'online',
    },
    {
        id: 'nexus01',
        name: 'NEXUS-01',
        fullName: 'NEXUS-01',
        role: 'Strategic Growth',
        color: '#4ADE80',
        icon: <TrendingUp size={16} />,
        description: 'Gestión de misiones, XP y sincronización de calendarios.',
        status: 'processing',
    },
    {
        id: 'syntax9',
        name: 'SYNTAX-9',
        fullName: 'SYNTAX-9',
        role: 'Institutional Bridge',
        color: '#60A5FA',
        icon: <FileText size={16} />,
        description: 'Generación de contratos y documentos legales locales.',
        status: 'online',
    },
    {
        id: 'cypher',
        name: 'CYPHER-CORE',
        fullName: 'CYPHER-CORE',
        role: 'Security & Backend',
        color: '#FF6B35',
        icon: <Shield size={16} />,
        description: 'Seguridad, acceso al servidor y monitoreo de sistemas.',
        status: 'online',
    },
];

const STATUS_DOT = { online: '#4ADE80', idle: '#FFD700', processing: '#00D4FF' };
const STATUS_LABEL = { online: 'En línea', idle: 'Inactivo', processing: 'Procesando...' };

function AIDA7Panel() {
    const { setTheme, theme } = useSingularityStore();
    const themes: { value: SingularityTheme; label: string; desc: string; dot: string }[] = [
        { value: 'dark', label: 'Dark Apple', desc: 'Base oscura minimalista', dot: '#00D4FF' },
        { value: 'legendary', label: '✦ Legendary', desc: 'Modo CEO dorado épico', dot: '#FFD700' },
        { value: 'cyberpunk', label: 'Cyberpunk', desc: 'Neón magenta extremo', dot: '#FF00FF' },
    ];
    return (
        <div className="flex flex-col gap-2 pt-2">
            <p className="text-[11px] text-white/40">Selecciona el tema del Workspace:</p>
            {themes.map(t => (
                <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all hover:bg-white/[0.05]"
                    style={{
                        background: theme === t.value ? `${t.dot}12` : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${theme === t.value ? `${t.dot}40` : 'rgba(255,255,255,0.07)'}`,
                    }}
                >
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: t.dot, boxShadow: theme === t.value ? `0 0 8px ${t.dot}` : 'none' }} />
                    <div className="flex-1">
                        <div className="text-xs font-semibold text-white/80">{t.label}</div>
                        <div className="text-[10px] text-white/35">{t.desc}</div>
                    </div>
                    {theme === t.value && <span className="text-[10px] text-emerald-400">✓ Activo</span>}
                </button>
            ))}
        </div>
    );
}

function NEXUS01Panel() {
    const { missions } = useSingularityStore();
    const pending = missions.filter(m => !m.completed);
    const totalXP = missions.filter(m => m.completed).reduce((s, m) => s + m.xp, 0);
    return (
        <div className="flex flex-col gap-2 pt-2">
            <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
                    <div className="text-xl font-bold text-emerald-400">{pending.length}</div>
                    <div className="text-[10px] text-white/40">Misiones pendientes</div>
                </div>
                <div className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
                    <div className="text-xl font-bold" style={{ color: '#00D4FF' }}>{totalXP.toLocaleString()}</div>
                    <div className="text-[10px] text-white/40">XP Ganado</div>
                </div>
            </div>
            <p className="text-[11px] text-white/35 pt-1">🗓️ Google Calendar — Sincronización lista cuando configures credenciales OAuth.</p>
        </div>
    );
}

function SYNTAX9Panel() {
    const [type, setType] = useState('Contrato de Servicios');
    const [name, setName] = useState('');
    const [preview, setPreview] = useState('');

    const generate = () => {
        if (!name.trim()) return;
        const today = new Date().toLocaleDateString('es-MX');
        setPreview(
            `DENTAXY TECHNOLOGIES — ${type.toUpperCase()}\n\nFecha: ${today}\n\nLas partes acuerdan: Dentaxy Technologies (proveedor) y ${name} (cliente) establecen los términos del servicio de software de gestión clínica dental. Vigencia: 12 meses renovables. Confidencialidad garantizada por CYPHER-CORE.\n\n[Firma Digital Pendiente]`
        );
    };

    return (
        <div className="flex flex-col gap-2.5 pt-2">
            <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs text-white/80 outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
                <option>Contrato de Servicios</option>
                <option>NDA / Confidencialidad</option>
                <option>Propuesta Comercial</option>
                <option>Carta Convenio UAZ</option>
            </select>
            <input
                placeholder="Nombre del cliente / institución"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs text-white/80 placeholder-white/25 outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <button
                onClick={generate}
                className="w-full py-2 rounded-lg text-xs font-bold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#60A5FA,#A78BFA)' }}
            >
                Generar Documento
            </button>
            {preview && (
                <pre className="text-[10px] text-white/50 whitespace-pre-wrap rounded-lg p-3 leading-relaxed" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    {preview}
                </pre>
            )}
        </div>
    );
}

function CYPHERPanel() {
    const [firewall, setFirewall] = useState(true);
    const events = [
        { time: '10:44', action: 'Login exitoso', user: 'admin@dentaxy.com' },
        { time: '09:22', action: 'PDF generado', user: 'paciente-123' },
        { time: 'Ayer', action: 'Deploy Vercel', user: 'GitHub Actions' },
    ];
    return (
        <div className="flex flex-col gap-2.5 pt-2">
            <div className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)' }}>
                <span className="text-xs font-semibold text-white/70">Firewall Activo</span>
                <button
                    onClick={() => setFirewall(!firewall)}
                    className="w-10 h-5 rounded-full relative transition-all"
                    style={{ background: firewall ? '#4ADE80' : 'rgba(255,255,255,0.15)' }}
                >
                    <span
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm"
                        style={{ left: firewall ? '22px' : '2px' }}
                    />
                </button>
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-[10px] text-white/35 mb-1">Últimos accesos</p>
                {events.map((ev, i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5 border-b text-[11px]" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                        <span className="font-mono text-white/25 w-14 shrink-0">{ev.time}</span>
                        <span className="text-white/60 flex-1">{ev.action}</span>
                        <span style={{ color: '#FF6B35' }}>{ev.user}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

const AGENT_PANELS: Record<string, React.FC> = {
    aida7: AIDA7Panel,
    nexus01: NEXUS01Panel,
    syntax9: SYNTAX9Panel,
    cypher: CYPHERPanel,
};

export const AgentesModule: React.FC = () => {
    const [expanded, setExpanded] = useState<string | null>('aida7');

    return (
        <div className="h-full overflow-y-auto p-5 flex flex-col gap-3 text-white">
            <p className="text-[11px] text-white/30 pb-1">Los agentes Gemas operan localmente — sin APIs externas, sin costos, con privacidad total.</p>

            {AGENTS.map(agent => {
                const isOpen = expanded === agent.id;
                const Panel = AGENT_PANELS[agent.id];
                return (
                    <div
                        key={agent.id}
                        className="rounded-2xl overflow-hidden transition-all"
                        style={{
                            background: isOpen ? `${agent.color}08` : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${isOpen ? `${agent.color}30` : 'rgba(255,255,255,0.07)'}`,
                            boxShadow: isOpen ? `0 0 20px ${agent.color}15` : 'none',
                        }}
                    >
                        {/* Agent header */}
                        <button
                            className="w-full flex items-center gap-3 px-4 py-3 text-left"
                            onClick={() => setExpanded(isOpen ? null : agent.id)}
                        >
                            <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: `${agent.color}18`, color: agent.color, border: `1px solid ${agent.color}30` }}
                            >
                                {agent.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold" style={{ color: agent.color }}>{agent.name}</span>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_DOT[agent.status], boxShadow: `0 0 4px ${STATUS_DOT[agent.status]}` }} />
                                        <span className="text-[10px]" style={{ color: STATUS_DOT[agent.status] }}>{STATUS_LABEL[agent.status]}</span>
                                    </div>
                                </div>
                                <div className="text-[11px] text-white/35">{agent.role} · {agent.description}</div>
                            </div>
                            {isOpen ? <ChevronDown size={14} className="text-white/30 shrink-0" /> : <ChevronRight size={14} className="text-white/30 shrink-0" />}
                        </button>

                        {/* Expanded panel */}
                        {isOpen && (
                            <div className="px-4 pb-4 border-t" style={{ borderColor: `${agent.color}18` }}>
                                <Panel />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
