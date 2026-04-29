import React from 'react';
import Pronostico from '@/components/historia-clinica/Pronostico';

interface PronosticoCardProps {
    formData: any;
    handlePronosticoChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const PronosticoCard: React.FC<PronosticoCardProps> = ({
    formData,
    handlePronosticoChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <div className="w-full bg-white">
            <div className="w-full bg-white">
                <div data-section="pronostico">
                    <Pronostico
                        formData={formData}
                        handlePronosticoChange={handlePronosticoChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('pronostico', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </div>
        </div>
    );
};
