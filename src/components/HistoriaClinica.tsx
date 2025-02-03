import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AnimatedText } from "@/components/ui/animated-underline-text-one";
import InformacionGeneral from './historia-clinica/InformacionGeneral';
import PadecimientoActual from './historia-clinica/PadecimientoActual';
import AntecedentesHeredoFamiliares from './historia-clinica/AntecedentesHeredoFamiliares';
import AntecedentesPersonalesNoPatologicos from './historia-clinica/AntecedentesPersonalesNoPatologicos';
import SignosVitales from './historia-clinica/SignosVitales';
import DiagnosticoPronostico from './historia-clinica/DiagnosticoPronostico';

const HistoriaClinica = () => {
  const { toast } = useToast();
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

  const generarResumen = async () => {
    const resumenGenerado = `
      HISTORIA CLÍNICA
      
      Fecha de creación: ${formData.fechaCreacion}
      Autorizó: ${formData.autorizo}
      Paciente: ${formData.pacienteId} - ${formData.pacienteNombre}
      Alumno: ${formData.alumno}
      
      PADECIMIENTO ACTUAL:
      ${formData.padecimientoActual.sinSintomas ? "Actualmente no refiere sintomatología" : `
      Fecha de aparición: ${formData.padecimientoActual.fechaAparicion}
      Evolución: ${formData.padecimientoActual.evolucion}
      Estado Actual: ${formData.padecimientoActual.estadoActual}
      Dolor: 
        Fecha de inicio: ${formData.padecimientoActual.dolor.fechaInicio}
        Condición de aparición: ${formData.padecimientoActual.dolor.condicionAparicion}
        Frecuencia: ${formData.padecimientoActual.dolor.frecuencia}
        Carácter: ${formData.padecimientoActual.dolor.caracter}
        Localización: ${formData.padecimientoActual.dolor.localizacion.tipo} - ${formData.padecimientoActual.dolor.localizacion.descripcion}
        Atenuación: ${formData.padecimientoActual.dolor.atenuacion}
      `}
      
      ANTECEDENTES HEREDO FAMILIARES:
      Padre: ${formData.antecedentesHeredoFamiliares.padre.finado ? `Finado por: ${formData.antecedentesHeredoFamiliares.padre.causaMuerte}` : `Condiciones: ${Object.entries(formData.antecedentesHeredoFamiliares.padre.condiciones).filter(([key, value]) => value).map(([key]) => key).join(', ')}`}
      Madre: ${formData.antecedentesHeredoFamiliares.madre.finado ? `Finado por: ${formData.antecedentesHeredoFamiliares.madre.causaMuerte}` : `Condiciones: ${Object.entries(formData.antecedentesHeredoFamiliares.madre.condiciones).filter(([key, value]) => value).map(([key]) => key).join(', ')}`}
      
      ANTECEDENTES PERSONALES NO PATOLÓGICOS:
      Servicios Domiciliarios: ${formData.serviciosDomiciliarios}
      Higiene de la Vivienda: ${formData.frecuenciaLimpieza}, Hacinamiento: ${formData.hacinamiento}
      Higiene Personal: ${formData.frecuenciaBano}
      Higiene Bucal: Frecuencia de Cepillado: ${formData.higieneBucal.frecuenciaCepillado}, Uso de Hilo Dental: ${formData.higieneBucal.usoHiloDental}
      Alimentación: Tipo de Dieta: ${formData.alimentacion.tipoDieta}, Frecuencia de Comidas: ${formData.alimentacion.frecuenciaComidas}
      Grupo Sanguíneo: ${formData.grupoSanguineo}, Factor Rh: ${formData.factorRh}
      Inmunizaciones: ${formData.inmunizaciones}
      
      SIGNOS VITALES:
      Peso: ${formData.peso} kg
      Talla: ${formData.talla} m
      IMC: ${formData.imc}
      Presión Arterial: ${formData.presionArterial}
      
      DIAGNÓSTICOS:
      ${formData.diagnosticos}
      
      PRONÓSTICOS:
      ${formData.pronosticos}
    `;
    
    setResumen(resumenGenerado);
    toast({
      title: "Historia Clínica Generada",
      description: "El resumen de la historia clínica ha sido generado exitosamente.",
    });
  };

  const [resumen, setResumen] = useState('');

  return (
    <div className="container mx-auto py-8">
      <AnimatedText 
        text="Historia Clínica"
        className="mb-8"
        textClassName="text-6xl text-primary font-rock3d font-normal"
        underlineClassName="text-primary"
      />
      
      <div className="grid gap-8">
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
      </div>

      <div className="mt-8 flex justify-center">
        <Button 
          onClick={generarResumen}
          className="bg-primary hover:bg-primary/90"
        >
          Generar Historia Clínica
        </Button>
      </div>

      {resumen && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Historia Clínica Generada</h2>
          <div className="whitespace-pre-line bg-gray-50 p-4 rounded-lg">
            {resumen}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoriaClinica;
