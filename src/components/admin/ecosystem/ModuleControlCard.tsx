import React, { useState } from 'react';
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
    Box
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
};

interface ModuleControlCardProps {
    module: Module;
}

const MODULE_CONFIG: Record<string, { label: string; desc: string; icon: any; color: string; bg: string; border: string }> = {
    'motor_neuronal': {
        label: 'DENTAXY AI',
        desc: 'Motor Neuronal',
        icon: Hexagon,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200'
    },
    'dicom': {
        label: 'DICOM',
        desc: 'Visualización Médica',
        icon: Box,
        color: 'text-violet-600',
        bg: 'bg-violet-50',
        border: 'border-violet-200'
    },
    'academico': {
        label: 'DENTAXY UNIVERSIDADES',
        desc: 'Plataforma Académica',
        icon: DatabaseIcon,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200'
    },
    'enterprise': {
        label: 'DENTAXY ENTERPRISE',
        desc: 'Arquitectura Clínica',
        icon: Globe,
        color: 'text-slate-600',
        bg: 'bg-slate-50',
        border: 'border-slate-200'
    },
    'proyecto_stark': {
        label: 'PROYECTO STARK',
        desc: 'CLASIFICADO',
        icon: Hand,
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200'
    },
    // Fallbacks para legacy names
    'shop': { label: 'SHOP', desc: 'Shop Module', icon: Globe, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
    'seed': { label: 'SEED', desc: 'Seed Module', icon: DatabaseIcon, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    'visualizacion_3d': { label: 'VIZ 3D', desc: 'Legacy', icon: Activity, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
    'default': { label: 'MODULE', desc: 'System Module', icon: Server, color: 'text-zinc-600', bg: 'bg-zinc-50', border: 'border-zinc-200' }
};

export const ModuleControlCard: React.FC<ModuleControlCardProps> = ({ module }) => {
    const config = MODULE_CONFIG[module.name] || MODULE_CONFIG['default'];
    // Override display name if we have a config for it, otherwise use DB or fallback
    const displayName = MODULE_CONFIG[module.name] ? config.label : (module.display_name || config.label);
    const description = MODULE_CONFIG[module.name] ? config.desc : (module.description || config.desc);
    const Icon = config.icon;

    const queryClient = useQueryClient();
    const [maintenanceReason, setMaintenanceReason] = useState('');
    const [maintenanceDuration, setMaintenanceDuration] = useState('60');
    const [isFreeAccess, setIsFreeAccess] = useState(module.free_access || false);

    // Mutation para Toggle (Activar/Desactivar)
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

    // Handler para toggle de Libre Acceso
    const handleFreeAccessToggle = async () => {
        try {
            const newValue = !isFreeAccess;
            const { error } = await supabase
                .from('dentaxy_modules')
                .update({ free_access: newValue })
                .eq('id', module.id);

            if (error) throw error;

            setIsFreeAccess(newValue);
            queryClient.invalidateQueries({ queryKey: ['dentaxy_modules'] });
            toast.success(
                newValue
                    ? `✅ Libre acceso activado para ${displayName}`
                    : `🔒 Libre acceso desactivado para ${displayName}`
            );
        } catch (error) {
            console.error('Error toggling free access:', error);
            toast.error('Error al cambiar el modo de acceso');
        }
    };

    const isMaintenance = module.status === 'maintenance';
    const isActive = module.is_enabled && !isMaintenance;

    return (
        <div className={cn(
            "group relative overflow-hidden rounded-[2rem] border p-6 transition-all",
            isActive
                ? `bg-white hover:shadow-lg ${config.border} border-${config.border.split('-')[0]}-100`
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

            {/* Métricas Rápidas (Simuladas por ahora, conectar luego) */}
            <div className="mt-6 flex items-center gap-4 border-t border-dashed border-zinc-200 pt-4">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-zinc-400">Uptime</span>
                    <span className="font-mono text-sm font-bold text-zinc-700">99.9%</span>
                </div>
                <div className="h-8 w-px bg-zinc-100" />
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-zinc-400">Latency</span>
                    <span className={cn(
                        "font-mono text-sm font-bold",
                        isMaintenance ? "text-amber-600" : "text-emerald-600"
                    )}>
                        {Math.floor(Math.random() * 50 + 20)}ms
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
                    onClick={handleFreeAccessToggle}
                    disabled={!isActive}
                >
                    <div className="flex items-center justify-center gap-2">
                        {isFreeAccess ? (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                </svg>
                                <span>🔓 Libre Acceso</span>
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
                                    Configura el estado de mantenimiento para este módulo. Esto restringirá el acceso a los usuarios.
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
                </div> {/* Cierre del flex gap-2 de botones */}
            </div> {/* Cierre del space-y-3 de acciones */}
        </div>
    );
};
