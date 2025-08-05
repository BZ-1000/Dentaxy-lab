import React from 'react';
import ExamenIntrabucalWrapper from './examen-intrabucal/ExamenIntrabucalWrapper';
import { FormDataState } from '@/types/historiaClinica';

interface ExamenIntrabucalFormProps {
  area: string;
  onClose: () => void;
  formData: FormDataState;
  handleExamenIntrabucalChange: (part: string, value: string | boolean) => void;
}

const ExamenIntrabucalForm: React.FC<ExamenIntrabucalFormProps> = ({
  area,
  onClose,
  formData,
  handleExamenIntrabucalChange
}) => {
  return (
    <ExamenIntrabucalWrapper
      area={area}
      onClose={onClose}
      formData={formData}
      handleExamenIntrabucalChange={handleExamenIntrabucalChange}
    />
  );
};

export default ExamenIntrabucalForm;