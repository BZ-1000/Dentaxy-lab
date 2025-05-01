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
  };
  exploracion: {
    // Estos campos son muy generales, considera si necesitas más detalle aquí
    // o si se cubren en secciones específicas como ExamenCabeza, ExamenCuello, etc.
    cabeza: string;
    cuello: string;
    torax: string;
    abdomen: string;
    extremidades: string;
    [key: string]: string;
  };
}


// --- INTERFAZ AUXILIAR PARA DETALLES DE CARACTERÍSTICAS FACIALES ---
interface CaracteristicaDetallada {
  presente?: boolean | null; // Sí/No/No seleccionado
  // Sub-options for Lunares
  tamano?: 'Pequeño' | 'Mediano' | 'Grande' | '' | null;
  color?: 'Marrón claro' | 'Marrón oscuro' | 'Negro' | '' | null;
  bordes?: 'Regulares' | 'Irregulares' | '' | null;
  localizacion?: string;
  elevacion?: 'Plano' | 'Elevado' | '' | null;
  // Sub-options for Cicatrices
  tipoCicatriz?: 'Quirúrgica' | 'Traumática' | 'Acneica' | 'Queloide' | '' | null;
  antiguedad?: 'Nueva' | 'Antigua' | '' | null;
  // localizacion?: string; // Se puede reusar la de lunares si es la misma estructura
  tamanoCicatriz?: 'Pequeña' | 'Mediana' | 'Grande' | '' | null; // Evitar conflicto de nombres
  coloracion?: 'Hipopigmentada' | 'Hiperpigmentada' | 'Normal' | '' | null;
  // Sub-options for Asimetrias
  zonaAfectada?: 'Mandíbula' | 'Mejillas' | 'Ojos' | 'Nariz' | 'Frente' | '' | null;
  grado?: 'Leve' | 'Moderado' | 'Severo' | '' | null;
  posibleCausa?: string; // Incluye Congénita, Traumática, Muscular, Otra (texto)
  // Sub-options for Edema
  // localizacion?: string; // Se puede reusar la de lunares
  tipoEdema?: 'Localizado' | 'Difuso' | '' | null;
  dolor?: 'Presente' | 'Ausente' | '' | null;
  consistencia?: 'Blando' | 'Duro' | '' | null;
}

// --- INTERFAZ MODIFICADA PARA EXAMEN DE CABEZA ---
export interface ExamenCabeza {
  // Tipos de Cráneo y Perfil basados en el componente UI
  tipoCraneo?: 'Mesocefálico' | 'Dolicocéfalo' | 'Braquicéfalo' | '' | null;
  tipoPerfil?: 'Cóncavo' | 'Convexo' | 'Recto' | '' | null;

  // Estructura detallada para la evaluación de la Cara
  tez?: 'clara' | 'morena' | 'oscura' | '' | null;
  estadoPiel?: 'reseca' | 'humectada' | '' | null;
  lunares?: CaracteristicaDetallada;
  cicatrices?: CaracteristicaDetallada;
  asimetriasFaciales?: CaracteristicaDetallada;
  edema?: CaracteristicaDetallada;
  otrosHallazgosCara?: string; // Campo específico para otros hallazgos de la cara

  // Opcional: Mantener campos simples para otras áreas si no se detallan en otro lugar
  // Si 'ExamenCuello', 'ExamenIntrabucal', 'ArticulacionCraneomandibular' cubren
  // cuello, boca, ATM, etc., puedes eliminar los campos redundantes de aquí.
  // ojos?: string;
  // oidos?: string;
  // nariz?: string;

  // Opcional: Un campo general de observaciones para toda la cabeza si es útil
  observacionesGeneralesCabeza?: string;

  // Opcional: Si quieres un booleano para indicar que no hay hallazgos en toda la cabeza
  sinHallazgosGenerales?: boolean;
}


export interface ArticulacionCraneomandibular {
  sinHallazgos?: boolean;
  aperturaBucal?: string;
  movimientoLateral?: string;
  chasquidos?: boolean;
  crepitacion?: boolean;
  dolor?: boolean;
  observaciones?: string;
  // [key: string]: boolean | string | undefined | {[key: string]: string | boolean | undefined}; // Quitar índice si no es necesario
  dolorMasticarHablar?: boolean | null; // Permitir null
  tipoDolor?: string;
  duracionDolor?: string;
  dolorEspecifico?: boolean | null; // Permitir null
  motivoDolor?: string;
  ruidoArticular?: string | null; // Permitir null
  patronAbertura?: string | null; // Permitir null
  otroPatronAbertura?: string;
  otrasObservaciones?: string; // Renombrado para evitar confusión con 'observaciones'
  labios?: {
    simetria?: string | null; // Permitir null
    volumen?: string | null; // Permitir null
    coloracion?: string | null; // Permitir null
    hidratacion?: string | null; // Permitir null (representa superficie)
    integridad?: string | null; // Permitir null
    comisuras?: string | null; // Permitir null
    movimiento?: string | null; // Permitir null
    otrasObservaciones?: string;
    // [key: string]: string | boolean | undefined; // Quitar índice si no es necesario
  };
}

export interface ExamenCuello {
  sinHallazgos?: boolean;
  gangliosLinfaticos?: string;
  musculatura?: string;
  tiroides?: string;
  movilidad?: string;
  observaciones?: string;
  // [key: string]: boolean | string | undefined; // Quitar índice
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
  // [key: string]: boolean | string | undefined; // Quitar índice
}

export interface GlandulasSalivales {
  sinHallazgos?: boolean;
  parotida?: string;
  submaxilar?: string;
  sublingual?: string;
  secrecion?: string;
  observaciones?: string;
  // [key: string]: boolean | string | undefined; // Quitar índice
}

export interface Oclusion {
  sinHallazgos?: boolean;
  clasificacionAngle?: string;
  overjet?: string;
  overbite?: string;
  mordidaCruzada?: boolean;
  mordidaAbierta?: boolean;
  observaciones?: string;
  // [key: string]: boolean | string | undefined; // Quitar índice
}

export interface RelacionDientes {
  sinHallazgos?: boolean;
  relacionMolar?: string;
  relacionCanina?: string;
  apiñamiento?: boolean;
  diastemas?: boolean;
  observaciones?: string;
  // [key: string]: boolean | string | undefined; // Quitar índice
}

export interface LineaMedia {
  sinHallazgos?: boolean;
  coincidente?: boolean;
  desviacion?: string;
  observaciones?: string;
  // [key: string]: boolean | string | undefined; // Quitar índice
}

export interface Frenillos {
  sinHallazgos?: boolean;
  labialSuperior?: string;
  labialInferior?: string;
  lingual?: string;
  observaciones?: string;
  // [key: string]: boolean | string | undefined; // Quitar índice
}

export interface Diagnostico {
  principal?: string;
  secundarios?: string;
  observaciones?: string;
  // [key: string]: string | undefined; // Quitar índice si no es necesario
}

export interface Pronostico {
  general?: string;
  particular?: string;
  observaciones?: string;
  // [key: string]: string | undefined; // Quitar índice si no es necesario
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

// --- INTERFAZ PRINCIPAL DEL ESTADO DEL FORMULARIO ---
export interface FormDataState {
  padecimientoActual: PadecimientoActual;
  antecedentesHeredoFamiliares: AntecedentesHeredoFamiliares;
  antecedentesPersonalesNoPatologicos: AntecedentesPersonalesNoPatologicos;
  antecedentesPersonalesPatologicos: AntecedentesPersonalesPatologicos;
  antecedentesAlergicos: AntecedentesAlergicos;
  antecedentesQuirurgicos: AntecedentesQuirurgicos;
  antecedentesHemorragicos: AntecedentesHemorragicos;
  antecedentesGinecoObstetricos?: AntecedentesGinecoObstetricos; // Opcional
  interrogatorioSistemas: {
    [key: string]: string; // Mantener índice aquí si es dinámico
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
  examenCabeza: ExamenCabeza; // <--- Usa la nueva interfaz detallada
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

  // Estos campos parecen repetidos de AntecedentesPersonalesNoPatologicos o ExploracionFisica
  // Considera si son necesarios o si puedes obtenerlos de las otras secciones.
  // serviciosDomiciliarios?: string; // Ya en APNP?
  // pisosVivienda?: string; // Relacionado a APNP.tipoVivienda?
  // materialVivienda?: string; // Ya en APNP
  // materialPiso?: string;
  // ventilacion?: string;
  // frecuenciaLimpieza?: string; // Ya en APNP
  // hacinamiento?: string; // Ya en APNP
  // frecuenciaBano?: string; // Ya en APNP
  higieneBucal?: HigieneBucal; // ¿Debería estar dentro de APNP o ExamenIntrabucal?
  alimentacion?: Alimentacion; // ¿Debería estar dentro de APNP?
  grupoSanguineo?: string;
  factorRh?: string;
  inmunizaciones?: string;

  // Estos parecen repetidos de ExploracionFisica.signosVitales
  // peso?: string;
  // imc?: string;
  // talla?: string;
  // presionArterial?: string;
  // pulso?: string;
  // frecuenciaCardiaca?: string; // fc en signosVitales
  // frecuenciaRespiratoria?: string; // fr en signosVitales
  // temperatura?: string;

  // Estos parecen repetidos de Diagnostico y Pronostico
  // diagnosticos?: string;
  // pronosticos?: string;