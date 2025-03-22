
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
    sinPatologia: false,
    nutricionales: {
      anorexia: false,
      bulimia: false,
      sobrepeso: false,
      obesidad: false,
      ninguna: false,
      otra: false,
      otraDescripcion: ""
    },
    cardiacos: {
      enfermedadCoronaria: false,
      arritmias: false,
      defectosCardiacosCongenitos: false,
      ninguna: false,
      otra: false,
      otraDescripcion: ""
    },
    hepaticos: {
      hepatitisA: false,
      hepatitisB: false,
      hepatitisC: false,
      higadoGraso: false,
      cirrosis: false,
      ninguna: false,
      otra: false,
      otraDescripcion: ""
    },
    enfermedadesTransmisionSexual: {
      vih: false,
      sifilis: false,
      gonorrea: false,
      herpesGenital: false,
      vph: false,
      ninguna: false,
      otra: false,
      otraDescripcion: ""
    },
    enfermedadesEruptivas: {
      sarampion: false,
      rubeola: false,
      escarlatina: false,
      varicela: false,
      paperas: false,
      ninguna: false,
      otra: false,
      otraDescripcion: ""
    },
    pulmonares: {
      neumonia: false,
      bronquitis: false,
      asma: false,
      epoc: false,
      ninguna: false,
      otra: false,
      otraDescripcion: ""
    },
    infecciosasParasitarias: {
      fiebreTifoidea: false,
      tuberculosis: false,
      amibiasis: false,
      giardiasis: false,
      ascariasis: false,
      ninguna: false,
      otra: false,
      otraDescripcion: ""
    },
    otrosPadecimientos: {
      especificar: false,
      ninguna: false,
      otra: false,
      otraDescripcion: ""
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
  antecedentesQuirurgicos: {
    sinQuirurgicos: false,
    cirugiasRealizadas: [],
    hospitalizacionesPrevias: "",
    complicacionesAnestesicas: ""
  },
  antecedentesHemorragicos: {
    sinHemorragicos: false,
    sangradoProlongado: "no",
    hematomas: "no",
    hemorragiasEspontaneas: "no",
    transfusiones: "no",
    detallesAdicionales: ""
  },
  interrogatorioSistemas: {
    cardiovascular: "",
    respiratorio: "",
    digestivo: "",
    urinario: "",
    musculoEsqueletico: "",
    nervioso: "",
    endocrino: "",
    tegumentario: ""
  },
  exploracionFisica: {
    signosVitales: {
      ta: "",
      fc: "",
      fr: "",
      temperatura: "",
      peso: "",
      talla: "",
      imc: ""
    },
    exploracion: {
      cabeza: "",
      cuello: "",
      torax: "",
      abdomen: "",
      extremidades: ""
    }
  },
  examenCabeza: {
    sinHallazgos: false,
    craneo: "",
    cara: "",
    ojos: "",
    oidos: "",
    nariz: "",
    boca: "",
    atm: ""
  },
  // Add new sections
  articulacionCraneomandibular: {
    sinHallazgos: false,
    aperturaBucal: "",
    movimientoLateral: "",
    chasquidos: false,
    crepitacion: false,
    dolor: false,
    observaciones: ""
  },
  examenCuello: {
    sinHallazgos: false,
    gangliosLinfaticos: "",
    musculatura: "",
    tiroides: "",
    movilidad: "",
    observaciones: ""
  },
  examenIntrabucal: {
    sinHallazgos: false,
    lengua: "",
    paladarDuro: "",
    paladarBlando: "",
    mucosaYugal: "",
    pisoBoca: "",
    encias: "",
    dientes: "",
    observaciones: ""
  },
  glandulasSalivales: {
    sinHallazgos: false,
    parotida: "",
    submaxilar: "",
    sublingual: "",
    secrecion: "",
    observaciones: ""
  },
  oclusion: {
    sinHallazgos: false,
    clasificacionAngle: "",
    overjet: "",
    overbite: "",
    mordidaCruzada: false,
    mordidaAbierta: false,
    observaciones: ""
  },
  relacionDientes: {
    sinHallazgos: false,
    relacionMolar: "",
    relacionCanina: "",
    apiñamiento: false,
    diastemas: false,
    observaciones: ""
  },
  lineaMedia: {
    sinHallazgos: false,
    coincidente: false,
    desviacion: "",
    observaciones: ""
  },
  frenillos: {
    sinHallazgos: false,
    labialSuperior: "",
    labialInferior: "",
    lingual: "",
    observaciones: ""
  },
  diagnostico: {
    principal: "",
    secundarios: "",
    observaciones: ""
  },
  pronostico: {
    general: "",
    particular: "",
    observaciones: ""
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
