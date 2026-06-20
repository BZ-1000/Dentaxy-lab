"use client";

import React, { useState, useRef, useEffect } from 'react';
import { dataIngestion } from '@/core/packages/ingestion';
import { DocumentTransformerFactory } from '@/core/packages/transformers/document-to-text';
import { TextNormalizer } from '@/core/packages/transformers/text-normalizer';
import { DocumentViewer } from '@/core/packages/document-viewer';
import DentaxyFormPanel from '../packages/clinical-form';
import { FileSearch, ClipboardList, Palette, Sparkles, Layout, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { DentaxyStudio } from '@/core/packages/studio/DentaxyStudio';
import { QuestEngine } from '@/core/packages/quest-engine/QuestEngine';
import { Seed2Phase } from '../packages/seed2/Seed2Phase';
import { DentaxyErrorBoundary } from '@/components/ui/DentaxyErrorBoundary';
import { cn } from '@/lib/utils';

// Instanciar servicios de forma diferida o protegida para evitar fallos de importación/inicialización global
let normalizer: TextNormalizer | null = null;
const getNormalizer = () => {
    if (!normalizer) normalizer = new TextNormalizer();
    return normalizer;
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode, fallback: React.ReactNode }, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: any) {
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.error("Clinical Form Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }

        return this.props.children;
    }
}

interface CoreInterfaceProps {
    activePhase: number;
    setActivePhase: (phase: number) => void;
}

export const phases = [
    { id: 1, name: 'Ingesta', fullName: 'Fase 1: Ingesta Documental', icon: FileSearch, color: 'blue' },
    { id: 2, name: 'Clínica', fullName: 'Fase 2: Historia Clínica', icon: ClipboardList, color: 'emerald' },
    { id: 3, name: 'Studio', fullName: 'Fase 3: DENTAXY Studio', icon: Palette, color: 'indigo' },
    { id: 4, name: 'Planificador', fullName: 'Fase 4: Planificador Inteligente', icon: Target, color: 'amber' },
    { id: 5, name: 'Seed 2.0', fullName: 'Fase 5: Seed 2.0', icon: Sparkles, color: 'purple' },
];

export const PhaseNavigator = ({ activePhase, setActivePhase }: { activePhase: number, setActivePhase: (id: number) => void }) => {
    return (
        <nav className="flex items-center">
            <div className="bg-slate-100/80 backdrop-blur-md border border-slate-200 shadow-sm rounded-full p-1 flex gap-1 items-center scale-90 sm:scale-100">
                {phases.map((phase) => (
                    <button
                        key={phase.id}
                        onClick={() => setActivePhase(phase.id)}
                        className={cn(
                            "relative px-4 py-1.5 rounded-full text-[10px] font-bold transition-all duration-500 flex items-center gap-2 group overflow-hidden",
                            activePhase === phase.id
                                ? "text-white"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                        )}
                    >
                        {activePhase === phase.id && (
                            <motion.div
                                layoutId="activePhaseBGHeader"
                                className={cn(
                                    "absolute inset-0 z-0",
                                    phase.color === 'blue' && "bg-blue-600 shadow-lg shadow-blue-500/20",
                                    phase.color === 'emerald' && "bg-emerald-600 shadow-lg shadow-emerald-500/20",
                                    phase.color === 'indigo' && "bg-indigo-600 shadow-lg shadow-indigo-500/20",
                                    phase.color === 'amber' && "bg-amber-500 shadow-lg shadow-amber-500/20",
                                    phase.color === 'purple' && "bg-purple-600 shadow-lg shadow-purple-500/20"
                                )}
                                transition={{ type: "spring", bounce: 0.1, duration: 0.3 }}
                            />
                        )}
                        <phase.icon size={12} className={cn("relative z-10 transition-transform duration-500 group-hover:scale-110", activePhase === phase.id ? "text-white" : "text-slate-400")} />
                        <span className="relative z-10 tracking-tight uppercase whitespace-nowrap">{phase.name}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export const CoreInterface = ({ activePhase, setActivePhase }: CoreInterfaceProps) => {
    const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'READY'>('IDLE');
    const [documentContent, setDocumentContent] = useState<string>('');
    const [blocks, setBlocks] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [testStep, setTestStep] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'auto' });
        }
    }, [activePhase]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        const file = e.target.files[0];
        setFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setStatus('PROCESSING');

        try {
            const rawDoc = await dataIngestion.ingest(file);

            if (rawDoc.type === 'UNKNOWN') {
                throw new Error('Formato no soportado');
            }

            const transformer = DocumentTransformerFactory.getTransformer(rawDoc.type);
            const normalizedText = await transformer.transform(rawDoc);
            const finalText = await getNormalizer().normalize(normalizedText.rawText);

            setDocumentContent(finalText);
            setBlocks(normalizedText.structuredBlocks || []);
            setStatus('READY');
        } catch (error: any) {
            console.error('OCR Processing Error:', error);
            const errorDetails = error.message || (typeof error === 'string' ? error : JSON.stringify(error));

            setStatus('READY');
            setDocumentContent(`[ERROR DEL SISTEMA]\n\nDetalle Técnico: ${errorDetails}\n\nPosible Causa: Fallo de red al descargar modelos o imagen corrupta.\nIntente de nuevo.`);
            setError(errorDetails);
        }
    };

    const handleSave = (newContent: string) => {
        setDocumentContent(newContent);
        setIsEditing(false);
    };

    const handleConfirm = () => {
        alert("Documento confirmado y digitalizado (Simulación Core).");
        setStatus('IDLE');
        setDocumentContent('');
        setIsEditing(false);
    };

    return (
        <div className={cn(
            "font-sans", 
            activePhase === 5 
                ? "w-full h-full" 
                : "w-full max-w-5xl mx-auto pt-12 pb-32 flex flex-col gap-8 min-h-screen"
        )}>


            {/* --- PHASE 1 VIEW --- */}
            {activePhase === 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <div className="bg-white shadow-xl sm:rounded-[2.5rem] p-8 relative border border-slate-100">
                        <div>
                            <div id="phase1-ingestion-header" className="mb-8 border-b border-slate-50 pb-6">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Fase 1: Ingesta Documental</h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Motor de digitalización activo</p>
                            </div>

                            {status === 'IDLE' && (
                                <div className="flex flex-col items-center justify-center space-y-6 py-20 border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50 hover:bg-slate-100/80 transition-all cursor-pointer group"
                                    onClick={() => fileInputRef.current?.click()}>
                                    <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500 border border-slate-100">📄</div>
                                    <div className="space-y-2 text-center">
                                        <p className="text-2xl font-black text-slate-800 tracking-tight">Arrastra un documento</p>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Soporte nativo: JPG, PNG, PDF</p>
                                    </div>
                                    <div className="flex space-x-4">
                                        <button className="px-10 py-3.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 font-bold text-sm transition-all shadow-xl shadow-blue-500/20 active:scale-95">Cargar Archivo</button>
                                        <button className="px-10 py-3.5 bg-white text-slate-700 border border-slate-200 rounded-2xl hover:bg-slate-50 font-bold text-sm shadow-sm active:scale-95">📸 Foto</button>
                                    </div>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*,application/pdf" onChange={handleFileSelect} />
                                </div>
                            )}

                            {status === 'PROCESSING' && (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mb-8 shadow-xl"
                                    />
                                    <p className="text-2xl font-black text-slate-800 tracking-tight">Procesando núcleo...</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">OCR Tesseract / PDF Parsing</p>
                                </div>
                            )}

                            {status === 'READY' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100/50">
                                        <span className="flex items-center text-blue-900 font-black tracking-tight">
                                            <span className="mr-3 bg-blue-600 text-white p-1 rounded-full text-[10px] items-center justify-center flex w-6 h-6 shadow-lg shadow-blue-500/30">✓</span> Documento Digitalizado
                                        </span>
                                        {!isEditing && (
                                            <button onClick={() => setIsEditing(true)} className="text-xs font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest bg-white px-4 py-2 rounded-xl shadow-sm border border-blue-100">Habilitar Edición</button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-inner bg-slate-50/50 p-6 flex flex-col">
                                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Fuente Original</h3>
                                            <div className="flex-1 flex items-center justify-center bg-white rounded-3xl overflow-hidden min-h-[450px] relative group border border-slate-100 shadow-sm">
                                                {previewUrl ? (
                                                    <div className="relative w-full h-full flex items-center justify-center p-2">
                                                        {file?.type === 'application/pdf' ? (
                                                            <object data={previewUrl} className="w-full h-full object-contain rounded-2xl" aria-label="Vista previa del documento" />
                                                        ) : (
                                                            <div className="relative w-full h-full flex items-center justify-center">
                                                                <img id="source-img" src={previewUrl} alt="Vista previa" className="max-w-full max-h-full object-contain rounded-2xl" />
                                                                {blocks.length > 0 && (
                                                                    <div id="visual-overlay" className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-2xl">
                                                                        {/* Blocks mapping would go here for OCR highlights */}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : <div className="text-slate-300 font-black flex flex-col items-center gap-2"><Layout size={40} /><span>SINFUENTE</span></div>}
                                            </div>
                                        </div>
                                        <div className="border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl bg-white">
                                            <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
                                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Interpretación Digital</h3>
                                                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full font-black uppercase tracking-widest border border-emerald-200/50">Text Layer</span>
                                            </div>
                                            <DocumentViewer initialContent={documentContent} editable={isEditing} onSave={handleSave} />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-8">
                                        <button onClick={handleConfirm} disabled={isEditing} className={cn(
                                            "px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white shadow-2xl shadow-emerald-500/40 transition-all transform hover:scale-105 active:scale-95 group flex items-center gap-3",
                                            isEditing ? 'bg-slate-300 cursor-not-allowed opacity-50' : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                                        )}>
                                            <span>Confirmar Ingesta</span>
                                            <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* --- PHASE 2 VIEW --- */}
            {activePhase === 2 && (
                <motion.div
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                >
                    <div className="bg-white shadow-2xl sm:rounded-[3.5rem] p-4 relative border border-slate-100 overflow-hidden">
                        <div className="p-8">
                            <div id="phase2-clinical-form-header" className="mb-8 border-b border-slate-50 pb-6">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Fase 2: Historia Clínica</h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Sistema de Generación Clínica (Core)</p>
                            </div>
                        </div>
                        <div className="h-[800px] border border-slate-100 rounded-[3rem] overflow-hidden shadow-inner bg-slate-50 relative m-2 border-dashed">
                            <ErrorBoundary fallback={
                                <div className="flex flex-col items-center justify-center h-full text-red-500 p-8 text-center bg-red-50/50">
                                    <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-3xl mb-6">⚠️</div>
                                    <p className="font-black text-xl tracking-tight text-slate-900">Fallo en el Núcleo Clínico</p>
                                    <p className="text-sm font-bold text-slate-500 mt-2">Error de renderizado de componentes locales.</p>
                                </div>
                            }>
                                <DentaxyFormPanel />
                            </ErrorBoundary>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* --- PHASE 3 VIEW --- */}
            {activePhase === 3 && (
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                >
                    <div className="bg-white shadow-2xl sm:rounded-[3.5rem] p-8 relative border border-slate-200/50">
                        <div id="phase3-playground-header" className="mb-8 border-b border-slate-50 pb-6 flex justify-between items-end">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Fase 3: DENTAXY Studio</h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">UI/ UX componentes dentaxy</p>
                            </div>
                            <div className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 shadow-sm">
                                Studio v3.0 Active
                            </div>
                        </div>

                        <div className="w-full">
                            <DentaxyErrorBoundary componentName="Dentaxy Studio" fallbackTitle="Error en el Motor de Diseño">
                                <DentaxyStudio />
                            </DentaxyErrorBoundary>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* --- PHASE 4 VIEW --- */}
            {activePhase === 4 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                >
                    <div className="bg-white shadow-2xl sm:rounded-[3.5rem] p-8 relative border border-slate-200/50">
                        <DentaxyErrorBoundary componentName="Quest Engine" fallbackTitle="Error en el Motor de Misiones">
                            <QuestEngine />
                        </DentaxyErrorBoundary>
                    </div>
                </motion.div>
            )}

            {/* --- PHASE 5 VIEW (Seed 2.0) --- */}
            {activePhase === 5 && (
                <DentaxyErrorBoundary componentName="Seed 2.0" fallbackTitle="Error en Seed 2.0">
                    <Seed2Phase />
                </DentaxyErrorBoundary>
            )}
        </div>
    );
};
