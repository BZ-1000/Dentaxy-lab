/**
 * Tipos TypeScript del Odontograma DentaXy
 * Norma FDI (11-48) + Colores ADA internacionales
 * Motor determinista — cero APIs externas
 */

// ─────────────────────────────────────────────
// Estados clínicos
// ─────────────────────────────────────────────
export type ToothState =
  | 'S'    // Sano
  | 'C'    // Caries
  | 'O'    // Obturado / Restaurado
  | 'EI'   // Extracción indicada
  | 'A'    // Ausente / Extraído
  | 'CR'   // Corona
  | 'PU'   // Puente
  | 'E'    // Endodoncia / Tratamiento de conductos
  | 'IM'   // Implante
  | 'SE'   // Sellador
  | 'F'    // Fractura
  | 'MOV'; // Movilidad

// ─────────────────────────────────────────────
// Superficies del diente
// ─────────────────────────────────────────────
export interface ToothSurface {
  M?: ToothState; // Mesial (lado izquierdo del diente)
  D?: ToothState; // Distal (lado derecho del diente)
  V?: ToothState; // Vestibular (hacia labio/mejilla)
  L?: ToothState; // Lingual/Palatino (hacia lengua/paladar)
  O?: ToothState; // Oclusal (cara que muerde) — premolares y molares
  I?: ToothState; // Incisal (borde) — incisivos y caninos
}

// ─────────────────────────────────────────────
// Datos de cada diente
// ─────────────────────────────────────────────
export interface ToothData {
  /** Número FDI: 11-18, 21-28, 31-38, 41-48 (permanentes) / 51-85 (deciduos) */
  id: number;
  /** Estado general del diente */
  state: ToothState;
  /** Superficies afectadas (aplicable a Caries, Obturado, Sellador) */
  surfaces: ToothSurface;
  /** Grado de movilidad — solo si state === 'MOV' */
  mobility?: 1 | 2 | 3;
  /**
   * Grado de caries — solo si state === 'C'
   * I: Caries incipiente (esmalte) · II: Caries moderada (dentina superficial)
   * III: Caries profunda (dentina profunda) · IV: Compromiso pulpar
   */
  cariesGrade?: 1 | 2 | 3 | 4;
  /** Diente parte de un puente — solo si state === 'PU' */
  bridgeTo?: number;
  /** Notas clínicas adicionales */
  notes?: string;
}

// ─────────────────────────────────────────────
// Datos completos del odontograma
// ─────────────────────────────────────────────
export interface OdontogramData {
  teeth: ToothData[];
  updatedAt: string;
  /** Si es true, mostrar dentición decidua (20 dientes) en lugar de permanente */
  showDeciduous?: boolean;
}

// ─────────────────────────────────────────────
// Colores ADA por estado clínico
// ─────────────────────────────────────────────
export const TOOTH_COLORS: Record<ToothState, string> = {
  S:   '#FFFFFF', // Sano — blanco
  C:   '#EA4335', // Caries — rojo ADA
  O:   '#1A73E8', // Obturado — azul ADA
  EI:  '#7B4FA8', // Extracción indicada — morado ADA
  A:   '#EA4335', // Ausente — rojo (con X y contorno punteado)
  CR:  '#FF6D00', // Corona — naranja ADA
  PU:  '#FF6D00', // Puente — naranja ADA
  E:   '#EA4335', // Endodoncia — rojo (línea vertical)
  IM:  '#607D8B', // Implante — gris ADA
  SE:  '#F9AB00', // Sellador — amarillo ADA
  F:   '#EA4335', // Fractura — rojo (línea diagonal)
  MOV: '#FF6D00', // Movilidad — naranja (número de grado)
};

// ─────────────────────────────────────────────
// Etiquetas para el selector de estado
// ─────────────────────────────────────────────
export const TOOTH_STATE_LABELS: Record<ToothState, string> = {
  S:   'Sano',
  C:   'Caries',
  O:   'Obturado',
  EI:  'Extracción indicada',
  A:   'Ausente',
  CR:  'Corona',
  PU:  'Puente',
  E:   'Endodoncia',
  IM:  'Implante',
  SE:  'Sellador',
  F:   'Fractura',
  MOV: 'Movilidad',
};

// ─────────────────────────────────────────────
// Grupos dentales FDI (para determinar la forma SVG)
// ─────────────────────────────────────────────
export type ToothGroup = 'incisor_central' | 'incisor_lateral' | 'canine' | 'premolar' | 'molar_1' | 'molar_2' | 'molar_3';

/** Determina el grupo dental a partir del número FDI */
export const getToothGroup = (id: number): ToothGroup => {
  const pos = id % 10; // posición en el cuadrante (1-8)
  if (pos === 1) return 'incisor_central';
  if (pos === 2) return 'incisor_lateral';
  if (pos === 3) return 'canine';
  if (pos === 4 || pos === 5) return 'premolar';
  if (pos === 6) return 'molar_1';
  if (pos === 7) return 'molar_2';
  return 'molar_3';
};

/** Determina si el diente está en la arcada superior */
export const isUpperArch = (id: number): boolean => {
  const quadrant = Math.floor(id / 10);
  return quadrant === 1 || quadrant === 2;
};

/** Determina si el estado requiere selección de superficie */
export const stateRequiresSurface = (state: ToothState): boolean => {
  return state === 'C' || state === 'O' || state === 'SE';
};

/** Determina si el estado aplica a todo el diente (no por superficie) */
export const stateIsWholeTooth = (state: ToothState): boolean => {
  return ['A', 'CR', 'PU', 'E', 'IM', 'F', 'EI', 'MOV', 'S'].includes(state);
};

// ─────────────────────────────────────────────
// Estado inicial del odontograma
// ─────────────────────────────────────────────

/** Todos los dientes permanentes FDI */
export const PERMANENT_TEETH_IDS: number[] = [
  18, 17, 16, 15, 14, 13, 12, 11, // Cuadrante 1 (sup der paciente)
  21, 22, 23, 24, 25, 26, 27, 28, // Cuadrante 2 (sup izq paciente)
  31, 32, 33, 34, 35, 36, 37, 38, // Cuadrante 3 (inf izq paciente)
  41, 42, 43, 44, 45, 46, 47, 48, // Cuadrante 4 (inf der paciente)
];

/** Todos los dientes deciduos FDI */
export const DECIDUOUS_TEETH_IDS: number[] = [
  55, 54, 53, 52, 51, // Cuadrante 5 (sup der paciente)
  61, 62, 63, 64, 65, // Cuadrante 6 (sup izq paciente)
  71, 72, 73, 74, 75, // Cuadrante 7 (inf izq paciente)
  81, 82, 83, 84, 85, // Cuadrante 8 (inf der paciente)
];

/** Crea el estado inicial del odontograma con todos los dientes sanos */
export const createInitialOdontogramData = (): OdontogramData => ({
  teeth: PERMANENT_TEETH_IDS.map(id => ({
    id,
    state: 'S' as ToothState,
    surfaces: {},
  })),
  updatedAt: new Date().toISOString(),
  showDeciduous: false,
});
