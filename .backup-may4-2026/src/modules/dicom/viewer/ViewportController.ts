import { ToolController } from './ToolController';
import { Types } from '@cornerstonejs/core';
import { useToolState } from './ToolState';
import { ScaleManager } from '../services/ScaleManager';
import { extractMetadata } from '../services/DicomMetadata';

class ViewportControllerService {

    setZoom(scale: number) {
        const viewport = ToolController.getViewport();
        if (!viewport) return;

        viewport.setZoom(scale);
        viewport.render();

        // Sync state
        useToolState.getState().setViewportProperties({ zoom: scale });
    }

    setWindowLevel(windowWidth: number, windowCenter: number) {
        const viewport = ToolController.getViewport();
        if (!viewport) return;

        viewport.setProperties({
            voiRange: {
                lower: windowCenter - windowWidth / 2,
                upper: windowCenter + windowWidth / 2,
            }
        });
        viewport.render();

        useToolState.getState().setViewportProperties({
            voi: { windowWidth, windowCenter }
        });
    }

    toggleInvert() {
        const viewport = ToolController.getViewport();
        if (!viewport) return;

        const { invert } = useToolState.getState().viewportProperties;
        const newInvert = !invert;

        viewport.setProperties({ invert: newInvert });
        viewport.render();

        useToolState.getState().setViewportProperties({ invert: newInvert });
    }

    reset() {
        const viewport = ToolController.getViewport();
        if (!viewport) return;

        viewport.resetCamera();
        viewport.render();

        // Reset state would need to re-read from viewport or defaults
        useToolState.getState().resetViewportProperties();
    }

    fitToScreen() {
        // Reset is essentially fit to screen in Cornerstone StackViewport
        this.reset();
    }

    setRealSize() {
        const viewport = ToolController.getViewport();
        if (!viewport) return;

        const imageId = viewport.getCurrentImageId();
        if (!imageId) return;

        const metadata = extractMetadata(imageId);
        const pixelSpacing = ScaleManager.getPixelSpacing(metadata);

        if (pixelSpacing) {
            const dpi = 96 * (window.devicePixelRatio || 1);
            const scale = ScaleManager.calculateRealScale(pixelSpacing, dpi);
            this.setZoom(scale);
        } else {
            console.warn('Cannot set real size: Pixel Spacing missing');
            // Fallback to 1.0 (uncalibrated 1:1 pixel)
            this.setZoom(1);
        }
    }

    setColormap(colormapName: string) {
        const viewport = ToolController.getViewport();
        if (!viewport) return;

        viewport.setProperties({ colormap: { name: colormapName } });
        viewport.render();
    }
}

export const ViewportController = new ViewportControllerService();
