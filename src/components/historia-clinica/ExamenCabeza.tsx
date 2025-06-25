
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState, CaracteristicaFacial } from '@/types/historiaClinica';

interface ExamenCabezaProps {
  formData: FormDataState;
  handleExamenCabezaChange: (field: string, value: any) => void;
}

const ExamenCabeza: React.FC<ExamenCabezaProps> = ({
  formData,
  handleExamenCabezaChange
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

  const handleCheckboxChange = (field: string, checked: boolean) => {
    handleExamenCabezaChange(field, checked);
  };

  const handleSelectChange = (field: string, value: string) => {
    handleExamenCabezaChange(field, value);
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
            <span className="text-gray-400">X.</span> EXAMEN DE CABEZA
          </h2>
        </div>

        {!isMinimized && (
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sinHallazgos"
                  checked={Boolean(formData.examenCabeza?.sinHallazgos)}
                  onChange={(e) => handleCheckboxChange('sinHallazgos', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="sinHallazgos" className="text-sm font-medium">Sin hallazgos</label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Tipo de cráneo</label>
                  <select
                    value={String(formData.examenCabeza?.tipoCraneo || '')}
                    onChange={(e) => handleSelectChange('tipoCraneo', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="mesocefalo">Mesocéfalo</option>
                    <option value="dolicocefalo">Dolicocéfalo</option>
                    <option value="braquicefalo">Braquicéfalo</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Tipo de perfil</label>
                  <select
                    value={String(formData.examenCabeza?.tipoPerfil || '')}
                    onChange={(e) => handleSelectChange('tipoPerfil', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="recto">Recto</option>
                    <option value="convexo">Convexo</option>
                    <option value="concavo">Cóncavo</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Tez</label>
                  <select
                    value={String(formData.examenCabeza?.tez || '')}
                    onChange={(e) => handleSelectChange('tez', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="clara">Clara</option>
                    <option value="morena">Morena</option>
                    <option value="oscura">Oscura</option>
                    <option value="palida">Pálida</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Estado de la piel</label>
                  <input
                    type="text"
                    value={String(formData.examenCabeza?.estadoPiel || '')}
                    onChange={(e) => handleSelectChange('estadoPiel', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Describir estado de la piel..."
                  />
                </div>
              </div>

              {/* Lunares */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Lunares</h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="lunares"
                    checked={Boolean(
                      formData.examenCabeza?.lunares && 
                      typeof formData.examenCabeza.lunares === 'object' && 
                      'presente' in formData.examenCabeza.lunares &&
                      formData.examenCabeza.lunares.presente
                    )}
                    onChange={(e) => {
                      const currentLunares = formData.examenCabeza?.lunares as CaracteristicaFacial || {};
                      handleExamenCabezaChange('lunares', {
                        ...currentLunares,
                        presente: e.target.checked
                      });
                    }}
                    className="mr-2"
                  />
                  <label htmlFor="lunares" className="text-sm font-medium">Presenta lunares</label>
                </div>
                {formData.examenCabeza?.lunares && 
                 typeof formData.examenCabeza.lunares === 'object' && 
                 'presente' in formData.examenCabeza.lunares &&
                 formData.examenCabeza.lunares.presente && (
                  <textarea
                    value={formData.examenCabeza.lunares.detalles || ''}
                    onChange={(e) => {
                      const currentLunares = formData.examenCabeza?.lunares as CaracteristicaFacial || {};
                      handleExamenCabezaChange('lunares', {
                        ...currentLunares,
                        detalles: e.target.value
                      });
                    }}
                    placeholder="Describir características de los lunares..."
                    className="w-full p-2 border border-gray-300 rounded-md h-20 resize-none"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Otros hallazgos</label>
                <textarea
                  value={String(formData.examenCabeza?.otrosHallazgos || '')}
                  onChange={(e) => handleSelectChange('otrosHallazgos', e.target.value)}
                  placeholder="Describir otros hallazgos relevantes..."
                  className="w-full p-3 border border-gray-300 rounded-md h-20 resize-none"
                />
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExamenCabeza;
