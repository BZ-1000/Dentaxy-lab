import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { INormalizedText } from '../contracts';

interface DocumentViewerProps {
    initialContent: string | INormalizedText;
    editable?: boolean;
    onSave?: (content: string) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
    initialContent,
    editable = false,
    onSave
}) => {
    const content = typeof initialContent === 'string'
        ? initialContent
        : initialContent.rawText; // TODO: Usar structuredBlocks para reconstruir HTML rico

    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: content,
        editable: editable,
    });

    if (!editor) {
        return <div>Cargando editor...</div>;
    }

    return (
        <div className="border border-gray-200 rounded-lg p-4 bg-white min-h-[500px]">
            <div className="mb-4 flex justify-between items-center border-b pb-2">
                <h3 className="text-sm font-semibold text-gray-500 uppercase">
                    {editable ? 'Modo Edición' : 'Vista Previa'}
                </h3>
                {editable && onSave && (
                    <button
                        onClick={() => onSave(editor.getHTML())}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                        Guardar Cambios
                    </button>
                )}
            </div>
            <EditorContent editor={editor} className="prose max-w-none" />
        </div>
    );
};
