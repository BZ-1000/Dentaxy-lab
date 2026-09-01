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
    microStep?: number;
    onMicroStepChange?: (step: number) => void;
    onTotalMicroStepsChange?: (total: number, names: string[]) => void;
}

export const PadecimientoCard: React.FC<PadecimientoCardProps> = ({
    formData,
    handlePadecimientoChange,
    handleDolorChange,
    handleSinSintomasChange,
    onSeccionGenerada,
    onToggleViewMode,
    onSectionComplete,
    microStep,
    onMicroStepChange,
    onTotalMicroStepsChange,
}) => {
    return (
        <div className="w-full bg-transparent">
            <div className="w-full bg-transparent">
                <div data-section="padecimiento">
                    <PadecimientoActual
                        formData={formData}
                        handlePadecimientoChange={handlePadecimientoChange}
                        handleDolorChange={handleDolorChange}
                        handleSinSintomasChange={handleSinSintomasChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('padecimiento', content)}
                        onToggleViewMode={onToggleViewMode}
                        onSectionComplete={onSectionComplete}
                        microStep={microStep}
                        onMicroStepChange={onMicroStepChange}
                        onTotalMicroStepsChange={onTotalMicroStepsChange}
                    />
                </div>
            </div>
        </div>
    );
};
