import React, { useRef, useEffect } from 'react';
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
    disableAutoScroll?: boolean;
}

import { useIsMobile } from '@/hooks/use-mobile';

export const ProgressLine = React.memo<ProgressLineProps>(({
    totalSteps,
    currentStep,
    isGenerating,
    stepNames,
    onStepClick,
    stepStatuses,
    isScrolled: isScrolled = false,
    disableAutoScroll = false
}) => {
    // Dimensions
    const ITEM_WIDTH = 28; // w-7
    const GAP_WIDTH = 8;   // gap-2

    // Total geometric width used for alignment
    const TOTAL_WIDTH = (totalSteps * ITEM_WIDTH) + ((totalSteps - 1) * GAP_WIDTH) + 16;

    // ULTRA-OPTIMIZED TRANSITION
    // Slightly faster, very snappy, no bounce on height
    const heightTransition = { duration: 0.25, ease: [0.42, 0, 0.58, 1] as any }; // easeInOut

    // Refs for auto-scrolling
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const activeStepRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!disableAutoScroll && activeStepRef.current && scrollContainerRef.current) {
            // Check if scrolling is needed (mobile)
            const container = scrollContainerRef.current;
            if (container.scrollWidth > container.clientWidth) {
                activeStepRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }
    }, [currentStep]);

    return (
        <motion.div
            className="w-full bg-transparent flex flex-col items-center justify-center select-none z-50 transition-colors will-change-[height] pointer-events-auto"
            animate={{
                // REMOVED ALL BORDERS -> Clean floating look, aligned h-12 with Documento Automático
                height: isScrolled ? 28 : 60, // Compact (24px) vs Full (48px - h-12)
            }}
            transition={heightTransition}
        >
            <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center h-full">

                {/* The Track Container - Responsive Scrollable & Centered */}
                <div 
                    ref={scrollContainerRef}
                    className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] grid items-center h-full"
                    style={{ gridTemplateColumns: "1fr auto 1fr" }}
                >
                    <div /> {/* Left Spacer to prevent clipping on overflow */}
                    
                    <div className="relative px-4 md:px-0 pt-0 pb-0">
                        <div
                            className="relative flex items-center justify-center transition-transform will-change-transform"
                            style={{ width: TOTAL_WIDTH, height: 56 }}
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

                                                                                    {/* 1.5 Breathing Organic Glow Aura (Sin cortes horizontales) */}
                            <motion.div
                                className="absolute left-0 top-1/2 -translate-y-1/2 bg-emerald-400/50 dark:bg-emerald-400/40 blur-md rounded-full pointer-events-none z-0"
                                initial={{ width: 0 }}
                                animate={{
                                    width: ((currentStep + 1) * ITEM_WIDTH) + (currentStep * GAP_WIDTH) + 20,
                                    height: isScrolled ? 10 : 34,
                                    opacity: isGenerating ? [0.4, 0.9, 0.4] : 0.7
                                }}
                                transition={{
                                    height: heightTransition,
                                    width: { type: "spring", stiffness: 150, damping: 14 },
                                    opacity: isGenerating ? { repeat: Infinity, duration: 2, ease: "easeInOut" } : { duration: 0.3 }
                                }}
                                style={{ transform: 'translate(-2px, -50%)' }}
                            />

                            {/* 2. The Active Green Pill */}
                            <motion.div
                                className="absolute left-0 top-1/2 -translate-y-1/2 bg-emerald-500 z-10 shadow-[0_2px_14px_rgba(16,185,129,0.45)] rounded-full overflow-hidden will-change-[height,width]"
                                initial={{ width: 0 }}
                                animate={{
                                    width: ((currentStep + 1) * ITEM_WIDTH) + (currentStep * GAP_WIDTH) + 16,
                                    height: isScrolled ? 4 : 32
                                }}
                                transition={{
                                    height: heightTransition,
                                    width: { type: "spring", stiffness: 150, damping: 14 }
                                }}
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
                                className="flex gap-2 items-center relative z-[60] will-change-opacity px-2 w-full"
                                animate={{
                                    opacity: isScrolled ? 0 : 1,
                                    scale: isScrolled ? 0.9 : 1,
                                    pointerEvents: isScrolled ? 'none' : 'auto'
                                }}
                                transition={heightTransition}
                            >
                                {Array.from({ length: totalSteps }).map((_, index) => {
                                    const isActive = index === currentStep;
                                    return (
                                        <button
                                            key={index}
                                            ref={isActive ? activeStepRef : null}
                                            onClick={() => onStepClick(index)}
                                            className={cn(
                                                "w-7 h-7 shrink-0 flex items-center justify-center text-[10px] font-bold transition-colors duration-300 rounded-full",
                                                index <= currentStep ? "text-white" : "text-gray-300 bg-gray-100 dark:bg-zinc-800"
                                            )}
                                        >
                                            {index + 1}
                                        </button>
                                    );
                                })}
                            </motion.div>
                        </div>
                    </div>

                    <div /> {/* Right Spacer */}
                </div>


            </div>
        </motion.div>
    );
}); // End of React.memo
