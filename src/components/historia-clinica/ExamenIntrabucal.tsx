import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, Copy, CheckCircle } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import ExamenIntrabucalForm from './ExamenIntrabucalForm';
import { Button } from "@/components/ui/button";
import { AnimatedTextareaWithTyping } from "@/components/ui/AnimatedTextareaWithTyping";

interface ExamenIntrabucalProps {
  formData: FormDataState;
  handleExamenIntrabucalChange: (part: string, value: string | boolean) => void;
}

const ExamenIntrabucal: React.FC<ExamenIntrabucalProps> = ({
  formData,
  handleExamenIntrabucalChange
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeArea, setActiveArea] = useState<string | null>(null);
  const [completedAreas, setCompletedAreas] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(true);
  const [redacciones, setRedacciones] = useState({
    encias: "",
    paladar: "",
    orofaringe: "",
    mejillas: "",
    retromolar: "",
    lengua: "",
    pisoBoca: ""
  });
  const [copied, setCopied] = useState<{[key: string]: boolean}>({});
  const redaccionesRef = useRef<HTMLDivElement>(null);

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    setIsMaximized(false);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };

  const handleAreaComplete = (area: string, value: string | boolean) => {
    if (value === 'completed') {
      setCompletedAreas(prev => [...prev.filter(a => a !== area), area]);
    }
    handleExamenIntrabucalChange(area, value);
  };

  const generarRedaccionIA = () => {
    const nuevasRedacciones = {
      encias: generarRedaccionPorArea('encias'),
      paladar: generarRedaccionPorArea('paladar'),
      orofaringe: generarRedaccionPorArea('orofaringe'),
      mejillas: generarRedaccionPorArea('mejillas'),
      retromolar: generarRedaccionPorArea('retromolar'),
      lengua: generarRedaccionPorArea('lengua'),
      pisoBoca: generarRedaccionPorArea('pisoBoca')
    };

    setRedacciones(nuevasRedacciones);
    setShowForm(false);
    redaccionesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generarRedaccionPorArea = (area: string) => {
    const areaData = formData.examenIntrabucal?.[area] as any;
    
    if (!areaData || typeof areaData !== 'object') {
      return `No se ha registrado información para ${getTituloArea(area).toLowerCase()}.`;
    }

    let redaccion = `Examen de ${getTituloArea(area).toLowerCase()}: `;
    const caracteristicas: string[] = [];

    // Analizar el color si está presente
    if (areaData.color && areaData.color !== 'Rosado coral') {
      caracteristicas.push(`color ${String(areaData.color).toLowerCase()}`);
    }

    // Analizar la textura si está presente
    if (areaData.textura) {
      if (areaData.textura === 'Otro' && areaData.texturaOtro) {
        caracteristicas.push(`textura ${String(areaData.texturaOtro).toLowerCase()}`);
      } else if (areaData.textura !== 'Lisa') {
        caracteristicas.push(`textura ${String(areaData.textura).toLowerCase()}`);
      }
    }

    // Analizar lesiones si están presentes
    if (areaData.lesiones === 'Sí') {
      if (areaData.tipoLesion && areaData.descripcionLesion) {
        caracteristicas.push(`presencia de ${String(areaData.tipoLesion).toLowerCase()}: ${areaData.descripcionLesion}`);
      } else if (areaData.tipoLesion) {
        caracteristicas.push(`presencia de ${String(areaData.tipoLesion).toLowerCase()}`);
      } else {
        caracteristicas.push('presencia de lesiones');
      }
    }

    // Agregar características específicas del área
    Object.entries(areaData).forEach(([key, value]) => {
      if (key !== 'color' && key !== 'textura' && key !== 'texturaOtro' && 
          key !== 'lesiones' && key !== 'tipoLesion' && key !== 'descripcionLesion' && 
          value === true) {
        caracteristicas.push(getDescripcionCaracteristica(key, area));
      }
    });

    if (caracteristicas.length > 0) {
      redaccion += `se observa ${caracteristicas.join(', ')}.`;
    } else {
      redaccion += 'se observa dentro de parámetros normales, sin alteraciones aparentes.';
    }

    return redaccion;
  };

  const getTituloArea = (area: string) => {
    const titulos = {
      encias: "Encías",
      paladar: "Paladar",
      orofaringe: "Orofaringe",
      mejillas: "Mejillas",
      retromolar: "Región Retromolar",
      lengua: "Lengua",
      pisoBoca: "Piso de Boca"
    };
    return titulos[area] || area;
  };

  const getDescripcionCaracteristica = (caracteristica: string, area: string) => {
    const descripciones = {
      // Características generales
      'inflamacion': 'inflamación',
      'sangrado': 'sangrado',
      'edema': 'edema',
      'hiperqueratosis': 'hiperqueratosis',
      'atrofia': 'atrofia',
      'hiperplasia': 'hiperplasia',
      
      // Específicas de encías
      'retraccion': 'retracción gingival',
      'bolsas': 'presencia de bolsas periodontales',
      
      // Específicas de paladar
      'fisuras': 'fisuras palatinas',
      'torus': 'torus palatino',
      
      // Específicas de lengua
      'fisurasLinguales': 'fisuras linguales',
      'surcos': 'surcos linguales',
      'macroglosia': 'macroglosia',
      'microglosia': 'microglosia',
      
      // Específicas de mejillas
      'linea_alba': 'línea alba',
      'mordedura': 'signos de mordedura',
      
      // Específicas de orofaringe
      'hipertrofia_amigdalina': 'hipertrofia amigdalina',
      'exudado': 'presencia de exudado',
      
      // Específicas de retromolar
      'impactacion': 'impactación dental',
      'pericoronitis': 'pericoronitis'
    };
    
    return descripciones[caracteristica] || caracteristica;
  };

  const handleCopy = async (area: string) => {
    try {
      const { trackCopyClick } = await import('@/utils/trackCopyClick');
      trackCopyClick();
    } catch (error) {
      console.error('Error tracking copy:', error);
    }
    
    if (redacciones[area]) {
      navigator.clipboard.writeText(redacciones[area]);
      setCopied(prev => ({
        ...prev,
        [area]: true
      }));
      setTimeout(() => setCopied(prev => ({
        ...prev,
        [area]: false
      })), 2000);
    }
  };

  const limpiarFormulario = () => {
    const areasIniciales = ['encias', 'paladar', 'orofaringe', 'mejillas', 'retromolar', 'lengua', 'pisoBoca'];
    
    areasIniciales.forEach(area => {
      handleExamenIntrabucalChange(area, '');
    });
    
    setShowForm(true);
    setRedacciones({
      encias: "",
      paladar: "",
      orofaringe: "",
      mejillas: "",
      retromolar: "",
      lengua: "",
      pisoBoca: ""
    });
    setCompletedAreas([]);
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={handleMinimize} className="p-0.5 sm:p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button onClick={handleMaximize} className="p-0.5 sm:p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors">
              <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
        <div className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">XIII.</span> EXAMEN INTRABUCAL
          </h2>
        </div>
        <div className="flex justify-center px-6 py-2">
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-0.5 sm:p-1">
            <button 
              onClick={() => setShowForm(true)}
              className={`px-3 sm:px-5 py-1 sm:py-1.5 rounded-full transition-all duration-300 text-xs sm:text-sm ${
                showForm 
                  ? "bg-blue-500 text-white shadow-md" 
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Formulario
            </button>
            <button 
              onClick={() => setShowForm(false)}
              className={`px-3 sm:px-5 py-1 sm:py-1.5 rounded-full transition-all duration-300 text-xs sm:text-sm ${
                !showForm 
                  ? "bg-blue-500 text-white shadow-md" 
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Redacción IA
            </button>
          </div>
        </div>
        {!isMinimized && (
          <div className="p-6">
            {showForm ? (
              <>
                <div className="relative max-w-md mx-auto">
                  <img
                    src="/lovable-uploads/85981ffd-d2f5-4c51-94ab-9a32dcfd49ec.png"
                    alt="Cavidad oral"
                    className="w-full h-auto sm:w-80 sm:h-80 md:w-96 md:h-96"
                  />

                  <button
                    onClick={() => setActiveArea('encias')}
                    className={`absolute top-[15%] left-[50%] transform -translate-x-1/2 ${completedAreas.includes('encias') ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-1 py-0.5 rounded text-xs transition-colors`}
                  >
                    Encías
                  </button>

                  <button
                    onClick={() => setActiveArea('paladar')}
                    className={`absolute top-[35%] left-[35%] transform -translate-x-1/2 ${completedAreas.includes('paladar') ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-1 py-0.5 rounded text-xs transition-colors`}
                  >
                    Paladar
                  </button>

                  <button
                    onClick={() => setActiveArea('orofaringe')}
                    className={`absolute top-[50%] left-[50%] transform -translate-x-1/2 ${completedAreas.includes('orofaringe') ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-1 py-0.5 rounded text-xs transition-colors`}
                  >
                    Orofaringe
                  </button>

                  <button
                    onClick={() => setActiveArea('mejillas')}
                    className={`absolute top-[40%] right-[15%] ${completedAreas.includes('mejillas') ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-1 py-0.5 rounded text-xs transition-colors`}
                  >
                    Mejillas
                  </button>

                  <button
                    onClick={() => setActiveArea('retromolar')}
                    className={`absolute top-[50%] left-[10%] ${completedAreas.includes('retromolar') ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-1 py-0.5 rounded text-xs transition-colors`}
                  >
                    Retromolar
                  </button>

                  <button
                    onClick={() => setActiveArea('lengua')}
                    className={`absolute bottom-[35%] left-[50%] transform -translate-x-1/2 ${completedAreas.includes('lengua') ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-1 py-0.5 rounded text-xs transition-colors`}
                  >
                    Lengua
                  </button>

                  <button
                    onClick={() => setActiveArea('pisoBoca')}
                    className={`absolute bottom-[25%] left-[50%] transform -translate-x-1/2 ${completedAreas.includes('pisoBoca') ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-1 py-0.5 rounded text-xs transition-colors`}
                  >
                    Piso de boca
                  </button>
                </div>

                <div className="flex justify-center gap-2 mt-6">
                  <Button
                    onClick={generarRedaccionIA}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-2 rounded-md transition-all"
                  >
                    Generar Redacción IA
                  </Button>
                  <Button
                    onClick={limpiarFormulario}
                    variant="outline"
                    className="px-6 py-2 rounded-md transition-all"
                  >
                    Limpiar Formulario
                  </Button>
                </div>

                {activeArea && (
                  <ExamenIntrabucalForm
                    area={activeArea}
                    onClose={() => setActiveArea(null)}
                    formData={formData}
                    handleExamenIntrabucalChange={handleAreaComplete}
                  />
                )}
              </>
            ) : (
              <div ref={redaccionesRef} className="space-y-6">
                <div className="flex justify-center mb-6">
                  <Button
                    onClick={() => setShowForm(true)}
                    variant="outline"
                    className="px-6 py-2 rounded-md transition-all"
                  >
                    Volver al Formulario
                  </Button>
                </div>

                {Object.entries(redacciones).map(([area, redaccion]) => (
                  redaccion && (
                    <div key={area} className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-semibold">{getTituloArea(area)}</h4>
                        <Button
                          onClick={() => handleCopy(area)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          {copied[area] ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                          {copied[area] ? "Copiado" : "Copiar"}
                        </Button>
                      </div>
                      <AnimatedTextareaWithTyping
                        content={redaccion}
                        speed={10}
                        className="min-h-[120px] bg-white dark:bg-gray-800"
                        textAlign="justify"
                      />
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExamenIntrabucal;
