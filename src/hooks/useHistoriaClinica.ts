import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { generateMedicalReport } from '@/services/geminiService';
import { FormDataState } from '@/types/historiaClinica';
import { getInitialFormState } from '@/utils/initialFormState';

const AUTO_SAVE_KEY = 'formDataAutoSave';

export const useHistoriaClinica = () => {
  const { toast } = useToast();
  const [resumen, setResumen] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize with a clean state always
  const [formData, setFormData] = useState<FormDataState>(getInitialFormState());

  // Clear localStorage and reset form when component mounts
  useEffect(() => {
    localStorage.removeItem(AUTO_SAVE_KEY);
    setFormData(getInitialFormState());
  }, []);

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
    } else if (field === 'causaProvocado') {
      setFormData(prev => ({
        ...prev,
        padecimientoActual: {
          ...prev.padecimientoActual,
          dolor: {
            ...prev.padecimientoActual.dolor,
            causaProvocado: value
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

  const handleAntecedenteGinecoObstetricoChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      antecedentesGinecoObstetricos: {
        ...prev.antecedentesGinecoObstetricos,
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
  
  const handleArticulacionCraneomandibularChange = (part: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      articulacionCraneomandibular: {
        ...prev.articulacionCraneomandibular,
        [part]: value
      }
    }));
  };

  const handleExamenCuelloChange = (part: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      examenCuello: {
        ...prev.examenCuello,
        [part]: value
      }
    }));
  };

  const handleExamenIntrabucalChange = (part: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      examenIntrabucal: {
        ...prev.examenIntrabucal,
        [part]: value
      }
    }));
  };

  const handleGlandulasSalivalesChange = (part: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      glandulasSalivales: {
        ...prev.glandulasSalivales,
        [part]: value
      }
    }));
  };

  const handleOclusionChange = (part: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      oclusion: {
        ...prev.oclusion,
        [part]: value
      }
    }));
  };

  const handleRelacionDientesChange = (part: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      relacionDientes: {
        ...prev.relacionDientes,
        [part]: value
      }
    }));
  };

  const handleLineaMediaChange = (part: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      lineaMedia: {
        ...prev.lineaMedia,
        [part]: value
      }
    }));
  };

  const handleFrenillosChange = (part: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      frenillos: {
        ...prev.frenillos,
        [part]: value
      }
    }));
  };

  const handleDiagnosticoChange = (part: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      diagnostico: {
        ...prev.diagnostico,
        [part]: value
      }
    }));
  };

  const handlePronosticoChange = (part: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      pronostico: {
        ...prev.pronostico,
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

  const resetFormulario = () => {
    const initialState = getInitialFormState();
    setFormData(initialState);
    setResumen('');
    localStorage.removeItem(AUTO_SAVE_KEY);
    
    toast({
      title: "Formulario reiniciado",
      description: "El formulario ha sido restablecido a su estado inicial.",
    });
  };

  const guardarFormulario = (data: FormDataState, nombre: string) => {
    if (!nombre.trim()) return;
    
    const formDataToSave = {
      ...data,
      padecimientoActual: {
        ...data.padecimientoActual,
        dolor: {
          ...data.padecimientoActual.dolor,
          localizacion: data.padecimientoActual.dolor.localizacion || { tipo: '', descripcion: '' },
          causaProvocado: data.padecimientoActual.dolor.causaProvocado || ''
        }
      }
    };
    
    localStorage.setItem(`formulario_${nombre}`, JSON.stringify(formDataToSave));
  };

  const cargarFormulario = (data: FormDataState | null) => {
    if (data === null) {
      const initialState = getInitialFormState();
      setFormData(initialState);
      setResumen('');
      
      // Clear auto-save to ensure fresh state on next reload
      localStorage.removeItem(AUTO_SAVE_KEY);
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
    handleAntecedenteGinecoObstetricoChange,
    handleInterrogatorioChange,
    handleExploracionFisicaChange,
    handleExamenCabezaChange,
    handleArticulacionCraneomandibularChange,
    handleExamenCuelloChange,
    handleExamenIntrabucalChange,
    handleGlandulasSalivalesChange,
    handleOclusionChange,
    handleRelacionDientesChange,
    handleLineaMediaChange,
    handleFrenillosChange,
    handleDiagnosticoChange,
    handlePronosticoChange,
    toggleService,
    generarResumen,
    guardarFormulario,
    cargarFormulario,
    resetFormulario
  };
};
