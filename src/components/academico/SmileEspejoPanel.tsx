import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, ClipboardPaste, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

// All sections that mirror the Dentaxy form
export const seccionesSmile = [
  { id: 'padecimiento', titulo: 'I. Padecimiento Actual' },
  { id: 'heredofamiliares', titulo: 'II. Antecedentes Heredofamiliares' },
  { id: 'noPatologicos', titulo: 'III. Antecedentes Personales No Patológicos' },
  { id: 'patologicos', titulo: 'IV. Antecedentes Personales Patológicos' },
  { id: 'alergicos', titulo: 'V. Antecedentes Alérgicos' },
  { id: 'quirurgicos', titulo: 'VI. Antecedentes Quirúrgicos' },
  { id: 'hemorragicos', titulo: 'VII. Antecedentes Hemorrágicos' },
  { id: 'ginecoObstetricos', titulo: 'VIII. Antecedentes Gineco-obstétricos' },
  { id: 'interrogatorio', titulo: 'IX. Interrogatorio por Aparatos y Sistemas' },
  { id: 'exploracionFisica', titulo: 'X. Exploración Física' },
  { id: 'cabeza', titulo: 'XI. Examen de Cabeza' },
  { id: 'atm', titulo: 'XII. Articulación Craneomandibular' },
  { id: 'cuello', titulo: 'XIII. Examen de Cuello' },
  { id: 'intrabucal', titulo: 'XIV. Examen Intrabucal' },
  { id: 'salivales', titulo: 'XV. Glándulas Salivales' },
  { id: 'oclusion', titulo: 'XVI. Oclusión' },
  { id: 'relacionDientes', titulo: 'XVII. Relación de Dientes' },
  { id: 'lineaMedia', titulo: 'XVIII. Línea Media' },
  { id: 'frenillos', titulo: 'XIX. Frenillos' },
  { id: 'diagnostico', titulo: 'XX. Diagnóstico' },
  { id: 'pronostico', titulo: 'XXI. Pronóstico' },
];

interface SmileEspejoPanelProps {
  contenidoRecibido: Record<string, string>;
  seccionActual?: string;
  todasCompletas?: boolean;
  isGenerating?: boolean;
  copiedContent?: Record<string, string>;
}

export const SmileEspejoPanel: React.FC<SmileEspejoPanelProps> = ({
  contenidoRecibido,
  seccionActual,
  todasCompletas = false,
  isGenerating = false,
  copiedContent,
}) => {
  const [pastedData, setPastedData] = useState<Record<string, string>>({});
  const [isPasted, setIsPasted] = useState(false);

  const seccionesRecibidas = Object.keys(contenidoRecibido).filter(
    (key) => contenidoRecibido[key] && contenidoRecibido[key].trim() !== ''
  );

  const canPaste = todasCompletas && !isGenerating;

  const handlePegarRedacciones = async () => {
    // Use the content passed from parent or try to read from clipboard
    const dataToUse = copiedContent || contenidoRecibido;
    
    if (Object.keys(dataToUse).length === 0) {
      toast({
        title: "Sin contenido",
        description: "Primero debe copiar las redacciones desde Dentaxy",
        variant: "destructive",
      });
      return;
    }

    // Simulate paste animation - paste each section with a small delay
    for (const seccion of seccionesSmile) {
      if (dataToUse[seccion.id]) {
        await new Promise(resolve => setTimeout(resolve, 50));
        setPastedData(prev => ({ ...prev, [seccion.id]: dataToUse[seccion.id] }));
      }
    }

    setIsPasted(true);
    
    toast({
      title: "✓ Contenido Integrado",
      description: "Todas las redacciones han sido transferidas exitosamente a SMILE",
    });
  };

  // Display either pasted data or received data
  const displayData = isPasted ? pastedData : contenidoRecibido;

  return (
    <div className="h-full flex flex-col bg-[#f5f5f5] overflow-hidden">
      {/* Header estilo legacy */}
      <div className="bg-[#e0e0e0] border-b border-gray-400 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-500 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="font-sans text-sm font-bold text-gray-700 uppercase tracking-wide">
              SMILE · Sistema Clínico
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Pegar Redacciones button */}
            <motion.div
              initial={{ opacity: 0.5 }}
              animate={{ opacity: canPaste ? 1 : 0.5 }}
            >
              <Button
                onClick={handlePegarRedacciones}
                disabled={!canPaste || isPasted}
                size="sm"
                className={`text-xs h-8 px-4 gap-1.5 transition-all duration-300 ${
                  isPasted 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                    : canPaste
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                {isPasted ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Pegado
                  </>
                ) : (
                  <>
                    <ClipboardPaste className="h-3.5 w-3.5" />
                    Pegar Redacciones
                  </>
                )}
              </Button>
            </motion.div>
            <span className="text-xs text-gray-500">v2.3.1</span>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-[#ebebeb] px-4 py-2 border-b border-gray-300 flex items-center justify-between flex-shrink-0">
        <span className="text-xs text-gray-600">
          Historia Clínica — Recepción de Datos
        </span>
        <div className="flex items-center gap-2">
          {isGenerating && (
            <span className="text-xs text-amber-600 animate-pulse">
              Recibiendo datos...
            </span>
          )}
          <span className="text-xs text-gray-500">
            {seccionesRecibidas.length} / {seccionesSmile.length} secciones
          </span>
          {todasCompletas && (
            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
          )}
        </div>
      </div>

      {/* Content - Simple textareas */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {seccionesSmile.map((seccion, index) => {
          const tieneContenido = displayData[seccion.id]?.trim();
          const esSeccionActual = seccionActual === seccion.id;

          return (
            <motion.div
              key={seccion.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.02 }}
              className={`space-y-1 transition-all duration-300 ${
                esSeccionActual ? 'ring-2 ring-emerald-400 rounded-lg p-2 -m-2 bg-emerald-50' : ''
              }`}
            >
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                {seccion.titulo}
                {tieneContenido && (
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-normal normal-case">
                    <CheckCircle className="h-3 w-3" />
                  </span>
                )}
                {esSeccionActual && !tieneContenido && (
                  <span className="inline-flex items-center gap-1 text-amber-600 font-normal normal-case">
                    <Clock className="h-3 w-3 animate-pulse" />
                    <span className="text-[10px]">Recibiendo...</span>
                  </span>
                )}
              </label>
              <textarea
                value={displayData[seccion.id] || ''}
                readOnly
                placeholder="Esperando datos de Dentaxy..."
                className={`
                  w-full h-20 px-3 py-2 text-sm
                  bg-white border border-gray-400 rounded
                  font-sans text-gray-800
                  resize-none
                  focus:outline-none
                  ${tieneContenido ? 'bg-yellow-50 border-emerald-300' : 'bg-gray-50'}
                  ${esSeccionActual ? 'animate-pulse' : ''}
                `}
              />
              {tieneContenido && (
                <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {isPasted ? 'Pegado desde portapapeles' : 'Recibido desde Dentaxy'}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="bg-[#e0e0e0] border-t border-gray-400 px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Sistema Tradicional</span>
          <span>{isPasted ? '✓ Datos integrados desde Dentaxy' : 'Sin asistencia IA'}</span>
        </div>
      </div>
    </div>
  );
};

export default SmileEspejoPanel;
