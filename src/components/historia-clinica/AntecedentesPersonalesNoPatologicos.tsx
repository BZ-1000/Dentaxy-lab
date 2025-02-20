import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';

interface AntecedentesPersonalesNoPatologicosProps {
  formData: FormDataState;
  handleInputChange: (section: string, field: string, value: any) => void;
}

const AntecedentesPersonalesNoPatologicos = ({
  formData,
  handleInputChange,
}: AntecedentesPersonalesNoPatologicosProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const formRef = useRef(null);

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
                Vista Previa
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
            <span className="text-gray-400">III.</span> ANTECEDENTES PERSONALES NO PATOLÓGICOS
          </h2>
        </div>

        {!isMinimized && (
          <div className="p-6" ref={formRef}>
            <div className="space-y-6">
              {/* Servicios Domiciliarios */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Servicios Domiciliarios</h4>
                <div className="grid gap-4">
                  <div>
                    <Label>Tipo de Vivienda</Label>
                    <RadioGroup 
                      value={formData.serviciosDomiciliarios.tipoVivienda}
                      onValueChange={(value) => handleInputChange('serviciosDomiciliarios', 'tipoVivienda', value)}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rural" id="rural" />
                        <Label htmlFor="rural">Rural</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="urbana" id="urbana" />
                        <Label htmlFor="urbana">Urbana</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="semiurbana" id="semiurbana" />
                        <Label htmlFor="semiurbana">Semiurbana</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>Material Predominante de la Vivienda</Label>
                    <Select 
                      value={formData.serviciosDomiciliarios.materialVivienda}
                      onValueChange={(value) => handleInputChange('serviciosDomiciliarios', 'materialVivienda', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione material" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concreto">Concreto</SelectItem>
                        <SelectItem value="madera">Madera</SelectItem>
                        <SelectItem value="lamina">Lámina</SelectItem>
                        <SelectItem value="ladrillo">Ladrillo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Pisos en la Vivienda</Label>
                    <RadioGroup
                      value={formData.pisosVivienda}
                      onValueChange={(value) => handleInputChange('pisosVivienda', 'pisosVivienda', value)}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="uno" id="uno" />
                        <Label htmlFor="uno">Uno</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dosomas" id="dosomas" />
                        <Label htmlFor="dosomas">Dos o más</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>Material del Piso</Label>
                    <Select
                      value={formData.materialPiso}
                      onValueChange={(value) => handleInputChange('materialPiso', 'materialPiso', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione material" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cemento">Cemento</SelectItem>
                        <SelectItem value="madera">Madera</SelectItem>
                        <SelectItem value="loseta">Loseta</SelectItem>
                        <SelectItem value="tierra">Tierra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Ventilación</Label>
                    <RadioGroup
                      value={formData.ventilacion}
                      onValueChange={(value) => handleInputChange('ventilacion', 'ventilacion', value)}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="buena" id="buena" />
                        <Label htmlFor="buena">Buena</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mala" id="mala" />
                        <Label htmlFor="mala">Mala</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>Frecuencia de Limpieza</Label>
                    <Select
                      value={formData.frecuenciaLimpieza}
                      onValueChange={(value) => handleInputChange('frecuenciaLimpieza', 'frecuenciaLimpieza', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diaria">Diaria</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="quincenal">Quincenal</SelectItem>
                        <SelectItem value="mensual">Mensual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Hacinamiento</Label>
                    <RadioGroup
                      value={formData.hacinamiento}
                      onValueChange={(value) => handleInputChange('hacinamiento', 'hacinamiento', value)}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="si" id="si-hacinamiento" />
                        <Label htmlFor="si-hacinamiento">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no-hacinamiento" />
                        <Label htmlFor="no-hacinamiento">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* Higiene de la Vivienda */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Higiene de la Vivienda</h4>
                <div className="grid gap-4">
                  <div>
                    <Label>Condiciones de la Calle</Label>
                    <Select
                      value={formData.serviciosDomiciliarios.condicionesCalle}
                      onValueChange={(value) => handleInputChange('serviciosDomiciliarios', 'condicionesCalle', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione condición" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pavimentada">Pavimentada</SelectItem>
                        <SelectItem value="terraceria">Terracería</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Iluminación en la Calle</Label>
                    <RadioGroup
                      value={formData.serviciosDomiciliarios.iluminacionCalle}
                      onValueChange={(value) => handleInputChange('serviciosDomiciliarios', 'iluminacionCalle', value)}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="si" id="si-iluminacion" />
                        <Label htmlFor="si-iluminacion">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no-iluminacion" />
                        <Label htmlFor="no-iluminacion">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* Higiene Personal */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Higiene Personal</h4>
                <div className="grid gap-4">
                  <div>
                    <Label>Frecuencia de Baño</Label>
                    <Select
                      value={formData.frecuenciaBano}
                      onValueChange={(value) => handleInputChange('frecuenciaBano', 'frecuenciaBano', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diario">Diario</SelectItem>
                        <SelectItem value="interdiario">Interdiario</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Higiene Bucal */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Higiene Bucal</h4>
                <div className="grid gap-4">
                  <div>
                    <Label>Frecuencia de Cepillado</Label>
                    <Select
                      value={formData.higieneBucal.frecuenciaCepillado}
                      onValueChange={(value) => handleInputChange('higieneBucal', 'frecuenciaCepillado', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="despues-cada-comida">Después de cada comida</SelectItem>
                        <SelectItem value="tres-veces-al-dia">Tres veces al día</SelectItem>
                        <SelectItem value="dos-veces-al-dia">Dos veces al día</SelectItem>
                        <SelectItem value="una-vez-al-dia">Una vez al día</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Uso de Hilo Dental</Label>
                    <RadioGroup
                      value={formData.higieneBucal.usoHiloDental}
                      onValueChange={(value) => handleInputChange('higieneBucal', 'usoHiloDental', value)}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="si" id="si-hilo" />
                        <Label htmlFor="si-hilo">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no-hilo" />
                        <Label htmlFor="no-hilo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>Tipo de Cerdas del Cepillo</Label>
                    <Select
                      value={formData.higieneBucal.tipoCerdas}
                      onValueChange={(value) => handleInputChange('higieneBucal', 'tipoCerdas', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="suaves">Suaves</SelectItem>
                        <SelectItem value="medias">Medias</SelectItem>
                        <SelectItem value="duras">Duras</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Cantidad de Pasta Dental</Label>
                    <Select
                      value={formData.higieneBucal.cantidadPasta}
                      onValueChange={(value) => handleInputChange('higieneBucal', 'cantidadPasta', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione cantidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pequena">Pequeña</SelectItem>
                        <SelectItem value="mediana">Mediana</SelectItem>
                        <SelectItem value="grande">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Marca de Pasta Dental</Label>
                    <Select
                      value={formData.higieneBucal.marcaPasta}
                      onValueChange={(value) => handleInputChange('higieneBucal', 'marcaPasta', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione marca" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="colgate">Colgate</SelectItem>
                        <SelectItem value="crest">Crest</SelectItem>
                        <SelectItem value="sensodyne">Sensodyne</SelectItem>
                        <SelectItem value="oral-b">Oral-B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Alimentación */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Alimentación</h4>
                <div className="grid gap-4">
                  <div>
                    <Label>Tipo de Dieta</Label>
                    <Select
                      value={formData.alimentacion.tipoDieta}
                      onValueChange={(value) => handleInputChange('alimentacion', 'tipoDieta', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balanceada">Balanceada</SelectItem>
                        <SelectItem value="vegetariana">Vegetariana</SelectItem>
                        <SelectItem value="vegana">Vegana</SelectItem>
                        <SelectItem value="alta-en-proteinas">Alta en proteínas</SelectItem>
                        <SelectItem value="baja-en-carbohidratos">Baja en carbohidratos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Frecuencia de Comidas al Día</Label>
                    <Select
                      value={formData.alimentacion.frecuenciaComidas}
                      onValueChange={(value) => handleInputChange('alimentacion', 'frecuenciaComidas', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tres-comidas">Tres comidas</SelectItem>
                        <SelectItem value="cuatro-comidas">Cuatro comidas</SelectItem>
                        <SelectItem value="cinco-comidas">Cinco comidas</SelectItem>
                        <SelectItem value="mas-de-cinco-comidas">Más de cinco comidas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Tipos de Alimentos que Consume</Label>
                    <Select
                      value={formData.alimentacion.tiposAlimentos}
                      onValueChange={(value) => handleInputChange('alimentacion', 'tiposAlimentos', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione tipos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frutas-y-verduras">Frutas y verduras</SelectItem>
                        <SelectItem value="carnes-y-pescados">Carnes y pescados</SelectItem>
                        <SelectItem value="cereales-y-legumbres">Cereales y legumbres</SelectItem>
                        <SelectItem value="lacteos">Lácteos</SelectItem>
                        <SelectItem value="grasas-y-aceites">Grasas y aceites</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>¿Salta Comidas?</Label>
                    <RadioGroup
                      value={formData.alimentacion.saltaComidas}
                      onValueChange={(value) => handleInputChange('alimentacion', 'saltaComidas', value)}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="si" id="si-salta-comidas" />
                        <Label htmlFor="si-salta-comidas">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no-salta-comidas" />
                        <Label htmlFor="no-salta-comidas">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>¿Considera que su Consumo es Nutritivo?</Label>
                    <RadioGroup
                      value={formData.alimentacion.consumoNutritivo}
                      onValueChange={(value) => handleInputChange('alimentacion', 'consumoNutritivo', value)}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="si" id="si-nutritivo" />
                        <Label htmlFor="si-nutritivo">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no-nutritivo" />
                        <Label htmlFor="no-nutritivo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AntecedentesPersonalesNoPatologicos;
