import React from 'react';
import { useSingularityStore, SingularityTheme, ModuleId } from '../store/useSingularityStore';
import { Swords, Server, Users, Bot, ChevronLeft, ChevronRight, Hexagon } from 'lucide-react';

interface NavItem {
    id: ModuleId;
    label: string;
    icon: React.ReactNode;
    color: string;
}

const NAV_ITEMS: NavItem[] = [
    { id: 'sala-guerra', label: 'Sala de Guerra', icon: <Swords size={18} />, color: '#FF6B35' },
    { id: 'servidor-local', label: 'Servidor Local', icon: <Server size={18} />, color: '#00D4FF' },
    { id: 'atrio', label: 'Atrio', icon: <Users size={18} />, color: '#A78BFA' },
    { id: 'agentes', label: 'Consejo de Agentes', icon: <Bot size={18} />, color: '#4ADE80' },
];

const THEME_OPTIONS: { value: SingularityTheme; label: string; dot: string }[] = [
    { value: 'dark', label: 'Dark', dot: '#00D4FF' },
    { value: 'legendary', label: 'Legendary', dot: '#FFD700' },
    { value: 'cyberpunk', label: 'Cyberpunk', dot: '#FF00FF' },
];

export const SingularitySidebar: React.FC = () => {
    const { isSidebarCollapsed, toggleSidebar, openWindow, windows, theme, setTheme } = useSingularityStore();

    const openWindowIds = windows.map(w => w.moduleId);

    return (
        <aside
            className="relative flex flex-col border-r transition-all duration-300 ease-in-out shrink-0"
            style={{
                width: isSidebarCollapsed ? 60 : 220,
                borderColor: 'rgba(255,255,255,0.07)',
                background: 'rgba(8,12,20,0.9)',
                backdropFilter: 'blur(16px)',
            }}
        >
            {/* Logo area */}
            <div
                className="flex items-center gap-3 px-4 py-4 border-b"
                style={{ borderColor: 'rgba(255,255,255,0.07)' }}
            >
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg,#00D4FF22,#00D4FF44)', border: '1px solid rgba(0,212,255,0.4)' }}
                >
                    <Hexagon size={16} style={{ color: '#00D4FF' }} />
                </div>
                {!isSidebarCollapsed && (
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-white leading-tight">SINGULARITY</span>
                        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Workspace</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-3 overflow-y-auto">
                {!isSidebarCollapsed && (
                    <div className="px-4 pb-1">
                        <span className="text-[10px] font-semibold tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>MÓDULOS</span>
                    </div>
                )}

                {NAV_ITEMS.map(item => {
                    const isOpen = openWindowIds.includes(item.id);
                    return (
                        <button
                            key={item.id}
                            onClick={() => openWindow(item.id)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-200 group hover:bg-white/5"
                            title={isSidebarCollapsed ? item.label : undefined}
                        >
                            <div
                                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                                style={{
                                    color: item.color,
                                    background: isOpen ? `${item.color}18` : 'transparent',
                                    border: isOpen ? `1px solid ${item.color}40` : '1px solid transparent',
                                }}
                            >
                                {item.icon}
                            </div>
                            {!isSidebarCollapsed && (
                                <div className="flex-1 flex items-center justify-between">
                                    <span className="text-sm font-medium" style={{ color: isOpen ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)' }}>
                                        {item.label}
                                    </span>
                                    {isOpen && <span className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />}
                                </div>
                            )}
                        </button>
                    );
                })}

                {/* Themes */}
                {!isSidebarCollapsed && (
                    <div className="mt-4 px-4">
                        <span className="text-[10px] font-semibold tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>TEMA</span>
                        <div className="mt-2 flex flex-col gap-1">
                            {THEME_OPTIONS.map(t => (
                                <button
                                    key={t.value}
                                    onClick={() => setTheme(t.value)}
                                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-all hover:bg-white/5"
                                >
                                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: t.dot, boxShadow: theme === t.value ? `0 0 8px ${t.dot}` : 'none' }} />
                                    <span className="text-xs" style={{ color: theme === t.value ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)' }}>
                                        {t.label}
                                    </span>
                                    {theme === t.value && <span className="ml-auto text-[10px] text-emerald-400">✓</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {/* Collapse toggle */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border flex items-center justify-center transition-all hover:bg-white/10 z-20"
                style={{ background: 'rgba(8,12,20,0.9)', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.4)' }}
            >
                {isSidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            </button>
        </aside>
    );
};
