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
    <div className="relative p-[1px] rounded-xl overflow-hidden bg-gradient-to-r from-blue-500 via-primary to-blue-500 animate-border-glow">
      <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0">
        <h3 className="text-2xl font-mplus font-normal mb-6 text-gray-800 dark:text-gray-100">Signos Vitales</h3>
        <div className="grid gap-6 md:grid-cols-3">
          <Input
            id="peso"
            name="peso"
            type="number"
            value={formData.peso}
            onChange={handleInputChange}
            className="shadow-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/50"
            placeholder="Peso (kg)"
          />
          <Input
            id="talla"
            name="talla"
            type="number"
            step="0.01"
            value={formData.talla}
            onChange={handleInputChange}
            className="shadow-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/50"
            placeholder="Talla (m)"
          />
          <Input
            id="presionArterial"
            name="presionArterial"
            value={formData.presionArterial}
            onChange={handleInputChange}
            className="shadow-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/50"
            placeholder="Presión Arterial (mmHg)"
          />
        </div>
      </Card>
    </div>
  );
};

export default SignosVitales;