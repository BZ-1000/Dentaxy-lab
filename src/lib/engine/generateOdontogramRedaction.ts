/**
 * generateOdontogramRedaction.ts
 * Motor determinista de redacción clínica del odontograma DentaXy.
 * Sin APIs externas — Lógica 100% en cliente — Costo $0.
 *
 * Genera:
 *  1. Texto clínico del apartado VII del expediente
 *  2. Diagnóstico presuntivo con códigos CIE-10
 *  3. Plan de tratamiento por fases
 */

import { ToothData, ToothState } from '@/types/odontograma';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers de formato
// ─────────────────────────────────────────────────────────────────────────────

/** Nombres de superficies en español */
const SURFACE_NAMES: Record<string, string> = {
  M: 'Mesial',
  D: 'Distal',
  V: 'Vestibular',
  L: 'Lingual',
  O: 'Oclusal',
  I: 'Incisal',
};

/** Etiquetas de estados para redacción */
const STATE_LABELS: Record<ToothState, string> = {
  S:   'Sano',
  C:   'Caries',
  O:   'Obturado',
  EI:  'Extracción indicada',
  A:   'Ausente',
  CR:  'Corona',
  PU:  'Puente',
  E:   'Endodoncia',
  IM:  'Implante',
  SE:  'Sellador',
  F:   'Fractura',
  MOV: 'Movilidad',
  AOF: 'Ap. Ortodóntico Fijo',
  AOR: 'Ap. Ortodóntico Removible',
  DES: 'Desgaste Oclusal',
  DIA: 'Diastema',
  DIS: 'Discromía',
  ECT: 'Diente Ectópico',
  CLV: 'Diente en Clavija',
  EXT: 'Extrusión',
  INT: 'Intrusión',
  GF:  'Geminación/Fusión',
  GV:  'Giroversión',
  MIG: 'Migración',
  RR:  'Remanente Radicular',
  RT:  'Rest. Temporal',
  SI:  'Semi-impactación',
  SN:  'Supernumerario',
  TR:  'Transposición',
  PC:  'Pulpectomía',
  PP:  'Pulpotomía',
};

/** Colores por estado — Rojo=patología, Azul=tratamiento definitivo */
const STATE_COLORS: Record<ToothState, string> = {
  S:   '#1D9E75',
  C:   '#EA4335',
  O:   '#1A73E8',
  EI:  '#7B4FA8',
  A:   '#EA4335',
  CR:  '#FF6D00',
  PU:  '#FF6D00',
  E:   '#1A73E8',
  IM:  '#607D8B',
  SE:  '#F9AB00',
  F:   '#EA4335',
  MOV: '#FF6D00',
  AOF: '#1A73E8',
  AOR: '#1A73E8',
  DES: '#795548',
  DIA: '#1A73E8',
  DIS: '#9C27B0',
  ECT: '#607D8B',
  CLV: '#607D8B',
  EXT: '#FF6D00',
  INT: '#FF6D00',
  GF:  '#607D8B',
  GV:  '#607D8B',
  MIG: '#FF6D00',
  RR:  '#EA4335',
  RT:  '#EA4335',
  SI:  '#F9AB00',
  SN:  '#9C27B0',
  TR:  '#607D8B',
  PC:  '#1A73E8',
  PP:  '#1A73E8',
};

/** Formatea las superficies de un diente para redacción */
const formatSurfaces = (surfaces: ToothData['surfaces']): string => {
  const keys = Object.keys(surfaces).filter(k => surfaces[k as keyof typeof surfaces]);
  if (keys.length === 0) return '';
  const names = keys.map(k => SURFACE_NAMES[k] ?? k);
  if (names.length === 1) return `cara ${names[0].toLowerCase()}`;
  const last = names.pop();
  return `caras ${names.map(n => n.toLowerCase()).join(', ')} y ${last?.toLowerCase()}`;
};

/** Formatea una lista de dientes como "OD 14, OD 21 y OD 36" */
const formatTeethList = (teeth: ToothData[]): string => {
  if (teeth.length === 0) return '';
  const items = teeth.map(t => {
    const surfStr = formatSurfaces(t.surfaces);
    return surfStr ? `OD ${t.id} (${surfStr})` : `OD ${t.id}`;
  });
  if (items.length === 1) return items[0];
  const last = items.pop();
  return `${items.join(', ')} y ${last}`;
};

/** Determina si el diente está en arcada superior o inferior */
const getArch = (id: number): 'superior' | 'inferior' => {
  const q = Math.floor(id / 10);
  return q === 1 || q === 2 ? 'superior' : 'inferior';
};

/** Filtra dientes por estado (omitiendo 'S') */
const filterByState = (teeth: ToothData[], state: ToothState): ToothData[] =>
  teeth.filter(t => t.state === state);

// ─────────────────────────────────────────────────────────────────────────────
// FUNCIÓN 1 — Texto clínico del odontograma (Apartado VII)
// ─────────────────────────────────────────────────────────────────────────────

export const generateOdontogramText = (teeth: ToothData[]): string => {
  const activeTeeth = teeth.filter(t => t.state !== 'S');

  if (activeTeeth.length === 0) {
    return 'Dentición permanente completa sin hallazgos patológicos aparentes al examen visual.';
  }

  const caries      = filterByState(teeth, 'C');
  const obturados   = filterByState(teeth, 'O');
  const ausentes    = filterByState(teeth, 'A');
  const endodoncias = filterByState(teeth, 'E');
  const coronas     = filterByState(teeth, 'CR');
  const puentes     = filterByState(teeth, 'PU');
  const ei          = filterByState(teeth, 'EI');
  const implantes   = filterByState(teeth, 'IM');
  const selladores  = filterByState(teeth, 'SE');
  const fracturas   = filterByState(teeth, 'F');
  const movilidad   = filterByState(teeth, 'MOV');
  const pulpect     = filterByState(teeth, 'PC');
  const pulpot      = filterByState(teeth, 'PP');
  const temporales  = filterByState(teeth, 'RT');
  const remanentes  = filterByState(teeth, 'RR');
  const semiImp     = filterByState(teeth, 'SI');
  const supern      = filterByState(teeth, 'SN');
  const desgaste    = filterByState(teeth, 'DES');
  const diastema    = filterByState(teeth, 'DIA');
  const discrm      = filterByState(teeth, 'DIS');
  const ectopico    = filterByState(teeth, 'ECT');
  const clavija     = filterByState(teeth, 'CLV');
  const extrusion   = filterByState(teeth, 'EXT');
  const intrusion   = filterByState(teeth, 'INT');
  const gemin       = filterByState(teeth, 'GF');
  const girov       = filterByState(teeth, 'GV');
  const migr        = filterByState(teeth, 'MIG');
  const aof         = filterByState(teeth, 'AOF');
  const aor         = filterByState(teeth, 'AOR');
  const transpos    = filterByState(teeth, 'TR');

  const parts: string[] = [];

  if (caries.length > 0) {
    const n = caries.length;
    // Agrupar por grado para texto más preciso
    const byGrade: Record<number, ToothData[]> = {};
    caries.forEach(t => {
      const g = t.cariesGrade ?? 2;
      byGrade[g] = [...(byGrade[g] ?? []), t];
    });
    const gradeLabels: Record<number, string> = {
      1: 'caries incipiente de esmalte (Grado I)',
      2: 'caries de dentina superficial (Grado II)',
      3: 'caries de dentina profunda (Grado III)',
      4: 'caries con compromiso pulpar (Grado IV)',
    };
    const gradeTexts = Object.entries(byGrade).map(([g, ts]) =>
      `${formatTeethList(ts)} — ${gradeLabels[Number(g)]}`
    );
    parts.push(`Se detectan lesiones cariosas en ${n} órgano${n > 1 ? 's' : ''} dental${n > 1 ? 'es' : ''}: ${gradeTexts.join('; ')}.`);
  }

  if (obturados.length > 0) {
    const n = obturados.length;
    parts.push(`Se observan ${n} restauración${n > 1 ? 'es' : ''} previa${n > 1 ? 's' : ''} en: ${formatTeethList(obturados)}.`);
  }

  if (ausentes.length > 0) {
    const upper = ausentes.filter(t => getArch(t.id) === 'superior');
    const lower = ausentes.filter(t => getArch(t.id) === 'inferior');
    let ausStr = `Ausencia de órgano${ausentes.length > 1 ? 's' : ''} dental${ausentes.length > 1 ? 'es' : ''}: ${formatTeethList(ausentes)} por exodoncia previa.`;
    if (upper.length > 0 && lower.length > 0) ausStr += ' Se advierte edentulismo parcial superior e inferior.';
    else if (upper.length > 0) ausStr += ' Se advierte edentulismo parcial superior.';
    else if (lower.length > 0) ausStr += ' Se advierte edentulismo parcial inferior.';
    parts.push(ausStr);
  }

  if (endodoncias.length > 0) {
    const n = endodoncias.length;
    parts.push(`Órgano${n > 1 ? 's' : ''} dental${n > 1 ? 'es' : ''} ${formatTeethList(endodoncias)} con tratamiento de conductos previo.`);
  }

  if (coronas.length > 0) {
    parts.push(`Se registra${coronas.length > 1 ? 'n' : ''} corona${coronas.length > 1 ? 's' : ''} protésica${coronas.length > 1 ? 's' : ''} en: ${formatTeethList(coronas)}.`);
  }

  if (puentes.length > 0) {
    parts.push(`Se identifican elementos de puente fijo en: ${formatTeethList(puentes)}.`);
  }

  if (implantes.length > 0) {
    parts.push(`Implante${implantes.length > 1 ? 's' : ''} dental${implantes.length > 1 ? 'es' : ''} en: ${formatTeethList(implantes)}.`);
  }

  if (selladores.length > 0) {
    parts.push(`Selladores de fosetas y fisuras en: ${formatTeethList(selladores)}.`);
  }

  if (fracturas.length > 0) {
    parts.push(`Se observa${fracturas.length > 1 ? 'n' : ''} fractura${fracturas.length > 1 ? 's' : ''} coronaria${fracturas.length > 1 ? 's' : ''} en: ${formatTeethList(fracturas)}.`);
  }

  if (ei.length > 0) {
    parts.push(`Se indica extracción de: ${formatTeethList(ei)}.`);
  }

  if (movilidad.length > 0) {
    const movStr = movilidad.map(t => {
      const grad = t.mobility ? ['I', 'II', 'III'][t.mobility - 1] : 'I';
      return `OD ${t.id} (grado ${grad})`;
    }).join(', ');
    parts.push(`Se registra movilidad dental en: ${movStr}.`);
  }

  // ── Estados nuevos norma técnica ────────────────────────────────────────────
  if (pulpect.length > 0) {
    parts.push(`Pulpectomía registrada en: ${formatTeethList(pulpect)}.`);
  }
  if (pulpot.length > 0) {
    parts.push(`Pulpotomía registrada en: ${formatTeethList(pulpot)}.`);
  }
  if (temporales.length > 0) {
    parts.push(`Restauración${temporales.length > 1 ? 'es' : ''} temporal${temporales.length > 1 ? 'es' : ''} en: ${formatTeethList(temporales)}. Requiere tratamiento definitivo.`);
  }
  if (remanentes.length > 0) {
    parts.push(`Remanente${remanentes.length > 1 ? 's' : ''} radicular${remanentes.length > 1 ? 'es' : ''} en: ${formatTeethList(remanentes)}. Se indica exodoncia.`);
  }
  if (semiImp.length > 0) {
    parts.push(`Semi-impactación en: ${formatTeethList(semiImp)}. Se requiere valoración quirúrgica.`);
  }
  if (supern.length > 0) {
    parts.push(`Diente${supern.length > 1 ? 's' : ''} supernumerario${supern.length > 1 ? 's' : ''} en: ${formatTeethList(supern)}.`);
  }
  if (desgaste.length > 0) {
    parts.push(`Desgaste oclusal/incisal por atrición o abrasión en: ${formatTeethList(desgaste)}.`);
  }
  if (diastema.length > 0) {
    parts.push(`Se observa diastema en: ${formatTeethList(diastema)}.`);
  }
  if (discrm.length > 0) {
    parts.push(`Discromía dental en: ${formatTeethList(discrm)}.`);
  }
  if (ectopico.length > 0) {
    parts.push(`Diente${ectopico.length > 1 ? 's' : ''} ectópico${ectopico.length > 1 ? 's' : ''}: ${formatTeethList(ectopico)}.`);
  }
  if (clavija.length > 0) {
    parts.push(`Diente${clavija.length > 1 ? 's' : ''} conoide${clavija.length > 1 ? 's' : ''} (en clavija) en: ${formatTeethList(clavija)}.`);
  }
  if (extrusion.length > 0) {
    parts.push(`Extrusión dentaria en: ${formatTeethList(extrusion)}.`);
  }
  if (intrusion.length > 0) {
    parts.push(`Intrusión dentaria en: ${formatTeethList(intrusion)}.`);
  }
  if (gemin.length > 0) {
    parts.push(`Geminación o fusión dentaria en: ${formatTeethList(gemin)}.`);
  }
  if (girov.length > 0) {
    parts.push(`Giroversión en: ${formatTeethList(girov)}.`);
  }
  if (migr.length > 0) {
    parts.push(`Migración dentaria patológica en: ${formatTeethList(migr)}.`);
  }
  if (transpos.length > 0) {
    parts.push(`Transposición dentaria en: ${formatTeethList(transpos)}.`);
  }
  if (aof.length > 0) {
    parts.push(`Aparatología ortodóntica fija registrada en: ${formatTeethList(aof)}.`);
  }
  if (aor.length > 0) {
    parts.push(`Aparatología ortodóntica removible en: ${formatTeethList(aor)}.`);
  }

  parts.push('El resto de la dentición se observa clínicamente dentro de parámetros normales.');

  return parts.join(' ');
};

// ─────────────────────────────────────────────────────────────────────────────
// FUNCIÓN 2 — Diagnóstico presuntivo con CIE-10
// ─────────────────────────────────────────────────────────────────────────────

export interface DiagnosisItem {
  code: string;
  description: string;
}

export const generateDiagnosis = (teeth: ToothData[]): DiagnosisItem[] => {
  const diagnoses: DiagnosisItem[] = [];
  const has = (state: ToothState) => teeth.some(t => t.state === state);
  const cariesTeeth = teeth.filter(t => t.state === 'C');

  // Caries: código CIE-10 según grado máximo registrado
  if (cariesTeeth.length > 0) {
    const maxGrade = Math.max(...cariesTeeth.map(t => t.cariesGrade ?? 2)) as 1|2|3|4;
    const cariesCodes: Record<1|2|3|4, { code: string; description: string }> = {
      1: { code: 'K02.0', description: 'Caries limitada al esmalte (Grado I — Incipiente)' },
      2: { code: 'K02.1', description: 'Caries de la dentina superficial (Grado II — Moderada)' },
      3: { code: 'K02.1', description: 'Caries de la dentina profunda (Grado III — Avanzada)' },
      4: { code: 'K04.0', description: 'Pulpitis irreversible por caries — posible compromiso pulpar (Grado IV)' },
    };
    diagnoses.push(cariesCodes[maxGrade]);
    // Si hay múltiples grados, agregar todos
    const grades = [...new Set(cariesTeeth.map(t => t.cariesGrade ?? 2))] as (1|2|3|4)[];
    if (grades.length > 1) {
      grades.filter(g => g !== maxGrade).forEach(g => {
        diagnoses.push({ code: cariesCodes[g].code, description: `${cariesCodes[g].description} (en ${cariesTeeth.filter(t=>(t.cariesGrade??2)===g).map(t=>`OD ${t.id}`).join(', ')})` });
      });
    }
  }

  if (has('A')) {
    diagnoses.push({ code: 'K08.1', description: 'Pérdida de dientes por extracción previa' });
  }
  if (has('MOV')) {
    const maxMob = Math.max(...teeth.filter(t=>t.state==='MOV').map(t=>t.mobility??1));
    diagnoses.push({ code: 'K05.3', description: `Periodontitis crónica con movilidad grado ${['I','II','III'][maxMob-1]}` });
  }
  if (has('EI')) {
    diagnoses.push({ code: 'K08.3', description: 'Diente retenido — indicación de extracción' });
  }
  if (has('E')) {
    diagnoses.push({ code: 'K04.5', description: 'Periodontitis apical crónica — tratamiento de conductos previo' });
  }
  if (has('F')) {
    diagnoses.push({ code: 'S02.5', description: 'Fractura coronaria' });
  }
  if (has('CR') || has('PU')) {
    diagnoses.push({ code: 'Z98.8', description: 'Prótesis dental fija (corona/puente) presente' });
  }
  if (has('IM')) {
    diagnoses.push({ code: 'Z96.5', description: 'Presencia de implante dental oseointegrado' });
  }
  // Nuevos estados norma técnica
  if (has('DES')) {
    diagnoses.push({ code: 'K03.0', description: 'Desgaste excesivo de dientes — atrición/abrasión' });
  }
  if (has('RR')) {
    diagnoses.push({ code: 'K08.3', description: 'Raíz dental retenida — remanente radicular' });
  }
  if (has('SI')) {
    diagnoses.push({ code: 'K01.1', description: 'Semi-impactación dentaria' });
  }
  if (has('SN')) {
    diagnoses.push({ code: 'K00.1', description: 'Supernumerario — hiperodoncia' });
  }
  if (has('GF')) {
    diagnoses.push({ code: 'K00.2', description: 'Anomalía de forma dentaria — geminación/fusión' });
  }
  if (has('CLV')) {
    diagnoses.push({ code: 'K00.2', description: 'Diente conoide (en clavija)' });
  }
  if (has('MIG')) {
    diagnoses.push({ code: 'K08.2', description: 'Migración dentaria patológica' });
  }
  if (has('EXT') || has('INT')) {
    diagnoses.push({ code: 'K07.3', description: 'Anomalía de posición dentaria — extrusión/intrusión' });
  }
  if (has('TR')) {
    diagnoses.push({ code: 'K07.3', description: 'Transposición dentaria' });
  }
  if (has('DIS')) {
    diagnoses.push({ code: 'K00.8', description: 'Discromía dentaria' });
  }
  if (has('AOF')) {
    diagnoses.push({ code: 'Z46.4', description: 'Portador de aparatología ortodóntica fija' });
  }
  if (has('AOR')) {
    diagnoses.push({ code: 'Z46.4', description: 'Portador de aparatología ortodóntica removible' });
  }
  if (has('PC')) {
    diagnoses.push({ code: 'K04.0', description: 'Pulpectomía realizada — tratamiento pulpar radical' });
  }
  if (has('PP')) {
    diagnoses.push({ code: 'K04.0', description: 'Pulpotomía realizada — tratamiento pulpar coronario' });
  }
  if (has('RT')) {
    diagnoses.push({ code: 'Z98.8', description: 'Restauración temporal presente — requiere tratamiento definitivo' });
  }
  if (diagnoses.length === 0) {
    diagnoses.push({ code: '—', description: 'Dentición sin diagnósticos patológicos activos al examen clínico' });
  }

  return diagnoses;
};


// ─────────────────────────────────────────────────────────────────────────────
// FUNCIÓN 3 — Plan de tratamiento por fases
// ─────────────────────────────────────────────────────────────────────────────

export interface TreatmentItem {
  tooth: number;
  procedure: string;
  priority: 'Alta' | 'Media' | 'Baja';
  phase: 1 | 2 | 3;
  estimatedTime: string;
}

export const generateTreatmentPlan = (teeth: ToothData[]): TreatmentItem[] => {
  const plan: TreatmentItem[] = [];

  const isDeciduous = (id: number) => id >= 51 && id <= 85;

  teeth.forEach(tooth => {
    switch (tooth.state) {
      case 'C': {
        const grade = tooth.cariesGrade ?? 2;
        const deciduo = isDeciduous(tooth.id);
        if (grade === 1) {
          plan.push({ tooth: tooth.id, procedure: 'Aplicación de Flúor Barniz / Sellador profiláctico', priority: 'Baja', phase: 1, estimatedTime: '15 min' });
        } else if (grade === 2) {
          plan.push({ tooth: tooth.id, procedure: deciduo ? 'Restauración con Ionómero de Vidrio / Resina' : 'Remoción de caries y Obturación con resina compuesta', priority: 'Media', phase: 1, estimatedTime: '45 min' });
        } else if (grade === 3) {
          plan.push({ tooth: tooth.id, procedure: deciduo ? 'Pulpotomía + Corona de Acero Cromo' : 'Protección pulpar indirecta + Restauración (o Endodoncia preventiva)', priority: 'Alta', phase: 1, estimatedTime: '60 min' });
        } else if (grade === 4) {
          plan.push({ tooth: tooth.id, procedure: deciduo ? 'Pulpectomía o Exodoncia' : 'Tratamiento de conductos (Endodoncia) + Reconstrucción con poste y Corona, o Exodoncia', priority: 'Alta', phase: 1, estimatedTime: '90 min' });
        }
        break;
      }
      case 'F':
        plan.push({ tooth: tooth.id, procedure: 'Valoración de fractura / Reconstrucción coronaria estética', priority: 'Alta', phase: 1, estimatedTime: '60 min' });
        break;
      case 'EI':
        plan.push({ tooth: tooth.id, procedure: 'Exodoncia atraumática', priority: 'Alta', phase: 1, estimatedTime: '30 min' });
        break;
      case 'E':
        plan.push({ tooth: tooth.id, procedure: 'Revisión de tratamiento de conductos previo / Monitoreo radiográfico', priority: 'Baja', phase: 1, estimatedTime: '15 min' });
        break;
      case 'A':
        plan.push({ tooth: tooth.id, procedure: 'Valoración para rehabilitación protésica (Implante o Puente)', priority: 'Media', phase: 2, estimatedTime: 'Consulta' });
        break;
      case 'CR':
        plan.push({ tooth: tooth.id, procedure: 'Revisión marginal y mantenimiento de corona protésica', priority: 'Baja', phase: 3, estimatedTime: '20 min' });
        break;
      case 'PU':
        plan.push({ tooth: tooth.id, procedure: 'Control higiénico y oclusal de puente fijo', priority: 'Baja', phase: 3, estimatedTime: '20 min' });
        break;
      case 'MOV': {
        const mov = tooth.mobility ?? 1;
        if (mov === 3) {
          plan.push({ tooth: tooth.id, procedure: 'Exodoncia atraumática (Movilidad severa) + Regeneración', priority: 'Alta', phase: 1, estimatedTime: '45 min' });
        } else {
          plan.push({ tooth: tooth.id, procedure: `Raspado y alisado radicular / Férula de estabilización (Movilidad G${mov})`, priority: 'Media', phase: 1, estimatedTime: '60 min' });
        }
        break;
      }
      case 'SE':
        plan.push({ tooth: tooth.id, procedure: 'Control y mantenimiento de sellador de fosetas y fisuras', priority: 'Baja', phase: 3, estimatedTime: '15 min' });
        break;
      case 'IM':
        plan.push({ tooth: tooth.id, procedure: 'Mantenimiento peri-implantario y control radiográfico', priority: 'Baja', phase: 3, estimatedTime: '20 min' });
        break;
      // ── Nuevos estados norma técnica ─────────────────────────────────────────
      case 'PC':
        plan.push({ tooth: tooth.id, procedure: 'Pulpectomía — Tratamiento pulpar radical completo', priority: 'Alta', phase: 1, estimatedTime: '60 min' });
        break;
      case 'PP':
        plan.push({ tooth: tooth.id, procedure: 'Pulpotomía — Amputación pulpar + protección', priority: 'Alta', phase: 1, estimatedTime: '45 min' });
        break;
      case 'RT':
        plan.push({ tooth: tooth.id, procedure: 'Sustitución de restauración temporal por definitiva', priority: 'Media', phase: 1, estimatedTime: '45 min' });
        break;
      case 'RR':
        plan.push({ tooth: tooth.id, procedure: 'Exodoncia de remanente radicular', priority: 'Alta', phase: 1, estimatedTime: '30 min' });
        break;
      case 'SI':
        plan.push({ tooth: tooth.id, procedure: 'Valoración quirúrgica para exposición / tracción ortodóntica', priority: 'Media', phase: 2, estimatedTime: 'Consulta' });
        break;
      case 'SN':
        plan.push({ tooth: tooth.id, procedure: 'Extracción de diente supernumerario', priority: 'Alta', phase: 1, estimatedTime: '45 min' });
        break;
      case 'DES':
        plan.push({ tooth: tooth.id, procedure: 'Confección de Guarda Oclusal / Pulido y ajuste oclusal', priority: 'Media', phase: 2, estimatedTime: '60 min' });
        break;
      case 'GF':
        plan.push({ tooth: tooth.id, procedure: 'Valoración ortodóntica / Odontoplastia', priority: 'Baja', phase: 2, estimatedTime: 'Consulta' });
        break;
      case 'MIG':
        plan.push({ tooth: tooth.id, procedure: 'Valoración para reposicionamiento ortodóntico', priority: 'Baja', phase: 2, estimatedTime: 'Consulta' });
        break;
      case 'AOF':
        plan.push({ tooth: tooth.id, procedure: 'Control y ajuste de aparatología ortodóntica fija', priority: 'Baja', phase: 3, estimatedTime: '20 min' });
        break;
      case 'AOR':
        plan.push({ tooth: tooth.id, procedure: 'Control y ajuste de aparatología ortodóntica removible', priority: 'Baja', phase: 3, estimatedTime: '20 min' });
        break;
      case 'ECT':
        plan.push({ tooth: tooth.id, procedure: 'Valoración ortodóntica para reubicación de diente ectópico', priority: 'Media', phase: 2, estimatedTime: 'Consulta' });
        break;
      case 'EXT':
        plan.push({ tooth: tooth.id, procedure: 'Valoración para intrusión ortodóntica / Ajuste oclusal', priority: 'Media', phase: 2, estimatedTime: 'Consulta' });
        break;
      case 'INT':
        plan.push({ tooth: tooth.id, procedure: 'Valoración para extrusión ortodóntica', priority: 'Media', phase: 2, estimatedTime: 'Consulta' });
        break;
      case 'DIS':
        plan.push({ tooth: tooth.id, procedure: 'Blanqueamiento dental / Carillas estéticas', priority: 'Baja', phase: 3, estimatedTime: 'Consulta' });
        break;
    }
  });

  return plan.sort((a, b) => {
    if (a.phase !== b.phase) return a.phase - b.phase;
    const prio = { Alta: 0, Media: 1, Baja: 2 };
    return prio[a.priority] - prio[b.priority];
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// FUNCIÓN PRINCIPAL — HTML completo para el panel de redacción derecho
// Mismo estilo que las otras secciones del expediente DentaXy
// ─────────────────────────────────────────────────────────────────────────────

export const generateOdontogramHTML = (teeth: ToothData[]): string => {
  const clinicalText = generateOdontogramText(teeth);
  const diagnoses = generateDiagnosis(teeth);
  const plan = generateTreatmentPlan(teeth);

  // Agrupar hallazgos por estado para la tabla de colores vibrantes
  const activeStates = [...new Set(
    teeth.filter(t => t.state !== 'S').map(t => t.state)
  )] as ToothState[];

  // ── Sección de hallazgos con colores ADA ───────────────────────────────────
  const hallazgosRows = activeStates.map(state => {
    const group = teeth.filter(t => t.state === state);
    const color = STATE_COLORS[state];
    const label = STATE_LABELS[state];
    const teethStr = group.map(t => {
      const surf = formatSurfaces(t.surfaces);
      return surf ? `OD ${t.id} (${surf})` : `OD ${t.id}`;
    }).join(', ');
    return `
      <tr>
        <td style="padding:5px 8px 5px 0;white-space:nowrap">
          <span style="display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;color:${color}">
            <span style="width:7px;height:7px;border-radius:50%;background:${color};flex-shrink:0;display:inline-block"></span>
            ${label}
          </span>
        </td>
        <td style="padding:5px 0;font-size:12px;color:#374151">${teethStr}</td>
      </tr>`;
  }).join('');

  // ── Plan de tratamiento por fases ──────────────────────────────────────────
  const phase1 = plan.filter(p => p.phase === 1);
  const phase2 = plan.filter(p => p.phase === 2);
  const phase3 = plan.filter(p => p.phase === 3);

  const phaseColors = {
    1: { bg: '#FEF2F2', border: '#EA4335', label: 'FASE I — Urgencia', color: '#EA4335' },
    2: { bg: '#EFF6FF', border: '#1A73E8', label: 'FASE II — Rehabilitadora', color: '#1A73E8' },
    3: { bg: '#F0FDF4', border: '#1D9E75', label: 'FASE III — Mantenimiento', color: '#1D9E75' },
  };

  const renderPhase = (items: TreatmentItem[], phaseNum: 1 | 2 | 3): string => {
    if (items.length === 0) return '';
    const { bg, border, label, color } = phaseColors[phaseNum];
    const rows = items.map(i => `
      <tr>
        <td style="padding:4px 8px;font-size:11px;color:#374151;font-weight:600">OD ${i.tooth}</td>
        <td style="padding:4px 8px;font-size:11px;color:#374151">${i.procedure}</td>
        <td style="padding:4px 8px;font-size:10px;color:${i.priority === 'Alta' ? '#EA4335' : i.priority === 'Media' ? '#F9AB00' : '#1D9E75'};font-weight:700">${i.priority}</td>
        <td style="padding:4px 8px;font-size:10px;color:#555">${i.estimatedTime}</td>
      </tr>`).join('');
    return `
      <div style="margin-bottom:10px;border-radius:8px;overflow:hidden;border-left:3px solid ${border};background:${bg}">
        <div style="padding:6px 10px;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${color}">${label}</div>
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:rgba(0,0,0,0.03)">
              <th style="padding:4px 8px;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:#555;text-align:left;font-weight:600">OD</th>
              <th style="padding:4px 8px;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:#555;text-align:left;font-weight:600">Procedimiento</th>
              <th style="padding:4px 8px;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:#555;text-align:left;font-weight:600">Prioridad</th>
              <th style="padding:4px 8px;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:#555;text-align:left;font-weight:600">Tiempo</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  };

  // ── Diagnóstico ────────────────────────────────────────────────────────────
  const diagRows = diagnoses.map(d => `
    <tr>
      <td style="padding:4px 0;font-size:11px;font-weight:700;color:#7B4FA8;white-space:nowrap;padding-right:12px">${d.code}</td>
      <td style="padding:4px 0;font-size:12px;color:#374151">${d.description}</td>
    </tr>`).join('');

  // ── HTML final ─────────────────────────────────────────────────────────────
  return `<div style="font-family:inherit">

  <div style="margin-bottom:16px;padding:14px 16px;border-radius:10px;background:#ffffff;border:1px solid #e5e7eb">
    <p style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#555;margin:0 0 10px">VII · ODONTOGRAMA</p>
    ${activeStates.length > 0 ? `
    <table style="width:100%;border-collapse:collapse;margin-bottom:10px">
      <tbody>${hallazgosRows}</tbody>
    </table>` : ''}
    <p style="font-size:12px;color:#374151;line-height:1.7;margin:0;border-top:${activeStates.length > 0 ? '1px solid #f3f4f6' : 'none'};padding-top:${activeStates.length > 0 ? '10px' : '0'}">${clinicalText}</p>
  </div>

  <div style="margin-bottom:16px;padding:14px 16px;border-radius:10px;background:#ffffff;border:1px solid #e5e7eb">
    <p style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#555;margin:0 0 10px">VIII · DIAGNÓSTICO PRESUNTIVO</p>
    <table style="width:100%;border-collapse:collapse">
      <tbody>${diagRows}</tbody>
    </table>
  </div>

  ${plan.length > 0 ? `
  <div style="margin-bottom:16px;padding:14px 16px;border-radius:10px;background:#ffffff;border:1px solid #e5e7eb">
    <p style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#555;margin:0 0 10px">IX · PLAN DE TRATAMIENTO</p>
    ${renderPhase(phase1, 1)}
    ${renderPhase(phase2, 2)}
    ${renderPhase(phase3, 3)}
  </div>` : ''}

</div>`;
};
