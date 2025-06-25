
import React, { useState, useCallback } from 'react';
import { useAnalysisMode } from '@/contexts/AnalysisModeContext';

interface SelectableTextProps {
  text: string;
  className?: string;
}

export const SelectableText: React.FC<SelectableTextProps> = ({ text, className = '' }) => {
  const { isAnalysisMode, selectedText, setSelectedText } = useAnalysisMode();
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [touchedWord, setTouchedWord] = useState<string | null>(null);

  // Función para dividir el texto en palabras preservando espacios y puntuación
  const tokenizeText = (text: string) => {
    return text.split(/(\s+|[.,;:!?()[\]{}"])/).filter(token => token.length > 0);
  };

  const handleWordInteraction = useCallback((word: string, action: 'select' | 'touch' | 'release') => {
    if (!isAnalysisMode) return;

    const cleanWord = word.trim().toLowerCase();
    if (cleanWord.length < 2 || /^\s+$/.test(word) || /^[.,;:!?()[\]{}"]$/.test(word)) return;

    switch (action) {
      case 'touch':
        setTouchedWord(cleanWord);
        break;
      case 'release':
        setTouchedWord(null);
        break;
      case 'select':
        setSelectedWords(prev => {
          const newSet = new Set(prev);
          if (newSet.has(cleanWord)) {
            newSet.delete(cleanWord);
          } else {
            newSet.add(cleanWord);
          }
          
          // Actualizar el texto seleccionado en el contexto
          const selectedArray = Array.from(newSet);
          setSelectedText(selectedArray.join(' '));
          
          return newSet;
        });
        break;
    }
  }, [isAnalysisMode, setSelectedText]);

  const getWordClassName = (word: string) => {
    if (!isAnalysisMode) return '';
    
    const cleanWord = word.trim().toLowerCase();
    
    // Si es solo espacios o puntuación, no aplicar estilos
    if (/^\s+$/.test(word) || /^[.,;:!?()[\]{}"]$/.test(word)) {
      return '';
    }
    
    let classes = 'cursor-pointer transition-all duration-200 rounded-md px-1.5 py-1 mx-0.5 inline-block select-none border ';
    
    if (selectedWords.has(cleanWord)) {
      // Palabra seleccionada - fondo amarillo permanente
      classes += 'bg-yellow-300 border-yellow-400 hover:bg-yellow-400 text-gray-800 ';
    } else if (touchedWord === cleanWord) {
      // Palabra siendo tocada - se oscurece
      classes += 'bg-gray-400 border-gray-500 text-white ';
    } else {
      // Estado normal en modo análisis - fondo gris claro como botón
      classes += 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-700 ';
    }
    
    return classes;
  };

  const tokens = tokenizeText(text);

  if (!isAnalysisMode) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {tokens.map((token, index) => {
        // Si es un espacio o puntuación, renderizar sin interacción
        if (/^\s+$/.test(token) || /^[.,;:!?()[\]{}"]$/.test(token)) {
          return <span key={index}>{token}</span>;
        }

        // Es una palabra - hacer seleccionable
        return (
          <span
            key={index}
            className={getWordClassName(token)}
            onMouseDown={() => handleWordInteraction(token, 'touch')}
            onMouseUp={() => {
              handleWordInteraction(token, 'release');
              handleWordInteraction(token, 'select');
            }}
            onMouseLeave={() => handleWordInteraction(token, 'release')}
            onTouchStart={(e) => {
              e.preventDefault();
              handleWordInteraction(token, 'touch');
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleWordInteraction(token, 'release');
              handleWordInteraction(token, 'select');
            }}
            style={{ 
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              WebkitTouchCallout: 'none'
            }}
          >
            {token}
          </span>
        );
      })}
    </span>
  );
};

export default SelectableText;
