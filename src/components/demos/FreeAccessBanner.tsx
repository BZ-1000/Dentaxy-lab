/**
 * FreeAccessBanner.tsx
 * 
 * Banner flotante que aparece cuando un usuario entra a un demo en modo libre acceso.
 * Muestra el access_message configurado desde el panel admin del Ecosystem.
 * Se auto-descarta tras 5 segundos o al hacer clic en "Entrar".
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Unlock, X, Sparkles } from 'lucide-react';

interface FreeAccessBannerProps {
    message: string;
    moduleName?: string;
    accentColor?: string;
    onDismiss: () => void;
}

export const FreeAccessBanner: React.FC<FreeAccessBannerProps> = ({
    message,
    moduleName,
    accentColor = '#10B981',
    onDismiss,
}) => {
    const [visible, setVisible] = useState(true);
    const [progress, setProgress] = useState(100);
    const AUTO_CLOSE_MS = 5000;

    useEffect(() => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / AUTO_CLOSE_MS) * 100);
            setProgress(remaining);
            if (remaining === 0) {
                clearInterval(interval);
                setVisible(false);
                onDismiss();
            }
        }, 50);
        return () => clearInterval(interval);
    }, [onDismiss]);

    const handleDismiss = () => {
        setVisible(false);
        onDismiss();
    };

    return (
        <AnimatePresence>
            {visible && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
                        onClick={handleDismiss}
                    />

                    {/* Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.93 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                        className="relative z-10 pointer-events-auto mx-4 w-full max-w-md overflow-hidden rounded-[1.5rem]"
                        style={{
                            background: 'rgba(5, 5, 10, 0.92)',
                            backdropFilter: 'blur(24px)',
                            border: `1px solid ${accentColor}35`,
                            boxShadow: `0 0 60px ${accentColor}12, 0 25px 50px rgba(0,0,0,0.6)`,
                        }}
                    >
                        {/* Barra de progreso superior */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5 overflow-hidden rounded-t-[1.5rem]">
                            <div
                                className="h-full transition-none"
                                style={{ backgroundColor: accentColor, width: `${progress}%` }}
                            />
                        </div>

                        {/* Botón cerrar */}
                        <button
                            onClick={handleDismiss}
                            className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-white/10 text-white/40 hover:text-white/70"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>

                        {/* Contenido */}
                        <div className="px-6 py-7">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-5">
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}40` }}
                                >
                                    <Unlock className="w-5 h-5" style={{ color: accentColor }} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: accentColor }}>
                                        🔓 Libre Acceso Activado
                                    </p>
                                    {moduleName && (
                                        <p className="text-white font-semibold text-sm">{moduleName}</p>
                                    )}
                                </div>
                            </div>

                            {/* Mensaje personalizado */}
                            {message && (
                                <div
                                    className="mb-5 px-4 py-3 rounded-xl"
                                    style={{ background: `${accentColor}0D`, border: `1px solid ${accentColor}25` }}
                                >
                                    <div className="flex items-start gap-2">
                                        <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: accentColor }} />
                                        <p className="text-white/75 text-sm leading-relaxed">{message}</p>
                                    </div>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-white/25 text-[11px]">
                                    Se cierra automáticamente...
                                </p>
                                <button
                                    onClick={handleDismiss}
                                    className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 flex-shrink-0"
                                    style={{ background: accentColor, color: 'white' }}
                                >
                                    Entrar →
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default FreeAccessBanner;
