import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldAlert, Calendar as CalendarIcon } from "lucide-react";
import { FormDataState } from "../types/historiaClinica";
import OtraCondicionInput from "@/components/ui/OtraCondicionInput";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface AntecedentesHemorragicosProps {
  formData: FormDataState;
  handleAntecedenteHemorragicoChange: (field: string, value: any) => void;
  onRedaccionGenerada?: (content: string) => void;
  onToggleViewMode?: () => void;
}

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

const AntecedentesHemorragicos: React.FC<AntecedentesHemorragicosProps> = ({
  formData,
  handleAntecedenteHemorragicoChange,
  onRedaccionGenerada,
}) => {
  const data = formData.antecedentesHemorragicos || {};

  const handleBooleanChange = (field: string, value: boolean) => {
    handleAntecedenteHemorragicoChange(field, value);
  };

  const handleTextChange = (field: string, value: string) => {
    handleAntecedenteHemorragicoChange(field, value);
  };

  const hasAnyPositive =
    data.transfusionPrevia === true ||
    data.sangradoProlongado === true ||
    data.hematomas === true ||
    data.hemorragiasEspontaneas === true ||
    data.coagulopatia === true;

  const handleSinHemorragicosToggle = (sinHemorragicos: boolean) => {
    handleAntecedenteHemorragicoChange("sinHemorragicos", sinHemorragicos);
    if (sinHemorragicos) {
      handleAntecedenteHemorragicoChange("transfusionPrevia", false);
      handleAntecedenteHemorragicoChange("motivoTransfusion", "");
      handleAntecedenteHemorragicoChange("fechaTransfusion", "");
      handleAntecedenteHemorragicoChange("sangradoProlongado", false);
      handleAntecedenteHemorragicoChange("especificacionSangradoProlongado", "");
      handleAntecedenteHemorragicoChange("hematomas", false);
      handleAntecedenteHemorragicoChange("especificacionHematomas", "");
      handleAntecedenteHemorragicoChange("hemorragiasEspontaneas", false);
      handleAntecedenteHemorragicoChange("especificacionHemorragiasEspontaneas", "");
      handleAntecedenteHemorragicoChange("coagulopatia", false);
      handleAntecedenteHemorragicoChange("especificacionCoagulopatia", "");
    }
  };

  // Motor de Redacción Determinista con Formato de Tabla Médica Estructurada
  const generarTextoRedaccion = () => {
    let htmlContent = "";

    const isNegativeReport = data.sinHemorragicos === true || (!hasAnyPositive && data.sinHemorragicos !== false);

    if (isNegativeReport) {
      htmlContent += `
        <div class="my-3.5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            🟢 SIN ANTECEDENTES HEMORRÁGICOS REPORTADOS (REPORTE NEGATIVO)
          </span>
        </div>
        <p class="text-base leading-relaxed text-zinc-900 dark:text-zinc-100 mb-4">
          El paciente niega antecedentes de sangrado prolongado, hematomas espontáneos, hemorragias de mucosas, transfusiones sanguíneas o diátesis hemorrágicas.
        </p>
      `;
    } else {
      htmlContent += `
        <div class="my-3.5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border-2 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
          <span class="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 block mb-1 flex items-center gap-1.5">
            🚨 ALERTA MÉDICA: ANTECEDENTES HEMORRÁGICOS CONFIRMADOS
          </span>
        </div>

        <div class="my-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 overflow-hidden shadow-sm bg-white dark:bg-zinc-900/60">
          <table class="w-full text-left border-collapse text-base">
            <thead>
              <tr class="bg-zinc-100/90 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-300 font-extrabold text-xs uppercase tracking-wider border-b-2 border-zinc-200 dark:border-zinc-700">
                <th class="py-3.5 px-4 border-r border-zinc-200 dark:border-zinc-700/60 w-2/5">Antecedente Evaluado</th>
                <th class="py-3.5 px-4 border-r border-zinc-200 dark:border-zinc-700/60 w-1/5">Estatus</th>
                <th class="py-3.5 px-4">Detalles / Registro Clínico</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
              <!-- 1. Transfusiones Sanguíneas -->
              <tr class="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                <td class="py-3.5 px-4 border-r border-zinc-100 dark:border-zinc-800/80 align-top font-bold text-zinc-900 dark:text-zinc-100">
                  Transfusiones Sanguíneas
                </td>
                <td class="py-3.5 px-4 border-r border-zinc-100 dark:border-zinc-800/80 align-top">
                  ${
                    data.transfusionPrevia === true
                      ? `<span class="font-bold text-rose-600 dark:text-rose-400">SÍ</span>`
                      : `<span class="font-medium text-zinc-500">NO</span>`
                  }
                </td>
                <td class="py-3.5 px-4 align-top font-medium text-zinc-800 dark:text-zinc-200">
                  ${
                    data.transfusionPrevia === true
                      ? `Refiere transfusión. ${data.motivoTransfusion ? `<b>Motivo:</b> ${data.motivoTransfusion}. ` : ""}${data.fechaTransfusion ? `<b>Fecha:</b> ${data.fechaTransfusion}.` : ""}`
                      : `Niega antecedentes de transfusiones sanguíneas o hemoderivados.`
                  }
                </td>
              </tr>

              <!-- 2. Sangrado Prolongado -->
              <tr class="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                <td class="py-3.5 px-4 border-r border-zinc-100 dark:border-zinc-800/80 align-top font-bold text-zinc-900 dark:text-zinc-100">
                  Sangrado Prolongado
                </td>
                <td class="py-3.5 px-4 border-r border-zinc-100 dark:border-zinc-800/80 align-top">
                  ${
                    data.sangradoProlongado === true
                      ? `<span class="font-bold text-rose-600 dark:text-rose-400">SÍ</span>`
                      : `<span class="font-medium text-zinc-500">NO</span>`
                  }
                </td>
                <td class="py-3.5 px-4 align-top font-medium text-zinc-800 dark:text-zinc-200">
                  ${
                    data.sangradoProlongado === true
                      ? `<span class="text-rose-600 dark:text-rose-400 font-semibold">Refiere sangrado prolongado. ${data.especificacionSangradoProlongado ? `<b>Detalles:</b> ${data.especificacionSangradoProlongado}` : "(Riesgo hemostático en procedimientos)"}</span>`
                      : `Niega episodios de sangrado prolongado.`
                  }
                </td>
              </tr>

              <!-- 3. Hematomas Espontáneos -->
              <tr class="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                <td class="py-3.5 px-4 border-r border-zinc-100 dark:border-zinc-800/80 align-top font-bold text-zinc-900 dark:text-zinc-100">
                  Hematomas Espontáneos
                </td>
                <td class="py-3.5 px-4 border-r border-zinc-100 dark:border-zinc-800/80 align-top">
                  ${
                    data.hematomas === true
                      ? `<span class="font-bold text-rose-600 dark:text-rose-400">SÍ</span>`
                      : `<span class="font-medium text-zinc-500">NO</span>`
                  }
                </td>
                <td class="py-3.5 px-4 align-top font-medium text-zinc-800 dark:text-zinc-200">
                  ${
                    data.hematomas === true
                      ? `<span class="text-rose-600 dark:text-rose-400 font-semibold">Presenta hematomas/moratones. ${data.especificacionHematomas ? `<b>Detalles:</b> ${data.especificacionHematomas}` : "(Tendencia equimótica espontánea)"}</span>`
                      : `Niega tendencia a hematomas espontáneos.`
                  }
                </td>
              </tr>

              <!-- 4. Hemorragias Espontáneas -->
              <tr class="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                <td class="py-3.5 px-4 border-r border-zinc-100 dark:border-zinc-800/80 align-top font-bold text-zinc-900 dark:text-zinc-100">
                  Hemorragias de Mucosas
                </td>
                <td class="py-3.5 px-4 border-r border-zinc-100 dark:border-zinc-800/80 align-top">
                  ${
                    data.hemorragiasEspontaneas === true
                      ? `<span class="font-bold text-rose-600 dark:text-rose-400">SÍ</span>`
                      : `<span class="font-medium text-zinc-500">NO</span>`
                  }
                </td>
                <td class="py-3.5 px-4 align-top font-medium text-zinc-800 dark:text-zinc-200">
                  ${
                    data.hemorragiasEspontaneas === true
                      ? `<span class="text-rose-600 dark:text-rose-400 font-semibold">Presenta sangrado de mucosas. ${data.especificacionHemorragiasEspontaneas ? `<b>Detalles:</b> ${data.especificacionHemorragiasEspontaneas}` : "(Epistaxis, gingivorragia)"}</span>`
                      : `Niega hemorragias espontáneas de mucosas.`
                  }
                </td>
              </tr>

              <!-- 5. Coagulopatía Diagnosticada -->
              <tr class="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                <td class="py-3.5 px-4 border-r border-zinc-100 dark:border-zinc-800/80 align-top font-bold text-zinc-900 dark:text-zinc-100">
                  Coagulopatía / Diátesis
                </td>
                <td class="py-3.5 px-4 border-r border-zinc-100 dark:border-zinc-800/80 align-top">
                  ${
                    data.coagulopatia === true
                      ? `<span class="font-bold text-rose-600 dark:text-rose-400">SÍ</span>`
                      : `<span class="font-medium text-zinc-500">NO</span>`
                  }
                </td>
                <td class="py-3.5 px-4 align-top font-medium text-zinc-800 dark:text-zinc-200">
                  ${
                    data.coagulopatia === true
                      ? `<span class="text-rose-600 dark:text-rose-400 font-bold">Diagnóstico de Coagulopatía: ${data.especificacionCoagulopatia || "[No especificada]"}. (Requiere protocolo especial hemostático).</span>`
                      : `Niega diagnóstico de coagulopatía o trastorno hematológico.`
                  }
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }

    if (data.detallesAdicionales) {
      htmlContent += `<p class="text-base leading-relaxed text-zinc-900 dark:text-zinc-100 mt-3 mb-3"><b>Información Adicional:</b> ${data.detallesAdicionales}</p>`;
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
  }, [data]);

  return (
    <div className="relative w-full max-w-2xl mx-auto pb-4 pt-0">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full space-y-6"
      >
        <Heading>Antecedentes Hemorrágicos</Heading>

        {/* Tarjeta Principal NO PRESENTA / SÍ PRESENTA */}
        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-5 rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 shadow-[6px_6px_16px_rgba(0,0,0,0.06),-6px_-6px_16px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_16px_rgba(0,0,0,0.4)]">
          <SubLabel>¿Presenta algún antecedente o problema de hemorragia / sangrado?</SubLabel>
          
          <div className="grid grid-cols-2 gap-3 mt-3">
            {/* Botón NO PRESENTA */}
            <button
              type="button"
              onClick={() => handleSinHemorragicosToggle(true)}
              className={cn(
                glassBtnBase,
                "py-4 px-4 text-center flex flex-col items-center justify-center gap-1",
                data.sinHemorragicos !== false && !hasAnyPositive ? glassBtnActive : glassBtnInactive
              )}
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={cn("w-4 h-4", data.sinHemorragicos !== false && !hasAnyPositive ? "text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]" : "text-zinc-500")} />
                <span className="text-sm font-extrabold">NO PRESENTA</span>
                {data.sinHemorragicos !== false && !hasAnyPositive && (
                  <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>
                )}
              </div>
              <span className="text-[10px] font-medium opacity-80 text-zinc-500 dark:text-zinc-400">
                Sin problemas de sangrado
              </span>
            </button>

            {/* Botón SÍ PRESENTA */}
            <button
              type="button"
              onClick={() => handleSinHemorragicosToggle(false)}
              className={cn(
                glassBtnBase,
                "py-4 px-4 text-center flex flex-col items-center justify-center gap-1",
                hasAnyPositive || data.sinHemorragicos === false ? glassBtnActive : glassBtnInactive
              )}
            >
              <div className="flex items-center gap-1.5">
                <ShieldAlert className={cn("w-4 h-4", hasAnyPositive || data.sinHemorragicos === false ? "text-amber-500" : "text-zinc-500")} />
                <span className="text-sm font-extrabold">SÍ PRESENTA</span>
                {(hasAnyPositive || data.sinHemorragicos === false) && (
                  <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>
                )}
              </div>
              <span className="text-[10px] font-medium opacity-80 text-zinc-500 dark:text-zinc-400">
                Registrar sangrados / coagulopatías
              </span>
            </button>
          </div>
        </div>

        {/* CUESTIONARIO COMPLETO EN LA MISMA PANTALLA */}
        {(hasAnyPositive || data.sinHemorragicos === false) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-5"
          >
            {/* 1. TRANSFUSIONES SANGUÍNEAS */}
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-5 rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <SubLabel>Transfusiones — ¿Le han transfundido sangre o algún derivado de la misma?</SubLabel>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleBooleanChange("transfusionPrevia", true)}
                  className={cn(
                    glassBtnBase,
                    "py-3.5 px-4 text-center flex items-center justify-center gap-2",
                    data.transfusionPrevia === true ? glassBtnActive : glassBtnInactive
                  )}
                >
                  <span className="text-sm font-extrabold">Sí, le han transfundido</span>
                  {data.transfusionPrevia === true && (
                    <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleBooleanChange("transfusionPrevia", false)}
                  className={cn(
                    glassBtnBase,
                    "py-3.5 px-4 text-center flex items-center justify-center gap-2",
                    data.transfusionPrevia === false ? glassBtnActive : glassBtnInactive
                  )}
                >
                  <span className="text-sm font-extrabold">No, nunca</span>
                  {data.transfusionPrevia === false && (
                    <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>
                  )}
                </button>
              </div>

              {data.transfusionPrevia === true && (
                <div className="space-y-4 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <div>
                    <SubLabel>Motivo de la transfusión:</SubLabel>
                    <OtraCondicionInput
                      placeholder="Especifique la causa clínica (anemia grave, cirugía previa, accidente, etc.)..."
                      value={data.motivoTransfusion || ""}
                      onChange={(e) => handleTextChange("motivoTransfusion", e.target.value)}
                      className="w-full text-sm sm:text-base font-semibold"
                    />
                  </div>

                  <div>
                    <SubLabel>Fecha aproximada:</SubLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            glassBtnBase,
                            "w-full justify-start text-left font-semibold h-14 px-4 bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100",
                            !data.fechaTransfusion && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2.5 h-4 w-4 text-[#00f5a0]" />
                          {data.fechaTransfusion ? (
                            format(new Date(data.fechaTransfusion), "PPP", { locale: es })
                          ) : (
                            <span>Seleccione o especifique la fecha...</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={data.fechaTransfusion ? new Date(data.fechaTransfusion) : undefined}
                          onSelect={(date) => handleTextChange("fechaTransfusion", date ? date.toISOString() : "")}
                          initialFocus
                          locale={es}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </div>

            {/* 2. SANGRADO PROLONGADO */}
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-5 rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <SubLabel>Sangrado prolongado — ¿Presenta episodios de sangrado prolongado ante heridas o cortadas?</SubLabel>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleBooleanChange("sangradoProlongado", true)}
                  className={cn(
                    glassBtnBase,
                    "py-3.5 px-4 text-center flex items-center justify-center gap-2",
                    data.sangradoProlongado === true ? glassBtnActive : glassBtnInactive
                  )}
                >
                  <span className="text-sm font-extrabold">Sí, sangrado prolongado</span>
                  {data.sangradoProlongado === true && (
                    <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleBooleanChange("sangradoProlongado", false)}
                  className={cn(
                    glassBtnBase,
                    "py-3.5 px-4 text-center flex items-center justify-center gap-2",
                    data.sangradoProlongado === false ? glassBtnActive : glassBtnInactive
                  )}
                >
                  <span className="text-sm font-extrabold">No, normal</span>
                  {data.sangradoProlongado === false && (
                    <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>
                  )}
                </button>
              </div>

              {data.sangradoProlongado === true && (
                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <SubLabel>Especificación del sangrado prolongado:</SubLabel>
                  <OtraCondicionInput
                    placeholder="Describa procedimientos o heridas donde presentó sangrado prolongado (ej: extracción dental previa, cortadas accidentales)..."
                    value={data.especificacionSangradoProlongado || ""}
                    onChange={(e) => handleTextChange("especificacionSangradoProlongado", e.target.value)}
                    className="w-full text-sm sm:text-base font-semibold"
                  />
                </div>
              )}
            </div>

            {/* 3. HEMATOMAS ESPONTÁNEOS */}
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-5 rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <SubLabel>Hematomas espontáneos — ¿Tiene tendencia a desarrollar moratones/hematomas sin causa aparente?</SubLabel>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleBooleanChange("hematomas", true)}
                  className={cn(
                    glassBtnBase,
                    "py-3.5 px-4 text-center flex items-center justify-center gap-2",
                    data.hematomas === true ? glassBtnActive : glassBtnInactive
                  )}
                >
                  <span className="text-sm font-extrabold">Sí, hematomas fáciles</span>
                  {data.hematomas === true && (
                    <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleBooleanChange("hematomas", false)}
                  className={cn(
                    glassBtnBase,
                    "py-3.5 px-4 text-center flex items-center justify-center gap-2",
                    data.hematomas === false ? glassBtnActive : glassBtnInactive
                  )}
                >
                  <span className="text-sm font-extrabold">No, ninguno</span>
                  {data.hematomas === false && (
                    <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>
                  )}
                </button>
              </div>

              {data.hematomas === true && (
                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <SubLabel>Especificación de los hematomas / moratones:</SubLabel>
                  <OtraCondicionInput
                    placeholder="Describa localización habitual, frecuencia o si ocurren espontáneamente..."
                    value={data.especificacionHematomas || ""}
                    onChange={(e) => handleTextChange("especificacionHematomas", e.target.value)}
                    className="w-full text-sm sm:text-base font-semibold"
                  />
                </div>
              )}
            </div>

            {/* 4. HEMORRAGIAS ESPONTÁNEAS */}
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-5 rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <SubLabel>Hemorragias espontáneas — ¿Ha experimentado sangrados de nariz o encías sin motivo aparente?</SubLabel>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleBooleanChange("hemorragiasEspontaneas", true)}
                  className={cn(
                    glassBtnBase,
                    "py-3.5 px-4 text-center flex items-center justify-center gap-2",
                    data.hemorragiasEspontaneas === true ? glassBtnActive : glassBtnInactive
                  )}
                >
                  <span className="text-sm font-extrabold">Sí, hemorragias</span>
                  {data.hemorragiasEspontaneas === true && (
                    <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleBooleanChange("hemorragiasEspontaneas", false)}
                  className={cn(
                    glassBtnBase,
                    "py-3.5 px-4 text-center flex items-center justify-center gap-2",
                    data.hemorragiasEspontaneas === false ? glassBtnActive : glassBtnInactive
                  )}
                >
                  <span className="text-sm font-extrabold">No, ninguna</span>
                  {data.hemorragiasEspontaneas === false && (
                    <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>
                  )}
                </button>
              </div>

              {data.hemorragiasEspontaneas === true && (
                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <SubLabel>Especificación de las hemorragias espontáneas:</SubLabel>
                  <OtraCondicionInput
                    placeholder="Describa la zona del sangrado (sangrado de nariz/epistaxis, sangrado de encías/gingivorragia)..."
                    value={data.especificacionHemorragiasEspontaneas || ""}
                    onChange={(e) => handleTextChange("especificacionHemorragiasEspontaneas", e.target.value)}
                    className="w-full text-sm sm:text-base font-semibold"
                  />
                </div>
              )}
            </div>

            {/* 5. COAGULOPATÍA DIAGNOSTICADA */}
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-5 rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <SubLabel>Coagulopatía diagnosticada — ¿Tiene diagnóstico de algún trastorno de la coagulación?</SubLabel>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleBooleanChange("coagulopatia", true)}
                  className={cn(
                    glassBtnBase,
                    "py-3.5 px-4 text-center flex items-center justify-center gap-2",
                    data.coagulopatia === true ? glassBtnActive : glassBtnInactive
                  )}
                >
                  <span className="text-sm font-extrabold">Sí, diagnosticada</span>
                  {data.coagulopatia === true && (
                    <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleBooleanChange("coagulopatia", false)}
                  className={cn(
                    glassBtnBase,
                    "py-3.5 px-4 text-center flex items-center justify-center gap-2",
                    data.coagulopatia === false ? glassBtnActive : glassBtnInactive
                  )}
                >
                  <span className="text-sm font-extrabold">No, ninguno</span>
                  {data.coagulopatia === false && (
                    <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>
                  )}
                </button>
              </div>

              {data.coagulopatia === true && (
                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <SubLabel>Especificación del trastorno de coagulación:</SubLabel>
                  <OtraCondicionInput
                    placeholder="Especifique trastorno (Hemofilia A/B, Enfermedad de von Willebrand, Trombocitopenia, etc.)..."
                    value={data.especificacionCoagulopatia || ""}
                    onChange={(e) => handleTextChange("especificacionCoagulopatia", e.target.value)}
                    className="w-full text-sm sm:text-base font-semibold"
                  />
                </div>
              )}
            </div>

            {/* 6. DETALLES ADICIONALES */}
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-5 rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
              <SubLabel>Información adicional sobre antecedentes hemorrágicos</SubLabel>
              <OtraCondicionInput
                placeholder="Especifique cualquier otro detalle clínico relevante sobre sangrados o coagulación..."
                value={data.detallesAdicionales || ""}
                onChange={(e) => handleTextChange("detallesAdicionales", e.target.value)}
                className="w-full text-sm sm:text-base font-semibold"
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AntecedentesHemorragicos;
