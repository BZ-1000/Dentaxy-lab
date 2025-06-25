
import React, { useState } from 'react';
import AppleStyleDock from '@/components/AppleStyleDock';
import HistoriaClinica from '@/components/HistoriaClinica';
import { AnalysisModeProvider } from '@/contexts/AnalysisModeContext';

const Index = () => {
  const [isDockOpen, setIsDockOpen] = useState(false);

  const handleDockToggle = () => {
    setIsDockOpen(!isDockOpen);
  };

  return (
    <AnalysisModeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 light">
        <HistoriaClinica />
        <AppleStyleDock isOpen={isDockOpen} onClose={() => setIsDockOpen(false)} />
      </div>
    </AnalysisModeProvider>
  );
};

export default Index;
