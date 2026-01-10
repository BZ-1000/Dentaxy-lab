import React from 'react';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { MapPin, Clock, MessageSquare, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentModule: React.FC = () => {
  return (
    <div className="min-h-screen">
      <AdminHeader title="Módulo Alumnos" description="Control de acceso estudiantil y chat" />
      <div className="p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Geofencing Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <MapPin className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-100">Zonas de Geofencing</h3>
                <p className="text-sm text-zinc-500">Campus universitarios autorizados</p>
              </div>
            </div>
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-zinc-700 bg-zinc-800/30">
              <p className="text-sm text-zinc-500">Mapa de zonas próximamente</p>
            </div>
          </motion.div>

          {/* Time Windows Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-100">Ventanas Temporales</h3>
                <p className="text-sm text-zinc-500">Períodos de acceso (48-72h)</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-zinc-800/30 p-3">
                <span className="text-sm text-zinc-300">UNAM - Odontología</span>
                <span className="text-xs text-emerald-500">Activo</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-zinc-800/30 p-3">
                <span className="text-sm text-zinc-300">IPN - Medicina</span>
                <span className="text-xs text-zinc-500">Inactivo</span>
              </div>
            </div>
          </motion.div>

          {/* Chat Moderation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-100">Chat Estudiantil</h3>
                  <p className="text-sm text-zinc-500">Moderación en tiempo real</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-emerald-500">Activo</span>
              </div>
            </div>
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-zinc-700 bg-zinc-800/30">
              <div className="text-center">
                <Users className="mx-auto h-8 w-8 text-zinc-600" />
                <p className="mt-2 text-sm text-zinc-500">No hay mensajes recientes</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudentModule;
