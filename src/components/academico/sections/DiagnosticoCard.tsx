import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Diagnostico from '@/components/historia-clinica/Diagnostico';

interface DiagnosticoCardProps {
    formData: any;
    handleDiagnosticoChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const DiagnosticoCard: React.FC<DiagnosticoCardProps> = ({
    formData,
    handleDiagnosticoChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="diagnostico">
                    <Diagnostico
                        formData={formData}
                        handleDiagnosticoChange={handleDiagnosticoChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('diagnostico', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
