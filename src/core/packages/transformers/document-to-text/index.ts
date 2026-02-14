import { IDocumentToTextTransformer, IRawDocument, INormalizedText } from '../../contracts';
import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Configurar worker de PDF.js (Local para evitar problemas de CDN)
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

// Strategy 3A: Structural Regex Corrections (For Headers & Merged Words)
// These fix heavy OCR errors where spaces are lost or words are mangled beyond simple edit distance.
const STRUCTURAL_CORRECTIONS: [RegExp, string][] = [
  // Contextual Fixes (Phrases)
  // "Duros de Identificación" -> Force "Datos" (Strong override)
  [/duros de id|duros de lden|dales de merit|datos de lden|datos de id/gi, 'Datos de Identificación'],

  // Fix: "Fuma del" -> "Firma del"
  [/fuma del|fanma del|farma del|ma del/gi, 'Firma del'],

  // Fix: "Rgene Oral" -> "Higiene Oral"
  [/rgene oral/gi, 'Higiene Oral'],

  // Fix: "Va al ena" -> "Visita al Dentista" (Common misread of 'Visita al Dentista')
  [/va al ena|va al den|visita al den/gi, 'Visita al Dentista'],

  // Header Fixes - Specific word targets
  [/fecnade|fechade|techa de|fecna de|trecha de/gi, 'Fecha de'],
  [/ndement|nacimient|naclmiento|nuemienfe|nacimienfo|nacimien/gi, 'Nacimiento'],
  [/padente|paclente|pacienfe|patienfe|pacien.?e|esas/gi, 'Paciente'],
  [/teltono|teletono|telétono|teierono|tel[eé]f[o0]no/gi, 'Teléfono'],
  [/cerrec|correc|c[o0]rreo/gi, 'Correo'],
  [/entermedad|enfermedad|enfermeda/gi, 'Enfermedad'],
  [/sist[eé]m[eé]a|sistemca|sistmica/gi, 'Sistémica'],
  [/odonto[l1]ogica|ocenito cqoes/gi, 'Odontológica'],
  [/cl[i1]n[i1]ca/gi, 'Clínica'],
  [/alerg[ia]s|alerglag|ler conocidas/gi, 'Alergias Conocidas'],
  [/quir[uú]rg[yi]cos|qulrurgicos|qurirgos/gi, 'Quirúrgicos'],
  [/tratami[eé]nt[os]|tratamientes|tratamien|vatameno/gi, 'Tratamientos'],
  [/d[i1]agn[o0]stic[oa]|digrioshite/gi, 'Diagnóstico'],
  [/obs[eé]rvac[i1]ones|observacion|aconals/gi, 'Observaciones Adicionales'],
  [/h[i1]g[i1]ene|hjiene/gi, 'Higiene'],
  [/f[i1]rma/gi, 'Firma'],
  [/m[o0]tivo/gi, 'Motivo'],
  [/cons[uú]lta|consu/gi, 'Consulta'],
  [/historia|hisforia/gi, 'Historia'],
  [/med[i1]cos|velues/gi, 'Médicos'],
  [/tejos|tejdes/gi, 'Tejidos'],
  [/blandos/gi, 'Blandos'],
  [/duros/gi, 'Duros'],
  [/presuntvo/gi, 'Presuntivo'],
  [/conotidas|conocidas/gi, 'Conocidas'],
  [/guna/gi, 'Alguna'],
  [/antacedentes|anfecedenfes/gi, 'Antecedentes'],

  // Cleanup: Stuttering (ficaciónficación)
  [/ficaci[oó]nficaci[oó]n/gi, 'ficación'],
];

// Strategy 6: General Vocabulary (Fuzzy Dicationary)
const DENTAL_VOCABULARY = [
  'Historia', 'Clínica', 'Odontológica', 'Identificación', 'Paciente',
  'Nombre', 'Edad', 'Sexo', 'Fecha', 'Nacimiento', 'Teléfono', 'Correo',
  'Dirección', 'Antecedentes', 'Médicos', 'Padece', 'Enfermedad',
  'Sistémica', 'Medicamento', 'Actualmente', 'Alergias', 'Conocidas',
  'Quirúrgicos', 'Relevantes', 'Odontológicos', 'Motivo', 'Consulta',
  'Última', 'Visita', 'Dentista', 'Tratamientos', 'Previos', 'Examen',
  'Tejidos', 'Blandos', 'Duros', 'Higiene', 'Oral', 'Observaciones',
  'Adicionales', 'Diagnóstico', 'Plan', 'Tratamiento', 'Presuntivo',
  'Firma', 'Odontólogo', 'Masculino', 'Femenino', 'Soltero', 'Casado',
  'Diabetes', 'Hipertensión', 'Alergia', 'Penicilina', 'Anestesia',
  'Ortodoncia', 'Endodoncia', 'Exodoncia', 'Limpieza', 'Caries',
  'Gingivitis', 'Periodontitis', 'Prótesis', 'Corona', 'Puente',
  'Implante', 'Resina', 'Amalgama', 'Dolor', 'Inflamación', 'Sangrado'
];

// Helper: Zero-Dependency Levenshtein Implementation (Robust & Fast)
const levenshteinDistance = (a: string, b: string): number => {
  const matrix = [];
  let i, j;
  for (i = 0; i <= b.length; i++) { matrix[i] = [i]; }
  for (j = 0; j <= a.length; j++) { matrix[0][j] = j; }
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1) // insertion/deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
};

// Helper: Remove duplicate adjacent words
const removeDuplicates = (text: string): string => {
  return text.replace(/\b(\w+)\s+\1\b/gi, '$1') // Simple words: "Hola Hola" -> "Hola"
    .replace(/(Datos de Identificación)\s+\1/gi, '$1') // Phrases
    .replace(/(Fecha de Nacimiento)\s+\1/gi, '$1')
    .replace(/(Observaciones Adicionales)\s+\1/gi, '$1')
    .replace(/(Antecedentes)\s+\1/gi, '$1')
    .replace(/(Paciente)\s+\1/gi, '$1');
};

// Hybrid Correction Function
const applyHybridCorrection = (text: string): string => {
  // 1. Structural Regex Pass
  let corrected = text;
  STRUCTURAL_CORRECTIONS.forEach(([pattern, replacement]) => {
    corrected = corrected.replace(pattern, replacement);
  });

  // 2. De-duplication Pass
  corrected = removeDuplicates(corrected);

  // 3. Fuzzy Word Pass
  return corrected.split(/(\s+|[.,:;()])/).map(word => {
    const cleanWord = word.trim();
    if (cleanWord.length < 3) return word;
    if (/^\d+$/.test(cleanWord)) return word;

    const exactMatch = DENTAL_VOCABULARY.find(w => w.toLowerCase() === cleanWord.toLowerCase());
    if (exactMatch) return exactMatch;

    let bestMatch = cleanWord;
    let minDistance = Infinity;

    for (const dictWord of DENTAL_VOCABULARY) {
      const distance = levenshteinDistance(cleanWord.toLowerCase(), dictWord.toLowerCase());
      // Dynamic threshold
      const threshold = cleanWord.length > 7 ? 3 : (cleanWord.length > 4 ? 2 : 1);

      if (distance <= threshold && distance < minDistance) {
        minDistance = distance;
        bestMatch = dictWord;
      }
    }
    return bestMatch;
  }).join('');
};

class ImageToTextTransformer implements IDocumentToTextTransformer {
  async transform(document: IRawDocument): Promise<INormalizedText> {
    // Tesseract Worker Creation with Fallback strategy
    let worker;
    try {
      // Attempt 1: Try loading the "Best" LSTM model (High Accuracy)
      worker = await createWorker('spa', 1, {
        langPath: 'https://tessdata.projectnaptha.com/4.0.0_best',
        errorHandler: (err) => console.log('Tesseract Error:', err),
        logger: (m) => console.log('Tesseract Log:', m)
      });
    } catch (e) {
      console.warn('Failed to load Best model, falling back to Standard...', e);
      // Attempt 2: Fallback to standard/fast model (bundled or default CDN)
      worker = await createWorker('spa');
    }

    // Common Parameters
    await worker.setParameters({
      user_defined_dpi: '300',
    });

    // Execute Recognition
    let ret;
    try {
      ret = await worker.recognize(document.blob as File);
    } catch (ocrError: any) {
      await worker.terminate();
      throw new Error(`Fallo en reconocimiento OCR: ${ocrError?.message || ocrError}`);
    }

    await worker.terminate();

    // Data Extraction
    const data = ret.data as any;
    const lines = data.lines || [];
    const combinedText = ret.data.text || '';

    // Safety cleanup
    const cleanText = (text: string) => {
      if (!text) return '';
      return text
        .replace(/[_|—]{2,}/g, '')
        .replace(/[|]/g, ' ')
        .replace(/^[.,\s]+|[.,\s]+$/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    };

    // Apply HYBRID correction
    const rawTextCleaned = cleanText(combinedText);
    const finalText = applyHybridCorrection(rawTextCleaned);

    return {
      rawText: finalText.split('\n').filter(l => l.length > 2).join('\n'),
      confidence: ret.data.confidence,
      structuredBlocks: lines.map((line: any, idx: number) => ({
        id: `block-${idx}`,
        text: applyHybridCorrection(cleanText(line.text || '')),
        type: 'paragraph',
        boundingBox: line.bbox ? {
          x: line.bbox.x0,
          y: line.bbox.y0,
          w: line.bbox.x1 - line.bbox.x0,
          h: line.bbox.y1 - line.bbox.y0
        } : undefined
      }))
    };
  }
}

class PdfToTextTransformer implements IDocumentToTextTransformer {
  async transform(document: IRawDocument): Promise<INormalizedText> {
    try {
      const arrayBuffer = await document.blob.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      // Extracción básica de texto página por página
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n\n';
      }

      // TODO: Si el PDF es escaneado (sin texto), usar fallback a OCR convertiendo a imágenes
      // Por ahora asumimos PDF digital

      return {
        rawText: fullText,
        confidence: 100, // Asumimos 100 para texto nativo
        structuredBlocks: [] // PDF.js raw extraction doesn't give clean blocks easily without more work
      };
    } catch (e: any) {
      console.error("PDF Error:", e);
      throw new Error(`Error leyendo PDF: ${e.message || 'Desconocido'}`);
    }
  }
}

export class DocumentTransformerFactory {
  static getTransformer(type: 'IMAGE' | 'PDF'): IDocumentToTextTransformer {
    if (type === 'IMAGE') return new ImageToTextTransformer();
    if (type === 'PDF') return new PdfToTextTransformer();
    throw new Error('Unsupported type');
  }
}
