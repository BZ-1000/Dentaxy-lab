import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from './button';
interface DefinitionPopupProps {
  text: string;
  position: {
    x: number;
    y: number;
  };
  onClose: () => void;
}
export function DefinitionPopup({
  text,
  position,
  onClose
}: DefinitionPopupProps) {
  const [definition, setDefinition] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchDefinition = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer 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',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://www.dentaxy.com',
            'X-Title': 'DentaxyGPT - Análisis de Términos Odontológicos'
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.2-3b-instruct:free',
            messages: [{
              role: 'system',
              content: 'Eres un experto en odontología. Proporciona definiciones concisas y claras de términos médicos/odontológicos en español. Incluye: 1) Definición breve, 2) Ejemplo de uso clínico, 3) Sinónimos si los hay. Máximo 100 palabras.'
            }, {
              role: 'user',
              content: `Define el término odontológico: "${text}"`
            }],
            temperature: 0.1,
            max_tokens: 150
          })
        });
        if (response.ok) {
          const data = await response.json();
          setDefinition(data.choices?.[0]?.message?.content || 'No se pudo obtener la definición.');
        } else {
          setDefinition('Error al obtener la definición. Término no encontrado en la base de datos odontológica.');
        }
      } catch (error) {
        setDefinition('Error de conexión. No se pudo consultar la definición.');
      } finally {
        setIsLoading(false);
      }
    };
    if (text) {
      fetchDefinition();
    }
  }, [text]);
  return;
}