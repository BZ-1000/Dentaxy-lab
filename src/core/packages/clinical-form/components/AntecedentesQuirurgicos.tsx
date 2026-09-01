import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShieldAlert, Plus, Trash2, Pill } from "lucide-react";
import { FormDataState } from "../types/historiaClinica";
import OtraCondicionInput from "@/components/ui/OtraCondicionInput";
import { cn } from "@/lib/utils";

interface AntecedentesQuirurgicosProps {
  formData: FormDataState;
  handleAntecedenteQuirurgicoChange: (field: string, value: any) => void;
  onRedaccionGenerada?: (content: string) => void;
  onToggleViewMode?: () => void;
  onSectionComplete?: () => void;
  microStep?: number;
  onMicroStepChange?: (step: number) => void;
  onTotalMicroStepsChange?: (total: number, names: string[]) => void;
}

const stepsDefinitions = [
  { id: 0, nombre: "Intervenciones Quirúrgicas y Cirugías" },
  { id: 1, nombre: "Tratamiento Médico y Hospitalizaciones" },
  { id: 2, nombre: "Medicación Actual en Uso" },
];

const medicamentosSugeridos = [
  "Antibióticos (Amoxicilina, Clindamicina)",
  "Analgésicos / Antiinflamatorios (Ibuprofeno, Ketorolaco)",
  "Anticoagulantes / Antiagregantes (Aspirina, Warfarina)",
  "Antihipertensivos (Losartán, Captopril)",
  "Hipoglucemiantes (Metformina, Insulina)",
  "Ansiolíticos / Sedantes (Diazepam, Clonazepam)",
  "Corticoides (Dexametasona, Prednisona)",
  "Protectores Gástricos (Omeprazol)",
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

// Componentes UI Neomórficos
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

const AntecedentesQuirurgicos: React.FC<AntecedentesQuirurgicosProps> = ({
  formData,
  handleAntecedenteQuirurgicoChange,
  onRedaccionGenerada,
  microStep = 0,
  onTotalMicroStepsChange,
}) => {
  const [dir, setDir] = useState(1);
  const data = formData.antecedentesQuirurgicos || {};

  useEffect(() => {
    if (onTotalMicroStepsChange) {
      onTotalMicroStepsChange(stepsDefinitions.length, stepsDefinitions.map((s) => s.nombre));
    }
  }, []);

  const handleBooleanChange = (field: string, value: boolean) => {
    handleAntecedenteQuirurgicoChange(field, value);
  };

  const handleTextChange = (field: string, value: string) => {
    handleAntecedenteQuirurgicoChange(field, value);
  };

  const handleTogglePillMedication = (field: string, medName: string) => {
    const currentValue = (data as any)[field] || "";
    if (currentValue.includes(medName)) {
      const updated = currentValue
        .split(",")
        .map((s: string) => s.trim())
        .filter((s: string) => s !== medName)
        .join(", ");
      handleAntecedenteQuirurgicoChange(field, updated);
    } else {
      const updated = currentValue ? `${currentValue}, ${medName}` : medName;
      handleAntecedenteQuirurgicoChange(field, updated);
    }
  };

  const handleSinQuirurgicosToggle = (sinQuirurgicos: boolean) => {
    handleAntecedenteQuirurgicoChange("sinQuirurgicos", sinQuirurgicos);
    if (sinQuirurgicos) {
      handleAntecedenteQuirurgicoChange("cirugiasRealizadas", []);
    } else {
      if (!data.cirugiasRealizadas || data.cirugiasRealizadas.length === 0) {
        handleAntecedenteQuirurgicoChange("cirugiasRealizadas", [
          { tipo: "", fecha: "", motivo: "" },
        ]);
      }
    }
  };

  const handleAddCirugia = () => {
    const list = data.cirugiasRealizadas || [];
    handleAntecedenteQuirurgicoChange("cirugiasRealizadas", [
      ...list,
      { tipo: "", fecha: "", motivo: "" },
    ]);
  };

  const handleUpdateCirugia = (index: number, field: string, value: string) => {
    const list = [...(data.cirugiasRealizadas || [])];
    if (list[index]) {
      list[index] = { ...list[index], [field]: value };
      handleAntecedenteQuirurgicoChange("cirugiasRealizadas", list);
    }
  };

  const handleRemoveCirugia = (index: number) => {
    const list = [...(data.cirugiasRealizadas || [])];
    list.splice(index, 1);
    handleAntecedenteQuirurgicoChange("cirugiasRealizadas", list);
    if (list.length === 0) {
      handleAntecedenteQuirurgicoChange("sinQuirurgicos", true);
    }
  };

  const hasSurgeries = data.sinQuirurgicos === false || (data.cirugiasRealizadas && data.cirugiasRealizadas.length > 0);

  // Generación determinista con formato de Tablas Médicas Elegantes Amplias (3 microPasos)
  const generarTextoRedaccion = () => {
    const formatTitle = (title: string) => `<span class="block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mt-6 mb-2.5">${title}</span>`;

    let htmlContent = "";

    // 1. Alerta Médica de Cirugías / Antecedentes Quirúrgicos (Paso 0)
    const cirugias = data.cirugiasRealizadas || [];
    const tieneCirugiasValidas = !data.sinQuirurgicos && cirugias.length > 0;

    if (tieneCirugiasValidas) {
      htmlContent += `
        <div class="my-3.5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border-2 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
          <span class="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 block mb-1 flex items-center gap-1.5">
            🚨 ALERTA MÉDICA: ANTECEDENTE QUIRÚRGICO CONFIRMADO
          </span>
        </div>
        
        <div class="my-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 overflow-hidden shadow-sm bg-white dark:bg-zinc-900/60">
          <table class="w-full text-left border-collapse text-base">
            <thead>
              <tr class="bg-zinc-100/90 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-300 font-extrabold text-xs uppercase tracking-wider border-b-2 border-zinc-200 dark:border-zinc-700">
                <th class="py-3.5 px-4 border-r border-zinc-200 dark:border-zinc-700/60">Intervención Quirúrgica</th>
                <th class="py-3.5 px-4 border-r border-zinc-200 dark:border-zinc-700/60">Fecha / Antigüedad</th>
                <th class="py-3.5 px-4">Motivo / Diagnóstico</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
              ${cirugias
                .map(
                  (c) => `
                <tr class="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                  <td class="py-4 px-4 border-r border-zinc-100 dark:border-zinc-800/80 align-top">
                    <span class="inline-block px-3 py-1 rounded-full font-bold text-base bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                      ${c.tipo || "[No especificada]"}
                    </span>
                  </td>
                  <td class="py-4 px-4 font-bold text-zinc-900 dark:text-zinc-100 border-r border-zinc-100 dark:border-zinc-800/80 align-top">${c.fecha || "[No especificada]"}</td>
                  <td class="py-4 px-4 font-medium text-zinc-800 dark:text-zinc-200 align-top">${c.motivo || "[No especificado]"}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `;
    } else {
      htmlContent += `
        <div class="my-3.5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            🟢 SIN ANTECEDENTES QUIRÚRGICOS REPORTADOS (REPORTE NEGATIVO)
          </span>
        </div>
        <p class="text-base leading-relaxed text-zinc-900 dark:text-zinc-100 mb-4">
          El paciente niega intervenciones quirúrgicas o cirugías previas.
        </p>
      `;
    }

    // 2. Tabla de Tratamiento Médico y Hospitalización Reciente (Paso 1)
    if (microStep >= 1) {
      htmlContent += `${formatTitle("Tratamiento Médico y Hospitalización Reciente (Últimos 2 Meses)")}`;

      if (data.tratamientoReciente === true) {
        htmlContent += `
          <div class="my-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 overflow-hidden shadow-sm bg-white dark:bg-zinc-900/60">
            <table class="w-full text-left border-collapse text-base">
              <thead>
                <tr class="bg-zinc-100/90 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-300 font-extrabold text-xs uppercase tracking-wider border-b-2 border-zinc-200 dark:border-zinc-700">
                  <th class="py-3.5 px-4 border-r border-zinc-200 dark:border-zinc-700/60 w-1/4">Estatus Clínico</th>
                  <th class="py-3.5 px-4 border-r border-zinc-200 dark:border-zinc-700/60 w-1/3">Diagnóstico / Motivo</th>
                  <th class="py-3.5 px-4">Fármacos / Medicamentos Recetados</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="py-4 px-4 border-r border-zinc-100 dark:border-zinc-800/80 align-top">
                    <span class="font-bold text-base text-rose-600 dark:text-rose-400 block mt-0.5">
                      En Tratamiento
                    </span>
                  </td>
                  <td class="py-4 px-4 font-bold text-zinc-900 dark:text-zinc-100 border-r border-zinc-100 dark:border-zinc-800/80 align-top">${data.motivoTratamiento || "[No especificado]"}</td>
                  <td class="py-4 px-4 font-medium text-zinc-800 dark:text-zinc-200 align-top">
                    ${data.medicamentosTratamientoReciente || "[Sin fármacos especificados]"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        `;
      } else if (data.tratamientoReciente === false) {
        htmlContent += `<p class="text-base leading-relaxed text-zinc-900 dark:text-zinc-100 mb-3">Niega tratamientos médicos en los últimos dos meses.</p>`;
      }

      if (data.hospitalizacionReciente === true) {
        let hospDetails = `Hospitalizado en los últimos dos meses${data.motivoHospitalizacion ? `: ${data.motivoHospitalizacion}` : ""}.`;
        if (data.complicacionHospitalizacionReciente === true) {
          hospDetails += ` <span class="text-rose-600 dark:text-rose-400 font-bold">⚠️ Complicación en hospitalización: ${data.especificacionComplicacionHospitalizacion || "[No especificada]"}</span>`;
        } else if (data.complicacionHospitalizacionReciente === false) {
          hospDetails += ` Sin complicaciones reportadas durante la hospitalización.`;
        }
        htmlContent += `<p class="text-base leading-relaxed text-rose-600 dark:text-rose-400 font-bold mb-3">${hospDetails}</p>`;
      } else if (data.hospitalizacionReciente === false) {
        htmlContent += `<p class="text-base leading-relaxed text-zinc-900 dark:text-zinc-100 mb-3">Niega hospitalizaciones en los últimos dos meses.</p>`;
      }

      if (data.hospitalizacionesPrevias) {
        htmlContent += `<p class="text-base leading-relaxed text-zinc-900 dark:text-zinc-100 mb-3"><b>Hospitalizaciones Previas:</b> ${data.hospitalizacionesPrevias}</p>`;
      }
    }

    // 3. Tabla de Medicación Actual en Uso (Paso 2)
    if (microStep >= 2) {
      htmlContent += `${formatTitle("Medicación Actual en Uso")}`;
      if (data.tomaMedicamentos === true) {
        htmlContent += `
          <div class="my-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 overflow-hidden shadow-sm bg-white dark:bg-zinc-900/60">
            <table class="w-full text-left border-collapse text-base">
              <thead>
                <tr class="bg-zinc-100/90 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-300 font-extrabold text-xs uppercase tracking-wider border-b-2 border-zinc-200 dark:border-zinc-700">
                  <th class="py-3.5 px-4 border-r border-zinc-200 dark:border-zinc-700/60 w-1/4">Estatus</th>
                  <th class="py-3.5 px-4 border-r border-zinc-200 dark:border-zinc-700/60 w-1/3">Medicamentos Activos</th>
                  <th class="py-3.5 px-4">Diagnóstico / Justificación Médica</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="py-4 px-4 border-r border-zinc-100 dark:border-zinc-800/80 align-top">
                    <span class="font-bold text-base text-rose-600 dark:text-rose-400 block mt-0.5">
                      Consumo Activo
                    </span>
                  </td>
                  <td class="py-4 px-4 font-bold text-zinc-900 dark:text-zinc-100 border-r border-zinc-100 dark:border-zinc-800/80 align-top">${data.cualesMedicamentos || "[No especificado]"}</td>
                  <td class="py-4 px-4 font-medium text-zinc-800 dark:text-zinc-200 align-top">${data.motivoMedicamentos || "[No especificado]"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        `;
      } else if (data.tomaMedicamentos === false) {
        htmlContent += `<p class="text-base leading-relaxed text-zinc-900 dark:text-zinc-100">El paciente niega el consumo de medicamentos en la actualidad.</p>`;
      } else {
        htmlContent += `<p class="text-base leading-relaxed text-zinc-900 dark:text-zinc-100">Sin especificar consumo actual de medicamentos.</p>`;
      }
    }

    return htmlContent.trim();
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

  return (
    <div className="relative w-full max-w-2xl mx-auto pb-4 pt-0">
      <div className="relative bg-transparent p-1 sm:p-2 flex flex-col justify-between">
        
        {/* Micro Step Indicator Minimalista (3 Pasos) */}
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
                /* PASO 0: Intervenciones Quirúrgicas y Cirugías */
                <div key="step-0" className="space-y-6">
                  <Heading>Antecedentes Quirúrgicos</Heading>

                  <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-5 rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 shadow-[6px_6px_16px_rgba(0,0,0,0.06),-6px_-6px_16px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_16px_rgba(0,0,0,0.4)]">
                    <SubLabel>¿Ha sido sometido(a) a alguna intervención quirúrgica o cirugía previamente?</SubLabel>
                    
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {/* Botón NO PRESENTA */}
                      <button
                        type="button"
                        onClick={() => handleSinQuirurgicosToggle(true)}
                        className={cn(
                          glassBtnBase,
                          "py-4 px-4 text-center flex flex-col items-center justify-center gap-1",
                          data.sinQuirurgicos !== false ? glassBtnActive : glassBtnInactive
                        )}
                      >
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className={cn("w-4 h-4", data.sinQuirurgicos !== false ? "text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]" : "text-zinc-500")} />
                          <span className="text-sm font-extrabold">NO PRESENTA</span>
                          {data.sinQuirurgicos !== false && <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>}
                        </div>
                        <span className="text-[10px] font-medium opacity-80 text-zinc-500 dark:text-zinc-400">
                          Sin cirugías previas
                        </span>
                      </button>

                      {/* Botón SÍ PRESENTA */}
                      <button
                        type="button"
                        onClick={() => handleSinQuirurgicosToggle(false)}
                        className={cn(
                          glassBtnBase,
                          "py-4 px-4 text-center flex flex-col items-center justify-center gap-1",
                          hasSurgeries ? glassBtnActive : glassBtnInactive
                        )}
                      >
                        <div className="flex items-center gap-1.5">
                          <ShieldAlert className={cn("w-4 h-4", hasSurgeries ? "text-amber-500" : "text-zinc-500")} />
                          <span className="text-sm font-extrabold">SÍ PRESENTA</span>
                          {hasSurgeries && <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>}
                        </div>
                        <span className="text-[10px] font-medium opacity-80 text-zinc-500 dark:text-zinc-400">
                          Registrar cirugías
                        </span>
                      </button>
                    </div>

                    {/* DESPLIEGUE AUTOMÁTICO DE OPCIONES E INPUTS EN ESA MISMA PANTALLA SI SÍ PRESENTA ES SELECCIONADO */}
                    {hasSurgeries && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-6 mt-5 border-t border-zinc-200 dark:border-zinc-800 space-y-6"
                      >
                        <div className="flex items-center justify-between">
                          <SubLabel>Detalles de Intervenciones Quirúrgicas</SubLabel>
                          <button
                            type="button"
                            onClick={handleAddCirugia}
                            className="text-xs font-extrabold text-[#00f5a0] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Agregar otra cirugía
                          </button>
                        </div>

                        {(data.cirugiasRealizadas || []).map((cirugia, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-4 relative"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                Cirugía #{idx + 1}
                              </span>
                              {data.cirugiasRealizadas.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCirugia(idx)}
                                  className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer"
                                  title="Eliminar cirugía"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                            <div>
                              <SubLabel>Procedimiento / Tipo de Cirugía</SubLabel>
                              <OtraCondicionInput
                                placeholder="Ej: Apendicectomía, Extracción de terceros molares, Colecistectomía..."
                                value={cirugia.tipo || ""}
                                onChange={(e) => handleUpdateCirugia(idx, "tipo", e.target.value)}
                                className="w-full text-sm sm:text-base font-semibold"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <SubLabel>Fecha / Antigüedad</SubLabel>
                                <OtraCondicionInput
                                  placeholder="Ej: Hace 2 años, Octubre 2022..."
                                  value={cirugia.fecha || ""}
                                  onChange={(e) => handleUpdateCirugia(idx, "fecha", e.target.value)}
                                  className="w-full text-sm sm:text-base font-semibold"
                                />
                              </div>
                              <div>
                                <SubLabel>Motivo / Diagnóstico</SubLabel>
                                <OtraCondicionInput
                                  placeholder="Ej: Apendicitis aguda, retención dental..."
                                  value={cirugia.motivo || ""}
                                  onChange={(e) => handleUpdateCirugia(idx, "motivo", e.target.value)}
                                  className="w-full text-sm sm:text-base font-semibold"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {microStep === 1 && (
                /* PASO 1: Tratamiento Médico y Hospitalizaciones */
                <div key="step-1" className="space-y-6">
                  <Heading>Tratamiento médico y hospitalización</Heading>

                  <div className="space-y-6">
                    {/* PREGUNTA 1: TRATAMIENTO MÉDICO RECIENTE */}
                    <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-5 rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                      <SubLabel>¿Ha estado sometido(a) a algún tratamiento médico en los últimos dos meses?</SubLabel>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => handleBooleanChange("tratamientoReciente", true)}
                          className={cn(
                            glassBtnBase,
                            "py-3.5 px-4 text-center flex items-center justify-center gap-2",
                            data.tratamientoReciente === true ? glassBtnActive : glassBtnInactive
                          )}
                        >
                          <span className="text-sm font-extrabold">Sí, en tratamiento</span>
                          {data.tratamientoReciente === true && <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleBooleanChange("tratamientoReciente", false)}
                          className={cn(
                            glassBtnBase,
                            "py-3.5 px-4 text-center flex items-center justify-center gap-2",
                            data.tratamientoReciente === false ? glassBtnActive : glassBtnInactive
                          )}
                        >
                          <span className="text-sm font-extrabold">No, ninguno</span>
                          {data.tratamientoReciente === false && <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>}
                        </button>
                      </div>

                      {data.tratamientoReciente === true && (
                        <div className="space-y-4 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                          <div>
                            <SubLabel>Motivo / Causa del tratamiento médico:</SubLabel>
                            <OtraCondicionInput
                              placeholder="Especifique el diagnóstico y motivo del tratamiento..."
                              value={data.motivoTratamiento || ""}
                              onChange={(e) => handleTextChange("motivoTratamiento", e.target.value)}
                              className="w-full text-sm sm:text-base font-semibold"
                            />
                          </div>

                          <div>
                            <SubLabel>¿Qué medicamento(s) le fueron recetados para este tratamiento?</SubLabel>
                            
                            {/* Píldoras de Completado Rápido */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {medicamentosSugeridos.map((med) => {
                                const isSelected = (data.medicamentosTratamientoReciente || "").includes(med);
                                return (
                                  <button
                                    key={med}
                                    type="button"
                                    onClick={() => handleTogglePillMedication("medicamentosTratamientoReciente", med)}
                                    className={cn(
                                      glassBtnBase,
                                      "py-2 px-3 text-xs flex items-center gap-1.5 cursor-pointer",
                                      isSelected ? glassBtnActive : glassBtnInactive
                                    )}
                                  >
                                    <Pill className="w-3.5 h-3.5 text-blue-500" />
                                    <span>{med}</span>
                                    {isSelected && (
                                      <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">
                                        ✓
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            <OtraCondicionInput
                              placeholder="Liste los medicamentos o seleccione de las píldoras superiores (ej: Amoxicilina 500mg)..."
                              value={data.medicamentosTratamientoReciente || ""}
                              onChange={(e) => handleTextChange("medicamentosTratamientoReciente", e.target.value)}
                              className="w-full text-sm sm:text-base font-semibold"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* PREGUNTA 2: HOSPITALIZACIÓN RECIENTE Y COMPLICACIONES INLINE */}
                    <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-5 rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                      <SubLabel>¿Ha sido hospitalizado(a) en los últimos dos meses?</SubLabel>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => handleBooleanChange("hospitalizacionReciente", true)}
                          className={cn(
                            glassBtnBase,
                            "py-3.5 px-4 text-center flex items-center justify-center gap-2",
                            data.hospitalizacionReciente === true ? glassBtnActive : glassBtnInactive
                          )}
                        >
                          <span className="text-sm font-extrabold">Sí, hospitalizado(a)</span>
                          {data.hospitalizacionReciente === true && <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleBooleanChange("hospitalizacionReciente", false)}
                          className={cn(
                            glassBtnBase,
                            "py-3.5 px-4 text-center flex items-center justify-center gap-2",
                            data.hospitalizacionReciente === false ? glassBtnActive : glassBtnInactive
                          )}
                        >
                          <span className="text-sm font-extrabold">No, nunca</span>
                          {data.hospitalizacionReciente === false && <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>}
                        </button>
                      </div>

                      {data.hospitalizacionReciente === true && (
                        <div className="space-y-4 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                          <div>
                            <SubLabel>Motivo de la hospitalización:</SubLabel>
                            <OtraCondicionInput
                              placeholder="Especifique causa de hospitalización y días de estancia..."
                              value={data.motivoHospitalizacion || ""}
                              onChange={(e) => handleTextChange("motivoHospitalizacion", e.target.value)}
                              className="w-full text-sm sm:text-base font-semibold"
                            />
                          </div>

                          <div>
                            <SubLabel>¿Tuvo alguna complicación durante o después de la hospitalización?</SubLabel>
                            <div className="grid grid-cols-2 gap-3 mt-2">
                              <button
                                type="button"
                                onClick={() => handleBooleanChange("complicacionHospitalizacionReciente", true)}
                                className={cn(
                                  glassBtnBase,
                                  "py-3 px-4 text-center flex items-center justify-center gap-2",
                                  data.complicacionHospitalizacionReciente === true ? glassBtnActive : glassBtnInactive
                                )}
                              >
                                <span className="text-xs sm:text-sm font-extrabold">Sí, tuvo complicación</span>
                                {data.complicacionHospitalizacionReciente === true && (
                                  <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleBooleanChange("complicacionHospitalizacionReciente", false)}
                                className={cn(
                                  glassBtnBase,
                                  "py-3 px-4 text-center flex items-center justify-center gap-2",
                                  data.complicacionHospitalizacionReciente === false ? glassBtnActive : glassBtnInactive
                                )}
                              >
                                <span className="text-xs sm:text-sm font-extrabold">No, ninguna</span>
                                {data.complicacionHospitalizacionReciente === false && (
                                  <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>
                                )}
                              </button>
                            </div>

                            {data.complicacionHospitalizacionReciente === true && (
                              <div className="mt-3">
                                <SubLabel>Especificación de la complicación:</SubLabel>
                                <OtraCondicionInput
                                  placeholder="Describa la complicación sufrida durante o después de la hospitalización (infección, sangrado, etc.)..."
                                  value={data.especificacionComplicacionHospitalizacion || ""}
                                  onChange={(e) => handleTextChange("especificacionComplicacionHospitalizacion", e.target.value)}
                                  className="w-full text-sm sm:text-base font-semibold"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* PREGUNTA 3: HOSPITALIZACIONES PREVIAS */}
                    <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-5 rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
                      <SubLabel>Hospitalizaciones previas (anteriores a los últimos dos meses)</SubLabel>
                      <OtraCondicionInput
                        placeholder="Especifique motivos, causas y fechas de hospitalizaciones previas en su historial médico..."
                        value={data.hospitalizacionesPrevias || ""}
                        onChange={(e) => handleTextChange("hospitalizacionesPrevias", e.target.value)}
                        className="w-full text-sm sm:text-base font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {microStep === 2 && (
                /* PASO 2: Medicación Actual en Uso */
                <div key="step-2" className="space-y-6">
                  <Heading>Medicación actual en uso</Heading>

                  <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-5 rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 shadow-sm space-y-5">
                    <SubLabel>¿Está tomando actualmente algún medicamento?</SubLabel>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleBooleanChange("tomaMedicamentos", true)}
                        className={cn(
                          glassBtnBase,
                          "py-3.5 px-4 text-center flex items-center justify-center gap-2",
                          data.tomaMedicamentos === true ? glassBtnActive : glassBtnInactive
                        )}
                      >
                        <span className="text-sm font-extrabold">Sí, toma medicamentos</span>
                        {data.tomaMedicamentos === true && <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleBooleanChange("tomaMedicamentos", false)}
                        className={cn(
                          glassBtnBase,
                          "py-3.5 px-4 text-center flex items-center justify-center gap-2",
                          data.tomaMedicamentos === false ? glassBtnActive : glassBtnInactive
                        )}
                      >
                        <span className="text-sm font-extrabold">No, ninguno</span>
                        {data.tomaMedicamentos === false && <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>}
                      </button>
                    </div>

                    {data.tomaMedicamentos === true && (
                      <div className="space-y-4 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                        <div>
                          <SubLabel>¿Cuál o cuáles medicamentos toma actualmente?</SubLabel>
                          
                          {/* Píldoras de Completado Rápido */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {medicamentosSugeridos.map((med) => {
                              const isSelected = (data.cualesMedicamentos || "").includes(med);
                              return (
                                <button
                                  key={med}
                                  type="button"
                                  onClick={() => handleTogglePillMedication("cualesMedicamentos", med)}
                                  className={cn(
                                    glassBtnBase,
                                    "py-2 px-3 text-xs flex items-center gap-1.5 cursor-pointer",
                                    isSelected ? glassBtnActive : glassBtnInactive
                                  )}
                                >
                                  <Pill className="w-3.5 h-3.5 text-blue-500" />
                                  <span>{med}</span>
                                  {isSelected && (
                                    <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">
                                      ✓
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          <OtraCondicionInput
                            placeholder="Liste los medicamentos o seleccione de las píldoras superiores (ej: Losartán 50mg, Metformina 850mg)..."
                            value={data.cualesMedicamentos || ""}
                            onChange={(e) => handleTextChange("cualesMedicamentos", e.target.value)}
                            className="w-full text-sm sm:text-base font-semibold"
                          />
                        </div>

                        <div>
                          <SubLabel>Motivo por el cual toma estos medicamentos:</SubLabel>
                          <OtraCondicionInput
                            placeholder="Explique el diagnóstico médico que justifica su tratamiento..."
                            value={data.motivoMedicamentos || ""}
                            onChange={(e) => handleTextChange("motivoMedicamentos", e.target.value)}
                            className="w-full text-sm sm:text-base font-semibold"
                          />
                        </div>
                      </div>
                    )}
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

export default AntecedentesQuirurgicos;
