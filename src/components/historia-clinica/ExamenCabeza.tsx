
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';

interface ExamenCabezaProps {
  formData: FormDataState;
  handleExamenCabezaChange: (part: string, value: any) => void;
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Forma del cráneo */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Forma del Cráneo</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Tipo craneal</label>
                  <select 
                    value={formData.examenCabeza?.tipoCraneal || ''}
                    onChange={(e) => handleExamenCabezaChange('tipoCraneal', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="mesocefalo">Mesocéfalo</option>
                    <option value="dolicocefalo">Dolicocéfalo</option>
                    <option value="braquicefalo">Braquicéfalo</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Perfil facial</label>
                  <select 
                    value={formData.examenCabeza?.perfilFacial || ''}
                    onChange={(e) => handleExamenCabezaChange('perfilFacial', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="recto">Recto</option>
                    <option value="convexo">Convexo</option>
                    <option value="concavo">Cóncavo</option>
                  </select>
                </div>
              </div>

              {/* Características faciales */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Características Faciales</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Asimetría facial</label>
                  <select 
                    value={formData.examenCabeza?.asimetriaFacial || ''}
                    onChange={(e) => handleExamenCabezaChange('asimetriaFacial', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="ausente">Ausente</option>
                    <option value="leve">Leve</option>
                    <option value="moderada">Moderada</option>
                    <option value="severa">Severa</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Edema</label>
                  <select 
                    value={formData.examenCabeza?.edema || ''}
                    onChange={(e) => handleExamenCabezaChange('edema', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="ausente">Ausente</option>
                    <option value="palpebral">Palpebral</option>
                    <option value="facial">Facial generalizado</option>
                    <option value="localizado">Localizado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Lesiones en piel */}
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Lesiones en Piel</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Lunares</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.examenCabeza?.lunares?.presente || false}
                        onChange={(e) => handleExamenCabezaChange('lunares', {
                          ...formData.examenCabeza?.lunares,
                          presente: e.target.checked
                        })}
                        className="mr-2"
                      />
                      Presente
                    </label>
                    {formData.examenCabeza?.lunares?.presente && (
                      <textarea
                        placeholder="Descripción de lunares..."
                        value={formData.examenCabeza?.lunares?.detalles || ''}
                        onChange={(e) => handleExamenCabezaChange('lunares', {
                          ...formData.examenCabeza?.lunares,
                          detalles: e.target.value
                        })}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        rows={2}
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Cicatrices</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.examenCabeza?.cicatrices?.presente || false}
                        onChange={(e) => handleExamenCabezaChange('cicatrices', {
                          ...formData.examenCabeza?.cicatrices,
                          presente: e.target.checked
                        })}
                        className="mr-2"
                      />
                      Presente
                    </label>
                    {formData.examenCabeza?.cicatrices?.presente && (
                      <textarea
                        placeholder="Descripción de cicatrices..."
                        value={formData.examenCabeza?.cicatrices?.detalles || ''}
                        onChange={(e) => handleExamenCabezaChange('cicatrices', {
                          ...formData.examenCabeza?.cicatrices,
                          detalles: e.target.value
                        })}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        rows={2}
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Otras lesiones</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.examenCabeza?.otrasLesiones?.presente || false}
                        onChange={(e) => handleExamenCabezaChange('otrasLesiones', {
                          ...formData.examenCabeza?.otrasLesiones,
                          presente: e.target.checked
                        })}
                        className="mr-2"
                      />
                      Presente
                    </label>
                    {formData.examenCabeza?.otrasLesiones?.presente && (
                      <textarea
                        placeholder="Descripción de otras lesiones..."
                        value={formData.examenCabeza?.otrasLesiones?.detalles || ''}
                        onChange={(e) => handleExamenCabezaChange('otrasLesiones', {
                          ...formData.examenCabeza?.otrasLesiones,
                          detalles: e.target.value
                        })}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        rows={2}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Observaciones adicionales</label>
              <textarea 
                value={formData.examenCabeza?.observaciones || ''}
                onChange={(e) => handleExamenCabezaChange('observaciones', e.target.value)}
                placeholder="Describe cualquier hallazgo adicional del examen de cabeza..."
                className="w-full mt-2 p-3 border border-gray-300 rounded-md h-20 resize-none"
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExamenCabeza;
