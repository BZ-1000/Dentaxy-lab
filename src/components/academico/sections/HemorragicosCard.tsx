import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import AntecedentesHemorragicos from '@/components/historia-clinica/AntecedentesHemorragicos';

interface HemorragicosCardProps {
    formData: any;
    handleAntecedenteHemorragicoChange: any;
}

export const HemorragicosCard: React.FC<HemorragicosCardProps> = ({
    formData,
    handleAntecedenteHemorragicoChange,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="hemorragicos">
                    <AntecedentesHemorragicos
                        formData={formData}
                        handleAntecedenteHemorragicoChange={handleAntecedenteHemorragicoChange}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
