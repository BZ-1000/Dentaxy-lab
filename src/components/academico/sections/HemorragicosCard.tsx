import React from 'react';
import AntecedentesHemorragicos from '@/components/historia-clinica/AntecedentesHemorragicos';

interface HemorragicosCardProps {
    formData: any;
    handleAntecedenteHemorragicoChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const HemorragicosCard: React.FC<HemorragicosCardProps> = ({
    formData,
    handleAntecedenteHemorragicoChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <div className="w-full bg-white">
            <div className="w-full bg-white">
                <div data-section="hemorragicos">
                    <AntecedentesHemorragicos
                        formData={formData}
                        handleAntecedenteHemorragicoChange={handleAntecedenteHemorragicoChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('hemorragicos', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </div>
        </div>
    );
};
