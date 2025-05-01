import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X, Edit, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
  label: "Coloración rosada",
  value: "normal"
}, {
  label: "Coloración pálida",
  value: "palidos"
}, {
  label: "Coloración cianótica",
  value: "cianoticos"
}, {
  label: "Coloración eritematosa",
  value: "eritematosos"
}];
// Renombrado 'hidratacion' a 'superficie' para claridad en las opciones
const superficieOptions: Option[] = [{
  label: "Superficie hidratada",
  value: "hidratados"
}, {
  label: "Superficie seca",
  value: "secos"
}, {
  label: "Superficie agrietada",
  value: "agrietados"
}, {
  label: "Presencia de costras",
  value: "costras"
}, {
  label: "Superficie con fisuras",
  value: "fisuras"
}];
const integridadOptions: Option[] = [{
  label: "Íntegra",
  value: "intactos"
}, {
  label: "Con heridas superficiales",
  value: "heridas"
}, {
  label: "Con ulceraciones",
  value: "ulceraciones"
}, {
  label: "Con fisuras",
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
  label: "Con queilitis angular",
  value: "queilitis"
}];
const movimientoOptions: Option[] = [{
  label: "Movimientos conservados",
  value: "normales"
}, {
  label: "Restricción de movimiento",
  value: "restriccion"
}, {
  label: "Incompetencia labial",
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
  label: "A la apertura",
  value: "abertura"
}, {
  label: "Al cierre",
  value: "cierre"
}, {
  label: "No presenta",
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
const ArticulacionCraneomandibular: React.FC = () => {
  const [formData, setFormData] = useState<ArticulacionCraneomandibularState>(initialState);

  // Estados UI
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState('formulario');
  const [lipsViewMode, setLipsViewMode] = useState<'form' | 'narrative'>('form');

  // Estados y Refs para Typewriter y Carga
  const [isGeneratingLipsNarrative, setIsGeneratingLipsNarrative] = useState(false);
  const [targetLipsNarrative, setTargetLipsNarrative] = useState('');
  const [displayedLipsNarrative, setDisplayedLipsNarrative] = useState('');
  const lipsIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typewriterSpeed = 35; // Velocidad de escritura (ms por caracter)

  // --- Funciones de Limpieza de Intervalos ---
  const clearLipsInterval = useCallback(() => {
    if (lipsIntervalRef.current) {
      clearInterval(lipsIntervalRef.current);
      lipsIntervalRef.current = null;
      // console.log("Lips interval cleared"); // Log para debugging si es necesario
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
          // console.log("Lips narrative finished animating"); // Log para debugging
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
  const handleArticulacionCraneomandibularChange = useCallback((fieldPath: string, value: any) => {
    setFormData(prevData => {
      const parts = fieldPath.split('.');
      const newState = structuredClone(prevData); // Copia profunda
      let currentLevel: any = newState;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        // Asegurar que el nivel exista
        if (currentLevel[part] === undefined || typeof currentLevel[part] !== 'object' || currentLevel[part] === null) {
          currentLevel[part] = {};
        }
        currentLevel = currentLevel[part];
      }
      currentLevel[parts[parts.length - 1]] = value;
      return newState;
    });
  }, []); // useCallback sin dependencias externas

  const handleOptionChange = useCallback((fieldPath: string, value: string) => {
    handleArticulacionCraneomandibularChange(fieldPath, value);
  }, [handleArticulacionCraneomandibularChange]);
  const handleTextChange = useCallback((fieldPath: string, e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleArticulacionCraneomandibularChange(fieldPath, e.target.value);
  }, [handleArticulacionCraneomandibularChange]);
  const handleBooleanChange = useCallback((fieldPath: string, value: boolean) => {
    handleArticulacionCraneomandibularChange(fieldPath, value);
  }, [handleArticulacionCraneomandibularChange]);

  // --- **NUEVA Generación de Redacción DINÁMICA para Labios** ---
  const generateLipsNarrative = useCallback(() => {
    // console.log("Generating lips narrative..."); // Log para debugging
    setIsGeneratingLipsNarrative(true); // Inicia carga y habilita animación en useEffect
    clearLipsInterval(); // Limpia cualquier animación anterior
    // Resetear target inmediatamente causa que useEffect limpie el display
    setTargetLipsNarrative('');
    // No es necesario setDisplayedLipsNarrative aquí, useEffect lo manejará

    const data = formData.labios || {};
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

    // console.log("Target narrative:", fullText); // Log para debugging
    setTargetLipsNarrative(fullText); // Establece el texto final, disparando el useEffect
    setLipsViewMode('narrative');
    // setIsGeneratingLipsNarrative(false) se establece en el useEffect al terminar
  }, [formData.labios, clearLipsInterval]);

  // --- Reset Form ---
  const resetForm = useCallback(() => {
    setFormData(initialState);
    setLipsViewMode('form');
    clearLipsInterval();
    setTargetLipsNarrative(''); // Limpiar target
    // setDisplayedLipsNarrative(''); // No es necesario, useEffect lo hará
    setIsGeneratingLipsNarrative(false); // Asegurar que no esté cargando
    setActiveTab('formulario');
  }, [clearLipsInterval]);

  // --- Render Helper para Botones ---
  const renderOptionButtons = useCallback((title: string, options: Option[], currentValue: string | undefined | null, fieldPath: string) => <div>
            <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">{title}:</h4>
            <div className="flex flex-wrap gap-2 mb-4">
                {options.map(item => <button key={`${fieldPath}-${item.value}`} type="button" className={`px-3 py-1 text-sm rounded-full transition-colors ${currentValue === item.value ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md ring-2 ring-emerald-300 dark:ring-emerald-700' // Añadido anillo para mejor visibilidad
      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600' // Añadido borde sutil
      }`} onClick={() => handleOptionChange(fieldPath, item.value)}>
                        {item.label}
                    </button>)}
            </div>
        </div>, [handleOptionChange]);

  // --- JSX del Componente ---
  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`} data-section-redaction="true" data-section-name="articulacionCraneomandibular">
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
              <button className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'formulario' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`} onClick={() => setActiveTab('formulario')}>
                Formulario
              </button>
              <button className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'redaccion' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`} onClick={() => setActiveTab('redaccion')}>
                Redacción IA
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleMinimize} className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors" type="button">
              <Minus className="w-4 h-4" />
            </button>
            <button onClick={handleMaximize} className="p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors" type="button">
              <Maximize2 className="w-4 h-4" />
            </button>
            <button onClick={handleClose} className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors" type="button">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">XI.</span> ARTICULACIÓN CRANEOMANDIBULAR Y LABIOS
          </h2>
        </div>

        {!isMinimized && (
          <>
            {activeTab === 'formulario' ? (
              <div className="p-6">
                <div className="space-y-6">
                  {/* Contenido del formulario */}
                  {/* ... (resto del contenido del formulario) */}

                  {/* Botón "Redacción Labios" con efecto pegajoso */}
                  <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 z-10">
                    {lipsViewMode === 'form' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={generateLipsNarrative}
                        disabled={isGeneratingLipsNarrative}
                        className={`flex items-center gap-1.5 ${isGeneratingLipsNarrative ? 'text-gray-500 cursor-not-allowed' : 'text-blue-600 dark:text-blue-400 border-blue-500/50 dark:border-blue-400/50 hover:bg-blue-50 dark:hover:bg-blue-900/30'}`}
                      >
                        {isGeneratingLipsNarrative ? (
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                        {isGeneratingLipsNarrative ? 'Generando...' : 'Redacción Labios'}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLipsViewMode('form')}
                        disabled={isGeneratingLipsNarrative}
                        className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 border-gray-400/50 dark:border-gray-500/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 disabled:opacity-50"
                      >
                        <Edit className="w-4 h-4" /> Editar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 min-h-[200px] whitespace-pre-wrap" style={{ whiteSpace: 'pre-wrap' }} data-redaction-content>
                  {redaccionContent || "No se ha generado redacción aún. Utilice el botón 'Generar Redacción IA' en la pestaña de Formulario."}
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default ArticulacionCraneomandibular;
