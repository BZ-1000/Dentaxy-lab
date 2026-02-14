import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, Check } from 'lucide-react';

interface ModuleInfo {
    whatItDemonstrates: string;
    problemItSolves: string;
    contextOfUse: string;
    publicTarget: string;
    whatIncluded: string[];
    whatNotIncluded: string[];
}

interface SchemaHubCardProps {
    title: string;
    description: string;
    subtitle?: string;
    badge?: string;
    color?: string; // RGB format: "r,g,b"
    onExplore?: () => void;
    onTryDemo?: () => void;
    isActive?: boolean;
    isExpanded?: boolean;
    moduleInfo?: ModuleInfo;
}

export function SchemaHubCard({
    title,
    description,
    subtitle = "Module",
    badge,
    color = "168, 85, 247", // Default purple
    onExplore,
    onTryDemo,
    isActive = false,
    isExpanded = false,
    moduleInfo
}: SchemaHubCardProps) {

    return (
        <div
            className={`relative transition-all duration-500 ease-out ${isExpanded ? 'w-full max-w-5xl' : 'w-full max-w-xs'}`}
            style={{ zIndex: isExpanded ? 50 : 10 }}
        >
            <div
                className={`relative card-border overflow-hidden rounded-2xl flex flex-col transition-all duration-500 ${!isExpanded ? 'animate-float' : ''}`}
                style={{
                    borderColor: `rgba(${color}, 0.5)`,
                    boxShadow: `0 0 100px -20px rgba(${color}, 0.5), 0 0 30px -10px rgba(${color}, 0.3)`,
                    background: `linear-gradient(135deg, rgba(${color},0.1), rgba(${color},0.05), rgba(0,0,0,0.8))`
                }}
            >
                {/* Header / Main Visual Area */}
                <div className={`p-4 flex transition-all duration-500 ${isExpanded ? 'flex-row items-center gap-6 border-b border-white/10' : 'justify-center relative'}`}>

                    {/* Visualizer (Small in Compact, Logo-like in Expanded) */}
                    <div
                        className={`rounded-xl inner-glow overflow-hidden relative group cursor-pointer transition-all duration-500
                        ${isExpanded ? 'w-16 h-16 flex-shrink-0' : 'w-full h-48'}`}
                        onClick={onExplore}
                        style={{
                            background: `linear-gradient(135deg, rgba(${color},0.1), rgba(${color},0.05), transparent)`,
                            borderColor: `rgba(${color}, 0.2)`,
                            borderWidth: '1px'
                        }}
                    >
                        {/* Animated grid background */}
                        <div className="absolute inset-0 opacity-30">
                            <div
                                className="w-full h-full animate-pulse transition-opacity duration-1000"
                                style={{
                                    backgroundImage: `linear-gradient(90deg, rgba(${color},0.3) 1px, transparent 1px), linear-gradient(rgba(${color},0.3) 1px, transparent 1px)`,
                                    backgroundSize: '15px 15px'
                                }}
                            />
                        </div>
                    </div>

                    {/* Expanded Header Content */}
                    {isExpanded && (
                        <div className="flex-1 animate-in fade-in slide-in-from-left-4 duration-300 flex items-center justify-between">
                            <div>
                                <span className="inline-block px-3 py-1 glass rounded-full text-xs font-medium mb-2"
                                    style={{
                                        color: `rgb(${color})`,
                                        borderColor: `rgba(${color}, 0.3)`,
                                        backgroundColor: `rgba(${color}, 0.05)`
                                    }}>
                                    {badge || subtitle}
                                </span>
                                <h3 className="text-2xl font-bold text-white">{title}</h3>
                            </div>

                            {/* PROBAR DEMO Button */}
                            {onTryDemo && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onTryDemo();
                                    }}
                                    className="px-8 py-3 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.3)] bg-white text-black hover:bg-white/90"
                                >
                                    PROBAR DEMO
                                    <ArrowUpRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {!isExpanded ? (
                        /* Compact View Content */
                        <motion.div
                            key="compact"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="p-4 text-left"
                        >
                            <div className="w-full h-px mb-4" style={{ background: `linear-gradient(90deg, transparent, rgba(${color}, 0.3), transparent)` }} />

                            <span className="inline-block px-3 py-1 glass rounded-full text-xs font-medium mb-3"
                                style={{
                                    color: `rgb(${color})`,
                                    borderColor: `rgba(${color}, 0.3)`,
                                    backgroundColor: `rgba(${color}, 0.05)`
                                }}>
                                {badge || subtitle}
                            </span>
                            <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
                            <p className="text-white/70 mb-4 leading-relaxed text-xs h-16 overflow-hidden line-clamp-4">
                                {description}
                            </p>
                            <div className="flex justify-between items-center">
                                <button
                                    onClick={onExplore}
                                    className="transition flex items-center text-xs font-medium glass px-3 py-1.5 rounded-lg hover:bg-white/10"
                                    style={{
                                        color: `rgb(${color})`,
                                        borderColor: `rgba(${color}, 0.3)`,
                                    }}
                                >
                                    Explorar
                                    <ArrowUpRight className="w-3 h-3 ml-1" />
                                </button>
                                <span className="text-white/50 text-xs glass px-2 py-1 rounded-full border border-white/10">
                                    Active
                                </span>
                            </div>
                        </motion.div>
                    ) : (
                        /* Expanded View Content */
                        <motion.div
                            key="expanded"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
                        >
                            {/* Column 1: Context & Problem */}
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-white/40 text-xs font-mono uppercase tracking-wider mb-2">Problema que Resuelve</h4>
                                    <p className="text-white/80 text-sm leading-relaxed">{moduleInfo?.problemItSolves}</p>
                                </div>
                                <div>
                                    <h4 className="text-white/40 text-xs font-mono uppercase tracking-wider mb-2">Contexto de Uso</h4>
                                    <p className="text-white/80 text-sm leading-relaxed">{moduleInfo?.contextOfUse}</p>
                                </div>
                            </div>

                            {/* Column 2: Implementation & Target */}
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-white/40 text-xs font-mono uppercase tracking-wider mb-2">Lo que Demuestra</h4>
                                    <p className="text-emerald-400 text-sm leading-relaxed font-medium">{moduleInfo?.whatItDemonstrates}</p>
                                </div>
                                <div>
                                    <h4 className="text-white/40 text-xs font-mono uppercase tracking-wider mb-2">Para Quién</h4>
                                    <p className="text-white/80 text-sm leading-relaxed">{moduleInfo?.publicTarget}</p>
                                </div>
                            </div>

                            {/* Column 3: Included / Not Included */}
                            <div className="space-y-4 bg-black/20 p-4 rounded-xl border border-white/5">
                                <div>
                                    <h4 className="text-white/40 text-xs font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <Check className="w-3 h-3 text-emerald-500" /> Incluido
                                    </h4>
                                    <ul className="space-y-1">
                                        {moduleInfo?.whatIncluded.map((item, i) => (
                                            <li key={i} className="text-white/60 text-xs">• {item}</li>
                                        ))}
                                    </ul>
                                </div>
                                {/* Close Button Section */}
                                <div className="pt-4 mt-auto">
                                    <button
                                        onClick={onExplore}
                                        className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium py-2 rounded-lg transition-colors border border-white/10"
                                    >
                                        <X className="w-3 h-3" /> Cerrar Detalle
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
