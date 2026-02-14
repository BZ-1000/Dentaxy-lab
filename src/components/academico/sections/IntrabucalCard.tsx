import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ExamenIntrabucal from '@/components/historia-clinica/ExamenIntrabucal';

interface IntrabucalCardProps {
    formData: any;
    handleExamenIntrabucalChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const IntrabucalCard: React.FC<IntrabucalCardProps> = ({
    formData,
    handleExamenIntrabucalChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="intrabucal">
                    <ExamenIntrabucal
                        formData={formData}
                        handleExamenIntrabucalChange={handleExamenIntrabucalChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('intrabucal', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
