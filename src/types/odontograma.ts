/**
 * Tipos TypeScript del Odontograma DentaXy — v2
 * Norma Técnica FDI + Norma OPS/Perú — 32 estados clínicos
 * Motor determinista — cero APIs externas
 */

// ─────────────────────────────────────────────────────────────────────────────
// Estados clínicos — 12 originales + 17 nuevos según Norma Técnica
// ─────────────────────────────────────────────────────────────────────────────
export type ToothState =
  // Originales
  | 'S'    // Sano
  | 'C'    // Caries
  | 'O'    // Obturado / Restaurado
  | 'EI'   // Extracción indicada
  | 'A'    // Ausente / Extraído
  | 'CR'   // Corona definitiva
  | 'PU'   // Puente fijo
  | 'E'    // Tratamiento de conductos (TC)
  | 'IM'   // Implante
  | 'SE'   // Sellador de fosetas y fisuras
  | 'F'    // Fractura
  | 'MOV'  // Movilidad patológica
  // Nuevos — Norma Técnica OPS
  | 'AOF'  // Aparato Ortodóntico Fijo
  | 'AOR'  // Aparato Ortodóntico Removible
  | 'DES'  // Desgaste Oclusal/Incisal
  | 'DIA'  // Diastema
  | 'DIS'  // Diente Discrómica
  | 'ECT'  // Diente Ectópico
  | 'CLV'  // Diente en Clavija
  | 'EXT'  // Extrusión
  | 'INT'  // Intrusión
  | 'GF'   // Geminación/Fusión
  | 'GV'   // Giroversión
  | 'MIG'  // Migración
  | 'RR'   // Remanente Radicular
  | 'RT'   // Restauración Temporal
  | 'SI'   // Semi-impactación
  | 'SN'   // Supernumerario
  | 'TR'   // Transposición
  | 'PC'   // Pulpectomía
  | 'PP';  // Pulpotomía

// ─────────────────────────────────────────────────────────────────────────────
// Subtipos — Materiales de Restauración (Norma 1.28)
// ─────────────────────────────────────────────────────────────────────────────
export type RestorationType =
  | 'AM'   // Amalgama
  | 'R'    // Resina compuesta
  | 'IV'   // Ionómero de Vidrio
  | 'IM'   // Incrustación Metálica
  | 'IE';  // Incrustación Estética

// ─────────────────────────────────────────────────────────────────────────────
// Subtipos — Tipos de Corona (Norma 1.4)
// ─────────────────────────────────────────────────────────────────────────────
export type CrownType =
  | 'CC'   // Corona Completa (solo metálica)
  | 'CF'   // Corona Fenestrada
  | 'CMC'  // Corona Metal Cerámica
  | 'CJ'   // Corona Jacket (estética libre de metal)
  | 'CV'   // Corona Veneer
  | 'CP';  // Corona Parcial (3/4, 4/5, 7/8)

// ─────────────────────────────────────────────────────────────────────────────
// Superficies del diente
// ─────────────────────────────────────────────────────────────────────────────
export interface ToothSurface {
  M?: boolean; // Mesial
  D?: boolean; // Distal
  V?: boolean; // Vestibular
  L?: boolean; // Lingual/Palatino
  O?: boolean; // Oclusal (premolares y molares)
  I?: boolean; // Incisal (incisivos y caninos)
}

// ─────────────────────────────────────────────────────────────────────────────
// Datos de cada diente — expandido v2
// ─────────────────────────────────────────────────────────────────────────────
export interface ToothData {
  /** Número FDI (permanentes 11-48, deciduos 51-85) */
  id: number;
  /** Estado clínico principal */
  state: ToothState;
  /** Superficies afectadas (C, O, SE, RT) */
  surfaces: ToothSurface;
  /** Grado de movilidad — solo MOV */
  mobility?: 1 | 2 | 3;
  /** Grado de caries I-IV — solo C */
  cariesGrade?: 1 | 2 | 3 | 4;
  /** Diente pilar de puente — solo PU */
  bridgeTo?: number;
  /** Tipo de material restaurador — solo O, RT */
  materialType?: RestorationType;
  /** Tipo de corona — solo CR */
  crownType?: CrownType;
  /** Tratamiento pulpar — solo E, PC, PP */
  pulpTherapy?: 'TC' | 'PC' | 'PP';
  /** Buen/mal estado — AOF, AOR, prótesis */
  isGoodCondition?: boolean;
  /** Notas clínicas libres */
  notes?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Datos completos del odontograma
// ─────────────────────────────────────────────────────────────────────────────
export interface OdontogramData {
  teeth: ToothData[];
  updatedAt: string;
  showDeciduous?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Colores ADA / Norma Técnica por estado
// Rojo = patología activa / temporal / mal estado
// Azul = tratamiento definitivo / buen estado
// ─────────────────────────────────────────────────────────────────────────────
export const TOOTH_COLORS: Record<ToothState, string> = {
  // Originales
  S:   '#FFFFFF',
  C:   '#EA4335', // Rojo — patología activa
  O:   '#1A73E8', // Azul — restauración definitiva
  EI:  '#7B4FA8', // Morado — extracción indicada
  A:   '#EA4335', // Rojo — ausente
  CR:  '#FF6D00', // Naranja — corona
  PU:  '#FF6D00', // Naranja — puente
  E:   '#1A73E8', // Azul — endodoncia (tratamiento definitivo)
  IM:  '#607D8B', // Gris — implante
  SE:  '#F9AB00', // Amarillo — sellador
  F:   '#EA4335', // Rojo — fractura
  MOV: '#FF6D00', // Naranja — movilidad
  // Nuevos
  AOF: '#1A73E8', // Azul (buen estado) / rojo (mal estado) — se evalúa en runtime
  AOR: '#1A73E8',
  DES: '#795548', // Café — desgaste
  DIA: '#1A73E8', // Azul — diastema
  DIS: '#9C27B0', // Morado — discromía
  ECT: '#1A73E8', // Azul — ectópico
  CLV: '#1A73E8', // Azul — en clavija
  EXT: '#1A73E8', // Azul — extrusión
  INT: '#1A73E8', // Azul — intrusión
  GF:  '#1A73E8', // Azul — geminación/fusión
  GV:  '#1A73E8', // Azul — giroversión
  MIG: '#1A73E8', // Azul — migración
  RR:  '#EA4335', // Rojo — remanente radicular
  RT:  '#EA4335', // Rojo — restauración temporal
  SI:  '#1A73E8', // Azul — semi-impactación
  SN:  '#1A73E8', // Azul — supernumerario
  TR:  '#1A73E8', // Azul — transposición
  PC:  '#1A73E8', // Azul — pulpectomía
  PP:  '#1A73E8', // Azul — pulpotomía
};

// ─────────────────────────────────────────────────────────────────────────────
// Etiquetas para el selector de estado
// ─────────────────────────────────────────────────────────────────────────────
export const TOOTH_STATE_LABELS: Record<ToothState, string> = {
  S:   'Sano',
  C:   'Caries',
  O:   'Obturado',
  EI:  'Extrac. Indicada',
  A:   'Ausente',
  CR:  'Corona',
  PU:  'Puente',
  E:   'Endodoncia',
  IM:  'Implante',
  SE:  'Sellador',
  F:   'Fractura',
  MOV: 'Movilidad',
  AOF: 'Ap. Ortodóntico Fijo',
  AOR: 'Ap. Ortodóntico Rem.',
  DES: 'Desgaste',
  DIA: 'Diastema',
  DIS: 'Discromía',
  ECT: 'Diente Ectópico',
  CLV: 'Diente en Clavija',
  EXT: 'Extrusión',
  INT: 'Intrusión',
  GF:  'Geminación/Fusión',
  GV:  'Giroversión',
  MIG: 'Migración',
  RR:  'Remanente Radicular',
  RT:  'Rest. Temporal',
  SI:  'Semi-impactación',
  SN:  'Supernumerario',
  TR:  'Transposición',
  PC:  'Pulpectomía',
  PP:  'Pulpotomía',
};

// ─────────────────────────────────────────────────────────────────────────────
// Etiquetas cortas para el UI del panel
// ─────────────────────────────────────────────────────────────────────────────
export const TOOTH_STATE_SHORT: Record<ToothState, string> = {
  S: 'S', C: 'C', O: 'O', EI: 'EI', A: 'A', CR: 'CR', PU: 'PU',
  E: 'TC', IM: 'IMP', SE: 'SE', F: 'F', MOV: 'MOV',
  AOF: 'AOF', AOR: 'AOR', DES: 'DES', DIA: 'DIA', DIS: 'DIS',
  ECT: 'E', CLV: 'CLV', EXT: 'EXT', INT: 'INT', GF: 'GF',
  GV: 'GV', MIG: 'MIG', RR: 'RR', RT: 'RT', SI: 'SI',
  SN: 'SN', TR: 'TR', PC: 'PC', PP: 'PP',
};

// ─────────────────────────────────────────────────────────────────────────────
// Grupos dentales FDI
// ─────────────────────────────────────────────────────────────────────────────
export type ToothGroup = 'incisor_central' | 'incisor_lateral' | 'canine' | 'premolar' | 'molar_1' | 'molar_2' | 'molar_3';

export const getToothGroup = (id: number): ToothGroup => {
  const pos = id % 10;
  if (pos === 1) return 'incisor_central';
  if (pos === 2) return 'incisor_lateral';
  if (pos === 3) return 'canine';
  if (pos === 4 || pos === 5) return 'premolar';
  if (pos === 6) return 'molar_1';
  if (pos === 7) return 'molar_2';
  return 'molar_3';
};

export const isUpperArch = (id: number): boolean => {
  const q = Math.floor(id / 10);
  return q === 1 || q === 2;
};

/** Estados que requieren selección de superficies */
export const stateRequiresSurface = (state: ToothState): boolean =>
  state === 'C' || state === 'O' || state === 'SE' || state === 'RT';

/** Estados que aplican a todo el diente */
export const stateIsWholeTooth = (state: ToothState): boolean =>
  !stateRequiresSurface(state);

// ─────────────────────────────────────────────────────────────────────────────
// Clasificación por categoría (para tabs del panel)
// ─────────────────────────────────────────────────────────────────────────────
export const STATE_GROUPS = {
  basicos:      ['S', 'C', 'O', 'RT', 'A', 'EI', 'F', 'MOV'] as ToothState[],
  tratamientos: ['E', 'PC', 'PP', 'CR', 'PU', 'IM', 'SE'] as ToothState[],
  ortodoncia:   ['AOF', 'AOR', 'DIA', 'GV', 'TR', 'GF', 'EXT', 'INT', 'MIG'] as ToothState[],
  anomalias:    ['DES', 'DIS', 'ECT', 'CLV', 'RR', 'SI', 'SN'] as ToothState[],
};

// ─────────────────────────────────────────────────────────────────────────────
// Números FDI permanentes y deciduos
// ─────────────────────────────────────────────────────────────────────────────
export const PERMANENT_TEETH_IDS: number[] = [
  18, 17, 16, 15, 14, 13, 12, 11,
  21, 22, 23, 24, 25, 26, 27, 28,
  31, 32, 33, 34, 35, 36, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48,
];

export const DECIDUOUS_TEETH_IDS: number[] = [
  55, 54, 53, 52, 51,
  61, 62, 63, 64, 65,
  71, 72, 73, 74, 75,
  81, 82, 83, 84, 85,
];

export const createInitialOdontogramData = (): OdontogramData => ({
  teeth: PERMANENT_TEETH_IDS.map(id => ({
    id,
    state: 'S' as ToothState,
    surfaces: {},
  })),
  updatedAt: new Date().toISOString(),
  showDeciduous: false,
});
