import * as cornerstone from '@cornerstonejs/core';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import dicomParser from 'dicom-parser';
import { extractMetadata, extractMetadataFromDataSet, DicomMetadata, formatPatientName, registerMetadataProvider } from './DicomMetadata';

/**
 * Resultado de carga de archivo DICOM
 */
export interface DicomLoadResult {
    imageId: string;
    metadata: DicomMetadata | null;
    file: File;
    success: boolean;
    error?: string;
}

/**
 * Servicio robusto para carga de archivos DICOM
 */
export class DicomLoader {
    /**
     * Carga un archivo DICOM local y devuelve su imageId
     * VERSIÓN CORREGIDA v2: Registra metadata provider ANTES de loadImage
     * 
     * FLUJO CRÍTICO:
     * 1. Parsear DICOM raw con dicomParser
     * 2. Validar tags esenciales
     * 3. Extraer metadatos del DataSet directamente
     * 4. Generar imageId
     * 5. REGISTRAR metadata provider con los metadatos (ANTES de loadImage!)
     * 6. Cargar imagen (ahora Cornerstone tiene los metadatos disponibles)
     */
    static async loadFile(file: File): Promise<DicomLoadResult> {
        try {
            console.log('📂 Cargando archivo DICOM:', file.name, `(${(file.size / 1024 / 1024).toFixed(2)} MB)`);

            // ═══════════════════════════════════════════════════════════
            // PASO 1: VALIDAR EL ARCHIVO Y PARSEARLO
            // ═══════════════════════════════════════════════════════════
            const arrayBuffer = await file.arrayBuffer();
            let dataSet: dicomParser.DataSet;

            try {
                dataSet = dicomParser.parseDicom(new Uint8Array(arrayBuffer));
                console.log('✅ DICOM parseado correctamente');
            } catch (parseError) {
                console.error('❌ Error parseando DICOM:', parseError);
                throw new Error('El archivo no es un DICOM válido o está corrupto');
            }

            // ═══════════════════════════════════════════════════════════
            // PASO 2: VALIDAR TAGS ESENCIALES
            // ═══════════════════════════════════════════════════════════
            const requiredTags = [
                'x7fe00010', // PixelData
                'x00280002', // SamplesPerPixel
                'x00280004', // PhotometricInterpretation
                'x00280100', // BitsAllocated
            ];

            const missingTags: string[] = [];
            requiredTags.forEach((tag) => {
                if (!dataSet.elements[tag]) {
                    missingTags.push(tag);
                    console.warn(`⚠️ Falta tag obligatorio: ${tag}`);
                }
            });

            if (missingTags.includes('x7fe00010')) {
                throw new Error('El archivo no contiene PixelData. No es una imagen DICOM válida.');
            }

            // ═══════════════════════════════════════════════════════════
            // PASO 3: EXTRAER METADATOS DEL DATASET (DIRECTAMENTE)
            // CRÍTICO: Esto se hace ANTES de generar el imageId
            // ═══════════════════════════════════════════════════════════
            const metadata = extractMetadataFromDataSet(dataSet, file.name);

            if (!metadata) {
                throw new Error('No se pudieron extraer metadatos del archivo DICOM');
            }

            console.log('✅ Metadatos extraídos del DataSet:', {
                dimensiones: `${metadata.columns}x${metadata.rows}`,
                paciente: metadata.patientName,
                modalidad: metadata.modality,
            });

            // ═══════════════════════════════════════════════════════════
            // PASO 4: GENERAR imageId ÚNICO
            // ═══════════════════════════════════════════════════════════

            const timestamp = Date.now();
            const imageId = `dicommanual:${timestamp}`;

            console.log('🆔 ImageId generado:', imageId);

            // ═══════════════════════════════════════════════════════════
            // PASO 5: CREAR IMAGEN MANUALMENTE DESDE DATASET
            // Usar decoder manual - 100% client-side, funciona en producción
            // ═══════════════════════════════════════════════════════════

            console.log('🎨 Creando imagen usando decoder manual...');

            const { createImageLoadObject } = await import('./manualImageDecoder');
            const imageLoadObject = createImageLoadObject(imageId, dataSet);

            // Pre-cachear la imagen en Cornerstone
            console.log('💾 Pre-cacheando imagen en Cornerstone...');
            await cornerstone.cache.putImageLoadObject(imageId, imageLoadObject);
            console.log('✅ Imagen pre-cacheada exitosamente');

            // ═══════════════════════════════════════════════════════════
            // PASO 6: REGISTRAR METADATA PROVIDER
            // ═══════════════════════════════════════════════════════════
            console.log('📋 Registrando metadata provider...');
            registerMetadataProvider(imageId, metadata);
            console.log('✅ Metadata Provider registrado para:', imageId);

            console.log('🎉 Archivo DICOM procesado completamente');

            return {
                imageId,
                metadata,
                file,
                success: true,
            };
        } catch (error) {
            console.error('❌ Error cargando archivo DICOM:', error);

            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

            return {
                imageId: '',
                metadata: null,
                file,
                success: false,
                error: errorMessage,
            };
        }
    }

    /**
     * Carga múltiples archivos DICOM en paralelo
     */
    static async loadFiles(files: File[]): Promise<DicomLoadResult[]> {
        console.log(`📂 Cargando ${files.length} archivos DICOM...`);

        const results = await Promise.all(files.map((file) => this.loadFile(file)));

        const successful = results.filter((r) => r.success).length;
        console.log(`✅ ${successful}/${files.length} archivos cargados exitosamente`);

        return results;
    }

    /**
     * Valida si un archivo es probablemente DICOM
     */
    static isProbablyDicom(file: File): boolean {
        return file.name.toLowerCase().endsWith('.dcm') || file.type === 'application/dicom';
    }
}
