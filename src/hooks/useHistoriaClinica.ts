import { useState, useCallback } from 'react';
import { FormDataState, Familiar } from '@/types/historiaClinica';
import { getInitialFormState } from '@/utils/initialFormState';

export const useHistoriaClinica = () => {
  const [formData, setFormData] = useState<FormDataState>(getInitialFormState());
  const [resumen, setResumen] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleInputChange = useCallback((section: keyof FormDataState, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  }, []);

  const handlePadecimientoChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      padecimientoActual: {
        ...prev.padecimientoActual,
        [field]: value
      }
    }));
  }, []);

  const handleDolorChange = useCallback((field: string, value: any) => {
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
  }, []);

  const handleSinSintomasChange = useCallback((value: boolean) => {
    setFormData(prev => ({
      ...prev,
      padecimientoActual: {
        ...prev.padecimientoActual,
        sinSintomas: value,
        motivoConsulta: value ? '' : prev.padecimientoActual.motivoConsulta,
        historiaPadecimiento: value ? '' : prev.padecimientoActual.historiaPadecimiento
      }
    }));
  }, []);

  const handleFamiliarChange = useCallback((familiar: keyof FormDataState['antecedentesHeredoFamiliares'], field: keyof Familiar, value: any) => {
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
  }, []);

  const handleCondicionChange = useCallback((familiar: keyof FormDataState['antecedentesHeredoFamiliares'], condicion: keyof Familiar['condiciones'], value: boolean | string) => {
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
  }, []);

  const handleAntecedenteChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      antecedentesPersonalesNoPatologicos: {
        ...prev.antecedentesPersonalesNoPatologicos,
        [field]: value
      }
    }));
  }, []);

  const handleAntecedentePatologicoChange = useCallback((group: keyof FormDataState['antecedentesPersonalesPatologicos'], condition: string, value: boolean | string) => {
    setFormData(prev => ({
      ...prev,
      antecedentesPersonalesPatologicos: {
        ...prev.antecedentesPersonalesPatologicos,
        [group]: {
          ...prev.antecedentesPersonalesPatologicos[group],
          [condition]: value
        }
      }
    }));
  }, []);

  const handleAntecedenteAlergicoChange = useCallback((path: string, value: any) => {
    setFormData(prev => {
      const pathParts = path.split('.');
      let current = { ...prev.antecedentesAlergicos };
      for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]] = { ...current[pathParts[i]] };
      }
      current[pathParts[pathParts.length - 1]] = value;
      return {
        ...prev,
        antecedentesAlergicos: {
          ...prev.antecedentesAlergicos,
          ...current
        }
      };
    });
  }, []);

  const handleAntecedenteQuirurgicoChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      antecedentesQuirurgicos: {
        ...prev.antecedentesQuirurgicos,
        [field]: value
      }
    }));
  }, []);

  const handleAntecedenteHemorragicoChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      antecedentesHemorragicos: {
        ...prev.antecedentesHemorragicos,
        [field]: value
      }
    }));
  }, []);

  const handleAntecedenteGinecoObstetricoChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      antecedentesGinecoObstetricos: {
        ...prev.antecedentesGinecoObstetricos,
        [field]: value
      }
    }));
  }, []);

  const handleInterrogatorioChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      interrogatorioSistemas: {
        ...prev.interrogatorioSistemas,
        [field]: value
      }
    }));
  }, []);

  const handleExploracionFisicaChange = useCallback((group: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      exploracionFisica: {
        ...prev.exploracionFisica,
        [group]: {
          ...prev.exploracionFisica[group],
          [field]: value
        }
      }
    }));
  }, []);

  const handleExamenCabezaChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      examenCabeza: {
        ...prev.examenCabeza,
        [field]: value
      }
    }));
  }, []);

  const handleArticulacionCraneomandibularChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      articulacionCraneomandibular: {
        ...prev.articulacionCraneomandibular,
        [field]: value
      }
    }));
  }, []);

  const handleExamenCuelloChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      examenCuello: {
        ...prev.examenCuello,
        [field]: value
      }
    }));
  }, []);

  const handleExamenIntrabucalChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      examenIntrabucal: {
        ...prev.examenIntrabucal,
        [field]: value
      }
    }));
  }, []);

  const handleGlandulasSalivalesChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      glandulasSalivales: {
        ...prev.glandulasSalivales,
        [field]: value
      }
    }));
  }, []);

  const handleOclusionChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      oclusion: {
        ...prev.oclusion,
        [field]: value
      }
    }));
  }, []);

  const handleRelacionDientesChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      relacionDientes: {
        ...prev.relacionDientes,
        [field]: value
      }
    }));
  }, []);

  const handleLineaMediaChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      lineaMedia: {
        ...prev.lineaMedia,
        [field]: value
      }
    }));
  }, []);

  const handleFrenillosChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      frenillos: {
        ...prev.frenillos,
        [field]: value
      }
    }));
  }, []);

  const handleDiagnosticoChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      diagnostico: {
        ...prev.diagnostico,
        [field]: value
      }
    }));
  }, []);

  const handlePronosticoChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      pronostico: {
        ...prev.pronostico,
        [field]: value
      }
    }));
  }, []);

  const toggleService = useCallback((service: string) => {
    setFormData(prev => {
      const servicios = [...prev.antecedentesPersonalesNoPatologicos.servicios];
      const index = servicios.indexOf(service);
      if (index === -1) {
        servicios.push(service);
      } else {
        servicios.splice(index, 1);
      }
      return {
        ...prev,
        antecedentesPersonalesNoPatologicos: {
          ...prev.antecedentesPersonalesNoPatologicos,
          servicios: servicios
        }
      };
    });
  }, []);

  const generarResumen = useCallback(async () => {
    setIsGenerating(true);
    // Simulación de llamada a API
    await new Promise(resolve => setTimeout(resolve, 2000));
    setResumen('Resumen generado exitosamente.');
    setIsGenerating(false);
  }, []);

  const guardarFormulario = useCallback((data: FormDataState, nombre: string) => {
    localStorage.setItem(`form_${nombre}`, JSON.stringify(data));
  }, []);

  const cargarFormulario = useCallback((data: FormDataState | null) => {
    if (data) {
      setFormData(data);
    } else {
      setFormData(getInitialFormState());
    }
  }, []);

  const resetFormulario = useCallback(() => {
    setFormData(getInitialFormState());
  }, []);

  const handleHorarioComidaChange = (meal: string, time: string) => {
    setFormData(prev => ({
      ...prev,
      antecedentesPersonalesNoPatologicos: {
        ...prev.antecedentesPersonalesNoPatologicos,
        horarioComidas: {
          ...prev.antecedentesPersonalesNoPatologicos.horarioComidas,
          [meal]: time
        }
      }
    }));
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
    resetFormulario,
    handleHorarioComidaChange,
  };
};
