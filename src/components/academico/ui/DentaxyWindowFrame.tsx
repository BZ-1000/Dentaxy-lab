import React from 'react';
import { motion } from 'framer-motion';

interface DentaxyWindowFrameProps {
    children: React.ReactNode;
    title?: string;
    // Keeping props for compatibility but interactions might be simplified or removed
    onClose?: () => void;
    onMinimize?: () => void;
    onMaximize?: () => void;
}

export const DentaxyWindowFrame: React.FC<DentaxyWindowFrameProps> = ({
    children,
    title,
}) => {
    return (
        <div className="flex flex-col h-full w-full bg-white dark:bg-zinc-950 overflow-hidden relative">
            {/* Clean Header - Optional, subtle separator or just title */}
            {title && (
                <div className="pt-6 pb-2 px-8 flex items-center justify-between bg-white dark:bg-zinc-950 sticky top-0 z-10">
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-tight uppercase opacity-80">
                        {title.split('•')[1] || title}
                    </div>
                    {/* Simplified status indicator instead of traffic lights if needed */}
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                    </div>
                </div>
            )}

            {/* Content Body - Minimalist, no heavy borders */}
            <div className="flex-1 overflow-hidden relative">
                <div className="absolute inset-0 overflow-y-auto custom-scrollbar px-4 sm:px-8 pb-32"> {/* Added padding-bottom for floating footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-4xl mx-auto py-4"
                    >
                        {children}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
