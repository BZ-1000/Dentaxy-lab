
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { NeonStatCard } from './NeonStatCard';
import { Activity, ShieldCheck, Globe, Server, TrendingUp, Users } from 'lucide-react';

export const GlobalCommandCenter: React.FC = () => {
    const [metrics, setMetrics] = useState<{
        activeNodes: number;
        opsPerMinute: number;
        threatLevel: string;
        globalReach: number;
    }>({
        activeNodes: 892,
        opsPerMinute: 4200,
        threatLevel: 'LOW',
        globalReach: 1240,
    });

    useEffect(() => {
        // Simulation engine for "live" feel
        const interval = setInterval(() => {
            setMetrics(prev => ({
                activeNodes: prev.activeNodes + Math.floor(Math.random() * 5) - 2,
                opsPerMinute: 4000 + Math.floor(Math.random() * 500),
                threatLevel: Math.random() > 0.95 ? 'MODERATE' : 'LOW',
                globalReach: prev.globalReach + (Math.random() > 0.8 ? 1 : 0),
            }));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <NeonStatCard
                    label="GLOBAL REACH"
                    value={metrics.globalReach.toLocaleString()}
                    icon={<Globe />}
                    trend="up"
                    trendValue="+12%"
                    glowColor="cyan"
                />
                <NeonStatCard
                    label="ACTIVE NODES"
                    value={metrics.activeNodes}
                    icon={<Server />}
                    trend="neutral"
                    trendValue="STABLE"
                    glowColor="emerald"
                />
                <NeonStatCard
                    label="OPS / MINUTE"
                    value={(metrics.opsPerMinute / 1000).toFixed(1) + 'k'}
                    icon={<Activity />}
                    trend="up"
                    trendValue="+5.4%"
                    glowColor="purple"
                />
                <NeonStatCard
                    label="THREAT LEVEL"
                    value={metrics.threatLevel}
                    icon={<ShieldCheck />}
                    trend="neutral"
                    trendValue="SECURE"
                    glowColor={metrics.threatLevel === 'LOW' ? 'emerald' : 'rose'}
                />
            </div>

            {/* Placeholder for Network Graph */}
            <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-6 h-64 md:h-96 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <p className="z-10 text-zinc-500 font-mono text-sm animate-pulse">
                    &lt; NETWORK_VISUALIZATION_MODULE__LOADING /&gt;
                </p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-scan" />
            </div>
        </div>
    );
};
