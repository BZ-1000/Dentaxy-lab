import React, { useState } from 'react';
import { MessageSquare, ChevronDown, ChevronRight } from 'lucide-react';

interface Collaborator {
    id: string;
    name: string;
    role: string;
    status: 'active' | 'working' | 'offline';
    initials: string;
    color: string;
    project: string;
}

interface ChatMessage {
    id: string;
    author: string;
    text: string;
    time: string;
}

const COLLABORATORS: Collaborator[] = [
    { id: 'c1', name: 'Dr. Bernardo Z.', role: 'CEO & Dev Lead', status: 'active', initials: 'BZ', color: '#00D4FF', project: 'Labs' },
    { id: 'c2', name: 'AIDA-7', role: 'Creative Director AI', status: 'active', initials: 'A7', color: '#A78BFA', project: 'Shop' },
    { id: 'c3', name: 'NEXUS-01', role: 'Strategic Planner AI', status: 'working', initials: 'N1', color: '#4ADE80', project: 'Seed' },
    { id: 'c4', name: 'SYNTAX-9', role: 'Legal & Docs AI', status: 'working', initials: 'S9', color: '#60A5FA', project: 'Labs' },
    { id: 'c5', name: 'CYPHER-CORE', role: 'Security & Backend AI', status: 'active', initials: 'CC', color: '#FF6B35', project: 'Labs' },
];

const THREADS: Record<string, ChatMessage[]> = {
    Seed: [
        { id: '1', author: 'NEXUS-01', text: 'Misión UAZ: presentación programada para el 15 de marzo. ¿Confirmamos agenda?', time: '10:32' },
        { id: '2', author: 'Dr. Bernardo Z.', text: 'Confirmado. Preparar demo de historia clínica completa.', time: '10:45' },
    ],
    Shop: [
        { id: '3', author: 'AIDA-7', text: 'Propuesta de banner nuevo para landing de Shop lista en Figma.', time: '09:12' },
        { id: '4', author: 'Dr. Bernardo Z.', text: 'Perfecto, aplicamos después de revisar el copy.', time: '09:40' },
    ],
    Labs: [
        { id: '5', author: 'CYPHER-CORE', text: 'Servidor principal estable. Latencia promedio 12ms en último ciclo.', time: 'Ayer' },
        { id: '6', author: 'SYNTAX-9', text: 'Contratos CROID listos para firma digital. Enviado por email.', time: '08:00' },
    ],
};

const STATUS_CONFIG = {
    active: { label: 'En sesión', color: '#4ADE80', dot: '#4ADE80' },
    working: { label: 'En el laboratorio', color: '#FFD700', dot: '#FFD700' },
    offline: { label: 'Offline', color: '#4B5563', dot: '#4B5563' },
};

export const AtrioColaboracion: React.FC = () => {
    const [openThread, setOpenThread] = useState<string | null>('Seed');

    return (
        <div className="h-full overflow-y-auto p-5 flex flex-col gap-5 text-white">
            {/* Collaborators */}
            <div>
                <h3 className="text-xs font-bold text-white/40 tracking-widest mb-3">EQUIPO ACTIVO</h3>
                <div className="flex flex-col gap-2">
                    {COLLABORATORS.map(c => {
                        const sc = STATUS_CONFIG[c.status];
                        return (
                            <div
                                key={c.id}
                                className="rounded-xl px-3 py-2.5 flex items-center gap-3"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                            >
                                {/* Avatar */}
                                <div
                                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                                    style={{ background: `${c.color}20`, color: c.color, border: `1px solid ${c.color}30` }}
                                >
                                    {c.initials}
                                </div>
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-white/85 truncate">{c.name}</div>
                                    <div className="text-[10px] text-white/35 truncate">{c.role}</div>
                                </div>
                                {/* Status badge */}
                                <div className="shrink-0 flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot, boxShadow: `0 0 5px ${sc.dot}` }} />
                                    <span className="text-[10px]" style={{ color: sc.color }}>{sc.label}</span>
                                </div>
                                {/* Project tag */}
                                <div
                                    className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                    style={{ background: `${c.color}15`, color: c.color }}
                                >
                                    {c.project}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Chat Threads */}
            <div>
                <h3 className="text-xs font-bold text-white/40 tracking-widest mb-3">HILOS DE PROYECTO</h3>
                <div className="flex flex-col gap-2">
                    {Object.entries(THREADS).map(([project, messages]) => {
                        const isOpen = openThread === project;
                        return (
                            <div
                                key={project}
                                className="rounded-xl overflow-hidden"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                            >
                                {/* Thread header */}
                                <button
                                    className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-white/[0.02] transition-colors"
                                    onClick={() => setOpenThread(isOpen ? null : project)}
                                >
                                    <MessageSquare size={13} className="text-white/30" />
                                    <span className="flex-1 text-left text-sm font-semibold text-white/70">#{project}</span>
                                    <span className="text-[10px] text-white/30">{messages.length} mensajes</span>
                                    {isOpen ? <ChevronDown size={13} className="text-white/30" /> : <ChevronRight size={13} className="text-white/30" />}
                                </button>

                                {/* Messages */}
                                {isOpen && (
                                    <div className="px-3 pb-3 flex flex-col gap-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                                        {messages.map(msg => {
                                            const collab = COLLABORATORS.find(c => c.name === msg.author);
                                            return (
                                                <div key={msg.id} className="flex items-start gap-2 pt-2">
                                                    {collab && (
                                                        <div
                                                            className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5"
                                                            style={{ background: `${collab.color}20`, color: collab.color }}
                                                        >
                                                            {collab.initials}
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-[11px] font-bold" style={{ color: collab?.color || '#fff' }}>{msg.author}</span>
                                                            <span className="text-[10px] text-white/25">{msg.time}</span>
                                                        </div>
                                                        <p className="text-[11px] text-white/60 mt-0.5">{msg.text}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {/* New message stub */}
                                        <div className="mt-1">
                                            <div className="rounded-lg px-3 py-1.5 text-[11px] text-white/20" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                                Escribe un mensaje en #{project}...
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
