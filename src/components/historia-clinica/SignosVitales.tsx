import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SignosVitalesProps {
  formData: {
    peso: string;
    talla: string;
    imc: string;
    presionArterial: string;
    pulso: string;
    frecuenciaCardiaca: string;
    frecuenciaRespiratoria: string;
    temperatura: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SignosVitales = ({ formData, handleInputChange }: SignosVitalesProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-mplus font-normal mb-4">Signos Vitales</h3>
      <div className="grid gap-4 md:grid-cols-3">
        <Input
          id="peso"
          name="peso"
          type="number"
          value={formData.peso}
          onChange={handleInputChange}
          className="shadow-sm"
          placeholder="Peso (kg)"
        />
        <Input
          id="talla"
          name="talla"
          type="number"
          step="0.01"
          value={formData.talla}
          onChange={handleInputChange}
          className="shadow-sm"
          placeholder="Talla (m)"
        />
        <Input
          id="presionArterial"
          name="presionArterial"
          value={formData.presionArterial}
          onChange={handleInputChange}
          className="shadow-sm"
          placeholder="Presión Arterial (mmHg)"
        />
      </div>
    </Card>
  );
};

export default SignosVitales;