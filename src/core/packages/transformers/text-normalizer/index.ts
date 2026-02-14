import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';

export class TextNormalizer {
    private processor;

    constructor() {
        this.processor = unified()
            .use(remarkParse)
            .use(remarkStringify);
    }

    async normalize(text: string): Promise<string> {
        // Ejemplo simple: Limpiar excesos de saltos de línea y espacios
        const cleaned = text
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('\n\n');

        // Aquí podríamos usar remark para estructurar Markdown si la entrada fuera md
        // Para texto plano de OCR, esto es más una limpieza heurística
        return cleaned;
    }
}
