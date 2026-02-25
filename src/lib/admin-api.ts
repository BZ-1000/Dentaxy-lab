/**
 * API Layer para operaciones administrativas complejas
 * Abstrae lógica de negocio y orchestración de múltiples queries
 */

import { supabase } from '@/integrations/supabase/client';
import type {
    ModuleToggleRequest,
    MaintenanceModeConfig,
    BroadcastMessage,
    PaginationParams,
    PaginatedResponse,
} from '@/types/admin';
import type { Database } from '@/integrations/supabase/types';

// ==========================================
// ECOSYSTEM CONTROL
// ==========================================

/**
 * Habilita o deshabilita un módulo del ecosistema
 * También registra la acción en audit_logs
 */
export async function toggleModule(request: ModuleToggleRequest) {
    const { moduleId, enabled, reason, notifyUsers } = request;

    // 1. Actualizar estado del módulo mediante RPC (SECURITY DEFINER bypassa RLS)
    const { data: rpcData, error: moduleError } = await supabase.rpc('toggle_module_enabled', {
        p_module_id: moduleId,
        p_enabled: enabled,
    });

    if (moduleError) throw moduleError;

    const result = rpcData as { success: boolean; id?: string; name?: string; display_name?: string; is_enabled?: boolean };
    if (!result?.success) throw new Error('Error al actualizar el estado del módulo');

    // Construir objeto de módulo a partir del resultado RPC
    const module = { id: result.id, name: result.name, display_name: result.display_name, is_enabled: result.is_enabled };

    // 2. Registrar en audit logs
    const { error: auditError } = await supabase.from('audit_logs').insert({
        action: enabled ? 'module_enabled' : 'module_disabled',
        resource_type: 'dentaxy_module',
        resource_id: moduleId,
        details: { reason, module_name: module.name },
        ip_address: '0.0.0.0',
    });

    if (auditError) console.error('Failed to log audit:', auditError);

    // 3. Broadcast a usuarios si está habilitado
    if (notifyUsers) {
        const message = enabled
            ? `${module.display_name} está nuevamente disponible`
            : `${module.display_name} está temporalmente deshabilitado`;

        await broadcastMessage({
            targetAudience: 'global',
            messageType: 'banner',
            title: enabled ? 'Servicio Restaurado' : 'Servicio No Disponible',
            content: message,
        });
    }

    return module;
}

/**
 * Configura modo mantenimiento para un módulo
 */
export async function setMaintenanceMode(config: MaintenanceModeConfig) {
    const { moduleId, enabled, message, estimatedDuration, scheduledEnd, allowedIps } = config;

    // 1. Actualizar system_state
    const maintenanceKey = `maintenance_${moduleId}`;
    const scheduledEndISO = scheduledEnd ? scheduledEnd.toISOString() : null;
    const startedAtISO = enabled ? new Date().toISOString() : null;

    const { error: stateError } = await supabase.from('system_state').upsert({
        key: maintenanceKey,
        value: JSON.stringify({
            enabled,
            message,
            estimatedDuration,
            scheduledEnd: scheduledEndISO,
            allowedIps,
            startedAt: startedAtISO,
        }),
    });

    if (stateError) throw stateError;

    // 2. Actualizar módulo mediante RPC (SECURITY DEFINER bypassa RLS)
    const { data: rpcData, error: moduleError } = await supabase.rpc('set_module_maintenance', {
        p_module_id: moduleId,
        p_enabled: enabled,
        p_status: enabled ? 'maintenance' : 'active',
    });

    if (moduleError) throw moduleError;

    const rpcResult = rpcData as { success: boolean };
    if (!rpcResult?.success) throw new Error('Error al actualizar modo mantenimiento');

    // 3. Broadcast a usuarios
    await broadcastMessage({
        targetAudience: 'global',
        messageType: 'popup',
        title: enabled ? '🔧 Mantenimiento Programado' : '✅ Mantenimiento Completado',
        content: enabled ? message : 'El servicio ha sido restaurado. ¡Gracias por tu paciencia!',
    });

    // 4. Audit log
    await supabase.from('audit_logs').insert({
        action: enabled ? 'maintenance_mode_enabled' : 'maintenance_mode_disabled',
        resource_type: 'dentaxy_module',
        resource_id: moduleId,
        details: { message, estimatedDuration, scheduledEnd },
        ip_address: '0.0.0.0',
    });

    return { success: true };
}

/**
 * Obtiene el estado de salud de un módulo
 */
export async function getModuleHealth(moduleId: string) {
    // Obtener datos del módulo
    const { data: module, error } = await supabase
        .from('dentaxy_modules')
        .select('*')
        .eq('id', moduleId)
        .single();

    if (error) throw error;

    // TODO: Implementar health checks reales (ping a endpoints, check DB, etc.)
    // Por ahora, retornamos datos simulados basados en el estado

    return {
        moduleId,
        isHealthy: module.is_enabled && module.status === 'active',
        uptime: 99.9,
        responseTime: Math.random() * 200 + 50, // 50-250ms simulado
        errorRate: Math.random() * 2, // 0-2% simulado
        lastCheck: new Date(),
    };
}

// ==========================================
// COMMUNICATION / BROADCAST
// ==========================================

/**
 * Envía un mensaje broadcast a usuarios
 * Nota: Requiere tabla broadcast_messages en Supabase
 */
export async function broadcastMessage(
    message: Pick<BroadcastMessage, 'targetAudience' | 'messageType' | 'title' | 'content'>
) {
    // TODO: Crear tabla broadcast_messages si no existe

    const { data, error } = await supabase
        .from('broadcast_messages' as any)
        .insert({
            target_audience: message.targetAudience,
            message_type: message.messageType,
            title: message.title,
            content: message.content,
            sent_at: new Date().toISOString(),
            created_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

    if (error) {
        console.warn('Broadcast table not found, skipping:', error);
        return null;
    }

    // TODO: Implementar sistema de delivery real (WebSocket, Push, Email, etc.)

    return data;
}

// ==========================================
// ANALYTICS
// ==========================================

/**
 * Obtiene métricas de usuarios para un período
 */
export async function getUserAnalytics(period: 'day' | 'week' | 'month' | 'year') {
    const now = new Date();
    const periodStart = new Date();

    switch (period) {
        case 'day':
            periodStart.setDate(now.getDate() - 1);
            break;
        case 'week':
            periodStart.setDate(now.getDate() - 7);
            break;
        case 'month':
            periodStart.setMonth(now.getMonth() - 1);
            break;
        case 'year':
            periodStart.setFullYear(now.getFullYear() - 1);
            break;
    }

    // Query de usuarios activos (demo_sessions como proxy)
    const { data: sessions, error } = await supabase
        .from('demo_sessions')
        .select('*')
        .gte('created_at', periodStart.toISOString());

    if (error) throw error;

    // Calcular métricas
    const uniqueUsers = new Set(sessions?.map((s) => s.full_name)).size;

    return {
        period,
        totalUsers: uniqueUsers,
        activeUsers: sessions?.length || 0,
        newUsers: 0, // TODO: implementar lógica real
        retentionRate: 0, // TODO: implementar
        growthRate: 0, // TODO: implementar
    };
}

/**
 * Obtiene métricas de negocio (revenue, subscribers, etc.)
 */
export async function getBusinessMetrics(period: 'day' | 'week' | 'month' | 'year') {
    // Query de subscribers
    const { data: subscribers, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('subscribed', true);

    if (error) throw error;

    const activeSubscribers = subscribers?.length || 0;

    // TODO: Integración real con Stripe para revenue
    const simulatedRevenue = activeSubscribers * 299; // $299/mes por suscriptor

    return {
        period,
        revenue: simulatedRevenue,
        mrr: simulatedRevenue,
        arr: simulatedRevenue * 12,
        newSubscribers: 0, // TODO: filtrar por fecha
        churnedSubscribers: 0,
        conversionRate: 0,
        averageLifetimeValue: simulatedRevenue * 24, // 24 meses promedio
        churnRate: 0,
    };
}

// ==========================================
// SHOP MANAGER
// ==========================================

/**
 * Obtiene lista paginada de suscriptores con filtros
 */
export async function getSubscribers(
    pagination: PaginationParams,
    filters?: Partial<Database['public']['Tables']['subscribers']['Row']>
): Promise<PaginatedResponse<Database['public']['Tables']['subscribers']['Row']>> {
    const { page, pageSize, sortBy = 'created_at', sortOrder = 'desc' } = pagination;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase.from('subscribers').select('*', { count: 'exact' });

    // Aplicar filtros
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) {
                query = query.eq(key, value);
            }
        });
    }

    // Ordenamiento y paginación
    const { data, error, count } = await query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(from, to);

    if (error) throw error;

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
        data: data || [],
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    };
}

// ==========================================
// SEED MANAGER
// ==========================================

/**
 * Modera mensaje de chat (eliminar o bloquear usuario)
 */
export async function moderateChatMessage(
    messageId: string,
    action: 'delete' | 'block_user',
    reason: string
) {
    // 1. Obtener mensaje
    const { data: message, error: msgError } = await supabase
        .from('student_chat_messages')
        .select('*')
        .eq('id', messageId)
        .single();

    if (msgError) throw msgError;

    // 2. Marcar como eliminado
    const { error: deleteError } = await supabase
        .from('student_chat_messages')
        .update({ is_deleted: true, deleted_at: new Date().toISOString() })
        .eq('id', messageId);

    if (deleteError) throw deleteError;

    // 3. Si action es bloquear, crear bloqueo
    if (action === 'block_user' && message.user_id) {
        const { error: blockError } = await supabase.from('student_chat_blocks').insert({
            user_id: message.user_id,
            zone_id: message.zone_id,
            reason,
            blocked_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días
        });

        if (blockError) throw blockError;
    }

    // 4. Audit log
    await supabase.from('audit_logs').insert({
        action: `chat_message_${action}`,
        resource_type: 'chat_message',
        resource_id: messageId,
        details: { reason, user_id: message.user_id },
        ip_address: '0.0.0.0',
    });

    return { success: true };
}

// ==========================================
// SECURITY
// ==========================================

/**
 * Revoca una sesión de administrador activa
 */
export async function revokeAdminSession(sessionId: string) {
    const { error } = await supabase
        .from('admin_sessions')
        .update({ is_active: false })
        .eq('id', sessionId);

    if (error) throw error;

    // Audit log
    await supabase.from('audit_logs').insert({
        action: 'session_revoked',
        resource_type: 'admin_session',
        resource_id: sessionId,
        details: {},
        ip_address: '0.0.0.0',
    });

    return { success: true };
}

/**
 * Fuerza re-autenticación global (revoca todas las sesiones excepto la actual)
 */
export async function forceGlobalReauth(currentSessionId: string) {
    const { error } = await supabase
        .from('admin_sessions')
        .update({ requires_reauth: true })
        .neq('id', currentSessionId)
        .eq('is_active', true);

    if (error) throw error;

    // Audit log
    await supabase.from('audit_logs').insert({
        action: 'global_reauth_forced',
        resource_type: 'admin_sessions',
        details: { triggered_by: currentSessionId },
        ip_address: '0.0.0.0',
    });

    return { success: true };
}
