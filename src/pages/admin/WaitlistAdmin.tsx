/**
 * WaitlistAdmin — Panel de control de Lista de Espera v2.1
 * Ruta: /admin/waitlist
 *
 * Permite al administrador:
 * - Activar/desactivar la visibilidad de cada módulo en el modal público
 * - Ver en tiempo real cuáles módulos están activos
 * - Preview rápido del estado del modal desde el admin
 *
 * Arquitectura:
 * - Lee/escribe en dentaxy_modules.waitlist_visible
 * - Usa React Query para caché y revalidación
 * - Realtime via canal Supabase para sincronizar entre pestañas
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Sprout, ShoppingBag, FlaskConical, Users, Newspaper,
  Award, Globe, Banknote, Eye, EyeOff, RefreshCw,
  CheckCircle2, Radio, Loader2, AlertTriangle, Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  waitlistService,
  WaitlistModule,
  WaitlistToggles,
  WAITLIST_MODULE_KEYS,
} from '@/services/waitlist';
import { supabase } from '@/integrations/supabase/client';

// ─── Mapa de identidad visual por módulo ─────────────────────────────────────

interface ModuleVisualConfig {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  group: 'Operación' | 'Gremio' | 'Expansión';
  description: string;
}

const MODULE_VISUAL: Record<WaitlistModule, ModuleVisualConfig> = {
  Seed: {
    label: 'Seed',
    icon: <Sprout className="w-5 h-5" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    group: 'Operación',
    description: 'Software inicial para gestión de historias clínicas',
  },
  Shop: {
    label: 'Shop',
    icon: <ShoppingBag className="w-5 h-5" />,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    group: 'Operación',
    description: 'Marketplace de insumos dentales con logística integrada',
  },
  Lab: {
    label: 'Lab',
    icon: <FlaskConical className="w-5 h-5" />,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    group: 'Operación',
    description: 'Gestión de trabajos protésicos y comunicación con laboratorios',
  },
  Club: {
    label: 'Club',
    icon: <Users className="w-5 h-5" />,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    group: 'Gremio',
    description: 'Red social y comunidad odontológica en tiempo real',
  },
  News: {
    label: 'News',
    icon: <Newspaper className="w-5 h-5" />,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    group: 'Gremio',
    description: 'Noticias y tendencias globales filtradas por IA',
  },
  Aura: {
    label: 'Aura',
    icon: <Award className="w-5 h-5" />,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    group: 'Gremio',
    description: 'Portafolio de prestigio y certificaciones verificadas',
  },
  Space: {
    label: 'Space',
    icon: <Globe className="w-5 h-5" />,
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    group: 'Expansión',
    description: 'Generador de páginas web profesionales para clínicas',
  },
  MyLana: {
    label: 'MyLana',
    icon: <Banknote className="w-5 h-5" />,
    color: 'text-lime-600',
    bg: 'bg-lime-50',
    border: 'border-lime-200',
    group: 'Expansión',
    description: 'Control financiero clínico con proyecciones de crecimiento',
  },
};

const GROUPS: Array<'Operación' | 'Gremio' | 'Expansión'> = ['Operación', 'Gremio', 'Expansión'];

// ─── Componente principal ─────────────────────────────────────────────────────

const WaitlistAdmin: React.FC = () => {
  const [toggles, setToggles] = useState<WaitlistToggles | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingModule, setSavingModule] = useState<WaitlistModule | null>(null);
  const [realtimeConnected, setRealtimeConnected] = useState(false);

  // ── Carga inicial ─────────────────────────────────────────────────────────
  const loadToggles = useCallback(async () => {
    try {
      const data = await waitlistService.getToggles();
      setToggles(data);
    } catch (err) {
      toast.error('No se pudieron cargar los toggles. Verifica la conexión con Supabase.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadToggles();
  }, [loadToggles]);

  // ── Suscripción Realtime ───────────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('waitlist-admin-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'dentaxy_modules',
          filter: `name=in.(${WAITLIST_MODULE_KEYS.join(',')})`,
        },
        (payload) => {
          const updated = payload.new as { name: string; waitlist_visible: boolean };
          if (WAITLIST_MODULE_KEYS.includes(updated.name as WaitlistModule)) {
            setToggles((prev) =>
              prev
                ? { ...prev, [updated.name as WaitlistModule]: updated.waitlist_visible }
                : prev
            );
          }
        }
      )
      .subscribe((status) => {
        setRealtimeConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ── Toggle individual ─────────────────────────────────────────────────────
  const handleToggle = async (module: WaitlistModule, newValue: boolean) => {
    if (!toggles) return;

    // Optimistic update
    setToggles((prev) => prev ? { ...prev, [module]: newValue } : prev);
    setSavingModule(module);

    try {
      await waitlistService.updateToggle(module, newValue);
      toast.success(
        newValue
          ? `✅ ${module} ahora es visible en la Lista de Espera`
          : `🔒 ${module} ocultado de la Lista de Espera`,
        { duration: 2500 }
      );
    } catch (err) {
      // Revertir en caso de error
      setToggles((prev) => prev ? { ...prev, [module]: !newValue } : prev);
      toast.error(`Error al actualizar ${module}. Intenta de nuevo.`);
    } finally {
      setSavingModule(null);
    }
  };

  // ── Estadísticas rápidas ─────────────────────────────────────────────────
  const activeCount = toggles
    ? WAITLIST_MODULE_KEYS.filter((k) => toggles[k]).length
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Lista de Espera
          </h1>
          <p className="text-gray-400 font-medium mt-1">
            Control de visibilidad del modal público de waitlist
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Indicador Realtime */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-colors ${
              realtimeConnected
                ? 'text-emerald-600 bg-emerald-50 border-emerald-100'
                : 'text-gray-400 bg-gray-50 border-gray-100'
            }`}
          >
            <Radio className={`w-3 h-3 ${realtimeConnected ? 'text-emerald-500' : 'text-gray-400'}`} />
            {realtimeConnected ? 'REALTIME ON' : 'CONECTANDO...'}
          </div>

          {/* Botón refresh manual */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setLoading(true); loadToggles(); }}
            disabled={loading}
            className="rounded-xl"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* ── Nota informativa ──────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50 border border-blue-100">
        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-blue-700 leading-relaxed">
          Los toggles controlan qué módulos aparecen en el selector{' '}
          <span className="font-semibold">«¿Qué módulos te interesan?»</span> del modal de
          Lista de Espera en la página principal. Los cambios son{' '}
          <span className="font-semibold">instantáneos y en tiempo real</span> — no requieren
          recargar la página.
        </p>
      </div>

      {/* ── Resumen rápido ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Módulos Visibles',
            value: loading ? '—' : String(activeCount),
            sub: 'de 8 totales',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
          },
          {
            label: 'Ocultados',
            value: loading ? '—' : String(8 - activeCount),
            sub: 'módulos inactivos',
            color: 'text-gray-500',
            bg: 'bg-gray-50',
          },
          {
            label: 'Seed',
            value: toggles?.Seed ? 'Visible' : 'Oculto',
            sub: 'módulo principal',
            color: toggles?.Seed ? 'text-blue-600' : 'text-gray-400',
            bg: toggles?.Seed ? 'bg-blue-50' : 'bg-gray-50',
          },
          {
            label: 'Estado GAS',
            value: 'Activo',
            sub: 'Google Apps Script',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} rounded-2xl p-4 border border-white/80 shadow-sm`}
          >
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Estado de carga ───────────────────────────────────────────────── */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
            <p className="text-sm text-gray-400">Cargando configuración...</p>
          </div>
        </div>
      )}

      {/* ── Grid de módulos por grupo ─────────────────────────────────────── */}
      {!loading && toggles && (
        <div className="space-y-8">
          {GROUPS.map((group) => {
            const groupModules = WAITLIST_MODULE_KEYS.filter(
              (key) => MODULE_VISUAL[key].group === group
            );

            return (
              <div key={group}>
                {/* Etiqueta de grupo */}
                <div className="flex items-center gap-3 mb-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {group}
                  </p>
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-300">
                    {groupModules.filter((k) => toggles[k]).length}/{groupModules.length} activos
                  </span>
                </div>

                {/* Tarjetas de módulo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {groupModules.map((moduleKey) => {
                    const config = MODULE_VISUAL[moduleKey];
                    const isVisible = toggles[moduleKey];
                    const isSaving = savingModule === moduleKey;

                    return (
                      <motion.div
                        key={moduleKey}
                        layout
                        className={`relative rounded-[1.5rem] border-2 p-5 transition-all duration-300 ${
                          isVisible
                            ? `bg-white ${config.border} shadow-sm hover:shadow-md`
                            : 'bg-gray-50 border-gray-100 opacity-60 hover:opacity-80'
                        }`}
                      >
                        {/* Badge de estado */}
                        <div className="absolute top-4 right-4">
                          <AnimatePresence mode="wait">
                            {isSaving ? (
                              <motion.div
                                key="saving"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              >
                                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                              </motion.div>
                            ) : isVisible ? (
                              <motion.div
                                key="visible"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}
                              >
                                <Eye className="w-2.5 h-2.5" />
                                VISIBLE
                              </motion.div>
                            ) : (
                              <motion.div
                                key="hidden"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400"
                              >
                                <EyeOff className="w-2.5 h-2.5" />
                                OCULTO
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Ícono + nombre */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${config.bg} ${config.color}`}>
                            {config.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{config.label}</h3>
                            <p className="text-xs text-gray-400">{config.group}</p>
                          </div>
                        </div>

                        {/* Descripción */}
                        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                          {config.description}
                        </p>

                        {/* Switch de toggle */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                          <span className="text-xs font-semibold text-gray-500">
                            Mostrar en Waitlist
                          </span>
                          <Switch
                            checked={isVisible}
                            onCheckedChange={(val) => handleToggle(moduleKey, val)}
                            disabled={isSaving}
                            className="data-[state=checked]:bg-emerald-500"
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Advertencia si no hay módulos disponibles ─────────────────────── */}
      {!loading && toggles && activeCount === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100"
        >
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-700">
            <span className="font-semibold">Ningún módulo está visible.</span> Los visitantes
            verán un mensaje de «No hay fases abiertas». Activa al menos uno para capturar leads.
          </p>
        </motion.div>
      )}

      {/* ── Nota sobre migración Supabase ─────────────────────────────────── */}
      {!loading && !toggles && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100">
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-amber-700">Migración pendiente</p>
            <p className="text-xs text-amber-600 leading-relaxed">
              La columna <code className="bg-amber-100 px-1 rounded">waitlist_visible</code> aún
              no existe en <code className="bg-amber-100 px-1 rounded">dentaxy_modules</code>.
              Ejecuta el archivo{' '}
              <code className="bg-amber-100 px-1 rounded">
                supabase/migrations/waitlist_v2_add_visible_column.sql
              </code>{' '}
              en el Dashboard de Supabase → SQL Editor.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaitlistAdmin;
