import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import AntecedentesPersonalesPatologicos from '@/components/historia-clinica/AntecedentesPersonalesPatologicos';

interface PatologicosCardProps {
    formData: any;
    handleAntecedentePatologicoChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const PatologicosCard: React.FC<PatologicosCardProps> = ({
    formData,
    handleAntecedentePatologicoChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="patologicos">
                    <AntecedentesPersonalesPatologicos
                        formData={formData}
                        handleAntecedentePatologicoChange={handleAntecedentePatologicoChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('patologicos', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
