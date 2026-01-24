
import React, { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Eraser, Copy, CheckCircle } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { AnimatedTextarea } from "@/components/ui/animated-textarea";

interface AntecedentesPersonalesNoPatologicosProps {
  formData: FormDataState;
  handleAntecedenteNoPatologicoChange: (field: string, value: any) => void;
  toggleService: (service: string) => void;
  onRedaccionGenerada?: (content: string) => void;
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
  return <button onClick={onClick} className={`px-2 py-1 text-xs rounded-md transition-colors mb-1 mr-1 ${isSelected ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
    {label}
  </button>;
};

const AntecedentesPersonalesNoPatologicos: React.FC<AntecedentesPersonalesNoPatologicosProps> = ({
  formData,
  handleAntecedenteNoPatologicoChange,
  toggleService,
  onRedaccionGenerada
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
  const [formDataLocal, setFormDataLocal] = useState(formData.antecedentesPersonalesNoPatologicos);

  useEffect(() => {
    setFormDataLocal(formData.antecedentesPersonalesNoPatologicos);
  }, [formData]);

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
    // Implement AI text generation logic for each section
    const serviciosRedaccion = generateServiciosDomiciliariosText();
    const higieneViviendaRedaccion = generateHigieneViviendaText();
    const higienePersonalRedaccion = generateHigienePersonalText();
    const higieneBucalRedaccion = generateHigieneBucalText();
    const alimentacionRedaccion = generateAlimentacionText();
    setRedacciones({
      serviciosDomiciliarios: serviciosRedaccion,
      higieneVivienda: higieneViviendaRedaccion,
      higienePersonal: higienePersonalRedaccion,
      higieneBucal: higieneBucalRedaccion,
      alimentacion: alimentacionRedaccion
    });

    const fullText = `ANTECEDENTES PERSONALES NO PATOLÓGICOS

SERVICIOS DOMICILIARIOS:
${serviciosRedaccion}

HIGIENE DE LA VIVIENDA:
${higieneViviendaRedaccion}

HIGIENE PERSONAL:
${higienePersonalRedaccion}

HIGIENE BUCAL:
${higieneBucalRedaccion}

ALIMENTACIÓN:
${alimentacionRedaccion}`;

    setRedacciones({
      serviciosDomiciliarios: serviciosRedaccion,
      higieneVivienda: higieneViviendaRedaccion,
      higienePersonal: higienePersonalRedaccion,
      higieneBucal: higieneBucalRedaccion,
      alimentacion: alimentacionRedaccion
    });

    if (onRedaccionGenerada) {
      onRedaccionGenerada(fullText);
    }
    setShowForm(false);
    setProgress(100);

    // Scroll to the title "Servicios Domiciliarios"
    redaccionesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateServiciosDomiciliariosText = () => {
    const {
      tipoVivienda,
      materialVivienda,
      servicios,
      condicionCalle,
      iluminacionCalle
    } = formDataLocal;
    let serviciosList = '';
    if (servicios.length === 6) {
      serviciosList = '(agua, luz, drenaje, transporte, internet y gas)';
    } else if (servicios.length > 0) {
      serviciosList = servicios.join(', ');
    } else {
      serviciosList = 'servicios limitados';
    }
    return `El paciente habita en una vivienda de tipo ${tipoVivienda || '[no especificado]'}, construida principalmente con ${materialVivienda || '[no especificado]'}. Cuenta con los siguientes servicios básicos: ${serviciosList}. La condición de la calle en la que se encuentra la vivienda es ${condicionCalle || '[no especificado]'}, y la iluminación en la vía pública es ${iluminacionCalle || '[no especificado]'}, lo que puede influir en la seguridad y accesibilidad del entorno.`;
  };

  const generateHigieneViviendaText = () => {
    const {
      frecuenciaLimpieza,
      cambioRopaCama,
      hacinamiento,
      promiscuidad,
      mascotas,
      manejoResiduos
    } = formDataLocal;
    let hacinamientoText = hacinamiento === 'si' ? 'presencia de hacinamiento' : 'ausencia de hacinamiento';
    let promiscuidadText = promiscuidad === 'si' ? 'hay presencia de promiscuidad' : 'no hay evidencia de promiscuidad';
    let mascotasText = '';
    if (mascotas === 'dentro') {
      mascotasText = 'se observan animales dentro de la casa';
    } else if (mascotas === 'patio') {
      mascotasText = 'se observan animales en el patio';
    } else {
      mascotasText = 'no se observan animales en el domicilio';
    }
    return `El mantenimiento del hogar se realiza con una frecuencia ${frecuenciaLimpieza || '[no especificada]'}, lo que impacta directamente en la salubridad del entorno. La ropa de cama se cambia ${cambioRopaCama || '[no especificado]'}, contribuyendo a la higiene y confort del paciente. Se observa ${hacinamientoText}, lo que puede influir en la calidad de vida y bienestar de los habitantes. Asimismo, ${promiscuidadText}, lo cual puede ser relevante en la evaluación de riesgos sanitarios y epidemiológicos. En el domicilio ${mascotasText}, lo que puede representar un factor de exposición a zoonosis u otras afecciones. En cuanto al manejo de residuos, ${manejoResiduos || '[no especificado]'}, lo que influye en la prevención de enfermedades y el control ambiental.`;
  };

  const generateHigienePersonalText = () => {
    const {
      frecuenciaBano,
      lavadoManos,
      cambioRopa
    } = formDataLocal;
    let lavadoManosText = '';
    if (lavadoManos.length > 0) {
      lavadoManosText = lavadoManos.join(', ');
    } else {
      lavadoManosText = 'sin hábito regular';
    }
    return `El paciente refiere una frecuencia de baño ${frecuenciaBano || '[no especificada]'}, lo que contribuye a la higiene general y prevención de infecciones cutáneas. Presenta hábitos de higiene de manos ${lavadoManosText}, lo que es un factor clave en la prevención de enfermedades de transmisión feco-oral. El cambio de ropa se realiza ${cambioRopa || '[no especificada]'}, aspecto importante en el mantenimiento de la higiene personal.`;
  };

  const generateHigieneBucalText = () => {
    const {
      frecuenciaCepillado,
      tecnicaCepillado,
      auxiliaresBucales,
      ultimaVisitaOdontologo,
      problemasBucales
    } = formDataLocal;
    let auxiliaresText = '';
    if (auxiliaresBucales.includes('no auxiliares')) {
      auxiliaresText = 'no usa auxiliares de higiene bucal';
    } else if (auxiliaresBucales.length > 0) {
      auxiliaresText = auxiliaresBucales.join(', ');
    } else {
      auxiliaresText = '[no especificado]';
    }
    let problemasText = '';
    if (problemasBucales.includes('no problemas')) {
      problemasText = 'sin problemas bucales';
    } else if (problemasBucales.length > 0) {
      problemasText = problemasBucales.join(', ');
    } else {
      problemasText = '[no especificado]';
    }
    return `El paciente refiere un cepillado dental con una frecuencia ${frecuenciaCepillado || '[no especificada]'}, utilizando técnica ${tecnicaCepillado || '[no especificada]'}, lo que influye directamente en la salud periodontal y la prevención de caries. Además, complementa su higiene bucal con ${auxiliaresText}. La última visita al odontólogo fue hace ${ultimaVisitaOdontologo || '[no especificada]'}, lo que permite evaluar su acceso a la atención odontológica y el seguimiento de su salud bucal. Actualmente, refiere ${problemasText}, aspectos clave en la valoración del estado oral.`;
  };

  const formatTime12Hour = (time: string) => {
    if (!time) return '[no especificado]';
    const [hours, minutes] = time.split(':');
    const period = parseInt(hours, 10) >= 12 ? 'PM' : 'AM';
    const formattedHours = parseInt(hours, 10) % 12 || 12;
    return `${formattedHours}:${minutes} ${period}`;
  };

  const generateAlimentacionText = () => {
    const {
      alimentosConsumidos,
      frecuenciaFrutasVerduras,
      frecuenciaBebidasAzucaradas,
      frecuenciaComidaChatarra,
      consumoAgua,
      numeroComidas,
      horarioComidas
    } = formDataLocal;
    let alimentosText = alimentosConsumidos.length > 0 ? alimentosConsumidos.join(', ') : '[no especificado]';
    let horarios = '';
    if (horarioComidas) {
      horarios = `Desayuno: ${formatTime12Hour(horarioComidas.desayuno)}\nAlmuerzo: ${formatTime12Hour(horarioComidas.almuerzo)}\nCena: ${formatTime12Hour(horarioComidas.cena)}`;
    }
    return `El paciente tiene una alimentación basada en ${alimentosText}, lo que influye en su estado nutricional y salud general. El consumo de frutas y verduras es ${frecuenciaFrutasVerduras || '[no especificada]'}, mientras que la ingesta de bebidas azucaradas ocurre ${frecuenciaBebidasAzucaradas || '[no especificada]'} y el consumo de comida chatarra ${frecuenciaComidaChatarra || '[no especificada]'}, factores determinantes en el riesgo de enfermedades metabólicas y caries dental. La cantidad de agua ingerida diariamente es de aproximadamente ${consumoAgua || '[no especificado]'}, contribuyendo a la hidratación y función renal. Realiza ${numeroComidas || '[no especificado]'} comidas al día, con los siguientes horarios reportados:\n\n${horarios}`;
  };

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
  };

  const handleCopy = async (section: string) => {
    // Track copy click
    try {
      const { trackCopyClick } = await import('@/utils/trackCopyClick');
      trackCopyClick();
    } catch (error) {
      console.error('Error tracking copy:', error);
    }
    navigator.clipboard.writeText(redacciones[section]);
    setCopied(prev => ({
      ...prev,
      [section]: true
    }));
    setTimeout(() => setCopied(prev => ({
      ...prev,
      [section]: false
    })), 2000);
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
      handleAntecedenteChange(key, value);
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
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`} data-formulario-section="antecedentes-personales-no-patologicos">
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-0.5 sm:p-1">
              <button onClick={() => setShowForm(true)} className={`px-3 sm:px-5 py-1 sm:py-1.5 rounded-full transition-all duration-300 text-xs sm:text-sm ${showForm ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}>
                Formulario
              </button>
              <button onClick={() => setShowForm(false)} className={`px-3 sm:px-5 py-1 sm:py-1.5 rounded-full transition-all duration-300 text-xs sm:text-sm ${!showForm ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}>
                Redacción IA
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={handleMinimize} className="p-0.5 sm:p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button onClick={handleMaximize} className="p-0.5 sm:p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors">
              <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button onClick={handleClose} className="p-0.5 sm:p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
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
                  <h4 className="text-lg font-semibold mb-2 text-justify">Servicios Domiciliarios</h4>

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

                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2 text-justify">Higiene de la Vivienda</h4>

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

                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2 text-justify">Higiene Personal</h4>

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

                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2 text-justify">Higiene Bucal</h4>

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

                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2 text-justify">Alimentación</h4>

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
                      <Label>Horario de Desayuno</Label>
                      <input
                        type="time"
                        value={formDataLocal.horarioComidas.desayuno}
                        onChange={(e) => handleFormChange('horarioComidas', { ...formDataLocal.horarioComidas, desayuno: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <Label>Horario de Almuerzo</Label>
                      <input
                        type="time"
                        value={formDataLocal.horarioComidas.almuerzo}
                        onChange={(e) => handleFormChange('horarioComidas', { ...formDataLocal.horarioComidas, almuerzo: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <Label>Horario de Cena</Label>
                      <input
                        type="time"
                        value={formDataLocal.horarioComidas.cena}
                        onChange={(e) => handleFormChange('horarioComidas', { ...formDataLocal.horarioComidas, cena: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button onClick={generarRedaccionIA} className="bg-blue-500 hover:bg-blue-600 text-white">
                    Generar Redacción IA
                  </Button>
                  <Button onClick={limpiarFormulario} variant="outline" className="ml-4 flex items-center gap-2">
                    <Eraser className="w-4 h-4" />
                    Limpiar formulario
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Redacción IA */}
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Servicios Domiciliarios</h4>
                    <button onClick={() => handleCopy('serviciosDomiciliarios')} className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.serviciosDomiciliarios ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.serviciosDomiciliarios}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Higiene de la Vivienda</h4>
                    <button onClick={() => handleCopy('higieneVivienda')} className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.higieneVivienda ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.higieneVivienda}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Higiene Personal</h4>
                    <button onClick={() => handleCopy('higienePersonal')} className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.higienePersonal ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.higienePersonal}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Higiene Bucal</h4>
                    <button onClick={() => handleCopy('higieneBucal')} className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.higieneBucal ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.higieneBucal}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Alimentación</h4>
                    <button onClick={() => handleCopy('alimentacion')} className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.alimentacion ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.alimentacion}
                    className="min-h-[200px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="flex justify-center">
                  <Button onClick={() => setShowForm(true)} variant="outline" className="text-blue-500 border-blue-500">
                    Volver al Formulario
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AntecedentesPersonalesNoPatologicos;
