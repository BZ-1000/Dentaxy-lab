
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GeminiContextType {
  geminiAvailable: boolean;
  geminiLoading: boolean;
  generateContent: (prompt: string) => Promise<string | null>;
}

const GeminiContext = createContext<GeminiContextType | undefined>(undefined);

export function GeminiProvider({ children }: { children: ReactNode }) {
  const [geminiLoading, setGeminiLoading] = useState(false);
  const geminiAvailable = true; // Set based on API key availability

  const generateContent = async (prompt: string): Promise<string | null> => {
    try {
      setGeminiLoading(true);
      // Mock implementation - actual implementation would use the Gemini API
      await new Promise(resolve => setTimeout(resolve, 1000));
      return "Historia clínica generada con éxito";
    } catch (error) {
      console.error('Error generating content:', error);
      return null;
    } finally {
      setGeminiLoading(false);
    }
  };

  return (
    <GeminiContext.Provider value={{ geminiAvailable, geminiLoading, generateContent }}>
      {children}
    </GeminiContext.Provider>
  );
}

export function useGeminiContext() {
  const context = useContext(GeminiContext);
  if (context === undefined) {
    throw new Error('useGeminiContext must be used within a GeminiProvider');
  }
  return context;
}
