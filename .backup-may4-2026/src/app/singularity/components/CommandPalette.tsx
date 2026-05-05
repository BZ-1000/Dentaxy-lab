import React, { useState } from 'react';
import { useSingularityStore, ModuleId } from '../store/useSingularityStore';
import { useCommandPalette } from '../hooks/useCommandPalette';
import { Swords, Server, Users, Bot, Search, Hash, Palette } from 'lucide-react';

interface Command {
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    action: () => void;
    category: string;
}

export const CommandPalette: React.FC = () => {
    const { commandPaletteOpen, setCommandPaletteOpen } = useCommandPalette();
    const { openWindow, setTheme } = useSingularityStore();
    const [query, setQuery] = useState('');

    const commands: Command[] = [
        { id: 'sala', label: 'Abrir Sala de Guerra', description: 'Dashboard principal de misiones y XP', icon: <Swords size={15} />, action: () => { openWindow('sala-guerra'); setCommandPaletteOpen(false); }, category: 'Módulos' },
        { id: 'server', label: 'Abrir Servidor Local', description: 'Panel CYPHER-CORE de estado del sistema', icon: <Server size={15} />, action: () => { openWindow('servidor-local'); setCommandPaletteOpen(false); }, category: 'Módulos' },
        { id: 'atrio', label: 'Abrir Atrio', description: 'Colaboradores y chat por proyecto', icon: <Users size={15} />, action: () => { openWindow('atrio'); setCommandPaletteOpen(false); }, category: 'Módulos' },
        { id: 'agentes', label: 'Consejo de Agentes', description: 'AIDA-7, SYNTAX-9, CYPHER-CORE, NEXUS-01', icon: <Bot size={15} />, action: () => { openWindow('agentes'); setCommandPaletteOpen(false); }, category: 'Módulos' },
        { id: 'theme-dark', label: 'Tema: Dark', description: 'Modo oscuro base Apple/Cyberpunk', icon: <Hash size={15} />, action: () => { setTheme('dark'); setCommandPaletteOpen(false); }, category: 'Temas' },
        { id: 'theme-legendary', label: 'Tema: Legendary', description: 'Modo dorado para misiones épicas', icon: <Palette size={15} />, action: () => { setTheme('legendary'); setCommandPaletteOpen(false); }, category: 'Temas' },
        { id: 'theme-cyberpunk', label: 'Tema: Cyberpunk', description: 'Neón magenta extremo', icon: <Palette size={15} />, action: () => { setTheme('cyberpunk'); setCommandPaletteOpen(false); }, category: 'Temas' },
    ];

    const filtered = commands.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase())
    );

    if (!commandPaletteOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-start justify-center pt-24"
            onClick={() => setCommandPaletteOpen(false)}
        >
            {/* Backdrop */}
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />

            {/* Panel */}
            <div
                className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
                style={{ background: 'rgba(12,16,28,0.95)', border: '1px solid rgba(0,212,255,0.2)', backdropFilter: 'blur(24px)' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                    <Search size={16} className="text-white/30" />
                    <input
                        autoFocus
                        type="text"
                        placeholder="Buscar comando..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none"
                    />
                    <kbd className="text-[10px] px-1.5 py-0.5 rounded text-white/30" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>ESC</kbd>
                </div>

                {/* Commands list */}
                <div className="max-h-80 overflow-y-auto py-2">
                    {Object.entries(
                        filtered.reduce((acc, cmd) => {
                            acc[cmd.category] = [...(acc[cmd.category] || []), cmd];
                            return acc;
                        }, {} as Record<string, Command[]>)
                    ).map(([category, cmds]) => (
                        <div key={category}>
                            <div className="px-4 py-1.5">
                                <span className="text-[10px] font-semibold tracking-widest text-white/25">{category.toUpperCase()}</span>
                            </div>
                            {cmds.map(cmd => (
                                <button
                                    key={cmd.id}
                                    onClick={cmd.action}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition-colors group"
                                >
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white/40 group-hover:text-cyan-400 transition-colors"
                                        style={{ background: 'rgba(255,255,255,0.04)' }}>
                                        {cmd.icon}
                                    </div>
                                    <div>
                                        <div className="text-sm text-white/80 group-hover:text-white transition-colors">{cmd.label}</div>
                                        <div className="text-[11px] text-white/30">{cmd.description}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="text-center py-8 text-white/25 text-sm">Sin resultados para "{query}"</div>
                    )}
                </div>
            </div>
        </div>
    );
};
