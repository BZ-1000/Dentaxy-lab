import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import AntecedentesQuirurgicos from '@/components/historia-clinica/AntecedentesQuirurgicos';

interface QuirurgicosCardProps {
    formData: any;
    handleAntecedenteQuirurgicoChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
}

export const QuirurgicosCard: React.FC<QuirurgicosCardProps> = ({
    formData,
    handleAntecedenteQuirurgicoChange,
    onSeccionGenerada,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="quirurgicos">
                    <AntecedentesQuirurgicos
                        formData={formData}
                        handleAntecedenteQuirurgicoChange={handleAntecedenteQuirurgicoChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('quirurgicos', content)}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
