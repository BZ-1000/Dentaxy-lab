import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import * as cornerstone from '@cornerstonejs/core';
import dicomParser from 'dicom-parser';

/**
 * Configura el loader de imágenes DICOM de forma robusta.
 * CRÍTICO: Registra correctamente los externos (cornerstone, dicomParser).
 */
export const initImageLoader = () => {
    console.log('🔧 Inicializando DICOM Image Loader...');

    // ═══════════════════════════════════════════════════════════
    // En Cornerstone 3D moderno (v1.x+), NO se necesita configurar
    // externals manualmente. El loader importa cornerstone y dicomParser
    // internamente. Solo se llama a .init() con opciones.
    // ═══════════════════════════════════════════════════════════

    console.log('✅ Dependencias gestionadas internamente por el loader');

    // Detectar si estamos en un contexto seguro para SharedArrayBuffer
    const isSecureContext = window.isSecureContext;
    const hasSharedArrayBuffer = typeof SharedArrayBuffer !== 'undefined';

    console.log('🔒 Security Context:', {
        isSecureContext,
        hasSharedArrayBuffer,
        crossOriginIsolated: window.crossOriginIsolated,
    });

    if (!hasSharedArrayBuffer) {
        console.warn(
            '⚠️ SharedArrayBuffer NO está disponible. El rendimiento será menor y algunos codecs pueden fallar.'
        );
    }

    try {
        const maxWebWorkers = navigator.hardwareConcurrency || 4;

        console.log('📍 PASO A: Inicializando DICOM loader...');
        // Inicializar el loader con Web Workers habilitados
        cornerstoneDICOMImageLoader.init({
            maxWebWorkers: Math.min(maxWebWorkers, 4),
        });

        console.log('✅ DICOM Image Loader inicializado correctamente');
        console.log('   - MaxWorkers:', Math.min(maxWebWorkers, 4));
        console.log('   - SharedArrayBuffer:', hasSharedArrayBuffer ? 'Disponible' : 'No disponible');

        // ═══════════════════════════════════════════════════════════
        // CRÍTICO: REGISTRAR EL IMAGE LOADER PARA EL ESQUEMA 'wadouri'
        // Sin esto, Cornerstone no sabe cómo cargar imágenes wadouri:
        // ═══════════════════════════════════════════════════════════
        console.log('📍 PASO B: Registrando image loader para wadouri...');
        console.log('   - cornerstone disponible:', !!cornerstone);
        console.log('   - registerImageLoader disponible:', !!cornerstone.registerImageLoader);
        console.log('   - cornerstoneDICOMImageLoader.wadouri disponible:', !!cornerstoneDICOMImageLoader.wadouri);
        console.log('   - loadImage function disponible:', !!cornerstoneDICOMImageLoader.wadouri.loadImage);

        cornerstone.registerImageLoader(
            'wadouri',
            cornerstoneDICOMImageLoader.wadouri.loadImage
        );
        console.log('✅ Image Loader registrado para esquema "wadouri"');

        console.log('📍 PASO C: Registrando image loader para dicomweb...');
        // También registrar otros esquemas comunes
        cornerstone.registerImageLoader(
            'dicomweb',
            cornerstoneDICOMImageLoader.wadors.loadImage
        );
        console.log('✅ Image Loader registrado para esquema "dicomweb"');

        // ═══════════════════════════════════════════════════════════
        // CRÍTICO: REGISTRAR LOADER PARA ESQUEMA 'dicomfile'
        // El fileManager.add() retorna imageIds con esquema 'dicomfile:'
        // Necesitamos que use el mismo loader que 'wadouri'
        // ═══════════════════════════════════════════════════════════
        console.log('📍 PASO D: Registrando image loader para dicomfile...');
        cornerstone.registerImageLoader(
            'dicomfile',
            cornerstoneDICOMImageLoader.wadouri.loadImage
        );
        console.log('✅ Image Loader registrado para esquema "dicomfile"');

    } catch (error) {
        console.error('❌ Error al inicializar DICOM Loader:', error);
        console.error('   Stack:', error instanceof Error ? error.stack : 'No stack available');
        // No lanzar error para permitir que la app intente cargar aunque sea parcialmente
    }

    console.log('✅ initImageLoader completado');
};
