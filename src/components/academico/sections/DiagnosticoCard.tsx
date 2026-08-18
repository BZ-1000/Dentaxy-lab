import React from 'react';
import Diagnostico from '@/components/historia-clinica/Diagnostico';

interface DiagnosticoCardProps {
    formData: any;
    handleDiagnosticoChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const DiagnosticoCard: React.FC<DiagnosticoCardProps> = ({
    formData,
    handleDiagnosticoChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <div className="w-full bg-transparent">
            <div className="w-full bg-transparent">
                <div data-section="diagnostico">
                    <Diagnostico
                        formData={formData}
                        handleDiagnosticoChange={handleDiagnosticoChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('diagnostico', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </div>
        </div>
    );
};
