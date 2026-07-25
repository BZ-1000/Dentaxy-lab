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
    "¡Hola! ¿En qué le ayudo?",
    "¿Qué necesita?",
    "¡Hola! A su disposición",
    "¿Cómo le ayudo hoy?",
    "Dígame, ¿cómo le puedo asistir?",
  ],

  // ── Confirmación de apertura de directorio ─────────────────────────────────
  abreDirectorio: [
    "Abriendo el directorio de pacientes.",
    "Accediendo al directorio de expedientes.",
    "Aquí tiene el listado de pacientes.",
    "Mostrando el directorio clínico.",
  ],

  // ── Confirmación de apertura de formulario ─────────────────────────────────
  abreFormulario: [
    "Abriendo el formulario de registro. ¿Cuál es el nombre?",
    "¿Me indica el nombre para registrar al nuevo paciente?",
    "Formulario abierto. ¿Nombre completo del paciente?",
    "Iniciando registro de nuevo paciente. ¿Cuál es el nombre?",
  ],

  // ── Solicitar nombre del paciente a buscar ─────────────────────────────────
  pedirNombreBusqueda: [
    "¿Qué paciente desea buscar?",
    "¿A qué paciente busca?",
    "Dígame el nombre y lo localizo.",
    "¿Nombre del expediente a abrir?",
  ],

  // ── No entendió ────────────────────────────────────────────────────────────
  noEntendio: [
    "No le escuché bien. ¿Puede repetir?",
    "No capté la instrucción. ¿Me la repite?",
    "¿Podría repetir eso? No le entendí con claridad.",
  ],

  // ── Ayuda / funciones ──────────────────────────────────────────────────────
  ayuda: [
    "Puedo buscar pacientes registrar nuevos expedientes responder preguntas clínicas y navegar el sistema ¿Qué necesita?",
    "Le asisto con registro de pacientes búsquedas en el directorio preguntas clínicas y control del sistema ¿Por dónde empezamos?",
    "Mis funciones son gestión de expedientes búsqueda de pacientes información clínica y navegación por voz ¿Qué requiere?",
  ],

  // ── Cita / agenda ──────────────────────────────────────────────────────────
  cita: [
    "La gestión de citas está disponible en el módulo de agenda ¿Desea que lo abra?",
    "Para agendar una cita indíqueme el nombre del paciente y la fecha",
    "¿Para qué paciente desea programar la cita y en qué fecha?",
  ],

  // ── Historia clínica ───────────────────────────────────────────────────────
  historiaClinica: [
    "Puedo abrir la historia clínica del paciente activo ¿Confirma?",
    "¿Desea iniciar el expediente del paciente activo?",
    "Para abrir la historia clínica dígame el nombre del paciente",
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

// ─── Algoritmo Levenshtein para coincidencia difusa ──────────────────────────
function levenshteinDistance(a: string, b: string): number {
  const tmp = [];
  let i, j;
  const alen = a.length;
  const blen = b.length;
  if (alen === 0) return blen;
  if (blen === 0) return alen;
  for (i = 0; i <= alen; i++) {
    tmp[i] = [i];
  }
  for (j = 0; j <= blen; j++) {
    tmp[0][j] = j;
  }
  for (i = 1; i <= alen; i++) {
    for (j = 1; j <= blen; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return tmp[alen][blen];
}

// ─── Buscar el paciente real que mejor coincida con el nombre dictado ────────
export function findBestMatchingPatient(query: string): string {
  try {
    const listStr = sessionStorage.getItem('dentaxy_patients_list');
    if (!listStr) return query;
    const patients = JSON.parse(listStr);
    if (!Array.isArray(patients) || patients.length === 0) return query;

    const normalize = (s: string) => s.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // quitar acentos
      .replace(/[¿?¡!.,;:]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const normQuery = normalize(query);
    const queryTokens = normQuery.split(/\s+/).filter(Boolean);
    if (queryTokens.length === 0) return query;

    let bestPatient = null;
    let highestScore = -1;

    for (const patient of patients) {
      const pName = patient.name || patient.nombre;
      if (!pName) continue;
      const normName = normalize(pName);
      
      // 1. Coincidencia exacta
      if (normName === normQuery) {
        return pName;
      }

      // 2. Calcular puntuación basada en tokens
      const nameTokens = normName.split(/[,\s]+/).filter(Boolean);
      let matchScore = 0;

      for (const qToken of queryTokens) {
        let bestTokenScore = 0;
        for (const nToken of nameTokens) {
          if (qToken === nToken) {
            bestTokenScore = Math.max(bestTokenScore, 10);
          } else if (nToken.startsWith(qToken) || qToken.startsWith(nToken)) {
            bestTokenScore = Math.max(bestTokenScore, 6);
          } else {
            const dist = levenshteinDistance(qToken, nToken);
            const maxLen = Math.max(qToken.length, nToken.length);
            const sim = 1 - dist / maxLen;
            if (sim > 0.6) {
              bestTokenScore = Math.max(bestTokenScore, sim * 8);
            }
          }
        }
        matchScore += bestTokenScore;
      }

      const globalDist = levenshteinDistance(normQuery, normName);
      const globalMaxLen = Math.max(normQuery.length, normName.length);
      const globalSim = 1 - globalDist / globalMaxLen;
      
      const totalScore = matchScore + (globalSim * 5);

      if (totalScore > highestScore) {
        highestScore = totalScore;
        bestPatient = patient;
      }
    }

    if (highestScore > 4 && bestPatient) {
      const matchedName = bestPatient.name || bestPatient.nombre;
      console.log(`[DEX FUZZY] Coincidencia encontrada: "${query}" -> "${matchedName}" (Score: ${highestScore.toFixed(2)})`);
      return matchedName;
    }
  } catch (e) {
    console.error('[DEX FUZZY] Error matching patients:', e);
  }
  return query;
}

// ─── Función de búsqueda de intención ─────────────────────────────────────────
function detectIntent(message: string): { category: Categoria; action?: () => void; query?: string } | null {
  const m = norm(message);

  // ── Buscar paciente por nombre (patrón especial con variantes extendidas) ────
  const searchPatterns = [
    /(?:busca|buscar|encuentra|encontrar|localiza|localizar|localizame|abre|abrir|muestra|ver|mostrar|muestrame|dame los datos de|dame la informacion de|consultame a|consulta|consultar|trae a|trae la informacion de|traeme a|donde esta|donde esta el expediente de)\s+(?:(?:al|a la|al paciente|a la paciente|el expediente de|el historial de|el archivo de|los datos de|el expediente de la paciente|el expediente del paciente)\s+)?(.{2,40})/i,
    /(?:expediente|historial|historia|ficha|archivo)\s+(?:de|del|de la|del paciente|de la paciente)\s+(.{2,40})/i,
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
        // Encontrar coincidencia difusa con pacientes reales antes de proceder
        const matchedName = findBestMatchingPatient(query);
        return {
          category: "abreDirectorio",
          action: () => {
            window.dispatchEvent(new CustomEvent("dex:openPatientsList"));
            window.dispatchEvent(new CustomEvent("dex:searchPatient", { detail: { query: matchedName } }));
          },
          query: matchedName,
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
  if (m.length < 2) return "__NO_UNDERSTOOD__";

  const intent = detectIntent(message);

  if (intent) {
    // Ejecutar acción de navegación/sistema si existe
    if (intent.action) intent.action();

    // Si es búsqueda de paciente, personalizar la respuesta sin frases de sumisión o Listo/Hecho
    if (intent.query) {
      const templates = [
        `He colocado el expediente de ${intent.query} en pantalla`,
        `El historial de ${intent.query} ya está centrado en pantalla`,
        `Traigo la información de ${intent.query} a primer plano`,
        `El archivo de ${intent.query} se encuentra ahora al centro`,
      ];
      return pick(templates);
    }

    return pick(RESPUESTAS[intent.category]);
  }

  // ── Sin coincidencia clara: retornar token especial para desactivación silenciosa ───
  return "__NO_UNDERSTOOD__";
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
