import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { generateMedicalReport } from '@/services/geminiService';

export interface Familiar {
  finado: boolean;
  causaMuerte: string;
  condiciones: {
    diabetesMellitus: boolean;
    hipertensionArterial: boolean;
    osteoporosis: boolean;
    artritisReumatoide: boolean;
    parkinson: boolean;
    alzheimer: boolean;
    asma: boolean;
    cancer: boolean;
    anemia: boolean;
    otras: string;
  };
}

export interface FormDataState {
  padecimientoActual: {
    sinSintomas: boolean;
    motivoConsulta: string;
    historiaPadecimiento: string;
    dolor: {
      fechaInicio: string;
      condicionAparicion: string;
      frecuencia: string;
      caracter: string;
      intensidad: string;
      localizacion: {
        tipo: string;
        descripcion: string;
      };
      atenuacion: string;
    };
  };
  antecedentesHeredoFamiliares: {
    padre: Familiar;
    madre: Familiar;
    abueloPaterno: Familiar;
    abuelaPaterna: Familiar;
    abueloMaterno: Familiar;
    abuelaMaterna: Familiar;
  };
  serviciosDomiciliarios: string;
  pisosVivienda: string;
  materialVivienda: string;
  materialPiso: string;
  ventilacion: string;
  frecuenciaLimpieza: string;
  hacinamiento: string;
  frecuenciaBano: string;
  higieneBucal: {
    frecuenciaCepillado: string;
    usoHiloDental: string;
    tipoCerdas: string;
    cantidadPasta: string;
    marcaPasta: string;
  };
  alimentacion: {
    tipoDieta: string;
    frecuenciaComidas: string;
    tiposAlimentos: string;
    saltaComidas: string;
    consumoNutritivo: string;
  };
  grupoSanguineo: string;
  factorRh: string;
  inmunizaciones: string;
  peso: string;
  imc: string;
  talla: string;
  presionArterial: string;
  pulso: string;
  frecuenciaCardiaca: string;
  frecuenciaRespiratoria: string;
  temperatura: string;
  diagnosticos: string;
  pronosticos: string;
}

export const useHistoriaClinica = () => {
  const { toast } = useToast();
  const [resumen, setResumen] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<FormDataState>({
    padecimientoActual: {
      sinSintomas: false,
      motivoConsulta: '',
      historiaPadecimiento: '',
      dolor: {
        fechaInicio: '',
        condicionAparicion: '',
        frecuencia: '',
        caracter: '',
        intensidad: '',
        localizacion: {
          tipo: '',
          descripcion: ''
        },
        atenuacion: ''
      }
    },
    antecedentesHeredoFamiliares: {
      padre: {
        finado: false,
        causaMuerte: '',
        condiciones: {
          diabetesMellitus: false,
          hipertensionArterial: false,
          osteoporosis: false,
          artritisReumatoide: false,
          parkinson: false,
          alzheimer: false,
          asma: false,
          cancer: false,
          anemia: false,
          otras: ''
        }
      },
      madre: {
        finado: false,
        causaMuerte: '',
        condiciones: {
          diabetesMellitus: false,
          hipertensionArterial: false,
          osteoporosis: false,
          artritisReumatoide: false,
          parkinson: false,
          alzheimer: false,
          asma: false,
          cancer: false,
          anemia: false,
          otras: ''
        }
      },
      abueloPaterno: {
        finado: false,
        causaMuerte: '',
        condiciones: {
          diabetesMellitus: false,
          hipertensionArterial: false,
          osteoporosis: false,
          artritisReumatoide: false,
          parkinson: false,
          alzheimer: false,
          asma: false,
          cancer: false,
          anemia: false,
          otras: ''
        }
      },
      abuelaPaterna: {
        finado: false,
        causaMuerte: '',
        condiciones: {
          diabetesMellitus: false,
          hipertensionArterial: false,
          osteoporosis: false,
          artritisReumatoide: false,
          parkinson: false,
          alzheimer: false,
          asma: false,
          cancer: false,
          anemia: false,
          otras: ''
        }
      },
      abueloMaterno: {
        finado: false,
        causaMuerte: '',
        condiciones: {
          diabetesMellitus: false,
          hipertensionArterial: false,
          osteoporosis: false,
          artritisReumatoide: false,
          parkinson: false,
          alzheimer: false,
          asma: false,
          cancer: false,
          anemia: false,
          otras: ''
        }
      },
      abuelaMaterna: {
        finado: false,
        causaMuerte: '',
        condiciones: {
          diabetesMellitus: false,
          hipertensionArterial: false,
          osteoporosis: false,
          artritisReumatoide: false,
          parkinson: false,
          alzheimer: false,
          asma: false,
          cancer: false,
          anemia: false,
          otras: ''
        }
      }
    },
    serviciosDomiciliarios: '',
    pisosVivienda: '',
    materialVivienda: '',
    materialPiso: '',
    ventilacion: '',
    frecuenciaLimpieza: '',
    hacinamiento: '',
    frecuenciaBano: '',
    higieneBucal: {
      frecuenciaCepillado: '',
      usoHiloDental: '',
      tipoCerdas: '',
      cantidadPasta: '',
      marcaPasta: '',
    },
    alimentacion: {
      tipoDieta: '',
      frecuenciaComidas: '',
      tiposAlimentos: '',
      saltaComidas: '',
      consumoNutritivo: '',
    },
    grupoSanguineo: '',
    factorRh: '',
    inmunizaciones: '',
    peso: '',
    imc: '',
    talla: '',
    presionArterial: '',
    pulso: '',
    frecuenciaCardiaca: '',
    frecuenciaRespiratoria: '',
    temperatura: '',
    diagnosticos: '',
    pronosticos: '',
  });

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

  const handleDolorChange = (field: string, value: string) => {
    if (field === 'localizacion') {
      const localizacion = JSON.parse(value);
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
    handlePadecimientoChange,
    handleDolorChange,
    handleSinSintomasChange,
    handleFamiliarChange,
    handleCondicionChange,
    generarResumen
  };
};
