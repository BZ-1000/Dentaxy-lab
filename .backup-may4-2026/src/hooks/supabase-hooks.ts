/**
 * Hooks personalizados para interactuar con Supabase en el Panel Admin
 * Abstrae queries complejas y suscripciones en tiempo real
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { adminQueryKeys } from '@/lib/queryClient';
import { useEffect, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ==========================================
// HOOK GENÉRICO PARA TABLAS
// ==========================================

/**
 * Hook genérico para queries tipadas de Supabase
 * @example
 * const { data, isLoading } = useTableQuery('subscribers', {
 *   filters: { subscribed: true },
 *   orderBy: { column: 'created_at', ascending: false },
 *   range: { from: 0, to: 99 }
 * });
 */
export function useTableQuery<T extends keyof Database['public']['Tables']>(
    tableName: T,
    options?: {
        filters?: Partial<Database['public']['Tables'][T]['Row']>;
        orderBy?: { column: string; ascending?: boolean };
        range?: { from: number; to: number };
        select?: string;
    },
    queryOptions?: Omit<UseQueryOptions, 'queryKey' | 'queryFn'>
) {
    type TableRow = Database['public']['Tables'][T]['Row'];

    return useQuery({
        queryKey: [tableName, options] as const,
        queryFn: async () => {
            let query = supabase.from(tableName).select(options?.select || '*');

            // Aplicar filtros
            if (options?.filters) {
                Object.entries(options.filters).forEach(([key, value]) => {
                    if (value !== undefined) {
                        query = query.eq(key, value);
                    }
                });
            }

            // Ordenamiento
            if (options?.orderBy) {
                query = query.order(options.orderBy.column, {
                    ascending: options.orderBy.ascending ?? false,
                });
            }

            // Rango (paginación)
            if (options?.range) {
                query = query.range(options.range.from, options.range.to);
            }

            const { data, error } = await query;

            if (error) throw error;
            return ((data || []) as unknown) as TableRow[];
        },
        ...queryOptions,
    });
}

// ==========================================
// HOOK DE REALTIME GENÉRICO
// ==========================================

/**
 * Hook para suscribirse a cambios en tiempo real de una tabla
 * @example
 * const metrics = useRealtimeTable('platform_metrics', {
 *   event: '*',
 *   onInsert: (payload) => console.log('New metric:', payload),
 * });
 */
export function useRealtimeTable<T extends keyof Database['public']['Tables']>(
    tableName: T,
    options?: {
        event?: '*' | 'INSERT' | 'UPDATE' | 'DELETE';
        filter?: string;
        onInsert?: (payload: Database['public']['Tables'][T]['Row']) => void;
        onUpdate?: (payload: Database['public']['Tables'][T]['Row']) => void;
        onDelete?: (payload: { old_record: Database['public']['Tables'][T]['Row'] }) => void;
    }
) {
    type TableRow = Database['public']['Tables'][T]['Row'];
    const [data, setData] = useState<TableRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const queryClient = useQueryClient();

    useEffect(() => {
        let channel: RealtimeChannel;

        const setupRealtimeSubscription = async () => {
            // Cargar datos iniciales
            const { data: initialData, error } = await supabase
                .from(tableName)
                .select('*');

            if (error) {
                console.error(`Error loading initial data from ${tableName}:`, error);
                setIsLoading(false);
                return;
            }

            setData((initialData || []) as TableRow[]);
            setIsLoading(false);

            // Configurar suscripción en tiempo real
            channel = supabase
                .channel(`${tableName}-changes`)
                .on(
                    'postgres_changes' as any,
                    {
                        event: options?.event || '*',
                        schema: 'public',
                        table: tableName,
                        filter: options?.filter,
                    },
                    (payload: any) => {
                        // Actualizar estado local
                        if (payload.eventType === 'INSERT') {
                            setData((prev) => [payload.new as TableRow, ...prev]);
                            options?.onInsert?.(payload.new as TableRow);
                        } else if (payload.eventType === 'UPDATE') {
                            setData((prev) =>
                                prev.map((item: any) =>
                                    item.id === (payload.new as any).id ? (payload.new as TableRow) : item
                                )
                            );
                            options?.onUpdate?.(payload.new as TableRow);
                        } else if (payload.eventType === 'DELETE') {
                            setData((prev) => prev.filter((item: any) => item.id !== (payload.old as any).id));
                            options?.onDelete?.({ old_record: payload.old as TableRow });
                        }

                        // Invalidar queries relacionadas para mantener sincronizado el cache
                        queryClient.invalidateQueries({ queryKey: [tableName] });
                    }
                )
                .subscribe();
        };

        setupRealtimeSubscription();

        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, [tableName, options?.event, options?.filter, queryClient]);

    return { data, isLoading };
}

// ==========================================
// HOOK PARA MÉTRICAS AGREGADAS
// ==========================================

/**
 * Hook para queries agregadas (count, sum, etc.)
 * @example
 * const { data: totalSubscribers } = useAggregateMetric('subscribers', 'count');
 */
export function useAggregateMetric(
    tableName: keyof Database['public']['Tables'],
    operation: 'count' | 'sum' | 'avg',
    column?: string,
    filters?: Record<string, any>
) {
    return useQuery({
        queryKey: [tableName, 'aggregate', operation, column, filters] as const,
        queryFn: async () => {
            let query = supabase.from(tableName).select('*', { count: 'exact', head: true });

            // Aplicar filtros
            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined) {
                        query = query.eq(key, value);
                    }
                });
            }

            if (operation === 'count') {
                const { count, error } = await query;
                if (error) throw error;
                return count || 0;
            }

            // Para sum y avg necesitamos los datos completos
            const { data, error } = await supabase.from(tableName).select(column || '*');
            if (error) throw error;

            if (!column || !data) return 0;

            const values = data.map((row: any) => row[column] || 0);

            if (operation === 'sum') {
                return values.reduce((acc: number, val: number) => acc + val, 0);
            }

            if (operation === 'avg') {
                const sum = values.reduce((acc: number, val: number) => acc + val, 0);
                return values.length > 0 ? sum / values.length : 0;
            }

            return 0;
        },
    });
}

// ==========================================
// HOOK PARA MUTATIONS CON OPTIMISTIC UPDATES
// ==========================================

/**
 * Hook para mutations tipadas con optimistic updates
 * @example
 * const { mutate: updateModule } = useTableMutation('dentaxy_modules', 'update');
 * updateModule({ id: 'module-id', is_enabled: false });
 */
export function useTableMutation<T extends keyof Database['public']['Tables']>(
    tableName: T,
    operation: 'insert' | 'update' | 'delete'
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: any) => {
            let query;

            switch (operation) {
                case 'insert':
                    query = supabase.from(tableName).insert(payload).select().single();
                    break;
                case 'update':
                    query = supabase.from(tableName).update(payload).eq('id', payload.id).select().single();
                    break;
                case 'delete':
                    query = supabase.from(tableName).delete().eq('id', payload.id);
                    break;
                default:
                    throw new Error(`Unknown operation: ${operation}`);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: [tableName] });
        },
    });
}

// ==========================================
// HOOKS ESPECÍFICOS PARA RPC FUNCTIONS
// ==========================================

/**
 * Hook para llamar a funciones RPC de Supabase
 * @example
 * const { mutate: callFunction } = useRpcMutation('get_platform_health');
 */
export function useRpcMutation<T = any>(functionName: string) {
    return useMutation({
        mutationFn: async (params?: Record<string, any>) => {
            const { data, error } = await supabase.rpc(functionName, params);
            if (error) throw error;
            return data as T;
        },
    });
}

/**
 * Hook para queries RPC
 */
export function useRpcQuery<T = any>(
    functionName: string,
    params?: Record<string, any>,
    queryOptions?: Omit<UseQueryOptions, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: ['rpc', functionName, params] as const,
        queryFn: async () => {
            const { data, error } = await supabase.rpc(functionName, params);
            if (error) throw error;
            return data as T;
        },
        ...queryOptions,
    });
}

// ==========================================
// TYPES AUXILIARES
// ==========================================

import type { Database } from '@/integrations/supabase/types';
