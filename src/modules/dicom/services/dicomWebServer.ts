import { v4 as uuidv4 } from 'uuid';

export interface Study {
    id: string;
    patientName: string;
    patientId: string;
    studyDate: string;
    modality: string;
    description: string;
    referringPhysician?: string;
    accessionNumber?: string;
    numSeries: number;
    previewUrl?: string; // For the study list thumbnail if we want one
}

export interface Series {
    id: string;
    studyId: string;
    modality: string;
    description: string;
    numInstances: number;
    previewUrl?: string; // Thumbnail for the series
}

export interface Instance {
    id: string;
    seriesId: string;
    sopInstanceUid: string;
    imageId: string; // The Cornerstone ImageId
}

// --- Mock Data ---

const MOCK_STUDIES: Study[] = [
    {
        id: 'study-1',
        patientName: 'PEREZ JUAN',
        patientId: 'D-2024-001',
        studyDate: '2024-02-10',
        modality: 'DX', // Digital X-Ray
        description: 'PANORAMICA ORTOPANTOMOGRAFIA',
        referringPhysician: 'Dr. Smith',
        numSeries: 1,
    },
    {
        id: 'study-2',
        patientName: 'GARCIA MARIA',
        patientId: 'D-2024-045',
        studyDate: '2024-02-12',
        modality: 'CT', // Cone Beam CT usually appears as CT
        description: 'CBCT MAXILAR SUPERIOR',
        referringPhysician: 'Dra. Lopez',
        numSeries: 1,
    },
    {
        id: 'study-3',
        patientName: 'RODRIGUEZ LUIS',
        patientId: 'D-2023-889',
        studyDate: '2023-11-05',
        modality: 'IO', // Intraoral - often DX or IO
        description: 'SERIE PERIAPICAL COMPLETA',
        referringPhysician: 'Dr. Dental',
        numSeries: 14,
    },
    {
        id: 'study-4',
        patientName: 'LOPEZ ANA',
        patientId: 'D-2024-012',
        studyDate: '2024-01-20',
        modality: 'DX',
        description: 'CEFALOMETRIA LATERAL',
        referringPhysician: 'Dr. Ortho',
        numSeries: 1,
    }
];

const MOCK_SERIES: Record<string, Series[]> = {
    'study-1': [
        {
            id: 'series-1-1',
            studyId: 'study-1',
            modality: 'DX',
            description: 'Panoramic View',
            numInstances: 1
        }
    ],
    'study-2': [
        {
            id: 'series-2-1',
            studyId: 'study-2',
            modality: 'CT',
            description: 'Axial Reconstruction',
            numInstances: 256
        }
    ]
    // Add more as needed
};

// --- Service ---

const DELAY_MS = 800;

export const DicomWebServer = {
    /**
     * Search for studies matching criteria (simulated).
     * @param query Search string (Patient Name or ID)
     */
    searchStudies: async (query: string = ''): Promise<Study[]> => {
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));

        if (!query) return MOCK_STUDIES;

        const lowerQuery = query.toLowerCase();
        return MOCK_STUDIES.filter(s =>
            s.patientName.toLowerCase().includes(lowerQuery) ||
            s.patientId.toLowerCase().includes(lowerQuery)
        );
    },

    /**
     * Get series for a specific study.
     * @param studyId 
     */
    getStudySeries: async (studyId: string): Promise<Series[]> => {
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
        return MOCK_SERIES[studyId] || [];
    },

    /**
     * Get instances (images) for a specific series.
     * Note: In a real app, this would query QIDO-RS. 
     * Here we would return mock imageIds (wadouri:...).
     */
    getSeriesInstances: async (seriesId: string): Promise<Instance[]> => {
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
        // TODO: Return realistic mock instances or link to local assets
        return [];
    }
};
