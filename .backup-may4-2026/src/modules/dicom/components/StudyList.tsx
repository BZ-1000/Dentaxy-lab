import React, { useState, useRef } from 'react';
import { Upload, Loader2, Calendar, User, FileText, ChevronRight, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { LocalDicomService, LocalStudy } from '../services/localDicomService';
import { cn } from "@/lib/utils";

interface StudyListProps {
    onStudySelect: (study: LocalStudy) => void;
}

export const StudyList: React.FC<StudyListProps> = ({ onStudySelect }) => {
    const [studies, setStudies] = useState<LocalStudy[]>(LocalDicomService.getStudies());
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsImporting(true);
        try {
            for (let i = 0; i < files.length; i++) {
                await LocalDicomService.addFile(files[i]);
            }
            // Refresh list
            setStudies(LocalDicomService.getStudies());
        } catch (error) {
            console.error("Error importing files:", error);
        } finally {
            setIsImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-col h-full bg-black text-white p-6 gap-6">
            {/* Header with Import Button */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold tracking-tight text-white">Casos Locales</h2>
                    <p className="text-white/40 text-sm">Gestiona tus archivos DICOM locales.</p>
                </div>
                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        multiple
                        accept=".dcm,application/dicom"
                    />
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-xl gap-2"
                        disabled={isImporting}
                    >
                        {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Importar DICOM
                    </Button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-auto rounded-xl border border-white/10 bg-white/[0.02]">
                {studies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] gap-8 m-4">

                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="absolute inset-0 bg-violet-500/20 blur-3xl rounded-full animate-pulse group-hover:bg-violet-500/30 transition-all duration-500" />
                            <div className="relative bg-zinc-900 autoverflow-hidden border border-violet-500/30 p-12 rounded-3xl text-center shadow-2xl hover:scale-105 hover:border-violet-500/60 transition-all duration-300">

                                <div className="mx-auto w-20 h-20 bg-zinc-950 rounded-2xl flex items-center justify-center border border-white/10 mb-6 group-hover:border-violet-500/50 shadow-inner">
                                    <Upload className="w-10 h-10 text-violet-400 group-hover:text-violet-300 transition-colors" />
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Cargar Estudios</h3>
                                <p className="text-zinc-400 text-sm max-w-xs mx-auto leading-relaxed mb-8">
                                    Arrastra archivos .dcm o haz clic para explorar tu sistema local.
                                </p>

                                <div className="inline-flex items-center gap-2 px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-violet-500/30">
                                    {isImporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                    <span>Seleccionar Archivos</span>
                                </div>

                                <div className="mt-8 flex justify-center gap-6 text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
                                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> DICOM 3.0</span>
                                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Local Secure</span>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {studies.map((study, index) => (
                            <button
                                key={study.id + index}
                                onClick={() => onStudySelect(study)}
                                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group text-left backdrop-blur-sm"
                            >
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white group-hover:text-emerald-400 transition-colors text-lg">
                                            {study.patientName}
                                        </span>
                                        <span className="text-[10px] font-mono font-bold text-black bg-emerald-500 px-1.5 py-0.5 rounded">
                                            LOCAL
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-white/50">
                                        <div className="flex items-center gap-1">
                                            <FileText className="w-3 h-3" />
                                            <span>{study.fileName}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{study.studyDate}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-white/20 font-mono">
                                        {((study.file.size / 1024) / 1024).toFixed(2)} MB
                                    </span>
                                    <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
