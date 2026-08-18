import React from 'react';
import AntecedentesPersonalesPatologicos from '@/components/historia-clinica/AntecedentesPersonalesPatologicos';

interface PatologicosCardProps {
    formData: any;
    handleAntecedentePatologicoChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const PatologicosCard: React.FC<PatologicosCardProps> = ({
    formData,
    handleAntecedentePatologicoChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <div className="w-full bg-transparent">
            <div className="w-full bg-transparent">
                <div data-section="patologicos">
                    <AntecedentesPersonalesPatologicos
                        formData={formData}
                        handleAntecedentePatologicoChange={handleAntecedentePatologicoChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('patologicos', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </div>
        </div>
    );
};
