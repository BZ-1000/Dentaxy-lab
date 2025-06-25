
import { createContext, useContext, useState, ReactNode } from 'react';

interface AnalysisModeContextType {
  isAnalysisMode: boolean;
  setAnalysisMode: (mode: boolean) => void;
  selectedText: string;
  setSelectedText: (text: string) => void;
  selectedPosition: { x: number; y: number } | null;
  setSelectedPosition: (position: { x: number; y: number } | null) => void;
  selectedWords: string[];
  setSelectedWords: (words: string[]) => void;
  toggleWord: (word: string) => void;
}

const AnalysisModeContext = createContext<AnalysisModeContextType | undefined>(undefined);

export function AnalysisModeProvider({ children }: { children: ReactNode }) {
  const [isAnalysisMode, setAnalysisMode] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const toggleWord = (word: string) => {
    setSelectedWords(prev => {
      if (prev.includes(word)) {
        return prev.filter(w => w !== word);
      } else {
        return [...prev, word];
      }
    });
  };

  return (
    <AnalysisModeContext.Provider value={{
      isAnalysisMode,
      setAnalysisMode,
      selectedText,
      setSelectedText,
      selectedPosition,
      setSelectedPosition,
      selectedWords,
      setSelectedWords,
      toggleWord
    }}>
      {children}
    </AnalysisModeContext.Provider>
  );
}

export function useAnalysisMode() {
  const context = useContext(AnalysisModeContext);
  if (context === undefined) {
    throw new Error('useAnalysisMode must be used within an AnalysisModeProvider');
  }
  return context;
}
