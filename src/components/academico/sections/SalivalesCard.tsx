import React from 'react';
import GlandulasSalivales from '@/components/historia-clinica/GlandulasSalivales';

interface SalivalesCardProps {
    formData: any;
    handleGlandulasSalivalesChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const SalivalesCard: React.FC<SalivalesCardProps> = ({
    formData,
    handleGlandulasSalivalesChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <div className="w-full bg-white">
            <div className="w-full bg-white">
                <div data-section="salivales">
                    <GlandulasSalivales
                        formData={formData}
                        handleGlandulasSalivalesChange={handleGlandulasSalivalesChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('salivales', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </div>
        </div>
    );
};
