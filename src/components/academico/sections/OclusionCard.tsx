import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Oclusion from '@/components/historia-clinica/Oclusion';

interface OclusionCardProps {
    formData: any;
    handleOclusionChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const OclusionCard: React.FC<OclusionCardProps> = ({
    formData,
    handleOclusionChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="oclusion">
                    <Oclusion
                        formData={formData}
                        handleOclusionChange={handleOclusionChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('oclusion', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
