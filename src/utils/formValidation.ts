
import { FormDataState } from '@/types/historiaClinica';

// Validates Padecimiento Actual section
export const validatePadecimientoActual = (formData: FormDataState) => {
  const missingFields = [];
  const { padecimientoActual } = formData;

  if (!padecimientoActual.motivoConsulta || padecimientoActual.motivoConsulta === "El paciente acude a consulta por ") {
    missingFields.push("Motivo de consulta");
  }

  if (!padecimientoActual.sinSintomas) {
    // Only check dolor fields if sinSintomas is false
    const { dolor } = padecimientoActual;
    if (!dolor.fechaInicio) missingFields.push("Fecha de inicio del dolor");
    if (!dolor.condicionAparicion) missingFields.push("Condición de aparición del dolor");
    if (!dolor.frecuencia) missingFields.push("Frecuencia del dolor");
    if (!dolor.caracter) missingFields.push("Carácter del dolor");
    if (!dolor.intensidad) missingFields.push("Intensidad del dolor");
    if (!dolor.localizacion.descripcion) missingFields.push("Localización del dolor");
    if (!dolor.atenuacion) missingFields.push("Factores de atenuación del dolor");
  }

  return missingFields;
};

// Validates Antecedentes Heredo Familiares section - Modified to not require these fields
export const validateAntecedentesHeredoFamiliares = (formData: FormDataState) => {
  // Return empty array to not require any validations for heredo familiares
  return [];
};

// Validates Antecedentes Personales No Patológicos section
export const validateAntecedentesPersonalesNoPatologicos = (formData: FormDataState) => {
  const missingFields = [];
  const { antecedentesPersonalesNoPatologicos } = formData;

  if (!antecedentesPersonalesNoPatologicos.tipoVivienda) {
    missingFields.push("Tipo de vivienda");
  }
  
  if (!antecedentesPersonalesNoPatologicos.servicios || antecedentesPersonalesNoPatologicos.servicios.length === 0) {
    missingFields.push("Servicios básicos");
  }
  
  if (!antecedentesPersonalesNoPatologicos.condicionCalle) {
    missingFields.push("Descripción de condición de calle");
  }
  
  if (!antecedentesPersonalesNoPatologicos.frecuenciaBano) {
    missingFields.push("Descripción de frecuencia de baño");
  }

  return missingFields;
};

// Validates Antecedentes Personales Patológicos section
export const validateAntecedentesPersonalesPatologicos = (formData: FormDataState) => {
  const missingFields = [];
  const { antecedentesPersonalesPatologicos } = formData;
  
  // Check that at least one condition is selected in any category
  const categories = [
    'nutricionales', 'cardiacos', 'hepaticos', 'enfermedadesTransmisionSexual', 
    'enfermedadesEruptivas', 'pulmonares', 'infecciosasParasitarias', 'otrosPadecimientos'
  ];
  
  let hasAnyCondition = false;
  
  for (const category of categories) {
    if (antecedentesPersonalesPatologicos && 
        antecedentesPersonalesPatologicos[category] &&
        typeof antecedentesPersonalesPatologicos[category] === 'object') {
        
      const categoryData = antecedentesPersonalesPatologicos[category];
      if (categoryData && Object.values(categoryData).some(value => value === true)) {
        hasAnyCondition = true;
        break;
      }
    }
  }
  
  if (!hasAnyCondition) {
    missingFields.push("Al menos una condición patológica");
  }

  return missingFields;
};
