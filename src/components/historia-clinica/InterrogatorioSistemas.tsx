import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";

interface InterrogatorioSistemasProps {
  formData: FormDataState;
  handleInterrogatorioChange: (system: string, value: string) => void;
}

const InterrogatorioSistemas: React.FC<InterrogatorioSistemasProps> = ({
  formData,
  handleInterrogatorioChange
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState('formulario');
  const [redaccionContent, setRedaccionContent] = useState('');
  const [isGeneratingRedaccion, setIsGeneratingRedaccion] = useState(false);

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

  const handleTextChange = (system: string, value: string) => {
    handleInterrogatorioChange(system, value);
  };

  const generateRedaccion = () => {
    setIsGeneratingRedaccion(true);
    setTimeout(() => {
      let content = "Interrogatorio por aparatos y sistemas:\n\n";

      const generateSystemContent = (systemKey: string, displayName: string) => {
        const value = formData.interrogatorioSistemas[systemKey];
        
        if (!value || value.trim() === '') {
          return `Se interrogó específicamente sobre alteraciones del sistema ${displayName.toLowerCase()}. El paciente niega alteraciones.\n`;
        }

        // Capitalize first letter of each sentence
        const formattedValue = value
          .toLowerCase()
          .split('. ')
          .map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1))
          .join('. ');

        return `Sistema ${displayName.toLowerCase()}: ${formattedValue}.\n`;
      };

      const systems = [
        { key: 'cardiovascular', display: 'Cardiovascular' },
        { key: 'respiratorio', display: 'Respiratorio' },
        { key: 'digestivo', display: 'Digestivo' },
        { key: 'urinario', display: 'Urinario' },
        { key: 'musculoEsqueletico', display: 'Músculo-esquelético' },
        { key: 'nervioso', display: 'Nervioso' },
        { key: 'endocrino', display: 'Endocrino' },
        { key: 'tegumentario', display: 'Tegumentario' }
      ];

      systems.forEach(system => {
        content += generateSystemContent(system.key, system.display);
      });

      setRedaccionContent(content);
      setIsGeneratingRedaccion(false);
      setActiveTab('redaccion');
    }, 1000);
  };

  return (
    <div
      className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}
      data-section-redaction="true"
      data-section-name="interrogatorioSistemas"
    >
      <Card
        className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
              <button
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'formulario' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`}
                onClick={() => setActiveTab('formulario')}
              >
                Formulario
              </button>
              <button
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'redaccion' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`}
                onClick={() => setActiveTab('redaccion')}
              >
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
            <span className="text-gray-400">VII.</span> INTERROGATORIO POR APARATOS Y SISTEMAS
          </h2>
        </div>

        {!isMinimized && (
          <>
            {activeTab === 'formulario' ? (
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Cardiovascular:</label>
                    <Textarea
                      value={formData.interrogatorioSistemas?.cardiovascular || ''}
                      onChange={e => handleTextChange('cardiovascular', e.target.value)}
                      placeholder="Especifique..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Respiratorio:</label>
                    <Textarea
                      value={formData.interrogatorioSistemas?.respiratorio || ''}
                      onChange={e => handleTextChange('respiratorio', e.target.value)}
                      placeholder="Especifique..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Digestivo:</label>
                    <Textarea
                      value={formData.interrogatorioSistemas?.digestivo || ''}
                      onChange={e => handleTextChange('digestivo', e.target.value)}
                      placeholder="Especifique..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Urinario:</label>
                    <Textarea
                      value={formData.interrogatorioSistemas?.urinario || ''}
                      onChange={e => handleTextChange('urinario', e.target.value)}
                      placeholder="Especifique..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Músculo-esquelético:</label>
                    <Textarea
                      value={formData.interrogatorioSistemas?.musculoEsqueletico || ''}
                      onChange={e => handleTextChange('musculoEsqueletico', e.target.value)}
                      placeholder="Especifique..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Nervioso:</label>
                    <Textarea
                      value={formData.interrogatorioSistemas?.nervioso || ''}
                      onChange={e => handleTextChange('nervioso', e.target.value)}
                      placeholder="Especifique..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Endocrino:</label>
                    <Textarea
                      value={formData.interrogatorioSistemas?.endocrino || ''}
                      onChange={e => handleTextChange('endocrino', e.target.value)}
                      placeholder="Especifique..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Tegumentario:</label>
                    <Textarea
                      value={formData.interrogatorioSistemas?.tegumentario || ''}
                      onChange={e => handleTextChange('tegumentario', e.target.value)}
                      placeholder="Especifique..."
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div
                  className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 min-h-[200px] whitespace-pre-wrap"
                  style={{ whiteSpace: 'pre-wrap' }}
                  data-redaction-content
                >
                  {redaccionContent || "No se ha generado redacción aún. Utilice el botón 'Generar Redacción IA' en la pestaña de Formulario."}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'formulario' && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={generateRedaccion}
              disabled={isGeneratingRedaccion}
            >
              {isGeneratingRedaccion ? 'Generando Redacción...' : 'Generar Redacción IA'}
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default InterrogatorioSistemas;
