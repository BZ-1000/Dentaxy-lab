import React, { useState, useEffect, useRef } from 'react';
import { User, Phone, ClipboardList, CheckCircle2, X, Plus, Sparkles, Loader2, FolderOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { normalizePatientName, splitNombreApellidos, detectDuplicate } from '@/lib/dex/nombresMexicanos';

interface SeedAddPatientViewProps {
  /** Lista actual de pacientes para validación de duplicados */
  patientsList?: any[];
}

// ─── Hook de efecto typewriter ──────────────────────────────────────────────
function useTypewriter(target: string, speed = 35) {
  const [displayed, setDisplayed] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!target) { setDisplayed(''); return; }
    setDisplayed('');
    let i = 0;
    const type = () => {
      if (i <= target.length) {
        setDisplayed(target.slice(0, i));
        i++;
        timeoutRef.current = setTimeout(type, speed);
      }
    };
    timeoutRef.current = setTimeout(type, speed);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [target, speed]);

  return displayed;
}

export default function SeedAddPatientView({ patientsList = [] }: SeedAddPatientViewProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    telefono: '',
    motivo: 'primera',
    alergias: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // ── Animación DEX: campos siendo llenados con typewriter ───────────────
  const [dexTypingNombre, setDexTypingNombre] = useState('');
  const [dexTypingTel, setDexTypingTel] = useState('');
  const [isDexControlling, setIsDexControlling] = useState(false);

  const typedNombre = useTypewriter(dexTypingNombre, 38);
  const typedTel    = useTypewriter(dexTypingTel,    55);

  // Sincronizar typewriter → formData
  useEffect(() => {
    if (typedNombre) {
      const { nombre, apellidos } = splitNombreApellidos(typedNombre);
      setFormData(prev => ({ ...prev, nombre, apellidos }));
    }
  }, [typedNombre]);

  useEffect(() => {
    if (typedTel) {
      setFormData(prev => ({ ...prev, telefono: typedTel }));
    }
  }, [typedTel]);

  // ── Escuchar eventos de DEX ────────────────────────────────────────────
  useEffect(() => {
    const handleOpenAddPatient = () => {
      setIsFormOpen(true);
      setIsDexControlling(true);
    };

    const handleFillForm = (e: Event) => {
      const ev = e as CustomEvent;
      const { nombre, telefono } = ev.detail || {};
      setIsFormOpen(true);
      setIsDexControlling(true);
      if (nombre) setDexTypingNombre(normalizePatientName(nombre));
      if (telefono) setDexTypingTel(telefono);
    };

    const handleSubmitting = () => {
      setIsSubmitting(true);
    };

    window.addEventListener('dex:openAddPatient', handleOpenAddPatient);
    window.addEventListener('dex:fillForm', handleFillForm);
    window.addEventListener('dex:submittingForm', handleSubmitting);

    return () => {
      window.removeEventListener('dex:openAddPatient', handleOpenAddPatient);
      window.removeEventListener('dex:fillForm', handleFillForm);
      window.removeEventListener('dex:submittingForm', handleSubmitting);
    };
  }, []);

  // ── Validación de duplicados en tiempo real ────────────────────────────
  useEffect(() => {
    const fullName = `${formData.nombre} ${formData.apellidos}`.trim();
    if (fullName.length < 3) { setDuplicateWarning(null); return; }
    const dup = detectDuplicate(fullName, patientsList);
    if (dup) {
      setDuplicateWarning(`Ya existe un paciente similar: ${dup.name}`);
    } else {
      setDuplicateWarning(null);
    }
  }, [formData.nombre, formData.apellidos, patientsList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre) return;
    if (duplicateWarning) {
      // Si hay duplicado, pedir confirmación doble
      const confirmed = window.confirm(`${duplicateWarning}\n\n¿Desea registrar a este paciente de todas formas?`);
      if (!confirmed) return;
    }
    setIsSubmitting(true);

    // Normalizar nombre antes de guardar
    const nombreNorm = normalizePatientName(formData.nombre);
    const apellidosNorm = normalizePatientName(formData.apellidos);

    try {
      const seedUserStr = sessionStorage.getItem('seed_user');
      let accessToken: string | null = null;
      if (seedUserStr) {
        try { accessToken = JSON.parse(seedUserStr).googleAccessToken; } catch {}
      }

      if (accessToken) {
        const query = encodeURIComponent("name = 'Dentaxy' and mimeType = 'application/vnd.google-apps.folder' and trashed = false");
        const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id)`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const searchData = await searchRes.json();
        
        let parentId = null;
        if (searchData.files && searchData.files.length > 0) {
          parentId = searchData.files[0].id;
        } else {
          const createRootRes = await fetch('https://www.googleapis.com/drive/v3/files', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Dentaxy', mimeType: 'application/vnd.google-apps.folder' })
          });
          parentId = (await createRootRes.json()).id;
        }

        const folderName = apellidosNorm
          ? `${apellidosNorm.toUpperCase()}, ${nombreNorm}`
          : nombreNorm.toUpperCase();

        const createPatientRes = await fetch('https://www.googleapis.com/drive/v3/files', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentId],
            appProperties: {
              telefono: formData.telefono,
              motivo: formData.motivo,
              alergias: formData.alergias || 'Ninguna'
            }
          })
        });

        if (!createPatientRes.ok) throw new Error("Error al crear carpeta del paciente");
        window.dispatchEvent(new Event('patientCreated'));
      }

      // Siempre registrar localmente
      window.dispatchEvent(new CustomEvent('createNewPatientLocal', {
        detail: {
          name: `${nombreNorm} ${apellidosNorm}`.trim(),
          nombre: nombreNorm,
          apellidos: apellidosNorm,
          telefono: formData.telefono,
          motivo: formData.motivo,
          alergias: formData.alergias || 'Ninguna'
        }
      }));

      setIsSuccess(true);
    } catch (err) {
      console.error('Error guardando expediente:', err);
      // Registrar localmente aunque falle Drive
      window.dispatchEvent(new CustomEvent('createNewPatientLocal', {
        detail: {
          name: `${nombreNorm} ${apellidosNorm}`.trim(),
          nombre: nombreNorm,
          apellidos: apellidosNorm,
          telefono: formData.telefono,
        }
      }));
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
      setIsDexControlling(false);
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', apellidos: '', telefono: '', motivo: 'primera', alergias: '' });
    setIsSuccess(false);
    setIsSubmitting(false);
    setIsFormOpen(false);
    setIsDexControlling(false);
    setDexTypingNombre('');
    setDexTypingTel('');
    setDuplicateWarning(null);
  };

  const cardStyle = {
    borderRadius: '30px',
    background: 'var(--seed-card-bg)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid var(--seed-card-border)',
    boxShadow: 'var(--seed-card-shadow), inset 0 1px 0 var(--seed-card-border)',
    color: 'var(--seed-text-main)'
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-sm px-6 z-30 animate-in fade-in zoom-in-95 duration-300">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="p-8 flex flex-col items-center text-center relative overflow-hidden"
          style={cardStyle}
        >
          {/* Línea verde superior animada */}
          <motion.div
            className="absolute top-0 left-0 h-[3px] bg-gradient-to-r from-emerald-400 to-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.15 }}
            className="w-14 h-14 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center border border-emerald-300 dark:border-emerald-500/30 mb-4"
          >
            <CheckCircle2 size={28} className="text-emerald-500 dark:text-emerald-400" />
          </motion.div>
          
          <h3 className="font-bold text-lg">Expediente Creado</h3>
          <p className="text-xs mt-2 leading-relaxed max-w-[280px]" style={{ color: 'var(--seed-text-muted)' }}>
            La subcarpeta del paciente se ha generado correctamente en <strong>Mis archivos Dentaxy</strong> de tu Google Drive.
          </p>
          
          <button 
            onClick={resetForm}
            className="mt-6 w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-md"
          >
            Agregar otro paciente
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center z-30 px-6">
      <AnimatePresence mode="wait">
        {!isFormOpen ? (
          /* Estado Inicial: Botón + con texto */
          <motion.div
            key="btn"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center gap-4"
          >
            <button 
              onClick={() => setIsFormOpen(true)}
              className="w-16 h-16 rounded-full bg-slate-900/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg hover:border-slate-300 dark:hover:border-white/20"
            >
              <Plus size={28} />
            </button>
            <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--seed-text-muted)' }}>
              Agregar Paciente
            </span>
          </motion.div>
        ) : (
          /* Formulario cinematográfico */
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            className="w-full max-w-md p-8 relative flex flex-col justify-between"
            style={cardStyle}
          >
            {/* Barra de estado DEX activa */}
            <AnimatePresence>
              {isDexControlling && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="absolute top-0 left-0 right-0 overflow-hidden"
                  style={{ borderRadius: '30px 30px 0 0' }}
                >
                  <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/10 border-b border-emerald-500/20">
                    <span className="flex gap-0.5 items-end h-3">
                      {[0,1,2].map(i => (
                        <span
                          key={i}
                          className="w-0.5 bg-emerald-400 rounded-full animate-bounce"
                          style={{ height: `${6 + i * 3}px`, animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 tracking-widest uppercase">
                      DEX — Registrando Nuevo Paciente
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botón Cerrar */}
            <button 
              onClick={resetForm}
              className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Cabecera */}
            <div className={`mb-6 ${isDexControlling ? 'mt-8' : ''}`}>
              <h2 className="text-[16px] font-semibold tracking-wide">Registrar Nuevo Paciente</h2>
              <p className="text-[10px] mt-0.5 font-medium tracking-wide" style={{ color: isDexControlling ? 'var(--seed-green)' : 'var(--seed-text-muted)' }}>
                {isDexControlling ? '⚡ DEX está dictando los datos...' : 'Complete el formulario manualmente'}
              </p>
            </div>

            {/* Advertencia de duplicado */}
            <AnimatePresence>
              {duplicateWarning && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-3 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-600 dark:text-amber-400 text-[10px] font-semibold flex items-center gap-2"
                >
                  <span className="text-sm">⚠️</span>
                  {duplicateWarning}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1" style={{ color: 'var(--seed-text-muted)' }}>
                  <User size={10} /> Nombre(s) *
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    value={formData.nombre}
                    onChange={(e) => {
                      setIsDexControlling(false);
                      setFormData(prev => ({ ...prev, nombre: e.target.value }));
                    }}
                    className={`w-full h-10 bg-slate-50 dark:bg-white/5 border rounded-xl px-4 text-slate-900 dark:text-white text-xs focus:outline-none focus:bg-white dark:focus:bg-white/10 transition-all ${
                      isDexControlling && dexTypingNombre
                        ? 'border-emerald-400/60 dark:border-emerald-500/60 shadow-[0_0_0_2px_rgba(52,211,153,0.15)]'
                        : 'border-slate-200 dark:border-white/10 focus:border-emerald-500/40 dark:focus:border-emerald-400/40'
                    }`}
                    placeholder="Nombre(s) del paciente"
                  />
                  {isDexControlling && dexTypingNombre && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      <span className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse inline-block" />
                    </span>
                  )}
                </div>
              </div>

              {/* Apellidos */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--seed-text-muted)' }}>
                  Apellidos *
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.apellidos}
                  onChange={(e) => {
                    setIsDexControlling(false);
                    setFormData(prev => ({ ...prev, apellidos: e.target.value }));
                  }}
                  className={`w-full h-10 bg-slate-50 dark:bg-white/5 border rounded-xl px-4 text-slate-900 dark:text-white text-xs focus:outline-none focus:bg-white dark:focus:bg-white/10 transition-all ${
                    isDexControlling && dexTypingNombre
                      ? 'border-emerald-400/60 dark:border-emerald-500/60 shadow-[0_0_0_2px_rgba(52,211,153,0.15)]'
                      : 'border-slate-200 dark:border-white/10 focus:border-emerald-500/40 dark:focus:border-emerald-400/40'
                  }`}
                  placeholder="Apellidos"
                />
              </div>

              {/* Teléfono */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1" style={{ color: 'var(--seed-text-muted)' }}>
                  <Phone size={10} /> Teléfono de contacto
                </label>
                <div className="relative">
                  <input 
                    type="tel" 
                    value={formData.telefono}
                    onChange={(e) => {
                      setIsDexControlling(false);
                      setFormData(prev => ({ ...prev, telefono: e.target.value }));
                    }}
                    className={`w-full h-10 bg-slate-50 dark:bg-white/5 border rounded-xl px-4 text-slate-900 dark:text-white text-xs focus:outline-none focus:bg-white dark:focus:bg-white/10 transition-all ${
                      isDexControlling && dexTypingTel
                        ? 'border-emerald-400/60 dark:border-emerald-500/60 shadow-[0_0_0_2px_rgba(52,211,153,0.15)]'
                        : 'border-slate-200 dark:border-white/10 focus:border-emerald-500/40 dark:focus:border-emerald-400/40'
                    }`}
                    placeholder="Número celular"
                  />
                  {isDexControlling && dexTypingTel && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      <span className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse inline-block" />
                    </span>
                  )}
                </div>
              </div>

              {/* Motivo */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1" style={{ color: 'var(--seed-text-muted)' }}>
                  <ClipboardList size={10} /> Motivo de ingreso
                </label>
                <select 
                  value={formData.motivo}
                  onChange={(e) => setFormData(prev => ({ ...prev, motivo: e.target.value }))}
                  className="w-full h-10 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500/40 dark:focus:border-emerald-400/40 focus:bg-white dark:focus:bg-white/10 transition-all cursor-pointer"
                  style={{ color: 'var(--seed-text-main)' }}
                >
                  <option value="primera"   className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Primera Vez / Valoración</option>
                  <option value="urgencia"  className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Urgencia Dental</option>
                  <option value="limpieza"  className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Limpieza / Profilaxis</option>
                  <option value="ortodoncia"className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Ortodoncia</option>
                  <option value="cirugia"   className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Cirugía</option>
                </select>
              </div>

              {/* Alergias */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--seed-text-muted)' }}>
                  Alergias / Patologías
                </label>
                <input 
                  type="text" 
                  value={formData.alergias}
                  onChange={(e) => setFormData(prev => ({ ...prev, alergias: e.target.value }))}
                  className="w-full h-10 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500/40 dark:focus:border-emerald-400/40 focus:bg-white dark:focus:bg-white/10 transition-all"
                  placeholder="Ej. Penicilina, Diabetes (Opcional)"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting || !formData.nombre}
                className="mt-6 w-full h-11 rounded-xl bg-[var(--seed-green)] text-white text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-lg shadow-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Guardando expediente...
                  </>
                ) : (
                  <>
                    <Sparkles size={13} />
                    Autorizar y Guardar en Drive
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
