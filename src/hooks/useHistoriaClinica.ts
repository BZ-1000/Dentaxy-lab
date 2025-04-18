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
  
  // New handlers for the added sections
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
    setFormData(getInitialFormState());
    setResumen('');
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
    } else {
      setFormData(data);
    }
  };

const generateSystemDescription = (sistema: string, datos: any) => {
  switch (sistema) {
    case 'digestivo':
      const digestiveSymptoms = [
        'distensión abdominal',
        'estreñimiento',
        'plenitud posprandial',
        'pirosis',
        'dolor abdominal',
        'náusea',
        'vómito',
        'reflujo'
      ];
      
      const selectedSymptoms = digestiveSymptoms.filter(symptom => datos[symptom]);
      
      return `A la exploración del sistema digestivo, ${datos.dieta ? 
        `el paciente mantiene una dieta ${datos.dieta}. ` : 
        'no especifica régimen dietético particular. '}${
        datos.masticacion ? 
        `Presenta un patrón de masticación ${datos.masticacion}. ` : 
        ''}${
        datos.salivacion ? 
        `Se observa salivación ${datos.salivacion}. ` : 
        ''}${
        datos.deglucion ? 
        `En cuanto a la deglución, ${datos.deglucion}. ` : 
        ''}${
        datos.halitosis ? 
        'Se detecta halitosis. ' : 
        'No se detecta halitosis. '}${
        selectedSymptoms.length > 0 ? 
        `El paciente refiere ${selectedSymptoms.join(', ')}. ` :
        'El paciente niega alteraciones digestivas (se interrogaron específicamente: distensión abdominal, estreñimiento, plenitud posprandial, pirosis, dolor abdominal, náusea, vómito y reflujo). '}${
        datos.evacuaciones ? 
        `Refiere ${datos.evacuaciones} evacuaciones diarias.` : 
        ''}`

    case 'respiratorio':
      const respiratorySymptoms = datos.sintomas || [];
      return `Al interrogatorio del sistema respiratorio, ${
        datos.tipoRespiracion ? 
        `se observa respiración de tipo ${datos.tipoRespiracion}. ` : 
        'no se especifica el tipo de respiración. '}${
        respiratorySymptoms.length > 0 ? 
        `El paciente presenta ${respiratorySymptoms.join(', ')}. ` :
        'El paciente niega alteraciones respiratorias (se interrogaron específicamente: disnea, tos, expectoración, hemoptisis y dolor torácico). '}`

    case 'cardiovascular':
      const cardiacSymptoms = datos.sintomas || [];
      return `En la evaluación cardiovascular, ${
        datos.dolorPrecordial ? 
        'el paciente refiere dolor precordial. ' : 
        'no refiere dolor precordial. '}${
        datos.lipotimia ? 
        'Ha presentado episodios de lipotimia. ' : 
        'Niega episodios de lipotimia. '}${
        datos.ritmoCardiaco ? 
        `Se observa ritmo cardíaco ${datos.ritmoCardiaco}. ` : 
        ''}${
        cardiacSymptoms.length > 0 ? 
        `Presenta ${cardiacSymptoms.join(', ')}. ` :
        'El paciente niega alteraciones cardiovasculares (se interrogaron específicamente: palpitaciones, disnea paroxística nocturna, edema y claudicación intermitente). '}`

    case 'urinario':
      const urinarySymptoms = datos.sintomas || [];
      return `En la evaluación del sistema genitourinario, ${
        datos.frecuenciaUrinaria ? 
        `el paciente refiere una frecuencia miccional de ${datos.frecuenciaUrinaria} veces al día. ` : 
        'no especifica frecuencia miccional. '}${
        urinarySymptoms.length > 0 ? 
        `Presenta ${urinarySymptoms.join(', ')}. ` :
        'El paciente niega alteraciones genitourinarias (se interrogaron específicamente: disuria, poliuria, nicturia, hematuria y urgencia miccional). '}`

    case 'endocrino':
      const endocrineSymptoms = datos.sintomas || [];
      return `En la evaluación del sistema endocrino, ${
        datos.metabolismo ? 
        `el paciente refiere ${datos.metabolismo}. ` : 
        ''}${
        datos.termoquimica ? 
        `Presenta ${datos.termoquimica}. ` : 
        ''}${
        endocrineSymptoms.length > 0 ? 
        `Se identifican ${endocrineSymptoms.join(', ')}. ` :
        'El paciente niega alteraciones endocrinas (se interrogaron específicamente: polidipsia, polifagia, diaforesis y cambios de peso significativos). '}${
        datos.patologias ? 
        `Antecedentes patológicos: ${datos.patologias}.` : 
        'Sin antecedentes patológicos relevantes.'}`

    case 'tegumentario':
      const skinSymptoms = datos.sintomas || [];
      return `En la exploración del sistema tegumentario, ${
        datos.coloracion ? 
        'se observan cambios en la coloración de la piel. ' : 
        'no se observan cambios en la coloración de la piel. '}${
        skinSymptoms.length > 0 ? 
        `El paciente presenta ${skinSymptoms.join(', ')}. ` :
        'El paciente niega alteraciones cutáneas (se interrogaron específicamente: prurito, lesiones, cambios de coloración y alteraciones en anexos cutáneos). '}`

    case 'musculoEsqueletico':
      const musculoskeletalSymptoms = datos.sintomas || [];
      return `En la evaluación del sistema músculo-esquelético, ${
        datos.fracturas ? 
        'el paciente refiere antecedentes de fracturas o esguinces. ' : 
        'el paciente niega antecedentes de fracturas o esguinces. '}${
        musculoskeletalSymptoms.length > 0 ? 
        `Presenta ${musculoskeletalSymptoms.join(', ')}. ` :
        'El paciente niega alteraciones músculo-esqueléticas actuales (se interrogaron específicamente: dolor articular, rigidez, limitación funcional y debilidad muscular). '}`

    case 'nervioso':
      return `En la evaluación del sistema nervioso, ${
        datos.percepcionSensorial ? 
        'el paciente refiere alteraciones en la percepción sensorial. ' : 
        'no refiere alteraciones en la percepción sensorial. '}${
        datos.horasSueno ? 
        `Reporta un patrón de sueño de ${datos.horasSueno} horas por noche. ` : 
        'No especifica patrón de sueño. '}${
        datos.trastornosSueno ? 
        'Presenta trastornos del sueño. ' : 
        'Niega trastornos del sueño. '}${
        datos.caracter ? 
        `Su carácter se describe como ${datos.caracter}. ` : 
        ''}${
        datos.parestesias ? 
        'Refiere parestesias. ' : 
        'Niega parestesias o alteraciones de la sensibilidad.'}`

    default:
      return '';
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
