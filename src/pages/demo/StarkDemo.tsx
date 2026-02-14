import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DemoAlertListener } from '@/components/demos/DemoAlertListener';
import { ArrowLeft, Hand, Shield } from 'lucide-react';

/**
 * Demo STARK - Proyecto Clasificado
 * 
 * Placeholder para el Proyecto STARK (acceso restringido).
 */
export const StarkDemo: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-950 via-black to-rose-950">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center bg-red-900/10 backdrop-blur-sm border-b border-red-500/20">
                <button
                    onClick={() => navigate('/hub')}
                    className="group flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span>Volver al inicio</span>
                </button>

                <div className="text-sm font-semibold text-red-400 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    CLASIFICADO
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center pt-20">
                <div className="text-center space-y-6 max-w-2xl px-4">
                    <Hand className="w-20 h-20 mx-auto text-red-400 animate-pulse" />
                    <h1 className="text-4xl font-bold text-white">
                        PROYECTO STARK
                    </h1>
                    <p className="text-white/60 text-lg">
                        Top Secret Development
                        <br />
                        Access Restricted
                    </p>
                    <div className="mt-8 p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
                        <p className="text-red-400 text-sm font-mono">
                            NIVEL DE AUTORIZACIÓN INSUFICIENTE
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StarkDemo;
