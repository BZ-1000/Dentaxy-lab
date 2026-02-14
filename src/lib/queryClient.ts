/**
 * Configuración de TanStack Query para el Panel Admin
 * Establece defaults y configuraciones globales para queries y mutations
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Query Client configurado para el Panel Admin
 * - Cache optimizado para datos administrativos
 * - Refetch automático balanceado
 * - Retry logic inteligente
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Tiempo que los datos se consideran "fresh" antes de refetch
            staleTime: 1000 * 60 * 2, // 2 minutos para datos admin

            // Tiempo que los datos se mantienen en cache antes de garbage collection
            gcTime: 1000 * 60 * 10, // 10 minutos

            // Refetch automático cuando la ventana recupera el foco
            refetchOnWindowFocus: true,

            // Refetch al reconectar a internet
            refetchOnReconnect: true,

            // Retry fallido automático (3 intentos con backoff exponencial)
            retry: (failureCount, error: any) => {
                // No retry en errores 4xx (client errors)
                if (error?.status >= 400 && error?.status < 500) {
                    return false;
                }
                // Máximo 3 reintentos para errores de servidor
                return failureCount < 3;
            },

            // Backoff exponencial para retries: 1s, 2s, 4s
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        },

        mutations: {
            // Retry para mutations críticas
            retry: 1,

            // Callbacks globales para mutations
            onError: (error: any) => {
                console.error('[Admin Mutation Error]:', error);
                // Aquí se puede agregar sistema de notificaciones toast
            },
        },
    },
});

/**
 * Query Keys para organizar el cache
 * Convención: [dominio, recurso, ...params]
 */
export const adminQueryKeys = {
    // Dashboard
    dashboard: {
        all: ['dashboard'] as const,
        globalMetrics: () => [...adminQueryKeys.dashboard.all, 'global-metrics'] as const,
        subsystemStatus: () => [...adminQueryKeys.dashboard.all, 'subsystem-status'] as const,
        systemLogs: (limit?: number) => [...adminQueryKeys.dashboard.all, 'system-logs', { limit }] as const,
    },

    // Módulos del Ecosistema
    modules: {
        all: ['modules'] as const,
        list: () => [...adminQueryKeys.modules.all, 'list'] as const,
        detail: (id: string) => [...adminQueryKeys.modules.all, 'detail', id] as const,
        health: (id: string) => [...adminQueryKeys.modules.all, 'health', id] as const,
        metrics: (id: string, period?: string) => [...adminQueryKeys.modules.all, 'metrics', id, { period }] as const,
    },

    // Analytics
    analytics: {
        all: ['analytics'] as const,
        users: (period: string) => [...adminQueryKeys.analytics.all, 'users', { period }] as const,
        business: (period: string) => [...adminQueryKeys.analytics.all, 'business', { period }] as const,
        engagement: (period: string) => [...adminQueryKeys.analytics.all, 'engagement', { period }] as const,
    },

    // Shop Manager
    shop: {
        all: ['shop'] as const,
        metrics: () => [...adminQueryKeys.shop.all, 'metrics'] as const,
        subscribers: (filters?: any) => [...adminQueryKeys.shop.all, 'subscribers', filters] as const,
        subscriberDetail: (id: string) => [...adminQueryKeys.shop.all, 'subscriber', id] as const,
        revenue: (period: string) => [...adminQueryKeys.shop.all, 'revenue', { period }] as const,
    },

    // Seed Manager
    seed: {
        all: ['seed'] as const,
        metrics: () => [...adminQueryKeys.seed.all, 'metrics'] as const,
        zones: (filters?: any) => [...adminQueryKeys.seed.all, 'zones', filters] as const,
        zoneDetail: (id: string) => [...adminQueryKeys.seed.all, 'zone', id] as const,
        chatMessages: (zoneId?: string, limit?: number) => [
            ...adminQueryKeys.seed.all,
            'chat-messages',
            { zoneId, limit },
        ] as const,
        chatBlocks: (zoneId?: string) => [...adminQueryKeys.seed.all, 'chat-blocks', { zoneId }] as const,
    },

    // Communication
    communication: {
        all: ['communication'] as const,
        messages: (filters?: any) => [...adminQueryKeys.communication.all, 'messages', filters] as const,
        messageDetail: (id: string) => [...adminQueryKeys.communication.all, 'message', id] as const,
        templates: () => [...adminQueryKeys.communication.all, 'templates'] as const,
    },

    // Security
    security: {
        all: ['security'] as const,
        sessions: (filters?: any) => [...adminQueryKeys.security.all, 'sessions', filters] as const,
        auditLogs: (filters?: any) => [...adminQueryKeys.security.all, 'audit-logs', filters] as const,
        rateLimits: () => [...adminQueryKeys.security.all, 'rate-limits'] as const,
        securityEvents: (filters?: any) => [...adminQueryKeys.security.all, 'events', filters] as const,
    },

    // Demo Engine
    demos: {
        all: ['demos'] as const,
        analytics: () => [...adminQueryKeys.demos.all, 'analytics'] as const,
        links: (filters?: any) => [...adminQueryKeys.demos.all, 'links', filters] as const,
        linkDetail: (id: string) => [...adminQueryKeys.demos.all, 'link', id] as const,
        sessions: (filters?: any) => [...adminQueryKeys.demos.all, 'sessions', filters] as const,
        sessionDetail: (id: string) => [...adminQueryKeys.demos.all, 'session', id] as const,
    },

    // Platform Metrics (Supabase real-time)
    platformMetrics: {
        all: ['platform-metrics'] as const,
        byName: (metricName: string) => [...adminQueryKeys.platformMetrics.all, metricName] as const,
    },
} as const;

/**
 * Utilidades para invalidar queries relacionadas
 */
export const invalidateQueries = {
    /**
     * Invalida todas las queries del dashboard
     */
    dashboard: () => {
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.dashboard.all });
    },

    /**
     * Invalida queries de un módulo específico
     */
    module: (moduleId: string) => {
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.modules.detail(moduleId) });
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.modules.health(moduleId) });
    },

    /**
     * Invalida todas las métricas del ecosistema
     */
    allMetrics: () => {
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.analytics.all });
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.shop.metrics() });
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.seed.metrics() });
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.demos.analytics() });
    },

    /**
     * Invalida queries completas después de mutation crítica
     */
    fullRefresh: () => {
        queryClient.invalidateQueries();
    },
};

/**
 * Prefetch utilities para optimizar carga inicial
 */
export const prefetchQueries = {
    /**
     * Prefetch de datos esenciales del dashboard
     */
    dashboard: async () => {
        await Promise.all([
            queryClient.prefetchQuery({
                queryKey: adminQueryKeys.dashboard.globalMetrics(),
                staleTime: 1000 * 60, // 1 minuto
            }),
            queryClient.prefetchQuery({
                queryKey: adminQueryKeys.dashboard.subsystemStatus(),
                staleTime: 1000 * 60,
            }),
        ]);
    },
};
