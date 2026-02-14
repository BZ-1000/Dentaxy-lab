import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ExploracionFisica from '@/components/historia-clinica/ExploracionFisica';

interface ExploracionFisicaCardProps {
    formData: any;
    handleExploracionFisicaChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const ExploracionFisicaCard: React.FC<ExploracionFisicaCardProps> = ({
    formData,
    handleExploracionFisicaChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="exploracionFisica">
                    <ExploracionFisica
                        formData={formData}
                        handleExploracionFisicaChange={handleExploracionFisicaChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('exploracionFisica', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
