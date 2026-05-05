import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import ExploracionFisica from '@/components/historia-clinica/ExploracionFisica';
import ExamenCabeza from '@/components/historia-clinica/ExamenCabeza';
import ArticulacionCraneomandibular from '@/components/historia-clinica/ArticulacionCraneomandibular';
import ExamenCuello from '@/components/historia-clinica/ExamenCuello';
import ExamenIntrabucal from '@/components/historia-clinica/ExamenIntrabucal';
import GlandulasSalivales from '@/components/historia-clinica/GlandulasSalivales';
import Oclusion from '@/components/historia-clinica/Oclusion';
import RelacionDientes from '@/components/historia-clinica/RelacionDientes';
import LineaMedia from '@/components/historia-clinica/LineaMedia';
import Frenillos from '@/components/historia-clinica/Frenillos';
import Diagnostico from '@/components/historia-clinica/Diagnostico';
import Pronostico from '@/components/historia-clinica/Pronostico';

interface ExploracionCardProps {
    formData: any;
    handlers: {
        handleExploracionFisicaChange: any;
        handleExamenCabezaChange: any;
        handleArticulacionCraneomandibularChange: any;
        handleExamenCuelloChange: any;
        handleExamenIntrabucalChange: any;
        handleGlandulasSalivalesChange: any;
        handleOclusionChange: any;
        handleRelacionDientesChange: any;
        handleLineaMediaChange: any;
        handleFrenillosChange: any;
        handleDiagnosticoChange: any;
        handlePronosticoChange: any;
    };
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
}

export const ExploracionCard: React.FC<ExploracionCardProps> = ({
    formData,
    handlers,
    onSeccionGenerada,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Exploración Física y Diagnóstico
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                <div data-section="exploracionFisica">
                    <ExploracionFisica
                        formData={formData}
                        handleExploracionFisicaChange={handlers.handleExploracionFisicaChange}
                    />
                </div>

                <div data-section="cabeza">
                    <ExamenCabeza
                        formData={formData}
                        handleExamenCabezaChange={handlers.handleExamenCabezaChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('cabeza', content)}
                    />
                </div>

                <div data-section="atm">
                    <ArticulacionCraneomandibular
                        formData={formData}
                        handleArticulacionCraneomandibularChange={handlers.handleArticulacionCraneomandibularChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('atm', content)}
                    />
                </div>

                <div data-section="cuello">
                    <ExamenCuello
                        formData={formData}
                        handleExamenCuelloChange={handlers.handleExamenCuelloChange}
                    />
                </div>

                <div data-section="intrabucal">
                    <ExamenIntrabucal
                        formData={formData}
                        handleExamenIntrabucalChange={handlers.handleExamenIntrabucalChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('intrabucal', content)}
                    />
                </div>

                <div data-section="salivales">
                    <GlandulasSalivales
                        formData={formData}
                        handleGlandulasSalivalesChange={handlers.handleGlandulasSalivalesChange}
                    />
                </div>

                <div data-section="oclusion">
                    <Oclusion
                        formData={formData}
                        handleOclusionChange={handlers.handleOclusionChange}
                    />
                </div>

                <div data-section="relacionDientes">
                    <RelacionDientes
                        formData={formData}
                        handleRelacionDientesChange={handlers.handleRelacionDientesChange}
                    />
                </div>

                <div data-section="lineaMedia">
                    <LineaMedia
                        formData={formData}
                        handleLineaMediaChange={handlers.handleLineaMediaChange}
                    />
                </div>

                <div data-section="frenillos">
                    <Frenillos
                        formData={formData}
                        handleFrenillosChange={handlers.handleFrenillosChange}
                    />
                </div>

                <div data-section="diagnostico">
                    <Diagnostico
                        formData={formData}
                        handleDiagnosticoChange={handlers.handleDiagnosticoChange}
                    />
                </div>

                <div data-section="pronostico">
                    <Pronostico
                        formData={formData}
                        handlePronosticoChange={handlers.handlePronosticoChange}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
