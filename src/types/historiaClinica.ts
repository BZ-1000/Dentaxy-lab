// types/historiaclinica.ts o donde definas tus tipos

// --- INTERFACES BÁSICAS (SIN CAMBIOS DIRECTOS PARA InterrogatorioSistemas) ---

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
      otras: string; // Considera cambiar a un campo específico si 'otras' es común
  };
}

export interface PadecimientoActual {
  sinSintomas: boolean;
  motivoConsulta: string;
  historiaPadecimiento: string;
  dolor: {
      fechaInicio: string; // Considera usar tipo Date si es posible
      condicionAparicion: string;
      frecuencia: string;
      caracter: string;
      intensidad: string; // Considera usar number (1-10)
      localizacion: {
          tipo: string;
          descripcion: string;
      };
      atenuacion: string;
      causaProvocado?: string;
      ubicacion?: string;
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
  servicios: string[]; // Agua, Luz, Drenaje, etc.
  // Datos de vivienda/entorno
  condicionCalle?: string; // ¿Pavimentada, terracería?
  iluminacionCalle?: string;
  frecuenciaLimpieza?: string; // ¿Hogar?
  cambioRopaCama?: string; // Frecuencia
  hacinamiento?: string; // ¿Sí/No, No. personas/habitación?
  promiscuidad?: string; // ¿Sí/No?
  mascotas?: string; // ¿Sí/No, Cuáles?
  manejoResiduos?: string; // ¿Recolección, quema, aire libre?
  // Higiene personal
  frecuenciaBano?: string; // Diario, cada tercer día, etc.
  lavadoManos?: string[]; // Antes de comer, después de ir al baño, etc.
  cambioRopa?: string; // Frecuencia
  // Higiene Bucal
  frecuenciaCepillado?: string; // Veces al día
  tecnicaCepillado?: string; // Describe o nombre
  auxiliaresBucales?: string[]; // Hilo dental, enjuague, etc.
  ultimaVisitaOdontologo?: string; // Fecha o tiempo transcurrido
  problemasBucales?: string[]; // Caries, sangrado, etc. (quizá mejor en examen intrabucal?)
  // Alimentación
  alimentosConsumidos?: string[]; // Grupos principales (carnes, verduras, etc.)
  frecuenciaFrutasVerduras?: string; // Veces por semana/día
  frecuenciaBebidasAzucaradas?: string;
  frecuenciaComidaChatarra?: string;
  consumoAgua?: string; // Litros/vasos al día
  numeroComidas?: string; // Veces al día
  horarioComidas?: { // Opcional, puede ser texto libre
      desayuno?: string; // Hora aprox
      almuerzo?: string;
      cena?: string;
  };
  ayunoProlongado?: string; // ¿Sí/No, Frecuencia?
  // Adicciones (Considerar si va aquí o en APP)
  tabaquismo?: { activo: boolean; pasivo?: boolean; cantidad?: string; desdeCuando?: string; exFumador?: boolean };
  alcoholismo?: { consume: boolean; frecuencia?: string; tipo?: string; cantidad?: string; desdeCuando?: string; exAlcoholico?: boolean };
  toxicomanias?: { consume: boolean; tipo?: string; frecuencia?: string; via?: string; desdeCuando?: string; exAdicto?: boolean };
  // Sueño
  horasSueno?: string; // Podría ser number
}

// Tipo base para categorías de patologías
export interface CondicionPatologica {
  [key: string]: boolean | string | undefined; // Permite flexibilidad pero puede ser menos seguro
  ninguna: boolean; // Campo común para indicar ausencia en la categoría
  otra: boolean; // Campo común para indicar "otra" no listada
  otraDescripcion: string; // Descripción si 'otra' es true
}

// Mejorar APP usando 'ninguno' consistentemente
export interface AntecedentesPersonalesPatologicos {
  ninguno?: boolean; // Indicador general de ausencia de patologías (reemplaza sinPatologia)
  // Categorías específicas:
  nutricionales?: CondicionPatologica & { anorexia?: boolean; bulimia?: boolean; sobrepeso?: boolean; obesidad?: boolean; };
  cardiacos?: CondicionPatologica & { enfermedadCoronaria?: boolean; arritmias?: boolean; defectosCardiacosCongenitos?: boolean; };
  hepaticos?: CondicionPatologica & { hepatitisA?: boolean; hepatitisB?: boolean; hepatitisC?: boolean; higadoGraso?: boolean; cirrosis?: boolean; };
  enfermedadesTransmisionSexual?: CondicionPatologica & { vih?: boolean; sifilis?: boolean; gonorrea?: boolean; herpesGenital?: boolean; vph?: boolean; };
  enfermedadesEruptivas?: CondicionPatologica & { sarampion?: boolean; rubeola?: boolean; escarlatina?: boolean; varicela?: boolean; paperas?: boolean; };
  pulmonares?: CondicionPatologica & { neumonia?: boolean; bronquitis?: boolean; asma?: boolean; epoc?: boolean; };
  infecciosasParasitarias?: CondicionPatologica & { fiebreTifoidea?: boolean; tuberculosis?: boolean; amibiasis?: boolean; giardiasis?: boolean; ascariasis?: boolean; };
  otrosPadecimientos?: CondicionPatologica; // Ya tiene los campos base
  // Secciones adicionales que podrían integrarse aquí:
  alergias?: { presenta: boolean; descripcion?: string; }; // Simplificado
  transfusiones?: { realizado: boolean; fecha?: string; motivo?: string; }; // Simplificado
  cirugias?: { realizado: boolean; descripcion?: string; }; // Simplificado
  hospitalizaciones?: { realizado: boolean; descripcion?: string; }; // Simplificado
  medicamentosActuales?: { toma: boolean; descripcion?: string; }; // Simplificado
  grupoSanguineo?: string; // Podría ir aquí
  factorRh?: string; // Podría ir aquí
  inmunizaciones?: string; // Descripción o lista
}

// Considera eliminar estas interfaces si se integran en APP
// export interface AntecedentesAlergicos { ... }
// export interface AntecedentesQuirurgicos { ... }
// export interface AntecedentesHemorragicos { ... }

// Refinar AntecedentesGinecoObstetricos
export interface AntecedentesGinecoObstetricos {
  aplica: boolean; // Esencial para saber si llenar el resto
  menarca?: string; // Edad
  ritmoMenstrual?: string; // Regularidad y duración (e.g., 'Regular 28/5')
  fum?: string; // YYYY-MM-DD o estado ('Menopausia', 'No recuerda')
  ivsa?: string; // Edad o 'No aplica'
  numeroParejas?: number | string;
  metodoAnticonceptivo?: string; // 'Ninguno', 'ACO', 'DIU', etc.
  gestas?: number;
  paras?: number;
  cesareas?: number;
  abortos?: number;
  fechaUltimoParto?: string; // YYYY-MM-DD
  fechaUltimoAborto?: string; // YYYY-MM-DD
  complicacionesEmbarazoParto?: string;
  etsPrevias?: string; // Listar o describir
  fechaUltimaCitologia?: string; // YYYY-MM-DD
  resultadoCitologia?: string;
  autoexploracionMamaria?: boolean; // Sí/No
  fechaUltimaMastografia?: string; // YYYY-MM-DD
  resultadoMastografia?: string;
}

// --- NUEVA INTERFAZ ESPECÍFICA ---
// Define la estructura esperada para las redacciones generadas
export interface RedaccionesInterrogatorio {
  digestivo: string;
  respiratorio: string;
  cardiovascular: string;
  genitoUrinario: string; // Clave corregida
  endocrino: string;
  tegumentario: string;
  musculoEsqueletico: string;
  nervioso: string;
  // Añade aquí cualquier otro sistema que incluyas
}


// --- Exploración Física y Exámenes Específicos (sin cambios directos) ---
export interface ExploracionFisica {
  signosVitales: {
      ta: string; fc: string; fr: string; temperatura: string;
      peso: string; talla: string; imc: string;
  };
  exploracionGeneral?: string; // Campo de texto libre para hallazgos generales
  // Opcional: campos detallados si se prefiere a texto libre
  // cabeza?: string; cuello?: string; torax?: string; abdomen?: string;
  // extremidades?: string; pielAnexos?: string;
}

// Interfaces para exámenes específicos (Odontología, etc.)
// (Se mantienen como estaban, pero considera agruparlas bajo una sección 'examenOdontologico' en FormDataState)
export interface ExamenCabeza { /*...*/ }
export interface ArticulacionCraneomandibular { /*...*/ }
export interface ExamenCuello { /*...*/ }
export interface ExamenIntrabucal { /*...*/ }
export interface GlandulasSalivales { /*...*/ }
export interface Oclusion { /*...*/ }
export interface RelacionDientes { /*...*/ }
export interface LineaMedia { /*...*/ }
export interface Frenillos { /*...*/ }
export interface Diagnostico { /*...*/ }
export interface Pronostico { /*...*/ }
// export interface HigieneBucal { /*...*/ } // Ya definido dentro de APNP
// export interface Alimentacion { /*...*/ } // Ya definido dentro de APNP


// --- INTERFAZ PRINCIPAL DEL ESTADO ---
export interface FormDataState {
  padecimientoActual: PadecimientoActual;
  antecedentesHeredoFamiliares: AntecedentesHeredoFamiliares;
  antecedentesPersonalesNoPatologicos: AntecedentesPersonalesNoPatologicos;
  antecedentesPersonalesPatologicos: AntecedentesPersonalesPatologicos;
  // Considera eliminar las secciones separadas si se integraron en APP
  // antecedentesAlergicos?: AntecedentesAlergicos;
  // antecedentesQuirurgicos?: AntecedentesQuirurgicos;
  // antecedentesHemorragicos?: AntecedentesHemorragicos;
  antecedentesGinecoObstetricos?: AntecedentesGinecoObstetricos; // Opcional

  // --- Campo actualizado ---
  interrogatorioSistemas?: RedaccionesInterrogatorio; // Usa la interfaz específica, opcional

  exploracionFisica: ExploracionFisica;

  // Agrupar exámenes específicos bajo una llave opcional podría ser más limpio:
  examenOdontologico?: {
      examenCabeza?: ExamenCabeza;
      articulacionCraneomandibular?: ArticulacionCraneomandibular;
      examenCuello?: ExamenCuello;
      examenIntrabucal?: ExamenIntrabucal;
      glandulasSalivales?: GlandulasSalivales;
      oclusion?: Oclusion;
      relacionDientes?: RelacionDientes;
      lineaMedia?: LineaMedia;
      frenillos?: Frenillos;
  };
  // Diagnóstico y Pronóstico (pueden ir juntos)
  diagnosticoPronostico?: {
      diagnostico?: Diagnostico;
      pronostico?: Pronostico;
  };

  // Eliminar campos duplicados que ya están en secciones específicas
  // (Los campos sueltos que tenías al final probablemente pertenecen a APNP, APP o ExploracionFisica)
}