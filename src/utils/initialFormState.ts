
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
    tipoVivienda: 'urbana',
    materialVivienda: 'concreto',
    servicios: {
      agua: false,
      luz: false,
      drenaje: false,
      transporte: false,
      internet: false,
      gas: false
    },
    condicionesCalle: 'pavimentada',
    iluminacionCalle: 'bien-iluminada'
  },
  higieneVivienda: {
    regularidadAseo: 'diario',
    cambioRopaCama: 'semanal',
    hacinamiento: false,
    promiscuidad: false,
    animales: 'no',
    manejoResiduos: 'diario'
  },
  higienePersonal: {
    frecuenciaBano: 'diario',
    aseoManos: {
      antesComida: false,
      despuesBano: false,
      manipularAlimentos: false,
      sinHabito: false
    },
    cambioRopa: 'diario'
  },
  higieneBucal: {
    frecuenciaCepillado: '2-veces',
    tecnicaCepillado: 'circular',
    auxiliares: {
      hiloDental: false,
      enjuagueBucal: false,
      irrigador: false,
      noUsa: true
    },
    ultimaVisita: 'menos-6-meses',
    problemas: {
      sangradoEncias: false,
      caries: false,
      malAliento: false,
      dolor: false,
      sinProblemas: true
    }
  },
  alimentacion: {
    tiposAlimentos: {
      frutasVerduras: false,
      carnesProteinas: false,
      procesadosFritos: false,
      dulcesAzucares: false,
      lacteos: false
    },
    frecuenciaFrutasVerduras: 'diario',
    frecuenciaBebidasAzucaradas: 'ocasional',
    frecuenciaComidaChatarra: 'ocasional',
    consumoAgua: '1-2-litros'
  },
  habitosAlimenticios: {
    numeroComidas: '3-comidas',
    horarioComidas: 'fijo',
    saltaComidas: 'no',
    ayunoProlongado: 'no'
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
