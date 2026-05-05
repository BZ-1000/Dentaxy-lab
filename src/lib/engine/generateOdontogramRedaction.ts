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
};

/** Colores ADA para badges en el HTML */
const STATE_COLORS: Record<ToothState, string> = {
  S:   '#1D9E75',
  C:   '#EA4335',
  O:   '#1A73E8',
  EI:  '#7B4FA8',
  A:   '#EA4335',
  CR:  '#FF6D00',
  PU:  '#FF6D00',
  E:   '#EA4335',
  IM:  '#607D8B',
  SE:  '#F9AB00',
  F:   '#EA4335',
  MOV: '#FF6D00',
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

  const caries     = filterByState(teeth, 'C');
  const obturados  = filterByState(teeth, 'O');
  const ausentes   = filterByState(teeth, 'A');
  const endodoncias = filterByState(teeth, 'E');
  const coronas    = filterByState(teeth, 'CR');
  const puentes    = filterByState(teeth, 'PU');
  const ei         = filterByState(teeth, 'EI');
  const implantes  = filterByState(teeth, 'IM');
  const selladores = filterByState(teeth, 'SE');
  const fracturas  = filterByState(teeth, 'F');
  const movilidad  = filterByState(teeth, 'MOV');

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

  // Agrupar hallazgos por estado para la tabla
  const activeStates = [...new Set(
    teeth.filter(t => t.state !== 'S').map(t => t.state)
  )] as ToothState[];

  // ── Estilos compartidos (3A) para tablas simples ───────────────────────────
  const tdKeyStyle = "font-family:'DM Mono',monospace;font-size:11px;font-weight:500;letter-spacing:0.04em;color:#888;text-transform:uppercase;width:38%;padding:11px 16px 11px 0;vertical-align:top;border-bottom:1px solid #e5e7eb;";
  const tdValStyle = "font-size:14px;font-weight:300;color:#3a3a3a;padding:11px 0 11px 16px;vertical-align:top;border-bottom:1px solid #e5e7eb;";
  
  // ── Sección de hallazgos (Odontograma) ─────────────────────────────────────
  let hallazgosHTML = '';
  if (activeStates.length > 0) {
    const rows = activeStates.map((state, i) => {
      const group = teeth.filter(t => t.state === state);
      const label = STATE_LABELS[state];
      const teethStr = group.map(t => {
        const surf = formatSurfaces(t.surfaces);
        return surf ? `OD ${t.id} (${surf})` : `OD ${t.id}`;
      }).join(', ');
      
      const bg = i % 2 !== 0 ? ' style="background:#f9fafb;"' : '';
      return `<tr${bg}>
        <td style="${tdKeyStyle}">${label}</td>
        <td style="${tdValStyle}">${teethStr}</td>
      </tr>`;
    }).join('');

    hallazgosHTML = `
      <table style="width:100%;border-collapse:collapse;margin-bottom:12px">
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  // ── Sección de Diagnósticos (CIE-10) ───────────────────────────────────────
  const diagRows = diagnoses.map((d, i) => {
    const bg = i % 2 !== 0 ? ' style="background:#f9fafb;"' : '';
    return `<tr${bg}>
      <td style="${tdKeyStyle}">${d.code}</td>
      <td style="${tdValStyle}">${d.description}</td>
    </tr>`;
  }).join('');

  // ── Plan de tratamiento por fases (3B) ─────────────────────────────────────
  const renderPhase = (items: TreatmentItem[], phaseName: string): string => {
    if (items.length === 0) return '';
    
    const thStyle = "font-family:'DM Mono',monospace;font-size:10px;font-weight:600;letter-spacing:0.08em;color:#6b7280;text-transform:uppercase;padding:8px 12px 8px 0;text-align:left;";
    const rows = items.map(i => `
      <tr style="border-bottom:1px solid #f3f4f6;">
        <td style="font-size:13px;font-weight:500;color:#374151;padding:10px 12px 10px 0;vertical-align:top;">OD ${i.tooth}</td>
        <td style="font-size:13px;font-weight:300;color:#6b7280;padding:10px 0 10px 12px;vertical-align:top;">${i.procedure}</td>
        <td style="font-size:13px;font-weight:300;color:#6b7280;padding:10px 0 10px 12px;vertical-align:top;">${i.priority}</td>
        <td style="font-size:13px;font-weight:300;color:#6b7280;padding:10px 0 10px 12px;vertical-align:top;">${i.estimatedTime}</td>
      </tr>`).join('');
      
    return `
      <div style="margin-bottom:16px;">
        <p style="font-family:'DM Mono',monospace;font-size:11px;font-weight:600;color:#374151;margin-bottom:8px;">${phaseName}</p>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:12px;">
          <thead>
            <tr style="border-bottom:2px solid #e5e7eb;">
              <th style="${thStyle}">OD</th>
              <th style="${thStyle}">Procedimiento</th>
              <th style="${thStyle}">Prioridad</th>
              <th style="${thStyle}">Tiempo</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  };

  const phase1 = renderPhase(plan.filter(p => p.phase === 1), 'FASE I — Urgencia / Control de Infección');
  const phase2 = renderPhase(plan.filter(p => p.phase === 2), 'FASE II — Rehabilitadora / Quirúrgica');
  const phase3 = renderPhase(plan.filter(p => p.phase === 3), 'FASE III — Mantenimiento / Prevención');

  // ── HTML final ─────────────────────────────────────────────────────────────
  return `<div style="font-family:ui-sans-serif,system-ui,sans-serif;padding:8px 0;">

  <div style="margin-bottom:24px;">
    <p style="font-size:11px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#9CA3AF;margin:0 0 12px">VII · ODONTOGRAMA</p>
    ${hallazgosHTML}
    <p style="font-size:14px;font-weight:300;color:#3a3a3a;line-height:1.6;margin:0;">${clinicalText}</p>
  </div>

  <div style="margin-bottom:24px;">
    <p style="font-size:11px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#9CA3AF;margin:0 0 12px">VIII · DIAGNÓSTICO PRESUNTIVO</p>
    <table style="width:100%;border-collapse:collapse;">
      <tbody>${diagRows}</tbody>
    </table>
  </div>

  ${plan.length > 0 ? `
  <div style="margin-bottom:24px;">
    <p style="font-size:11px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#9CA3AF;margin:0 0 12px">IX · PLAN DE TRATAMIENTO</p>
    ${phase1}
    ${phase2}
    ${phase3}
  </div>` : ''}

</div>`;
};
