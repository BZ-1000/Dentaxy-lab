import React from 'react';
import LineaMedia from '@/components/historia-clinica/LineaMedia';

interface LineaMediaCardProps {
    formData: any;
    handleLineaMediaChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const LineaMediaCard: React.FC<LineaMediaCardProps> = ({
    formData,
    handleLineaMediaChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <div className="w-full bg-white">
            <div className="w-full bg-white">
                <div data-section="lineaMedia">
                    <LineaMedia
                        formData={formData}
                        handleLineaMediaChange={handleLineaMediaChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('lineaMedia', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </div>
        </div>
    );
};
