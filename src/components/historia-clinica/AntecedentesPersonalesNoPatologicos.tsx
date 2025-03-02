<lov-code>
import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Eraser, Copy, CheckCircle } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';

interface AntecedentesPersonalesNoPatologicosProps {
  formData: FormDataState;
  handleAntecedenteChange: (field: string, value: any) => void;
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
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 text-xs rounded-md transition-colors mb-1 mr-1 ${
        isSelected 
          ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200" 
          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      {label}
    </button>
  );
};

const AntecedentesPersonalesNoPatologicos: React.FC<AntecedentesPersonalesNoPatologicosProps> = ({ 
  formData, 
  handleAntecedenteChange 
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [redacciones, setRedacciones] = useState({
    serviciosDomiciliarios: "",
    higieneVivienda: "",
    higienePersonal: "",
    higieneBucal: "",
    alimentacion: ""
  });
  const [copied, setCopied] = useState<Record<string, boolean>>({});
  const formRef = useRef<HTMLDivElement>(null);
  const redaccionesRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [formDataLocal, setFormDataLocal] = useState({
    tipoVivienda: "",
    materialVivienda: "",
    servicios: [] as string[],
    condicionCalle: "",
    iluminacionCalle: "",
    frecuenciaLimpieza: "",
    cambioRopaCama: "",
    hacinamiento: "",
    promiscuidad: "",
    mascotas: "",
    manejoResiduos: "",
    frecuenciaBano: "",
    lavadoManos: [] as string[],
    cambioRopa: "",
    frecuenciaCepillado: "",
    tecnicaCepillado: "",
    auxiliaresBucales: [] as string[],
    ultimaVisitaOdontologo: "",
    problemasBucales: [] as string[],
    alimentosConsumidos: [] as string[],
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
  });

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

  const generarRedaccionIA = () => {
    // Implementar la lógica para generar la redacción con IA
    console.log("Generar redacción con IA");
  };

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
  };

  const handleCopy = (section: string) => {
    navigator.clipboard.writeText(redacciones[section]);
    setCopied((prev) => ({ ...prev, [section]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [section]: false })), 2000);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormDataLocal((prevData) => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleWordButtonClick = (field: string, value: string) => {
    setFormDataLocal((prevData) => {
      const currentValues = prevData[field] as string[];
      
      // If this is a special case like 'no auxiliares' or 'no problemas'
      if (value === 'no auxiliares' || value === 'no problemas' || value === 'todos') {
        if (field === 'servicios' && value === 'todos') {
          return {
            ...prevData,
            [field]: ['agua', 'luz', 'drenaje', 'transporte', 'internet', 'gas']
          };
        }
        
        // If selecting an exclusive option, remove all other options
        return {
          ...prevData,
          [field]: currentValues.includes(value) ? [] : [value]
        };
      }
      
      // Remove exclusive options if selecting something else
      let newValues = currentValues.filter(v => 
        v !== 'no auxiliares' && v !== 'no problemas'
      );
      
      // Toggle the selected value
      if (newValues.includes(value)) {
        newValues = newValues.filter(v => v !== value);
      } else {
        newValues = [...newValues, value];
      }
      
      return {
        ...prevData,
        [field]: newValues
      };
    });
  };

  const limpiarFormulario = () => {
    setFormDataLocal({
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
    });
    setShowForm(true);
    setRedacciones({
      serviciosDomiciliarios: "",
      higieneVivienda: "",
      higienePersonal: "",
      higieneBucal: "",
      alimentacion: ""
    });
    setProgress(0);
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

        <div ref={redaccionesRef} className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">III.</span> ANTECEDENTES PERSONALES NO PATOLÓGICOS
          </h2>
        </div>

        {!isMinimized && (
          <div className="p-6" ref={formRef}>
            {showForm ? (
              <div className="space-y-6">
                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2">Servicios Domiciliarios</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tipo de Vivienda</Label>
                      <Select onValueChange={(value) => handleFormChange('tipoVivienda', value)}>
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
                      <Select onValueChange={(value) => handleFormChange('materialVivienda', value)}>
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
                        <WordButton 
                          label="Todos los servicios" 
                          isSelected={formDataLocal.servicios.length === 6} 
                          onClick={() => handleWordButtonClick('servicios', 'todos')} 
                        />
                        <WordButton 
                          label="Agua" 
                          isSelected={formDataLocal.servicios.includes('agua')} 
                          onClick={() => handleWordButtonClick('servicios', 'agua')} 
                        />
                        <WordButton 
                          label="Luz" 
                          isSelected={formDataLocal.servicios.includes('luz')} 
                          onClick={() => handleWordButtonClick('servicios', 'luz')} 
                        />
                        <WordButton 
                          label="Drenaje" 
                          isSelected={formDataLocal.servicios.includes('drenaje')} 
                          onClick={() => handleWordButtonClick('servicios', 'drenaje')} 
                        />
                        <WordButton 
                          label="Transporte" 
                          isSelected={formDataLocal.servicios.includes('transporte')} 
                          onClick={() => handleWordButtonClick('servicios', 'transporte')} 
                        />
                        <WordButton 
                          label="Internet" 
                          isSelected={formDataLocal.servicios.includes('internet')} 
                          onClick={() => handleWordButtonClick('servicios', 'internet')} 
                        />
                        <WordButton 
                          label="Gas" 
                          isSelected={formDataLocal.servicios.includes('gas')} 
                          onClick={() => handleWordButtonClick('servicios', 'gas')} 
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Condiciones de la Calle</Label>
                      <Select onValueChange={(value) => handleFormChange('condicionCalle', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione condición" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pavimentada">Pavimentada</SelectItem>
                          <SelectItem value="sin pavimentar">Sin pavimentar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Iluminación en la Calle</Label>
                      <Select onValueChange={(value) => handleFormChange('iluminacionCalle', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione iluminación" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bien iluminada">Bien iluminada</SelectItem>
                          <SelectItem value="poca iluminacion">Poca iluminación</SelectItem>
                          <SelectItem value="sin iluminacion">Sin iluminación</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2">Higiene de la Vivienda</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Regularidad en el Aseo de la Vivienda</Label>
                      <Select onValueChange={(value) => handleFormChange('frecuenciaLimpieza', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diaria">Diariamente</SelectItem>
                          <SelectItem value="semanal">Semanalmente</SelectItem>
                          <SelectItem value="quincenal">Quincenal</SelectItem>
                          <SelectItem value="esporadica">Esporádico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Cambio de Ropa de Cama</Label>
                      <Select onValueChange={(value) => handleFormChange('cambioRopaCama', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diaria">Diario</SelectItem>
                          <SelectItem value="semanal">Semanal</SelectItem>
                          <SelectItem value="quincenal">Quincenal</SelectItem>
                          <SelectItem value="mensual">Mensual</SelectItem>
                          <SelectItem value="de manera no regular">No se cambia regularmente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mt-1">
                      <Label>Presencia de Hacinamiento</Label>
                      <Select onValueChange={(value) => handleFormChange('hacinamiento', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione opción" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="si">Sí, duermen más de tres personas en una habitación</SelectItem>
                          <SelectItem value="no">No hay hacinamiento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mt-1">
                      <Label>Presencia de Promiscuidad</Label>
                      <Select onValueChange={(value) => handleFormChange('promiscuidad', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione opción" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="si">Sí</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mt-1">
                      <Label>Presencia de Animales en Casa</Label>
                      <Select onValueChange={(value) => handleFormChange('mascotas', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione opción" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dentro">Sí, dentro de la casa</SelectItem>
                          <SelectItem value="patio">Sí, en el patio</SelectItem>
                          <SelectItem value="no">No tienen mascotas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mt-1">
                      <Label>Manejo de Residuos</Label>
                      <Select onValueChange={(value) => handleFormChange('manejoResiduos', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione opción" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recicla">Separa y recicla la basura</SelectItem>
                          <SelectItem value="diaria">Bota la basura diariamente</SelectItem>
                          <SelectItem value="acumula">Acumula basura dentro de la vivienda</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2">Higiene Personal</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Frecuencia de Baño</Label>
                      <Select onValueChange={(value) => handleFormChange('frecuenciaBano', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diario">Diario</SelectItem>
                          <SelectItem value="cada dos dias">Cada dos días</SelectItem>
                          <SelectItem value="cada tercer día">Cada tres días</SelectItem>
                          <SelectItem value="esporadicamente">Esporádico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Aseo de Manos</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton 
                          label="Antes de cada comida" 
                          isSelected={formDataLocal.lavadoManos.includes('antes de cada comida')} 
                          onClick={() => handleWordButtonClick('lavadoManos', 'antes de cada comida')} 
                        />
                        <WordButton 
                          label="Después de ir al baño" 
                          isSelected={formDataLocal.lavadoManos.includes('despues de ir al baño')} 
                          onClick={() => handleWordButtonClick('lavadoManos', 'despues de ir al baño')} 
                        />
                        <WordButton 
                          label="Al manipular alimentos" 
                          isSelected={formDataLocal.lavadoManos.includes('antes y despues de cada comida')} 
                          onClick={() => handleWordButtonClick('lavadoManos', 'antes y despues de cada comida')} 
                        />
                        <WordButton 
                          label="Sin hábito regular" 
                          isSelected={formDataLocal.lavadoManos.includes('de manera no regular')} 
                          onClick={() => handleWordButtonClick('lavadoManos', 'de manera no regular')} 
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Cambio de Ropa</Label>
                      <Select onValueChange={(value) => handleFormChange('cambioRopa', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diario">Diario</SelectItem>
                          <SelectItem value="cada dos días">Cada dos días</SelectItem>
                          <SelectItem value="cada tres días">Cada tres días</SelectItem>
                          <SelectItem value="esporádicamente">Esporádico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2">Higiene Bucal</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Frecuencia de Cepillado Dental</Label>
                      <Select onValueChange={(value) => handleFormChange('frecuenciaCepillado', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tres veces al día">Tres veces al día</SelectItem>
                          <SelectItem value="dos veces al día">Dos veces al día</SelectItem>
                          <SelectItem value="una vez al día">Una vez al día</SelectItem>
                          <SelectItem value="menos de una vez al día">Menos de una vez al día</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Técnica de Cepillado Empleada</Label>
                      <Select onValueChange={(value) => handleFormChange('tecnicaCepillado', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione técnica" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="circular">Circular</SelectItem>
                          <SelectItem value="horizontal">Horizontal</SelectItem>
                          <SelectItem value="vertical">Vertical</SelectItem>
                          <SelectItem value="barrido">De barrido</SelectItem>
                          <SelectItem value="que refiere no saber como la realiza">No sabe cómo se cepilla</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mt-1">
                      <Label>Uso de Auxiliares</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton 
                          label="Hilo Dental" 
                          isSelected={formDataLocal.auxiliaresBucales.includes('hilo dental')} 
                          onClick={() => handleWordButtonClick('auxiliaresBucales', 'hilo dental')} 
                        />
                        <WordButton 
                          label="Enjuague Bucal" 
                          isSelected={formDataLocal.auxiliaresBucales.includes('enjuague bucal')} 
                          onClick={() => handleWordButtonClick('auxiliaresBucales', 'enjuague bucal')} 
                        />
                        <WordButton 
                          label="Irrigador Dental" 
                          isSelected={formDataLocal.auxiliaresBucales.includes('irrigador dental')} 
                          onClick={() => handleWordButtonClick('auxiliaresBucales', 'irrigador dental')} 
                        />
                        <WordButton 
                          label="No usa auxiliares" 
                          isSelected={formDataLocal.auxiliaresBucales.includes('no auxiliares')} 
                          onClick={() => handleWordButtonClick('auxiliaresBucales', 'no auxiliares')} 
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Última Visita al Odontólogo</Label>
                      <Select onValueChange={(value) => handleFormChange('ultimaVisitaOdontologo', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione tiempo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="menos-seis-meses">Menos de seis meses</SelectItem>
                          <SelectItem value="un-ano">Un año</SelectItem>
                          <SelectItem value="mas-dos-anos">Más de dos años</SelectItem>
                          <SelectItem value="nunca">Nunca ha visitado al odontólogo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mt-1">
                      <Label>Problemas Bucales Presentes</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton 
                          label="Encías que sangran" 
                          isSelected={formDataLocal.problemasBucales.includes('encías que sangran')} 
                          onClick={() => handleWordButtonClick('problemasBucales', 'encías que sangran')} 
                        />
                        <WordButton 
                          label="Dientes con agujeros" 
                          isSelected={formDataLocal.problemasBucales.includes('dientes con agujeros')} 
                          onClick={() => handleWordButtonClick('problemasBucales', 'dientes con agujeros')} 
                        />
                        <WordButton 
                          label="Mal aliento" 
                          isSelected={formDataLocal.problemasBucales.includes('mal aliento frecuente')} 
                          onClick={() => handleWordButtonClick('problemasBucales', 'mal aliento frecuente')} 
                        />
                        <WordButton 
                          label="Dolor en dientes o encías" 
                          isSelected={formDataLocal.problemasBucales.includes('dolor en dientes o encías')} 
                          onClick={() => handleWordButtonClick('problemasBucales', 'dolor en dientes o encías')} 
                        />
                        <WordButton 
                          label="Sin problemas" 
                          isSelected={formDataLocal.problemasBucales.includes('no problemas')} 
                          onClick={() => handleWordButtonClick('problemasBucales', 'no problemas')} 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2">Alimentación</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tipo de Alimentos Consumidos Frecuentemente</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton 
                          label="Frutas y verduras" 
                          isSelected={formDataLocal.alimentosConsumidos.includes('frutas y verduras')} 
                          onClick={() => handleWordButtonClick('alimentosConsumidos', 'frutas y verduras')} 
                        />
                        <WordButton 
                          label="Carnes y proteínas" 
                          isSelected={formDataLocal.alimentosConsumidos.includes('carnes y proteínas')} 
                          onClick={() => handleWordButtonClick('alimentosConsumidos', 'carnes y proteínas')} 
                        />
                        <WordButton 
                          label="Alimentos procesados" 
                          isSelected={formDataLocal.alimentosConsumidos.includes('alimentos procesados y fritos')} 
                          onClick={() => handleWordButtonClick('alimentosConsumidos', 'alimentos procesados y fritos')} 
                        />
                        <WordButton 
                          label="Dulces y azúcares" 
                          isSelected={formDataLocal.alimentosConsumidos.includes('dulces y azúcares')} 
                          onClick={() => handleWordButtonClick('alimentosConsumidos', 'dulces y azúcares')} 
                        />
                        <WordButton 
                          label="Lácteos" 
                          isSelected={formDataLocal.alimentosConsumidos.includes('lácteos')} 
                          onClick={() => handleWordButtonClick('alimentosConsumidos', 'lácteos')} 
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Frecuencia de Consumo de Frutas y Verduras</Label>
                      <Select onValueChange={(value) => handleFormChange('frecuenciaFrutasVerduras', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diario">Diario</SelectItem>
                          <SelectItem value="tres-cuatro-veces-semana">Tres o cuatro veces por semana</SelectItem>
                          <SelectItem value="ocasionalmente">Ocasionalmente</SelectItem>
                          <SelectItem value="no-consume">No las consume</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Frecuencia de Consumo de Bebidas Azucaradas</Label>
                      <Select onValueChange={(value) => handleFormChange('frecuenciaBebidasAzucaradas', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diario">Diario</SelectItem>
                          <SelectItem value="tres-cuatro-veces-semana">Tres o cuatro veces por semana</SelectItem>
                          <SelectItem value="ocasionalmente">Ocasionalmente</SelectItem>
                          <SelectItem value="no-consume">No las consume</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Frecuencia de Consumo de Comida Chatarra</Label>
                      <Select onValueChange={(value) => handleFormChange('frecuenciaComidaChatarra', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diario">Diario</SelectItem>
                          <SelectItem value="tres-cuatro-veces-semana">Tres o cuatro veces por semana</SelectItem>
                          <SelectItem value="ocasionalmente">Ocasionalmente</SelectItem>
                          <SelectItem value="no-consume">No las consume</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Consumo de Agua al Día</Label>
                      <Select onValueChange={(value) => handleFormChange('consumoAgua', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione cantidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="menos-un-litro">Menos de un litro</SelectItem>
                          <SelectItem value="uno-dos-litros">Entre uno y dos litros</SelectItem>
                          <SelectItem value="mas-dos-litros">Más de dos litros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Número de Comidas al Día</Label>
                      <Select onValueChange={(value) => handleFormChange('numeroComidas', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione número" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="una">Una</SelectItem>
                          <SelectItem value="dos">Dos</SelectItem>
                          <SelectItem value="tres">Tres</SelectItem>
                          <SelectItem value="mas-tres">Más de tres</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Horario de Comidas</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div>
                          <Label>Desayuno</Label>
                          <Select onValueChange={(value) => handleFormChange('horarioComidas.desayuno', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione horario" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="antes-ocho">Antes de las 8:00 AM</SelectItem>
                              <SelectItem value="ocho-diez">Entre 8:00 AM y 10:00 AM</SelectItem>
                              <SelectItem value="despues-diez">Después de las 10:00 AM</SelectItem>
                              <SelectItem value="no-desayuna">No desayuna</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Almuerzo</Label>
                          <Select onValueChange={(value) => handleFormChange('horarioComidas.almuerzo', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione horario" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="antes-una">Antes de la 1:00 PM</SelectItem>
                              <SelectItem value="una-tres">Entre 1:00 PM y 3:00 PM</SelectItem>
                              <SelectItem value="despues-tres">Después de las 3:00 PM</SelectItem>
                              <SelectItem value="no-almuerza">No almuerza</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Cena</Label>
                          <Select onValueChange={(value) => handleFormChange('horarioComidas.cena', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione horario" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="antes-ocho">Antes de las 8:00 PM</SelectItem>
                              <SelectItem value="ocho-diez">Entre 8:00 PM y 10:00 PM</SelectItem>
                              <SelectItem value="despues-diez">Después de las 10:00 PM</SelectItem>
                              <SelectItem value
