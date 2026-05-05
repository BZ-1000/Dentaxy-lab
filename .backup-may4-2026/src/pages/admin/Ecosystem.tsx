import React from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useTableQuery, useRealtimeTable } from '@/hooks/supabase-hooks';
import { ModuleControlCard } from '@/components/admin/ecosystem/ModuleControlCard';
import { useSubsystemStatus } from '@/hooks/useDashboardMetrics';
import type { Database } from '@/integrations/supabase/types';

type Module = Database['public']['Tables']['dentaxy_modules']['Row'];

const Ecosystem = () => {
    // Suscripción en tiempo real a cambios en módulos
    useRealtimeTable('dentaxy_modules');

    // Obtener lista de módulos
    const { data: modules, isLoading } = useTableQuery('dentaxy_modules', {
        orderBy: { column: 'display_name', ascending: true }
    });

    // Estado general del sistema (calculado desde dashboard metrics)
    const { data: subsystemStatus } = useSubsystemStatus();

    // Calcular estado global simplificado
    const allSystemsGo = (modules as Module[])?.every(m => m.status === 'active') ?? true;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Ecosystem Engine</h1>
                    <p className="text-gray-400 font-medium mt-1">Centro de control del Ecosistema Dentaxy Centralizado</p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${allSystemsGo
                    ? 'text-emerald-600 bg-emerald-50 border-emerald-100'
                    : 'text-amber-600 bg-amber-50 border-amber-100'
                    }`}>
                    {allSystemsGo ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span className="text-xs font-bold uppercase tracking-wider">
                        {allSystemsGo ? 'All Systems Operational' : 'Systems Maintenance'}
                    </span>
                </div>
            </div>

            {isLoading ? (
                <div className="flex h-[400px] items-center justify-center rounded-[2rem] border border-dashed border-gray-200 bg-gray-50/50">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        <p className="text-sm font-medium text-gray-400">Cargando módulos del ecosistema...</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(modules as Module[])?.map((mod) => (
                        <ModuleControlCard key={mod.id} module={mod} />
                    ))}

                    {/* Placeholder for future expansion */}
                    <div className="border-2 border-dashed border-gray-200 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center hover:border-emerald-200 hover:bg-emerald-50/30 transition-all cursor-pointer group min-h-[240px]">
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="text-2xl text-gray-300 group-hover:text-emerald-400">+</span>
                        </div>
                        <p className="font-bold text-gray-400 group-hover:text-emerald-600 transition-colors">Deploy New Module</p>
                        <p className="text-xs text-gray-400 mt-2 max-w-[200px]">
                            Implementar nuevo servicio en el ecosistema Dentaxy
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ecosystem;
