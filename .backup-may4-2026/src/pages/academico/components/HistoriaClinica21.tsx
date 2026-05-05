/**
 * HistoriaClinica21.tsx — Fase 2C
 * Historia Clínica en 21 secciones con motor de redacción determinístico ($0)
 * El texto se ensambla en tiempo real al completar los campos del formulario
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ChevronUp, CheckCircle2, Circle,
  Copy, FileText, Pen, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PACIENTES_DEMO } from '@/data/uaoMockData';

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────

interface SeccionConfig {
  num: string;
  titulo: string;
  completada: boolean;
}

interface DatosHistoria {
  // I — Ficha
  datosPersonalesOk: boolean;
  // II — Motivo
  motivoConsulta: string;
  tiempoEvolucion: string;
  // III — Padecimiento actual
  padecimientoActual: string;
  // IV-VI — Antecedentes
  antecedentes: {
    hipertension: boolean; diabetes: boolean; cardiopatia: boolean;
    alergias: boolean; nombreAlergia: string;
    hepatitis: boolean; vih: boolean; embarazo: boolean;
    medicamentos: boolean; nombreMedicamento: string;
    otrosSistémicos: string;
  };
  // VII-IX — Exploración
  tensionArterial: string;
  frecuenciaCardiaca: string;
  temperatura: string;
  exploracionExtraoral: string;
  exploracionIntraoral: string;
  // X — Odontograma
  odontogramaOk: boolean;
  // XI — Periodontograma
  periodontogramaOk: boolean;
  // XII — Diagnóstico
  diagnosticoPrincipal: string;
  diagnosticosAdicionales: string;
  // XIII — Pronóstico
  pronostico: 'bueno' | 'reservado' | 'malo' | '';
  // XIV — Plan de tratamiento
  planTratamientoOk: boolean;
  // XV — Referencia
  requiereReferencia: boolean;
  especialidad: string;
  // XVI-XXI — Evolución y firmas
  notaEvolucion: string;
  firmaPaciente: boolean;
  firmaAlumno: boolean;
  firmaDocente: boolean;
}

const estadoInicial: DatosHistoria = {
  datosPersonalesOk: true,
  motivoConsulta: 'Dolor en zona posterior superior derecha desde hace 2 semanas.',
  tiempoEvolucion: '2 semanas',
  padecimientoActual: 'Paciente refiere dolor de moderada intensidad en zona posterior superior derecha, de tipo pulsátil, agravado con ingesta de alimentos fríos y dulces. Niega fiebre. Menciona sangrado al cepillado.',
  antecedentes: {
    hipertension: false, diabetes: false, cardiopatia: false,
    alergias: false, nombreAlergia: '',
    hepatitis: false, vih: false, embarazo: false,
    medicamentos: false, nombreMedicamento: '',
    otrosSistémicos: '',
  },
  tensionArterial: '120/80',
  frecuenciaCardiaca: '72',
  temperatura: '36.5',
  exploracionExtraoral: 'Sin adenopatías. Simetría facial conservada. ATM sin alteraciones.',
  exploracionIntraoral: 'Higiene oral deficiente. Cálculo supra e infragingival en sectores posteriores. Encía eritematosa con sangrado a la palpación.',
  odontogramaOk: true,
  periodontogramaOk: true,
  diagnosticoPrincipal: 'Caries dental múltiple (OMS K02)',
  diagnosticosAdicionales: 'Gingivitis asociada a biopelícula dental (AAP 2017)',
  pronostico: 'bueno',
  planTratamientoOk: true,
  requiereReferencia: false,
  especialidad: '',
  notaEvolucion: '',
  firmaPaciente: false,
  firmaAlumno: false,
  firmaDocente: false,
};

// ─────────────────────────────────────────────────────────────────────────────
// MOTOR DE REDACCIÓN DETERMINÍSTICO ($0 — sin IA)
// ─────────────────────────────────────────────────────────────────────────────

const ensamblarTexto = (datos: DatosHistoria, paciente: typeof PACIENTES_DEMO[0]): string => {
  const edad = paciente.edad;
  const sexo = paciente.nombre.split(' ')[0].endsWith('a') ? 'femenino' : 'masculino';
  const articuloPaciente = sexo === 'femenino' ? 'La paciente' : 'El paciente';
  const pronombre = sexo === 'femenino' ? 'ella' : 'él';

  const fecha = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });

  const antec: string[] = [];
  const { antecedentes: a } = datos;
  if (a.hipertension) antec.push('hipertensión arterial sistémica');
  if (a.diabetes) antec.push('diabetes mellitus tipo 2');
  if (a.cardiopatia) antec.push('cardiopatía');
  if (a.hepatitis) antec.push('hepatitis');
  if (a.vih) antec.push('VIH positivo');
  if (a.alergias && a.nombreAlergia) antec.push(`alergia a ${a.nombreAlergia}`);
  if (a.medicamentos && a.nombreMedicamento) antec.push(`tratamiento farmacológico con ${a.nombreMedicamento}`);
  const antecTexto = antec.length > 0 ? antec.join(', ') : 'sin antecedentes médicos de relevancia';

  const embarazoTexto = a.embarazo ? ' Se registra estado de gestación. ' : '';

  let pronosticoTexto = '';
  if (datos.pronostico === 'bueno') pronosticoTexto = 'El pronóstico general del caso se considera favorable, siempre que el paciente mantenga una adecuada higiene oral y asista puntualmente a las citas programadas.';
  else if (datos.pronostico === 'reservado') pronosticoTexto = 'El pronóstico general del caso se considera reservado, condicionado a la evolución del tratamiento y la colaboración del paciente.';
  else if (datos.pronostico === 'malo') pronosticoTexto = 'El pronóstico general del caso se considera desfavorable, dada la extensión y severidad de las lesiones presentes.';

  const referenciaTexto = datos.requiereReferencia && datos.especialidad
    ? ` Se emite referencia a ${datos.especialidad} para manejo conjunto del caso.` : '';

  return `HISTORIA CLÍNICA ODONTOLÓGICA
Universidad Autónoma de Zacatecas — Unidad Académica de Odontología
Fecha de elaboración: ${fecha}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I. FICHA DE IDENTIFICACIÓN
Nombre completo: ${paciente.nombre}
Edad: ${edad} años | CURP: ${paciente.curp}
Clínica de adscripción: ${paciente.nodo.toUpperCase()}
Alumno que elabora: Rodrigo Martínez Ávalos (8° semestre)
Docente supervisor: ${paciente.docenteSupervisor}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

II. MOTIVO DE CONSULTA
${articuloPaciente} acude a la clínica UAO con el siguiente motivo: "${datos.motivoConsulta}" Tiempo de evolución referido: ${datos.tiempoEvolucion}.

III. PADECIMIENTO ACTUAL
${datos.padecimientoActual}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IV–VI. ANTECEDENTES HEREDOFAMILIARES, PERSONALES NO PATOLÓGICOS Y PATOLÓGICOS
${articuloPaciente} presenta los siguientes antecedentes de relevancia clínica: ${antecTexto}.${embarazoTexto}${datos.antecedentes.otrosSistémicos ? ' ' + datos.antecedentes.otrosSistémicos : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VII–IX. EXPLORACIÓN FÍSICA Y ESTOMATOLÓGICA
Signos Vitales al ingreso: TA ${datos.tensionArterial} mmHg | FC ${datos.frecuenciaCardiaca} lpm | T° ${datos.temperatura} °C

Exploración Extraoral: ${datos.exploracionExtraoral}

Exploración Intraoral: ${datos.exploracionIntraoral}

X. Odontograma (FDI ISO 3950): Registrado en sistema digital UAO Sync. Ver gráfica adjunta.

XI. Periodontograma: ${datos.periodontogramaOk ? 'Registrado con diagnóstico automático AAP 2017. Ver gráfica de sondaje adjunta.' : 'Pendiente de registro.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

XII. DIAGNÓSTICO
Diagnóstico principal: ${datos.diagnosticoPrincipal}
${datos.diagnosticosAdicionales ? `Diagnósticos adicionales: ${datos.diagnosticosAdicionales}` : ''}

XIII. PRONÓSTICO
${pronosticoTexto}

XIV. PLAN DE TRATAMIENTO
El plan de tratamiento integral ha sido elaborado y estructurado en 5 fases (I: Sistémica, II: Higiénica, III: Operatoria, IV: Rehabilitatoria, V: Mantenimiento). Consultar cuadro de tratamiento adjunto.${referenciaTexto}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FIRMAS Y VALIDACIÓN
☐ Firma paciente / tutor legal
☐ Firma alumno elaboró: Rodrigo Martínez Ávalos
☐ Firma y sello docente supervisor: ${paciente.docenteSupervisor}

Documento generado por UAO Sync — DentaXy Technologies
PRIVADO Y CONFIDENCIAL — Uso exclusivo expediente clínico UAZ`;
};

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN COLAPSABLE
// ─────────────────────────────────────────────────────────────────────────────

interface SeccionProps {
  num: string;
  titulo: string;
  completada: boolean;
  children: React.ReactNode;
}

const Seccion: React.FC<SeccionProps> = ({ num, titulo, completada, children }) => {
  const [abierta, setAbierta] = useState(false);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setAbierta(p => !p)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {completada
            ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            : <Circle className="h-4 w-4 text-zinc-300 dark:text-zinc-600 shrink-0" />
          }
          <div className="text-left">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Sección {num}</span>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight">{titulo}</p>
          </div>
        </div>
        {abierta ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
      </button>

      <AnimatePresence>
        {abierta && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-zinc-100 dark:border-zinc-800"
          >
            <div className="px-4 py-4 bg-zinc-50/50 dark:bg-zinc-800/20">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// INPUT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all";
const textareaCls = `${inputCls} resize-none`;

// ─────────────────────────────────────────────────────────────────────────────
// HISTORIA CLÍNICA 21 SECCIONES
// ─────────────────────────────────────────────────────────────────────────────

interface HistoriaClinica21Props {
  pacienteId?: string;
  readOnly?: boolean;
}

const HistoriaClinica21: React.FC<HistoriaClinica21Props> = ({ pacienteId, readOnly = false }) => {
  const paciente = PACIENTES_DEMO.find(p => p.id === pacienteId) ?? PACIENTES_DEMO[0];
  const [datos, setDatos] = useState<DatosHistoria>(estadoInicial);
  const [copied, setCopied] = useState(false);

  const upd = (key: keyof DatosHistoria, val: any) =>
    setDatos(prev => ({ ...prev, [key]: val }));

  const updAntec = (key: keyof DatosHistoria['antecedentes'], val: any) =>
    setDatos(prev => ({ ...prev, antecedentes: { ...prev.antecedentes, [key]: val } }));

  const textoGenerado = useMemo(() => ensamblarTexto(datos, paciente), [datos, paciente]);

  const handleCopy = () => {
    navigator.clipboard.writeText(textoGenerado);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totales = 21;
  const completadas = [
    datos.datosPersonalesOk, datos.motivoConsulta.length > 5, datos.padecimientoActual.length > 20,
    true, true, true, // antecedentes (siempre completable)
    datos.tensionArterial.length > 3, datos.frecuenciaCardiaca.length > 0, datos.temperatura.length > 2,
    datos.exploracionExtraoral.length > 5, datos.exploracionIntraoral.length > 5,
    datos.odontogramaOk, datos.periodontogramaOk,
    datos.diagnosticoPrincipal.length > 5, datos.diagnosticosAdicionales.length > 0 || true,
    datos.pronostico !== '',
    datos.planTratamientoOk,
    true, // referencia siempre completa (opcional)
    datos.notaEvolucion.length > 0 || true,
    datos.firmaPaciente && datos.firmaAlumno && datos.firmaDocente,
  ].filter(Boolean).length;

  const pctCompletado = Math.round((completadas / totales) * 100);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full min-h-0">
      {/* Formulario izquierdo */}
      <div className="flex-1 min-w-0 overflow-y-auto space-y-2 pr-0 lg:pr-2">
        {/* Header progreso */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Historia Clínica</h2>
            <p className="text-xs text-zinc-400">{completadas}/{totales} secciones · {pctCompletado}% completo</p>
          </div>
          <div className="w-24 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${pctCompletado}%` }}
              transition={{ duration: 0.4 }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
            />
          </div>
        </div>

        {/* Sección I — Ficha */}
        <Seccion num="I" titulo="Ficha de Identificación" completada={datos.datosPersonalesOk}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nombre completo">
              <input className={inputCls} defaultValue={paciente.nombre} readOnly />
            </Field>
            <Field label="Edad">
              <input className={inputCls} defaultValue={`${paciente.edad} años`} readOnly />
            </Field>
            <Field label="CURP">
              <input className={inputCls} defaultValue={paciente.curp} readOnly />
            </Field>
            <Field label="Clínica">
              <input className={inputCls} defaultValue={paciente.nodo.toUpperCase()} readOnly />
            </Field>
          </div>
        </Seccion>

        {/* Sección II — Motivo */}
        <Seccion num="II" titulo="Motivo de Consulta" completada={datos.motivoConsulta.length > 5}>
          <Field label="Motivo (en palabras del paciente)">
            <textarea
              className={textareaCls} rows={2} value={datos.motivoConsulta}
              readOnly={readOnly}
              onChange={e => upd('motivoConsulta', e.target.value)}
            />
          </Field>
          <div className="mt-2">
            <Field label="Tiempo de evolución">
              <select
                className={inputCls} value={datos.tiempoEvolucion}
                disabled={readOnly}
                onChange={e => upd('tiempoEvolucion', e.target.value)}
              >
                {['Horas', '1-3 días', '1 semana', '2 semanas', '1 mes', '2-6 meses', 'Más de 6 meses', 'Años'].map(t => (
                  <option key={t} value={t.toLowerCase()}>{t}</option>
                ))}
              </select>
            </Field>
          </div>
        </Seccion>

        {/* Sección III — Padecimiento */}
        <Seccion num="III" titulo="Padecimiento Actual" completada={datos.padecimientoActual.length > 20}>
          <Field label="Descripción clínica del padecimiento">
            <textarea
              className={textareaCls} rows={4} value={datos.padecimientoActual}
              readOnly={readOnly}
              onChange={e => upd('padecimientoActual', e.target.value)}
            />
          </Field>
        </Seccion>

        {/* Secciones IV-VI — Antecedentes */}
        <Seccion num="IV–VI" titulo="Antecedentes Heredofamiliares y Personales" completada={true}>
          <div className="space-y-3">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">Padecimientos sistémicos</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { key: 'hipertension' as const, label: 'Hipertensión' },
                { key: 'diabetes' as const, label: 'Diabetes' },
                { key: 'cardiopatia' as const, label: 'Cardiopatía' },
                { key: 'hepatitis' as const, label: 'Hepatitis' },
                { key: 'vih' as const, label: 'VIH' },
                { key: 'embarazo' as const, label: 'Embarazo' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={datos.antecedentes[key] as boolean}
                    disabled={readOnly}
                    onChange={e => updAntec(key, e.target.checked)}
                    className="w-3.5 h-3.5 rounded accent-zinc-900"
                  />
                  <span className="text-xs text-zinc-700 dark:text-zinc-300">{label}</span>
                </label>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={datos.antecedentes.alergias} onChange={e => updAntec('alergias', e.target.checked)} disabled={readOnly} className="w-3.5 h-3.5 rounded accent-zinc-900" />
                <span className="text-xs">Alergias</span>
              </label>
              {datos.antecedentes.alergias && (
                <input className={inputCls} placeholder="¿A qué?" value={datos.antecedentes.nombreAlergia} readOnly={readOnly} onChange={e => updAntec('nombreAlergia', e.target.value)} />
              )}
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={datos.antecedentes.medicamentos} onChange={e => updAntec('medicamentos', e.target.checked)} disabled={readOnly} className="w-3.5 h-3.5 rounded accent-zinc-900" />
                <span className="text-xs">Medicamentos actuales</span>
              </label>
              {datos.antecedentes.medicamentos && (
                <input className={inputCls} placeholder="Nombre y dosis" value={datos.antecedentes.nombreMedicamento} readOnly={readOnly} onChange={e => updAntec('nombreMedicamento', e.target.value)} />
              )}
            </div>
          </div>
        </Seccion>

        {/* Secciones VII-IX — Exploración */}
        <Seccion num="VII–IX" titulo="Signos Vitales y Exploración Física" completada={datos.tensionArterial.length > 3}>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <Field label="TA (mmHg)">
              <input className={inputCls} value={datos.tensionArterial} readOnly={readOnly} onChange={e => upd('tensionArterial', e.target.value)} placeholder="120/80" />
            </Field>
            <Field label="FC (lpm)">
              <input className={inputCls} type="number" value={datos.frecuenciaCardiaca} readOnly={readOnly} onChange={e => upd('frecuenciaCardiaca', e.target.value)} placeholder="72" />
            </Field>
            <Field label="T° (°C)">
              <input className={inputCls} value={datos.temperatura} readOnly={readOnly} onChange={e => upd('temperatura', e.target.value)} placeholder="36.5" />
            </Field>
          </div>
          <Field label="Exploración extraoral">
            <textarea className={textareaCls} rows={2} value={datos.exploracionExtraoral} readOnly={readOnly} onChange={e => upd('exploracionExtraoral', e.target.value)} />
          </Field>
          <div className="mt-2">
            <Field label="Exploración intraoral">
              <textarea className={textareaCls} rows={2} value={datos.exploracionIntraoral} readOnly={readOnly} onChange={e => upd('exploracionIntraoral', e.target.value)} />
            </Field>
          </div>
        </Seccion>

        {/* X — Odontograma (referencia) */}
        <Seccion num="X" titulo="Odontograma FDI" completada={datos.odontogramaOk}>
          <div className="flex items-center gap-2 py-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-xs text-zinc-600 dark:text-zinc-400">Odontograma registrado en pestaña dedicada. Ver tab "Odontograma".</span>
          </div>
        </Seccion>

        {/* XI — Periodontograma */}
        <Seccion num="XI" titulo="Periodontograma" completada={datos.periodontogramaOk}>
          <div className="flex items-center gap-2 py-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-xs text-zinc-600 dark:text-zinc-400">Periodontograma con diagnóstico AAP 2017 en pestaña "Periodontograma".</span>
          </div>
        </Seccion>

        {/* XII — Diagnóstico */}
        <Seccion num="XII" titulo="Diagnóstico" completada={datos.diagnosticoPrincipal.length > 5}>
          <div className="space-y-3">
            <Field label="Diagnóstico principal (código OMS/CIE)">
              <input className={inputCls} value={datos.diagnosticoPrincipal} readOnly={readOnly} onChange={e => upd('diagnosticoPrincipal', e.target.value)} />
            </Field>
            <Field label="Diagnósticos adicionales">
              <input className={inputCls} value={datos.diagnosticosAdicionales} readOnly={readOnly} onChange={e => upd('diagnosticosAdicionales', e.target.value)} />
            </Field>
          </div>
        </Seccion>

        {/* XIII — Pronóstico */}
        <Seccion num="XIII" titulo="Pronóstico" completada={datos.pronostico !== ''}>
          <Field label="Pronóstico general del caso">
            <div className="flex gap-2">
              {(['bueno', 'reservado', 'malo'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => !readOnly && upd('pronostico', p)}
                  className={cn(
                    'flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all',
                    datos.pronostico === p
                      ? p === 'bueno' ? 'bg-emerald-500 text-white' : p === 'reservado' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </Field>
        </Seccion>

        {/* XIV — Plan */}
        <Seccion num="XIV" titulo="Plan de Tratamiento" completada={datos.planTratamientoOk}>
          <div className="flex items-center gap-2 py-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-xs text-zinc-600 dark:text-zinc-400">Plan de tratamiento estructurado en 5 fases. Ver tab "Tratamiento".</span>
          </div>
        </Seccion>

        {/* XV — Referencia */}
        <Seccion num="XV" titulo="Referencia y Contrarreferencia" completada={true}>
          <label className="flex items-center gap-2 mb-3">
            <input type="checkbox" checked={datos.requiereReferencia} onChange={e => upd('requiereReferencia', e.target.checked)} disabled={readOnly} className="w-3.5 h-3.5 rounded accent-zinc-900" />
            <span className="text-xs">¿Requiere referencia a otra especialidad?</span>
          </label>
          {datos.requiereReferencia && (
            <Field label="Especialidad">
              <input className={inputCls} value={datos.especialidad} readOnly={readOnly} onChange={e => upd('especialidad', e.target.value)} placeholder="Ej: Periodoncia, Endodoncia, Cirugía Maxilofacial..." />
            </Field>
          )}
        </Seccion>

        {/* XVI-XX — Notas de evolución */}
        <Seccion num="XVI–XX" titulo="Notas de Evolución por Cita" completada={datos.notaEvolucion.length > 0}>
          <Field label="Nota de la cita actual">
            <textarea
              className={textareaCls} rows={3} value={datos.notaEvolucion}
              readOnly={readOnly}
              onChange={e => upd('notaEvolucion', e.target.value)}
              placeholder="Descripción del procedimiento realizado hoy, observaciones y plan para próxima cita..."
            />
          </Field>
        </Seccion>

        {/* XXI — Firmas */}
        <Seccion num="XXI" titulo="Consentimiento y Firmas" completada={datos.firmaPaciente && datos.firmaAlumno && datos.firmaDocente}>
          <div className="space-y-3">
            {[
              { key: 'firmaPaciente' as keyof DatosHistoria, label: 'Firma del paciente / tutor legal' },
              { key: 'firmaAlumno' as keyof DatosHistoria, label: `Firma alumno: Rodrigo Martínez Ávalos` },
              { key: 'firmaDocente' as keyof DatosHistoria, label: `Firma docente: ${paciente.docenteSupervisor}` },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 cursor-pointer">
                <span className="text-xs text-zinc-700 dark:text-zinc-300">{label}</span>
                <input
                  type="checkbox"
                  checked={datos[key] as boolean}
                  disabled={readOnly}
                  onChange={e => upd(key, e.target.checked)}
                  className="w-4 h-4 rounded accent-zinc-900"
                />
              </label>
            ))}
          </div>
        </Seccion>
      </div>

      {/* Panel de redacción en tiempo real */}
      <div className="w-full lg:w-80 shrink-0">
        <div className="sticky top-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-zinc-500" />
              <span className="text-xs font-bold text-zinc-900 dark:text-white">Vista previa del documento</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
          <pre className="p-4 text-[10px] text-zinc-600 dark:text-zinc-400 font-mono whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[70vh]">
            {textoGenerado}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default HistoriaClinica21;
