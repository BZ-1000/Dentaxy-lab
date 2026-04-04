/**
 * WaitlistMasterModal — Dentaxy Waitlist v2.1
 *
 * Funcionalidades:
 *  - Selección MÚLTIPLE de módulos (con íconos y colores corporativos)
 *  - PDF + nota privacidad IA: SOLO para Seed
 *  - Teléfono obligatorio incluido en el payload
 *  - Modules agrupados: Operación / Gremio / Expansión
 *  - Toggles controlados desde admin (Fase 2) mediante dentaxy_modules.waitlist_visible
 *  - Fallback: todos visibles si Supabase no responde
 *  - Concatenación de módulos: "Seed, Lab, MyLana"
 *  - Estado de éxito con limpieza de formulario
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  Upload,
  Loader2,
  ArrowRight,
  AlertCircle,
  Sprout,
  ShoppingBag,
  FlaskConical,
  Users,
  Newspaper,
  Award,
  Globe,
  Banknote,
  CheckCircle2,
  ShieldCheck,
  Phone,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  waitlistService,
  WaitlistModule,
  WaitlistToggles,
  WAITLIST_MODULE_KEYS,
} from '@/services/waitlist';

// ─── Definición del ecosistema con identidad visual ──────────────────────────

interface EcosystemModuleDef {
  key: WaitlistModule;
  label: string;
  badge: string;
  icon: React.ReactNode;
  /** Color hexadecimal corporativo para borde activo y fondo */
  color: string;
  iconBg: string;
  iconColor: string;
  group: 'operacion' | 'gremio' | 'expansion';
}

const ECOSYSTEM_MODULES: EcosystemModuleDef[] = [
  // ── Operación ──────────────────────────────────────────────────────────────
  {
    key: 'Seed',
    label: 'Seed',
    badge: 'Software Inicial',
    icon: <Sprout className="w-4 h-4" />,
    color: '#2563EB',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    group: 'operacion',
  },
  {
    key: 'Shop',
    label: 'Shop',
    badge: 'Tienda Online',
    icon: <ShoppingBag className="w-4 h-4" />,
    color: '#16A34A',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    group: 'operacion',
  },
  {
    key: 'Lab',
    label: 'Lab',
    badge: 'Laboratorios',
    icon: <FlaskConical className="w-4 h-4" />,
    color: '#7C3AED',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    group: 'operacion',
  },
  // ── Gremio ─────────────────────────────────────────────────────────────────
  {
    key: 'Club',
    label: 'Club',
    badge: 'Comunidad',
    icon: <Users className="w-4 h-4" />,
    color: '#EA580C',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    group: 'gremio',
  },
  {
    key: 'News',
    label: 'News',
    badge: 'Noticias',
    icon: <Newspaper className="w-4 h-4" />,
    color: '#0284C7',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
    group: 'gremio',
  },
  {
    key: 'Aura',
    label: 'Aura',
    badge: 'Prestigio',
    icon: <Award className="w-4 h-4" />,
    color: '#D97706',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    group: 'gremio',
  },
  // ── Expansión ──────────────────────────────────────────────────────────────
  {
    key: 'Space',
    label: 'Space',
    badge: 'Web Builder',
    icon: <Globe className="w-4 h-4" />,
    color: '#DB2777',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    group: 'expansion',
  },
  {
    key: 'MyLana',
    label: 'MyLana',
    badge: 'Finanzas',
    icon: <Banknote className="w-4 h-4" />,
    color: '#65A30D',
    iconBg: 'bg-lime-100',
    iconColor: 'text-lime-600',
    group: 'expansion',
  },
];

const GROUP_LABELS: Record<EcosystemModuleDef['group'], string> = {
  operacion: 'Operación',
  gremio: 'Gremio',
  expansion: 'Expansión',
};

// ─── Estado inicial del formulario ────────────────────────────────────────────

interface FormState {
  fullName: string;
  email: string;
  phone: string;
}

const EMPTY_FORM: FormState = { fullName: '', email: '', phone: '' };

// ─── Props ────────────────────────────────────────────────────────────────────

interface WaitlistMasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * Si se pasa, fija el módulo y oculta el selector de módulos.
   * Útil para lanzar el modal desde la página de un módulo específico.
   */
  preselectedModule?: WaitlistModule | string;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function WaitlistMasterModal({
  isOpen,
  onClose,
  preselectedModule,
}: WaitlistMasterModalProps) {
  // ── Estado del formulario ──────────────────────────────────────────────────
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<{
    base64?: string;
    mime?: string;
    name?: string;
  }>({});

  // ── Selección de módulos ───────────────────────────────────────────────────
  const [selectedModules, setSelectedModules] = useState<WaitlistModule[]>(
    preselectedModule ? [preselectedModule as WaitlistModule] : []
  );
  const [toggles, setToggles] = useState<WaitlistToggles | null>(null);
  const [togglesLoading, setTogglesLoading] = useState(false);

  // ── Estado de UI ───────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // ── Carga de toggles ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || preselectedModule) return;

    setTogglesLoading(true);
    waitlistService
      .getToggles()
      .then(setToggles)
      .catch(() => {
        // Si falla, continuamos con null → DEFAULT_TOGGLES (todos visible)
        console.warn('[WaitlistModal] No se pudieron cargar los toggles. Mostrando todos.');
      })
      .finally(() => setTogglesLoading(false));
  }, [isOpen, preselectedModule]);

  // ── Sincronizar preselección ────────────────────────────────────────────────
  useEffect(() => {
    if (preselectedModule) {
      setSelectedModules([preselectedModule as WaitlistModule]);
    }
  }, [preselectedModule]);

  // ── Helpers de módulos ─────────────────────────────────────────────────────

  /** Determina si un módulo debe mostrarse según los toggles cargados */
  const isModuleVisible = useCallback(
    (key: WaitlistModule): boolean => {
      // Si no hay toggles cargados aún → mostrar todos (no bloquear UX)
      if (!toggles) return true;
      return toggles[key] ?? true;
    },
    [toggles]
  );

  /** Módulos visibles filtrados por toggles, agrupados por categoría */
  const visibleModules = preselectedModule
    ? ECOSYSTEM_MODULES.filter((m) => m.key === preselectedModule)
    : ECOSYSTEM_MODULES.filter((m) => isModuleVisible(m.key));

  const groupedModules = (['operacion', 'gremio', 'expansion'] as const).reduce<
    Partial<Record<EcosystemModuleDef['group'], EcosystemModuleDef[]>>
  >((acc, group) => {
    const items = visibleModules.filter((m) => m.group === group);
    if (items.length > 0) acc[group] = items;
    return acc;
  }, {});

  const isSeedSelected =
    selectedModules.includes('Seed') || preselectedModule === 'Seed';

  const toggleModule = (key: WaitlistModule) => {
    setSelectedModules((prev) =>
      prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key]
    );
  };

  // ── Manejador de teléfono ───────────────────────────────────────────────────
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '');
    if (input.length > 10) input = input.slice(0, 10);
    let formatted = '';
    if (input.length > 0) formatted += input.substring(0, 3);
    if (input.length >= 4) formatted += ' ' + input.substring(3, 6);
    if (input.length >= 7) formatted += ' ' + input.substring(6, 10);
    setForm((f) => ({ ...f, phone: formatted }));
  };

  // ── Manejador de archivo ────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setFile(null);
      setFileData({});
      return;
    }
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      // result = "data:application/pdf;base64,XXXX" — extraemos solo el base64
      const base64Data = result.split(',')[1];
      setFileData({
        base64: base64Data,
        mime: selectedFile.type,
        name: selectedFile.name,
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!preselectedModule && selectedModules.length === 0) {
      setErrorMsg('Selecciona al menos un módulo de interés.');
      return;
    }

    const effectiveModules =
      preselectedModule ? [preselectedModule] : selectedModules;
    const moduloString = effectiveModules.join(', ');

    setIsSubmitting(true);

    try {
      await waitlistService.submitLead({
        nombre: form.fullName.trim(),
        email: form.email.trim(),
        telefono: `+52 ${form.phone.replace(/\D/g, '')}`,
        modulo: moduloString,
        // Archivo solo para Seed
        ...(isSeedSelected && fileData.base64
          ? {
              archivoData: fileData.base64,
              archivoNombre: fileData.name,
              archivoMimeType: fileData.mime,
            }
          : {}),
      });

      setSuccess(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al procesar tu solicitud.';
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Reset & Close ───────────────────────────────────────────────────────────
  const handleClose = () => {
    onClose();
    // Esperamos a que la animación de salida termine antes de limpiar
    setTimeout(() => {
      setSuccess(false);
      setForm(EMPTY_FORM);
      setFile(null);
      setFileData({});
      if (!preselectedModule) setSelectedModules([]);
      setErrorMsg('');
    }, 350);
  };

  // ── El botón de submit está habilitado si: ──────────────────────────────────
  // 1. Hay preselectedModule (ya tenemos módulo fijo), o
  // 2. El usuario seleccionó al menos uno en el selector múltiple
  const canSubmit =
    !isSubmitting && (!!preselectedModule || selectedModules.length > 0);

  const successModuleLabel =
    preselectedModule
      ? String(preselectedModule)
      : selectedModules.length > 1
      ? selectedModules.join(', ')
      : selectedModules[0] ?? '';

  // ────────────────────────────────────────────────────────────────────────────

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="waitlist-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-neutral-900/50 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={handleClose}
        >
          <motion.div
            key="waitlist-card"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/95 backdrop-blur-2xl w-full max-w-[500px] p-8 rounded-[2.5rem] shadow-2xl border border-white/80 my-auto relative overflow-hidden"
          >
            {/* ── Botón cerrar ─────────────────────────────────────────────── */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors z-10"
              aria-label="Cerrar modal"
            >
              <X className="w-4 h-4 text-neutral-600" />
            </button>

            {/* ── Contenido principal ──────────────────────────────────────── */}
            <AnimatePresence mode="wait">
              {!success ? (
                <motion.div
                  key="form-view"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5"
                >
                  {/* Header */}
                  <div className="text-center space-y-2 pt-2">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
                      <Mail className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900">
                      {preselectedModule
                        ? `Lista de Espera · ${preselectedModule}`
                        : 'Lista de Espera'}
                    </h2>
                    <p className="text-neutral-500 text-sm leading-relaxed">
                      Sé uno de los primeros en experimentar el futuro de la odontología clínica.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>

                    {/* ── Selector de módulos (solo modo maestro) ──────────── */}
                    {!preselectedModule && (
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                          ¿Qué módulos te interesan?
                        </p>

                        {/* Estado de carga de toggles */}
                        {togglesLoading && (
                          <div className="flex items-center justify-center gap-2 py-3 text-neutral-400">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-xs">Cargando módulos...</span>
                          </div>
                        )}

                        {/* Sin módulos disponibles */}
                        {!togglesLoading && visibleModules.length === 0 && (
                          <p className="text-xs text-neutral-400 text-center py-2 bg-neutral-50 rounded-xl">
                            No hay módulos disponibles en este momento.
                          </p>
                        )}

                        {/* Grid de módulos agrupados */}
                        {!togglesLoading &&
                          (Object.entries(groupedModules) as [
                            EcosystemModuleDef['group'],
                            EcosystemModuleDef[],
                          ][]).map(([group, items]) => (
                            <div key={group}>
                              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
                                {GROUP_LABELS[group]}
                              </p>
                              <div className="grid grid-cols-3 gap-2">
                                {items.map((mod) => {
                                  const isSelected = selectedModules.includes(mod.key);
                                  return (
                                    <button
                                      key={mod.key}
                                      type="button"
                                      onClick={() => toggleModule(mod.key)}
                                      className={[
                                        'relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-200 text-center select-none',
                                        isSelected
                                          ? 'scale-[1.04] shadow-md'
                                          : 'border-neutral-100 bg-neutral-50/70 hover:border-neutral-200 hover:bg-white',
                                      ].join(' ')}
                                      style={
                                        isSelected
                                          ? {
                                              borderColor: mod.color,
                                              backgroundColor: `${mod.color}12`,
                                            }
                                          : {}
                                      }
                                    >
                                      {isSelected && (
                                        <div
                                          className="absolute top-1.5 right-1.5"
                                          style={{ color: mod.color }}
                                        >
                                          <CheckCircle2 className="w-3 h-3" />
                                        </div>
                                      )}
                                      <div
                                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${mod.iconBg} ${mod.iconColor}`}
                                      >
                                        {mod.icon}
                                      </div>
                                      <span className="text-[11px] font-bold text-neutral-700 leading-tight">
                                        {mod.label}
                                      </span>
                                      <span className="text-[9px] text-neutral-400 font-medium leading-tight line-clamp-1">
                                        {mod.badge}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}

                        {/* Indicador de selección actual */}
                        {selectedModules.length > 0 && (
                          <p className="text-[11px] text-center text-neutral-400">
                            Seleccionado:{' '}
                            <span className="font-semibold text-neutral-600">
                              {selectedModules.join(', ')}
                            </span>
                          </p>
                        )}
                      </div>
                    )}

                    {/* Separador */}
                    <div className="border-t border-neutral-100" />

                    {/* ── Campos de contacto ────────────────────────────────── */}
                    <div className="space-y-3">
                      {/* Nombre */}
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                        <Input
                          type="text"
                          placeholder="Nombre Completo"
                          value={form.fullName}
                          onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                          className="h-11 rounded-xl bg-white/60 border-neutral-200 pl-10"
                          required
                          autoComplete="name"
                        />
                      </div>

                      {/* Email */}
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                        <Input
                          type="email"
                          placeholder="correo@ejemplo.com"
                          value={form.email}
                          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                          className="h-11 rounded-xl bg-white/60 border-neutral-200 pl-10"
                          required
                          autoComplete="email"
                        />
                      </div>

                      {/* Teléfono */}
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-neutral-500 text-sm pointer-events-none select-none">
                          <Phone className="w-3.5 h-3.5" />
                          <span className="text-xs">🇲🇽 +52</span>
                        </div>
                        <Input
                          type="tel"
                          placeholder="123 456 7890"
                          value={form.phone}
                          onChange={handlePhoneChange}
                          className="h-11 rounded-xl bg-white/60 border-neutral-200 pl-24"
                          required
                          autoComplete="tel"
                        />
                      </div>

                      {/* ── PDF + Nota IA: EXCLUSIVO para Seed ───────────────── */}
                      <AnimatePresence>
                        {isSeedSelected && (
                          <motion.div
                            key="seed-extras"
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="overflow-hidden space-y-2"
                          >
                            {/* Input PDF */}
                            <input
                              type="file"
                              id="waitlist-pdf-upload"
                              className="hidden"
                              accept=".pdf,application/pdf"
                              onChange={handleFileChange}
                            />
                            <label
                              htmlFor="waitlist-pdf-upload"
                              className={[
                                'flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-dashed cursor-pointer transition-all duration-200',
                                file
                                  ? 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100'
                                  : 'bg-white/60 border-neutral-300 text-neutral-500 hover:bg-neutral-50 hover:border-neutral-400',
                              ].join(' ')}
                            >
                              <Upload className="w-4 h-4 flex-shrink-0" />
                              <span className="text-sm font-medium truncate max-w-[280px]">
                                {file ? file.name : 'Historia Clínica (PDF – opcional)'}
                              </span>
                            </label>

                            {/* Nota de privacidad / Donación IA */}
                            <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl p-3">
                              <ShieldCheck className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <p className="text-[11px] text-blue-700 leading-relaxed">
                                <span className="font-semibold">Donación de datos (opcional).</span>{' '}
                                Si compartes tu historia clínica, nos ayudas a mejorar nuestro motor
                                neuronal local. Tus datos{' '}
                                <span className="font-semibold">
                                  nunca salen de México
                                </span>{' '}
                                ni se comparten con terceros. Puedes omitir este campo sin problema.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* ── Mensaje de error ───────────────────────────────────── */}
                    <AnimatePresence>
                      {errorMsg && (
                        <motion.p
                          key="error-msg"
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="text-xs text-red-500 text-center bg-red-50 py-2.5 px-3 rounded-xl font-medium flex items-center gap-1.5 justify-center"
                        >
                          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                          {errorMsg}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* ── Botón submit ───────────────────────────────────────── */}
                    <Button
                      type="submit"
                      disabled={!canSubmit}
                      className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold shadow-lg shadow-emerald-200 transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        'Asegurar Acceso Privilegiado →'
                      )}
                    </Button>

                    <p className="text-[10px] text-center text-neutral-400 leading-relaxed">
                      Información protegida por cifrado. Al continuar aceptas los términos de lista
                      de espera de Dentaxy Technologies.
                    </p>
                  </form>
                </motion.div>
              ) : (
                /* ── Pantalla de éxito ─────────────────────────────────────── */
                <motion.div
                  key="success-view"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  className="text-center py-8 space-y-4"
                >
                  {/* Ícono de éxito */}
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </motion.div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-neutral-900 leading-tight">
                      ¡Ya eres parte del futuro!
                    </h3>
                    <p className="text-neutral-500 text-sm leading-relaxed px-4">
                      Registraste tu interés en{' '}
                      <span className="font-semibold text-neutral-700">
                        Dentaxy {successModuleLabel}
                      </span>
                      .<br />
                      Revisa tu bandeja — ya te enviamos un correo de confirmación.
                    </p>
                  </div>

                  {/* Qué sigue */}
                  <div className="w-full space-y-2 text-left px-1">
                    {[
                      { n: '1', title: 'Acceso anticipado', desc: 'Invitación exclusiva antes del lanzamiento.' },
                      { n: '2', title: 'Precio fundador', desc: 'Condiciones especiales garantizadas por ser early.' },
                      { n: '3', title: 'Soporte prioritario', desc: 'Onboarding guiado por el equipo Dentaxy.' },
                    ].map((step) => (
                      <div key={step.n} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-2xl">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-[10px] font-black">{step.n}</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-neutral-800 leading-tight">{step.title}</p>
                          <p className="text-[11px] text-neutral-500 leading-snug">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={handleClose}
                    variant="outline"
                    className="rounded-xl font-semibold w-full border-neutral-200 hover:bg-neutral-50"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Volver al ecosistema
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
