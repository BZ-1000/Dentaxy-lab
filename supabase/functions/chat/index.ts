
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://dentaxy.com', // Restrict to specific domain
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Credentials': 'true'
}

// Rate limiting - simple in-memory store (for production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute

function checkRateLimit(clientIP: string): boolean {
  const now = Date.now();
  const key = clientIP;
  const current = rateLimitStore.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  current.count++;
  return true;
}

function validateInput(message: string, systemPrompt: string): { isValid: boolean; error?: string } {
  // Validate message
  if (!message || typeof message !== 'string') {
    return { isValid: false, error: 'Message is required and must be a string' };
  }
  
  if (message.trim().length < 2) {
    return { isValid: false, error: 'Message too short' };
  }
  
  if (message.length > 500) {
    return { isValid: false, error: 'Message too long' };
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
    /onload=/gi,
    /onerror=/gi,
    /onclick=/gi
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(message)) {
      return { isValid: false, error: 'Message contains prohibited content' };
    }
  }
  
  // Validate system prompt if provided
  if (systemPrompt && typeof systemPrompt !== 'string') {
    return { isValid: false, error: 'System prompt must be a string' };
  }
  
  return { isValid: true };
}

function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
    .substring(0, 500); // Ensure length limit
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('cf-connecting-ip') || 
                     req.headers.get('x-forwarded-for') || 
                     'unknown';
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(JSON.stringify({ 
        response: 'Demasiadas consultas. Por favor, espera un momento antes de intentar de nuevo.' 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const requestData = await req.json();
    const { message, systemPrompt } = requestData;

    // Validate input
    const validation = validateInput(message, systemPrompt);
    if (!validation.isValid) {
      console.error('Input validation failed:', validation.error);
      return new Response(JSON.stringify({ 
        response: 'Solicitud inválida. Por favor, verifica tu consulta.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sanitize inputs
    const sanitizedMessage = sanitizeString(message);
    
    console.log('Received valid request:', { 
      message: sanitizedMessage.substring(0, 50) + '...', 
      clientIP: clientIP.substring(0, 10) + '...' 
    });

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Search local database first
    const localResponse = await searchLocalTermsSpecific(supabaseClient, sanitizedMessage);
    if (localResponse) {
      return new Response(JSON.stringify({ response: localResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fallback response
    const fallbackResponse = getFallbackResponse(sanitizedMessage);
    return new Response(JSON.stringify({ response: fallbackResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat function:', error);
    const fallbackResponse = getFallbackResponse('error');
    return new Response(JSON.stringify({ 
      response: fallbackResponse
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function searchLocalTermsSpecific(supabaseClient: any, searchTerm: string): Promise<string | null> {
  try {
    console.log('Searching specific database for:', searchTerm.substring(0, 50));
    
    // Clean and normalize search term
    const cleanSearchTerm = searchTerm.toLowerCase()
      .trim()
      .replace(/[¿?¡!.,;]/g, '')
      .replace(/\s+/g, ' ');

    console.log('Clean search term:', cleanSearchTerm.substring(0, 50));

    // 1. Exact search first
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
      
      return response;
    }

    // 2. Partial search
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
      
      return response;
    }

    // 3. Search variations
    const searchVariations = [
      cleanSearchTerm,
      cleanSearchTerm.replace(/s$/, ''),
      cleanSearchTerm + 's',
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
        
        return response;
      }
    }

    // 4. Keyword search
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
        
        return response;
      }
    }

    console.log('No specific matches found for:', searchTerm.substring(0, 50));
    return null;
  } catch (error) {
    console.error('Error in specific search:', error);
    return null;
  }
}

function getFallbackResponse(message: string): string {
  const term = message.toLowerCase().trim();
  
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

  for (const [key, definition] of Object.entries(commonTerms)) {
    if (term.includes(key) || key.includes(term) || 
        term.replace(/s$/, '') === key || key.replace(/s$/, '') === term) {
      return definition;
    }
  }

  return `No encontré información específica sobre "${message.substring(0, 50)}" en mi base de datos odontológica. Intenta con términos más específicos como **caries**, **gingivitis**, **dolor dental**, **bruxismo**, etc.`;
}
