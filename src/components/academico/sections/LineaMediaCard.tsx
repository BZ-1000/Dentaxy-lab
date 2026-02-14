import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="lineaMedia">
                    <LineaMedia
                        formData={formData}
                        handleLineaMediaChange={handleLineaMediaChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('lineaMedia', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
