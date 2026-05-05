
import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
    children: React.ReactNode;
    className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, className }) => {
    return (
        <div className="min-h-screen bg-zinc-950 text-white overflow-hidden relative selection:bg-cyan-500/30 selection:text-cyan-200 font-mono">
            {/* Background ambient glow - Deep Zinc/Black theme */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-zinc-800/20 blur-[150px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-zinc-900/40 blur-[150px] rounded-full mix-blend-screen" />

                {/* Cyber accents - Subtle */}
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-cyan-900/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow" />
                <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] bg-purple-900/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            {/* Scanlines high-tech effect */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                    backgroundSize: '100% 3px, 3px 100%'
                }}
            />

            {/* Technical Grid overlay */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:radial-gradient(ellipse_at_center,white_10%,transparent_80%)]" />

            {/* Vignette */}
            <div className="fixed inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]" />

            <div className={cn("relative z-20 p-6 md:p-8 max-w-[1600px] mx-auto space-y-8", className)}>
                <header className="flex items-center justify-between mb-8 pb-4 border-b border-white/5 backdrop-blur-sm sticky top-0 z-30 bg-zinc-950/50">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                                DENTAXY <span className="text-cyan-400 text-sm align-top opacity-80">NEXUS</span>
                            </h1>
                            <p className="text-[10px] font-mono text-zinc-500 flex items-center gap-2 tracking-widest uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                System Online // Secure Link
                            </p>
                        </div>
                    </div>
                </header>

                <main className="min-h-[calc(100vh-140px)]">
                    {children}
                </main>
            </div>
        </div>
    );
};
