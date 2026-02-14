import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ModuleCarouselCardProps {
    title: string;
    subtitle: string;
    description: string;
    badge: string;
    accentColor: string;
    gradient: string;
    glowColor: string;
    icon: LucideIcon;
    onExplore?: () => void;
    isActive?: boolean;
}

export const ModuleCarouselCard: React.FC<ModuleCarouselCardProps> = ({
    title,
    subtitle,
    badge,
    accentColor,
    onExplore,
    isActive = true,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-xs"
        >
            <div
                className="relative overflow-hidden rounded-2xl flex flex-col animate-float"
                style={{
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(20,20,20,0.9))',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                {/* Preview Area with Neon Border */}
                <div className="p-4 flex justify-center relative">
                    <div
                        className="w-full h-48 rounded-xl overflow-hidden relative"
                        style={{
                            background: 'linear-gradient(135deg, rgba(80,80,80,0.3), rgba(40,40,40,0.5))',
                            border: `2px solid ${accentColor}`,
                            boxShadow: `0 0 20px ${accentColor}80, inset 0 0 20px rgba(255,255,255,0.05)`,
                        }}
                    >
                        {/* Animated grid background */}
                        <div className="absolute inset-0 opacity-10">
                            <div
                                className="w-full h-full animate-pulse"
                                style={{
                                    backgroundImage:
                                        'linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)',
                                    backgroundSize: '15px 15px',
                                }}
                            />
                        </div>

                        {/* Glow gradient overlay */}
                        <div
                            className="absolute inset-0 opacity-30"
                            style={{
                                background: `radial-gradient(circle at center, ${accentColor}40, transparent 70%)`,
                            }}
                        />
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                {/* Content */}
                <div className="p-4">
                    {/* Badge */}
                    <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 border"
                        style={{
                            color: accentColor,
                            borderColor: `${accentColor}30`,
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        {badge}
                    </span>

                    {/* Title */}
                    <h3 className="text-lg font-medium text-white mb-2">{title}</h3>

                    {/* Subtitle */}
                    <p className="text-white/70 mb-4 leading-relaxed text-xs">
                        {subtitle}
                    </p>

                    {/* Actions */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={onExplore}
                            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all"
                            style={{
                                color: accentColor,
                                borderColor: `${accentColor}30`,
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            Explorar
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M5 12H19M19 12L12 5M19 12L12 19"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        <span
                            className="text-xs px-2 py-1 rounded-full border border-white/10"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: 'rgba(255, 255, 255, 0.5)',
                            }}
                        >
                            Activo
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
