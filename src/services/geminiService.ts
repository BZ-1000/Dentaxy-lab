import { GoogleGenerativeAI } from "@google/generative-ai";

const GOOGLE_AI_API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;

const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);

export const generateMedicalReport = async (formData: any) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Actúa como un profesional médico y genera una historia clínica detallada y profesional basada en la siguiente información, utilizando terminología médica apropiada y manteniendo un formato claro y estructurado. Solo incluye las secciones que tienen datos:

    Información del Paciente:
    ${formData.pacienteNombre ? `Nombre: ${formData.pacienteNombre}` : ''}
    ${formData.fechaCreacion ? `Fecha: ${formData.fechaCreacion}` : ''}

    Padecimiento Actual:
    ${formData.padecimientoActual.sinSintomas ? 'El paciente no refiere sintomatología actual.' : `
    - Fecha de aparición: ${formData.padecimientoActual.fechaAparicion}
    - Evolución: ${formData.padecimientoActual.evolucion}
    - Estado Actual: ${formData.padecimientoActual.estadoActual}
    - Características del dolor:
      * Inicio: ${formData.padecimientoActual.dolor.fechaInicio}
      * Tipo: ${formData.padecimientoActual.dolor.condicionAparicion}
      * Frecuencia: ${formData.padecimientoActual.dolor.frecuencia}
      * Carácter: ${formData.padecimientoActual.dolor.caracter}
      * Localización: ${formData.padecimientoActual.dolor.localizacion.tipo} - ${formData.padecimientoActual.dolor.localizacion.descripcion}
      * Factores de atenuación: ${formData.padecimientoActual.dolor.atenuacion}`}

    Signos Vitales:
    ${formData.peso ? `- Peso: ${formData.peso} kg` : ''}
    ${formData.talla ? `- Talla: ${formData.talla} m` : ''}
    ${formData.presionArterial ? `- Presión Arterial: ${formData.presionArterial} mmHg` : ''}

    Diagnóstico:
    ${formData.diagnosticos || 'No se ha establecido diagnóstico.'}

    Pronóstico:
    ${formData.pronosticos || 'No se ha establecido pronóstico.'}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating medical report:', error);
    throw new Error('No se pudo generar el reporte médico. Por favor, intente nuevamente.');
  }
};