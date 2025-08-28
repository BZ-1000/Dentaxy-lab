import React, { createContext, useContext, useState } from 'react';

interface PlanPeriodContextType {
  period: 'monthly' | 'semester';
  setPeriod: (period: 'monthly' | 'semester') => void;
}

const PlanPeriodContext = createContext<PlanPeriodContextType | undefined>(undefined);

export const usePlanPeriod = () => {
  const context = useContext(PlanPeriodContext);
  if (!context) {
    throw new Error('usePlanPeriod must be used within a PlanPeriodProvider');
  }
  return context;
};

export const PlanPeriodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [period, setPeriod] = useState<'monthly' | 'semester'>('monthly');

  return (
    <PlanPeriodContext.Provider value={{ period, setPeriod }}>
      {children}
    </PlanPeriodContext.Provider>
  );
};