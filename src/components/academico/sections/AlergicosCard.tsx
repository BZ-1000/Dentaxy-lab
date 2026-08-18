import React from 'react';
import AntecedentesAlergicos from '@/components/historia-clinica/AntecedentesAlergicos';

interface AlergicosCardProps {
    formData: any;
    handleAntecedenteAlergicoChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const AlergicosCard: React.FC<AlergicosCardProps> = ({
    formData,
    handleAntecedenteAlergicoChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <div className="w-full bg-transparent">
            <div className="w-full bg-transparent">
                <div data-section="alergicos">
                    <AntecedentesAlergicos
                        formData={formData}
                        handleAntecedenteAlergicoChange={handleAntecedenteAlergicoChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('alergicos', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </div>
        </div>
    );
};
