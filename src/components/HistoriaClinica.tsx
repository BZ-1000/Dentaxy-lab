import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import InformacionGeneral from './historia-clinica/InformacionGeneral';
import PadecimientoActual from './historia-clinica/PadecimientoActual';
import AntecedentesHeredoFamiliares from './historia-clinica/AntecedentesHeredoFamiliares';
import AntecedentesPersonalesNoPatologicos from './historia-clinica/AntecedentesPersonalesNoPatologicos';
import SignosVitales from './historia-clinica/SignosVitales';
import DiagnosticoPronostico from './historia-clinica/DiagnosticoPronostico';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useTheme } from '@/hooks/use-theme';
import { generateMedicalReport } from '@/services/geminiService';
import { Loader2 } from "lucide-react";

const HistoriaClinica = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [resumen, setResumen] = useState<string>('');
  const [formData, setFormData] = useState({
    // Información General
    fechaCreacion: '',
    autorizo: '',
    pacienteId: '',
    pacienteNombre: '',
    alumno: '',
    
    // A. General
    padecimientoActual: {
      sinSintomas: false,
      fechaAparicion: '',
      evolucion: '',
      estadoActual: '',
      dolor: {
        fechaInicio: '',
        condicionAparicion: '', // 'provocado' | 'espontaneo'
        frecuencia: '', // 'intermitente' | 'continuo'
        caracter: '', // 'pulsatil' | 'sordo' | 'quemante' | 'opresivo'
        localizacion: {
          tipo: '', // 'localizado' | 'irradiado'
          descripcion: ''
        },
        atenuacion: ''
      }
    },
    
    // Antecedentes Heredo Familiares
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
    
    // A.1 Antecedentes Personales No Patológicos
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
    
    // A.2 Antecedentes Personales Patológicos
    nutricionales: '',
    cardiacos: '',
    hepaticos: '',
    enfermedadesTransmisionSexual: '',
    
    // A.3 Antecedentes Alérgicos
    alergias: '',
    anestesia: '',
    reaccionesAdversas: '',
    adicciones: '',
    
    // A.4 Antecedentes Médicos y Quirúrgicos
    tratamientoReciente: '',
    hospitalizacionReciente: '',
    medicamentosActuales: '',
    
    // A.5 Antecedentes Hemorrágicos
    transfusiones: '',
    
    // A.6 Antecedentes Gineco-Obstétricos
    embarazos: '',
    partos: '',
    cesareas: '',
    abortos: '',
    complicaciones: '',
    
    // B. Interrogatorio por Aparatos y Sistemas
    digestivo: {
      dieta: '',
      masticacion: '',
      alteracionesGusto: '',
      dificultadesDeglutir: '',
      problemasGastricos: '',
      evacuaciones: '',
    },
    respiratorio: {
      tipoRespiracion: '',
      problemaRespiratorio: '',
      dolorToracico: '',
    },
    cardiovascular: {
      dolorPrecordial: '',
      lipotimia: '',
      taquicardia: '',
      observaciones: '',
    },
    
    // C. Exploración Física
    peso: '',
    imc: '',
    talla: '',
    presionArterial: '',
    pulso: '',
    frecuenciaCardiaca: '',
    frecuenciaRespiratoria: '',
    temperatura: '',
    
    // D. Articulación Craneomandibular
    dolorMasticar: '',
    dificultadHablar: '',
    ruidoArticular: '',
    patronAbertura: '',
    observacionesArticulacion: '',
    
    // E. Examen Intrabucal
    mucosas: {
      mejillas: '',
      lengua: '',
      pisoBoca: '',
      regionRetromolar: '',
      paladar: '',
      orofaringe: '',
      encias: '',
      istmoFauces: '',
    },
    
    // Diagnóstico y Pronóstico
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

  const [isGenerating, setIsGenerating] = useState(false);

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

  return (
    <div className={`${theme} min-h-screen`}>
      <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200`}>
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-6">
            <InformacionGeneral 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />
            
            <PadecimientoActual 
              formData={formData}
              handlePadecimientoChange={handlePadecimientoChange}
              handleDolorChange={handleDolorChange}
              handleSinSintomasChange={handleSinSintomasChange}
            />
            
            <AntecedentesHeredoFamiliares 
              formData={formData}
              handleFamiliarChange={handleFamiliarChange}
              handleCondicionChange={handleCondicionChange}
            />

            <AntecedentesPersonalesNoPatologicos
              formData={formData}
              handleInputChange={handleInputChange}
            />
            
            <SignosVitales 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />
            
            <DiagnosticoPronostico 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />

            <div className="flex justify-center pt-6">
              <Button 
                onClick={generarResumen}
                disabled={isGenerating}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-200 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando Historia Clínica...
                  </>
                ) : (
                  'Generar Historia Clínica con IA'
                )}
              </Button>
            </div>
          </div>

          {resumen && (
            <div className="mt-8 animate-fade-in">
              <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90 transition-colors duration-200`}>
                <h2 className={`text-2xl font-semibold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                  Historia Clínica Generada con IA
                </h2>
                <div className="prose dark:prose-invert max-w-none">
                  <pre className={`whitespace-pre-line ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} p-6 rounded-lg text-sm transition-colors duration-200`}>
                    {resumen}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default HistoriaClinica;