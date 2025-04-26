import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { generateMedicalReport } from '@/services/geminiService';
import { FormDataState } from '@/types/historiaClinica';
import { getInitialFormState } from '@/utils/initialFormState';

export const useHistoriaClinica = () => {
  const { toast } = useToast();
  const [resumen, setResumen] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTab, setCurrentTab] = useState<string | null>("InformacionPrincipal");
  const [completedSections, setCompletedSections] = useState<Record<string, { completed: boolean }>>({});
  const [formData, setFormData] = useState<FormDataState>(() => {
    const savedData = localStorage.getItem('currentFormData');
    return savedData ? JSON.parse(savedData) : getInitialFormState();
  });

  // Persistir cambios en formData
  useEffect(() => {
    localStorage.setItem('currentFormData', JSON.stringify(formData));
  }, [formData]);

  // Restaurar datos al volver a la pestaña
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const savedData = localStorage.getItem('currentFormData');
        if (savedData) {
          setFormData(JSON.parse(savedData));
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const updateSection = (sectionName: string, completed: boolean) => {
    setCompletedSections(prev => ({
      ...prev,
      [sectionName]: { completed }
    }));
  };
  
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
    updateSection("PadecimientoActual", true);
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
      // Asegurar que causaProvocado se guarde correctamente
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
    updateSection("PadecimientoActual", true);
  };

  const handleSinSintomasChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      padecimientoActual: {
        ...prev.padecimientoActual,
        sinSintomas: checked
      }
    }));
    updateSection("PadecimientoActual", true);
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
    updateSection("AntecedentesHeredoFamiliares", true);
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
    updateSection("AntecedentesHeredoFamiliares", true);
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
    updateSection("AntecedentesPersonalesNoPatologicos", true);
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
    updateSection("AntecedentesPersonalesPatologicos", true);
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
    updateSection("AntecedentesAlergicos", true);
  };

  const handleAntecedenteQuirurgicoChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      antecedentesQuirurgicos: {
        ...prev.antecedentesQuirurgicos,
        [field]: value
      }
    }));
    updateSection("AntecedentesQuirurgicos", true);
  };

  const handleAntecedenteHemorragicoChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      antecedentesHemorragicos: {
        ...prev.antecedentesHemorragicos,
        [field]: value
      }
    }));
    updateSection("AntecedentesHemorragicos", true);
  };

  const handleAntecedenteGinecoObstetricoChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      antecedentesGinecoObstetricos: {
        ...prev.antecedentesGinecoObstetricos,
        [field]: value
      }
    }));
    updateSection("AntecedentesGinecoObstetricos", true);
  };

  const handleInterrogatorioChange = (system: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      interrogatorioSistemas: {
        ...prev.interrogatorioSistemas,
        [system]: value
      }
    }));
    updateSection("InterrogatorioSistemas", true);
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
    updateSection("ExploracionFisica", true);
  };

  const handleExamenCabezaChange = (part: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      examenCabeza: {
        ...prev.examenCabeza,
        [part]: value
      }
    }));
    updateSection("ExamenCabeza", true);
  };
  
  // New handlers for the added sections
  const handleArticulacionCraneomandibularChange = (part: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      articulacionCraneomandibular: {
        ...prev.articulacionCraneomandibular,
        [part]: value
      }
    }));
    updateSection("ArticulacionCraneomandibular", true);
  };

  const handleExamenCuelloChange = (part: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      examenCuello: {
        ...prev.examenCuello,
        [part]: value
      }
    }));
    updateSection("ExamenCuello", true);
  };

  const handleExamenIntrabucalChange = (part: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      examenIntrabucal: {
        ...prev.examenIntrabucal,
        [part]: value
      }
    }));
    updateSection("ExamenIntrabucal", true);
  };

  const handleGlandulasSalivalesChange = (part: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      glandulasSalivales: {
        ...prev.glandulasSalivales,
        [part]: value
      }
    }));
    updateSection("GlandulasSalivales", true);
  };

  const handleOclusionChange = (part: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      oclusion: {
        ...prev.oclusion,
        [part]: value
      }
    }));
    updateSection("Oclusion", true);
  };

  const handleRelacionDientesChange = (part: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      relacionDientes: {
        ...prev.relacionDientes,
        [part]: value
      }
    }));
    updateSection("RelacionDientes", true);
  };

  const handleLineaMediaChange = (part: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      lineaMedia: {
        ...prev.lineaMedia,
        [part]: value
      }
    }));
    updateSection("LineaMedia", true);
  };

  const handleFrenillosChange = (part: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      frenillos: {
        ...prev.frenillos,
        [part]: value
      }
    }));
    updateSection("Frenillos", true);
  };

  const handleDiagnosticoChange = (part: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      diagnostico: {
        ...prev.diagnostico,
        [part]: value
      }
    }));
    updateSection("Diagnostico", true);
  };

  const handlePronosticoChange = (part: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      pronostico: {
        ...prev.pronostico,
        [part]: value
      }
    }));
    updateSection("Pronostico", true);
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
      updateSection("ResumenHistoriaClinica", true);
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
    updateSection("AntecedentesPersonalesNoPatologicos", true);
  };

  const resetFormulario = () => {
    setFormData(getInitialFormState());
    setResumen('');
    setCompletedSections({});
    localStorage.removeItem('currentFormData');
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
    
    localStorage.setItem(`formulario_${nombre}`, JSON.stringify(formDataToSave));
  };

  const cargarFormulario = (data: FormDataState | null) => {
    if (data === null) {
      setFormData(getInitialFormState());
      setResumen('');
      setCompletedSections({});
    } else {
      setFormData(data);
      // Mark all sections as completed if data is loaded
      const sections = [
        "InformacionPrincipal", "PadecimientoActual", "AntecedentesHeredoFamiliares", 
        "AntecedentesPersonalesNoPatologicos", "AntecedentesPersonalesPatologicos", 
        "AntecedentesAlergicos", "AntecedentesQuirurgicos", "AntecedentesHemorragicos", 
        "AntecedentesGinecoObstetricos", "InterrogatorioSistemas", "ExamenCabeza", 
        "ArticulacionCraneomandibular", "ExamenCuello", "ExamenIntrabucal", 
        "GlandulasSalivales", "Oclusion", "RelacionDientes", "LineaMedia", 
        "Frenillos", "Diagnostico", "Pronostico"
      ];
      
      const newCompletedSections = {};
      sections.forEach(section => {
        newCompletedSections[section] = { completed: true };
      });
      
      setCompletedSections(newCompletedSections);
    }
  };

  return {
    formData,
    currentFormData: formData,
    resumen,
    isGenerating,
    currentTab,
    setCurrentTab,
    completedSections,
    updateSection,
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
