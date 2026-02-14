import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DemoAlertListener } from '@/components/demos/DemoAlertListener';
import { ArrowLeft, Building2 } from 'lucide-react';

/**
 * Demo ENTERPRISE - Arquitectura Clínica
 * 
 * Placeholder para el módulo Enterprise de arquitectura clínica multi-entorno.
 */
export const EnterpriseDemo: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-black to-zinc-950">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center bg-white/5 backdrop-blur-sm border-b border-white/10">
                <button
                    onClick={() => navigate('/hub')}
                    className="group flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span>Volver al inicio</span>
                </button>

                <div className="text-sm font-semibold text-white">
                    DENTAXY ENTERPRISE
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center pt-20">
                <div className="text-center space-y-6 max-w-2xl px-4">
                    <Building2 className="w-20 h-20 mx-auto text-white animate-pulse" />
                    <h1 className="text-4xl font-bold text-white">
                        DENTAXY ENTERPRISE
                    </h1>
                    <p className="text-white/60 text-lg">
                        Arquitectura clínica escalable en desarrollo.
                        <br />
                        Pronto disponible para demos.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default EnterpriseDemo;
