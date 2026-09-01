import React, { useRef, useEffect } from "react";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import { FormDataState } from "@/types/historiaClinica";
import OtraCondicionInput from "@/components/ui/OtraCondicionInput";
import { cn } from "@/lib/utils";

interface AntecedentesPersonalesPatologicosProps {
  formData: FormDataState;
  handleAntecedentePatologicoChange: (field: string, value: any) => void;
  onRedaccionGenerada?: (content: string) => void;
  onToggleViewMode?: () => void;
  onSectionComplete?: () => void;
  microStep?: number;
  onMicroStepChange?: (step: number) => void;
  onTotalMicroStepsChange?: (total: number, names: string[]) => void;
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

const AntecedentesPersonalesPatologicos: React.FC<AntecedentesPersonalesPatologicosProps> = ({
  formData,
  handleAntecedentePatologicoChange,
  onRedaccionGenerada,
  onTotalMicroStepsChange,
}) => {
  const patologicosData = formData.antecedentesPersonalesPatologicos || {};
  const sinPatologia = patologicosData.sinPatologia || false;

  const inputRefs = useRef<{ [key: string]: React.RefObject<HTMLTextAreaElement> }>({
    nutricionales: React.createRef<HTMLTextAreaElement>(),
    cardiacos: React.createRef<HTMLTextAreaElement>(),
    hepaticos: React.createRef<HTMLTextAreaElement>(),
    enfermedadesTransmisionSexual: React.createRef<HTMLTextAreaElement>(),
    enfermedadesEruptivas: React.createRef<HTMLTextAreaElement>(),
    pulmonares: React.createRef<HTMLTextAreaElement>(),
    infecciosasParasitarias: React.createRef<HTMLTextAreaElement>(),
    otrosPadecimientos: React.createRef<HTMLTextAreaElement>(),
  });

  // Mostrar todas las secciones de una en vista única (1 micro-paso)
  useEffect(() => {
    if (onTotalMicroStepsChange) {
      onTotalMicroStepsChange(1, ["Antecedentes Personales Patológicos"]);
    }
  }, []);

  const handleSinPatologiaToggle = (presionadoSinPatologia: boolean) => {
    handleAntecedentePatologicoChange("sinPatologia", presionadoSinPatologia);

    const categorias = [
      "nutricionales",
      "cardiacos",
      "hepaticos",
      "enfermedadesTransmisionSexual",
      "enfermedadesEruptivas",
      "pulmonares",
      "infecciosasParasitarias",
      "otrosPadecimientos",
    ];

    categorias.forEach((cat) => {
      handleAntecedentePatologicoChange(cat, { ninguna: true, otra: false, otraDescripcion: "" });
    });
  };

  const seleccionarOpcion = (categoria: string, opcion: string, valor: boolean) => {
    const categoriaActual = { ...(patologicosData[categoria] || {}) };

    if (opcion === "ninguna" && valor) {
      Object.keys(categoriaActual).forEach((key) => {
        if (key !== "ninguna" && key !== "otra" && key !== "otraDescripcion") {
          categoriaActual[key] = false;
        }
      });
      categoriaActual.ninguna = true;
      categoriaActual.otra = false;
      categoriaActual.otraDescripcion = "";
    } else if (opcion === "otra") {
      categoriaActual.otra = valor;
      if (!valor) categoriaActual.otraDescripcion = "";
      categoriaActual.ninguna = false;
    } else {
      categoriaActual[opcion] = valor;
      if (valor) {
        categoriaActual.ninguna = false;
      } else {
        const quedaAlguna = Object.entries(categoriaActual).some(
          ([k, v]) => k !== "ninguna" && k !== "otraDescripcion" && v === true
        );
        if (!quedaAlguna) {
          categoriaActual.ninguna = true;
        }
      }
    }

    handleAntecedentePatologicoChange(categoria, categoriaActual);
  };

  const handleOtraDescripcionChange = (categoria: string, valor: string) => {
    const categoriaActual = { ...(patologicosData[categoria] || {}) };
    categoriaActual.otra = true;
    categoriaActual.otraDescripcion = valor;
    categoriaActual.ninguna = false;
    handleAntecedentePatologicoChange(categoria, categoriaActual);
  };

  // Motor determinista robusto original de redacción médica
  const getTituloCategoria = (categoria: string) => {
    const titulos: { [key: string]: string } = {
      nutricionales: "Nutricionales",
      cardiacos: "Cardíacos",
      hepaticos: "Hepáticos",
      enfermedadesTransmisionSexual: "Enfermedades de Transmisión Sexual",
      enfermedadesEruptivas: "Enfermedades Eruptivas de la Infancia",
      pulmonares: "Pulmonares",
      infecciosasParasitarias: "Enfermedades Infecciosas y Parasitarias",
      otrosPadecimientos: "Otros Padecimientos Sistémicos",
    };
    return titulos[categoria] || categoria;
  };

  const getNombreOpcion = (opcion: string, categoria: string) => {
    const opciones: any = {
      nutricionales: { anorexia: "Anorexia", bulimia: "Bulimia", sobrepeso: "Sobrepeso", obesidad: "Obesidad" },
      cardiacos: { enfermedadCoronaria: "Enfermedad coronaria", arritmias: "Arritmias", defectosCardiacosCongenitos: "Defectos cardíacos congénitos" },
      hepaticos: { hepatitisA: "Hepatitis A", hepatitisB: "Hepatitis B", hepatitisC: "Hepatitis C", higadoGraso: "Hígado graso", cirrosis: "Cirrosis" },
      enfermedadesTransmisionSexual: { vih: "VIH/SIDA", sifilis: "Sífilis", gonorrea: "Gonorrea", herpesGenital: "Herpes genital", vph: "VPH" },
      enfermedadesEruptivas: { sarampion: "Sarampión", rubeola: "Rubéola", escarlatina: "Escarlatina", varicela: "Varicela", paperas: "Parotiditis (paperas)" },
      pulmonares: { neumonia: "Neumonía", bronquitis: "Bronquitis", asma: "Asma", epoc: "EPOC" },
      infecciosasParasitarias: { fiebreTifoidea: "Fiebre tifoidea", tuberculosis: "Tuberculosis", amibiasis: "Amibiasis", giardiasis: "Giardiasis", ascariasis: "Ascariasis" },
    };
    return opciones[categoria]?.[opcion] || opcion;
  };

  const generarRedaccionPorCategoria = (categoria: string) => {
    const categoriaData = patologicosData[categoria];
    if (!categoriaData && !sinPatologia) return "No hay datos disponibles.";

    const enfermedadesComunes: { [key: string]: string } = {
      nutricionales: "anorexia, bulimia, sobrepeso, obesidad",
      cardiacos: "enfermedad coronaria, arritmias, defectos cardíacos congénitos",
      hepaticos: "hepatitis A, B, C, hígado graso, cirrosis",
      enfermedadesTransmisionSexual: "VIH/SIDA, sífilis, gonorrea, herpes genital, VPH",
      enfermedadesEruptivas: "sarampión, rubéola, escarlatina, varicela, paperas",
      pulmonares: "neumonía, bronquitis, asma, EPOC",
      infecciosasParasitarias: "fiebre tifoidea, tuberculosis, amibiasis, giardiasis, ascariasis",
      otrosPadecimientos: "otras enfermedades sistémicas",
    };

    const prefijos: { [key: string]: string } = {
      nutricionales: "padecimientos nutricionales",
      cardiacos: "padecimientos cardíacos",
      hepaticos: "padecimientos hepáticos",
      enfermedadesTransmisionSexual: "enfermedades de transmisión sexual",
      enfermedadesEruptivas: "enfermedades eruptivas de la infancia",
      pulmonares: "padecimientos pulmonares",
      infecciosasParasitarias: "enfermedades infecciosas y parasitarias",
      otrosPadecimientos: "otros padecimientos sistémicos",
    };

    if (sinPatologia || !categoriaData || categoriaData.ninguna) {
      return `El paciente niega antecedentes de ${prefijos[categoria]} (se interrogó específicamente por ${enfermedadesComunes[categoria]}).`;
    }

    const opcionesSeleccionadas = Object.entries(categoriaData)
      .filter(([key, value]) => key !== "ninguna" && key !== "otra" && key !== "otraDescripcion" && value === true)
      .map(([key]) => getNombreOpcion(key, categoria).toLowerCase());

    const joinConY = (arr: string[]) => {
      if (arr.length === 0) return "";
      if (arr.length === 1) return arr[0];
      if (arr.length === 2) return `${arr[0]} y ${arr[1]}`;
      return `${arr.slice(0, -1).join(", ")} y ${arr[arr.length - 1]}`;
    };

    let redaccion = "";
    if (opcionesSeleccionadas.length > 0) {
      redaccion += `El paciente refiere presentar antecedentes de ${joinConY(opcionesSeleccionadas)}`;
    }

    if (categoriaData?.otra && categoriaData?.otraDescripcion) {
      if (redaccion) {
        redaccion += ` y ${categoriaData.otraDescripcion}`;
      } else {
        redaccion += `El paciente refiere presentar antecedentes de ${categoriaData.otraDescripcion}`;
      }
      redaccion += ` como padecimiento(s) ${getTituloCategoria(categoria).toLowerCase()}.`;
    } else if (redaccion) {
      redaccion += ` como padecimiento(s) ${getTituloCategoria(categoria).toLowerCase()}.`;
    }

    if (!redaccion) {
      return `El paciente niega antecedentes de ${prefijos[categoria]} (se interrogó específicamente por ${enfermedadesComunes[categoria]}).`;
    }

    return redaccion;
  };

  const generarTextoRedaccion = () => {
    const formatTitle = (title: string) => `<span class="block text-xs font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mt-4 mb-1">${title}</span>`;

    let fullText = "";
    const cats = [
      "nutricionales",
      "cardiacos",
      "hepaticos",
      "pulmonares",
      "infecciosasParasitarias",
      "enfermedadesEruptivas",
      "enfermedadesTransmisionSexual",
      "otrosPadecimientos",
    ];

    cats.forEach((cat) => {
      fullText += `${formatTitle(getTituloCategoria(cat))}${generarRedaccionPorCategoria(cat)}<br/>`;
    });

    return fullText.trim();
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
  }, [patologicosData, sinPatologia]);

  const renderCategoryGrid = (
    categoriaKey: string,
    titulo: string,
    opciones: { valor: string; etiqueta: string }[]
  ) => {
    const catData = patologicosData[categoriaKey] || {};
    const isNinguna = catData.ninguna !== false && !catData.otra && !opciones.some((opc) => catData[opc.valor] === true);

    return (
      <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-5 rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 shadow-[4px_4px_10px_rgba(0,0,0,0.04)] mb-5">
        <SubLabel>{titulo}</SubLabel>
        <div className="flex flex-wrap gap-2.5 mt-2">
          {/* Botón Ninguna por defecto */}
          <button
            type="button"
            onClick={() => seleccionarOpcion(categoriaKey, "ninguna", true)}
            className={cn(
              glassBtnBase,
              "py-2.5 px-4 text-xs flex items-center gap-1.5 cursor-pointer",
              isNinguna ? glassBtnActive : glassBtnInactive
            )}
          >
            <span>Ninguna</span>
            {isNinguna && (
              <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">
                ✓
              </span>
            )}
          </button>

          {opciones.map((opc) => {
            const isChecked = catData[opc.valor] === true;
            return (
              <button
                key={opc.valor}
                type="button"
                onClick={() => seleccionarOpcion(categoriaKey, opc.valor, !isChecked)}
                className={cn(
                  glassBtnBase,
                  "py-2.5 px-4 text-xs flex items-center gap-1.5 cursor-pointer",
                  isChecked ? glassBtnActive : glassBtnInactive
                )}
              >
                <span>{opc.etiqueta}</span>
                {isChecked && (
                  <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">
                    ✓
                  </span>
                )}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => seleccionarOpcion(categoriaKey, "otra", !catData.otra)}
            className={cn(
              glassBtnBase,
              "py-2.5 px-4 text-xs flex items-center gap-1.5 cursor-pointer",
              catData.otra ? glassBtnActive : glassBtnInactive
            )}
          >
            <span>Otra condición</span>
            {catData.otra && (
              <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">
                ✓
              </span>
            )}
          </button>
        </div>

        {catData.otra && (
          <div className="w-full mt-3.5 max-w-md">
            <OtraCondicionInput
              ref={inputRefs.current[categoriaKey] as React.RefObject<HTMLTextAreaElement>}
              placeholder="Especificar otra condición médica..."
              value={catData.otraDescripcion || ""}
              onChange={(e) => handleOtraDescripcionChange(categoriaKey, e.target.value)}
              className="w-full text-xs font-semibold tracking-wide"
              onBlur={() => {}}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto pb-4 pt-0">
      <div className="relative bg-transparent p-1 sm:p-2 flex flex-col justify-between">
        
        {/* PREGUNTA PRINCIPAL SÍ / NO */}
        <div className="space-y-6">
          <Heading>Antecedentes Personales Patológicos</Heading>

          <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-5 rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 shadow-[6px_6px_16px_rgba(0,0,0,0.06),-6px_-6px_16px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_16px_rgba(0,0,0,0.4)]">
            <SubLabel>¿El paciente presenta o ha presentado patologías o enfermedades sistémicas?</SubLabel>
            
            <div className="grid grid-cols-2 gap-3 mt-3">
              {/* Botón NO (Paciente Sano / Sin Patologías) */}
              <button
                type="button"
                onClick={() => handleSinPatologiaToggle(true)}
                className={cn(
                  glassBtnBase,
                  "py-4 px-4 text-center flex flex-col items-center justify-center gap-1",
                  sinPatologia ? glassBtnActive : glassBtnInactive
                )}
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className={cn("w-4 h-4", sinPatologia ? "text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]" : "text-zinc-500")} />
                  <span className="text-sm font-extrabold">NO PRESENTA</span>
                  {sinPatologia && <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>}
                </div>
                <span className="text-[10px] font-medium opacity-80 text-zinc-500 dark:text-zinc-400">
                  Paciente sano / Niega patologías
                </span>
              </button>

              {/* Botón SÍ (Presenta patologías) */}
              <button
                type="button"
                onClick={() => handleSinPatologiaToggle(false)}
                className={cn(
                  glassBtnBase,
                  "py-4 px-4 text-center flex flex-col items-center justify-center gap-1",
                  !sinPatologia ? glassBtnActive : glassBtnInactive
                )}
              >
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className={cn("w-4 h-4", !sinPatologia ? "text-amber-500" : "text-zinc-500")} />
                  <span className="text-sm font-extrabold">SÍ PRESENTA</span>
                  {!sinPatologia && <span className="text-xs font-black text-[#00f5a0] drop-shadow-[0_0_8px_rgba(0,245,160,0.9)]">✓</span>}
                </div>
                <span className="text-[10px] font-medium opacity-80 text-zinc-500 dark:text-zinc-400">
                  Registrar patologías sistémicas
                </span>
              </button>
            </div>
          </div>

          {/* MOSTRAR TODAS LAS SECCIONES DE UNA EN VISTA ÚNICA */}
          {!sinPatologia && (
            <div className="w-full space-y-4 pt-2">
              {renderCategoryGrid("nutricionales", "Padecimientos Nutricionales", [
                { valor: "anorexia", etiqueta: "Anorexia" },
                { valor: "bulimia", etiqueta: "Bulimia" },
                { valor: "sobrepeso", etiqueta: "Sobrepeso" },
                { valor: "obesidad", etiqueta: "Obesidad" },
              ])}

              {renderCategoryGrid("cardiacos", "Padecimientos Cardíacos", [
                { valor: "enfermedadCoronaria", etiqueta: "Enfermedad coronaria" },
                { valor: "arritmias", etiqueta: "Arritmias" },
                { valor: "defectosCardiacosCongenitos", etiqueta: "Defectos cardíacos congénitos" },
              ])}

              {renderCategoryGrid("hepaticos", "Padecimientos Hepáticos", [
                { valor: "hepatitisA", etiqueta: "Hepatitis A" },
                { valor: "hepatitisB", etiqueta: "Hepatitis B" },
                { valor: "hepatitisC", etiqueta: "Hepatitis C" },
                { valor: "higadoGraso", etiqueta: "Hígado graso" },
                { valor: "cirrosis", etiqueta: "Cirrosis" },
              ])}

              {renderCategoryGrid("pulmonares", "Padecimientos Pulmonares", [
                { valor: "neumonia", etiqueta: "Neumonía" },
                { valor: "bronquitis", etiqueta: "Bronquitis" },
                { valor: "asma", etiqueta: "Asma" },
                { valor: "epoc", etiqueta: "EPOC" },
              ])}

              {renderCategoryGrid("infecciosasParasitarias", "Enfermedades Infecciosas y Parasitarias", [
                { valor: "fiebreTifoidea", etiqueta: "Fiebre tifoidea" },
                { valor: "tuberculosis", etiqueta: "Tuberculosis" },
                { valor: "amibiasis", etiqueta: "Amibiasis" },
                { valor: "giardiasis", etiqueta: "Giardiasis" },
                { valor: "ascariasis", etiqueta: "Ascariasis" },
              ])}

              {renderCategoryGrid("enfermedadesEruptivas", "Enfermedades Eruptivas de la Infancia", [
                { valor: "sarampion", etiqueta: "Sarampión" },
                { valor: "rubeola", etiqueta: "Rubéola" },
                { valor: "escarlatina", etiqueta: "Escarlatina" },
                { valor: "varicela", etiqueta: "Varicela" },
                { valor: "paperas", etiqueta: "Parotiditis (paperas)" },
              ])}

              {renderCategoryGrid("enfermedadesTransmisionSexual", "Enfermedades de Transmisión Sexual", [
                { valor: "vih", etiqueta: "VIH/SIDA" },
                { valor: "sifilis", etiqueta: "Sífilis" },
                { valor: "gonorrea", etiqueta: "Gonorrea" },
                { valor: "herpesGenital", etiqueta: "Herpes genital" },
                { valor: "vph", etiqueta: "VPH" },
              ])}

              {renderCategoryGrid("otrosPadecimientos", "Otros Padecimientos Sistémicos", [])}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AntecedentesPersonalesPatologicos;
