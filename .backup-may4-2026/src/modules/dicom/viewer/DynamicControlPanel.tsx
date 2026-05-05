import React, { useEffect, useState } from 'react';
import { useToolState } from './ToolState';
import { ToolNames } from './ToolRegistry';
import { MetadataPanel } from './MetadataPanel';
import { DicomMetadata, extractMetadata } from '../services/DicomMetadata';
import {
    Sliders, Search, Move, Ruler, Crop,
    MousePointer2, Activity, Info,
    ScanLine, Calculator
} from 'lucide-react';
import { ViewportController } from './ViewportController';

// --- Sub-components (internal for now) ---

const WindowLevelPanel = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
        <div className="bg-zinc-800/50 p-3 rounded-lg border border-white/5">
            <label className="text-xs text-zinc-400 block mb-2 font-medium">Window Width</label>
            <input
                type="range"
                className="w-full h-1.5 bg-zinc-700 rounded-full appearance-none accent-violet-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
                <span>Soft</span>
                <span>Hard</span>
            </div>
        </div>
        <div className="bg-zinc-800/50 p-3 rounded-lg border border-white/5">
            <label className="text-xs text-zinc-400 block mb-2 font-medium">Window Level</label>
            <input
                type="range"
                className="w-full h-1.5 bg-zinc-700 rounded-full appearance-none accent-violet-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
                <span>Dark</span>
                <span>Bright</span>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
            {['Default', 'Bone', 'Dental', 'Soft Tissue'].map(preset => (
                <button key={preset} className="px-2 py-1.5 bg-zinc-900/50 hover:bg-zinc-800 text-[10px] text-zinc-300 rounded border border-white/5 transition-colors uppercase tracking-wider">
                    {preset}
                </button>
            ))}
        </div>
        <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-xs text-white rounded border border-white/10 transition-colors">
            Reset to Default
        </button>
    </div>
);

const ZoomPanel = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
        <div className="bg-zinc-800/50 p-4 rounded-lg border border-white/5">
            <div className="flex justify-between items-center mb-3">
                <label className="text-xs text-zinc-400 font-medium">Zoom Level</label>
                <span className="text-xs font-mono text-violet-400">100%</span>
            </div>
            <input
                type="range"
                min="0.25"
                max="8"
                step="0.1"
                defaultValue="1"
                className="w-full h-1.5 bg-zinc-700 rounded-full appearance-none accent-violet-500 cursor-pointer"
                onChange={(e) => ViewportController.setZoom(parseFloat(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-2 font-mono">
                <span>25%</span>
                <span>800%</span>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
            <button onClick={() => ViewportController.fitToScreen()} className="flex flex-col items-center justify-center gap-1 p-3 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 rounded border border-white/5 transition-colors group">
                <ScanLine className="w-4 h-4 text-zinc-500 group-hover:text-violet-400 transition-colors" />
                <span className="text-[10px] uppercase tracking-wider">Fit Screen</span>
            </button>
            <button onClick={() => ViewportController.setZoom(1)} className="flex flex-col items-center justify-center gap-1 p-3 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 rounded border border-white/5 transition-colors group">
                <Search className="w-4 h-4 text-zinc-500 group-hover:text-violet-400 transition-colors" />
                <span className="text-[10px] uppercase tracking-wider">Real Size 1:1</span>
            </button>
        </div>
    </div>
);

const MeasurementPanel = ({ type }: { type: string }) => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
        <div className="bg-zinc-900/30 p-4 rounded-lg border border-dashed border-zinc-700/50 text-center">
            <p className="text-xs text-zinc-500 mb-2">No active measurements</p>
            <p className="text-[10px] text-zinc-600">
                Click and drag on the image to create a {type} measurement
            </p>
        </div>
        <div className="flex justify-end">
            <button className="px-3 py-1.5 text-[10px] text-red-400 hover:text-red-300 transition-colors">
                Delete All
            </button>
        </div>
    </div>
);

const Header = ({ icon: Icon, title, subtitle }: { icon: any, title: string, subtitle: string }) => (
    <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
        <div className="p-2.5 bg-violet-500/10 rounded-xl text-violet-400 ring-1 ring-violet-500/20 shadow-[0_0_15px_-3px_rgba(139,92,246,0.2)]">
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <h2 className="text-sm font-bold text-white tracking-wide">{title}</h2>
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium">{subtitle}</p>
        </div>
    </div>
);

export const DynamicControlPanel: React.FC<{ imageId: string | null }> = ({ imageId }) => {
    const activeTool = useToolState((state) => state.activeTool);
    const [metadata, setMetadata] = useState<any>(null);

    useEffect(() => {
        if (imageId) {
            import('../services/DicomMetadata').then(module => {
                const data = module.extractMetadata(imageId);
                setMetadata(data);
            });
        }
    }, [imageId]);

    const renderContent = () => {
        // Map active tool to corresponding panel content
        switch (activeTool) {
            case ToolNames.WindowLevel:
                return (
                    <>
                        <Header icon={Sliders} title="Window / Level" subtitle="Contrast & Brightness" />
                        <WindowLevelPanel />
                    </>
                );
            case ToolNames.Zoom:
                return (
                    <>
                        <Header icon={Search} title="Zoom Control" subtitle="Magnification & Scale" />
                        <ZoomPanel />
                    </>
                );
            case ToolNames.Pan:
                return (
                    <>
                        <Header icon={Move} title="Pan Tool" subtitle="Position Adjustment" />
                        <div className="bg-zinc-800/30 p-4 rounded-lg border border-white/5 text-center animate-in fade-in">
                            <p className="text-xs text-zinc-400">Drag image to adjust position</p>
                            <button
                                onClick={() => ViewportController.reset()}
                                className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs text-white rounded border border-white/10 transition-colors"
                            >
                                Reset Position
                            </button>
                        </div>
                    </>
                );
            case ToolNames.Length:
                return (
                    <>
                        <Header icon={Ruler} title="Linear Measure" subtitle="Distance in mm" />
                        <MeasurementPanel type="linear" />
                    </>
                );
            case ToolNames.Angle:
                return (
                    <>
                        <Header icon={ScanLine} title="Angle" subtitle="Angular Measurement" />
                        <MeasurementPanel type="angle" />
                    </>
                );
            case ToolNames.RectangleROI:
            case ToolNames.CircleROI:
                return (
                    <>
                        <Header icon={Crop} title="ROI Analysis" subtitle="Area & Statistics" />
                        <MeasurementPanel type="ROI" />
                    </>
                );
            case ToolNames.Probe:
                return (
                    <>
                        <Header icon={Activity} title="Pixel Probe" subtitle="Point Intensity" />
                        <div className="bg-zinc-800/30 p-4 rounded-lg border border-white/5 text-center">
                            <p className="text-xs text-zinc-400">Click to sample pixel value</p>
                        </div>
                    </>
                );
            case ToolNames.RealSize:
                return (
                    <>
                        <Header icon={Calculator} title="Real Size" subtitle="1:1 Calibration" />
                        <div className="bg-zinc-800/30 p-4 rounded-lg border border-white/5 text-center">
                            <p className="text-xs text-zinc-400">Calibrating display...</p>
                        </div>
                    </>
                );

            default:
                // Default fallback: Metadata
                return (
                    <>
                        <Header icon={Info} title="Patient Data" subtitle="DICOM Metadata" />
                        <MetadataPanel metadata={metadata} />
                    </>
                );
        }
    };

    if (!imageId) return null;

    return (
        <div className="absolute right-4 top-20 w-80 pointer-events-none flex flex-col items-end z-50">
            <div className="bg-zinc-950/90 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl pointer-events-auto transition-all duration-300 min-h-[320px] w-full animate-in fade-in slide-in-from-right-4 ring-1 ring-white/5">
                {renderContent()}
            </div>
        </div>
    );
};
