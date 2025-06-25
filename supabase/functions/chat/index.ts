

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, systemPrompt } = await req.json();

    console.log('Received request:', { message, systemPrompt });

    // Inicializar cliente de Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Buscar en la base de datos local primero con búsqueda inteligente
    const localResponse = await searchLocalTermsIntelligent(supabaseClient, message);
    if (localResponse) {
      return new Response(JSON.stringify({ response: localResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Si no encuentra en la base local, usar fallback response
    const fallbackResponse = getFallbackResponse(message);
    return new Response(JSON.stringify({ response: fallbackResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat function:', error);
    const fallbackResponse = getFallbackResponse('error');
    return new Response(JSON.stringify({ 
      response: fallbackResponse
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function searchLocalTermsIntelligent(supabaseClient: any, searchTerm: string): Promise<string | null> {
  try {
    console.log('Searching intelligent database for:', searchTerm);
    
    // Limpiar y normalizar el término de búsqueda
    const cleanSearchTerm = searchTerm.toLowerCase()
      .trim()
      .replace(/[¿?¡!.,;]/g, '') // Remover signos de puntuación
      .replace(/\s+/g, ' '); // Normalizar espacios

    // Crear variaciones del término para búsqueda más flexible
    const searchVariations = [
      cleanSearchTerm,
      cleanSearchTerm.replace(/s$/, ''), // Singular
      cleanSearchTerm + 's', // Plural
      ...cleanSearchTerm.split(' ') // Palabras individuales
    ].filter(term => term.length > 2); // Solo términos de más de 2 caracteres

    console.log('Search variations:', searchVariations);

    let allMatches: any[] = [];

    // 1. Búsqueda exacta en término principal
    for (const variation of searchVariations) {
      const { data: exactMatches, error: exactError } = await supabaseClient
        .from('dental_terms')
        .select('*')
        .ilike('termino', `%${variation}%`)
        .limit(2);

      if (exactError) {
        console.error('Error in exact search:', exactError);
      } else if (exactMatches && exactMatches.length > 0) {
        allMatches.push(...exactMatches);
      }
    }

    // 2. Búsqueda en sinónimos usando ANY
    for (const variation of searchVariations) {
      const { data: synonymMatches, error: synonymError } = await supabaseClient
        .from('dental_terms')
        .select('*')
        .filter('sinonimos', 'cs', `{${variation}}`)
        .limit(2);

      if (synonymError) {
        console.error('Error in synonym search:', synonymError);
      } else if (synonymMatches && synonymMatches.length > 0) {
        allMatches.push(...synonymMatches);
      }
    }

    // 3. Búsqueda por coincidencia parcial en sinónimos
    for (const variation of searchVariations) {
      const { data: partialSynonymMatches, error: partialSynonymError } = await supabaseClient
        .from('dental_terms')
        .select('*')
        .textSearch('sinonimos', variation, { type: 'websearch', config: 'spanish' })
        .limit(1);

      if (partialSynonymError) {
        console.error('Error in partial synonym search:', partialSynonymError);
      } else if (partialSynonymMatches && partialSynonymMatches.length > 0) {
        allMatches.push(...partialSynonymMatches);
      }
    }

    // 4. Búsqueda en definición (solo si no hay resultados anteriores)
    if (allMatches.length === 0) {
      for (const variation of searchVariations) {
        const { data: defMatches, error: defError } = await supabaseClient
          .from('dental_terms')
          .select('*')
          .ilike('definicion', `%${variation}%`)
          .limit(1);

        if (defError) {
          console.error('Error in definition search:', defError);
        } else if (defMatches && defMatches.length > 0) {
          allMatches.push(...defMatches);
        }
      }
    }

    // 5. Búsqueda por sección del formulario si se menciona
    const sectionKeywords = {
      'padecimiento': 'padecimiento_actual',
      'dolor': 'dolor',
      'antecedentes': 'antecedentes_familiares',
      'información': 'informacion_principal',
      'datos': 'informacion_principal',
      'hábitos': 'habitos',
      'estética': 'estetica',
      'función': 'funcion'
    };

    for (const [keyword, section] of Object.entries(sectionKeywords)) {
      if (cleanSearchTerm.includes(keyword)) {
        const { data: sectionMatches, error: sectionError } = await supabaseClient
          .from('dental_terms')
          .select('*')
          .eq('seccion_formulario', section)
          .limit(3);

        if (sectionError) {
          console.error('Error in section search:', sectionError);
        } else if (sectionMatches && sectionMatches.length > 0) {
          allMatches.push(...sectionMatches);
        }
      }
    }

    // Eliminar duplicados y limitar resultados
    const uniqueMatches = allMatches
      .filter((term, index, self) => self.findIndex(t => t.id === term.id) === index)
      .slice(0, 3);

    console.log('Found intelligent matches:', uniqueMatches);

    if (uniqueMatches.length > 0) {
      let response = `Encontré información sobre "${searchTerm}" en mi base de datos odontológica:\n\n`;
      
      uniqueMatches.forEach((term, index) => {
        response += `**${term.termino}**\n`;
        response += `${term.definicion}\n`;
        
        if (term.sinonimos && term.sinonimos.length > 0) {
          response += `*Sinónimos: ${term.sinonimos.join(', ')}*\n`;
        }
        
        if (term.contexto_uso) {
          response += `*Contexto: ${term.contexto_uso}*\n`;
        }
        
        response += `*Categoría: ${term.categoria}*\n`;
        
        if (index < uniqueMatches.length - 1) {
          response += '\n---\n\n';
        }
      });

      // Convertir ** a <strong> para negritas
      response = response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      return response;
    }

    console.log('No intelligent matches found for:', searchTerm);
    return null;
  } catch (error) {
    console.error('Error in intelligent search:', error);
    return null;
  }
}

function getFallbackResponse(message: string): string {
  const term = message.toLowerCase().trim();
  
  // Respuestas específicas para términos comunes
  const commonTerms: { [key: string]: string } = {
    'padecimiento actual': 'El **padecimiento actual** se refiere al motivo principal de consulta del paciente, incluyendo la descripción detallada de los síntomas, su inicio, evolución y características. Es la razón por la cual el paciente busca atención odontológica.',
    'motivo de consulta': 'Es la razón principal por la cual el paciente busca atención odontológica, describiendo el síntoma o problema que lo llevó a la consulta. Es el punto de partida para el diagnóstico.',
    'dolor dental': '**Dolor dental** es una sensación molesta en las estructuras dentales causada por caries, inflamación pulpar, traumatismos o enfermedad periodontal. Puede ser agudo, sordo, pulsátil o irradiado.',
    'caries': '**Caries** es un proceso infeccioso que destruye los tejidos duros del diente causado por bacterias acidogénicas. Se manifiesta como cavidades o manchas oscuras en el diente.',
    'gingivitis': '**Gingivitis** es la inflamación de las encías causada por acumulación de placa bacteriana. Se caracteriza por enrojecimiento, hinchazón y sangrado gingival.',
    'periodontitis': '**Periodontitis** es una enfermedad inflamatoria destructiva que afecta los tejidos de soporte del diente, incluyendo ligamento periodontal y hueso alveolar.',
    'bruxismo': '**Bruxismo** es el hábito involuntario de apretar o rechinar los dientes, especialmente durante el sueño, que puede causar desgaste dental y disfunción de ATM.',
    'maloclusión': '**Maloclusión** es una alteración en la posición y relación dental que afecta la oclusión normal. Puede clasificarse según Angle en Clase I, II o III.',
    'hola': 'Hola, soy **DentaxyGPT**, tu asistente especializado en odontología. Pregúntame sobre cualquier término dental y te ayudaré con una explicación clara y precisa.'
  };

  // Buscar coincidencias flexibles en términos comunes
  for (const [key, definition] of Object.entries(commonTerms)) {
    if (term.includes(key) || key.includes(term) || 
        term.replace(/s$/, '') === key || key.replace(/s$/, '') === term) {
      // Convertir ** a <strong> para negritas
      return definition.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }
  }

  let response = `Busco información sobre "${message}" en mi base de datos odontológica especializada. Aunque no encontré una coincidencia exacta, puedes intentar con términos más específicos o sinónimos. Mi base de datos contiene información sobre **dolor dental**, **estética**, **función masticatoria**, **antecedentes médicos** y más. ¿Podrías ser más específico sobre qué aspecto te interesa?`;
  
  // Convertir ** a <strong> para negritas
  return response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}
