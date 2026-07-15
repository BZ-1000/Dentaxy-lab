// ═══════════════════════════════════════════════════════════════════════════════
// MOTOR DE RESPUESTAS LOCAL DE DEX — Dentaxy Technologies
// 100% local — sin APIs externas — sin costos — privacidad absoluta
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Interfaz de historial (se mantiene por compatibilidad) ──────────────────
export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

// ─── Utilidad: pick aleatorio de un arreglo ───────────────────────────────────
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Utilidad: normalizar texto para comparar ─────────────────────────────────
function norm(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar acentos
    .replace(/[¿?¡!.,;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Banco de respuestas con múltiples variantes por categoría ────────────────

const RESPUESTAS = {

  // ── Saludos ────────────────────────────────────────────────────────────────
  saludo: [
    "A sus órdenes, Doctor. ¿En qué le puedo asistir?",
    "Listo para trabajar, Doctor. ¿Qué necesita?",
    "Buenas, Doctor. A su disposición.",
    "A la orden, Doctor. ¿Cómo le puedo ayudar hoy?",
    "Aquí listo, Doctor. Dígame.",
  ],

  // ── Confirmación de apertura de directorio ─────────────────────────────────
  abreDirectorio: [
    "Abriendo el directorio de pacientes, Doctor.",
    "Accediendo al directorio de expedientes.",
    "Aquí tiene el listado de pacientes, Doctor.",
    "Mostrando el directorio clínico.",
  ],

  // ── Confirmación de apertura de formulario ─────────────────────────────────
  abreFormulario: [
    "Abriendo el formulario de registro, Doctor. ¿Cuál es el nombre del paciente?",
    "Listo para registrar al nuevo paciente. ¿Me indica el nombre?",
    "Formulario abierto. ¿Nombre completo del paciente?",
    "Iniciando registro de nuevo paciente. ¿Cuál es el nombre?",
  ],

  // ── Solicitar nombre del paciente a buscar ─────────────────────────────────
  pedirNombreBusqueda: [
    "¿El nombre del paciente que desea buscar, Doctor?",
    "¿A qué paciente busca, Doctor?",
    "Dígame el nombre del paciente y lo localizo de inmediato.",
    "¿Nombre del expediente a abrir?",
  ],

  // ── No entendió ────────────────────────────────────────────────────────────
  noEntendio: [
    "No le escuché bien, Doctor. ¿Puede repetir el comando?",
    "Disculpe, no capté la instrucción. ¿Me la repite?",
    "¿Podría repetir eso, Doctor? No lo entendí con claridad.",
    "No procesé bien el comando. ¿Me lo repite?",
  ],

  // ── Ayuda / funciones ──────────────────────────────────────────────────────
  ayuda: [
    "Puedo buscar pacientes, registrar nuevos expedientes, responder preguntas de odontología y navegar el sistema. ¿Qué necesita?",
    "Le asisto con: registro de pacientes, búsquedas en el directorio, preguntas clínicas y control del sistema. ¿Por dónde empezamos?",
    "Mis funciones: gestión de expedientes, búsqueda de pacientes, información clínica y navegación por voz. ¿Qué requiere, Doctor?",
  ],

  // ── Cita / agenda ──────────────────────────────────────────────────────────
  cita: [
    "La gestión de citas está disponible en el módulo de agenda. ¿Desea que lo abra, Doctor?",
    "Para agendar una cita, indíqueme el nombre del paciente y la fecha.",
    "¿Para qué paciente desea programar la cita y en qué fecha, Doctor?",
  ],

  // ── Historia clínica ───────────────────────────────────────────────────────
  historiaClinica: [
    "Puedo abrir la historia clínica del paciente activo. ¿Confirma?",
    "¿Desea iniciar el expediente del paciente activo, Doctor?",
    "Para abrir la historia clínica, dígame el nombre del paciente.",
  ],

  // ══════════════════════════════════════════════════════════════════════════
  // ODONTOLOGÍA CLÍNICA — Conocimiento específico por área
  // ══════════════════════════════════════════════════════════════════════════

  // ── Caries / cavidades ────────────────────────────────────────────────────
  caries: [
    "La caries es una enfermedad infecciosa multifactorial. Se clasifica en grado I (esmalte), II (dentina superficial), III (dentina profunda) y IV (compromiso pulpar). El tratamiento depende del grado: obturación simple, recubrimiento pulpar o endodoncia.",
    "Para diagnosticar caries use exploración táctil con sonda, radiografía periapical y transiluminación. La clasificación ICDAS es el estándar internacional. ¿Desea registrar el diagnóstico en el expediente?",
    "Las caries incipientes en esmalte pueden revertirse con flúor y selladores. Las que alcanzan dentina requieren preparación cavitaria y restauración. ¿Cuál es el grado de la lesión, Doctor?",
    "Para caries en zona posterior se recomienda composite de alta viscosidad o amalgama en dientes de alta carga. En anteriores, composite estético de micropartículas. ¿El diente afectado es anterior o posterior?",
  ],

  // ── Periodontitis / encías ─────────────────────────────────────────────────
  periodoncia: [
    "La gingivitis es reversible con instrucción de higiene y profilaxis profesional. La periodontitis implica pérdida ósea irreversible y requiere raspado y alisado radicular por cuadrantes.",
    "El índice gingival y sondeo periodontal son esenciales. Bolsas de más de 4 mm con sangrado al sondeo indican periodontitis activa. ¿Cuántos mm de sondeo registró, Doctor?",
    "Para periodontitis severa (>6 mm de sondeo, pérdida ósea >50%) se considera cirugía de colgajo o regeneración ósea guiada. ¿Quiere que registre el diagnóstico periodontal?",
    "La placa bacteriana es el factor etiológico principal. El protocolo básico: control de placa, detartraje supragingival, raspado subgingival y reevaluación a las 6-8 semanas.",
  ],

  // ── Endodoncia / pulpa ─────────────────────────────────────────────────────
  endodoncia: [
    "Para diagnóstico pulpar: prueba de vitalidad (frío/calor), percusión axial y lateral, palpación apical y radiografía periapical. El diagnóstico puede ser pulpitis reversible, irreversible o necrosis.",
    "La pulpitis irreversible sintomática requiere tratamiento de conductos. En un solo diente maduro: anestesia, acceso cameral, biomecánica y obturación con gutapercha. ¿Cuál es el número de raíces del diente, Doctor?",
    "Para la longitud de trabajo use localizador apical electrónico y confirme con radiografía. La instrumentación con sistemas rotatorios Ni-Ti reduce el tiempo operatorio hasta un 60%.",
    "En retratamiento endodóntico evalúe: calidad de la obturación previa, fractura radicular vertical, reabsorciones y periodontitis apical persistente en radiografía. ¿Es retratamiento, Doctor?",
  ],

  // ── Exodoncia / extracciones ───────────────────────────────────────────────
  exodoncia: [
    "Para exodoncia simple: radiografía previa, consentimiento informado, anestesia infiltrativa o troncular. Técnica: luxación, sindesmotomía, fórceps y curetaje del alveolo.",
    "En dientes con dilaceraciones o raíces divergentes evalúe odontosección. Para cordales incluidos: CBCT para valorar relación con nervio alveolar inferior, Doctor.",
    "Contraindicaciones relativas: anticoagulantes (INR>3.5), bifosfonatos IV, radioterapia maxilar previa, infección aguda no controlada. ¿Tiene el historial médico del paciente, Doctor?",
    "Postoperatorio: compresión con gasa 20 min, no enjuagarse 24h, dieta blanda, analgésico e ibuprofeno 400-600 mg cada 8h según peso. ¿Desea que genere las indicaciones postoperatorias?",
  ],

  // ── Ortodoncia ─────────────────────────────────────────────────────────────
  ortodoncia: [
    "El diagnóstico ortodóntico requiere: fotografías extra e intraorales, modelos de estudio o escáner digital, radiografía panorámica y telerradiografía lateral para cefalometría de Steiner o Rickets.",
    "Para clasificar la maloclusión use la escala de Angle: Clase I (relación molar normal), Clase II (retrognatismo mandibular o prognatismo maxilar), Clase III (prognatismo mandibular). ¿Cuál es la clase del paciente?",
    "Los alineadores transparentes (Invisalign-like) tienen indicación en casos leve-moderados. Brackets cerámicos o metálicos para casos complejos con extracciones o cirugía ortognática.",
    "La retención postratamiento es fase crítica: retenedores fijos de .016 trenzado en sector anterior y removibles nocturnos superiores. El mínimo es 2 años activos.",
  ],

  // ── Prótesis ──────────────────────────────────────────────────────────────
  protesis: [
    "Para prótesis parcial fija evalúe pilares (vitalidad, soporte óseo, paralelismo), espacio protésico y oclusión. El material: metal-cerámica, disilicato de litio o zirconia según el caso.",
    "La prótesis total removible requiere: impresiones definitivas en poliéter o silicona, relación intermaxilar con rodetes de mordida y selección de dientes. ¿El desdentamiento es superior, inferior o ambas arcadas?",
    "Implantes dentales: el protocolo estándar es carga diferida a los 3-6 meses. Carga inmediata solo en torque de inserción >35 N·cm y hueso tipo I-II. ¿Necesita valorar densidad ósea, Doctor?",
    "Para coronas individuales sobre implante, el tiempo de osteointegración varía de 8-12 semanas en mandíbula y 12-16 semanas en maxilar. ¿Cuándo fue colocado el implante?",
  ],

  // ── Anestesia ─────────────────────────────────────────────────────────────
  anestesia: [
    "Para maxilar: anestesia infiltrativa supraperióstica con lidocaína al 2% con epinefrina 1:100,000. Dosis máxima: 4.4 mg/kg. Para nervio palatino mayor: 0.5 ml en fosa palatina.",
    "Anestesia troncular del nervio alveolar inferior: técnica de Halsted. Punto de inserción: raphe pterigomandibular, 1 cm sobre el plano oclusal. Aspirar antes de inyectar. ¿Es el primer bloqueo del paciente, Doctor?",
    "En pacientes con ansiedad considere sedación consciente con midazolam 7.5-15 mg VO 30 min antes o N2O/O2 inhalatoria. Siempre con consentimiento informado y monitoreo.",
    "Contraindicaciones relativas de vasoconstrictores: hipertiroidismo no controlado, arritmias severas, feocromocitoma. En estos casos use prilocaína o mepivacaína sin epinefrina.",
  ],

  // ── Radiografías ──────────────────────────────────────────────────────────
  radiografia: [
    "Para periapicales use técnica de paralelismo con posicionador RINN. En anteriores: punto de entrada 5° caudales. En posteriores: angulación horizontal según anatomía.",
    "La radiografía panorámica evalúa arcadas completas, ATM, senos maxilares y canal mandibular. Para diagnóstico periodontal detallado prefiera radiografías periapicales seriadas.",
    "El CBCT está indicado en: implantología, cirugía de terceros molares con riesgo nervioso, patología quística y ortodoncia compleja. La dosis de radiación es mayor que 2D, úselo con criterio.",
  ],

  // ── Medicamentos / prescripción ───────────────────────────────────────────
  medicamentos: [
    "Para dolor postoperatorio: ibuprofeno 400-600 mg cada 8h por 3-5 días o paracetamol 500-1000 mg cada 6-8h. Si hay infección agregue amoxicilina 500 mg cada 8h por 7 días. ¿Desea que redacte la receta?",
    "En pacientes con alergia a penicilina use clindamicina 300 mg cada 8h o azitromicina 500 mg el día 1, luego 250 mg por 4 días. ¿Tiene alergias registradas el paciente, Doctor?",
    "Para control del dolor severo: ketorolaco 10 mg cada 6-8h máximo 5 días. No combinar con otros AINEs ni en insuficiencia renal. ¿Tiene antecedentes gastrointestinales el paciente?",
    "Ansiolíticos preoperatorios: diazepam 5-10 mg la noche anterior y 2h antes del procedimiento. Informar al paciente que no conduzca. ¿Requiere receta controlada, Doctor?",
  ],

  // ── ATM / bruxismo ────────────────────────────────────────────────────────
  atm: [
    "Los trastornos temporomandibulares incluyen dolor miofascial, desplazamiento discal con o sin reducción, y artralgia. Inicie con terapia conservadora: AINE, fisioterapia y férula de relajación.",
    "Para el diagnóstico de bruxismo: desgaste oclusal, hipertrofia del masetero, línea alba en mucosa y fracturas de restauraciones repetidas. La férula oclusal de acrílico duro es el estándar.",
    "En desplazamiento discal sin reducción con limitación de apertura: maniobra de reposicionamiento manual y férula de reposicionamiento anterior. Si no mejora en 6 semanas, valorar artrocentesis.",
  ],

  // ── Implantes ─────────────────────────────────────────────────────────────
  implantes: [
    "Criterios para implantes: hueso residual ≥8 mm de altura y ≥5 mm de anchura, paciente sistémicamente compensado, sin tabaquismo severo y sin radioterapia activa en la zona.",
    "El protocolo de implante inmediato post-exodoncia requiere: alveolo íntegro sin infección activa, torque de inserción ≥35 N·cm y relleno con sustituto óseo en el gap peri-implantario.",
    "Para prótesis sobre implante: corona unitaria cementada o atornillada, puente implanto-soportado o sobredentadura con bolas o barra. La elección depende del número de implantes y arcada.",
  ],

  // ── Blanqueamiento ─────────────────────────────────────────────────────────
  blanqueamiento: [
    "Blanqueamiento en consultorio: peróxido de hidrógeno al 35-38% activado con luz LED. Una sesión de 3 ciclos de 15 min. Sensibilidad postoperatoria manejada con nitrato de potasio al 5%.",
    "Blanqueamiento domiciliario: cubetas individualizadas con peróxido de carbamida al 10-16% por 2-4h diarias o al 22% por 30 min. Resultado visible a las 2 semanas.",
    "Contraindicaciones: dientes no vitales (requieren blanqueamiento interno), tetraciclinas severas (respuesta pobre), caries activa sin tratar. ¿Cuál es el tipo de tinción del paciente, Doctor?",
  ],

  // ── Odontopediatría ────────────────────────────────────────────────────────
  odontopediatria: [
    "En dentición primaria las pulpotomías están indicadas en caries que comprometen pulpa cameral sin necrosis. Se usa formocresol o MTA como material de recubrimiento.",
    "Selladores de fosetas y fisuras: indicados en primeros y segundos molares permanentes recién erupcionados con surcos profundos, sin caries. Prevención del 80% de caries oclusales.",
    "Para manejo conductual en niños: técnica decir-mostrar-hacer, refuerzo positivo y control de voz. Óxido nitroso en casos de ansiedad moderada. La premedicación oral solo con indicación clara.",
  ],

  // ── Urgencias dentales ─────────────────────────────────────────────────────
  urgencia: [
    "Para absceso dentoalveolar agudo: drenaje (incisión si fluctuante), antibiótico sistémico y analgesia. No inyecte anestesia directamente en el tejido inflamado; use bloqueo a distancia.",
    "Fractura coronaria: clasificación de Ellis. Grado I (esmalte): pulido. Grado II (dentina): protección con Ca(OH)2 y restauración provisional. Grado III (pulpa): recubrimiento o endodoncia.",
    "Avulsión dental: tiempo extraoral crítico. Reimplante ideal en <30 min. Conservar en leche, suero fisiológico o saliva del paciente. No limpie la raíz con cepillo. Ferulizar 7-14 días.",
    "Alveolitis seca: irrigación con clorhexidina 0.12%, curetaje suave y apósito eugenolado tipo Alvogyl por 3-5 días. No es infecciosa; los antibióticos no están indicados de rutina.",
  ],

  // ── Dentaxy Seed ──────────────────────────────────────────────────────────
  dentaxySeed: [
    "Dentaxy Seed gestiona sus expedientes directamente en su Google Drive personal. Toda la información es suya y del paciente, sin intermediarios.",
    "En Dentaxy Seed puede registrar pacientes, generar historias clínicas, llevar el odontograma y exportar recetas. Todo sin papel.",
    "El sistema funciona 100% en su navegador. Sin instalaciones, sin servidores propietarios y con acceso desde cualquier dispositivo.",
  ],
};

// ─── Mapas de palabras clave por categoría ────────────────────────────────────
// Cada entrada: [palabras_clave[], categoria_de_respuesta]
type Categoria = keyof typeof RESPUESTAS;

const INTENT_MAP: Array<{ keys: string[]; category: Categoria; action?: () => void }> = [
  // Navegación / sistema
  { keys: ["directorio", "lista de pacientes", "todos los pacientes", "ver pacientes", "mostrar pacientes", "listado"], category: "abreDirectorio", action: () => window.dispatchEvent(new CustomEvent("dex:openPatientsList")) },
  { keys: ["agregar paciente", "agrega paciente", "nuevo paciente", "registrar paciente", "registra paciente", "añadir paciente", "crear paciente", "añade paciente"], category: "abreFormulario", action: () => window.dispatchEvent(new CustomEvent("dex:openAddPatient")) },
  { keys: ["cita", "agenda", "horario", "agendar", "programar cita", "citas del dia"], category: "cita" },
  { keys: ["historia clinica", "historial clinico", "expediente", "ficha clinica", "abrir expediente"], category: "historiaClinica" },
  { keys: ["ayuda", "que puedes hacer", "que haces", "para que sirves", "funciones", "comandos", "que puedo pedirte"], category: "ayuda" },
  { keys: ["hola", "buenos dias", "buenas tardes", "buenas noches", "que tal", "como estas", "saludos"], category: "saludo" },

  // Odontología clínica
  { keys: ["caries", "cavidad", "lesion dental", "lesion cariosa", "diente picado", "mancha blanca", "cavidades"], category: "caries" },
  { keys: ["periodont", "periodontitis", "encia", "gingivitis", "placa bacteriana", "calculos", "enfermedad de las encias", "bolsa periodontal", "sangrado al cepillar"], category: "periodoncia" },
  { keys: ["endodoncia", "nervio del diente", "pulpa", "conducto radicular", "tratamiento de conducto", "matar el nervio", "pulpitis", "necrosis pulpar"], category: "endodoncia" },
  { keys: ["extraccion", "extraer", "sacar diente", "muela del juicio", "cordal", "terceros molares", "jalar diente", "quitar diente"], category: "exodoncia" },
  { keys: ["ortodoncia", "brackets", "frenos", "alineadores", "invisalign", "maloclusion", "dientes chuecados", "apiñamiento", "cefalometria"], category: "ortodoncia" },
  { keys: ["protesis", "dentadura", "puente dental", "corona", "implante", "protesis parcial", "dientes postizos"], category: "protesis" },
  { keys: ["implante", "implante dental", "osteointegracion", "implantes dentales", "pilar de implante", "corona sobre implante"], category: "implantes" },
  { keys: ["anestesia", "anestesiar", "adormecer", "bloqueo nervioso", "xylocaina", "lidocaina", "mepivacaina", "epinefrina"], category: "anestesia" },
  { keys: ["radiografia", "rx", "panoramica", "periapical", "cbct", "tomografia dental", "radiografia digital"], category: "radiografia" },
  { keys: ["medicamento", "analgesico", "antibiotico", "ibuprofeno", "amoxicilina", "paracetamol", "dosis", "receta", "prescripcion", "farmaco", "pastillas", "ketorolaco", "clindamicina"], category: "medicamentos" },
  { keys: ["atm", "articulacion temporomandibular", "bruxismo", "rechinar dientes", "dolor de mandibula", "ferula", "trastorno temporomandibular", "chasquido mandibular"], category: "atm" },
  { keys: ["blanqueamiento", "aclaramiento dental", "dientes amarillos", "peróxido", "whitening", "dientes manchados"], category: "blanqueamiento" },
  { keys: ["nino", "pediatria", "odontopediatria", "dientes de leche", "denticion primaria", "selladores", "pulpotomia", "denticion temporal"], category: "odontopediatria" },
  { keys: ["urgencia", "urgencia dental", "absceso", "infeccion", "dolor agudo", "fractura dental", "diente roto", "golpe en el diente", "avulsion", "alveolitis", "infeccion dental"], category: "urgencia" },
  { keys: ["dentaxy", "plataforma", "sistema", "como funciona", "drive", "google drive", "expediente digital"], category: "dentaxySeed" },
];

// ─── Función de búsqueda de intención ─────────────────────────────────────────
function detectIntent(message: string): { category: Categoria; action?: () => void; query?: string } | null {
  const m = norm(message);

  // ── Buscar paciente por nombre (patrón especial) ──────────────────────────
  const searchPatterns = [
    /(?:busca|buscar|encuentra|encontrar|localiza|localizar|abre|abrir|muestra|ver|mostrar)\s+(?:(?:al|a la|al paciente|a la paciente|el expediente de|el historial de)\s+)?(.{2,40})/i,
    /(?:expediente|historial|historia|ficha)\s+(?:de|del|de la)\s+(.{2,40})/i,
    /(?:como va|como esta|como sigue)\s+(.{2,40})/i,
  ];

  for (const pattern of searchPatterns) {
    const mOriginal = message.toLowerCase().trim();
    const match = mOriginal.match(pattern);
    if (match && match[1]) {
      const query = match[1].trim()
        .replace(/^(el|la|los|las|un|una)\s+/i, "")
        .trim();
      // Verificar que no sea una palabra de navegación (falso positivo)
      const navWords = ["directorio", "lista", "formulario", "menu", "sistema", "modulo"];
      if (query.length > 1 && !navWords.some(w => query.includes(w))) {
        return {
          category: "abreDirectorio",
          action: () => {
            window.dispatchEvent(new CustomEvent("dex:openPatientsList"));
            window.dispatchEvent(new CustomEvent("dex:searchPatient", { detail: { query } }));
          },
          query,
        };
      }
    }
  }

  // ── Comparar contra el mapa de intenciones ────────────────────────────────
  for (const intent of INTENT_MAP) {
    if (intent.keys.some(k => m.includes(norm(k)))) {
      return { category: intent.category, action: intent.action };
    }
  }

  return null;
}

// ─── Motor principal de respuesta ─────────────────────────────────────────────
function buildResponse(message: string): string {
  const m = norm(message);

  // Verificar si el mensaje tiene contenido mínimo (anti-basura)
  if (m.length < 2) return pick(RESPUESTAS.noEntendio);

  const intent = detectIntent(message);

  if (intent) {
    // Ejecutar acción de navegación/sistema si existe
    if (intent.action) intent.action();

    // Si es búsqueda de paciente, personalizar la respuesta
    if (intent.query) {
      const templates = [
        `Enseguida, Doctor. He colocado el expediente de ${intent.query} frente a usted.`,
        `Como ordene. El historial de ${intent.query} ya está centrado en pantalla, señor.`,
        `A sus órdenes. He traído la información de ${intent.query} a primer plano.`,
        `Listo, Doctor. El archivo de ${intent.query} se encuentra ahora en el centro de su visor.`,
      ];
      return pick(templates);
    }

    return pick(RESPUESTAS[intent.category]);
  }

  // ── Sin coincidencia clara: respuesta genérica útil ───────────────────────
  return pick(RESPUESTAS.noEntendio);
}

// ─── API pública (compatible con el contrato anterior) ───────────────────────

/**
 * Motor de respuestas DEX — 100% local, sin APIs externas.
 * Compatible con la firma anterior de chatWithAgent para no romper importaciones.
 */
export async function chatWithAgent(
  message: string,
  _profile: { role?: string; currentSystem?: string; priority?: string },
  _chatHistory: ChatMessage[]
): Promise<string> {
  // Pequeña latencia mínima para efecto natural (no bloqueo real)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(buildResponse(message));
    }, 120);
  });
}
