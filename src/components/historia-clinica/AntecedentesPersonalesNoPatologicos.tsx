import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Eraser, Copy, CheckCircle } from "lucide-react";

interface AntecedentesPersonalesNoPatologicosProps {
  formData: {
    serviciosDomiciliarios: string;
    pisosVivienda: string;
    materialVivienda: string;
    materialPiso: string;
    ventilacion: string;
    frecuenciaLimpieza: string;
    hacinamiento: string;
    frecuenciaBano: string;
    higieneBucal: {
      frecuenciaCepillado: string;
      usoHiloDental: string;
      tipoCerdas: string;
      cantidadPasta: string;
      marcaPasta: string;
    };
    alimentacion: {
      tipoDieta: string;
      frecuenciaComidas: string;
      tiposAlimentos: string;
      saltaComidas: string;
      consumoNutritivo: string;
    };
    grupoSanguineo: string;
    factorRh: string;
    inmunizaciones: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
                    </RadioGroup>
                  </div>
                  <div>
                    <Label>Servicios</Label>
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
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Higiene de la Vivienda</h4>
                <div className="grid gap-4">
                  <div>
                    <Label>Frecuencia de Limpieza</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
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
                  <div className="mt-2">
                    <Label>Hacinamiento</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <CustomCheckbox id="hacinamiento" />
                      <Label htmlFor="hacinamiento">Presente</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Higiene Personal</h4>
                <div className="grid gap-4">
                  <div>
                    <Label>Frecuencia de Baño</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diario">Diario</SelectItem>
                        <SelectItem value="cada-tercer-dia">Cada tercer día</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Higiene Bucal</h4>
                <div className="grid gap-4">
                  <div>
                    <Label>Frecuencia de Cepillado</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 vez al día</SelectItem>
                        <SelectItem value="2">2 veces al día</SelectItem>
                        <SelectItem value="3">3 veces al día</SelectItem>
                        <SelectItem value="mas">Más de 3 veces al día</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mt-2">
                    <Label>Auxiliares de Higiene</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="hilo-dental" />
                        <Label htmlFor="hilo-dental">Hilo Dental</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox id="enjuague" />
                        <Label htmlFor="enjuague">Enjuague Bucal</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Grupo Sanguíneo y Factor RH</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Grupo Sanguíneo</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Seleccione grupo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="O">O</SelectItem>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="AB">AB</SelectItem>
                        <SelectItem value="desconoce">Desconoce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Factor RH</Label>
                    <RadioGroup defaultValue="positivo" className="flex gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="positivo" id="rh-positivo" />
                        <Label htmlFor="rh-positivo">Positivo</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="negativo" id="rh-negativo" />
                        <Label htmlFor="rh-negativo">Negativo</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Inmunizaciones</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CustomCheckbox id="esquema-completo" />
                    <Label htmlFor="esquema-completo">Esquema de vacunación completo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CustomCheckbox id="cartilla" />
                    <Label htmlFor="cartilla">Cuenta con cartilla nacional de vacunación</Label>
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
