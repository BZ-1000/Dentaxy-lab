/**
 * toothPaths.ts — Paths SVG anatómicos de los 32 dientes permanentes
 * ViewBox: 0 0 40 48 (estandarizado para todos los dientes)
 * Sistema de 5 zonas clickeables independientes por diente (M, D, V, L, O/I)
 *
 * Norma FDI: cuadrante 1 (11-18), 2 (21-28), 3 (31-38), 4 (41-48)
 */

import { ToothGroup } from '@/types/odontograma';

export interface ToothSurfaces {
  V: string;   // Vestibular — hacia labio/mejilla (franja superior del SVG)
  L: string;   // Lingual/Palatino — hacia lengua/paladar (franja inferior)
  M: string;   // Mesial — lado izquierdo del SVG
  D: string;   // Distal — lado derecho del SVG
  O?: string;  // Oclusal — centro, solo en premolares y molares
  I?: string;  // Incisal — centro, solo en incisivos y caninos
}

export interface ToothPathData {
  /** Path SVG de la silueta completa de la corona */
  crown: string;
  /** 5 zonas clickeables internas que no se superponen */
  surfaces: ToothSurfaces;
  /** Ancho en px para el layout del arco dental */
  width: number;
  /** Grupo anatómico del diente */
  group: ToothGroup;
  /** Nombre clínico del diente */
  name: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATES POR GRUPO ANATÓMICO
// Cada template define crown + 5 superficies dentro de viewBox 0 0 40 48
//
// Zonas de referencia (se adaptan por grupo):
//   V: y:4  → y:16  (franja top)
//   L: y:32 → y:44  (franja bottom)
//   M: x:4  → x:13, y:16 → y:32 (franja left, sección media)
//   D: x:27 → x:36, y:16 → y:32 (franja right, sección media)
//   O/I: x:13 → x:27, y:16 → y:32 (centro)
// ─────────────────────────────────────────────────────────────────────────────

// ── Incisivo Central Superior (11, 21) ─────────────────────────────────────
const IC_SUP: Omit<ToothPathData, 'name'> = {
  group: 'incisor_central',
  width: 28,
  // Corona trapezoidal: más ancha en incisal (abajo), ligeramente más estrecha en cervical (arriba)
  crown: 'M8,44 C6,44 5,43 5,42 L5,12 C5,8 8,4 12,4 L28,4 C32,4 35,8 35,12 L35,42 C35,43 34,44 32,44 Z',
  surfaces: {
    V: 'M12,4 L28,4 L25,16 L15,16 Z',
    L: 'M15,32 L25,32 L28,44 L12,44 Z',
    M: 'M5,12 L15,16 L15,32 L5,40 Z',
    D: 'M25,16 L35,12 L35,40 L25,32 Z',
    I: 'M15,16 L25,16 L25,32 L15,32 Z',
  },
};

// ── Incisivo Lateral Superior (12, 22) ─────────────────────────────────────
const IL_SUP: Omit<ToothPathData, 'name'> = {
  group: 'incisor_lateral',
  width: 22,
  crown: 'M9,44 C7,44 6,43 6,42 L6,12 C6,8 9,4 13,4 L27,4 C31,4 34,8 34,12 L34,42 C34,43 33,44 31,44 Z',
  surfaces: {
    V: 'M13,4 L27,4 L24,16 L16,16 Z',
    L: 'M16,32 L24,32 L27,44 L13,44 Z',
    M: 'M6,12 L16,16 L16,32 L6,40 Z',
    D: 'M24,16 L34,12 L34,40 L24,32 Z',
    I: 'M16,16 L24,16 L24,32 L16,32 Z',
  },
};

// ── Incisivo Central Inferior (41, 31) ─────────────────────────────────────
const IC_INF: Omit<ToothPathData, 'name'> = {
  group: 'incisor_central',
  width: 20,
  // Más estrecho y rectangular que el superior
  crown: 'M10,44 C8,44 7,43 7,42 L7,10 C7,6 10,4 14,4 L26,4 C30,4 33,6 33,10 L33,42 C33,43 32,44 30,44 Z',
  surfaces: {
    V: 'M14,4 L26,4 L23,16 L17,16 Z',
    L: 'M17,32 L23,32 L26,44 L14,44 Z',
    M: 'M7,12 L17,16 L17,32 L7,40 Z',
    D: 'M23,16 L33,12 L33,40 L23,32 Z',
    I: 'M17,16 L23,16 L23,32 L17,32 Z',
  },
};

// ── Incisivo Lateral Inferior (42, 32) ─────────────────────────────────────
const IL_INF: Omit<ToothPathData, 'name'> = {
  group: 'incisor_lateral',
  width: 19,
  crown: 'M11,44 C9,44 8,43 8,42 L8,10 C8,6 11,4 15,4 L25,4 C29,4 32,6 32,10 L32,42 C32,43 31,44 29,44 Z',
  surfaces: {
    V: 'M15,4 L25,4 L22,16 L18,16 Z',
    L: 'M18,32 L22,32 L25,44 L15,44 Z',
    M: 'M8,12 L18,16 L18,32 L8,40 Z',
    D: 'M22,16 L32,12 L32,40 L22,32 Z',
    I: 'M18,16 L22,16 L22,32 L18,32 Z',
  },
};

// ── Canino (13, 23, 33, 43) ───────────────────────────────────────────────
// Forma triangular-ovalada, más puntiaguda en la zona incisal
const CANINE: Omit<ToothPathData, 'name'> = {
  group: 'canine',
  width: 22,
  crown: 'M8,44 C6,44 5,43 5,42 L5,14 C5,8 10,4 20,4 C30,4 35,8 35,14 L35,42 C35,43 34,44 32,44 Z',
  surfaces: {
    V: 'M12,4 L28,4 C31,4 34,7 34,12 L27,16 L13,16 C8,11 8,7 12,4 Z',
    L: 'M13,32 L27,32 L30,44 L10,44 Z',
    M: 'M5,14 L14,16 L14,32 L5,42 Z',
    D: 'M26,16 L35,14 L35,42 L26,32 Z',
    I: 'M14,16 L26,16 L26,32 L14,32 Z',
  },
};

// ── Premolar (14, 15, 24, 25, 34, 35, 44, 45) ────────────────────────────
// Forma oval bicúspide con surco central
const PREMOLAR: Omit<ToothPathData, 'name'> = {
  group: 'premolar',
  width: 26,
  crown: 'M7,44 C5,44 4,43 4,42 L4,10 C4,6 8,4 12,4 L28,4 C32,4 36,6 36,10 L36,42 C36,43 35,44 33,44 Z',
  surfaces: {
    V: 'M12,4 L28,4 L25,16 L15,16 Z',
    L: 'M15,32 L25,32 L28,44 L12,44 Z',
    M: 'M4,10 L15,16 L15,32 L4,40 Z',
    D: 'M25,16 L36,10 L36,40 L25,32 Z',
    O: 'M15,16 L25,16 L25,32 L15,32 Z',
  },
};

// ── Primer Molar (16, 26, 36, 46) ─────────────────────────────────────────
// Cuadrangular grande, 4-5 cúspides, el más ancho
const MOLAR_1: Omit<ToothPathData, 'name'> = {
  group: 'molar_1',
  width: 36,
  // Con pequeñas irregularidades en el contorno para simular las cúspides
  crown: 'M6,44 C5,44 4,43 4,42 L4,8 C4,5 7,4 10,4 L14,3 L18,4 L22,3 L26,4 L30,3 C33,4 36,5 36,8 L36,42 C36,43 35,44 34,44 Z',
  surfaces: {
    V: 'M10,4 L30,4 L26,16 L14,16 Z',
    L: 'M14,32 L26,32 L30,44 L10,44 Z',
    M: 'M4,8 L14,16 L14,32 L4,40 Z',
    D: 'M26,16 L36,8 L36,40 L26,32 Z',
    O: 'M14,16 L26,16 L26,32 L14,32 Z',
  },
};

// ── Segundo Molar (17, 27, 37, 47) ────────────────────────────────────────
// Similar al primero, ~10% más pequeño
const MOLAR_2: Omit<ToothPathData, 'name'> = {
  group: 'molar_2',
  width: 32,
  crown: 'M6,44 C5,44 4,43 4,42 L4,9 C4,6 7,4 11,4 L15,3 L20,4 L25,3 L29,4 C33,4 36,6 36,9 L36,42 C36,43 35,44 34,44 Z',
  surfaces: {
    V: 'M11,4 L29,4 L26,16 L14,16 Z',
    L: 'M14,32 L26,32 L29,44 L11,44 Z',
    M: 'M4,9 L14,16 L14,32 L4,40 Z',
    D: 'M26,16 L36,9 L36,40 L26,32 Z',
    O: 'M14,16 L26,16 L26,32 L14,32 Z',
  },
};

// ── Tercer Molar (18, 28, 38, 48) ─────────────────────────────────────────
// Más pequeño y variable, forma trapezoidal simple
const MOLAR_3: Omit<ToothPathData, 'name'> = {
  group: 'molar_3',
  width: 28,
  crown: 'M7,44 C6,44 5,43 5,42 L5,10 C5,7 8,4 12,4 L28,4 C32,4 35,7 35,10 L35,42 C35,43 34,44 32,44 Z',
  surfaces: {
    V: 'M12,4 L28,4 L25,16 L15,16 Z',
    L: 'M15,32 L25,32 L28,44 L12,44 Z',
    M: 'M5,10 L15,16 L15,32 L5,42 Z',
    D: 'M25,16 L35,10 L35,42 L25,32 Z',
    O: 'M15,16 L25,16 L25,32 L15,32 Z',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// MAPA COMPLETO FDI → ToothPathData
// ─────────────────────────────────────────────────────────────────────────────

export const TOOTH_PATHS: Record<number, ToothPathData> = {
  // ─── Cuadrante 1 — Superior Derecho del Paciente ───────────────────────
  11: { ...IC_SUP, name: 'Incisivo Central Superior Derecho' },
  12: { ...IL_SUP, name: 'Incisivo Lateral Superior Derecho' },
  13: { ...CANINE, name: 'Canino Superior Derecho' },
  14: { ...PREMOLAR, name: '1er Premolar Superior Derecho' },
  15: { ...PREMOLAR, name: '2do Premolar Superior Derecho' },
  16: { ...MOLAR_1, name: '1er Molar Superior Derecho' },
  17: { ...MOLAR_2, name: '2do Molar Superior Derecho' },
  18: { ...MOLAR_3, name: '3er Molar Superior Derecho (Juicio)' },

  // ─── Cuadrante 2 — Superior Izquierdo del Paciente ────────────────────
  21: { ...IC_SUP, name: 'Incisivo Central Superior Izquierdo' },
  22: { ...IL_SUP, name: 'Incisivo Lateral Superior Izquierdo' },
  23: { ...CANINE, name: 'Canino Superior Izquierdo' },
  24: { ...PREMOLAR, name: '1er Premolar Superior Izquierdo' },
  25: { ...PREMOLAR, name: '2do Premolar Superior Izquierdo' },
  26: { ...MOLAR_1, name: '1er Molar Superior Izquierdo' },
  27: { ...MOLAR_2, name: '2do Molar Superior Izquierdo' },
  28: { ...MOLAR_3, name: '3er Molar Superior Izquierdo (Juicio)' },

  // ─── Cuadrante 3 — Inferior Izquierdo del Paciente ────────────────────
  31: { ...IC_INF, name: 'Incisivo Central Inferior Izquierdo' },
  32: { ...IL_INF, name: 'Incisivo Lateral Inferior Izquierdo' },
  33: { ...CANINE, name: 'Canino Inferior Izquierdo' },
  34: { ...PREMOLAR, name: '1er Premolar Inferior Izquierdo' },
  35: { ...PREMOLAR, name: '2do Premolar Inferior Izquierdo' },
  36: { ...MOLAR_1, name: '1er Molar Inferior Izquierdo' },
  37: { ...MOLAR_2, name: '2do Molar Inferior Izquierdo' },
  38: { ...MOLAR_3, name: '3er Molar Inferior Izquierdo (Juicio)' },

  // ─── Cuadrante 4 — Inferior Derecho del Paciente ──────────────────────
  41: { ...IC_INF, name: 'Incisivo Central Inferior Derecho' },
  42: { ...IL_INF, name: 'Incisivo Lateral Inferior Derecho' },
  43: { ...CANINE, name: 'Canino Inferior Derecho' },
  44: { ...PREMOLAR, name: '1er Premolar Inferior Derecho' },
  45: { ...PREMOLAR, name: '2do Premolar Inferior Derecho' },
  46: { ...MOLAR_1, name: '1er Molar Inferior Derecho' },
  47: { ...MOLAR_2, name: '2do Molar Inferior Derecho' },
  48: { ...MOLAR_3, name: '3er Molar Inferior Derecho (Juicio)' },

  // ─── Dentición Decidua (Nomenclatura FDI) ─────────────────────────────
  // Cuadrante 5 — Superior derecho deciduo
  51: { ...IC_SUP,  name: 'Incisivo Central Superior Derecho Deciduo' },
  52: { ...IL_SUP,  name: 'Incisivo Lateral Superior Derecho Deciduo' },
  53: { ...CANINE,  name: 'Canino Superior Derecho Deciduo' },
  54: { ...PREMOLAR,name: '1er Molar Superior Derecho Deciduo' },
  55: { ...MOLAR_2, name: '2do Molar Superior Derecho Deciduo' },

  // Cuadrante 6 — Superior izquierdo deciduo
  61: { ...IC_SUP,  name: 'Incisivo Central Superior Izquierdo Deciduo' },
  62: { ...IL_SUP,  name: 'Incisivo Lateral Superior Izquierdo Deciduo' },
  63: { ...CANINE,  name: 'Canino Superior Izquierdo Deciduo' },
  64: { ...PREMOLAR,name: '1er Molar Superior Izquierdo Deciduo' },
  65: { ...MOLAR_2, name: '2do Molar Superior Izquierdo Deciduo' },

  // Cuadrante 7 — Inferior izquierdo deciduo
  71: { ...IC_INF,  name: 'Incisivo Central Inferior Izquierdo Deciduo' },
  72: { ...IL_INF,  name: 'Incisivo Lateral Inferior Izquierdo Deciduo' },
  73: { ...CANINE,  name: 'Canino Inferior Izquierdo Deciduo' },
  74: { ...PREMOLAR,name: '1er Molar Inferior Izquierdo Deciduo' },
  75: { ...MOLAR_2, name: '2do Molar Inferior Izquierdo Deciduo' },

  // Cuadrante 8 — Inferior derecho deciduo
  81: { ...IC_INF,  name: 'Incisivo Central Inferior Derecho Deciduo' },
  82: { ...IL_INF,  name: 'Incisivo Lateral Inferior Derecho Deciduo' },
  83: { ...CANINE,  name: 'Canino Inferior Derecho Deciduo' },
  84: { ...PREMOLAR,name: '1er Molar Inferior Derecho Deciduo' },
  85: { ...MOLAR_2, name: '2do Molar Inferior Derecho Deciduo' },
};

/**
 * Retorna los datos SVG de un diente por su número FDI.
 * Si no existe, retorna los datos del premolar como fallback.
 */
export const getToothPath = (id: number): ToothPathData => {
  return TOOTH_PATHS[id] ?? { ...PREMOLAR, name: `OD ${id}` };
};

/**
 * Retorna el nombre clínico completo de un diente FDI.
 * Incluye permanentes (11-48) y deciduos (51-85).
 */
export const getToothName = (id: number): string => {
  return TOOTH_PATHS[id]?.name ?? `Órgano dental ${id}`;
};

/** Verifica si un ID corresponde a un diente deciduo */
export const isDeciduous = (id: number): boolean => id >= 51 && id <= 85;

