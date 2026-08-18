/**
 * compileClinicalIntakeRedaction.ts — Motor de Redacción Determinista Local Dentaxy
 * Regla de Desarrollo Dentaxy: Cero APIs externas, privacidad Zero-Trust, respuesta instantánea.
 * 
 * Convierte las respuestas crudas enviadas por el paciente (1 clic) en un documento clínico formal 
 * de Anamnesis e Historia Clínica conforme a la norma oficial mexicana NOM-004-SSA3-2012.
 */

export interface RawPatientResponsePayload {
  specialtyType: 'URGENCIAS' | 'GENERAL';
  patientName?: string;
  submittedAt?: string;
  responses: Record<string, any>;
  clinicalPhotoUrl?: string;
}

export interface RedactedClinicalIntake {
  motivoConsultaRedactado: string;
  antecedentesRedactados: string;
  alergiasRedactadas: string;
  alertaSistemica: boolean;
  resumenCompletoNOM004: string;
}

export function compileClinicalIntakeRedaction(payload: RawPatientResponsePayload): RedactedClinicalIntake {
  const r = payload.responses || {};
  const isUrgencias = payload.specialtyType === 'URGENCIAS';

  let motivo = '';
  let antecedentes: string[] = [];
  let alergiasStr = 'Ninguna declarada';
  let alertaSistemica = false;

  if (isUrgencias) {
    // 🚨 FLUJO URGENCIAS
    const motivoRaw = r.urg_motivo || 'Molestia o dolor agudo';
    const dolor = r.urg_escala_dolor || 'No especificada';
    const tiempo = r.urg_tiempo || 'No especificado';
    const trauma = r.urg_traumatismo === true ? 'Sí reporta golpe/accidente previo en boca o rostro' : 'Niega traumatismo previo';
    const hemorragia = r.urg_hemorragia === true ? 'Presenta sangrado activo al momento del reporte' : 'Sin sangrado activo';
    
    motivo = `Paciente acude por urgencia odontológica manifestando: "${motivoRaw}". Reporta nivel de dolor ${dolor}/10 en la escala analógica visual de dolor, iniciado ${tiempo.toLowerCase()}.`;

    antecedentes.push(`[EVALUACIÓN DE URGENCIAS] ${trauma}. ${hemorragia}.`);

    if (r.urg_alergia_med === true) {
      alergiasStr = '¡ALERTA! Refiere alergia conocida a la penicilina o antibióticos/fármacos.';
    }

    if (r.urg_sistemica_critica === true) {
      alertaSistemica = true;
      antecedentes.push('¡ALERTA MÉRICA!: Paciente declara padecer condición sistémica crítica (Cardiopatía, Diabetes descontrolada o Hipertensión severa). Tomar signos vitales antes de cualquier procedimiento.');
    }

  } else {
    // 🩺 FLUJO GENERAL / PRIMERA VEZ
    motivo = 'Consulta de valoración general e historia clínica de primera vez.';

    // Antecedentes patológicos
    const antList: string[] = Array.isArray(r.gen_antecedentes) ? r.gen_antecedentes : [];
    if (antList.length > 0 && !antList.includes('Ninguna')) {
      antecedentes.push(`Antecedentes patológicos reportados: ${antList.join(', ')}.`);
      if (antList.some(a => ['Diabetes', 'Hipertensión', 'Problemas Cardíacos'].includes(a))) {
        alertaSistemica = true;
      }
    } else {
      antecedentes.push('Niega padecimientos sistémicos crónicos conocidos.');
    }

    // Alergias
    const alergList: string[] = Array.isArray(r.gen_alergias) ? r.gen_alergias : [];
    if (alergList.length > 0 && !alergList.includes('Ninguna')) {
      alergiasStr = `Reporta alergia a: ${alergList.join(', ')}.`;
    }

    // Medicamentos
    if (r.gen_medicamentos_actuales === true) {
      const customMed = r.customInputs?.gen_medicamentos_actuales;
      antecedentes.push(`Bajo tratamiento farmacológico actual${customMed ? `: ${customMed}` : ''}.`);
    }

    // Cirugías / Anestesia
    if (r.gen_cirugias_anestesia === true) {
      antecedentes.push('Antecedente positivo de cirugías previas o complicaciones con anestésicos locales.');
    }

    // Hábitos
    if (r.gen_habitos === true) {
      antecedentes.push('Hábitos nocivos: Consumo de tabaco o alcohol con frecuencia.');
    }

    // Embarazo / Lactancia
    if (r.gen_embarazo_lactancia && r.gen_embarazo_lactancia !== 'No' && r.gen_embarazo_lactancia !== 'No aplica') {
      antecedentes.push(`Condición fisiológica especial: ${r.gen_embarazo_lactancia}. Evitar radiografías no urgentes y fármacos contraindicados.`);
    }
  }

  const antecedentesTexto = antecedentes.join('\n');

  const resumenCompletoNOM004 = `[HISTORIA CLÍNICA INTEGRADA NOM-004-SSA3-2012]
PACIENTE: ${payload.patientName || 'Expediente Asignado'}
FECHA DE RECEPCIÓN: ${payload.submittedAt || new Date().toLocaleString('es-MX')}

MOTIVO DE CONSULTA:
${motivo}

ANTECEDENTES MÉDICO-PATOLÓGICOS:
${antecedentesTexto}

ALERGIAS REPORADAS:
${alergiasStr}

FOTO CLÍNICA DE IDENTIFICACIÓN:
${payload.clinicalPhotoUrl ? 'Adjunta en expediente ✓' : 'No provista'}`;

  return {
    motivoConsultaRedactado: motivo,
    antecedentesRedactados: antecedentesTexto,
    alergiasRedactadas: alergiasStr,
    alertaSistemica,
    resumenCompletoNOM004
  };
}
