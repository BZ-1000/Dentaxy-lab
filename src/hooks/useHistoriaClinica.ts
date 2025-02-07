
import { useFormData } from './historia-clinica/useFormData';
import { useFormHandlers } from './historia-clinica/useFormHandlers';
import { useReportGenerator } from './historia-clinica/useReportGenerator';

export const useHistoriaClinica = () => {
  const { formData, setFormData } = useFormData();
  const { 
    handleInputChange,
    handlePadecimientoChange,
    handleDolorChange,
    handleSinSintomasChange,
    handleFamiliarChange,
    handleCondicionChange,
  } = useFormHandlers(setFormData);
  const { resumen, isGenerating, generarResumen } = useReportGenerator(formData);

  return {
    formData,
    resumen,
    isGenerating,
    handleInputChange,
    handlePadecimientoChange,
    handleDolorChange,
    handleSinSintomasChange,
    handleFamiliarChange,
    handleCondicionChange,
    generarResumen
  };
};
