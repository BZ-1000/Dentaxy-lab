import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import AntecedentesHeredoFamiliares from '@/components/historia-clinica/AntecedentesHeredoFamiliares';

interface HeredofamiliaresCardProps {
    formData: any;
    handleFamiliarChange: any;
    handleCondicionChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
}

export const HeredofamiliaresCard: React.FC<HeredofamiliaresCardProps> = ({
    formData,
    handleFamiliarChange,
    handleCondicionChange,
    onSeccionGenerada,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="heredofamiliares">
                    <AntecedentesHeredoFamiliares
                        formData={formData}
                        handleFamiliarChange={handleFamiliarChange}
                        handleCondicionChange={handleCondicionChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('heredofamiliares', content)}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
