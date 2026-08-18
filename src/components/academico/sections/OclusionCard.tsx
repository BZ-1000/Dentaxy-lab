import React from 'react';
import Oclusion from '@/components/historia-clinica/Oclusion';

interface OclusionCardProps {
    formData: any;
    handleOclusionChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const OclusionCard: React.FC<OclusionCardProps> = ({
    formData,
    handleOclusionChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <div className="w-full bg-transparent">
            <div className="w-full bg-transparent">
                <div data-section="oclusion">
                    <Oclusion
                        formData={formData}
                        handleOclusionChange={handleOclusionChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('oclusion', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </div>
        </div>
    );
};
