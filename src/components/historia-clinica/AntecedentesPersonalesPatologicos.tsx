import React, { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Minus, Maximize2, X } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import Otra from './Otra';

interface AntecedentesPersonalesPatologicosProps {
  formData: FormDataState;
  handleAntecedentePatologicoChange: (field: string, value: any) => void;
}

const AntecedentesPersonalesPatologicos: React.FC<AntecedentesPersonalesPatologicosProps> = ({
  formData,
  handleAntecedentePatologicoChange
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState('formulario');
  const [redaccionContent, setRedaccionContent] = useState('');
  const [isGeneratingRedaccion, setIsGeneratingRedaccion] = useState(false);
  const [focusStatus, setFocusStatus] = useState<{ [key: string]: boolean }>({});
  const inputRefs = useRef<{ [key: string]: React.RefObject<HTMLInputElement> }>({});
  const [sinPatologia, setSinPatologia] = useState(false);

  useEffect(() => {
    inputRefs.current = {
      nutricionales: inputRefs.current.nutricionales || React.createRef(),
      cardiacos: inputRefs.current.cardiacos || React.createRef(),
      hepaticos: inputRefs.current.hepaticos || React.createRef(),
      enfermedadesTransmisionSexual: inputRefs.current.enfermedadesTransmisionSexual || React.createRef(),
      enfermedadesEruptivas: inputRefs.current.enfermedadesEruptivas || React.createRef(),
      pulmonares: inputRefs.current.pulmonares || React.createRef(),
      infecciosasParasitarias: inputRefs.current.infecciosasParasitarias || React.createRef(),
      otrosPadecimientos: inputRefs.current.otrosPadecimientos || React.createRef(),
    };
  }, []);

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

  const handleCheckboxChange = (categoria: string, enfermedad: string, value: boolean) => {
    handleAntecedentePatologicoChange(`${categoria}.${enfermedad}`, value);
  };

  const handleOtraDescripcionChange = (categoria: string, value: string) => {
    handleAntecedentePatologicoChange(`${categoria}.otraDescripcion`, value);
  };

  const handleNingunaChange = (categoria: string) => {
    const newState = {
      ...formData.antecedentesPersonalesPatologicos[categoria],
      ninguna: !formData.antecedentesPersonalesPatologicos[categoria]?.ninguna,
    };

    Object.keys(newState).forEach(key => {
      if (key !== 'ninguna' && key !== 'otraDescripcion') {
        newState[key] = false;
      }
    });

    handleAntecedentePatologicoChange(categoria, newState);
  };

  const handleOtraChange = (categoria: string) => {
    const newState = {
      ...formData.antecedentesPersonalesPatologicos[categoria],
      otra: !formData.antecedentesPersonalesPatologicos[categoria]?.otra,
    };

    handleAntecedentePatologicoChange(categoria, newState);
    if (!formData.antecedentesPersonalesPatologicos[categoria]?.otra) {
      setTimeout(() => {
        inputRefs.current[categoria]?.current?.focus();
      }, 100);
    }
  };

  const opcionesNutricionales = [
    { valor: 'anorexia', etiqueta: 'Anorexia' },
    { valor: 'bulimia', etiqueta: 'Bulimia' },
    { valor: 'sobrepeso', etiqueta: 'Sobrepeso' },
    { valor: 'obesidad', etiqueta: 'Obesidad' },
  ];

  const opcionesCardiacos = [
    { valor: 'enfermedadCoronaria', etiqueta: 'Enfermedad Coronaria' },
    { valor: 'arritmias', etiqueta: 'Arritmias' },
    { valor: 'defectosCardiacosCongenitos', etiqueta: 'Defectos Cardíacos Congénitos' },
  ];

  const opcionesHepaticos = [
    { valor: 'hepatitisA', etiqueta: 'Hepatitis A' },
    { valor: 'hepatitisB', etiqueta: 'Hepatitis B' },
    { valor: 'hepatitisC', etiqueta: 'Hepatitis C' },
    { valor: 'higadoGraso', etiqueta: 'Hígado Graso' },
    { valor: 'cirrosis', etiqueta: 'Cirrosis' },
  ];

  const opcionesTransmisionSexual = [
    { valor: 'vih', etiqueta: 'VIH' },
    { valor: 'sifilis', etiqueta: 'Sífilis' },
    { valor: 'gonorrea', etiqueta: 'Gonorrea' },
    { valor: 'herpesGenital', etiqueta: 'Herpes Genital' },
    { valor: 'vph', etiqueta: 'VPH' },
  ];

  const opcionesEruptivas = [
    { valor: 'sarampion', etiqueta: 'Sarampión' },
    { valor: 'rubeola', etiqueta: 'Rubéola' },
    { valor: 'escarlatina', etiqueta: 'Escarlatina' },
    { valor: 'varicela', etiqueta: 'Varicela' },
    { valor: 'paperas', etiqueta: 'Paperas' },
  ];

  const opcionesPulmonares = [
    { valor: 'neumonia', etiqueta: 'Neumonía' },
    { valor: 'bronquitis', etiqueta: 'Bronquitis' },
    { valor: 'asma', etiqueta: 'Asma' },
    { valor: 'epoc', etiqueta: 'EPOC' },
  ];

  const opcionesInfecciosasParasitarias = [
    { valor: 'fiebreTifoidea', etiqueta: 'Fiebre Tifoidea' },
    { valor: 'tuberculosis', etiqueta: 'Tuberculosis' },
    { valor: 'amibiasis', etiqueta: 'Amibiasis' },
    { valor: 'giardiasis', etiqueta: 'Giardiasis' },
    { valor: 'ascariasis', etiqueta: 'Ascariasis' },
  ];

  const generateRedaccion = () => {
    setIsGeneratingRedaccion(true);
    setTimeout(() => {
      let content = "ANTECEDENTES PERSONALES PATOLÓGICOS:\n\n";

      // Nutricionales
      content += "Nutricionales: ";
      if (formData.antecedentesPersonalesPatologicos.nutricionales?.ninguna) {
        content += "Ninguno.\n";
      } else {
        const nutricionales = opcionesNutricionales
          .filter(opcion => formData.antecedentesPersonalesPatologicos.nutricionales?.[opcion.valor])
          .map(opcion => opcion.etiqueta);
        if (nutricionales.length > 0) {
          content += nutricionales.join(', ') + '.\n';
        } else {
          content += "Ninguno.\n";
        }
        if (formData.antecedentesPersonalesPatologicos.nutricionales?.otra) {
          content += `Otra condición nutricional: ${formData.antecedentesPersonalesPatologicos.nutricionales?.otraDescripcion || 'No especificado'}.\n`;
        }
      }

      // Cardiacos
      content += "Cardíacos: ";
      if (formData.antecedentesPersonalesPatologicos.cardiacos?.ninguna) {
        content += "Ninguno.\n";
      } else {
        const cardiacos = opcionesCardiacos
          .filter(opcion => formData.antecedentesPersonalesPatologicos.cardiacos?.[opcion.valor])
          .map(opcion => opcion.etiqueta);
        if (cardiacos.length > 0) {
          content += cardiacos.join(', ') + '.\n';
        } else {
          content += "Ninguno.\n";
        }
        if (formData.antecedentesPersonalesPatologicos.cardiacos?.otra) {
          content += `Otra condición cardíaca: ${formData.antecedentesPersonalesPatologicos.cardiacos?.otraDescripcion || 'No especificado'}.\n`;
        }
      }

      // Hepaticos
      content += "Hepáticos: ";
      if (formData.antecedentesPersonalesPatologicos.hepaticos?.ninguna) {
        content += "Ninguno.\n";
      } else {
        const hepaticos = opcionesHepaticos
          .filter(opcion => formData.antecedentesPersonalesPatologicos.hepaticos?.[opcion.valor])
          .map(opcion => opcion.etiqueta);
        if (hepaticos.length > 0) {
          content += hepaticos.join(', ') + '.\n';
        } else {
          content += "Ninguno.\n";
        }
        if (formData.antecedentesPersonalesPatologicos.hepaticos?.otra) {
          content += `Otra condición hepática: ${formData.antecedentesPersonalesPatologicos.hepaticos?.otraDescripcion || 'No especificado'}.\n`;
        }
      }

      // ETS
      content += "Enfermedades de Transmisión Sexual: ";
      if (formData.antecedentesPersonalesPatologicos.enfermedadesTransmisionSexual?.ninguna) {
        content += "Ninguno.\n";
      } else {
        const ets = opcionesTransmisionSexual
          .filter(opcion => formData.antecedentesPersonalesPatologicos.enfermedadesTransmisionSexual?.[opcion.valor])
          .map(opcion => opcion.etiqueta);
        if (ets.length > 0) {
          content += ets.join(', ') + '.\n';
        } else {
          content += "Ninguno.\n";
        }
        if (formData.antecedentesPersonalesPatologicos.enfermedadesTransmisionSexual?.otra) {
          content += `Otra ETS: ${formData.antecedentesPersonalesPatologicos.enfermedadesTransmisionSexual?.otraDescripcion || 'No especificado'}.\n`;
        }
      }

      // Eruptivas
      content += "Enfermedades Eruptivas: ";
      if (formData.antecedentesPersonalesPatologicos.enfermedadesEruptivas?.ninguna) {
        content += "Ninguno.\n";
      } else {
        const eruptivas = opcionesEruptivas
          .filter(opcion => formData.antecedentesPersonalesPatologicos.enfermedadesEruptivas?.[opcion.valor])
          .map(opcion => opcion.etiqueta);
        if (eruptivas.length > 0) {
          content += eruptivas.join(', ') + '.\n';
        } else {
          content += "Ninguno.\n";
        }
        if (formData.antecedentesPersonalesPatologicos.enfermedadesEruptivas?.otra) {
          content += `Otra enfermedad eruptiva: ${formData.antecedentesPersonalesPatologicos.enfermedadesEruptivas?.otraDescripcion || 'No especificado'}.\n`;
        }
      }

      // Pulmonares
      content += "Pulmonares: ";
      if (formData.antecedentesPersonalesPatologicos.pulmonares?.ninguna) {
        content += "Ninguno.\n";
      } else {
        const pulmonares = opcionesPulmonares
          .filter(opcion => formData.antecedentesPersonalesPatologicos.pulmonares?.[opcion.valor])
          .map(opcion => opcion.etiqueta);
        if (pulmonares.length > 0) {
          content += pulmonares.join(', ') + '.\n';
        } else {
          content += "Ninguno.\n";
        }
        if (formData.antecedentesPersonalesPatologicos.pulmonares?.otra) {
          content += `Otra condición pulmonar: ${formData.antecedentesPersonalesPatologicos.pulmonares?.otraDescripcion || 'No especificado'}.\n`;
        }
      }

      // Infecciosas/Parasitarias
      content += "Infecciosas/Parasitarias: ";
      if (formData.antecedentesPersonalesPatologicos.infecciosasParasitarias?.ninguna) {
        content += "Ninguno.\n";
      } else {
        const infecciosasParasitarias = opcionesInfecciosasParasitarias
          .filter(opcion => formData.antecedentesPersonalesPatologicos.infecciosasParasitarias?.[opcion.valor])
          .map(opcion => opcion.etiqueta);
        if (infecciosasParasitarias.length > 0) {
          content += infecciosasParasitarias.join(', ') + '.\n';
        } else {
          content += "Ninguno.\n";
        }
        if (formData.antecedentesPersonalesPatologicos.infecciosasParasitarias?.otra) {
          content += `Otra condición infecciosa/parasitaria: ${formData.antecedentesPersonalesPatologicos.infecciosasParasitarias?.otraDescripcion || 'No especificado'}.\n`;
        }
      }

      // Otros padecimientos
      if (formData.antecedentesPersonalesPatologicos.otrosPadecimientos?.ninguna) {
        content += "Otros padecimientos: Ninguno.\n";
      } else if (formData.antecedentesPersonalesPatologicos.otrosPadecimientos?.otra) {
        content += `Otros padecimientos: ${formData.antecedentesPersonalesPatologicos.otrosPadecimientos?.otraDescripcion || 'No especificado'}.\n`;
      } else {
        content += "Otros padecimientos: Ninguno.\n";
      }

      setRedaccionContent(content);
      setIsGeneratingRedaccion(false);
      setActiveTab('redaccion');
    }, 1000);
  };

  const OpcionPatologica = ({ categoria, valor, etiqueta }: { categoria: string, valor: string, etiqueta: string }) => {
    const isNinguna = valor === 'ninguna';
    const isOtra = valor === 'otra';
    const checked = isNinguna
      ? formData.antecedentesPersonalesPatologicos[categoria]?.ninguna
      : isOtra
        ? formData.antecedentesPersonalesPatologicos[categoria]?.otra
        : formData.antecedentesPersonalesPatologicos[categoria]?.[valor];

    const handleChange = () => {
      if (isNinguna) {
        handleNingunaChange(categoria);
      } else if (isOtra) {
        handleOtraChange(categoria);
      } else {
        handleCheckboxChange(categoria, valor, !checked);
      }
    };

    return (
      <label className={`inline-flex items-center space-x-2 rounded-full px-3 py-1 text-sm font-medium transition-colors 
        ${checked ? 'bg-blue-500 text-white hover:bg-blue-400' : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-700'}
        ${isNinguna ? 'order-first' : ''}
      `}>
        <Checkbox
          id={`${categoria}-${valor}`}
          checked={checked}
          onCheckedChange={handleChange}
          disabled={formData.antecedentesPersonalesPatologicos[categoria]?.ninguna && !checked}
        />
        <span>{etiqueta}</span>
      </label>
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
            <Otra
              inputRef={inputRefs.current[categoria]}
              value={formData.antecedentesPersonalesPatologicos[categoria]?.otraDescripcion || ''}
              onChange={(val: string) => handleOtraDescripcionChange(categoria, val)}
              onFocus={() => setFocusStatus(prev => ({ ...prev, [categoria]: true }))}
              onBlur={() => setFocusStatus(prev => ({ ...prev, [categoria]: false }))}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`} data-section-redaction="true" data-section-name="antecedentesPersonalesPatologicos">
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
              <button
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'formulario' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`}
                onClick={() => setActiveTab('formulario')}
              >
                Formulario
              </button>
              <button
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${activeTab === 'redaccion' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`}
                onClick={() => setActiveTab('redaccion')}
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

        <div className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">IV.</span> ANTECEDENTES PERSONALES PATOLÓGICOS
          </h2>
        </div>

        {!isMinimized && (
          <>
            {activeTab === 'formulario' ? (
              <div className="p-6 space-y-4">
                <label className="inline-flex items-center space-x-2">
                  <Checkbox id="sinPatologia" checked={sinPatologia} onCheckedChange={() => setSinPatologia(!sinPatologia)} />
                  <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Sin patología aparente
                  </span>
                </label>

                <CategoriaPatologica
                  categoria="nutricionales"
                  titulo="Nutricionales"
                  opciones={opcionesNutricionales}
                />

                <CategoriaPatologica
                  categoria="cardiacos"
                  titulo="Cardíacos"
                  opciones={opcionesCardiacos}
                />

                <CategoriaPatologica
                  categoria="hepaticos"
                  titulo="Hepáticos"
                  opciones={opcionesHepaticos}
                />

                <CategoriaPatologica
                  categoria="enfermedadesTransmisionSexual"
                  titulo="Enfermedades de Transmisión Sexual"
                  opciones={opcionesTransmisionSexual}
                />

                <CategoriaPatologica
                  categoria="enfermedadesEruptivas"
                  titulo="Enfermedades Eruptivas"
                  opciones={opcionesEruptivas}
                />

                <CategoriaPatologica
                  categoria="pulmonares"
                  titulo="Pulmonares"
                  opciones={opcionesPulmonares}
                />

                <CategoriaPatologica
                  categoria="infecciosasParasitarias"
                  titulo="Infecciosas/Parasitarias"
                  opciones={opcionesInfecciosasParasitarias}
                />

                <div className={`bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 ${sinPatologia ? "hidden" : ""}`}>
                  <h4 className="text-lg font-semibold mb-3">Otros padecimientos</h4>
                  <div className="flex flex-wrap gap-2">
                    <OpcionPatologica
                      categoria="otrosPadecimientos"
                      valor="ninguna"
                      etiqueta="Ninguna"
                    />
                    <OpcionPatologica
                      categoria="otrosPadecimientos"
                      valor="otra"
                      etiqueta="Otra"
                    />
                    {formData.antecedentesPersonalesPatologicos.otrosPadecimientos?.otra && (
                      <Otra
                        inputRef={inputRefs.current.otrosPadecimientos}
                        value={formData.antecedentesPersonalesPatologicos.otrosPadecimientos?.otraDescripcion || ''}
                        onChange={(val: string) => handleOtraDescripcionChange("otrosPadecimientos", val)}
                        onFocus={() => setFocusStatus(prev => ({ ...prev, otrosPadecimientos: true }))}
                        onBlur={() => setFocusStatus(prev => ({ ...prev, otrosPadecimientos: false }))}
                      />
                    )}
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    onClick={generateRedaccion}
                    disabled={isGeneratingRedaccion}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    {isGeneratingRedaccion ? 'Generando Redacción...' : 'Generar Redacción IA'}
                  </button>
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

export default AntecedentesPersonalesPatologicos;
