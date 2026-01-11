import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuthContext } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Copy, Check, Loader2, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const DURATION_OPTIONS = [
  { value: '15', label: '15 minutos' },
  { value: '60', label: '1 hora' },
  { value: '1440', label: '24 horas' },
  { value: '4320', label: '3 días' },
  { value: '10080', label: '7 días' },
];

const MODULES = [
  { id: 'motor_neuronal', name: 'Motor Neuronal' },
  { id: 'proyecto_stark', name: 'Proyecto Stark' },
  { id: 'academico', name: 'Módulo Académico' },
  { id: 'enterprise', name: 'Enterprise Suite' },
  { id: 'visualizacion_3d', name: 'Visualización 3D' },
];

export const DemoLinkCreator: React.FC<{ onCreated: () => void }> = ({ onCreated }) => {
  const { adminId, isAuthenticated } = useAdminAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [duration, setDuration] = useState('60');
  const [maxUses, setMaxUses] = useState('1');
  const [selectedModules, setSelectedModules] = useState<string[]>(['motor_neuronal']);

  const generateToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreate = async () => {
    if (!isAuthenticated || !adminId) {
      toast.error('Debes estar autenticado como admin');
      return;
    }

    setIsCreating(true);
    try {
      const token = generateToken();
      const expiresAt = new Date(Date.now() + parseInt(duration) * 60 * 1000).toISOString();

      const { error } = await supabase.from('demo_links').insert({
        token,
        created_by: adminId,
        expires_at: expiresAt,
        max_uses: parseInt(maxUses),
        allowed_modules: selectedModules,
      });

      if (error) throw error;

      const link = `${window.location.origin}/modules?demo=${token}`;
      setCreatedLink(link);

      // Log the creation
      await supabase.from('audit_logs').insert({
        action: 'DEMO_LINK_CREATED',
        resource_type: 'demo_link',
        resource_id: token,
        user_id: adminId,
        details: { duration, max_uses: maxUses, modules: selectedModules },
      });

      toast.success('Demo creado exitosamente');
      onCreated();
    } catch (error) {
      console.error('Error creating demo:', error);
      toast.error('Error al crear el demo');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = async () => {
    if (!createdLink) return;
    await navigator.clipboard.writeText(createdLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copiado al portapapeles');
  };

  const handleClose = () => {
    setIsOpen(false);
    setCreatedLink(null);
    setDuration('60');
    setMaxUses('1');
    setSelectedModules(['motor_neuronal']);
  };

  const toggleModule = (moduleId: string) => {
    setSelectedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((m) => m !== moduleId) : [...prev, moduleId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? setIsOpen(true) : handleClose())}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Crear Demo
        </Button>
      </DialogTrigger>
      <DialogContent className="border-zinc-800 bg-zinc-950 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">
            {createdLink ? 'Demo Creado' : 'Crear Nuevo Demo'}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {createdLink
              ? 'Comparte este link con el usuario para acceder al demo.'
              : 'Configura las opciones del demo temporal.'}
          </DialogDescription>
        </DialogHeader>

        {createdLink ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
              <Link2 className="h-4 w-4 shrink-0 text-zinc-500" />
              <input
                type="text"
                readOnly
                value={createdLink}
                className="flex-1 bg-transparent text-sm text-zinc-300 outline-none"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="shrink-0 text-zinc-400 hover:text-zinc-100"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="rounded-lg bg-zinc-900/50 p-3 text-xs text-zinc-500">
              <p>• Duración: {DURATION_OPTIONS.find((o) => o.value === duration)?.label}</p>
              <p>• Usos máximos: {maxUses}</p>
              <p>• Módulos: {selectedModules.join(', ')}</p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-zinc-300">
                Duración
              </Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="border-zinc-800 bg-zinc-900 text-zinc-100">
                  <SelectValue placeholder="Selecciona duración" />
                </SelectTrigger>
                <SelectContent className="border-zinc-800 bg-zinc-900">
                  {DURATION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxUses" className="text-zinc-300">
                Usos Máximos
              </Label>
              <Input
                id="maxUses"
                type="number"
                min="1"
                max="100"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                className="border-zinc-800 bg-zinc-900 text-zinc-100"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">Módulos Permitidos</Label>
              <div className="grid grid-cols-2 gap-2">
                {MODULES.map((module) => (
                  <label
                    key={module.id}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-2.5 transition-colors hover:bg-zinc-800/50"
                  >
                    <Checkbox
                      checked={selectedModules.includes(module.id)}
                      onCheckedChange={() => toggleModule(module.id)}
                    />
                    <span className="text-sm text-zinc-300">{module.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {createdLink ? (
            <Button
              onClick={handleClose}
              className="w-full bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
            >
              Cerrar
            </Button>
          ) : (
            <Button
              onClick={handleCreate}
              disabled={isCreating || selectedModules.length === 0}
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Demo'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
