import { IRawDocument, IDocumentMetadata } from '../contracts';

export interface IStorageDriver {
    save(document: IRawDocument): Promise<string>; // Retorna ID
    get(id: string): Promise<IRawDocument | null>;
    list(): Promise<IDocumentMetadata[]>;
}

// Implementación en memoria para Fase 1 (Mock)
class InMemoryStorage implements IStorageDriver {
    private store: Map<string, IRawDocument> = new Map();

    async save(document: IRawDocument): Promise<string> {
        const id = document.metadata.id;
        this.store.set(id, document);
        console.log(`[Storage] Documento guardado: \${id}`);
        return id;
    }

    async get(id: string): Promise<IRawDocument | null> {
        return this.store.get(id) || null;
    }

    async list(): Promise<IDocumentMetadata[]> {
        return Array.from(this.store.values()).map(d => d.metadata);
    }
}

export const coreStorage = new InMemoryStorage();
