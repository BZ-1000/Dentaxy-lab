import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnalysisModeProvider } from '@/contexts/AnalysisModeContext';
import { DentaxyFormPanel } from '@/components/academico/DentaxyFormPanel';
import { DemoAlertListener } from '@/components/demos/DemoAlertListener';
import { useDemoSession } from '@/hooks/useDemoSession';
import { Loader2, ArrowLeft, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Demo DENTAXY AI
 * 
 * Exact clone of ClimuzacView structure (UAO/Universidades demo)
 * Uses the SAME optimized DentaxyFormPanel that works perfectly there
 */
export const AIDemo: React.FC = () => {
    const navigate = useNavigate();
    const { fullName, expiresAt } = useDemoSession();

    const [sesionValida, setSesionValida] = useState<boolean | null>(null);
    const [tiempoRestante, setTiempoRestante] = useState<string>('--:--');

    useEffect(() => {
        const verificar = async () => {
            const token = sessionStorage.getItem('demo_session_token');

            if (!token) {
                setSesionValida(false);
                return;
            }

            setSesionValida(true);
        };
        verificar();
    }, []);

    useEffect(() => {
        if (!expiresAt) return;

        const calcularTiempo = () => {
            const ahora = new Date();
            const expira = new Date(expiresAt);
            const diff = expira.getTime() - ahora.getTime();

            if (diff <= 0) {
                setTiempoRestante('00:00');
                return;
            }

            const minutos = Math.floor(diff / 60000);
            const segundos = Math.floor((diff % 60000) / 1000);
            setTiempoRestante(`${minutos}:${segundos.toString().padStart(2, '0')}`);
        };

        calcularTiempo();
        const interval = setInterval(calcularTiempo, 1000);
        return () => clearInterval(interval);
    }, [expiresAt]);

    const isLowTime = tiempoRestante !== '--:--' &&
        tiempoRestante !== '00:00' &&
        parseInt(tiempoRestante.split(':')[0]) < 5;

    // Loading state
    if (sesionValida === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
                    <p className="text-sm text-muted-foreground">Iniciando DENTAXY AI...</p>
                </div>
            </div>
        );
    }

    // Invalid session
    if (!sesionValida) {
        navigate('/modules');
        return null;
    }

    return (
        <AnalysisModeProvider>
            <div className="min-h-screen h-screen flex flex-col bg-background overflow-hidden">
                {/* Alert Listener */}
                <DemoAlertListener />

                {/* Sticky Top Header */}
                <header className="sticky top-0 z-[100] bg-background border-b border-border/50">
                    <div className="flex items-center justify-between h-14 px-4 lg:px-6">
                        {/* Left: Back button & Brand */}
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/modules')}
                                className="flex items-center gap-2 text-muted-foreground hover:text-foreground -ml-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span className="hidden sm:inline text-sm">Volver</span>
                            </Button>

                            {/* Dentaxy AI Brand */}
                            <div className="flex items-center border-l border-gray-200 dark:border-white/10 pl-4 h-6">
                                <span className="text-xs font-semibold tracking-tight text-gray-900 dark:text-gray-100 uppercase">
                                    Dentaxy AI
                                </span>
                            </div>
                        </div>

                        {/* Right: Session info */}
                        <div className="flex items-center gap-3">
                            {/* Timer */}
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono ${isLowTime
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                : 'bg-muted text-muted-foreground'
                                }`}>
                                <Clock className={`h-3 w-3 ${isLowTime ? 'animate-pulse' : ''}`} />
                                <span className="font-medium">{tiempoRestante}</span>
                            </div>

                            {/* User name */}
                            {fullName && (
                                <span className="hidden sm:block text-xs text-muted-foreground truncate max-w-[120px]">
                                    {fullName}
                                </span>
                            )}

                            {/* Demo badge */}
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                <Zap className="h-3 w-3 text-emerald-500" />
                                <span className="hidden lg:inline text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                                    Demo
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* EXACT same as ClimuzacView - Just the DentaxyFormPanel directly */}
                <DentaxyFormPanel />

            </div>
        </AnalysisModeProvider>
    );
};

export default AIDemo;
