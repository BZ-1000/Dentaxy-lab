/**
 * Generador de código de barras Code 128 en TypeScript puro.
 * No requiere dependencias externas. Genera SVG directamente.
 * Implementa el subset B de Code 128 (ASCII 32–127).
 */

// Patrones de barras Code 128 — cada entrada es una cadena de 11 bits (1=barra, 0=espacio)
// Fuente: especificación oficial Code 128
const CODE128_PATTERNS: string[] = [
  '11011001100', // 0  (SPACE)
  '11001101100', // 1  !
  '11001100110', // 2  "
  '10010011000', // 3  #
  '10010001100', // 4  $
  '10001001100', // 5  %
  '10011001000', // 6  &
  '10011000100', // 7  '
  '10001100100', // 8  (
  '11001001000', // 9  )
  '11001000100', // 10 *
  '11000100100', // 11 +
  '10110011100', // 12 ,
  '10011011100', // 13 -
  '10011001110', // 14 .
  '10111001100', // 15 /
  '10011101100', // 16 0
  '10011100110', // 17 1
  '11001110010', // 18 2
  '11001011100', // 19 3
  '11001001110', // 20 4
  '11011100100', // 21 5
  '11001110100', // 22 6
  '11101101110', // 23 7
  '11101001100', // 24 8
  '11100101100', // 25 9
  '11100100110', // 26 :
  '11101100100', // 27 ;
  '11100110100', // 28 <
  '11100110010', // 29 =
  '11011011000', // 30 >
  '11011000110', // 31 ?
  '11000110110', // 32 @
  '10100011000', // 33 A
  '10001011000', // 34 B
  '10001000110', // 35 C
  '10110001000', // 36 D
  '10001101000', // 37 E
  '10001100010', // 38 F
  '11010001000', // 39 G
  '11000101000', // 40 H
  '11000100010', // 41 I
  '10110111000', // 42 J
  '10110001110', // 43 K
  '10001101110', // 44 L
  '10111011000', // 45 M
  '10111000110', // 46 N
  '10001110110', // 47 O
  '11101110110', // 48 P
  '11010001110', // 49 Q
  '11000101110', // 50 R
  '11011101000', // 51 S
  '11011100010', // 52 T
  '11011101110', // 53 U
  '11101011000', // 54 V
  '11101000110', // 53 W
  '11100010110', // 56 X
  '11101101000', // 57 Y
  '11101100010', // 58 Z
  '11100011010', // 59 [
  '11101111010', // 60 \
  '11001000010', // 61 ]
  '11110001010', // 62 ^
  '10100110000', // 63 _
  '10100001100', // 64 `
  '10010110000', // 65 a
  '10010000110', // 66 b
  '10000101100', // 67 c
  '10000100110', // 68 d
  '10110010000', // 69 e
  '10110000100', // 70 f
  '10011010000', // 71 g
  '10011000010', // 72 h
  '10000110100', // 73 i
  '10000110010', // 74 j
  '11000010010', // 75 k
  '11001010000', // 76 l
  '11110111010', // 77 m
  '11000010100', // 78 n
  '10001111010', // 79 o
  '10100111100', // 80 p
  '10010111100', // 81 q
  '10010011110', // 82 r
  '10111100100', // 83 s
  '10011110100', // 84 t
  '10011110010', // 85 u
  '11110100100', // 86 v
  '11110010100', // 87 w
  '11110010010', // 88 x
  '11011011110', // 89 y
  '11011110110', // 90 z
  '11110110110', // 91 {
  '10101111000', // 92 |
  '10100011110', // 93 }
  '10001011110', // 94 ~
  '10111101000', // 95 DEL
  '10111100010', // 96 FNC3
  '11110101000', // 97 FNC2
  '11110100010', // 98 SHIFT
  '10111011110', // 99 Code C
  '10111101110', // 100 Code B (FNC4)
  '11101011110', // 101 Code A
  '11110101110', // 102 FNC1
  '11010000100', // 103 START A
  '11010010000', // 104 START B  ← índice 104
  '11010011100', // 105 START C
  '1100011101011', // STOP (especial, 13 bits)
];

const START_B = 104;
const STOP_PATTERN = '1100011101011';

/**
 * Genera un ID único de paciente con formato: DX-YYYYMMDD-XXXXXX
 */
export function generatePatientCode(): string {
  const now = new Date();
  const fecha = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const aleatorio = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `DX-${fecha}-${aleatorio}`;
}

/**
 * Codifica un string en Code 128 Subset B y devuelve un SVG string.
 * @param text Texto a codificar (ASCII 32–127)
 * @param barWidth Ancho de cada unidad (px)
 * @param height Alto del barcode (px)
 */
export function code128ToSVG(
  text: string,
  barWidth = 1.2,
  height = 28
): string {
  // Construir secuencia de valores Code 128
  const values: number[] = [START_B]; // Subset B

  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) - 32; // offset a tabla Code128 subset B
    if (charCode < 0 || charCode > 95) continue; // ignorar chars fuera de rango
    values.push(charCode);
  }

  // Calcular checksum
  let checksum = START_B;
  for (let i = 0; i < values.length - 1; i++) {
    checksum += values[i + 1] * (i + 1);
  }
  checksum = checksum % 103;
  values.push(checksum);

  // Construir secuencia de bits
  let bits = '';
  for (const val of values) {
    if (val === START_B) {
      bits += CODE128_PATTERNS[104];
    } else if (val < 103) {
      bits += CODE128_PATTERNS[val];
    }
  }
  bits += STOP_PATTERN;

  // Calcular ancho total
  const totalWidth = bits.length * barWidth + 20; // padding lateral 10px c/lado

  // Generar rectángulos SVG
  let bars = '';
  let x = 10; // padding izquierdo
  for (let i = 0; i < bits.length; i++) {
    if (bits[i] === '1') {
      bars += `<rect x="${x.toFixed(2)}" y="0" width="${barWidth}" height="${height}" />`;
    }
    x += barWidth;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" viewBox="0 0 ${totalWidth} ${height}" role="img" aria-label="Código de barras paciente">${bars}</svg>`;
}
