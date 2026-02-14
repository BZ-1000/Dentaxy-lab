import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import { DicomLoader, DicomLoadResult } from './DicomLoader';
import { DicomMetadata } from './DicomMetadata';

export interface LocalStudy {
    id: string;
    patientName: string;
    patientId: string;
    studyDate: string;
    modality: string;
    description: string;
    imageId: string;
    fileName: string;
    file: File;
    metadata: DicomMetadata | null;
}

// In-memory storage for the session
let loadedStudies: LocalStudy[] = [];

export const LocalDicomService = {

    /**
     * Adds a file to the local session and parses metadata using DicomLoader
     */
    addFile: async (file: File): Promise<LocalStudy> => {
        console.log('📂 Añadiendo archivo DICOM:', file.name);

        // Use DicomLoader for robust loading
        const loadResult: DicomLoadResult = await DicomLoader.loadFile(file);

        if (!loadResult.success) {
            throw new Error(loadResult.error || 'Error cargando archivo DICOM');
        }

        const { imageId, metadata } = loadResult;

        // Smart formatting from filename or metadata
        let patientName = "DESCONOCIDO";
        if (metadata?.patientName) {
            patientName = metadata.patientName;
        } else {
            // Extract from filename
            const nameFromFilename = file.name.replace(/\.dcm$/i, '').replace(/[-_]/g, ' ');
            patientName = nameFromFilename.replace(/\b\w/g, l => l.toUpperCase());
        }

        const newStudy: LocalStudy = {
            id: imageId,
            patientName,
            patientId: metadata?.patientId || 'N/A',
            studyDate: metadata?.studyDate || new Date().toLocaleDateString(),
            modality: metadata?.modality || 'DX',
            description: metadata?.studyDescription || 'Importado localmente',
            imageId,
            fileName: file.name,
            file,
            metadata,
        };

        loadedStudies.push(newStudy);
        console.log('✅ Estudio añadido:', newStudy);

        return newStudy;
    },

    getStudies: () => {
        return [...loadedStudies];
    },

    clearStudies: () => {
        loadedStudies = [];
    },

    getStudyById: (id: string) => {
        return loadedStudies.find(s => s.id === id);
    },
};
