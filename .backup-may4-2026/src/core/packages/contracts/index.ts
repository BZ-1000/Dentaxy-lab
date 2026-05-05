export type DocumentType = 'IMAGE' | 'PDF' | 'UNKNOWN';

export interface IDocumentMetadata {
    id: string;
    originalName: string;
    mimeType: string;
    size: number;
    uploadDate: Date;
}

export interface IRawDocument {
    metadata: IDocumentMetadata;
    blob: Blob | File;
    type: DocumentType;
}

export interface INormalizedText {
    rawText: string;
    structuredBlocks: ITextBlock[];
    confidence: number;
}

export interface ITextBlock {
    id: string;
    text: string;
    type: 'paragraph' | 'heading' | 'list-item' | 'table';
    boundingBox?: { x: number; y: number; w: number; h: number };
}

// Contrato para Ingestion
export interface IIngestionService {
    ingest(file: File): Promise<IRawDocument>;
}

// Contrato para Transformación (Doc -> Text)
export interface IDocumentToTextTransformer {
    transform(document: IRawDocument): Promise<INormalizedText>;
}
