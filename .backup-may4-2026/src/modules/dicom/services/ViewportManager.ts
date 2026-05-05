import { RenderingEngine, Types, Enums } from '@cornerstonejs/core';
import { ToolGroupManager } from '@cornerstonejs/tools';
import { DicomMetadata } from './DicomMetadata';
import { DetectionResult, RadiographType } from './PanoramicDetector';
import { WindowLevelPreset } from '../utils/presets';

/**
 * Configuración automática del viewport según el tipo de radiografía
 */
interface ViewportConfig {
    initialZoom?: number;
    initialPan?: { x: number; y: number };
    windowLevel?: { windowWidth: number; windowCenter: number }; // Ahora es opcional
    invert?: boolean;
}

/**
 * Gestor inteligente del Viewport de Cornerstone
 * Auto-configura el viewport según el tipo de imagen detectada
 */
export class ViewportManager {

    /**
     * Aplica configuración automática al viewport basándose en la detección
     */
    static applyAutoConfiguration(
        viewport: Types.IStackViewport,
        detection: DetectionResult,
        metadata: DicomMetadata | null
    ): void {
        const config = this.getConfigForType(detection.type, metadata);

        console.log('⚙️ Aplicando auto-configuración:', {
            type: detection.type,
            confidence: `${(detection.confidence * 100).toFixed(0)}%`,
            config,
        });

        // Aplicar Window/Level SOLO si está definido en la config
        if (config.windowLevel) {
            viewport.setProperties({
                voiRange: {
                    lower: config.windowLevel.windowCenter - config.windowLevel.windowWidth / 2,
                    upper: config.windowLevel.windowCenter + config.windowLevel.windowWidth / 2,
                },
            });
        }

        // Aplicar inversión si es necesario
        if (config.invert !== undefined) {
            viewport.setProperties({ invert: config.invert });
        }

        // Aplicar zoom inicial
        if (config.initialZoom) {
            const currentCamera = viewport.getCamera();
            viewport.setCamera({
                ...currentCamera,
                parallelScale: currentCamera.parallelScale / config.initialZoom,
            });
        }

        // Renderizar
        viewport.render();
    }

    /**
     * Obtiene configuración según el tipo de radiografía
     */
    private static getConfigForType(
        type: RadiographType,
        metadata: DicomMetadata | null
    ): ViewportConfig {
        const baseWL = metadata ? {
            windowWidth: typeof metadata.windowWidth === 'number' ? metadata.windowWidth : 400,
            windowCenter: typeof metadata.windowCenter === 'number' ? metadata.windowCenter : 40,
        } : { windowWidth: 400, windowCenter: 40 };

        switch (type) {
            case 'PANORAMIC':
                return {
                    initialZoom: 1.0, // Full fit
                    windowLevel: { windowWidth: 2000, windowCenter: 300 }, // Preset óseo
                    invert: false,
                };

            case 'PERIAPICAL':
                return {
                    initialZoom: 1.0, // Escala 1:1
                    windowLevel: { windowWidth: 1500, windowCenter: 250 }, // Preset dental
                    invert: false,
                };

            case 'BITEWING':
                return {
                    initialZoom: 1.0,
                    windowLevel: { windowWidth: 1500, windowCenter: 200 },
                    invert: false,
                };

            case 'CEPHALOMETRIC':
                return {
                    initialZoom: 0.7,
                    windowLevel: { windowWidth: 350, windowCenter: 40 }, // Tejido blando
                    invert: false,
                };

            case 'CBCT':
                return {
                    initialZoom: 1.0,
                    windowLevel: { windowWidth: 2000, windowCenter: 400 },
                    invert: false,
                };

            default:
                // Si el tipo es desconocido, ser conservador:
                // Solo aplicar Window/Level si la metadata tiene valores explícitos diferentes al default (400/40)
                // De lo contrario, dejar que Cornerstone use el W/L calculado por el Decoder (que es robusto)
                const hasExplicitWL = metadata &&
                    (metadata.windowWidth !== 400 || metadata.windowCenter !== 40);

                return {
                    initialZoom: 1.0,
                    windowLevel: hasExplicitWL ? baseWL : undefined,
                    invert: false,
                };
        }
    }

    /**
     * Centra la imagen en el viewport
     */
    static centerImage(viewport: Types.IStackViewport): void {
        viewport.resetCamera();
        viewport.render();
    }

    /**
     * Aplica preset de Window/Level
     */
    static applyPreset(viewport: Types.IStackViewport, preset: WindowLevelPreset): void {
        if (preset.windowWidth && preset.windowCenter) {
            viewport.setProperties({
                voiRange: {
                    lower: preset.windowCenter - preset.windowWidth / 2,
                    upper: preset.windowCenter + preset.windowWidth / 2,
                },
            });
            viewport.render();
        }
    }
}
