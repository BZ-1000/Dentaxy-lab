import React, { useEffect } from 'react';
import { useDemoGuard } from '@/hooks/useDemoGuard';
import { Loader2, ShieldCheck, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface DemoGuardProps {
    children: React.ReactNode;
    moduleName: string;
}

export const DemoGuard: React.FC<DemoGuardProps> = ({ children, moduleName }) => {
    const { isAllowed, isLoading, isFreeAccess, accessMessage } = useDemoGuard(moduleName);

    // Mostrar notificación de libre acceso solo una vez
    useEffect(() => {
        if (isFreeAccess && !isLoading) {
            toast.info("Acceso Libre Activo", {
                description: accessMessage || "Disfruta del demo de Dentaxy.",
                duration: 5000,
                icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />
            });
        }
    }, [isFreeAccess, isLoading, accessMessage]);

    if (isLoading) {
        return (
            <div className="h-screen w-full bg-black flex flex-col items-center justify-center gap-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <Loader2 className="h-10 w-10 animate-spin text-white/20" />
                    <p className="text-white/40 text-xs font-mono uppercase tracking-widest">
                        Verificando credenciales...
                    </p>
                </motion.div>
            </div>
        );
    }

    if (!isAllowed) {
        // El hook useDemoGuard ya maneja la redirección, pero por si acaso mostramos algo
        return null;
    }

    return (
        <>
            <AnimatePresence>
                {isFreeAccess && (
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none"
                    >
                        <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 px-4 py-2 rounded-full flex items-center gap-3 shadow-2xl shadow-emerald-500/10">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">
                                Modo Beta: Libre Acceso
                            </span>
                            {accessMessage && (
                                <div className="h-3 w-px bg-emerald-500/20" />
                            )}
                            {accessMessage && (
                                <span className="text-[10px] text-emerald-200/80 font-medium">
                                    {accessMessage}
                                </span>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {children}
        </>
    );
};
