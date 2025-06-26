
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';

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

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    setIsMaximized(false);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsMinimized(false);
    setIsMaximized(false);
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-0.5 sm:p-1">
              <button className="px-3 sm:px-5 py-1 sm:py-1.5 rounded-full transition-all duration-300 text-xs sm:text-sm bg-blue-500 text-white shadow-md">
                Formulario
              </button>
              <button className="px-3 sm:px-5 py-1 sm:py-1.5 rounded-full transition-all duration-300 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                Redacción IA
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={handleMinimize} className="p-0.5 sm:p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button onClick={handleMaximize} className="p-0.5 sm:p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors">
              <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button onClick={handleClose} className="p-0.5 sm:p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        <div className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">XIII.</span> EXAMEN INTRABUCAL
          </h2>
        </div>

        {!isMinimized && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Mucosas</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Mucosa yugal</label>
                  <select 
                    value={formData.examenIntrabucal?.mucosaYugal || ''}
                    onChange={(e) => handleExamenIntrabucalChange('mucosaYugal', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="normal">Normal</option>
                    <option value="eritematosa">Eritematosa</option>
                    <option value="ulcerada">Ulcerada</option>
                    <option value="hiperqueratosica">Hiperqueratósica</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Paladar duro</label>
                  <select 
                    value={formData.examenIntrabucal?.paladarDuro || ''}
                    onChange={(e) => handleExamenIntrabucalChange('paladarDuro', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="normal">Normal</option>
                    <option value="inflamado">Inflamado</option>
                    <option value="ulcerado">Ulcerado</option>
                    <option value="torus">Torus palatino</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Paladar blando</label>
                  <select 
                    value={formData.examenIntrabucal?.paladarBlando || ''}
                    onChange={(e) => handleExamenIntrabucalChange('paladarBlando', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="normal">Normal</option>
                    <option value="inflamado">Inflamado</option>
                    <option value="edematoso">Edematoso</option>
                    <option value="petequias">Con petequias</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Órganos</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Lengua</label>
                  <select 
                    value={formData.examenIntrabucal?.lengua || ''}
                    onChange={(e) => handleExamenIntrabucalChange('lengua', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="normal">Normal</option>
                    <option value="saburral">Saburral</option>
                    <option value="geografica">Geográfica</option>
                    <option value="fisurada">Fisurada</option>
                    <option value="vellosa">Vellosa</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Piso de boca</label>
                  <select 
                    value={formData.examenIntrabucal?.pisoBoca || ''}
                    onChange={(e) => handleExamenIntrabucalChange('pisoBoca', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="normal">Normal</option>
                    <option value="inflamado">Inflamado</option>
                    <option value="indurado">Indurado</option>
                    <option value="ulcerado">Ulcerado</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Encías</label>
                  <select 
                    value={formData.examenIntrabucal?.encias || ''}
                    onChange={(e) => handleExamenIntrabucalChange('encias', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="sanas">Sanas</option>
                    <option value="gingivitis">Gingivitis</option>
                    <option value="periodontitis">Periodontitis</option>
                    <option value="hiperplasia">Hiperplasia</option>
                    <option value="recesion">Recesión gingival</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Observaciones adicionales</label>
              <textarea 
                value={formData.examenIntrabucal?.observaciones || ''}
                onChange={(e) => handleExamenIntrabucalChange('observaciones', e.target.value)}
                placeholder="Describe cualquier hallazgo adicional del examen intrabucal..."
                className="w-full mt-2 p-3 border border-gray-300 rounded-md h-20 resize-none"
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExamenIntrabucal;
