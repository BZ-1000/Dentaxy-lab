
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

    // Buscar en la base de datos local primero con búsqueda específica
    const localResponse = await searchLocalTermsSpecific(supabaseClient, message);
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

async function searchLocalTermsSpecific(supabaseClient: any, searchTerm: string): Promise<string | null> {
  try {
    console.log('Searching specific database for:', searchTerm);
    
    // Limpiar y normalizar el término de búsqueda
    const cleanSearchTerm = searchTerm.toLowerCase()
      .trim()
      .replace(/[¿?¡!.,;]/g, '') // Remover signos de puntuación
      .replace(/\s+/g, ' '); // Normalizar espacios

    console.log('Clean search term:', cleanSearchTerm);

    // 1. Búsqueda exacta primero (más específica)
    const { data: exactMatches, error: exactError } = await supabaseClient
      .from('dental_terms')
      .select('*')
      .ilike('termino', cleanSearchTerm)
      .limit(1);

    if (exactError) {
      console.error('Error in exact search:', exactError);
    } else if (exactMatches && exactMatches.length > 0) {
      const term = exactMatches[0];
      let response = `**${term.termino}**: ${term.definicion}`;
      
      if (term.contexto_uso) {
        response += `\n\n*Contexto*: ${term.contexto_uso}`;
      }
      
      // Convertir ** a <strong> para negritas
      response = response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      return response;
    }

    // 2. Búsqueda por coincidencia parcial en término
    const { data: partialMatches, error: partialError } = await supabaseClient
      .from('dental_terms')
      .select('*')
      .ilike('termino', `%${cleanSearchTerm}%`)
      .limit(1);

    if (partialError) {
      console.error('Error in partial search:', partialError);
    } else if (partialMatches && partialMatches.length > 0) {
      const term = partialMatches[0];
      let response = `**${term.termino}**: ${term.definicion}`;
      
      if (term.contexto_uso) {
        response += `\n\n*Contexto*: ${term.contexto_uso}`;
      }
      
      // Convertir ** a <strong> para negritas
      response = response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      return response;
    }

    // 3. Búsqueda en sinónimos solo si no encuentra coincidencia directa
    const searchVariations = [
      cleanSearchTerm,
      cleanSearchTerm.replace(/s$/, ''), // Singular
      cleanSearchTerm + 's', // Plural
    ].filter(term => term.length > 2);

    for (const variation of searchVariations) {
      const { data: synonymMatches, error: synonymError } = await supabaseClient
        .from('dental_terms')
        .select('*')
        .filter('sinonimos', 'cs', `{${variation}}`)
        .limit(1);

      if (synonymError) {
        console.error('Error in synonym search:', synonymError);
      } else if (synonymMatches && synonymMatches.length > 0) {
        const term = synonymMatches[0];
        let response = `**${term.termino}**: ${term.definicion}`;
        
        if (term.contexto_uso) {
          response += `\n\n*Contexto*: ${term.contexto_uso}`;
        }
        
        // Convertir ** a <strong> para negritas
        response = response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        return response;
      }
    }

    // 4. Búsqueda por palabras clave individuales (última opción)
    const keywords = cleanSearchTerm.split(' ').filter(word => word.length > 3);
    
    for (const keyword of keywords) {
      const { data: keywordMatches, error: keywordError } = await supabaseClient
        .from('dental_terms')
        .select('*')
        .or(`termino.ilike.%${keyword}%,definicion.ilike.%${keyword}%`)
        .limit(1);

      if (keywordError) {
        console.error('Error in keyword search:', keywordError);
      } else if (keywordMatches && keywordMatches.length > 0) {
        const term = keywordMatches[0];
        let response = `**${term.termino}**: ${term.definicion}`;
        
        if (term.contexto_uso) {
          response += `\n\n*Contexto*: ${term.contexto_uso}`;
        }
        
        // Convertir ** a <strong> para negritas
        response = response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        return response;
      }
    }

    console.log('No specific matches found for:', searchTerm);
    return null;
  } catch (error) {
    console.error('Error in specific search:', error);
    return null;
  }
}

function getFallbackResponse(message: string): string {
  const term = message.toLowerCase().trim();
  
  // Respuestas específicas para términos comunes
  const commonTerms: { [key: string]: string } = {
    'padecimiento actual': '**Padecimiento Actual**: Descripción detallada del problema principal que motiva la consulta odontológica. Es el punto de partida para establecer un diagnóstico diferencial.',
    'motivo de consulta': '**Motivo de Consulta**: Razón principal por la cual el paciente busca atención odontológica, describiendo el síntoma o problema que lo llevó a la consulta.',
    'dolor dental': '**Dolor Dental**: Sensación molesta en las estructuras dentales causada por caries, inflamación pulpar, traumatismos o enfermedad periodontal.',
    'caries': '**Caries**: Proceso infeccioso que destruye los tejidos duros del diente causado por bacterias acidogénicas.',
    'gingivitis': '**Gingivitis**: Inflamación de las encías causada por acumulación de placa bacteriana. Se caracteriza por enrojecimiento, hinchazón y sangrado gingival.',
    'periodontitis': '**Periodontitis**: Enfermedad inflamatoria destructiva que afecta los tejidos de soporte del diente.',
    'bruxismo': '**Bruxismo**: Hábito involuntario de apretar o rechinar los dientes, especialmente durante el sueño.',
    'maloclusión': '**Maloclusión**: Alteración en la posición y relación dental que afecta la oclusión normal.',
    'hola': 'Hola, soy **DentaxyGPT**, tu asistente especializado en odontología. Pregúntame sobre cualquier término dental específico.'
  };

  // Buscar coincidencias flexibles en términos comunes
  for (const [key, definition] of Object.entries(commonTerms)) {
    if (term.includes(key) || key.includes(term) || 
        term.replace(/s$/, '') === key || key.replace(/s$/, '') === term) {
      // Convertir ** a <strong> para negritas
      return definition.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }
  }

  let response = `No encontré información específica sobre "${message}" en mi base de datos odontológica. Intenta con términos más específicos como **caries**, **gingivitis**, **dolor dental**, **bruxismo**, etc.`;
  
  // Convertir ** a <strong> para negritas
  return response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}
