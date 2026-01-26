import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import AntecedentesPersonalesNoPatologicos from '@/components/historia-clinica/AntecedentesPersonalesNoPatologicos';

interface NoPatologicosCardProps {
    formData: any;
    handleAntecedenteNoPatologicoChange: any;
    toggleService: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
}

export const NoPatologicosCard: React.FC<NoPatologicosCardProps> = ({
    formData,
    handleAntecedenteNoPatologicoChange,
    toggleService,
    onSeccionGenerada,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="noPatologicos">
                    <AntecedentesPersonalesNoPatologicos
                        formData={formData}
                        handleAntecedenteNoPatologicoChange={handleAntecedenteNoPatologicoChange}
                        toggleService={toggleService}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('noPatologicos', content)}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
