/**
 * toothShapes.ts — Siluetas anatómicas del odontograma DentaXy
 * Vista oclusal normalizada (100×100 viewBox).
 * Buccal = arriba para todos los dientes (convención V='top').
 *
 * d    → path SVG de la silueta externa
 * yB   → y inferior de la zona bucal
 * yL   → y superior de la zona lingual
 * xM   → x derecho de la franja mesial
 * xD   → x izquierdo de la franja distal
 */

export interface ToothDef {
  d: string;
  yB: number;
  yL: number;
  xM: number;
  xD: number;
}

export const TOOTH_SHAPES: Record<string, ToothDef> = {

  /* ── PERMANENTES SUPERIORES (buccal = top) ─────────────────────────── */

  // 1 · Incisivo Central Superior — trapecio ancho
  u1: { d: 'M 13,8 L 87,8 L 81,92 L 19,92 Z',           yB:28, yL:72, xM:27, xD:73 },
  // 2 · Incisivo Lateral Superior — trapecio medio
  u2: { d: 'M 19,10 L 81,10 L 76,90 L 24,90 Z',          yB:28, yL:72, xM:30, xD:70 },
  // 3 · Canino Superior — rombo con vértices bucal/lingual
  u3: { d: 'M 22,8 L 78,8 L 84,50 L 76,92 L 24,92 L 16,50 Z',  yB:28, yL:72, xM:30, xD:70 },
  // 4 · Primer Premolar Superior — óvalo
  u4: { d: 'M 22,8 L 78,8 L 82,50 L 78,92 L 22,92 L 18,50 Z',  yB:28, yL:72, xM:30, xD:70 },
  // 5 · Segundo Premolar Superior — óvalo más redondo
  u5: { d: 'M 24,8 L 76,8 L 80,50 L 75,92 L 25,92 L 20,50 Z',  yB:28, yL:72, xM:32, xD:68 },
  // 6 · Primer Molar Superior — romboide grande (cresta oblicua)
  u6: { d: 'M 10,10 L 88,10 L 92,88 L 16,88 Z',          yB:28, yL:72, xM:22, xD:80 },
  // 7 · Segundo Molar Superior — romboide mediano
  u7: { d: 'M 13,10 L 86,10 L 89,90 L 17,90 Z',          yB:28, yL:72, xM:24, xD:76 },
  // 8 · Tercer Molar Superior — compacto irregular
  u8: { d: 'M 18,12 L 80,12 L 83,86 L 20,88 Z',          yB:30, yL:70, xM:28, xD:72 },

  /* ── PERMANENTES INFERIORES (buccal = top, convención V='top') ──────── */

  // 1 · Incisivo Central Inferior — rectángulo estrecho
  l1: { d: 'M 30,8 L 70,8 L 68,92 L 32,92 Z',            yB:28, yL:72, xM:37, xD:63 },
  // 2 · Incisivo Lateral Inferior — ligeramente más ancho
  l2: { d: 'M 27,8 L 73,8 L 71,92 L 29,92 Z',            yB:28, yL:72, xM:34, xD:66 },
  // 3 · Canino Inferior — rombo estrecho
  l3: { d: 'M 25,8 L 75,8 L 79,50 L 73,92 L 27,92 L 21,50 Z',  yB:28, yL:72, xM:30, xD:70 },
  // 4 · Primer Premolar Inferior — óvalo alargado
  l4: { d: 'M 23,8 L 77,8 L 80,50 L 76,92 L 24,92 L 20,50 Z',  yB:28, yL:72, xM:30, xD:70 },
  // 5 · Segundo Premolar Inferior — óvalo redondeado
  l5: { d: 'M 22,8 L 78,8 L 80,50 L 76,92 L 24,92 L 20,50 Z',  yB:28, yL:72, xM:30, xD:70 },
  // 6 · Primer Molar Inferior — rectángulo amplio (5 cúspides)
  l6: { d: 'M 8,10 L 92,10 L 90,90 L 10,90 Z',            yB:28, yL:72, xM:20, xD:80 },
  // 7 · Segundo Molar Inferior — rectángulo mediano
  l7: { d: 'M 10,10 L 90,10 L 88,90 L 12,90 Z',           yB:28, yL:72, xM:22, xD:78 },
  // 8 · Tercer Molar Inferior — compacto
  l8: { d: 'M 18,12 L 82,12 L 80,88 L 20,88 Z',           yB:30, yL:70, xM:28, xD:72 },

  /* ── DECIDUOS SUPERIORES ────────────────────────────────────────────── */

  du1: { d: 'M 20,10 L 80,10 L 75,90 L 25,90 Z',          yB:28, yL:72, xM:30, xD:70 },
  du2: { d: 'M 24,12 L 76,12 L 72,88 L 28,88 Z',          yB:30, yL:70, xM:32, xD:68 },
  du3: { d: 'M 24,10 L 76,10 L 80,50 L 74,90 L 26,90 L 20,50 Z', yB:28, yL:72, xM:32, xD:68 },
  du4: { d: 'M 16,10 L 84,10 L 88,88 L 18,88 Z',          yB:28, yL:72, xM:24, xD:76 },
  du5: { d: 'M 12,10 L 88,10 L 86,88 L 14,88 Z',          yB:28, yL:72, xM:22, xD:78 },

  /* ── DECIDUOS INFERIORES ────────────────────────────────────────────── */

  dl1: { d: 'M 32,12 L 68,12 L 66,88 L 34,88 Z',          yB:30, yL:70, xM:38, xD:62 },
  dl2: { d: 'M 30,12 L 70,12 L 68,88 L 32,88 Z',          yB:30, yL:70, xM:36, xD:64 },
  dl3: { d: 'M 28,10 L 72,10 L 76,50 L 70,90 L 30,90 L 24,50 Z', yB:28, yL:72, xM:32, xD:68 },
  dl4: { d: 'M 18,10 L 82,10 L 80,90 L 20,90 Z',          yB:28, yL:72, xM:26, xD:74 },
  dl5: { d: 'M 14,10 L 86,10 L 84,90 L 16,90 Z',          yB:28, yL:72, xM:22, xD:78 },
};

/** Retorna la clave de forma a partir del número FDI */
export function getShapeKey(id: number): string {
  const pos = id % 10;
  const q   = Math.floor(id / 10);
  // Deciduos: cuadrantes 5-8
  if (q >= 5) return (q === 5 || q === 6) ? `du${pos}` : `dl${pos}`;
  // Permanentes
  return (q === 1 || q === 2) ? `u${pos}` : `l${pos}`;
}

/** Fallback si el ID no se encuentra */
export const FALLBACK_SHAPE: ToothDef = {
  d: 'M 20,10 L 80,10 L 80,90 L 20,90 Z',
  yB: 28, yL: 72, xM: 30, xD: 70,
};
