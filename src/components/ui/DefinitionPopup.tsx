
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

  return (
    <div
      className="fixed z-[10000] pointer-events-auto"
      style={{
        left: Math.min(position.x, window.innerWidth - 320),
        top: Math.max(position.y - 10, 10),
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 max-w-xs">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/8d0bcc46-2c73-4647-8420-9aa25c312389.png" 
              alt="DentaxyGPT" 
              className="h-5 w-5" 
            />
            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
              {text}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Obteniendo definición...</span>
            </div>
          ) : (
            <p className="leading-relaxed">{definition}</p>
          )}
        </div>
      </div>
      
      {/* Flecha indicadora */}
      <div 
        className="absolute w-3 h-3 bg-white dark:bg-gray-800 border-l border-b border-gray-200 dark:border-gray-700 transform rotate-45"
        style={{
          left: '20px',
          top: '-6px',
        }}
      />
    </div>
  );
}
