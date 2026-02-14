import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import AntecedentesHemorragicos from '@/components/historia-clinica/AntecedentesHemorragicos';

interface HemorragicosCardProps {
    formData: any;
    handleAntecedenteHemorragicoChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const HemorragicosCard: React.FC<HemorragicosCardProps> = ({
    formData,
    handleAntecedenteHemorragicoChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="hemorragicos">
                    <AntecedentesHemorragicos
                        formData={formData}
                        handleAntecedenteHemorragicoChange={handleAntecedenteHemorragicoChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('hemorragicos', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
