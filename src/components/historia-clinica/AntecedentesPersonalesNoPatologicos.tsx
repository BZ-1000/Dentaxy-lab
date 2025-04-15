
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AIVoiceInput } from "@/components/ui/ai-voice-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AntecedentesPersonalesNoPatologicosProps {
  formData: FormDataState;
  handleAntecedenteChange: (field: string, value: any) => void;
  toggleService: (service: string) => void;
  handleHorarioComidaChange: (meal: string, time: string) => void;
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
  const [redaccionContent, setRedaccionContent] = useState('');
  const [isGeneratingRedaccion, setIsGeneratingRedaccion] = useState(false);
  const [currentSection, setCurrentSection] = useState('vivienda');

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

  const handleTextChange = (field: string, value: string) => {
    handleAntecedenteChange(field, value);
  };

  const handleCheckboxChange = (field: string, value: boolean) => {
    handleAntecedenteChange(field, value);
  };

  const handleServiceToggle = (service: string) => {
    toggleService(service);
  };

  const handleVoiceInput = (field: string) => (text: string) => {
    const currentValue = formData.antecedentesPersonalesNoPatologicos[field] || "";
    handleAntecedenteChange(field, currentValue ? `${currentValue} ${text}` : text);
  };

  const generateRedaccion = () => {
    setIsGeneratingRedaccion(true);
    setTimeout(() => {
      let content = "ANTECEDENTES PERSONALES NO PATOLÓGICOS:\n\n";

      // Vivienda
      content += `Tipo de vivienda: ${formData.antecedentesPersonalesNoPatologicos.tipoVivienda}. `;
      content += `Material de la vivienda: ${formData.antecedentesPersonalesNoPatologicos.materialVivienda}. `;
      content += `Servicios: ${formData.antecedentesPersonalesNoPatologicos.servicios.join(', ')}. `;
      content += `Condición de la calle: ${formData.antecedentesPersonalesNoPatologicos.condicionCalle}. `;
      content += `Iluminación de la calle: ${formData.antecedentesPersonalesNoPatologicos.iluminacionCalle}. `;

      // Higiene
      content += `Frecuencia de limpieza de la vivienda: ${formData.antecedentesPersonalesNoPatologicos.frecuenciaLimpieza}. `;
      content += `Cambio de ropa de cama: ${formData.antecedentesPersonalesNoPatologicos.cambioRopaCama}. `;
      content += `Hacinamiento: ${formData.antecedentesPersonalesNoPatologicos.hacinamiento}. `;
      content += `Promiscuidad: ${formData.antecedentesPersonalesNoPatologicos.promiscuidad}. `;
      content += `Mascotas: ${formData.antecedentesPersonalesNoPatologicos.mascotas}. `;
      content += `Manejo de residuos: ${formData.antecedentesPersonalesNoPatologicos.manejoResiduos}. `;
      content += `Frecuencia de baño: ${formData.antecedentesPersonalesNoPatologicos.frecuenciaBano}. `;
      content += `Lavado de manos: ${formData.antecedentesPersonalesNoPatologicos.lavadoManos.join(', ')}. `;
      content += `Cambio de ropa: ${formData.antecedentesPersonalesNoPatologicos.cambioRopa}. `;

      // Higiene Bucal
      content += `Frecuencia de cepillado: ${formData.antecedentesPersonalesNoPatologicos.frecuenciaCepillado}. `;
      content += `Técnica de cepillado: ${formData.antecedentesPersonalesNoPatologicos.tecnicaCepillado}. `;
      content += `Auxiliares bucales: ${formData.antecedentesPersonalesNoPatologicos.auxiliaresBucales.join(', ')}. `;
      content += `Última visita al odontólogo: ${formData.antecedentesPersonalesNoPatologicos.ultimaVisitaOdontologo}. `;
      content += `Problemas bucales: ${formData.antecedentesPersonalesNoPatologicos.problemasBucales.join(', ')}. `;

      // Alimentación
      content += `Alimentos consumidos: ${formData.antecedentesPersonalesNoPatologicos.alimentosConsumidos.join(', ')}. `;
      content += `Frecuencia de frutas y verduras: ${formData.antecedentesPersonalesNoPatologicos.frecuenciaFrutasVerduras}. `;
      content += `Frecuencia de bebidas azucaradas: ${formData.antecedentesPersonalesNoPatologicos.frecuenciaBebidasAzucaradas}. `;
      content += `Frecuencia de comida chatarra: ${formData.antecedentesPersonalesNoPatologicos.frecuenciaComidaChatarra}. `;
      content += `Consumo de agua: ${formData.antecedentesPersonalesNoPatologicos.consumoAgua}. `;
      content += `Número de comidas: ${formData.antecedentesPersonalesNoPatologicos.numeroComidas}. `;
      content += `Horario de comidas - Desayuno: ${formData.antecedentesPersonalesNoPatologicos.horarioComidas.desayuno}, Almuerzo: ${formData.antecedentesPersonalesNoPatologicos.horarioComidas.almuerzo}, Cena: ${formData.antecedentesPersonalesNoPatologicos.horarioComidas.cena}. `;
      content += `Ayuno prolongado: ${formData.antecedentesPersonalesNoPatologicos.ayunoProlongado}. `;

      setRedaccionContent(content);
      setIsGeneratingRedaccion(false);
      setActiveTab('redaccion');
    }, 1000);
  };

  const renderViviendaSection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Vivienda</h3>

      <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Tipo de vivienda:</label>
          <div className="flex items-center">
            <Input
              value={formData.antecedentesPersonalesNoPatologicos.tipoVivienda}
              onChange={e => handleTextChange('tipoVivienda', e.target.value)}
              placeholder="Casa, departamento, etc."
              className="flex-1"
            />
            <div className="ml-2">
              <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <AIVoiceInput onTranscriptionComplete={handleVoiceInput('tipoVivienda')} />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Material de la vivienda:</label>
          <div className="flex items-center">
            <Input
              value={formData.antecedentesPersonalesNoPatologicos.materialVivienda}
              onChange={e => handleTextChange('materialVivienda', e.target.value)}
              placeholder="Ladrillo, madera, etc."
              className="flex-1"
            />
            <div className="ml-2">
              <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <AIVoiceInput onTranscriptionComplete={handleVoiceInput('materialVivienda')} />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Servicios:</label>
          <div className="flex flex-wrap gap-2">
            {["Agua potable", "Electricidad", "Drenaje", "Internet"].map(service => (
              <label key={service} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded text-blue-500 focus:ring-blue-500"
                  checked={formData.antecedentesPersonalesNoPatologicos.servicios.includes(service)}
                  onChange={() => handleServiceToggle(service)}
                />
                <span className="text-sm">{service}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Condición de la calle:</label>
          <div className="flex items-center">
            <Input
              value={formData.antecedentesPersonalesNoPatologicos.condicionCalle}
              onChange={e => handleTextChange('condicionCalle', e.target.value)}
              placeholder="Pavimentada, terracería, etc."
              className="flex-1"
            />
            <div className="ml-2">
              <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <AIVoiceInput onTranscriptionComplete={handleVoiceInput('condicionCalle')} />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Iluminación de la calle:</label>
          <div className="flex items-center">
            <Input
              value={formData.antecedentesPersonalesNoPatologicos.iluminacionCalle}
              onChange={e => handleTextChange('iluminacionCalle', e.target.value)}
              placeholder="Buena, regular, mala, etc."
              className="flex-1"
            />
            <div className="ml-2">
              <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <AIVoiceInput onTranscriptionComplete={handleVoiceInput('iluminacionCalle')} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHigieneSection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Higiene</h3>

      <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Frecuencia de limpieza de la vivienda:</label>
          <div className="flex items-center">
            <Input
              value={formData.antecedentesPersonalesNoPatologicos.frecuenciaLimpieza}
              onChange={e => handleTextChange('frecuenciaLimpieza', e.target.value)}
              placeholder="Diario, semanal, etc."
              className="flex-1"
            />
            <div className="ml-2">
              <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <AIVoiceInput onTranscriptionComplete={handleVoiceInput('frecuenciaLimpieza')} />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Cambio de ropa de cama:</label>
          <div className="flex items-center">
            <Input
              value={formData.antecedentesPersonalesNoPatologicos.cambioRopaCama}
              onChange={e => handleTextChange('cambioRopaCama', e.target.value)}
              placeholder="Semanal, quincenal, etc."
              className="flex-1"
            />
            <div className="ml-2">
              <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <AIVoiceInput onTranscriptionComplete={handleVoiceInput('cambioRopaCama')} />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Hacinamiento:</label>
          <div className="flex items-center">
            <Input
              value={formData.antecedentesPersonalesNoPatologicos.hacinamiento}
              onChange={e => handleTextChange('hacinamiento', e.target.value)}
              placeholder="Sí, no, etc."
              className="flex-1"
            />
            <div className="ml-2">
              <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <AIVoiceInput onTranscriptionComplete={handleVoiceInput('hacinamiento')} />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Promiscuidad:</label>
          <div className="flex items-center">
            <Input
              value={formData.antecedentesPersonalesNoPatologicos.promiscuidad}
              onChange={e => handleTextChange('promiscuidad', e.target.value)}
              placeholder="Sí, no, etc."
              className="flex-1"
            />
            <div className="ml-2">
              <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <AIVoiceInput onTranscriptionComplete={handleVoiceInput('promiscuidad')} />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Mascotas:</label>
          <div className="flex items-center">
            <Input
              value={formData.antecedentesPersonalesNoPatologicos.mascotas}
              onChange={e => handleTextChange('mascotas', e.target.value)}
              placeholder="Sí, no, cuáles, etc."
              className="flex-1"
            />
            <div className="ml-2">
              <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <AIVoiceInput onTranscriptionComplete={handleVoiceInput('mascotas')} />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Manejo de residuos:</label>
          <div className="flex items-center">
            <Input
              value={formData.antecedentesPersonalesNoPatologicos.manejoResiduos}
              onChange={e => handleTextChange('manejoResiduos', e.target.value)}
              placeholder="Adecuado, inadecuado, etc."
              className="flex-1"
            />
            <div className="ml-2">
              <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <AIVoiceInput onTranscriptionComplete={handleVoiceInput('manejoResiduos')} />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Frecuencia de baño:</label>
          <div className="flex items-center">
            <Input
              value={formData.antecedentesPersonalesNoPatologicos.frecuenciaBano}
              onChange={e => handleTextChange('frecuenciaBano', e.target.value)}
              placeholder="Diario, interdiario, etc."
              className="flex-1"
            />
            <div className="ml-2">
              <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <AIVoiceInput onTranscriptionComplete={handleVoiceInput('frecuenciaBano')} />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Lavado de manos:</label>
          <div className="flex flex-wrap gap-2">
            {["Antes de comer", "Después de ir al baño", "Después de tocar animales"].map(lavado => (
              <label key={lavado} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded text-blue-500 focus:ring-blue-500"
                  checked={formData.antecedentesPersonalesNoPatologicos.lavadoManos.includes(lavado)}
                  onChange={() => handleServiceToggle(lavado)}
                />
                <span className="text-sm">{lavado}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Cambio de ropa:</label>
          <div className="flex items-center">
            <Input
              value={formData.antecedentesPersonalesNoPatologicos.cambioRopa}
              onChange={e => handleTextChange('cambioRopa', e.target.value)}
              placeholder="Diario, interdiario, etc."
              className="flex-1"
            />
            <div className="ml-2">
              <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <AIVoiceInput onTranscriptionComplete={handleVoiceInput('cambioRopa')} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHigieneBucalSection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Higiene Bucal</h3>

      <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Frecuencia de cepillado:</label>
          <div className="flex items-center">
            <Input
              value={formData.antecedentesPersonalesNoPatologicos.frecuenciaCepillado}
              onChange={e => handleTextChange('frecuenciaCepillado', e.target.value)}
              placeholder="2 veces al día, etc."
              className="flex-1"
            />
            <div className="ml-2">
              <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <AIVoiceInput onTranscriptionComplete={handleVoiceInput('frecuenciaCepillado')} />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Técnica de cepillado:</label>
          <div className="flex items-center">
            <Input
              value={formData.antecedentesPersonalesNoPatologicos.tecnicaCepillado}
              onChange={e => handleTextChange('tecnicaCepillado', e.target.value)}
              placeholder="Circular, vertical, etc."
              className="flex-1"
            />
            <div className="ml-2">
              <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <AIVoiceInput onTranscriptionComplete={handleVoiceInput('tecnicaCepillado')} />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Auxiliares bucales:</label>
          <div className="flex flex-wrap gap-2">
            {["Hilo dental", "Enjuague bucal", "Limpiador de lengua"].map(auxiliar => (
              <label key={auxiliar} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded text-blue-500 focus:ring-blue-500"
                  checked={formData.antecedentesPersonalesNoPatologicos.auxiliaresBucales.includes(auxiliar)}
                  onChange={() => handleServiceToggle(auxiliar)}
                />
                <span className="text-sm">{auxiliar}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Última visita al odontólogo:</label>
          <div className="flex items-center">
            <Input
              value={formData.antecedentesPersonalesNoPatologicos.ultimaVisitaOdontologo}
              onChange={e => handleTextChange('ultimaVisitaOdontologo', e.target.value)}
              placeholder="Fecha aproximada"
              className="flex-1"
            />
            <div className="ml-2">
              <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <AIVoiceInput onTranscriptionComplete={handleVoiceInput('ultimaVisitaOdontologo')} />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Problemas bucales:</label>
          <div className="flex flex-wrap gap-2">
            {["Caries", "Gingivitis", "Periodontitis", "Maloclusión"].map(problema => (
              <label key={problema} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded text-blue-500 focus:ring-blue-500"
                  checked={formData.antecedentesPersonalesNoPatologicos.problemasBucales.includes(problema)}
                  onChange={() => handleServiceToggle(problema)}
                />
                <span className="text-sm">{problema}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAlimentacionSection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Alimentación</h3>
    
      <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Tipo de dieta:</label>
          <div className="flex items-center">
            <Input
              value={formData.antecedentesPersonalesNoPatologicos.alimentosConsumidos.join(", ")}
              onChange={(e) => handleAntecedenteChange('alimentosConsumidos', e.target.value.split(", "))}
              placeholder="Describa los alimentos que consume habitualmente"
              className="flex-1"
            />
            <div className="ml-2">
              <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <AIVoiceInput 
                  onTranscriptionComplete={(text) => {
                    const current = formData.antecedentesPersonalesNoPatologicos.alimentosConsumidos || [];
                    handleAntecedenteChange('alimentosConsumidos', [...current, text]);
                  }} 
                />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Horarios de comida:</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Número de comidas al día:</label>
          <div className="flex items-center">
            <Input
              value={formData.antecedentesPersonalesNoPatologicos.numeroComidas}
              onChange={(e) => handleAntecedenteChange('numeroComidas', e.target.value)}
              placeholder="Ej: 3, 5, etc."
              type="number"
              min="1"
              max="10"
              className="flex-1"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Frecuencia de consumo de frutas y verduras:</label>
          <div className="flex items-center">
            <Input
              value={formData.antecedentesPersonalesNoPatologicos.frecuenciaFrutasVerduras}
              onChange={(e) => handleAntecedenteChange('frecuenciaFrutasVerduras', e.target.value)}
              placeholder="Ej: Diario, 3 veces por semana, etc."
              className="flex-1"
            />
            <div className="ml-2">
              <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <AIVoiceInput 
                  onTranscriptionComplete={(text) => {
                    handleAntecedenteChange('frecuenciaFrutasVerduras', text);
                  }} 
                />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Frecuencia de bebidas azucaradas:</label>
          <div className="flex items-center">
            <Input
              value={formData.antecedentesPersonalesNoPatologicos.frecuenciaBebidasAzucaradas}
              onChange={(e) => handleAntecedenteChange('frecuenciaBebidasAzucaradas', e.target.value)}
              placeholder="Ej: Diario, 3 veces por semana, etc."
              className="flex-1"
            />
            <div className="ml-2">
              <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <AIVoiceInput 
                  onTranscriptionComplete={(text) => {
                    handleAntecedenteChange('frecuenciaBebidasAzucaradas', text);
                  }} 
                />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Frecuencia de comida "chatarra":</label>
          <div className="flex items-center">
            <Input
              value={formData.antecedentesPersonalesNoPatologicos.frecuenciaComidaChatarra}
              onChange={(e) => handleAntecedenteChange('frecuenciaComidaChatarra', e.target.value)}
              placeholder="Ej: Diario, 3 veces por semana, etc."
              className="flex-1"
            />
            <div className="ml-2">
              <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <AIVoiceInput 
                  onTranscriptionComplete={(text) => {
                    handleAntecedenteChange('frecuenciaComidaChatarra', text);
                  }} 
                />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Consumo de agua diario:</label>
          <div className="flex items-center">
            <Input
              value={formData.antecedentesPersonalesNoPatologicos.consumoAgua}
              onChange={(e) => handleAntecedenteChange('consumoAgua', e.target.value)}
              placeholder="Ej: 2 litros, 8 vasos, etc."
              className="flex-1"
            />
            <div className="ml-2">
              <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <AIVoiceInput 
                  onTranscriptionComplete={(text) => {
                    handleAntecedenteChange('consumoAgua', text);
                  }} 
                />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">¿Realiza ayunos prolongados?</label>
          <div className="flex items-center">
            <Input
              value={formData.antecedentesPersonalesNoPatologicos.ayunoProlongado}
              onChange={(e) => handleAntecedenteChange('ayunoProlongado', e.target.value)}
              placeholder="Ej: No, Sí (12 horas), etc."
              className="flex-1"
            />
            <div className="ml-2">
              <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <AIVoiceInput 
                  onTranscriptionComplete={(text) => {
                    handleAntecedenteChange('ayunoProlongado', text);
                  }} 
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`} data-section-redaction="true" data-section-name="antecedentesPersonalesNoPatologicos">
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
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
                onClick={generateRedaccion}
              >
                Redacción
              </button>
            </div>
          </div>

          <div className="flex space-x-2">
            <button onClick={handleMinimize} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <Minus size={18} />
            </button>
            <button onClick={handleMaximize} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <Maximize2 size={18} />
            </button>
            <button onClick={handleClose} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className={`${isMinimized ? 'hidden' : 'block'} p-6`}>
          {activeTab === 'formulario' ? (
            <div>
              <div className="flex mb-6 space-x-3 overflow-x-auto scrollbar-hide">
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${currentSection === 'vivienda' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  onClick={() => setCurrentSection('vivienda')}
                >
                  Vivienda
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${currentSection === 'higiene' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  onClick={() => setCurrentSection('higiene')}
                >
                  Higiene
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${currentSection === 'higieneBucal' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  onClick={() => setCurrentSection('higieneBucal')}
                >
                  Higiene Bucal
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${currentSection === 'alimentacion' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  onClick={() => setCurrentSection('alimentacion')}
                >
                  Alimentación
                </button>
              </div>

              <div className="space-y-6">
                {currentSection === 'vivienda' && renderViviendaSection()}
                {currentSection === 'higiene' && renderHigieneSection()}
                {currentSection === 'higieneBucal' && renderHigieneBucalSection()}
                {currentSection === 'alimentacion' && renderAlimentacionSection()}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {isGeneratingRedaccion ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium mb-4">Redacción de antecedentes personales no patológicos</h3>
                  <Textarea
                    value={redaccionContent}
                    readOnly
                    className="min-h-[300px] w-full border-gray-300 dark:border-gray-700"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AntecedentesPersonalesNoPatologicos;
