import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Eraser, Copy, CheckCircle } from "lucide-react";

const AntecedentesPersonalesNoPatologicos = () => {
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
            <button onClick={handleMinimize} className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors" aria-label={isMinimized ? "Expandir" : "Minimizar"}>
              <Minus className="w-4 h-4" />
            </button>
            <button onClick={handleMaximize} className="p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors" aria-label={isMaximized ? "Restaurar" : "Maximizar"}>
              <Maximize2 className="w-4 h-4" />
            </button>
            <button onClick={handleClose} className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors" aria-label="Cerrar">
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
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Servicios Domiciliarios</h4>
                <div className="grid gap-4">
                  <div>
                    <Label>Tipo de Vivienda</Label>
                    <RadioGroup defaultValue="urbana" className="flex gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="urbana" id="urbana" />
                        <Label htmlFor="urbana">Urbana</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rural" id="rural" />
                        <Label htmlFor="rural">Rural</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="semiurbana" id="semiurbana" />
                        <Label htmlFor="semiurbana">Semiurbana</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label>Material Predominante de la Vivienda</Label>
                    <Select className="mt-2">
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
                    <Label>Servicios Disponibles</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="agua" />
                        <Label htmlFor="agua">Agua</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="luz" />
                        <Label htmlFor="luz">Luz</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="drenaje" />
                        <Label htmlFor="drenaje">Drenaje</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="transporte" />
                        <Label htmlFor="transporte">Transporte</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="internet" />
                        <Label htmlFor="internet">Internet</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="gas" />
                        <Label htmlFor="gas">Gas</Label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Condiciones de la Calle</Label>
                    <RadioGroup defaultValue="pavimentada" className="flex gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pavimentada" id="pavimentada" />
                        <Label htmlFor="pavimentada">Pavimentada</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sin-pavimentar" id="sin-pavimentar" />
                        <Label htmlFor="sin-pavimentar">Sin pavimentar</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label>Iluminación en la Calle</Label>
                    <RadioGroup defaultValue="bien-iluminada" className="flex gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bien-iluminada" id="bien-iluminada" />
                        <Label htmlFor="bien-iluminada">Bien iluminada</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="poca-iluminacion" id="poca-iluminacion" />
                        <Label htmlFor="poca-iluminacion">Poca iluminación</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sin-iluminacion" id="sin-iluminacion" />
                        <Label htmlFor="sin-iluminacion">Sin iluminación</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Higiene de la Vivienda</h4>
                <div className="grid gap-4">
                  <div>
                    <Label>Regularidad en el Aseo de la Vivienda</Label>
                    <Select className="mt-2">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diariamente">Diariamente</SelectItem>
                        <SelectItem value="semanalmente">Semanalmente</SelectItem>
                        <SelectItem value="quincenal">Quincenal</SelectItem>
                        <SelectItem value="esporadico">Esporádico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Cambio de Ropa de Cama</Label>
                    <Select className="mt-2">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diario">Diario</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="quincenal">Quincenal</SelectItem>
                        <SelectItem value="mensual">Mensual</SelectItem>
                        <SelectItem value="no-regular">No se cambia regularmente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mt-2">
                    <Label>Presencia de Hacinamiento</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <CustomCheckbox id="hacinamiento" />
                      <Label htmlFor="hacinamiento">Sí, duermen más de 3 personas en una habitación</Label>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Label>Presencia de Promiscuidad</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <CustomCheckbox id="promiscuidad" />
                      <Label htmlFor="promiscuidad">Sí</Label>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Label>Presencia de Animales en Casa</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <CustomCheckbox id="animales-dentro" />
                      <Label htmlFor="animales-dentro">Sí, dentro de la casa</Label>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <CustomCheckbox id="animales-patio" />
                      <Label htmlFor="animales-patio">Sí, en el patio</Label>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <CustomCheckbox id="no-mascotas" />
                      <Label htmlFor="no-mascotas">No tienen mascotas</Label>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Label>Manejo de Residuos</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <CustomCheckbox id="recicla" />
                      <Label htmlFor="recicla">Separa y recicla la basura</Label>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <CustomCheckbox id="basura-diaria" />
                      <Label htmlFor="basura-diaria">Bota la basura diariamente</Label>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <CustomCheckbox id="acumula-basura" />
                      <Label htmlFor="acumula-basura">Acumula basura dentro de la vivienda</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Higiene Personal</h4>
                <div className="grid gap-4">
                  <div>
                    <Label>Frecuencia de Baño</Label>
                    <Select className="mt-2">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diario">Diario</SelectItem>
                        <SelectItem value="cada-2-dias">Cada 2 días</SelectItem>
                        <SelectItem value="cada-3-dias">Cada 3 días</SelectItem>
                        <SelectItem value="esporadico">Esporádico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Aseo de Manos</Label>
                    <Select className="mt-2">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="antes-comida">Antes de cada comida</SelectItem>
                        <SelectItem value="despues-bano">Después de ir al baño</SelectItem>
                        <SelectItem value="antes-despues-comida">Antes y después de manipular alimentos</SelectItem>
                        <SelectItem value="no-regular">No tiene hábito regular de lavado de manos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Cambio de Ropa</Label>
                    <Select className="mt-2">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diario">Diario</SelectItem>
                        <SelectItem value="cada-2-dias">Cada 2 días</SelectItem>
                        <SelectItem value="cada-3-dias">Cada 3 días</SelectItem>
                        <SelectItem value="esporadico">Esporádico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Higiene Bucal</h4>
                <div className="grid gap-4">
                  <div>
                    <Label>Frecuencia de Cepillado Dental</Label>
                    <Select className="mt-2">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3-veces">3 veces al día</SelectItem>
                        <SelectItem value="2-veces">2 veces al día</SelectItem>
                        <SelectItem value="1-vez">1 vez al día</SelectItem>
                        <SelectItem value="menos-1-vez">Menos de una vez al día</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Técnica de Cepillado Empleada</Label>
                    <Select className="mt-2">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione técnica" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="circular">Circular</SelectItem>
                        <SelectItem value="horizontal">Horizontal</SelectItem>
                        <SelectItem value="vertical">Vertical</SelectItem>
                        <SelectItem value="barrido">De barrido</SelectItem>
                        <SelectItem value="no-sabe">No sabe cómo se cepilla</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mt-2">
                    <Label>Uso de Auxiliares</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="hilo-dental" />
                        <Label htmlFor="hilo-dental">Hilo Dental</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="enjuague" />
                        <Label htmlFor="enjuague">Enjuague Bucal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="irrigador" />
                        <Label htmlFor="irrigador">Irrigador Dental</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="no-auxiliares" />
                        <Label htmlFor="no-auxiliares">No usa auxiliares</Label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Última Visita al Odontólogo</Label>
                    <Select className="mt-2">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione tiempo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="menos-6-meses">Menos de 6 meses</SelectItem>
                        <SelectItem value="1-ano">1 año</SelectItem>
                        <SelectItem value="mas-2-anos">Más de 2 años</SelectItem>
                        <SelectItem value="nunca">Nunca ha visitado al odontólogo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mt-2">
                    <Label>Problemas Bucales Presentes</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="encias-sangran" />
                        <Label htmlFor="encias-sangran">Encías que sangran al cepillarse</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="dientes-agujeros" />
                        <Label htmlFor="dientes-agujeros">Dientes con agujeros o zonas oscuras</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="mal-aliento" />
                        <Label htmlFor="mal-aliento">Mal aliento frecuente</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="dolor-dientes" />
                        <Label htmlFor="dolor-dientes">Dolor en dientes o encías</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="no-problemas" />
                        <Label htmlFor="no-problemas">No tengo problemas bucales</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Alimentación</h4>
                <div className="grid gap-4">
                  <div>
                    <Label>Tipo de Alimentos Consumidos Frecuentemente</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="frutas-verduras" />
                        <Label htmlFor="frutas-verduras">Frutas y verduras</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="carnes-proteinas" />
                        <Label htmlFor="carnes-proteinas">Carnes y proteínas</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="alimentos-procesados" />
                        <Label htmlFor="alimentos-procesados">Alimentos procesados y fritos</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="dulces-azucares" />
                        <Label htmlFor="dulces-azucares">Dulces y azúcares</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="lacteos" />
                        <Label htmlFor="lacteos">Lácteos</Label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Frecuencia de Consumo de Frutas y Verduras</Label>
                    <Select className="mt-2">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diario">Diario</SelectItem>
                        <SelectItem value="3-4-veces-semana">3-4 veces por semana</SelectItem>
                        <SelectItem value="ocasionalmente">Ocasionalmente</SelectItem>
                        <SelectItem value="no-consume">No las consume</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Frecuencia de Consumo de Bebidas Azucaradas</Label>
                    <Select className="mt-2">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diario">Diario</SelectItem>
                        <SelectItem value="3-4-veces-semana">3-4 veces por semana</SelectItem>
                        <SelectItem value="ocasionalmente">Ocasionalmente</SelectItem>
                        <SelectItem value="no-consume">No las consume</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Frecuencia de Consumo de Comida Chatarra</Label>
                    <Select className="mt-2">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diario">Diario</SelectItem>
                        <SelectItem value="3-4-veces-semana">3-4 veces por semana</SelectItem>
                        <SelectItem value="ocasionalmente">Ocasionalmente</SelectItem>
                        <SelectItem value="no-consume">No la consume</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Consumo de Agua al Día</Label>
                    <Select className="mt-2">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione cantidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mas-2-litros">Más de 2 litros</SelectItem>
                        <SelectItem value="1-2-litros">1-2 litros</SelectItem>
                        <SelectItem value="menos-1-litro">Menos de 1 litro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Hábitos Alimenticios</h4>
                <div className="grid gap-4">
                  <div>
                    <Label>Número de Comidas al Día</Label>
                    <Select className="mt-2">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione número" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3-comidas">3 comidas</SelectItem>
                        <SelectItem value="4-comidas">4 comidas</SelectItem>
                        <SelectItem value="5-o-mas">5 o más comidas</SelectItem>
                        <SelectItem value="menos-3-comidas">Menos de 3 comidas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Horario de Comidas</Label>
                    <RadioGroup defaultValue="fijo" className="flex gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fijo" id="fijo" />
                        <Label htmlFor="fijo">Fijo (desayuno, almuerzo, cena)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="irregular" id="irregular" />
                        <Label htmlFor="irregular">Irregular</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="mt-2">
                    <Label>Saltas Alguna Comida Frecuentemente?</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="salta-desayuno" />
                        <Label htmlFor="salta-desayuno">Sí, el desayuno</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="salta-almuerzo" />
                        <Label htmlFor="salta-almuerzo">Sí, el almuerzo</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="salta-cena" />
                        <Label htmlFor="salta-cena">Sí, la cena</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="no-salta" />
                        <Label htmlFor="no-salta">No</Label>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Label>Realizas Ayuno Prolongado?</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="ayuno-eleccion" />
                        <Label htmlFor="ayuno-eleccion">Sí, por elección</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="ayuno-acceso" />
                        <Label htmlFor="ayuno-acceso">Sí, por falta de acceso a alimentos</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="no-ayuno" />
                        <Label htmlFor="no-ayuno">No</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <Button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
                <span>Generar Vista Previa</span>
              </Button>
              <Button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2">
                <Eraser className="w-4 h-4" />
                <span>Limpiar Formulario</span>
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AntecedentesPersonalesNoPatologicos;
