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
    <Card className="p-6">
      <h3 className="text-xl font-mplus font-normal mb-4">Diagnóstico y Pronóstico</h3>
      <div className="space-y-4">
        <Textarea
          id="diagnosticos"
          name="diagnosticos"
          value={formData.diagnosticos}
          onChange={handleInputChange}
          placeholder="Ingrese los diagnósticos del paciente"
          className="h-32 shadow-sm"
        />
        <Textarea
          id="pronosticos"
          name="pronosticos"
          value={formData.pronosticos}
          onChange={handleInputChange}
          placeholder="Ingrese los pronósticos del paciente"
          className="h-32 shadow-sm"
        />
      </div>
    </Card>
  );
};

export default DiagnosticoPronostico;