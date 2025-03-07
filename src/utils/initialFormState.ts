
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
  antecedentesPersonalesNoPatologicos: {
    tipoVivienda: "",
    materialVivienda: "",
    servicios: [],
    condicionCalle: "",
    iluminacionCalle: "",
    frecuenciaLimpieza: "",
    cambioRopaCama: "",
    hacinamiento: "",
    promiscuidad: "",
    mascotas: "",
    manejoResiduos: "",
    frecuenciaBano: "",
    lavadoManos: [],
    cambioRopa: "",
    frecuenciaCepillado: "",
    tecnicaCepillado: "",
    auxiliaresBucales: [],
    ultimaVisitaOdontologo: "",
    problemasBucales: [],
    alimentosConsumidos: [],
    frecuenciaFrutasVerduras: "",
    frecuenciaBebidasAzucaradas: "",
    frecuenciaComidaChatarra: "",
    consumoAgua: "",
    numeroComidas: "",
    horarioComidas: {
      desayuno: "",
      almuerzo: "",
      cena: ""
    },
    ayunoProlongado: ""
  },
  antecedentesPersonalesPatologicos: {
    enfermedadesCronicas: {
      tiene: false,
      descripcion: "",
      control: "",
      apegoTratamiento: ""
    },
    hospitalizaciones: {
      ha_sido_hospitalizado: false,
      numero: 0,
      motivo_ultimo: "",
      fecha_ultimo: ""
    }
  },
  antecedentesAlergicos: {
    medicamentos: {
      es_alergico: false,
      cuales: "",
      tipo_reaccion: "",
      severidad: ""
    },
    alimentos: {
      es_alergico: false,
      cuales: ""
    },
    latex: {
      es_alergico: false,
      descripcion_reaccion: ""
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
