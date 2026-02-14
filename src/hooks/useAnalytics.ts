import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { adminQueryKeys } from '@/lib/queryClient';

export interface AnalyticsData {
    totalDemos: number;
    activeUsers: number;
    systemLoad: number;
    securityEvents: number;
    growthData: { date: string; value: number }[];
    topRegions: { name: string; val: number }[];
}

export function useAnalytics() {
    return useQuery({
        queryKey: ['analytics', 'overview'],
        queryFn: async (): Promise<AnalyticsData> => {
            // 1. Fetch Total Demos
            const { count: demosCount } = await supabase
                .from('demo_sessions')
                .select('*', { count: 'exact', head: true });

            // 2. Fetch Active Users (Subscribers for now)
            const { count: usersCount } = await supabase
                .from('subscribers')
                .select('*', { count: 'exact', head: true });

            // 3. Fetch System Load (Ops per minute from platform_metrics)
            const { data: metrics } = await supabase
                .from('platform_metrics')
                .select('metric_value')
                .eq('metric_name', 'ops_per_minute')
                .single();

            const opsPerMinute = metrics?.metric_value || 0;
            // Normalizar carga 0-100% asumiendo max 10k ops/min
            const systemLoad = Math.min(Math.round((opsPerMinute / 10000) * 100), 100);

            // 4. Fetch Security Events (High/Critical threats from audit_logs likely, or mock for now)
            // Por simplicidad usaremos un mock inteligente o query real si performance permite
            // Simulamos low count para "Security Events"
            const securityEvents = 0;

            // 5. Generate Mock Growth Data (until we have historical table)
            // En un sistema real, esto vendría de una tabla de 'daily_stats'
            const growthData = Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return {
                    date: d.toLocaleDateString('en-US', { weekday: 'short' }),
                    value: Math.floor(Math.random() * 50) + 100 + (i * 10) // Fake growth trend
                };
            });

            // 6. Mock Top Regions (until we have geo data)
            const topRegions = [
                { name: 'Mexico City', val: 45 },
                { name: 'Guadalajara', val: 32 },
                { name: 'Monterrey', val: 18 },
                { name: 'Other', val: 5 }
            ];

            return {
                totalDemos: demosCount || 0,
                activeUsers: usersCount || 0,
                systemLoad,
                securityEvents,
                growthData,
                topRegions
            };
        },
        refetchInterval: 60000 // Refetch every minute
    });
}
