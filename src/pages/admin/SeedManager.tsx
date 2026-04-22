/**
 * SeedManager.tsx — Panel Admin: Dentaxy Seed
 * Vista completa de prospectos, clientes y gestión de subdominios.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout, Search, Filter, Eye, CheckCircle2, Clock, XCircle, Globe,
  Download, Brain, Mail, ChevronDown, RefreshCw, Loader2, ExternalLink,
  Building2, Zap, AlertCircle, FileText, MoreVertical, Check, X
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import { ESPECIALIDADES, type AiOutput } from '@/pages/seed/SeedOnboardingModal';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────

interface SeedProspect {
  id: string;
  created_at: string;
  google_email: string;
  google_name: string | null;
  google_picture: string | null;
  especialidad: string;
  clinica_nombre: string;
  clinica_logo_url: string | null;
  historia_url: string | null;
  subdominio: string | null;
  subdominio_activo: boolean;
  ai_output: AiOutput | null;
  ai_processed: boolean;
  ai_error: string | null;
  estado: 'prospecto' | 'pagado' | 'activo' | 'cancelado';
  stripe_session_id: string | null;
  notas_admin: string | null;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const ESTADO_CONFIG = {
  prospecto: { label: 'Prospecto', color: 'text-amber-700 bg-amber-50 border-amber-200', icon: Clock },
  pagado:    { label: 'Pagado',    color: 'text-blue-700 bg-blue-50 border-blue-200',    icon: CheckCircle2 },
  activo:    { label: 'Activo',    color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: Zap },
  cancelado: { label: 'Cancelado', color: 'text-red-700 bg-red-50 border-red-200',       icon: XCircle },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE: DRAWER DE DETALLE
// ─────────────────────────────────────────────────────────────────────────────

const ProspectDrawer: React.FC<{
  prospect: SeedProspect;
  onClose: () => void;
  onUpdate: (id: string, changes: Partial<SeedProspect>) => void;
}> = ({ prospect, onClose, onUpdate }) => {
  const [estado, setEstado] = useState(prospect.estado);
  const [notas, setNotas] = useState(prospect.notas_admin || '');
  const [saving, setSaving] = useState(false);
  const esp = ESPECIALIDADES.find(e => e.id === prospect.especialidad);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('seed_prospects')
      .update({ estado, notas_admin: notas })
      .eq('id', prospect.id);
    if (!error) onUpdate(prospect.id, { estado, notas_admin: notas });
    setSaving(false);
  };

  const handleActivarSubdominio = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('seed_prospects')
      .update({ subdominio_activo: !prospect.subdominio_activo })
      .eq('id', prospect.id);
    if (!error) onUpdate(prospect.id, { subdominio_activo: !prospect.subdominio_activo });
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-[520px] h-full bg-white shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {prospect.clinica_logo_url ? (
              <img src={prospect.clinica_logo_url} alt="" className="w-10 h-10 rounded-xl object-contain border border-gray-100" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl">{esp?.emoji}</div>
            )}
            <div>
              <p className="font-bold text-gray-900 text-sm">{prospect.clinica_nombre}</p>
              <p className="text-xs text-gray-400">{prospect.google_email}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Subdominio */}
          <div className="rounded-2xl border border-gray-100 p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Subdominio</p>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-violet-500" />
                <code className="text-sm font-mono text-gray-800">
                  {prospect.subdominio || '—'}.dentaxy.com
                </code>
              </div>
              <button
                onClick={handleActivarSubdominio}
                disabled={!prospect.subdominio || saving}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all',
                  prospect.subdominio_activo
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'
                )}
              >
                {prospect.subdominio_activo ? '✓ Activo' : 'Activar'}
              </button>
            </div>
          </div>

          {/* IA Output */}
          {prospect.ai_processed && prospect.ai_output ? (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-emerald-600" />
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Generado por IA</p>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed mb-3">{prospect.ai_output.bienvenida}</p>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-500">{prospect.ai_output.campos_formulario.length} campos generados:</p>
                <div className="flex flex-wrap gap-1.5">
                  {prospect.ai_output.campos_formulario.map((c, i) => (
                    <span key={i} className="text-xs bg-white border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded-full">
                      {c.nombre}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-emerald-200">
                <p className="text-xs font-bold text-gray-500 mb-1">Nota de ejemplo:</p>
                <p className="text-xs text-gray-600 italic leading-relaxed">{prospect.ai_output.notas_demo[0]}</p>
              </div>
            </div>
          ) : prospect.ai_error ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-red-700">IA no procesada</p>
                <p className="text-xs text-red-500">{prospect.ai_error}</p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
              <p className="text-xs text-gray-500">IA pendiente de procesamiento</p>
            </div>
          )}

          {/* Historia clínica */}
          {prospect.historia_url && (
            <div className="rounded-2xl border border-gray-100 p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Historia Clínica Original</p>
              <a
                href={prospect.historia_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <FileText className="w-4 h-4" />
                Ver / Descargar archivo
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Estado + Notas */}
          <div className="rounded-2xl border border-gray-100 p-4 space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Estado Comercial</p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(ESTADO_CONFIG) as Array<keyof typeof ESTADO_CONFIG>).map(k => (
                <button
                  key={k}
                  onClick={() => setEstado(k)}
                  className={cn(
                    'py-2 px-3 rounded-xl border text-xs font-bold transition-all',
                    estado === k ? ESTADO_CONFIG[k].color : 'border-gray-100 text-gray-400 hover:bg-gray-50'
                  )}
                >
                  {ESTADO_CONFIG[k].label}
                </button>
              ))}
            </div>
          </div>

          {/* Notas admin */}
          <div className="rounded-2xl border border-gray-100 p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Notas Internas</p>
            <textarea
              value={notas}
              onChange={e => setNotas(e.target.value)}
              placeholder="Ej. Pagó el 22 abr, pendiente activar subdominio..."
              rows={3}
              className="w-full text-xs text-gray-700 resize-none border border-gray-100 rounded-xl p-3 focus:outline-none focus:border-blue-300 placeholder:text-gray-300"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 shrink-0">
          {prospect.google_email && (
            <a
              href={`mailto:${prospect.google_email}`}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors px-3 py-2 rounded-xl hover:bg-blue-50"
            >
              <Mail className="w-4 h-4" /> Contactar
            </a>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Guardar cambios
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PÁGINA PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

const SeedManager: React.FC = () => {
  const [prospects, setProspects] = useState<SeedProspect[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [selected, setSelected] = useState<SeedProspect | null>(null);

  const fetchProspects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('seed_prospects')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setProspects(data as SeedProspect[]);
    setLoading(false);
  };

  useEffect(() => { fetchProspects(); }, []);

  const handleUpdate = (id: string, changes: Partial<SeedProspect>) => {
    setProspects(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, ...changes } : null);
  };

  const filtered = prospects.filter(p => {
    const matchSearch = !search ||
      p.clinica_nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.google_email.toLowerCase().includes(search.toLowerCase()) ||
      (p.subdominio || '').toLowerCase().includes(search.toLowerCase());
    const matchEstado = filterEstado === 'todos' || p.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  // Métricas rápidas
  const metrics = {
    total: prospects.length,
    activos: prospects.filter(p => p.estado === 'activo').length,
    pagados: prospects.filter(p => p.estado === 'pagado').length,
    conIA: prospects.filter(p => p.ai_processed).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-300/30">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Dentaxy Seed Manager</h1>
            <p className="text-xs text-zinc-400">Prospectos, clientes y subdominios</p>
          </div>
        </div>
        <button
          onClick={fetchProspects}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors px-3 py-2 rounded-xl hover:bg-zinc-50 border border-zinc-100"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Actualizar
        </button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Registros', value: metrics.total, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Activos', value: metrics.activos, icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pagados', value: metrics.pagados, icon: CheckCircle2, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Con IA', value: metrics.conIA, icon: Brain, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-zinc-100 bg-white p-4 flex items-center gap-3"
          >
            <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center shrink-0`}>
              <m.icon className={`w-5 h-5 ${m.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900">{m.value}</p>
              <p className="text-xs text-zinc-400">{m.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por clínica, email o subdominio..."
            className="w-full h-10 pl-10 pr-4 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['todos', 'prospecto', 'pagado', 'activo', 'cancelado'].map(e => (
            <button
              key={e}
              onClick={() => setFilterEstado(e)}
              className={cn(
                'px-3 py-2 rounded-xl text-xs font-bold border transition-all capitalize',
                filterEstado === e
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50'
              )}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de prospectos */}
      <div className="rounded-2xl border border-zinc-100 overflow-hidden bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Sprout className="w-8 h-8 text-zinc-300" />
            <p className="text-sm text-zinc-400 font-medium">No hay registros aún</p>
            <p className="text-xs text-zinc-300">Los prospectos aparecerán aquí cuando completen el onboarding</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-50">
            {/* Header de tabla */}
            <div className="grid grid-cols-[1fr_130px_160px_100px_80px] gap-4 px-5 py-3 bg-zinc-50">
              {['Consultorio', 'Especialidad', 'Subdominio', 'Estado', ''].map((h, i) => (
                <p key={i} className="text-xs font-bold text-zinc-400 uppercase tracking-wide">{h}</p>
              ))}
            </div>
            {filtered.map((p, i) => {
              const ec = ESTADO_CONFIG[p.estado];
              const esp = ESPECIALIDADES.find(e => e.id === p.especialidad);
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-[1fr_130px_160px_100px_80px] gap-4 px-5 py-4 hover:bg-zinc-50 cursor-pointer transition-colors items-center"
                  onClick={() => setSelected(p)}
                >
                  {/* Clínica */}
                  <div className="flex items-center gap-3 min-w-0">
                    {p.clinica_logo_url ? (
                      <img src={p.clinica_logo_url} alt="" className="w-8 h-8 rounded-lg object-contain border border-zinc-100 shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-sm shrink-0">{esp?.emoji || '🦷'}</div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 truncate">{p.clinica_nombre}</p>
                      <p className="text-xs text-zinc-400 truncate">{p.google_email}</p>
                    </div>
                  </div>

                  {/* Especialidad */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{esp?.emoji}</span>
                    <span className="text-xs text-zinc-600 font-medium">{esp?.label || p.especialidad}</span>
                  </div>

                  {/* Subdominio */}
                  <div className="flex items-center gap-2">
                    <div className={cn('w-1.5 h-1.5 rounded-full shrink-0', p.subdominio_activo ? 'bg-emerald-500' : 'bg-zinc-300')} />
                    <span className="text-xs font-mono text-zinc-600 truncate">
                      {p.subdominio ? `${p.subdominio}.dentaxy.com` : '—'}
                    </span>
                  </div>

                  {/* Estado */}
                  <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full border inline-flex items-center gap-1', ec.color)}>
                    <ec.icon className="w-3 h-3" />
                    {ec.label}
                  </span>

                  {/* Acciones */}
                  <div className="flex items-center justify-end gap-1">
                    {p.ai_processed && (
                      <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center" title="IA procesada">
                        <Brain className="w-3 h-3 text-emerald-500" />
                      </div>
                    )}
                    <Eye className="w-4 h-4 text-zinc-400" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Drawer de detalle */}
      <AnimatePresence>
        {selected && (
          <ProspectDrawer
            prospect={selected}
            onClose={() => setSelected(null)}
            onUpdate={handleUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SeedManager;
