/**
 * Custom Image Loader para archivos DICOM locales
 * Evita usar fileManager que no es compatible con Cornerstone 3D
 */

import * as cornerstone from '@cornerstonejs/core';
import * as dicomParser from 'dicom-parser';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';

// Almacén en memoria para archivos locales
const localFileStore = new Map<string, File>();
let fileCounter = 0;

/**
 * Registra un archivo local y retorna un imageId único
 */
export function registerLocalFile(file: File): string {
    const imageId = `dicomlocal:${fileCounter++}`;
    localFileStore.set(imageId, file);
    console.log('📝 Archivo registrado:', imageId, '→', file.name);
    return imageId;
}

/**
 * Loader personalizado para archivos locales
 * Esta función será registrada con Cornerstone para el esquema 'dicomlocal:'
 */
export function loadLocalDicomImage(imageId: string): { promise: Promise<cornerstone.Types.IImage> } {
    console.log('🔄 loadLocalDicomImage llamado para:', imageId);

    const promise = (async () => {
        const file = localFileStore.get(imageId);

        if (!file) {
            throw new Error(`Archivo no encontrado para imageId: ${imageId}`);
        }

        console.log('📂 Cargando archivo:', file.name);

        // Agregar el archivo al fileManager del wadouri loader
        const wadouriImageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(file);
        console.log('   wadouri imageId:', wadouriImageId);

        // Usar el loader de wadouri para cargar la imagen
        console.log('🎨 Decodificando imagen DICOM usando wadouri loader...');
        const imageLoadObject = cornerstoneDICOMImageLoader.wadouri.loadImage(wadouriImageId);

        // Esperar la promesa de carga
        const image = await imageLoadObject.promise;

        console.log('✅ Imagen decodificada:', {
            width: image.width,
            height: image.height,
            imageId: image.imageId
        });

        // Reemplazar el imageId con nuestro ID personalizado
        image.imageId = imageId;

        return image;
    })();

    return { promise };
}

/**
 * Inicializa el loader personalizado
 */
export function initializeLocalFileLoader() {
    console.log('🔧 Inicializando loader personalizado para archivos locales...');

    // Registrar el loader para el esquema 'dicomlocal:'
    cornerstone.registerImageLoader('dicomlocal', loadLocalDicomImage);

    console.log('✅ Loader personalizado registrado para esquema "dicomlocal"');
}
