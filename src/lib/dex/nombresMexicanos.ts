// ─────────────────────────────────────────────────────────────────────────────
// Motor de Nombres Inteligente para DEX — 100% local, sin APIs externas
// Dentaxy Technologies © 2026
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Mapa fonético: transcripción errónea del reconocimiento de voz → nombre correcto.
 * Incluye variantes que Chrome Speech Recognition en es-MX genera habitualmente.
 */
export const PHONETIC_MAP: Record<string, string> = {
  // ── Nombres femeninos ──────────────────────────────────────────────────────
  "adelai":        "Adelaida",
  "adelaida":      "Adelaida",
  "agustin":       "Agustín",
  "agustina":      "Agustina",
  "alejanda":      "Alejandra",
  "alejandre":     "Alejandro",
  "alejandra":     "Alejandra",
  "alejandro":     "Alejandro",
  "alicia":        "Alicia",
  "alma":          "Alma",
  "almadelia":     "Almadelia",
  "amirica":       "América",
  "america":       "América",
  "amparo":        "Amparo",
  "ana":           "Ana",
  "anahi":         "Anahí",
  "anahí":         "Anahí",
  "anali":         "Anali",
  "andrea":        "Andrea",
  "andres":        "Andrés",
  "angeles":       "Ángeles",
  "angelica":      "Angélica",
  "angelika":      "Angélica",
  "antonia":       "Antonia",
  "antonio":       "Antonio",
  "areli":         "Arely",
  "arely":         "Arely",
  "armando":       "Armando",
  "arturo":        "Arturo",
  "aurora":        "Aurora",
  "azucena":       "Azucena",
  // B
  "beatris":       "Beatriz",
  "beatrix":       "Beatriz",
  "beatriz":       "Beatriz",
  "berenice":      "Berenice",
  "bereni":        "Berenice",
  "blanca":        "Blanca",
  "brenda":        "Brenda",
  // C
  "camila":        "Camila",
  "caren":         "Karen",
  "carina":        "Karina",
  "carlos":        "Carlos",
  "carla":         "Carla",
  "carmen":        "Carmen",
  "carolina":      "Carolina",
  "catalina":      "Catalina",
  "cecilia":       "Cecilia",
  "cesar":         "César",
  "citlali":       "Citlali",
  "citlaly":       "Citlali",
  "claudia":       "Claudia",
  "concepcion":    "Concepción",
  "consuelo":      "Consuelo",
  "consue":        "Consuelo",
  "consuel":       "Consuelo",
  "cristal":       "Cristal",
  "cristian":      "Cristian",
  "cristina":      "Cristina",
  // D
  "dafne":         "Dafne",
  "daniel":        "Daniel",
  "daniela":       "Daniela",
  "david":         "David",
  "diana":         "Diana",
  "diego":         "Diego",
  "dolores":       "Dolores",
  // E
  "edgar":         "Edgar",
  "edith":         "Edith",
  "eduardo":       "Eduardo",
  "elena":         "Elena",
  "eliana":        "Eliana",
  "elisa":         "Elisa",
  "elizabet":      "Elizabeth",
  "elizabeth":     "Elizabeth",
  "emilia":        "Emilia",
  "emiliano":      "Emiliano",
  "emma":          "Emma",
  "enrique":       "Enrique",
  "ernesto":       "Ernesto",
  "esperanza":     "Esperanza",
  "estelita":      "Estelita",
  "esther":        "Esther",
  "ester":         "Esther",
  "eva":           "Eva",
  // F
  "fabian":        "Fabián",
  "fernanda":      "Fernanda",
  "fernado":       "Fernando",
  "fernando":      "Fernando",
  "fernan":        "Fernando",
  "flor":          "Flor",
  "francisca":     "Francisca",
  "francisco":     "Francisco",
  "frida":         "Frida",
  // G
  "gabriel":       "Gabriel",
  "gabriela":      "Gabriela",
  "gabrie":        "Gabriela",
  "gerardo":       "Gerardo",
  "gerar":         "Gerardo",
  "gilberto":      "Gilberto",
  "gloria":        "Gloria",
  "gonzalo":       "Gonzalo",
  "guadalupe":     "Guadalupe",
  "guadalu":       "Guadalupe",
  "guadalup":      "Guadalupe",
  "guada":         "Guadalupe",
  "guillermo":     "Guillermo",
  "guiller":       "Guillermo",
  // H
  "hector":        "Héctor",
  "héctor":        "Héctor",
  "hortensia":     "Hortensia",
  "hugo":          "Hugo",
  // I
  "ignacio":       "Ignacio",
  "ines":          "Inés",
  "inés":          "Inés",
  "irene":         "Irene",
  "irma":          "Irma",
  "isaac":         "Isaac",
  "isabel":        "Isabel",
  "isabe":         "Isabel",
  "ivan":          "Iván",
  "iván":          "Iván",
  // J
  "jacinto":       "Jacinto",
  "jaime":         "Jaime",
  "jair":          "Jair",
  "javier":        "Javier",
  "javie":         "Javier",
  "jazmin":        "Jazmín",
  "jessica":       "Jessica",
  "jesica":        "Jessica",
  "jesus":         "Jesús",
  "jorge":         "Jorge",
  "jose":          "José",
  "josefina":      "Josefina",
  "juan":          "Juan",
  "juana":         "Juana",
  "juanita":       "Juanita",
  "julia":         "Julia",
  "julio":         "Julio",
  // K
  "karen":         "Karen",
  "karem":         "Karen",
  "karin":         "Karina",
  "karina":        "Karina",
  "karla":         "Karla",
  // L
  "laura":         "Laura",
  "leonor":        "Leonor",
  "leticia":       "Leticia",
  "letici":        "Leticia",
  "liliana":       "Liliana",
  "lili":          "Liliana",
  "lourdes":       "Lourdes",
  "lucia":         "Lucía",
  "lucía":         "Lucía",
  "luisa":         "Luisa",
  "luiz":          "Luis",
  "luis":          "Luis",
  "luna":          "Luna",
  // M
  "magdalena":     "Magdalena",
  "manuel":        "Manuel",
  "manuela":       "Manuela",
  "marcela":       "Marcela",
  "marcos":        "Marcos",
  "margarita":     "Margarita",
  "margari":       "Margarita",
  "maria":         "María",
  "mariana":       "Mariana",
  "maricruz":      "Maricruz",
  "maribel":       "Maribel",
  "marina":        "Marina",
  "mario":         "Mario",
  "marta":         "Marta",
  "martha":        "Martha",
  "martin":        "Martín",
  "mayra":         "Mayra",
  "melissa":       "Melissa",
  "melisa":        "Melissa",
  "miguel":        "Miguel",
  "milagros":      "Milagros",
  "miriam":        "Miriam",
  "mirna":         "Mirna",
  "monica":        "Mónica",
  "mónica":        "Mónica",
  // N
  "nancy":         "Nancy",
  "natalia":       "Natalia",
  "noe":           "Noé",
  "noemi":         "Noemí",
  "noemí":         "Noemí",
  "norma":         "Norma",
  // O
  "octavio":       "Octavio",
  "ofelia":        "Ofelia",
  "omar":          "Omar",
  "oscar":         "Óscar",
  // P
  "pablo":         "Pablo",
  "patricia":      "Patricia",
  "patrici":       "Patricia",
  "paula":         "Paula",
  "pedro":         "Pedro",
  "pilar":         "Pilar",
  // R
  "rafael":        "Rafael",
  "ramiro":        "Ramiro",
  "ramon":         "Ramón",
  "raquel":        "Raquel",
  "raul":          "Raúl",
  "rebeca":        "Rebeca",
  "reina":         "Reina",
  "renata":        "Renata",
  "roberto":       "Roberto",
  "rosa":          "Rosa",
  "rosalba":       "Rosalba",
  "rosario":       "Rosario",
  "ruben":         "Rubén",
  // S
  "sandra":        "Sandra",
  "sara":          "Sara",
  "sarai":         "Saraí",
  "saraí":         "Saraí",
  "sergio":        "Sergio",
  "silvia":        "Silvia",
  "sofia":         "Sofía",
  "sofía":         "Sofía",
  "sonya":         "Sonia",
  "sonia":         "Sonia",
  "susana":        "Susana",
  // T
  "teresa":        "Teresa",
  "teresita":      "Teresita",
  "tomás":         "Tomás",
  "tomas":         "Tomás",
  // V
  "valeria":       "Valeria",
  "vanesa":        "Vanessa",
  "vanessa":       "Vanessa",
  "veronica":      "Verónica",
  "verónica":      "Verónica",
  "victor":        "Víctor",
  "victoría":      "Victoria",
  "victoria":      "Victoria",
  // X / Y / Z
  "xavier":        "Javier",
  "xaver":         "Javier",
  "xochitl":       "Xóchitl",
  "yesenia":       "Yesenia",
  "yessenia":      "Yesenia",
  "zaira":         "Zaira",
  "zoila":         "Zoila",

  // ── Apellidos comunes (variantes fonéticas) ───────────────────────────────
  "garsia":        "García",
  "garcia":        "García",
  "gonzales":      "González",
  "hernandes":     "Hernández",
  "hernandez":     "Hernández",
  "jimenez":       "Jiménez",
  "jiménes":       "Jiménez",
  "lopeaz":        "López",
  "lopez":         "López",
  "martinez":      "Martínez",
  "martines":      "Martínez",
  "mendoza":       "Mendoza",
  "morales":       "Morales",
  "moreno":        "Moreno",
  "perez":         "Pérez",
  "peres":         "Pérez",
  "ramirez":       "Ramírez",
  "rodes":         "Rodés",
  "rodriguez":     "Rodríguez",
  "rodrigues":     "Rodríguez",
  "rojas":         "Rojas",
  "romero":        "Romero",
  "salinas":       "Salinas",
  "sánchez":       "Sánchez",
  "sanchez":       "Sánchez",
  "torres":        "Torres",
  "vargas":        "Vargas",
  "villanueva":    "Villanueva",
};

// ─── Preposiciones de apellidos compuestos ─────────────────────────────────
const APELLIDO_PREPOSITIONS = new Set(["de", "del", "de la", "de los", "de las", "la", "los", "las"]);

// ─── Palabras que NO son nombres (para filtrar comandos sin sentido) ─────────
export const NON_NAME_WORDS = new Set([
  "el", "la", "los", "las", "un", "una", "es", "son", "para", "por", "con",
  "sin", "sobre", "bajo", "que", "como", "cuando", "donde", "hay", "tiene",
  "hola", "adios", "gracias", "bien", "mal", "si", "no", "ok", "okey",
  "bueno", "pues", "este", "eso", "eso", "aqui", "allá", "también",
  "entonces", "pero", "y", "o", "a", "de", "del",
]);

// ─── Distancia de Levenshtein (para corrección fonética aproximada) ────────
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// ─── Normalizar un token individual ───────────────────────────────────────
function normalizeToken(raw: string): string {
  const lower = raw.toLowerCase().trim();

  // 1. Búsqueda exacta en mapa fonético
  if (PHONETIC_MAP[lower]) return PHONETIC_MAP[lower];

  // 2. Búsqueda aproximada: distancia ≤ 2 para palabras largas (≥ 5 chars)
  if (lower.length >= 5) {
    let best = "";
    let bestDist = 3; // umbral máximo
    for (const key of Object.keys(PHONETIC_MAP)) {
      if (Math.abs(key.length - lower.length) > 3) continue; // skip rápido
      const d = levenshtein(lower, key);
      if (d < bestDist) {
        bestDist = d;
        best = key;
      }
    }
    if (best) return PHONETIC_MAP[best];
  }

  // 3. Sin corrección: capitalizar primer letra
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

// ─── API pública: normalizar nombre completo ───────────────────────────────

/**
 * Recibe texto crudo del reconocimiento de voz y devuelve un nombre propio
 * correctamente capitalizado y corregido fonéticamente.
 *
 * @example
 * normalizePatientName("guadalu garcia perez")
 * // → "Guadalupe García Pérez"
 */
export function normalizePatientName(raw: string): string {
  if (!raw || !raw.trim()) return "";

  // Limpiar puntuación y espacios extra
  const cleaned = raw
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?¿¡]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const tokens = cleaned.split(" ").filter(Boolean);
  const result: string[] = [];

  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];

    // Mantener preposiciones en minúscula dentro de apellidos compuestos
    if (APELLIDO_PREPOSITIONS.has(token)) {
      // Agregar junto al siguiente token como unidad
      if (i + 1 < tokens.length) {
        result.push(token); // "de", "del", etc. van en minúscula
      }
      i++;
      continue;
    }

    result.push(normalizeToken(token));
    i++;
  }

  return result.join(" ");
}

/**
 * Divide nombre completo en nombre(s) y apellido(s).
 * Heurística: si hay ≥ 3 tokens, los últimos 2 son apellidos.
 */
export function splitNombreApellidos(fullName: string): { nombre: string; apellidos: string } {
  const parts = fullName.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return { nombre: parts[0], apellidos: "" };
  if (parts.length === 2) return { nombre: parts[0], apellidos: parts[1] };
  // ≥ 3 tokens: últimos 2 como apellidos
  const apellidos = parts.slice(-2).join(" ");
  const nombre = parts.slice(0, -2).join(" ");
  return { nombre, apellidos };
}

// ─── Anti-duplicados ──────────────────────────────────────────────────────

/**
 * Similaridad de cadena (0–1) basada en caracteres compartidos.
 * Más rápido que Levenshtein completo para comparaciones de nombres.
 */
function nameSimilarity(a: string, b: string): number {
  const na = a.toLowerCase().replace(/\s+/g, "");
  const nb = b.toLowerCase().replace(/\s+/g, "");
  if (na === nb) return 1;
  const longer = na.length > nb.length ? na : nb;
  const shorter = na.length > nb.length ? nb : na;
  if (longer.length === 0) return 1;
  const dist = levenshtein(longer, shorter);
  return (longer.length - dist) / longer.length;
}

/**
 * Busca si ya existe un paciente con nombre muy similar en la lista.
 * @returns el paciente duplicado si la similitud ≥ 0.85, o null si no hay.
 */
export function detectDuplicate(
  candidateName: string,
  patientList: Array<{ name: string; [key: string]: any }>
): { name: string; [key: string]: any } | null {
  if (!candidateName || patientList.length === 0) return null;
  const normalized = normalizePatientName(candidateName);
  for (const p of patientList) {
    if (nameSimilarity(normalized, p.name) >= 0.85) return p;
  }
  return null;
}

/**
 * Verifica si una cadena parece ser un nombre propio válido
 * (al menos una palabra que no está en lista de palabras vacías y tiene ≥ 3 chars).
 */
export function looksLikeName(text: string): boolean {
  const tokens = text.toLowerCase().trim().split(/\s+/);
  const meaningful = tokens.filter(
    (t) => t.length >= 3 && !NON_NAME_WORDS.has(t)
  );
  return meaningful.length >= 1;
}
