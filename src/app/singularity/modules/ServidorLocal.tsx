import React, { useState, useEffect } from 'react';
import { Activity, HardDrive, ShieldCheck, CreditCard, RefreshCw } from 'lucide-react';

function useUptime() {
    const [uptime, setUptime] = useState(99.97);
    useEffect(() => {
        const t = setInterval(() => {
            setUptime(prev => Math.max(99.90, Math.min(100, prev + (Math.random() - 0.5) * 0.01)));
        }, 5000);
        return () => clearInterval(t);
    }, []);
    return uptime.toFixed(2);
}

const SERVICES = [
    { name: 'Dentaxy Core', status: 'online', latency: '12ms', icon: '⚡' },
    { name: 'Dentaxy Seed', status: 'online', latency: '18ms', icon: '🌱' },
    { name: 'Dentaxy Shop', status: 'standby', latency: '45ms', icon: '🛍️' },
    { name: 'Supabase DB', status: 'online', latency: '8ms', icon: '🗄️' },
    { name: 'Auth Gateway', status: 'online', latency: '5ms', icon: '🔐' },
    { name: 'PDF Engine', status: 'online', latency: '23ms', icon: '📄' },
];

const STORAGE = [
    { label: 'Base de datos', used: 1.2, total: 10, color: '#00D4FF' },
    { label: 'Archivos médicos', used: 3.8, total: 50, color: '#4ADE80' },
    { label: 'Logs del sistema', used: 0.6, total: 5, color: '#A78BFA' },
];

const SUBSCRIPTIONS = [
    { clinic: 'Clínica CROID', plan: 'Pro', amount: 1200, status: 'active' },
    { clinic: 'UAZ Laboratorio', plan: 'Seed', amount: 800, status: 'active' },
    { clinic: 'Mexident Durango', plan: 'Basic', amount: 600, status: 'trial' },
];

export const ServidorLocal: React.FC = () => {
    const uptime = useUptime();

    return (
        <div className="h-full overflow-y-auto p-5 flex flex-col gap-5 text-white">
            {/* Uptime banner */}
            <div
                className="rounded-xl px-4 py-3 flex items-center gap-3"
                style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}
            >
                <ShieldCheck size={18} style={{ color: '#00D4FF' }} />
                <div>
                    <div className="text-sm font-bold text-white">CYPHER-CORE — Sistema Nominal</div>
                    <div className="text-[11px] text-white/40">Uptime: <span style={{ color: '#00D4FF' }}>{uptime}%</span> · Todos los servicios operativos</div>
                </div>
                <div className="ml-auto">
                    <RefreshCw size={14} className="text-white/20" />
                </div>
            </div>

            {/* Services */}
            <div>
                <h3 className="text-xs font-bold text-white/40 tracking-widest mb-3">SERVICIOS / MÓDULOS</h3>
                <div className="grid grid-cols-2 gap-2">
                    {SERVICES.map(svc => (
                        <div
                            key={svc.name}
                            className="rounded-xl p-3 flex items-center gap-2"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                            <span className="text-base">{svc.icon}</span>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-white/80 truncate">{svc.name}</div>
                                <div className="text-[10px] font-mono text-white/30">{svc.latency}</div>
                            </div>
                            <div
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{
                                    background: svc.status === 'online' ? '#4ADE80' : '#FFD700',
                                    boxShadow: svc.status === 'online' ? '0 0 6px #4ADE80' : '0 0 6px #FFD700',
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Storage */}
            <div>
                <h3 className="text-xs font-bold text-white/40 tracking-widest mb-3">ALMACENAMIENTO</h3>
                <div className="flex flex-col gap-3">
                    {STORAGE.map(s => (
                        <div key={s.label}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-white/60">{s.label}</span>
                                <span className="text-xs font-mono" style={{ color: s.color }}>{s.used} / {s.total} GB</span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                <div
                                    className="h-full rounded-full"
                                    style={{ width: `${(s.used / s.total) * 100}%`, background: s.color, transition: 'width 1s ease' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Subscriptions / Flujo de caja */}
            <div>
                <h3 className="text-xs font-bold text-white/40 tracking-widest mb-3">FLUJO DE SUSCRIPCIONES</h3>
                <div className="flex flex-col gap-2">
                    {SUBSCRIPTIONS.map(sub => (
                        <div
                            key={sub.clinic}
                            className="rounded-xl px-3 py-2.5 flex items-center gap-3"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                            <CreditCard size={14} className="text-white/30 shrink-0" />
                            <div className="flex-1">
                                <div className="text-xs font-medium text-white/80">{sub.clinic}</div>
                                <div className="text-[10px] text-white/30">Plan {sub.plan}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-emerald-400">${sub.amount.toLocaleString()}</div>
                                <div
                                    className="text-[10px] font-semibold"
                                    style={{ color: sub.status === 'active' ? '#4ADE80' : '#FFD700' }}
                                >
                                    {sub.status === 'active' ? '● Activo' : '◑ Trial'}
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Total */}
                    <div className="mt-1 flex items-center justify-between px-3">
                        <span className="text-xs text-white/30">MRR Total</span>
                        <span className="text-base font-bold text-emerald-400">
                            ${SUBSCRIPTIONS.reduce((s, x) => s + x.amount, 0).toLocaleString()} MXN
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
