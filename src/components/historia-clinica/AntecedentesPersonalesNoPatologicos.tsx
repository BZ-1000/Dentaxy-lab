import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface AntecedentesPersonalesNoPatologicosProps {
  formData: FormDataState;
  handleAntecedenteChange: (field: string, value: any) => void;
  toggleService: (service: string) => void;
  handleHorarioComidaChange: (comida: 'desayuno' | 'almuerzo' | 'cena', value: string) => void;
}

const AntecedentesPersonalesNoPatologicos: React.FC<AntecedentesPersonalesNoPatologicosProps> = ({
  formData,
  handleAntecedenteChange,
  toggleService,
  handleHorarioComidaChange
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState('formulario');
  const [activeSection, setActiveSection] = useState('serviciosDomiciliarios');
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

  const generateRedaccion = () => {
    setIsGeneratingRedaccion(true);
    setTimeout(() => {
      let content = "ANTECEDENTES PERSONALES NO PATOLÓGICOS:\n\n";

      // Servicios Domiciliarios
      content += `Servicios domiciliarios: ${formData.antecedentesPersonalesNoPatologicos.serviciosDomiciliarios || 'No especificado'}\n`;
      content += `Pisos de la vivienda: ${formData.antecedentesPersonalesNoPatologicos.pisosVivienda || 'No especificado'}\n`;
      content += `Material de la vivienda: ${formData.antecedentesPersonalesNoPatologicos.materialVivienda || 'No especificado'}\n`;
      content += `Material del piso: ${formData.antecedentesPersonalesNoPatologicos.materialPiso || 'No especificado'}\n`;
      content += `Ventilación: ${formData.antecedentesPersonalesNoPatologicos.ventilacion || 'No especificado'}\n`;

      // Higiene
      content += `Frecuencia de limpieza: ${formData.antecedentesPersonalesNoPatologicos.frecuenciaLimpieza || 'No especificado'}\n`;
      content += `Hacinamiento: ${formData.antecedentesPersonalesNoPatologicos.hacinamiento || 'No especificado'}\n`;
      content += `Frecuencia de baño: ${formData.antecedentesPersonalesNoPatologicos.frecuenciaBano || 'No especificado'}\n`;

      // Higiene Bucal
      content += `Frecuencia de cepillado: ${formData.antecedentesPersonalesNoPatologicos.higieneBucal.frecuenciaCepillado || 'No especificado'}\n`;
      content += `Uso de hilo dental: ${formData.antecedentesPersonalesNoPatologicos.higieneBucal.usoHiloDental || 'No especificado'}\n`;
      content += `Tipo de cerdas: ${formData.antecedentesPersonalesNoPatologicos.higieneBucal.tipoCerdas || 'No especificado'}\n`;
      content += `Cantidad de pasta: ${formData.antecedentesPersonalesNoPatologicos.higieneBucal.cantidadPasta || 'No especificado'}\n`;
      content += `Marca de pasta: ${formData.antecedentesPersonalesNoPatologicos.higieneBucal.marcaPasta || 'No especificado'}\n`;

      // Alimentación
      content += `Tipo de dieta: ${formData.antecedentesPersonalesNoPatologicos.alimentacion.tipoDieta || 'No especificado'}\n`;
      content += `Frecuencia de comidas: ${formData.antecedentesPersonalesNoPatologicos.alimentacion.frecuenciaComidas || 'No especificado'}\n`;
      content += `Tipos de alimentos: ${formData.antecedentesPersonalesNoPatologicos.alimentacion.tiposAlimentos || 'No especificado'}\n`;
      content += `Salta comidas: ${formData.antecedentesPersonalesNoPatologicos.alimentacion.saltaComidas || 'No especificado'}\n`;
      content += `Consumo nutritivo: ${formData.antecedentesPersonalesNoPatologicos.alimentacion.consumoNutritivo || 'No especificado'}\n`;

      setRedaccionContent(content);
      setIsGeneratingRedaccion(false);
      setActiveTab('redaccion');
    }, 1000);
  };

  return <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`} data-section-name="antecedentesPersonalesNoPatologicos" data-section-redaction="true">
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
              <button className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'formulario' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`} onClick={() => setActiveTab('formulario')}>
                Formulario
              </button>
              <button className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'redaccion' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`} onClick={() => setActiveTab('redaccion')}>
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

        {!isMinimized && <>
            {activeTab === 'formulario' ? <div className="p-6">
                <div className="flex mb-6 overflow-x-auto justify-between">
                  <button className={`px-4 py-2 rounded-md text-sm ${activeSection === 'serviciosDomiciliarios' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`} onClick={() => setActiveSection('serviciosDomiciliarios')}>Servicios Domiciliarios</button>
                  <button className={`px-4 py-2 rounded-md text-sm ${activeSection === 'higieneVivienda' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`} onClick={() => setActiveSection('higieneVivienda')}>Higiene Vivienda</button>
                  <button className={`px-4 py-2 rounded-md text-sm ${activeSection === 'higienePersonal' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`} onClick={() => setActiveSection('higienePersonal')}>Higiene Personal</button>
                  <button className={`px-4 py-2 rounded-md text-sm ${activeSection === 'higieneBucal' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`} onClick={() => setActiveSection('higieneBucal')}>Higiene Bucal</button>
                  <button className={`px-4 py-2 rounded-md text-sm ${activeSection === 'alimentacion' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`} onClick={() => setActiveSection('alimentacion')}>Alimentación</button>
                </div>

                {activeSection === 'serviciosDomiciliarios' && (
                  <div className="space-y-6 px-2">
                    <h3 className="text-lg font-semibold border-b pb-2">Servicios Domiciliarios</h3>

                    <div>
                      <label className="block text-sm font-medium mb-1">Tipo de vivienda:</label>
                      <Textarea placeholder="Casa, departamento, etc." value={formData.antecedentesPersonalesNoPatologicos.tipoVivienda || ''} onChange={(e) => handleAntecedenteChange('tipoVivienda', e.target.value)} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Material de construcción predominante:</label>
                      <Textarea placeholder="Ladrillo, madera, etc." value={formData.antecedentesPersonalesNoPatologicos.materialVivienda || ''} onChange={(e) => handleAntecedenteChange('materialVivienda', e.target.value)} />
                    </div>

                    <div>
                      <h4 className="text-md font-medium mb-2">Servicios con los que cuenta:</h4>
                      <div className="flex flex-wrap gap-2">
                        {['agua', 'luz', 'drenaje', 'transporte', 'internet', 'gas'].map(service => (
                          <button key={service} onClick={() => toggleService(service)} className={`px-3 py-2 rounded-md text-xs ${formData.antecedentesPersonalesNoPatologicos.servicios?.includes(service) ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                            {service}
                          </button>
                        ))}
                        <button onClick={() => toggleService('todos')} className={`px-3 py-2 rounded-md text-xs ${['agua', 'luz', 'drenaje', 'transporte', 'internet', 'gas'].every(s => formData.antecedentesPersonalesNoPatologicos.servicios?.includes(s)) ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                          Todos
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Condiciones de la calle:</label>
                      <Textarea placeholder="Pavimentada, terracería, etc." value={formData.antecedentesPersonalesNoPatologicos.condicionCalle || ''} onChange={(e) => handleAntecedenteChange('condicionCalle', e.target.value)} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Iluminación en la vía pública:</label>
                      <Textarea placeholder="Buena, mala, etc." value={formData.antecedentesPersonalesNoPatologicos.iluminacionCalle || ''} onChange={(e) => handleAntecedenteChange('iluminacionCalle', e.target.value)} />
                    </div>
                  </div>
                )}

                {activeSection === 'higieneVivienda' && (
                  <div className="space-y-6 px-2">
                    <h3 className="text-lg font-semibold border-b pb-2">Higiene de la Vivienda</h3>

                    <div>
                      <label className="block text-sm font-medium mb-1">Frecuencia de limpieza del hogar:</label>
                      <Textarea placeholder="Diaria, semanal, etc." value={formData.antecedentesPersonalesNoPatologicos.frecuenciaLimpieza || ''} onChange={(e) => handleAntecedenteChange('frecuenciaLimpieza', e.target.value)} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Frecuencia con la que se cambia la ropa de cama:</label>
                      <Textarea placeholder="Semanal, quincenal, etc." value={formData.antecedentesPersonalesNoPatologicos.cambioRopaCama || ''} onChange={(e) => handleAntecedenteChange('cambioRopaCama', e.target.value)} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Hacinamiento:</label>
                      <Textarea placeholder="Sí/No y detalles" value={formData.antecedentesPersonalesNoPatologicos.hacinamiento || ''} onChange={(e) => handleAntecedenteChange('hacinamiento', e.target.value)} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Promiscuidad:</label>
                      <Textarea placeholder="Sí/No y detalles" value={formData.antecedentesPersonalesNoPatologicos.promiscuidad || ''} onChange={(e) => handleAntecedenteChange('promiscuidad', e.target.value)} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Mascotas:</label>
                      <Textarea placeholder="Sí/No y detalles" value={formData.antecedentesPersonalesNoPatologicos.mascotas || ''} onChange={(e) => handleAntecedenteChange('mascotas', e.target.value)} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Manejo de residuos:</label>
                      <Textarea placeholder="Adecuado, inadecuado, etc." value={formData.antecedentesPersonalesNoPatologicos.manejoResiduos || ''} onChange={(e) => handleAntecedenteChange('manejoResiduos', e.target.value)} />
                    </div>
                  </div>
                )}

                {activeSection === 'higienePersonal' && (
                  <div className="space-y-6 px-2">
                    <h3 className="text-lg font-semibold border-b pb-2">Higiene Personal</h3>

                    <div>
                      <label className="block text-sm font-medium mb-1">Frecuencia de baño:</label>
                      <Textarea placeholder="Diaria, interdiaria, etc." value={formData.antecedentesPersonalesNoPatologicos.frecuenciaBano || ''} onChange={(e) => handleAntecedenteChange('frecuenciaBano', e.target.value)} />
                    </div>

                    <div>
                      <h4 className="text-md font-medium mb-2">Lavado de manos:</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Antes de comer', 'Después de ir al baño', 'Al llegar a casa', 'Otro'].map(momento => (
                          <button key={momento} onClick={() => {
                            const updatedLavado = formData.antecedentesPersonalesNoPatologicos.lavadoManos?.includes(momento)
                              ? formData.antecedentesPersonalesNoPatologicos.lavadoManos.filter(l => l !== momento)
                              : [...(formData.antecedentesPersonalesNoPatologicos.lavadoManos || []), momento];
                            handleAntecedenteChange('lavadoManos', updatedLavado);
                          }} className={`px-3 py-2 rounded-md text-xs ${formData.antecedentesPersonalesNoPatologicos.lavadoManos?.includes(momento) ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                            {momento}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Cambio de ropa:</label>
                      <Textarea placeholder="Diario, interdiario, etc." value={formData.antecedentesPersonalesNoPatologicos.cambioRopa || ''} onChange={(e) => handleAntecedenteChange('cambioRopa', e.target.value)} />
                    </div>
                  </div>
                )}

                {activeSection === 'higieneBucal' && (
                  <div className="space-y-6 px-2">
                    <h3 className="text-lg font-semibold border-b pb-2">Higiene Bucal</h3>

                    <div>
                      <label className="block text-sm font-medium mb-1">Frecuencia de cepillado:</label>
                      <Textarea placeholder="Veces al día" value={formData.antecedentesPersonalesNoPatologicos.frecuenciaCepillado || ''} onChange={(e) => handleAntecedenteChange('frecuenciaCepillado', e.target.value)} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Técnica de cepillado:</label>
                      <Textarea placeholder="Horizontal, vertical, etc." value={formData.antecedentesPersonalesNoPatologicos.tecnicaCepillado || ''} onChange={(e) => handleAntecedenteChange('tecnicaCepillado', e.target.value)} />
                    </div>

                    <div>
                      <h4 className="text-md font-medium mb-2">Auxiliares bucales:</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Hilo dental', 'Enjuague bucal', 'Otro'].map(auxiliar => (
                          <button key={auxiliar} onClick={() => {
                            const updatedAuxiliares = formData.antecedentesPersonalesNoPatologicos.auxiliaresBucales?.includes(auxiliar)
                              ? formData.antecedentesPersonalesNoPatologicos.auxiliaresBucales.filter(a => a !== auxiliar)
                              : [...(formData.antecedentesPersonalesNoPatologicos.auxiliaresBucales || []), auxiliar];
                            handleAntecedenteChange('auxiliaresBucales', updatedAuxiliares);
                          }} className={`px-3 py-2 rounded-md text-xs ${formData.antecedentesPersonalesNoPatologicos.auxiliaresBucales?.includes(auxiliar) ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                            {auxiliar}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Última visita al odontólogo:</label>
                      <Textarea placeholder="Fecha aproximada" value={formData.antecedentesPersonalesNoPatologicos.ultimaVisitaOdontologo || ''} onChange={(e) => handleAntecedenteChange('ultimaVisitaOdontologo', e.target.value)} />
                    </div>

                    <div>
                      <h4 className="text-md font-medium mb-2">Problemas bucales:</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Caries', 'Gingivitis', 'Periodontitis', 'Otro'].map(problema => (
                          <button key={problema} onClick={() => {
                            const updatedProblemas = formData.antecedentesPersonalesNoPatologicos.problemasBucales?.includes(problema)
                              ? formData.antecedentesPersonalesNoPatologicos.problemasBucales.filter(p => p !== problema)
                              : [...(formData.antecedentesPersonalesNoPatologicos.problemasBucales || []), problema];
                            handleAntecedenteChange('problemasBucales', updatedProblemas);
                          }} className={`px-3 py-2 rounded-md text-xs ${formData.antecedentesPersonalesNoPatologicos.problemasBucales?.includes(problema) ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                            {problema}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'alimentacion' && <div className="space-y-6 px-2">
                    <h3 className="text-lg font-semibold border-b pb-2">Hábitos Alimenticios</h3>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Alimentos principalmente consumidos:</label>
                      <div className="flex flex-wrap gap-2">
                        {['Frutas', 'Verduras', 'Carnes', 'Cereales', 'Lácteos', 'Legumbres', 'Carbohidratos', 'Comida chatarra', 'Bebidas azucaradas'].map(alimento => (
                          <button key={alimento} onClick={() => {
                            const updatedAlimentos = formData.antecedentesPersonalesNoPatologicos.alimentosConsumidos?.includes(alimento) 
                              ? formData.antecedentesPersonalesNoPatologicos.alimentosConsumidos.filter(a => a !== alimento)
                              : [...(formData.antecedentesPersonalesNoPatologicos.alimentosConsumidos || []), alimento];
                            handleAntecedenteChange('alimentosConsumidos', updatedAlimentos);
                          }} className={`px-3 py-2 rounded-md text-xs ${formData.antecedentesPersonalesNoPatologicos.alimentosConsumidos?.includes(alimento) ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                            {alimento}
                          </button>
                        ))}
                      </div>
                    </div>
                      
                    <div>
                      <label className="block text-sm font-medium mb-1">Frecuencia de consumo de frutas y verduras:</label>
                      <Textarea placeholder="Diariamente, semanalmente, etc." value={formData.antecedentesPersonalesNoPatologicos.frecuenciaFrutasVerduras || ''} onChange={(e) => handleAntecedenteChange('frecuenciaFrutasVerduras', e.target.value)} />
                    </div>
                      
                    <div>
                      <label className="block text-sm font-medium mb-1">Frecuencia de consumo de bebidas azucaradas:</label>
                      <Textarea placeholder="Diariamente, semanalmente, etc." value={formData.antecedentesPersonalesNoPatologicos.frecuenciaBebidasAzucaradas || ''} onChange={(e) => handleAntecedenteChange('frecuenciaBebidasAzucaradas', e.target.value)} />
                    </div>
                      
                    <div>
                      <label className="block text-sm font-medium mb-1">Frecuencia de consumo de comida chatarra:</label>
                      <Textarea placeholder="Diariamente, semanalmente, etc." value={formData.antecedentesPersonalesNoPatologicos.frecuenciaComidaChatarra || ''} onChange={(e) => handleAntecedenteChange('frecuenciaComidaChatarra', e.target.value)} />
                    </div>
                      
                    <div>
                      <label className="block text-sm font-medium mb-1">Consumo diario aproximado de agua:</label>
                      <Textarea placeholder="Cantidad en litros o vasos" value={formData.antecedentesPersonalesNoPatologicos.consumoAgua || ''} onChange={(e) => handleAntecedenteChange('consumoAgua', e.target.value)} />
                    </div>
                      
                    <div>
                      <label className="block text-sm font-medium mb-1">Número de comidas al día:</label>
                      <Textarea placeholder="Tres, cinco, etc." value={formData.antecedentesPersonalesNoPatologicos.numeroComidas || ''} onChange={(e) => handleAntecedenteChange('numeroComidas', e.target.value)} />
                    </div>
                      
                    <div className="space-y-3">
                      <label className="block text-sm font-medium">Horarios habituales de comida:</label>
                        
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Desayuno:</label>
                          <Input 
                            type="time" 
                            value={formData.antecedentesPersonalesNoPatologicos.horarioComidas.desayuno || ''} 
                            onChange={(e) => handleHorarioComidaChange('desayuno', e.target.value)} 
                            className="w-full" 
                          />
                        </div>
                          
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Comida/Almuerzo:</label>
                          <Input 
                            type="time" 
                            value={formData.antecedentesPersonalesNoPatologicos.horarioComidas.almuerzo || ''} 
                            onChange={(e) => handleHorarioComidaChange('almuerzo', e.target.value)} 
                            className="w-full" 
                          />
                        </div>
                          
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Cena:</label>
                          <Input 
                            type="time" 
                            value={formData.antecedentesPersonalesNoPatologicos.horarioComidas.cena || ''} 
                            onChange={(e) => handleHorarioComidaChange('cena', e.target.value)} 
                            className="w-full" 
                          />
                        </div>
                      </div>
                    </div>
                      
                    <div>
                      <label className="block text-sm font-medium mb-1">¿Realiza ayuno prolongado?</label>
                      <Textarea placeholder="Indique si ayuna y por cuántas horas" value={formData.antecedentesPersonalesNoPatologicos.ayunoProlongado || ''} onChange={(e) => handleAntecedenteChange('ayunoProlongado', e.target.value)} />
                    </div>
                  </div>}
              </div> : <div className="p-6">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 min-h-[200px] whitespace-pre-wrap" style={{
                  whiteSpace: 'pre-wrap'
                }} data-redaction-content>
                  {redaccionContent || "No se ha generado redacción aún. Utilice el botón 'Generar Redacción IA' en la pestaña de Formulario."}
                </div>
              </div>}
          </>}
      </Card>
    </div>;
};

export default AntecedentesPersonalesNoPatologicos;
