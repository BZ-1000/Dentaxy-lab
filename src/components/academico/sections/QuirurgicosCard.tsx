import React from 'react';
import AntecedentesQuirurgicos from '@/components/historia-clinica/AntecedentesQuirurgicos';

interface QuirurgicosCardProps {
    formData: any;
    handleAntecedenteQuirurgicoChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
    onSectionComplete?: () => void;
    microStep?: number;
    onMicroStepChange?: (step: number) => void;
    onTotalMicroStepsChange?: (total: number, names: string[]) => void;
}

export const QuirurgicosCard: React.FC<QuirurgicosCardProps> = ({
    formData,
    handleAntecedenteQuirurgicoChange,
    onSeccionGenerada,
    onToggleViewMode,
    onSectionComplete,
    microStep = 0,
    onMicroStepChange,
    onTotalMicroStepsChange,
}) => {
    return (
        <div className="w-full bg-transparent">
            <div className="w-full bg-transparent">
                <div data-section="quirurgicos">
                    <AntecedentesQuirurgicos
                        formData={formData}
                        handleAntecedenteQuirurgicoChange={handleAntecedenteQuirurgicoChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('quirurgicos', content)}
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
