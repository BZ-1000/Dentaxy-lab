import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { ModuleCard } from '@/components/admin/modules/ModuleCard';
import { supabase } from '@/integrations/supabase/client';

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
    const { data } = await supabase.from('dentaxy_modules').select('*').order('created_at');
    setModules((data as Module[]) || []);
    setIsLoading(false);
  };

  useEffect(() => { fetchModules(); }, []);

  return (
    <div className="min-h-screen">
      <AdminHeader title="Gestión de Módulos" description="Controla los módulos de Dentaxy" />
      <div className="p-6">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-32 animate-pulse rounded-xl bg-zinc-800/30" />)}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => <ModuleCard key={module.id} module={module} onUpdate={fetchModules} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModulesManager;
