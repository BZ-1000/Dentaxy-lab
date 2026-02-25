import React, { useState, useEffect } from 'react';
import {
    Hexagon,
    Globe,
    Shield,
    Server,
    Power,
    AlertTriangle,
    Activity,
    CheckCircle2,
    XCircle,
    Clock,
    Database as DatabaseIcon,
    Hand,
    Box,
    MessageSquare,
    Sparkles,
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleModule, setMaintenanceMode } from '@/lib/admin-api';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Database } from '@/integrations/supabase/types';

type Module = Database['public']['Tables']['dentaxy_modules']['Row'] & {
    free_access?: boolean;
    access_message?: string | null;
};

interface ModuleControlCardProps {
    module: Module;
}

const MODULE_CONFIG: Record<string, { label: string; desc: string; icon: any; color: string; bg: string; border: string; accent: string }> = {
    'motor_neuronal': {
        label: 'DENTAXY AI',
        desc: 'Motor Neuronal',
        icon: Hexagon,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        accent: '#10B981'
    },
    'dicom': {
        label: 'DICOM',
        desc: 'Visualización Médica',
        icon: Box,
        color: 'text-violet-600',
        bg: 'bg-violet-50',
        border: 'border-violet-200',
        accent: '#8B5CF6'
    },
    'academico': {
        label: 'DENTAXY UNIVERSIDADES',
        desc: 'Plataforma Académica',
        icon: DatabaseIcon,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        accent: '#00A3FF'
    },
    'enterprise': {
        label: 'DENTAXY ENTERPRISE',
        desc: 'Arquitectura Clínica',
        icon: Globe,
        color: 'text-slate-600',
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        accent: '#94A3B8'
    },
    'proyecto_stark': {
        label: 'PROYECTO STARK',
        desc: 'CLASIFICADO',
        icon: Hand,
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
        accent: '#EF4444'
    },
    'academico_presentacion': {
        label: 'PRESENTACIÓN UAZ',
        desc: 'Presentación Corporativa',
        icon: DatabaseIcon,
        color: 'text-cyan-600',
        bg: 'bg-cyan-50',
        border: 'border-cyan-200',
        accent: '#00A3FF'
    },
    // Fallbacks
    'shop': { label: 'SHOP', desc: 'Shop Module', icon: Globe, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', accent: '#6B7280' },
    'seed': { label: 'SEED', desc: 'Seed Module', icon: DatabaseIcon, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', accent: '#3B82F6' },
    'default': { label: 'MODULE', desc: 'System Module', icon: Server, color: 'text-zinc-600', bg: 'bg-zinc-50', border: 'border-zinc-200', accent: '#71717A' }
};

// Presets de mensajes rápidos para libre acceso
const MESSAGE_PRESETS = [
    'Libre acceso por fase beta — UAO Zacatecas',
    'Demo abierto para clínica colaboradora',
    'Acceso VIP para evaluación académica',
];

export const ModuleControlCard: React.FC<ModuleControlCardProps> = ({ module }) => {
    const config = MODULE_CONFIG[module.name] || MODULE_CONFIG['default'];
    const displayName = MODULE_CONFIG[module.name] ? config.label : (module.display_name || config.label);
    const description = MODULE_CONFIG[module.name] ? config.desc : (module.description || config.desc);
    const Icon = config.icon;

    const queryClient = useQueryClient();
    const [maintenanceReason, setMaintenanceReason] = useState('');
    const [maintenanceDuration, setMaintenanceDuration] = useState('60');

    // --- Estado de libre acceso (sincronizado con la prop del módulo) ---
    const [isFreeAccess, setIsFreeAccess] = useState(module.free_access ?? false);
    const [accessMessage, setAccessMessage] = useState(module.access_message ?? '');
    const [isFreeAccessDialogOpen, setIsFreeAccessDialogOpen] = useState(false);
    const [isSavingFreeAccess, setIsSavingFreeAccess] = useState(false);

    // Sincronizar cuando la prop del módulo cambia (vía realtime)
    useEffect(() => {
        setIsFreeAccess(module.free_access ?? false);
        setAccessMessage(module.access_message ?? '');
    }, [module.free_access, module.access_message]);

    // Mutation para Toggle (Activar/Desactivar módulo)
    const toggleMutation = useMutation({
        mutationFn: toggleModule,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['dentaxy_modules'] });
            toast.success(`Módulo ${data.display_name} ${data.is_enabled ? 'activado' : 'desactivado'} correctamente`);
        },
        onError: (error) => {
            toast.error(`Error: ${error.message}`);
        }
    });

    // Mutation para Mantenimiento
    const maintenanceMutation = useMutation({
        mutationFn: setMaintenanceMode,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['dentaxy_modules'] });
            if (variables.enabled) {
                toast.warning(`Modo mantenimiento activado para ${module.display_name}`);
            } else {
                toast.success(`Modo mantenimiento desactivado para ${module.display_name}`);
            }
        },
        onError: (error) => {
            toast.error(`Error: ${error.message}`);
        }
    });

    const handleToggle = () => {
        const newState = !module.is_enabled;
        toast.promise(
            toggleMutation.mutateAsync({
                moduleId: module.id,
                enabled: newState,
                reason: 'Manual toggle from Admin Panel',
                notifyUsers: true
            }),
            {
                loading: 'Actualizando estado del módulo...',
                success: 'Estado actualizado',
                error: 'Error al actualizar estado'
            }
        );
    };

    const handleMaintenance = (enable: boolean) => {
        maintenanceMutation.mutate({
            moduleId: module.id,
            enabled: enable,
            message: maintenanceReason || 'Mantenimiento programado',
            estimatedDuration: parseInt(maintenanceDuration),
            scheduledEnd: new Date(Date.now() + parseInt(maintenanceDuration) * 60000)
        });
    };

    // Handler principal para guardar libre acceso con mensaje
    // Usa RPC con SECURITY DEFINER para bypassear la política RLS que requiere
    // auth.role()='authenticated'. El panel admin usa custom auth (anon).
    const handleSaveFreeAccess = async (newFreeAccess: boolean) => {
        setIsSavingFreeAccess(true);
        try {
            const { data, error } = await supabase.rpc('set_module_free_access', {
                p_module_id: module.id,
                p_free_access: newFreeAccess,
                p_access_message: newFreeAccess ? (accessMessage || null) : null,
            });

            if (error) throw error;

            const result = data as { success: boolean; error?: string };
            if (!result?.success) {
                throw new Error(result?.error || 'Error desconocido al actualizar el módulo');
            }

            setIsFreeAccess(newFreeAccess);
            queryClient.invalidateQueries({ queryKey: ['dentaxy_modules'] });
            setIsFreeAccessDialogOpen(false);

            toast.success(
                newFreeAccess
                    ? `🔓 Libre acceso activado para ${displayName}`
                    : `🔒 Libre acceso desactivado para ${displayName}`
            );
        } catch (error) {
            console.error('Error toggling free access:', error);
            toast.error('Error al cambiar el modo de acceso');
        } finally {
            setIsSavingFreeAccess(false);
        }
    };

    // Si ya tiene libre acceso, revocarlo directamente (sin dialog)
    const handleFreeAccessClick = () => {
        if (isFreeAccess) {
            // Revocar directamente
            handleSaveFreeAccess(false);
        } else {
            // Abrir dialog para configurar mensaje
            setIsFreeAccessDialogOpen(true);
        }
    };

    const isMaintenance = module.status === 'maintenance';
    const isActive = module.is_enabled && !isMaintenance;

    return (
        <div className={cn(
            "group relative overflow-hidden rounded-[2rem] border p-6 transition-all",
            isActive
                ? `bg-white hover:shadow-lg border-zinc-100`
                : isMaintenance
                    ? "border-amber-200 bg-amber-50/50"
                    : "border-zinc-200 bg-zinc-50 opacity-90"
        )}>
            {/* Estado Badge */}
            <div className="absolute right-6 top-6">
                <div className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
                    isActive ? "bg-emerald-100 text-emerald-700" :
                        isMaintenance ? "bg-amber-100 text-amber-700" : "bg-zinc-200 text-zinc-500"
                )}>
                    {isActive && <CheckCircle2 className="h-3 w-3" />}
                    {isMaintenance && <Clock className="h-3 w-3" />}
                    {!isActive && !isMaintenance && <XCircle className="h-3 w-3" />}
                    {module.status}
                </div>
            </div>

            {/* Header */}
            <div className={cn(
                "mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors group-hover:scale-110 duration-300",
                isActive ? config.bg : isMaintenance ? 'bg-amber-100' : 'bg-zinc-100',
                isActive ? config.color : isMaintenance ? 'text-amber-600' : 'text-zinc-500'
            )}>
                <Icon className="h-7 w-7" />
            </div>

            <div className="mb-2">
                <h3 className="text-xl font-bold text-zinc-900">{displayName}</h3>
                <p className="text-sm font-medium text-zinc-400">{description}</p>
            </div>

            {/* Indicador de libre acceso activo */}
            {isFreeAccess && module.access_message && (
                <div className="mt-3 mb-1 flex items-start gap-2 p-2 rounded-xl bg-emerald-50 border border-emerald-100">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-emerald-700 leading-snug line-clamp-2">
                        {module.access_message}
                    </p>
                </div>
            )}

            {/* Métricas */}
            <div className="mt-6 flex items-center gap-4 border-t border-dashed border-zinc-200 pt-4">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-zinc-400">Uptime</span>
                    <span className="font-mono text-sm font-bold text-zinc-700">99.9%</span>
                </div>
                <div className="h-8 w-px bg-zinc-100" />
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-zinc-400">Acceso</span>
                    <span className={cn(
                        "font-mono text-sm font-bold",
                        isFreeAccess ? "text-emerald-600" : "text-zinc-500"
                    )}>
                        {isFreeAccess ? 'Libre' : 'Token'}
                    </span>
                </div>
                <div className="h-8 w-px bg-zinc-100" />
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-zinc-400">Estado</span>
                    <span className={cn(
                        "font-mono text-sm font-bold",
                        isMaintenance ? "text-amber-600" : isActive ? "text-emerald-600" : "text-zinc-400"
                    )}>
                        {isMaintenance ? 'Maint.' : isActive ? 'Online' : 'Offline'}
                    </span>
                </div>
            </div>

            {/* Acciones */}
            <div className="mt-6 space-y-3">
                {/* Botón de Libre Acceso */}
                <Button
                    variant={isFreeAccess ? "default" : "outline"}
                    className={cn(
                        "w-full font-medium transition-all",
                        isFreeAccess && "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/20"
                    )}
                    onClick={handleFreeAccessClick}
                    disabled={!module.is_enabled || isMaintenance || isSavingFreeAccess}
                >
                    <div className="flex items-center justify-center gap-2">
                        {isFreeAccess ? (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                </svg>
                                <span>🔓 Libre Acceso — Click para cerrar</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span>🔒 Requiere Token</span>
                            </>
                        )}
                    </div>
                </Button>

                {/* Botones de Toggle y Mantenimiento */}
                <div className="flex gap-2">
                    {/* Toggle Button */}
                    <Button
                        variant={isActive ? "outline" : "default"}
                        className={cn(
                            "flex-1 font-bold",
                            !isActive && "bg-zinc-900 hover:bg-zinc-800"
                        )}
                        onClick={handleToggle}
                        disabled={toggleMutation.isPending || isMaintenance}
                    >
                        <Power className="mr-2 h-4 w-4" />
                        {isActive ? 'Desactivar' : 'Activar'}
                    </Button>

                    {/* Maintenance Dialog */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "border-zinc-200",
                                    isMaintenance && "bg-amber-100 border-amber-200 text-amber-700 hover:bg-amber-200"
                                )}
                            >
                                <AlertTriangle className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Modo Mantenimiento: {module.display_name}</DialogTitle>
                                <DialogDescription>
                                    Esto restringirá el acceso a los usuarios durante el mantenimiento.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="flex items-center gap-4">
                                    <Label htmlFor="maintenance-mode" className="flex-1">
                                        Estado de Mantenimiento
                                    </Label>
                                    <Switch
                                        id="maintenance-mode"
                                        checked={isMaintenance}
                                        onCheckedChange={(checked) => {
                                            if (!checked) handleMaintenance(false);
                                        }}
                                    />
                                </div>

                                {!isMaintenance && (
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor="reason">Razón / Mensaje Público</Label>
                                            <Textarea
                                                id="reason"
                                                placeholder="Estamos realizando mejoras..."
                                                value={maintenanceReason}
                                                onChange={(e) => setMaintenanceReason(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="duration">Duración Estimada (min)</Label>
                                            <Input
                                                id="duration"
                                                type="number"
                                                value={maintenanceDuration}
                                                onChange={(e) => setMaintenanceDuration(e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <DialogFooter>
                                {!isMaintenance ? (
                                    <Button
                                        onClick={() => handleMaintenance(true)}
                                        className="bg-amber-500 hover:bg-amber-600 font-bold"
                                    >
                                        Activar Mantenimiento
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => handleMaintenance(false)}
                                        variant="outline"
                                        className="border-amber-200 text-amber-700 hover:bg-amber-50"
                                    >
                                        Finalizar Mantenimiento
                                    </Button>
                                )}
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* ====== Dialog de Libre Acceso + Mensaje ====== */}
            <Dialog open={isFreeAccessDialogOpen} onOpenChange={setIsFreeAccessDialogOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <span
                                className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm"
                                style={{ background: config.accent }}
                            >
                                🔓
                            </span>
                            Activar Libre Acceso — {displayName}
                        </DialogTitle>
                        <DialogDescription>
                            Al activar el libre acceso, cualquier visitante podrá entrar al demo sin necesitar un token.
                            Puedes incluir un mensaje personalizado que verán al entrar.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-5 py-4">
                        {/* Textarea de mensaje */}
                        <div className="grid gap-2">
                            <Label htmlFor="access-message" className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-emerald-500" />
                                Mensaje de Notificación
                                <span className="text-zinc-400 text-xs font-normal">(opcional)</span>
                            </Label>
                            <Textarea
                                id="access-message"
                                placeholder="Libre acceso por fase beta de la Unidad Académica de Odontología"
                                value={accessMessage}
                                onChange={(e) => setAccessMessage(e.target.value)}
                                className="min-h-[80px] resize-none"
                            />
                            <p className="text-xs text-zinc-400">
                                Este mensaje es visible para todos los que entren al demo mientras el libre acceso esté activo.
                            </p>
                        </div>

                        {/* Presets rápidos */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-wider">
                                <Sparkles className="w-3 h-3" />
                                Mensajes Predefinidos
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {MESSAGE_PRESETS.map((preset) => (
                                    <button
                                        key={preset}
                                        type="button"
                                        onClick={() => setAccessMessage(preset)}
                                        className={cn(
                                            "text-xs px-3 py-1.5 rounded-full border transition-all",
                                            accessMessage === preset
                                                ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                                                : "border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
                                        )}
                                    >
                                        {preset}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button
                            onClick={() => handleSaveFreeAccess(true)}
                            disabled={isSavingFreeAccess}
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold shadow-lg shadow-emerald-500/20"
                        >
                            {isSavingFreeAccess ? (
                                <>
                                    <span className="animate-spin mr-2">⟳</span>
                                    Activando...
                                </>
                            ) : (
                                '✅ Activar Libre Acceso'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
