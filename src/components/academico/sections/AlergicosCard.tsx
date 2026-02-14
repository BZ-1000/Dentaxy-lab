import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import AntecedentesAlergicos from '@/components/historia-clinica/AntecedentesAlergicos';

interface AlergicosCardProps {
    formData: any;
    handleAntecedenteAlergicoChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const AlergicosCard: React.FC<AlergicosCardProps> = ({
    formData,
    handleAntecedenteAlergicoChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="alergicos">
                    <AntecedentesAlergicos
                        formData={formData}
                        handleAntecedenteAlergicoChange={handleAntecedenteAlergicoChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('alergicos', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
