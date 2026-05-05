import { DicomMetadata } from './DicomMetadata';

/**
 * Gestor de escalado y mediciones reales en milímetros
 */
export class ScaleManager {
    /**
     * Extrae el espaciado de píxeles de los metadatos DICOM
     * Prioriza PixelSpacing sobre ImagerPixelSpacing
     */
    static getPixelSpacing(metadata: DicomMetadata | null): [number, number] | null {
        if (!metadata) return null;

        // Prioridad 1: PixelSpacing (más preciso)
        if (metadata.pixelSpacing && metadata.pixelSpacing.length === 2) {
            const [row, col] = metadata.pixelSpacing;
            if (row > 0 && col > 0) {
                return [row, col];
            }
        }

        // Prioridad 2: ImagerPixelSpacing (fallback)
        if (metadata.imagerPixelSpacing && metadata.imagerPixelSpacing.length === 2) {
            const [row, col] = metadata.imagerPixelSpacing;
            if (row > 0 && col > 0) {
                return [row, col];
            }
        }

        return null;
    }

    /**
     * Convierte pixels a milímetros usando el pixel spacing
     * @param pixels Distancia en pixels
     * @param pixelSpacing [row spacing, column spacing] en mm/pixel
     * @param isVertical Si true, usa row spacing; si false, usa column spacing
     */
    static pixelsToMM(
        pixels: number,
        pixelSpacing: [number, number],
        isVertical: boolean = false
    ): number {
        const spacing = isVertical ? pixelSpacing[0] : pixelSpacing[1];
        return pixels * spacing;
    }

    /**
     * Convierte milímetros a pixels
     */
    static mmToPixels(
        mm: number,
        pixelSpacing: [number, number],
        isVertical: boolean = false
    ): number {
        const spacing = isVertical ? pixelSpacing[0] : pixelSpacing[1];
        return mm / spacing;
    }

    /**
     * Calcula la distancia en mm entre dos puntos dados sus coordenadas en pixels
     */
    static calculateDistance(
        point1: { x: number; y: number },
        point2: { x: number; y: number },
        pixelSpacing: [number, number]
    ): { pixels: number; mm: number } {
        // Calcular distancia euclidiana en pixels
        const dx = point2.x - point1.x;
        const dy = point2.y - point1.y;
        const distancePixels = Math.sqrt(dx * dx + dy * dy);

        // Convertir a mm usando spacing promedio
        // Para mediciones diagonales, usar promedio de row y column spacing
        const avgSpacing = (pixelSpacing[0] + pixelSpacing[1]) / 2;
        const distanceMM = distancePixels * avgSpacing;

        return {
            pixels: distancePixels,
            mm: distanceMM,
        };
    }

    /**
     * Formatea una medición para display
     */
    static formatMeasurement(value: number, unit: 'mm' | 'px' = 'mm', decimals: number = 2): string {
        if (unit === 'mm') {
            return `${value.toFixed(decimals)} mm`;
        } else {
            return `${Math.round(value)} px`;
        }
    }

    /**
     * Genera texto de escala para overlay
     * Ejemplo: "0.154 mm/px"
     */
    static getScaleText(pixelSpacing: [number, number]): string {
        const avgSpacing = (pixelSpacing[0] + pixelSpacing[1]) / 2;
        return `${avgSpacing.toFixed(3)} mm/px`;
    }

    /**
     * Verifica si la escala está disponible
     */
    static hasValidScale(metadata: DicomMetadata | null): boolean {
        return this.getPixelSpacing(metadata) !== null;
    }

    /**
     * Calcula el área de una región en mm²
     */
    static calculateArea(
        areaPixels: number,
        pixelSpacing: [number, number]
    ): number {
        // Área = pixels² * (mm/px)²
        const avgSpacing = (pixelSpacing[0] + pixelSpacing[1]) / 2;
        return areaPixels * avgSpacing * avgSpacing;
    }

    /**
     * Genera información de calibración para display
     */
    static getCalibrationInfo(metadata: DicomMetadata | null): {
        hasCalibration: boolean;
        source: 'PixelSpacing' | 'ImagerPixelSpacing' | 'None';
        spacing: [number, number] | null;
        scaleText: string;
    } {
        const pixelSpacing = this.getPixelSpacing(metadata);

        if (!pixelSpacing) {
            return {
                hasCalibration: false,
                source: 'None',
                spacing: null,
                scaleText: 'No calibrado',
            };
        }

        // Determinar fuente
        let source: 'PixelSpacing' | 'ImagerPixelSpacing' = 'ImagerPixelSpacing';
        if (metadata?.pixelSpacing && metadata.pixelSpacing.length === 2) {
            const [row, col] = metadata.pixelSpacing;
            if (row > 0 && col > 0) {
                source = 'PixelSpacing';
            }
        }

        return {
            hasCalibration: true,
            source,
            spacing: pixelSpacing,
            scaleText: this.getScaleText(pixelSpacing),
        };
    }

    /**
     * Calcula la escala necesaria para visualizar en tamaño real 1:1
     * 
     * @param pixelSpacing - [row, col] spacing en mm/pixel
     * @param dpi - DPI del monitor (por defecto 96)
     * @returns Factor de zoom para aplicar al viewport
     */
    static calculateRealScale(pixelSpacing: [number, number], dpi: number = 96): number {
        // Fórmula: 
        // 1. Obtener mm por pixel del monitor: 25.4 mm / DPI
        // 2. Obtener mm por pixel de la imagen: pixelSpacing (usamos promedio o row)
        // 3. Scale = (mm_monitor / px) / (mm_imagen / px) ???
        // 
        // Espera, análisis dimensional:
        // Queremos que 1 pixel de imagen ocupe X pixels de pantalla tal que:
        // X * (mm_pantalla/px_pantalla) = 1 * (mm_imagen/px_imagen)
        // 
        // mm_pantalla/px_pantalla = 25.4 / DPI
        // 
        // X * (25.4 / DPI) = PixelSpacing
        // X = PixelSpacing / (25.4 / DPI)
        // X = (PixelSpacing * DPI) / 25.4

        const spacing = (pixelSpacing[0] + pixelSpacing[1]) / 2;
        const scale = (spacing * dpi) / 25.4;

        return scale;
    }
}
