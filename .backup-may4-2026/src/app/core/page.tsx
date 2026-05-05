"use client";

import React, { useState, useEffect } from 'react';
import { CoreLogin } from '@/core/ui/CoreLogin';
import { CoreInterface, PhaseNavigator } from '@/core/ui/CoreInterface';

export default function CorePage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activePhase, setActivePhase] = useState(1);

    // Efecto para "Resetear" si salimos del contexto (aunque el estado local ya lo hace)
    // Esto asegura limpieza.
    useEffect(() => {
        return () => {
            setIsAuthenticated(false);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div>
                    {isAuthenticated ? (
                        <div>
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
