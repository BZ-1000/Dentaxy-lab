import React from 'react';
import AntecedentesPersonalesNoPatologicos from '@/components/historia-clinica/AntecedentesPersonalesNoPatologicos';

interface NoPatologicosCardProps {
    formData: any;
    handleAntecedenteNoPatologicoChange: any;
    toggleService: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const NoPatologicosCard: React.FC<NoPatologicosCardProps> = ({
    formData,
    handleAntecedenteNoPatologicoChange,
    toggleService,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <div className="w-full bg-white">
            <div className="w-full bg-white">
                <div data-section="noPatologicos">
                    <AntecedentesPersonalesNoPatologicos
                        formData={formData}
                        handleAntecedenteNoPatologicoChange={handleAntecedenteNoPatologicoChange}
                        toggleService={toggleService}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('noPatologicos', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </div>
        </div>
    );
};
