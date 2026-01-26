import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Diagnostico from '@/components/historia-clinica/Diagnostico';

interface DiagnosticoCardProps {
    formData: any;
    handleDiagnosticoChange: any;
}

export const DiagnosticoCard: React.FC<DiagnosticoCardProps> = ({
    formData,
    handleDiagnosticoChange,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="diagnostico">
                    <Diagnostico
                        formData={formData}
                        handleDiagnosticoChange={handleDiagnosticoChange}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
