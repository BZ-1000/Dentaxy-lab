import React, { useState, useEffect } from 'react';
import {
    Activity, Ban, Send, Eye, Clock, MapPin, Mail, User,
    X, AlertTriangle, Info, CheckCircle, XCircle, Power,
    Shield, Sparkles
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAdminAuthContext } from '@/contexts/AdminAuthContext';

interface DemoSession {
    id: string;
    session_id: string;
    demo_link_id: string;
    module_id: string;
    user_name: string | null;
    user_location: string | null;
    user_email: string | null;
    is_blocked: boolean;
    blocked_reason: string | null;
    created_at: string;
    duration_minutes: number;
}

const MODULES = {
    'motor_neuronal': { name: 'DENTAXY AI', color: 'emerald' },
    'dicom': { name: 'DICOM', color: 'violet' },
    'academico': { name: 'UNIVERSIDADES', color: 'blue' },
    'enterprise': { name: 'ENTERPRISE', color: 'slate' },
    'proyecto_stark': { name: 'STARK', color: 'red' },
};

export const DemoEngine: React.FC = () => {
    const { adminId } = useAdminAuthContext();
    const [sessions, setSessions] = useState<DemoSession[]>([]);
    const [selectedSession, setSelectedSession] = useState<string | null>(null);
    const [alertDialogOpen, setAlertDialogOpen] = useState(false);
    const [blockDialogOpen, setBlockDialogOpen] = useState(false);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

    // Alert form
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'info' | 'warning' | 'error' | 'success'>('info');

    // Block form
    const [blockReason, setBlockReason] = useState('');

    // Fetch active sessions
    const fetchSessions = async () => {
        try {
            const { data, error } = await supabase.rpc('get_active_demo_sessions');

            if (error) throw error;

            setSessions(data || []);
        } catch (error) {
            console.error('Error fetching sessions:', error);
            toast.error('Error al cargar sesiones activas');
        }
    };

    useEffect(() => {
        fetchSessions();

        // Real-time subscription
        const subscription = supabase
            .channel('demo_sessions_realtime')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'demo_sessions' },
                () => {
                    fetchSessions();
                }
            )
            .subscribe();

        const interval = setInterval(fetchSessions, 30000); // Refresh cada 30s

        return () => {
            subscription.unsubscribe();
            clearInterval(interval);
        };
    }, []);

    const handleBlockSession = async () => {
        if (!selectedSession || !adminId) return;

        try {
            const { error } = await supabase.rpc('block_demo_session', {
                p_session_id: selectedSession,
                p_reason: blockReason || 'Bloqueado por el administrador',
                p_admin_id: adminId
            });

            if (error) throw error;

            toast.success('Sesión bloqueada exitosamente');
            setBlockDialogOpen(false);
            setBlockReason('');
            fetchSessions();
        } catch (error) {
            console.error('Error blocking session:', error);
            toast.error('Error al bloquear sesión');
        }
    };

    const handleUnblockSession = async (sessionId: string) => {
        if (!adminId) return;

        try {
            const { error } = await supabase.rpc('unblock_demo_session', {
                p_session_id: sessionId,
                p_admin_id: adminId
            });

            if (error) throw error;

            toast.success('Sesión desbloqueada');
            fetchSessions();
        } catch (error) {
            console.error('Error unblocking session:', error);
            toast.error('Error al desbloquear sesión');
        }
    };

    const handleSendAlert = async () => {
        if (!selectedSession || !alertMessage.trim()) {
            toast.error('Ingresa un mensaje para la alerta');
            return;
        }

        try {
            const { error } = await supabase
                .from('demo_alerts')
                .insert({
                    session_id: selectedSession,
                    message: alertMessage,
                    alert_type: alertType,
                    sent_by: adminId
                });

            if (error) throw error;

            toast.success('Alerta enviada al usuario');
            setAlertDialogOpen(false);
            setAlertMessage('');
            setAlertType('info');
        } catch (error) {
            console.error('Error sending alert:', error);
            toast.error('Error al enviar alerta');
        }
    };

    const getSessionDetails = (sessionId: string) => {
        return sessions.find(s => s.session_id === sessionId);
    };

    const getAlertIcon = (type: string) => {
        switch (type) {
            case 'info': return <Info className="h-4 w-4" />;
            case 'warning': return <AlertTriangle className="h-4 w-4" />;
            case 'error': return <XCircle className="h-4 w-4" />;
            case 'success': return <CheckCircle className="h-4 w-4" />;
            default: return <Info className="h-4 w-4" />;
        }
    };

    const activeSessions = sessions.filter(s => !s.is_blocked);
    const blockedSessions = sessions.filter(s => s.is_blocked);

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-3">
                        <Activity className="h-8 w-8 text-emerald-600" />
                        Demo Engine
                    </h2>
                    <p className="text-slate-600 mt-1">Monitoreo y control de sesiones activas</p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg px-4 py-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                        <Power className="h-4 w-4 mr-2" />
                        {activeSessions.length} Activas
                    </Badge>
                    {blockedSessions.length > 0 && (
                        <Badge variant="destructive" className="text-lg px-4 py-2">
                            <Ban className="h-4 w-4 mr-2" />
                            {blockedSessions.length} Bloqueadas
                        </Badge>
                    )}
                </div>
            </div>

            {/* Sessions Table */}
            <div className="border-2 border-emerald-200/50 rounded-2xl overflow-hidden bg-white shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-emerald-50 to-teal-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-emerald-700 uppercase tracking-wider">Usuario</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-emerald-700 uppercase tracking-wider">Módulo</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-emerald-700 uppercase tracking-wider">Ubicación</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-emerald-700 uppercase tracking-wider">Duración</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-emerald-700 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-emerald-700 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sessions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        <Sparkles className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                                        <p>No hay sesiones activas en este momento</p>
                                    </td>
                                </tr>
                            ) : (
                                sessions.map((session) => (
                                    <motion.tr
                                        key={session.session_id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`hover:bg-emerald-50/50 transition-colors ${session.is_blocked ? 'bg-red-50/30' : ''}`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-slate-400" />
                                                <span className="font-medium text-slate-900">{session.user_name || 'Anónimo'}</span>
                                            </div>
                                            {session.user_email && (
                                                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                                    <Mail className="h-3 w-3" />
                                                    {session.user_email}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className={`bg-${MODULES[session.module_id as keyof typeof MODULES]?.color || 'slate'}-100 text-${MODULES[session.module_id as keyof typeof MODULES]?.color || 'slate'}-700`}>
                                                {MODULES[session.module_id as keyof typeof MODULES]?.name || session.module_id}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <MapPin className="h-4 w-4 text-slate-400" />
                                                {session.user_location || 'No especificado'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Clock className="h-4 w-4 text-slate-400" />
                                                {session.duration_minutes} min
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {session.is_blocked ? (
                                                <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                                                    <Ban className="h-3 w-3" />
                                                    Bloqueada
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-emerald-100 text-emerald-700 flex items-center gap-1 w-fit">
                                                    <CheckCircle className="h-3 w-3" />
                                                    Activa
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {/* Ver Detalles */}
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        setSelectedSession(session.session_id);
                                                        setDetailsDialogOpen(true);
                                                    }}
                                                    className="hover:bg-emerald-100 hover:text-emerald-700"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>

                                                {/* Enviar Alerta */}
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        setSelectedSession(session.session_id);
                                                        setAlertDialogOpen(true);
                                                    }}
                                                    className="hover:bg-blue-100 hover:text-blue-700"
                                                    disabled={session.is_blocked}
                                                >
                                                    <Send className="h-4 w-4" />
                                                </Button>

                                                {/* Bloquear/Desbloquear */}
                                                {session.is_blocked ? (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleUnblockSession(session.session_id)}
                                                        className="hover:bg-green-100 hover:text-green-700"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            setSelectedSession(session.session_id);
                                                            setBlockDialogOpen(true);
                                                        }}
                                                        className="hover:bg-red-100 hover:text-red-700"
                                                    >
                                                        <Ban className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Alert Dialog */}
            <Dialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
                <DialogContent className="border-2 border-blue-200/50 bg-white/95 backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-blue-700">
                            <Send className="h-5 w-5" />
                            Enviar Alerta
                        </DialogTitle>
                        <DialogDescription>
                            La alerta aparecerá en tiempo real en la sesión del usuario
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Tipo de Alerta</Label>
                            <Select value={alertType} onValueChange={(value: any) => setAlertType(value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="info">
                                        <div className="flex items-center gap-2">
                                            <Info className="h-4 w-4 text-blue-500" />
                                            Información
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="warning">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                                            Advertencia
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="error">
                                        <div className="flex items-center gap-2">
                                            <XCircle className="h-4 w-4 text-red-500" />
                                            Error
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="success">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                                            Éxito
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Mensaje</Label>
                            <Textarea
                                value={alertMessage}
                                onChange={(e) => setAlertMessage(e.target.value)}
                                placeholder="Escribe el mensaje de la alerta..."
                                rows={4}
                                className="resize-none"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAlertDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSendAlert}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
                        >
                            <Send className="h-4 w-4 mr-2" />
                            Enviar Alerta
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Block Dialog */}
            <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
                <DialogContent className="border-2 border-red-200/50 bg-white/95 backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-700">
                            <Ban className="h-5 w-5" />
                            Bloquear Sesión
                        </DialogTitle>
                        <DialogDescription>
                            El usuario recibirá una notificación y será redirigido
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Razón del Bloqueo</Label>
                            <Textarea
                                value={blockReason}
                                onChange={(e) => setBlockReason(e.target.value)}
                                placeholder="Ejemplo: Uso no autorizado, violación de términos..."
                                rows={3}
                                className="resize-none"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setBlockDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleBlockSession}
                            variant="destructive"
                        >
                            <Ban className="h-4 w-4 mr-2" />
                            Bloquear Sesión
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Details Dialog */}
            <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
                <DialogContent className="border-2 border-emerald-200/50 bg-white/95 backdrop-blur-xl max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-emerald-700">
                            <Eye className="h-5 w-5" />
                            Detalles de Sesión
                        </DialogTitle>
                    </DialogHeader>

                    {selectedSession && (() => {
                        const session = getSessionDetails(selectedSession);
                        if (!session) return null;

                        return (
                            <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-500">Usuario</Label>
                                        <p className="font-medium">{session.user_name || 'Anónimo'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-500">Módulo</Label>
                                        <p className="font-medium">{MODULES[session.module_id as keyof typeof MODULES]?.name || session.module_id}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-500">Ubicación</Label>
                                        <p className="font-medium">{session.user_location || 'No especificado'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-500">Email</Label>
                                        <p className="font-medium text-sm">{session.user_email || 'No especificado'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-500">Duración</Label>
                                        <p className="font-medium">{session.duration_minutes} minutos</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-500">Inicio</Label>
                                        <p className="font-medium text-sm">{new Date(session.created_at).toLocaleString('es-MX')}</p>
                                    </div>
                                </div>

                                {session.is_blocked && (
                                    <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                                        <p className="text-sm font-semibold text-red-700 mb-1">Sesión Bloqueada</p>
                                        <p className="text-sm text-red-600">{session.blocked_reason}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })()}

                    <DialogFooter>
                        <Button onClick={() => setDetailsDialogOpen(false)}>
                            Cerrar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DemoEngine;
