import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Eraser, Copy, CheckCircle } from "lucide-react";

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
  const [copied, setCopied] = useState(null);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
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
    lavadoManos: "",
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
      serviciosDomiciliarios: `El paciente reside en una vivienda de tipo ${formData.tipoVivienda} con estructura predominante de ${formData.materialVivienda}. Cuenta con servicios básicos de ${formData.servicios.join(", ")}, lo que facilita su calidad de vida. La calle donde habita se encuentra ${formData.condicionCalle} y presenta ${formData.iluminacionCalle}, lo que puede afectar su seguridad y movilidad.`,
      higieneVivienda: `La vivienda del paciente se mantiene con una rutina de limpieza ${formData.frecuenciaLimpieza}, lo que influye en su bienestar general. El cambio de ropa de cama se realiza ${formData.cambioRopaCama}. Se observa que la vivienda ${formData.hacinamiento === "no" ? "no presenta" : "presenta"} condiciones de hacinamiento. Además, se identifica que ${formData.promiscuidad === "no" ? "no" : "sí"} existe promiscuidad. El paciente ${formData.mascotas === "no" ? "no tiene" : "tiene"} mascotas. En cuanto a la recolección de basura, ${formData.manejoResiduos === "diaria" ? "la basura se desecha diariamente" : "se acumulan residuos dentro del hogar"}, lo que puede influir en la higiene del entorno.`,
      higienePersonal: `El paciente reporta una frecuencia de baño ${formData.frecuenciaBano}, lo que influye en su higiene y confort personal. Respecto al lavado de manos, lo realiza ${formData.lavadoManos}. En cuanto al cambio de ropa, se registra una frecuencia ${formData.cambioRopa}.`,
      higieneBucal: `El paciente se cepilla los dientes ${formData.frecuenciaCepillado} veces al día y utiliza una técnica de cepillado ${formData.tecnicaCepillado}. Se observa que ${formData.auxiliaresBucales.length > 0 ? "utiliza" : "no utiliza"} auxiliares de higiene bucal, como ${formData.auxiliaresBucales.join(" y ")}. En relación con la atención odontológica, su última consulta fue hace ${formData.ultimaVisitaOdontologo}. El paciente reporta la presencia de ${formData.problemasBucales.join(" y ")}, lo que podría indicar la necesidad de una revisión odontológica.`,
      alimentacion: `El paciente consume frecuentemente ${formData.alimentosConsumidos.join(" y ")}. Su alimentación incluye frutas y verduras con una frecuencia ${formData.frecuenciaFrutasVerduras}, mientras que las bebidas azucaradas son consumidas ${formData.frecuenciaBebidasAzucaradas}. También reporta que come comida chatarra ${formData.frecuenciaComidaChatarra}. Su consumo de agua al día es de ${formData.consumoAgua}. El paciente realiza ${formData.numeroComidas} comidas al día y mantiene un horario de alimentación ${formData.horarioComidas}. Además, menciona que ${formData.ayunoProlongado === "no" ? "no realiza" : "realiza"} ayunos prolongados.`
    };

    setRedacciones(redaccionesGeneradas);
    setShowForm(false);
  };

  const handleCopy = (section) => {
    navigator.clipboard.writeText(redacciones[section]);
    setCopied(section);
    setTimeout(() => setCopied(null), 2000);
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
            {showForm ? (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-4">Servicios Domiciliarios</h4>
                  <div className="grid gap-4">
                    <div>
                      <Label>Tipo de Vivienda</Label>
                      <Select className="mt-2" onValueChange={(value) => handleFormChange('tipoVivienda', value)}>
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
                      <Select className="mt-2" onValueChange={(value) => handleFormChange('materialVivienda', value)}>
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
                      <div className="grid grid-cols-2 gap-2 mt-2">
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
                      <Select className="mt-2" onValueChange={(value) => handleFormChange('condicionCalle', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione condición" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pavimentada">Pavimentada</SelectItem>
                          <SelectItem value="sin-pavimentar">Sin pavimentar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Iluminación en la Calle</Label>
                      <Select className="mt-2" onValueChange={(value) => handleFormChange('iluminacionCalle', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione iluminación" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bien-iluminada">Bien iluminada</SelectItem>
                          <SelectItem value="poca-iluminacion">Poca iluminación</SelectItem>
                          <SelectItem value="sin-iluminacion">Sin iluminación</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-4">Higiene de la Vivienda</h4>
                  <div className="grid gap-4">
                    <div>
                      <Label>Regularidad en el Aseo de la Vivienda</Label>
                      <Select className="mt-2" onValueChange={(value) => handleFormChange('frecuenciaLimpieza', value)}>
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
                      <Select className="mt-2" onValueChange={(value) => handleFormChange('cambioRopaCama', value)}>
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
                      <Select className="mt-2" onValueChange={(value) => handleFormChange('hacinamiento', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione opción" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="si">Sí, duermen más de 3 personas en una habitación</SelectItem>
                          <SelectItem value="no">No hay hacinamiento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mt-2">
                      <Label>Presencia de Promiscuidad</Label>
                      <Select className="mt-2" onValueChange={(value) => handleFormChange('promiscuidad', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione opción" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="si">Sí</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mt-2">
                      <Label>Presencia de Animales en Casa</Label>
                      <Select className="mt-2" onValueChange={(value) => handleFormChange('mascotas', value)}>
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
                    <div className="mt-2">
                      <Label>Manejo de Residuos</Label>
                      <Select className="mt-2" onValueChange={(value) => handleFormChange('manejoResiduos', value)}>
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

                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-4">Higiene Personal</h4>
                  <div className="grid gap-4">
                    <div>
                      <Label>Frecuencia de Baño</Label>
                      <Select className="mt-2" onValueChange={(value) => handleFormChange('frecuenciaBano', value)}>
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
                      <Select className="mt-2" onValueChange={(value) => handleFormChange('lavadoManos', value)}>
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
                      <Select className="mt-2" onValueChange={(value) => handleFormChange('cambioRopa', value)}>
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
                      <Select className="mt-2" onValueChange={(value) => handleFormChange('frecuenciaCepillado', value)}>
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
                      <Select className="mt-2" onValueChange={(value) => handleFormChange('tecnicaCepillado', value)}>
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
                      <div className="grid grid-cols-2 gap-2 mt-2">
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
                      <Select className="mt-2" onValueChange={(value) => handleFormChange('ultimaVisitaOdontologo', value)}>
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
                      <div className="grid grid-cols-2 gap-2 mt-2">
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

                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-4">Alimentación</h4>
                  <div className="grid gap-4">
                    <div>
                      <Label>Tipo de Alimentos Consumidos Frecuentemente</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
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
                      <Select className="mt-2" onValueChange={(value) => handleFormChange('frecuenciaFrutasVerduras', value)}>
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
                      <Select className="mt-2" onValueChange={(value) => handleFormChange('frecuenciaBebidasAzucaradas', value)}>
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
                      <Select className="mt-2" onValueChange={(value) => handleFormChange('frecuenciaComidaChatarra', value)}>
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
                      <Select className="mt-2" onValueChange={(value) => handleFormChange('consumoAgua', value)}>
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
                    <div>
                      <Label>Número de Comidas al Día</Label>
                      <Select className="mt-2" onValueChange={(value) => handleFormChange('numeroComidas', value)}>
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
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="flex items-center space-x-1">
                          <Label>Desayuno:</Label>
                          <input type="time" className="border rounded px-2 py-1" onChange={(e) => handleFormChange('horarioComidas', { ...formData.horarioComidas, desayuno: e.target.value })} />
                        </div>
                        <div className="flex items-center space-x-1">
                          <Label>Almuerzo:</Label>
                          <input type="time" className="border rounded px-2 py-1" onChange={(e) => handleFormChange('horarioComidas', { ...formData.horarioComidas, almuerzo: e.target.value })} />
                        </div>
                        <div className="flex items-center space-x-1">
                          <Label>Cena:</Label>
                          <input type="time" className="border rounded px-2 py-1" onChange={(e) => handleFormChange('horarioComidas', { ...formData.horarioComidas, cena: e.target.value })} />
                        </div>
                        {/* Agregar más campos de tiempo si es necesario */}
                      </div>
                    </div>
                    <div>
                      <Label>Realizas Ayuno Prolongado?</Label>
                      <Select className="mt-2" onValueChange={(value) => handleFormChange('ayunoProlongado', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione opción" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eleccion">Sí, por elección</SelectItem>
                          <SelectItem value="acceso">Sí, por falta de acceso a alimentos</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {Object.entries(redacciones).map(([section, redaccion], index) => (
                  <div key={index} className="mb-4">
                    <Label className="font-semibold">{section.charAt(0).toUpperCase() + section.slice(1)}</Label>
                    <textarea
                      className="w-full h-auto min-h-[100px] mt-2 p-2 border rounded-md"
                      value={redaccion}
                      readOnly
                    />
                    <Button
                      onClick={() => handleCopy(section)}
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 relative"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copiar Redacción</span>
                      {copied === section && (
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

            <div className="flex justify-center gap-4 mt-6">
              <Button onClick={generarRedaccionIA} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
                <span>Generar Redacción IA</span>
              </Button>
              <Button onClick={() => setShowForm(true)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2">
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
