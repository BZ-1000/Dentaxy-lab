import { v4 as uuidv4 } from 'uuid';
import { IIngestionService, IRawDocument, DocumentType } from '../contracts';

export class IngestionService implements IIngestionService {
    async ingest(file: File): Promise<IRawDocument> {
        const type = this.detectType(file.type);

        return {
            metadata: {
                id: uuidv4(),
                originalName: file.name,
                mimeType: file.type,
                size: file.size,
                uploadDate: new Date(),
            },
            blob: file,
            type,
        };
    }

    private detectType(mimeType: string): DocumentType {
        if (mimeType.startsWith('image/')) return 'IMAGE';
        if (mimeType === 'application/pdf') return 'PDF';
        return 'UNKNOWN';
    }
}

export const dataIngestion = new IngestionService();
