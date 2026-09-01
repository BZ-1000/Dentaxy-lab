import React from 'react';
import AntecedentesPersonalesNoPatologicos from '@/components/historia-clinica/AntecedentesPersonalesNoPatologicos';

interface NoPatologicosCardProps {
    formData: any;
    handleAntecedenteNoPatologicoChange: any;
    toggleService: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
    onSectionComplete?: () => void;
    microStep?: number;
    onMicroStepChange?: (step: number) => void;
    onTotalMicroStepsChange?: (total: number, names: string[]) => void;
}

export const NoPatologicosCard: React.FC<NoPatologicosCardProps> = ({
    formData,
    handleAntecedenteNoPatologicoChange,
    toggleService,
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
                <div data-section="noPatologicos">
                    <AntecedentesPersonalesNoPatologicos
                        formData={formData}
                        handleAntecedenteNoPatologicoChange={handleAntecedenteNoPatologicoChange}
                        toggleService={toggleService}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('noPatologicos', content)}
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
