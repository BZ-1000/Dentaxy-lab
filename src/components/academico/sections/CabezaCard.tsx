import React from 'react';
import ExamenCabeza from '@/components/historia-clinica/ExamenCabeza';

interface CabezaCardProps {
    formData: any;
    handleExamenCabezaChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const CabezaCard: React.FC<CabezaCardProps> = ({
    formData,
    handleExamenCabezaChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <div className="w-full bg-transparent">
            <div className="w-full bg-transparent">
                <div data-section="cabeza">
                    <ExamenCabeza
                        formData={formData}
                        handleExamenCabezaChange={handleExamenCabezaChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('cabeza', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </div>
        </div>
    );
};
