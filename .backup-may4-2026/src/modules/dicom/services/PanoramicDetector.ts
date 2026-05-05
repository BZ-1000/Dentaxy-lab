import { DicomMetadata, calculateAspectRatio } from './DicomMetadata';
import { WINDOW_LEVEL_PRESETS, WindowLevelPreset } from '../utils/presets';

/**
 * Tipos de radiografías dentales detectables
 */
export type RadiographType =
    | 'PANORAMIC'     //  Radiografía panorámica (OPG)
    | 'PERIAPICAL'    // Radiografía periapical
    | 'BITEWING'      // Aleta de mordida
    | 'CEPHALOMETRIC' // Cefalométrica lateral
    | 'CBCT'          // Tomografía volumétrica
    | 'UNKNOWN';      // No identificado

/**
 * Resultado de la detección automática
 */
export interface DetectionResult {
    type: RadiographType;
    confidence: number; // 0-1
    suggestedPreset: WindowLevelPreset;
    reasoning: string[];
}

/**
 * Detector automático del tipo de radiografía dental
 */
export class PanoramicDetector {

    /**
     * Detecta automáticamente el tipo de radiografía basándose en metadatos
     */
    static detect(metadata: DicomMetadata): DetectionResult {
        const reasoning: string[] = [];
        let type: RadiographType = 'UNKNOWN';
        let confidence = 0.3;

        if (!metadata) {
            return {
                type: 'UNKNOWN',
                confidence: 0,
                suggestedPreset: WINDOW_LEVEL_PRESETS.DEFAULT,
                reasoning: ['No hay metadatos disponibles'],
            };
        }

        const aspectRatio = calculateAspectRatio(metadata);
        const { modality, studyDescription, seriesDescription, bodyPartExamined } = metadata;

        // Combine descriptions for analysis
        const combinedDescription = `${studyDescription} ${seriesDescription} ${bodyPartExamined}`.toUpperCase();

        // DETECCIÓN: PANORÁMICA
        if (aspectRatio > 2.5) {
            reasoning.push(`Aspect ratio muy ancho: ${aspectRatio.toFixed(2)}`);
            type = 'PANORAMIC';
            confidence += 0.4;
        }

        if (combinedDescription.includes('PAN') ||
            combinedDescription.includes('PANORAMIC') ||
            combinedDescription.includes('OPG') ||
            combinedDescription.includes('ORTHOPANTOMOGRAM')) {
            reasoning.push('Descripción contiene "PANORAMIC" o "PAN"');
            type = 'PANORAMIC';
            confidence += 0.3;
        }

        if (metadata.columns > 2000 && aspectRatio > 2.0) {
            reasoning.push(`Resolución horizontal muy amplia: ${metadata.columns} px`);
            type = 'PANORAMIC';
            confidence += 0.2;
        }

        // DETECCIÓN: PERIAPICAL
        if (aspectRatio >= 0.8 && aspectRatio <= 1.3 &&
            metadata.rows < 1500 && metadata.columns < 1500) {
            reasoning.push('Dimensiones cuadradas pequeñas');
            type = 'PERIAPICAL';
            confidence = 0.6;
        }

        if (combinedDescription.includes('PERIAPICAL') ||
            combinedDescription.includes('PA')) {
            reasoning.push('Descripción contiene "PERIAPICAL"');
            type = 'PERIAPICAL';
            confidence += 0.3;
        }

        // DETECCIÓN: BITEWING
        if (aspectRatio >= 1.2 && aspectRatio <= 1.8 &&
            metadata.rows < 1200) {
            reasoning.push('Aspect ratio horizontal moderado');
            type = 'BITEWING';
            confidence = 0.5;
        }

        if (combinedDescription.includes('BITEWING') ||
            combinedDescription.includes('BW')) {
            reasoning.push('Descripción contiene "BITEWING"');
            type = 'BITEWING';
            confidence += 0.3;
        }

        // DETECCIÓN: CEFALOMÉTRICA
        if (aspectRatio >= 0.7 && aspectRatio <= 1.0 &&
            metadata.rows > 1500 && metadata.columns > 1200) {
            reasoning.push('Dimensiones grandes, aspect ratio vertical');
            type = 'CEPHALOMETRIC';
            confidence = 0.6;
        }

        if (combinedDescription.includes('CEPH') ||
            combinedDescription.includes('LATERAL')) {
            reasoning.push('Descripción contiene "CEPH" o "LATERAL"');
            type = 'CEPHALOMETRIC';
            confidence += 0.3;
        }

        // DETECCIÓN: CBCT
        if (modality === 'CT' || combinedDescription.includes('CBCT') ||
            combinedDescription.includes('CONE BEAM')) {
            reasoning.push('Modalidad CT o descripción contiene "CBCT"');
            type = 'CBCT';
            confidence = 0.9;
        }

        // Cap confidence
        confidence = Math.min(confidence, 1.0);

        // Select appropriate preset
        const suggestedPreset = this.selectPreset(type);

        console.log('🔍 Detección automática:', {
            type,
            confidence: `${(confidence * 100).toFixed(0)}% `,
            aspectRatio: aspectRatio.toFixed(2),
            dimensions: `${metadata.columns}x${metadata.rows} `,
            reasoning,
        });

        return {
            type,
            confidence,
            suggestedPreset,
            reasoning,
        };
    }

    /**
     * Selecciona el preset W/L apropiado según el tipo
     */
    private static selectPreset(type: RadiographType): WindowLevelPreset {
        switch (type) {
            case 'PANORAMIC':
                return WINDOW_LEVEL_PRESETS.BONE;
            case 'PERIAPICAL':
            case 'BITEWING':
                return WINDOW_LEVEL_PRESETS.TEETH;
            case 'CEPHALOMETRIC':
                return WINDOW_LEVEL_PRESETS.SOFT_TISSUE;
            case 'CBCT':
                return WINDOW_LEVEL_PRESETS.BONE;
            default:
                return WINDOW_LEVEL_PRESETS.DEFAULT;
        }
    }
}
