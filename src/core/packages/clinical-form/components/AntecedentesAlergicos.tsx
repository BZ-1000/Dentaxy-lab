import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import { FormDataState } from "../types/historiaClinica";
import OtraCondicionInput from "@/components/ui/OtraCondicionInput";
import { cn } from "@/lib/utils";

interface AntecedentesAlergicosProps {
  formData: FormDataState;
  handleAntecedenteAlergicoChange: (field: string, value: any) => void;
  onRedaccionGenerada?: (content: string) => void;
  onToggleViewMode?: () => void;
  onSectionComplete?: () => void;
  microStep?: number;
  onMicroStepChange?: (step: number) => void;
  onTotalMicroStepsChange?: (total: number, names: string[]) => void;
}

const stepsDefinitions = [
  { id: 0, nombre: "Reacción Alérgica" },
  { id: 1, nombre: "Anestesia Local y General" },
  { id: 2, nombre: "Adicciones y Hábitos" },
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

const AntecedentesAlergicos: React.FC<AntecedentesAlergicosProps> = ({
  formData,
  handleAntecedenteAlergicoChange,
  onRedaccionGenerada,
  microStep = 0,
  onTotalMicroStepsChange,
}) => {
  const [dir, setDir] = useState(1);
  const data = formData.antecedentesAlergicos || {};

  useEffect(() => {
    if (onTotalMicroStepsChange) {
      onTotalMicroStepsChange(stepsDefinitions.length, stepsDefinitions.map((s) => s.nombre));
    }
  }, []);

  const handleBooleanChange = (field: string, value: boolean) => {
    handleAntecedenteAlergicoChange(field, value);
  };

  const handleTextChange = (field: string, value: string) => {
    handleAntecedenteAlergicoChange(field, value);
  };

  const handleCategoryToggle = (catKey: "medicamentos" | "alimentos" | "ambiente") => {
    const currentVal = data.tiposAlergias?.[catKey] || false;
    handleAntecedenteAlergicoChange(`tiposAlergias.${catKey}`, !currentVal);
  };

  const handleSinAlergiasToggle = (sinAlergias: boolean) => {
    if (sinAlergias) {
      handleAntecedenteAlergicoChange("tiposAlergias.medicamentos", false);
      handleAntecedenteAlergicoChange("tiposAlergias.alimentos", false);
      handleAntecedenteAlergicoChange("tiposAlergias.ambiente", false);
      handleAntecedenteAlergicoChange("cualesAlergias", "");
      handleAntecedenteAlergicoChange("especificacionAlergias", "");
    } else {
      handleAntecedenteAlergicoChange("tiposAlergias.medicamentos", true);
    }
  };

  // Generación determinista con píldora de alerta médica restaurada a tamaño original (text-xs) y texto redactado en text-base
  const generarTextoRedaccion = () => {
    const formatTitle = (title: string) => `<span class="block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mt-6 mb-2.5">${title}</span>`;

    let htmlContent = "";

    // 1. Alerta Médica de Alergias
    const tiposActivos: string[] = [];
    if (data.tiposAlergias?.medicamentos) tiposActivos.push("Medicamentos");
    if (data.tiposAlergias?.alimentos) tiposActivos.push("Alimentos");
    if (data.tiposAlergias?.ambiente) tiposActivos.push("Entorno Ambiental");

    if (tiposActivos.length > 0) {
      htmlContent += `
        <div class="my-3.5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border-2 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
          <span class="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 block mb-1 flex items-center gap-1.5">
            🚨 ALERTA MÉDICA: PACIENTE ALÉRGICO CONFIRMADO
          </span>
        </div>
        
        <div class="my-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 overflow-hidden shadow-sm bg-white dark:bg-zinc-900/60">
          <table class="w-full text-left border-collapse text-base">
            <thead>
              <tr class="bg-zinc-100/90 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-300 font-extrabold text-xs uppercase tracking-wider border-b-2 border-zinc-200 dark:border-zinc-700">
                <th class="py-3.5 px-4 border-r border-zinc-200 dark:border-zinc-700/60 w-1/4">Categoría</th>
                <th class="py-3.5 px-4 border-r border-zinc-200 dark:border-zinc-700/60 w-1/3">Alérgenos Específicos</th>
                <th class="py-3.5 px-4">Manifestación Clínica</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="py-4 px-4 font-bold text-zinc-900 dark:text-zinc-100 border-r border-zinc-100 dark:border-zinc-800/80 align-top">${tiposActivos.join(", ")}</td>
                <td class="py-4 px-4 border-r border-zinc-100 dark:border-zinc-800/80 align-top">
                  <span class="inline-block px-3 py-1 rounded-full font-bold text-base bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                    ${data.cualesAlergias || "[No especificado]"}
                  </span>
                </td>
                <td class="py-4 px-4 font-medium text-zinc-800 dark:text-zinc-200 align-top">${data.especificacionAlergias || "[No especificado]"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    } else {
      htmlContent += `
        <div class="my-3.5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            🟢 SIN ALERGIAS CONOCIDAS (REPORTE NEGATIVO)
          </span>
        </div>
        <p class="text-base leading-relaxed text-zinc-900 dark:text-zinc-100 mb-4">
          El paciente niega antecedentes alérgicos a medicamentos, alimentos o factores del entorno ambiental.
        </p>
      `;
    }

    // 2. Anestesia Local y General
    if (microStep >= 1) {
      htmlContent += `${formatTitle("Anestesia Local y General")}`;
      let anestesiaText = "";
      if (data.administradoAnestesia === true) {
        anestesiaText += `Se le ha administrado anestesia previamente${data.tipoAnestesia ? `: <b>${data.tipoAnestesia}</b>` : ""}. `;
        if (data.reaccionAnestesia === true) {
          anestesiaText += `<span class="text-rose-600 dark:text-rose-400 font-bold">⚠️ Presentó reacción adversa a la anestesia${data.especificacionReaccionAnestesia ? `: ${data.especificacionReaccionAnestesia}` : ""}.</span> `;
        } else if (data.reaccionAnestesia === false) {
          anestesiaText += `Sin reacciones adversas a la anestesia reportadas. `;
        }
      } else if (data.administradoAnestesia === false) {
        anestesiaText += `Niega administración previa de anestesia. `;
      }

      htmlContent += `<p class="text-base leading-relaxed text-zinc-900 dark:text-zinc-100 mb-4">${anestesiaText.trim()}</p>`;
    }

    // 3. Adicciones y Hábitos
    if (microStep >= 2) {
      htmlContent += `${formatTitle("Adicciones y Hábitos Nocivos")}`;
      const habitos: string[] = [];
      if (data.habitosAdicciones?.fumador) habitos.push("Tabaquismo");
      if (data.habitosAdicciones?.alcoholismo) habitos.push("Alcoholismo");
      if (data.habitosAdicciones?.drogas) habitos.push("Sustancias nocivas / Drogas");

      if (habitos.length > 0) {
        htmlContent += `<p class="text-base leading-relaxed text-zinc-900 dark:text-zinc-100 mb-2"><b>Hábitos reportados:</b> ${habitos.join(", ")}.</p>`;
        if (data.especificacionHabitos) {
          htmlContent += `<p class="text-base leading-relaxed text-zinc-900 dark:text-zinc-100 mb-4"><b>Detalles de frecuencia/consumo:</b> ${data.especificacionHabitos}</p>`;
        }
      } else {
        htmlContent += `<p class="text-base leading-relaxed text-zinc-900 dark:text-zinc-100 mb-4">El paciente niega consumo de tabaco, alcohol o sustancias nocivas (hábitos negativos).</p>`;
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

  const hasAnyAllergy =
    data.tiposAlergias?.medicamentos ||
    data.tiposAlergias?.alimentos ||
    data.tiposAlergias?.ambiente;

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
                /* PASO 0: Reacción Alérgica */
                <div key="step-0" className="space-y-6">
                  <Heading>Antecedentes Alérgicos</Heading>

                  <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-5 rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 shadow-[6px_6px_16px_rgba(0,0,0,0.06),-6px_-6px_16px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_16px_rgba(0,0,0,0.4)]">
                    <SubLabel>¿Presenta alguna reacción alérgica conocida?</SubLabel>
                    
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {/* Botón NO PRESENTA */}
                      <button
                        type="button"
                        onClick={() => handleSinAlergiasToggle(true)}
                        className={cn(
                          glassBtnBase,
                          "py-4 px-4 text-center flex flex-col items-center justify-center gap-1",
                          !hasAnyAllergy ? glassBtnActive : glassBtnInactive
                        )}
                      >
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className={cn("w-4 h-4", !hasAnyAllergy ? "text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]" : "text-zinc-500")} />
                          <span className="text-sm font-extrabold">NO PRESENTA</span>
                          {!hasAnyAllergy && <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>}
                        </div>
                        <span className="text-[10px] font-medium opacity-80 text-zinc-500 dark:text-zinc-400">
                          Sin alergias conocidas
                        </span>
                      </button>

                      {/* Botón SÍ PRESENTA */}
                      <button
                        type="button"
                        onClick={() => handleSinAlergiasToggle(false)}
                        className={cn(
                          glassBtnBase,
                          "py-4 px-4 text-center flex flex-col items-center justify-center gap-1",
                          hasAnyAllergy ? glassBtnActive : glassBtnInactive
                        )}
                      >
                        <div className="flex items-center gap-1.5">
                          <ShieldAlert className={cn("w-4 h-4", hasAnyAllergy ? "text-amber-500" : "text-zinc-500")} />
                          <span className="text-sm font-extrabold">SÍ PRESENTA</span>
                          {hasAnyAllergy && <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>}
                        </div>
                        <span className="text-[10px] font-medium opacity-80 text-zinc-500 dark:text-zinc-400">
                          Seleccionar tipos
                        </span>
                      </button>
                    </div>

                    {/* DESPLIEGUE AUTOMÁTICO DE OPCIONES E INPUTS EN ESA MISMA PANTALLA SI SÍ PRESENTA ES SELECCIONADO */}
                    {hasAnyAllergy && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-6 mt-5 border-t border-zinc-200 dark:border-zinc-800 space-y-6"
                      >
                        <div>
                          <SubLabel>Seleccione los tipos de alergias:</SubLabel>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2">
                            <button
                              type="button"
                              onClick={() => handleCategoryToggle("medicamentos")}
                              className={cn(
                                glassBtnBase,
                                "py-3 px-3 text-xs flex items-center justify-between",
                                data.tiposAlergias?.medicamentos ? glassBtnActive : glassBtnInactive
                              )}
                            >
                              <span>Medicamentos</span>
                              {data.tiposAlergias?.medicamentos && (
                                <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">
                                  ✓
                                </span>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCategoryToggle("alimentos")}
                              className={cn(
                                glassBtnBase,
                                "py-3 px-3 text-xs flex items-center justify-between",
                                data.tiposAlergias?.alimentos ? glassBtnActive : glassBtnInactive
                              )}
                            >
                              <span>Alimentos</span>
                              {data.tiposAlergias?.alimentos && (
                                <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">
                                  ✓
                                </span>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCategoryToggle("ambiente")}
                              className={cn(
                                glassBtnBase,
                                "py-3 px-3 text-xs flex items-center justify-between",
                                data.tiposAlergias?.ambiente ? glassBtnActive : glassBtnInactive
                              )}
                            >
                              <span>Entorno ambiental</span>
                              {data.tiposAlergias?.ambiente && (
                                <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">
                                  ✓
                                </span>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <SubLabel>¿A cuáles es alérgico(a)?</SubLabel>
                            <OtraCondicionInput
                              placeholder="Ej: Penicilina, Amoxicilina, Marisco, Polvo, Látex..."
                              value={data.cualesAlergias || ""}
                              onChange={(e) => handleTextChange("cualesAlergias", e.target.value)}
                              className="w-full text-sm sm:text-base font-semibold"
                            />
                          </div>

                          <div>
                            <SubLabel>¿Cómo se manifiesta la reacción alérgica?</SubLabel>
                            <OtraCondicionInput
                              placeholder="Ej: Erupción cutánea, urticaria, hinchazón de labios, dificultad para respirar..."
                              value={data.especificacionAlergias || ""}
                              onChange={(e) => handleTextChange("especificacionAlergias", e.target.value)}
                              className="w-full text-sm sm:text-base font-semibold"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {microStep === 1 && (
                /* PASO 1: Anestesia Local y General */
                <div key="step-1" className="space-y-6">
                  <Heading>Anestesia local y general</Heading>

                  <div className="space-y-6">
                    <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-5 rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                      <SubLabel>¿Se le ha administrado anestesia previamente?</SubLabel>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => handleBooleanChange("administradoAnestesia", true)}
                          className={cn(
                            glassBtnBase,
                            "py-3.5 px-4 text-center flex items-center justify-center gap-2",
                            data.administradoAnestesia === true ? glassBtnActive : glassBtnInactive
                          )}
                        >
                          <span className="text-sm font-extrabold">Sí, administrada</span>
                          {data.administradoAnestesia === true && <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleBooleanChange("administradoAnestesia", false)}
                          className={cn(
                            glassBtnBase,
                            "py-3.5 px-4 text-center flex items-center justify-center gap-2",
                            data.administradoAnestesia === false ? glassBtnActive : glassBtnInactive
                          )}
                        >
                          <span className="text-sm font-extrabold">No, nunca</span>
                          {data.administradoAnestesia === false && <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>}
                        </button>
                      </div>

                      {data.administradoAnestesia === true && (
                        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
                          <SubLabel>Tipo de anestesia recibida:</SubLabel>
                          <OtraCondicionInput
                            placeholder="Ej: Anestesia dental local (lidocaína), anestesia general..."
                            value={data.tipoAnestesia || ""}
                            onChange={(e) => handleTextChange("tipoAnestesia", e.target.value)}
                            className="w-full text-sm sm:text-base font-semibold"
                          />
                        </div>
                      )}
                    </div>

                    <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-5 rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                      <SubLabel>¿Ha tenido alguna reacción adversa a la anestesia?</SubLabel>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => handleBooleanChange("reaccionAnestesia", true)}
                          className={cn(
                            glassBtnBase,
                            "py-3.5 px-4 text-center flex items-center justify-center gap-2",
                            data.reaccionAnestesia === true ? glassBtnActive : glassBtnInactive
                          )}
                        >
                          <span className="text-sm font-extrabold">Sí, presentó reacción</span>
                          {data.reaccionAnestesia === true && <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleBooleanChange("reaccionAnestesia", false)}
                          className={cn(
                            glassBtnBase,
                            "py-3.5 px-4 text-center flex items-center justify-center gap-2",
                            data.reaccionAnestesia === false ? glassBtnActive : glassBtnInactive
                          )}
                        >
                          <span className="text-sm font-extrabold">No, ninguna</span>
                          {data.reaccionAnestesia === false && <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>}
                        </button>
                      </div>

                      {data.reaccionAnestesia === true && (
                        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
                          <SubLabel>Especificación de la reacción:</SubLabel>
                          <OtraCondicionInput
                            placeholder="Describa mareos, palpitaciones, hipotensión, choque anafiláctico..."
                            value={data.especificacionReaccionAnestesia || ""}
                            onChange={(e) => handleTextChange("especificacionReaccionAnestesia", e.target.value)}
                            className="w-full text-sm sm:text-base font-semibold"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {microStep === 2 && (
                /* PASO 2: Adicciones y Hábitos Nocivos */
                <div key="step-2" className="space-y-6">
                  <Heading>Adicciones y hábitos</Heading>

                  <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-5 rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 shadow-sm space-y-5">
                    <SubLabel>Seleccione si consume o practica alguno de los siguientes:</SubLabel>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleAntecedenteAlergicoChange(
                            "habitosAdicciones.fumador",
                            !data.habitosAdicciones?.fumador
                          )
                        }
                        className={cn(
                          glassBtnBase,
                          "py-3.5 px-4 text-center flex items-center justify-between",
                          data.habitosAdicciones?.fumador ? glassBtnActive : glassBtnInactive
                        )}
                      >
                        <span className="text-sm font-extrabold">Fumador / Tabaco</span>
                        {data.habitosAdicciones?.fumador && (
                          <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">
                            ✓
                          </span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleAntecedenteAlergicoChange(
                            "habitosAdicciones.alcoholismo",
                            !data.habitosAdicciones?.alcoholismo
                          )
                        }
                        className={cn(
                          glassBtnBase,
                          "py-3.5 px-4 text-center flex items-center justify-between",
                          data.habitosAdicciones?.alcoholismo ? glassBtnActive : glassBtnInactive
                        )}
                      >
                        <span className="text-sm font-extrabold">Alcoholismo</span>
                        {data.habitosAdicciones?.alcoholismo && (
                          <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">
                            ✓
                          </span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleAntecedenteAlergicoChange(
                            "habitosAdicciones.drogas",
                            !data.habitosAdicciones?.drogas
                          )
                        }
                        className={cn(
                          glassBtnBase,
                          "py-3.5 px-4 text-center flex items-center justify-between",
                          data.habitosAdicciones?.drogas ? glassBtnActive : glassBtnInactive
                        )}
                      >
                        <span className="text-sm font-extrabold">Otras sustancias</span>
                        {data.habitosAdicciones?.drogas && (
                          <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">
                            ✓
                          </span>
                        )}
                      </button>
                    </div>

                    <div>
                      <SubLabel>Frecuencia / Detalles de consumo:</SubLabel>
                      <OtraCondicionInput
                        placeholder="Ej: Fuma 5 cigarrillos al día desde hace 3 años, consumo social de alcohol..."
                        value={data.especificacionHabitos || ""}
                        onChange={(e) => handleTextChange("especificacionHabitos", e.target.value)}
                        className="w-full text-sm sm:text-base font-semibold"
                      />
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

export default AntecedentesAlergicos;
