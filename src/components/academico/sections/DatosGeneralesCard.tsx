import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FormDataState } from '@/types/historiaClinica';
import { User, Calendar, Users, Phone, Stethoscope } from 'lucide-react';

// ─── Tipos de tratamiento para el chip de clasificación ───────────────────────
const TIPOS_TRATAMIENTO = [
  { label: 'Integral', value: 'integral', color: 'bg-emerald-600 text-white' },
  { label: 'Exodoncia', value: 'exodoncia', color: 'bg-rose-600 text-white' },
  { label: 'Endodoncia', value: 'endodoncia', color: 'bg-violet-600 text-white' },
  { label: 'Ortodoncia', value: 'ortodoncia', color: 'bg-blue-600 text-white' },
  { label: 'Periodoncia', value: 'periodoncia', color: 'bg-amber-600 text-white' },
  { label: 'Estética', value: 'estetica', color: 'bg-pink-600 text-white' },
  { label: 'Implante', value: 'implante', color: 'bg-cyan-600 text-white' },
  { label: 'Preventivo', value: 'preventivo', color: 'bg-teal-600 text-white' },
];

// ─── Bloque Input Neumórfico de Alto Contraste ─────────────────────────────────
const BlockInput = ({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type = 'text',
  maxLength,
}: {
  label: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
}) => (
  <div className="flex flex-col gap-1.5 w-full text-left">
    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300 pl-0.5 flex items-center gap-1.5">
      {icon}
      {label}
    </label>
    <input
      type={type}
      value={value}
      maxLength={maxLength}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full rounded-xl border-2 border-slate-200/90 bg-white dark:bg-zinc-900 dark:border-zinc-700 px-4 py-3.5",
        "text-zinc-900 dark:text-white font-bold text-left text-base outline-none transition-all duration-200",
        "placeholder-zinc-400",
        // Sombra de alto relieve y contraste
        "shadow-[0_4px_14px_rgba(0,0,0,0.07),inset_0_2px_4px_rgba(0,0,0,0.02)]",
        "focus:border-zinc-900 focus:shadow-[0_8px_24px_rgba(0,0,0,0.12),inset_0_2px_4px_rgba(0,0,0,0.04)]"
      )}
    />
  </div>
);

// ─── Selector de Sexo Neumórfico Tactil (Botón Salido 3D / Botón Metido al Presionar) ──
const SexoBlockSelector = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const opciones = [
    {
      label: 'Masculino',
      value: 'masculino',
      symbol: '♂',
      activeClass: 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.4),inset_0_2px_4px_rgba(255,255,255,0.3)] font-extrabold scale-[1.02]',
    },
    {
      label: 'Femenino',
      value: 'femenino',
      symbol: '♀',
      activeClass: 'bg-gradient-to-r from-pink-600 to-rose-600 border-pink-600 text-white shadow-[0_8px_20px_rgba(219,39,119,0.4),inset_0_2px_4px_rgba(255,255,255,0.3)] font-extrabold scale-[1.02]',
    },
  ];
  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300 pl-0.5 flex items-center gap-1.5">
        <span className="p-1 rounded-md bg-pink-50 dark:bg-pink-950/40 text-pink-500 dark:text-pink-400 inline-flex items-center justify-center">
          <Users className="w-3.5 h-3.5" />
        </span>
        Sexo Biológico
      </label>
      <div className="flex gap-2.5 w-full">
        {opciones.map((op) => {
          const active = value === op.value;
          return (
            <button
              key={op.value}
              type="button"
              onClick={() => onChange(op.value)}
              className={cn(
                'flex-1 rounded-xl p-3.5 flex items-center justify-center gap-1.5 font-bold text-sm transition-all duration-200 cursor-pointer h-[52px]',
                active
                  ? op.activeClass
                  : 'bg-white border-2 border-slate-200/90 text-zinc-800 shadow-[0_6px_16px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_22px_rgba(0,0,0,0.12)] hover:border-slate-300 hover:scale-[1.02] active:scale-[0.97] active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.15)] dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200'
              )}
            >
              <span className="text-base font-black">{op.symbol}</span>
              {op.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── Chips Neumórficos de Tipo de Tratamiento ─────────────────────────────────
const TipoChipsLeft = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex flex-col gap-2 w-full text-left">
    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300 pl-0.5 flex items-center gap-1.5">
      <span className="p-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-500 dark:text-amber-400 inline-flex items-center justify-center">
        <Stethoscope className="w-3.5 h-3.5" />
      </span>
      Tipo de Tratamiento (Especialidad)
    </label>
    <div className="flex flex-wrap gap-2.5 justify-start">
      {TIPOS_TRATAMIENTO.map((tipo) => {
        const active = value === tipo.value;
        return (
          <button
            key={tipo.value}
            type="button"
            onClick={() => onChange(active ? '' : tipo.value)}
            className={cn(
              'rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all duration-200 cursor-pointer',
              active
                ? `${tipo.color} border-transparent shadow-[0_6px_18px_rgba(0,0,0,0.25),inset_0_2px_4px_rgba(255,255,255,0.3)] scale-[1.02]`
                : 'bg-white border-2 border-slate-200/90 text-zinc-800 shadow-[0_4px_14px_rgba(0,0,0,0.07),0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)] hover:border-slate-300 hover:scale-[1.03] active:scale-[0.96] active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.15)] dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300'
            )}
          >
            {tipo.label}
          </button>
        );
      })}
    </div>
  </div>
);

// ─── Props ─────────────────────────────────────────────────────────────────────
interface DatosGeneralesCardProps {
  formData: FormDataState;
  handleDatosGeneralesChange: (field: string, value: string) => void;
  onToggleViewMode: () => void;
  onSeccionGenerada: (seccionId: string, textoResumen: string) => void;

}

export const DatosGeneralesCard: React.FC<DatosGeneralesCardProps> = ({
  formData,
  handleDatosGeneralesChange,
  onSeccionGenerada,

}) => {
  const data = formData.datosGenerales;
  const [tipoTratamiento, setTipoTratamiento] = useState(
    (data as any).tipoTratamiento || ''
  );

  const generarTextoFormateado = () => {
    const tratamientoObj = TIPOS_TRATAMIENTO.find(t => t.value === tipoTratamiento);
    const tratamientoLabel = tratamientoObj ? tratamientoObj.label : (tipoTratamiento || '');

    const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; width: 100%; margin: 0 auto; padding: 0;">
      <!-- Tarjeta Principal Blanca con Borde Limpio Redondeado y Marco Gris -->
      <div style="background: #ffffff; border-radius: 28px; padding: 24px; color: #0f172a; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 2px solid #e2e8f0; width: 100%;">
        
        ${tipoTratamiento ? `
        <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
          <span style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-size: 11px; font-weight: 800; padding: 6px 14px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 0 4px 12px rgba(16,185,129,0.25);">${tratamientoLabel}</span>
        </div>` : ''}
        
        <!-- Grid de Píldoras Coloridas de Alto Impacto Visual -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 14px;">
          
          <!-- Píldora 1: Iniciales del Paciente (Violeta) -->
          <div style="background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); border: 1.5px solid #ddd6fe; border-radius: 18px; padding: 16px; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08);">
            <span style="font-size: 10px; font-weight: 800; color: #7c3aed; text-transform: uppercase; letter-spacing: 0.12em; display: block; margin-bottom: 4px;">Paciente / Iniciales</span>
            <span style="font-size: 20px; font-weight: 900; color: #4c1d95; letter-spacing: 0.05em;">${data.nombreCompleto || '—'}</span>
          </div>

          <!-- Píldora 2: Edad (Azul) -->
          <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 1.5px solid #bfdbfe; border-radius: 18px; padding: 16px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08);">
            <span style="font-size: 10px; font-weight: 800; color: #2563eb; text-transform: uppercase; letter-spacing: 0.12em; display: block; margin-bottom: 4px;">Edad Cumplida</span>
            <span style="font-size: 19px; font-weight: 900; color: #1e3a8a;">${data.fechaNacimiento ? `${data.fechaNacimiento} años` : '—'}</span>
          </div>

          <!-- Píldora 3: Sexo Biológico (Rosa) -->
          <div style="background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); border: 1.5px solid #fbcfe8; border-radius: 18px; padding: 16px; box-shadow: 0 4px 12px rgba(219, 39, 119, 0.08);">
            <span style="font-size: 10px; font-weight: 800; color: #db2777; text-transform: uppercase; letter-spacing: 0.12em; display: block; margin-bottom: 4px;">Sexo Biológico</span>
            <span style="font-size: 18px; font-weight: 900; color: #831843; text-transform: capitalize;">${data.sexo || '—'}</span>
          </div>

          <!-- Píldora 4: Teléfono (Esmeralda) -->
          <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 1.5px solid #a7f3d0; border-radius: 18px; padding: 16px; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.08);">
            <span style="font-size: 10px; font-weight: 800; color: #059669; text-transform: uppercase; letter-spacing: 0.12em; display: block; margin-bottom: 4px;">Teléfono Contacto</span>
            <span style="font-size: 17px; font-weight: 900; color: #064e3b;">${data.telefono || '—'}</span>
          </div>

        </div>
      </div>
    </div>`;

    onSeccionGenerada('datosGenerales', html);
  };

  useEffect(() => {
    generarTextoFormateado();
  }, [data.nombreCompleto, data.fechaNacimiento, data.sexo, data.telefono, tipoTratamiento]);

  return (
    <div className="w-full flex justify-center bg-transparent">
      <div className="w-full max-w-xl bg-transparent">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col gap-6 w-full mx-auto text-left pt-2"
        >
          {/* Título de la sección al estilo Padecimiento Actual */}
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white leading-tight mb-2 drop-shadow-sm">
            Ingrese los datos generales del paciente
          </h2>
          {/* Bloque 1: Identificación (Iniciales y Edad lado a lado) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
            <BlockInput
              label="Iniciales del paciente"
              icon={
                <span className="p-1 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-500 dark:text-purple-400 inline-flex items-center justify-center">
                  <User className="w-3.5 h-3.5" />
                </span>
              }
              value={data.nombreCompleto || ''}
              onChange={(v) => {
                const currentVal = data.nombreCompleto || '';
                if (v.length < currentVal.length) {
                  const lettersOnly = currentVal.replace(/[^A-ZÑÁÉÍÓÚÜ]/g, '');
                  const newLetters = lettersOnly.slice(0, -1);
                  const formatted = newLetters ? (newLetters.split('').join('.') + '.') : '';
                  handleDatosGeneralesChange('nombreCompleto', formatted);
                  return;
                }
                const cleanLetters = v.toUpperCase().replace(/[^A-ZÑÁÉÍÓÚÜ]/g, '');
                const formatted = cleanLetters.split('').join('.');
                const finalValue = formatted ? (formatted + '.') : '';
                handleDatosGeneralesChange('nombreCompleto', finalValue);
              }}
              placeholder="Ej. S.J.M."
              maxLength={12}
            />

            <BlockInput
              label="Edad"
              icon={
                <span className="p-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-500 dark:text-blue-400 inline-flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5" />
                </span>
              }
              value={data.fechaNacimiento || ''}
              onChange={(v) => handleDatosGeneralesChange('fechaNacimiento', v)}
              placeholder="Ej. 47"
              type="number"
              maxLength={3}
            />
          </div>

          {/* Bloque 2: Contacto (Sexo y Teléfono lado a lado) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
            <SexoBlockSelector
              value={data.sexo || ''}
              onChange={(v) => handleDatosGeneralesChange('sexo', v)}
            />

            <BlockInput
              label="Teléfono de Contacto"
              icon={
                <span className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 dark:text-emerald-400 inline-flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5" />
                </span>
              }
              value={data.telefono || ''}
              onChange={(v) => handleDatosGeneralesChange('telefono', v)}
              placeholder="Ej. 4444556677"
              type="tel"
              maxLength={10}
            />
          </div>

          {/* Bloque 3: Tipo de Tratamiento (Chips alineados a la izquierda) */}
          <TipoChipsLeft
            value={tipoTratamiento}
            onChange={(v) => {
              setTipoTratamiento(v);
              handleDatosGeneralesChange('tipoTratamiento', v);
            }}
          />


        </motion.div>

        {/* Botón oculto requerido por el sistema de automatización DentaxyFormPanel */}
        <button
          className="hidden data-trigger-generation"
          onClick={generarTextoFormateado}
        >
          Generar Redacción
        </button>
      </div>
    </div>
  );
};

export default DatosGeneralesCard;
