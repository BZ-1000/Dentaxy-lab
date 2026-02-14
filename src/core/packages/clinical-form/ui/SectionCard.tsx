import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Maximize2, Minimize2, ChevronDown, ChevronUp } from 'lucide-react';

export type ViewMode = 'form' | 'redaction';

interface SectionCardProps {
    title: string;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    children: React.ReactNode;
    redactionPreview?: string | React.ReactNode;
    isExpanded?: boolean;
    onToggleExpand?: () => void;
    hideGlobalToggle?: boolean;
}

export const SectionCard: React.FC<SectionCardProps> = ({
    title,
    viewMode,
    onViewModeChange,
    children,
    redactionPreview,
    isExpanded = true,
    onToggleExpand,
    hideGlobalToggle = false
}) => {
    return (
        <div className="w-full max-w-4xl mx-auto transition-all duration-500">

            {/* Content Body (Flat, no card borders) */}
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-2"> {/* Minimal padding */}
                            {viewMode === 'form' ? (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    {children}
                                </div>
                            ) : (
                                <div className="min-h-[300px] animate-in zoom-in-95 duration-300">
                                    {
                                        redactionPreview ? (
                                            typeof redactionPreview === 'string' ? (
                                                <div
                                                    className="prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 leading-relaxed font-mplus"
                                                    dangerouslySetInnerHTML={{ __html: redactionPreview }}
                                                />
                                            ) : (
                                                <div className="prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 leading-relaxed font-mplus">
                                                    {redactionPreview}
                                                </div>
                                            )
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-3 opacity-60">
                                                <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                                                <p className="text-sm">Esperando datos...</p>
                                            </div>
                                        )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>



        </div >
    );
};
