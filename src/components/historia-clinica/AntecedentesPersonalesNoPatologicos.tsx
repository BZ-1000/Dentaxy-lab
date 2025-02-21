import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';

interface Props {
  formData: FormDataState;
  handleInputChange: (section: string, field: string, value: any) => void;
}

const AntecedentesPersonalesNoPatologicos = ({
  formData,
  handleInputChange,
}: Props) => {
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
    setShowForm(false);
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold">Antecedentes Personales No Patológicos</h3>
          <div className="space-x-2">
            <button onClick={handleMinimize} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
              {isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
            </button>
            <button onClick={handleMaximize} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
              <Maximize2 size={16} />
            </button>
            <button onClick={handleClose} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
              <X size={16} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className="p-6" ref={formRef}>
            <div className="space-y-6">
              {/* Alimentación */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Alimentación</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipoAlimentacion">Tipo de Alimentación</Label>
                    <Select
                      id="tipoAlimentacion"
                      value={formData.alimentacion?.tipoAlimentacion || ""}
                      onValueChange={(value) => handleInputChange('alimentacion', 'tipoAlimentacion', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balanceada">Balanceada</SelectItem>
                        <SelectItem value="no-balanceada">No Balanceada</SelectItem>
                        <SelectItem value="vegetariana">Vegetariana</SelectItem>
                        <SelectItem value="vegana">Vegana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="frecuenciaAlimentacion">Frecuencia de Alimentación</Label>
                    <Select
                      id="frecuenciaAlimentacion"
                      value={formData.alimentacion?.frecuenciaAlimentacion || ""}
                      onValueChange={(value) => handleInputChange('alimentacion', 'frecuenciaAlimentacion', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3-veces-dia">3 veces al día</SelectItem>
                        <SelectItem value="2-veces-dia">2 veces al día</SelectItem>
                        <SelectItem value="1-vez-dia">1 vez al día</SelectItem>
                        <SelectItem value="mas-3-veces-dia">Más de 3 veces al día</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Actividad Física */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Actividad Física</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Realiza Actividad Física</Label>
                    <RadioGroup
                      defaultValue={formData.actividadFisica?.realizaActividadFisica ? "si" : "no"}
                      onValueChange={(value) => handleInputChange('actividadFisica', 'realizaActividadFisica', value === "si")}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="si" id="actividad-si" />
                        <Label htmlFor="actividad-si">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="actividad-no" />
                        <Label htmlFor="actividad-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {formData.actividadFisica?.realizaActividadFisica && (
                    <div>
                      <Label htmlFor="tipoActividadFisica">Tipo de Actividad Física</Label>
                      <Select
                        id="tipoActividadFisica"
                        value={formData.actividadFisica?.tipoActividadFisica || ""}
                        onValueChange={(value) => handleInputChange('actividadFisica', 'tipoActividadFisica', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cardio">Cardio</SelectItem>
                          <SelectItem value="pesas">Pesas</SelectItem>
                          <SelectItem value="yoga">Yoga</SelectItem>
                          <SelectItem value="pilates">Pilates</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              {/* Sueño */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Sueño</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="horasSueno">Horas de Sueño</Label>
                    <Select
                      id="horasSueno"
                      value={formData.sueno?.horasSueno || ""}
                      onValueChange={(value) => handleInputChange('sueno', 'horasSueno', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione horas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="menos-6">Menos de 6 horas</SelectItem>
                        <SelectItem value="6-8">6-8 horas</SelectItem>
                        <SelectItem value="mas-8">Más de 8 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Calidad de Sueño</Label>
                    <RadioGroup
                      defaultValue={formData.sueno?.calidadSueno || ""}
                      onValueChange={(value) => handleInputChange('sueno', 'calidadSueno', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="buena" id="sueno-buena" />
                        <Label htmlFor="sueno-buena">Buena</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mala" id="sueno-mala" />
                        <Label htmlFor="sueno-mala">Mala</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* Tabaquismo */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Tabaquismo</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tabaquismo</Label>
                    <RadioGroup
                      defaultValue={formData.tabaquismo?.tabaquismo ? "si" : "no"}
                      onValueChange={(value) => handleInputChange('tabaquismo', 'tabaquismo', value === "si")}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="si" id="tabaquismo-si" />
                        <Label htmlFor="tabaquismo-si">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="tabaquismo-no" />
                        <Label htmlFor="tabaquismo-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {formData.tabaquismo?.tabaquismo && (
                    <>
                      <div>
                        <Label htmlFor="cantidadCigarrillos">Cantidad de Cigarrillos al Día</Label>
                        <Select
                          id="cantidadCigarrillos"
                          value={formData.tabaquismo?.cantidadCigarrillos || ""}
                          onValueChange={(value) => handleInputChange('tabaquismo', 'cantidadCigarrillos', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione cantidad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="menos-5">Menos de 5</SelectItem>
                            <SelectItem value="5-10">5-10</SelectItem>
                            <SelectItem value="mas-10">Más de 10</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="tiempoFumando">Tiempo Fumando</Label>
                        <Select
                          id="tiempoFumando"
                          value={formData.tabaquismo?.tiempoFumando || ""}
                          onValueChange={(value) => handleInputChange('tabaquismo', 'tiempoFumando', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione tiempo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="menos-1-ano">Menos de 1 año</SelectItem>
                            <SelectItem value="1-5-anos">1-5 años</SelectItem>
                            <SelectItem value="mas-5-anos">Más de 5 años</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Alcoholismo */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Alcoholismo</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Alcoholismo</Label>
                    <RadioGroup
                      defaultValue={formData.alcoholismo?.alcoholismo ? "si" : "no"}
                      onValueChange={(value) => handleInputChange('alcoholismo', 'alcoholismo', value === "si")}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="si" id="alcoholismo-si" />
                        <Label htmlFor="alcoholismo-si">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="alcoholismo-no" />
                        <Label htmlFor="alcoholismo-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {formData.alcoholismo?.alcoholismo && (
                    <>
                      <div>
                        <Label htmlFor="frecuenciaAlcohol">Frecuencia de Consumo</Label>
                        <Select
                          id="frecuenciaAlcohol"
                          value={formData.alcoholismo?.frecuenciaAlcohol || ""}
                          onValueChange={(value) => handleInputChange('alcoholismo', 'frecuenciaAlcohol', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione frecuencia" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ocasional">Ocasional</SelectItem>
                            <SelectItem value="frecuente">Frecuente</SelectItem>
                            <SelectItem value="diario">Diario</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="tipoAlcohol">Tipo de Alcohol</Label>
                        <Select
                          id="tipoAlcohol"
                          value={formData.alcoholismo?.tipoAlcohol || ""}
                          onValueChange={(value) => handleInputChange('alcoholismo', 'tipoAlcohol', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cerveza">Cerveza</SelectItem>
                            <SelectItem value="vino">Vino</SelectItem>
                            <SelectItem value="licor">Licor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Toxicomanías */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Toxicomanías</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Toxicomanías</Label>
                    <RadioGroup
                      defaultValue={formData.toxicomanias?.toxicomanias ? "si" : "no"}
                      onValueChange={(value) => handleInputChange('toxicomanias', 'toxicomanias', value === "si")}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="si" id="toxicomanias-si" />
                        <Label htmlFor="toxicomanias-si">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="toxicomanias-no" />
                        <Label htmlFor="toxicomanias-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {formData.toxicomanias?.toxicomanias && (
                    <>
                      <div>
                        <Label htmlFor="tipoDroga">Tipo de Droga</Label>
                        <Select
                          id="tipoDroga"
                          value={formData.toxicomanias?.tipoDroga || ""}
                          onValueChange={(value) => handleInputChange('toxicomanias', 'tipoDroga', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="marihuana">Marihuana</SelectItem>
                            <SelectItem value="cocaina">Cocaína</SelectItem>
                            <SelectItem value="heroina">Heroína</SelectItem>
                            <SelectItem value="otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="frecuenciaDroga">Frecuencia de Consumo</Label>
                        <Select
                          id="frecuenciaDroga"
                          value={formData.toxicomanias?.frecuenciaDroga || ""}
                          onValueChange={(value) => handleInputChange('toxicomanias', 'frecuenciaDroga', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione frecuencia" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ocasional">Ocasional</SelectItem>
                            <SelectItem value="frecuente">Frecuente</SelectItem>
                            <SelectItem value="diario">Diario</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Higiene Personal - Nota: Intercambiando el orden de las secciones */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Higiene Personal</h4>
                <div className="grid gap-4">
                  {/* Cambio de ropa (Movido aquí desde abajo) */}
                  <div>
                    <Label>Cambio de Ropa</Label>
                    <Select
                      value={formData.higienePersonal?.cambioRopa || ""}
                      onValueChange={(value) => handleInputChange('higienePersonal', 'cambioRopa', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diario">Diario</SelectItem>
                        <SelectItem value="cada-tercer-dia">Cada tercer día</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="quincenal">Quincenal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Aseo de Manos (Movido aquí desde arriba) */}
                  <div>
                    <Label>Aseo de Manos</Label>
                    <Select
                      value={formData.higienePersonal?.aseoManos || ""}
                      onValueChange={(value) => handleInputChange('higienePersonal', 'aseoManos', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="antes-despues-comida">Antes y después de comer</SelectItem>
                        <SelectItem value="despues-sanitario">Después de ir al sanitario</SelectItem>
                        <SelectItem value="ocasional">Ocasional</SelectItem>
                        <SelectItem value="nunca">Nunca</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Baño</Label>
                    <Select
                      value={formData.higienePersonal?.banio || ""}
                      onValueChange={(value) => handleInputChange('higienePersonal', 'banio', value)}
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
                  <div>
                    <Label>Lavado de Dientes</Label>
                    <Select
                      value={formData.higienePersonal?.lavadoDientes || ""}
                      onValueChange={(value) => handleInputChange('higienePersonal', 'lavadoDientes', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="despues-cada-comida">Después de cada comida</SelectItem>
                        <SelectItem value="maniana-noche">Mañana y noche</SelectItem>
                        <SelectItem value="una-vez-dia">Una vez al día</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Vivienda */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Vivienda</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipoVivienda">Tipo de Vivienda</Label>
                    <Select
                      id="tipoVivienda"
                      value={formData.vivienda?.tipoVivienda || ""}
                      onValueChange={(value) => handleInputChange('vivienda', 'tipoVivienda', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casa">Casa</SelectItem>
                        <SelectItem value="apartamento">Apartamento</SelectItem>
                        <SelectItem value="cuarto">Cuarto</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Servicios Básicos</Label>
                    <div className="flex flex-col space-y-2">
                      <CustomCheckbox
                        id="aguaPotable"
                        checked={formData.vivienda?.serviciosBasicos?.aguaPotable || false}
                        onCheckedChange={(checked) => handleInputChange('vivienda', 'aguaPotable', checked)}
                      >
                        Agua Potable
                      </CustomCheckbox>
                      <CustomCheckbox
                        id="electricidad"
                        checked={formData.vivienda?.serviciosBasicos?.electricidad || false}
                        onCheckedChange={(checked) => handleInputChange('vivienda', 'electricidad', checked)}
                      >
                        Electricidad
                      </CustomCheckbox>
                      <CustomCheckbox
                        id="drenaje"
                        checked={formData.vivienda?.serviciosBasicos?.drenaje || false}
                        onCheckedChange={(checked) => handleInputChange('vivienda', 'drenaje', checked)}
                      >
                        Drenaje
                      </CustomCheckbox>
                    </div>
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
