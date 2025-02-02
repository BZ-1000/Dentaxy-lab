import React from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
      <h3 className="text-xl font-semibold mb-4">Diagnóstico y Pronóstico</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="diagnosticos">Diagnósticos</Label>
          <Textarea
            id="diagnosticos"
            name="diagnosticos"
            value={formData.diagnosticos}
            onChange={handleInputChange}
            placeholder="Diagnósticos"
            className="h-32"
          />
        </div>
        <div>
          <Label htmlFor="pronosticos">Pronósticos</Label>
          <Textarea
            id="pronosticos"
            name="pronosticos"
            value={formData.pronosticos}
            onChange={handleInputChange}
            placeholder="Pronósticos"
            className="h-32"
          />
        </div>
      </div>
    </Card>
  );
};

export default DiagnosticoPronostico;