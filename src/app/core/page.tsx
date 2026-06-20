"use client";

import React, { useState, useEffect } from 'react';
import { CoreLogin } from '@/core/ui/CoreLogin';
import { CoreInterface, PhaseNavigator } from '@/core/ui/CoreInterface';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CorePage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activePhase, setActivePhase] = useState(1);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Efecto para "Resetear" si salimos del contexto (aunque el estado local ya lo hace)
    // Esto asegura limpieza.
    useEffect(() => {
        return () => {
            setIsAuthenticated(false);
        };
    }, []);

    const isSeed2 = activePhase === 5;

    return (
        <div className={cn(
            "font-sans text-gray-900 transition-colors",
            isSeed2 ? "h-screen w-full bg-background overflow-hidden" : "min-h-screen bg-gray-50"
        )}>
            {!isSeed2 ? (
                <header className="bg-white border-b border-gray-200 sticky top-0 z-[110] shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-4 h-16 flex items-center justify-between gap-4">
                        <div className="flex items-center shrink-0">
                            <img src="/brand/dentaxy-icon-solid.png" alt="Dentaxy Logo" className="h-8 w-8 object-contain mr-3" />
                            <h1 className="text-xl font-bold tracking-tight hidden sm:block">Dentaxy <span className="text-gray-400 font-light">Core</span></h1>
                        </div>

                        {isAuthenticated && (
                            <div className="flex-1 flex justify-center">
                                <PhaseNavigator activePhase={activePhase} setActivePhase={setActivePhase} />
                            </div>
                        )}

                        <div className="flex items-center shrink-0">
                            {isAuthenticated && (
                                <button
                                    onClick={() => setIsAuthenticated(false)}
                                    className="text-[10px] text-red-500 hover:text-red-700 font-bold uppercase tracking-wider border border-red-100 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors shadow-sm"
                                >
                                    <span className="hidden sm:inline">Cerrar Sesión</span>
                                    <span className="sm:hidden">Salir</span>
                                </button>
                            )}
                        </div>
                    </div>
                </header>
            ) : (
                // Hamburger Menu Flotante para Seed 2.0
                <>
                    <div className="absolute top-4 right-4 z-[200]">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white p-2 rounded-full shadow-lg transition-all"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Menú Desplegable */}
                    {isMenuOpen && (
                        <div className="absolute top-16 right-4 z-[200] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 animate-in fade-in slide-in-from-top-4 w-auto">
                            <div className="mb-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Navegación Core</h3>
                                <PhaseNavigator activePhase={activePhase} setActivePhase={(phase) => {
                                    setActivePhase(phase);
                                    setIsMenuOpen(false);
                                }} />
                            </div>
                            <div className="pt-3 border-t border-gray-100 flex justify-end">
                                <button
                                    onClick={() => setIsAuthenticated(false)}
                                    className="text-[10px] text-red-500 hover:text-red-700 font-bold uppercase tracking-wider border border-red-100 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors shadow-sm"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            <main className={cn(
                isSeed2 ? "w-full h-full" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
            )}>
                <div className={cn(isSeed2 && "w-full h-full")}>
                    {isAuthenticated ? (
                        <div className={cn(isSeed2 && "w-full h-full")}>
                            <CoreInterface activePhase={activePhase} setActivePhase={setActivePhase} />
                        </div>
                    ) : (
                        <div>
                            <CoreLogin onLogin={() => setIsAuthenticated(true)} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
