
export const generatePadecimientoActualReport = async (formData) => {
  try {
    let report = "Padecimiento Actual:\n\n";

    // Motivo de la consulta
    report += `Motivo de la consulta: ${formData.padecimientoActual?.motivoConsulta || 'No especificado'}\n`;

    // Historia de la enfermedad actual
    report += `Historia de la enfermedad actual: ${formData.padecimientoActual?.historiaEnfermedadActual || 'No especificado'}\n`;

    // Sintomas
    if (formData.padecimientoActual?.sintomas?.length > 0) {
      report += "\nSíntomas:\n";
      formData.padecimientoActual.sintomas.forEach(sintoma => {
        report += `- ${sintoma}\n`;
      });
    } else {
      report += "\nSin síntomas reportados.\n";
    }

    // Dolor
    if (formData.padecimientoActual?.dolor?.presente) {
      report += "\nDolor:\n";
      report += `  Localización: ${formData.padecimientoActual.dolor.localizacion || 'No especificado'}\n`;
      report += `  Intensidad: ${formData.padecimientoActual.dolor.intensidad || 'No especificado'}\n`;
      report += `  Tipo: ${formData.padecimientoActual.dolor.tipo || 'No especificado'}\n`;
      report += `  Irradiación: ${formData.padecimientoActual.dolor.irradiacion || 'No especificado'}\n`;
      report += `  Frecuencia: ${formData.padecimientoActual.dolor.frecuencia || 'No especificado'}\n`;
      report += `  Duración: ${formData.padecimientoActual.dolor.duracion || 'No especificado'}\n`;
      report += `  Agravantes: ${formData.padecimientoActual.dolor.agravantes || 'No especificado'}\n`;
      report += `  Atenuantes: ${formData.padecimientoActual.dolor.atenuantes || 'No especificado'}\n`;
    } else {
      report += "\nSin dolor reportado.\n";
    }

    return report;
  } catch (error) {
    console.error("Error generating padecimiento actual report:", error);
    return "Error generando el reporte. Por favor, intente de nuevo.";
  }
};

export const generateAntecedentesHFReport = async (formData) => {
  try {
    let report = "Antecedentes Heredo Familiares:\n\n";

    for (const familiar in formData.antecedentesHF) {
      if (formData.antecedentesHF.hasOwnProperty(familiar)) {
        const condiciones = formData.antecedentesHF[familiar];
        if (condiciones && Object.keys(condiciones).length > 0) {
          report += `${familiar}:\n`;
          for (const condicion in condiciones) {
            if (condiciones.hasOwnProperty(condicion) && condiciones[condicion]) {
              report += `- ${condicion}\n`;
            }
          }
          report += "\n";
        }
      }
    }

    if (report === "Antecedentes Heredo Familiares:\n\n") {
      report = "Antecedentes Heredo Familiares: Sin antecedentes relevantes.\n";
    }

    return report;
  } catch (error) {
    console.error("Error generating antecedentes heredo familiares report:", error);
    return "Error generando el reporte. Por favor, intente de nuevo.";
  }
};

export const generateAntecedentesPNPReport = async (formData) => {
  try {
    let report = "Antecedentes Personales No Patológicos:\n\n";

    // Alimentación
    report += `Alimentación: ${formData.antecedentesPNP?.alimentacion || 'No especificada'}\n`;

    // Tabaquismo
    if (formData.antecedentesPNP?.tabaquismo?.fumador) {
      report += `Tabaquismo: Fumador, ${formData.antecedentesPNP.tabaquismo.cantidad} cigarros al día durante ${formData.antecedentesPNP.tabaquismo.tiempo} años.\n`;
    } else {
      report += "Tabaquismo: No fumador.\n";
    }

    // Alcoholismo
    if (formData.antecedentesPNP?.alcoholismo?.consumeAlcohol) {
      report += `Alcoholismo: Consume alcohol, frecuencia ${formData.antecedentesPNP.alcoholismo.frecuencia} y cantidad ${formData.antecedentesPNP.alcoholismo.cantidad}.\n`;
    } else {
      report += "Alcoholismo: No consume alcohol.\n";
    }

    // Actividad física
    report += `Actividad física: ${formData.antecedentesPNP?.actividadFisica || 'No especificada'}\n`;

    // Higiene
    report += `Higiene: ${formData.antecedentesPNP?.higiene || 'No especificada'}\n`;

    // Sueño
    report += `Sueño: ${formData.antecedentesPNP?.sueno || 'No especificado'}\n`;

    return report;
  } catch (error) {
    console.error("Error generating antecedentes personales no patológicos report:", error);
    return "Error generando el reporte. Por favor, intente de nuevo.";
  }
};

export const generateAntecedentesPPReport = async (formData) => {
  try {
    let report = "Antecedentes Personales Patológicos:\n\n";

    for (const enfermedad in formData.antecedentesPP) {
      if (formData.antecedentesPP.hasOwnProperty(enfermedad)) {
        if (formData.antecedentesPP[enfermedad]) {
          report += `- ${enfermedad}\n`;
        }
      }
    }

    if (report === "Antecedentes Personales Patológicos:\n\n") {
      report = "Antecedentes Personales Patológicos: Sin antecedentes relevantes.\n";
    }

    return report;
  } catch (error) {
    console.error("Error generating antecedentes personales patológicos report:", error);
    return "Error generando el reporte. Por favor, intente de nuevo.";
  }
};

export const generateAntecedentesAlergicosReport = async (formData) => {
  try {
    let report = "Antecedentes Alérgicos:\n\n";

    for (const alergia in formData.antecedentesAlergicos) {
      if (formData.antecedentesAlergicos.hasOwnProperty(alergia)) {
        if (formData.antecedentesAlergicos[alergia]) {
          report += `- ${alergia}\n`;
        }
      }
    }

    if (report === "Antecedentes Alérgicos:\n\n") {
      report = "Antecedentes Alérgicos: Sin alergias conocidas.\n";
    }

    return report;
  } catch (error) {
    console.error("Error generating antecedentes alérgicos report:", error);
    return "Error generando el reporte. Por favor, intente de nuevo.";
  }
};

export const generateAntecedentesQuirurgicosReport = async (formData) => {
  try {
    let report = "Antecedentes Quirúrgicos:\n\n";

    for (const cirugia in formData.antecedentesQuirurgicos) {
      if (formData.antecedentesQuirurgicos.hasOwnProperty(cirugia)) {
        if (formData.antecedentesQuirurgicos[cirugia]) {
          report += `- ${cirugia}\n`;
        }
      }
    }

    if (report === "Antecedentes Quirúrgicos:\n\n") {
      report = "Antecedentes Quirúrgicos: Sin cirugías previas.\n";
    }

    return report;
  } catch (error) {
    console.error("Error generating antecedentes quirúrgicos report:", error);
    return "Error generando el reporte. Por favor, intente de nuevo.";
  }
};

export const generateAntecedentesHemorragicosReport = async (formData) => {
  try {
    let report = "Antecedentes Hemorrágicos:\n\n";

    for (const hemorragia in formData.antecedentesHemorragicos) {
      if (formData.antecedentesHemorragicos.hasOwnProperty(hemorragia)) {
        if (formData.antecedentesHemorragicos[hemorragia]) {
          report += `- ${hemorragia}\n`;
        }
      }
    }

    if (report === "Antecedentes Hemorrágicos:\n\n") {
      report = "Antecedentes Hemorrágicos: Sin antecedentes hemorrágicos relevantes.\n";
    }

    return report;
  } catch (error) {
    console.error("Error generating antecedentes hemorrágicos report:", error);
    return "Error generando el reporte. Por favor, intente de nuevo.";
  }
};

export const generateAntecedentesGinecoObstetricosReport = async (formData) => {
  try {
    let report = "Antecedentes Gineco-Obstétricos:\n\n";

    // Menarca
    report += `Menarca: ${formData.antecedentesGO?.menarca || 'No especificado'}\n`;

    // Ciclo menstrual
    report += `Ciclo menstrual: ${formData.antecedentesGO?.cicloMenstrual || 'No especificado'}\n`;

    // Gestas
    report += `Gestas: ${formData.antecedentesGO?.gestas || '0'}\n`;

    // Paras
    report += `Paras: ${formData.antecedentesGO?.paras || '0'}\n`;

    // Abortos
    report += `Abortos: ${formData.antecedentesGO?.abortos || '0'}\n`;

    // Cesáreas
    report += `Cesáreas: ${formData.antecedentesGO?.cesareas || '0'}\n`;

    // Fecha de última menstruación
    report += `Fecha de última menstruación: ${formData.antecedentesGO?.fum || 'No especificada'}\n`;

    // Método anticonceptivo
    report += `Método anticonceptivo: ${formData.antecedentesGO?.metodoAnticonceptivo || 'No especificado'}\n`;

    return report;
  } catch (error) {
    console.error("Error generating antecedentes gineco-obstétricos report:", error);
    return "Error generando el reporte. Por favor, intente de nuevo.";
  }
};

export const generateInterrogatorioReport = async (formData) => {
  try {
    let report = "Interrogatorio por Sistemas:\n\n";

    // Sistema Respiratorio
    report += "Sistema Respiratorio:\n";
    report += `- Tos con expectoración: ${formData.interrogatorioSistemas?.tosExpectoracion || 'No especificado'}\n`;
    report += `- Disnea: ${formData.interrogatorioSistemas?.disnea || 'No especificado'}\n`;
    report += `- Sibilancias: ${formData.interrogatorioSistemas?.sibilancias === 'si' ? 'Sí' : 'No'}\n`;
    report += `- Dolor torácico: ${formData.interrogatorioSistemas?.dolorToracico === 'si' ? 'Sí' : 'No'}\n\n`;

    // Sistema Cardiovascular
    report += "Sistema Cardiovascular:\n";
    report += `- Palpitaciones: ${formData.interrogatorioSistemas?.palpitaciones === 'si' ? 'Sí' : 'No'}\n`;
    report += `- Edema: ${formData.interrogatorioSistemas?.edema === 'si' ? 'Sí' : 'No'}\n`;
    report += `- Síncope: ${formData.interrogatorioSistemas?.sincope === 'si' ? 'Sí' : 'No'}\n\n`;

    // Sistema Digestivo
    report += "Sistema Digestivo:\n";
    report += `- Náuseas: ${formData.interrogatorioSistemas?.nauseas === 'si' ? 'Sí' : 'No'}\n`;
    report += `- Vómitos: ${formData.interrogatorioSistemas?.vomitos === 'si' ? 'Sí' : 'No'}\n`;
    report += `- Diarrea: ${formData.interrogatorioSistemas?.diarrea === 'si' ? 'Sí' : 'No'}\n`;
    report += `- Estreñimiento: ${formData.interrogatorioSistemas?.estrenimiento === 'si' ? 'Sí' : 'No'}\n\n`;

    // Hábitos Alimenticios
    report += "Hábitos Alimenticios:\n";
    report += `- Hábitos: ${formData.interrogatorioSistemas?.habitosAlimenticios || 'No especificado'}\n\n`;

    // Sistema Urinario
    report += "Sistema Urinario:\n";
    report += `- Disuria: ${formData.interrogatorioSistemas?.disuria === 'si' ? 'Sí' : 'No'}\n`;
    report += `- Polaquiuria: ${formData.interrogatorioSistemas?.polaquiuria === 'si' ? 'Sí' : 'No'}\n`;
    report += `- Urgencia miccional: ${formData.interrogatorioSistemas?.urgenciaMiccional === 'si' ? 'Sí' : 'No'}\n`;
    report += `- Nicturia: ${formData.interrogatorioSistemas?.nicturia === 'si' ? 'Sí' : 'No'}\n\n`;

    // Sistema Músculo-esquelético
    report += "Sistema Músculo-esquelético:\n";
    report += `- Artralgias: ${formData.interrogatorioSistemas?.artralgias === 'si' ? 'Sí' : 'No'}\n`;
    report += `- Mialgias: ${formData.interrogatorioSistemas?.mialgias === 'si' ? 'Sí' : 'No'}\n`;
    report += `- Rigidez matutina: ${formData.interrogatorioSistemas?.rigidezMatutina || 'No especificado'}\n\n`;

    // Sistema Nervioso
    report += "Sistema Nervioso:\n";
    report += `- Cefalea: ${formData.interrogatorioSistemas?.cefalea === 'si' ? 'Sí' : 'No'}\n`;
    report += `- Mareos: ${formData.interrogatorioSistemas?.mareos === 'si' ? 'Sí' : 'No'}\n`;
    report += `- Parestesias: ${formData.interrogatorioSistemas?.parestesias === 'si' ? 'Sí' : 'No'}\n\n`;

    // Sistema Endocrino
    report += "Sistema Endocrino:\n";
    report += `- Polidipsia: ${formData.interrogatorioSistemas?.polidipsia === 'si' ? 'Sí' : 'No'}\n`;
    report += `- Poliuria: ${formData.interrogatorioSistemas?.poliuria === 'si' ? 'Sí' : 'No'}\n`;
    report += `- Polifagia: ${formData.interrogatorioSistemas?.polifagia === 'si' ? 'Sí' : 'No'}\n`;
    report += `- Cambios en el ritmo menstrual: ${formData.interrogatorioSistemas?.cambiosMenstruales || 'No especificado'}\n\n`;

    // Sistema Tegumentario
    report += "Sistema Tegumentario:\n";
    report += `- Cambios en piel: ${formData.interrogatorioSistemas?.cambiosPiel === 'si' ? 'Sí' : 'No'}\n`;
    report += `- Cambios en cabello: ${formData.interrogatorioSistemas?.cambiosCabello === 'si' ? 'Sí' : 'No'}\n`;
    report += `- Cambios en uñas: ${formData.interrogatorioSistemas?.cambiosUnas || 'No especificado'}\n\n`;

    // Otros
    report += "Otros:\n";
    report += `- Fiebre: ${formData.interrogatorioSistemas?.fiebre === 'si' ? 'Sí' : 'No'}\n`;
    report += `- Pérdida de peso: ${formData.interrogatorioSistemas?.perdidaPeso === 'si' ? 'Sí' : 'No'}\n`;

    return report;
  } catch (error) {
    console.error("Error generating interrogatorio por sistemas report:", error);
    return "Error generando el reporte. Por favor, intente de nuevo.";
  }
};

export const generateExploracionFisicaReport = async (formData) => {
  try {
    let report = "Exploración Física:\n\n";

    // Signos vitales
    report += "Signos Vitales:\n";
    report += `  Presión Arterial (TA): ${formData.exploracionFisica?.signosVitales?.ta || 'No especificada'}\n`;
    report += `  Frecuencia Cardíaca (FC): ${formData.exploracionFisica?.signosVitales?.fc || 'No especificada'}\n`;
    report += `  Frecuencia Respiratoria (FR): ${formData.exploracionFisica?.signosVitales?.fr || 'No especificada'}\n`;
    report += `  Temperatura: ${formData.exploracionFisica?.signosVitales?.temperatura || 'No especificada'}\n`;
    report += `  Peso: ${formData.exploracionFisica?.signosVitales?.peso || 'No especificado'} kg\n`;
    report += `  Talla: ${formData.exploracionFisica?.signosVitales?.talla || 'No especificada'} cm\n`;
    report += `  Índice de Masa Corporal (IMC): ${formData.exploracionFisica?.signosVitales?.imc || 'No especificado'}\n`;
    report += `  Pulso: ${formData.exploracionFisica?.signosVitales?.pulso || 'No especificado'}\n\n`;

    // Exploración general
    report += "Exploración General:\n";
    report += `  Cabeza: ${formData.exploracionFisica?.exploracion?.cabeza || 'No especificada'}\n`;
    report += `  Cuello: ${formData.exploracionFisica?.exploracion?.cuello || 'No especificada'}\n`;
    report += `  Tórax: ${formData.exploracionFisica?.exploracion?.torax || 'No especificada'}\n`;
    report += `  Abdomen: ${formData.exploracionFisica?.exploracion?.abdomen || 'No especificada'}\n`;
    report += `  Extremidades: ${formData.exploracionFisica?.exploracion?.extremidades || 'No especificada'}\n`;

    return report;
  } catch (error) {
    console.error("Error generating exploración física report:", error);
    return "Error generando el reporte. Por favor, intente de nuevo.";
  }
};

export const generateExamenCabezaReport = async (formData) => {
  try {
    let report = "Examen de Cabeza:\n\n";

    // General observations
    report += `Tipo de cráneo: ${formData.examenCabeza?.tipoCraneo || 'No especificado'}\n`;
    report += `Tipo de perfil: ${formData.examenCabeza?.tipoPerfil || 'No especificado'}\n`;
    report += `Tez: ${formData.examenCabeza?.tez || 'No especificado'}\n`;
    report += `Estado de la piel: ${formData.examenCabeza?.estadoPiel || 'No especificado'}\n`;

    // Add more details about lunares, cicatrices, asimetrias, etc.
    if (formData.examenCabeza?.lunares) {
      report += "\nLunares:\n";
      if (formData.examenCabeza.lunares.presente) {
        report += `Tamaño: ${formData.examenCabeza.lunares.tamanio || 'No especificado'}\n`;
        report += `Color: ${formData.examenCabeza.lunares.color || 'No especificado'}\n`;
        report += `Bordes: ${formData.examenCabeza.lunares.bordes || 'No especificado'}\n`;
        report += `Localización: ${formData.examenCabeza.lunares.localizacion || 'No especificado'}\n`;
      } else {
        report += "No se observan lunares.\n";
      }
    }

    if (formData.examenCabeza?.cicatrices) {
      report += "\nCicatrices:\n";
      if (formData.examenCabeza.cicatrices.presente) {
        report += `Tipo: ${formData.examenCabeza.cicatrices.tipo || 'No especificado'}\n`;
        report += `Antigüedad: ${formData.examenCabeza.cicatrices.antiguedad || 'No especificado'}\n`;
        report += `Coloración: ${formData.examenCabeza.cicatrices.coloracion || 'No especificado'}\n`;
        report += `Zona afectada: ${formData.examenCabeza.cicatrices.zonaAfectada || 'No especificado'}\n`;
      } else {
        report += "No se observan cicatrices.\n";
      }
    }

    if (formData.examenCabeza?.asimetriasFaciales) {
      report += "\nAsimetrías faciales:\n";
      if (formData.examenCabeza.asimetriasFaciales.presente) {
        report += `Lado: ${formData.examenCabeza.asimetriasFaciales.lado || 'No especificado'}\n`;
        report += `Origen: ${formData.examenCabeza.asimetriasFaciales.origen || 'No especificado'}\n`;
        report += `Zona afectada: ${formData.examenCabeza.asimetriasFaciales.zonaAfectada || 'No especificado'}\n`;
      } else {
        report += "No se observan asimetrías faciales.\n";
      }
    }

    if (formData.examenCabeza?.edema) {
      report += "\nEdema:\n";
      if (formData.examenCabeza.edema.presente) {
        report += `Consistencia: ${formData.examenCabeza.edema.consistencia || 'No especificado'}\n`;
        report += `Localización: ${formData.examenCabeza.edema.localizacion || 'No especificado'}\n`;
      } else {
        report += "No se observa edema.\n";
      }
    }

    if (formData.examenCabeza?.otrosHallazgos) {
      report += `\nOtros hallazgos: ${formData.examenCabeza.otrosHallazgos}\n`;
    }

    return report;
  } catch (error) {
    console.error("Error generating examen cabeza report:", error);
    return "Error generando el reporte. Por favor, intente de nuevo.";
  }
};

export const generateArticulacionCraneomandibularReport = async (formData) => {
  try {
    let report = "Articulación Craneomandibular (ATM):\n\n";

    // Ruidos
    if (formData.articulacionCraneomandibular?.ruidos) {
      report += "Ruidos:\n";
      if (formData.articulacionCraneomandibular.ruidos.presente) {
        report += `  Tipo: ${formData.articulacionCraneomandibular.ruidos.tipo || 'No especificado'}\n`;
        report += `  Lado: ${formData.articulacionCraneomandibular.ruidos.lado || 'No especificado'}\n`;
        report += `  Momento: ${formData.articulacionCraneomandibular.ruidos.momento || 'No especificado'}\n`;
      } else {
        report += "  No se detectan ruidos.\n";
      }
    }

    // Dolor
    if (formData.articulacionCraneomandibular?.dolor) {
      report += "\nDolor:\n";
      if (formData.articulacionCraneomandibular.dolor.presente) {
        report += `  Localización: ${formData.articulacionCraneomandibular.dolor.localizacion || 'No especificado'}\n`;
        report += `  Intensidad: ${formData.articulacionCraneomandibular.dolor.intensidad || 'No especificado'}\n`;
        report += `  Tipo: ${formData.articulacionCraneomandibular.dolor.tipo || 'No especificado'}\n`;
        report += `  Desencadenantes: ${formData.articulacionCraneomandibular.dolor.desencadenantes || 'No especificado'}\n`;
      } else {
        report += "  No se reporta dolor.\n";
      }
    }

    // Limitación de apertura
    if (formData.articulacionCraneomandibular?.limitacionApertura) {
      report += "\nLimitación de Apertura:\n";
      if (formData.articulacionCraneomandibular.limitacionApertura.presente) {
        report += `  Grado: ${formData.articulacionCraneomandibular.limitacionApertura.grado || 'No especificado'}\n`;
        report += `  Causa: ${formData.articulacionCraneomandibular.limitacionApertura.causa || 'No especificado'}\n`;
      } else {
        report += "  No se observa limitación de apertura.\n";
      }
    }

    // Desviación
    if (formData.articulacionCraneomandibular?.desviacion) {
      report += "\nDesviación:\n";
      if (formData.articulacionCraneomandibular.desviacion.presente) {
        report += `  Lado: ${formData.articulacionCraneomandibular.desviacion.lado || 'No especificado'}\n`;
        report += `  Grado: ${formData.articulacionCraneomandibular.desviacion.grado || 'No especificado'}\n`;
      } else {
        report += "  No se observa desviación.\n";
      }
    }

    // Otros hallazgos
    if (formData.articulacionCraneomandibular?.otrosHallazgos) {
      report += `\nOtros hallazgos: ${formData.articulacionCraneomandibular.otrosHallazgos}\n`;
    }

    return report;
  } catch (error) {
    console.error("Error generating articulación craneomandibular report:", error);
    return "Error generando el reporte. Por favor, intente de nuevo.";
  }
};

export const generateExamenCuelloReport = async (formData) => {
  try {
    let report = "Examen de Cuello:\n\n";

    // Ganglios linfáticos
    if (formData.examenCuello?.gangliosLinfaticos) {
      report += "Ganglios Linfáticos:\n";
      if (formData.examenCuello.gangliosLinfaticos.presente) {
        report += `  Tamaño: ${formData.examenCuello.gangliosLinfaticos.tamanio || 'No especificado'}\n`;
        report += `  Consistencia: ${formData.examenCuello.gangliosLinfaticos.consistencia || 'No especificado'}\n`;
        report += `  Sensibilidad: ${formData.examenCuello.gangliosLinfaticos.sensibilidad ? 'Sensible' : 'No sensible'}\n`;
        report += `  Movilidad: ${formData.examenCuello.gangliosLinfaticos.movilidad ? 'Móvil' : 'Fijo'}\n`;
        report += `  Localización: ${formData.examenCuello.gangliosLinfaticos.localizacion || 'No especificado'}\n`;
      } else {
        report += "  No se palpan ganglios linfáticos.\n";
      }
    }

    // Tiroides
    if (formData.examenCuello?.tiroides) {
      report += "\nTiroides:\n";
      if (formData.examenCuello.tiroides.presente) {
        report += `  Tamaño: ${formData.examenCuello.tiroides.tamanio || 'No especificado'}\n`;
        report += `  Consistencia: ${formData.examenCuello.tiroides.consistencia || 'No especificado'}\n`;
        report += `  Sensibilidad: ${formData.examenCuello.tiroides.sensibilidad ? 'Sensible' : 'No sensible'}\n`;
      } else {
        report += "  Tiroides no palpable.\n";
      }
    }

    // Movilidad
    report += `\nMovilidad: ${formData.examenCuello?.movilidad || 'No especificada'}\n`;

    // Dolor
    report += `Dolor: ${formData.examenCuello?.dolor ? 'Presente' : 'Ausente'}\n`;

    // Otros hallazgos
    if (formData.examenCuello?.otrosHallazgos) {
      report += `\nOtros hallazgos: ${formData.examenCuello.otrosHallazgos}\n`;
    }

    return report;
  } catch (error) {
    console.error("Error generating examen cuello report:", error);
    return "Error generando el reporte. Por favor, intente de nuevo.";
  }
};

export const generateExamenIntrabucalReport = async (formData) => {
  try {
    let report = "Examen Intrabucal:\n\n";

    // Labios
    report += "Labios:\n";
    report += `  Color: ${formData.examenIntrabucal?.labios?.color || 'No especificado'}\n`;
    report += `  Forma: ${formData.examenIntrabucal?.labios?.forma || 'No especificado'}\n`;
    report += `  Textura: ${formData.examenIntrabucal?.labios?.textura || 'No especificado'}\n`;
    report += `  Lesiones: ${formData.examenIntrabucal?.labios?.lesiones || 'No especificado'}\n\n`;

    // Mucosa yugal
    report += "Mucosa Yugal:\n";
    report += `  Color: ${formData.examenIntrabucal?.mucosaYugal?.color || 'No especificado'}\n`;
    report += `  Textura: ${formData.examenIntrabucal?.mucosaYugal?.textura || 'No especificado'}\n`;
    report += `  Lesiones: ${formData.examenIntrabucal?.mucosaYugal?.lesiones || 'No especificado'}\n\n`;

    // Encías
    report += "Encías:\n";
    report += `  Color: ${formData.examenIntrabucal?.encias?.color || 'No especificado'}\n`;
    report += `  Forma: ${formData.examenIntrabucal?.encias?.forma || 'No especificado'}\n`;
    report += `  Textura: ${formData.examenIntrabucal?.encias?.textura || 'No especificado'}\n`;
    report += `  Sangrado: ${formData.examenIntrabucal?.encias?.sangrado ? 'Presente' : 'Ausente'}\n\n`;

    // Paladar duro
    report += "Paladar Duro:\n";
    report += `  Color: ${formData.examenIntrabucal?.paladarDuro?.color || 'No especificado'}\n`;
    report += `  Forma: ${formData.examenIntrabucal?.paladarDuro?.forma || 'No especificado'}\n`;
    report += `  Lesiones: ${formData.examenIntrabucal?.paladarDuro?.lesiones || 'No especificado'}\n\n`;

    // Paladar blando
    report += "Paladar Blando:\n";
    report += `  Color: ${formData.examenIntrabucal?.paladarBlando?.color || 'No especificado'}\n`;
    report += `  Movilidad: ${formData.examenIntrabucal?.paladarBlando?.movilidad || 'No especificado'}\n`;
    report += `  Lesiones: ${formData.examenIntrabucal?.paladarBlando?.lesiones || 'No especificado'}\n\n`;

    // Lengua
    report += "Lengua:\n";
    report += `  Color: ${formData.examenIntrabucal?.lengua?.color || 'No especificado'}\n`;
    report += `  Papilas: ${formData.examenIntrabucal?.lengua?.papilas || 'No especificado'}\n`;
    report += `  Movilidad: ${formData.examenIntrabucal?.lengua?.movilidad || 'No especificado'}\n`;
    report += `  Lesiones: ${formData.examenIntrabucal?.lengua?.lesiones || 'No especificado'}\n\n`;

    // Piso de boca
    report += "Piso de Boca:\n";
    report += `  Color: ${formData.examenIntrabucal?.pisoBoca?.color || 'No especificado'}\n`;
    report += `  Lesiones: ${formData.examenIntrabucal?.pisoBoca?.lesiones || 'No especificado'}\n\n`;

    // Dientes
    report += "Dientes:\n";
    report += `  Número: ${formData.examenIntrabucal?.dientes?.numero || 'No especificado'}\n`;
    report += `  Higiene: ${formData.examenIntrabucal?.dientes?.higiene || 'No especificado'}\n`;
    report += `  Caries: ${formData.examenIntrabucal?.dientes?.caries ? 'Presente' : 'Ausente'}\n`;
    report += `  Restauraciones: ${formData.examenIntrabucal?.dientes?.restauraciones ? 'Presente' : 'Ausente'}\n\n`;

    return report;
  } catch (error) {
    console.error("Error generating examen intrabucal report:", error);
    return "Error generando el reporte. Por favor, intente de nuevo.";
  }
};

export const generateGlandulasSalivalesReport = async (formData) => {
  try {
    let report = "Glándulas Salivales:\n\n";

    // Glándula parótida
    report += "Glándula Parótida:\n";
    report += `  Tamaño: ${formData.glandulasSalivales?.parotida?.tamanio || 'No especificado'}\n`;
    report += `  Sensibilidad: ${formData.glandulasSalivales?.parotida?.sensibilidad ? 'Sensible' : 'No sensible'}\n`;
    report += `  Secreción: ${formData.glandulasSalivales?.parotida?.secrecion || 'No especificado'}\n`;

    // Glándula submaxilar
    report += "\nGlándula Submaxilar:\n";
    report += `  Tamaño: ${formData.glandulasSalivales?.submaxilar?.tamanio || 'No especificado'}\n`;
    report += `  Sensibilidad: ${formData.glandulasSalivales?.submaxilar?.sensibilidad ? 'Sensible' : 'No sensible'}\n`;
    report += `  Secreción: ${formData.glandulasSalivales?.submaxilar?.secrecion || 'No especificado'}\n`;

    // Glándula sublingual
    report += "\nGlándula Sublingual:\n";
    report += `  Tamaño: ${formData.glandulasSalivales?.sublingual?.tamanio || 'No especificado'}\n`;
    report += `  Sensibilidad: ${formData.glandulasSalivales?.sublingual?.sensibilidad ? 'Sensible' : 'No sensible'}\n`;
    report += `  Secreción: ${formData.glandulasSalivales?.sublingual?.secrecion || 'No especificado'}\n`;

    // Otros hallazgos
    if (formData.glandulasSalivales?.otrosHallazgos) {
      report += `\nOtros hallazgos: ${formData.glandulasSalivales.otrosHallazgos}\n`;
    }

    return report;
  } catch (error) {
    console.error("Error generating glándulas salivales report:", error);
    return "Error generando el reporte. Por favor, intente de nuevo.";
  }
};

export const generateOclusionReport = async (formData) => {
  try {
    let report = "Oclusión:\n\n";

    report += `Clasificación Angle: ${formData.oclusion?.clasificacionAngle || 'No especificado'}\n`;
    report += `Overjet: ${formData.oclusion?.overjet || 'No especificado'}\n`;
    report += `Overbite: ${formData.oclusion?.overbite || 'No especificado'}\n`;
    report += `Mordida Cruzada: ${formData.oclusion?.mordidaCruzada || 'No especificado'}\n`;
    report += `Mordida Abierta: ${formData.oclusion?.mordidaAbierta || 'No especificado'}\n`;

    if (formData.oclusion?.otrosHallazgos) {
      report += `\nOtros hallazgos: ${formData.oclusion.otrosHallazgos}\n`;
    }

    return report;
  } catch (error) {
    console.error("Error generating oclusión report:", error);
    return "Error generando el reporte. Por favor, intente de nuevo.";
  }
};

export const generateRelacionDientesReport = async (formData) => {
  try {
    let report = "Relación de Dientes:\n\n";

    report += `Relación Molar: ${formData.relacionDientes?.relacionMolar || 'No especificado'}\n`;
    report += `Relación Canina: ${formData.relacionDientes?.relacionCanina || 'No especificado'}\n`;
    report += `Apiñamiento: ${formData.relacionDientes?.apiñamiento || 'No especificado'}\n`;
    report += `Diastemas: ${formData.relacionDientes?.diastemas || 'No especificado'}\n`;

    if (formData.relacionDientes?.otrosHallazgos) {
      report += `\nOtros hallazgos: ${formData.relacionDientes.otrosHallazgos}\n`;
    }

    return report;
  } catch (error) {
    console.error("Error generating relación dientes report:", error);
    return "Error generando el reporte. Por favor, intente de nuevo.";
  }
};

export const generateLineaMediaReport = async (formData) => {
  try {
    let report = "Línea Media:\n\n";

    report += `Coincidente: ${formData.lineaMedia?.coincidente || 'No especificado'}\n`;
    report += `Desviación: ${formData.lineaMedia?.desviacion || 'No especificado'}\n`;

    if (formData.lineaMedia?.otrosHallazgos) {
      report += `\nOtros hallazgos: ${formData.lineaMedia.otrosHallazgos}\n`;
    }

    return report;
  } catch (error) {
    console.error("Error generating línea media report:", error);
    return "Error generando el reporte. Por favor, intente de nuevo.";
  }
};

export const generateFrenillosReport = async (formData) => {
  try {
    let report = "Frenillos:\n\n";

    report += `Labial Superior: ${formData.frenillos?.labialSuperior || 'No especificado'}\n`;
    report += `Labial Inferior: ${formData.frenillos?.labialInferior || 'No especificado'}\n`;
    report += `Lingual: ${formData.frenillos?.lingual || 'No especificado'}\n`;

    if (formData.frenillos?.otrosHallazgos) {
      report += `\nOtros hallazgos: ${formData.frenillos.otrosHallazgos}\n`;
    }

    return report;
  } catch (error) {
    console.error("Error generating frenillos report:", error);
    return "Error generando el reporte. Por favor, intente de nuevo.";
  }
};

export const generateDiagnosticoReport = async (formData) => {
  try {
    let report = "Diagnóstico:\n\n";

    report += `Principal: ${formData.diagnostico?.principal || 'No especificado'}\n`;
    report += `Secundarios: ${formData.diagnostico?.secundarios || 'No especificado'}\n`;

    if (formData.diagnostico?.otrosHallazgos) {
      report += `\nOtros hallazgos: ${formData.diagnostico.otrosHallazgos}\n`;
    }

    return report;
  } catch (error) {
    console.error("Error generating diagnóstico report:", error);
    return "Error generando el reporte. Por favor, intente de nuevo.";
  }
};

export const generatePronosticoReport = async (formData) => {
  try {
    let report = "Pronóstico:\n\n";

    report += `General: ${formData.pronostico?.general || 'No especificado'}\n`;
    report += `Particular: ${formData.pronostico?.particular || 'No especificado'}\n`;

    if (formData.pronostico?.otrosHallazgos) {
      report += `\nOtros hallazgos: ${formData.pronostico.otrosHallazgos}\n`;
    }

    return report;
  } catch (error) {
    console.error("Error generating pronóstico report:", error);
    return "Error generando el reporte. Por favor, intente de nuevo.";
  }
};

export const generateMedicalReport = async (formData) => {
  try {
    let report = "Historia Clínica Resumen:\n\n";

    // Añadir cada sección del reporte
    report += await generatePadecimientoActualReport(formData) + "\n";
    report += await generateAntecedentesHFReport(formData) + "\n";
    report += await generateAntecedentesPNPReport(formData) + "\n";
    report += await generateAntecedentesPPReport(formData) + "\n";
    report += await generateAntecedentesAlergicosReport(formData) + "\n";
    report += await generateAntecedentesQuirurgicosReport(formData) + "\n";
    report += await generateAntecedentesHemorragicosReport(formData) + "\n";
    
    // Incluir antecedentes gineco-obstétricos solo si es mujer
    if (formData.antecedentesGinecoObstetricos) {
      report += await generateAntecedentesGinecoObstetricosReport(formData) + "\n";
    }
    
    report += await generateInterrogatorioReport(formData) + "\n";
    report += await generateExploracionFisicaReport(formData) + "\n";
    report += await generateExamenCabezaReport(formData) + "\n";
    report += await generateArticulacionCraneomandibularReport(formData) + "\n";
    report += await generateExamenCuelloReport(formData) + "\n";
    report += await generateExamenIntrabucalReport(formData) + "\n";
    report += await generateGlandulasSalivalesReport(formData) + "\n";
    report += await generateOclusionReport(formData) + "\n";
    report += await generateRelacionDientesReport(formData) + "\n";
    report += await generateLineaMediaReport(formData) + "\n";
    report += await generateFrenillosReport(formData) + "\n";
    report += await generateDiagnosticoReport(formData) + "\n";
    report += await generatePronosticoReport(formData);

    return report;
  } catch (error) {
    console.error("Error generating complete medical report:", error);
    return "Error generando el reporte completo de historia clínica. Por favor, intente de nuevo.";
  }
};
