
export interface FormDataState {
  informacionPaciente?: {
    nombre: string;
    edad: string;
    genero: string;
    fechaNacimiento: string;
    direccion: string;
    telefono: string;
    email: string;
    ocupacion: string;
    estadoCivil: string;
  };
  padecimientoActual: {
    motivoConsulta: string;
    historiaPadecimiento: string;
    sinSintomas: boolean;
    dolor: {
      presente?: boolean;
      tipo?: string;
      escala?: string;
      localizacion: {
        tipo: string;
        descripcion: string;
      };
      irradiacion?: string;
      frecuencia: string;
      duracion?: string;
      fechaInicio: string;
      factoresAgravantes?: string;
      factoresAliviantes?: string;
      condicionAparicion?: string;
      caracter?: string;
      intensidad?: string;
      atenuacion?: string;
    };
  };
  antecedentesHeredoFamiliares: {
    padre: Familiar;
    madre: Familiar;
    hermanos?: Familiar;
    abuelosPaternos?: Familiar;
    abuelosMaternos?: Familiar;
    abueloPaterno?: Familiar;
    abuelaPaterna?: Familiar;
    abueloMaterno?: Familiar;
    abuelaMaterna?: Familiar;
  };
  antecedentesPersonalesNoPatologicos: {
    alimentacion?: {
      tipoDieta: string;
      frecuenciaComidas: string;
      consumoAguaDia: string;
    };
    habitacion?: {
      tipoVivienda: string;
      numeroHabitantes: string;
      mascotas: string;
    };
    higienePersonal?: {
      frecuenciaBano: string;
      cambioRopa: string;
      aseoBucal: string;
    };
    actividadFisica?: {
      tipoEjercicio: string;
      frecuenciaEjercicio: string;
      duracionEjercicio: string;
    };
    sueno?: {
      horasSueno: string;
      calidadSueno: string;
    };
    tabaquismo?: {
      consumeTabaco: boolean | string;
      edadInicioTabaquismo: string;
      cantidadTabacoDia: string;
      tiempoAbstinenciaTabaquismo: string;
    };
    alcoholismo?: {
      consumeAlcohol: boolean | string;
      edadInicioAlcoholismo: string;
      frecuenciaAlcoholismo: string;
      cantidadAlcoholismo: string;
      tiempoAbstinenciaAlcoholismo: string;
    };
    toxicomanias?: {
      consumeDrogas: boolean | string;
      tipoDroga: string;
      frecuenciaDrogas: string;
      tiempoAbstinenciaDrogas: string;
    };
    servicios: string[];
    tipoVivienda?: string;
    materialVivienda?: string;
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
    enfermedadesInfancia?: {
      varicela: boolean | string;
      sarampion: boolean | string;
      rubeola: boolean | string;
      parotiditis: boolean | string;
      tosferina: boolean | string;
      otras: string;
    };
    enfermedadesCronicas?: {
      diabetes: boolean | string;
      hipertension: boolean | string;
      cardiacas: boolean | string;
      respiratorias: boolean | string;
      alergias: boolean | string;
      otras: string;
    };
    hospitalizaciones?: {
      haSidoHospitalizado: boolean | string;
      motivoHospitalizacion: string;
      fechaHospitalizacion: string;
    };
    transfusiones?: {
      haRecibidoTransfusiones: boolean | string;
      motivoTransfusion: string;
      fechaTransfusion: string;
    };
    vacunas?: {
      esquemaCompleto: boolean | string;
      cualesVacunas: string;
    };
    sinPatologia?: boolean;
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
  antecedentesAlergicos: {
    alergiaMedicamentos?: {
      esAlergico: boolean | string;
      medicamentos: string;
      reaccion: string;
    };
    alergiaAlimentos?: {
      esAlergico: boolean | string;
      alimentos: string;
      reaccion: string;
    };
    alergiaAmbiental?: {
      esAlergico: boolean | string;
      alergenos: string;
      reaccion: string;
    };
    alergiaLatex?: {
      esAlergico: boolean | string;
      reaccion: string;
    };
    medicamentos?: {
      es_alergico: boolean;
      cuales: string;
      tipo_reaccion: string;
      severidad: string;
    };
    alimentos?: {
      es_alergico: boolean;
      cuales: string;
    };
    latex?: {
      es_alergico: boolean;
      descripcion_reaccion: string;
    };
  };
  antecedentesQuirurgicos: {
    cirugiasPrevias?: boolean | string;
    tipoCirugia?: string;
    fechaCirugia?: string;
    complicaciones?: string;
    sinQuirurgicos?: boolean;
    cirugiasRealizadas?: Array<{
      tipo: string;
      fecha: string;
      motivo: string;
    }>;
    hospitalizacionesPrevias?: string;
    complicacionesAnestesicas?: string;
  };
  antecedentesHemorragicos: {
    sangradoProlongado: string;
    hematomas: string;
    hemorragiasEspontaneas: string;
    transfusiones: string;
    detallesAdicionales: string;
    sinHemorragicos: boolean;
  };
  interrogatorioSistemas: {
    general?: string;
    piel?: string;
    cabeza?: string;
    ojos?: string;
    oidos?: string;
    nariz?: string;
    boca?: string;
    garganta?: string;
    cuello?: string;
    torax?: string;
    cardiovascular: string;
    respiratorio: string;
    gastrointestinal?: string;
    genitourinario?: string;
    endocrino?: string;
    hematologico?: string;
    nervioso?: string;
    musculoEsqueletico?: string;
    psiquiatrico?: string;
    digestivo?: string;
    urinario?: string;
    tegumentario?: string;
  };
  exploracionFisica?: {
    signosVitales?: {
      temperatura?: string;
      frecuenciaCardiaca?: string;
      frecuenciaRespiratoria?: string;
      presionArterial?: string;
      peso?: string;
      talla?: string;
      imc?: string;
      ta?: string;
      fc?: string;
      fr?: string;
    };
    aparienciaGeneral?: string;
    piel?: string;
    cabeza?: string;
    ojos?: string;
    oidos?: string;
    nariz?: string;
    boca?: string;
    cuello?: string;
    torax?: string;
    corazon?: string;
    pulmones?: string;
    abdomen?: string;
    extremidades?: string;
    neurologico?: string;
    mental?: string;
    exploracion?: {
      cabeza?: string;
      cuello?: string;
      torax?: string;
      abdomen?: string;
      extremidades?: string;
    };
  };
  examenCabeza: {
    palpacionATM?: string;
    movimientosMandibulares?: string;
    gangliosLinfaticos?: string;
    musculosMasticadores?: string;
    observaciones?: string;
    sinHallazgos?: boolean;
    macrocefalia?: string;
    microcefalia?: string;
    dolor?: string;
    cefalea?: string;
    otrosHallazgos?: string;
  };
  serviciosDomiciliarios?: string;
  pisosVivienda?: string;
  materialVivienda?: string;
  materialPiso?: string;
  ventilacion?: string;
  frecuenciaLimpieza?: string;
  hacinamiento?: string;
  frecuenciaBano?: string;
  higieneBucal?: {
    frecuenciaCepillado: string;
    usoHiloDental: string;
    tipoCerdas: string;
    cantidadPasta: string;
    marcaPasta: string;
  };
  alimentacion?: {
    tipoDieta: string;
    frecuenciaComidas: string;
    tiposAlimentos: string;
    saltaComidas: string;
    consumoNutritivo: string;
  };
  grupoSanguineo?: string;
  factorRh?: string;
  inmunizaciones?: string;
  peso?: string;
  imc?: string;
  talla?: string;
  presionArterial?: string;
  pulso?: string;
  frecuenciaCardiaca?: string;
  frecuenciaRespiratoria?: string;
  temperatura?: string;
  diagnosticos?: string;
  pronosticos?: string;
}

// Define the Familiar interface
export interface Familiar {
  vivo?: boolean;
  finado?: boolean;
  edad?: string;
  causaMuerte?: string;
  condiciones?: {
    diabetes?: boolean | string;
    hipertension?: boolean | string;
    cancer?: boolean | string;
    enfermedadesCardiacas?: boolean | string;
    otros?: string;
    diabetesMellitus?: boolean;
    hipertensionArterial?: boolean;
    osteoporosis?: boolean;
    artritisReumatoide?: boolean;
    parkinson?: boolean;
    alzheimer?: boolean;
    asma?: boolean;
    anemia?: boolean;
    otras?: string;
  };
  vivoSano?: boolean;
}

// Definición del tipo FormSection
export type FormSection = 
  | 'informacionPrincipal'
  | 'padecimientoActual'
  | 'antecedentesHeredoFamiliares'
  | 'antecedentesPersonalesPatologicos'
  | 'antecedentesPersonalesNoPatologicos'
  | 'antecedentesAlergicos'
  | 'antecedentesQuirurgicos'
  | 'antecedentesHemorragicos'
  | 'interrogatorioSistemas'
  | 'exploracionFisica'
  | 'examenCabeza'
  | 'sidebarOnly';

// Asegurarnos de que ExamenCabeza incluya todos los campos necesarios
export interface ExamenCabezaData {
  palpacionATM: string;
  movimientosMandibulares: string;
  gangliosLinfaticos: string;
  musculosMasticadores: string;
  observaciones: string;
}
