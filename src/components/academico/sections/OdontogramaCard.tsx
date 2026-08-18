import React from 'react';
import Odontograma from '@/components/historia-clinica/Odontograma';

interface OdontogramaCardProps {
    formData: any;
    handleOdontogramaChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const OdontogramaCard: React.FC<OdontogramaCardProps> = ({
    formData,
    handleOdontogramaChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <div className="w-full bg-transparent">
            <div className="w-full bg-transparent">
                <div data-section="odontograma">
                    <Odontograma
                        formData={formData}
                        handleOdontogramaChange={handleOdontogramaChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('odontograma', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </div>
        </div>
    );
};
