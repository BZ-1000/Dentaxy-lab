import React from 'react';
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface DiagnosticoPronosticoProps {
  formData: {
    diagnosticos: string;
    pronosticos: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const DiagnosticoPronostico = ({ formData, handleInputChange }: DiagnosticoPronosticoProps) => {
  return (
    <div className="relative p-[1px] rounded-xl overflow-hidden bg-gradient-to-r from-blue-500 via-primary to-blue-500 animate-border-glow">
      <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0">
        <h3 className="text-2xl font-mplus font-normal mb-6 text-gray-800 dark:text-gray-100">Diagnóstico y Pronóstico</h3>
        <div className="space-y-6">
          <Textarea
            id="diagnosticos"
            name="diagnosticos"
            value={formData.diagnosticos}
            onChange={handleInputChange}
            placeholder="Ingrese los diagnósticos del paciente"
            className="h-32 shadow-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/50"
          />
          <Textarea
            id="pronosticos"
            name="pronosticos"
            value={formData.pronosticos}
            onChange={handleInputChange}
            placeholder="Ingrese los pronósticos del paciente"
            className="h-32 shadow-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </Card>
    </div>
  );
};

export default DiagnosticoPronostico;