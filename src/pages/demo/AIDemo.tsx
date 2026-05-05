import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnalysisModeProvider } from '@/contexts/AnalysisModeContext';
import { DentaxyFormPanel } from '@/components/academico/DentaxyFormPanel';
import { DemoAlertListener } from '@/components/demos/DemoAlertListener';
import { useDemoSession } from '@/hooks/useDemoSession';
import { useDemoGuard } from '@/hooks/useDemoGuard';
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
    const { isAllowed, isLoading: isGuardLoading, isFreeAccess } = useDemoGuard('motor_neuronal');
    const { fullName, expiresAt } = useDemoSession();

    const [tiempoRestante, setTiempoRestante] = useState<string>('--:--');

    // Todos los hooks deben ir antes de cualquier return condicional (Rules of Hooks)
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

    // Early returns DESPUÉS de todos los hooks
    if (isGuardLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    // Si no tiene acceso, useDemoGuard ya redirigió — no renderizar nada
    if (!isAllowed) return null;

    return (
        <AnalysisModeProvider>
            <div className="min-h-screen h-screen flex flex-col bg-background overflow-hidden">
                {/* Alert Listener */}
                <DemoAlertListener />
                {/* DentaxyFormPanel ocupa toda la pantalla — sin header */}
                <DentaxyFormPanel />
            </div>
        </AnalysisModeProvider>
    );
};

export default AIDemo;
