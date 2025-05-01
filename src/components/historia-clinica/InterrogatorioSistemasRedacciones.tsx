import React, { useState, forwardRef } from 'react';
import { Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedTextarea } from "@/components/ui/animated-textarea"; // Asegúrate que el componente existe
import { RedaccionesInterrogatorio } from '@/types/historiaClinica'; // Asegúrate que el tipo existe

interface InterrogatorioSistemasRedaccionesProps {
    redacciones: RedaccionesInterrogatorio;
    onBackToForm: () => void;
}

// Usamos forwardRef para poder pasar la ref desde el contenedor
const InterrogatorioSistemasRedacciones = forwardRef<HTMLDivElement, InterrogatorioSistemasRedaccionesProps>(({
    redacciones,
    onBackToForm
}, ref) => {
    const [copied, setCopied] = useState<Record<string, boolean>>({});

    const handleCopy = (section: keyof RedaccionesInterrogatorio) => {
        navigator.clipboard.writeText(redacciones[section])
            .then(() => {
                setCopied(prev => ({ ...prev, [section]: true }));
                setTimeout(() => setCopied(prev => ({ ...prev, [section]: false })), 2000);
            })
            .catch(err => {
                console.error('Error al copiar texto: ', err);
                // Opcional: Mostrar un mensaje de error al usuario
            });
    };

    const renderSection = (key: keyof RedaccionesInterrogatorio, title: string) => (
        <div key={key} className="bg-gray-50 dark:bg-gray-900/80 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold">{title}</h4>
                <button onClick={() => handleCopy(key)} className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-xs p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors">
                    {copied[key] ? (
                        <>
                            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                            <span>Copiado</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar</span>
                        </>
                    )}
                </button>
            </div>
            <AnimatedTextarea
                content={redacciones[key] || "No se ha generado texto para esta sección."}
                className="min-h-[120px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm leading-relaxed"
                readOnly
                textAlign="justify"
            />
        </div>
    );

    return (
        // Adjuntamos la ref al div principal de este componente
        <div ref={ref} className="space-y-6">
            {renderSection("digestivo", "Aparato Digestivo")}
            {renderSection("respiratorio", "Aparato Respiratorio")}
            {renderSection("cardiovascular", "Aparato Cardiovascular")}
            {renderSection("genitoUrinario", "Aparato Genito-Urinario")}
            {renderSection("endocrino", "Sistema Endocrino")}
            {renderSection("tegumentario", "Sistema Tegumentario")}
            {renderSection("musculoEsqueletico", "Sistema Músculo-Esquelético")}
            {renderSection("nervioso", "Sistema Nervioso")}

            <div className="flex justify-center pt-4">
                <Button onClick={onBackToForm} variant="outline" className="text-blue-500 border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/50">
                    Volver al Formulario
                </Button>
            </div>
        </div>
    );
});

// Añadir displayName para debugging en React DevTools
InterrogatorioSistemasRedacciones.displayName = 'InterrogatorioSistemasRedacciones';


export default InterrogatorioSistemasRedacciones;