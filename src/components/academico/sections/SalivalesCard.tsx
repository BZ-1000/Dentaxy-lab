import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import GlandulasSalivales from '@/components/historia-clinica/GlandulasSalivales';

interface SalivalesCardProps {
    formData: any;
    handleGlandulasSalivalesChange: any;
}

export const SalivalesCard: React.FC<SalivalesCardProps> = ({
    formData,
    handleGlandulasSalivalesChange,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="salivales">
                    <GlandulasSalivales
                        formData={formData}
                        handleGlandulasSalivalesChange={handleGlandulasSalivalesChange}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
