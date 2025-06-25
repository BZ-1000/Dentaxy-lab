
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://www.dentaxy.com',
        'X-Title': 'DentaxyGPT - Asistente Odontológico Especializado',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.1,
        max_tokens: 200,
        top_p: 0.7,
        frequency_penalty: 0.6,
        presence_penalty: 0.4
      })
    });

    console.log('OpenRouter response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenRouter response:', data);

    const aiResponse = data.choices?.[0]?.message?.content || 'Lo siento, no pude procesar tu consulta.';

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(JSON.stringify({ 
      error: 'Error procesando la consulta',
      response: 'Lo siento, ocurrió un error técnico. Por favor, intenta nuevamente.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
