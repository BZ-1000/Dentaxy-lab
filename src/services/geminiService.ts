import { GoogleGenerativeAI } from "@google/generative-ai";
import { pipeline } from "@huggingface/transformers";

const GOOGLE_AI_API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);

interface TextGenerationResult {
  generated_text: string;
}

async function optimizeText(text: string): Promise<string> {
  try {
    const textGenerator = await pipeline(
      'text2text-generation',
      'google/flan-t5-small'
    );

    const result = await textGenerator(
      `Rewrite this medical text in a professional way, removing redundancies: ${text}`, 
      { max_length: 500 }
    ) as TextGenerationResult[];

    return result[0]?.generated_text || text;
  } catch (error) {
    console.error('Error optimizing text:', error);
    return text;
  }
}

function removeRedundancies(text: string): string {
  // Remover frases redundantes comunes
  let cleanText = text
    .replace(/motivo de consulta:\s*el paciente acude a consulta por\s*motivo de consulta/gi, 'Motivo de consulta:')
    .replace(/el paciente acude a consulta por el paciente acude/gi, 'El paciente acude')
    .replace(/el paciente refiere que refiere/gi, 'El paciente refiere')
    .replace(/presenta dolor con dolor/gi, 'presenta dolor')
    .replace(/(\b\w+\b)(\s+\1\b)+/gi, '$1') // Elimina palabras consecutivas repetidas
    .replace(/\b(el|la|los|las)\b\s+\b\1\b/gi, '$1') // Elimina artículos repetidos
    .trim();

  // Mejorar las transiciones entre secciones
  cleanText = cleanText
    .replace(/dolor dolor/gi, 'dolor')
    .replace(/presenta presenta/gi, 'presenta')
    .replace(/refiere refiere/gi, 'refiere')
    .replace(/padece padece/gi, 'padece');

  return cleanText;
}

export const generateMedicalReport = async (formData: any) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Actúa como un profesional médico y genera una historia clínica detallada y profesional basada en la siguiente información, utilizando terminología médica apropiada y manteniendo un formato claro y estructurado. Solo incluye las secciones que tienen datos:

    Información del Paciente:
    ${formData.pacienteNombre ? `Nombre: ${formData.pacienteNombre}` : ''}
    ${formData.fechaCreacion ? `Fecha: ${formData.fechaCreacion}` : ''}

    Padecimiento Actual:
    ${formData.padecimientoActual.sinSintomas ? 'El paciente no refiere sintomatología actual.' : `
    ${formData.padecimientoActual.motivoConsulta}
    ${formData.padecimientoActual.historiaPadecimiento}
    Características del dolor:
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
    let text = response.text();

    // Primero limpiamos redundancias básicas
    text = removeRedundancies(text);

    // Luego optimizamos el texto con el modelo de Hugging Face
    text = await optimizeText(text);

    return text;
  } catch (error) {
    console.error('Error generating medical report:', error);
    throw new Error('No se pudo generar el reporte médico. Por favor, intente nuevamente.');
  }
};
