import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User } from 'lucide-react';

interface ShopFrameProps {
    onHomeClick: () => void;
    onAdminClick: () => void;
    waitlistCount: number;
}

const ShopFrame: React.FC<ShopFrameProps> = ({ onHomeClick, onAdminClick, waitlistCount }) => {
    return (
        <div className="fixed inset-0 z-50 pointer-events-none">

            {/* Borde Superior - Más grueso con elementos integrados */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute top-0 left-0 right-0 h-16 md:h-20 bg-white pointer-events-auto flex items-center justify-between px-6 md:px-10"
                style={{
                    borderBottomLeftRadius: '2rem',
                    borderBottomRightRadius: '2rem',
                }}
            >
                {/* Botón Volver - Izquierda */}
                <button
                    onClick={onHomeClick}
                    className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-semibold tracking-wide">Volver</span>
                </button>

                {/* Contador Central */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-neutral-900 font-bold text-base md:text-lg">
                        {waitlistCount}
                    </span>
                    <span className="text-neutral-400 text-sm font-medium hidden md:block">
                        profesionales esperando
                    </span>
                </div>

                {/* Botón Admin - Derecha */}
                <button
                    onClick={onAdminClick}
                    className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors"
                    title="Acceso Administrativo"
                >
                    <span className="text-sm font-semibold tracking-wide hidden md:block">Admin</span>
                    <User className="w-5 h-5" />
                </button>
            </motion.div>

            {/* Borde Izquierdo */}
            <div
                className="absolute top-16 md:top-20 left-0 bottom-12 md:bottom-14 w-3 md:w-4 bg-white"
                style={{
                    borderTopRightRadius: '1rem',
                    borderBottomRightRadius: '1rem',
                }}
            />

            {/* Borde Derecho */}
            <div
                className="absolute top-16 md:top-20 right-0 bottom-12 md:bottom-14 w-3 md:w-4 bg-white"
                style={{
                    borderTopLeftRadius: '1rem',
                    borderBottomLeftRadius: '1rem',
                }}
            />

            {/* Borde Inferior con Copyright */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="absolute bottom-0 left-0 right-0 h-12 md:h-14 bg-white pointer-events-auto flex items-center justify-center"
                style={{
                    borderTopLeftRadius: '2rem',
                    borderTopRightRadius: '2rem',
                }}
            >
                <p className="text-xs text-neutral-400 font-medium tracking-widest uppercase">
                    Dentaxy Technologies © 2026
                </p>
            </motion.div>

        </div>
    );
};

export default ShopFrame;
