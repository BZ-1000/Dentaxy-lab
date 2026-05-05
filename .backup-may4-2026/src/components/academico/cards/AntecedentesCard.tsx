import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AntecedentesHeredoFamiliares from '@/components/historia-clinica/AntecedentesHeredoFamiliares';
import AntecedentesPersonalesNoPatologicos from '@/components/historia-clinica/AntecedentesPersonalesNoPatologicos';
import AntecedentesPersonalesPatologicos from '@/components/historia-clinica/AntecedentesPersonalesPatologicos';
import AntecedentesAlergicos from '@/components/historia-clinica/AntecedentesAlergicos';
import AntecedentesQuirurgicos from '@/components/historia-clinica/AntecedentesQuirurgicos';
import AntecedentesHemorragicos from '@/components/historia-clinica/AntecedentesHemorragicos';
import AntecedentesGinecoObstetricos from '@/components/historia-clinica/AntecedentesGinecoObstetricos';
import InterrogatorioSistemas from '@/components/historia-clinica/InterrogatorioSistemas';

interface AntecedentesCardProps {
    formData: any;
    handlers: {
        handleFamiliarChange: any;
        handleCondicionChange: any;
        handleAntecedenteNoPatologicoChange: any;
        toggleService: any;
        handleAntecedentePatologicoChange: any;
        handleAntecedenteAlergicoChange: any;
        handleAntecedenteQuirurgicoChange: any;
        handleAntecedenteHemorragicoChange: any;
        handleAntecedenteGinecoObstetricoChange: any;
        handleInterrogatorioChange: any;
    };
    onSeccionGenerada: (seccionId: string, contenido: string) => void;
    esMujer: boolean;
}

export const AntecedentesCard: React.FC<AntecedentesCardProps> = ({
    formData,
    handlers,
    onSeccionGenerada,
    esMujer,
}) => {
    return (
        <Card className="mb-6 shadow-md border-0 dark:bg-gray-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Antecedentes Clínicos
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                <div data-section="heredofamiliares">
                    <AntecedentesHeredoFamiliares
                        formData={formData}
                        handleFamiliarChange={handlers.handleFamiliarChange}
                        handleCondicionChange={handlers.handleCondicionChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('heredofamiliares', content)}
                    />
                </div>

                <div data-section="noPatologicos">
                    <AntecedentesPersonalesNoPatologicos
                        formData={formData}
                        handleAntecedenteNoPatologicoChange={handlers.handleAntecedenteNoPatologicoChange}
                        toggleService={handlers.toggleService}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('noPatologicos', content)}
                    />
                </div>

                <div data-section="patologicos">
                    <AntecedentesPersonalesPatologicos
                        formData={formData}
                        handleAntecedentePatologicoChange={handlers.handleAntecedentePatologicoChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('patologicos', content)}
                    />
                </div>

                <div data-section="alergicos">
                    <AntecedentesAlergicos
                        formData={formData}
                        handleAntecedenteAlergicoChange={handlers.handleAntecedenteAlergicoChange}
                    />
                </div>

                <div data-section="quirurgicos">
                    <AntecedentesQuirurgicos
                        formData={formData}
                        handleAntecedenteQuirurgicoChange={handlers.handleAntecedenteQuirurgicoChange}
                        onRedaccionGenerada={(content: string) => onSeccionGenerada('quirurgicos', content)}
                    />
                </div>

                <div data-section="hemorragicos">
                    <AntecedentesHemorragicos
                        formData={formData}
                        handleAntecedenteHemorragicoChange={handlers.handleAntecedenteHemorragicoChange}
                    />
                </div>

                {esMujer && (
                    <div data-section="ginecoObstetricos">
                        <AntecedentesGinecoObstetricos
                            formData={formData}
                            handleAntecedenteGinecoObstetricoChange={handlers.handleAntecedenteGinecoObstetricoChange}
                        />
                    </div>
                )}

                <div data-section="interrogatorio">
                    <InterrogatorioSistemas
                        formData={formData}
                        handleInterrogatorioChange={handlers.handleInterrogatorioChange}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
