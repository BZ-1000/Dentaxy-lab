/**
 * Types y interfaces compartidas para el Panel Admin de Dentaxy
 * Define estructuras de datos para todas las funcionalidades administrativas
 */

import { Database } from '@/integrations/supabase/types';

// ==========================================
// TIPOS BASE DE SUPABASE
// ==========================================

export type Tables = Database['public']['Tables'];
export type DentaxyModule = Tables['dentaxy_modules']['Row'];
export type Subscriber = Tables['subscribers']['Row'];
export type StudentAccessZone = Tables['student_access_zones']['Row'];
export type StudentChatMessage = Tables['student_chat_messages']['Row'];
export type StudentChatBlock = Tables['student_chat_blocks']['Row'];
export type AuditLog = Tables['audit_logs']['Row'];
export type PlatformMetric = Tables['platform_metrics']['Row'];
export type DemoLink = Tables['demo_links']['Row'];
export type DemoSession = Tables['demo_sessions']['Row'];
export type AdminSession = Tables['admin_sessions']['Row'];
export type AdminCredential = Tables['admin_credentials']['Row'];
export type AdminRole = Tables['admin_roles']['Row'];
export type RateLimit = Tables['rate_limits']['Row'];

// ==========================================
// MÓDULOS DEL ECOSISTEMA
// ==========================================

export interface ModuleStatus {
    id: string;
    name: string;
    displayName: string;
    isEnabled: boolean;
    isHealthy: boolean;
    maintenanceMode: boolean;
    status: 'active' | 'inactive' | 'maintenance' | 'error';
    uptime: number; // porcentaje
    responseTime: number; // ms
    errorRate: number; // porcentaje
    lastHealthCheck?: Date;
}

export interface ModuleHealthMetrics {
    moduleId: string;
    timestamp: Date;
    responseTime: number;
    errorCount: number;
    requestCount: number;
    cpuUsage?: number;
    memoryUsage?: number;
}

// ==========================================
// SISTEMA DE COMUNICACIONES
// ==========================================

export type TargetAudience =
    | 'global'
    | 'dentaxy_core'
    | 'dentaxy_shop'
    | 'dentaxy_seed'
    | 'active_demos'
    | 'admin_panel'
    | 'subscribers'
    | 'students';

export type MessageType =
    | 'popup'
    | 'banner'
    | 'notification'
    | 'silent';

export interface BroadcastMessage {
    id: string;
    createdAt: Date;
    createdBy: string;
    targetAudience: TargetAudience;
    messageType: MessageType;
    title?: string;
    content: string;
    scheduledFor?: Date;
    sentAt?: Date;
    recipientCount?: number;
    openedCount?: number;
    metadata?: Record<string, any>;
}

export interface BroadcastTemplate {
    id: string;
    name: string;
    description: string;
    targetAudience: TargetAudience;
    messageType: MessageType;
    contentTemplate: string;
    variables: string[];
}

// ==========================================
// ANALYTICS Y MÉTRICAS
// ==========================================

export interface UserAnalytics {
    period: 'day' | 'week' | 'month' | 'year';
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    churnedUsers: number;
    retentionRate: number;
    growthRate: number;
    byPlatform: {
        shop: number;
        seed: number;
        core: number;
        studio: number;
    };
}

export interface BusinessMetrics {
    period: 'day' | 'week' | 'month' | 'year';
    revenue: number;
    mrr: number; // Monthly Recurring Revenue
    arr: number; // Annual Recurring Revenue
    newSubscribers: number;
    churnedSubscribers: number;
    conversionRate: number; // demo → subscriber
    averageLifetimeValue: number;
    churnRate: number;
}

export interface EngagementMetrics {
    period: 'day' | 'week' | 'month' | 'year';
    aiButtonClicks: number;
    demoSessions: number;
    averageSessionDuration: number;
    featureAdoption: Record<string, number>;
    mostUsedModules: Array<{ module: string; count: number }>;
}

export interface MetricDataPoint {
    timestamp: Date;
    value: number;
    label?: string;
}

// ==========================================
// SHOP MANAGER
// ==========================================

export interface ShopMetrics {
    totalSubscribers: number;
    activeSubscribers: number;
    revenue: {
        today: number;
        week: number;
        month: number;
        year: number;
    };
    orders: {
        pending: number;
        completed: number;
        cancelled: number;
    };
    topProducts: Array<{
        productId: string;
        name: string;
        sales: number;
        revenue: number;
    }>;
}

export interface SubscriberDetails extends Subscriber {
    totalSpent: number;
    orderCount: number;
    lastOrder?: Date;
    lifetimeValue: number;
}

// ==========================================
// SEED MANAGER
// ==========================================

export interface SeedMetrics {
    totalZones: number;
    activeZones: number;
    totalStudents: number;
    activeStudents: number;
    storageUsed: string; // e.g., "2.4TB"
    chatMessages: {
        today: number;
        week: number;
        deleted: number;
        flagged: number;
    };
    topInstitutions: Array<{
        name: string;
        studentCount: number;
        activeRate: number;
    }>;
}

export interface AccessZoneDetails extends StudentAccessZone {
    studentCount: number;
    activeStudents: number;
    messageCount: number;
    isCurrentlyAccessible: boolean;
}

export interface ChatModerationEvent {
    messageId: string;
    userId: string;
    content: string;
    timestamp: Date;
    action: 'flagged' | 'deleted' | 'user_blocked';
    moderatorId: string;
    reason: string;
}

// ==========================================
// SECURITY
// ==========================================

export interface SecurityEvent {
    id: string;
    timestamp: Date;
    type: 'login_attempt' | 'failed_login' | 'session_revoked' | 'permission_denied' | 'rate_limit_hit';
    userId?: string;
    ipAddress: string;
    userAgent?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    details: Record<string, any>;
}

export interface ActiveSessionDetails extends AdminSession {
    credentialInfo?: {
        username: string;
        displayName: string;
    };
    duration: number; // segundos desde created_at
    isCurrentSession?: boolean;
}

export interface RateLimitConfig {
    action: string;
    windowSize: number; // segundos
    maxRequests: number;
    blockDuration?: number; // segundos, si se excede el límite
}

// ==========================================
// DEMO ENGINE
// ==========================================

export interface DemoAnalytics {
    totalLinks: number;
    activeLinks: number;
    totalSessions: number;
    activeSessions: number;
    conversionRate: number; // sesiones → subscribers
    averageSessionDuration: number;
    mostAccessedModules: Array<{
        module: string;
        count: number;
    }>;
    topPerformingLinks: Array<{
        linkId: string;
        sessionCount: number;
        conversionRate: number;
    }>;
}

export interface DemoSessionDetails extends DemoSession {
    linkInfo?: DemoLink;
    duration: number;
    modulesAccessedCount: number;
    hasConverted?: boolean;
}

// ==========================================
// AUDIT Y COMPLIANCE
// ==========================================

export interface AuditLogFilter {
    startDate?: Date;
    endDate?: Date;
    action?: string;
    resourceType?: string;
    userId?: string;
    severity?: 'info' | 'warning' | 'error' | 'critical';
}

export interface AuditLogDetails extends AuditLog {
    userName?: string;
    formattedDetails: string;
    relatedLogs?: AuditLog[];
}

// ==========================================
// ROLES Y PERMISOS
// ==========================================

export enum AdminRoleType {
    SUPER_ADMIN = 'super_admin',
    OPERATIONS = 'operations',
    MODERATOR = 'moderator',
    FINANCE = 'finance',
    DEVELOPER = 'developer',
}

export interface Permission {
    resource: string;
    actions: ('read' | 'write' | 'delete' | 'execute')[];
}

export interface RolePermissions {
    role: AdminRoleType;
    permissions: Permission[];
    description: string;
}

// ==========================================
// UTILIDADES Y HELPERS
// ==========================================

export interface PaginationParams {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
    timestamp: Date;
}

// ==========================================
// DASHBOARD
// ==========================================

export interface GlobalMetrics {
    globalReach: number;
    activeNodes: number;
    operationsPerMinute: number;
    threatLevel: 'low' | 'medium' | 'high' | 'critical';
    systemStatus: 'operational' | 'degraded' | 'outage';
}

export interface SubsystemStatus {
    shop: ModuleStatus & { revenue: number; orders: number };
    seed: ModuleStatus & { instances: number; storage: string };
    core: ModuleStatus & { requestsPerMinute: number; aiUsage: number };
    studio: ModuleStatus & { components: number; users: number };
}

export interface SystemLog {
    id: string;
    timestamp: Date;
    level: 'info' | 'warning' | 'error';
    service: string;
    message: string;
    metadata?: Record<string, any>;
}

// ==========================================
// ECOSYSTEM CONTROL
// ==========================================

export interface MaintenanceModeConfig {
    moduleId: string;
    enabled: boolean;
    message: string;
    estimatedDuration?: number; // minutos
    scheduledEnd?: Date;
    allowedIps?: string[]; // IPs que pueden acceder durante mantenimiento
}

export interface ModuleToggleRequest {
    moduleId: string;
    enabled: boolean;
    reason: string;
    notifyUsers: boolean;
}

export interface DeploymentInfo {
    moduleId: string;
    version: string;
    deployedAt: Date;
    deployedBy: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'rolled_back';
    commitHash?: string;
    releaseNotes?: string;
}
