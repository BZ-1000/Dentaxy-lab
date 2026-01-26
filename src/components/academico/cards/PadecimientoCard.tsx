import React from 'react';
import PadecimientoActual from '@/components/historia-clinica/PadecimientoActual';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PadecimientoCardProps {
    formData: any;
    handlePadecimientoChange: (field: string, value: string) => void;
    handleDolorChange: (field: string, value: any) => void;
    handleSinSintomasChange: (checked: boolean) => void;
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
}

export const PadecimientoCard: React.FC<PadecimientoCardProps> = ({
    formData,
    handlePadecimientoChange,
    handleDolorChange,
    handleSinSintomasChange,
    onSeccionGenerada,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">

            <CardContent>
                <div data-section="padecimiento">
                    <PadecimientoActual
                        formData={formData}
                        handlePadecimientoChange={handlePadecimientoChange}
                        handleDolorChange={handleDolorChange}
                        handleSinSintomasChange={handleSinSintomasChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('padecimiento', content)}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
