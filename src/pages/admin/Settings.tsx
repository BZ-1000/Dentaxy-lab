import React from 'react';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { PasskeyManager } from '@/components/admin/security/PasskeyManager';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Clock, Globe, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings: React.FC = () => {

  return (
    <div className="min-h-screen">
      <AdminHeader title="Configuración Avanzada" description="Políticas de seguridad y restricciones globales" />
      <div className="p-6 space-y-6">
        {/* Passkey / WebAuthn Manager */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <PasskeyManager />
        </motion.div>
        {/* Session Policies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-6"
        >
          <div className="mb-6 flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-zinc-100">Políticas de Sesión</h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-zinc-300">Duración máxima de sesión</Label>
                <span className="text-sm font-mono text-zinc-400">15 min</span>
              </div>
              <Slider defaultValue={[15]} max={60} min={5} step={5} className="w-full" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-zinc-300">Timeout de inactividad</Label>
                <span className="text-sm font-mono text-zinc-400">5 min</span>
              </div>
              <Slider defaultValue={[5]} max={30} min={1} step={1} className="w-full" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-zinc-300">Re-auth para acciones críticas</Label>
                <p className="text-xs text-zinc-500">Requiere biometría para operaciones sensibles</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </motion.div>

        {/* Global Restrictions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-6"
        >
          <div className="mb-6 flex items-center gap-3">
            <Globe className="h-5 w-5 text-amber-500" />
            <h3 className="font-semibold text-zinc-100">Restricciones Globales</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-zinc-300">Restricción por país</Label>
                <p className="text-xs text-zinc-500">Solo permitir acceso desde México</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-zinc-300">Bloquear VPNs</Label>
                <p className="text-xs text-zinc-500">Detectar y bloquear conexiones VPN</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-zinc-300">Modo Solo Lectura</Label>
                <p className="text-xs text-zinc-500">Desactivar todas las operaciones de escritura</p>
              </div>
              <Switch />
            </div>
          </div>
        </motion.div>

        {/* Security Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-6"
        >
          <div className="mb-6 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="font-semibold text-zinc-100">Nivel de Seguridad</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {['normal', 'elevated', 'critical'].map((level) => (
              <button
                key={level}
                className={`rounded-lg border p-4 text-left transition-all ${
                  level === 'normal'
                    ? 'border-emerald-500/30 bg-emerald-500/10'
                    : 'border-zinc-800 bg-zinc-800/30 hover:border-zinc-700'
                }`}
              >
                <span className={`text-sm font-medium capitalize ${level === 'normal' ? 'text-emerald-400' : 'text-zinc-400'}`}>
                  {level}
                </span>
                <p className="mt-1 text-xs text-zinc-500">
                  {level === 'normal' && 'Operación estándar'}
                  {level === 'elevated' && 'Alertas adicionales'}
                  {level === 'critical' && 'Máxima vigilancia'}
                </p>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
