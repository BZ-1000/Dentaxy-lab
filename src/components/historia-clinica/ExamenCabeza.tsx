import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2, Maximize2, Minus, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [activeTab, setActiveTab] = useState('formulario');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [redactionContent, setRedactionContent] = useState<string>(formData.examenCabeza?.redaccion || '');
  const [lesionData, setLesionData] = useState({
    presente: formData.examenCabeza?.lesiones?.presente || false,
    detalles: formData.examenCabeza?.lesiones?.detalles || '',
    tamanio: formData.examenCabeza?.lesiones?.tamanio || '',
    color: formData.examenCabeza?.lesiones?.color || '',
    bordes: formData.examenCabeza?.lesiones?.bordes || '',
    localizacion: formData.examenCabeza?.lesiones?.localizacion || '',
    elevacion: formData.examenCabeza?.lesiones?.elevacion || '',
    tipo: formData.examenCabeza?.lesiones?.tipo || '',
    antiguedad: formData.examenCabeza?.lesiones?.antiguedad || '',
    coloracion: formData.examenCabeza?.lesiones?.coloracion || '',
    zonaAfectada: formData.examenCabeza?.lesiones?.zonaAfectada || '',
    forma: formData.examenCabeza?.lesiones?.forma || '',
    numero: formData.examenCabeza?.lesiones?.numero || '',
    distribucion: formData.examenCabeza?.lesiones?.distribucion || '',
    consistencia: formData.examenCabeza?.lesiones?.consistencia || '',
  });

  const handleRedactionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRedactionContent(e.target.value);
    handleExamenCabezaChange('redaccion', e.target.value);
  };

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

  const generateAIRedaction = () => {
    setIsGeneratingAI(true);
    setTimeout(() => {
      const generatedContent = `
        Al examen de la cabeza, se observa:
        - Cráneo: ${formData.examenCabeza?.craneo || 'sin alteraciones'}
        - Cabello: ${formData.examenCabeza?.cabello || 'normal'}
        - Cuero cabelludo: ${formData.examenCabeza?.cueroCabelludo || 'sin particularidades'}
        - Cara: ${formData.examenCabeza?.cara || 'simétrica'}
        - Piel: ${formData.examenCabeza?.piel || 'hidratada, sin lesiones aparentes'}
        - Lesiones: ${lesionData.presente ? 'presenta lesiones' : 'no presenta lesiones'}, con detalles: ${lesionData.detalles || 'sin detalles adicionales'}
      `;
      setRedactionContent(generatedContent);
      handleExamenCabezaChange('redaccion', generatedContent);
      setIsGeneratingAI(false);
      setActiveTab('redaccion');
    }, 1500);
  };

  const handleLesionChange = (field: string, value: any) => {
    setLesionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLesionSwitchChange = (value: boolean) => {
    handleLesionChange('presente', value);
    setLesionData(prev => ({
      ...prev,
      presente: value
    }));
  };

  const handleSaveLesionData = () => {
    handleExamenCabezaChange('lesiones', JSON.stringify(lesionData));
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
          <div className="p-6 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="formulario">Formulario</TabsTrigger>
                <TabsTrigger value="redaccion">Redacción IA</TabsTrigger>
              </TabsList>
              <TabsContent value="formulario" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="craneo">Cráneo</Label>
                    <Input
                      id="craneo"
                      value={formData.examenCabeza?.craneo || ''}
                      onChange={(e) => handleExamenCabezaChange('craneo', e.target.value)}
                      placeholder="Descripción del cráneo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cabello">Cabello</Label>
                    <Input
                      id="cabello"
                      value={formData.examenCabeza?.cabello || ''}
                      onChange={(e) => handleExamenCabezaChange('cabello', e.target.value)}
                      placeholder="Descripción del cabello"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cueroCabelludo">Cuero cabelludo</Label>
                    <Input
                      id="cueroCabelludo"
                      value={formData.examenCabeza?.cueroCabelludo || ''}
                      onChange={(e) => handleExamenCabezaChange('cueroCabelludo', e.target.value)}
                      placeholder="Descripción del cuero cabelludo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cara">Cara</Label>
                    <Input
                      id="cara"
                      value={formData.examenCabeza?.cara || ''}
                      onChange={(e) => handleExamenCabezaChange('cara', e.target.value)}
                      placeholder="Descripción de la cara"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="piel">Piel</Label>
                    <Input
                      id="piel"
                      value={formData.examenCabeza?.piel || ''}
                      onChange={(e) => handleExamenCabezaChange('piel', e.target.value)}
                      placeholder="Descripción de la piel"
                    />
                  </div>
                </div>

                <div className="space-y-2 border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="lesiones" className="font-semibold">Lesiones</Label>
                    <Switch
                      id="lesiones"
                      checked={lesionData.presente || false}
                      onCheckedChange={handleLesionSwitchChange}
                    />
                  </div>

                  {lesionData.presente && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="detalles">Detalles</Label>
                        <Textarea
                          id="detalles"
                          value={lesionData.detalles || ''}
                          onChange={(e) => handleLesionChange('detalles', e.target.value)}
                          placeholder="Detalles de la lesión"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tamanio">Tamaño</Label>
                        <Input
                          id="tamanio"
                          value={lesionData.tamanio || ''}
                          onChange={(e) => handleLesionChange('tamanio', e.target.value)}
                          placeholder="Tamaño de la lesión"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="color">Color</Label>
                        <Input
                          id="color"
                          value={lesionData.color || ''}
                          onChange={(e) => handleLesionChange('color', e.target.value)}
                          placeholder="Color de la lesión"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bordes">Bordes</Label>
                        <Input
                          id="bordes"
                          value={lesionData.bordes || ''}
                          onChange={(e) => handleLesionChange('bordes', e.target.value)}
                          placeholder="Bordes de la lesión"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="localizacion">Localización</Label>
                        <Input
                          id="localizacion"
                          value={lesionData.localizacion || ''}
                          onChange={(e) => handleLesionChange('localizacion', e.target.value)}
                          placeholder="Localización de la lesión"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="elevacion">Elevación</Label>
                        <Input
                          id="elevacion"
                          value={lesionData.elevacion || ''}
                          onChange={(e) => handleLesionChange('elevacion', e.target.value)}
                          placeholder="Elevación de la lesión"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tipo">Tipo</Label>
                        <Input
                          id="tipo"
                          value={lesionData.tipo || ''}
                          onChange={(e) => handleLesionChange('tipo', e.target.value)}
                          placeholder="Tipo de lesión"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="antiguedad">Antigüedad</Label>
                        <Input
                          id="antiguedad"
                          value={lesionData.antiguedad || ''}
                          onChange={(e) => handleLesionChange('antiguedad', e.target.value)}
                          placeholder="Antigüedad de la lesión"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="coloracion">Coloración</Label>
                        <Input
                          id="coloracion"
                          value={lesionData.coloracion || ''}
                          onChange={(e) => handleLesionChange('coloracion', e.target.value)}
                          placeholder="Coloración de la lesión"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zonaAfectada">Zona Afectada</Label>
                        <Input
                          id="zonaAfectada"
                          value={lesionData.zonaAfectada || ''}
                          onChange={(e) => handleLesionChange('zonaAfectada', e.target.value)}
                          placeholder="Zona Afectada por la lesión"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="forma">Forma</Label>
                        <Input
                          id="forma"
                          value={lesionData.forma || ''}
                          onChange={(e) => handleLesionChange('forma', e.target.value)}
                          placeholder="Forma de la lesión"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="numero">Número</Label>
                        <Input
                          id="numero"
                          value={lesionData.numero || ''}
                          onChange={(e) => handleLesionChange('numero', e.target.value)}
                          placeholder="Número de lesiones"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="distribucion">Distribución</Label>
                        <Input
                          id="distribucion"
                          value={lesionData.distribucion || ''}
                          onChange={(e) => handleLesionChange('distribucion', e.target.value)}
                          placeholder="Distribución de la lesión"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="consistencia">Consistencia</Label>
                        <Input
                          id="consistencia"
                          value={lesionData.consistencia || ''}
                          onChange={(e) => handleLesionChange('consistencia', e.target.value)}
                          placeholder="Consistencia de la lesión"
                        />
                      </div>
                    </div>
                  )}
                  <Button onClick={handleSaveLesionData}>Guardar datos de lesión</Button>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    onClick={generateAIRedaction}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={isGeneratingAI}
                  >
                    {isGeneratingAI ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generando redacción...
                      </>
                    ) : (
                      'Generar redacción IA'
                    )}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="redaccion">
                <div className="min-h-[200px] bg-gray-50 dark:bg-gray-900 rounded-md p-4 mb-4">
                  <Textarea
                    value={redactionContent}
                    onChange={handleRedactionChange}
                    placeholder="La redacción generada por IA aparecerá aquí"
                    className="min-h-[150px] border-none bg-transparent focus-visible:ring-0 resize-none whitespace-pre-wrap"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={generateAIRedaction}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={isGeneratingAI}
                  >
                    {isGeneratingAI ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Regenerando...
                      </>
                    ) : (
                      'Regenerar redacción'
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExamenCabeza;
