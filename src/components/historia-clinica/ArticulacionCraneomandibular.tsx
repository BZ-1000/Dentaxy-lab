
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X, Edit, FileText, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormDataState } from '@/types/historiaClinica';

// Interface para props del componente
interface ArticulacionCraneomandibularProps {
  formData: FormDataState;
  handleArticulacionCraneomandibularChange: (part: string, value: string | boolean | object) => void;
  onRedaccionGenerada?: (text: string) => void;
  onToggleViewMode?: () => void;
}

// 1. Interface para el estado interno del componente
interface ArticulacionCraneomandibularState {
  dolorMasticarHablar?: boolean | null;
  tipoDolor?: string;
  duracionDolor?: string;
  dolorEspecifico?: boolean | null;
  motivoDolor?: string;
  ruidoArticular?: string | null;
  patronAbertura?: string | null;
  otroPatronAbertura?: string;
  otrasObservaciones?: string; // Observaciones ATM
  labios: {
    // Objeto labios siempre presente
    simetria?: string | null;
    volumen?: string | null;
    coloracion?: string | null;
    hidratacion?: string | null; // Se refiere a la superficie/estado
    integridad?: string | null; // Se refiere a la mucosa
    comisuras?: string | null;
    movimiento?: string | null;
    otrasObservaciones?: string; // Observaciones Labios
  };
}

// 2. Estado inicial bien definido
const initialState: ArticulacionCraneomandibularState = {
  dolorMasticarHablar: null,
  tipoDolor: '',
  duracionDolor: '',
  dolorEspecifico: null,
  motivoDolor: '',
  ruidoArticular: null,
  patronAbertura: null,
  otroPatronAbertura: '',
  otrasObservaciones: '',
  labios: {
    // Inicializar labios y sus propiedades
    simetria: null,
    volumen: null,
    coloracion: null,
    hidratacion: null,
    integridad: null,
    comisuras: null,
    movimiento: null,
    otrasObservaciones: ''
  }
};

// 3. Opciones con etiquetas CORREGIDAS y gramaticalmente adecuadas
type Option = {
  label: string;
  value: string;
};

// Opciones Labios Corregidas
const simetriaOptions: Option[] = [{
  label: "Simétricos",
  value: "simetricos"
}, {
  label: "Desviación Derecha",
  value: "asimetricosDerecha"
}, {
  label: "Desviación Izquierda",
  value: "asimetricosIzquierda"
}];
const volumenOptions: Option[] = [{
  label: "Delgados",
  value: "delgados"
}, {
  label: "Medianos",
  value: "medianos"
}, {
  label: "Gruesos",
  value: "gruesos"
}];
const coloracionOptions: Option[] = [{
  label: "Coloración Rosada",
  value: "normal"
}, {
  label: "Coloración Pálida",
  value: "palidos"
}, {
  label: "Coloración Cianótica",
  value: "cianoticos"
}, {
  label: "Coloración Eritemática",
  value: "eritematosos"
}];
// Renombrado 'hidratacion' a 'superficie' para claridad en las opciones
const superficieOptions: Option[] = [{
  label: "Superficie Hidratada",
  value: "hidratados"
}, {
  label: "Superficie Seca",
  value: "secos"
}, {
  label: "Superficie Agrietada",
  value: "agrietados"
}, {
  label: "Presencia de Costras",
  value: "costras"
}, {
  label: "Superficie con Fisuras",
  value: "fisuras"
}];
const integridadOptions: Option[] = [{
  label: "Íntegra",
  value: "intactos"
}, {
  label: "Con Heridas Superficiales",
  value: "heridas"
}, {
  label: "Con Ulceraciones",
  value: "ulceraciones"
}, {
  label: "Con Fisuras",
  value: "fisuras"
} // Permite seleccionar fisuras aquí también
];
const comisurasOptions: Option[] = [{
  label: "Normales",
  value: "normales"
}, {
  label: "Erosionadas",
  value: "erosionadas"
}, {
  label: "Con Queilitis Angular",
  value: "queilitis"
}];
const movimientoOptions: Option[] = [{
  label: "Movimientos Conservados",
  value: "normales"
}, {
  label: "Restricción de Movimiento",
  value: "restriccion"
}, {
  label: "Incompetencia Labial",
  value: "incompetencia"
}];

// Opciones ATM
const patronAberturaOptions: Option[] = [{
  label: "Recto",
  value: "recto"
}, {
  label: "Desviación Derecha",
  value: "desviacionDerecha"
}, {
  label: "Desviación Izquierda",
  value: "desviacionIzquierda"
}, {
  label: "Forma de 'S'",
  value: "formaS"
}, {
  label: "Otro",
  value: "otro"
}];
const ruidoArticularOptions: Option[] = [{
  label: "A la Apertura",
  value: "abertura"
}, {
  label: "Al Cierre",
  value: "cierre"
}, {
  label: "No Presenta",
  value: "ninguno"
}];

// --- Mapeo de frases para redacción dinámica de labios ---
const lipNarrativePhrases: {
  [key: string]: {
    [value: string]: string;
  };
} = {
  simetria: {
    simetricos: "Los labios presentan simetría bilateral sin desviaciones evidentes.",
    asimetricosDerecha: "Se evidencia desviación hacia la derecha, generando una leve asimetría en la región perioral.",
    asimetricosIzquierda: "Se aprecia una desviación hacia la izquierda, acompañada de discreta asimetría facial."
  },
  volumen: {
    delgados: "El volumen es delgado, con perfil labial poco prominente.",
    medianos: "Los labios son de volumen mediano, con proporciones adecuadas.",
    gruesos: "El volumen labial es grueso, con prominencia."
  },
  coloracion: {
    normal: "Se identifica una coloración rosada, con tonalidad homogénea.",
    palidos: "Se aprecia una coloración pálida, lo cual podría indicar hipoperfusión o deficiencia de hemoglobina.",
    cianoticos: "Se observa una coloración cianótica, indicativa de posible hipoxia tisular o alteración circulatoria.",
    eritematosos: "La mucosa evidencia una coloración eritematosa, sugestiva de inflamación o irritación local."
  },
  hidratacion: {
    // Corresponde a las opciones de 'superficieOptions'
    hidratados: "La superficie labial se encuentra hidratada, con brillo característico.",
    secos: "La superficie labial se observa seca, sin hidratación visible y con posible ligera descamación.",
    agrietados: "La superficie presenta agrietamiento.",
    costras: "La superficie externa muestra presencia de costras, compatibles con procesos de cicatrización.",
    fisuras: "La superficie presenta fisuras lineales."
  },
  integridad: {
    intactos: "La integridad de la mucosa se mantiene, sin lesiones ni interrupciones del epitelio.",
    // Más conciso
    heridas: "La mucosa labial muestra heridas superficiales.",
    // Más directo
    ulceraciones: "La evaluación de la integridad mucosa revela úlceras.",
    fisuras: "En cuanto a la integridad mucosa, se evidencian fisuras que comprometen parcialmente la continuidad del epitelio."
  },
  comisuras: {
    normales: "Las comisuras se encuentran normales, sin signos de irritación ni inflamación.",
    erosionadas: "Las comisuras se encuentran erosionadas, con pérdida parcial del epitelio.",
    queilitis: "Las comisuras labiales presentan signos de queilitis angular, con fisuración y/o eritema."
  },
  movimiento: {
    normales: "Funcionalmente, los labios presentan movimientos conservados, sin restricciones.",
    restriccion: "Durante la exploración funcional se detecta restricción de movimiento.",
    // Más directo
    incompetencia: "A nivel funcional, los labios evidencian incompetencia labial, con incapacidad de sellado pasivo."
  }
};

// --- Componente Principal ---
const ArticulacionCraneomandibular: React.FC<ArticulacionCraneomandibularProps> = ({
  formData,
  handleArticulacionCraneomandibularChange,

  onRedaccionGenerada,
  onToggleViewMode
}) => {
  // Estados UI
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState('formulario');
  const [lipsViewMode, setLipsViewMode] = useState<'form' | 'narrative'>('form');
  const [fullRedaccion, setFullRedaccion] = useState('');

  // Estados y Refs para Typewriter y Carga
  const [isGeneratingLipsNarrative, setIsGeneratingLipsNarrative] = useState(false);
  const [targetLipsNarrative, setTargetLipsNarrative] = useState('');
  const [displayedLipsNarrative, setDisplayedLipsNarrative] = useState('');
  const lipsIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typewriterSpeed = 35; // Velocidad de escritura (ms por carácter)

  // --- Funciones de Limpieza de Intervalos ---
  const clearLipsInterval = useCallback(() => {
    if (lipsIntervalRef.current) {
      clearInterval(lipsIntervalRef.current);
      lipsIntervalRef.current = null;
    }
  }, []);

  // --- Hooks useEffect para la animación Typewriter ---
  useEffect(() => {
    // Limpia intervalo anterior si el texto objetivo cambia
    clearLipsInterval();
    if (targetLipsNarrative && isGeneratingLipsNarrative) {
      // Asegura que solo anime si está generando
      let index = 0;
      setDisplayedLipsNarrative(''); // Empezar limpio

      lipsIntervalRef.current = setInterval(() => {
        setDisplayedLipsNarrative(prev => prev + targetLipsNarrative[index]);
        index++;
        if (index === targetLipsNarrative.length) {
          clearLipsInterval();
          setIsGeneratingLipsNarrative(false); // Carga termina al final de la animación
        }
      }, typewriterSpeed);
    } else {
      // Si no hay target o no está en modo 'generando', limpiar display y asegurar que no cargue
      setDisplayedLipsNarrative(targetLipsNarrative); // Muestra el texto completo si no hay animación
      if (isGeneratingLipsNarrative) {
        // Si por alguna razón se quedó cargando sin target, detenerlo
        setIsGeneratingLipsNarrative(false);
      }
    }

    // Función de limpieza al desmontar o si las dependencias cambian ANTES de terminar
    return () => clearLipsInterval();
  }, [targetLipsNarrative, isGeneratingLipsNarrative, clearLipsInterval]); // isGeneratingLipsNarrative es dependencia clave aquí

  // --- Handlers UI (Minimizar, Maximizar) ---
  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    setIsMaximized(false);
  };
  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };

  // --- Handlers de Actualización de Estado ---
  const handleOptionChange = useCallback((fieldPath: string, value: string) => {
    // Manejar rutas anidadas como "labios.simetria"
    if (fieldPath.includes('.')) {
      const [parent, child] = fieldPath.split('.');
      const currentData = (formData.articulacionCraneomandibular?.[parent as keyof ArticulacionCraneomandibularState] || {}) as Record<string, any>;
      handleArticulacionCraneomandibularChange(parent, { ...currentData, [child]: value });
    } else {
      handleArticulacionCraneomandibularChange(fieldPath, value);
    }
  }, [handleArticulacionCraneomandibularChange, formData.articulacionCraneomandibular]);

  const handleTextChange = useCallback((fieldPath: string, e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Manejar rutas anidadas como "labios.otrasObservaciones"
    if (fieldPath.includes('.')) {
      const [parent, child] = fieldPath.split('.');
      const currentData = (formData.articulacionCraneomandibular?.[parent as keyof ArticulacionCraneomandibularState] || {}) as Record<string, any>;
      handleArticulacionCraneomandibularChange(parent, { ...currentData, [child]: e.target.value });
    } else {
      handleArticulacionCraneomandibularChange(fieldPath, e.target.value);
    }
  }, [handleArticulacionCraneomandibularChange, formData.articulacionCraneomandibular]);

  const handleBooleanChange = useCallback((fieldPath: string, value: boolean) => {
    handleArticulacionCraneomandibularChange(fieldPath, value);
  }, [handleArticulacionCraneomandibularChange]);

  // --- **NUEVA Generación de Redacción DINÁMICA para Labios** ---
  const generateLipsNarrative = useCallback(() => {
    setIsGeneratingLipsNarrative(true); // Inicia carga y habilita animación en useEffect
    clearLipsInterval(); // Limpia cualquier animación anterior
    // Resetear target inmediatamente causa que useEffect limpie el display
    setTargetLipsNarrative('');

    const data = formData.articulacionCraneomandibular?.labios || {};
    let sentences: string[] = [];

    // Construir frases basadas en la selección
    if (data.simetria && lipNarrativePhrases.simetria[data.simetria]) {
      sentences.push(lipNarrativePhrases.simetria[data.simetria]);
    }
    if (data.volumen && lipNarrativePhrases.volumen[data.volumen]) {
      sentences.push(lipNarrativePhrases.volumen[data.volumen]);
    }
    if (data.coloracion && lipNarrativePhrases.coloracion[data.coloracion]) {
      sentences.push(lipNarrativePhrases.coloracion[data.coloracion]);
    }
    if (data.hidratacion && lipNarrativePhrases.hidratacion[data.hidratacion]) {
      sentences.push(lipNarrativePhrases.hidratacion[data.hidratacion]);
    }
    // Manejar caso donde superficie (hidratacion) e integridad tengan 'fisuras'
    if (data.integridad && lipNarrativePhrases.integridad[data.integridad]) {
      const integridadPhrase = lipNarrativePhrases.integridad[data.integridad];
      // Solo añadir si es diferente de la frase de superficie O si superficie no mencionó fisuras
      if (data.integridad !== 'fisuras' || data.hidratacion !== 'fisuras') {
        // O si ambas son fisuras, pero queremos la descripción de integridad
        if (data.integridad === 'fisuras') {
          // Comprobar si la frase de superficie ya contenía la palabra clave, si no, añadirla
          const superficiePhrase = data.hidratacion ? lipNarrativePhrases.hidratacion[data.hidratacion] : '';
          if (!superficiePhrase || !superficiePhrase.toLowerCase().includes('fisura')) {
            sentences.push(integridadPhrase);
          }
          // Si la frase de superficie ya dijo fisuras, podríamos omitir esta o refinarla
        } else {
          sentences.push(integridadPhrase); // Añadir si no es fisuras
        }
      }
      // Nota: Se puede refinar más esta lógica si se quiere evitar redundancia entre superficie/integridad
    }
    if (data.comisuras && lipNarrativePhrases.comisuras[data.comisuras]) {
      sentences.push(lipNarrativePhrases.comisuras[data.comisuras]);
    }
    if (data.movimiento && lipNarrativePhrases.movimiento[data.movimiento]) {
      sentences.push(lipNarrativePhrases.movimiento[data.movimiento]);
    }
    let fullText = "";
    if (sentences.length > 0) {
      // Unir las frases. Asegurar que cada una termine en punto y la siguiente empiece con mayúscula.
      fullText = sentences.map(s => s.trim().replace(/\.$/, '')).join('. ') + '.';
    } else {
      fullText = "No se han seleccionado características específicas para la evaluación de labios.";
    }

    // Añadir observaciones adicionales si existen
    if (data.otrasObservaciones && data.otrasObservaciones.trim() !== '') {
      const observaciones = `Observaciones adicionales: ${data.otrasObservaciones.trim()}.`;
      if (fullText === "No se han seleccionado características específicas para la evaluación de labios.") {
        fullText = observaciones; // Si solo hay observaciones
      } else {
        fullText += " " + observaciones; // Añadir al texto existente
      }
    }

    setTargetLipsNarrative(fullText); // Establece el texto final, disparando el useEffect
    if (onRedaccionGenerada) {
      onRedaccionGenerada(fullText);
    }
    setLipsViewMode('narrative');
    // setIsGeneratingLipsNarrative(false) se establece en el useEffect al terminar
  }, [formData.articulacionCraneomandibular?.labios, clearLipsInterval]);

  // --- Render Helper para Botones ---
  const renderOptionButtons = useCallback((title: string, options: Option[], currentValue: string | undefined | null, fieldPath: string) => (
    <div>
      <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">{title}:</h4>
      <div className="flex flex-wrap gap-2 mb-4">
        {options.map(item => (
          <button
            key={`${fieldPath}-${item.value}`}
            type="button"
            className={`px-3 py-1 text-sm rounded-full transition-colors ${currentValue === item.value
              ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md ring-2 ring-emerald-300 dark:ring-emerald-700' // Añadido anillo para mejor visibilidad
              : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600' // Añadido borde sutil
              }`}
            onClick={() => handleOptionChange(fieldPath, item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  ), [handleOptionChange]);

  // --- JSX del Componente ---
  return (
    // Contenedor principal y Card (sin cambios significativos)
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : "my-4"}`} data-section-name="articulacionCraneomandibular">
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)]" : ""} ${isMinimized ? "h-16 overflow-hidden" : ""}`}>
        {/* Header (Sticky) - Updated to match ExamenCuello */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
              <button
                onClick={() => setActiveTab('formulario')}
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'formulario' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`}
              >
                Formulario
              </button>
              <button
                onClick={() => setActiveTab('redaccion')}
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'redaccion' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`}
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
            <button onClick={() => setActiveTab('formulario')} className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contenedor de Contenido Scrollable (si no está minimizado) */}
        <div className={`flex-grow overflow-y-auto ${isMinimized ? 'hidden' : ''}`}>
          {/* Título Principal */}
          <div className="flex justify-start px-6 pt-4 pb-2">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white tracking-tight">
              <span className="text-blue-500 dark:text-blue-400 font-semibold">XI.</span> ARTICULACIÓN CRANEOMANDIBULAR Y LABIOS
            </h2>
          </div>

          {/* Contenido Principal */}
          <div className="px-6 pb-6">
            {activeTab === 'formulario' ? (
              <div className="space-y-8">
                {/* --- ATM Formulario --- */}
                <section>
                  <div className="space-y-5">
                    {/* Dolor Masticar/Hablar */}
                    <div>
                      <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Dolor al masticar o hablar</h4>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          className={`px-4 py-1.5 rounded-md text-sm transition-colors shadow-sm ${formData.articulacionCraneomandibular?.dolorMasticarHablar === true ? 'bg-emerald-500 text-white hover:bg-emerald-600 ring-2 ring-emerald-300' : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'}`}
                          onClick={() => handleBooleanChange('dolorMasticarHablar', true)}
                        >
                          Sí
                        </button>
                        <button
                          type="button"
                          className={`px-4 py-1.5 rounded-md text-sm transition-colors shadow-sm ${formData.articulacionCraneomandibular?.dolorMasticarHablar === false ? 'bg-emerald-500 text-white hover:bg-emerald-600 ring-2 ring-emerald-300' : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'}`}
                          onClick={() => handleBooleanChange('dolorMasticarHablar', false)}
                        >
                          No
                        </button>
                      </div>
                    </div>
                    {/* Campos Condicionales Dolor */}
                    {formData.articulacionCraneomandibular?.dolorMasticarHablar === true && (
                      <div className="pl-4 border-l-2 border-emerald-300 dark:border-emerald-600 space-y-3 ml-1">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Tipo de dolor:</label>
                          <Textarea
                            value={formData.articulacionCraneomandibular?.tipoDolor || ''}
                            onChange={e => handleTextChange('tipoDolor', e)}
                            placeholder="Ej. punzante, sordo, opresivo..."
                            className="min-h-[50px] bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500 rounded-md shadow-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Duración:</label>
                          <Textarea
                            value={formData.articulacionCraneomandibular?.duracionDolor || ''}
                            onChange={e => handleTextChange('duracionDolor', e)}
                            placeholder="Ej. constante, intermitente..."
                            className="min-h-[50px] bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500 rounded-md shadow-sm"
                          />
                        </div>
                      </div>
                    )}
                    {/* Dolor Específico */}
                    <div>
                      <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Dificultad al hablar o masticar</h4>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          className={`px-4 py-1.5 rounded-md text-sm transition-colors shadow-sm ${formData.articulacionCraneomandibular?.dolorEspecifico === true ? 'bg-emerald-500 text-white hover:bg-emerald-600 ring-2 ring-emerald-300' : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'}`}
                          onClick={() => handleBooleanChange('dolorEspecifico', true)}
                        >
                          Sí
                        </button>
                        <button
                          type="button"
                          className={`px-4 py-1.5 rounded-md text-sm transition-colors shadow-sm ${formData.articulacionCraneomandibular?.dolorEspecifico === false ? 'bg-emerald-500 text-white hover:bg-emerald-600 ring-2 ring-emerald-300' : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'}`}
                          onClick={() => handleBooleanChange('dolorEspecifico', false)}
                        >
                          No
                        </button>
                      </div>
                    </div>
                    {/* Motivo Dolor */}
                    {formData.articulacionCraneomandibular?.dolorEspecifico === true && (
                      <div className="pl-4 border-l-2 border-emerald-300 dark:border-emerald-600 ml-1">
                        <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Motivo</label>
                        <Textarea
                          value={formData.articulacionCraneomandibular?.motivoDolor || ''}
                          onChange={e => handleTextChange('motivoDolor', e)}
                          placeholder="Ej. preauricular, masetero..."
                          className="min-h-[50px] bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500 rounded-md shadow-sm"
                        />
                      </div>
                    )}
                    {/* Ruido Articular */}
                    {renderOptionButtons("Ruido articular", ruidoArticularOptions, formData.articulacionCraneomandibular?.ruidoArticular, 'ruidoArticular')}
                    {/* Patrón Abertura */}
                    {renderOptionButtons("Patrón de apertura mandibular", patronAberturaOptions, formData.articulacionCraneomandibular?.patronAbertura, 'patronAbertura')}
                    {/* Otro Patrón */}
                    {formData.articulacionCraneomandibular?.patronAbertura === 'otro' && (
                      <div className="pl-4 border-l-2 border-blue-300 dark:border-blue-600 ml-1">
                        <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Especifique otro patrón:</label>
                        <Textarea
                          value={formData.articulacionCraneomandibular?.otroPatronAbertura || ''}
                          onChange={e => handleTextChange('otroPatronAbertura', e)}
                          placeholder="Describa el patrón observado"
                          className="min-h-[50px] bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                        />
                      </div>
                    )}
                    {/* Observaciones ATM */}
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Otras observaciones (ATM):</label>
                      <Textarea
                        value={formData.articulacionCraneomandibular?.otrasObservaciones || ''}
                        onChange={e => handleTextChange('otrasObservaciones', e)}
                        placeholder="Cualquier otro hallazgo relevante sobre la ATM..."
                        className="min-h-[70px] bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                      />
                    </div>
                  </div>
                </section>

                {/* --- Labios Formulario / Narrativa --- */}
                <section>
                  <div className="mb-4 border-t border-gray-300 dark:border-gray-600 pt-6">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Labios</h3>
                  </div>

                  {/* Contenido Labios */}
                  {lipsViewMode === 'form' ? (
                    <div className="space-y-5">
                      {/* Pasar 'labios.hidratacion' como path para superficie */}
                      {renderOptionButtons("Simetría", simetriaOptions, formData.articulacionCraneomandibular?.labios?.simetria, 'labios.simetria')}
                      {renderOptionButtons("Volumen", volumenOptions, formData.articulacionCraneomandibular?.labios?.volumen, 'labios.volumen')}
                      {renderOptionButtons("Coloración", coloracionOptions, formData.articulacionCraneomandibular?.labios?.coloracion, 'labios.coloracion')}
                      {renderOptionButtons("Superficie", superficieOptions, formData.articulacionCraneomandibular?.labios?.hidratacion, 'labios.hidratacion')}
                      {renderOptionButtons("Integridad Mucosa", integridadOptions, formData.articulacionCraneomandibular?.labios?.integridad, 'labios.integridad')}
                      {renderOptionButtons("Comisuras", comisurasOptions, formData.articulacionCraneomandibular?.labios?.comisuras, 'labios.comisuras')}
                      {renderOptionButtons("Función (Movimiento)", movimientoOptions, formData.articulacionCraneomandibular?.labios?.movimiento, 'labios.movimiento')}
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Otras observaciones (Labios):</label>
                        <Textarea
                          value={formData.articulacionCraneomandibular?.labios?.otrasObservaciones || ''}
                          onChange={e => handleTextChange('labios.otrasObservaciones', e)}
                          placeholder="Cualquier otro hallazgo relevante sobre los labios..."
                          className="min-h-[70px] bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                        />
                      </div>

                      {/* Botón Generar Redacción IA al final */}
                      <div className="flex justify-end pt-4">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={generateLipsNarrative}
                          disabled={isGeneratingLipsNarrative}
                          className="flex items-center gap-2"
                        >
                          {isGeneratingLipsNarrative ? (
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                          {isGeneratingLipsNarrative ? 'Generando...' : 'Generar Redacción IA'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-end mb-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setLipsViewMode('form')}
                          disabled={isGeneratingLipsNarrative}
                          className="flex items-center gap-1.5"
                        >
                          <Edit className="w-4 h-4" /> Editar
                        </Button>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[120px] shadow-inner">
                        <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                          {displayedLipsNarrative}
                          {/* Cursor solo si está animando */}
                          {isGeneratingLipsNarrative && lipsIntervalRef.current && (
                            <span className="inline-block w-1 h-4 bg-gray-800 dark:bg-gray-200 animate-pulse ml-px"></span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </section>

                <div className="flex justify-center mt-6 pb-6">
                  {onToggleViewMode && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Generar Redacción Completa Logic
                        const atm = formData.articulacionCraneomandibular || {};
                        let text = "ARTICULACIÓN CRANEOMANDIBULAR:\n";
                        if (atm.dolorMasticarHablar) {
                          text += `Presenta dolor al masticar o hablar, descrito como ${atm.tipoDolor || 'no especificado'} de duración ${atm.duracionDolor || 'no especificada'}.\n`;
                        } else {
                          text += "Sin dolor al masticar o hablar.\n";
                        }
                        if (atm.dolorEspecifico) {
                          text += `Refiere dificultad específica al hablar/masticar por ${atm.motivoDolor || 'motivo no especificado'}.\n`;
                        }
                        if (atm.ruidoArticular) text += `Ruido articular presente: ${atm.ruidoArticular === 'abertura' ? 'a la apertura' : atm.ruidoArticular === 'cierre' ? 'al cierre' : 'ninguno'}.\n`;
                        if (atm.patronAbertura) text += `Patrón de apertura: ${atm.patronAbertura === 'otro' ? (atm.otroPatronAbertura || 'otro') : atm.patronAbertura}.\n`;
                        if (atm.otrasObservaciones) text += `Observaciones ATM: ${atm.otrasObservaciones}\n`;

                        text += "\nLABIOS:\n";
                        // Reuse logic or simplify for full redaction
                        const labios = atm.labios || {};
                        let labText = "";
                        if (labios.simetria) labText += `${lipNarrativePhrases.simetria[labios.simetria] || ''} `;
                        if (labios.volumen) labText += `${lipNarrativePhrases.volumen[labios.volumen] || ''} `;
                        if (labios.coloracion) labText += `${lipNarrativePhrases.coloracion[labios.coloracion] || ''} `;
                        if (labios.hidratacion) labText += `${lipNarrativePhrases.hidratacion[labios.hidratacion] || ''} `;
                        if (labios.integridad) labText += `${lipNarrativePhrases.integridad[labios.integridad] || ''} `;
                        if (labios.comisuras) labText += `${lipNarrativePhrases.comisuras[labios.comisuras] || ''} `;
                        if (labios.movimiento) labText += `${lipNarrativePhrases.movimiento[labios.movimiento] || ''} `;
                        if (labios.otrasObservaciones) labText += `Observaciones Labios: ${labios.otrasObservaciones}`;

                        text += labText || "Sin hallazgos significativos en labios.";

                        setFullRedaccion(text);
                        if (onRedaccionGenerada) onRedaccionGenerada(text);
                        setActiveTab('redaccion');
                        onToggleViewMode();
                      }}
                      className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Ver Redacción IA
                    </Button>
                  )}
                </div>

              </div>
            ) : (
              <div className="p-6">
                <div
                  className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 min-h-[200px] whitespace-pre-wrap"
                  style={{
                    whiteSpace: "pre-wrap",
                  }}
                  data-redaction-content
                >
                  {fullRedaccion ||
                    "No se ha generado redacción aún. Utilice el botón 'Ver Redacción IA' en la pestaña de Formulario."}
                </div>
              </div>
            )}
          </div>
        </div> {/* Fin Contenedor Scrollable */}
      </Card >
    </div >
  );
};

export default ArticulacionCraneomandibular;
