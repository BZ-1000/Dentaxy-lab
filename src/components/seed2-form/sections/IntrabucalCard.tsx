import React from 'react';
import ExamenIntrabucal from '@/components/historia-clinica/ExamenIntrabucal';

interface IntrabucalCardProps {
    formData: any;
    handleExamenIntrabucalChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const IntrabucalCard: React.FC<IntrabucalCardProps> = ({
    formData,
    handleExamenIntrabucalChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <div className="w-full bg-white">
            <div className="w-full bg-white">
                <div data-section="intrabucal">
                    <ExamenIntrabucal
                        formData={formData}
                        handleExamenIntrabucalChange={handleExamenIntrabucalChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('intrabucal', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </div>
        </div>
    );
};
