import { FormDataState } from '@/types/historiaClinica';

export const getInitialFormState = (): FormDataState => ({
  datosPersonales: {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    edad: '',
    genero: '',
    direccion: '',
    telefono: '',
    email: '',
    ocupacion: '',
    estadoCivil: '',
    escolaridad: '',
  },
  motivoConsulta: '',
  historiaEnfermedadActual: '',
  antecedentesPersonalesNoPatologicos: {
    alimentacion: '',
    habitacion: '',
    higiene: '',
    deportes: '',
    inmunizaciones: '',
    grupoSanguineo: '',
    alergias: '',
    transfusiones: '',
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
    enfermedadesInfancia: '',
    enfermedadesCronicas: '',
    enfermedadesMentales: '',
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
  antecedentesHeredofamiliares: {
    diabetes: '',
    hipertension: '',
    cancer: '',
    cardiopatias: '',
    enfermedadesMentales: '',
    otros: '',
  },
  antecedentesGinecoObstetricos: {
    menarca: '',
    ciclosMenstruales: '',
    fechaUltimaMenstruacion: '',
    gestas: '',
    partos: '',
    abortos: '',
    cesareas: '',
    planificacionFamiliar: '',
  },
  antecedentesAndrologicos: {
    inicioVidaSexualActiva: '',
    numeroParejasSexuales: '',
    metodoAnticonceptivo: '',
    enfermedadesTransmisionSexual: '',
  },
  antecedentesHemorragicos: {
    tendenciaHemorragica: '',
    causaHemorragia: '',
    sinHemorragicos: false,
    sangradoProlongado: "no",
    hematomas: "no",
    hemorragiasEspontaneas: "no",
    transfusiones: "no",
    detallesAdicionales: ""
  },
  antecedentesQuirurgicos: {
    cirugiasPrevias: '',
    fechaCirugia: '',
    motivoCirugia: '',
    sinQuirurgicos: false,
    cirugiasRealizadas: [],
    hospitalizacionesPrevias: "",
    complicacionesAnestesicas: ""
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
  interrogatorioSistemas: {
    general: '',
    pielFaneras: '',
    sistemaHemolinfopoyetico: '',
    cabeza: '',
    organosSentidos: '',
    cuello: '',
    cardioVascular: '',
    respiratorio: '',
    gastroIntestinal: '',
    genitoUrinario: '',
    endocrino: '',
    osteoMuscular: '',
    nervioso: '',
    mental: '',
    cardiovascular: ""
  },
  exploracionFisica: {
    ta: '',
    fc: '',
    fr: '',
    temperatura: '',
    peso: '',
    talla: '',
    imc: '',
    complexion: '',
    facies: '',
    actitud: '',
    estadoConciencia: '',
    marcha: '',
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
    craneo: '',
    cueroCabelludo: '',
    cara: '',
    ojos: '',
    nariz: '',
    boca: '',
    garganta: '',
    oidos: '',
    tieneLesiones: false,
    descripcionLesiones: '',
    sinHallazgos: false,
    atm: ''
  },
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
      atenuacion: '',
      causaProvocado: ''
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
  habitusExterior: '',
  diagnostico: '',
  pronostico: '',
  planTratamiento: '',
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
