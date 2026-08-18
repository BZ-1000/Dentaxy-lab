import React from 'react';
import ArticulacionCraneomandibular from '@/components/historia-clinica/ArticulacionCraneomandibular';

interface ATMCardProps {
    formData: any;
    handleArticulacionCraneomandibularChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const ATMCard: React.FC<ATMCardProps> = ({
    formData,
    handleArticulacionCraneomandibularChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <div className="w-full bg-transparent">
            <div className="w-full bg-transparent">
                <div data-section="atm">
                    <ArticulacionCraneomandibular
                        formData={formData}
                        handleArticulacionCraneomandibularChange={handleArticulacionCraneomandibularChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('atm', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </div>
        </div>
    );
};
