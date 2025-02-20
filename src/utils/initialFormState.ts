
import { FormDataState } from '@/types/historiaClinica';

export const getInitialFormState = (): FormDataState => ({
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
    padre: getInitialFamiliarState(),
    madre: getInitialFamiliarState(),
    abueloPaterno: getInitialFamiliarState(),
    abuelaPaterna: getInitialFamiliarState(),
    abueloMaterno: getInitialFamiliarState(),
    abuelaMaterna: getInitialFamiliarState()
  },
  serviciosDomiciliarios: {
    tipoVivienda: '',
    materialVivienda: '',
    condicionesCalle: '',
    iluminacionCalle: '',
    servicios: {
      agua: false,
      luz: false,
      drenaje: false,
      transporte: false,
      internet: false,
      gas: false
    }
  },
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
    auxiliares: {
      hiloDental: false,
      enjuagueBucal: false,
      irrigador: false,
      noUsa: false
    },
    problemas: {
      sangradoEncias: false,
      caries: false,
      malAliento: false,
      dolor: false,
      sinProblemas: false
    }
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
  imc: '',
  talla: '',
  presionArterial: '',
  pulso: '',
  frecuenciaCardiaca: '',
  frecuenciaRespiratoria: '',
  temperatura: '',
  diagnosticos: '',
  pronosticos: ''
});

const getInitialFamiliarState = () => ({
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
});
