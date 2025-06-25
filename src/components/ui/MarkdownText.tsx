
import React from 'react';

interface MarkdownTextProps {
  children: string;
  className?: string;
}

export const MarkdownText: React.FC<MarkdownTextProps> = ({ children, className = '' }) => {
  // Función para procesar texto markdown básico
  const processMarkdown = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    
    // Regex para encontrar texto en negritas (**texto** o <strong>texto</strong>)
    const boldRegex = /(\*\*(.*?)\*\*|<strong>(.*?)<\/strong>)/g;
    let match;
    
    while ((match = boldRegex.exec(text)) !== null) {
      // Agregar texto antes del match
      if (match.index > currentIndex) {
        parts.push(text.slice(currentIndex, match.index));
      }
      
      // Agregar texto en negrita
      const boldText = match[2] || match[3]; // Captura de **texto** o <strong>texto</strong>
      parts.push(
        <strong key={match.index} className="font-bold">
          {boldText}
        </strong>
      );
      
      currentIndex = match.index + match[0].length;
    }
    
    // Agregar texto restante
    if (currentIndex < text.length) {
      parts.push(text.slice(currentIndex));
    }
    
    return parts;
  };

  // Procesar texto línea por línea para manejar saltos de línea
  const processLines = (text: string): React.ReactNode[] => {
    const lines = text.split('\n');
    return lines.map((line, lineIndex) => (
      <React.Fragment key={lineIndex}>
        {processMarkdown(line)}
        {lineIndex < lines.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <span className={className}>
      {processLines(children)}
    </span>
  );
};

export default MarkdownText;
