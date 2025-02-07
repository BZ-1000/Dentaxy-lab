
import { useState } from 'react';

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
    [key: string]: {
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
    };
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

export const useFormData = () => {
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

  return {
    formData,
    setFormData,
  };
};
