
import React from 'react';
import { useAnalysisMode } from '@/contexts/AnalysisModeContext';
import { cn } from '@/lib/utils';

interface SelectableTextProps {
  text: string;
  className?: string;
}

const SelectableText: React.FC<SelectableTextProps> = ({ text, className }) => {
  const { isAnalysisMode, selectedWords, toggleWord } = useAnalysisMode();

  if (!isAnalysisMode) {
    return <span className={className}>{text}</span>;
  }

  // Dividir el texto en palabras preservando espacios y puntuación
  const words = text.split(/(\s+|[.,;:!?¿¡()[\]{}"])/);

  return (
    <span className={className}>
      {words.map((segment, index) => {
        // Si es un espacio o puntuación, renderizar directamente
        if (/^\s+$/.test(segment) || /^[.,;:!?¿¡()[\]{}"]$/.test(segment)) {
          return <span key={index}>{segment}</span>;
        }

        // Si es una palabra
        const cleanWord = segment.toLowerCase().trim();
        const isSelected = selectedWords.includes(cleanWord);
        const isSelectable = cleanWord.length > 2; // Solo palabras de más de 2 caracteres

        if (!isSelectable) {
          return <span key={index}>{segment}</span>;
        }

        return (
          <span
            key={index}
            className={cn(
              "relative cursor-pointer transition-all duration-200 rounded-sm px-1 py-0.5 mx-0.5",
              "touch-manipulation select-none",
              // Estilo base para palabras seleccionables
              isAnalysisMode && "bg-gray-100 hover:bg-gray-200 border border-transparent",
              // Estilo para palabras seleccionadas
              isSelected && "bg-yellow-200 border-yellow-300 text-gray-900 font-medium",
              // Efectos táctiles
              "active:scale-95 active:bg-gray-300",
              isSelected && "active:bg-yellow-300"
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWord(cleanWord);
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {segment}
          </span>
        );
      })}
    </span>
  );
};

export default SelectableText;
