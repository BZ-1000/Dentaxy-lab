import React, { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Copy, CheckCircle } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
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
}> = ({ formData, handleAntecedentePatologicoChange }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [sinPatologia, setSinPatologia] = useState(formData.antecedentesPersonalesPatologicos?.sinPatologia || false);
  const [redacciones, setRedacciones] = useState({
    nutricionales: "",
    cardiacos: "",
    hepaticos: "",
    enfermedadesTransmisionSexual: "",
    enfermedadesEruptivas: "",
    pulmonares: "",
    infecciosasParasitarias: "",
    otrosPadecimientos: ""
  });
  const [copied, setCopied] = useState<CopiedState>({});
  const formRef = useRef<HTMLDivElement>(null);
  const redaccionesRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [previousFormState, setPreviousFormState] = useState(null);

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

  const handleSinPatologiaChange = () => {
    const newValue = !sinPatologia;
    setSinPatologia(newValue);
    handleAntecedentePatologicoChange("sinPatologia", newValue);

    if (newValue) {
      handleAntecedentePatologicoChange("nutricionales", { ninguna: true, otra: false, otraDescripcion: '' });
      handleAntecedentePatologicoChange("cardiacos", { ninguna: true, otra: false, otraDescripcion: '' });
      handleAntecedentePatologicoChange("hepaticos", { ninguna: true, otra: false, otraDescripcion: '' });
      handleAntecedentePatologicoChange("enfermedadesTransmisionSexual", { ninguna: true, otra: false, otraDescripcion: '' });
      handleAntecedentePatologicoChange("enfermedadesEruptivas", { ninguna: true, otra: false, otraDescripcion: '' });
      handleAntecedentePatologicoChange("pulmonares", { ninguna: true, otra: false, otraDescripcion: '' });
      handleAntecedentePatologicoChange("infecciosasParasitarias", { ninguna: true, otra: false, otraDescripcion: '' });
      handleAntecedentePatologicoChange("otrosPadecimientos", { ninguna: true, otra: false, otraDescripcion: '' });
    } else {
      if (previousFormState) {
        Object.keys(previousFormState).forEach(categoria => {
          handleAntecedentePatologicoChange(categoria, previousFormState[categoria]);
        });
      }
    }
  };

  const inputRefs = useRef<{[key: string]: React.RefObject<HTMLInputElement>}>({
    nutricionales: React.createRef<HTMLInputElement>(),
    cardiacos: React.createRef<HTMLInputElement>(),
    hepaticos: React.createRef<HTMLInputElement>(),
    enfermedadesTransmisionSexual: React.createRef<HTMLInputElement>(),
    enfermedadesEruptivas: React.createRef<HTMLInputElement>(),
    pulmonares: React.createRef<HTMLInputElement>(),
    infecciosasParasitarias: React.createRef<HTMLInputElement>(),
    otrosPadecimientos: React.createRef<HTMLInputElement>(),
  });

  const seleccionarOpcion = (categoria: string, opcion: string, valor: boolean) => {
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
    } else if (opcion === 'otra' && valor) {
      const categoriasActualizadas = { ...formData.antecedentesPersonalesPatologicos[categoria] };
      categoriasActualizadas.otra = valor;
      categoriasActualizadas.ninguna = false;
      handleAntecedentePatologicoChange(categoria, categoriasActualizadas);
      
      // Focus the input field after state update
      setTimeout(() => {
        if (inputRefs.current[categoria]?.current) {
          inputRefs.current[categoria].current?.focus();
        }
      }, 0);
    } else {
      const categoriasActualizadas = { ...formData.antecedentesPersonalesPatologicos[categoria] };
      categoriasActualizadas[opcion] = valor;
      handleAntecedentePatologicoChange(categoria, categoriasActualizadas);
    }
  };

  const handleOtraDescripcionChange = (categoria: string, valor: string) => {
    const categoriasActualizadas = { ...formData.antecedentesPersonalesPatologicos[categoria] };
    categoriasActualizadas.otra = true;
    categoriasActualizadas.otraDescripcion = valor;
    categoriasActualizadas.ninguna = false;
    handleAntecedentePatologicoChange(categoria, categoriasActualizadas);
  };

  const generarRedaccionIA = () => {
    const nuevasRedacciones = {
      nutricionales: generarRedaccionPorCategoria('nutricionales'),
      cardiacos: generarRedaccionPorCategoria('cardiacos'),
      hepaticos: generarRedaccionPorCategoria('hepaticos'),
      enfermedadesTransmisionSexual: generarRedaccionPorCategoria('enfermedadesTransmisionSexual'),
      enfermedadesEruptivas: generarRedaccionPorCategoria('enfermedadesEruptivas'),
      pulmonares: generarRedaccionPorCategoria('pulmonares'),
      infecciosasParasitarias: generarRedaccionPorCategoria('infecciosasParasitarias'),
      otrosPadecimientos: generarRedaccionPorCategoria('otrosPadecimientos')
    };

    setRedacciones(nuevasRedacciones);
    setShowForm(false);
    setProgress(100);

    redaccionesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generarRedaccionPorCategoria = (categoria: string) => {
    if (sinPatologia) {
      const enfermedadesComunes = {
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

    const categoriaData = formData.antecedentesPersonalesPatologicos[categoria];

    if (!categoriaData) return "No hay datos disponibles.";

    if (categoriaData.ninguna) {
      const enfermedadesComunes = {
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
      .filter(([key, value]) =>
        key !== 'ninguna' &&
        key !== 'otra' &&
        key !== 'otraDescripcion' &&
        value === true
      )
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

    if (!redaccion) {
      redaccion = `No se reportan antecedentes de padecimientos ${getTituloCategoria(categoria).toLowerCase()}.`;
    }

    return redaccion;
  };

  const getTituloCategoria = (categoria: string) => {
    const titulos = {
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
    const opciones = {
      nutricionales: {
        anorexia: "Anorexia",
        bulimia: "Bulimia",
        sobrepeso: "Sobrepeso",
        obesidad: "Obesidad"
      },
      cardiacos: {
        enfermedadCoronaria: "Enfermedad coronaria",
        arritmias: "Arritmias",
        defectosCardiacosCongenitos: "Defectos cardíacos congénitos"
      },
      hepaticos: {
        hepatitisA: "Hepatitis A",
        hepatitisB: "Hepatitis B",
        hepatitisC: "Hepatitis C",
        higadoGraso: "Hígado graso",
        cirrosis: "Cirrosis"
      },
      enfermedadesTransmisionSexual: {
        vih: "VIH/SIDA",
        sifilis: "Sífilis",
        gonorrea: "Gonorrea",
        herpesGenital: "Herpes genital",
        vph: "Virus del Papiloma Humano (VPH)"
      },
      enfermedadesEruptivas: {
        sarampion: "Sarampión",
        rubeola: "Rubéola",
        escarlatina: "Escarlatina",
        varicela: "Varicela",
        paperas: "Parotiditis (paperas)"
      },
      pulmonares: {
        neumonia: "Neumonía",
        bronquitis: "Bronquitis",
        asma: "Asma",
        epoc: "Enfermedad Pulmonar Obstructiva Crónica (EPOC)"
      },
      infecciosasParasitarias: {
        fiebreTifoidea: "Fiebre tifoidea",
        tuberculosis: "Tuberculosis",
        amibiasis: "Amibiasis",
        giardiasis: "Giardiasis",
        ascariasis: "Ascariasis"
      }
    };

    return opciones[categoria]?.[opcion] || opcion;
  };

  const handleCopy = (section: keyof CopiedState) => {
    if (redacciones[section]) {
      navigator.clipboard.writeText(redacciones[section]);
      setCopied(prev => ({
        ...prev,
        [section]: true
      }));
      setTimeout(() => setCopied(prev => ({
        ...prev,
        [section]: false
      })), 2000);
    }
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

      if (categoria === 'nutricionales') {
        categoriasLimpias['anorexia'] = false;
        categoriasLimpias['bulimia'] = false;
        categoriasLimpias['sobrepeso'] = false;
        categoriasLimpias['obesidad'] = false;
      } else if (categoria === 'cardiacos') {
        categoriasLimpias['enfermedadCoronaria'] = false;
        categoriasLimpias['arritmias'] = false;
        categoriasLimpias['defectosCardiacosCongenitos'] = false;
      } else if (categoria === 'hepaticos') {
        categoriasLimpias['hepatitisA'] = false;
        categoriasLimpias['hepatitisB'] = false;
        categoriasLimpias['hepatitisC'] = false;
        categoriasLimpias['higadoGraso'] = false;
        categoriasLimpias['cirrosis'] = false;
      } else if (categoria === 'enfermedadesTransmisionSexual') {
        categoriasLimpias['vih'] = false;
        categoriasLimpias['sifilis'] = false;
        categoriasLimpias['gonorrea'] = false;
        categoriasLimpias['herpesGenital'] = false;
        categoriasLimpias['vph'] = false;
      } else if (categoria === 'enfermedadesEruptivas') {
        categoriasLimpias['sarampion'] = false;
        categoriasLimpias['rubeola'] = false;
        categoriasLimpias['escarlatina'] = false;
        categoriasLimpias['varicela'] = false;
        categoriasLimpias['paperas'] = false;
      } else if (categoria === 'pulmonares') {
        categoriasLimpias['neumonia'] = false;
        categoriasLimpias['bronquitis'] = false;
        categoriasLimpias['asma'] = false;
        categoriasLimpias['epoc'] = false;
      } else if (categoria === 'infecciosasParasitarias') {
        categoriasLimpias['fiebreTifoidea'] = false;
        categoriasLimpias['tuberculosis'] = false;
        categoriasLimpias['amibiasis'] = false;
        categoriasLimpias['giardiasis'] = false;
        categoriasLimpias['ascariasis'] = false;
      }

      handleAntecedentePatologicoChange(categoria, categoriasLimpias);
    });

    setShowForm(true);
    setRedacciones({
      nutricionales: "",
      cardiacos: "",
      hepaticos: "",
      enfermedadesTransmisionSexual: "",
      enfermedadesEruptivas: "",
      pulmonares: "",
      infecciosasParasitarias: "",
      otrosPadecimientos: ""
    });
    setProgress(0);
    setSinPatologia(false);
  };

  const OpcionPatologica = ({
    categoria,
    valor,
    etiqueta
  }: {
    categoria: string,
    valor: string,
    etiqueta: string
  }) => {
    const isChecked = formData.antecedentesPersonalesPatologicos[categoria]?.[valor] || false;

    return (
      <button
        type="button"
        onClick={() => seleccionarOpcion(categoria, valor, !isChecked)}
        className={`px-3 py-1.5 rounded-md text-xs transition-all ${
          isChecked
            ? "bg-blue-500 text-white shadow-md"
            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        {etiqueta}
      </button>
    );
  };

  const CategoriaPatologica = ({
    categoria,
    titulo,
    opciones
  }: {
    categoria: string,
    titulo: string,
    opciones: { valor: string, etiqueta: string }[]
  }) => {
    return (
      <div className={`bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 ${sinPatologia ? "hidden" : ""}`} style={{ overflowY: 'auto', maxHeight: '500px' }}>
        <h4 className="text-lg font-semibold mb-3">{titulo}</h4>

        <div className="flex flex-wrap gap-2">
          {opciones.map(opcion => (
            <OpcionPatologica
              key={opcion.valor}
              categoria={categoria}
              valor={opcion.valor}
              etiqueta={opcion.etiqueta}
            />
          ))}

          <OpcionPatologica
            categoria={categoria}
            valor="ninguna"
            etiqueta="Ninguna"
          />

          <OpcionPatologica
            categoria={categoria}
            valor="otra"
            etiqueta="Otra"
          />

          {formData.antecedentesPersonalesPatologicos[categoria]?.otra && (
            <div className="w-full mt-2">
              <OtraCondicionInput
                ref={inputRefs.current[categoria]}
                placeholder="Especificar otra condición..."
                value={formData.antecedentesPersonalesPatologicos[categoria]?.otraDescripcion || ''}
                onChange={(e) => handleOtraDescripcionChange(categoria, e.target.value)}
                className="w-full"
                onBlur={() => {}}
              />
            </div>
          )}
        </div>
      </div>
    );
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
            <span className="text-gray-400">IV.</span> ANTECEDENTES PERSONALES PATOLÓGICOS
          </h2>
        </div>

        {!isMinimized && (
          <div className="p-6" ref={formRef}>
            {showForm ? (
              <div className="space-y-6">
                <div
                  className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 w-full text-left cursor-pointer"
                  onClick={handleSinPatologiaChange}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-500" />
                      <Label className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-1">
                        Paciente sin patologías
                        {sinPatologia ? (
                          <span className="ml-2 text-xs text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <EyeOff className="h-3 w-3" />
                            Secciones ocultas
                          </span>
                        ) : (
                          <span className="ml-2 text-xs text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            Secciones visibles
                          </span>
                        )}
                      </Label>
                    </div>
                    <Switch
                      id="sin-patologia"
                      checked={sinPatologia}
                      onCheckedChange={handleSinPatologiaChange}
                      className="data-[state=checked]:bg-blue-500"
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

                <div className="flex justify-center gap-4 mt-6">
                  <Button
                    onClick={generarRedaccionIA}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Generar Redacción IA
                  </Button>
                  <Button
                    onClick={limpiarFormulario}
                    variant="outline"
                    className="border-gray-300 text-gray-700 dark:text-gray-300"
                  >
                    Limpiar Formulario
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {progress === 100 && (
                  <>
                    {Object.entries(redacciones).map(([section, content]) => (
                      <div key={section} className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-lg font-semibold capitalize">{section}</h4>
                          <button
                            onClick={() => handleCopy(section as keyof CopiedState)}
                            className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
                          >
                            {copied[section as keyof CopiedState] ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                <span>Copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div>
                          <AnimatedTextareaWithTyping
                            content={content as string}
                            className="w-full bg-white/50 dark:bg-gray-800/50 p-2 rounded-md text-sm"
                            textAlign="justify"
                            readOnly
                          />
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-center">
                      <Button
                        onClick={() => setShowForm(true)}
                        variant="outline"
                        className="border-gray-300 text-gray-700 dark:text-gray-300"
                      >
                        Volver al Formulario
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AntecedentesPersonalesPatologicos;
