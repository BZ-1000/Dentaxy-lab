import React from 'react';
import AntecedentesAlergicos from '@/components/historia-clinica/AntecedentesAlergicos';

interface AlergicosCardProps {
    formData: any;
    handleAntecedenteAlergicoChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
    onSectionComplete?: () => void;
    microStep?: number;
    onMicroStepChange?: (step: number) => void;
    onTotalMicroStepsChange?: (total: number, names: string[]) => void;
}

export const AlergicosCard: React.FC<AlergicosCardProps> = ({
    formData,
    handleAntecedenteAlergicoChange,
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
                <div data-section="alergicos">
                    <AntecedentesAlergicos
                        formData={formData}
                        handleAntecedenteAlergicoChange={handleAntecedenteAlergicoChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('alergicos', content)}
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
