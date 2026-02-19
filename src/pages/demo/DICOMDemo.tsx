import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { DicomViewport } from '@/modules/dicom/components/DicomViewport';
import { DicomToolbar } from '@/modules/dicom/components/DicomToolbar';
import { DynamicControlPanel } from '@/modules/dicom/viewer/DynamicControlPanel';
import { DicomErrorBoundary } from '@/modules/dicom/components/DicomErrorBoundary';
import { StudyList } from '@/modules/dicom/components/StudyList';
import { ToolGroupManager, Enums as csToolsEnums } from '@cornerstonejs/tools';
import { initCornerstone } from '@/modules/dicom/services/cornerstone';
import { useDemoGuard } from '@/hooks/useDemoGuard';

/**
 * Demo DICOM - Visualización Médica (v1)
 * 
 * Implementación modular de CornerstoneJS.
 * Protegido por useDemoGuard: verifica token de sesión o libre acceso en Supabase.
 */
import { ToolController } from '@/modules/dicom/viewer/ToolController';
import { useToolState } from '@/modules/dicom/viewer/ToolState';
import { ToolNames } from '@/modules/dicom/viewer/ToolRegistry';

// ... imports ...

export const DICOMDemo: React.FC = () => {
    const navigate = useNavigate();
    const { isAllowed, isLoading: isGuardLoading, isFreeAccess, accessMessage } = useDemoGuard('dicom');
    const toolGroupId = 'myToolGroup';
    const { activeTool, setActiveTool } = useToolState(); // Use global state
    const [loadedImageId, setLoadedImageId] = useState<string | null>(null);

    const [view, setView] = useState<'list' | 'viewer'>('list');
    const [selectedStudy, setSelectedStudy] = useState<any>(null);

    // Mostrar spinner mientras verifica acceso
    if (isGuardLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
            </div>
        );
    }

    // Si no tiene acceso, useDemoGuard ya redirigió — no renderizar nada
    if (!isAllowed) return null;

    // Initial setup handled by DicomViewport, but we can set default tool here if needed
    // or rely on default state in ToolState

    // Cambiar herramienta activa usando Controller
    const handleToolChange = (toolName: string) => {
        ToolController.activateTool(toolName);
    };

    const handleStudySelect = (study: any) => {
        setSelectedStudy(study);
        setLoadedImageId(study.imageId); // Load the image immediately
        setView('viewer');
    };

    const handleBackToList = () => {
        setView('list');
        setSelectedStudy(null);
    };

    return (
        <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
            {/* Header - COMPLETO CON METADATA (Tal cual estaba antes) */}
            <header className="h-14 flex items-center justify-between px-4 border-b border-white/10 bg-zinc-900 z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={view === 'viewer' ? handleBackToList : () => navigate('/hub')}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        title="Volver"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-sm font-semibold tracking-wide text-violet-400">
                        DENTAXY <span className="text-white/60">{view === 'viewer' ? 'Viewer' : 'RX'}</span>
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    {selectedStudy && view === 'viewer' && (
                        <div className="hidden md:flex items-center gap-4 mr-4 text-xs text-white/60">
                            <span className="font-bold text-white">{selectedStudy.patientName}</span>
                            <span className="bg-white/10 px-2 py-0.5 rounded text-white/80">{selectedStudy.modality}</span>
                        </div>
                    )}
                    <span className="text-xs text-zinc-500 uppercase tracking-wider font-mono">
                        {view === 'viewer' ? 'Phase 2: Clinical' : 'Phase 3: DICOMweb'}
                    </span>
                </div>
            </header>

            {view === 'list' ? (
                <main className="flex-1 overflow-auto">
                    <StudyList onStudySelect={handleStudySelect} />
                </main>
            ) : (
                <main className="flex-1 relative w-full h-full bg-black overflow-hidden">

                    {/* Viewport Area - Fills the entire space */}
                    <div className="absolute inset-0 z-0 flex items-center justify-start bg-black">
                        <DicomErrorBoundary>
                            <DicomViewport
                                toolGroupId={toolGroupId}
                                imageId={loadedImageId || undefined}
                                onImageLoaded={setLoadedImageId}
                            />
                            {/* Nuevo Panel Dinámico (Control Panel) */}
                            <DynamicControlPanel imageId={loadedImageId} />
                        </DicomErrorBoundary>
                    </div>

                    {/* Toolbar Vertical (Lateral Izquierdo) - Overlay on top */}
                    <div className="absolute top-0 left-0 h-full z-40 pointer-events-none flex flex-col justify-start pt-4 pl-4">
                        <div className="pointer-events-auto">
                            <DicomToolbar
                                activeTool={activeTool}
                                onToolChange={handleToolChange}
                                toolGroupId={toolGroupId}
                                orientation="vertical"
                            />
                        </div>
                    </div>

                </main>
            )}
        </div>
    );
};

export default DICOMDemo;
