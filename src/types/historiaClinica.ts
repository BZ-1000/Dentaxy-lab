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
  };
}

export interface PadecimientoActual {
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
    ubicacion?: string; // Added ubicacion field
  };
}

export interface AntecedentesHeredoFamiliares {
  padre: Familiar;
  madre: Familiar;
  abueloPaterno: Familiar;
  abuelaPaterna: Familiar;
  abueloMaterno: Familiar;
  abuelaMaterna: Familiar;
}

export interface AntecedentesPersonalesNoPatologicos {
  tipoVivienda: string;
  materialVivienda: string;
  servicios: string[];
  condicionCalle: string;
  iluminacionCalle: string;
  frecuenciaLimpieza: string;
  cambioRopaCama: string;
  hacinamiento: string;
  promiscuidad: string;
  mascotas: string;
  manejoResiduos: string;
  frecuenciaBano: string;
  lavadoManos: string[];
  cambioRopa: string;
  frecuenciaCepillado: string;
  tecnicaCepillado: string;
  auxiliaresBucales: string[];
  ultimaVisitaOdontologo: string;
  problemasBucales: string[];
  alimentosConsumidos: string[];
  frecuenciaFrutasVerduras: string;
  frecuenciaBebidasAzucaradas: string;
  frecuenciaComidaChatarra: string;
  consumoAgua: string;
  numeroComidas: string;
  horarioComidas: {
    desayuno: string;
    almuerzo: string;
    cena: string;
  };
  ayunoProlongado: string;
}

export interface CondicionPatologica {
  [key: string]: boolean | string;
  ninguna: boolean;
  otra: boolean;
  otraDescripcion: string;
}

export interface AntecedentesPersonalesPatologicos {
  sinPatologia?: boolean;
  nutricionales: CondicionPatologica & {
    anorexia?: boolean;
    bulimia?: boolean;
    sobrepeso?: boolean;
    obesidad?: boolean;
  };
  cardiacos: CondicionPatologica & {
    enfermedadCoronaria?: boolean;
    arritmias?: boolean;
    defectosCardiacosCongenitos?: boolean;
  };
  hepaticos: CondicionPatologica & {
    hepatitisA?: boolean;
    hepatitisB?: boolean;
    hepatitisC?: boolean;
    higadoGraso?: boolean;
    cirrosis?: boolean;
  };
  enfermedadesTransmisionSexual: CondicionPatologica & {
    vih?: boolean;
    sifilis?: boolean;
    gonorrea?: boolean;
    herpesGenital?: boolean;
    vph?: boolean;
  };
  enfermedadesEruptivas: CondicionPatologica & {
    sarampion?: boolean;
    rubeola?: boolean;
    escarlatina?: boolean;
    varicela?: boolean;
    paperas?: boolean;
  };
  pulmonares: CondicionPatologica & {
    neumonia?: boolean;
    bronquitis?: boolean;
    asma?: boolean;
    epoc?: boolean;
  };
  infecciosasParasitarias: CondicionPatologica & {
    fiebreTifoidea?: boolean;
    tuberculosis?: boolean;
    amibiasis?: boolean;
    giardiasis?: boolean;
    ascariasis?: boolean;
  };
  otrosPadecimientos: CondicionPatologica & {
    especificar?: boolean;
  };
}

export interface AntecedentesAlergicos {
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
  tiposAlergias?: {
    medicamentos?: boolean;
    alimentos?: boolean;
    ambiente?: boolean;
    [key: string]: boolean | undefined;
  };
  cualesAlergias?: string;
  especificacionAlergias?: string;
  administradoAnestesia?: boolean;
  tipoAnestesia?: string;
  reaccionAnestesia?: boolean;
  descripcionReaccion?: string;
  adicciones?: {
    tabaco?: boolean;
    alcohol?: boolean;
    drogas?: boolean;
    [key: string]: boolean | undefined;
  };
  detallesAdicciones?: string;
}

export interface AntecedentesQuirurgicos {
  sinQuirurgicos: boolean;
  cirugiasRealizadas: Array<{
    tipo: string;
    fecha: string;
    motivo: string;
  }>;
  hospitalizacionesPrevias: string;
  complicacionesAnestesicas: string;
  tratamientoReciente?: boolean;
  motivoTratamiento?: string;
  hospitalizacionReciente?: boolean;
  motivoHospitalizacion?: string;
  tomaMedicamentos?: boolean;
  cualesMedicamentos?: string;
  motivoMedicamentos?: string;
}

export interface AntecedentesHemorragicos {
  sinHemorragicos: boolean;
  sangradoProlongado: string;
  hematomas: string;
  hemorragiasEspontaneas: string;
  transfusiones: string;
  detallesAdicionales: string;
  transfusionPrevia?: boolean;
  motivoTransfusion?: string;
  fechaTransfusion?: string;
}

export interface AntecedentesGinecoObstetricos {
  embarazos?: number | string;
  partos?: number | string;
  cesareas?: number | string;
  abortos?: number | string;
  complicaciones?: string;
}

export interface ExploracionFisica {
  signosVitales: {
    ta: string;
    fc: string;
    fr: string;
    temperatura: string;
    peso: string;
    talla: string;
    imc: string;
    pulso?: string; // Added pulso field
  };
  exploracion: {
    cabeza: string;
    cuello: string;
    torax: string;
    abdomen: string;
    extremidades: string;
    [key: string]: string;
  };
}

export interface CaracteristicaFacial {
  presente?: boolean;
  detalles?: string;
  // Add subfield options
  tamanio?: string;  // pequeño, mediano, grande
  color?: string;    // marrón claro, marrón oscuro, negro
  bordes?: string;   // regulares, irregulares
  localizacion?: string;
  elevacion?: string; // plano, elevado
  tipo?: string;      // quirúrgica, traumática, acneica, queloide
  antiguedad?: string; // nueva, antigua
  coloracion?: string; // hipopigmentada, hiperpigmentada, normal
  zonaAfectada?: string; // mandíbula, mejillas, ojos, nariz, frente
  grado?: string;      // leve, moderado, severo
  posibleCausa?: string; // congénita, traumática, muscular, otra
  tipoEdema?: string;   // localizado, difuso
  dolor?: string;      // presente, ausente
  consistencia?: string; // blando, etc.
}

export interface ExamenCabeza {
  sinHallazgos?: boolean;
  tipoCraneo?: string;
  tipoPerfil?: string;
  tez?: string;
  estadoPiel?: string;
  lunares?: CaracteristicaFacial;
  cicatrices?: CaracteristicaFacial;
  asimetriasFaciales?: CaracteristicaFacial;
  edema?: CaracteristicaFacial;
  otrosHallazgos?: string;
  [key: string]: boolean | string | CaracteristicaFacial | undefined;
}

export interface ArticulacionCraneomandibular {
  sinHallazgos?: boolean;
  aperturaBucal?: string;
  movimientoLateral?: string;
  chasquidos?: boolean;
  crepitacion?: boolean;
  dolor?: boolean;
  observaciones?: string;
  [key: string]: boolean | string | undefined | {[key: string]: string | boolean | undefined};
  dolorMasticarHablar?: boolean;
  tipoDolor?: string;
  duracionDolor?: string;
  dolorEspecifico?: boolean;
  motivoDolor?: string;
  ruidoArticular?: string;
  patronAbertura?: string;
  otroPatronAbertura?: string;
  otrasObservaciones?: string;
  labios?: {
    simetria?: string;
    volumen?: string;
    coloracion?: string;
    hidratacion?: string;
    integridad?: string;
    comisuras?: string;
    movimiento?: string;
    otrasObservaciones?: string;
    [key: string]: string | boolean | undefined;
  };
}

export interface ExamenCuello {
  sinHallazgos?: boolean;
  gangliosLinfaticos?: string;
  musculatura?: string;
  tiroides?: string;
  movilidad?: string;
  observaciones?: string;
  [key: string]: boolean | string | undefined;
}

export interface ExamenIntrabucal {
  sinHallazgos?: boolean;
  lengua?: string;
  paladarDuro?: string;
  paladarBlando?: string;
  mucosaYugal?: string;
  pisoBoca?: string;
  encias?: string;
  dientes?: string;
  observaciones?: string;
  [key: string]: boolean | string | undefined;
}

export interface GlandulasSalivales {
  sinHallazgos?: boolean;
  parotida?: string;
  submaxilar?: string;
  sublingual?: string;
  secrecion?: string;
  observaciones?: string;
  [key: string]: boolean | string | undefined;
}

export interface Oclusion {
  sinHallazgos?: boolean;
  clasificacionAngle?: string;
  overjet?: string;
  overbite?: string;
  mordidaCruzada?: boolean;
  mordidaAbierta?: boolean;
  observaciones?: string;
  [key: string]: boolean | string | undefined;
}

export interface RelacionDientes {
  sinHallazgos?: boolean;
  relacionMolar?: string;
  relacionCanina?: string;
  apiñamiento?: boolean;
  diastemas?: boolean;
  observaciones?: string;
  [key: string]: boolean | string | undefined;
}

export interface LineaMedia {
  sinHallazgos?: boolean;
  coincidente?: boolean;
  desviacion?: string;
  observaciones?: string;
  [key: string]: boolean | string | undefined;
}

export interface Frenillos {
  sinHallazgos?: boolean;
  labialSuperior?: string;
  labialInferior?: string;
  lingual?: string;
  observaciones?: string;
  [key: string]: boolean | string | undefined;
}

export interface Diagnostico {
  principal?: string;
  secundarios?: string;
  observaciones?: string;
  [key: string]: string | undefined;
}

export interface Pronostico {
  general?: string;
  particular?: string;
  observaciones?: string;
  [key: string]: string | undefined;
}

export interface HigieneBucal {
  frecuenciaCepillado: string;
  usoHiloDental: string;
  tipoCerdas: string;
  cantidadPasta: string;
  marcaPasta: string;
}

export interface Alimentacion {
  tipoDieta: string;
  frecuenciaComidas: string;
  tiposAlimentos: string;
  saltaComidas: string;
  consumoNutritivo: string;
  }

export interface FormDataState {
  padecimientoActual: PadecimientoActual;
  antecedentesHeredoFamiliares: AntecedentesHeredoFamiliares;
  antecedentesPersonalesNoPatologicos: AntecedentesPersonalesNoPatologicos;
  antecedentesPersonalesPatologicos: AntecedentesPersonalesPatologicos;
  antecedentesAlergicos: AntecedentesAlergicos;
  antecedentesQuirurgicos: AntecedentesQuirurgicos;
  antecedentesHemorragicos: AntecedentesHemorragicos;
  antecedentesGinecoObstetricos?: AntecedentesGinecoObstetricos;
  interrogatorioSistemas: {
    [key: string]: string;
    cardiovascular?: string;
    respiratorio?: string;
    digestivo?: string;
    urinario?: string;
    musculoEsqueletico?: string;
    nervioso?: string;
    endocrino?: string;
    tegumentario?: string;
  };
  exploracionFisica: ExploracionFisica;
  examenCabeza: ExamenCabeza;
  articulacionCraneomandibular: ArticulacionCraneomandibular;
  examenCuello: ExamenCuello;
  examenIntrabucal: ExamenIntrabucal;
  glandulasSalivales: GlandulasSalivales;
  oclusion: Oclusion;
  relacionDientes: RelacionDientes;
  lineaMedia: LineaMedia;
  frenillos: Frenillos;
  diagnostico: Diagnostico;
  pronostico: Pronostico;
  serviciosDomiciliarios: string;
  pisosVivienda: string;
  materialVivienda: string;
  materialPiso: string;
  ventilacion: string;
  frecuenciaLimpieza: string;
  hacinamiento: string;
  frecuenciaBano: string;
  higieneBucal: HigieneBucal;
  alimentacion: Alimentacion;
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
