import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Pronostico from '@/components/historia-clinica/Pronostico';

interface PronosticoCardProps {
    formData: any;
    handlePronosticoChange: any;
}

export const PronosticoCard: React.FC<PronosticoCardProps> = ({
    formData,
    handlePronosticoChange,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="pronostico">
                    <Pronostico
                        formData={formData}
                        handlePronosticoChange={handlePronosticoChange}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
