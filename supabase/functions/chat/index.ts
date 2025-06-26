
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

    // Buscar en la base de datos local primero
    const localResponse = await searchLocalTerms(supabaseClient, message);
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

async function searchLocalTerms(supabaseClient: any, searchTerm: string): Promise<string | null> {
  try {
    console.log('Searching local database for:', searchTerm);
    
    // Limpiar el término de búsqueda
    const cleanSearchTerm = searchTerm.toLowerCase().trim();
    
    // 1. Buscar coincidencias exactas primero
    const { data: exactMatches, error: exactError } = await supabaseClient
      .from('dental_terms')
      .select('*')
      .or(`termino.ilike.%${cleanSearchTerm}%,sinonimos.cs.{${cleanSearchTerm}}`)
      .limit(3);

    if (exactError) {
      console.error('Error searching exact matches:', exactError);
    }

    // 2. Si no hay coincidencias exactas, buscar en definiciones
    let textMatches = [];
    if (!exactMatches || exactMatches.length === 0) {
      const { data: defMatches, error: defError } = await supabaseClient
        .from('dental_terms')
        .select('*')
        .textSearch('definicion', cleanSearchTerm, { type: 'websearch', config: 'spanish' })
        .limit(2);

      if (defError) {
        console.error('Error in definition search:', defError);
      } else {
        textMatches = defMatches || [];
      }
    }

    // 3. Combinar resultados
    const allMatches = [...(exactMatches || []), ...textMatches]
      .filter((term, index, self) => self.findIndex(t => t.id === term.id) === index)
      .slice(0, 3);

    console.log('Found dental terms:', allMatches);

    if (allMatches.length > 0) {
      let response = `Encontré información sobre "${searchTerm}" en mi base de datos odontológica:\n\n`;
      
      allMatches.forEach((term, index) => {
        response += `**${term.termino}**\n`;
        response += `${term.definicion}\n`;
        
        if (term.sinonimos && term.sinonimos.length > 0) {
          response += `*Sinónimos: ${term.sinonimos.join(', ')}*\n`;
        }
        
        if (term.contexto_uso) {
          response += `*Contexto: ${term.contexto_uso}*\n`;
        }
        
        response += `*Sección: ${term.seccion_formulario}*\n`;
        
        if (index < allMatches.length - 1) {
          response += '\n---\n\n';
        }
      });

      return response;
    }

    console.log('No matches found in database for:', searchTerm);
    return null;
  } catch (error) {
    console.error('Error searching local terms:', error);
    return null;
  }
}

function getFallbackResponse(message: string): string {
  const term = message.toLowerCase().trim();
  
  // Respuestas específicas para términos comunes que debe reconocer
  const commonTerms: { [key: string]: string } = {
    'padecimiento actual': 'El padecimiento actual se refiere al motivo principal de consulta del paciente, incluyendo la descripción detallada de los síntomas, su inicio, evolución y características. Es la razón por la cual el paciente busca atención odontológica.',
    'motivo de consulta': 'Es la razón principal por la cual el paciente busca atención odontológica, describiendo el síntoma o problema que lo llevó a la consulta. Es el punto de partida para el diagnóstico.',
    'dolor dental': 'Sensación molesta en las estructuras dentales causada por caries, inflamación pulpar, traumatismos o enfermedad periodontal. Puede ser agudo, sordo, pulsátil o irradiado.',
    'caries': 'Proceso infeccioso que destruye los tejidos duros del diente causado por bacterias acidogénicas. Se manifiesta como cavidades o manchas oscuras en el diente.',
    'gingivitis': 'Inflamación de las encías causada por acumulación de placa bacteriana. Se caracteriza por enrojecimiento, hinchazón y sangrado gingival.',
    'periodontitis': 'Enfermedad inflamatoria destructiva que afecta los tejidos de soporte del diente, incluyendo ligamento periodontal y hueso alveolar.',
    'bruxismo': 'Hábito involuntario de apretar o rechinar los dientes, especialmente durante el sueño, que puede causar desgaste dental y disfunción de ATM.',
    'maloclusión': 'Alteración en la posición y relación dental que afecta la oclusión normal. Puede clasificarse según Angle en Clase I, II o III.',
    'hola': 'Hola, soy DentaxyGPT, tu asistente especializado en odontología. Pregúntame sobre cualquier término dental y te ayudaré con una explicación clara y precisa.'
  };

  // Buscar coincidencias en términos comunes
  for (const [key, definition] of Object.entries(commonTerms)) {
    if (term.includes(key) || key.includes(term)) {
      return definition;
    }
  }

  return `Soy DentaxyGPT, especializado en términos dentales. Busco información sobre "${message}" en mi base de datos. Si no encuentro el término exacto, es posible que necesites ser más específico o que el término no esté aún en mi base de datos. ¿Podrías proporcionar más contexto o reformular tu consulta?`;
}
