import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export type StepStatus = 'completed' | 'skipped' | 'pending' | 'active';

interface ProgressLineProps {
    totalSteps: number;
    currentStep: number;
    isGenerating: boolean;
    stepNames: string[];
    onStepClick: (index: number) => void;
    stepStatuses: StepStatus[];
    isScrolled?: boolean;
}

import { useIsMobile } from '@/hooks/use-mobile';

export const ProgressLine = React.memo<ProgressLineProps>(({
    totalSteps,
    currentStep,
    isGenerating,
    stepNames,
    onStepClick,
    stepStatuses,
    isScrolled: parentIsScrolled = false
}) => {
    const isMobile = useIsMobile();
    const isScrolled = isMobile ? true : parentIsScrolled;
    // Dimensions
    const ITEM_WIDTH = 28; // w-7
    const GAP_WIDTH = 8;   // gap-2

    // Total geometric width used for alignment
    const TOTAL_WIDTH = (totalSteps * ITEM_WIDTH) + ((totalSteps - 1) * GAP_WIDTH) + 16;

    // ULTRA-OPTIMIZED TRANSITION
    // Slightly faster, very snappy, no bounce on height
    const heightTransition = { duration: 0.25, ease: [0.42, 0, 0.58, 1] as any }; // easeInOut

    return (
        <motion.div
            className="w-full bg-white dark:bg-zinc-950 flex flex-col items-center justify-center select-none z-50 transition-colors will-change-[height]"
            animate={{
                // REMOVED ALL BORDERS -> Clean floating look
                height: isScrolled ? 16 : 84, // Compact (16px) vs Full (84px)
            }}
            transition={heightTransition}
        >
            <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center h-full">

                {/* The Track Container - Always Centered Vertically */}
                <div
                    className="relative flex items-center justify-center transition-transform will-change-transform"
                    style={{ width: TOTAL_WIDTH, height: 32 }}
                >

                    {/* 1. Gray Track Line */}
                    <motion.div
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-100 dark:bg-zinc-800 rounded-full z-0 block"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: isScrolled ? 1 : 0,
                            height: isScrolled ? 4 : 32,
                            width: TOTAL_WIDTH
                        }}
                        transition={heightTransition}
                    />

                    {/* 2. The Active Green Pill */}
                    <motion.div
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-emerald-500 z-10 shadow-lg shadow-emerald-500/30 rounded-full overflow-hidden will-change-[height,width]"
                        initial={{ width: 0 }}
                        animate={{
                            width: ((currentStep + 1) * ITEM_WIDTH) + (currentStep * GAP_WIDTH) + 16,
                            height: isScrolled ? 4 : 32
                        }}
                        transition={heightTransition}
                    >
                        {/* Shimmer Effect */}
                        {isGenerating && (
                            <motion.div
                                className="absolute inset-0 bg-white/30 skew-x-12"
                                initial={{ x: '-100%' }}
                                animate={{ x: '200%' }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            />
                        )}
                    </motion.div>

                    {/* 3. The Steps/Numbers (Fade out on scroll) */}
                    <motion.div
                        className="flex gap-2 items-center relative z-20 will-change-opacity"
                        animate={{
                            opacity: isScrolled ? 0 : 1,
                            scale: isScrolled ? 0.9 : 1,
                            pointerEvents: isScrolled ? 'none' : 'auto'
                        }}
                        transition={heightTransition}
                    >
                        {Array.from({ length: totalSteps }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => onStepClick(index)}
                                className={cn(
                                    "w-7 h-7 flex items-center justify-center text-[10px] font-bold transition-colors duration-300 rounded-full",
                                    index <= currentStep ? "text-white" : "text-gray-300 bg-gray-100 dark:bg-zinc-800"
                                )}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </motion.div>
                </div>

                {/* 4. Section Title TRANSFORMATION */}
                <AnimatePresence mode="wait">
                    {!isScrolled ? (
                        /* STATE A: BIG CENTERED BANNER (Not Scrolled) */
                        <motion.div
                            key="big-title"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0, height: 24 }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-full text-center mt-6 px-4 max-w-[90vw] mx-auto overflow-hidden"
                        >
                            <span className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block truncate">
                                {stepNames[currentStep]}
                            </span>
                        </motion.div>
                    ) : (
                        /* STATE B: CENTERED BADGE TITLE (Scrolled) */
                        <motion.div
                            key="small-title"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                            className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center z-20 pointer-events-none" // Absolute full width wrapper for perfect centering
                        >
                            <span className="bg-gray-100 dark:bg-zinc-800 px-3 py-0.5 rounded-full text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest whitespace-nowrap">
                                {stepNames[currentStep]}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </motion.div>
    );
}); // End of React.memo
