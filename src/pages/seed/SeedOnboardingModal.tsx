/**
 * SeedOnboardingModal.tsx — Dentaxy Seed V2
 * Cuestionario multi-paso interactivo: cargo → clínica → logo → historia → subdominio → checkout Stripe
 */
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronRight, ChevronLeft, Upload, Building2, User, Globe, Sparkles,
  CheckCircle2, Image, FileText, Loader2, ExternalLink, ShieldCheck, Lock, CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────

export interface OnboardingData {
  cargo: string;
  clinicaNombre: string;
  clinicaLogo: File | null;
  historiaClinica: File | null;
  subdominio: string;
  googleEmail: string;
}

interface SeedOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────────────────────

// Solo para Demo/Preventa — sustituir con Stripe Price ID real
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/test_placeholder';

const CARGOS = [
  { id: 'director', label: 'Director de Clínica', icon: '🏛️' },
  { id: 'subdirector', label: 'Subdirector / Coordinador', icon: '🗂️' },
  { id: 'independiente', label: 'Doctor Independiente', icon: '🦷' },
  { id: 'especialista', label: 'Especialista', icon: '⚕️' },
  { id: 'asesor', label: 'Asesor / Gestor', icon: '💼' },
];

const TOTAL_STEPS = 5;

const fadeSlide = {
  hidden: (dir: number) => ({ opacity: 0, x: dir * 40 }),
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -40, transition: { duration: 0.2 } }),
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTES: STEPS INDIVIDUALES
// ─────────────────────────────────────────────────────────────────────────────

/** Step 1 — Cargo en la clínica */
const StepCargo: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => (
  <div className="space-y-5">
    <div className="text-center">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
        <User className="w-7 h-7 text-blue-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900">¿Cuál es tu cargo?</h3>
      <p className="text-sm text-gray-500 mt-1">Esto personalizará tu experiencia Dentaxy Seed</p>
    </div>
    <div className="space-y-2.5 pt-2">
      {CARGOS.map(c => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={cn(
            'w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all duration-200',
            value === c.id
              ? 'border-blue-500 bg-blue-50/60 shadow-sm shadow-blue-100'
              : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
          )}
        >
          <span className="text-2xl">{c.icon}</span>
          <span className={cn('font-semibold text-sm', value === c.id ? 'text-blue-700' : 'text-gray-700')}>{c.label}</span>
          {value === c.id && <CheckCircle2 className="w-4 h-4 text-blue-500 ml-auto" />}
        </button>
      ))}
    </div>
  </div>
);

/** Step 2 — Nombre de clínica + Logo */
const StepClinica: React.FC<{
  nombre: string; onNombre: (v: string) => void;
  logo: File | null; onLogo: (f: File | null) => void
}> = ({ nombre, onNombre, logo, onLogo }) => {
  const logoRef = useRef<HTMLInputElement>(null);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onLogo(file);
  };
  const previewUrl = logo ? URL.createObjectURL(logo) : null;

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-7 h-7 text-indigo-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Tu clínica</h3>
        <p className="text-sm text-gray-500 mt-1">El nombre y logotipo que aparecerán en tus expedientes</p>
      </div>
      <Input
        placeholder="Ej. Clínica Dental Soto"
        value={nombre}
        onChange={e => onNombre(e.target.value)}
        className="h-13 rounded-xl border-2 border-gray-100 focus:border-indigo-400 text-base"
      />

      {/* Logo Upload */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Logo (opcional)</p>
        <button
          onClick={() => logoRef.current?.click()}
          className="w-full h-28 rounded-2xl border-2 border-dashed border-gray-200 hover:border-indigo-400 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-indigo-500 transition-all"
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Logo" className="h-20 w-auto object-contain rounded-xl" />
          ) : (
            <>
              <Image className="w-7 h-7" />
              <span className="text-xs font-medium">Sube tu logo (PNG / JPG)</span>
            </>
          )}
        </button>
        <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        {logo && <p className="text-xs text-indigo-600 mt-1.5 font-medium">✓ {logo.name}</p>}
      </div>
    </div>
  );
};

/** Step 3 — Upload historia clínica actual */
const StepHistoria: React.FC<{ file: File | null; onFile: (f: File | null) => void }> = ({ file, onFile }) => {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-7 h-7 text-teal-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Tu historia clínica actual</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
          Sube el formato que usas hoy —puede ser PDF, imagen o una foto de tu formato en papel.
        </p>
      </div>

      <button
        onClick={() => fileRef.current?.click()}
        className={cn(
          'w-full h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all',
          file
            ? 'border-teal-400 bg-teal-50/40'
            : 'border-gray-200 hover:border-teal-400 text-gray-400 hover:text-teal-500'
        )}
      >
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle2 className="w-10 h-10 text-teal-500" />
            <p className="text-sm font-semibold text-teal-700">{file.name}</p>
            <p className="text-xs text-teal-500">Toca para cambiar</p>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8" />
            <div className="text-center">
              <p className="text-sm font-semibold">Subir mi historia clínica</p>
              <p className="text-xs mt-0.5">PDF, JPG, PNG — máx. 10MB</p>
            </div>
          </>
        )}
      </button>
      <input ref={fileRef} type="file" accept=".pdf,image/*" className="hidden" onChange={e => onFile(e.target.files?.[0] || null)} />

      <p className="text-xs text-gray-400 text-center px-4">
        Solo la usamos para configurar tus formularios personalizados. No la guardamos en nuestros servidores permanentemente.
      </p>
    </div>
  );
};

/** Step 4 — Nombre de espacio (subdominio) */
const StepSubdominio: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const clean = (v: string) => v.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 24);
  const isValid = value.length >= 3;

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-4">
          <Globe className="w-7 h-7 text-violet-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Tu espacio Dentaxy</h3>
        <p className="text-sm text-gray-500 mt-1">El nombre único de tu consultorio digital</p>
      </div>

      {/* Preview URL */}
      <div className="rounded-2xl border-2 border-gray-100 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex gap-1">
            {['bg-red-400', 'bg-amber-400', 'bg-emerald-400'].map(c => (
              <div key={c} className={`w-2.5 h-2.5 rounded-full ${c}`} />
            ))}
          </div>
          <div className="flex-1 bg-white rounded-md px-3 py-1.5 text-xs font-mono text-gray-400 border border-gray-200 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
            <span className={value.length >= 3 ? 'text-violet-600 font-semibold' : 'text-gray-300'}>
              {value.length >= 3 ? value : 'tu-consultorio'}
            </span>
            <span className="text-gray-400">.dentaxy.com</span>
          </div>
        </div>
        <div className="px-4 py-3">
          <Input
            placeholder="mi-consultorio"
            value={value}
            onChange={e => onChange(clean(e.target.value))}
            className="font-mono text-base rounded-xl border-2 border-gray-100 focus:border-violet-400"
          />
          {value.length > 0 && value.length < 3 && (
            <p className="text-xs text-amber-600 mt-1.5">Mínimo 3 caracteres. Solo letras, números y guiones.</p>
          )}
          {isValid && (
            <p className="text-xs text-emerald-600 mt-1.5 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              ¡<span className="font-mono">{value}.dentaxy.com</span> está disponible!
            </p>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Solo tú y quienes tú autorices podrán acceder con tu cuenta de Google.
      </p>
    </div>
  );
};

/** Step 5 — Resumen + Checkout */
const StepCheckout: React.FC<{ data: OnboardingData; onStripe: () => void }> = ({ data, onStripe }) => {
  const cargoLabel = CARGOS.find(c => c.id === data.cargo)?.label || '—';

  const items = [
    { label: 'Cargo', value: cargoLabel },
    { label: 'Clínica', value: data.clinicaNombre || '—' },
    { label: 'Logo', value: data.clinicaLogo ? '✓ Cargado' : 'Sin logo' },
    { label: 'Historia clínica', value: data.historiaClinica ? `✓ ${data.historiaClinica.name}` : 'Sin archivo' },
    { label: 'Tu espacio', value: data.subdominio ? `${data.subdominio}.dentaxy.com` : '—' },
  ];

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-300">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">¡Todo listo!</h3>
        <p className="text-sm text-gray-500 mt-1">Confirma tu información y procede al pago de preventa</p>
      </div>

      {/* Resumen */}
      <div className="rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50/60 transition-colors">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{item.label}</span>
            <span className="text-sm font-semibold text-gray-800 text-right max-w-[60%] truncate">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Precio */}
      <div className="rounded-2xl bg-blue-50 border border-blue-100 px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">Preventa Exclusiva</p>
          <p className="text-xs text-blue-500 mt-0.5">Incluye configuración personalizada</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-blue-700">$X,XXX</p>
          <p className="text-xs text-blue-500">MXN · pago único</p>
        </div>
      </div>

      {/* Stripe CTA */}
      <Button
        onClick={onStripe}
        className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
      >
        <CreditCard className="w-5 h-5" />
        Pagar y activar mi Dentaxy Seed
        <ExternalLink className="w-4 h-4 opacity-70" />
      </Button>

      <div className="flex items-center justify-center gap-4 pt-1">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Lock className="w-3 h-3" /> Pago 100% seguro vía Stripe
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <ShieldCheck className="w-3 h-3" /> Tus datos nunca se almacenan
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MODAL PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

const STEP_TITLES = ['Tu Cargo', 'Tu Clínica', 'Historia Actual', 'Tu Espacio', 'Resumen'];

export const SeedOnboardingModal: React.FC<SeedOnboardingModalProps> = ({
  isOpen, onClose, userEmail = ''
}) => {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    cargo: '', clinicaNombre: '', clinicaLogo: null,
    historiaClinica: null, subdominio: '', googleEmail: userEmail,
  });
  const [sendingToStripe, setSendingToStripe] = useState(false);

  const upd = <K extends keyof OnboardingData>(k: K, v: OnboardingData[K]) =>
    setData(prev => ({ ...prev, [k]: v }));

  const canNext = useCallback(() => {
    if (step === 0) return data.cargo.length > 0;
    if (step === 1) return data.clinicaNombre.trim().length >= 2;
    if (step === 2) return true; // Historia es opcional para avanzar
    if (step === 3) return data.subdominio.length >= 3;
    return true;
  }, [step, data]);

  const next = () => {
    if (!canNext()) return;
    setDir(1);
    setStep(s => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const prev = () => {
    setDir(-1);
    setStep(s => Math.max(s - 1, 0));
  };

  const handleStripe = async () => {
    setSendingToStripe(true);

    // Enviar datos a Apps Script (misma infraestructura del waitlist)
    try {
      const formData = new FormData();
      formData.append('action', 'seed_preventa');
      formData.append('cargo', CARGOS.find(c => c.id === data.cargo)?.label || data.cargo);
      formData.append('clinica', data.clinicaNombre);
      formData.append('subdominio', data.subdominio);
      formData.append('email', data.googleEmail);
      if (data.historiaClinica) formData.append('historia', data.historiaClinica);
      if (data.clinicaLogo) formData.append('logo', data.clinicaLogo);

      // TODO: reemplazar con URL real del Apps Script
      // await fetch('https://script.google.com/macros/s/YOUR_ID/exec', { method: 'POST', body: formData });
    } catch (e) {
      console.error('Error enviando datos:', e);
    }

    // Redirigir a Stripe Payment Link
    await new Promise(r => setTimeout(r, 800));
    window.open(STRIPE_PAYMENT_LINK, '_blank');
    setSendingToStripe(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/30 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 380 }}
          onClick={e => e.stopPropagation()}
          className="bg-white w-full max-w-[460px] rounded-[2.2rem] shadow-2xl overflow-hidden"
        >
          {/* Progress Header */}
          <div className="px-7 pt-7 pb-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                Paso {step + 1} de {TOTAL_STEPS} · {STEP_TITLES[step]}
              </p>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full"
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="px-7 py-2 min-h-[440px] overflow-y-auto">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                variants={fadeSlide}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {step === 0 && <StepCargo value={data.cargo} onChange={v => upd('cargo', v)} />}
                {step === 1 && (
                  <StepClinica
                    nombre={data.clinicaNombre} onNombre={v => upd('clinicaNombre', v)}
                    logo={data.clinicaLogo} onLogo={f => upd('clinicaLogo', f)}
                  />
                )}
                {step === 2 && <StepHistoria file={data.historiaClinica} onFile={f => upd('historiaClinica', f)} />}
                {step === 3 && <StepSubdominio value={data.subdominio} onChange={v => upd('subdominio', v)} />}
                {step === 4 && <StepCheckout data={data} onStripe={handleStripe} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          {step < 4 && (
            <div className="px-7 pb-7 pt-4 flex gap-3">
              {step > 0 && (
                <button
                  onClick={prev}
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors px-4 py-3 rounded-2xl hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" /> Atrás
                </button>
              )}
              <Button
                onClick={next}
                disabled={!canNext()}
                className={cn(
                  'flex-1 h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2',
                  canNext()
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200 hover:shadow-blue-300'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                )}
              >
                Continuar <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {step === 4 && sendingToStripe && (
            <div className="px-7 pb-7 pt-2 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
              <p className="text-xs text-gray-400 mt-2">Preparando tu pago seguro...</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SeedOnboardingModal;
