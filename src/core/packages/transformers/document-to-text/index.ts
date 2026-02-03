import { IDocumentToTextTransformer, IRawDocument, INormalizedText } from '../../contracts';
import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Configurar worker de PDF.js (apuntar al archivo en public o node_modules)
// En un entorno real de Next.js, esto requiere configuración de webpack o copiar el worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

class ImageToTextTransformer implements IDocumentToTextTransformer {
    async transform(document: IRawDocument): Promise<INormalizedText> {
        const worker = await createWorker('spa');
        const ret = await worker.recognize(document.blob as File);
        await worker.terminate();

        return {
            rawText: ret.data.text,
            confidence: ret.data.confidence,
            structuredBlocks: ret.data.lines.map((line, idx) => ({
                id: \`block-\${idx}\`,
        text: line.text,
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
    const arrayBuffer = await document.blob.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    // Extracción básica de texto página por página
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\\n\\n';
    }

    // TODO: Si el PDF es escaneado (sin texto), usar fallback a OCR convertiendo a imágenes
    // Por ahora asumimos PDF digital

    return {
      rawText: fullText,
      confidence: 100, // Asumimos 100 para texto nativo
      structuredBlocks: [] // PDF.js raw extraction doesn't give clean blocks easily without more work
    };
  }
}

export class DocumentTransformerFactory {
  static getTransformer(type: 'IMAGE' | 'PDF'): IDocumentToTextTransformer {
    if (type === 'IMAGE') return new ImageToTextTransformer();
    if (type === 'PDF') return new PdfToTextTransformer();
    throw new Error('Unsupported type');
  }
}
