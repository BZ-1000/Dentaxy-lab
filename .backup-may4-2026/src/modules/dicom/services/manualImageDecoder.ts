/**
 * Manual DICOM Image Decoder
 * Construye objetos IImage directamente desde DataSet parseado
 * 100% client-side, funciona en desarrollo y producción
 */

import * as cornerstone from '@cornerstonejs/core';
import * as dicomParser from 'dicom-parser';
import { getTransferSyntaxName } from './transferSyntax';

/**
 * Decodifica pixel data de un DataSet DICOM
 */
function decodePixelData(dataSet: dicomParser.DataSet): Uint16Array | Uint8Array {
    const pixelDataElement = dataSet.elements.x7fe00010;

    if (!pixelDataElement) {
        throw new Error('No se encontró pixel data en el DICOM');
    }

    const bitsAllocated = dataSet.uint16('x00280100') || 16;
    const bitsStored = dataSet.uint16('x00280101') || bitsAllocated;
    const pixelRepresentation = dataSet.uint16('x00280103') || 0; // 0=unsigned, 1=signed

    // Calcular máscara para limpiar bits basura
    // Ejemplo: 14 bits -> 0x3FFF (0011 1111 1111 1111)
    let bitMask = 0xFFFF;
    if (bitsStored < bitsAllocated) {
        bitMask = (1 << bitsStored) - 1;
    }

    const rows = dataSet.uint16('x00280010');
    const cols = dataSet.uint16('x00280011');
    const pixelDataOffset = pixelDataElement.dataOffset;
    const pixelDataLength = pixelDataElement.length;

    console.log('📊 Decodificando pixel data y limpiando bits:', {
        bitsAllocated,
        bitsStored,
        bitMask: bitMask.toString(16),
        pixelRepresentation
    });

    if (bitsAllocated === 16) {
        // Copia profunda del buffer
        const bufferCopy = dataSet.byteArray.buffer.slice(
            pixelDataOffset,
            pixelDataOffset + pixelDataLength
        );
        const pixelData = new Uint16Array(bufferCopy);

        // APLICAR MÁSCARA Y CORRECCIÓN SIGNED SI ES NECESARIO
        if (bitsStored < bitsAllocated || pixelRepresentation === 1) {
            console.log('🧹 Aplicando limpieza de bits...');
            for (let i = 0; i < pixelData.length; i++) {
                // Limpiar bits altos
                let val = pixelData[i] & bitMask;

                // Si es signed y el bit de signo está activo, extender el signo
                // (No aplicable aquí porque dice "unsigned", pero buena práctica)
                if (pixelRepresentation === 1) {
                    const signBit = 1 << (bitsStored - 1);
                    if (val & signBit) {
                        val = val - (1 << bitsStored);
                    }
                }

                pixelData[i] = val;
            }
        }

        // --- DEBUG: INYECTOR DE PATRÓN DE PRUEBA ---
        // (Eliminado en producción para evitar artefactos visuales)
        // -------------------------------------------

        return pixelData;
    } else if (bitsAllocated === 8) {
        const bufferCopy = dataSet.byteArray.buffer.slice(
            pixelDataOffset,
            pixelDataOffset + pixelDataLength
        );
        return new Uint8Array(bufferCopy);
    } else {
        throw new Error(`Bits allocated no soportado: ${bitsAllocated}`);
    }
}

/**
 * Calcula min/max pixel values del pixel data
 */
function calculateMinMax(pixelData: Uint16Array | Uint8Array): { min: number; max: number } {
    let min = pixelData[0];
    let max = pixelData[0];

    for (let i = 1; i < pixelData.length; i++) {
        const value = pixelData[i];
        if (value < min) min = value;
        if (value > max) max = value;
    }

    return { min, max };
}

/**
 * Construye un objeto IImage compatible con Cornerstone
 */
export function createImageFromDataSet(
    imageId: string,
    dataSet: dicomParser.DataSet
): cornerstone.Types.IImage {
    // --- DECODIFICACIÓN REAL ---
    console.log('🎨 Construyendo IImage manualmente desde DataSet...');

    // Extraer dimensiones
    const rows = dataSet.uint16('x00280010');
    const cols = dataSet.uint16('x00280011');
    const bitsAllocated = dataSet.uint16('x00280100') || 16;
    const bitsStored = dataSet.uint16('x00280101') || bitsAllocated;
    const highBit = dataSet.uint16('x00280102') || bitsStored - 1;
    const pixelRepresentation = dataSet.uint16('x00280103') || 0; // 0=unsigned, 1=signed
    // Extraer metadata clave
    const transferSyntaxUID = dataSet.string('x00020010');
    const transferSyntaxName = getTransferSyntaxName(transferSyntaxUID);

    console.log('🔍 Transfer Syntax:', {
        uid: transferSyntaxUID,
        name: transferSyntaxName
    });

    const samplesPerPixel = dataSet.uint16('x00280002') || 1;
    const photometricInterpretation = dataSet.string('x00280004') || 'MONOCHROME2';

    // Extraer transformaciones
    const rescaleSlope = parseFloat(dataSet.string('x00281053') || '1');
    const rescaleIntercept = parseFloat(dataSet.string('x00281052') || '0');

    // VOI LUT (Window/Level) - Intentar leer del DICOM primero
    let windowCenter = parseFloat(dataSet.string('x00281050')?.split('\\')[0] || '0');
    let windowWidth = parseFloat(dataSet.string('x00281051')?.split('\\')[0] || '0');

    if (!rows || !cols) {
        throw new Error('Dimensiones de imagen inválidas');
    }

    console.log('📐 Parámetros de imagen:', {
        dimensions: `${cols}x${rows}`,
        bitsAllocated,
        photometricInterpretation,
        windowCenter,
        windowWidth
    });

    // Decodificar pixel data
    const pixelData = decodePixelData(dataSet);

    // Calcular min/max reales del pixel data
    const { min, max } = calculateMinMax(pixelData);

    console.log('📊 Pixel data statistics:', {
        min,
        max,
        totalPixels: pixelData.length,
        expectedPixels: rows * cols * samplesPerPixel
    });

    // Calcular valores modales para color (si aplica) o grayscale
    const modalityLUTValue = (value: number) => value * rescaleSlope + rescaleIntercept;
    const minPixelValue = modalityLUTValue(min);
    const maxPixelValue = modalityLUTValue(max);

    // AUTO-WINDOWING ROBUSTO
    // Si los valores del DICOM son 0 o parecen inválidos, calcular basados en el histograma real
    if (windowWidth <= 1 || (windowCenter === 0 && windowWidth === 0)) {
        console.log('⚠️ Window/Level no encontrado o inválido en DICOM. Calculando auto-windowing...');
        // Usar todo el rango dinámico de la imagen
        windowWidth = maxPixelValue - minPixelValue;
        windowCenter = minPixelValue + (windowWidth / 2);

        // Ajuste fino: a veces el rango completo es demasiado amplio por outliers (pixeles muy brillantes/oscuros)
        // Pero para empezar, asegurar visibilidad es lo más importante.
    }

    console.log('🪟 Configuración de Window/Level final:', {
        windowCenter,
        windowWidth,
        minPixelValue,
        maxPixelValue
    });

    // Construir objeto IImage
    const image: cornerstone.Types.IImage = {
        imageId: imageId,
        minPixelValue: minPixelValue,
        maxPixelValue: maxPixelValue,
        slope: rescaleSlope,
        intercept: rescaleIntercept,
        windowCenter: windowCenter,
        windowWidth: windowWidth,
        getPixelData: () => pixelData,
        rows: rows,
        columns: cols,
        height: rows,
        width: cols,
        color: samplesPerPixel === 3,
        rgba: false,
        columnPixelSpacing: parseFloat(dataSet.string('x00280030')?.split('\\')[1] || '1'),
        rowPixelSpacing: parseFloat(dataSet.string('x00280030')?.split('\\')[0] || '1'),
        invert: photometricInterpretation === 'MONOCHROME1',
        sizeInBytes: pixelData.byteLength,

        // Propiedades requeridas adicionales
        numberOfComponents: samplesPerPixel,
        dataType: bitsAllocated === 16 ? 'Uint16Array' : 'Uint8Array',

        // VOI LUT Function - LINEAR por defecto  
        voiLUTFunction: cornerstone.Enums.VOILUTFunctionType.LINEAR,

        // getCanvas - función opcional para obtener canvas renderizado
        getCanvas: undefined,

        // Agregar metadata adicional si está disponible
        ...(dataSet.string('x00080060') && { modality: dataSet.string('x00080060') }),
    };

    console.log('✅ IImage construido exitosamente:', {
        imageId: image.imageId,
        dimensions: `${image.width}x${image.height}`,
        minPixelValue: image.minPixelValue,
        maxPixelValue: image.maxPixelValue,
        windowCenter: image.windowCenter,
        windowWidth: image.windowWidth,
        sizeInBytes: image.sizeInBytes,
        invert: image.invert
    });

    return image;
}

/**
 * Loader function para Cornerstone que retorna un ImageLoadObject
 */
export function createImageLoadObject(
    imageId: string,
    dataSet: dicomParser.DataSet
): cornerstone.Types.IImageLoadObject {
    const promise = Promise.resolve(createImageFromDataSet(imageId, dataSet));

    return {
        promise,
        cancelFn: undefined,
        decache: () => {
            console.log('🗑️ Decaching image:', imageId);
        }
    };
}
