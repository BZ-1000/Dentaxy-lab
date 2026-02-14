import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ExamenCabeza from '@/components/historia-clinica/ExamenCabeza';

interface CabezaCardProps {
    formData: any;
    handleExamenCabezaChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const CabezaCard: React.FC<CabezaCardProps> = ({
    formData,
    handleExamenCabezaChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="cabeza">
                    <ExamenCabeza
                        formData={formData}
                        handleExamenCabezaChange={handleExamenCabezaChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('cabeza', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
