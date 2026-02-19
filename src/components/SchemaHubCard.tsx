import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, Check } from 'lucide-react';

// ─── Preview: Antecedentes Heredo-Familiares — clonado de FormulariosSection ──
interface FamiliarState {
    status: string;
    condicion?: string;
}

const HeredoFamiliaresPreview = () => {
    const [animationStep, setAnimationStep] = useState(0);
    const [states, setStates] = useState<Record<string, FamiliarState>>({
        padre: { status: '' },
        madre: { status: '' },
        abuelo: { status: '' },
    });
    const [isTyping, setIsTyping] = useState(false);
    const [typedText, setTypedText] = useState('');
    const [showCondicionInput, setShowCondicionInput] = useState(false);
    const [condicionText, setCondicionText] = useState('');

    const finalText = 'El Padre está vivo y aparentemente sano. La Madre está viva con diagnóstico de Diabetes mellitus tipo 2 bajo tratamiento médico. El Abuelo Paterno finado, causa desconocida.';

    const familiares = [
        { key: 'padre', label: 'Padre' },
        { key: 'madre', label: 'Madre' },
        { key: 'abuelo', label: 'Abuelo Paterno' },
    ];

    // Loop continuo (sin isInView — siempre activo en la card)
    useEffect(() => {
        let isCancelled = false;

        const reset = () => {
            setAnimationStep(0);
            setStates({ padre: { status: '' }, madre: { status: '' }, abuelo: { status: '' } });
            setIsTyping(false);
            setTypedText('');
            setShowCondicionInput(false);
            setCondicionText('');
        };

        const runAnimation = async () => {
            while (!isCancelled) {
                reset();
                await new Promise(r => setTimeout(r, 1000));

                // Padre: Vivo y Sano
                if (isCancelled) return;
                setAnimationStep(1);
                await new Promise(r => setTimeout(r, 300));
                if (isCancelled) return;
                setStates(prev => ({ ...prev, padre: { status: 'vivoSano' } }));

                // Madre: Condición + typewriting "Diabetes mellitus tipo 2"
                await new Promise(r => setTimeout(r, 800));
                if (isCancelled) return;
                setAnimationStep(2);
                await new Promise(r => setTimeout(r, 300));
                if (isCancelled) return;
                setStates(prev => ({ ...prev, madre: { status: 'condicion' } }));
                await new Promise(r => setTimeout(r, 400));
                if (isCancelled) return;
                setShowCondicionInput(true);
                const condition = 'Diabetes mellitus tipo 2';
                for (let i = 0; i <= condition.length; i++) {
                    if (isCancelled) return;
                    await new Promise(r => setTimeout(r, 50));
                    setCondicionText(condition.slice(0, i));
                }
                if (isCancelled) return;
                setStates(prev => ({ ...prev, madre: { status: 'condicion', condicion: condition } }));

                // Abuelo: Finado
                await new Promise(r => setTimeout(r, 800));
                if (isCancelled) return;
                setAnimationStep(3);
                await new Promise(r => setTimeout(r, 300));
                if (isCancelled) return;
                setStates(prev => ({ ...prev, abuelo: { status: 'finado' } }));

                // Botón Generar
                await new Promise(r => setTimeout(r, 600));
                if (isCancelled) return;
                setAnimationStep(4);

                // Typewriting del texto generado
                await new Promise(r => setTimeout(r, 400));
                if (isCancelled) return;
                setIsTyping(true);
                for (let i = 0; i <= finalText.length; i++) {
                    if (isCancelled) return;
                    await new Promise(r => setTimeout(r, 22));
                    setTypedText(finalText.slice(0, i));
                }

                // Pausa antes de reiniciar
                await new Promise(r => setTimeout(r, 3000));
            }
        };

        const timeout = setTimeout(runAnimation, 600);
        return () => {
            isCancelled = true;
            clearTimeout(timeout);
        };
    }, []);

    return (
        <div className="w-full h-full overflow-y-auto flex items-start justify-center p-2">
            <div className="bg-card border border-border rounded-xl p-3 shadow-lg w-full">
                {/* Barra de ventana */}
                <div className="flex items-center gap-1.5 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    <span className="ml-2 text-[10px] text-muted-foreground truncate">Antecedentes Heredo-Familiares</span>
                </div>

                {/* Familiares */}
                <div className="space-y-2 mb-3">
                    {familiares.map((fam, i) => {
                        const state = states[fam.key as keyof typeof states];
                        const isCurrentStep = animationStep === i + 1;
                        return (
                            <motion.div key={fam.key} className="flex flex-col gap-1">
                                <span className="text-[11px] font-medium text-foreground">{fam.label}</span>
                                <div className="flex flex-wrap gap-1">
                                    <motion.button
                                        animate={isCurrentStep && fam.key === 'padre'
                                            ? { scale: [1, 0.95, 1], boxShadow: '0 0 0 3px rgba(16,185,129,0.3)' }
                                            : {}}
                                        className={`px-2 py-1 rounded-full text-[10px] font-medium border transition-all ${state.status === 'vivoSano'
                                            ? 'bg-emerald-500 text-white border-emerald-500'
                                            : 'bg-background text-muted-foreground border-border'}`}
                                    >
                                        Vivo y Sano
                                    </motion.button>
                                    <motion.button
                                        animate={isCurrentStep && fam.key === 'madre'
                                            ? { scale: [1, 0.95, 1], boxShadow: '0 0 0 3px rgba(59,130,246,0.3)' }
                                            : {}}
                                        className={`px-2 py-1 rounded-full text-[10px] font-medium border transition-all ${state.status === 'condicion'
                                            ? 'bg-blue-500 text-white border-blue-500'
                                            : 'bg-background text-muted-foreground border-border'}`}
                                    >
                                        Condición
                                    </motion.button>
                                    <motion.button
                                        animate={isCurrentStep && fam.key === 'abuelo'
                                            ? { scale: [1, 0.95, 1], boxShadow: '0 0 0 3px rgba(239,68,68,0.3)' }
                                            : {}}
                                        className={`px-2 py-1 rounded-full text-[10px] font-medium border transition-all ${state.status === 'finado'
                                            ? 'bg-red-500 text-white border-red-500'
                                            : 'bg-background text-muted-foreground border-border'}`}
                                    >
                                        Finado
                                    </motion.button>
                                </div>

                                {/* Input de condición (Madre) con typewriting */}
                                {fam.key === 'madre' && showCondicionInput && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-0.5"
                                    >
                                        <div className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-[10px] text-blue-700 dark:text-blue-300">
                                            {condicionText}
                                            {condicionText.length < 'Diabetes mellitus tipo 2'.length && (
                                                <motion.span
                                                    animate={{ opacity: [1, 0] }}
                                                    transition={{ repeat: Infinity, duration: 0.5 }}
                                                    className="inline-block w-0.5 h-3 bg-blue-500 ml-0.5 align-middle"
                                                />
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Botón Generar */}
                <motion.button
                    animate={animationStep === 4
                        ? { scale: [1, 0.95, 1], backgroundColor: 'hsl(var(--primary))' }
                        : {}}
                    transition={{ duration: 0.2 }}
                    className={`w-full py-2 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all ${animationStep >= 4
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'}`}
                >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    Generar Redacción IA
                </motion.button>

                {/* Texto generado con typewriting */}
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={isTyping ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 p-2 bg-primary/5 rounded-lg border border-primary/20 overflow-hidden"
                >
                    <p className="text-[10px] text-muted-foreground italic min-h-[36px]">
                        "{typedText}
                        {isTyping && typedText.length < finalText.length && (
                            <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.5 }}
                                className="inline-block w-0.5 h-3 bg-primary ml-0.5 align-middle"
                            />
                        )}
                        "
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

// ─── Preview: Video DICOM en loop ─────────────────────────────────────────────
const DicomVideoPreview = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

    return (
        <div className="w-full h-full relative overflow-hidden rounded-xl">
            <video
                ref={videoRef}
                src="/brand/Animacion de radiografias preview.webm"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.95) contrast(1.05)' }}
            />
            <div className="absolute inset-0 pointer-events-none rounded-xl"
                style={{ boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3)' }}
            />
        </div>
    );
};



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
                            background: title === 'DICOM'
                                ? 'transparent'
                                : `linear-gradient(135deg, rgba(${color},0.1), rgba(${color},0.05), transparent)`,
                            borderColor: `rgba(${color}, 0.2)`,
                            borderWidth: '1px'
                        }}
                    >
                        {/* Animated grid background — solo si NO es DICOM */}
                        {title !== 'DICOM' && (
                            <div className="absolute inset-0 opacity-30">
                                <div
                                    className="w-full h-full animate-pulse transition-opacity duration-1000"
                                    style={{
                                        backgroundImage: `linear-gradient(90deg, rgba(${color},0.3) 1px, transparent 1px), linear-gradient(rgba(${color},0.3) 1px, transparent 1px)`,
                                        backgroundSize: '15px 15px'
                                    }}
                                />
                            </div>
                        )}

                        {/* Preview DENTAXY AI: Animación Heredo-Familiares */}
                        {title === 'DENTAXY AI' && !isExpanded && (
                            <div className="absolute inset-0 z-10">
                                <HeredoFamiliaresPreview />
                            </div>
                        )}

                        {/* Preview DICOM: Video en loop */}
                        {title === 'DICOM' && !isExpanded && (
                            <div className="absolute inset-0 z-10">
                                <DicomVideoPreview />
                            </div>
                        )}
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
