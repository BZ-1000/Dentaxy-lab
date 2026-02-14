import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="salivales">
                    <GlandulasSalivales
                        formData={formData}
                        handleGlandulasSalivalesChange={handleGlandulasSalivalesChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('salivales', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
