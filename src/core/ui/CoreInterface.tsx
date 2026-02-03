"use client";

import React, { useState, useRef } from 'react';
import { dataIngestion } from '@/core/packages/ingestion';
import { DocumentTransformerFactory } from '@/core/packages/transformers/document-to-text';
import { TextNormalizer } from '@/core/packages/transformers/text-normalizer';
import { DocumentViewer } from '@/core/packages/document-viewer';

// Instanciar servicios
const normalizer = new TextNormalizer();

export const CoreInterface = () => {
    const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'READY'>('IDLE');
    const [documentContent, setDocumentContent] = useState<string>('');
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        const file = e.target.files[0];
        setStatus('PROCESSING');

        try {
            const rawDoc = await dataIngestion.ingest(file);

            if (rawDoc.type === 'UNKNOWN') {
                throw new Error('Formato no soportado');
            }

            const transformer = DocumentTransformerFactory.getTransformer(rawDoc.type);
            const normalizedText = await transformer.transform(rawDoc);
            const finalText = await normalizer.normalize(normalizedText.rawText);

            setDocumentContent(finalText);
            setStatus('READY');
        } catch (error) {
            console.error(error);
            alert('Error procesando el documento. Revisa la consola.');
            setStatus('IDLE');
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
        <div className="bg-white shadow-xl sm:rounded-lg p-8 w-full max-w-5xl mx-auto">
            <div className="mb-8 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-800">Fase 1: Ingesta Documental</h2>
                <p className="text-sm text-gray-500">Motor de digitalización activo</p>
            </div>

            {status === 'IDLE' && (
                <div className="flex flex-col items-center justify-center space-y-6 py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}>

                    <div className="text-6xl">📄</div>

                    <div className="space-y-2 text-center">
                        <p className="text-lg font-medium text-gray-700">Arrastra o selecciona un documento</p>
                        <p className="text-sm text-gray-500">Soporte nativo: JPG, PNG, PDF</p>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-medium transition-shadow shadow-lg hover:shadow-xl"
                        >
                            Cargar Archivo
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                            className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 font-medium shadow-sm"
                        >
                            📸 Foto
                        </button>
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*,application/pdf"
                        onChange={handleFileSelect}
                    />
                </div>
            )}

            {status === 'PROCESSING' && (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-lg text-gray-600 font-medium">Procesando núcleo...</p>
                    <p className="text-xs text-gray-400">OCR Tesseract / PDF Parsing</p>
                </div>
            )}

            {status === 'READY' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <span className="flex items-center text-blue-800 font-medium">
                            <span className="mr-2">✅</span> Documento Digitalizado
                        </span>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-sm text-blue-600 hover:text-blue-800 font-bold underline decoration-2 decoration-blue-200 hover:decoration-blue-600 transition-all"
                            >
                                Habilitar Edición
                            </button>
                        )}
                    </div>

                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-inner bg-gray-50">
                        <DocumentViewer
                            initialContent={documentContent}
                            editable={isEditing}
                            onSave={handleSave}
                        />
                    </div>

                    <div className="flex justify-end pt-6">
                        <button
                            onClick={handleConfirm}
                            disabled={isEditing}
                            className={`px-8 py-3 rounded-lg font-bold text-white shadow-md transition-all transform hover:scale-105 active:scale-95
                ${isEditing
                                    ? 'bg-gray-400 cursor-not-allowed opacity-50'
                                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'}`}
                        >
                            Confirmar Ingesta
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
