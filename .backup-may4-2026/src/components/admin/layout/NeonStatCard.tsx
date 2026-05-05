
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface NeonStatCardProps {
    title: string;
    value: string | number;
    subValue?: string;
    icon: LucideIcon;
    color?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose' | 'white';
    delay?: number;
    className?: string;
    trend?: 'up' | 'down' | 'neutral';
}

export const NeonStatCard: React.FC<NeonStatCardProps> = ({
    title,
    value,
    subValue,
    icon: Icon,
    color = 'white',
    delay = 0,
    className,
    trend
}) => {
    const colorStyles = {
        cyan: {
            border: 'border-cyan-500/30',
            bg: 'bg-cyan-950/10',
            text: 'text-cyan-400',
            glow: 'shadow-[0_0_20px_-5px_rgba(34,211,238,0.3)]',
            iconBg: 'bg-cyan-500/10'
        },
        purple: {
            border: 'border-purple-500/30',
            bg: 'bg-purple-950/10',
            text: 'text-purple-400',
            glow: 'shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)]',
            iconBg: 'bg-purple-500/10'
        },
        emerald: {
            border: 'border-emerald-500/30',
            bg: 'bg-emerald-950/10',
            text: 'text-emerald-400',
            glow: 'shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]',
            iconBg: 'bg-emerald-500/10'
        },
        amber: {
            border: 'border-amber-500/30',
            bg: 'bg-amber-950/10',
            text: 'text-amber-400',
            glow: 'shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]',
            iconBg: 'bg-amber-500/10'
        },
        rose: {
            border: 'border-rose-500/30',
            bg: 'bg-rose-950/10',
            text: 'text-rose-400',
            glow: 'shadow-[0_0_20px_-5px_rgba(244,63,94,0.3)]',
            iconBg: 'bg-rose-500/10'
        },
        white: {
            border: 'border-white/20',
            bg: 'bg-white/5',
            text: 'text-white',
            glow: 'shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)]',
            iconBg: 'bg-white/10'
        }
    };

    const style = colorStyles[color];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay }}
            className={cn(
                "relative overflow-hidden rounded-2xl border backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-lg",
                style.border,
                style.bg,
                style.glow,
                className
            )}
        >
            {/* Background noise/grid */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="relative p-6 flex items-start justify-between">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className={cn("p-2 rounded-lg", style.iconBg)}>
                            <Icon className={cn("w-5 h-5", style.text)} />
                        </div>
                        <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-400">
                            {title}
                        </h3>
                    </div>

                    <div className="space-y-1">
                        <div className={cn("text-3xl font-bold tracking-tighter tabular-nums", style.text)}>
                            {value}
                        </div>
                        {subValue && (
                            <p className="text-xs font-mono text-zinc-500">
                                {subValue}
                            </p>
                        )}
                    </div>
                </div>

                {/* Animated decorative element */}
                <div className="absolute right-0 top-0 h-16 w-16 opacity-10">
                    <Icon className="h-full w-full" />
                </div>

                {trend && (
                    <div className={cn(
                        "absolute bottom-4 right-4 text-xs font-mono px-2 py-1 rounded-full border border-white/10 bg-black/20",
                        trend === 'up' ? "text-emerald-400" : trend === 'down' ? "text-rose-400" : "text-zinc-400"
                    )}>
                        {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '•'}
                    </div>
                )}
            </div>

            {/* Progress/Activity Line at bottom — usa `scaleX` en lugar de `width` para GPU-only */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: Math.random() * 2
                    }}
                    style={{ transformOrigin: 'left' }}
                    className={cn("h-full opacity-50 will-change-transform", style.text.replace('text-', 'bg-'))}
                />
            </div>
        </motion.div>
    );
};
