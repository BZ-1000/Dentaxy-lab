import { DicomMetadata } from '../services/DicomMetadata';
import { ScaleManager } from '../services/ScaleManager';

/**
 * Convierte pixels a milímetros
 */
export function pixelsToMM(
    pixels: number,
    metadata: DicomMetadata | null,
    isVertical: boolean = false
): number | null {
    const spacing = ScaleManager.getPixelSpacing(metadata);
    if (!spacing) return null;

    return ScaleManager.pixelsToMM(pixels, spacing, isVertical);
}

/**
 * Formatea una medición para display
 */
export function formatMeasurement(
    value: number,
    unit: 'mm' | 'px' = 'mm',
    decimals: number = 2
): string {
    return ScaleManager.formatMeasurement(value, unit, decimals);
}

/**
 * Obtiene el color para una herramienta de medición
 */
export function getMeasurementColor(toolName: string): string {
    const colors: Record<string, string> = {
        'Length': '#8b5cf6', // violet-500
        'Angle': '#06b6d4', // cyan-500
        'RectangleROI': '#10b981', // emerald-500
        'EllipticalROI': '#f59e0b', // amber-500
        'Bidirectional': '#ec4899', // pink-500
        'Probe': '#6366f1', // indigo-500
    };

    return colors[toolName] || '#8b5cf6';
}

/**
 * Formatea un valor de medición con su unidad apropiada
 */
export function formatMeasurementWithUnit(
    valueInPixels: number,
    metadata: DicomMetadata | null,
    isArea: boolean = false
): string {
    const spacing = ScaleManager.getPixelSpacing(metadata);

    if (!spacing) {
        // Sin calibración, mostrar solo pixels
        if (isArea) {
            return `${Math.round(valueInPixels)} px²`;
        }
        return `${Math.round(valueInPixels)} px`;
    }

    if (isArea) {
        const areaMM = ScaleManager.calculateArea(valueInPixels, spacing);
        return `${areaMM.toFixed(2)} mm²`;
    }

    const valueMM = ScaleManager.pixelsToMM(valueInPixels, spacing);
    return `${valueMM.toFixed(2)} mm`;
}

/**
 * Calcula estadísticas de una ROI
 */
export interface ROIStats {
    mean: number;
    std: number;
    min: number;
    max: number;
    area: string; // Ya formateado
}

export function formatROIStats(stats: ROIStats): string[] {
    return [
        `Media: ${stats.mean.toFixed(1)}`,
        `Desv: ${stats.std.toFixed(1)}`,
        `Min: ${stats.min.toFixed(1)}`,
        `Max: ${stats.max.toFixed(1)}`,
        `Área: ${stats.area}`,
    ];
}
