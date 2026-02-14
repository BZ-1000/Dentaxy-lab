import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import RelacionDientes from '@/components/historia-clinica/RelacionDientes';

interface RelacionDientesCardProps {
    formData: any;
    handleRelacionDientesChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const RelacionDientesCard: React.FC<RelacionDientesCardProps> = ({
    formData,
    handleRelacionDientesChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="relacionDientes">
                    <RelacionDientes
                        formData={formData}
                        handleRelacionDientesChange={handleRelacionDientesChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('relacionDientes', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
