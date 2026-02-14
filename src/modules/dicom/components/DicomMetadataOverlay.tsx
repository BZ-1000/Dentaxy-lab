import React, { useEffect, useState } from 'react';
import { extractMetadata, DicomMetadata } from '../services/DicomMetadata';
import { PanoramicDetector, DetectionResult } from '../services/PanoramicDetector';
import { ScaleManager } from '../services/ScaleManager';
import { Badge } from '@/components/ui/badge';

interface DicomMetadataOverlayProps {
    imageId: string | null;
}

export const DicomMetadataOverlay: React.FC<DicomMetadataOverlayProps> = ({ imageId }) => {
    const [metadata, setMetadata] = useState<DicomMetadata | null>(null);
    const [detection, setDetection] = useState<DetectionResult | null>(null);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        if (!imageId) {
            setMetadata(null);
            setDetection(null);
            return;
        }

        // Extraer metadatos
        const extractedMetadata = extractMetadata(imageId);
        setMetadata(extractedMetadata);

        // Detectar tipo si hay metadatos
        if (extractedMetadata) {
            const detectionResult = PanoramicDetector.detect(extractedMetadata);
            setDetection(detectionResult);
        }

    }, [imageId]);

    if (!metadata) return null;

    // Información de calibración
    const calibration = ScaleManager.getCalibrationInfo(metadata);
    // Color del badge según confianza
    const getConfidenceBadgeColor = (confidence: number) => {
        if (confidence >= 0.8) return 'bg-green-500/20 text-green-300 border-green-500/30';
        if (confidence >= 0.5) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
        return 'bg-red-500/20 text-red-300 border-red-500/30';
    };

    return (
        <div className={`fixed top-20 right-4 transition-all duration-300 ease-in-out z-50 
            ${isMinimized ? 'w-auto' : 'min-w-[200px]'} 
            bg-black/70 backdrop-blur-md border border-violet-500/20 rounded-lg overflow-hidden flex flex-col shadow-2xl`}
        >
            {/* Header / Toggle */}
            <div
                className="flex items-center justify-between p-2 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Mostrar detalles" : "Minimizar"}
            >
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-violet-300 tracking-wider">
                        {isMinimized ? 'INFO' : 'METADATA'}
                    </span>
                </div>
                {/* Icono de chevron */}
                <svg
                    className={`w-3 h-3 text-white/50 transition-transform duration-300 ${isMinimized ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Contenido Detallado */}
            {!isMinimized && (
                <div className="p-3 pt-0 space-y-3 text-xs font-mono text-violet-300 pointer-events-none">

                    {/* Tipo de imagen detectado */}
                    {detection && detection.type !== 'UNKNOWN' && (
                        <div className="space-y-1 pt-2 border-t border-white/5">
                            <div className="opacity-70 text-[10px] uppercase tracking-wider">Tipo Detectado</div>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant="outline"
                                    className={`${getConfidenceBadgeColor(detection.confidence)} text-[10px] font-bold`}
                                >
                                    {detection.type}
                                </Badge>
                                <span className="text-white/50 text-[10px]">
                                    {(detection.confidence * 100).toFixed(0)}%
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Paciente */}
                    <div className="space-y-1">
                        <div className="opacity-70 text-[10px] uppercase tracking-wider">Paciente</div>
                        <div className="font-bold text-white truncate max-w-[180px]" title={metadata.patientName}>
                            {metadata.patientName}
                        </div>
                        <div className="text-white/50 text-[10px] truncate">
                            ID: {metadata.patientId}
                        </div>
                    </div>

                    {/* Imagen */}
                    <div className="space-y-1">
                        <div className="opacity-70 text-[10px] uppercase tracking-wider">Imagen</div>
                        <div className="text-white">
                            {metadata.columns} × {metadata.rows} px
                        </div>
                        <div className="text-violet-400 text-[10px] truncate">
                            {metadata.modality}
                        </div>
                    </div>

                    {/* Calibración */}
                    {calibration.hasCalibration && (
                        <div className="space-y-1">
                            <div className="opacity-70 text-[10px] uppercase tracking-wider">Escala</div>
                            <div className="text-emerald-300 font-mono">
                                {calibration.scaleText}
                            </div>
                            <div className="text-white/40 text-[10px]">
                                {calibration.source === 'PixelSpacing' ? 'Calibrado' : 'Imager'}
                            </div>
                        </div>
                    )}

                    {!calibration.hasCalibration && (
                        <div className="space-y-1">
                            <div className="opacity-70 text-[10px] uppercase tracking-wider">Escala</div>
                            <div className="text-amber-400/60 text-[10px]">
                                No calibrado
                            </div>
                        </div>
                    )}

                    {/* Fecha */}
                    {metadata.studyDate && (
                        <div className="text-white/40 text-[10px] mt-2 pt-2 border-t border-white/10">
                            {typeof metadata.studyDate === 'string'
                                ? metadata.studyDate
                                : JSON.stringify(metadata.studyDate)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
