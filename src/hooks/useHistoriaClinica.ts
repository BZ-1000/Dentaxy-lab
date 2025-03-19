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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePadecimientoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      padecimientoActual: {
        ...prev.padecimientoActual,
        [field]: value
      }
    }));
  };

  const handleDolorChange = (field: string, value: any) => {
    if (field === 'localizacion') {
      let localizacion;
      
      if (typeof value === 'string') {
        try {
          if (value.startsWith('{') && value.endsWith('}')) {
            localizacion = JSON.parse(value);
          } else {
            localizacion = { 
              tipo: '',
              descripcion: value 
            };
          }
        } catch (e) {
          localizacion = { tipo: '', descripcion: value };
        }
      } else if (typeof value === 'object') {
        localizacion = value;
      }
      
      setFormData(prev => ({
        ...prev,
        padecimientoActual: {
          ...prev.padecimientoActual,
          dolor: {
            ...prev.padecimientoActual.dolor,
            localizacion
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        padecimientoActual: {
          ...prev.padecimientoActual,
          dolor: {
            ...prev.padecimientoActual.dolor,
            [field]: value
          }
        }
      }));
    }
  };

  const handleSinSintomasChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      padecimientoActual: {
        ...prev.padecimientoActual,
        sinSintomas: checked
      }
    }));
  };

  const handleFamiliarChange = (familiar: string, field: string, value: boolean | string) => {
    setFormData(prev => ({
      ...prev,
      antecedentesHeredoFamiliares: {
        ...prev.antecedentesHeredoFamiliares,
        [familiar]: {
          ...prev.antecedentesHeredoFamiliares[familiar],
          [field]: value
        }
      }
    }));
  };

  const handleCondicionChange = (familiar: string, condicion: string, value: boolean | string) => {
    setFormData(prev => ({
      ...prev,
      antecedentesHeredoFamiliares: {
        ...prev.antecedentesHeredoFamiliares,
        [familiar]: {
          ...prev.antecedentesHeredoFamiliares[familiar],
          condiciones: {
            ...prev.antecedentesHeredoFamiliares[familiar].condiciones,
            [condicion]: value
          }
        }
      }
    }));
  };

  const handleAntecedenteChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        antecedentesPersonalesNoPatologicos: {
          ...prev.antecedentesPersonalesNoPatologicos,
          [parent]: {
            ...prev.antecedentesPersonalesNoPatologicos[parent],
            [child]: value
          }
        }
      }));
    } else if (Array.isArray(value)) {
      setFormData(prev => ({
        ...prev,
        antecedentesPersonalesNoPatologicos: {
          ...prev.antecedentesPersonalesNoPatologicos,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        antecedentesPersonalesNoPatologicos: {
          ...prev.antecedentesPersonalesNoPatologicos,
          [field]: value
        }
      }));
    }
  };

  const handleAntecedentePatologicoChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        antecedentesPersonalesPatologicos: {
          ...prev.antecedentesPersonalesPatologicos,
          [parent]: {
            ...prev.antecedentesPersonalesPatologicos[parent],
            [child]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        antecedentesPersonalesPatologicos: {
          ...prev.antecedentesPersonalesPatologicos,
          [field]: value
        }
      }));
    }
  };

  const handleAntecedenteAlergicoChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        antecedentesAlergicos: {
          ...prev.antecedentesAlergicos,
          [parent]: {
            ...prev.antecedentesAlergicos[parent],
            [child]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        antecedentesAlergicos: {
          ...prev.antecedentesAlergicos,
          [field]: value
        }
      }));
    }
  };

  const handleAntecedenteQuirurgicoChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      antecedentesQuirurgicos: {
        ...prev.antecedentesQuirurgicos,
        [field]: value
      }
    }));
  };

  const handleAntecedenteHemorragicoChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      antecedentesHemorragicos: {
        ...prev.antecedentesHemorragicos,
        [field]: value
      }
    }));
  };

  const handleInterrogatorioChange = (system: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      interrogatorioSistemas: {
        ...prev.interrogatorioSistemas,
        [system]: value
      }
    }));
  };

  const handleExploracionFisicaChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        exploracionFisica: {
          ...prev.exploracionFisica,
          [parent]: {
            ...prev.exploracionFisica?.[parent],
            [child]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        exploracionFisica: {
          ...prev.exploracionFisica,
          [field]: value
        }
      }));
    }
  };

  const handleExamenCabezaChange = (part: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      examenCabeza: {
        ...prev.examenCabeza,
        [part]: value
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

  const toggleService = (service: string) => {
    setFormData(prev => {
      const currentServices = [...prev.antecedentesPersonalesNoPatologicos.servicios];
      
      if (service === 'todos') {
        const allServices = ['agua', 'luz', 'drenaje', 'transporte', 'internet', 'gas'];
        const hasAllServices = allServices.every(s => currentServices.includes(s));
        
        return {
          ...prev,
          antecedentesPersonalesNoPatologicos: {
            ...prev.antecedentesPersonalesNoPatologicos,
            servicios: hasAllServices ? [] : allServices
          }
        };
      }
      
      const updatedServices = currentServices.includes(service)
        ? currentServices.filter(s => s !== service)
        : [...currentServices, service];
        
      return {
        ...prev,
        antecedentesPersonalesNoPatologicos: {
          ...prev.antecedentesPersonalesNoPatologicos,
          servicios: updatedServices
        }
      };
    });
  };

  const guardarFormulario = (data: FormDataState, nombre: string) => {
    if (!nombre.trim()) return;
    localStorage.setItem(`formulario_${nombre}`, JSON.stringify(data));
  };

  const cargarFormulario = (data: FormDataState | null) => {
    if (data === null) {
      setFormData(getInitialFormState());
      setResumen('');
    } else {
      setFormData(data);
    }
  };

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
    handleAntecedenteChange,
    handleAntecedentePatologicoChange,
    handleAntecedenteAlergicoChange,
    handleAntecedenteQuirurgicoChange,
    handleAntecedenteHemorragicoChange,
    handleInterrogatorioChange,
    handleExploracionFisicaChange,
    handleExamenCabezaChange,
    toggleService,
    generarResumen,
    guardarFormulario,
    cargarFormulario
  };
};
