
import React, { useState, useRef, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Eraser, Copy, CheckCircle, Sparkles, Clock } from "lucide-react";
import { TimePickerDentaxy } from '@/components/ui/TimePickerDentaxy';
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { AnimatedTextarea } from "@/components/ui/animated-textarea";
import { AppleTypewriter } from '@/components/ui/AppleTypewriter';

interface AntecedentesPersonalesNoPatologicosProps {
  formData: FormDataState;
  handleAntecedenteNoPatologicoChange: (field: string, value: any) => void;
  toggleService: (service: string) => void;
  onRedaccionGenerada?: (content: any) => void;
  onToggleViewMode?: () => void;
}

// Word button component for replacing checkboxes
const WordButton = ({
  label,
  isSelected,
  onClick
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return <button onClick={onClick} className={`px-3 py-1 text-xs font-medium rounded-full transition-all mb-1 mr-1 ${isSelected ? "bg-zinc-800 text-white shadow-sm" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
    {label}
  </button>;
};

const AntecedentesPersonalesNoPatologicos: React.FC<AntecedentesPersonalesNoPatologicosProps> = ({
  formData,
  handleAntecedenteNoPatologicoChange,
  toggleService,
  onRedaccionGenerada,
  onToggleViewMode
}) => {
  const [formDataLocal, setFormDataLocal] = useState(formData.antecedentesPersonalesNoPatologicos);

  // Sync with parent when formData changes
  useEffect(() => {
    setFormDataLocal(formData.antecedentesPersonalesNoPatologicos);
  }, [formData]);

  const generarRedaccionIA = () => {
    const servicios = generateServiciosDomiciliariosText();
    const vivienda = generateHigieneViviendaText();
    const higBucal = generateHigieneBucalText();
    const alimentacion = generateAlimentacionText();

    const formatTitle = (title: string) => `<span class="block text-xs font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mt-4 mb-1">${title}</span>`;

    let redaccionTexto = '';
    
    if (servicios) redaccionTexto += `\n${formatTitle("Servicios Domiciliarios")}\n${servicios}\n`;
    if (vivienda) redaccionTexto += `\n${formatTitle("Higiene de la Vivienda y Zoonosis")}\n${vivienda}\n`;
    if (higBucal) redaccionTexto += `\n${formatTitle("Higiene Bucal")}\n${higBucal}\n`;
    if (alimentacion) redaccionTexto += `\n${formatTitle("Alimentación")}\n${alimentacion}\n`;

    if (onRedaccionGenerada) {
      onRedaccionGenerada(redaccionTexto.trim());
    }
    if (onToggleViewMode) {
      onToggleViewMode();
    }
  };

  const generateServiciosDomiciliariosText = () => {
    const { servicios } = formDataLocal;
    if (servicios.includes('internet') || servicios.length >= 6) {
      return 'El paciente habita en una vivienda que cuenta con todos los servicios básicos y se reporta en buenas condiciones de higiene.';
    } else if (servicios.length > 0) {
      return 'El paciente habita en una vivienda con servicios básicos deficientes o limitados, lo que podría representar factores de riesgo ambientales.';
    }
    return '';
  };

  const generateHigieneViviendaText = () => {
    const { mascotas } = formDataLocal;
    if (mascotas === 'dentro' || mascotas === 'patio') {
      return 'Se reporta convivencia con animales o mascotas en el domicilio (zoonosis positiva).';
    } else if (mascotas === 'no') {
      return 'No se reporta convivencia con mascotas en el domicilio (zoonosis negativa).';
    }
    return '';
  };

  const generateHigieneBucalText = () => {
    const { frecuenciaCepillado, auxiliaresBucales } = formDataLocal;
    let auxText = '';
    
    if (auxiliaresBucales.includes('no auxiliares')) {
      auxText = 'sin uso de auxiliares bucales adicionales';
    } else if (auxiliaresBucales.length > 0) {
      auxText = 'utilizando como auxiliares: ' + auxiliaresBucales.join(' y ');
    }

    let text = '';
    if (frecuenciaCepillado) {
      text += `Refiere higiene bucal con frecuencia de cepillado ${frecuenciaCepillado}`;
      if (auxText) text += `, ${auxText}.`;
      else text += '.';
    } else if (auxText) {
      text += `Higiene bucal: ${auxText}.`;
    }
    return text;
  };

  const generateAlimentacionText = () => {
    const { alimentosConsumidos } = formDataLocal;
    if (alimentosConsumidos.includes('dulces y azúcares') || alimentosConsumidos.includes('alimentos procesados')) {
      return 'Paciente refiere una alimentación de tipo cariogénica, con alto consumo de carbohidratos, azúcares y alimentos procesados.';
    } else if (alimentosConsumidos.includes('frutas y verduras')) {
      return 'Paciente refiere una alimentación adecuada y balanceada (con consumo regular de proteínas, frutas, verduras y agua).';
    } else if (alimentosConsumidos.length > 0) {
      return 'Paciente refiere una alimentación deficiente o irregular.';
    }
    return '';
  };

  const handleFormChange = (field: string, value: any) => {
    // Local state update
    setFormDataLocal(prevData => ({
      ...prevData,
      [field]: value
    }));

    // Also update parent state
    handleAntecedenteNoPatologicoChange(field, value);
  };

  const handleWordButtonClick = (field: string, value: string) => {
    let newValues;

    // If this is "todos los servicios" in servicios field, handle specially
    if (field === 'servicios' && value === 'todos') {
      // Toggle all services
      if (formDataLocal.servicios.length === 6) {
        newValues = [];
      } else {
        newValues = ['agua', 'luz', 'drenaje', 'transporte', 'internet', 'gas'];
      }
      handleFormChange(field, newValues);
      return;
    }
    const currentValues = formDataLocal[field] as string[];

    // If this is a special case like 'no auxiliares' or 'no problemas'
    if (value === 'no auxiliares' || value === 'no problemas') {
      // If selecting an exclusive option, remove all other options
      if (currentValues.includes(value)) {
        newValues = [];
      } else {
        newValues = [value];
      }
    } else {
      // Remove exclusive options if selecting something else
      let filteredValues = currentValues.filter(v => v !== 'no auxiliares' && v !== 'no problemas');

      // Toggle the selected value
      if (filteredValues.includes(value)) {
        newValues = filteredValues.filter(v => v !== value);
      } else {
        newValues = [...filteredValues, value];
      }
    }
    handleFormChange(field, newValues);
  };

  const limpiarFormulario = () => {
    const emptyData = {
      tipoVivienda: "",
      materialVivienda: "",
      servicios: [],
      condicionCalle: "",
      iluminacionCalle: "",
      frecuenciaLimpieza: "",
      cambioRopaCama: "",
      hacinamiento: "",
      promiscuidad: "",
      mascotas: "",
      manejoResiduos: "",
      frecuenciaBano: "",
      lavadoManos: [],
      cambioRopa: "",
      frecuenciaCepillado: "",
      tecnicaCepillado: "",
      auxiliaresBucales: [],
      ultimaVisitaOdontologo: "",
      problemasBucales: [],
      alimentosConsumidos: [],
      frecuenciaFrutasVerduras: "",
      frecuenciaBebidasAzucaradas: "",
      frecuenciaComidaChatarra: "",
      consumoAgua: "",
      numeroComidas: "",
      horarioComidas: {
        desayuno: "",
        almuerzo: "",
        cena: ""
      },
      ayunoProlongado: ""
    };
    setFormDataLocal(emptyData);

    // Update all fields in parent state
    Object.entries(emptyData).forEach(([key, value]) => {
      handleAntecedenteNoPatologicoChange(key, value);
    });
  };

  return (
    <div className='bg-background dark:bg-background transition-colors duration-300' data-formulario-section="antecedentes-personales-no-patologicos">
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-900/30 p-5 rounded-xl border border-gray-100 dark:border-gray-700/50">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Servicios Domiciliarios</h4>


          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo de Vivienda</Label>
              <Select value={formDataLocal.tipoVivienda} onValueChange={value => handleFormChange('tipoVivienda', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urbana">Urbana</SelectItem>
                  <SelectItem value="rural">Rural</SelectItem>
                  <SelectItem value="semiurbana">Semiurbana</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Material Predominante de la Vivienda</Label>
              <Select value={formDataLocal.materialVivienda} onValueChange={value => handleFormChange('materialVivienda', value)}>
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
              <div className="flex flex-wrap mt-1">
                <WordButton label="Todos los servicios" isSelected={formDataLocal.servicios.length === 6} onClick={() => toggleService('todos')} />
                <WordButton label="Agua" isSelected={formDataLocal.servicios.includes('agua')} onClick={() => toggleService('agua')} />
                <WordButton label="Luz" isSelected={formDataLocal.servicios.includes('luz')} onClick={() => toggleService('luz')} />
                <WordButton label="Drenaje" isSelected={formDataLocal.servicios.includes('drenaje')} onClick={() => toggleService('drenaje')} />
                <WordButton label="Transporte" isSelected={formDataLocal.servicios.includes('transporte')} onClick={() => toggleService('transporte')} />
                <WordButton label="Internet" isSelected={formDataLocal.servicios.includes('internet')} onClick={() => toggleService('internet')} />
                <WordButton label="Gas" isSelected={formDataLocal.servicios.includes('gas')} onClick={() => toggleService('gas')} />
              </div>
            </div>
            <div>
              <Label>Condición de la Calle</Label>
              <Select value={formDataLocal.condicionCalle} onValueChange={value => handleFormChange('condicionCalle', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione condición" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pavimentada">Pavimentada</SelectItem>
                  <SelectItem value="terraceria">Terracería</SelectItem>
                  <SelectItem value="adoquinada">Adoquinada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Iluminación en la Vía Pública</Label>
              <Select value={formDataLocal.iluminacionCalle} onValueChange={value => handleFormChange('iluminacionCalle', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione iluminación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buena">Buena</SelectItem>
                  <SelectItem value="mala">Mala</SelectItem>
                  <SelectItem value="sin iluminación">Sin iluminación</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900/30 p-5 rounded-xl border border-gray-100 dark:border-gray-700/50">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Higiene de la Vivienda</h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Frecuencia de Limpieza del Hogar</Label>
              <Select value={formDataLocal.frecuenciaLimpieza} onValueChange={value => handleFormChange('frecuenciaLimpieza', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diaria">Diaria</SelectItem>
                  <SelectItem value="interdiaria">Interdiaria</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="quincenal">Quincenal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Frecuencia de Cambio de Ropa de Cama</Label>
              <Select value={formDataLocal.cambioRopaCama} onValueChange={value => handleFormChange('cambioRopaCama', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diario">Diario</SelectItem>
                  <SelectItem value="interdiario">Interdiario</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="quincenal">Quincenal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Hacinamiento en el Domicilio</Label>
              <Select value={formDataLocal.hacinamiento} onValueChange={value => handleFormChange('hacinamiento', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="si">Sí</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Promiscuidad en el Domicilio</Label>
              <Select value={formDataLocal.promiscuidad} onValueChange={value => handleFormChange('promiscuidad', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="si">Sí</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Presencia de Mascotas en el Domicilio</Label>
              <Select value={formDataLocal.mascotas} onValueChange={value => handleFormChange('mascotas', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dentro">Dentro de la casa</SelectItem>
                  <SelectItem value="patio">En el patio</SelectItem>
                  <SelectItem value="no">No hay mascotas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Manejo de Residuos</Label>
              <Select value={formDataLocal.manejoResiduos} onValueChange={value => handleFormChange('manejoResiduos', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recoleccion municipal">Recolección municipal</SelectItem>
                  <SelectItem value="quema">Quema</SelectItem>
                  <SelectItem value="entierro">Entierro</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900/30 p-5 rounded-xl border border-gray-100 dark:border-gray-700/50">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Higiene Personal</h4>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>Frecuencia de Baño</Label>
              <Select value={formDataLocal.frecuenciaBano} onValueChange={value => handleFormChange('frecuenciaBano', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diaria">Diaria</SelectItem>
                  <SelectItem value="interdiaria">Interdiaria</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Hábitos de Higiene de Manos</Label>
              <div className="flex flex-wrap mt-1">
                <WordButton label="Antes de cada comida" isSelected={formDataLocal.lavadoManos.includes('antes de cada comida')} onClick={() => handleWordButtonClick('lavadoManos', 'antes de cada comida')} />
                <WordButton label="Después de ir al baño" isSelected={formDataLocal.lavadoManos.includes('después de ir al baño')} onClick={() => handleWordButtonClick('lavadoManos', 'después de ir al baño')} />
                <WordButton label="Al manipular alimentos" isSelected={formDataLocal.lavadoManos.includes('al manipular alimentos')} onClick={() => handleWordButtonClick('lavadoManos', 'al manipular alimentos')} />
                <WordButton label="Sin hábito regular" isSelected={formDataLocal.lavadoManos.includes('sin hábito regular')} onClick={() => handleWordButtonClick('lavadoManos', 'sin hábito regular')} />
              </div>
            </div>
            <div>
              <Label>Frecuencia de Cambio de Ropa</Label>
              <Select value={formDataLocal.cambioRopa} onValueChange={value => handleFormChange('cambioRopa', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diaria">Diaria</SelectItem>
                  <SelectItem value="interdiaria">Interdiaria</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900/30 p-5 rounded-xl border border-gray-100 dark:border-gray-700/50">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Higiene Bucal</h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Frecuencia de Cepillado Dental</Label>
              <Select value={formDataLocal.frecuenciaCepillado} onValueChange={value => handleFormChange('frecuenciaCepillado', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="después de cada comida">Después de cada comida</SelectItem>
                  <SelectItem value="dos veces al día">Dos veces al día</SelectItem>
                  <SelectItem value="una vez al día">Una vez al día</SelectItem>
                  <SelectItem value="ocasional">Ocasional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Técnica de Cepillado Dental</Label>
              <Select value={formDataLocal.tecnicaCepillado} onValueChange={value => handleFormChange('tecnicaCepillado', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione técnica" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="horizontal">Horizontal</SelectItem>
                  <SelectItem value="vertical">Vertical</SelectItem>
                  <SelectItem value="circular">Circular</SelectItem>
                  <SelectItem value="bass">Bass</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Auxiliares de Higiene Bucal</Label>
              <div className="flex flex-wrap mt-1">
                <WordButton label="Hilo dental" isSelected={formDataLocal.auxiliaresBucales.includes('hilo dental')} onClick={() => handleWordButtonClick('auxiliaresBucales', 'hilo dental')} />
                <WordButton label="Enjuague bucal" isSelected={formDataLocal.auxiliaresBucales.includes('enjuague bucal')} onClick={() => handleWordButtonClick('auxiliaresBucales', 'enjuague bucal')} />
                <WordButton label="Irrigador dental" isSelected={formDataLocal.auxiliaresBucales.includes('irrigador dental')} onClick={() => handleWordButtonClick('auxiliaresBucales', 'irrigador dental')} />
                <WordButton label="No auxiliares" isSelected={formDataLocal.auxiliaresBucales.includes('no auxiliares')} onClick={() => handleWordButtonClick('auxiliaresBucales', 'no auxiliares')} />
              </div>
            </div>
            <div>
              <Label>Última Visita al Odontólogo</Label>
              <Select value={formDataLocal.ultimaVisitaOdontologo} onValueChange={value => handleFormChange('ultimaVisitaOdontologo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione tiempo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="menos de 6 meses">Menos de 6 meses</SelectItem>
                  <SelectItem value="entre 6 meses y 1 año">Entre 6 meses y 1 año</SelectItem>
                  <SelectItem value="más de 1 año">Más de 1 año</SelectItem>
                  <SelectItem value="nunca">Nunca</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Problemas Bucales Referidos</Label>
              <div className="flex flex-wrap mt-1">
                <WordButton label="Encías que sangran" isSelected={formDataLocal.problemasBucales.includes('encías que sangran')} onClick={() => handleWordButtonClick('problemasBucales', 'encías que sangran')} />
                <WordButton label="Dientes con cavidades" isSelected={formDataLocal.problemasBucales.includes('dientes con cavidades')} onClick={() => handleWordButtonClick('problemasBucales', 'dientes con cavidades')} />
                <WordButton label="Halitosis" isSelected={formDataLocal.problemasBucales.includes('halitosis')} onClick={() => handleWordButtonClick('problemasBucales', 'halitosis')} />
                <WordButton label="Dolor en dientes o encías" isSelected={formDataLocal.problemasBucales.includes('dolor en dientes o encías')} onClick={() => handleWordButtonClick('problemasBucales', 'dolor en dientes o encías')} />
                <WordButton label="Sin problemas bucales" isSelected={formDataLocal.problemasBucales.includes('sin problemas bucales')} onClick={() => handleWordButtonClick('problemasBucales', 'sin problemas bucales')} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900/30 p-5 rounded-xl border border-gray-100 dark:border-gray-700/50">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Alimentación</h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Alimentos Consumidos Frecuentemente</Label>
              <div className="flex flex-wrap mt-1">
                <WordButton label="Frutas y verduras" isSelected={formDataLocal.alimentosConsumidos.includes('frutas y verduras')} onClick={() => handleWordButtonClick('alimentosConsumidos', 'frutas y verduras')} />
                <WordButton label="Carnes y proteínas" isSelected={formDataLocal.alimentosConsumidos.includes('carnes y proteínas')} onClick={() => handleWordButtonClick('alimentosConsumidos', 'carnes y proteínas')} />
                <WordButton label="Alimentos procesados" isSelected={formDataLocal.alimentosConsumidos.includes('alimentos procesados')} onClick={() => handleWordButtonClick('alimentosConsumidos', 'alimentos procesados')} />
                <WordButton label="Dulces y azúcares" isSelected={formDataLocal.alimentosConsumidos.includes('dulces y azúcares')} onClick={() => handleWordButtonClick('alimentosConsumidos', 'dulces y azúcares')} />
              </div>
            </div>
            <div>
              <Label>Frecuencia de Consumo de Frutas y Verduras</Label>
              <Select value={formDataLocal.frecuenciaFrutasVerduras} onValueChange={value => handleFormChange('frecuenciaFrutasVerduras', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diaria">Diaria</SelectItem>
                  <SelectItem value="3-5 veces por semana">3-5 veces por semana</SelectItem>
                  <SelectItem value="1-2 veces por semana">1-2 veces por semana</SelectItem>
                  <SelectItem value="rara vez">Rara vez</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Frecuencia de Bebidas Azucaradas</Label>
              <Select value={formDataLocal.frecuenciaBebidasAzucaradas} onValueChange={value => handleFormChange('frecuenciaBebidasAzucaradas', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diaria">Diaria</SelectItem>
                  <SelectItem value="3-5 veces por semana">3-5 veces por semana</SelectItem>
                  <SelectItem value="1-2 veces por semana">1-2 veces por semana</SelectItem>
                  <SelectItem value="rara vez">Rara vez</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Frecuencia de Comida Chatarra</Label>
              <Select value={formDataLocal.frecuenciaComidaChatarra} onValueChange={value => handleFormChange('frecuenciaComidaChatarra', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diaria">Diaria</SelectItem>
                  <SelectItem value="3-5 veces por semana">3-5 veces por semana</SelectItem>
                  <SelectItem value="1-2 veces por semana">1-2 veces por semana</SelectItem>
                  <SelectItem value="rara vez">Rara vez</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Consumo de Agua Diario (Litros)</Label>
              <Select value={formDataLocal.consumoAgua} onValueChange={value => handleFormChange('consumoAgua', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione cantidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="menos de 1 litro">Menos de 1 litro</SelectItem>
                  <SelectItem value="1-2 litros">1-2 litros</SelectItem>
                  <SelectItem value="más de 2 litros">Más de 2 litros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Número de Comidas al Día</Label>
              <Select value={formDataLocal.numeroComidas} onValueChange={value => handleFormChange('numeroComidas', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione número" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-2">1-2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4-5">4-5</SelectItem>
                  <SelectItem value="más de 5">Más de 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-gray-400" />
                Horario de Almuerzo
              </Label>
              <TimePickerDentaxy
                value={formDataLocal.horarioComidas.desayuno}
                onChange={(val) => handleFormChange('horarioComidas', { ...formDataLocal.horarioComidas, desayuno: val })}
              />
            </div>
            <div>
              <Label className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-gray-400" />
                Horario de Comida
              </Label>
              <TimePickerDentaxy
                value={formDataLocal.horarioComidas.almuerzo}
                onChange={(val) => handleFormChange('horarioComidas', { ...formDataLocal.horarioComidas, almuerzo: val })}
              />
            </div>
            <div>
              <Label className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-gray-400" />
                Horario de Cena
              </Label>
              <TimePickerDentaxy
                value={formDataLocal.horarioComidas.cena}
                onChange={(val) => handleFormChange('horarioComidas', { ...formDataLocal.horarioComidas, cena: val })}
              />
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="flex justify-end items-center gap-3 pt-6 mt-6 border-t border-gray-100 dark:border-gray-700/50">
          {onToggleViewMode && (
            <Button
              variant="outline"
              onClick={generarRedaccionIA}
              className="hidden data-trigger-generation text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Ver Redacción IA
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={limpiarFormulario}
            className="text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
          >
            <Eraser className="w-3 h-3 mr-2" />
            Reiniciar Sección
          </Button>
        </div>
      </div>

    </div>
  );
};

export default AntecedentesPersonalesNoPatologicos;
