import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedText } from "@/components/ui/animated-text";
import InformacionGeneral from './historia-clinica/InformacionGeneral';
import AntecedentesHeredoFamiliares from './historia-clinica/AntecedentesHeredoFamiliares';
import AntecedentesPersonalesNoPatologicos from './historia-clinica/AntecedentesPersonalesNoPatologicos';
import SignosVitales from './historia-clinica/SignosVitales';
import PadecimientoActual from './historia-clinica/PadecimientoActual';
import DiagnosticoPronostico from './historia-clinica/DiagnosticoPronostico';

const HistoriaClinica = () => {
  const [formData, setFormData] = useState({
    fechaCreacion: '',
    autorizo: '',
    pacienteId: '',
    pacienteNombre: '',
    alumno: '',
    antecedentesHeredoFamiliares: {
      padre: {
        finado: false,
        causaMuerte: '',
        condiciones: {
          diabetesMellitus: false,
          hipertensionArterial: false,
          cancer: false,
          otras: ''
        }
      },
      madre: {
        finado: false,
        causaMuerte: '',
        condiciones: {
          diabetesMellitus: false,
          hipertensionArterial: false,
          cancer: false,
          otras: ''
        }
      },
      abueloPaterno: {
        finado: false,
        causaMuerte: '',
        condiciones: {
          diabetesMellitus: false,
          hipertensionArterial: false,
          cancer: false,
          otras: ''
        }
      },
      abuelaPaterna: {
        finado: false,
        causaMuerte: '',
        condiciones: {
          diabetesMellitus: false,
          hipertensionArterial: false,
          cancer: false,
          otras: ''
        }
      },
      abueloMaterno: {
        finado: false,
        causaMuerte: '',
        condiciones: {
          diabetesMellitus: false,
          hipertensionArterial: false,
          cancer: false,
          otras: ''
        }
      },
      abuelaMaterna: {
        finado: false,
        causaMuerte: '',
        condiciones: {
          diabetesMellitus: false,
          hipertensionArterial: false,
          cancer: false,
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
      marcaPasta: ''
    },
    alimentacion: {
      tipoDieta: '',
      frecuenciaComidas: '',
      tiposAlimentos: '',
      saltaComidas: '',
      consumoNutritivo: ''
    },
    grupoSanguineo: '',
    factorRh: '',
    inmunizaciones: '',
    peso: '',
    talla: '',
    imc: '',
    presionArterial: '',
    pulso: '',
    frecuenciaCardiaca: '',
    frecuenciaRespiratoria: '',
    temperatura: '',
    padecimientoActual: {
      sinSintomas: false,
      fechaAparicion: '',
      evolucion: '',
      estadoActual: '',
      dolor: {
        fechaInicio: '',
        condicionAparicion: '',
        frecuencia: '',
        caracter: '',
        localizacion: {
          tipo: '',
          descripcion: ''
        },
        atenuacion: ''
      }
    },
    diagnosticos: '',
    pronosticos: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="container mx-auto py-8">
      <AnimatedText 
        text="Historia Clínica"
        className="mb-8"
        textClassName="text-4xl text-primary font-margarine font-normal"
        underlineClassName="text-primary"
      />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <InformacionGeneral formData={formData} handleInputChange={handleInputChange} />
        <AntecedentesHeredoFamiliares
          formData={formData}
          handleFamiliarChange={handleFamiliarChange}
          handleCondicionChange={handleCondicionChange}
        />
        <AntecedentesPersonalesNoPatologicos formData={formData} handleInputChange={handleInputChange} />
        <SignosVitales formData={formData} handleInputChange={handleInputChange} />
        <PadecimientoActual
          formData={formData}
          handlePadecimientoChange={handlePadecimientoChange}
          handleDolorChange={handleDolorChange}
          handleSinSintomasChange={handleSinSintomasChange}
        />
        <DiagnosticoPronostico formData={formData} handleInputChange={handleInputChange} />
        
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">Cancelar</Button>
          <Button type="submit">Guardar Historia Clínica</Button>
        </div>
      </form>
    </div>
  );
};

export default HistoriaClinica;