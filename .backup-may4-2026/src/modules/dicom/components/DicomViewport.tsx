import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    RenderingEngine,
    Enums,
    type Types,
    getRenderingEngine,
    cache,
} from '@cornerstonejs/core';
import {
    ToolGroupManager,
    addTool,
} from '@cornerstonejs/tools';
import { initCornerstone, initToolGroup } from '../services/cornerstone';
import { DicomLoader } from '../services/DicomLoader';
import { PanoramicDetector } from '../services/PanoramicDetector';
import { ViewportManager } from '../services/ViewportManager';
import { DicomMetadata, extractMetadata } from '../services/DicomMetadata';
import { Loader2, Upload } from 'lucide-react';
import { ToolRegistry, ToolNames } from '../viewer/ToolRegistry';
import { ToolController } from '../viewer/ToolController';

const { ViewportType } = Enums;

interface DicomViewportProps {
    toolGroupId: string;
    imageId?: string;
    onImageLoaded?: (imageId: string) => void;
    onMetadataExtracted?: (metadata: any) => void;
}

export const DicomViewport: React.FC<DicomViewportProps> = ({
    toolGroupId,
    imageId: externalImageId,
    onImageLoaded,
    onMetadataExtracted,
}) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const renderingEngineId = 'myRenderingEngine';
    const viewportId = 'DICOM_STACK';
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentImageId, setCurrentImageId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState<number | null>(null);

    useEffect(() => {
        const setup = async () => {
            if (!elementRef.current) return;
            try {
                await initCornerstone();
                let renderingEngine = getRenderingEngine(renderingEngineId);
                if (!renderingEngine) {
                    renderingEngine = new RenderingEngine(renderingEngineId);
                }
                const viewportInput = {
                    viewportId: viewportId,
                    type: ViewportType.STACK,
                    element: elementRef.current,
                    defaultOptions: {
                        background: [0, 0, 0] as Types.Point3,
                    },
                };
                renderingEngine.enableElement(viewportInput);

                // Initialize ToolGroup
                let toolGroup = ToolGroupManager.getToolGroup(toolGroupId);
                if (!toolGroup) {
                    toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
                }

                // Register Tools from Registry
                Object.values(ToolRegistry).forEach((ToolClass) => {
                    addTool(ToolClass);
                });

                // Add Tools to ToolGroup
                Object.keys(ToolRegistry).forEach((toolName) => {
                    toolGroup?.addTool(toolName);
                });

                toolGroup?.addViewport(viewportId, renderingEngineId);

                // Initialize Controller
                ToolController.initialize(toolGroupId, renderingEngineId, viewportId);

                setIsInitialized(true);
            } catch (error) {
                console.error('❌ Error en setup del viewport:', error);
                setError('Error al inicializar el visualizador');
            }
        };
        setup();
        return () => {
            try {
                const renderingEngine = getRenderingEngine(renderingEngineId);
                if (renderingEngine) {
                    try {
                        const viewport = renderingEngine.getViewport(viewportId);
                        if (viewport) renderingEngine.disableElement(viewportId);
                    } catch (e) { /* ignore */ }
                }
                const toolGroup = ToolGroupManager.getToolGroup(toolGroupId);
                if (toolGroup) {
                    toolGroup.removeViewports(renderingEngineId, viewportId);
                }
            } catch (error) {
                console.warn('Advertencia durante cleanup:', error);
            }
        };
    }, []);

    useEffect(() => {
        if (isInitialized && externalImageId && externalImageId !== currentImageId) {
            loadDicomImage(externalImageId);
        }
    }, [isInitialized, externalImageId]);

    useEffect(() => {
        if (currentImageId && isInitialized) {
            const metadata = extractMetadata(currentImageId);
            if (metadata && metadata.columns && metadata.rows) {
                const ar = metadata.columns / metadata.rows;
                setAspectRatio(ar);
                setTimeout(() => {
                    const renderingEngine = getRenderingEngine(renderingEngineId);
                    if (renderingEngine) renderingEngine.resize(true, false);
                }, 100);
            }
        }
    }, [currentImageId, isInitialized]);

    const loadDicomImage = async (imageId: string) => {
        if (!isInitialized) return;
        try {
            setIsLoading(true);
            setError(null);
            const renderingEngine = getRenderingEngine(renderingEngineId);
            if (!renderingEngine) throw new Error('RenderingEngine no encontrado');
            const viewport = renderingEngine.getViewport(viewportId) as Types.IStackViewport;
            if (!viewport) throw new Error('Viewport no encontrado');
            const imageLoadObject = cache.getImageLoadObject(imageId);
            if (!imageLoadObject) {
                throw new Error('Imagen no encontrada en cache.');
            }
            await viewport.setStack([imageId], 0);

            // 1. Resetear cámara para centrar y ajustar zoom (fit)
            viewport.resetCamera();
            viewport.render();

            setCurrentImageId(imageId);
            setIsLoading(false);
            if (onImageLoaded && currentImageId !== imageId) {
                onImageLoaded(imageId);
            }

            // 2. Aplicar configuración automática (puede cambiar zoom/pan)
            await applyAutoConfiguration(viewport, imageId);

            // 3. Alinear a la izquierda (AL FINAL, para corregir cualquier centrado previo)
            alignImageLeft(viewport, imageId);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error desconocido');
            setIsLoading(false);
        }
    };

    const alignImageLeft = (viewport: Types.IStackViewport, imageId: string) => {
        // Ejecutar con un pequeño retardo para asegurar que Cornerstone haya terminado su renderizado inicial
        setTimeout(() => {
            try {
                const imageData = viewport.getImageData();
                if (!imageData) return;

                // Forzar un desplazamiento visible hacia la izquierda
                // En lugar de cálculos complejos que pueden fallar por coordenadas world/canvas no actualizadas,
                // vamos a desplazar un porcentaje fijo del ancho del canvas.

                const canvas = viewport.canvas;
                const width = canvas.width;

                // Desplazar 20% del ancho hacia la izquierda
                // Pan negativo en X mueve la imagen a la IZQUIERDA (o mueve la cámara a la derecha, depende de la API)
                // En Cornerstone 3D, setPan([x, y]) establece el punto central.
                // Usaremos getPan() + delta.

                const currentPan = viewport.getPan();

                // Si la imagen está centrada (pan [0,0]), y queremos moverla a la izquierda...
                // Necesitamos restar a X.

                // Calculamos un offset significativo
                const offsetPixels = width * 0.20;

                console.log('🔄 Aplicando alineación izquierda forzada. Offset:', offsetPixels);

                // Aplicar nuevo pan
                viewport.setPan([
                    currentPan[0] - offsetPixels,
                    currentPan[1]
                ]);

                viewport.render();

            } catch (e) {
                console.warn("Error al alinear imagen:", e);
            }
        }, 100); // 100ms de retardo
    };

    const applyAutoConfiguration = async (viewport: Types.IStackViewport, imageId: string) => {
        try {
            const metadata = await import('../services/DicomMetadata').then(m => m.extractMetadata(imageId));
            if (!metadata) return;
            if (onMetadataExtracted) onMetadataExtracted(metadata);
            const detection = PanoramicDetector.detect(metadata);
            ViewportManager.applyAutoConfiguration(viewport, detection, metadata);
        } catch (error) {
            console.warn('⚠️ Error en auto-configuración:', error);
        }
    };

    const handleFileDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        if (files.length === 0) return;
        await handleFileLoad(files[0]);
    };

    const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        await handleFileLoad(files[0]);
    };

    const handleFileLoad = async (file: File) => {
        setIsLoading(true);
        setError(null);
        try {
            if (!file.name.toLowerCase().endsWith('.dcm') && file.type !== 'application/dicom') {
                throw new Error('El archivo debe ser formato DICOM (.dcm)');
            }
            const result = await DicomLoader.loadFile(file);
            if (!result.success) throw new Error(result.error || 'Error cargando archivo DICOM');
            await loadDicomImage(result.imageId);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error cargando archivo DICOM');
            setIsLoading(false);
        }
    };

    const getClampedPan = useCallback((viewport: Types.IStackViewport, proposedPan?: Types.Point2): Types.Point2 | null => {
        // HARD LOCK: No permitir ningún pan/movimiento.
        // La imagen debe estar "justificada" y fija.
        return [0, 0];
    }, []);

    useEffect(() => {
        if (!isInitialized || !elementRef.current) return;
        const handleCameraModified = (evt: any) => {
            const { viewportId: modifiedViewportId } = evt.detail;
            if (modifiedViewportId !== viewportId) return;
            const renderingEngine = getRenderingEngine(renderingEngineId);
            if (!renderingEngine) return;
            const viewport = renderingEngine.getViewport(viewportId) as Types.IStackViewport;
            if (!viewport) return;
            const currentPan = viewport.getPan();
            const clampedPan = getClampedPan(viewport, currentPan);
            if (clampedPan) {
                if (Math.abs(clampedPan[0] - currentPan[0]) > 0.001 ||
                    Math.abs(clampedPan[1] - currentPan[1]) > 0.001) {
                    // @ts-ignore
                    viewport.setPan(clampedPan);
                    viewport.render();
                }
            }
        };
        const element = elementRef.current;
        element.addEventListener(Enums.Events.CAMERA_MODIFIED, handleCameraModified);
        return () => {
            element.removeEventListener(Enums.Events.CAMERA_MODIFIED, handleCameraModified);
        };
    }, [isInitialized, currentImageId, getClampedPan]);

    const handleWheel = (e: React.WheelEvent) => {
        // DESACTIVADO TOTALMENTE EL ZOOM/SCROLL
        // El usuario pidió que la imagen quede FIJA y JUSTIFICADA.
        // No debe moverse ni hacerse zoom con la rueda del ratón.
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div
            ref={containerRef}
            className="w-full h-full relative bg-black flex justify-center items-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onWheel={handleWheel}
        >
            <div
                ref={elementRef}
                className="w-full h-full"
                // Importante: Eliminar aspect-ratio forzado en el contenedor padre div
                // Cornerstone manejará el canvas internamente.
                // Solo aseguramos que el div ocupe todo el espacio disponible.
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'block'
                }}
                onContextMenu={(e) => e.preventDefault()}
            />

            {!currentImageId && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 p-4">
                    <div className="w-full max-w-lg bg-zinc-900/80 backdrop-blur-xl border border-violet-500/20 rounded-2xl p-8 text-center shadow-2xl transition-all duration-300 group hover:border-violet-500/50 hover:bg-zinc-900/90 pointer-events-auto">
                        <div className="flex justify-center mb-6 relative">
                            <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full animate-pulse" />
                            <div className="relative bg-zinc-950 p-4 rounded-full border border-violet-500/30 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Upload className="w-8 h-8 text-violet-400" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                            Visor DICOM <span className="text-violet-400">Pro</span>
                        </h3>
                        <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                            Arrastra y suelta tus estudios .dcm aquí.
                        </p>
                        <label className="block w-full">
                            <input
                                type="file"
                                accept=".dcm,application/dicom"
                                onChange={handleFileInputChange}
                                className="hidden"
                            />
                            <div className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium rounded-xl cursor-pointer transition-all shadow-lg hover:shadow-violet-500/25 flex items-center justify-center gap-2 group-hover:tracking-wide">
                                <Upload className="w-4 h-4" />
                                <span>Seleccionar Archivo</span>
                            </div>
                        </label>
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
                    </div>
                </div>
            )}

            {error && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg text-sm max-w-md shadow-lg border border-red-400/50 z-50">
                    <div className="font-semibold mb-1">Error de carga</div>
                    <div className="text-xs text-red-100">{error}</div>
                    <button onClick={() => setError(null)} className="mt-2 text-xs underline">Cerrar</button>
                </div>
            )}
        </div>
    );
};
