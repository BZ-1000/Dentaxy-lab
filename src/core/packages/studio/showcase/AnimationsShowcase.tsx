import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Terminal, Smartphone, Loader2, Play } from 'lucide-react';
import { toast } from 'sonner';

// Animation Variants matching Seed
const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
};

export const AnimationsShowcase = () => {
    const [key, setKey] = React.useState(0); // To force re-render/replay

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Especificaciones copiadas al portapapeles");
    };

    const replayAnimations = () => {
        setKey(prev => prev + 1);
    };

    return (
        <div className="w-full h-full p-8 flex flex-col items-center justify-center bg-transparent">
            <div className="w-full max-w-4xl space-y-12">

                {/* --- LIVE PREVIEW AREA --- */}
                <div className="relative min-h-[400px] flex items-center justify-center bg-white/50 backdrop-blur-xl rounded-[3rem] border border-white/60 shadow-xl overflow-hidden group">

                    <div className="absolute top-6 right-6 flex gap-2">
                        <button
                            onClick={replayAnimations}
                            className="p-3 bg-white hover:bg-slate-50 rounded-full shadow-lg border border-slate-100 transition-all hover:scale-110 active:scale-95 text-slate-600"
                            title="Replay Animation"
                        >
                            <Play size={18} fill="currentColor" />
                        </button>
                    </div>

                    <motion.div
                        key={key}
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="text-center space-y-8"
                    >
                        {/* Animated Elements */}
                        <motion.div variants={fadeUp} className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 mb-4 mx-auto">
                            <Smartphone className="text-white w-8 h-8" />
                        </motion.div>

                        <div className="space-y-2">
                            <motion.h1
                                variants={fadeUp}
                                className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-tight"
                            >
                                Dentaxy<span className="text-indigo-600">.Studio</span>
                            </motion.h1>
                            <motion.p
                                variants={fadeUp}
                                className="text-xl text-slate-500 max-w-lg mx-auto font-medium"
                            >
                                Sistema de diseño fluido y escalable.
                            </motion.p>
                        </div>

                        <motion.div variants={staggerContainer} className="flex gap-4 justify-center pt-4">
                            <motion.button
                                variants={scaleIn}
                                className="px-8 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-black transition-colors shadow-xl"
                            >
                                Get Started
                            </motion.button>
                            <motion.button
                                variants={scaleIn}
                                className="px-8 py-3 rounded-xl bg-white text-slate-900 border border-slate-200 font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                Documentation
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>


                {/* --- CLONING BOX / SPECS --- */}
                <div className="bg-[#1C1C1E] rounded-[2.5rem] p-8 shadow-2xl border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50" />

                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <Terminal size={24} />
                            </div>
                            <div>
                                <h3 className="text-white font-black text-xl tracking-tight">Animation Specs</h3>
                                <p className="text-indigo-400 font-bold text-[10px] uppercase tracking-[0.2em] opacity-80">Reference Clone ID: SEED-ANIM-01</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleCopy(JSON.stringify({ fadeUp, staggerContainer, scaleIn }, null, 2))}
                            className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2"
                        >
                            <Copy size={14} />
                            <span>Copy JSON</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Variant: Fade Up */}
                        <div className="bg-black/40 rounded-2xl p-5 border border-white/5 hover:border-indigo-500/30 transition-colors group/card">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-indigo-400 font-bold text-xs uppercase tracking-wider">fadeUp</span>
                                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                            </div>
                            <code className="text-[10px] text-slate-400 font-mono block leading-relaxed group-hover/card:text-indigo-300 transition-colors">
                                opacity: 0 → 1<br />
                                y: 40 → 0<br />
                                ease: default spring
                            </code>
                        </div>

                        {/* Variant: Stagger */}
                        <div className="bg-black/40 rounded-2xl p-5 border border-white/5 hover:border-purple-500/30 transition-colors group/card">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-purple-400 font-bold text-xs uppercase tracking-wider">staggerContainer</span>
                                <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                            </div>
                            <code className="text-[10px] text-slate-400 font-mono block leading-relaxed group-hover/card:text-purple-300 transition-colors">
                                staggerChildren: 0.1<br />
                                delayChildren: 0<br />
                                orchestrates flow
                            </code>
                        </div>

                        {/* Variant: Scale In */}
                        <div className="bg-black/40 rounded-2xl p-5 border border-white/5 hover:border-pink-500/30 transition-colors group/card">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-pink-400 font-bold text-xs uppercase tracking-wider">scaleIn</span>
                                <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
                            </div>
                            <code className="text-[10px] text-slate-400 font-mono block leading-relaxed group-hover/card:text-pink-300 transition-colors">
                                opacity: 0 → 1<br />
                                scale: 0.9 → 1<br />
                                ideal for buttons/cards
                            </code>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>Used in: Dentaxy Seed, Shop Login, Studio</span>
                        <div className="flex items-center gap-2">
                            <Loader2 size={12} className="animate-spin text-indigo-500" />
                            <span className="text-indigo-400">Live Sync Active</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
