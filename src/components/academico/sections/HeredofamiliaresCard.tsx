import React from 'react';
import AntecedentesHeredoFamiliares from '@/components/historia-clinica/AntecedentesHeredoFamiliares';

interface HeredofamiliaresCardProps {
    formData: any;
    handleFamiliarChange: any;
    handleCondicionChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const HeredofamiliaresCard: React.FC<HeredofamiliaresCardProps> = ({
    formData,
    handleFamiliarChange,
    handleCondicionChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <div className="w-full bg-transparent">
            <div className="w-full bg-transparent">
                <div data-section="heredofamiliares">
                    <AntecedentesHeredoFamiliares
                        formData={formData}
                        handleFamiliarChange={handleFamiliarChange}
                        handleCondicionChange={handleCondicionChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('heredofamiliares', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </div>
        </div>
    );
};
