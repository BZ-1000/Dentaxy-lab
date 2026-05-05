import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, Eraser } from "lucide-react";
import { FormDataState } from '../types/historiaClinica';

interface OdontogramaInteractivoProps {
  formData: FormDataState;
  handleOdontogramaChange: (pieza: number, estado: "sano" | "caries" | "obturado" | "corona" | "ausente") => void;
  onRedaccionGenerada?: (content: string) => void;
  onToggleViewMode?: () => void;
}

const PIEZAS_SUPERIOR_DER = [18, 17, 16, 15, 14, 13, 12, 11];
const PIEZAS_SUPERIOR_IZQ = [21, 22, 23, 24, 25, 26, 27, 28];
const PIEZAS_INFERIOR_DER = [48, 47, 46, 45, 44, 43, 42, 41];
const PIEZAS_INFERIOR_IZQ = [31, 32, 33, 34, 35, 36, 37, 38];

type EstadoPieza = "sano" | "caries" | "obturado" | "corona" | "ausente";

const ESTADOS_CICLO: EstadoPieza[] = ["sano", "caries", "obturado", "corona", "ausente"];

export const OdontogramaInteractivo: React.FC<OdontogramaInteractivoProps> = ({
  formData,
  handleOdontogramaChange,
  onRedaccionGenerada,
  onToggleViewMode
}) => {
  const odontograma = formData.odontograma || {};

  const handleToothClick = (pieza: number) => {
    const estadoActual = odontograma[pieza] || "sano";
    const currentIndex = ESTADOS_CICLO.indexOf(estadoActual);
    const nextIndex = (currentIndex + 1) % ESTADOS_CICLO.length;
    handleOdontogramaChange(pieza, ESTADOS_CICLO[nextIndex]);
  };

  const limpiarFormulario = () => {
    Object.keys(odontograma).forEach((pieza) => {
      handleOdontogramaChange(parseInt(pieza), "sano");
    });
  };

  const renderTooth = (pieza: number) => {
    const estado = odontograma[pieza] || "sano";
    
    // Asignar clases de CSS basadas en el estado, igual al HTML de referencia
    let className = "w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center font-medium cursor-pointer transition-colors select-none";
    
    if (estado === "caries") className += " bg-[#fef3c7] border-[#d97706] text-[#b45309]"; // amarillo
    else if (estado === "obturado") className += " bg-[#dbeafe] border-[#2563eb] text-[#1d4ed8]"; // azul
    else if (estado === "corona") className += " bg-[#f0fdf4] border-[#059669] text-[#047857]"; // verde
    else if (estado === "ausente") className += " bg-[#fee2e2] border-[#e11d48] text-[#be123c]"; // rojo
    else className += " bg-white text-gray-700 hover:bg-gray-50"; // sano

    return (
      <div 
        key={pieza} 
        className={className}
        onClick={() => handleToothClick(pieza)}
      >
        {estado === "ausente" ? "×" : pieza}
      </div>
    );
  };

  const generateRedaccion = () => {
    // Generar la tabla HTML
    const piezasModificadas = Object.entries(odontograma).filter(([_, estado]) => estado !== "sano");
    
    if (piezasModificadas.length === 0) {
      if (onRedaccionGenerada) {
        onRedaccionGenerada("<p>Paciente con dentición aparentemente sana, sin hallazgos patológicos o tratamientos previos evidentes al momento de la exploración.</p>");
      }
      if (onToggleViewMode) onToggleViewMode();
      return;
    }

    let content = `
    <div style="margin-top: 16px;">
      <h3 style="font-weight: 600; margin-bottom: 12px; color: #111827;">Hallazgos Odontograma</h3>
      <table class="compare-table" style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 600;">Pieza</th>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 600;">Hallazgo</th>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 600;">Diagnóstico presuntivo</th>
          </tr>
        </thead>
        <tbody>
    `;

    piezasModificadas.forEach(([pieza, estado]) => {
      let hallazgo = "";
      let diagnostico = "";
      
      switch(estado) {
        case "caries":
          hallazgo = "Presencia de lesión cariosa";
          diagnostico = "Caries dental — valorar profundidad y tratamiento de obturación";
          break;
        case "obturado":
          hallazgo = "Restauración presente";
          diagnostico = "Diente obturado — en observación";
          break;
        case "corona":
          hallazgo = "Prótesis fija unitaria (Corona)";
          diagnostico = "Diente rehabilitado con corona — en observación";
          break;
        case "ausente":
          hallazgo = "Ausente — espacio edéntulo";
          diagnostico = "Edentulismo parcial — valorar opciones protésicas o implante";
          break;
      }

      content += `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-family: 'DM Mono', monospace;">${pieza}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${hallazgo}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${estado === 'caries' ? `<span style="background: #fef2f2; color: #b91c1c; padding: 2px 4px; border-radius: 4px;">${diagnostico}</span>` : diagnostico}</td>
        </tr>
      `;
    });

    content += `
        </tbody>
      </table>
    </div>
    `;

    if (onRedaccionGenerada) {
      onRedaccionGenerada(content);
    }
    if (onToggleViewMode) {
      onToggleViewMode();
    }
  };

  return (
    <div className='bg-background dark:bg-background transition-colors duration-300' data-section-redaction="true" data-section-name="odontograma" data-formulario-section="odontograma">
      <div className="space-y-6">
        <div className="bg-transparent/50 dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          
          <div className="flex flex-col items-center overflow-x-auto">
            <p className="text-sm font-semibold text-gray-500 mb-4">Superior</p>
            
            <div className="flex gap-1 sm:gap-2 mb-6">
              <div className="flex gap-1 sm:gap-2">
                {PIEZAS_SUPERIOR_DER.map(renderTooth)}
              </div>
              <div className="w-4 sm:w-8 border-l border-gray-300 mx-2"></div>
              <div className="flex gap-1 sm:gap-2">
                {PIEZAS_SUPERIOR_IZQ.map(renderTooth)}
              </div>
            </div>

            <div className="w-full h-px bg-gray-200 my-4 max-w-3xl"></div>

            <div className="flex gap-1 sm:gap-2 mt-6">
              <div className="flex gap-1 sm:gap-2">
                {PIEZAS_INFERIOR_DER.map(renderTooth)}
              </div>
              <div className="w-4 sm:w-8 border-l border-gray-300 mx-2"></div>
              <div className="flex gap-1 sm:gap-2">
                {PIEZAS_INFERIOR_IZQ.map(renderTooth)}
              </div>
            </div>

            <p className="text-sm font-semibold text-gray-500 mt-4">Inferior</p>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-white border border-gray-300"></div>
              <span className="text-sm text-gray-600">Sano</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#fef3c7] border border-[#d97706]"></div>
              <span className="text-sm text-gray-600">Caries</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#dbeafe] border border-[#2563eb]"></div>
              <span className="text-sm text-gray-600">Obturado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#f0fdf4] border border-[#059669]"></div>
              <span className="text-sm text-gray-600">Corona</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#fee2e2] border border-[#e11d48]"></div>
              <span className="text-sm text-gray-600">Ausente</span>
            </div>
          </div>
          
          <p className="text-xs text-center text-gray-400 mt-6">
            * Haz clic repetidamente sobre una pieza para cambiar su estado.
          </p>

        </div>
      </div>

      <div className="flex justify-end items-center gap-4 pt-10 opacity-90 transition-opacity">
        {onToggleViewMode && (
          <Button
            variant="outline"
            onClick={generateRedaccion}
            className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Ver Diagnóstico
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={limpiarFormulario}
          className="text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
        >
          <Eraser className="w-3 h-3 mr-2" />
          Reiniciar Odontograma
        </Button>
      </div>
    </div>
  );
};

export default OdontogramaInteractivo;
