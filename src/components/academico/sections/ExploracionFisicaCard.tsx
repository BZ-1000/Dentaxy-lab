import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ExploracionFisica from '@/components/historia-clinica/ExploracionFisica';

interface ExploracionFisicaCardProps {
    formData: any;
    handleExploracionFisicaChange: any;
}

export const ExploracionFisicaCard: React.FC<ExploracionFisicaCardProps> = ({
    formData,
    handleExploracionFisicaChange,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="exploracionFisica">
                    <ExploracionFisica
                        formData={formData}
                        handleExploracionFisicaChange={handleExploracionFisicaChange}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
