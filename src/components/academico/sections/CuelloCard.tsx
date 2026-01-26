import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ExamenCuello from '@/components/historia-clinica/ExamenCuello';

interface CuelloCardProps {
    formData: any;
    handleExamenCuelloChange: any;
}

export const CuelloCard: React.FC<CuelloCardProps> = ({
    formData,
    handleExamenCuelloChange,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="cuello">
                    <ExamenCuello
                        formData={formData}
                        handleExamenCuelloChange={handleExamenCuelloChange}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
