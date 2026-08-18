import React from 'react';
import AntecedentesGinecoObstetricos from '@/components/historia-clinica/AntecedentesGinecoObstetricos';

interface GinecoObstetricosCardProps {
    formData: any;
    handleAntecedenteGinecoObstetricoChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const GinecoObstetricosCard: React.FC<GinecoObstetricosCardProps> = ({
    formData,
    handleAntecedenteGinecoObstetricoChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <div className="w-full bg-transparent">
            <div className="w-full bg-transparent">
                <div data-section="ginecoObstetricos">
                    <AntecedentesGinecoObstetricos
                        formData={formData}
                        handleAntecedenteGinecoObstetricoChange={handleAntecedenteGinecoObstetricoChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('ginecoObstetricos', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </div>
        </div>
    );
};
