import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Eraser, Copy, CheckCircle } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ExploracionFisicaProps {
  formData: FormDataState;
  handleExploracionFisicaChange: (field: string, value: any) => void;
}

const ExploracionFisica: React.FC<ExploracionFisicaProps> = ({
  formData,
  handleExploracionFisicaChange
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [redaccion, setRedaccion] = useState("");
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const actualizarSignosVitales = (campo: string, valor: string) => {
    handleExploracionFisicaChange(`signosVitales.${campo}`, valor);
  };

  const exploracionSecciones = [
    { id: "cabeza", name: "Cabeza" },
    { id: "cuello", name: "Cuello" },
    { id: "torax", name: "Tórax" },
    { id: "abdomen", name: "Abdomen" },
    { id: "extremidades", name: "Extremidades" }
  ];

  const actualizarExploracion = (seccion: string, valor: string) => {
    handleExploracionFisicaChange(`exploracion.${seccion}`, valor);
  };

  const generarRedaccionIA = () => {
    const signosVitales = formData.exploracionFisica?.signosVitales || {};
    let texto = "EXPLORACIÓN FÍSICA:\n\n";
    
    texto += "Signos Vitales: ";
    if (signosVitales.ta) texto += `TA: ${signosVitales.ta} mmHg, `;
    if (signosVitales.fc) texto += `FC: ${signosVitales.fc} lpm, `;
    if (signosVitales.fr) texto += `FR: ${signosVitales.fr} rpm, `;
    if (signosVitales.temperatura) texto += `Temperatura: ${signosVitales.temperatura}°C, `;
    if (signosVitales.peso) texto += `Peso: ${signosVitales.peso} kg, `;
    if (signosVitales.talla) texto += `Talla: ${signosVitales.talla} cm, `;
    if (signosVitales.imc) texto += `IMC: ${signosVitales.imc} kg/m², `;
    
    texto = texto.replace(/, $/, ". ");
    
    texto += "\n\nExploración por áreas:\n";
    const exploracion = formData.exploracionFisica?.exploracion || {};
    
    exploracionSecciones.forEach(seccion => {
      const valorSeccion = exploracion[seccion.id] || "";
      if (valorSeccion) {
        texto += `${seccion.name}: ${valorSeccion}\n`;
      } else {
        texto += `${seccion.name}: Sin alteraciones aparentes.\n`;
      }
    });

    setRedaccion(texto);
    setShowForm(false);
    setProgress(100);
  };

  const limpiarFormulario = () => {
    const camposSignosVitales = ["ta", "fc", "fr", "temperatura", "peso", "talla", "imc"];
    camposSignosVitales.forEach(campo => {
      actualizarSignosVitales(campo, "");
    });
    
    exploracionSecciones.forEach(seccion => {
      actualizarExploracion(seccion.id, "");
    });
    
    setRedaccion("");
    setShowForm(true);
    setProgress(0);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(redaccion);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
              <button
                onClick={() => setShowForm(true)}
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${showForm ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}
              >
                Formulario
              </button>
              <button
                onClick={() => setShowForm(false)}
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${!showForm ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}
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
            <span className="text-gray-400">IX.</span> EXPLORACIÓN FÍSICA
          </h2>
        </div>

        {!isMinimized && <div className="p-6">
          {showForm ? (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium mb-4">Signos Vitales</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="ta">Tensión Arterial (mmHg)</Label>
                    <Input
                      id="ta"
                      value={formData.exploracionFisica?.signosVitales?.ta || ''}
                      onChange={(e) => actualizarSignosVitales("ta", e.target.value)}
                      placeholder="Ej. 120/80"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fc">Frecuencia Cardiaca (lpm)</Label>
                    <Input
                      id="fc"
                      value={formData.exploracionFisica?.signosVitales?.fc || ''}
                      onChange={(e) => actualizarSignosVitales("fc", e.target.value)}
                      placeholder="Ej. 72"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fr">Frecuencia Respiratoria (rpm)</Label>
                    <Input
                      id="fr"
                      value={formData.exploracionFisica?.signosVitales?.fr || ''}
                      onChange={(e) => actualizarSignosVitales("fr", e.target.value)}
                      placeholder="Ej. 16"
                    />
                  </div>
                  <div>
                    <Label htmlFor="temperatura">Temperatura (°C)</Label>
                    <Input
                      id="temperatura"
                      value={formData.exploracionFisica?.signosVitales?.temperatura || ''}
                      onChange={(e) => actualizarSignosVitales("temperatura", e.target.value)}
                      placeholder="Ej. 36.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="peso">Peso (kg)</Label>
                    <Input
                      id="peso"
                      value={formData.exploracionFisica?.signosVitales?.peso || ''}
                      onChange={(e) => actualizarSignosVitales("peso", e.target.value)}
                      placeholder="Ej. 70"
                    />
                  </div>
                  <div>
                    <Label htmlFor="talla">Talla (cm)</Label>
                    <Input
                      id="talla"
                      value={formData.exploracionFisica?.signosVitales?.talla || ''}
                      onChange={(e) => actualizarSignosVitales("talla", e.target.value)}
                      placeholder="Ej. 170"
                    />
                  </div>
                  <div>
                    <Label htmlFor="imc">IMC (kg/m²)</Label>
                    <Input
                      id="imc"
                      value={formData.exploracionFisica?.signosVitales?.imc || ''}
                      onChange={(e) => actualizarSignosVitales("imc", e.target.value)}
                      placeholder="Ej. 24.2"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium mb-4">Exploración por áreas</h3>
                
                <Tabs defaultValue={exploracionSecciones[0].id} className="w-full">
                  <TabsList className="grid grid-cols-2 md:grid-cols-5">
                    {exploracionSecciones.map(seccion => (
                      <TabsTrigger key={seccion.id} value={seccion.id}>
                        {seccion.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {exploracionSecciones.map(seccion => (
                    <TabsContent key={seccion.id} value={seccion.id} className="p-4 border rounded-md mt-4">
                      <Label htmlFor={`exploracion-${seccion.id}`} className="text-gray-700 dark:text-gray-300 font-medium">
                        {seccion.name}
                      </Label>
                      <Textarea
                        id={`exploracion-${seccion.id}`}
                        value={formData.exploracionFisica?.exploracion?.[seccion.id] || ''}
                        onChange={(e) => actualizarExploracion(seccion.id, e.target.value)}
                        placeholder={`Describa los hallazgos en ${seccion.name.toLowerCase()}`}
                        className="mt-2 min-h-[120px]"
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </div>

              <div className="flex justify-center gap-4 mt-6">
                <Button
                  onClick={generarRedaccionIA}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Generar Redacción IA
                </Button>
                <Button
                  onClick={limpiarFormulario}
                  variant="outline"
                  className="border-gray-300 text-gray-700 dark:text-gray-300"
                >
                  Limpiar Formulario
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-semibold">Redacción</h4>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
                <Textarea
                  value={redaccion}
                  readOnly
                  className="min-h-[300px] text-sm bg-white/50 dark:bg-gray-800/50 whitespace-pre-wrap"
                />
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={() => setShowForm(true)}
                  variant="outline"
                  className="border-gray-300 text-gray-700 dark:text-gray-300"
                >
                  Volver al Formulario
                </Button>
              </div>
            </div>
          )}
        </div>}
      </Card>
    </div>
  );
};

export default ExploracionFisica;
