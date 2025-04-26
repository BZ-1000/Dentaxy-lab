import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { generateMedicalReport } from '@/services/geminiService';
import { FormDataState } from '@/types/historiaClinica';
import { getInitialFormState } from '@/utils/initialFormState';

export const useHistoriaClinica = () => {
  const { toast } = useToast();
  const [resumen, setResumen] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<FormDataState>(() => {
    // Try to load form data from sessionStorage first (for tab switching persistence)
    const savedSessionData = sessionStorage.getItem('current_form_data');
    if (savedSessionData) {
      try {
        return JSON.parse(savedSessionData);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
        return getInitialFormState();
      }
    }
    return getInitialFormState();
  });

  // Save form data to sessionStorage whenever it changes
  useEffect(() => {
    try {
      sessionStorage.setItem('current_form_data', JSON.stringify(formData));
    } catch (error) {
      console.error('Error saving form data to sessionStorage:', error);
    }
  }, [formData]);

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
    // Get a fresh initial state
    const initialState = getInitialFormState();
    
    // Clear form data
    setFormData(initialState);
    setResumen('');
    
    // Clear sessionStorage
    sessionStorage.removeItem('current_form_data');
    
    // Clear all patient-specific data from localStorage
    // This will only clear forms created with the current app instance
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('formulario_')) {
        keysToRemove.push(key);
      }
    }
    
    // Remove all the keys in a second pass to avoid index issues while iterating
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('Formulario reiniciado correctamente');
  };

  const guardarFormulario = (data: FormDataState, nombre: string) => {
    if (!nombre.trim()) return;
    
    // Asegurar que se guarden completos los valores de localizacion y causaProvocado
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
    
    // Save to localStorage (for persistence between sessions)
    localStorage.setItem(`formulario_${nombre}`, JSON.stringify(formDataToSave));
    
    // Also update sessionStorage (for tab switching persistence)
    sessionStorage.setItem('current_form_data', JSON.stringify(formDataToSave));
  };

  const cargarFormulario = (data: FormDataState | null) => {
    if (data === null) {
      const initialState = getInitialFormState();
      setFormData(initialState);
      setResumen('');
      sessionStorage.removeItem('current_form_data');
    } else {
      setFormData(data);
      sessionStorage.setItem('current_form_data', JSON.stringify(data));
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
