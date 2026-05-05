import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { ModuleCard } from '@/components/admin/modules/ModuleCard';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface Module {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  status: string;
  is_enabled: boolean;
  classification_level: string;
  icon: string | null;
}

const ModulesManager: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchModules = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('dentaxy_modules').select('*').order('created_at');
    setModules((data as Module[]) || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchModules();
  }, []);

  // Stats
  const activeCount = modules.filter(m => m.is_enabled && m.status === 'active').length;
  const blockedCount = modules.filter(m => !m.is_enabled || m.status === 'blocked').length;
  const betaCount = modules.filter(m => m.status === 'beta').length;

  return (
    <div className="min-h-screen">
      <AdminHeader 
        title="Gestión de Módulos" 
        description="Controla el acceso a cada módulo de DENTAXY desde aquí. Los cambios se reflejan al instante en el hub público." 
      />
      
      <div className="p-6">
        {/* Stats bar */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-wrap items-center gap-4"
        >
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <LayoutGrid className="h-4 w-4 text-zinc-500" />
            <span className="text-sm text-zinc-400">
              <span className="font-semibold text-zinc-200">{modules.length}</span> módulos totales
            </span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-sm text-emerald-400">
              <span className="font-semibold">{activeCount}</span> activos
            </span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-sm text-red-400">
              <span className="font-semibold">{blockedCount}</span> bloqueados
            </span>
          </div>
          
          {betaCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-sm text-amber-400">
                <span className="font-semibold">{betaCount}</span> beta
              </span>
            </div>
          )}

          <div className="flex-1" />

          <Button
            variant="outline"
            size="sm"
            onClick={fetchModules}
            disabled={isLoading}
            className="border-zinc-700 hover:bg-zinc-800"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </motion.div>

        {/* Modules grid */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl bg-zinc-800/30" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ModuleCard module={module} onUpdate={fetchModules} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && modules.length === 0 && (
          <div className="text-center py-12">
            <LayoutGrid className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500">No hay módulos configurados</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModulesManager;
