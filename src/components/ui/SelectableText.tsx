
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

  // Función para dividir el texto en palabras
  const tokenizeText = (text: string) => {
    // Dividir por espacios y mantener signos de puntuación
    return text.split(/(\s+|[.,;:!?()[\]{}"])/).filter(token => token.trim().length > 0);
  };

  const handleWordInteraction = useCallback((word: string, action: 'select' | 'touch' | 'release') => {
    if (!isAnalysisMode) return;

    const cleanWord = word.trim().toLowerCase();
    if (cleanWord.length < 2) return; // Ignorar palabras muy cortas

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
    let classes = 'cursor-pointer transition-all duration-200 rounded px-1 py-0.5 mx-0.5 inline-block select-none ';
    
    if (selectedWords.has(cleanWord)) {
      // Palabra seleccionada - fondo amarillo permanente
      classes += 'bg-yellow-300 hover:bg-yellow-400 ';
    } else if (touchedWord === cleanWord) {
      // Palabra siendo tocada - se oscurece
      classes += 'bg-gray-400 ';
    } else {
      // Estado normal en modo análisis - fondo gris claro como botón
      classes += 'bg-gray-100 hover:bg-gray-200 ';
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
            onTouchStart={() => handleWordInteraction(token, 'touch')}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleWordInteraction(token, 'release');
              handleWordInteraction(token, 'select');
            }}
            style={{ 
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none'
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
