import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import InterrogatorioSistemas from '@/components/historia-clinica/InterrogatorioSistemas';

interface InterrogatorioCardProps {
    formData: any;
    handleInterrogatorioChange: any;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const InterrogatorioCard: React.FC<InterrogatorioCardProps> = ({
    formData,
    handleInterrogatorioChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="interrogatorio">
                    <InterrogatorioSistemas
                        formData={formData}
                        handleInterrogatorioChange={handleInterrogatorioChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('interrogatorio', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
