import React from 'react';
import ExamenCuello from '@/components/historia-clinica/ExamenCuello';

interface CuelloCardProps {
    formData: any;
    handleExamenCuelloChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const CuelloCard: React.FC<CuelloCardProps> = ({
    formData,
    handleExamenCuelloChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <div className="w-full bg-white">
            <div className="w-full bg-white">
                <div data-section="cuello">
                    <ExamenCuello
                        formData={formData}
                        handleExamenCuelloChange={handleExamenCuelloChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('cuello', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </div>
        </div>
    );
};
