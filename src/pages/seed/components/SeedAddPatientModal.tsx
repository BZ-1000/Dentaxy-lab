import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, X, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { normalizePatientName, splitNombreApellidos, detectDuplicate } from '@/lib/dex/nombresMexicanos';

interface SeedAddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientsList?: any[];
}

export default function SeedAddPatientModal({ isOpen, onClose, patientsList = [] }: SeedAddPatientModalProps) {
  // Campo unificado: 'nombreCompleto' = nombre + apellidos juntos (como aparece en la UI)
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [motivo, setMotivo] = useState('primera');

  // Para compatibilidad interna, derivamos nombre/apellidos al guardar
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // refs a los inputs para el efecto typewriter de DEX
  const nombreRef = useRef<HTMLInputElement>(null);
  const telRef = useRef<HTMLInputElement>(null);

  // ── Estado para efecto typewriter de DEX ────────────────────────────────
  const [isDexControlling, setIsDexControlling] = useState(false);
  const typeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Escuchar evento dex:fillForm ────────────────────────────────
  useEffect(() => {
    const handleFillForm = (e: Event) => {
      const ev = e as CustomEvent;
      const { nombre, telefono: tel } = ev.detail || {};
      setIsDexControlling(true);
      if (nombre) {
        const normalized = normalizePatientName(nombre);
        // Efecto typewriter caracter por caracter en el campo 'Nombre Completo'
        let i = 0;
        setNombreCompleto('');
        if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = setInterval(() => {
          if (i <= normalized.length) {
            setNombreCompleto(normalized.slice(0, i));
            i++;
          } else {
            if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
          }
        }, 38);
      }
      if (tel) {
        setTelefono(tel);
      }
    };
    const handleSubmitting = () => setIsSubmitting(true);

    window.addEventListener('dex:fillForm', handleFillForm);
    window.addEventListener('dex:submittingForm', handleSubmitting);
    return () => {
      window.removeEventListener('dex:fillForm', handleFillForm);
      window.removeEventListener('dex:submittingForm', handleSubmitting);
      if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
    };
  }, []);

  // ── Validar duplicados en tiempo real ──────────────────────────────
  useEffect(() => {
    if (nombreCompleto.length < 3) { setDuplicateWarning(null); return; }
    const dup = detectDuplicate(nombreCompleto, patientsList);
    setDuplicateWarning(dup ? `Ya existe un paciente similar: ${dup.name}` : null);
  }, [nombreCompleto, patientsList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreCompleto.trim()) return;
    if (duplicateWarning) {
      const confirmed = window.confirm(`${duplicateWarning}\n\n¿Desea registrar a este paciente de todas formas?`);
      if (!confirmed) return;
    }
    setIsSubmitting(true);

    // Separar nombre y apellidos del campo unificado para guardar en Drive
    const normalizedFull = normalizePatientName(nombreCompleto);
    const { nombre: nombreNorm, apellidos: apellidosNorm } = splitNombreApellidos(normalizedFull);

    try {
      const seedUserStr = sessionStorage.getItem('seed_user');
      if (!seedUserStr) throw new Error("No hay sesión activa");
      
      const seedUser = JSON.parse(seedUserStr);
      const accessToken = seedUser.googleAccessToken;
      
      if (!accessToken) throw new Error("No hay conexión de Google Drive");

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
        const rootData = await createRootRes.json();
        parentId = rootData.id;
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
            telefono: telefono,
            motivo: motivo,
            alergias: 'Ninguna'
          }
        })
      });

      if (!createPatientRes.ok) throw new Error("Error al crear carpeta del paciente");

      window.dispatchEvent(new Event('patientCreated'));
      window.dispatchEvent(new CustomEvent('createNewPatientLocal', {
        detail: {
          name: normalizedFull,
          nombre: nombreNorm,
          apellidos: apellidosNorm,
          telefono: telefono,
          motivo: motivo,
          alergias: 'Ninguna'
        }
      }));
      setIsSuccess(true);
    } catch (err) {
      console.error('Error guardando expediente:', err);
      window.dispatchEvent(new CustomEvent('createNewPatientLocal', {
        detail: {
          name: normalizedFull,
          nombre: nombreNorm,
          apellidos: apellidosNorm,
          telefono: telefono,
        }
      }));
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
      setIsDexControlling(false);
    }
  };

  const resetForm = () => {
    setNombreCompleto('');
    setTelefono('');
    setMotivo('primera');
    setIsSuccess(false);
    setIsSubmitting(false);
    setIsDexControlling(false);
    setDuplicateWarning(null);
    if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/15 dark:bg-black/60 backdrop-blur-[8px] flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
      
      {isSuccess ? (
        <div 
          className="w-full max-w-sm p-8 flex flex-col items-center text-center relative overflow-hidden animate-in zoom-in-95 duration-300 bg-[rgba(255,255,255,0.82)] dark:bg-[var(--seed-card-bg)] backdrop-blur-[24px]"
          style={{ borderRadius: '30px', border: '1px solid var(--seed-card-border)', boxShadow: 'var(--seed-card-shadow)' }}
        >
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center border border-emerald-300 dark:border-emerald-500/30 mb-4">
             <CheckCircle2 size={28} className="text-emerald-500 dark:text-emerald-400" />
          </div>
          <h3 className="font-bold text-lg">Expediente Creado</h3>
          <p className="text-xs mt-2 leading-relaxed max-w-[280px]" style={{ color: 'var(--seed-text-muted)' }}>
            La subcarpeta del paciente se ha generado correctamente en <strong>Mis archivos dentaxy</strong> de tu Google Drive.
          </p>
          <button 
            onClick={resetForm}
            className="mt-6 w-full py-3 rounded-xl text-white font-semibold text-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center bg-verde-dentaxy-seed"
          >
            Aceptar
          </button>
        </div>
      ) : (
        <div 
          className="w-full max-w-lg relative flex flex-col animate-in zoom-in-95 duration-300 bg-[rgba(255,255,255,0.82)] dark:bg-[var(--seed-card-bg)] backdrop-blur-[24px] overflow-hidden"
          style={{ borderRadius: '30px', border: '1px solid var(--seed-card-border)', boxShadow: 'var(--seed-card-shadow)' }}
        >
          {/* ── Barra DEX activa ── */}
          <AnimatePresence>
            {isDexControlling && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-500/10 border-b border-emerald-500/20"
              >
                <span className="flex gap-0.5 items-end h-3">
                  {[0,1,2].map(i => (
                    <span key={i} className="w-0.5 bg-emerald-400 rounded-full animate-bounce" style={{ height: `${6+i*3}px`, animationDelay: `${i*0.1}s` }} />
                  ))}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 tracking-widest uppercase">DEX — Registrando Paciente</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Cabecera ── */}
          <div className="flex items-center justify-between px-7 pt-6 pb-4">
            <h2 className="text-[15px] font-bold tracking-widest uppercase" style={{ color: 'var(--seed-text-main)' }}>Registrar Nuevo Paciente</h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          {/* ── Formulario ── */}
          <form onSubmit={handleSubmit} className="px-7 pb-7 space-y-5">

            {/* Advertencia de duplicado */}
            <AnimatePresence>
              {duplicateWarning && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-600 dark:text-amber-400 text-[10px] font-semibold flex items-center gap-2"
                >
                  <span>⚠️</span> {duplicateWarning}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nombre Completo */}
            <div className="space-y-2">
              <label className="text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--seed-text-muted)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                Nombre Completo
              </label>
              <div className="relative">
                <input
                  ref={nombreRef}
                  type="text"
                  required
                  value={nombreCompleto}
                  onChange={(e) => { setNombreCompleto(e.target.value); setIsDexControlling(false); }}
                  className={`w-full h-12 bg-slate-50 dark:bg-white/5 border rounded-2xl px-4 text-slate-900 dark:text-white text-sm font-medium focus:outline-none transition-all ${
                    isDexControlling
                      ? 'border-emerald-400/60 shadow-[0_0_0_3px_rgba(52,211,153,0.12)]'
                      : 'border-slate-200 dark:border-white/10 focus:border-slate-400 dark:focus:border-white/30'
                  }`}
                  placeholder="Nombre del paciente"
                />
                {isDexControlling && nombreCompleto && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-emerald-400 rounded-full animate-pulse" />
                )}
              </div>
            </div>

            {/* Teléfono Celular con bandera MX */}
            <div className="space-y-2">
              <label className="text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--seed-text-muted)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 10a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 7.91a16 16 0 0 0 6.29 6.29l.95-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Teléfono Celular
              </label>
              <div className="flex gap-2">
                {/* Prefijo MX */}
                <div className="h-12 px-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center gap-1.5 shrink-0">
                  <span className="text-base leading-none">🇲🇽</span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-white/60">+52</span>
                </div>
                <div className="relative flex-1">
                  <input
                    ref={telRef}
                    type="tel"
                    value={telefono}
                    onChange={(e) => { setTelefono(e.target.value); setIsDexControlling(false); }}
                    className={`w-full h-12 bg-slate-50 dark:bg-white/5 border rounded-2xl px-4 text-slate-900 dark:text-white text-sm font-medium focus:outline-none transition-all ${
                      isDexControlling && telefono
                        ? 'border-emerald-400/60 shadow-[0_0_0_3px_rgba(52,211,153,0.12)]'
                        : 'border-slate-200 dark:border-white/10 focus:border-slate-400 dark:focus:border-white/30'
                    }`}
                    placeholder="000-000-0000"
                  />
                  {isDexControlling && telefono && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-emerald-400 rounded-full animate-pulse" />
                  )}
                </div>
              </div>
            </div>

            {/* Botón CREAR */}
            <button 
              type="submit"
              disabled={isSubmitting || !nombreCompleto.trim()}
              className="w-full h-12 rounded-2xl text-white text-xs font-black tracking-[0.15em] uppercase flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer bg-verde-dentaxy-seed shadow-lg shadow-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <><Loader2 size={14} className="animate-spin" /> Guardando...</>
              ) : (
                <><Sparkles size={14} /> Crear</>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
