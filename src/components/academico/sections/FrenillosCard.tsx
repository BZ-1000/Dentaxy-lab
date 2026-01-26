import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Frenillos from '@/components/historia-clinica/Frenillos';

interface FrenillosCardProps {
    formData: any;
    handleFrenillosChange: any;
}

export const FrenillosCard: React.FC<FrenillosCardProps> = ({
    formData,
    handleFrenillosChange,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="frenillos">
                    <Frenillos
                        formData={formData}
                        handleFrenillosChange={handleFrenillosChange}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
