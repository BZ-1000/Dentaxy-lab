import React from 'react';
import { useSingularityStore } from './store/useSingularityStore';
import { SingularityTopBar } from './components/SingularityTopBar';
import { SingularitySidebar } from './components/SingularitySidebar';
import { WindowManager } from './components/WindowManager';
import { CommandPalette } from './components/CommandPalette';
import { useCommandPalette } from './hooks/useCommandPalette';
import { Swords, Server, Users, Bot, Command } from 'lucide-react';

// Hook registra el listener de teclado
function CommandPaletteListener() {
    useCommandPalette();
    return null;
}

// Pantalla de bienvenida cuando no hay ventanas abiertas
const WelcomeScreen: React.FC = () => {
    const { openWindow, theme, setCommandPaletteOpen } = useSingularityStore();

    const accentColor =
        theme === 'legendary' ? '#FFD700' : theme === 'cyberpunk' ? '#FF00FF' : '#00D4FF';

    const quickActions = [
        { id: 'sala-guerra' as const, label: 'Sala de Guerra', desc: 'Misiones, XP y estadísticas', icon: <Swords size={20} />, color: '#FF6B35' },
        { id: 'servidor-local' as const, label: 'Servidor Local', desc: 'Estado del sistema y pagos', icon: <Server size={20} />, color: '#00D4FF' },
        { id: 'atrio' as const, label: 'Atrio', desc: 'Equipo y chat por proyecto', icon: <Users size={20} />, color: '#A78BFA' },
        { id: 'agentes' as const, label: 'Agentes Gemas', desc: 'AIDA-7, SYNTAX-9, NEXUS-01…', icon: <Bot size={20} />, color: '#4ADE80' },
    ];

    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-10 px-8 select-none">
            {/* Title */}
            <div className="text-center flex flex-col gap-3">
                <div
                    className="text-[11px] font-bold tracking-[0.3em] opacity-50"
                    style={{ color: accentColor }}
                >
                    THE SINGULARITY WORKSPACE
                </div>
                <h1
                    className="text-4xl font-bold tracking-tight"
                    style={{
                        background: `linear-gradient(135deg, #ffffff 0%, ${accentColor} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Escritorio Infinito
                </h1>
                <p className="text-sm text-white/30 max-w-xs">
                    Abre un módulo desde el sidebar o usa{' '}
                    <kbd
                        className="px-1.5 py-0.5 rounded text-[10px] font-mono"
                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                    >
                        Ctrl+K
                    </kbd>{' '}
                    para buscar comandos.
                </p>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                {quickActions.map(a => (
                    <button
                        key={a.id}
                        onClick={() => openWindow(a.id)}
                        className="group flex flex-col gap-2.5 p-4 rounded-2xl text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                            background: `${a.color}0D`,
                            border: `1px solid ${a.color}22`,
                            boxShadow: 'none',
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${a.color}25`;
                            (e.currentTarget as HTMLElement).style.borderColor = `${a.color}55`;
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                            (e.currentTarget as HTMLElement).style.borderColor = `${a.color}22`;
                        }}
                    >
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: `${a.color}18`, color: a.color }}
                        >
                            {a.icon}
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-white/85">{a.label}</div>
                            <div className="text-[11px] text-white/35">{a.desc}</div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Cmd+K hint */}
            <button
                onClick={() => setCommandPaletteOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:bg-white/5"
                style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.25)' }}
            >
                <Command size={13} />
                <span className="text-xs">Command Palette</span>
            </button>
        </div>
    );
};

export const SingularityShell: React.FC = () => {
    const { windows, theme } = useSingularityStore();
    const hasWindows = windows.length > 0;

    const bgStyle: React.CSSProperties = {
        background:
            theme === 'legendary'
                ? 'radial-gradient(ellipse at 20% 50%, rgba(255,215,0,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(255,140,0,0.04) 0%, transparent 40%), #080C14'
                : theme === 'cyberpunk'
                    ? 'radial-gradient(ellipse at 20% 50%, rgba(255,0,255,0.07) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(0,212,255,0.05) 0%, transparent 40%), #080C14'
                    : 'radial-gradient(ellipse at 20% 50%, rgba(0,212,255,0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(167,139,250,0.04) 0%, transparent 40%), #080C14',
        transition: 'background 0.8s ease',
    };

    return (
        <div className="fixed inset-0 flex flex-col overflow-hidden" style={bgStyle}>
            {/* Subtle grid overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px',
                }}
            />

            {/* Shell layout */}
            <CommandPaletteListener />
            <SingularityTopBar />

            <div className="flex flex-1 overflow-hidden relative">
                <SingularitySidebar />

                {/* Main workspace canvas */}
                <main className="flex-1 relative overflow-hidden">
                    {hasWindows ? (
                        <WindowManager />
                    ) : (
                        <div className="flex h-full">
                            <WelcomeScreen />
                        </div>
                    )}
                </main>
            </div>

            <CommandPalette />
        </div>
    );
};
