import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

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

export const ArrowProgressLine: React.FC<ProgressLineProps> = ({
    totalSteps,
    currentStep,
    isGenerating,
    stepNames,
    onStepClick,
    stepStatuses,
    isScrolled = false
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to active step
    useEffect(() => {
        if (scrollRef.current) {
            const activeElement = scrollRef.current.children[currentStep] as HTMLElement;
            if (activeElement) {
                const containerWidth = scrollRef.current.clientWidth;
                const itemLeft = activeElement.offsetLeft;
                const itemWidth = activeElement.clientWidth;

                // Center the active item
                scrollRef.current.scrollTo({
                    left: itemLeft - (containerWidth / 2) + (itemWidth / 2),
                    behavior: 'smooth'
                });
            }
        }
    }, [currentStep]);

    return (
        <motion.div
            className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 z-50 select-none overflow-hidden"
            animate={{
                height: isScrolled ? 50 : 60,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <div
                ref={scrollRef}
                className="w-full h-full flex items-center overflow-x-auto no-scrollbar px-0"
            >
                {stepNames.map((name, index) => {
                    const status = stepStatuses[index];
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep; // Simplified completion logic based on index
                    const isLast = index === totalSteps - 1;

                    return (
                        <button
                            key={index}
                            onClick={() => onStepClick(index)}
                            className={cn(
                                "relative h-full flex items-center px-8 min-w-max transition-all duration-300 group outline-none",
                                // Clip Path for Arrow Shape
                                "clip-arrow",
                                // Colors based on state
                                isActive
                                    ? "bg-emerald-500 text-white z-30"
                                    : isCompleted
                                        ? "bg-emerald-50/80 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 z-20"
                                        : "bg-zinc-50 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 z-10",
                                // Offset to overlap arrows
                                index !== 0 && "-ml-4"
                            )}
                            style={{
                                clipPath: index === 0
                                    ? 'polygon(0% 0%, calc(100% - 15px) 0%, 100% 50%, calc(100% - 15px) 100%, 0% 100%)'
                                    : 'polygon(0% 0%, calc(100% - 15px) 0%, 100% 50%, calc(100% - 15px) 100%, 0% 100%, 15px 50%)',
                                paddingLeft: index === 0 ? '20px' : '36px',
                                paddingRight: '28px'
                            }}
                        >
                            <div className="flex flex-col items-start leading-none relative z-10">
                                <span className={cn(
                                    "text-[9px] uppercase tracking-wider font-bold mb-0.5 opacity-80",
                                    isActive ? "text-emerald-100" : ""
                                )}>
                                    Fase {index + 1}
                                </span>
                                <span className={cn(
                                    "text-xs font-bold truncate max-w-[150px]",
                                    isActive ? "text-white scale-105" : ""
                                )}>
                                    {name}
                                </span>
                            </div>

                            {/* Active Shine Effect */}
                            {isActive && !isGenerating && (
                                <motion.div
                                    className="absolute inset-0 bg-white/20"
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '100%' }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                    style={{ clipPath: 'inherit' }}
                                />
                            )}
                            {/* Generating Pulse */}
                            {isActive && isGenerating && (
                                <motion.div
                                    className="absolute inset-0 bg-emerald-400"
                                    animate={{ opacity: [0, 0.5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    style={{ clipPath: 'inherit' }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Shadows to indicate scrollability if needed (optional) */}
            <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent pointer-events-none z-50" />
            <div className="absolute top-0 left-0 h-full w-4 bg-gradient-to-r from-white dark:from-zinc-950 to-transparent pointer-events-none z-50" />

        </motion.div>
    );
};
