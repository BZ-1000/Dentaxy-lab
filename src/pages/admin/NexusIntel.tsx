import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Settings2, 
  Sprout, 
  ShoppingBag, 
  FlaskConical, 
  Users, 
  Newspaper, 
  Award, 
  Globe, 
  Banknote,
  Save,
  ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { waitlistService, WaitlistModule, WaitlistToggles } from '@/services/waitlist';

export default function DentaxyNexus() {
  const [toggles, setToggles] = useState<WaitlistToggles | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mapeo UI
  const modules: { id: WaitlistModule, name: string, icon: React.ReactNode, description: string, color: string }[] = [
    { id: 'Seed', name: 'Seed', icon: <Sprout className="w-5 h-5"/>, description: 'Software Clínico y Expedientes', color: 'blue' },
    { id: 'Shop', name: 'Shop', icon: <ShoppingBag className="w-5 h-5"/>, description: 'E-commerce dental', color: 'emerald' },
    { id: 'Lab', name: 'Lab', icon: <FlaskConical className="w-5 h-5"/>, description: 'Gestión Protésica', color: 'purple' },
    { id: 'Club', name: 'Club', icon: <Users className="w-5 h-5"/>, description: 'Red y Comunidad Médica', color: 'orange' },
    { id: 'News', name: 'News', icon: <Newspaper className="w-5 h-5"/>, description: 'Periódico Oficial', color: 'sky' },
    { id: 'Aura', name: 'Aura', icon: <Award className="w-5 h-5"/>, description: 'Portafolios de prestigio', color: 'amber' },
    { id: 'Space', name: 'Space', icon: <Globe className="w-5 h-5"/>, description: 'Websites para doctores', color: 'pink' },
    { id: 'MyLana', name: 'MyLana', icon: <Banknote className="w-5 h-5"/>, description: 'Finanzas y Rentabilidad', color: 'lime' },
  ];

  useEffect(() => {
    const fetchToggles = async () => {
      try {
        const data = await waitlistService.getToggles();
        setToggles(data);
      } catch (err) {
        toast.error('Error al cargar la configuración de Waitlist');
      } finally {
        setIsLoading(false);
      }
    };
    fetchToggles();
  }, []);

  const handleToggle = (moduleId: WaitlistModule, val: boolean) => {
    if (!toggles) return;
    setToggles(prev => ({ ...prev!, [moduleId]: val }));
  };

  const handleSave = async () => {
    if (!toggles) return;
    setIsSaving(true);
    try {
      await waitlistService.updateToggles(toggles);
      toast.success('Configuración Guardada', {
        description: 'La Master Waitlist se ha sincronizado correctamente.',
        icon: '🔗'
      });
    } catch (err) {
      toast.error('Error al guardar', { description: (err as Error).message });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500 text-zinc-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        Sincronizando Estado...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-3">
            Gestor de Espera
            <span className="text-emerald-600 text-[10px] uppercase font-black px-2.5 py-1 bg-emerald-100 rounded-md tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              En la nube
            </span>
          </h1>
          <p className="mt-1.5 text-sm font-medium text-zinc-500">
            Control de módulos activos y persistencia en ecosistema Dentaxy
          </p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl h-11 px-6 shadow-md transition-all active:scale-95"
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Guardar Cambios
        </Button>
      </div>

      <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 flex gap-3 text-sm font-medium items-start">
        <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600" />
        <div>
          <p>
            <b>Atención:</b> Los Leads ahora se capturan de forma centralizada al endpoint de Google Apps Script. 
            El panel P2P ha sido deprecado para garantizar escalabilidad pura y almacenamiento confiable en master sheets.
          </p>
          <p className="mt-1 font-mono text-xs opacity-80 break-all">
            Sheet Endpoint: https://script.google.com/macros/s/AKfy.../exec
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map((mod, i) => {
          const isOn = toggles?.[mod.id] ?? false;
          
          // Compute dynamic classes using basic template literals
          const borderColor = isOn ? `border-${mod.color}-200` : 'border-zinc-200';
          const shadowColor = isOn ? `shadow-md shadow-${mod.color}-100` : '';
          const bgIcon = `bg-${mod.color}-50 text-${mod.color}-600`;

          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`relative overflow-hidden group bg-white border ${borderColor} ${shadowColor} rounded-2xl p-5 transition-all duration-300`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgIcon}`}>
                  {mod.icon}
                </div>
                <Switch 
                  checked={isOn}
                  onCheckedChange={(val) => handleToggle(mod.id, val)}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-zinc-900">{mod.name}</h3>
                  <Badge variant="secondary" className={`text-[10px] uppercase font-bold px-1.5 py-0 ${isOn ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'}`}>
                    {isOn ? 'Waitlist' : 'Lanzado'}
                  </Badge>
                </div>
                <p className="text-xs text-zinc-500 line-clamp-2">
                  {mod.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
