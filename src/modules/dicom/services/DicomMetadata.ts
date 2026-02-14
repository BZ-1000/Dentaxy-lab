import { metaData } from '@cornerstonejs/core';
import dicomParser from 'dicom-parser';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';

/**
 * Interfaz completa de metadatos DICOM para análisis clínico
 */
export interface DicomMetadata {
    // Identificación
    modality: string;              // (0008,0060)
    bodyPartExamined: string;      // (0018,0015)
    studyDescription: string;      // (0008,1030)
    seriesDescription: string;     // (0008,103E)
    imageType: string[];           // (0008,0008)
    sopClassUID: string;

    // Propiedades de la imagen
    rows: number;
    columns: number;
    pixelSpacing: [number, number] | null; // (0028,0030) [row, column] en mm
    imagerPixelSpacing: [number, number] | null; // (0018,1164)

    // Información del paciente
    patientName: string;
    patientId: string;
    studyDate: string;

    // Hints de renderizado
    windowCenter: number | number[];
    windowWidth: number | number[];
    rescaleIntercept: number;
    rescaleSlope: number;

    // Propiedades adicionales
    bitsAllocated: number;
    bitsStored: number;
    photometricInterpretation: string;
}

/**
 * Extrae metadatos DIRECTAMENTE del DataSet parseado de dicomParser
 * CRÍTICO: Esta función NO depende del metadata provider de Cornerstone
 * Se usa ANTES de loadImage para registrar el metadata provider correctamente
 * 
 * @param dataSet - DataSet parseado por dicomParser
 * @param fileName - Nombre del archivo (opcional, usado para paciente anónimo)
 * @returns Metadatos DICOM completos o null si hay error
 */
export function extractMetadataFromDataSet(
    dataSet: dicomParser.DataSet,
    fileName?: string
): DicomMetadata | null {
    try {
        console.log('📊 Extrayendo metadatos DIRECTAMENTE del DataSet parseado');

        // PARSE PIXEL SPACING (0028,0030)
        let pixelSpacing: [number, number] | null = null;
        const pixelSpacingStr = dataSet.string('x00280030');
        if (pixelSpacingStr) {
            const parts = pixelSpacingStr.split('\\');
            if (parts.length >= 2) {
                pixelSpacing = [parseFloat(parts[0]), parseFloat(parts[1])];
            }
        }

        // PARSE IMAGER PIXEL SPACING (0018,1164) - Fallback para panorámicas
        let imagerPixelSpacing: [number, number] | null = null;
        const imagerPixelSpacingStr = dataSet.string('x00181164');
        if (imagerPixelSpacingStr) {
            const parts = imagerPixelSpacingStr.split('\\');
            if (parts.length >= 2) {
                imagerPixelSpacing = [parseFloat(parts[0]), parseFloat(parts[1])];
            }
        }

        // PARSE IMAGE TYPE (0008,0008)
        let imageType: string[] = [];
        const imageTypeStr = dataSet.string('x00080008');
        if (imageTypeStr) {
            imageType = imageTypeStr.split('\\');
        }

        // PARSE WINDOW CENTER & WIDTH (0028,1050 y 0028,1051)
        let windowCenter: number | number[] = 40; // Default
        const windowCenterStr = dataSet.string('x00281050');
        if (windowCenterStr) {
            const values = windowCenterStr.split('\\').map(Number);
            windowCenter = values.length === 1 ? values[0] : values;
        }

        let windowWidth: number | number[] = 400; // Default
        const windowWidthStr = dataSet.string('x00281051');
        if (windowWidthStr) {
            const values = windowWidthStr.split('\\').map(Number);
            windowWidth = values.length === 1 ? values[0] : values;
        }

        // PARSE PATIENT NAME (0010,0010)
        let patientName = 'Paciente Anónimo';
        const patientNameRaw = dataSet.string('x00100010');
        if (patientNameRaw) {
            patientName = formatPatientNameString(patientNameRaw);
        } else if (fileName) {
            patientName = formatFileNameAsPatientName(fileName);
        }

        // PARSE STUDY DATE (0008,0020)
        let studyDate = new Date().toISOString().slice(0, 10);
        const studyDateRaw = dataSet.string('x00080020');
        if (studyDateRaw && studyDateRaw.length === 8) {
            const year = studyDateRaw.substring(0, 4);
            const month = studyDateRaw.substring(4, 6);
            const day = studyDateRaw.substring(6, 8);
            studyDate = `${year}-${month}-${day}`;
        }

        // CONSTRUIR OBJETO DE METADATOS
        const metadata: DicomMetadata = {
            // Identificación
            modality: dataSet.string('x00080060') || 'DX',
            bodyPartExamined: dataSet.string('x00180015') || '',
            studyDescription: dataSet.string('x00081030') || '',
            seriesDescription: dataSet.string('x0008103e') || '',
            imageType,
            sopClassUID: dataSet.string('x00080016') || '',

            // Dimensiones (CRÍTICO para renderizado)
            rows: dataSet.uint16('x00280010') || 0,
            columns: dataSet.uint16('x00280011') || 0,
            pixelSpacing,
            imagerPixelSpacing,

            // Paciente
            patientName,
            patientId: dataSet.string('x00100020') || 'N/A',
            studyDate,

            // Renderizado
            windowCenter,
            windowWidth,
            rescaleIntercept: parseFloat(dataSet.string('x00281052') || '0'),
            rescaleSlope: parseFloat(dataSet.string('x00281053') || '1'),

            // Propiedades del pixel (CRÍTICO - samplesPerPixel)
            bitsAllocated: dataSet.uint16('x00280100') || 16,
            bitsStored: dataSet.uint16('x00280101') || 12,
            photometricInterpretation: dataSet.string('x00280004') || 'MONOCHROME2',
        };

        console.log('✅ Metadatos extraídos del DataSet:', {
            paciente: metadata.patientName,
            dimensiones: `${metadata.columns}x${metadata.rows}`,
            modalidad: metadata.modality,
            bitsAllocated: metadata.bitsAllocated,
            photometricInterpretation: metadata.photometricInterpretation,
        });

        return metadata;

    } catch (error) {
        console.error('❌ Error extrayendo metadatos del DataSet:', error);
        return null;
    }
}

/**
 * Extrae metadatos DICOM completos de un imageId cargado en Cornerstone
 * VERSIÓN ROBUSTA con múltiples fallbacks
 * NOTA: Esta función se usa DESPUÉS de que la imagen ya está cargada
 */
export function extractMetadata(imageId: string): DicomMetadata | null {
    try {
        console.log('📊 Extrayendo metadatos para:', imageId);

        // Obtener módulos de metadatos desde Cornerstone
        const generalImageModule = metaData.get('generalImageModule', imageId);
        const imagePlaneModule = metaData.get('imagePlaneModule', imageId);
        const imagePixelModule = metaData.get('imagePixelModule', imageId);
        const patientModule = metaData.get('patientModule', imageId) || metaData.get('patient', imageId);
        const generalStudyModule = metaData.get('generalStudyModule', imageId) || metaData.get('generalStudy', imageId);
        const generalSeriesModule = metaData.get('generalSeriesModule', imageId) || metaData.get('generalSeries', imageId);
        const voiLutModule = metaData.get('voiLutModule', imageId);
        const modalityLutModule = metaData.get('modalityLutModule', imageId);

        // EXTRAER NOMBRE DEL PACIENTE CON MÚLTIPLES FALLBACKS
        let patientName = extractPatientName(patientModule, imageId);

        // EXTRAER DIMENSIONES DE LA IMAGEN
        const dimensions = extractImageDimensions(imagePixelModule, imagePlaneModule);

        // Extraer PixelSpacing (más confiable para mediciones)
        let pixelSpacing: [number, number] | null = null;
        if (imagePlaneModule?.pixelSpacing) {
            const ps = imagePlaneModule.pixelSpacing;
            if (Array.isArray(ps) && ps.length === 2) {
                pixelSpacing = [parseFloat(ps[0]), parseFloat(ps[1])];
            }
        }

        // Extraer ImagerPixelSpacing como fallback
        let imagerPixelSpacing: [number, number] | null = null;
        if (imagePlaneModule?.imagerPixelSpacing) {
            const ips = imagePlaneModule.imagerPixelSpacing;
            if (Array.isArray(ips) && ips.length === 2) {
                imagerPixelSpacing = [parseFloat(ips[0]), parseFloat(ips[1])];
            }
        }

        // Construir objeto de metadatos
        const metadata: DicomMetadata = {
            // Identificación
            modality: generalSeriesModule?.modality || 'DX',
            bodyPartExamined: generalSeriesModule?.bodyPartExamined || '',
            studyDescription: generalStudyModule?.studyDescription || '',
            seriesDescription: generalSeriesModule?.seriesDescription || '',
            imageType: generalImageModule?.imageType || [],
            sopClassUID: generalImageModule?.sopClassUID || '',

            // Dimensiones
            rows: dimensions.rows,
            columns: dimensions.columns,
            pixelSpacing,
            imagerPixelSpacing,

            // Paciente
            patientName,
            patientId: patientModule?.patientId || 'N/A',
            studyDate: formatStudyDate(generalStudyModule?.studyDate) || new Date().toISOString().slice(0, 10),

            // Renderizado
            windowCenter: voiLutModule?.windowCenter?.[0] || 40,
            windowWidth: voiLutModule?.windowWidth?.[0] || 400,
            rescaleIntercept: modalityLutModule?.rescaleIntercept || 0,
            rescaleSlope: modalityLutModule?.rescaleSlope || 1,

            // Propiedades del pixel
            bitsAllocated: imagePixelModule?.bitsAllocated || 16,
            bitsStored: imagePixelModule?.bitsStored || 12,
            photometricInterpretation: imagePixelModule?.photometricInterpretation || 'MONOCHROME2',
        };

        console.log('✅ Metadatos extraídos correctamente:', {
            paciente: metadata.patientName,
            dimensiones: `${metadata.columns}x${metadata.rows}`,
            modalidad: metadata.modality,
        });

        return metadata;

    } catch (error) {
        console.error('❌ Error extrayendo metadatos:', error);
        return null;
    }
}

/**
 * Extrae el nombre del paciente con múltiples fallbacks robustos
 */
function extractPatientName(patientModule: any, imageId: string): string {
    // Método 1: patientModule.patientName (estándar)
    if (patientModule?.patientName) {
        const rawName = patientModule.patientName.Alphabetic || patientModule.patientName;
        if (typeof rawName === 'string' && rawName.trim()) {
            return formatPatientNameString(rawName);
        }
    }

    // Método 2: Acceso directo via metaData
    try {
        const directPatientName = metaData.get('patientName', imageId);
        if (directPatientName && typeof directPatientName === 'string' && directPatientName.trim()) {
            return formatPatientNameString(directPatientName);
        }
    } catch (e) {
        // Ignorar error
    }

    // Método 3: Extraer del nombre de archivo (imageId)
    try {
        // imageId tiene formato: wadouri:file_123 o similar
        const fileName = extractFileNameFromImageId(imageId);
        if (fileName) {
            return formatFileNameAsPatientName(fileName);
        }
    } catch (e) {
        // Ignorar error
    }

    // Fallback final
    return 'Paciente Anónimo';
}

/**
 * Formatea un string de nombre de paciente DICOM
 */
function formatPatientNameString(rawName: string): string {
    if (!rawName || !rawName.trim()) return 'Paciente Anónimo';

    // Convertir LAST^FIRST a formato legible
    let formatted = rawName
        .replace(/\^/g, ' ')  // Reemplazar ^ con espacio
        .replace(/-/g, ' ')   // Reemplazar - con espacio
        .replace(/\s+/g, ' ') // Normalizar espacios múltiples
        .trim();

    // Capitalizar cada palabra
    formatted = formatted.replace(/\b\w/g, l => l.toUpperCase());

    return formatted || 'Paciente Anónimo';
}

/**
 * Extrae el nombre de archivo del imageId
 */
function extractFileNameFromImageId(imageId: string): string | null {
    try {
        // Formato típico: wadouri:file_123
        // Necesitamos obtener el archivo del file manager
        if (imageId.startsWith('wadouri:')) {
            const fileId = imageId.replace('wadouri:', '');
            // Intentar obtener del file manager
            const fileManager = cornerstoneDICOMImageLoader.wadouri.fileManager as any;
            if (fileManager && typeof fileManager.get === 'function') {
                const file = fileManager.get(fileId);
                if (file && typeof file === 'object' && 'name' in file) {
                    return (file as File).name;
                }
            }
        }
    } catch (e) {
        console.warn('No se pudo extraer nombre de archivo:', e);
    }
    return null;
}

/**
 * Formatea el nombre de archivo como nombre de paciente
 */
function formatFileNameAsPatientName(fileName: string): string {
    // Remover extensión .dcm
    let name = fileName.replace(/\.dcm$/i, '');

    // Reemplazar guiones y guiones bajos con espacios
    name = name.replace(/[-_]/g, ' ');

    // Capitalizar
    name = name.replace(/\b\w/g, l => l.toUpperCase());

    return name.trim() || 'Paciente Anónimo';
}

/**
 * Extrae dimensiones de la imagen con fallbacks
 */
function extractImageDimensions(imagePixelModule: any, imagePlaneModule: any): { rows: number; columns: number } {
    let rows = imagePixelModule?.rows || imagePlaneModule?.rows || 0;
    let columns = imagePixelModule?.columns || imagePlaneModule?.columns || 0;

    // Si aún son 0, intentar obtener de la imagen cargada
    if (rows === 0 || columns === 0) {
        console.warn('⚠️ Dimensiones no encontradas en metadatos');
    }

    return { rows, columns };
}

/**
 * Formatea la fecha del estudio de forma robusta
 */
function formatStudyDate(studyDate: any): string {
    // Manejar null/undefined
    if (!studyDate) {
        return new Date().toISOString().slice(0, 10);
    }

    // Si es un objeto con year, month, day (formato DICOM ParsedDate)
    if (typeof studyDate === 'object' && studyDate.year && studyDate.month && studyDate.day) {
        const year = String(studyDate.year).padStart(4, '0');
        const month = String(studyDate.month).padStart(2, '0');
        const day = String(studyDate.day).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Si es un string
    if (typeof studyDate === 'string') {
        // Formato DICOM: YYYYMMDD
        if (studyDate.length === 8 && /^\d{8}$/.test(studyDate)) {
            const year = studyDate.substring(0, 4);
            const month = studyDate.substring(4, 6);
            const day = studyDate.substring(6, 8);
            return `${year}-${month}-${day}`;
        }
        // Si ya es un formato válido, retornarlo
        return studyDate;
    }

    // Fallback: convertir a string
    console.warn('Formato de fecha desconocido:', studyDate);
    return new Date().toISOString().slice(0, 10);
}

/**
 * Formatea el nombre del paciente desde diferentes fuentes
 */
export function formatPatientName(rawName: string | undefined, fileName?: string): string {
    if (!rawName && fileName) {
        return formatFileNameAsPatientName(fileName);
    }

    if (!rawName) return 'Paciente Anónimo';

    return formatPatientNameString(rawName);
}

export function calculateAspectRatio(metadata: DicomMetadata): number {
    if (!metadata.columns || !metadata.rows) return 1;
    return metadata.columns / metadata.rows;
}

/**
 * Registra un proveedor de metadatos personalizado para un imageId específico.
 * Esto es CRUCIAl para que Cornerstone pueda renderizar la imagen sin errores.
 */
export function registerMetadataProvider(imageId: string, metadata: DicomMetadata) {
    metaData.addProvider((type, queryImageId) => {
        if (queryImageId !== imageId) return undefined;

        if (type === 'imagePixelModule') {
            return {
                samplesPerPixel: 1, // Asumimos monocromático por defecto
                photometricInterpretation: metadata.photometricInterpretation,
                rows: metadata.rows,
                columns: metadata.columns,
                bitsAllocated: metadata.bitsAllocated,
                bitsStored: metadata.bitsStored,
                pixelRepresentation: 0, // 0 = unsigned, 1 = signed
            };
        }

        if (type === 'generalSeriesModule') {
            return {
                modality: metadata.modality,
                seriesDescription: metadata.seriesDescription,
            };
        }

        if (type === 'imagePlaneModule') {
            return {
                pixelSpacing: metadata.pixelSpacing || [1, 1],
                rows: metadata.rows,
                columns: metadata.columns,
                columnPixelSpacing: metadata.pixelSpacing ? metadata.pixelSpacing[1] : 1,
                rowPixelSpacing: metadata.pixelSpacing ? metadata.pixelSpacing[0] : 1,
            };
        }

        if (type === 'patientModule') {
            return {
                patientName: metadata.patientName,
                patientId: metadata.patientId,
            };
        }

        if (type === 'voiLutModule') {
            return {
                windowCenter: Array.isArray(metadata.windowCenter) ? metadata.windowCenter[0] : metadata.windowCenter,
                windowWidth: Array.isArray(metadata.windowWidth) ? metadata.windowWidth[0] : metadata.windowWidth,
            };
        }

        return undefined;
    }, 10000); // Alta prioridad

    console.log(`✅ Metadata Provider registrado para ${imageId}`);
}
