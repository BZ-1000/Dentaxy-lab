
import { useEffect, useCallback } from 'react';
import { useAnalysisMode } from '@/contexts/AnalysisModeContext';

const DENTAXY_DEFINITION_PROMPT = `Eres DentaxyGPT, especializado en definiciones médicas odontológicas precisas.

IMPORTANTE:
- Responde SIEMPRE en español
- Proporciona definiciones claras y concisas
- Máximo 60 palabras por respuesta
- Incluye contexto clínico relevante

Para términos médicos/odontológicos:
1. Definición precisa
2. Contexto clínico relevante
3. Ejemplo de uso (si aplica)

Mantén las respuestas breves y directas.`;

export function useTextSelection() {
  const {
    isAnalysisMode,
    setSelectedText,
    setSelectedPosition,
    setDefinition,
    setIsLoadingDefinition,
    setShowDefinitionPopup
  } = useAnalysisMode();

  const getDefinition = useCallback(async (text: string) => {
    setIsLoadingDefinition(true);
    
    try {
      const currentDomain = window.location.hostname;
      let refererUrl = 'https://www.dentaxy.com';
      
      if (currentDomain.includes('dentaxy.com')) {
        refererUrl = currentDomain.includes('www.') ? 'https://www.dentaxy.com' : 'https://dentaxy.com';
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
          'HTTP-Referer': refererUrl,
          'X-Title': 'DentaxyGPT - Definiciones Odontológicas',
          'Origin': refererUrl
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.2-3b-instruct:free',
          messages: [
            {
              role: 'system',
              content: DENTAXY_DEFINITION_PROMPT
            },
            {
              role: 'user',
              content: `Define brevemente el término médico/odontológico: "${text}"`
            }
          ],
          temperature: 0.1,
          max_tokens: 100,
          top_p: 0.7,
          frequency_penalty: 0.6,
          presence_penalty: 0.4
        })
      });

      if (!response.ok) {
        throw new Error('Error al obtener definición');
      }

      const data = await response.json();
      const definition = data.choices?.[0]?.message?.content || 'No se pudo obtener la definición de este término.';
      
      setDefinition(definition.trim());
    } catch (error) {
      console.error('Error getting definition:', error);
      setDefinition('Error al obtener la definición. Intenta nuevamente.');
    } finally {
      setIsLoadingDefinition(false);
    }
  }, [setDefinition, setIsLoadingDefinition]);

  const handleTextSelection = useCallback((event: MouseEvent) => {
    if (!isAnalysisMode) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const selectedText = selection.toString().trim();
    if (selectedText.length < 2) return;

    // Obtener la posición del texto seleccionado
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    setSelectedText(selectedText);
    setSelectedPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setShowDefinitionPopup(true);
    
    // Obtener la definición
    getDefinition(selectedText);
    
    // Limpiar la selección
    selection.removeAllRanges();
  }, [isAnalysisMode, setSelectedText, setSelectedPosition, setShowDefinitionPopup, getDefinition]);

  useEffect(() => {
    if (isAnalysisMode) {
      document.addEventListener('mouseup', handleTextSelection);
      document.body.style.cursor = 'text';
      document.body.style.userSelect = 'text';
    } else {
      document.removeEventListener('mouseup', handleTextSelection);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isAnalysisMode, handleTextSelection]);
}
