import React from 'react';
import RelacionDientes from '@/components/historia-clinica/RelacionDientes';

interface RelacionDientesCardProps {
    formData: any;
    handleRelacionDientesChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const RelacionDientesCard: React.FC<RelacionDientesCardProps> = ({
    formData,
    handleRelacionDientesChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <div className="w-full bg-transparent">
            <div className="w-full bg-transparent">
                <div data-section="relacionDientes">
                    <RelacionDientes
                        formData={formData}
                        handleRelacionDientesChange={handleRelacionDientesChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('relacionDientes', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </div>
        </div>
    );
};
