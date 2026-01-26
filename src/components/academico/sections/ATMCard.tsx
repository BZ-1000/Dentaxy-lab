import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ArticulacionCraneomandibular from '@/components/historia-clinica/ArticulacionCraneomandibular';

interface ATMCardProps {
    formData: any;
    handleArticulacionCraneomandibularChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
}

export const ATMCard: React.FC<ATMCardProps> = ({
    formData,
    handleArticulacionCraneomandibularChange,
    onSeccionGenerada,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="atm">
                    <ArticulacionCraneomandibular
                        formData={formData}
                        handleArticulacionCraneomandibularChange={handleArticulacionCraneomandibularChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('atm', content)}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
