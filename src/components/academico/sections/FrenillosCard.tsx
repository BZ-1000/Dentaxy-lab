import React from 'react';
import Frenillos from '@/components/historia-clinica/Frenillos';

interface FrenillosCardProps {
    formData: any;
    handleFrenillosChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const FrenillosCard: React.FC<FrenillosCardProps> = ({
    formData,
    handleFrenillosChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <div className="w-full bg-transparent">
            <div className="w-full bg-transparent">
                <div data-section="frenillos">
                    <Frenillos
                        formData={formData}
                        handleFrenillosChange={handleFrenillosChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('frenillos', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </div>
        </div>
    );
};
