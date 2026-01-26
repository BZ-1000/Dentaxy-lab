import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import AntecedentesGinecoObstetricos from '@/components/historia-clinica/AntecedentesGinecoObstetricos';

interface GinecoObstetricosCardProps {
    formData: any;
    handleAntecedenteGinecoObstetricoChange: any;
}

export const GinecoObstetricosCard: React.FC<GinecoObstetricosCardProps> = ({
    formData,
    handleAntecedenteGinecoObstetricoChange,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="ginecoObstetricos">
                    <AntecedentesGinecoObstetricos
                        formData={formData}
                        handleAntecedenteGinecoObstetricoChange={handleAntecedenteGinecoObstetricoChange}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
