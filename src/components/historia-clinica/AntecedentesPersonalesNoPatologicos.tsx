import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AIVoiceInput } from "@/components/ui/ai-voice-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AntecedentesPersonalesNoPatologicosProps {
  formData: FormDataState;
  handleAntecedenteChange: (field: string, value: any) => void;
  toggleService: (service: string) => void;
}

const AntecedentesPersonalesNoPatologicos: React.FC<AntecedentesPersonalesNoPatologicosProps> = ({
  formData,
  handleAntecedenteChange,
  toggleService
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState('formulario');
  const [redaccionContent, setRedaccionContent] = useState('');
  const [isGeneratingRedaccion, setIsGeneratingRedaccion] = useState(false);
  const [currentSection, setCurrentSection] = useState('vivienda');

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    console.log('Close button clicked');
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

  const handleVoiceInput = (field: string, text: string) => {
    handleAntecedenteChange(field, text);
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
      content += `Frecuencia de limpieza: ${formData.antecedentesPersonalesNoPatologicos.frecuenciaLimpieza}. `;
      content += `Cambio de ropa de cama: ${formData.antecedentesPersonalesNoPatologicos.cambioRopaCama}. `;
      content += `Hacinamiento: ${formData.antecedentesPersonalesNoPatologicos.hacinamiento}. `;
      content += `Promiscuidad: ${formData.antecedentesPersonalesNoPatologicos.promiscuidad}. `;
      content += `Mascotas: ${formData.antecedentesPersonalesNoPatologicos.mascotas}. `;
      content += `Manejo de residuos: ${formData.antecedentesPersonalesNoPatologicos.manejoResiduos}. `;

      // Higiene
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
          <Input
            type="text"
            value={formData.antecedentesPersonalesNoPatologicos.tipoVivienda}
            onChange={(e) => handleTextChange('tipoVivienda', e.target.value)}
            placeholder="Ej: Casa, Apartamento, etc."
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Material de la vivienda:</label>
          <Input
            type="text"
            value={formData.antecedentesPersonalesNoPatologicos.materialVivienda}
            onChange={(e) => handleTextChange('materialVivienda', e.target.value)}
            placeholder="Ej: Ladrillo, Madera, etc."
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Servicios:</label>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={formData.antecedentesPersonalesNoPatologicos.servicios.includes('Agua potable')}
                onChange={() => handleServiceToggle('Agua potable')}
              />
              Agua potable
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={formData.antecedentesPersonalesNoPatologicos.servicios.includes('Electricidad')}
                onChange={() => handleServiceToggle('Electricidad')}
              />
              Electricidad
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={formData.antecedentesPersonalesNoPatologicos.servicios.includes('Drenaje')}
                onChange={() => handleServiceToggle('Drenaje')}
              />
              Drenaje
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={formData.antecedentesPersonalesNoPatologicos.servicios.includes('Internet')}
                onChange={() => handleServiceToggle('Internet')}
              />
              Internet
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Condición de la calle:</label>
          <Input
            type="text"
            value={formData.antecedentesPersonalesNoPatologicos.condicionCalle}
            onChange={(e) => handleTextChange('condicionCalle', e.target.value)}
            placeholder="Ej: Pavimentada, Empedrada, etc."
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Iluminación de la calle:</label>
          <Input
            type="text"
            value={formData.antecedentesPersonalesNoPatologicos.iluminacionCalle}
            onChange={(e) => handleTextChange('iluminacionCalle', e.target.value)}
            placeholder="Ej: Buena, Regular, Mala, etc."
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Frecuencia de limpieza de la vivienda:</label>
          <Input
            type="text"
            value={formData.antecedentesPersonalesNoPatologicos.frecuenciaLimpieza}
            onChange={(e) => handleTextChange('frecuenciaLimpieza', e.target.value)}
            placeholder="Ej: Diaria, Semanal, etc."
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Frecuencia de cambio de ropa de cama:</label>
          <Input
            type="text"
            value={formData.antecedentesPersonalesNoPatologicos.cambioRopaCama}
            onChange={(e) => handleTextChange('cambioRopaCama', e.target.value)}
            placeholder="Ej: Semanal, Quincenal, etc."
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Hacinamiento:</label>
          <Input
            type="text"
            value={formData.antecedentesPersonalesNoPatologicos.hacinamiento}
            onChange={(e) => handleTextChange('hacinamiento', e.target.value)}
            placeholder="Ej: Sí, No, etc."
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Promiscuidad:</label>
          <Input
            type="text"
            value={formData.antecedentesPersonalesNoPatologicos.promiscuidad}
            onChange={(e) => handleTextChange('promiscuidad', e.target.value)}
            placeholder="Ej: Sí, No, etc."
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Mascotas:</label>
          <Input
            type="text"
            value={formData.antecedentesPersonalesNoPatologicos.mascotas}
            onChange={(e) => handleTextChange('mascotas', e.target.value)}
            placeholder="Ej: Perro, Gato, etc."
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Manejo de residuos:</label>
          <Input
            type="text"
            value={formData.antecedentesPersonalesNoPatologicos.manejoResiduos}
            onChange={(e) => handleTextChange('manejoResiduos', e.target.value)}
            placeholder="Ej: Adecuado, Inadecuado, etc."
            className="w-full"
          />
        </div>
      </div>
    </div>
  );

  const renderHigieneSection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Higiene</h3>

      <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Frecuencia de baño:</label>
          <Input
            type="text"
            value={formData.antecedentesPersonalesNoPatologicos.frecuenciaBano}
            onChange={(e) => handleTextChange('frecuenciaBano', e.target.value)}
            placeholder="Ej: Diaria, Interdiaria, etc."
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Lavado de manos:</label>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={formData.antecedentesPersonalesNoPatologicos.lavadoManos.includes('Antes de comer')}
                onChange={() => handleServiceToggle('Antes de comer')}
              />
              Antes de comer
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={formData.antecedentesPersonalesNoPatologicos.lavadoManos.includes('Después de ir al baño')}
                onChange={() => handleServiceToggle('Después de ir al baño')}
              />
              Después de ir al baño
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={formData.antecedentesPersonalesNoPatologicos.lavadoManos.includes('Después de tocar superficies públicas')}
                onChange={() => handleServiceToggle('Después de tocar superficies públicas')}
              />
              Después de tocar superficies públicas
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Cambio de ropa:</label>
          <Input
            type="text"
            value={formData.antecedentesPersonalesNoPatologicos.cambioRopa}
            onChange={(e) => handleTextChange('cambioRopa', e.target.value)}
            placeholder="Ej: Diaria, Interdiaria, etc."
            className="w-full"
          />
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
          <Input
            type="text"
            value={formData.antecedentesPersonalesNoPatologicos.frecuenciaCepillado}
            onChange={(e) => handleTextChange('frecuenciaCepillado', e.target.value)}
            placeholder="Ej: 3 veces al día, etc."
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Técnica de cepillado:</label>
          <Input
            type="text"
            value={formData.antecedentesPersonalesNoPatologicos.tecnicaCepillado}
            onChange={(e) => handleTextChange('tecnicaCepillado', e.target.value)}
            placeholder="Ej: Circular, Vertical, etc."
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Auxiliares bucales:</label>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={formData.antecedentesPersonalesNoPatologicos.auxiliaresBucales.includes('Hilo dental')}
                onChange={() => handleServiceToggle('Hilo dental')}
              />
              Hilo dental
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={formData.antecedentesPersonalesNoPatologicos.auxiliaresBucales.includes('Enjuague bucal')}
                onChange={() => handleServiceToggle('Enjuague bucal')}
              />
              Enjuague bucal
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Última visita al odontólogo:</label>
          <Input
            type="text"
            value={formData.antecedentesPersonalesNoPatologicos.ultimaVisitaOdontologo}
            onChange={(e) => handleTextChange('ultimaVisitaOdontologo', e.target.value)}
            placeholder="Ej: Hace 6 meses, etc."
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Problemas bucales:</label>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={formData.antecedentesPersonalesNoPatologicos.problemasBucales.includes('Caries')}
                onChange={() => handleServiceToggle('Caries')}
              />
              Caries
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={formData.antecedentesPersonalesNoPatologicos.problemasBucales.includes('Gingivitis')}
                onChange={() => handleServiceToggle('Gingivitis')}
              />
              Gingivitis
            </label>
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
          <label className="block text-sm font-medium mb-1">Frecuencia de bebidas azucaradas:</label>
          <Select 
            value={formData.antecedentesPersonalesNoPatologicos.frecuenciaBebidasAzucaradas} 
            onValueChange={(value) => handleAntecedenteChange('frecuenciaBebidasAzucaradas', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione frecuencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Nunca">Nunca</SelectItem>
              <SelectItem value="Ocasionalmente">Ocasionalmente</SelectItem>
              <SelectItem value="1 vez por semana">1 vez por semana</SelectItem>
              <SelectItem value="2-3 veces por semana">2-3 veces por semana</SelectItem>
              <SelectItem value="Diariamente">Diariamente</SelectItem>
              <SelectItem value="Varias veces al día">Varias veces al día</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Frecuencia de comida chatarra:</label>
          <Select 
            value={formData.antecedentesPersonalesNoPatologicos.frecuenciaComidaChatarra} 
            onValueChange={(value) => handleAntecedenteChange('frecuenciaComidaChatarra', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione frecuencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Nunca">Nunca</SelectItem>
              <SelectItem value="Ocasionalmente">Ocasionalmente</SelectItem>
              <SelectItem value="1 vez por semana">1 vez por semana</SelectItem>
              <SelectItem value="2-3 veces por semana">2-3 veces por semana</SelectItem>
              <SelectItem value="Diariamente">Diariamente</SelectItem>
              <SelectItem value="Varias veces al día">Varias veces al día</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Consumo de agua diario (Litros):</label>
          <Select 
            value={formData.antecedentesPersonalesNoPatologicos.consumoAgua} 
            onValueChange={(value) => handleAntecedenteChange('consumoAgua', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione cantidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Menos de 1 litro">Menos de 1 litro</SelectItem>
              <SelectItem value="1 litro">1 litro</SelectItem>
              <SelectItem value="1.5 litros">1.5 litros</SelectItem>
              <SelectItem value="2 litros">2 litros</SelectItem>
              <SelectItem value="2.5 litros">2.5 litros</SelectItem>
              <SelectItem value="3 litros o más">3 litros o más</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Número de comidas al día:</label>
          <Select 
            value={formData.antecedentesPersonalesNoPatologicos.numeroComidas} 
            onValueChange={(value) => handleAntecedenteChange('numeroComidas', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione número" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="6 o más">6 o más</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Horarios de comida:</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Desayuno:</label>
              <Select 
                value={formData.antecedentesPersonalesNoPatologicos.horarioComidas.desayuno} 
                onValueChange={(value) => handleAntecedenteChange('horarioComidas', {
                  ...formData.antecedentesPersonalesNoPatologicos.horarioComidas,
                  desayuno: value
                })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione horario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No desayuna">No desayuna</SelectItem>
                  <SelectItem value="Antes de las 7:00">Antes de las 7:00</SelectItem>
                  <SelectItem value="7:00 - 8:00">7:00 - 8:00</SelectItem>
                  <SelectItem value="8:00 - 9:00">8:00 - 9:00</SelectItem>
                  <SelectItem value="9:00 - 10:00">9:00 - 10:00</SelectItem>
                  <SelectItem value="Después de las 10:00">Después de las 10:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Comida/Almuerzo:</label>
              <Select 
                value={formData.antecedentesPersonalesNoPatologicos.horarioComidas.almuerzo} 
                onValueChange={(value) => handleAntecedenteChange('horarioComidas', {
                  ...formData.antecedentesPersonalesNoPatologicos.horarioComidas,
                  almuerzo: value
                })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione horario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No come/almuerza">No come/almuerza</SelectItem>
                  <SelectItem value="11:00 - 12:00">11:00 - 12:00</SelectItem>
                  <SelectItem value="12:00 - 13:00">12:00 - 13:00</SelectItem>
                  <SelectItem value="13:00 - 14:00">13:00 - 14:00</SelectItem>
                  <SelectItem value="14:00 - 15:00">14:00 - 15:00</SelectItem>
                  <SelectItem value="Después de las 15:00">Después de las 15:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Cena:</label>
              <Select 
                value={formData.antecedentesPersonalesNoPatologicos.horarioComidas.cena} 
                onValueChange={(value) => handleAntecedenteChange('horarioComidas', {
                  ...formData.antecedentesPersonalesNoPatologicos.horarioComidas,
                  cena: value
                })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione horario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No cena">No cena</SelectItem>
                  <SelectItem value="18:00 - 19:00">18:00 - 19:00</SelectItem>
                  <SelectItem value="19:00 - 20:00">19:00 - 20:00</SelectItem>
                  <SelectItem value="20:00 - 21:00">20:00 - 21:00</SelectItem>
                  <SelectItem value="21:00 - 22:00">21:00 - 22:00</SelectItem>
                  <SelectItem value="Después de las 22:00">Después de las 22:00</SelectItem>
                </SelectContent>
              </Select>
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
                onClick={() => setActiveTab('formulario')}
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'formulario' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`}
              >
                Formulario
              </button>
              <button
                onClick={() => setActiveTab('redaccion')}
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'redaccion' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`}
              >
                Redacción IA
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={handleMinimize} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <Minus className="w-5 h-5" />
            </button>
            <button onClick={handleMaximize} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <Maximize2 className="w-5 h-5" />
            </button>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className={`p-6 ${isMinimized ? 'hidden' : ''}`}>
          <h2 className="text-2xl font-bold mb-6 text-center">Antecedentes Personales No Patológicos</h2>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="formulario" className="mt-0">
              <div className="mb-6 flex flex-wrap gap-4">
                <button 
                  onClick={() => setCurrentSection('vivienda')} 
                  className={`px-4 py-2 rounded-full text-sm
