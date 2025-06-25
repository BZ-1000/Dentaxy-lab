
import { createContext, useContext, useState, ReactNode } from 'react';

interface AnalysisModeContextType {
  isAnalysisMode: boolean;
  setAnalysisMode: (mode: boolean) => void;
  selectedText: string;
  setSelectedText: (text: string) => void;
  selectedPosition: { x: number; y: number } | null;
  setSelectedPosition: (position: { x: number; y: number } | null) => void;
}

const AnalysisModeContext = createContext<AnalysisModeContextType | undefined>(undefined);

export function AnalysisModeProvider({ children }: { children: ReactNode }) {
  const [isAnalysisMode, setAnalysisMode] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<{ x: number; y: number } | null>(null);

  return (
    <AnalysisModeContext.Provider value={{
      isAnalysisMode,
      setAnalysisMode,
      selectedText,
      setSelectedText,
      selectedPosition,
      setSelectedPosition
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
