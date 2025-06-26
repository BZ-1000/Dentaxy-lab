
import React, { useState, useRef, useEffect } from 'react';
import { useAnalysisMode } from '@/contexts/AnalysisModeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, BrainCog } from 'lucide-react';

interface InteractiveTextSelectorProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectedWord {
  id: string;
  text: string;
  element: HTMLElement;
}

export const InteractiveTextSelector: React.FC<InteractiveTextSelectorProps> = ({
  children,
  className = ''
}) => {
  const { isAnalysisMode, selectedText, setSelectedText } = useAnalysisMode();
  const [selectedWords, setSelectedWords] = useState<SelectedWord[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAnalysisMode || !containerRef.current) return;

    const handleTextInteraction = (event: Event) => {
      const target = event.target as HTMLElement;
      
      // Buscar el texto más cercano
      const textNode = findTextNode(target);
      if (!textNode) return;

      const word = extractWordFromNode(textNode, event as MouseEvent);
      if (!word) return;

      event.preventDefault();
      event.stopPropagation();

      toggleWordSelection(word, target);
    };

    const container = containerRef.current;
    
    // Agregar listeners para click y touch
    container.addEventListener('click', handleTextInteraction, true);
    container.addEventListener('touchend', handleTextInteraction, true);

    // Aplicar estilos para indicar modo análisis
    container.style.userSelect = 'none';
    container.style.cursor = 'pointer';
    
    return () => {
      container.removeEventListener('click', handleTextInteraction, true);
      container.removeEventListener('touchend', handleTextInteraction, true);
      container.style.userSelect = '';
      container.style.cursor = '';
    };
  }, [isAnalysisMode]);

  const findTextNode = (element: HTMLElement): Text | null => {
    // Si el elemento tiene texto directo
    for (let node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        return node as Text;
      }
    }
    
    // Buscar en el elemento padre
    if (element.parentElement) {
      return findTextNode(element.parentElement);
    }
    
    return null;
  };

  const extractWordFromNode = (textNode: Text, event: MouseEvent): string | null => {
    const text = textNode.textContent || '';
    const words = text.split(/\s+/).filter(word => word.length > 2);
    
    // En móviles, simplemente tomamos la primera palabra significativa
    if ('ontouchstart' in window) {
      return words[0] || null;
    }
    
    // En desktop, podríamos ser más precisos con la posición del click
    return words[0] || null;
  };

  const toggleWordSelection = (word: string, element: HTMLElement) => {
    const wordId = `${word}-${Date.now()}`;
    
    setSelectedWords(prev => {
      const existingIndex = prev.findIndex(w => w.text.toLowerCase() === word.toLowerCase());
      
      if (existingIndex >= 0) {
        // Deseleccionar palabra
        const updated = prev.filter((_, index) => index !== existingIndex);
        updateSelectedText(updated);
        removeWordHighlight(prev[existingIndex].element);
        return updated;
      }
      
      // Seleccionar nueva palabra
      const newWord: SelectedWord = {
        id: wordId,
        text: word,
        element: element
      };
      
      const updated = [...prev, newWord];
      updateSelectedText(updated);
      addWordHighlight(element, word);
      return updated;
    });
  };

  const updateSelectedText = (words: SelectedWord[]) => {
    const combinedText = words.map(w => w.text).join(' ');
    setSelectedText(combinedText);
  };

  const addWordHighlight = (element: HTMLElement, word: string) => {
    element.style.backgroundColor = 'rgba(139, 92, 246, 0.3)';
    element.style.borderRadius = '4px';
    element.style.padding = '2px 4px';
    element.style.margin = '0 1px';
    element.style.transition = 'all 0.2s ease';
  };

  const removeWordHighlight = (element: HTMLElement) => {
    element.style.backgroundColor = '';
    element.style.borderRadius = '';
    element.style.padding = '';
    element.style.margin = '';
    element.style.transition = '';
  };

  const clearAllSelections = () => {
    selectedWords.forEach(word => {
      removeWordHighlight(word.element);
    });
    setSelectedWords([]);
    setSelectedText('');
  };

  const analyzeSelected = () => {
    if (selectedWords.length > 0) {
      // Aquí podrías abrir DentaxyGPT o hacer algo con el texto seleccionado
      console.log('Analizando:', selectedText);
    }
  };

  if (!isAnalysisMode) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className}>
      {/* Indicador de modo análisis */}
      <div className="fixed top-4 left-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-purple-600 text-white px-3 py-2 rounded-full flex items-center gap-2 shadow-lg"
        >
          <BrainCog className="w-4 h-4" />
          <span className="text-sm font-medium">Modo Análisis</span>
        </motion.div>
      </div>

      {/* Panel de palabras seleccionadas */}
      <AnimatePresence>
        {selectedWords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border p-4 z-50"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                Términos Seleccionados ({selectedWords.length})
              </h3>
              <button
                onClick={clearAllSelections}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Lista de palabras seleccionadas */}
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedWords.map((word) => (
                <motion.span
                  key={word.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                >
                  {word.text}
                  <button
                    onClick={() => toggleWordSelection(word.text, word.element)}
                    className="text-purple-600 hover:text-purple-800 dark:text-purple-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
            </div>

            {/* Botón de análisis */}
            <button
              onClick={analyzeSelected}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <BrainCog className="w-4 h-4" />
              Analizar Términos Seleccionados
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenido envuelto */}
      <div 
        ref={containerRef}
        className={isAnalysisMode ? 'analysis-mode-active' : ''}
        style={{
          position: 'relative'
        }}
      >
        {children}
      </div>

      {/* Estilos CSS adicionales */}
      <style jsx>{`
        .analysis-mode-active * {
          cursor: pointer !important;
        }
        
        .analysis-mode-active p,
        .analysis-mode-active span,
        .analysis-mode-active div,
        .analysis-mode-active h1,
        .analysis-mode-active h2,
        .analysis-mode-active h3,
        .analysis-mode-active h4,
        .analysis-mode-active h5,
        .analysis-mode-active h6 {
          transition: background-color 0.2s ease;
        }
        
        .analysis-mode-active *:hover {
          background-color: rgba(139, 92, 246, 0.1) !important;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};
