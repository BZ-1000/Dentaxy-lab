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
  OF:  'Obturación Filtrada',
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
  OF:  '#A52A2A',  // Café rojizo (más rojizo) — obturación filtrada
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
    return '<p style="margin: 0 0 12px; font-size: 14px; line-height: 1.6; color: #374151;">Dentición permanente completa sin hallazgos patológicos aparentes al examen visual.</p>';
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

  const paragraphs: string[] = [];

  if (caries.length > 0) {
    const n = caries.length;
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
    paragraphs.push(`Se detectan lesiones cariosas activas en ${n} órgano${n > 1 ? 's' : ''} dental${n > 1 ? 'es' : ''}: ${gradeTexts.join('; ')}.`);
  }

  if (obturados.length > 0) {
    const n = obturados.length;
    const byMat: Record<string, ToothData[]> = {};
    obturados.forEach(t => {
      const mat = t.materialType ?? 'R';
      byMat[mat] = [...(byMat[mat] ?? []), t];
    });
    const matLabels: Record<string, string> = {
      AM: 'amalgama', R: 'resina compuesta', IV: 'ionómero de vidrio',
      IM: 'incrustación metálica', IE: 'incrustación estética',
    };
    const matTexts = Object.entries(byMat).map(([mat, ts]) =>
      `${formatTeethList(ts)} (${matLabels[mat] ?? mat})`
    );
    paragraphs.push(`Se observan ${n} restauración${n > 1 ? 'es' : ''} previa${n > 1 ? 's' : ''} aparentemente íntegra${n > 1 ? 's' : ''} en: ${matTexts.join('; ')}.`);
  }

  // Obturaciones filtradas
  const filtradas = filterByState(teeth, 'OF');
  if (filtradas.length > 0) {
    const n = filtradas.length;
    const byMat: Record<string, ToothData[]> = {};
    filtradas.forEach(t => {
      const mat = t.materialType ?? 'R';
      byMat[mat] = [...(byMat[mat] ?? []), t];
    });
    const matLabels: Record<string, string> = {
      AM: 'amalgama', R: 'resina compuesta', IV: 'ionómero de vidrio',
      IM: 'incrustación metálica', IE: 'incrustación estética',
    };
    const matTexts = Object.entries(byMat).map(([mat, ts]) =>
      `${formatTeethList(ts)} en ${matLabels[mat] ?? mat}`
    );
    paragraphs.push(`Se detectan ${n} restauración${n > 1 ? 'es' : ''} con filtración marginal activa en: ${matTexts.join('; ')}. Requiere${n > 1 ? 'n' : ''} recambio inmediato.`);
  }

  if (ausentes.length > 0) {
    const upper = ausentes.filter(t => getArch(t.id) === 'superior');
    const lower = ausentes.filter(t => getArch(t.id) === 'inferior');
    let ausStr = `Ausencia de órgano${ausentes.length > 1 ? 's' : ''} dental${ausentes.length > 1 ? 'es' : ''}: ${formatTeethList(ausentes)} por exodoncia previa.`;
    if (upper.length > 0 && lower.length > 0) ausStr += ' Se advierte edentulismo parcial superior e inferior.';
    else if (upper.length > 0) ausStr += ' Se advierte edentulismo parcial superior.';
    else if (lower.length > 0) ausStr += ' Se advierte edentulismo parcial inferior.';
    paragraphs.push(ausStr);
  }

  if (endodoncias.length > 0) {
    const n = endodoncias.length;
    paragraphs.push(`Órgano${n > 1 ? 's' : ''} dental${n > 1 ? 'es' : ''} ${formatTeethList(endodoncias)} con tratamiento de conductos previo.`);
  }

  if (coronas.length > 0) {
    paragraphs.push(`Se registra${coronas.length > 1 ? 'n' : ''} corona${coronas.length > 1 ? 's' : ''} protésica${coronas.length > 1 ? 's' : ''} en: ${formatTeethList(coronas)}.`);
  }

  if (puentes.length > 0) {
    paragraphs.push(`Se identifican elementos de puente fijo en: ${formatTeethList(puentes)}.`);
  }

  if (implantes.length > 0) {
    paragraphs.push(`Implante${implantes.length > 1 ? 's' : ''} dental${implantes.length > 1 ? 'es' : ''} en: ${formatTeethList(implantes)}.`);
  }

  if (selladores.length > 0) {
    paragraphs.push(`Selladores de fosetas y fisuras en: ${formatTeethList(selladores)}.`);
  }

  if (fracturas.length > 0) {
    paragraphs.push(`Se observa${fracturas.length > 1 ? 'n' : ''} fractura${fracturas.length > 1 ? 's' : ''} coronaria${fracturas.length > 1 ? 's' : ''} en: ${formatTeethList(fracturas)}.`);
  }

  if (ei.length > 0) {
    paragraphs.push(`Se indica extracción de: ${formatTeethList(ei)}.`);
  }

  if (movilidad.length > 0) {
    const movStr = movilidad.map(t => {
      const grad = t.mobility ? ['I', 'II', 'III'][t.mobility - 1] : 'I';
      return `OD ${t.id} (grado ${grad})`;
    }).join(', ');
    paragraphs.push(`Se registra movilidad dental en: ${movStr}.`);
  }

  // ── Estados nuevos norma técnica ────────────────────────────────────────────
  if (pulpect.length > 0) {
    paragraphs.push(`Pulpectomía registrada en: ${formatTeethList(pulpect)}.`);
  }
  if (pulpot.length > 0) {
    paragraphs.push(`Pulpotomía registrada en: ${formatTeethList(pulpot)}.`);
  }
  if (temporales.length > 0) {
    paragraphs.push(`Restauración${temporales.length > 1 ? 'es' : ''} temporal${temporales.length > 1 ? 'es' : ''} en: ${formatTeethList(temporales)}. Requiere tratamiento definitivo.`);
  }
  if (remanentes.length > 0) {
    paragraphs.push(`Remanente${remanentes.length > 1 ? 's' : ''} radicular${remanentes.length > 1 ? 'es' : ''} en: ${formatTeethList(remanentes)}. Se indica exodoncia.`);
  }
  if (semiImp.length > 0) {
    paragraphs.push(`Semi-impactación en: ${formatTeethList(semiImp)}. Se requiere valoración quirúrgica.`);
  }
  if (supern.length > 0) {
    paragraphs.push(`Diente${supern.length > 1 ? 's' : ''} supernumerario${supern.length > 1 ? 's' : ''} en: ${formatTeethList(supern)}.`);
  }
  if (desgaste.length > 0) {
    paragraphs.push(`Desgaste oclusal/incisal por atrición o abrasión en: ${formatTeethList(desgaste)}.`);
  }
  if (diastema.length > 0) {
    paragraphs.push(`Se observa diastema en: ${formatTeethList(diastema)}.`);
  }
  if (discrm.length > 0) {
    paragraphs.push(`Discromía dental en: ${formatTeethList(discrm)}.`);
  }
  if (ectopico.length > 0) {
    paragraphs.push(`Diente${ectopico.length > 1 ? 's' : ''} ectópico${ectopico.length > 1 ? 's' : ''}: ${formatTeethList(ectopico)}.`);
  }
  if (clavija.length > 0) {
    paragraphs.push(`Diente${clavija.length > 1 ? 's' : ''} conoide${clavija.length > 1 ? 's' : ''} (en clavija) en: ${formatTeethList(clavija)}.`);
  }
  if (extrusion.length > 0) {
    paragraphs.push(`Extrusión dentaria en: ${formatTeethList(extrusion)}.`);
  }
  if (intrusion.length > 0) {
    paragraphs.push(`Intrusión dentaria en: ${formatTeethList(intrusion)}.`);
  }
  if (gemin.length > 0) {
    paragraphs.push(`Geminación o fusión dentaria en: ${formatTeethList(gemin)}.`);
  }
  if (girov.length > 0) {
    paragraphs.push(`Giroversión en: ${formatTeethList(girov)}.`);
  }
  if (migr.length > 0) {
    paragraphs.push(`Migración dentaria patológica en: ${formatTeethList(migr)}.`);
  }
  if (transpos.length > 0) {
    paragraphs.push(`Transposición dentaria en: ${formatTeethList(transpos)}.`);
  }
  if (aof.length > 0) {
    paragraphs.push(`Aparatología ortodóntica fija registrada en: ${formatTeethList(aof)}.`);
  }
  if (aor.length > 0) {
    paragraphs.push(`Aparatología ortodóntica removible en: ${formatTeethList(aor)}.`);
  }

  paragraphs.push('El resto de la dentición se observa clínicamente dentro de parámetros normales.');

  return paragraphs
    .map(p => `<p style="margin: 0 0 14px; font-size: 15px; line-height: 1.75; color: #F5F5F7; font-weight: 500;">${p}</p>`)
    .join('');
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
  if (has('OF')) {
    const ofTeeth = teeth.filter(t => t.state === 'OF');
    const matLabels: Record<string, string> = {
      AM: 'amalgama', R: 'resina compuesta', IV: 'ionómero de vidrio',
      IM: 'incrustación metálica', IE: 'incrustación estética',
    };
    const mats = [...new Set(ofTeeth.map(t => t.materialType ?? 'R'))].map(m => matLabels[m] ?? m);
    diagnoses.push({ code: 'K02.9', description: `Caries secundaria / filtración marginal en restauración de ${mats.join(', ')} — recambio indicado` });
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
      case 'OF': {
        const matLabels: Record<string, string> = {
          AM: 'amalgama', R: 'resina compuesta', IV: 'ionómero de vidrio',
          IM: 'incrustación metálica', IE: 'incrustación estética',
        };
        const mat = matLabels[tooth.materialType ?? 'R'] ?? tooth.materialType ?? 'resina';
        plan.push({
          tooth: tooth.id,
          procedure: `Recambio de obturación filtrada de ${mat} — examen de caries secundaria, preparación y restauración definitiva`,
          priority: 'Alta',
          phase: 1,
          estimatedTime: '45-60 min',
        });
        break;
      }
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
        <td style="padding:9px 14px 9px 0;white-space:nowrap">
          <span style="display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:700;color:${color}">
            <span style="width:10px;height:10px;border-radius:50%;background:${color};flex-shrink:0;display:inline-block"></span>
            ${label}
          </span>
        </td>
        <td style="padding:7px 0;font-size:14px;color:#374151;line-height:1.5">${teethStr}</td>
      </tr>`;
  }).join('');

  // ── Plan de tratamiento por fases ──────────────────────────────────────────
  const phase1 = plan.filter(p => p.phase === 1);
  const phase2 = plan.filter(p => p.phase === 2);
  const phase3 = plan.filter(p => p.phase === 3);

  const phaseColors = {
    1: { bg: '#fef2f2', headerBg: '#fee2e2', border: '#ef4444', label: 'FASE I — Urgencia / Control de infección', color: '#b91c1c' },
    2: { bg: '#f0f9ff', headerBg: '#e0f2fe', border: '#3b82f6', label: 'FASE II — Rehabilitadora y estética', color: '#1d4ed8' },
    3: { bg: '#ecfdf5', headerBg: '#d1fae5', border: '#10b981', label: 'FASE III — Mantenimiento y prevención', color: '#047857' },
  };

  const renderPhase = (items: TreatmentItem[], phaseNum: 1 | 2 | 3): string => {
    if (items.length === 0) return '';
    const { bg, headerBg, border, label, color } = phaseColors[phaseNum];
    const rows = items.map(i => `
      <tr style="border-bottom:1px solid rgba(0,0,0,0.06)">
        <td style="padding:12px 14px;font-size:15px;color:#1e293b;font-weight:700;white-space:nowrap">OD ${i.tooth}</td>
        <td style="padding:12px 14px;font-size:15px;color:#334155;line-height:1.6;font-weight:500">${i.procedure}</td>
        <td style="padding:12px 14px;font-size:14px;color:${i.priority === 'Alta' ? '#dc2626' : i.priority === 'Media' ? '#d97706' : '#059669'};font-weight:800">${i.priority}</td>
        <td style="padding:12px 14px;font-size:14px;color:#64748b;white-space:nowrap">${i.estimatedTime}</td>
      </tr>`).join('');
    return `
      <div style="margin-bottom:24px;border-radius:20px;overflow:hidden;border-left:5px solid ${border};background:${bg};box-shadow: 6px 6px 14px #cbd2de, -6px -6px 14px #ffffff;">
        <div style="padding:14px 18px;font-size:13px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:${color};background:${headerBg}">${label}</div>
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:rgba(0,0,0,0.02)">
              <th style="padding:10px 14px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#64748b;text-align:left;font-weight:700">OD</th>
              <th style="padding:10px 14px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#64748b;text-align:left;font-weight:700">Procedimiento</th>
              <th style="padding:10px 14px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#64748b;text-align:left;font-weight:700">Prioridad</th>
              <th style="padding:10px 14px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#64748b;text-align:left;font-weight:700">Tiempo Est.</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  };

  // ── Diagnóstico ────────────────────────────────────────────────────────────
  const diagRows = diagnoses.map(d => `
    <tr style="border-bottom:1px solid rgba(0,0,0,0.06)">
      <td style="padding:12px 14px 12px 0;font-size:15px;font-weight:800;color:#6b21a8;white-space:nowrap">${d.code}</td>
      <td style="padding:12px 0;font-size:15px;color:#1e293b;line-height:1.6;font-weight:500">${d.description}</td>
    </tr>`).join('');

  // ── HTML final sin divs contenedores de relleno ────────────────────────────
  return `<div style="font-family:'Plus Jakarta Sans','Inter',-apple-system,sans-serif;color:#1e293b">

  ${activeStates.length > 0 ? `
  <div style="margin-bottom:28px">
    <p style="font-size:14px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#1e293b;margin:0 0 16px;border-bottom:2px solid #cbd2de;padding-bottom:8px">HALLAZGOS Y REDACCIÓN DEL ODONTOGRAMA</p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
      <tbody>${hallazgosRows}</tbody>
    </table>
    <div style="font-size:15px;line-height:1.75;color:#334155">
      ${clinicalText}
    </div>
  </div>` : `
  <div style="margin-bottom:28px;font-size:15px;line-height:1.75;color:#334155">
    ${clinicalText}
  </div>`}

  ${diagnoses.length > 0 ? `
  <div style="margin-bottom:32px">
    <p style="font-size:14px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#1e293b;margin:0 0 16px;border-bottom:2px solid #cbd2de;padding-bottom:8px">DIAGNÓSTICO PRESUNTIVO (CIE-10)</p>
    <table style="width:100%;border-collapse:collapse">
      <tbody>${diagRows}</tbody>
    </table>
  </div>` : ''}

  ${plan.length > 0 ? `
  <div style="margin-bottom:32px">
    <p style="font-size:14px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#1e293b;margin:0 0 20px;border-bottom:2px solid #cbd2de;padding-bottom:8px">PLAN DE TRATAMIENTO Y SECUENCIA CLÍNICA</p>
    ${renderPhase(phase1, 1)}
    ${renderPhase(phase2, 2)}
    ${renderPhase(phase3, 3)}
  </div>` : ''}

</div>`;
};
