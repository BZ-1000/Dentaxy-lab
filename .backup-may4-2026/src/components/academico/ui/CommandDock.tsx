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

                {/* NEXT & GENERATE BUTTON (Green) 
                    Now takes full width when alone, flex-1 when with Back
                */}
                <motion.button
                    layout
                    onClick={() => {
                        // We first call onGenerate (which should handle the magic)
                        onGenerate();
                        // Then we call onNext directly or it can be handled by the parent
                        // For flexibility, let's just emit onNext
                        onNext();
                    }}
                    disabled={!canGoNext || isGenerating}
                    className={cn(
                        "h-14 rounded-full text-white font-semibold flex flex-1 items-center justify-center px-6 transition-all shadow-lg shadow-emerald-500/20 active:scale-95",
                        !canGoNext ? "bg-gray-300 pointer-events-none" : "bg-emerald-500 hover:bg-emerald-600"
                    )}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                    {isGenerating ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Redactando...</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between w-full">
                            <span className="text-lg flex-1 text-center font-bold">
                                {currentStep === totalSteps - 1 ? 'Finalizar' : 'Siguiente'}
                            </span>
                            {currentStep === totalSteps - 1 ? <Check className="w-5 h-5" /> : <ChevronRight className="w-6 h-6" />}
                        </div>
                    )}
                </motion.button>

            </div>
        </div>
    );
};
