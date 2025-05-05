
import React from 'react';
import { FormDataState } from '@/types/historiaClinica';
import { Card } from "@/components/ui/card";

interface ArticulacionCraneomandibularProps {
  formData: FormDataState;
  handleArticulacionCraneomandibularChange: (part: string, value: string | boolean) => void;
}

const ArticulacionCraneomandibular: React.FC<ArticulacionCraneomandibularProps> = ({
  formData,
  handleArticulacionCraneomandibularChange
}) => {
  return (
    <Card className="p-6 shadow-md rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Articulación Craneomandibular</h2>
      <p className="text-sm text-gray-500">
        Esta sección permite registrar información relacionada con la articulación craneomandibular del paciente.
      </p>
      {/* Implement your form fields here */}
      <div className="mt-4">
        <p className="text-sm text-gray-500">Contenido en desarrollo</p>
      </div>
    </Card>
  );
};

export default ArticulacionCraneomandibular;
