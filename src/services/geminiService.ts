import { pipeline } from "@huggingface/transformers";
import { supabase } from "@/integrations/supabase/client";

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
  // Remover frases redundantes comunes y preestablecidas
  let cleanText = text
    // Eliminar redundancias en el motivo de consulta
    .replace(/motivo de consulta:\s*el paciente acude a consulta por\s*motivo de consulta/gi, 'Motivo de consulta:')
    .replace(/el paciente acude a consulta por el paciente acude/gi, 'El paciente acude')
    .replace(/acude a consulta por consulta/gi, 'acude a consulta por')
    .replace(/consulta médica por consulta/gi, 'consulta médica por')
    
    // Eliminar redundancias en descripciones
    .replace(/el paciente refiere que refiere/gi, 'El paciente refiere')
    .replace(/refiere que refiere/gi, 'refiere')
    .replace(/presenta dolor con dolor/gi, 'presenta dolor')
    .replace(/dolor doloroso/gi, 'dolor')
    .replace(/(\b\w+\b)(\s+\1\b)+/gi, '$1') // Elimina palabras consecutivas repetidas
    
    // Eliminar artículos duplicados
    .replace(/\b(el|la|los|las)\b\s+\b\1\b/gi, '$1')
    
    // Mejorar transiciones
    .replace(/dolor dolor/gi, 'dolor')
    .replace(/presenta presenta/gi, 'presenta')
    .replace(/refiere refiere/gi, 'refiere')
    .replace(/padece padece/gi, 'padece')
    .replace(/manifiesta manifiesta/gi, 'manifiesta')
    
    // Eliminar repeticiones en características del dolor
    .replace(/localizado en la zona de la zona/gi, 'localizado en la zona')
    .replace(/intensidad de intensidad/gi, 'intensidad')
    .replace(/frecuencia de frecuencia/gi, 'frecuencia')
    
    // Mejorar conectores
    .replace(/\. El paciente también refiere que también/gi, '. Además')
    .replace(/\. También además/gi, '. Además')
    .replace(/\. Y también/gi, '. Además')
    
    .trim();

  // Asegurar mayúsculas después de punto
  cleanText = cleanText.replace(/\. ([a-z])/g, (match, letter) => `. ${letter.toUpperCase()}`);

  return cleanText;
}

function processPadecimientoText(text: string): string {
  // Eliminar frases preestablecidas comunes en historias clínicas
  const phrasesToRemove = [
    "motivo de consulta:",
    "el paciente acude a",
    "el paciente refiere",
    "se observa que",
    "a la exploración",
    "a la palpación",
    "refiere que",
  ];

  let processedText = text.toLowerCase();
  phrasesToRemove.forEach(phrase => {
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
    const count = (processedText.match(regex) || []).length;
    if (count > 1) {
      // Mantener solo la primera ocurrencia
      processedText = processedText.replace(new RegExp(`\\b${phrase}\\b`, 'gi'), (match, index) => {
        return index === processedText.indexOf(phrase) ? match : '';
      });
    }
  });

  // Eliminar espacios múltiples y ajustar puntuación
  return processedText
    .replace(/\s+/g, ' ')
    .replace(/\s*([.,])\s*/g, '$1 ')
    .replace(/([.!?])\s*([a-záéíóúñ])/gi, (_, punct, letter) => `${punct} ${letter.toUpperCase()}`)
    .trim();
}

function formatText(text: string): string {
  // Agregar salto de línea después de dos puntos, excepto cuando hay una lista
  let formattedText = text.replace(/:\s*(?![\s-*])/g, ':\n');
  
  // Agregar salto de línea después del punto en el motivo de consulta
  formattedText = formattedText.replace(/(Motivo de consulta:[^\n]*\.)/g, '$1\n');
  
  // Asegurar que no haya múltiples saltos de línea consecutivos
  formattedText = formattedText.replace(/\n\s*\n/g, '\n');
  
  return formattedText;
}

export const generateMedicalReport = async (formData: any) => {
  try {
    // Procesar el texto del motivo de consulta antes de incluirlo en el prompt
    const motivoConsulta = processPadecimientoText(formData.padecimientoActual.motivoConsulta);

    const prompt = `Actúa como un profesional médico y genera una historia clínica detallada y profesional basada en la siguiente información, utilizando terminología médica apropiada y manteniendo un formato claro y estructurado. Solo incluye las secciones que tienen datos:

    Información del Paciente:
    ${formData.pacienteNombre ? `Nombre: ${formData.pacienteNombre}` : ''}
    ${formData.fechaCreacion ? `Fecha: ${formData.fechaCreacion}` : ''}

    Padecimiento Actual:
    ${formData.padecimientoActual.sinSintomas ? 'El paciente no refiere sintomatología actual.' : `
    ${motivoConsulta}
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

    const { data, error } = await supabase.functions.invoke('generate-with-gemini', {
      body: { prompt }
    });
    if (error || !data?.text) {
      throw new Error(error?.message || 'No se pudo generar el reporte con Gemini');
    }
    let text = data.text;

    // Procesamiento mejorado del texto:
    // 1. Primero limpiamos redundancias básicas
    text = removeRedundancies(text);
    
    // 2. Procesamos el texto para eliminar frases preestablecidas redundantes
    text = processPadecimientoText(text);
    
    // 3. Finalmente optimizamos con el modelo de Hugging Face
    text = await optimizeText(text);

    // 4. Aplicamos el formato de saltos de línea
    text = formatText(text);

    return text;
  } catch (error) {
    console.error('Error generating medical report:', error);
    throw new Error('No se pudo generar el reporte médico. Por favor, intente nuevamente.');
  }
};
