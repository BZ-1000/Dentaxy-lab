"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Lock, CheckCircle2, Zap, Trophy, Flame, ChevronRight, Sparkles, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SmartPlannerController, TreatmentQuest } from './SmartPlannerController';
import initialMissions from './missions.json'; // We still use this as default local missions

/* ═══════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════ */
const STORAGE_KEY = 'dentaxy_smart_planner_v2';

const CATEGORY_CONFIG: Record<string, { color: string; gradient: string; glow: string; badge: string; border: string }> = {
    'Main Quest': {
        color: 'emerald',
        gradient: 'from-emerald-500 to-teal-600',
        glow: 'shadow-emerald-500/20',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
        border: 'border-emerald-200/60',
    },
    'Side Quest': {
        color: 'blue',
        gradient: 'from-blue-500 to-indigo-600',
        glow: 'shadow-blue-500/20',
        badge: 'bg-blue-50 text-blue-700 border-blue-200/50',
        border: 'border-blue-200/60',
    },
    'Tech Quest': {
        color: 'violet',
        gradient: 'from-violet-500 to-purple-600',
        glow: 'shadow-violet-500/20',
        badge: 'bg-violet-50 text-violet-700 border-violet-200/50',
        border: 'border-violet-200/60',
    },
};

const PRIORITY_CONFIG: Record<string, { label: string; className: string }> = {
    'Critical': { label: 'CRÍTICO', className: 'bg-red-50 text-red-600 border-red-200/50 animate-pulse' },
    'High': { label: 'ALTO', className: 'bg-amber-50 text-amber-600 border-amber-200/50' },
    'Normal': { label: 'NORMAL', className: 'bg-slate-100 text-slate-500 border-slate-200/50' },
};

/* ═══════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════ */
const usePlanner = () => {
    const [quests, setQuests] = useState<TreatmentQuest[]>(() => {
        if (typeof window === 'undefined') return initialMissions as TreatmentQuest[];
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) return JSON.parse(stored) as TreatmentQuest[];
        } catch { /* fallback */ }
        return initialMissions as TreatmentQuest[];
    });

    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(quests)); } catch { /* noop */ }
    }, [quests]);

    const completeQuest = (id: string) => {
        setQuests(prev => prev.map(q => q.id === id && q.status === 'Active' ? { ...q, status: 'Completed' } : q));
    };

    const resetAll = () => {
        setQuests(initialMissions as TreatmentQuest[]);
    };

    const generateAIPlan = async () => {
        setIsGenerating(true);
        // Simulamos recoger contexto de fase 2 - esto normalmente vendría de un global state
        const mockContext = {
            chiefComplaint: "Dolor en molar inferior derecho al morder, sangrado de encías",
            diagnoses: [{ name: "Pulpitis Irreversible" }, { name: "Gingivitis Leve" }],
            medicalAlerts: ["Hipertensión"]
        };

        const aiGeneratedQuests = await SmartPlannerController.generateSmartPlan(mockContext);
        setQuests(aiGeneratedQuests);
        setIsGenerating(false);
    };

    const authorizePlan = () => {
        // Implementación Cero Costo - WebSocket a Caja (simulado para UI)
        alert("Plan autorizado. Se ha enviado notificación P2P local (Zero-Cost) a la Caja principal usando WebSockets/Notificaciones Push.");
    };

    const stats = {
        total: quests.length,
        active: quests.filter(q => q.status === 'Active').length,
        completed: quests.filter(q => q.status === 'Completed').length,
        totalXP: quests.filter(q => q.status === 'Completed').reduce((sum, q) => sum + q.reward_xp, 0),
        maxXP: quests.reduce((sum, q) => sum + q.reward_xp, 0),
        progress: quests.length > 0 ? Math.round((quests.filter(q => q.status === 'Completed').length / quests.length) * 100) : 0,
    };

    return { quests, completeQuest, resetAll, generateAIPlan, authorizePlan, isGenerating, stats };
};

/* ═══════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════ */

const ProgressBar = ({ progress, totalXP, maxXP }: { progress: number; totalXP: number; maxXP: number }) => (
    <div className="w-full">
        <div className="flex justify-between items-end mb-3">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Progreso del Tratamiento</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter mt-0.5">{progress}%</p>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Puntaje Clínico</p>
                <p className="text-lg font-black text-slate-700 tracking-tight">
                    <span className="text-emerald-600">{totalXP}</span>
                    <span className="text-slate-300 font-bold"> / {maxXP}</span>
                </p>
            </div>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
            <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 relative"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"
                    style={{ backgroundSize: '200% 100%' }} />
            </motion.div>
        </div>
    </div>
);

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) => (
    <motion.div
        whileHover={{ scale: 1.03, y: -2 }}
        className={cn(
            "bg-white rounded-[1.5rem] p-5 border border-slate-100 shadow-sm",
            "hover:shadow-lg transition-shadow duration-300"
        )}
    >
        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center mb-3", {
            'bg-amber-50 text-amber-500': color === 'amber',
            'bg-emerald-50 text-emerald-500': color === 'emerald',
            'bg-violet-50 text-violet-500': color === 'violet',
        })}>
            <Icon size={16} />
        </div>
        <p className="text-2xl font-black text-slate-900 tracking-tighter">{value}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{label}</p>
    </motion.div>
);

const QuestCard = ({ quest, onComplete }: { quest: TreatmentQuest; onComplete: () => void }) => {
    const [justCompleted, setJustCompleted] = useState(false);
    const cat = CATEGORY_CONFIG[quest.category] || CATEGORY_CONFIG['Tech Quest'];
    const pri = PRIORITY_CONFIG[quest.priority] || PRIORITY_CONFIG['Normal'];
    const isActive = quest.status === 'Active';
    const isCompleted = quest.status === 'Completed';
    const isLocked = quest.status === 'Locked';

    const handleComplete = () => {
        setJustCompleted(true);
        setTimeout(() => {
            onComplete();
            setJustCompleted(false);
        }, 800);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={isActive ? { scale: 1.01, y: -3 } : {}}
            className={cn(
                "relative bg-white rounded-[2rem] p-6 border transition-all duration-500 group overflow-hidden",
                isActive && `${cat.border} shadow-lg ${cat.glow} hover:shadow-xl`,
                isCompleted && "border-slate-100 bg-slate-50/50 opacity-70",
                isLocked && "border-slate-100 bg-slate-50/30 opacity-50",
            )}
        >
            {/* Glow Line Top */}
            {isActive && (
                <motion.div
                    className={cn("absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r", cat.gradient)}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
            )}

            {/* Completion Flash */}
            <AnimatePresence>
                {justCompleted && (
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-400/10 rounded-[2rem] z-10 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        >
                            <div className="w-16 h-16 rounded-full bg-white shadow-2xl shadow-emerald-500/30 flex items-center justify-center">
                                <Sparkles size={28} className="text-emerald-500" />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Row */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0",
                        isActive && "bg-slate-50 shadow-sm border border-slate-100",
                        isCompleted && "bg-emerald-50 border border-emerald-100",
                        isLocked && "bg-slate-100",
                    )}>
                        {isLocked ? <Lock size={16} className="text-slate-300" /> : isCompleted ? <CheckCircle2 size={18} className="text-emerald-500" /> : <span className="text-xl">{quest.icon || "⚙️"}</span>}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className={cn("text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-full border", cat.badge)}>
                                {quest.category}
                            </span>
                            <span className={cn("text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-full border", pri.className)}>
                                {pri.label}
                            </span>
                        </div>
                        <h3 className={cn(
                            "text-base font-black tracking-tight",
                            isCompleted ? "text-slate-400 line-through" : "text-slate-900"
                        )}>
                            {quest.title}
                        </h3>
                    </div>
                </div>
                <div className={cn(
                    "text-right shrink-0 ml-4",
                    isCompleted ? "opacity-50" : ""
                )}>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Valor</p>
                    <p className={cn("text-sm font-black tracking-tight", isCompleted ? "text-emerald-500" : "text-amber-500")}>
                        +{quest.reward_xp}
                    </p>
                </div>
            </div>

            {/* Description */}
            <p className={cn(
                "text-xs leading-relaxed mb-4",
                isCompleted ? "text-slate-300" : "text-slate-500"
            )}>
                {quest.description}
            </p>

            {/* Action Button */}
            {isActive && !justCompleted && (
                <motion.button
                    onClick={handleComplete}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                        "w-full py-3 rounded-2xl font-black text-xs uppercase tracking-[0.15em] text-white transition-all",
                        `bg-gradient-to-r ${cat.gradient} shadow-lg ${cat.glow}`,
                        "flex items-center justify-center gap-2 group/btn"
                    )}
                >
                    <span>COMPLETAR ETAPA</span>
                    <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </motion.button>
            )}

            {isCompleted && (
                <div className="w-full py-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.15em] flex items-center justify-center gap-1.5">
                        <CheckCircle2 size={12} /> ETAPA COMPLETADA
                    </span>
                </div>
            )}

            {isLocked && (
                <div className="w-full py-2.5 rounded-2xl bg-slate-50 border border-slate-200/50 text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] flex items-center justify-center gap-1.5">
                        <Lock size={12} /> BLOQUEADA HASTA ETAPA ANTERIOR
                    </span>
                </div>
            )}
        </motion.div>
    );
};

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
export const QuestEngine = () => {
    const { quests, completeQuest, resetAll, generateAIPlan, authorizePlan, isGenerating, stats } = usePlanner();

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-8 border-b border-slate-50 pb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <BrainCircuit className="text-amber-500" size={28} /> Planificador Inteligente
                    </h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Generación de Planes con IA & Contexto Local</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <motion.button
                        onClick={generateAIPlan}
                        disabled={isGenerating}
                        whileHover={!isGenerating ? { scale: 1.05 } : {}}
                        whileTap={!isGenerating ? { scale: 0.95 } : {}}
                        className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm transition-all flex items-center gap-2", isGenerating ? "bg-slate-100 text-slate-400 border-slate-200" : "bg-gradient-to-r from-violet-600 to-indigo-600 border-indigo-700 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50")}
                    >
                        {isGenerating ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Sparkles size={14} /></motion.div> GENERANDO...</> : <><BrainCircuit size={14} /> I.A. PLANNER</>}
                    </motion.button>

                    <div className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100 shadow-sm">
                        Smart Planner 2.0
                    </div>

                    {stats.completed > 0 && (
                        <motion.button
                            onClick={resetAll}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 rounded-xl text-[10px] font-bold text-slate-400 hover:text-slate-600 border border-slate-200 hover:border-slate-300 transition-all"
                        >
                            Reset
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm mb-6">
                <ProgressBar progress={stats.progress} totalXP={stats.totalXP} maxXP={stats.maxXP} />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <StatCard icon={Flame} label="Etapas Activas" value={stats.active} color="amber" />
                <StatCard icon={Zap} label="Valor del Plan" value={stats.totalXP} color="emerald" />
                <StatCard icon={Trophy} label="Completadas" value={stats.completed} color="violet" />
            </div>

            {/* Missions Grid */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {quests.map(quest => (
                        <QuestCard
                            key={quest.id}
                            quest={quest}
                            onComplete={() => completeQuest(quest.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Authorization Action (Zero Cost Flow) */}
            <AnimatePresence>
                {stats.progress > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-8 flex justify-center"
                    >
                        <motion.button
                            onClick={authorizePlan}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="bg-slate-900 text-white shadow-xl shadow-slate-900/20 px-10 py-4 rounded-2xl flex items-center gap-3 font-black text-sm uppercase tracking-widest"
                        >
                            <Lock size={18} className="text-emerald-400" />
                            <span>Autorizar Plan a Caja (Local Auth)</span>
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* All Complete Message */}
            <AnimatePresence>
                {stats.progress === 100 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-[2.5rem] p-10 border border-emerald-100 text-center"
                    >
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="text-5xl mb-4"
                        >
                            🏆
                        </motion.div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">Tratamiento Clínico Finalizado</h3>
                        <p className="text-sm text-slate-500 font-medium">Has completado todas las etapas de este planificador para el paciente.</p>
                        <p className="text-lg font-black text-emerald-600 mt-3">Valor Total: {stats.maxXP}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default QuestEngine;
