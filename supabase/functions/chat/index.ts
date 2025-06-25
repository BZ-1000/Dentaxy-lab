
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

    // Usar Hugging Face Inference API como alternativa gratuita
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `${systemPrompt}\n\nUsuario: ${message}\nAsistente:`,
        parameters: {
          max_length: 200,
          temperature: 0.7,
          do_sample: true,
          pad_token_id: 50256
        }
      })
    });

    console.log('Hugging Face response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face error:', errorText);
      
      // Fallback con respuesta estática para términos dentales comunes
      const fallbackResponse = getFallbackResponse(message);
      return new Response(JSON.stringify({ response: fallbackResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Hugging Face response:', data);

    let aiResponse = '';
    if (Array.isArray(data) && data[0]?.generated_text) {
      aiResponse = data[0].generated_text.split('Asistente:').pop()?.trim() || getFallbackResponse(message);
    } else {
      aiResponse = getFallbackResponse(message);
    }

    return new Response(JSON.stringify({ response: aiResponse }), {
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

function getFallbackResponse(message: string): string {
  const term = message.toLowerCase();
  
  const dentalTerms: { [key: string]: string } = {
    'caries': 'La caries dental es la destrucción de los tejidos del diente causada por bacterias. Se produce cuando las bacterias en la boca convierten los azúcares en ácidos que desmineralizan el esmalte dental.',
    'gingivitis': 'La gingivitis es la inflamación de las encías causada por la acumulación de placa bacteriana. Se caracteriza por enrojecimiento, hinchazón y sangrado de las encías.',
    'periodontitis': 'La periodontitis es una enfermedad inflamatoria que afecta los tejidos de soporte del diente, incluyendo el ligamento periodontal y el hueso alveolar.',
    'placa': 'La placa dental es una película pegajosa compuesta por bacterias, saliva y restos de alimentos que se acumula en los dientes y puede causar caries y enfermedad periodontal.',
    'erosion': 'La erosión dental es la pérdida de estructura dental causada por ácidos, ya sea de origen extrínseco (dieta) o intrínseco (reflujo gástrico).',
    'erosionadas': 'Se refiere a piezas dentales que han perdido estructura por acción de ácidos. Pueden presentar superficies lisas, pérdida de brillo y sensibilidad.',
    'abrasion': 'La abrasión dental es el desgaste anormal de la estructura dental causado por fuerzas mecánicas externas como el cepillado agresivo.',
    'bruxismo': 'El bruxismo es el hábito involuntario de apretar o rechinar los dientes, especialmente durante el sueño, que puede causar desgaste dental.',
    'maloclusion': 'La maloclusión se refiere a la incorrecta alineación de los dientes superiores e inferiores al cerrar la boca.',
    'hola': 'Hola, soy DentaxyGPT, tu asistente especializado en odontología. Pregúntame sobre cualquier término dental y te ayudaré con una explicación clara y precisa.'
  };

  for (const [key, definition] of Object.entries(dentalTerms)) {
    if (term.includes(key)) {
      return definition;
    }
  }

  return `Soy DentaxyGPT, especializado en términos dentales. El término "${message}" que mencionas puede estar relacionado con odontología. Si puedes proporcionar más contexto o ser más específico, podré darte una explicación más precisa.`;
}
