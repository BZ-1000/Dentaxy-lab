import React, { useState, useEffect } from 'react';
import { PasskeyManager } from '@/components/admin/security/PasskeyManager';
import { PasswordManager } from '@/components/admin/security/PasswordManager';
import { ShieldCheck, Globe, Lock, Clock, ScrollText, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { usePanelLockContext } from '@/contexts/PanelLockContext';
import { setInactivityTimeout } from '@/lib/auth/biometric-lock';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

import { supabase } from '@/integrations/supabase/client';

export interface AuditEventType {
    id: string;
    event_type: string;
    action_name: string;
    device_info: any;
    success: boolean;
    created_at: string;
}

const Security = () => {
    const [autoLockTimeout, setAutoLockTimeout] = useState('5');
    const { lock } = usePanelLockContext();
    const [auditLogs, setAuditLogs] = useState<AuditEventType[]>([]);
    const [isLoadingLogs, setIsLoadingLogs] = useState(true);

    // Cargar logs y suscribirse a cambios
    useEffect(() => {
        fetchLogs();

        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'auth_audit_log'
                },
                (payload) => {
                    const newLog = payload.new as AuditEventType;
                    setAuditLogs(prev => [newLog, ...prev].slice(0, 5));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchLogs = async () => {
        try {
            const { data, error } = await supabase
                .from('auth_audit_log')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) throw error;
            if (data) setAuditLogs(data);
        } catch (error) {
            console.error('Error fetching audit logs:', error);
        } finally {
            setIsLoadingLogs(false);
        }
    };

    const handleAutoLockChange = (value: string) => {
        setAutoLockTimeout(value);
        const timeoutMs = parseInt(value) * 60 * 1000; // Convertir a ms
        setInactivityTimeout(timeoutMs);
        toast.success('Configuración guardada', {
            description: value === '0'
                ? 'Autobloqueo deshabilitado'
                : `El panel se bloqueará tras ${value} minutos de inactividad`
        });
    };

    const handleManualLock = () => {
        lock('manual');
        toast.info('Panel bloqueado manualmente');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Identity & Security</h1>
                    <p className="text-gray-400 font-medium mt-1">Gestión de accesos, contraseñas y biometría global</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Biometrics Management */}
                <PasskeyManager />

                {/* Password Management */}
                <PasswordManager />
            </div>

            {/* Auto-Lock Configuration */}
            <Card className="border-white/40 bg-white/60 backdrop-blur-xl shadow-xl shadow-gray-200/50">
                <CardHeader>
                    <CardTitle className="text-xl text-gray-900 flex items-center gap-2 font-bold tracking-tight">
                        <Clock className="h-5 w-5 text-orange-600" />
                        Bloqueo Automático
                    </CardTitle>
                    <CardDescription className="text-gray-500 font-medium">
                        Configura el tiempo de inactividad antes de bloquear el panel
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="flex items-center justify-between gap-6 flex-wrap">
                        <div className="space-y-2 flex-1 min-w-[250px]">
                            <Label className="text-gray-700 font-semibold">Tiempo de Inactividad</Label>
                            <Select value={autoLockTimeout} onValueChange={handleAutoLockChange}>
                                <SelectTrigger className="bg-white/50 border-gray-200 h-11 rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Deshabilitado</SelectItem>
                                    <SelectItem value="1">1 minuto</SelectItem>
                                    <SelectItem value="3">3 minutos</SelectItem>
                                    <SelectItem value="5">5 minutos (Recomendado)</SelectItem>
                                    <SelectItem value="10">10 minutos</SelectItem>
                                    <SelectItem value="30">30 minutos</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            onClick={handleManualLock}
                            variant="outline"
                            className="border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold h-11 rounded-xl"
                        >
                            <Lock className="h-4 w-4 mr-2" />
                            Bloquear Ahora
                        </Button>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-blue-900">
                                    Requerirá Autenticación Biométrica
                                </p>
                                <p className="text-xs text-blue-700">
                                    Para desbloquear el panel necesitarás usar tu huella, Face ID o llave de seguridad.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Audit Log Preview */}
            <Card className="border-white/40 bg-white/60 backdrop-blur-xl shadow-xl shadow-gray-200/50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl text-gray-900 flex items-center gap-2 font-bold tracking-tight">
                                <ScrollText className="h-5 w-5 text-purple-600" />
                                Registro de Auditoría
                            </CardTitle>
                            <CardDescription className="text-gray-500 font-medium">
                                Últimos eventos de seguridad registrados
                            </CardDescription>
                        </div>
                        <Badge className="bg-green-500/10 text-green-700 border-green-200 font-bold">
                            En vivo
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {isLoadingLogs ? (
                            <div className="text-center py-4 text-gray-400 text-sm">Cargando eventos...</div>
                        ) : auditLogs.length === 0 ? (
                            <div className="text-center py-4 text-gray-400 text-sm">No hay eventos recientes</div>
                        ) : (
                            auditLogs.map((log) => (
                                <AuditLogEntry
                                    key={log.id}
                                    event={formatEventType(log.event_type)}
                                    action={log.action_name || log.event_type}
                                    timestamp={new Date(log.created_at)}
                                    status={log.success ? 'success' : 'failure'}
                                />
                            ))
                        )}
                    </div>

                    <div className="mt-5 pt-5 border-t border-gray-200">
                        <p className="text-center text-sm text-gray-500">
                            Los eventos se registran automáticamente y se conservan por 90 días
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Geo-Lockdown Preview */}
            <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden border border-zinc-800">
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 to-zinc-800" />
                <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                            <Globe className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Global Access Control</h3>
                            <p className="text-zinc-400 text-sm">Restricción de acceso basada en geolocalización IP</p>
                        </div>
                    </div>
                    <button className="bg-white text-zinc-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-400 hover:text-white transition-all shadow-lg hover:shadow-emerald-500/20">
                        Configurar Geo-Fencing
                    </button>
                </div>
            </div>

            {/* Audit Log Hint */}
            <div className="flex items-center justify-center gap-2 text-sm text-zinc-400 pt-4">
                <ShieldCheck className="h-4 w-4" />
                <span>Todas las acciones de seguridad quedan registradas en el Audit Log</span>
            </div>
        </div>
    );
};

// Helper para formatear nombres de eventos
function formatEventType(type: string): string {
    const map: Record<string, string> = {
        'passkey_registered': 'Dispositivo registrado',
        'login_success': 'Inicio de sesión exitoso',
        'login_failed': 'Intento de acceso fallido',
        'reauthenticated': 'Reautenticación biométrica',
        'password_change': 'Cambio de contraseña',
        'admin_action': 'Acción administrativa'
    };
    return map[type] || type;
}

// Componente auxiliar para entradas de audit log
function AuditLogEntry({
    event,
    action,
    timestamp,
    status
}: {
    event: string;
    action: string;
    timestamp: Date;
    status: 'success' | 'failure';
}) {
    return (
        <div className="flex items-center justify-between p-4 bg-white/80 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${status === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                    }`} />
                <div>
                    <p className="font-semibold text-gray-900">{event}</p>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">{action}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-xs text-gray-600 font-medium">
                    {formatDistanceToNow(timestamp, { addSuffix: true, locale: es })}
                </p>
            </div>
        </div>
    );
}

export default Security;
