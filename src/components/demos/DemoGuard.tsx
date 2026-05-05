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

    return <>{children}</>;
};
