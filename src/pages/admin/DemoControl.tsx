import React, { useState } from 'react';
import { DemoLinkCreator } from '@/components/admin/demos/DemoLinkCreator';
import { DemoLinksList } from '@/components/admin/demos/DemoLinksList';
import { ActiveDemoSessions } from '@/components/admin/demos/ActiveDemoSessions';
import { Sparkles, Activity, Link as LinkIcon } from 'lucide-react';

const DemoControl: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50/50">
      {/* Background Effects - Light Theme */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/40 via-white to-white -z-10" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200/20 blur-[100px] rounded-full -z-10" />

      <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between border-b border-gray-200 pb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-indigo-600" />
              Demo Engine
            </h1>
            <p className="text-gray-500 font-medium mt-2 max-w-xl">
              Sistema de control de accesos temporales y monitoreo de sesiones en tiempo real.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Column: Active Sessions (7 cols) */}
          <div className="xl:col-span-7 space-y-6">
            <div className="bg-white border border-gray-200 rounded-[2.5rem] p-8 h-full min-h-[500px] relative overflow-hidden group hover:border-gray-300 transition-all duration-500 shadow-sm">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity className="w-32 h-32 text-indigo-600 -rotate-12" />
              </div>
              <div className="relative z-10">
                <ActiveDemoSessions />
              </div>
            </div>
          </div>

          {/* Right Column: Link Management (5 cols) */}
          <div className="xl:col-span-5 space-y-6">
            {/* Creator Card */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50/30 to-white border border-indigo-100 rounded-[2.5rem] p-8 relative overflow-hidden shadow-sm">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-indigo-600" />
                    Generador de Accesos
                  </h3>
                  <div className="scale-90 origin-right">
                    <DemoLinkCreator onCreated={() => setRefreshTrigger(p => p + 1)} />
                  </div>
                </div>
                <p className="text-gray-500 text-sm">Crea tokens de único uso con expiración automática.</p>
              </div>
            </div>

            {/* List Card */}
            <div className="bg-white border border-gray-200 rounded-[2.5rem] p-8 h-fit min-h-[300px] shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                Links Activos
              </h3>
              <div className="mt-[-1rem]">
                <DemoLinksList refreshTrigger={refreshTrigger} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoControl;
