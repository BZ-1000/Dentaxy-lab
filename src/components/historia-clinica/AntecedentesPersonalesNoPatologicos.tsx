import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Eraser, Copy, CheckCircle } from "lucide-react";

interface FormData {
  tipoVivienda: string;
  materialVivienda: string;
  servicios: string[];
  condicionCalle: string;
  iluminacionCalle: string;
  frecuenciaLimpieza: string;
  cambioRopaCama: string;
  hacinamiento: string;
  promiscuidad: string;
  mascotas: string;
  manejoResiduos: string;
  frecuenciaBano: string;
  lavadoManos: string[];
  cambioRopa: string;
  frecuenciaCepillado: string;
  tecnicaCepillado: string;
  auxiliaresBucales: string[];
  ultimaVisitaOdontologo: string;
  problemasBucales: string[];
  alimentosConsumidos: string[];
  frecuenciaFrutasVerduras: string;
  frecuenciaBebidasAzucaradas: string;
  frecuenciaComidaChatarra: string;
  consumoAgua: string;
  numeroComidas: string;
  horarioComidas: {
    desayuno: string;
    almuerzo: string;
    cena: string;
  };
  ayunoProlongado: string;
}

const AntecedentesPersonalesNoPatologicos = () => {
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
  const [formData, setFormData] = useState<FormData>({
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
    const redaccionesGeneradas = {
      serviciosDomiciliarios: `El paciente reside en una vivienda de tipo ${formData.tipoVivienda} con estructura predominante de ${formData.materialVivienda}. Cuenta con servicios básicos de ${formData.servicios.length === 6 ? "todos los servicios" : formData.servicios.join(", ")}, lo que facilita su calidad de vida. La calle donde habita se encuentra ${formData.condicionCalle} y se presenta ${formData.iluminacionCalle}, lo que puede afectar su seguridad y movilidad.\n`,
      higieneVivienda: `La vivienda del paciente se mantiene con una rutina de limpieza ${formData.frecuenciaLimpieza}, lo que influye en su bienestar general. El cambio de ropa de cama se realiza ${formData.cambioRopaCama}. Se observa que la vivienda ${formData.hacinamiento === "no" ? "no presenta" : "presenta"} condiciones de hacinamiento. Además, se identifica que ${formData.promiscuidad === "no" ? "no" : "sí"} existe promiscuidad. El paciente ${formData.mascotas === "no" ? "no tiene" : "tiene"} mascotas. En cuanto a la recolección de basura, ${formData.manejoResiduos === "diaria" ? "la basura se desecha diariamente" : "se acumulan residuos dentro del hogar"}, lo que puede influir en la higiene del entorno.\n`,
      higienePersonal: `El paciente reporta una frecuencia de baño ${formData.frecuenciaBano}, lo que influye en su higiene y confort personal. Respecto al lavado de manos, lo realiza ${formData.lavadoManos.join(" y ")}. En cuanto al cambio de ropa, se registra una frecuencia ${formData.cambioRopa}.\n`,
      higieneBucal: `El paciente se cepilla los dientes ${formData.frecuenciaCepillado} veces al día y utiliza una técnica de cepillado ${formData.tecnicaCepillado}. Se observa que ${formData.auxiliaresBucales.length > 0 ? "utiliza" : "no utiliza"} auxiliares de higiene bucal, como ${formData.auxiliaresBucales.join(" y ")}. En relación con la atención odontológica, su última consulta fue hace ${formData.ultimaVisitaOdontologo}. El paciente reporta la presencia de ${formData.problemasBucales.join(" y ")}, lo que podría indicar la necesidad de una revisión odontológica.\n`,
      alimentacion: `El paciente consume frecuentemente ${formData.alimentosConsumidos.join(" , ")}. Su alimentación incluye frutas y verduras con una frecuencia ${formData.frecuenciaFrutasVerduras}, mientras que las bebidas azucaradas son consumidas ${formData.frecuenciaBebidasAzucaradas}. También reporta que come comida chatarra ${formData.frecuenciaComidaChatarra}. Su consumo de agua al día es de ${formData.consumoAgua}. El paciente realiza ${formData.numeroComidas} comidas al día y mantiene un horario de alimentación ${formData.horarioComidas}. Además, menciona que ${formData.ayunoProlongado === "no" ? "no realiza" : "realiza"} ayunos prolongados.\n`
    };

    setRedacciones(redaccionesGeneradas);
    setShowForm(false);

    // Simulate typing effect
    // Auto-scroll to the top of the section
    redaccionesRef.current.scrollIntoView({ behavior: 'auto' });

    Object.keys(redaccionesGeneradas).forEach((key) => {
      const text = redaccionesGeneradas[key];
      let index = 0;
      const intervalId = setInterval(() => {
        if (index <= text.length) {
          setRedacciones((prev) => ({
            ...prev,
            [key]: text.slice(0, index)
          }));
          setProgress((index / text.length) * 100);
          index++;
        } else {
          clearInterval(intervalId);
        }
      }, 0.5); // Reduced interval for faster scroll
    });
  };

  const handleCopy = (section) => {
    navigator.clipboard.writeText(redacciones[section]);
    setCopied((prev) => ({ ...prev, [section]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [section]: false })), 2000);
  };

  const handleFormChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field].includes(value)
        ? prevData[field].filter((item) => item !== value)
        : [...prevData[field], value]
    }));
  };

  const handleSelectAllServices = (isChecked) => {
    if (isChecked) {
      setFormData((prevData) => ({
        ...prevData,
        servicios: ["agua", "luz", "drenaje", "transporte", "internet", "gas"]
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        servicios: []
      }));
    }
  };

  const handleLavadoManosChange = (value) => {
    setFormData((prevData) => {
      const newLavadoManos = prevData.lavadoManos.includes(value)
        ? prevData.lavadoManos.filter((item) => item !== value)
        : [...prevData.lavadoManos, value];

      // Remove "no auxiliares" if any other option is selected
      if (value !== "no auxiliares" && newLavadoManos.includes("no auxiliares")) {
        newLavadoManos.splice(newLavadoManos.indexOf("no auxiliares"), 1);
      }

      return {
        ...prevData,
        lavadoManos: newLavadoManos
      };
    });
  };

  // Ajustar automáticamente el tamaño de los textarea
  const adjustTextareaHeight = (e) => {
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
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

        {/* Barra de progreso */}
        <div className="h-2 bg-gray-200 rounded-full mt-2 mb-4">
          <div 
            className="h-full bg-blue-500 rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </div>

        {!isMinimized && (
          <div className="p-6" ref={formRef}>
            {showForm ? (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
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
                      <div className="grid grid-cols-2 gap-1 mt-1">
                        <div className="flex items-center space-x-1">
                          <CustomCheckbox id="todos" onChange={(e) => handleSelectAllServices(e.target.checked)} />
                          <Label htmlFor="todos">Todos los servicios</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CustomCheckbox id="agua" onChange={(e) => handleCheckboxChange('servicios', 'agua')} />
                          <Label htmlFor="agua">Agua</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CustomCheckbox id="luz" onChange={(e) => handleCheckboxChange('servicios', 'luz')} />
                          <Label htmlFor="luz">Luz</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CustomCheckbox id="drenaje" onChange={(e) => handleCheckboxChange('servicios', 'drenaje')} />
                          <Label htmlFor="drenaje">Drenaje</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CustomCheckbox id="transporte" onChange={(e) => handleCheckboxChange('servicios', 'transporte')} />
                          <Label htmlFor="transporte">Transporte</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CustomCheckbox id="internet" onChange={(e) => handleCheckboxChange('servicios', 'internet')} />
                          <Label htmlFor="internet">Internet</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CustomCheckbox id="gas" onChange={(e) => handleCheckboxChange('servicios', 'gas')} />
                          <Label htmlFor="gas">Gas</Label>
                        </div>
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

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
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

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
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
                      <div className="grid grid-cols-2 gap-1 mt-1">
                        <div className="flex items-center space-x-1">
                          <CustomCheckbox id="antes-comida" onChange={() => handleLavadoManosChange('antes de cada comida')} />
                          <Label htmlFor="antes-comida">Antes de cada comida</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CustomCheckbox id="despues-bano" onChange={() => handleLavadoManosChange('despues de ir al baño')} />
                          <Label htmlFor="despues-bano">Después de ir al baño</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CustomCheckbox id="antes-despues-comida" onChange={() => handleLavadoManosChange('antes y despues de cada comida')} />
                          <Label htmlFor="antes-despues-comida">Antes y después de manipular alimentos</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CustomCheckbox id="no-regular" onChange={() => handleLavadoManosChange('de manera no regular')} />
                          <Label htmlFor="no-regular">No tiene hábito regular de lavado de manos</Label>
                        </div>
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

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
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
                      <div className="grid grid-cols-2 gap-1 mt-1">
                        <div className="flex items-center space-x-1">
                          <CustomCheckbox id="hilo-dental" onChange={(e) => handleCheckboxChange('auxiliaresBucales', 'hilo dental')} />
                          <Label htmlFor="hilo-dental">Hilo Dental</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CustomCheckbox id="enjuague" onChange={(e) => handleCheckboxChange('auxiliaresBucales', 'enjuague bucal')} />
                          <Label htmlFor="enjuague">Enjuague Bucal</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CustomCheckbox id="irrigador" onChange={(e) => handleCheckboxChange('auxiliaresBucales', 'irrigador dental')} />
                          <Label htmlFor="irrigador">Irrigador Dental</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CustomCheckbox id="no-auxiliares" onChange={(e) => handleCheckboxChange('auxiliaresBucales', 'no auxiliares')} />
                          <Label htmlFor="no-auxiliares">No usa auxiliares</Label>
                        </div>
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
                      <div className="grid grid-cols-2 gap-1 mt-1">
                        <div className="flex items-center space-x-1">
                          <CustomCheckbox id="encias-sangran" onChange={(e) => handleCheckboxChange('problemasBucales', 'encías que sangran')} />
                          <Label htmlFor="encias-sangran">Encías que sangran al cepillarse</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CustomCheckbox id="dientes-agujeros" onChange={(e) => handleCheckboxChange('problemasBucales', 'dientes con agujeros')} />
                          <Label htmlFor="dientes-agujeros">Dientes con agujeros o zonas oscuras</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CustomCheckbox id="mal-aliento" onChange={(e) => handleCheckboxChange('problemasBucales', 'mal aliento frecuente')} />
                          <Label htmlFor="mal-aliento">Mal aliento frecuente</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CustomCheckbox id="dolor-dientes" onChange={(e) => handleCheckboxChange('problemasBucales', 'dolor en dientes o encías')} />
                          <Label htmlFor="dolor-dientes">Dolor en dientes o encías</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CustomCheckbox id="no-problemas" onChange={(e) => handleCheckboxChange('problemasBucales', 'no problemas')} />
                          <Label htmlFor="no-problemas">No tengo problemas bucales</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2">Alimentación</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tipo de Alimentos Consumidos Frecuentemente</Label>
                      <div className="grid grid-cols-2 gap-1 mt-1">
                        <div className="flex items-center space-x-1">
                          <CustomCheckbox id="frutas-verduras" onChange={(e) => handleCheckboxChange('alimentosConsumidos', 'frutas y verduras')} />
                          <Label htmlFor="frutas-verduras">Frutas y verduras</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CustomCheckbox id="carnes-proteinas" onChange={(e) => handleCheckboxChange('alimentosConsumidos', 'carnes y proteínas')} />
                          <Label htmlFor="carnes-proteinas">Carnes y proteínas</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CustomCheckbox id="alimentos-procesados" onChange={(e) => handleCheckboxChange('alimentosConsumidos', 'alimentos procesados y fritos')} />
                          <Label htmlFor="alimentos-procesados">Alimentos procesados y fritos</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CustomCheckbox id="dulces-azucares" onChange={(e) => handleCheckboxChange('alimentosConsumidos', 'dulces y azúcares')} />
                          <Label htmlFor="dulces-azucares">Dulces y azúcares</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CustomCheckbox id="lacteos" onChange={(e) => handleCheckboxChange('alimentosConsumidos', 'lácteos')} />
                          <Label htmlFor="lacteos">Lácteos</Label>
                        </div>
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
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Redacción IA content */}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AntecedentesPersonalesNoPatologicos;
