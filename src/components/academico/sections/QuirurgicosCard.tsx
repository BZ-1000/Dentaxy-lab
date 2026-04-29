import React from 'react';
import AntecedentesQuirurgicos from '@/components/historia-clinica/AntecedentesQuirurgicos';

interface QuirurgicosCardProps {
    formData: any;
    handleAntecedenteQuirurgicoChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const QuirurgicosCard: React.FC<QuirurgicosCardProps> = ({
    formData,
    handleAntecedenteQuirurgicoChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <div className="w-full bg-white">
            <div className="w-full bg-white">
                <div data-section="quirurgicos">
                    <AntecedentesQuirurgicos
                        formData={formData}
                        handleAntecedenteQuirurgicoChange={handleAntecedenteQuirurgicoChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('quirurgicos', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </div>
        </div>
    );
};
