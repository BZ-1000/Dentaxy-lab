import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Oclusion from '@/components/historia-clinica/Oclusion';

interface OclusionCardProps {
    formData: any;
    handleOclusionChange: any;
}

export const OclusionCard: React.FC<OclusionCardProps> = ({
    formData,
    handleOclusionChange,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="oclusion">
                    <Oclusion
                        formData={formData}
                        handleOclusionChange={handleOclusionChange}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
