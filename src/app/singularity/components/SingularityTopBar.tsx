import React, { useState, useEffect } from 'react';
import { useSingularityStore } from '../store/useSingularityStore';
import { Zap, Target, Clock, Command } from 'lucide-react';

const CEO_LEVEL = 7;
const CURRENT_MRR = 48000; // MXN mock
const TARGET_MRR = 3000000;
const XP_CURRENT = 7240;
const XP_NEXT_LEVEL = 10000;

function useLiveClock() {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    return time;
}

export const SingularityTopBar: React.FC = () => {
    const { theme, setCommandPaletteOpen, windows } = useSingularityStore();
    const time = useLiveClock();

    const progressPercent = Math.min((CURRENT_MRR / TARGET_MRR) * 100, 100);
    const xpPercent = Math.min((XP_CURRENT / XP_NEXT_LEVEL) * 100, 100);

    const accentColor = theme === 'legendary' ? '#FFD700' : theme === 'cyberpunk' ? '#FF00FF' : '#00D4FF';
    const openCount = windows.filter(w => !w.isMinimized).length;

    return (
        <header
            className="shrink-0 flex items-center gap-4 px-5 h-12 border-b relative z-50"
            style={{
                borderColor: 'rgba(255,255,255,0.06)',
                background: 'rgba(6,9,18,0.95)',
                backdropFilter: 'blur(16px)',
            }}
        >
            {/* Left: Brand */}
            <div className="flex items-center gap-2 shrink-0">
                <div
                    className="text-[11px] font-bold tracking-widest px-2 py-0.5 rounded"
                    style={{ color: accentColor, background: `${accentColor}15`, border: `1px solid ${accentColor}30` }}
                >
                    ◈ DENTAXY
                </div>
                <span className="text-white/20 text-xs hidden md:block">The Singularity Workspace</span>
            </div>

            {/* Center: XP + Meta Bar */}
            <div className="flex-1 flex items-center justify-center gap-5">
                {/* CEO Level XP */}
                <div className="flex items-center gap-2">
                    <Zap size={13} style={{ color: accentColor }} />
                    <span className="text-[11px] font-bold" style={{ color: accentColor }}>CEO Lvl {CEO_LEVEL}</span>
                    <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${xpPercent}%`, background: `linear-gradient(90deg, ${accentColor}99, ${accentColor})` }}
                        />
                    </div>
                    <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{XP_CURRENT.toLocaleString()} XP</span>
                </div>

                {/* Meta 3M MXN */}
                <div className="hidden md:flex items-center gap-2">
                    <Target size={13} className="text-emerald-400" />
                    <span className="text-[11px] font-medium text-white/50">Meta 3M</span>
                    <div className="w-28 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg,#10B981,#34D399)' }}
                        />
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">{progressPercent.toFixed(1)}%</span>
                </div>

                {/* Ventanas abiertas */}
                {openCount > 0 && (
                    <div className="hidden md:flex items-center gap-1.5">
                        {Array.from({ length: openCount }).map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor, opacity: 0.7 }} />
                        ))}
                    </div>
                )}
            </div>

            {/* Right: Clock + Command Palette trigger */}
            <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-white/30" />
                    <span className="text-xs font-mono text-white/40">
                        {time.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                </div>
                <button
                    onClick={() => setCommandPaletteOpen(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] transition-all hover:bg-white/10"
                    style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
                >
                    <Command size={11} />
                    <span>⌘K</span>
                </button>
            </div>
        </header>
    );
};
