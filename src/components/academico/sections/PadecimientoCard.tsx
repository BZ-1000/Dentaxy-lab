import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import PadecimientoActual from '@/components/historia-clinica/PadecimientoActual';

interface PadecimientoCardProps {
    formData: any;
    handlePadecimientoChange: (field: string, value: string) => void;
    handleDolorChange: (field: string, value: any) => void;
    handleSinSintomasChange: (checked: boolean) => void;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    onToggleViewMode?: () => void;
}

export const PadecimientoCard: React.FC<PadecimientoCardProps> = ({
    formData,
    handlePadecimientoChange,
    handleDolorChange,
    handleSinSintomasChange,
    onSeccionGenerada,
    onToggleViewMode,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardContent className="pt-6">
                <div data-section="padecimiento">
                    <PadecimientoActual
                        formData={formData}
                        handlePadecimientoChange={handlePadecimientoChange}
                        handleDolorChange={handleDolorChange}
                        handleSinSintomasChange={handleSinSintomasChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('padecimiento', content)}
                        onToggleViewMode={onToggleViewMode}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
