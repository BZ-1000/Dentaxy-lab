
import { FormDataState } from '@/types/historiaClinica';

export const getInitialFormState = (): FormDataState => ({
  padecimientoActual: {
    sinSintomas: false,
    motivoConsulta: '',
    historiaPadecimiento: '',
    dolor: {
      presente: false,
      tipo: '',
      escala: '',
      fechaInicio: '',
      frecuencia: '',
      duracion: '',
      localizacion: {
        tipo: '',
        descripcion: ''
      },
      irradiacion: '',
      factoresAgravantes: '',
      factoresAliviantes: '',
      condicionAparicion: '',
      caracter: '',
      intensidad: '',
      atenuacion: ''
    }
  },
  antecedentesHeredoFamiliares: {
    padre: {
      vivo: true,
      edad: '',
      condiciones: {
        diabetes: false,
        hipertension: false,
        cancer: false,
        enfermedadesCardiacas: false,
        otros: '',
        diabetesMellitus: false,
        hipertensionArterial: false,
        osteoporosis: false,
        artritisReumatoide: false,
        parkinson: false,
        alzheimer: false,
        asma: false,
        anemia: false,
        otras: ''
      },
      finado: false,
      causaMuerte: ''
    },
    madre: {
      vivo: true,
      edad: '',
      condiciones: {
        diabetes: false,
        hipertension: false,
        cancer: false,
        enfermedadesCardiacas: false,
        otros: '',
        diabetesMellitus: false,
        hipertensionArterial: false,
        osteoporosis: false,
        artritisReumatoide: false,
        parkinson: false,
        alzheimer: false,
        asma: false,
        anemia: false,
        otras: ''
      },
      finado: false,
      causaMuerte: ''
    },
    abueloPaterno: {
      vivo: true,
      edad: '',
      condiciones: {
        diabetes: false,
        hipertension: false,
        cancer: false,
        enfermedadesCardiacas: false,
        otros: '',
        diabetesMellitus: false,
        hipertensionArterial: false,
        osteoporosis: false,
        artritisReumatoide: false,
        parkinson: false,
        alzheimer: false,
        asma: false,
        anemia: false,
        otras: ''
      },
      finado: false,
      causaMuerte: ''
    },
    abuelaPaterna: {
      vivo: true,
      edad: '',
      condiciones: {
        diabetes: false,
        hipertension: false,
        cancer: false,
        enfermedadesCardiacas: false,
        otros: '',
        diabetesMellitus: false,
        hipertensionArterial: false,
        osteoporosis: false,
        artritisReumatoide: false,
        parkinson: false,
        alzheimer: false,
        asma: false,
        anemia: false,
        otras: ''
      },
      finado: false,
      causaMuerte: ''
    },
    abueloMaterno: {
      vivo: true,
      edad: '',
      condiciones: {
        diabetes: false,
        hipertension: false,
        cancer: false,
        enfermedadesCardiacas: false,
        otros: '',
        diabetesMellitus: false,
        hipertensionArterial: false,
        osteoporosis: false,
        artritisReumatoide: false,
        parkinson: false,
        alzheimer: false,
        asma: false,
        anemia: false,
        otras: ''
      },
      finado: false,
      causaMuerte: ''
    },
    abuelaMaterna: {
      vivo: true,
      edad: '',
      condiciones: {
        diabetes: false,
        hipertension: false,
        cancer: false,
        enfermedadesCardiacas: false,
        otros: '',
        diabetesMellitus: false,
        hipertensionArterial: false,
        osteoporosis: false,
        artritisReumatoide: false,
        parkinson: false,
        alzheimer: false,
        asma: false,
        anemia: false,
        otras: ''
      },
      finado: false,
      causaMuerte: ''
    }
  },
  antecedentesPersonalesNoPatologicos: {
    alimentacion: {
      tipoDieta: '',
      frecuenciaComidas: '',
      consumoAguaDia: ''
    },
    habitacion: {
      tipoVivienda: '',
      numeroHabitantes: '',
      mascotas: ''
    },
    higienePersonal: {
      frecuenciaBano: '',
      cambioRopa: '',
      aseoBucal: ''
    },
    actividadFisica: {
      tipoEjercicio: '',
      frecuenciaEjercicio: '',
      duracionEjercicio: ''
    },
    sueno: {
      horasSueno: '',
      calidadSueno: ''
    },
    tabaquismo: {
      consumeTabaco: false,
      edadInicioTabaquismo: '',
      cantidadTabacoDia: '',
      tiempoAbstinenciaTabaquismo: ''
    },
    alcoholismo: {
      consumeAlcohol: false,
      edadInicioAlcoholismo: '',
      frecuenciaAlcoholismo: '',
      cantidadAlcoholismo: '',
      tiempoAbstinenciaAlcoholismo: ''
    },
    toxicomanias: {
      consumeDrogas: false,
      tipoDroga: '',
      frecuenciaDrogas: '',
      tiempoAbstinenciaDrogas: ''
    },
    servicios: [],
    tipoVivienda: "",
    materialVivienda: "",
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
    enfermedadesInfancia: {
      varicela: false,
      sarampion: false,
      rubeola: false,
      parotiditis: false,
      tosferina: false,
      otras: ''
    },
    enfermedadesCronicas: {
      diabetes: false,
      hipertension: false,
      cardiacas: false,
      respiratorias: false,
      alergias: false,
      otras: ''
    },
    hospitalizaciones: {
      haSidoHospitalizado: false,
      motivoHospitalizacion: '',
      fechaHospitalizacion: ''
    },
    transfusiones: {
      haRecibidoTransfusiones: false,
      motivoTransfusion: '',
      fechaTransfusion: ''
    },
    vacunas: {
      esquemaCompleto: false,
      cualesVacunas: ''
    },
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
    alergiaMedicamentos: {
      esAlergico: false,
      medicamentos: '',
      reaccion: ''
    },
    alergiaAlimentos: {
      esAlergico: false,
      alimentos: '',
      reaccion: ''
    },
    alergiaAmbiental: {
      esAlergico: false,
      alergenos: '',
      reaccion: ''
    },
    alergiaLatex: {
      esAlergico: false,
      reaccion: ''
    },
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
    complicacionesAnestesicas: "",
    cirugiasPrevias: false,
    tipoCirugia: "",
    fechaCirugia: "",
    complicaciones: ""
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
    general: '',
    piel: '',
    cabeza: '',
    ojos: '',
    oidos: '',
    nariz: '',
    boca: '',
    garganta: '',
    cuello: '',
    torax: '',
    cardiovascular: "",
    respiratorio: "",
    gastrointestinal: '',
    genitourinario: '',
    endocrino: '',
    hematologico: '',
    nervioso: '',
    musculoEsqueletico: '',
    psiquiatrico: '',
    digestivo: "",
    urinario: "",
    tegumentario: ""
  },
  exploracionFisica: {
    signosVitales: {
      ta: "",
      fc: "",
      fr: "",
      temperatura: "",
      frecuenciaCardiaca: "",
      frecuenciaRespiratoria: "",
      presionArterial: "",
      peso: "",
      talla: "",
      imc: ""
    },
    aparienciaGeneral: "",
    piel: "",
    cabeza: "",
    ojos: "",
    oidos: "",
    nariz: "",
    boca: "",
    cuello: "",
    torax: "",
    corazon: "",
    pulmones: "",
    abdomen: "",
    extremidades: "",
    neurologico: "",
    mental: "",
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
    palpacionATM: "",
    movimientosMandibulares: "",
    gangliosLinfaticos: "",
    musculosMasticadores: "",
    observaciones: "",
    macrocefalia: "",
    microcefalia: "",
    dolor: "",
    cefalea: "",
    otrosHallazgos: ""
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
  vivo: true,
  edad: '',
  finado: false,
  causaMuerte: '',
  condiciones: {
    diabetes: false,
    hipertension: false,
    cancer: false,
    enfermedadesCardiacas: false,
    otros: '',
    diabetesMellitus: false,
    hipertensionArterial: false,
    osteoporosis: false,
    artritisReumatoide: false,
    parkinson: false,
    alzheimer: false,
    asma: false,
    anemia: false,
    otras: ''
  }
});
