
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
    const { message } = await req.json()

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
          .slice(0, 3); // Limitar a 3 resultados máximo

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

    // Generate clean response with only definition and context, plus emojis
    let response = '';
    
    if (uniqueTerms.length > 0) {
      uniqueTerms.forEach((term, index) => {
        if (index > 0) response += '\n\n';
        
        response += `🦷 ${term.termino.toUpperCase()}\n\n`;
        response += `📖 Definición: ${term.definicion}\n`;
        
        if (term.contexto_uso) {
          response += `\n💡 Contexto: ${term.contexto_uso}`;
        }
      });
    } else {
      response = `❌ No se encontraron términos específicos en la base de datos dental.\n\n🔍 Intenta usar términos más específicos como:\n🦷 caries dental\n🩸 gingivitis\n🦴 periodontitis\n⚡ pulpitis`;
    }

    return new Response(
      JSON.stringify({ 
        response: response,
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
        response: '🚨 Error interno del servidor. No fue posible procesar tu consulta.',
        termsFound: 0,
        searchTerms: []
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
