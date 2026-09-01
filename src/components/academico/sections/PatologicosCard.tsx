import React from 'react';
import AntecedentesPersonalesPatologicos from '@/components/historia-clinica/AntecedentesPersonalesPatologicos';

interface PatologicosCardProps {
    formData: any;
    handleAntecedentePatologicoChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
    onSectionComplete?: () => void;
    microStep?: number;
    onMicroStepChange?: (step: number) => void;
    onTotalMicroStepsChange?: (total: number, names: string[]) => void;
}

export const PatologicosCard: React.FC<PatologicosCardProps> = ({
    formData,
    handleAntecedentePatologicoChange,
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
                <div data-section="patologicos">
                    <AntecedentesPersonalesPatologicos
                        formData={formData}
                        handleAntecedentePatologicoChange={handleAntecedentePatologicoChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('patologicos', content)}
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
