
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
    - Motivo de consulta: ${formData.padecimientoActual.motivoConsulta}
    - Historia del padecimiento: ${formData.padecimientoActual.historiaPadecimiento}
    - Características del dolor:
      * Inicio: ${formData.padecimientoActual.dolor.fechaInicio}
      * Tipo: ${formData.padecimientoActual.dolor.condicionAparicion}
      * Frecuencia: ${formData.padecimientoActual.dolor.frecuencia}
      * Carácter: ${formData.padecimientoActual.dolor.caracter}
      * Intensidad: ${formData.padecimientoActual.dolor.intensidad}
      * Localización: ${formData.padecimientoActual.dolor.localizacion.tipo} - ${formData.padecimientoActual.dolor.localizacion.descripcion}
      * Factores de atenuación: ${formData.padecimientoActual.dolor.atenuacion}`}

    Antecedentes Heredo Familiares:
    ${Object.entries(formData.antecedentesHeredoFamiliares).map(([familiar, data]: [string, any]) => `
    ${familiar.charAt(0).toUpperCase() + familiar.slice(1)}:
    - Finado: ${data.finado ? 'Sí' : 'No'}
    ${data.finado ? `- Causa de muerte: ${data.causaMuerte}` : ''}
    - Condiciones:
      ${Object.entries(data.condiciones)
        .filter(([condition, value]) => value && condition !== 'otras')
        .map(([condition]) => `* ${condition}`)
        .join('\n      ')}
      ${data.condiciones.otras ? `* Otras: ${data.condiciones.otras}` : ''}`).join('\n')}

    Signos Vitales:
    ${formData.peso ? `- Peso: ${formData.peso} kg` : ''}
    ${formData.talla ? `- Talla: ${formData.talla} m` : ''}
    ${formData.imc ? `- IMC: ${formData.imc}` : ''}
    ${formData.presionArterial ? `- Presión Arterial: ${formData.presionArterial} mmHg` : ''}
    ${formData.pulso ? `- Pulso: ${formData.pulso} lpm` : ''}
    ${formData.frecuenciaCardiaca ? `- Frecuencia Cardíaca: ${formData.frecuenciaCardiaca} lpm` : ''}
    ${formData.frecuenciaRespiratoria ? `- Frecuencia Respiratoria: ${formData.frecuenciaRespiratoria} rpm` : ''}
    ${formData.temperatura ? `- Temperatura: ${formData.temperatura} °C` : ''}

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
