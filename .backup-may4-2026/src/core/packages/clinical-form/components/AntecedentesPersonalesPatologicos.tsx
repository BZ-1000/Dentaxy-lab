
import React, { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Copy, CheckCircle, Sparkles, Eraser } from "lucide-react";
import { FormDataState } from '../types/historiaClinica';
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, EyeOff, Eye } from "lucide-react";
import { AnimatedTextareaWithTyping } from "@/components/ui/AnimatedTextareaWithTyping";
import OtraCondicionInput from '@/components/ui/OtraCondicionInput';

interface CopiedState {
  nutricionales?: boolean;
  cardiacos?: boolean;
  hepaticos?: boolean;
  enfermedadesTransmisionSexual?: boolean;
  enfermedadesEruptivas?: boolean;
  pulmonares?: boolean;
  infecciosasParasitarias?: boolean;
  otrosPadecimientos?: boolean;
}

const AntecedentesPersonalesPatologicos: React.FC<{
  formData: FormDataState;
  handleAntecedentePatologicoChange: (field: string, value: any) => void;
  onRedaccionGenerada?: (content: string) => void;
  onToggleViewMode?: () => void;
}> = ({ formData, handleAntecedentePatologicoChange, onRedaccionGenerada, onToggleViewMode }) => {
  // Local state for 'sinPatologia' just to drive UI updates, but primarily syncs with formData
  const [sinPatologia, setSinPatologia] = useState(formData.antecedentesPersonalesPatologicos?.sinPatologia || false);
  const [previousFormState, setPreviousFormState] = useState(null);

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
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus effect logic remains
    if (!formData.antecedentesPersonalesPatologicos) return;

    Object.entries(formData.antecedentesPersonalesPatologicos).forEach(([categoria, data]) => {
      if (data?.otra && data?.otraDescripcion !== undefined) {
        const ref = inputRefs.current[categoria];
        if (ref && ref.current && document.activeElement !== ref.current) {
          ref.current.focus();
          const val = ref.current.value;
          ref.current.setSelectionRange(val.length, val.length);
        }
      }
    });
  }, [formData.antecedentesPersonalesPatologicos]);

  const handleSinPatologiaChange = () => {
    const newValue = !sinPatologia;
    setSinPatologia(newValue);
    handleAntecedentePatologicoChange("sinPatologia", newValue);

    if (newValue) {
      // Logic to clear fields
      handleAntecedentePatologicoChange("nutricionales", { ninguna: true, otra: false, otraDescripcion: '' });
      handleAntecedentePatologicoChange("cardiacos", { ninguna: true, otra: false, otraDescripcion: '' });
      handleAntecedentePatologicoChange("hepaticos", { ninguna: true, otra: false, otraDescripcion: '' });
      handleAntecedentePatologicoChange("enfermedadesTransmisionSexual", { ninguna: true, otra: false, otraDescripcion: '' });
      handleAntecedentePatologicoChange("enfermedadesEruptivas", { ninguna: true, otra: false, otraDescripcion: '' });
      handleAntecedentePatologicoChange("pulmonares", { ninguna: true, otra: false, otraDescripcion: '' });
      handleAntecedentePatologicoChange("infecciosasParasitarias", { ninguna: true, otra: false, otraDescripcion: '' });
      handleAntecedentePatologicoChange("otrosPadecimientos", { ninguna: true, otra: false, otraDescripcion: '' });
    } else {
      // Restore previous state if available
      if (previousFormState) {
        Object.keys(previousFormState).forEach(categoria => {
          handleAntecedentePatologicoChange(categoria, previousFormState[categoria]);
        });
      }
    }
  };

  const handleOtraDescripcionChange = (categoria: string, valor: string) => {
    const categoriasActualizadas = { ...formData.antecedentesPersonalesPatologicos[categoria] };
    categoriasActualizadas.otra = true;
    categoriasActualizadas.otraDescripcion = valor;
    categoriasActualizadas.ninguna = false;
    handleAntecedentePatologicoChange(categoria, categoriasActualizadas);
  };

  const seleccionarOpcion = (categoria: string, opcion: string, valor: boolean) => {
    // Logic from original code
    if (opcion === 'ninguna' && valor) {
      const categoriasActualizadas = { ...formData.antecedentesPersonalesPatologicos[categoria] };
      Object.keys(categoriasActualizadas).forEach(key => {
        if (key !== 'ninguna' && key !== 'otra' && key !== 'otraDescripcion') {
          categoriasActualizadas[key] = false;
        }
      });
      categoriasActualizadas.ninguna = true;
      categoriasActualizadas.otra = false;
      categoriasActualizadas.otraDescripcion = '';
      handleAntecedentePatologicoChange(categoria, categoriasActualizadas);
    } else if (opcion !== 'ninguna' && opcion !== 'otra' && opcion !== 'otraDescripcion' && valor) {
      const categoriasActualizadas = { ...formData.antecedentesPersonalesPatologicos[categoria] };
      categoriasActualizadas[opcion] = valor;
      categoriasActualizadas.ninguna = false;
      handleAntecedentePatologicoChange(categoria, categoriasActualizadas);
    } else if (opcion === 'otra') {
      const categoriasActualizadas = { ...formData.antecedentesPersonalesPatologicos[categoria] };
      categoriasActualizadas.otra = valor;
      if (!valor) {
        categoriasActualizadas.otraDescripcion = '';
      }
      categoriasActualizadas.ninguna = false;
      handleAntecedentePatologicoChange(categoria, categoriasActualizadas);

      if (valor) {
        setTimeout(() => {
          if (inputRefs.current[categoria]?.current) {
            inputRefs.current[categoria].current?.focus();
          }
        }, 0);
      }
    } else {
      const categoriasActualizadas = { ...formData.antecedentesPersonalesPatologicos[categoria] };
      categoriasActualizadas[opcion] = valor;
      handleAntecedentePatologicoChange(categoria, categoriasActualizadas);
    }
  };

  const generarRedaccionIA = () => {
    if (sinPatologia) {
      const redaccion = `<strong>Antecedentes Personales Patológicos:</strong><br/><div style="text-align: justify;">Niega antecedentes patológicos personales de importancia para el tratamiento odontológico actual.</div>`;
      if (onRedaccionGenerada) onRedaccionGenerada(redaccion);
      if (onToggleViewMode) onToggleViewMode();
      return;
    }

    const cats = ['nutricionales', 'cardiacos', 'hepaticos', 'enfermedadesTransmisionSexual', 'enfermedadesEruptivas', 'pulmonares', 'infecciosasParasitarias', 'otrosPadecimientos'];

    let fullText = `<strong>Antecedentes Personales Patológicos</strong><br/><br/>`;

    cats.forEach(cat => {
      const text = generarRedaccionPorCategoria(cat);
      // Only add if meaningful (not just "Niega..." unless we want to verbose everything. Original code verbose everything?)
      // Original code generated text for ALL categories.
      fullText += `<strong>${getTituloCategoria(cat)}:</strong> <div style="text-align: justify;">${text}</div><br/>`;
    });

    if (onRedaccionGenerada) {
      onRedaccionGenerada(fullText.trim());
    }
    if (onToggleViewMode) {
      onToggleViewMode();
    }
  };

  // Helper functions from original code
  const generarRedaccionPorCategoria = (categoria: string) => {
    // ... Copy logic or simplify
    // Since original logic was complex with maps, I'll copy it but ensure it returns String.
    const categoriaData = formData.antecedentesPersonalesPatologicos[categoria];
    if (!categoriaData) return "No hay datos disponibles.";

    if (categoriaData.ninguna || sinPatologia) {
      const enfermedadesComunes: { [key: string]: string } = {
        nutricionales: "anorexia, bulimia, sobrepeso, obesidad",
        cardiacos: "enfermedad coronaria, arritmias, defectos cardíacos congénitos",
        hepaticos: "hepatitis A, B, C, hígado graso, cirrosis",
        enfermedadesTransmisionSexual: "VIH/SIDA, sífilis, gonorrea, herpes genital, VPH",
        enfermedadesEruptivas: "sarampión, rubéola, escarlatina, varicela, paperas",
        pulmonares: "neumonía, bronquitis, asma, EPOC",
        infecciosasParasitarias: "fiebre tifoidea, tuberculosis, amibiasis, giardiasis, ascariasis",
        otrosPadecimientos: "otras enfermedades sistémicas"
      };
      return `El paciente niega antecedentes de padecimientos ${getTituloCategoria(categoria).toLowerCase()} (se interrogó específicamente por ${enfermedadesComunes[categoria]}).`;
    }

    const opcionesSeleccionadas = Object.entries(categoriaData)
      .filter(([key, value]) => key !== 'ninguna' && key !== 'otra' && key !== 'otraDescripcion' && value === true)
      .map(([key]) => getNombreOpcion(key, categoria));

    let redaccion = "";

    if (opcionesSeleccionadas.length > 0) {
      redaccion += `El paciente refiere presentar antecedentes de ${opcionesSeleccionadas.join(', ')}`;
    }

    if (categoriaData.otra && categoriaData.otraDescripcion) {
      if (redaccion) {
        redaccion += ` y ${categoriaData.otraDescripcion}`;
      } else {
        redaccion += `El paciente refiere presentar antecedentes de ${categoriaData.otraDescripcion}`;
      }
      redaccion += ` como padecimiento(s) ${getTituloCategoria(categoria).toLowerCase()}.`;
    } else if (redaccion) {
      redaccion += ` como padecimiento(s) ${getTituloCategoria(categoria).toLowerCase()}.`;
    }

    const titles = getTituloCategoria(categoria).toLowerCase();
    if (!redaccion) {
      redaccion = `No se reportan antecedentes de padecimientos ${titles}.`;
    }

    return redaccion;
  };

  const getTituloCategoria = (categoria: string) => {
    const titulos: { [key: string]: string } = {
      nutricionales: "Nutricionales",
      cardiacos: "Cardíacos",
      hepaticos: "Hepáticos",
      enfermedadesTransmisionSexual: "Enfermedades de Transmisión Sexual",
      enfermedadesEruptivas: "Enfermedades Eruptivas de la Infancia",
      pulmonares: "Pulmonares",
      infecciosasParasitarias: "Enfermedades Infecciosas y Parasitarias",
      otrosPadecimientos: "Otros Padecimientos Sistémicos"
    };
    return titulos[categoria] || categoria;
  };

  const getNombreOpcion = (opcion: string, categoria: string) => {
    const opciones: any = {
      nutricionales: { anorexia: "Anorexia", bulimia: "Bulimia", sobrepeso: "Sobrepeso", obesidad: "Obesidad" },
      cardiacos: { enfermedadCoronaria: "Enfermedad coronaria", arritmias: "Arritmias", defectsCardiacosCongenitos: "Defectos cardíacos congénitos" },
      hepaticos: { hepatitisA: "Hepatitis A", hepatitisB: "Hepatitis B", hepatitisC: "Hepatitis C", higadoGraso: "Hígado graso", cirrosis: "Cirrosis" },
      enfermedadesTransmisionSexual: { vih: "VIH/SIDA", sifilis: "Sífilis", gonorrea: "Gonorrea", herpesGenital: "Herpes genital", vph: "Virus del Papiloma Humano (VPH)" },
      enfermedadesEruptivas: { sarampion: "Sarampión", rubeola: "Rubéola", escarlatina: "Escarlatina", varicela: "Varicela", paperas: "Parotiditis (paperas)" },
      pulmonares: { neumonia: "Neumonía", bronquitis: "Bronquitis", asma: "Asma", epoc: "Enfermedad Pulmonar Obstructiva Crónica (EPOC)" },
      infecciosasParasitarias: { fiebreTifoidea: "Fiebre tifoidea", tuberculosis: "Tuberculosis", amibiasis: "Amibiasis", giardiasis: "Giardiasis", ascariasis: "Ascariasis" }
    };
    return opciones[categoria]?.[opcion] || opcion;
  };

  const limpiarFormulario = () => {
    const categoriasIniciales = ['nutricionales', 'cardiacos', 'hepaticos', 'enfermedadesTransmisionSexual',
      'enfermedadesEruptivas', 'pulmonares', 'infecciosasParasitarias', 'otrosPadecimientos'];

    categoriasIniciales.forEach(categoria => {
      const categoriasLimpias = {
        ninguna: false,
        otra: false,
        otraDescripcion: ''
      };
      // Note: In original code, it reset specific keys to false manually. 
      // I should do the same or better, just reset to Default Structure if I knew it.
      // But preserving specific key reset is safer for now.
      // (Simplified for brevity in this replacement, assuming handleAntecedentePatologicoChange handles object merge or replacement? 
      // It replaces the object for that category usually).

      // Let's assume sending the cleared object is fine.
      // Actually, I need to check if the reducer merges or replaces. 
      // Usually it replaces the key in formData.
      // So I should send a clean object with all possible keys false?
      // Or just standard keys.
      // I will copy the reset logic from previous implementation to be safe.

      if (categoria === 'nutricionales') Object.assign(categoriasLimpias, { anorexia: false, bulimia: false, sobrepeso: false, obesidad: false });
      if (categoria === 'cardiacos') Object.assign(categoriasLimpias, { enfermedadCoronaria: false, arritmias: false, defectosCardiacosCongenitos: false });
      if (categoria === 'hepaticos') Object.assign(categoriasLimpias, { hepatitisA: false, hepatitisB: false, hepatitisC: false, higadoGraso: false, cirrosis: false });
      if (categoria === 'enfermedadesTransmisionSexual') Object.assign(categoriasLimpias, { vih: false, sifilis: false, gonorrea: false, herpesGenital: false, vph: false });
      if (categoria === 'enfermedadesEruptivas') Object.assign(categoriasLimpias, { sarampion: false, rubeola: false, escarlatina: false, varicela: false, paperas: false });
      if (categoria === 'pulmonares') Object.assign(categoriasLimpias, { neumonia: false, bronquitis: false, asma: false, epoc: false });
      if (categoria === 'infecciosasParasitarias') Object.assign(categoriasLimpias, { fiebreTifoidea: false, tuberculosis: false, amibiasis: false, giardiasis: false, ascariasis: false });

      handleAntecedentePatologicoChange(categoria, categoriasLimpias);
    });
    setSinPatologia(false);
  };

  const OpcionPatologica = ({ categoria, valor, etiqueta }: { categoria: string, valor: string, etiqueta: string }) => {
    // Safety check just in case
    const isChecked = formData.antecedentesPersonalesPatologicos?.[categoria]?.[valor] || false;
    return (
      <button
        type="button"
        onClick={() => seleccionarOpcion(categoria, valor, !isChecked)}
        className={`px-3 py-1.5 rounded-md text-xs transition-all ${isChecked
          ? "bg-blue-500 text-white shadow-md"
          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
      >
        {etiqueta}
      </button>
    );
  };

  const CategoriaPatologica = ({ categoria, titulo, opciones }: { categoria: string, titulo: string, opciones: { valor: string, etiqueta: string }[] }) => {
    return (
      <div className={`bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 ${sinPatologia ? "hidden" : ""}`} style={{ overflowY: 'auto', maxHeight: '500px' }}>
        <h4 className="text-lg font-semibold mb-3">{titulo}</h4>
        <div className="flex flex-wrap gap-2">
          {opciones.map(opcion => (
            <OpcionPatologica key={opcion.valor} categoria={categoria} valor={opcion.valor} etiqueta={opcion.etiqueta} />
          ))}
          <OpcionPatologica categoria={categoria} valor="ninguna" etiqueta="Ninguna" />
          <OpcionPatologica categoria={categoria} valor="otra" etiqueta="Otra" />
          {formData.antecedentesPersonalesPatologicos?.[categoria]?.otra && (
            <div className="w-full mt-2 max-w-[250px]">
              <OtraCondicionInput
                ref={inputRefs.current[categoria] as React.RefObject<HTMLTextAreaElement>}
                placeholder="Especificar otra condición..."
                value={formData.antecedentesPersonalesPatologicos[categoria]?.otraDescripcion || ''}
                onChange={(e) => handleOtraDescripcionChange(categoria, e.target.value)}
                className="w-full h-[30px]"
                onBlur={() => { }}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!formData.antecedentesPersonalesPatologicos) {
    return <div className="p-4 text-center">Cargando datos...</div>;
  }

  return (
    <div className='bg-background dark:bg-background transition-colors duration-300' data-formulario-section="antecedentes-personales-patologicos">
      <div className="space-y-6">
        <div
          className="bg-blue-50 dark:bg-blue-900/20 p-2 sm:p-4 rounded-lg border border-blue-100 dark:border-blue-800 w-full text-left cursor-pointer"
          onClick={handleSinPatologiaChange}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-2">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              <Label className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-1">
                Paciente sin patologías
                {sinPatologia ? (
                  <span className="ml-1 sm:ml-2 text-xs text-green-500 bg-green-50 dark:bg-green-900/20 px-1 sm:px-2 py-0.5 rounded-full flex items-center gap-1">
                    <EyeOff className="h-3 w-3" />
                    <span className="hidden sm:inline">Secciones ocultas</span>
                    <span className="sm:hidden">Ocultas</span>
                  </span>
                ) : (
                  <span className="ml-1 sm:ml-2 text-xs text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-1 sm:px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span className="hidden sm:inline">Secciones visibles</span>
                    <span className="sm:hidden">Visibles</span>
                  </span>
                )}
              </Label>
            </div>
            <Switch
              id="sin-patologia"
              checked={sinPatologia}
              onCheckedChange={handleSinPatologiaChange}
              className="data-[state=checked]:bg-blue-500 scale-75 sm:scale-100"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        {!sinPatologia && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CategoriaPatologica
              categoria="nutricionales"
              titulo="Nutricionales"
              opciones={[
                { valor: "anorexia", etiqueta: "Anorexia" },
                { valor: "bulimia", etiqueta: "Bulimia" },
                { valor: "sobrepeso", etiqueta: "Sobrepeso" },
                { valor: "obesidad", etiqueta: "Obesidad" }
              ]}
            />

            <CategoriaPatologica
              categoria="cardiacos"
              titulo="Cardíacos"
              opciones={[
                { valor: "enfermedadCoronaria", etiqueta: "Enfermedad coronaria" },
                { valor: "arritmias", etiqueta: "Arritmias" },
                { valor: "defectosCardiacosCongenitos", etiqueta: "Defectos cardíacos congénitos" }
              ]}
            />

            <CategoriaPatologica
              categoria="hepaticos"
              titulo="Hepáticos"
              opciones={[
                { valor: "hepatitisA", etiqueta: "Hepatitis A" },
                { valor: "hepatitisB", etiqueta: "Hepatitis B" },
                { valor: "hepatitisC", etiqueta: "Hepatitis C" },
                { valor: "higadoGraso", etiqueta: "Hígado graso" },
                { valor: "cirrosis", etiqueta: "Cirrosis" }
              ]}
            />

            <CategoriaPatologica
              categoria="enfermedadesTransmisionSexual"
              titulo="Enfermedades de Transmisión Sexual"
              opciones={[
                { valor: "vih", etiqueta: "VIH/SIDA" },
                { valor: "sifilis", etiqueta: "Sífilis" },
                { valor: "gonorrea", etiqueta: "Gonorrea" },
                { valor: "herpesGenital", etiqueta: "Herpes genital" },
                { valor: "vph", etiqueta: "VPH" }
              ]}
            />

            <CategoriaPatologica
              categoria="enfermedadesEruptivas"
              titulo="Enfermedades Eruptivas de la Infancia"
              opciones={[
                { valor: "sarampion", etiqueta: "Sarampión" },
                { valor: "rubeola", etiqueta: "Rubéola" },
                { valor: "escarlatina", etiqueta: "Escarlatina" },
                { valor: "varicela", etiqueta: "Varicela" },
                { valor: "paperas", etiqueta: "Parotiditis (paperas)" }
              ]}
            />

            <CategoriaPatologica
              categoria="pulmonares"
              titulo="Pulmonares"
              opciones={[
                { valor: "neumonia", etiqueta: "Neumonía" },
                { valor: "bronquitis", etiqueta: "Bronquitis" },
                { valor: "asma", etiqueta: "Asma" },
                { valor: "epoc", etiqueta: "EPOC" }
              ]}
            />

            <CategoriaPatologica
              categoria="infecciosasParasitarias"
              titulo="Enfermedades Infecciosas y Parasitarias"
              opciones={[
                { valor: "fiebreTifoidea", etiqueta: "Fiebre tifoidea" },
                { valor: "tuberculosis", etiqueta: "Tuberculosis" },
                { valor: "amibiasis", etiqueta: "Amibiasis" },
                { valor: "giardiasis", etiqueta: "Giardiasis" },
                { valor: "ascariasis", etiqueta: "Ascariasis" }
              ]}
            />

            <CategoriaPatologica
              categoria="otrosPadecimientos"
              titulo="Otros Padecimientos Sistémicos"
              opciones={[
                { valor: "especificar", etiqueta: "Especificar" }
              ]}
            />
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="flex justify-end items-center gap-4 pt-10 opacity-90 transition-opacity">
        {onToggleViewMode && (
          <Button
            variant="outline"
            onClick={generarRedaccionIA}
            className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Ver Redacción IA
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={limpiarFormulario}
          className="text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
        >
          <Eraser className="w-3 h-3 mr-2" />
          Reiniciar Sección
        </Button>
      </div>
    </div>
  );
};

export default AntecedentesPersonalesPatologicos;
