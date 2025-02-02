import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      <h3 className="text-xl font-semibold mb-4">Signos Vitales</h3>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="peso">Peso (kg)</Label>
          <Input
            id="peso"
            name="peso"
            type="number"
            value={formData.peso}
            onChange={handleInputChange}
            placeholder="Peso en kilogramos"
          />
        </div>
        <div>
          <Label htmlFor="talla">Talla (m)</Label>
          <Input
            id="talla"
            name="talla"
            type="number"
            step="0.01"
            value={formData.talla}
            onChange={handleInputChange}
            placeholder="Altura en metros"
          />
        </div>
        <div>
          <Label htmlFor="presionArterial">Presión Arterial</Label>
          <Input
            id="presionArterial"
            name="presionArterial"
            value={formData.presionArterial}
            onChange={handleInputChange}
            placeholder="mmHg"
          />
        </div>
      </div>
    </Card>
  );
};

export default SignosVitales;