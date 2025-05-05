import React from 'react';
import { FormDataState } from '@/types/historiaClinica';
import { Card } from "@/components/ui/card";

interface ExploracionFisicaProps {
  formData: FormDataState;
  handleExploracionFisicaChange: (part: string, value: any) => void; // Changed type to any to accommodate complex objects
}

const ExploracionFisica: React.FC<ExploracionFisicaProps> = ({
  formData,
  handleExploracionFisicaChange
}) => {
  return (
    <Card className="p-6 shadow-md rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Exploración Física</h2>
      <p className="text-sm text-gray-500">
        Esta sección permite registrar información sobre la exploración física del paciente.
      </p>
      {/* Implement your form fields here */}
      <div className="mt-4">
        <p className="text-sm text-gray-500">Contenido en desarrollo</p>
      </div>
    </Card>
  );
};

export default ExploracionFisica;
