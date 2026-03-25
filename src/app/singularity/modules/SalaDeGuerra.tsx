import React from 'react';
import { useSingularityStore, Mission } from '../store/useSingularityStore';
import { Star, CheckCircle2, Circle, Zap, TrendingUp, DollarSign, Users } from 'lucide-react';

const PRIORITY_CONFIG = {
    legendary: { label: 'Legendario', color: '#FFD700', bg: 'rgba(255,215,0,0.1)', glow: '0 0 12px rgba(255,215,0,0.3)' },
    high: { label: 'Prioritario', color: '#FF6B35', bg: 'rgba(255,107,53,0.1)', glow: 'none' },
    normal: { label: 'Normal', color: '#A0AEC0', bg: 'rgba(160,174,192,0.08)', glow: 'none' },
};

const AGENT_COLOR: Record<Mission['agent'], string> = {
    'NEXUS-01': '#4ADE80',
    'AIDA-7': '#A78BFA',
    'SYNTAX-9': '#60A5FA',
    'CYPHER-CORE': '#00D4FF',
};

const STATS = [
    { icon: <DollarSign size={14} />, label: 'MRR', value: '$48,000', sub: 'MXN', color: '#4ADE80' },
    { icon: <TrendingUp size={14} />, label: 'ARR Proyectado', value: '$576K', sub: 'MXN', color: '#60A5FA' },
    { icon: <Users size={14} />, label: 'Clientes Activos', value: '3', sub: 'Dentistas', color: '#A78BFA' },
    { icon: <Zap size={14} />, label: 'XP Esta semana', value: '+1,240', sub: 'puntos', color: '#FFD700' },
];

export const SalaDeGuerra: React.FC = () => {
    const { missions, toggleMissionStatus, theme } = useSingularityStore();

    const totalXP = missions.filter(m => m.completed).reduce((sum, m) => sum + m.xp, 0);
    const legendaryCount = missions.filter(m => m.priority === 'legendary' && !m.completed).length;

    return (
        <div className="h-full overflow-y-auto p-5 flex flex-col gap-5 text-white">
            {/* Header stat strip */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {STATS.map((s, i) => (
                    <div
                        key={i}
                        className="rounded-xl p-3 flex flex-col gap-1"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                        <div className="flex items-center gap-1.5" style={{ color: s.color }}>
                            {s.icon}
                            <span className="text-[10px] font-semibold tracking-wide opacity-70">{s.label}</span>
                        </div>
                        <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
                        <div className="text-[10px] text-white/30">{s.sub}</div>
                    </div>
                ))}
            </div>

            {/* XP Progress */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white/60">XP Completado en misiones activas</span>
                    <span className="text-sm font-bold" style={{ color: theme === 'legendary' ? '#FFD700' : '#00D4FF' }}>{totalXP.toLocaleString()} XP</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${Math.min((totalXP / 2000) * 100, 100)}%`,
                            background: theme === 'legendary'
                                ? 'linear-gradient(90deg,#FFD700,#FF8C00)'
                                : 'linear-gradient(90deg,#00D4FF,#A78BFA)',
                        }}
                    />
                </div>
            </div>

            {/* Missions */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-white/80">Misiones Activas</h3>
                    {legendaryCount > 0 && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)' }}>
                            <Star size={10} style={{ color: '#FFD700' }} />
                            <span className="text-[10px] font-bold" style={{ color: '#FFD700' }}>{legendaryCount} Legendaria{legendaryCount !== 1 ? 's' : ''}</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    {missions.map(mission => {
                        const pc = PRIORITY_CONFIG[mission.priority];
                        return (
                            <div
                                key={mission.id}
                                className="rounded-xl p-3 flex items-start gap-3 transition-all duration-200 cursor-pointer hover:bg-white/[0.03]"
                                style={{
                                    background: mission.completed ? 'rgba(255,255,255,0.02)' : pc.bg,
                                    border: `1px solid ${mission.completed ? 'rgba(255,255,255,0.05)' : `${pc.color}25`}`,
                                    boxShadow: !mission.completed && mission.priority === 'legendary' ? pc.glow : 'none',
                                    opacity: mission.completed ? 0.5 : 1,
                                }}
                                onClick={() => toggleMissionStatus(mission.id)}
                            >
                                {/* Checkbox */}
                                <div className="shrink-0 mt-0.5" style={{ color: mission.completed ? '#4ADE80' : pc.color }}>
                                    {mission.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className={`text-sm font-semibold ${mission.completed ? 'line-through text-white/30' : 'text-white/90'}`}>
                                            {mission.title}
                                        </span>
                                        {mission.priority === 'legendary' && !mission.completed && (
                                            <Star size={11} style={{ color: '#FFD700' }} />
                                        )}
                                    </div>
                                    <p className="text-[11px] text-white/40 line-clamp-1">{mission.description}</p>
                                </div>

                                {/* Right badges */}
                                <div className="shrink-0 flex flex-col items-end gap-1">
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ color: pc.color, background: `${pc.color}15` }}>
                                        {pc.label}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: AGENT_COLOR[mission.agent] }} />
                                        <span className="text-[10px]" style={{ color: AGENT_COLOR[mission.agent] }}>{mission.agent}</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-white/25">+{mission.xp} XP</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
