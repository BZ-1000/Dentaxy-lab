"use client";

import React, { useState, useEffect } from 'react';
import { CoreLogin } from '@/core/ui/CoreLogin';
import { CoreInterface } from '@/core/ui/CoreInterface';

export default function CorePage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Efecto para "Resetear" si salimos del contexto (aunque el estado local ya lo hace)
    // Esto asegura limpieza.
    useEffect(() => {
        return () => {
            setIsAuthenticated(false);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center text-white font-bold mr-3">D</div>
                        <h1 className="text-xl font-bold tracking-tight">Dentaxy <span className="text-gray-400 font-light">Core</span></h1>
                    </div>
                    {isAuthenticated && (
                        <button
                            onClick={() => setIsAuthenticated(false)}
                            className="text-xs text-red-500 hover:text-red-700 font-medium uppercase tracking-wide border border-red-200 px-3 py-1 rounded hover:bg-red-50 transition-colors"
                        >
                            Cerrar Sesión
                        </button>
                    )}
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {isAuthenticated ? (
                    <div>
                        <CoreInterface />
                    </div>
                ) : (
                    <div>
                        <CoreLogin onLogin={() => setIsAuthenticated(true)} />
                    </div>
                )}
            </main>
        </div>
    );
}
