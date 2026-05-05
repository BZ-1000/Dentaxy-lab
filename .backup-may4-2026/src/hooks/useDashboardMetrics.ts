/**
 * Hook para métricas en tiempo real del Dashboard
 * Proporciona estadísticas globales del ecosistema Dentaxy
 */

import { useQuery } from '@tanstack/react-query';
import { useRealtimeTable } from './supabase-hooks';
import { adminQueryKeys } from '@/lib/queryClient';
import { supabase } from '@/integrations/supabase/client';
import type { GlobalMetrics } from '@/types/admin';

/**
 * Hook para métricas globales del Dashboard
 * Actualiza automáticamente con cambios en platform_metrics
 */
export function useLiveMetrics() {
    // Suscripción en tiempo real a platform_metrics
    const { data: metricsData, isLoading: metricsLoading } = useRealtimeTable('platform_metrics');

    return useQuery({
        queryKey: adminQueryKeys.dashboard.globalMetrics(),
        queryFn: async (): Promise<GlobalMetrics> => {
            // Obtener métricas específicas de platform_metrics
            const metrics = metricsData || [];

            // Función helper para obtener valor de métrica por nombre
            const getMetricValue = (name: string, defaultValue: number = 0): number => {
                const metric = metrics.find((m) => m.metric_name === name);
                return metric?.metric_value ?? defaultValue;
            };

            // Calcular métricas globales - SIN DATOS FALSOS
            // Si no hay datos en DB, devuelve 0
            const globalReach = getMetricValue('global_reach', 0);
            const activeNodes = getMetricValue('active_nodes', 0);
            const opsPerMinute = getMetricValue('ops_per_minute', 0);
            const threatLevelValue = getMetricValue('threat_level', 1);

            // Mapear valor numérico a string
            const threatLevelMap = {
                1: 'low' as const,
                2: 'medium' as const,
                3: 'high' as const,
                4: 'critical' as const,
            };

            const threatLevel = threatLevelMap[threatLevelValue as keyof typeof threatLevelMap] || 'low';

            // Determinar estado del sistema
            const systemStatus = threatLevel === 'high' || threatLevel === 'critical'
                ? 'outage' as const
                : activeNodes < 1 // Si no hay nodos, asumimos degraded o inactivo si debería haber
                    ? 'degraded' as const
                    : 'operational' as const;

            return {
                globalReach,
                activeNodes,
                operationsPerMinute: opsPerMinute,
                threatLevel,
                systemStatus,
            };
        },
        enabled: !metricsLoading,
        refetchInterval: 5000,
    });
}

/**
 * Hook para métricas de Dentaxy Shop
 */
export function useShopMetrics() {
    return useQuery({
        queryKey: adminQueryKeys.shop.metrics(),
        queryFn: async () => {
            // Contar suscriptores activos
            const { count: activeSubscribers, error: subsError } = await supabase
                .from('subscribers')
                .select('*', { count: 'exact', head: true })
                .eq('subscribed', true);

            if (subsError) throw subsError;

            // TODO: Integrar cálculo real de revenue cuando exista tabla de transacciones
            const revenue = 0;

            // Contar "órdenes" basado en subscriptions activas (por ahora)
            // Si hay tabla de órdenes, usarla aqui
            const orders = 0;

            return {
                revenue,
                orders,
                activeSubscribers: activeSubscribers || 0,
            };
        },
        refetchInterval: 30000,
    });
}

/**
 * Hook para métricas de Dentaxy Seed
 */
export function useSeedMetrics() {
    return useQuery({
        queryKey: adminQueryKeys.seed.metrics(),
        queryFn: async () => {
            // Contar zonas de acceso activas
            const { count: activeZones, error: zonesError } = await supabase
                .from('student_access_zones')
                .select('*', { count: 'exact', head: true })
                .eq('is_active', true);

            if (zonesError) throw zonesError;

            // Obtener conteo de mensajes recientes
            const { count: messageCount, error: messagesError } = await supabase
                .from('student_chat_messages')
                .select('*', { count: 'exact', head: true })
                .eq('is_deleted', false);

            if (messagesError) throw messagesError;

            // TODO: Integrar métrica real de storage
            const storage = '0TB';

            return {
                instances: activeZones || 0,
                storage,
                messageCount: messageCount || 0,
            };
        },
        refetchInterval: 30000,
    });
}

/**
 * Hook para audit logs recientes
 */
export function useRecentAuditLogs(limit: number = 10) {
    return useQuery({
        queryKey: adminQueryKeys.dashboard.systemLogs(limit),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('audit_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;

            return data || [];
        },
        refetchInterval: 5000, // Refetch más rápido para logs
    });
}

/**
 * Hook para estado de subsistemas
 */
export function useSubsystemStatus() {
    const shopMetrics = useShopMetrics();
    const seedMetrics = useSeedMetrics();

    return useQuery({
        queryKey: adminQueryKeys.dashboard.subsystemStatus(),
        queryFn: async () => {
            // Obtener estado de módulos desde dentaxy_modules
            const { data: modules, error } = await supabase
                .from('dentaxy_modules')
                .select('*');

            if (error) throw error;

            // Crear mapa de módulos
            const modulesMap = new Map(modules?.map((m) => [m.name, m]) || []);

            // Helper para obtener datos del módulo
            const getModuleData = (name: string, metrics: any) => {
                const mod = modulesMap.get(name);
                return {
                    id: mod?.id || '',
                    name: name,
                    displayName: mod?.display_name || `Dentaxy ${name.charAt(0).toUpperCase() + name.slice(1)}`,
                    isEnabled: mod?.is_enabled ?? true, // Default to true if record missing, or false? Let's say true for UI
                    isHealthy: mod?.status === 'active',
                    maintenanceMode: mod?.status === 'maintenance',
                    status: (mod?.status as any) || 'unknown',
                    // Sin simulaciones de uptime/response/error
                    uptime: 0,
                    responseTime: 0,
                    errorRate: 0,
                    ...metrics
                };
            };

            return {
                shop: getModuleData('shop', {
                    revenue: shopMetrics.data?.revenue || 0,
                    orders: shopMetrics.data?.orders || 0,
                }),
                seed: getModuleData('seed', {
                    instances: seedMetrics.data?.instances || 0,
                    storage: seedMetrics.data?.storage || '0TB',
                }),
                core: getModuleData('core', {
                    // Sin métricas falsas de requests/AI usage
                    requestsPerMinute: 0,
                    aiUsage: 0,
                }),
                studio: getModuleData('studio', {
                    // TODO: Conectar a tabla de componentes real
                    components: 0,
                    users: 0,
                }),
            };
        },
        enabled: !shopMetrics.isLoading && !seedMetrics.isLoading,
        refetchInterval: 30000,
    });
}

