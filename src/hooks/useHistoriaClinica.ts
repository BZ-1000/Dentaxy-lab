
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { generateMedicalReport } from '@/services/geminiService';
import { FormDataState } from '@/types/historiaClinica';
import { getInitialFormState } from '@/utils/initialFormState';

export const useHistoriaClinica = () => {
  const { toast } = useToast();
  const [resumen, setResumen] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<FormDataState>(getInitialFormState());

  const handleNestedChange = (obj: any, path: string[], value: any) => {
    const lastKey = path[path.length - 1];
    const deepCopy = { ...obj };
    let current = deepCopy;
    
    // Traverse the path except the last key
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      current[key] = current[key] ? { ...current[key] } : {};
      current = current[key];
    }
    
    // Set the value at the last key
    current[lastKey] = value;
    return deepCopy;
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    const path = field.split('.');
    if (path.length > 1) {
      // Handle nested fields (e.g., 'servicios.agua')
      setFormData(prev => ({
        ...prev,
        [section]: handleNestedChange(prev[section] || {}, path, value)
      }));
    } else {
      // Handle simple fields
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    }
  };

  const handleFormSectionChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const generarResumen = async () => {
    try {
      setIsGenerating(true);
      const resumenGenerado = await generateMedicalReport(formData);
      setResumen(resumenGenerado);
      toast({
        title: "Historia Clínica Generada",
        description: "El resumen de la historia clínica ha sido generado exitosamente con IA.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar la historia clínica. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    formData,
    resumen,
    isGenerating,
    handleInputChange,
    handleFormSectionChange,
    generarResumen
  };
};
