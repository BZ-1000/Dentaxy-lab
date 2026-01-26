import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import InterrogatorioSistemas from '@/components/historia-clinica/InterrogatorioSistemas';

interface InterrogatorioCardProps {
    formData: any;
    handleInterrogatorioChange: any;
}

export const InterrogatorioCard: React.FC<InterrogatorioCardProps> = ({
    formData,
    handleInterrogatorioChange,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="interrogatorio">
                    <InterrogatorioSistemas
                        formData={formData}
                        handleInterrogatorioChange={handleInterrogatorioChange}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
