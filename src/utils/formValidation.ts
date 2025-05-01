// formValidation.ts
import { FormDataState, RedaccionesInterrogatorio } from '@/types/historiaClinica'; // Asegúrate de importar RedaccionesInterrogatorio

// Validates Padecimiento Actual section
export const validatePadecimientoActual = (formData: FormDataState): string[] => {
    const missingFields: string[] = [];
    // Asegurarse que padecimientoActual existe antes de desestructurar
    const padecimientoActual = formData.padecimientoActual || {};
    const dolor = padecimientoActual.dolor || {}; // Asegurarse que dolor existe

    if (!padecimientoActual.motivoConsulta || padecimientoActual.motivoConsulta === "El paciente acude a consulta por ") {
        missingFields.push("Padecimiento Actual: Motivo de consulta");
    }

    // Solo validar campos de dolor si sinSintomas NO está marcado (o es undefined/false)
    if (!padecimientoActual.sinSintomas) {
        if (!dolor.fechaInicio) missingFields.push("Padecimiento Actual: Fecha de inicio del dolor");
        if (!dolor.condicionAparicion) missingFields.push("Padecimiento Actual: Condición de aparición del dolor");
        if (!dolor.frecuencia) missingFields.push("Padecimiento Actual: Frecuencia del dolor");
        if (!dolor.caracter) missingFields.push("Padecimiento Actual: Carácter del dolor");
        if (!dolor.intensidad) missingFields.push("Padecimiento Actual: Intensidad del dolor");
        // Asegurarse que localizacion existe antes de acceder a descripcion
        if (!dolor.localizacion?.descripcion) missingFields.push("Padecimiento Actual: Localización del dolor");
        if (!dolor.atenuacion) missingFields.push("Padecimiento Actual: Factores de atenuación del dolor");
    }

    return missingFields;
};

// Validates Antecedentes Heredo Familiares section - Modified to not require these fields
export const validateAntecedentesHeredoFamiliares = (formData: FormDataState): string[] => {
    // Return empty array to not require any validations for heredo familiares
    return [];
};

// Validates Antecedentes Personales No Patológicos section
export const validateAntecedentesPersonalesNoPatologicos = (formData: FormDataState): string[] => {
    const missingFields: string[] = [];
    // Asegurarse que antecedentesPersonalesNoPatologicos existe
    const apnp = formData.antecedentesPersonalesNoPatologicos || {};

    if (!apnp.tipoVivienda) {
        missingFields.push("APNP: Tipo de vivienda");
    }

    if (!apnp.servicios || apnp.servicios.length === 0) {
        missingFields.push("APNP: Servicios básicos");
    }

    if (!apnp.condicionCalle) {
        missingFields.push("APNP: Descripción de condición de calle");
    }

    if (!apnp.frecuenciaBano) {
        missingFields.push("APNP: Descripción de frecuencia de baño");
    }
     // Añadir validaciones para otros campos si son obligatorios
     if (!apnp.hacinamiento) missingFields.push("APNP: Hacinamiento");
     if (!apnp.tabaquismo?.activo === undefined) missingFields.push("APNP: Tabaquismo (activo/pasivo)"); // verificar si es booleano
     if (!apnp.alcoholismo?.consume === undefined) missingFields.push("APNP: Alcoholismo (consume)");
     if (!apnp.toxicomanias?.consume === undefined) missingFields.push("APNP: Toxicomanías (consume)");
     if (!apnp.alimentacion) missingFields.push("APNP: Alimentación");
     if (!apnp.horasSueno) missingFields.push("APNP: Horas de sueño");


    return missingFields;
};

// Validates Antecedentes Personales Patológicos section
export const validateAntecedentesPersonalesPatologicos = (formData: FormDataState): string[] => {
    const missingFields: string[] = [];
    // Asegurarse que antecedentesPersonalesPatologicos existe
    const app = formData.antecedentesPersonalesPatologicos || {};

    // Check that at least one condition is selected OR 'ninguno' is selected
    const categories: (keyof typeof app)[] = [
        'nutricionales', 'cardiacos', 'hepaticos', 'enfermedadesTransmisionSexual',
        'enfermedadesEruptivas', 'pulmonares', 'infecciosasParasitarias', 'otrosPadecimientos'
    ];

    let hasAnyCondition = false;

    // Verificar si se marcó 'Ninguno'
    if (app.ninguno) {
        hasAnyCondition = true; // Si 'ninguno' está marcado, se considera válido
    } else {
        // Si 'ninguno' no está marcado, verificar las otras categorías
        for (const category of categories) {
            const categoryData = app[category];
             // Verificar si categoryData es un objeto y si alguna de sus propiedades es true
            if (typeof categoryData === 'object' && categoryData !== null && Object.values(categoryData).some(value => value === true)) {
                 hasAnyCondition = true;
                 break; // Encontró al menos una condición, no necesita seguir buscando
            }
        }
    }


    if (!hasAnyCondition) {
        missingFields.push("APP: Seleccione al menos una condición o 'Ninguno'");
    }
     // Validar campos de transfusiones si se indicó que hubo
     if (app.transfusiones?.realizado) {
         if (!app.transfusiones.fecha) missingFields.push("APP: Fecha de transfusión");
         if (!app.transfusiones.motivo) missingFields.push("APP: Motivo de transfusión");
     }
      // Validar campos de alergias si se indicó que hay
     if (app.alergias?.presenta) {
         if (!app.alergias.descripcion) missingFields.push("APP: Descripción de alergias");
     }
       // Validar campos de cirugías si se indicó que hubo
     if (app.cirugias?.realizado) {
         if (!app.cirugias.descripcion) missingFields.push("APP: Descripción de cirugías");
     }
     // Validar hospitalizaciones si se indicó que hubo
    if (app.hospitalizaciones?.realizado) {
        if (!app.hospitalizaciones.descripcion) missingFields.push("APP: Descripción de hospitalizaciones");
    }
    // Validar medicamentos si se indicó que toma
    if (app.medicamentosActuales?.toma) {
        if (!app.medicamentosActuales.descripcion) missingFields.push("APP: Descripción de medicamentos actuales");
    }


    return missingFields;
};

// --- NUEVA VALIDACIÓN ---
// Validates Interrogatorio por Aparatos y Sistemas section
export const validateInterrogatorioSistemas = (formData: FormDataState): string[] => {
    const missingFields: string[] = [];
    const interrogatorio = formData.interrogatorioSistemas;

    // Si la sección completa es opcional, podrías descomentar esto:
    // if (!interrogatorio) {
    //   return []; // No hay nada que validar si la sección no se ha tocado
    // }

    // Si la sección es obligatoria (requiere que se generen las redacciones)
    if (!interrogatorio) {
        missingFields.push("Interrogatorio por Aparatos y Sistemas: Sección no completada");
        return missingFields; // No se puede validar más si no hay datos
    }

    const systemKeys: (keyof RedaccionesInterrogatorio)[] = [
        'digestivo',
        'respiratorio',
        'cardiovascular',
        'genitoUrinario',
        'endocrino',
        'tegumentario',
        'musculoEsqueletico',
        'nervioso'
    ];

    // Verifica que cada redacción esperada exista y no esté vacía
    for (const key of systemKeys) {
        // Trim() elimina espacios en blanco al inicio/final
        if (!interrogatorio[key] || interrogatorio[key].trim() === "") {
            // Formatea el nombre del sistema para el mensaje de error
            let displayName = key.charAt(0).toUpperCase() + key.slice(1);
            if (key === 'genitoUrinario') displayName = 'Genito-Urinario';
            if (key === 'musculoEsqueletico') displayName = 'Músculo-Esquelético';
            // Añade otros mapeos si es necesario para mejor legibilidad

            missingFields.push(`Interrogatorio Sistemas: Falta generar redacción para ${displayName}`);
        }
    }

    return missingFields;
};

// --- Ejemplo de cómo integrar en una validación general ---
/*
export const validateCompleteForm = (formData: FormDataState): string[] => {
  let allMissingFields: string[] = [];

  allMissingFields = allMissingFields.concat(validatePadecimientoActual(formData));
  allMissingFields = allMissingFields.concat(validateAntecedentesHeredoFamiliares(formData));
  allMissingFields = allMissingFields.concat(validateAntecedentesPersonalesNoPatologicos(formData));
  allMissingFields = allMissingFields.concat(validateAntecedentesPersonalesPatologicos(formData));
  allMissingFields = allMissingFields.concat(validateInterrogatorioSistemas(formData)); // <--- AÑADIDA AQUÍ
  // ... concatenar otras validaciones ...

  console.log("Campos faltantes:", allMissingFields);
  return allMissingFields;
}
*/