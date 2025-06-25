
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
              "relative cursor-pointer transition-all duration-200 rounded-md px-1.5 py-1 mx-0.5",
              "touch-manipulation select-none inline-block",
              // Estilo base para palabras seleccionables en modo análisis
              isAnalysisMode && "bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 font-medium shadow-sm",
              // Estilo para palabras seleccionadas
              isSelected && "bg-yellow-300 border-yellow-400 text-gray-900 font-bold shadow-md",
              // Efectos de interacción
              "hover:scale-105 active:scale-95 transform",
              isSelected && "hover:bg-yellow-400 active:bg-yellow-500"
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWord(cleanWord);
            }}
            onMouseDown={(e) => {
              // Feedback visual en PC
              e.currentTarget.style.transform = 'scale(0.95)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              setTimeout(() => {
                e.currentTarget.style.transform = 'scale(1)';
              }, 100);
            }}
            onTouchStart={(e) => {
              // Feedback visual en móvil
              e.currentTarget.style.transform = 'scale(0.95)';
              e.currentTarget.style.backgroundColor = isSelected ? '#fbbf24' : '#dbeafe';
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              setTimeout(() => {
                e.currentTarget.style.backgroundColor = '';
              }, 150);
            }}
            title={`Tocar para ${isSelected ? 'deseleccionar' : 'seleccionar'}: ${cleanWord}`}
          >
            {segment}
          </span>
        );
      })}
    </span>
  );
};

export default SelectableText;
