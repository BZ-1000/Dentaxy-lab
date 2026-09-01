import React from 'react';
import AntecedentesHeredoFamiliares from '@/components/historia-clinica/AntecedentesHeredoFamiliares';

interface HeredofamiliaresCardProps {
    formData: any;
    handleFamiliarChange: any;
    handleCondicionChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
    onSectionComplete?: () => void;
    microStep?: number;
    onMicroStepChange?: (step: number) => void;
    onTotalMicroStepsChange?: (total: number, names: string[]) => void;
}

export const HeredofamiliaresCard: React.FC<HeredofamiliaresCardProps> = ({
    formData,
    handleFamiliarChange,
    handleCondicionChange,
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
                <div data-section="heredofamiliares">
                    <AntecedentesHeredoFamiliares
                        formData={formData}
                        handleFamiliarChange={handleFamiliarChange}
                        handleCondicionChange={handleCondicionChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('heredofamiliares', content)}
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
