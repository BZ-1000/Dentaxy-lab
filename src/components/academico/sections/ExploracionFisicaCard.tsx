import React from 'react';
import ExploracionFisica from '@/components/historia-clinica/ExploracionFisica';

interface ExploracionFisicaCardProps {
    formData: any;
    handleExploracionFisicaChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const ExploracionFisicaCard: React.FC<ExploracionFisicaCardProps> = ({
    formData,
    handleExploracionFisicaChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <div className="w-full bg-white">
            <div className="w-full bg-white">
                <div data-section="exploracionFisica">
                    <ExploracionFisica
                        formData={formData}
                        handleExploracionFisicaChange={handleExploracionFisicaChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('exploracionFisica', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </div>
        </div>
    );
};
