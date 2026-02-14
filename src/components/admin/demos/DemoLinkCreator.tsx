import React, { useState } from 'react';
import { Plus, Link2, Copy, Check, Sparkles, Lock, LockOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useAdminAuthContext } from '@/contexts/AdminAuthContext';
import { Switch } from '@/components/ui/switch';

const DURATION_OPTIONS = [
  { value: '15', label: '15 minutos' },
  { value: '60', label: '1 hora' },
  { value: '1440', label: '24 horas' },
  { value: '4320', label: '3 días' },
  { value: '10080', label: '7 días' },
];

const MODULES = [
  { id: 'motor_neuronal', name: 'DENTAXY AI', icon: 'Brain', color: '#10B981', route: '/demo/ai' },
  { id: 'dicom', name: 'DICOM', icon: 'Box', color: '#8B5CF6', route: '/demo/dicom' },
  { id: 'academico', name: 'DENTAXY UNIVERSIDADES', icon: 'GraduationCap', color: '#00A3FF', route: '/academico' },
  { id: 'enterprise', name: 'DENTAXY ENTERPRISE', icon: 'Building2', color: '#FFFFFF', route: '/enterprise' },
  { id: 'proyecto_stark', name: 'PROYECTO STARK', icon: 'Hand', color: '#FF2A2A', route: '/stark' },
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
  const [requiresToken, setRequiresToken] = useState(true);
  const [requiresUserInfo, setRequiresUserInfo] = useState(true);

  // Generación de token único con crypto
  const generateToken = () => {
    const uuid = crypto.randomUUID();
    const token = btoa(uuid)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
      .substring(0, 16);
    return token;
  };

  const handleCreate = async () => {
    if (!isAuthenticated || !adminId) {
      toast.error('Debes estar autenticado como admin');
      return;
    }

    setIsCreating(true);
    try {
      // Generar token único con verificación
      let token = generateToken();
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        const { data, error } = await supabase
          .from('demo_links')
          .select('token')
          .eq('token', token)
          .maybeSingle(); // maybeSingle no arroja error si no encuentra nada

        if (error) {
          console.error('Error checking token:', error);
          throw new Error('Error al verificar unicidad del token');
        }

        if (!data) break; // Token único encontrado

        token = generateToken();
        attempts++;
      }

      if (attempts >= maxAttempts) {
        toast.error('No se pudo generar un token único. Intenta de nuevo.');
        setIsCreating(false);
        return;
      }

      const expiresAt = new Date(Date.now() + parseInt(duration) * 60 * 1000).toISOString();

      // Use SECURITY DEFINER function to bypass RLS
      const { data: rpcData, error: rpcError } = await supabase.rpc('create_demo_link', {
        p_token: token,
        p_admin_id: adminId,
        p_expires_at: expiresAt,
        p_max_uses: parseInt(maxUses),
        p_allowed_modules: selectedModules,
        p_requires_token: requiresToken,
        p_requires_user_info: requiresUserInfo,
      });

      if (rpcError) {
        console.error('RPC Error:', rpcError);
        throw new Error(`Error en la base de datos: ${rpcError.message}`);
      }

      const result = rpcData?.[0];
      if (!result?.success) {
        throw new Error(result?.error_message || 'Error desconocido al crear el demo');
      }

      // CORRECCIÓN CRÍTICA: La ruta correcta es /hub, no /modules
      const link = `${window.location.origin}/hub?demo=${token}`;
      setCreatedLink(link);

      toast.success('Demo creado exitosamente');
      onCreated();
    } catch (error) {
      console.error('Error creating demo:', error);
      toast.error(error instanceof Error ? error.message : 'Error al crear el demo');
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
    setRequiresToken(true);
    setRequiresUserInfo(true);
  };

  const toggleModule = (moduleId: string) => {
    setSelectedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((m) => m !== moduleId) : [...prev, moduleId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? setIsOpen(true) : handleClose())}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] transition-all duration-300">
          <Sparkles className="h-4 w-4" />
          Crear Demo
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2 border-emerald-200/50 bg-white/95 backdrop-blur-2xl sm:max-w-2xl shadow-[0_0_100px_rgba(16,185,129,0.2),0_0_60px_rgba(20,184,166,0.15),0_0_30px_rgba(52,211,153,0.1)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2">
            <div className="relative">
              <Sparkles className="h-6 w-6 text-emerald-500" />
              <div className="absolute inset-0 blur-md bg-emerald-500 opacity-50" />
            </div>
            {createdLink ? '✨ Demo Creado' : '🚀 Crear Nuevo Demo'}
          </DialogTitle>
          <DialogDescription className="text-slate-600">
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
            <div className="relative flex items-center gap-2 rounded-2xl border-2 border-emerald-300/50 bg-gradient-to-r from-white to-emerald-50/50 p-4 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-teal-500/5" />
              <Link2 className="h-5 w-5 shrink-0 text-emerald-500 relative z-10" />
              <input
                type="text"
                readOnly
                value={createdLink}
                className="relative z-10 flex-1 bg-transparent text-sm text-slate-800 font-mono outline-none font-semibold"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="relative z-10 shrink-0 text-slate-700 hover:text-emerald-600 hover:bg-emerald-100/80"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-white via-slate-50 to-emerald-50 p-4 text-sm text-slate-600 border-2 border-emerald-100/50 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]">
              <p className="flex items-center gap-2">
                <span className="text-emerald-500">•</span> Duración: {DURATION_OPTIONS.find((o) => o.value === duration)?.label}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-teal-500">•</span> Usos máximos: {maxUses}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-emerald-600">•</span> Módulos: {selectedModules.map(id => MODULES.find(m => m.id === id)?.name || id).join(', ')}
              </p>
              <p className="flex items-center gap-2">
                {requiresToken ? (
                  <Lock className="h-4 w-4 text-amber-500" />
                ) : (
                  <LockOpen className="h-4 w-4 text-emerald-500" />
                )}
                {requiresToken ? 'Requiere token de acceso' : 'Acceso libre (sin token)'}
              </p>
              <p className="flex items-center gap-2">
                {requiresUserInfo ? (
                  <span className="text-teal-600">📝</span>
                ) : (
                  <span className="text-emerald-600">🚀</span>
                )}
                {requiresUserInfo ? 'Solicita información del usuario' : 'Acceso directo (sin formulario)'}
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              {/* Duración */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">Duración de la Sesión</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="bg-white border-2 border-emerald-200/50 text-slate-900 hover:border-emerald-300/50 transition-colors rounded-xl focus:shadow-[0_0_20px_rgba(16,185,129,0.2)] focus:border-emerald-400">
                    <SelectValue placeholder="Seleccione duración" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-xl border-2 border-emerald-100/50 rounded-xl shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                    {DURATION_OPTIONS.map((d) => (
                      <SelectItem
                        key={d.value}
                        value={d.value}
                        className="text-slate-700 focus:bg-gradient-to-r focus:from-emerald-50 focus:to-teal-50 focus:text-emerald-600 rounded-lg"
                      >
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Límite de Usos */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">Límite de Usos</Label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 5, 10, 50, 100].map((num) => (
                    <Button
                      key={num}
                      type="button"
                      variant={maxUses === num.toString() ? 'default' : 'outline'}
                      onClick={() => setMaxUses(num.toString())}
                      className={
                        maxUses === num.toString()
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] font-bold'
                          : 'bg-white border-2 border-emerald-200/50 text-slate-700 hover:border-emerald-300/50 hover:text-emerald-600 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      }
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Módulos Permitidos */}
              <div className="space-y-3">
                <Label className="text-slate-700 font-semibold">Módulos Permitidos</Label>
                <div className="grid grid-cols-2 gap-3">
                  {MODULES.map((module) => (
                    <button
                      key={module.id}
                      type="button"
                      onClick={() => toggleModule(module.id)}
                      className={`
                        relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300
                        border-2 backdrop-blur-sm group
                        ${selectedModules.includes(module.id)
                          ? 'border-emerald-300/50 bg-gradient-to-br from-white via-emerald-50/50 to-teal-50/30 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
                          : 'border-slate-200/50 bg-white/80 hover:border-emerald-200/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${selectedModules.includes(module.id) ? 'text-emerald-700' : 'text-slate-600'}`}>
                          {module.name}
                        </span>
                        <div
                          className={`h-5 w-5 rounded-full border-2 transition-all ${selectedModules.includes(module.id)
                            ? 'border-transparent bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                            : 'border-slate-300 bg-white'
                            }`}
                        >
                          {selectedModules.includes(module.id) && (
                            <Check className="h-full w-full p-0.5 text-white" />
                          )}
                        </div>
                      </div>
                      {selectedModules.includes(module.id) && (
                        <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-emerald-400 to-teal-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Acceso Libre Toggle */}
              <div className="rounded-xl border-2 border-emerald-200/50 bg-gradient-to-br from-white via-slate-50/50 to-emerald-50/30 p-4 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-slate-700 font-semibold flex items-center gap-2">
                      {requiresToken ? (
                        <Lock className="h-4 w-4 text-amber-500" />
                      ) : (
                        <LockOpen className="h-4 w-4 text-emerald-500" />
                      )}
                      Acceso Libre (Temporada Abierta)
                    </Label>
                    <p className="text-xs text-slate-500">
                      {requiresToken
                        ? 'El usuario necesitará un token para acceder'
                        : 'Cualquiera con el link puede acceder sin token'}
                    </p>
                  </div>
                  <Switch
                    checked={!requiresToken}
                    onCheckedChange={(checked) => setRequiresToken(!checked)}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-teal-500"
                  />
                </div>
              </div>

              {/* Solicitar Información del Usuario Toggle */}
              <div className="rounded-xl border-2 border-emerald-200/50 bg-gradient-to-br from-white via-slate-50/50 to-teal-50/30 p-4 shadow-[inset_0_0_20px_rgba(20,184,166,0.05)]">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-slate-700 font-semibold flex items-center gap-2">
                      📝 Solicitar Información del Usuario
                    </Label>
                    <p className="text-xs text-slate-500">
                      {requiresUserInfo
                        ? 'Pedirá nombre, ubicación y email (opcional)'
                        : 'Acceso directo sin recopilar datos'}
                    </p>
                  </div>
                  <Switch
                    checked={requiresUserInfo}
                    onCheckedChange={setRequiresUserInfo}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-teal-500 data-[state=checked]:to-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Botón Crear */}
            <Button
              onClick={handleCreate}
              disabled={isCreating || selectedModules.length === 0}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-6 rounded-xl shadow-[0_0_50px_rgba(16,185,129,0.35)] hover:shadow-[0_0_70px_rgba(16,185,129,0.55)] border-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isCreating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                  </motion.div>
                  Creando...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Crear Demo Link
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
