
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

// Validates Antecedentes Heredo Familiares section
export const validateAntecedentesHeredoFamiliares = (formData: FormDataState) => {
  const missingFields = [];
  const familiares = ['padre', 'madre', 'abuelos', 'hermanos', 'tios'];
  
  for (const familiar of familiares) {
    // Check if the familiar exists in the formData
    if (formData.antecedentesHeredoFamiliares && 
        formData.antecedentesHeredoFamiliares[familiar] && 
        formData.antecedentesHeredoFamiliares[familiar].condiciones) {
        
      const data = formData.antecedentesHeredoFamiliares[familiar];
      
      // Check if at least one condition is selected for each familiar
      const hasAnyCondition = Object.values(data.condiciones).some(value => value);
      
      if (!hasAnyCondition) {
        missingFields.push(`Condiciones de ${familiar}`);
      }
    } else {
      missingFields.push(`Información de ${familiar}`);
    }
  }

  return missingFields;
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
