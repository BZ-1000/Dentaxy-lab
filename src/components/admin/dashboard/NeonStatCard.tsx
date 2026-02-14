
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NeonStatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    glowColor?: 'cyan' | 'purple' | 'emerald' | 'rose';
    className?: string;
}

export const NeonStatCard: React.FC<NeonStatCardProps> = ({
    label,
    value,
    icon,
    trend,
    trendValue,
    glowColor = 'cyan',
    className,
}) => {
    const glowStyles = {
        cyan: 'shadow-[0_0_20px_-5px_theme(colors.cyan.500)] border-cyan-500/50',
        purple: 'shadow-[0_0_20px_-5px_theme(colors.purple.500)] border-purple-500/50',
        emerald: 'shadow-[0_0_20px_-5px_theme(colors.emerald.500)] border-emerald-500/50',
        rose: 'shadow-[0_0_20px_-5px_theme(colors.rose.500)] border-rose-500/50',
    };

    const textglowStyles = {
        cyan: 'drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]',
        purple: 'drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]',
        emerald: 'drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]',
        rose: 'drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]',
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={cn(
                "relative overflow-hidden rounded-xl border bg-black/40 backdrop-blur-xl p-6 transition-all duration-300 group",
                glowStyles[glowColor],
                className
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-1">{label}</p>
                    <h3 className={cn("text-4xl font-bold text-white tracking-tighter", textglowStyles[glowColor])}>
                        {value}
                    </h3>
                    {trend && (
                        <div className="flex items-center gap-2 mt-2">
                            <span className={cn(
                                "text-xs font-medium px-1.5 py-0.5 rounded",
                                trend === 'up' ? "bg-emerald-500/20 text-emerald-400" :
                                    trend === 'down' ? "bg-rose-500/20 text-rose-400" : "bg-zinc-500/20 text-zinc-400"
                            )}>
                                {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {trendValue}
                            </span>
                            <span className="text-[10px] text-zinc-600 font-mono">VS LAST HOUR</span>
                        </div>
                    )}
                </div>

                <div className={cn(
                    "p-3 rounded-lg bg-white/5 backdrop-blur-md border border-white/10",
                    "group-hover:bg-white/10 transition-colors duration-300"
                )}>
                    {React.cloneElement(icon as React.ReactElement, {
                        className: cn("w-6 h-6", `text-${glowColor}-400`) // Fallback or dynamic
                    })}
                </div>
            </div>

            {/* Integrative sparkline or subtle graph background could go here */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
        </motion.div>
    );
};
