import React from 'react';
import { useToolState } from './ToolState';

interface MetadataPanelProps {
    metadata: any;
}

export const MetadataPanel: React.FC<MetadataPanelProps> = ({ metadata }) => {
    if (!metadata) return (
        <div className="p-4 text-zinc-500 text-sm">
            No image loaded
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Patient Section */}
            <div className="space-y-1">
                <h3 className="text-[10px] font-bold text-violet-400 tracking-wider uppercase opacity-70 mb-1">
                    Paciente
                </h3>
                <p className="text-sm font-medium text-white tracking-wide">
                    {metadata.patientName || 'ANONYMOUS'}
                </p>
                <p className="text-xs text-zinc-500 font-mono">
                    ID: {metadata.patientId || 'UNKNOWN'}
                </p>
            </div>

            {/* Image Info */}
            <div className="space-y-1">
                <h3 className="text-[10px] font-bold text-violet-400 tracking-wider uppercase opacity-70 mb-1">
                    Imagen
                </h3>
                <p className="text-xs text-zinc-300 font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500/50"></span>
                    {metadata.columns} × {metadata.rows} px
                </p>
                <p className="text-xs text-zinc-500 font-mono">
                    Modality: {metadata.modality || 'DX'}
                </p>
                <p className="text-xs text-zinc-500 font-mono">
                    Date: {metadata.studyDate || 'N/A'}
                </p>
            </div>

            {/* Scale Info */}
            <div className="space-y-1 pt-2 border-t border-white/10">
                <h3 className="text-[10px] font-bold text-violet-400 tracking-wider uppercase opacity-70 mb-1">
                    Escala
                </h3>
                <p className="text-xl font-mono text-emerald-400 tracking-tight">
                    {metadata.pixelSpacing ? (
                        <>
                            {(metadata.pixelSpacing[0]).toFixed(3)} <span className="text-xs text-emerald-500/60 ml-px">mm/px</span>
                        </>
                    ) : (
                        <span className="text-yellow-500/80 text-xs">Uncalibrated</span>
                    )}
                </p>
                <p className="text-[10px] text-zinc-500">
                    {metadata.pixelSpacing ? 'Calibrado' : 'Pixel Spacing Unknown'}
                </p>
            </div>
        </div>
    );
};
