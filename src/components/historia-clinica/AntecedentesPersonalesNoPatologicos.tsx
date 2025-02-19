
import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Eraser } from "lucide-react";
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
                    <Label>Servicios Disponibles</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {Object.entries(formData.serviciosDomiciliarios.servicios).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <CustomCheckbox 
                            id={key}
                            checked={value}
                            onCheckedChange={(checked) => 
                              handleInputChange('serviciosDomiciliarios', `servicios.${key}`, checked)
                            }
                          />
                          <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Condiciones de la Calle</Label>
                    <RadioGroup 
                      value={formData.serviciosDomiciliarios.condicionesCalle}
                      onValueChange={(value) => handleInputChange('serviciosDomiciliarios', 'condicionesCalle', value)}
                      className="flex gap-4 mt-2"
                    >
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
                    <RadioGroup 
                      value={formData.serviciosDomiciliarios.iluminacionCalle}
                      onValueChange={(value) => handleInputChange('serviciosDomiciliarios', 'iluminacionCalle', value)}
                      className="flex gap-4 mt-2"
                    >
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

              {/* Higiene de la Vivienda */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Higiene de la Vivienda</h4>
                <div className="grid gap-4">
                  <div>
                    <Label>Regularidad en el Aseo de la Vivienda</Label>
                    <Select 
                      value={formData.higieneVivienda.regularidadAseo}
                      onValueChange={(value) => handleInputChange('higieneVivienda', 'regularidadAseo', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diario">Diariamente</SelectItem>
                        <SelectItem value="semanal">Semanalmente</SelectItem>
                        <SelectItem value="quincenal">Quincenal</SelectItem>
                        <SelectItem value="esporadico">Esporádico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Cambio de Ropa de Cama</Label>
                    <Select
                      value={formData.higieneVivienda.cambioRopaCama}
                      onValueChange={(value) => handleInputChange('higieneVivienda', 'cambioRopaCama', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diario">Diario</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="quincenal">Quincenal</SelectItem>
                        <SelectItem value="mensual">Mensual</SelectItem>
                        <SelectItem value="irregular">No se cambia regularmente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Presencia de Hacinamiento</Label>
                    <div className="mt-2">
                      <CustomCheckbox
                        id="hacinamiento"
                        checked={formData.higieneVivienda.hacinamiento}
                        onCheckedChange={(checked) => 
                          handleInputChange('higieneVivienda', 'hacinamiento', checked)
                        }
                      />
                      <Label htmlFor="hacinamiento" className="ml-2">
                        Sí, duermen más de 3 personas en una habitación
                      </Label>
                    </div>
                  </div>

                  <div>
                    <Label>Presencia de Promiscuidad</Label>
                    <div className="mt-2">
                      <CustomCheckbox
                        id="promiscuidad"
                        checked={formData.higieneVivienda.promiscuidad}
                        onCheckedChange={(checked) => 
                          handleInputChange('higieneVivienda', 'promiscuidad', checked)
                        }
                      />
                      <Label htmlFor="promiscuidad" className="ml-2">
                        Varias personas de diferentes edades duermen en la misma habitación
                      </Label>
                    </div>
                  </div>

                  <div>
                    <Label>Presencia de Animales en Casa</Label>
                    <RadioGroup 
                      value={formData.higieneVivienda.animales}
                      onValueChange={(value) => handleInputChange('higieneVivienda', 'animales', value)}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dentro" id="dentro" />
                        <Label htmlFor="dentro">Sí, dentro de la casa</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="patio" id="patio" />
                        <Label htmlFor="patio">Sí, en el patio</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no-animales" />
                        <Label htmlFor="no-animales">No tienen mascotas</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>Manejo de Residuos</Label>
                    <RadioGroup 
                      value={formData.higieneVivienda.manejoResiduos}
                      onValueChange={(value) => handleInputChange('higieneVivienda', 'manejoResiduos', value)}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="recicla" id="recicla" />
                        <Label htmlFor="recicla">Separa y recicla la basura</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="diario" id="diario" />
                        <Label htmlFor="diario">Bota la basura diariamente</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="acumula" id="acumula" />
                        <Label htmlFor="acumula">Acumula basura dentro de la vivienda</Label>
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
                      value={formData.higienePersonal.frecuenciaBano}
                      onValueChange={(value) => handleInputChange('higienePersonal', 'frecuenciaBano', value)}
                    >
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
                    <div className="grid gap-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox
                          id="antes-comida"
                          checked={formData.higienePersonal.aseoManos.antesComida}
                          onCheckedChange={(checked) => 
                            handleInputChange('higienePersonal', 'aseoManos.antesComida', checked)
                          }
                        />
                        <Label htmlFor="antes-comida">Antes de cada comida</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox
                          id="despues-bano"
                          checked={formData.higienePersonal.aseoManos.despuesBano}
                          onCheckedChange={(checked) => 
                            handleInputChange('higienePersonal', 'aseoManos.despuesBano', checked)
                          }
                        />
                        <Label htmlFor="despues-bano">Después de ir al baño</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox
                          id="manipular-alimentos"
                          checked={formData.higienePersonal.aseoManos.manipularAlimentos}
                          onCheckedChange={(checked) => 
                            handleInputChange('higienePersonal', 'aseoManos.manipularAlimentos', checked)
                          }
                        />
                        <Label htmlFor="manipular-alimentos">Antes y después de manipular alimentos</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox
                          id="sin-habito"
                          checked={formData.higienePersonal.aseoManos.sinHabito}
                          onCheckedChange={(checked) => 
                            handleInputChange('higienePersonal', 'aseoManos.sinHabito', checked)
                          }
                        />
                        <Label htmlFor="sin-habito">No tiene hábito regular de lavado de manos</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Cambio de Ropa</Label>
                    <Select 
                      value={formData.higienePersonal.cambioRopa}
                      onValueChange={(value) => handleInputChange('higienePersonal', 'cambioRopa', value)}
                    >
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

              {/* Higiene Bucal */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Higiene Bucal</h4>
                <div className="grid gap-4">
                  <div>
                    <Label>Frecuencia de Cepillado Dental</Label>
                    <Select 
                      value={formData.higieneBucal.frecuenciaCepillado}
                      onValueChange={(value) => handleInputChange('higieneBucal', 'frecuenciaCepillado', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3-veces">3 veces al día</SelectItem>
                        <SelectItem value="2-veces">2 veces al día</SelectItem>
                        <SelectItem value="1-vez">1 vez al día</SelectItem>
                        <SelectItem value="menos">Menos de una vez al día</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Técnica de Cepillado Empleada</Label>
                    <Select 
                      value={formData.higieneBucal.tecnicaCepillado}
                      onValueChange={(value) => handleInputChange('higieneBucal', 'tecnicaCepillado', value)}
                    >
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

                  <div>
                    <Label>Uso de Auxiliares</Label>
                    <div className="grid gap-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox
                          id="hilo-dental"
                          checked={formData.higieneBucal.auxiliares.hiloDental}
                          onCheckedChange={(checked) => 
                            handleInputChange('higieneBucal', 'auxiliares.hiloDental', checked)
                          }
                        />
                        <Label htmlFor="hilo-dental">Hilo dental</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox
                          id="enjuague-bucal"
                          checked={formData.higieneBucal.auxiliares.enjuagueBucal}
                          onCheckedChange={(checked) => 
                            handleInputChange('higieneBucal', 'auxiliares.enjuagueBucal', checked)
                          }
                        />
                        <Label htmlFor="enjuague-bucal">Enjuague bucal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox
                          id="irrigador"
                          checked={formData.higieneBucal.auxiliares.irrigador}
                          onCheckedChange={(checked) => 
                            handleInputChange('higieneBucal', 'auxiliares.irrigador', checked)
                          }
                        />
                        <Label htmlFor="irrigador">Irrigador dental</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox
                          id="no-usa"
                          checked={formData.higieneBucal.auxiliares.noUsa}
                          onCheckedChange={(checked) => 
                            handleInputChange('higieneBucal', 'auxiliares.noUsa', checked)
                          }
                        />
                        <Label htmlFor="no-usa">No usa auxiliares</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Última Visita al Odontólogo</Label>
                    <Select 
                      value={formData.higieneBucal.ultimaVisita}
                      onValueChange={(value) => handleInputChange('higieneBucal', 'ultimaVisita', value)}
                    >
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

                  <div>
                    <Label>Problemas Bucales Presentes</Label>
                    <div className="grid gap-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox
                          id="sangrado-encias"
                          checked={formData.higieneBucal.problemas.sangradoEncias}
                          onCheckedChange={(checked) => 
                            handleInputChange('higieneBucal', 'problemas.sangradoEncias', checked)
                          }
                        />
                        <Label htmlFor="sangrado-encias">Encías que sangran al cepillarse</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox
                          id="caries"
                          checked={formData.higieneBucal.problemas.caries}
                          onCheckedChange={(checked) => 
                            handleInputChange('higieneBucal', 'problemas.caries', checked)
                          }
                        />
                        <Label htmlFor="caries">Dientes con agujeros o zonas oscuras</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox
                          id="mal-aliento"
                          checked={formData.higieneBucal.problemas.malAliento}
                          onCheckedChange={(checked) => 
                            handleInputChange('higieneBucal', 'problemas.malAliento', checked)
                          }
                        />
                        <Label htmlFor="mal-aliento">Mal aliento frecuente</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox
                          id="dolor"
                          checked={formData.higieneBucal.problemas.dolor}
                          onCheckedChange={(checked) => 
                            handleInputChange('higieneBucal', 'problemas.dolor', checked)
                          }
                        />
                        <Label htmlFor="dolor">Dolor en dientes o encías</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox
                          id="sin-problemas"
                          checked={formData.higieneBucal.problemas.sinProblemas}
                          onCheckedChange={(checked) => 
                            handleInputChange('higieneBucal', 'problemas.sinProblemas', checked)
                          }
                        />
                        <Label htmlFor="sin-problemas">No tengo problemas bucales</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alimentación */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4">Alimentación</h4>
                <div className="grid gap-4">
                  <div>
                    <Label>Tipo de Alimentos Consumidos Frecuentemente</Label>
                    <div className="grid gap-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox
                          id="frutas-verduras"
                          checked={formData.alimentacion.tiposAlimentos.frutasVerduras}
                          onCheckedChange={(checked) => 
                            handleInputChange('alimentacion', 'tiposAlimentos.frutasVerduras', checked)
                          }
                        />
                        <Label htmlFor="frutas-verduras">Frutas y verduras</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox
                          id="carnes-proteinas"
                          checked={formData.alimentacion.tiposAlimentos.carnesProteinas}
                          onCheckedChange={(checked) => 
                            handleInputChange('alimentacion', 'tiposAlimentos.carnesProteinas', checked)
                          }
                        />
                        <Label htmlFor="carnes-proteinas">Carnes y proteínas</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox
                          id="procesados-fritos"
                          checked={formData.alimentacion.tiposAlimentos.procesadosFritos}
                          onCheckedChange={(checked) => 
                            handleInputChange('alimentacion', 'tiposAlimentos.procesadosFritos', checked)
                          }
                        />
                        <Label htmlFor="procesados-fritos">Alimentos procesados y fritos</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomCheckbox
                          id="dulces-azucares"
                          checked={formData.alimentacion.tiposAlimentos.dulcesAzucares}
                          onCheckedChange={(checked) => 
                            handleInputChange('alimentacion', 'tiposAlimentos.dulcesAzucares', checked)
                          }
                        />
                        <Label htmlFor="dulces-azucares">Dulces y azúcares</Label>
                      </