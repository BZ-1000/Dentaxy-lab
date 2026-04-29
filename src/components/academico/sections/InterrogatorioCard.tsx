import React from 'react';
import InterrogatorioSistemas from '@/components/historia-clinica/InterrogatorioSistemas';

interface InterrogatorioCardProps {
    formData: any;
    handleInterrogatorioChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const InterrogatorioCard: React.FC<InterrogatorioCardProps> = ({
    formData,
    handleInterrogatorioChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <div className="w-full bg-white">
            <div className="w-full bg-white">
                <div data-section="interrogatorio">
                    <InterrogatorioSistemas
                        formData={formData}
                        handleInterrogatorioChange={handleInterrogatorioChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('interrogatorio', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </div>
        </div>
    );
};
