
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';

interface ExploracionFisicaProps {
  formData: FormDataState;
  handleExploracionFisicaChange: (field: string, value: string | number) => void;
}

const ExploracionFisica: React.FC<ExploracionFisicaProps> = ({
  formData,
  handleExploracionFisicaChange
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
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
              <button className="px-5 py-1.5 rounded-full transition-all duration-300 text-sm bg-blue-500 text-white shadow-md">
                Formulario
              </button>
              <button className="px-5 py-1.5 rounded-full transition-all duration-300 text-sm text-gray-700 dark:text-gray-300">
                Redacción IA
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleMinimize} className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
              <Minus className="w-4 h-4" />
            </button>
            <button onClick={handleMaximize} className="p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors">
              <Maximize2 className="w-4 h-4" />
            </button>
            <button onClick={handleClose} className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">IX.</span> EXPLORACIÓN FÍSICA
          </h2>
        </div>

        {!isMinimized && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.exploracionFisica?.peso || ''}
                  onChange={(e) => handleExploracionFisicaChange('peso', parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Talla (m)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.exploracionFisica?.talla || ''}
                  onChange={(e) => handleExploracionFisicaChange('talla', parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">IMC</label>
                <input
                  type="number"
                  step="0.1"
                  value={
                    formData.exploracionFisica?.peso && formData.exploracionFisica?.talla 
                      ? (formData.exploracionFisica.peso / Math.pow(formData.exploracionFisica.talla, 2)).toFixed(1)
                      : ''
                  }
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Presión arterial (mmHg)</label>
                <input
                  type="text"
                  placeholder="120/80"
                  value={formData.exploracionFisica?.presionArterial || ''}
                  onChange={(e) => handleExploracionFisicaChange('presionArterial', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Pulso (ppm)</label>
                <input
                  type="number"
                  value={formData.exploracionFisica?.pulso || ''}
                  onChange={(e) => handleExploracionFisicaChange('pulso', parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Frecuencia cardíaca (lpm)</label>
                <input
                  type="number"
                  value={formData.exploracionFisica?.frecuenciaCardiaca || ''}
                  onChange={(e) => handleExploracionFisicaChange('frecuenciaCardiaca', parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Temperatura (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.exploracionFisica?.temperatura || ''}
                  onChange={(e) => handleExploracionFisicaChange('temperatura', parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Frecuencia respiratoria (rpm)</label>
                <input
                  type="number"
                  value={formData.exploracionFisica?.frecuenciaRespiratoria || ''}
                  onChange={(e) => handleExploracionFisicaChange('frecuenciaRespiratoria', parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Saturación de O₂ (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.exploracionFisica?.saturacionOxigeno || ''}
                  onChange={(e) => handleExploracionFisicaChange('saturacionOxigeno', parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Observaciones adicionales</label>
              <textarea 
                value={formData.exploracionFisica?.observaciones || ''}
                onChange={(e) => handleExploracionFisicaChange('observaciones', e.target.value)}
                placeholder="Describe cualquier hallazgo adicional de la exploración física..."
                className="w-full mt-2 p-3 border border-gray-300 rounded-md h-20 resize-none"
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExploracionFisica;
