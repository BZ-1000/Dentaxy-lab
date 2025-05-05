export const generateMedicalReport = async (formData) => {
  try {
    let report = "Historia Clínica Resumen:\n\n";

    // Padecimiento Actual
    report += "Padecimiento Actual:\n";
    if (formData.padecimientoActual.sinSintomas) {
      report += "El paciente se presenta sin síntomas.\n";
    } else {
      report += `Motivo de Consulta: ${formData.padecimientoActual.motivoConsulta}\n`;
      report += `Historia del Padecimiento: ${formData.padecimientoActual.historiaPadecimiento}\n`;
      report += `Dolor: ${JSON.stringify(formData.padecimientoActual.dolor)}\n`;
    }
    report += "\n";

    // Antecedentes HeredoFamiliares
    report += "Antecedentes HeredoFamiliares:\n";
    report += `Padre: ${JSON.stringify(formData.antecedentesHeredoFamiliares.padre)}\n`;
    report += `Madre: ${JSON.stringify(formData.antecedentesHeredoFamiliares.madre)}\n`;
    report += `Abuelo Paterno: ${JSON.stringify(formData.antecedentesHeredoFamiliares.abueloPaterno)}\n`;
    report += `Abuela Paterna: ${JSON.stringify(formData.antecedentesHeredoFamiliares.abuelaPaterna)}\n`;
    report += `Abuelo Materno: ${JSON.stringify(formData.antecedentesHeredoFamiliares.abueloMaterno)}\n`;
    report += `Abuela Materna: ${JSON.stringify(formData.antecedentesHeredoFamiliares.abuelaMaterna)}\n`;
    report += "\n";

    // Antecedentes Personales No Patológicos
    report += "Antecedentes Personales No Patológicos:\n";
    report += `Tipo de Vivienda: ${formData.antecedentesPersonalesNoPatologicos.tipoVivienda}\n`;
    report += `Material de Vivienda: ${formData.antecedentesPersonalesNoPatologicos.materialVivienda}\n`;
    report += `Servicios: ${formData.antecedentesPersonalesNoPatologicos.servicios.join(', ')}\n`;
    report += `Condición de la Calle: ${formData.antecedentesPersonalesNoPatologicos.condicionCalle}\n`;
    report += `Iluminación de la Calle: ${formData.antecedentesPersonalesNoPatologicos.iluminacionCalle}\n`;
    report += `Frecuencia de Limpieza: ${formData.antecedentesPersonalesNoPatologicos.frecuenciaLimpieza}\n`;
    report += `Cambio de Ropa de Cama: ${formData.antecedentesPersonalesNoPatologicos.cambioRopaCama}\n`;
    report += `Hacinamiento: ${formData.antecedentesPersonalesNoPatologicos.hacinamiento}\n`;
    report += `Promiscuidad: ${formData.antecedentesPersonalesNoPatologicos.promiscuidad}\n`;
    report += `Mascotas: ${formData.antecedentesPersonalesNoPatologicos.mascotas}\n`;
    report += `Manejo de Residuos: ${formData.antecedentesPersonalesNoPatologicos.manejoResiduos}\n`;
    report += `Frecuencia de Baño: ${formData.antecedentesPersonalesNoPatologicos.frecuenciaBano}\n`;
    report += `Lavado de Manos: ${formData.antecedentesPersonalesNoPatologicos.lavadoManos.join(', ')}\n`;
    report += `Cambio de Ropa: ${formData.antecedentesPersonalesNoPatologicos.cambioRopa}\n`;
    report += `Frecuencia de Cepillado: ${formData.antecedentesPersonalesNoPatologicos.frecuenciaCepillado}\n`;
    report += `Técnica de Cepillado: ${formData.antecedentesPersonalesNoPatologicos.tecnicaCepillado}\n`;
    report += `Auxiliares Bucales: ${formData.antecedentesPersonalesNoPatologicos.auxiliaresBucales.join(', ')}\n`;
    report += `Última Visita al Odontólogo: ${formData.antecedentesPersonalesNoPatologicos.ultimaVisitaOdontologo}\n`;
    report += `Problemas Bucales: ${formData.antecedentesPersonalesNoPatologicos.problemasBucales.join(', ')}\n`;
    report += `Alimentos Consumidos: ${formData.antecedentesPersonalesNoPatologicos.alimentosConsumidos.join(', ')}\n`;
    report += `Frecuencia de Frutas y Verduras: ${formData.antecedentesPersonalesNoPatologicos.frecuenciaFrutasVerduras}\n`;
    report += `Frecuencia de Bebidas Azucaradas: ${formData.antecedentesPersonalesNoPatologicos.frecuenciaBebidasAzucaradas}\n`;
    report += `Frecuencia de Comida Chatarra: ${formData.antecedentesPersonalesNoPatologicos.frecuenciaComidaChatarra}\n`;
    report += `Consumo de Agua: ${formData.antecedentesPersonalesNoPatologicos.consumoAgua}\n`;
    report += `Número de Comidas: ${formData.antecedentesPersonalesNoPatologicos.numeroComidas}\n`;
    report += `Horario de Comidas: ${JSON.stringify(formData.antecedentesPersonalesNoPatologicos.horarioComidas)}\n`;
    report += `Ayuno Prolongado: ${formData.antecedentesPersonalesNoPatologicos.ayunoProlongado}\n`;
    report += "\n";

    // Antecedentes Personales Patológicos
    report += "Antecedentes Personales Patológicos:\n";
    report += `Sin Patología: ${formData.antecedentesPersonalesPatologicos.sinPatologia ? 'Sí' : 'No'}\n`;
    report += `Nutricionales: ${JSON.stringify(formData.antecedentesPersonalesPatologicos.nutricionales)}\n`;
    report += `Cardiacos: ${JSON.stringify(formData.antecedentesPersonalesPatologicos.cardiacos)}\n`;
    report += `Hepáticos: ${JSON.stringify(formData.antecedentesPersonalesPatologicos.hepaticos)}\n`;
    report += `Enfermedades de Transmisión Sexual: ${JSON.stringify(formData.antecedentesPersonalesPatologicos.enfermedadesTransmisionSexual)}\n`;
    report += `Enfermedades Eruptivas: ${JSON.stringify(formData.antecedentesPersonalesPatologicos.enfermedadesEruptivas)}\n`;
    report += `Pulmonares: ${JSON.stringify(formData.antecedentesPersonalesPatologicos.pulmonares)}\n`;
    report += `Infecciosas/Parasitarias: ${JSON.stringify(formData.antecedentesPersonalesPatologicos.infecciosasParasitarias)}\n`;
    report += `Otros Padecimientos: ${JSON.stringify(formData.antecedentesPersonalesPatologicos.otrosPadecimientos)}\n`;
    report += "\n";

    // Antecedentes Alérgicos
    report += "Antecedentes Alérgicos:\n";
    report += `Medicamentos: ${JSON.stringify(formData.antecedentesAlergicos.medicamentos)}\n`;
    report += `Alimentos: ${JSON.stringify(formData.antecedentesAlergicos.alimentos)}\n`;
    report += `Látex: ${JSON.stringify(formData.antecedentesAlergicos.latex)}\n`;
    report += `Tipos de Alergias: ${JSON.stringify(formData.antecedentesAlergicos.tiposAlergias)}\n`;
    report += `¿Cuáles Alergias?: ${formData.antecedentesAlergicos.cualesAlergias}\n`;
    report += `Especificación de Alergias: ${formData.antecedentesAlergicos.especificacionAlergias}\n`;
    report += `¿Administrado Anestesia?: ${formData.antecedentesAlergicos.administradoAnestesia}\n`;
    report += `Tipo de Anestesia: ${formData.antecedentesAlergicos.tipoAnestesia}\n`;
    report += `Reacción a Anestesia: ${formData.antecedentesAlergicos.reaccionAnestesia}\n`;
    report += `Descripción de Reacción: ${formData.antecedentesAlergicos.descripcionReaccion}\n`;
    report += `Adicciones: ${JSON.stringify(formData.antecedentesAlergicos.adicciones)}\n`;
    report += `Detalles de Adicciones: ${formData.antecedentesAlergicos.detallesAdicciones}\n`;
    report += "\n";

    // Antecedentes Quirúrgicos
    report += "Antecedentes Quirúrgicos:\n";
    report += `Sin Quirúrgicos: ${formData.antecedentesQuirurgicos.sinQuirurgicos ? 'Sí' : 'No'}\n`;
    report += `Cirugías Realizadas: ${JSON.stringify(formData.antecedentesQuirurgicos.cirugiasRealizadas)}\n`;
    report += `Hospitalizaciones Previas: ${formData.antecedentesQuirurgicos.hospitalizacionesPrevias}\n`;
    report += `Complicaciones Anestésicas: ${formData.antecedentesQuirurgicos.complicacionesAnestesicas}\n`;
    report += `¿Tratamiento Reciente?: ${formData.antecedentesQuirurgicos.tratamientoReciente}\n`;
    report += `Motivo del Tratamiento: ${formData.antecedentesQuirurgicos.motivoTratamiento}\n`;
    report += `¿Hospitalización Reciente?: ${formData.antecedentesQuirurgicos.hospitalizacionReciente}\n`;
    report += `Motivo de Hospitalización: ${formData.antecedentesQuirurgicos.motivoHospitalizacion}\n`;
    report += `¿Toma Medicamentos?: ${formData.antecedentesQuirurgicos.tomaMedicamentos}\n`;
    report += `¿Cuáles Medicamentos?: ${formData.antecedentesQuirurgicos.cualesMedicamentos}\n`;
    report += `Motivo de Medicamentos: ${formData.antecedentesQuirurgicos.motivoMedicamentos}\n`;
    report += "\n";

    // Antecedentes Hemorrágicos
    report += "Antecedentes Hemorrágicos:\n";
    report += `Sin Hemorrágicos: ${formData.antecedentesHemorragicos.sinHemorragicos ? 'Sí' : 'No'}\n`;
    report += `Sangrado Prolongado: ${formData.antecedentesHemorragicos.sangradoProlongado}\n`;
    report += `Hematomas: ${formData.antecedentesHemorragicos.hematomas}\n`;
    report += `Hemorragias Espontáneas: ${formData.antecedentesHemorragicos.hemorragiasEspontaneas}\n`;
    report += `Transfusiones: ${formData.antecedentesHemorragicos.transfusiones}\n`;
    report += `Detalles Adicionales: ${formData.antecedentesHemorragicos.detallesAdicionales}\n`;
    report += `¿Transfusión Previa?: ${formData.antecedentesHemorragicos.transfusionPrevia}\n`;
    report += `Motivo de Transfusión: ${formData.antecedentesHemorragicos.motivoTransfusion}\n`;
    report += `Fecha de Transfusión: ${formData.antecedentesHemorragicos.fechaTransfusion}\n`;
    report += "\n";

    // Antecedentes Gineco-Obstétricos (opcional)
    if (formData.antecedentesGinecoObstetricos) {
      report += "Antecedentes Gineco-Obstétricos:\n";
      report += `Embarazos: ${formData.antecedentesGinecoObstetricos.embarazos}\n`;
      report += `Partos: ${formData.antecedentesGinecoObstetricos.partos}\n`;
      report += `Cesáreas: ${formData.antecedentesGinecoObstetricos.cesareas}\n`;
      report += `Abortos: ${formData.antecedentesGinecoObstetricos.abortos}\n`;
      report += `Complicaciones: ${formData.antecedentesGinecoObstetricos.complicaciones}\n`;
      report += "\n";
    }

    // Interrogatorio por Sistemas
    report += "Interrogatorio por Sistemas:\n";
    report += `Cardiovascular: ${formData.interrogatorioSistemas.cardiovascular}\n`;
    report += `Respiratorio: ${formData.interrogatorioSistemas.respiratorio}\n`;
    report += `Digestivo: ${formData.interrogatorioSistemas.digestivo}\n`;
    report += `Urinario: ${formData.interrogatorioSistemas.urinario}\n`;
    report += `Músculo-Esquelético: ${formData.interrogatorioSistemas.musculoEsqueletico}\n`;
    report += `Nervioso: ${formData.interrogatorioSistemas.nervioso}\n`;
    report += `Endocrino: ${formData.interrogatorioSistemas.endocrino}\n`;
    report += `Tegumentario: ${formData.interrogatorioSistemas.tegumentario}\n`;
    report += "\n";

    // Exploración Física
    report += "Exploración Física:\n";
    report += `Signos Vitales: ${JSON.stringify(formData.exploracionFisica.signosVitales)}\n`;
    report += `Exploración: ${JSON.stringify(formData.exploracionFisica.exploracion)}\n`;
    report += "\n";

    // Examen de Cabeza
    report += "Examen de Cabeza:\n";
    report += `Tipo de Cráneo: ${formData.examenCabeza.tipoCraneo}\n`;
    report += `Tipo de Perfil: ${formData.examenCabeza.tipoPerfil}\n`;
    report += `Tez: ${formData.examenCabeza.tez}\n`;
    report += `Estado de la Piel: ${formData.examenCabeza.estadoPiel}\n`;
    report += `Lunares: ${JSON.stringify(formData.examenCabeza.lunares)}\n`;
    report += `Cicatrices: ${JSON.stringify(formData.examenCabeza.cicatrices)}\n`;
    report += `Asimetrías Faciales: ${JSON.stringify(formData.examenCabeza.asimetriasFaciales)}\n`;
    report += `Edema: ${JSON.stringify(formData.examenCabeza.edema)}\n`;
    report += `Otros Hallazgos: ${formData.examenCabeza.otrosHallazgos}\n`;
    report += "\n";

    // Articulación Craneomandibular
    report += "Articulación Craneomandibular:\n";
    report += `Apertura Bucal: ${formData.articulacionCraneomandibular.aperturaBucal}\n`;
    report += `Movimiento Lateral: ${formData.articulacionCraneomandibular.movimientoLateral}\n`;
    report += `Chasquidos: ${formData.articulacionCraneomandibular.chasquidos}\n`;
    report += `Crepitación: ${formData.articulacionCraneomandibular.crepitacion}\n`;
    report += `Dolor: ${formData.articulacionCraneomandibular.dolor}\n`;
    report += `Observaciones: ${formData.articulacionCraneomandibular.observaciones}\n`;
    report += "\n";

    // Examen de Cuello
    report += "Examen de Cuello:\n";
    report += `Ganglios Linfáticos: ${formData.examenCuello.gangliosLinfaticos}\n`;
    report += `Musculatura: ${formData.examenCuello.musculatura}\n`;
    report += `Tiroides: ${formData.examenCuello.tiroides}\n`;
    report += `Movilidad: ${formData.examenCuello.movilidad}\n`;
    report += `Observaciones: ${formData.examenCuello.observaciones}\n`;
    report += "\n";

    // Examen Intrabucal
    report += "Examen Intrabucal:\n";
    report += `Lengua: ${formData.examenIntrabucal.lengua}\n`;
    report += `Paladar Duro: ${formData.examenIntrabucal.paladarDuro}\n`;
    report += `Paladar Blando: ${formData.examenIntrabucal.paladarBlando}\n`;
    report += `Mucosa Yugal: ${formData.examenIntrabucal.mucosaYugal}\n`;
    report += `Piso de Boca: ${formData.examenIntrabucal.pisoBoca}\n`;
    report += `Encías: ${formData.examenIntrabucal.encias}\n`;
    report += `Dientes: ${formData.examenIntrabucal.dientes}\n`;
    report += `Observaciones: ${formData.examenIntrabucal.observaciones}\n`;
    report += "\n";

    // Glándulas Salivales
    report += "Glándulas Salivales:\n";
    report += `Parótida: ${formData.glandulasSalivales.parotida}\n`;
    report += `Submaxilar: ${formData.glandulasSalivales.submaxilar}\n`;
    report += `Sublingual: ${formData.glandulasSalivales.sublingual}\n`;
    report += `Secreción: ${formData.glandulasSalivales.secrecion}\n`;
    report += `Observaciones: ${formData.glandulasSalivales.observaciones}\n`;
    report += "\n";

    // Oclusión
    report += "Oclusión:\n";
    report += `Clasificación Angle: ${formData.oclusion.clasificacionAngle}\n`;
    report += `Overjet: ${formData.oclusion.overjet}\n`;
    report += `Overbite: ${formData.oclusion.overbite}\n`;
    report += `Mordida Cruzada: ${formData.oclusion.mordidaCruzada}\n`;
    report += `Mordida Abierta: ${formData.oclusion.mordidaAbierta}\n`;
    report += `Observaciones: ${formData.oclusion.observaciones}\n`;
    report += "\n";

    // Relación de Dientes
    report += "Relación de Dientes:\n";
    report += `Relación Molar: ${formData.relacionDientes.relacionMolar}\n`;
    report += `Relación Canina: ${formData.relacionDientes.relacionCanina}\n`;
    report += `Apiñamiento: ${formData.relacionDientes.apiñamiento}\n`;
    report += `Diastemas: ${formData.relacionDientes.diastemas}\n`;
    report += `Observaciones: ${formData.relacionDientes.observaciones}\n`;
    report += "\n";

    // Línea Media
    report += "Línea Media:\n";
    report += `Coincidente: ${formData.lineaMedia.coincidente}\n`;
    report += `Desviación: ${formData.lineaMedia.desviacion}\n`;
    report += `Observaciones: ${formData.lineaMedia.observaciones}\n`;
    report += "\n";

    // Frenillos
    report += "Frenillos:\n";
    report += `Labial Superior: ${formData.frenillos.labialSuperior}\n`;
    report += `Labial Inferior: ${formData.frenillos.labialInferior}\n`;
    report += `Lingual: ${formData.frenillos.lingual}\n`;
    report += `Observaciones: ${formData.frenillos.observaciones}\n`;
    report += "\n";

    // Diagnóstico
    report += "Diagnóstico:\n";
    report += `Principal: ${formData.diagnostico.principal}\n`;
    report += `Secundarios: ${formData.diagnostico.secundarios}\n`;
    report += `Observaciones: ${formData.diagnostico.observaciones}\n`;
    report += "\n";

    // Pronóstico
    report += "Pronóstico:\n";
    report += `General: ${formData.pronostico.general}\n`;
    report += `Particular: ${formData.pronostico.particular}\n`;
    report += `Observaciones: ${formData.pronostico.observaciones}\n`;
    report += "\n";

    return report;
  } catch (error) {
    console.error("Error generating medical report:", error);
    return "Error generando el reporte. Por favor, intente de nuevo.";
  }
};

export const generateInterrogatorioReport = async (formData) => {
  try {
    // Create mapping for specific values
    const habitosAlimenticiosText = formData.interrogatorioSistemas.habitosAlimenticios === "ninguno" 
      ? "Sin habitos alimenticios relevantes, se interrogo especificamente por: ingesta nocturna, picoteo frecuente, ayuno prolongado." 
      : `Refiere ${formData.interrogatorioSistemas.habitosAlimenticios}.`;

    const tosExpectoracionText = formData.interrogatorioSistemas.tosExpectoracion === "no presenta"
      ? "No presenta tos con expectoración."
      : `Presenta tos con expectoración ${formData.interrogatorioSistemas.tosExpectoracion}.`;
    
    const cambiosMenstrualesText = formData.interrogatorioSistemas.cambiosMenstruales === "sin cambios"
      ? "Sin cambios en el ritmo menstrual."
      : `Refiere ${formData.interrogatorioSistemas.cambiosMenstruales} en el ritmo menstrual.`;
    
    const cambiosUnasText = formData.interrogatorioSistemas.cambiosUnas === "sin cambios"
      ? "Sin cambios en las uñas."
      : `Presenta uñas ${formData.interrogatorioSistemas.cambiosUnas}.`;
    
    const rigidezMatutinaText = formData.interrogatorioSistemas.rigidezMatutina === "no presenta"
      ? "No presenta rigidez matutina."
      : `Presenta rigidez matutina con duración de ${formData.interrogatorioSistemas.rigidezMatutina}.`;

    // Generate basic report based on form data
    let report = "Interrogatorio por sistemas:\n\n";
    
    // Sistema Respiratorio
    report += "Sistema Respiratorio: ";
    const respiratorioItems = [];
    
    if (formData.interrogatorioSistemas.tosExpectoracion) {
      respiratorioItems.push(tosExpectoracionText);
    }
    if (formData.interrogatorioSistemas.disnea) {
      respiratorioItems.push(`Disnea ${formData.interrogatorioSistemas.disnea}.`);
    }
    if (formData.interrogatorioSistemas.sibilancias) {
      respiratorioItems.push(`Sibilancias: ${formData.interrogatorioSistemas.sibilancias}.`);
    }
    if (formData.interrogatorioSistemas.dolorToracico) {
      respiratorioItems.push(`Dolor torácico: ${formData.interrogatorioSistemas.dolorToracico}.`);
    }
    
    report += respiratorioItems.length > 0 ? respiratorioItems.join(" ") : "Sin hallazgos relevantes.";
    report += "\n\n";
    
    // Sistema Cardiovascular
    report += "Sistema Cardiovascular: ";
    const cardiovascularItems = [];
    
    if (formData.interrogatorioSistemas.dolorPrecordial) {
      cardiovascularItems.push(`Dolor precordial: ${formData.interrogatorioSistemas.dolorPrecordial}.`);
    }
    if (formData.interrogatorioSistemas.palpitaciones) {
      cardiovascularItems.push(`Palpitaciones: ${formData.interrogatorioSistemas.palpitaciones}.`);
    }
    if (formData.interrogatorioSistemas.edemaMiembrosInferiores) {
      cardiovascularItems.push(`Edema en miembros inferiores: ${formData.interrogatorioSistemas.edemaMiembrosInferiores}.`);
    }
    if (formData.interrogatorioSistemas.disneaEsfuerzos) {
      cardiovascularItems.push(`Disnea a esfuerzos: ${formData.interrogatorioSistemas.disneaEsfuerzos}.`);
    }
    
    report += cardiovascularItems.length > 0 ? cardiovascularItems.join(" ") : "Sin hallazgos relevantes.";
    report += "\n\n";
    
    // Sistema Endocrino
    report += "Sistema Endocrino: ";
    const endocrinoItems = [];
    
    if (formData.interrogatorioSistemas.cambiosMenstruales) {
      endocrinoItems.push(cambiosMenstrualesText);
    }
    if (formData.interrogatorioSistemas.intoleranciaCalorFrio) {
      endocrinoItems.push(`Intolerancia al calor/frío: ${formData.interrogatorioSistemas.intoleranciaCalorFrio}.`);
    }
    if (formData.interrogatorioSistemas.sedExcesiva) {
      endocrinoItems.push(`Sed excesiva: ${formData.interrogatorioSistemas.sedExcesiva}.`);
    }
    if (formData.interrogatorioSistemas.aumentoOrina) {
      endocrinoItems.push(`Aumento en la frecuencia de orina: ${formData.interrogatorioSistemas.aumentoOrina}.`);
    }
    
    report += endocrinoItems.length > 0 ? endocrinoItems.join(" ") : "Sin hallazgos relevantes.";
    report += "\n\n";
    
    // Sistema Tegumentario
    report += "Sistema Tegumentario: ";
    const tegumentarioItems = [];
    
    if (formData.interrogatorioSistemas.cambiosCabello) {
      tegumentarioItems.push(`Cambios en cabello: ${formData.interrogatorioSistemas.cambiosCabello}.`);
    }
    if (formData.interrogatorioSistemas.cambiosUnas) {
      tegumentarioItems.push(cambiosUnasText);
    }
    if (formData.interrogatorioSistemas.prurito) {
      tegumentarioItems.push(`Prurito: ${formData.interrogatorioSistemas.prurito}.`);
    }
    if (formData.interrogatorioSistemas.lesionesPiel) {
      tegumentarioItems.push(`Lesiones en la piel: ${formData.interrogatorioSistemas.lesionesPiel}.`);
    }
    
    report += tegumentarioItems.length > 0 ? tegumentarioItems.join(" ") : "Sin hallazgos relevantes.";
    report += "\n\n";
    
    // Sistema Músculo-esquelético
    report += "Sistema Músculo-esquelético: ";
    const musculoesqueleticoItems = [];
    
    if (formData.interrogatorioSistemas.rigidezMatutina) {
      musculoesqueleticoItems.push(rigidezMatutinaText);
    }
    if (formData.interrogatorioSistemas.dolorArticular) {
      musculoesqueleticoItems.push(`Dolor articular: ${formData.interrogatorioSistemas.dolorArticular}.`);
    }
    if (formData.interrogatorioSistemas.limitacionMovimiento) {
      musculoesqueleticoItems.push(`Limitación del movimiento: ${formData.interrogatorioSistemas.limitacionMovimiento}.`);
    }
    if (formData.interrogatorioSistemas.debilidadMuscular) {
      musculoesqueleticoItems.push(`Debilidad muscular: ${formData.interrogatorioSistemas.debilidadMuscular}.`);
    }
    
    report += musculoesqueleticoItems.length > 0 ? musculoesqueleticoItems.join(" ") : "Sin hallazgos relevantes.";
    report += "\n\n";
    
    // Sistema Nervioso
    report += "Sistema Nervioso: ";
    const nerviosoItems = [];
    
    if (formData.interrogatorioSistemas.cefalea) {
      nerviosoItems.push(`Cefalea: ${formData.interrogatorioSistemas.cefalea}.`);
    }
    if (formData.interrogatorioSistemas.mareos) {
      nerviosoItems.push(`Mareos: ${formData.interrogatorioSistemas.mareos}.`);
    }
    if (formData.interrogatorioSistemas.perdidaFuerza) {
      nerviosoItems.push(`Pérdida de fuerza: ${formData.interrogatorioSistemas.perdidaFuerza}.`);
    }
    if (formData.interrogatorioSistemas.alteracionesSensibilidad) {
      nerviosoItems.push(`Alteraciones en la sensibilidad: ${formData.interrogatorioSistemas.alteracionesSensibilidad}.`);
    }
    
    report += nerviosoItems.length > 0 ? nerviosoItems.join(" ") : "Sin hallazgos relevantes.";
    report += "\n\n";
    
    // Sistema Digestivo
    report += "Sistema Digestivo: ";
    const digestivoItems = [];
    
    if (formData.interrogatorioSistemas.nauseas) {
      digestivoItems.push(`Nauseas: ${formData.interrogatorioSistemas.nauseas}.`);
    }
    if (formData.interrogatorioSistemas.vomito) {
      digestivoItems.push(`Vómito: ${formData.interrogatorioSistemas.vomito}.`);
    }
    if (formData.interrogatorioSistemas.dolorAbdominal) {
      digestivoItems.push(`Dolor abdominal: ${formData.interrogatorioSistemas.dolorAbdominal}.`);
    }
    if (formData.interrogatorioSistemas.cambiosHabitoIntestinal) {
      digestivoItems.push(`Cambios en el hábito intestinal: ${formData.interrogatorioSistemas.cambiosHabitoIntestinal}.`);
    }
    
    report += digestivoItems.length > 0 ? digestivoItems.join(" ") : "Sin hallazgos relevantes.";
    report += "\n\n";
    
    // Sistema Urinario
    report += "Sistema Urinario: ";
    const urinarioItems = [];
    
    if (formData.interrogatorioSistemas.disuria) {
      urinarioItems.push(`Disuria: ${formData.interrogatorioSistemas.disuria}.`);
    }
    if (formData.interrogatorioSistemas.polaquiuria) {
      urinarioItems.push(`Polaquiuria: ${formData.interrogatorioSistemas.polaquiuria}.`);
    }
    if (formData.interrogatorioSistemas.urgenciaUrinaria) {
      urinarioItems.push(`Urgencia urinaria: ${formData.interrogatorioSistemas.urgenciaUrinaria}.`);
    }
    if (formData.interrogatorioSistemas.hematuria) {
      urinarioItems.push(`Hematuria: ${formData.interrogatorioSistemas.hematuria}.`);
    }
    
    report += urinarioItems.length > 0 ? urinarioItems.join(" ") : "Sin hallazgos relevantes.";
    report += "\n\n";
    
    // Hábitos alimenticios
    if (formData.interrogatorioSistemas.habitosAlimenticios) {
      report += `Hábitos alimenticios: ${habitosAlimenticiosText}\n\n`;
    }
    
    return report;
  } catch (error) {
    console.error("Error generating interrogatorio report:", error);
    return "Error generando el reporte. Por favor, intente de nuevo.";
  }
}

export const generateExploracionFisicaReport = async (formData) => {
  try {
    let report = "Exploración Física:\n\n";

    // Signos Vitales
    report += "Signos Vitales:\n";
    report += `TA: ${formData.exploracionFisica?.signosVitales?.ta || 'No especificado'}\n`;
    report += `FC: ${formData.exploracionFisica?.signosVitales?.fc || 'No especificado'}\n`;
    report += `FR: ${formData.exploracionFisica?.signosVitales?.fr || 'No especificado'}\n`;
    report += `Temperatura: ${formData.exploracionFisica?.signosVitales?.temperatura || 'No especificado'}\n`;
    report += `Peso: ${formData.exploracionFisica?.signosVitales?.peso || 'No especificado'}\n`;
    report += `Talla: ${formData.exploracionFisica?.signosVitales?.talla || 'No especificado'}\n`;
    report += `IMC: ${formData.exploracionFisica?.signosVitales?.imc || 'No especificado'}\n`;
    report += `Pulso: ${formData.exploracionFisica?.signosVitales?.pulso || 'No especificado'}\n`;
    report += "\n";

    // Exploración General
    report += "Exploración General:\n";
    report += `Cabeza: ${formData.exploracionFisica?.exploracion?.cabeza || 'No especificado'}\n`;
    report += `Cuello: ${formData.exploracionFisica?.exploracion?.cuello || 'No especificado'}\n`;
    report += `Tórax: ${formData.exploracionFisica?.exploracion?.torax || 'No especificado'}\n`;
    report += `Abdomen: ${formData.exploracionFisica?.exploracion?.abdomen || 'No especificado'}\n`;
    report += `Extremidades: ${formData.exploracionFisica?.exploracion?.extremidades || 'No especificado'}\n`;
    report += "\n";

    return report;
  } catch (error) {
    console.error("Error generating exploracion fisica report:", error);
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

    //
