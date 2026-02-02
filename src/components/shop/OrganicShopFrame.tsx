import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User } from 'lucide-react';

interface ShopFrameProps {
    onHomeClick: () => void;
    onAdminClick: () => void;
    waitlistCount: number;
}

const OrganicShopFrame: React.FC<ShopFrameProps> = ({ onHomeClick, onAdminClick, waitlistCount }) => {
    return (
        <div className="fixed inset-0 z-50 pointer-events-none p-6 md:p-10 flex flex-col justify-between">

            {/* Top Layer - Islas Flotantes Independientes */}
            <div className="w-full flex justify-between items-start">

                {/* ISLA 1: Botón Volver */}
                <motion.button
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    onClick={onHomeClick}
                    className="pointer-events-auto group relative"
                >
                    <div className="absolute inset-0 bg-white/40 blur-xl rounded-full transform group-hover:scale-110 transition-transform duration-500" />
                    <div className="relative bg-white h-14 md:h-16 px-6 md:px-8 rounded-[2rem] flex items-center gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300">
                        <div className="bg-neutral-100 p-2 rounded-full group-hover:bg-neutral-200 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-neutral-600" />
                        </div>
                        <span className="font-bold text-sm tracking-wide text-neutral-800 uppercase hidden md:block">Volver</span>
                    </div>
                </motion.button>

                {/* ISLA 2: Contador Central (Estilo Colgante/Etiqueta) */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                    className="pointer-events-auto"
                >
                    <div className="bg-white/95 backdrop-blur-md px-8 py-4 rounded-[2.5rem] shadow-2xl flex flex-col items-center border border-white/50 relative overflow-hidden">
                        {/* Decorative Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-emerald-400 blur-sm" />

                        <div className="flex items-center gap-3 mb-1">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <span className="text-2xl font-black text-neutral-900 tracking-tight leading-none">
                                {waitlistCount}
                            </span>
                        </div>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">
                            Profesionales
                        </span>
                    </div>
                </motion.div>

                {/* ISLA 3: Botón Admin */}
                <motion.button
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    onClick={onAdminClick}
                    className="pointer-events-auto group relative"
                >
                    <div className="absolute inset-0 bg-white/40 blur-xl rounded-full transform group-hover:scale-110 transition-transform duration-500" />
                    <div className="relative bg-white h-14 md:h-16 w-14 md:w-16 rounded-[2rem] flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300">
                        <User className="w-6 h-6 text-neutral-600 group-hover:text-neutral-900 transition-colors" />
                    </div>
                </motion.button>

            </div>

            {/* Bottom Layer - Footer Flotante */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full flex justify-center pointer-events-auto"
            >
                <div className="bg-white/80 backdrop-blur-md px-6 py-2 rounded-full border border-white/40 shadow-lg">
                    <p className="text-[10px] text-neutral-500 font-bold tracking-[0.3em] uppercase">
                        Dentaxy © 2026
                    </p>
                </div>
            </motion.div>

        </div>
    );
};

export default OrganicShopFrame;
