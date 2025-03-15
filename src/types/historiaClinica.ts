
export interface Option {
  label: string;
  value: string;
}

export interface DefaultValues {
  [key: string]: string | boolean | number | undefined;
}

export interface Field {
  name: string;
  label: string;
  type: string;
  options?: Option[];
  defaultValues?: DefaultValues;
}

export interface Group {
  title: string;
  fields: Field[];
}

export interface Familiar {
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
  }
}

export interface FormDataState {
  datosPersonales: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    fechaNacimiento: string;
    edad: string;
    genero: string;
    direccion: string;
    telefono: string;
    email: string;
    ocupacion: string;
    estadoCivil: string;
    escolaridad: string;
  };
  motivoConsulta: string;
  historiaEnfermedadActual: string;
  antecedentesPersonalesNoPatologicos: {
    alimentacion: string;
    habitacion: string;
    higiene: string;
    deportes: string;
    inmunizaciones: string;
    grupoSanguineo: string;
    alergias: string;
    transfusiones: string;
    tipoVivienda?: string;
    materialVivienda?: string;
    servicios?: string[];
    condicionCalle?: string;
    iluminacionCalle?: string;
    frecuenciaLimpieza?: string;
    cambioRopaCama?: string;
    hacinamiento?: string;
    promiscuidad?: string;
    mascotas?: string;
    manejoResiduos?: string;
    frecuenciaBano?: string;
    lavadoManos?: string[];
    cambioRopa?: string;
    frecuenciaCepillado?: string;
    tecnicaCepillado?: string;
    auxiliaresBucales?: string[];
    ultimaVisitaOdontologo?: string;
    problemasBucales?: string[];
    alimentosConsumidos?: string[];
    frecuenciaFrutasVerduras?: string;
    frecuenciaBebidasAzucaradas?: string;
    frecuenciaComidaChatarra?: string;
    consumoAgua?: string;
    numeroComidas?: string;
    horarioComidas?: {
      desayuno: string;
      almuerzo: string;
      cena: string;
    };
    ayunoProlongado?: string;
  };
  antecedentesPersonalesPatologicos: {
    enfermedadesInfancia: string;
    enfermedadesCronicas: string;
    enfermedadesMentales: string;
    nutricionales?: {
      anorexia: boolean;
      bulimia: boolean;
      sobrepeso: boolean;
      obesidad: boolean;
      ninguna: boolean;
      otra: boolean;
      otraDescripcion: string;
    };
    cardiacos?: {
      enfermedadCoronaria: boolean;
      arritmias: boolean;
      defectosCardiacosCongenitos: boolean;
      ninguna: boolean;
      otra: boolean;
      otraDescripcion: string;
    };
    hepaticos?: {
      hepatitisA: boolean;
      hepatitisB: boolean;
      hepatitisC: boolean;
      higadoGraso: boolean;
      cirrosis: boolean;
      ninguna: boolean;
      otra: boolean;
      otraDescripcion: string;
    };
    enfermedadesTransmisionSexual?: {
      vih: boolean;
      sifilis: boolean;
      gonorrea: boolean;
      herpesGenital: boolean;
      vph: boolean;
      ninguna: boolean;
      otra: boolean;
      otraDescripcion: string;
    };
    enfermedadesEruptivas?: {
      sarampion: boolean;
      rubeola: boolean;
      escarlatina: boolean;
      varicela: boolean;
      paperas: boolean;
      ninguna: boolean;
      otra: boolean;
      otraDescripcion: string;
    };
    pulmonares?: {
      neumonia: boolean;
      bronquitis: boolean;
      asma: boolean;
      epoc: boolean;
      ninguna: boolean;
      otra: boolean;
      otraDescripcion: string;
    };
    infecciosasParasitarias?: {
      fiebreTifoidea: boolean;
      tuberculosis: boolean;
      amibiasis: boolean;
      giardiasis: boolean;
      ascariasis: boolean;
      ninguna: boolean;
      otra: boolean;
      otraDescripcion: string;
    };
    otrosPadecimientos?: {
      especificar: boolean;
      ninguna: boolean;
      otra: boolean;
      otraDescripcion: string;
    };
  };
  antecedentesHeredofamiliares: {
    diabetes: string;
    hipertension: string;
    cancer: string;
    cardiopatias: string;
    enfermedadesMentales: string;
    otros: string;
  };
  antecedentesGinecoObstetricos: {
    menarca: string;
    ciclosMenstruales: string;
    fechaUltimaMenstruacion: string;
    gestas: string;
    partos: string;
    abortos: string;
    cesareas: string;
    planificacionFamiliar: string;
  };
  antecedentesAndrologicos: {
    inicioVidaSexualActiva: string;
    numeroParejasSexuales: string;
    metodoAnticonceptivo: string;
    enfermedadesTransmisionSexual: string;
  };
  antecedentesHemorragicos: {
    tendenciaHemorragica: string;
    causaHemorragia: string;
    sinHemorragicos?: boolean;
    sangradoProlongado?: string;
    hematomas?: string;
    hemorragiasEspontaneas?: string;
    transfusiones?: string;
    detallesAdicionales?: string;
  };
  antecedentesQuirurgicos: {
    cirugiasPrevias: string;
    fechaCirugia: string;
    motivoCirugia: string;
    sinQuirurgicos?: boolean;
    cirugiasRealizadas?: Array<{
      tipo: string;
      fecha: string;
      motivo: string;
    }>;
    hospitalizacionesPrevias?: string;
    complicacionesAnestesicas?: string;
  };
  antecedentesAlergicos?: {
    medicamentos: {
      es_alergico: boolean;
      cuales: string;
      tipo_reaccion: string;
      severidad: string;
    };
    alimentos: {
      es_alergico: boolean;
      cuales: string;
    };
    latex: {
      es_alergico: boolean;
      descripcion_reaccion: string;
    };
  };
  interrogatorioSistemas: {
    general: string;
    pielFaneras: string;
    sistemaHemolinfopoyetico: string;
    cabeza: string;
    organosSentidos: string;
    cuello: string;
    cardioVascular: string;
    respiratorio: string;
    gastroIntestinal: string;
    genitoUrinario: string;
    endocrino: string;
    osteoMuscular: string;
    nervioso: string;
    mental: string;
    cardiovascular?: string; // Alias for cardioVascular
  };
  exploracionFisica: {
    ta: string;
    fc: string;
    fr: string;
    temperatura: string;
    peso: string;
    talla: string;
    imc: string;
    complexion: string;
    facies: string;
    actitud: string;
    estadoConciencia: string;
    marcha: string;
    signosVitales?: {
      ta: string;
      fc: string;
      fr: string;
      temperatura: string;
      peso: string;
      talla: string;
      imc: string;
    };
    exploracion?: {
      cabeza: string;
      cuello: string;
      torax: string;
      abdomen: string;
      extremidades: string;
    };
  };
  examenCabeza: {
    craneo: string;
    cueroCabelludo: string;
    cara: string;
    ojos: string;
    nariz: string;
    boca: string;
    garganta: string;
    oidos: string;
    tieneLesiones?: boolean;
    descripcionLesiones?: string;
    sinHallazgos?: boolean;
    atm?: string;
  };
  padecimientoActual?: {
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
      causaProvocado?: string;
    }
  };
  antecedentesHeredoFamiliares?: {
    padre: Familiar;
    madre: Familiar;
    abueloPaterno: Familiar;
    abuelaPaterna: Familiar;
    abueloMaterno: Familiar;
    abuelaMaterna: Familiar;
  };
  habitusExterior: string;
  diagnostico: string;
  pronostico: string;
  planTratamiento: string;
}
