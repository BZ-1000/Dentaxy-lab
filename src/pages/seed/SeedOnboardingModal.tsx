/**
 * SeedOnboardingModal.tsx — Dentaxy Seed V3
 * Flujo: Especialidad → Clínica+Logo → Historia Clínica → Subdominio → Preview+Pago
 * Integra: Gemini API (generación IA) + Supabase Storage + seed_prospects DB
 */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronRight, ChevronLeft, Upload, Building2, Globe, Sparkles,
  CheckCircle2, Image, FileText, Loader2, ExternalLink, Lock, CreditCard,
  Eye, Brain, AlertCircle, FolderSync, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { createClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE CLIENT (anon para inserts públicos)
// ─────────────────────────────────────────────────────────────────────────────
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────────────────────

/** Stripe Payment Link de preventa — reemplazar con el real */
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/test_placeholder';

/** Gemini API key — leer de env */
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-1.5-flash'; // Más barato y rápido para JSON estructurado

const TOTAL_STEPS = 5;

// ─────────────────────────────────────────────────────────────────────────────
// ESPECIALIDADES DENTALES
// ─────────────────────────────────────────────────────────────────────────────

export const ESPECIALIDADES = [
  { id: 'general', label: 'Dentista General', emoji: '🦷', desc: 'Odontología general y preventiva' },
  { id: 'pediatria', label: 'Odontopediatría', emoji: '👶', desc: 'Especialista en pacientes pediátricos' },
  { id: 'ortodoncia', label: 'Ortodoncia', emoji: '🔧', desc: 'Brackets, alineadores y corrección dental' },
  { id: 'endodoncia', label: 'Endodoncia', emoji: '🔬', desc: 'Tratamiento de conductos y pulpa dental' },
  { id: 'periodoncia', label: 'Periodoncia', emoji: '🫁', desc: 'Encías, tejido óseo y periodontal' },
  { id: 'implantologia', label: 'Implantología', emoji: '🔩', desc: 'Implantes y rehabilitación sobre implantes' },
  { id: 'estetica', label: 'Estética Dental', emoji: '✨', desc: 'Carillas, blanqueamiento y diseño de sonrisa' },
  { id: 'rehabilitacion', label: 'Rehabilitación Oral', emoji: '💎', desc: 'Prótesis, coronas y puentes' },
  { id: 'cirugia', label: 'Cirugía Maxilofacial', emoji: '⚕️', desc: 'Cirugía oral y maxilofacial' },
];

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────

export interface AiOutput {
  campos_formulario: Array<{ nombre: string; tipo: string; requerido: boolean }>;
  notas_demo: string[];
  bienvenida: string;
  subdominio_sugerido: string;
}

export interface OnboardingData {
  especialidad: string;
  clinicaNombre: string;
  clinicaLogo: File | null;
  historiaClinica: File | null;
  subdominio: string;
  googleEmail: string;
  googleName: string;
}

interface SeedOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userName?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICIO: GEMINI API
// ─────────────────────────────────────────────────────────────────────────────

async function callGemini(data: OnboardingData): Promise<AiOutput> {
  const especialidad = ESPECIALIDADES.find(e => e.id === data.especialidad)?.label || data.especialidad;

  // Generamos el subdominio base desde el nombre de la clínica
  const subdominioBase = data.clinicaNombre
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar acentos
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 20);

  const prompt = `Eres un asistente clínico especializado de Dentaxy, plataforma de gestión de historias clínicas para odontólogos en México.

DATOS DEL CONSULTORIO:
- Especialidad: ${especialidad}
- Nombre del consultorio: "${data.clinicaNombre}"
- Doctor: ${data.googleName || 'Dr./Dra.'}

TAREA: Genera en formato JSON estricto (sin markdown, sin explicaciones, solo JSON):
{
  "campos_formulario": [
    { "nombre": "string", "tipo": "text|number|select|textarea|date|boolean", "requerido": true|false }
  ],
  "notas_demo": [
    "Nota clínica completa de ejemplo #1 (2-3 oraciones formales y específicas para ${especialidad})",
    "Nota clínica completa de ejemplo #2",
    "Nota clínica completa de ejemplo #3"
  ],
  "bienvenida": "Mensaje de bienvenida personalizado para la pantalla principal del consultorio (1 oración)",
  "subdominio_sugerido": "${subdominioBase}"
}

INSTRUCCIONES ESPECÍFICAS:
- campos_formulario: Genera entre 8-12 campos ESPECÍFICOS para ${especialidad} (no genéricos). Incluye campos clínicos reales como: motivo de consulta, evolución, diagnóstico, plan de tratamiento específico de ${especialidad}, etc.
- notas_demo: Redacta en español formal clínico, como lo escribiría un odontólogo profesional. Deben ser notas REALES que se usan en ${especialidad}.
- bienvenida: Personalizada con el nombre del consultorio "${data.clinicaNombre}".
- subdominio_sugerido: Solo letras minúsculas, números y guiones. Máximo 20 caracteres.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1200,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
  const json = await response.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  return JSON.parse(text) as AiOutput;
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICIO: Guardar en Supabase y enviar a Google Apps Script
// ─────────────────────────────────────────────────────────────────────────────

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzl6GEDxzlJddLzqJbq8ApTlLoNBOo5W2OOFEvIAKA7yu80aXSKZqjw4YP3w5brh7Pe/exec';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
};

async function saveProspect(data: OnboardingData, aiOutput: AiOutput | null): Promise<string | null> {
  try {
    let logoUrl: string | null = null;
    let historiaUrl: string | null = null;
    let logoB64: string | null = null;
    let historiaB64: string | null = null;

    // Upload logo a Supabase (mantenemos para que la UI funcione si es necesario)
    if (data.clinicaLogo) {
      const ext = data.clinicaLogo.name.split('.').pop();
      const path = `logos/${Date.now()}-${data.subdominio}.${ext}`;
      const { error } = await supabase.storage.from('seed-assets').upload(path, data.clinicaLogo);
      if (!error) {
        const { data: pub } = supabase.storage.from('seed-assets').getPublicUrl(path);
        logoUrl = pub.publicUrl;
      }
      logoB64 = await fileToBase64(data.clinicaLogo);
    }

    // Upload historia clínica a Supabase
    if (data.historiaClinica) {
      const ext = data.historiaClinica.name.split('.').pop();
      const path = `historias/${Date.now()}-${data.subdominio}.${ext}`;
      const { error } = await supabase.storage.from('seed-assets').upload(path, data.historiaClinica);
      if (!error) {
        const { data: pub } = supabase.storage.from('seed-assets').getPublicUrl(path);
        historiaUrl = pub.publicUrl;
      }
      historiaB64 = await fileToBase64(data.historiaClinica);
    }

    // Insertar en Supabase db
    const { data: row, error } = await supabase
      .from('seed_prospects')
      .insert({
        google_email: data.googleEmail,
        google_name: data.googleName,
        especialidad: data.especialidad,
        clinica_nombre: data.clinicaNombre,
        clinica_logo_url: logoUrl,
        historia_url: historiaUrl,
        subdominio: data.subdominio,
        ai_output: aiOutput,
        ai_processed: !!aiOutput,
        estado: 'prospecto',
      })
      .select('id')
      .single();

    if (error) console.error('Error guardando prospecto en Supabase:', error);

    // Enviar al Google Apps Script webhook
    try {
      const payload = {
        type: 'prospecto_seed',
        nombre: data.googleName,
        email: data.googleEmail,
        especialidad: data.especialidad,
        clinica: data.clinicaNombre,
        subdominio: data.subdominio,
        logoBase64: logoB64,
        logoNombre: data.clinicaLogo?.name,
        logoMime: data.clinicaLogo?.type,
        historiaBase64: historiaB64,
        historiaNombre: data.historiaClinica?.name,
        historiaMime: data.historiaClinica?.type
      };

      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      });
      console.log('Prospecto enviado a Google Apps Script.');
    } catch (gasError) {
      console.error('Error enviando a GAS:', gasError);
    }

    return row?.id || null;
  } catch (e) {
    console.error('saveProspect error:', e);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

const fadeSlide = {
  hidden: (dir: number) => ({ opacity: 0, x: dir * 36 }),
  visible: { opacity: 1, x: 0, transition: { duration: 0.28, ease: 'easeOut' } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -36, transition: { duration: 0.2 } }),
};

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — ESPECIALIDAD DENTAL
// ─────────────────────────────────────────────────────────────────────────────

const StepEspecialidad: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => (
  <div className="space-y-4">
    <div className="text-center pb-1">
      <div className="w-13 h-13 rounded-2xl bg-zinc-50 flex items-center justify-center mx-auto mb-3 w-12 h-12">
        <span className="text-2xl">🦷</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900">¿Cuál es tu especialidad?</h3>
      <p className="text-sm text-gray-500 mt-1">Esto define los formularios clínicos de tu Dentaxy Seed</p>
    </div>
    <div className="grid grid-cols-1 gap-2 max-h-[340px] overflow-y-auto pr-1">
      {ESPECIALIDADES.map(e => (
        <button
          key={e.id}
          onClick={() => onChange(e.id)}
          className={cn(
            'flex items-center gap-4 px-4 py-3.5 rounded-2xl border-2 text-left transition-all duration-200 w-full',
            value === e.id
              ? 'border-zinc-900 bg-zinc-50/70 shadow-sm shadow-zinc-200'
              : 'border-gray-100 hover:border-zinc-200 hover:bg-gray-50/80'
          )}
        >
          <span className="text-xl shrink-0">{e.emoji}</span>
          <div className="min-w-0 flex-1">
            <p className={cn('font-semibold text-sm', value === e.id ? 'text-zinc-900' : 'text-gray-800')}>{e.label}</p>
            <p className="text-xs text-gray-400 truncate">{e.desc}</p>
          </div>
          {value === e.id && <CheckCircle2 className="w-4 h-4 text-zinc-500 shrink-0" />}
        </button>
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — CLÍNICA + LOGO
// ─────────────────────────────────────────────────────────────────────────────

const StepClinica: React.FC<{
  nombre: string; onNombre: (v: string) => void;
  logo: File | null; onLogo: (f: File | null) => void;
}> = ({ nombre, onNombre, logo, onLogo }) => {
  const logoRef = useRef<HTMLInputElement>(null);
  const previewUrl = logo ? URL.createObjectURL(logo) : null;

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center mx-auto mb-3">
          <Building2 className="w-6 h-6 text-zinc-900" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Tu consultorio</h3>
        <p className="text-sm text-gray-500 mt-1">El nombre y logo que aparecerán en tus expedientes</p>
      </div>
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Nombre del consultorio *</label>
        <Input
          placeholder="Ej. Ortodoncia Soto, Clínica Dr. Hernández..."
          value={nombre}
          onChange={e => onNombre(e.target.value)}
          className="h-12 rounded-xl border-2 border-gray-100 focus:border-zinc-400 text-base"
        />
        {nombre.length > 0 && nombre.length < 3 && (
          <p className="text-xs text-amber-600 mt-1">Mínimo 3 caracteres</p>
        )}
      </div>
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Logo del consultorio (opcional)</label>
        <button
          onClick={() => logoRef.current?.click()}
          className={cn(
            'w-full h-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all',
            logo ? 'border-zinc-400 bg-zinc-50/40' : 'border-gray-200 hover:border-zinc-400 text-gray-400 hover:text-zinc-500'
          )}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Logo" className="h-20 w-auto object-contain rounded-xl" />
          ) : (
            <>
              <Image className="w-7 h-7" />
              <span className="text-xs font-medium">Subir logo PNG / JPG</span>
            </>
          )}
        </button>
        <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={e => onLogo(e.target.files?.[0] || null)} />
        {logo && <p className="text-xs text-zinc-900 mt-1.5 font-medium">✓ {logo.name}</p>}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — HISTORIA CLÍNICA + TRIGGER IA
// ─────────────────────────────────────────────────────────────────────────────

const StepHistoria: React.FC<{
  file: File | null;
  onFile: (f: File | null) => void;
  aiStatus: 'idle' | 'loading' | 'done' | 'error';
}> = ({ file, onFile, aiStatus }) => {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center mx-auto mb-3">
          <FileText className="w-6 h-6 text-zinc-900" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Tu historia clínica actual</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
          La IA analizará tu formato actual para personalizar tus formularios Dentaxy Seed
        </p>
      </div>

      <button
        onClick={() => fileRef.current?.click()}
        className={cn(
          'w-full h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all',
          file ? 'border-zinc-400 bg-zinc-50/40' : 'border-gray-200 hover:border-zinc-400 text-gray-400 hover:text-zinc-500'
        )}
      >
        {file ? (
          <div className="flex flex-col items-center gap-1.5">
            <CheckCircle2 className="w-9 h-9 text-zinc-500" />
            <p className="text-sm font-semibold text-teal-700 px-4 truncate max-w-full">{file.name}</p>
            <p className="text-xs text-zinc-500">Toca para cambiar</p>
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
      <input ref={fileRef} type="file" accept=".pdf,image/*" className="hidden"
        onChange={e => onFile(e.target.files?.[0] || null)} />

      {/* Estado IA */}
      <AnimatePresence>
        {aiStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={cn(
              'rounded-2xl px-4 py-3 flex items-center gap-3',
              aiStatus === 'loading' ? 'bg-zinc-50 border border-zinc-200' :
              aiStatus === 'done' ? 'bg-emerald-50 border border-emerald-100' :
              'bg-red-50 border border-red-100'
            )}
          >
            {aiStatus === 'loading' && (
              <><Loader2 className="w-4 h-4 text-zinc-500 animate-spin shrink-0" />
              <div>
                <p className="text-xs font-bold text-zinc-900">Motor IA trabajando...</p>
                <p className="text-xs text-zinc-500">Generando tus formularios personalizados</p>
              </div></>
            )}
            {aiStatus === 'done' && (
              <><Brain className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-700">¡Formularios generados!</p>
                <p className="text-xs text-emerald-600">Tu Dentaxy Seed está siendo personalizado</p>
              </div></>
            )}
            {aiStatus === 'error' && (
              <><AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <div>
                <p className="text-xs font-bold text-red-700">IA no disponible</p>
                <p className="text-xs text-red-500">Usaremos un formulario estándar para tu especialidad</p>
              </div></>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-gray-400 text-center">
        Opcional — también puedes continuar sin subir y personalizar después.
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 — SUBDOMINIO + PREVIEW TRIGGER
// ─────────────────────────────────────────────────────────────────────────────

const StepSubdominio: React.FC<{
  value: string;
  onChange: (v: string) => void;
  aiSuggestion?: string;
  onViewPreview: () => void;
  aiDone: boolean;
}> = ({ value, onChange, aiSuggestion, onViewPreview, aiDone }) => {
  const clean = (v: string) => v.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9-]/g, '').slice(0, 24);
  const isValid = value.length >= 3;

  // Auto-apply IA suggestion if field is empty
  useEffect(() => {
    if (aiSuggestion && value.length === 0) {
      onChange(aiSuggestion);
    }
  }, [aiSuggestion]);

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center mx-auto mb-3">
          <Globe className="w-6 h-6 text-zinc-900" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Tu espacio Dentaxy</h3>
        <p className="text-sm text-gray-500 mt-1">El nombre único de tu consultorio digital</p>
      </div>

      {/* Preview URL bar */}
      <div className="rounded-2xl border-2 border-gray-100 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
          <div className="flex gap-1">
            {['bg-red-400','bg-amber-400','bg-emerald-400'].map(c => (
              <div key={c} className={`w-2 h-2 rounded-full ${c}`} />
            ))}
          </div>
          <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs font-mono border border-gray-200 flex items-center gap-1">
            <span className={isValid ? 'text-zinc-900 font-semibold' : 'text-gray-300'}>
              {isValid ? value : 'tu-consultorio'}
            </span>
            <span className="text-gray-400">.dentaxy.com</span>
          </div>
        </div>
        <div className="px-4 py-3">
          <Input
            placeholder={aiSuggestion || 'mi-consultorio'}
            value={value}
            onChange={e => onChange(clean(e.target.value))}
            className="font-mono text-sm rounded-xl border-2 border-gray-100 focus:border-zinc-400"
          />
          {value.length > 0 && value.length < 3 && (
            <p className="text-xs text-amber-600 mt-1.5">Mínimo 3 caracteres.</p>
          )}
          {isValid && (
            <p className="text-xs text-emerald-600 mt-1.5 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span className="font-mono">{value}.dentaxy.com</span> disponible
            </p>
          )}
        </div>
      </div>

      {/* Botón Preview IA */}
      {aiDone && (
        <motion.button
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          onClick={onViewPreview}
          className="w-full h-12 rounded-2xl border-2 border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 font-bold text-sm flex items-center justify-center gap-2 transition-all"
        >
          <Eye className="w-4 h-4" />
          Ver mi Dentaxy Seed antes de comprar
          <Zap className="w-4 h-4 text-amber-500" />
        </motion.button>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PREVIEW MODAL (IA generada)
// ─────────────────────────────────────────────────────────────────────────────

const PreviewModal: React.FC<{
  data: OnboardingData;
  aiOutput: AiOutput;
  onClose: () => void;
}> = ({ data, aiOutput, onClose }) => {
  const logoUrl = data.clinicaLogo ? URL.createObjectURL(data.clinicaLogo) : null;
  const esp = ESPECIALIDADES.find(e => e.id === data.especialidad);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-white w-full max-w-[720px] max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header del preview */}
        <div className="bg-gradient-to-r from-zinc-800 to-black px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-10 h-10 rounded-xl object-contain bg-white p-1" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <span className="text-xl">{esp?.emoji}</span>
              </div>
            )}
            <div>
              <p className="text-white font-bold text-base leading-tight">{data.clinicaNombre}</p>
              <p className="text-blue-200 text-xs">{data.subdominio}.dentaxy.com · {esp?.label}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Watermark badge */}
        <div className="bg-amber-50 border-b border-amber-100 px-6 py-2 flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-amber-600" />
          <p className="text-xs font-bold text-amber-700">Vista Previa · Activa tu Dentaxy Seed para acceder completo</p>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto">
          {/* Bienvenida */}
          <div className="px-6 pt-5 pb-3">
            <div className="rounded-2xl bg-zinc-50 border border-zinc-200 px-5 py-4">
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-zinc-900 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-zinc-900 uppercase tracking-wide mb-1">Dentaxy AI</p>
                  <p className="text-sm text-zinc-700 font-medium">{aiOutput.bienvenida}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario generado */}
          <div className="px-6 pb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Formulario Clínico · {esp?.label}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {aiOutput.campos_formulario.slice(0, 8).map((campo, i) => (
                <div key={i} className="rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3">
                  <p className="text-xs font-bold text-gray-500 mb-1">
                    {campo.nombre}
                    {campo.requerido && <span className="text-red-400 ml-1">*</span>}
                  </p>
                  <div className={cn(
                    'h-7 rounded-lg bg-white border border-gray-200',
                    campo.tipo === 'textarea' ? 'h-14' : ''
                  )} />
                </div>
              ))}
            </div>
          </div>

          {/* Nota de evolución demo */}
          <div className="px-6 pb-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Nota de Evolución (Ejemplo)</p>
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-gray-500">Dentaxy AI · Redacción Automática</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{aiOutput.notas_demo[0] || 'Nota generada automáticamente...'}</p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 shrink-0">
          <Button
            onClick={onClose}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-zinc-800 to-black text-white font-bold text-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            ¡Quiero activar mi Dentaxy Seed!
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5 — CHECKOUT
// ─────────────────────────────────────────────────────────────────────────────

const StepCheckout: React.FC<{
  data: OnboardingData;
  aiOutput: AiOutput | null;
  onStripe: () => void;
  saving: boolean;
}> = ({ data, aiOutput, onStripe, saving }) => {
  const esp = ESPECIALIDADES.find(e => e.id === data.especialidad);

  const items = [
    { label: 'Especialidad', value: `${esp?.emoji} ${esp?.label}` },
    { label: 'Consultorio', value: data.clinicaNombre },
    { label: 'Logo', value: data.clinicaLogo ? `✓ ${data.clinicaLogo.name}` : 'Sin logo' },
    { label: 'Historia clínica', value: data.historiaClinica ? `✓ ${data.historiaClinica.name}` : 'Sin archivo' },
    { label: 'Tu espacio', value: data.subdominio ? `${data.subdominio}.dentaxy.com` : '—' },
    { label: 'Formularios IA', value: aiOutput ? `✓ ${aiOutput.campos_formulario.length} campos personalizados` : 'Formulario estándar' },
  ];

  return (
    <div className="space-y-5">
      <div className="text-center">
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl mb-2">🌱</motion.div>
        <h3 className="text-2xl font-bold text-gray-900">¡Tu Dentaxy Seed está listo!</h3>
        <p className="text-sm text-gray-500 mt-1">Confirma y activa tu sistema personalizado</p>
      </div>

      <div className="rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-2.5 bg-white hover:bg-gray-50/60 transition-colors">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{item.label}</span>
            <span className="text-sm font-semibold text-gray-800 text-right max-w-[55%] truncate">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Precio */}
      <div className="rounded-2xl bg-zinc-50 border border-zinc-200 px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-zinc-900 uppercase tracking-wide">Preventa Exclusiva</p>
          <p className="text-xs text-zinc-500 mt-0.5">Incluye configuración personalizada + soporte</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-zinc-900">$X,XXX</p>
          <p className="text-xs text-zinc-500">MXN · pago único</p>
        </div>
      </div>

      <Button
        onClick={onStripe}
        disabled={saving}
        className="w-full h-14 rounded-2xl bg-gradient-to-r from-zinc-800 to-black text-white font-bold text-base shadow-lg shadow-zinc-500/10 flex items-center justify-center gap-2"
      >
        {saving ? (
          <><Loader2 className="w-5 h-5 animate-spin" />Preparando tu sistema...</>
        ) : (
          <><CreditCard className="w-5 h-5" />Pagar y activar mi Dentaxy Seed<ExternalLink className="w-4 h-4 opacity-70" /></>
        )}
      </Button>

      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Lock className="w-3 h-3" /> Pago seguro vía Stripe
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <FolderSync className="w-3 h-3" /> Datos en tu Drive
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MODAL PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

const STEP_TITLES = ['Tu Especialidad', 'Tu Consultorio', 'Historia Actual', 'Tu Espacio', 'Confirmar y Pagar'];

export const SeedOnboardingModal: React.FC<SeedOnboardingModalProps> = ({
  isOpen, onClose, userEmail = '', userName = '',
}) => {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [aiStatus, setAiStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [aiOutput, setAiOutput] = useState<AiOutput | null>(null);
  const [saving, setSaving] = useState(false);

  const [data, setData] = useState<OnboardingData>({
    especialidad: '', clinicaNombre: '', clinicaLogo: null,
    historiaClinica: null, subdominio: '', googleEmail: userEmail, googleName: userName,
  });

  const upd = <K extends keyof OnboardingData>(k: K, v: OnboardingData[K]) =>
    setData(prev => ({ ...prev, [k]: v }));

  // Disparo de IA cuando pasan al paso 3 y hay suficientes datos
  const triggerAI = useCallback(async () => {
    if (aiStatus !== 'idle' || !data.especialidad || !data.clinicaNombre) return;
    if (!GEMINI_API_KEY) {
      console.warn('VITE_GEMINI_API_KEY no configurada — se omite IA');
      return;
    }
    setAiStatus('loading');
    try {
      const output = await callGemini(data);
      setAiOutput(output);
      setAiStatus('done');
      // Auto-fill subdominio si está vacío
      if (!data.subdominio && output.subdominio_sugerido) {
        upd('subdominio', output.subdominio_sugerido);
      }
    } catch (e) {
      console.error('Error Gemini:', e);
      setAiStatus('error');
    }
  }, [data, aiStatus]);

  const canNext = useCallback(() => {
    if (step === 0) return data.especialidad.length > 0;
    if (step === 1) return data.clinicaNombre.trim().length >= 3;
    if (step === 2) return true;
    if (step === 3) return data.subdominio.length >= 3;
    return true;
  }, [step, data]);

  const next = () => {
    if (!canNext()) return;
    // Disparar IA al completar paso 2 (clínica)
    if (step === 1) triggerAI();
    setDir(1);
    setStep(s => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const prev = () => {
    setDir(-1);
    setStep(s => Math.max(s - 1, 0));
  };

  const handleStripe = async () => {
    setSaving(true);
    const id = await saveProspect(data, aiOutput);
    if (id) {
      console.log('Prospecto guardado con ID:', id);
    }
    await new Promise(r => setTimeout(r, 600));
    window.open(STRIPE_PAYMENT_LINK, '_blank');
    setSaving(false);
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
          className="bg-white w-full max-w-[460px] max-h-[92vh] rounded-[2.2rem] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Progress Header */}
          <div className="px-7 pt-6 pb-3 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-zinc-900 uppercase tracking-widest">
                {step + 1}/{TOTAL_STEPS} · {STEP_TITLES[step]}
              </p>
              <div className="flex items-center gap-2">
                {/* IA badge */}
                {aiStatus === 'loading' && (
                  <div className="flex items-center gap-1 bg-zinc-50 rounded-full px-2.5 py-1">
                    <Loader2 className="w-3 h-3 text-zinc-500 animate-spin" />
                    <span className="text-xs text-zinc-900 font-bold">IA</span>
                  </div>
                )}
                {aiStatus === 'done' && (
                  <div className="flex items-center gap-1 bg-emerald-50 rounded-full px-2.5 py-1">
                    <Brain className="w-3 h-3 text-emerald-600" />
                    <span className="text-xs text-emerald-600 font-bold">Listo</span>
                  </div>
                )}
                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
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
          <div className="flex-1 overflow-y-auto px-7 py-2">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div key={step} custom={dir} variants={fadeSlide} initial="hidden" animate="visible" exit="exit">
                {step === 0 && <StepEspecialidad value={data.especialidad} onChange={v => upd('especialidad', v)} />}
                {step === 1 && <StepClinica nombre={data.clinicaNombre} onNombre={v => upd('clinicaNombre', v)} logo={data.clinicaLogo} onLogo={f => upd('clinicaLogo', f)} />}
                {step === 2 && <StepHistoria file={data.historiaClinica} onFile={f => upd('historiaClinica', f)} aiStatus={aiStatus} />}
                {step === 3 && (
                  <StepSubdominio
                    value={data.subdominio}
                    onChange={v => upd('subdominio', v)}
                    aiSuggestion={aiOutput?.subdominio_sugerido}
                    onViewPreview={() => setShowPreview(true)}
                    aiDone={aiStatus === 'done'}
                  />
                )}
                {step === 4 && <StepCheckout data={data} aiOutput={aiOutput} onStripe={handleStripe} saving={saving} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Nav */}
          {step < 4 && (
            <div className="px-7 pb-6 pt-3 flex gap-3 shrink-0">
              {step > 0 && (
                <button onClick={prev} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors px-4 py-2.5 rounded-2xl hover:bg-gray-50">
                  <ChevronLeft className="w-4 h-4" /> Atrás
                </button>
              )}
              <Button
                onClick={next}
                disabled={!canNext()}
                className={cn(
                  'flex-1 h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2',
                  canNext()
                    ? 'bg-gradient-to-r from-zinc-800 to-black text-white shadow-lg shadow-blue-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                )}
              >
                Continuar <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </motion.div>

        {/* Preview IA Modal */}
        <AnimatePresence>
          {showPreview && aiOutput && (
            <PreviewModal data={data} aiOutput={aiOutput} onClose={() => setShowPreview(false)} />
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default SeedOnboardingModal;
