import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      serviciosDomiciliarios: `El paciente reside en una vivienda de tipo ${formData.tipoVivienda} con estructura predominante de ${formData.materialVivienda}. Cuenta con servicios básicos de ${formData.servicios.length === 6 ? "agua, luz, drenaje, transporte, internet y gas" : formData.servicios.join(", ")}, lo que facilita su calidad de vida. La calle donde habita se encuentra ${formData.condicionCalle} y se presenta ${formData.iluminacionCalle}, lo que puede afectar su seguridad y movilidad.\n`,
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

  const handleSelectAllServices = () => {
    setFormData((prevData) => ({
      ...prevData,
      servicios: ["agua", "luz", "drenaje", "transporte", "internet", "gas"]
    }));
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

  const limpiarFormulario = () => {
    setFormData({
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
      <Card className={`bg-white dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
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
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2">Servicios Domiciliarios</h4>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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
                      <div className="grid grid-cols-1 gap-1 mt-1 md:grid-cols-2">
                        <Button
                          onClick={handleSelectAllServices}
                          className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
                        >
                          Todos los servicios
                        </Button>
                        <Button
                          onClick={() => handleCheckboxChange('servicios', 'agua')}
                          className={`px-2 py-1 text-xs ${formData.servicios.includes('agua') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded hover:bg-blue-600 flex items-center justify-center`}
                        >
                          Agua
                        </Button>
                        <Button
                          onClick={() => handleCheckboxChange('servicios', 'luz')}
                          className={`px-2 py-1 text-xs ${formData.servicios.includes('luz') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded hover:bg-blue-600 flex items-center justify-center`}
                        >
                          Luz
                        </Button>
                        <Button
                          onClick={() => handleCheckboxChange('servicios', 'drenaje')}
                          className={`px-2 py-1 text-xs ${formData.servicios.includes('drenaje') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded hover:bg-blue-600 flex items-center justify-center`}
                        >
                          Drenaje
                        </Button>
                        <Button
                          onClick={() => handleCheckboxChange('servicios', 'transporte')}
                          className={`px-2 py-1 text-xs ${formData.servicios.includes('transporte') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded hover:bg-blue-600 flex items-center justify-center`}
                        >
                          Transporte
                        </Button>
                        <Button
                          onClick={() => handleCheckboxChange('servicios', 'internet')}
                          className={`px-2 py-1 text-xs ${formData.servicios.includes('internet') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded hover:bg-blue-600 flex items-center justify-center`}
                        >
                          Internet
                        </Button>
                        <Button
                          onClick={() => handleCheckboxChange('servicios', 'gas')}
                          className={`px-2 py-1 text-xs ${formData.servicios.includes('gas') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded hover:bg-blue-600 flex items-center justify-center`}
                        >
                          Gas
                        </Button>
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
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                      <div className="grid grid-cols-1 gap-1 mt-1 md:grid-cols-2">
                        <Button
                          onClick={() => handleLavadoManosChange('antes de cada comida')}
                          className={`px-2 py-1 text-xs ${formData.lavadoManos.includes('antes de cada comida') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded hover:bg-blue-600 flex items-center justify-center`}
                        >
                          Antes de cada comida
                        </Button>
                        <Button
                          onClick={() => handleLavadoManosChange('despues de ir al baño')}
                          className={`px-2 py-1 text-xs ${formData.lavadoManos.includes('despues de ir al baño') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded hover:bg-blue-600 flex items-center justify-center`}
                        >
                          Después de ir al baño
                        </Button>
                        <Button
                          onClick={() => handleLavadoManosChange('antes y despues de cada comida')}
                          className={`px-2 py-1 text-xs ${formData.lavadoManos.includes('antes y despues de cada comida') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded hover:bg-blue-600 flex items-center justify-center`}
                        >
                          Antes y después de manipular alimentos
                        </Button>
                        <Button
                          onClick={() => handleLavadoManosChange('de manera no regular')}
                          className={`px-2 py-1 text-xs ${formData.lavadoManos.includes('de manera no regular') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded hover:bg-blue-600 flex items-center justify-center`}
                        >
                          No tiene hábito regular de lavado de manos
                        </Button>
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
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                      <div className="grid grid-cols-1 gap-1 mt-1 md:grid-cols-2">
                        <Button
                          onClick={() => handleCheckboxChange('auxiliaresBucales', 'hilo dental')}
                          className={`px-2 py-1 text-xs ${formData.auxiliaresBucales.includes('hilo dental') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded hover:bg-blue-600 flex items-center justify-center`}
                        >
                          Hilo Dental
                        </Button>
                        <Button
                          onClick={() => handleCheckboxChange('auxiliaresBucales', 'enjuague bucal')}
                          className={`px-2 py-1 text-xs ${formData.auxiliaresBucales.includes('enjuague bucal') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded hover:bg-blue-600 flex items-center justify-center`}
                        >
                          Enjuague Bucal
                        </Button>
                        <Button
                          onClick={() => handleCheckboxChange('auxiliaresBucales', 'irrigador dental')}
                          className={`px-2 py-1 text-xs ${formData.auxiliaresBucales.includes('irrigador dental') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded hover:bg-blue-600 flex items-center justify-center`}
                        >
                          Irrigador Dental
                        </Button>
                        <Button
                          onClick={() => handleCheckboxChange('auxiliaresBucales', 'no auxiliares')}
                          className={`px-2 py-1 text-xs ${formData.auxiliaresBucales.includes('no auxiliares') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded hover:bg-blue-600 flex items-center justify-center`}
                        >
                          No usa auxiliares
                        </Button>
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
                      <div className="grid grid-cols-1 gap-1 mt-1 md:grid-cols-2">
                        <Button
                          onClick={() => handleCheckboxChange('problemasBucales', 'encías que sangran')}
                          className={`px-2 py-1 text-xs ${formData.problemasBucales.includes('encías que sangran') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded hover:bg-blue-600 flex items-center justify-center`}
                        >
                          Encías que sangran al cepillarse
                        </Button>
                        <Button
                          onClick={() => handleCheckboxChange('problemasBucales', 'dientes con agujeros')}
                          className={`px-2 py-1 text-xs ${formData.problemasBucales.includes('dientes con agujeros') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded hover:bg-blue-600 flex items-center justify-center`}
                        >
                          Dientes con agujeros o zonas oscuras
                        </Button>
                        <Button
                          onClick={() => handleCheckboxChange('problemasBucales', 'mal aliento frecuente')}
                          className={`px-2 py-1 text-xs ${formData.problemasBucales.includes('mal aliento frecuente') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded hover:bg-blue-600 flex items-center justify-center`}
                        >
                          Mal aliento frecuente
                        </Button>
                        <Button
                          onClick={() => handleCheckboxChange('problemasBucales', 'dolor en dientes o encías')}
                          className={`px-2 py-1 text-xs ${formData.problemasBucales.includes('dolor en dientes o encías') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded hover:bg-blue-600 flex items-center justify-center`}
                        >
                          Dolor en dientes o encías
                        </Button>
                        <Button
                          onClick={() => handleCheckboxChange('problemasBucales', 'no problemas')}
                          className={`px-2 py-1 text-xs ${formData.problemasBucales.includes('no problemas') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded hover:bg-blue-600 flex items-center justify-center`}
                        >
                          No tengo problemas bucales
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2">Alimentación</h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label>Tipo de Alimentos Consumidos Frecuentemente</Label>
                      <div className="grid grid-cols-1 gap-1 mt-1 md:grid-cols-2">
                        <Button
                          onClick={() => handleCheckboxChange('alimentosConsumidos', 'frutas y verduras')}
                          className={`px-2 py-1 text-xs ${formData.alimentosConsumidos.includes('frutas y verduras') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded hover:bg-blue-600 flex items-center justify-center`}
                        >
                          Frutas y verduras
                        </Button>
                        <Button
                          onClick={() => handleCheckboxChange('alimentosConsumidos', 'carnes y proteínas')}
                          className={`px-2 py-1 text-xs ${formData.alimentosConsumidos.includes('carnes y proteínas') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded hover:bg-blue-600 flex items-center justify-center`}
                        >
                          Carnes y proteínas
                        </Button>
                        <Button
                          onClick={() => handleCheckboxChange('alimentosConsumidos', 'alimentos procesados y fritos')}
                          className={`px-2 py-1 text-xs ${formData.alimentosConsumidos.includes('alimentos procesados y fritos') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded hover:bg-blue-600 flex items-center justify-center`}
                        >
                          Alimentos procesados y fritos
                        </Button>
                        <Button
                          onClick={() => handleCheckboxChange('alimentosConsumidos', 'dulces y azúcares')}
                          className={`px-2 py-1 text-xs ${formData.alimentosConsumidos.includes('dulces y azúcares') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded hover:bg-blue-600 flex items-center justify-center`}
                        >
                          Dulces y azúcares
                        </Button>
                        <Button
                          onClick={() => handleCheckboxChange('alimentosConsumidos', 'lácteos')}
                          className={`px-2 py-1 text-xs ${formData.alimentosConsumidos.includes('lácteos') ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded hover:bg-blue-600 flex items-center justify-center`}
                        >
                          Lácteos
                        </Button>
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
                {Object.keys(redacciones).map((section, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold mb-2">{section.charAt(0).toUpperCase() + section.slice(1)}</h4>
                    <p>{redacciones[section]}</p>
                    <Button
                      onClick={() => handleCopy(section)}
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 relative"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copiar</span>
                      {copied[section] && (
                        <div className="absolute -top-8 left-0 bg-green-500 text-white text-sm rounded-lg px-3 py-1 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>Copiado</span>
                        </div>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Barra de progreso */}
            {!showForm && (
              <div className="progress-bar-container" style={{ width: '100%', backgroundColor: '#d3d3d3', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem', boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)' }}>
                <div className="progress-bar" style={{ height: '8px', backgroundColor: '#34c759', transition: 'width 0.015s ease-in-out', width: `${progress}%`, borderRadius: '12px' }} />
              </div>
            )}

            {/* Botones de acción */}
            <div className="p-6 flex justify-center gap-4">
              <Button onClick={generarRedaccionIA} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
                <span>Generar Redacción IA</span>
              </Button>
              <Button onClick={limpiarFormulario} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2">
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
