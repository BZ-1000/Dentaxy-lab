import React from 'react';
import PadecimientoActual from '@/components/historia-clinica/PadecimientoActual';

interface PadecimientoCardProps {
    formData: any;
    handlePadecimientoChange: (field: string, value: string) => void;
    handleDolorChange: (field: string, value: any) => void;
    handleSinSintomasChange: (checked: boolean) => void;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
    onSectionComplete?: () => void;
}

export const PadecimientoCard: React.FC<PadecimientoCardProps> = ({
    formData,
    handlePadecimientoChange,
    handleDolorChange,
    handleSinSintomasChange,
    onSeccionGenerada,
    onToggleViewMode,
    onSectionComplete,
}) => {
    return (
        <div className="w-full flex justify-center items-center">
            <div data-section="padecimiento" className="w-full">
                <PadecimientoActual
                    formData={formData}
                    handlePadecimientoChange={handlePadecimientoChange}
                    handleDolorChange={handleDolorChange}
                    handleSinSintomasChange={handleSinSintomasChange}
                    onRedaccionGenerada={(content: string) => onSeccionGenerada('padecimiento', content)}
                    onToggleViewMode={onToggleViewMode}
                    onSectionComplete={onSectionComplete}
                />
            </div>
        </div>
    );
};
