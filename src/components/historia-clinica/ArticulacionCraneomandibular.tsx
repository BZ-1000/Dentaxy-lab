import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/ui/voice-input";

interface ArticulacionCraneomandibularProps {
  formData: FormDataState;
  handleArticulacionCraneomandibularChange: (part: string, value: string | boolean | object) => void;
}

const ArticulacionCraneomandibular: React.FC<ArticulacionCraneomandibularProps> = ({
  formData,
  handleArticulacionCraneomandibularChange
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
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

  useEffect(() => {
    if (!formData.articulacionCraneomandibular.labios) {
      handleArticulacionCraneomandibularChange('labios', {
        simetria: '',
        volumen: '',
        coloracion: '',
        hidratacion: '',
        integridad: '',
        comisuras: '',
        movimiento: '',
        otrasObservaciones: ''
      });
    }
  }, [formData.articulacionCraneomandibular]);

  const handleToggleButton = (field: string, section: 'articulacionCraneomandibular' | 'labios') => {
    if (section === 'articulacionCraneomandibular') {
      handleArticulacionCraneomandibularChange(field, !formData.articulacionCraneomandibular[field]);
    } else {
      const labios = formData.articulacionCraneomandibular.labios || {};
      handleArticulacionCraneomandibularChange(`labios.${field}`, !labios[field]);
    }
  };

  const handleTextChange = (field: string, value: string, section: 'articulacionCraneomandibular' | 'labios') => {
    if (section === 'articulacionCraneomandibular') {
      handleArticulacionCraneomandibularChange(field, value);
    } else {
      handleArticulacionCraneomandibularChange(`labios.${field}`, value);
    }
  };

  const handleVoiceInput = (field: string, section: 'articulacionCraneomandibular' | 'labios') => (text: string) => {
    const currentValue = section === 'articulacionCraneomandibular'
      ? formData.articulacionCraneomandibular[field]
      : formData.articulacionCraneomandibular.labios?.[field];
    handleTextChange(field, currentValue ? `${currentValue} ${text}` : text, section);
  };

  const generateRedaccion = () => {
    setIsGeneratingRedaccion(true);
    setTimeout(() => {
      let content = "Al examen clínico se observan ";

      const labios = formData.articulacionCraneomandibular.labios || {};

      const simetria = labios.simetria === 'simetricos' ? 'labios simétricos' :
                       labios.simetria === 'asimetricosDerecha' ? 'labios asimétricos con desviación hacia la derecha' :
                       labios.simetria === 'asimetricosIzquierda' ? 'labios asimétricos con desviación hacia la izquierda' :
                       'labios con simetría no evaluada';
      content += `${simetria}. `;

      const volumen = labios.volumen === 'delgados' ? 'de volumen delgado' :
                     labios.volumen === 'medianos' ? 'de volumen medio' :
                     labios.volumen === 'gruesos' ? 'de volumen grueso' :
                     'con volumen no evaluado';
      content += `Los labios son ${volumen}, `;

      const coloracionMap: {[key: string]: string} = {
        'normal': 'rosados (normal)',
        'palidos': 'pálidos',
        'cianoticos': 'cianóticos',
        'eritematosos': 'eritematosos'
      };
      const coloracion = coloracionMap[labios.coloracion as string] || 'con coloración no evaluada';
      content += `con una coloración ${coloracion}. `;

      const hidratacionMap: {[key: string]: string} = {
        'hidratados': 'labios hidratados',
        'secos': 'labios secos',
        'agrietados': 'labios agrietados',
        'costras': 'presencia de costras'
      };
      const hidratacion = hidratacionMap[labios.hidratacion as string] || 'hidratación no evaluada';
      content += `La hidratación/superficie presenta ${hidratacion}. `;

      const integridadMap: {[key: string]: string} = {
        'intactos': 'labios íntegros',
        'heridas': 'heridas',
        'ulceraciones': 'ulceraciones',
        'fisuras': 'fisuras comisurales'
      };
      const integridad = integridadMap[labios.integridad as string] || 'integridad no evaluada';
      content += `Se observan ${integridad}. `;

      const comisurasMap: {[key: string]: string} = {
        'normales': 'comisuras normales',
        'erosionadas': 'comisuras erosionadas',
        'queilitis': 'queilitis angular'
      };
      const comisuras = comisurasMap[labios.comisuras as string] || 'comisuras no evaluadas';
      content += `Las comisuras labiales presentan ${comisuras}. `;

      const movimientoMap: {[key: string]: string} = {
        'normales': 'movimientos normales',
        'restriccion': 'restricción de movimiento',
        'incompetencia': 'incompetencia labial'
      };
      const movimiento = movimientoMap[labios.movimiento as string] || 'movimiento no evaluado';
      content += `El movimiento y función muestra ${movimiento}. `;

      if (labios.otrasObservaciones) {
        content += `Como observación adicional, ${labios.otrasObservaciones}.`;
      }

      if (formData.articulacionCraneomandibular.dolorMasticarHablar === true) {
        content += `\n\nEl paciente refiere dolor al masticar o hablar. `;

        if (formData.articulacionCraneomandibular.tipoDolor) {
          content += `El tipo de dolor es: ${formData.articulacionCraneomandibular.tipoDolor}. `;
        }

        if (formData.articulacionCraneomandibular.duracionDolor) {
          content += `La duración del dolor es: ${formData.articulacionCraneomandibular.duracionDolor}.`;
        }
      } else if (formData.articulacionCraneomandibular.dolorMasticarHablar === false) {
        content += `\n\nEl paciente no refiere dolor al masticar o hablar. `;
      }

      if (formData.articulacionCraneomandibular.dolorEspecifico === true && formData.articulacionCraneomandibular.motivoDolor) {
        content += `\n\nSe reporta dolor específico por: ${formData.articulacionCraneomandibular.motivoDolor}. `;
      }

      if (formData.articulacionCraneomandibular.ruidoArticular) {
        content += `Se observa ruido articular durante la ${formData.articulacionCraneomandibular.ruidoArticular}. `;
      }

      if (formData.articulacionCraneomandibular.patronAbertura) {
        const patronMap: {[key: string]: string} = {
          'recto': 'recto',
          'desviacionDerecha': 'con desviación a la derecha',
          'desviacionIzquierda': 'con desviación a la izquierda',
          'formaS': 'en forma de S',
          'otro': 'otro patrón'
        };

        content += `\n\nEl patrón de abertura mandibular es ${patronMap[formData.articulacionCraneomandibular.patronAbertura]}`;

        if (formData.articulacionCraneomandibular.patronAbertura === 'otro' && formData.articulacionCraneomandibular.otroPatronAbertura) {
          content += `: ${formData.articulacionCraneomandibular.otroPatronAbertura}`;
        }
        content += '. ';
      }

      if (formData.articulacionCraneomandibular.otrasObservaciones) {
        content += `\n\nObservaciones adicionales sobre la articulación craneomandibular: ${formData.articulacionCraneomandibular.otrasObservaciones}.`;
      }

      setRedaccionContent(content);
      setIsGeneratingRedaccion(false);
    }, 1000);
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`} data-section-name="articulacionCraneomandibular">
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
              <button
                className="px-5 py-1.5 rounded-full transition-all duration-300 text-sm bg-blue-500 text-white shadow-md"
              >
                Formulario
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
            <span className="text-gray-400">XI.</span> ARTICULACIÓN CRANEOMANDIBULAR Y LABIOS
          </h2>
        </div>

        {!isMinimized && (
          <div className="p-6">
            {redaccionContent ? (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 min-h-[200px] whitespace-pre-wrap" style={{ whiteSpace: 'pre-wrap' }} data-redaction-content>
                {redaccionContent}
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Articulación Craneomandibular</h3>

                <div>
                  <h4 className="text-md font-medium mb-2">¿Dolor al masticar o al hablar?</h4>
                  <div className="flex gap-4">
                    <button
                      className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.dolorMasticarHablar === true ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                      onClick={() => handleArticulacionCraneomandibularChange('dolorMasticarHablar', true)}
                    >
                      Sí
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.dolorMasticarHablar === false ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                      onClick={() => handleArticulacionCraneomandibularChange('dolorMasticarHablar', false)}
                    >
                      No
                    </button>
                  </div>
                </div>

                {formData.articulacionCraneomandibular?.dolorMasticarHablar === true && (
                  <>
                    <div className="relative">
                      <label className="block text-sm font-medium mb-1">Tipo de dolor:</label>
                      <div className="flex items-center">
                        <Textarea
                          value={formData.articulacionCraneomandibular?.tipoDolor || ''}
                          onChange={e => handleTextChange('tipoDolor', e.target.value, 'articulacionCraneomandibular')}
                          placeholder="Describa el tipo de dolor"
                          className="min-h-[80px] flex-1"
                        />
                        <div className="ml-2">
                          <VoiceInput onTranscriptionComplete={handleVoiceInput('tipoDolor', 'articulacionCraneomandibular')} />
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium mb-1">Duración:</label>
                      <div className="flex items-center">
                        <Textarea
                          value={formData.articulacionCraneomandibular?.duracionDolor || ''}
                          onChange={e => handleTextChange('duracionDolor', e.target.value, 'articulacionCraneomandibular')}
                          placeholder="Describa la duración del dolor"
                          className="min-h-[80px] flex-1"
                        />
                        <div className="ml-2">
                          <VoiceInput onTranscriptionComplete={handleVoiceInput('duracionDolor', 'articulacionCraneomandibular')} />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <h4 className="text-md font-medium mb-2">¿Dolor específico?</h4>
                  <div className="flex gap-4">
                    <button
                      className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.dolorEspecifico === true ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                      onClick={() => handleArticulacionCraneomandibularChange('dolorEspecifico', true)}
                    >
                      Sí
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.dolorEspecifico === false ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                      onClick={() => handleArticulacionCraneomandibularChange('dolorEspecifico', false)}
                    >
                      No
                    </button>
                  </div>
                </div>

                {formData.articulacionCraneomandibular?.dolorEspecifico === true && (
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Motivo del dolor:</label>
                    <div className="flex items-center">
                      <Textarea
                        value={formData.articulacionCraneomandibular?.motivoDolor || ''}
                        onChange={e => handleTextChange('motivoDolor', e.target.value, 'articulacionCraneomandibular')}
                        placeholder="Describa el motivo del dolor"
                        className="min-h-[80px] flex-1"
                      />
                      <div className="ml-2">
                        <VoiceInput onTranscriptionComplete={handleVoiceInput('motivoDolor', 'articulacionCraneomandibular')} />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-md font-medium mb-2">Ruido articular:</h4>
                  <div className="flex gap-4">
                    <button
                      className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.ruidoArticular === 'abertura' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                      onClick={() => handleArticulacionCraneomandibularChange('ruidoArticular', 'abertura')}
                    >
                      Abertura
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.ruidoArticular === 'cierre' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                      onClick={() => handleArticulacionCraneomandibularChange('ruidoArticular', 'cierre')}
                    >
                      Cierre
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium mb-2">Patrón de abertura mandibular:</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[
                      { label: "Recto", value: "recto" },
                      { label: "Desviación a la derecha", value: "desviacionDerecha" },
                      { label: "Desviación a la izquierda", value: "desviacionIzquierda" },
                      { label: "En forma de 'S'", value: "formaS" },
                      { label: "Otro (especificar)", value: "otro" }
                    ].map(item => (
                      <button
                        key={item.value}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${formData.articulacionCraneomandibular?.patronAbertura === item.value ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
                        onClick={() => handleArticulacionCraneomandibularChange('patronAbertura', item.value)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.articulacionCraneomandibular?.patronAbertura === 'otro' && (
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Especifique:</label>
                    <div className="flex items-center">
                      <Textarea
                        value={formData.articulacionCraneomandibular?.otroPatronAbertura || ''}
                        onChange={e => handleTextChange('otroPatronAbertura', e.target.value, 'articulacionCraneomandibular')}
                        placeholder="Especifique el patrón de abertura"
                        className="min-h-[80px] flex-1"
                      />
                      <div className="ml-2">
                        <VoiceInput onTranscriptionComplete={handleVoiceInput('otroPatronAbertura', 'articulacionCraneomandibular')} />
                      </div>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <label className="block text-sm font-medium mb-1">Otras observaciones:</label>
                  <div className="flex items-center">
                    <Textarea
                      value={formData.articulacionCraneomandibular?.otrasObservaciones || ''}
                      onChange={e => handleTextChange('otrasObservaciones', e.target.value, 'articulacionCraneomandibular')}
                      placeholder="Otras observaciones"
                      className="min-h-[80px] flex-1"
                    />
                    <div className="ml-2">
                      <VoiceInput onTranscriptionComplete={handleVoiceInput('otrasObservaciones', 'articulacionCraneomandibular')} />
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-4 mt-8">Labios</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-md font-medium mb-2">Simetría:</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.labios?.simetria === 'simetricos' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => handleArticulacionCraneomandibularChange('labios.simetria', 'simetricos')}
                      >
                        Simétricos
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.labios?.simetria === 'asimetricosDerecha' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => handleArticulacionCraneomandibularChange('labios.simetria', 'asimetricosDerecha')}
                      >
                        Asimétricos (Derecha)
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.labios?.simetria === 'asimetricosIzquierda' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => handleArticulacionCraneomandibularChange('labios.simetria', 'asimetricosIzquierda')}
                      >
                        Asimétricos (Izquierda)
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium mb-2">Tamaño/Volumen:</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.labios?.volumen === 'delgados' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => handleArticulacionCraneomandibularChange('labios.volumen', 'delgados')}
                      >
                        Delgados
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.labios?.volumen === 'medianos' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => handleArticulacionCraneomandibularChange('labios.volumen', 'medianos')}
                      >
                        Medianos
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.labios?.volumen === 'gruesos' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => handleArticulacionCraneomandibularChange('labios.volumen', 'gruesos')}
                      >
                        Gruesos
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium mb-2">Coloración:</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.labios?.coloracion === 'normal' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => handleArticulacionCraneomandibularChange('labios.coloracion', 'normal')}
                      >
                        Normal
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.labios?.coloracion === 'palidos' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => handleArticulacionCraneomandibularChange('labios.coloracion', 'palidos')}
                      >
                        Pálidos
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.labios?.coloracion === 'cianoticos' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => handleArticulacionCraneomandibularChange('labios.coloracion', 'cianoticos')}
                      >
                        Cianóticos
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.labios?.coloracion === 'eritematosos' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => handleArticulacionCraneomandibularChange('labios.coloracion', 'eritematosos')}
                      >
                        Eritematosos
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium mb-2">Hidratación/Superficie:</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.labios?.hidratacion === 'hidratados' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => handleArticulacionCraneomandibularChange('labios.hidratacion', 'hidratados')}
                      >
                        Hidratados
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.labios?.hidratacion === 'secos' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => handleArticulacionCraneomandibularChange('labios.hidratacion', 'secos')}
                      >
                        Secos
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.labios?.hidratacion === 'agrietados' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => handleArticulacionCraneomandibularChange('labios.hidratacion', 'agrietados')}
                      >
                        Agrietados
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.labios?.hidratacion === 'costras' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => handleArticulacionCraneomandibularChange('labios.hidratacion', 'costras')}
                      >
                        Costras
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium mb-2">Integridad:</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.labios?.integridad === 'intactos' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => handleArticulacionCraneomandibularChange('labios.integridad', 'intactos')}
                      >
                        Íntegros
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.labios?.integridad === 'heridas' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => handleArticulacionCraneomandibularChange('labios.integridad', 'heridas')}
                      >
                        Heridas
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.labios?.integridad === 'ulceraciones' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => handleArticulacionCraneomandibularChange('labios.integridad', 'ulceraciones')}
                      >
                        Ulceraciones
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.labios?.integridad === 'fisuras' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => handleArticulacionCraneomandibularChange('labios.integridad', 'fisuras')}
                      >
                        Fisuras
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium mb-2">Comisuras labiales:</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.labios?.comisuras === 'normales' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => handleArticulacionCraneomandibularChange('labios.comisuras', 'normales')}
                      >
                        Normales
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.labios?.comisuras === 'erosionadas' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => handleArticulacionCraneomandibularChange('labios.comisuras', 'erosionadas')}
                      >
                        Erosionadas
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.labios?.comisuras === 'queilitis' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => handleArticulacionCraneomandibularChange('labios.comisuras', 'queilitis')}
                      >
                        Queilitis
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium mb-2">Movimiento y función:</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.labios?.movimiento === 'normales' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => handleArticulacionCraneomandibularChange('labios.movimiento', 'normales')}
                      >
                        Normales
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.labios?.movimiento === 'restriccion' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => handleArticulacionCraneomandibularChange('labios.movimiento', 'restriccion')}
                      >
                        Restricción
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.articulacionCraneomandibular?.labios?.movimiento === 'incompetencia' ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                        onClick={() => handleArticulacionCraneomandibularChange('labios.movimiento', 'incompetencia')}
                      >
                        Incompetencia
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Otras observaciones:</label>
                    <div className="flex items-center">
                      <Textarea
                        value={formData.articulacionCraneomandibular?.labios?.otrasObservaciones || ''}
                        onChange={e => handleTextChange('otrasObservaciones', e.target.value, 'labios')}
                        placeholder="Otras observaciones"
                        className="min-h-[80px] flex-1"
                      />
                      <div className="ml-2">
                        <VoiceInput onTranscriptionComplete={handleVoiceInput('otrasObservaciones', 'labios')} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    onClick={generateRedaccion}
                    disabled={isGeneratingRedaccion}
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    {isGeneratingRedaccion ? 'Generando...' : 'Generar Redacción'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ArticulacionCraneomandibular;
