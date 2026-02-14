import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Wand2, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CommandDockProps {
    onNext: () => void;
    onPrev: () => void;
    onGenerate: () => void;
    currentStep: number;
    totalSteps: number;
    nextLabel: string;
    isGenerating: boolean;
    canGoNext: boolean;
    canGoPrev: boolean;
}

export const CommandDock: React.FC<CommandDockProps> = ({
    onNext,
    onPrev,
    onGenerate,
    currentStep,
    totalSteps,
    nextLabel,
    isGenerating,
    canGoNext,
    canGoPrev
}) => {

    // We treat the "Dock" as the button container from the snippet.

    return (
        <div className="absolute bottom-0 left-0 w-full z-[80] p-6 pb-12 pointer-events-none flex flex-col items-center justify-end bg-gradient-to-t from-white via-white/90 to-transparent dark:from-black dark:via-black/90 h-40">

            <div className="pointer-events-auto flex items-center gap-3 w-full max-w-lg">

                {/* BACK BUTTON (Spring Expand/Contract) */}
                <AnimatePresence mode="popLayout">
                    {canGoPrev && (
                        <motion.button
                            initial={{ opacity: 0, width: 0, scale: 0.8 }}
                            animate={{ opacity: 1, width: "64px", scale: 1 }}
                            exit={{ opacity: 0, width: 0, scale: 0.8 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 15,
                                mass: 0.8,
                                bounce: 0.25
                            }}
                            onClick={onPrev}
                            disabled={isGenerating}
                            className="h-14 flex items-center justify-center bg-gray-100 dark:bg-zinc-800 text-black dark:text-white font-semibold rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors shadow-sm"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* GENERATE BUTTON (Center Piece - White with Black Text) */}
                {/* Only show if not generating? Or always? User implies it's a main action. */}
                {/* Let's make it the central action if not auto-generating. */}
                <motion.button
                    layout
                    onClick={onGenerate}
                    disabled={isGenerating}
                    className={cn(
                        "h-14 flex-1 rounded-full font-bold text-sm shadow-xl transition-all border border-black/5 dark:border-white/10",
                        isGenerating
                            ? "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
                            : "bg-white text-black hover:bg-gray-50 active:scale-95 border-2 border-transparent hover:border-black/5"
                        // User requested: "generar todas las redacciones debe ir color blanco con letras negras"
                    )}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                    {isGenerating ? (
                        <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-black" />
                            <span>Generando...</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2">
                            <span>Ver Redacción IA</span>
                        </div>
                    )}
                </motion.button>

                {/* NEXT BUTTON (Spring Animation) */}
                <motion.button
                    layout
                    onClick={onNext}
                    disabled={!canGoNext || isGenerating}
                    className={cn(
                        "h-14 rounded-full text-white font-semibold transition-colors flex items-center justify-center px-6 shadow-lg shadow-emerald-500/20",
                        !canGoNext ? "bg-gray-300 pointer-events-none w-14 px-0" : "bg-emerald-500 hover:bg-emerald-600 w-auto min-w-[120px]"
                    )}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                    <div className="flex items-center gap-2">
                        <span>{currentStep === totalSteps - 1 ? 'Finalizar' : 'Siguiente'}</span>
                        {currentStep === totalSteps - 1 ? <Check className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                </motion.button>

            </div>
        </div>
    );
};
