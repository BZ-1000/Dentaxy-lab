import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";
import { TimePickerDentaxy } from "@/components/ui/TimePickerDentaxy";
import { FormDataState } from "@/types/historiaClinica";
import { cn } from "@/lib/utils";

interface AntecedentesPersonalesNoPatologicosProps {
  formData: FormDataState;
  handleAntecedenteNoPatologicoChange: (field: string, value: any) => void;
  toggleService: (service: string) => void;
  onRedaccionGenerada?: (content: any) => void;
  onToggleViewMode?: () => void;
  onSectionComplete?: () => void;
  microStep?: number;
  onMicroStepChange?: (step: number) => void;
  onTotalMicroStepsChange?: (total: number, names: string[]) => void;
}

const stepsDefinitions = [
  { id: 0, nombre: "Servicios Domiciliarios y Vivienda" },
  { id: 1, nombre: "Higiene de la Vivienda y Zoonosis" },
  { id: 2, nombre: "Higiene Personal y Hábitos Bucales" },
  { id: 3, nombre: "Dieta, Alimentación y Nutrición" },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 40 : -40,
    opacity: 0,
  }),
};

const formatTime12Hour = (time24?: string) => {
  if (!time24) return "[no especificado]";
  const [hours, minutes] = time24.split(":");
  if (!hours || !minutes) return time24;
  let h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  h = h ? h : 12;
  return `${h}:${minutes} ${ampm}`;
};

// Componentes UI Neomórficos con Efecto Hundido/Presionado al Activar
const glassBtnBase = "rounded-2xl sm:rounded-3xl border-2 transition-all duration-200 relative overflow-hidden backdrop-blur-md font-bold select-none cursor-pointer";
const glassBtnInactive = "bg-white dark:bg-zinc-800/90 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 shadow-[4px_4px_10px_rgba(0,0,0,0.06),-4px_-4px_10px_rgba(255,255,255,0.9)] dark:shadow-[4px_4px_10px_rgba(0,0,0,0.4)] hover:border-zinc-300 dark:hover:border-zinc-600 hover:scale-[1.01] active:scale-[0.98]";
const glassBtnActive = "bg-zinc-100/90 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-500 text-zinc-900 dark:text-white shadow-[inset_3px_3px_7px_rgba(0,0,0,0.14),inset_-3px_-3px_7px_rgba(255,255,255,0.8)] dark:shadow-[inset_3px_3px_7px_rgba(0,0,0,0.55),inset_-3px_-3px_7px_rgba(255,255,255,0.05)] scale-[0.98]";

const Heading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white leading-tight mb-6 drop-shadow-sm">
    {children}
  </h2>
);

const SubLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-xs font-extrabold text-zinc-700 dark:text-zinc-300 uppercase tracking-widest block mb-2.5 ml-1">
    {children}
  </label>
);

const OptionGrid = ({
  options,
  selectedValue,
  onChange,
  columns = "grid-cols-2 sm:grid-cols-4",
}: {
  options: { label: string; value: string; subtitle?: string }[];
  selectedValue: string;
  onChange: (val: string) => void;
  columns?: string;
}) => (
  <div className={cn("grid gap-2.5", columns)}>
    {options.map((opt) => {
      const isSelected = selectedValue === opt.value;
      return (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            glassBtnBase,
            "py-3.5 px-4 text-center flex flex-col items-center justify-center gap-0.5",
            isSelected ? glassBtnActive : glassBtnInactive
          )}
        >
          <span className="text-sm font-extrabold truncate w-full flex items-center justify-center gap-1.5">
            {opt.label}
            {isSelected && (
              <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">
                ✓
              </span>
            )}
          </span>
          {opt.subtitle && (
            <span className={cn("text-[10px] font-medium opacity-80 truncate w-full", isSelected ? "text-zinc-600 dark:text-zinc-400" : "text-zinc-500 dark:text-zinc-400")}>
              {opt.subtitle}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

const MultiOptionChips = ({
  options,
  selectedValues = [],
  onToggle,
}: {
  options: { label: string; value: string }[];
  selectedValues: string[];
  onToggle: (val: string) => void;
}) => (
  <div className="flex flex-wrap gap-2">
    {options.map((opt) => {
      const isSelected = selectedValues.includes(opt.value);
      return (
        <button
          key={opt.value}
          type="button"
          onClick={() => onToggle(opt.value)}
          className={cn(
            "px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border-2 flex items-center gap-1.5 cursor-pointer",
            isSelected
              ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-500 text-zinc-900 dark:text-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.14),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.55),inset_-2px_-2px_5px_rgba(255,255,255,0.05)] scale-[0.97]"
              : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 shadow-[2px_2px_6px_rgba(0,0,0,0.05),-2px_-2px_6px_rgba(255,255,255,0.9)]"
          )}
        >
          <span>{opt.label}</span>
          <span className={cn("text-xs font-black ml-1", isSelected ? "text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]" : "text-zinc-400")}>
            {isSelected ? "✓" : "+"}
          </span>
        </button>
      );
    })}
  </div>
);

const AntecedentesPersonalesNoPatologicos: React.FC<AntecedentesPersonalesNoPatologicosProps> = ({
  formData,
  handleAntecedenteNoPatologicoChange,
  onRedaccionGenerada,
  microStep = 0,
  onTotalMicroStepsChange,
}) => {
  const [dir, setDir] = useState(1);
  const data = formData.antecedentesPersonalesNoPatologicos;

  useEffect(() => {
    if (onTotalMicroStepsChange) {
      onTotalMicroStepsChange(stepsDefinitions.length, stepsDefinitions.map((s) => s.nombre));
    }
  }, []);

  const generateServiciosDomiciliariosText = () => {
    const { tipoVivienda, materialVivienda, servicios, condicionCalle, iluminacionCalle } = data;
    const serviciosText = servicios.length > 0 ? servicios.join(", ") : "[no especificado]";
    return `El paciente habita en una vivienda de tipo ${tipoVivienda || "[no especificado]"}, construida predominantemente con ${materialVivienda || "[no especificado]"}. Cuenta con los siguientes servicios básicos: ${serviciosText}. La calle de acceso se encuentra en condición de ${condicionCalle || "[no especificado]"} y la iluminación en la vía pública es ${iluminacionCalle || "[no especificado]"}, factores que influyen en las condiciones de salubridad y seguridad del entorno del paciente.`;
  };

  const generateHigieneViviendaText = () => {
    const { frecuenciaLimpieza, cambioRopaCama, hacinamiento, promiscuidad, mascotas, manejoResiduos } = data;
    return `La higiene de la vivienda se realiza con una frecuencia ${frecuenciaLimpieza || "[no especificada]"}, y el cambio de ropa de cama se efectúa ${cambioRopaCama || "[no especificado]"}. ${hacinamiento === "si" ? "Se observa presencia de hacinamiento" : "No se reporta hacinamiento"} y ${promiscuidad === "si" ? "promiscuidad en el domicilio" : "no hay promiscuidad"}, lo cual puede incidir en la propagación de enfermedades transmisibles. En relación a la presencia de animales, ${mascotas === "dentro" ? "cuenta con mascotas dentro del domicilio" : mascotas === "patio" ? "cuenta con mascotas en el patio" : "no cuenta con mascotas"}. El manejo de residuos se realiza mediante ${manejoResiduos || "[no especificado]"}, garantizando un adecuado o limitado control de vectores de contaminación.`;
  };

  const generateHigienePersonalText = () => {
    const { frecuenciaBano, lavadoManos, cambioRopa } = data;
    const lavadoManosText = lavadoManos.length > 0 ? lavadoManos.join(", ") : "[no especificado]";
    return `En cuanto a la higiene personal, el paciente realiza su baño con una frecuencia ${frecuenciaBano || "[no especificada]"} y el cambio de ropa ocurre de forma ${cambioRopa || "[no especificada]"}. Respecto al lavado de manos, refiere llevarlo a cabo ${lavadoManosText}, práctica fundamental en la prevención de infecciones gastrointestinales y respiratorias.`;
  };

  const generateHigieneBucalText = () => {
    const { frecuenciaCepillado, tecnicaCepillado, auxiliaresBucales, ultimaVisitaOdontologo, problemasBucales } = data;
    const auxiliaresText = auxiliaresBucales.length > 0 ? auxiliaresBucales.join(", ") : "[no especificado]";
    const problemasText = problemasBucales.length > 0 ? problemasBucales.join(", ") : "[ninguno especificado]";
    return `Sobre la higiene bucal, reporta realizar cepillado dental ${frecuenciaCepillado || "[no especificada]"}, empleando una técnica ${tecnicaCepillado || "[no especificada]"}. Hace uso de los siguientes auxiliares de higiene: ${auxiliaresText}. Su última visita al odontólogo fue hace ${ultimaVisitaOdontologo || "[no especificado]"}. Asimismo, manifiesta los siguientes problemas bucales: ${problemasText}, los cuales requieren evaluación clínica periódica.`;
  };

  const generateAlimentacionText = () => {
    const { alimentosConsumidos, frecuenciaFrutasVerduras, frecuenciaBebidasAzucaradas, frecuenciaComidaChatarra, consumoAgua, numeroComidas, horarioComidas } = data;
    const alimentosText = alimentosConsumidos.length > 0 ? alimentosConsumidos.join(", ") : "[no especificado]";
    let horarios = "";
    if (horarioComidas) {
      horarios = `Almuerzo: ${formatTime12Hour(horarioComidas.desayuno)}<br/>Comida: ${formatTime12Hour(horarioComidas.almuerzo)}<br/>Cena: ${formatTime12Hour(horarioComidas.cena)}`;
    }
    return `El paciente tiene una alimentación basada en ${alimentosText}, lo que influye en su estado nutricional y salud general. El consumo de frutas y verduras es ${frecuenciaFrutasVerduras || "[no especificada]"}, mientras que la ingesta de bebidas azucaradas ocurre ${frecuenciaBebidasAzucaradas || "[no especificada]"} y el consumo de comida chatarra ${frecuenciaComidaChatarra || "[no especificada]"}, factores determinantes en el riesgo de enfermedades metabólicas y caries dental. La cantidad de agua ingerida diariamente es de aproximadamente ${consumoAgua || "[no especificado]"}, contribuyendo a la hidratación y función renal. Realiza ${numeroComidas || "[no especificado]"} comidas al día, con los siguientes horarios reportados:<br/><br/>${horarios}`;
  };

  // Redacción progresiva acumulativa según el micropaso activo
  const generarTextoRedaccion = () => {
    const formatTitle = (title: string) => `<span class="block text-xs font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mt-4 mb-1">${title}</span>`;

    let redaccionTexto = "";

    // Micropaso 0 o superior: Servicios Domiciliarios
    if (microStep >= 0) {
      const servicios = generateServiciosDomiciliariosText();
      if (servicios) redaccionTexto += `\n${formatTitle("Servicios Domiciliarios")}\n${servicios}\n`;
    }

    // Micropaso 1 o superior: Higiene de la Vivienda y Zoonosis
    if (microStep >= 1) {
      const vivienda = generateHigieneViviendaText();
      if (vivienda) redaccionTexto += `\n${formatTitle("Higiene de la Vivienda y Zoonosis")}\n${vivienda}\n`;
    }

    // Micropaso 2 o superior: Higiene Personal e Higiene Bucal
    if (microStep >= 2) {
      const higPersonal = generateHigienePersonalText();
      const higBucal = generateHigieneBucalText();
      if (higPersonal) redaccionTexto += `\n${formatTitle("Higiene Personal")}\n${higPersonal}\n`;
      if (higBucal) redaccionTexto += `\n${formatTitle("Higiene Bucal")}\n${higBucal}\n`;
    }

    // Micropaso 3: Alimentación
    if (microStep >= 3) {
      const alimentacion = generateAlimentacionText();
      if (alimentacion) redaccionTexto += `\n${formatTitle("Alimentación")}\n${alimentacion}\n`;
    }

    return redaccionTexto.trim();
  };

  const triggerLiveRedaccion = () => {
    setTimeout(() => {
      const textoHTML = generarTextoRedaccion();
      if (onRedaccionGenerada) {
        onRedaccionGenerada(textoHTML);
      }
    }, 10);
  };

  useEffect(() => {
    triggerLiveRedaccion();
  }, [data, microStep]);

  const handleFieldChange = (field: string, val: any) => {
    handleAntecedenteNoPatologicoChange(field, val);
    triggerLiveRedaccion();
  };

  const handleWordButtonClick = (field: string, value: string) => {
    if (field === "servicios" && value === "todos") {
      let newValues;
      if (data.servicios.length === 6) {
        newValues = [];
      } else {
        newValues = ["agua", "luz", "drenaje", "transporte", "internet", "gas"];
      }
      handleFieldChange(field, newValues);
      return;
    }
    const currentValues = (data[field as keyof typeof data] as string[]) || [];

    let newValues;
    if (value === "no auxiliares" || value === "no problemas") {
      if (currentValues.includes(value)) {
        newValues = [];
      } else {
        newValues = [value];
      }
    } else {
      let filteredValues = currentValues.filter((v) => v !== "no auxiliares" && v !== "no problemas");
      if (filteredValues.includes(value)) {
        newValues = filteredValues.filter((v) => v !== value);
      } else {
        newValues = [...filteredValues, value];
      }
    }
    handleFieldChange(field, newValues);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto pb-4 pt-0">
      <div className="relative bg-transparent p-1 sm:p-2 flex flex-col justify-between">
        
        {/* Micro Step Indicator Minimalista */}
        <div className="flex items-center justify-center w-full mb-6 gap-1.5 mx-auto">
          {stepsDefinitions.map((step, idx) => {
            const isActive = idx === microStep;
            const isPast = idx < microStep;
            return (
              <div
                key={step.id}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  isActive
                    ? "w-7 bg-zinc-900 dark:bg-white shadow-sm"
                    : isPast
                    ? "w-2 bg-zinc-400 dark:bg-zinc-500"
                    : "w-1.5 bg-zinc-200 dark:bg-zinc-800"
                )}
              />
            );
          })}
        </div>

        {/* Dynamic Content Area */}
        <div className="w-full">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={microStep}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              {microStep === 0 && (
                /* PASO 0: Servicios Domiciliarios y Vivienda */
                <div key="step-0" className="space-y-6">
                  <Heading>Servicios domiciliarios y tipo de vivienda</Heading>

                  <div className="space-y-5">
                    <div>
                      <SubLabel>Tipo de Vivienda</SubLabel>
                      <OptionGrid
                        columns="grid-cols-3"
                        selectedValue={data.tipoVivienda}
                        onChange={(val) => handleFieldChange("tipoVivienda", val)}
                        options={[
                          { label: "Urbana", value: "urbana" },
                          { label: "Semiurbana", value: "semiurbana" },
                          { label: "Rural", value: "rural" },
                        ]}
                      />
                    </div>

                    <div>
                      <SubLabel>Material Predominante de la Vivienda</SubLabel>
                      <OptionGrid
                        columns="grid-cols-2 sm:grid-cols-4"
                        selectedValue={data.materialVivienda}
                        onChange={(val) => handleFieldChange("materialVivienda", val)}
                        options={[
                          { label: "Concreto", value: "concreto" },
                          { label: "Ladrillo", value: "ladrillo" },
                          { label: "Madera", value: "madera" },
                          { label: "Lámina", value: "lamina" },
                        ]}
                      />
                    </div>

                    <div>
                      <SubLabel>Servicios Disponibles en la Vivienda</SubLabel>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => handleWordButtonClick("servicios", "todos")}
                          className={cn(
                            "px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border-2 flex items-center gap-1.5 cursor-pointer",
                            data.servicios.length === 6
                              ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-500 text-zinc-900 dark:text-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.14),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.55),inset_-2px_-2px_5px_rgba(255,255,255,0.05)] scale-[0.97]"
                              : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 shadow-[2px_2px_6px_rgba(0,0,0,0.05),-2px_-2px_6px_rgba(255,255,255,0.9)]"
                          )}
                        >
                          <span>✨ Todos los servicios</span>
                          <span className={cn("text-xs font-black ml-1", data.servicios.length === 6 ? "text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]" : "text-zinc-400")}>
                            {data.servicios.length === 6 ? "✓" : "+"}
                          </span>
                        </button>

                        <MultiOptionChips
                          selectedValues={data.servicios}
                          onToggle={(val) => handleWordButtonClick("servicios", val)}
                          options={[
                            { label: "Agua potable", value: "agua" },
                            { label: "Luz eléctrica", value: "luz" },
                            { label: "Drenaje", value: "drenaje" },
                            { label: "Gas de red/tanque", value: "gas" },
                            { label: "Transporte público", value: "transporte" },
                            { label: "Internet", value: "internet" },
                          ]}
                        />
                      </div>
                    </div>

                    <div>
                      <SubLabel>Condición de la Calle de Acceso</SubLabel>
                      <OptionGrid
                        columns="grid-cols-3"
                        selectedValue={data.condicionCalle}
                        onChange={(val) => handleFieldChange("condicionCalle", val)}
                        options={[
                          { label: "Pavimentada", value: "pavimentada" },
                          { label: "Adoquinada", value: "adoquinada" },
                          { label: "Terracería", value: "terraceria" },
                        ]}
                      />
                    </div>

                    <div>
                      <SubLabel>Iluminación en la Vía Pública</SubLabel>
                      <OptionGrid
                        columns="grid-cols-3"
                        selectedValue={data.iluminacionCalle}
                        onChange={(val) => handleFieldChange("iluminacionCalle", val)}
                        options={[
                          { label: "Buena iluminación", value: "buena" },
                          { label: "Mala iluminación", value: "mala" },
                          { label: "Sin iluminación", value: "sin iluminación" },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              )}

              {microStep === 1 && (
                /* PASO 1: Higiene de la Vivienda y Zoonosis */
                <div key="step-1" className="space-y-6">
                  <Heading>Higiene de la vivienda y convivencia con mascotas</Heading>

                  <div className="space-y-5">
                    <div>
                      <SubLabel>Convivencia con Mascotas (Zoonosis)</SubLabel>
                      <OptionGrid
                        columns="grid-cols-3"
                        selectedValue={data.mascotas}
                        onChange={(val) => handleFieldChange("mascotas", val)}
                        options={[
                          { label: "Dentro de casa", value: "dentro", subtitle: "Mascotas en interior" },
                          { label: "En el patio", value: "patio", subtitle: "Mascotas en exterior" },
                          { label: "No hay mascotas", value: "no", subtitle: "Zoonosis negativa" },
                        ]}
                      />
                    </div>

                    <div>
                      <SubLabel>Frecuencia de Limpieza del Hogar</SubLabel>
                      <OptionGrid
                        columns="grid-cols-2 sm:grid-cols-4"
                        selectedValue={data.frecuenciaLimpieza}
                        onChange={(val) => handleFieldChange("frecuenciaLimpieza", val)}
                        options={[
                          { label: "Diaria", value: "diaria" },
                          { label: "Interdiaria", value: "interdiaria" },
                          { label: "Semanal", value: "semanal" },
                          { label: "Quincenal", value: "quincenal" },
                        ]}
                      />
                    </div>

                    <div>
                      <SubLabel>Cambio de Ropa de Cama</SubLabel>
                      <OptionGrid
                        columns="grid-cols-2 sm:grid-cols-4"
                        selectedValue={data.cambioRopaCama}
                        onChange={(val) => handleFieldChange("cambioRopaCama", val)}
                        options={[
                          { label: "Diario", value: "diario" },
                          { label: "Interdiario", value: "interdiario" },
                          { label: "Semanal", value: "semanal" },
                          { label: "Quincenal", value: "quincenal" },
                        ]}
                      />
                    </div>

                    <div>
                      <SubLabel>Manejo de Residuos</SubLabel>
                      <OptionGrid
                        columns="grid-cols-2 sm:grid-cols-4"
                        selectedValue={data.manejoResiduos}
                        onChange={(val) => handleFieldChange("manejoResiduos", val)}
                        options={[
                          { label: "Recolección municipal", value: "recoleccion municipal" },
                          { label: "Quema", value: "quema" },
                          { label: "Entierro", value: "entierro" },
                          { label: "Otro", value: "otro" },
                        ]}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <SubLabel>Hacinamiento</SubLabel>
                        <OptionGrid
                          columns="grid-cols-2"
                          selectedValue={data.hacinamiento}
                          onChange={(val) => handleFieldChange("hacinamiento", val)}
                          options={[
                            { label: "Sí", value: "si" },
                            { label: "No", value: "no" },
                          ]}
                        />
                      </div>
                      <div>
                        <SubLabel>Promiscuidad</SubLabel>
                        <OptionGrid
                          columns="grid-cols-2"
                          selectedValue={data.promiscuidad}
                          onChange={(val) => handleFieldChange("promiscuidad", val)}
                          options={[
                            { label: "Sí", value: "si" },
                            { label: "No", value: "no" },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {microStep === 2 && (
                /* PASO 2: Higiene Personal y Hábitos Bucales */
                <div key="step-2" className="space-y-6">
                  <Heading>Higiene personal y hábitos de salud bucal</Heading>

                  <div className="space-y-5">
                    <div>
                      <SubLabel>Frecuencia de Cepillado Dental</SubLabel>
                      <OptionGrid
                        columns="grid-cols-2 sm:grid-cols-4"
                        selectedValue={data.frecuenciaCepillado}
                        onChange={(val) => handleFieldChange("frecuenciaCepillado", val)}
                        options={[
                          { label: "3 veces al día", value: "después de cada comida", subtitle: "Tras cada comida" },
                          { label: "2 veces al día", value: "dos veces al día" },
                          { label: "1 vez al día", value: "una vez al día" },
                          { label: "Ocasional", value: "ocasional" },
                        ]}
                      />
                    </div>

                    <div>
                      <SubLabel>Técnica de Cepillado Dental</SubLabel>
                      <OptionGrid
                        columns="grid-cols-2 sm:grid-cols-4"
                        selectedValue={data.tecnicaCepillado}
                        onChange={(val) => handleFieldChange("tecnicaCepillado", val)}
                        options={[
                          { label: "Bass", value: "bass" },
                          { label: "Circular", value: "circular" },
                          { label: "Vertical", value: "vertical" },
                          { label: "Horizontal", value: "horizontal" },
                        ]}
                      />
                    </div>

                    <div>
                      <SubLabel>Auxiliares de Higiene Bucal Utilizados</SubLabel>
                      <MultiOptionChips
                        selectedValues={data.auxiliaresBucales}
                        onToggle={(val) => handleWordButtonClick("auxiliaresBucales", val)}
                        options={[
                          { label: "Hilo dental", value: "hilo dental" },
                          { label: "Enjuague bucal", value: "enjuague bucal" },
                          { label: "Irrigador dental", value: "irrigador dental" },
                          { label: "No usa auxiliares", value: "no auxiliares" },
                        ]}
                      />
                    </div>

                    <div>
                      <SubLabel>Problemas Bucales Referidos por el Paciente</SubLabel>
                      <MultiOptionChips
                        selectedValues={data.problemasBucales}
                        onToggle={(val) => handleWordButtonClick("problemasBucales", val)}
                        options={[
                          { label: "Encías que sangran", value: "encías que sangran" },
                          { label: "Dientes con cavidades", value: "dientes con cavidades" },
                          { label: "Halitosis / Mal aliento", value: "halitosis" },
                          { label: "Dolor en dientes/encías", value: "dolor en dientes o encías" },
                          { label: "Sin problemas bucales", value: "sin problemas bucales" },
                        ]}
                      />
                    </div>

                    <div>
                      <SubLabel>Hábitos de Higiene de Manos</SubLabel>
                      <MultiOptionChips
                        selectedValues={data.lavadoManos}
                        onToggle={(val) => handleWordButtonClick("lavadoManos", val)}
                        options={[
                          { label: "Antes de cada comida", value: "antes de cada comida" },
                          { label: "Después de ir al baño", value: "después de ir al baño" },
                          { label: "Al manipular alimentos", value: "al manipular alimentos" },
                          { label: "Sin hábito regular", value: "sin hábito regular" },
                        ]}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <SubLabel>Última Visita al Odontólogo</SubLabel>
                        <OptionGrid
                          columns="grid-cols-1"
                          selectedValue={data.ultimaVisitaOdontologo}
                          onChange={(val) => handleFieldChange("ultimaVisitaOdontologo", val)}
                          options={[
                            { label: "< 6 meses", value: "menos de 6 meses" },
                            { label: "6 meses - 1 año", value: "entre 6 meses y 1 año" },
                            { label: "> 1 año", value: "más de 1 año" },
                            { label: "Nunca", value: "nunca" },
                          ]}
                        />
                      </div>
                      <div>
                        <SubLabel>Frecuencia de Baño Personal</SubLabel>
                        <OptionGrid
                          columns="grid-cols-1"
                          selectedValue={data.frecuenciaBano}
                          onChange={(val) => handleFieldChange("frecuenciaBano", val)}
                          options={[
                            { label: "Diaria", value: "diaria" },
                            { label: "Interdiaria", value: "interdiaria" },
                            { label: "Semanal", value: "semanal" },
                          ]}
                        />
                      </div>
                      <div>
                        <SubLabel>Frecuencia Cambio Ropa</SubLabel>
                        <OptionGrid
                          columns="grid-cols-1"
                          selectedValue={data.cambioRopa}
                          onChange={(val) => handleFieldChange("cambioRopa", val)}
                          options={[
                            { label: "Diaria", value: "diaria" },
                            { label: "Interdiaria", value: "interdiaria" },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {microStep === 3 && (
                /* PASO 3: Dieta, Alimentación y Nutrición */
                <div key="step-3" className="space-y-6">
                  <Heading>Hábitos alimenticios y nutrición</Heading>

                  <div className="space-y-5">
                    <div>
                      <SubLabel>Alimentos Consumidos Frecuentemente</SubLabel>
                      <MultiOptionChips
                        selectedValues={data.alimentosConsumidos}
                        onToggle={(val) => handleWordButtonClick("alimentosConsumidos", val)}
                        options={[
                          { label: "Frutas y verduras", value: "frutas y verduras" },
                          { label: "Carnes y proteínas", value: "carnes y proteínas" },
                          { label: "Alimentos procesados", value: "alimentos procesados" },
                          { label: "Dulces y azúcares (Cariogénicos)", value: "dulces y azúcares" },
                        ]}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <SubLabel>Frecuencia Frutas/Verduras</SubLabel>
                        <OptionGrid
                          columns="grid-cols-1"
                          selectedValue={data.frecuenciaFrutasVerduras}
                          onChange={(val) => handleFieldChange("frecuenciaFrutasVerduras", val)}
                          options={[
                            { label: "Diaria", value: "diaria" },
                            { label: "3-5 veces / sem", value: "3-5 veces por semana" },
                            { label: "1-2 veces / sem", value: "1-2 veces por semana" },
                            { label: "Rara vez", value: "rara vez" },
                          ]}
                        />
                      </div>

                      <div>
                        <SubLabel>Bebidas Azucaradas</SubLabel>
                        <OptionGrid
                          columns="grid-cols-1"
                          selectedValue={data.frecuenciaBebidasAzucaradas}
                          onChange={(val) => handleFieldChange("frecuenciaBebidasAzucaradas", val)}
                          options={[
                            { label: "Diaria", value: "diaria" },
                            { label: "3-5 veces / sem", value: "3-5 veces por semana" },
                            { label: "1-2 veces / sem", value: "1-2 veces por semana" },
                            { label: "Rara vez", value: "rara vez" },
                          ]}
                        />
                      </div>

                      <div>
                        <SubLabel>Comida Chatarra</SubLabel>
                        <OptionGrid
                          columns="grid-cols-1"
                          selectedValue={data.frecuenciaComidaChatarra}
                          onChange={(val) => handleFieldChange("frecuenciaComidaChatarra", val)}
                          options={[
                            { label: "Diaria", value: "diaria" },
                            { label: "3-5 veces / sem", value: "3-5 veces por semana" },
                            { label: "1-2 veces / sem", value: "1-2 veces por semana" },
                            { label: "Rara vez", value: "rara vez" },
                          ]}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <SubLabel>Consumo Diario de Agua</SubLabel>
                        <OptionGrid
                          columns="grid-cols-3"
                          selectedValue={data.consumoAgua}
                          onChange={(val) => handleFieldChange("consumoAgua", val)}
                          options={[
                            { label: "< 1 Litro", value: "menos de 1 litro" },
                            { label: "1 - 2 Litros", value: "1-2 litros" },
                            { label: "> 2 Litros", value: "más de 2 litros" },
                          ]}
                        />
                      </div>

                      <div>
                        <SubLabel>Número de Comidas al Día</SubLabel>
                        <OptionGrid
                          columns="grid-cols-4"
                          selectedValue={data.numeroComidas}
                          onChange={(val) => handleFieldChange("numeroComidas", val)}
                          options={[
                            { label: "1-2", value: "1-2" },
                            { label: "3", value: "3" },
                            { label: "4-5", value: "4-5" },
                            { label: "> 5", value: "más de 5" },
                          ]}
                        />
                      </div>
                    </div>

                    <div>
                      <SubLabel>Horarios Habituales de Alimentación</SubLabel>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 shadow-sm">
                          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Almuerzo
                          </label>
                          <TimePickerDentaxy
                            value={data.horarioComidas.desayuno}
                            onChange={(val) => handleFieldChange("horarioComidas", { ...data.horarioComidas, desayuno: val })}
                          />
                        </div>

                        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 shadow-sm">
                          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Comida
                          </label>
                          <TimePickerDentaxy
                            value={data.horarioComidas.almuerzo}
                            onChange={(val) => handleFieldChange("horarioComidas", { ...data.horarioComidas, almuerzo: val })}
                          />
                        </div>

                        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 shadow-sm">
                          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Cena
                          </label>
                          <TimePickerDentaxy
                            value={data.horarioComidas.cena}
                            onChange={(val) => handleFieldChange("horarioComidas", { ...data.horarioComidas, cena: val })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AntecedentesPersonalesNoPatologicos;
