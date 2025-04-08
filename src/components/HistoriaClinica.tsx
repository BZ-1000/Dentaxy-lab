
import React from 'react';
import AntecedentesAlergicos from './historia-clinica/AntecedentesAlergicos';
import AntecedentesHemorragicos from './historia-clinica/AntecedentesHemorragicos';
import { useHistoriaClinica } from '@/hooks/useHistoriaClinica';

export const HistoriaClinica: React.FC = () => {
  const {
    formData,
    handleAntecedenteAlergicoChange,
    handleAntecedenteQuirurgicoChange,
    handleAntecedenteHemorragicoChange,
    clearAntecedentesMedicosQuirurgicos
  } = useHistoriaClinica();

  return (
    <div className="w-full">
      <AntecedentesAlergicos 
        formData={formData} 
        handleAntecedenteAlergicoChange={handleAntecedenteAlergicoChange} 
      />
      
      <div className="mt-8">
        <AntecedentesHemorragicos 
          formData={formData}
          handleAntecedenteHemorragicoChange={handleAntecedenteHemorragicoChange}
        />
      </div>
      
      <div className="mt-8">
        {/* This is a read-only component */}
        <div className="w-full">
          <AntecedentesQuirurgicos 
            formData={formData} 
            handleAntecedenteQuirurgicoChange={handleAntecedenteQuirurgicoChange}
            clearAntecedentesMedicosQuirurgicos={clearAntecedentesMedicosQuirurgicos} 
          />
        </div>
      </div>
    </div>
  );
};

export default HistoriaClinica;
