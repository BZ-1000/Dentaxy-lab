
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DentalTerm {
  id: string;
  termino: string;
  definicion: string;
  categoria: string;
  subcategoria?: string;
  sinonimos?: string[];
  contexto_uso?: string;
  seccion_formulario: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, systemPrompt } = await req.json()

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Enhanced local search function
    const searchLocalTerms = async (searchText: string): Promise<DentalTerm[]> => {
      try {
        // Search exact matches
        const { data: exactMatches, error: exactError } = await supabase
          .from('dental_terms')
          .select('*')
          .ilike('termino', `%${searchText.toLowerCase()}%`)
          .limit(3);

        if (exactError) {
          console.error('Error searching exact matches:', exactError);
        }

        // Search synonyms
        const { data: synonymMatches, error: synonymError } = await supabase
          .from('dental_terms')
          .select('*')
          .contains('sinonimos', [searchText.toLowerCase()])
          .limit(2);

        if (synonymError) {
          console.error('Error searching synonyms:', synonymError);
        }

        // Search in definitions using full-text search
        const { data: textMatches, error: textError } = await supabase
          .from('dental_terms')
          .select('*')
          .textSearch('definicion', searchText, { type: 'websearch', config: 'spanish' })
          .limit(2);

        if (textError) {
          console.error('Error in text search:', textError);
        }

        // Combine and deduplicate results
        const allMatches = [...(exactMatches || []), ...(synonymMatches || []), ...(textMatches || [])]
          .filter((term, index, self) => self.findIndex(t => t.id === term.id) === index)
          .slice(0, 5);

        return allMatches;
      } catch (error) {
        console.error('Error searching local terms:', error);
        return [];
      }
    };

    // Extract search terms from the message
    const extractTermsFromMessage = (msg: string): string[] => {
      // Remove common words and extract potential dental terms
      const commonWords = ['el', 'la', 'los', 'las', 'de', 'del', 'en', 'con', 'por', 'para', 'que', 'es', 'un', 'una', 'y', 'o'];
      const words = msg.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2 && !commonWords.includes(word));
      
      return [...new Set(words)]; // Remove duplicates
    };

    // Search for relevant terms in our database
    const searchTerms = extractTermsFromMessage(message);
    let allFoundTerms: DentalTerm[] = [];

    for (const term of searchTerms) {
      const foundTerms = await searchLocalTerms(term);
      allFoundTerms = [...allFoundTerms, ...foundTerms];
    }

    // Remove duplicates
    const uniqueTerms = allFoundTerms.filter((term, index, self) => 
      self.findIndex(t => t.id === term.id) === index
    );

    // Build enhanced context
    let enhancedContext = '';
    if (uniqueTerms.length > 0) {
      enhancedContext = `TÉRMINOS RELEVANTES DE LA BASE DE DATOS DENTAL:\n\n`;
      uniqueTerms.forEach(term => {
        enhancedContext += `📚 **${term.termino}**: ${term.definicion}\n`;
        enhancedContext += `   Categoría: ${term.categoria}${term.subcategoria ? ` - ${term.subcategoria}` : ''}\n`;
        enhancedContext += `   Sección del formulario: ${term.seccion_formulario}\n`;
        if (term.sinonimos && term.sinonimos.length > 0) {
          enhancedContext += `   Sinónimos: ${term.sinonimos.join(', ')}\n`;
        }
        if (term.contexto_uso) {
          enhancedContext += `   Contexto de uso: ${term.contexto_uso}\n`;
        }
        enhancedContext += `\n`;
      });
      enhancedContext += `---\n\n`;
    }

    // Get Gemini API key
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not found')
    }

    // Enhanced system prompt with database integration
    const enhancedSystemPrompt = `${systemPrompt}

INSTRUCCIONES ESPECÍFICAS PARA USO DE BASE DE DATOS:
- Los términos encontrados arriba son de tu base de conocimientos especializada
- SIEMPRE prioriza la información de tu base de datos sobre conocimiento general
- Si encuentras términos exactos, úsalos como autoridad principal
- Estructura tu respuesta usando el formato especificado
- Menciona la sección del formulario donde se aplica cada término
- Incluye sinónimos cuando sea relevante

FORMATO DE RESPUESTA REQUERIDO:
📚 **[Término principal]**: [Definición técnica basada en tu base de datos]
🔍 **Contexto clínico**: [Cuándo y cómo se usa en la práctica]
📋 **Sección del formulario**: [Dónde se aplica en la historia clínica]
🔗 **Términos relacionados**: [Sinónimos o conceptos relacionados]

Si no encuentras el término en tu base de datos, proporciona conocimiento general pero indica que no está en tu base especializada.`;

    // Prepare the enhanced message
    const enhancedMessage = `${enhancedContext}CONSULTA DEL USUARIO: ${message}`;

    console.log('Enhanced message:', enhancedMessage);
    console.log('Found terms:', uniqueTerms.length);

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${enhancedSystemPrompt}\n\nUsuario: ${enhancedMessage}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error:', errorText)
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Gemini response:', data)
    
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Lo siento, no pude generar una respuesta.'

    return new Response(
      JSON.stringify({ 
        response: generatedText,
        termsFound: uniqueTerms.length,
        searchTerms: searchTerms
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in chat function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Error interno del servidor',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
