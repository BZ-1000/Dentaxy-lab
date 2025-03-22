
import React, { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Minus, Maximize2, X, Eraser, Copy, CheckCircle } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { ConfirmationAlert } from "@/components/ui/confirmation-alert";

interface AntecedentesPersonalesPatologicosProps {
  formData: FormDataState;
  handleAntecedentePatologicoChange: (field: string, value: any) => void;
}

const AntecedentesPersonalesPatologicos = ({ 
  formData, 
  handleAntecedentePatologicoChange 
}: AntecedentesPersonalesPatologicosProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showRedaccion, setShowRedaccion] = useState(false);
  const [redaccionIA, setRedaccionIA] = useState("");
  const [copied, setCopied] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [progress, setProgress] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);
  const redaccionRef = useRef(null);

  const enfermedadesTrasmisibles = [
    { id: 'hepatitisA', label: 'Hepatitis A' },
    { id: 'hepatitisB', label: 'Hepatitis B' },
    { id: 'hepatitisC', label: 'Hepatitis C' },
    { id: 'vih', label: 'VIH' },
    { id: 'tuberculosis', label: 'Tuberculosis' },
    { id: 'gonorrea', label: 'Gonorrea' },
    { id: 'sifilis', label: 'Sífilis' },
    { id: 'influenza', label: 'Influenza' },
    { id: 'covid19', label: 'COVID-19' },
  ];

  const enfermedadesNoTrasmisibles = [
    { id: 'diabetesMellitus', label: 'Diabetes Mellitus' },
    { id: 'hipertensionArterial', label: 'Hipertensión Arterial' },
    { id: 'cardiopatias', label: 'Cardiopatías' },
    { id: 'nefropatias', label: 'Nefropatías' },
    { id: 'endocrinopatias', label: 'Endocrinopatías' },
    { id: 'trastornosInmunologicos', label: 'Trastornos Inmunológicos' },
    { id: 'trastornosHematologicos', label: 'Trastornos Hematológicos' },
    { id: 'trastornosNeurologicos', label: 'Trastornos Neurológicos' },
    { id: 'sindromeConvulsivo', label: 'Síndrome Convulsivo' },
    { id: 'trastornosGastrointestinales', label: 'Trastornos Gastrointestinales' },
    { id: 'trastornosPsiquiatricos', label: 'Trastornos Psiquiátricos' },
    { id: 'cancer', label: 'Cáncer' },
  ];

  const enfermedadesActuales = Object.entries(formData.antecedentesPersonalesPatologicos.enfermedadesTrasmisibles)
    .filter(([_, value]) => value === true)
    .map(([key]) => {
      return enfermedadesTrasmisibles.find(e => e.id === key)?.label || key;
    });

  const enfermedadesCronicas = Object.entries(formData.antecedentesPersonalesPatologicos.enfermedadesNoTrasmisibles)
    .filter(([_, value]) => value === true)
    .map(([key]) => {
      return enfermedadesNoTrasmisibles.find(e => e.id === key)?.label || key;
    });

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

  const validarFormulario = () => {
    const faltantes = [];
    const app = formData.antecedentesPersonalesPatologicos;
    
    // Validar si hay enfermedades seleccionadas
    const tieneEnfermedadesTrasmisibles = Object.values(app.enfermedadesTrasmisibles).some(value => value === true);
    const tieneEnfermedadesNoTrasmisibles = Object.values(app.enfermedadesNoTrasmisibles).some(value => value === true);
    
    // Si tiene ambas como false pero existe tratamiento actual
    if (!tieneEnfermedadesTrasmisibles && !tieneEnfermedadesNoTrasmisibles && app.tratamientoActual) {
      faltantes.push('Enfermedades (si recibe tratamiento debe seleccionar al menos una enfermedad)');
    }
    
    // Si hay enfermedades seleccionadas pero no se ha indicado si está en tratamiento
    if ((tieneEnfermedadesTrasmisibles || tieneEnfermedadesNoTrasmisibles) && app.tratamientoActual === "") {
      faltantes.push('Tratamiento médico actual (indique si está recibiendo tratamiento)');
    }
    
    return faltantes;
  };

  const validarYGenerarRedaccion = () => {
    const camposFaltantes = validarFormulario();
    
    if (camposFaltantes.length > 0) {
      setCamposFaltantes(camposFaltantes);
      setAlertOpen(true);
    } else {
      generarRedaccionIA();
    }
  };

  const generarRedaccionIA = () => {
    const app = formData.antecedentesPersonalesPatologicos;
    
    // Primera parte - Introducción general
    let introduccion = '';
    
    const tieneEnfermedadesTrasmisibles = Object.values(app.enfermedadesTrasmisibles).some(value => value === true);
    const tieneEnfermedadesNoTrasmisibles = Object.values(app.enfermedadesNoTrasmisibles).some(value => value === true);
    
    if (!tieneEnfermedadesTrasmisibles && !tieneEnfermedadesNoTrasmisibles) {
      introduccion = 'El paciente niega antecedentes personales patológicos. No refiere diagnóstico de enfermedades transmisibles ni crónico-degenerativas.';
    } else {
      introduccion = 'El paciente refiere los siguientes antecedentes personales patológicos:';
    }
    
    // Segunda parte - Enfermedades transmisibles
    let trasmisiblesTexto = '';
    if (tieneEnfermedadesTrasmisibles) {
      trasmisiblesTexto = '\n\nEnfermedades transmisibles: ' + enfermedadesActuales.join(', ') + '.';
    }
    
    // Tercera parte - Enfermedades crónico-degenerativas
    let cronicasTexto = '';
    if (tieneEnfermedadesNoTrasmisibles) {
      cronicasTexto = '\n\nEnfermedades crónico-degenerativas: ' + enfermedadesCronicas.join(', ') + '.';
    }
    
    // Cuarta parte - Tratamiento actual
    let tratamientoTexto = '';
    if (app.tratamientoActual) {
      tratamientoTexto = '\n\nActualmente ' + (app.tratamientoActual === 'Si' ? 'recibe tratamiento médico' : 'no recibe tratamiento médico') + '.';
      
      if (app.tratamientoActual === 'Si' && app.cualTratamiento) {
        tratamientoTexto += ' ' + app.cualTratamiento + '.';
      }
    }
    
    // Quinta parte - Hospitalizaciones previas
    let hospitalizacionesTexto = '';
    if (app.hospitalizacionesPrevias) {
      hospitalizacionesTexto = '\n\nHospitalizaciones previas: ' + (app.hospitalizacionesPrevias === 'Si' ? 'Sí' : 'No') + '.';
      
      if (app.hospitalizacionesPrevias === 'Si' && app.razonHospitalizacion) {
        hospitalizacionesTexto += ' Razón: ' + app.razonHospitalizacion + '.';
      }
    }
    
    // Sexta parte - Transfusiones sanguíneas
    let transfusionesTexto = '';
    if (app.transfusionesSanguineas) {
      transfusionesTexto = '\n\nTransfusiones sanguíneas: ' + (app.transfusionesSanguineas === 'Si' ? 'Sí' : 'No') + '.';
      
      if (app.transfusionesSanguineas === 'Si' && app.razonTransfusion) {
        transfusionesTexto += ' Razón: ' + app.razonTransfusion + '.';
      }
    }
    
    // Combinar todas las partes
    const redaccionFinal = `${introduccion}${trasmisiblesTexto}${cronicasTexto}${tratamientoTexto}${hospitalizacionesTexto}${transfusionesTexto}`;
    
    setRedaccionIA(redaccionFinal);
    setShowRedaccion(true);
    
    setTimeout(() => {
      redaccionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        window.scrollBy(0, -200);
      }, 300);
    }, 100);
  };

  const limpiarFormulario = () => {
    // Limpiar enfermedades transmisibles
    enfermedadesTrasmisibles.forEach(enfermedad => {
      handleAntecedentePatologicoChange(`enfermedadesTrasmisibles.${enfermedad.id}`, false);
    });
    
    // Limpiar enfermedades no transmisibles
    enfermedadesNoTrasmisibles.forEach(enfermedad => {
      handleAntecedentePatologicoChange(`enfermedadesNoTrasmisibles.${enfermedad.id}`, false);
    });
    
    // Limpiar otros campos
    handleAntecedentePatologicoChange('tratamientoActual', '');
    handleAntecedentePatologicoChange('cualTratamiento', '');
    handleAntecedentePatologicoChange('hospitalizacionesPrevias', '');
    handleAntecedentePatologicoChange('razonHospitalizacion', '');
    handleAntecedentePatologicoChange('transfusionesSanguineas', '');
    handleAntecedentePatologicoChange('razonTransfusion', '');
    
    setRedaccionIA("");
    setShowRedaccion(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(redaccionIA);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < redaccionIA.length) {
        setDisplayedText(redaccionIA.substring(0, index + 1));
        setProgress((index / redaccionIA.length) * 100);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [redaccionIA]);

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
              <button
                onClick={() => setShowRedaccion(false)}
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${!showRedaccion ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}
              >
                Formulario
              </button>
              <button
                onClick={() => setShowRedaccion(true)}
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${showRedaccion ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}
              >
                Redacción IA
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleMinimize} className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors" aria-label={isMinimized ? "Expandir" : "Minimizar"}>
              <Minus className="w-4 h-4" />
            </button>
            <button onClick={handleMaximize} className="p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors" aria-label={isMaximized ? "Restaurar" : "Maximizar"}>
              <Maximize2 className="w-4 h-4" />
            </button>
            <button onClick={handleClose} className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors" aria-label="Cerrar">
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
            {showRedaccion ? (
              <div ref={redaccionRef} className="p-6">
                <label className="font-mono text-sm font-medium text-gray-800">
                  Redacción IA...
                </label>
                <div
                  className="progress-bar-container"
                  style={{
                    width: '100%',
                    backgroundColor: '#d3d3d3',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div
                    className="progress-bar"
                    style={{
                      height: '8px',
                      backgroundColor: '#34c759',
                      transition: 'width 0.015s ease-in-out',
                      width: `${progress}%`,
                      borderRadius: '12px',
                    }}
                  ></div>
                </div>
                <div
                  className="min-h-[200px] w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 rounded-md"
                  style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                >
                  {displayedText}
                </div>

                <Button
                  onClick={handleCopy}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 relative"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copiar Redacción</span>
                  {copied && (
                    <div className="absolute -top-8 left-0 bg-green-500 text-white text-sm rounded-lg px-3 py-1 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Copiado</span>
                    </div>
                  )}
                </Button>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Enfermedades Transmisibles</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {enfermedadesTrasmisibles.map((enfermedad) => (
                      <div key={enfermedad.id} className="flex items-center space-x-2">
                        <Switch
                          id={`et-${enfermedad.id}`}
                          checked={formData.antecedentesPersonalesPatologicos.enfermedadesTrasmisibles[enfermedad.id] || false}
                          onCheckedChange={(checked) => handleAntecedentePatologicoChange(`enfermedadesTrasmisibles.${enfermedad.id}`, checked)}
                        />
                        <label
                          htmlFor={`et-${enfermedad.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {enfermedad.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Enfermedades Crónico-Degenerativas</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {enfermedadesNoTrasmisibles.map((enfermedad) => (
                      <div key={enfermedad.id} className="flex items-center space-x-2">
                        <Switch
                          id={`ent-${enfermedad.id}`}
                          checked={formData.antecedentesPersonalesPatologicos.enfermedadesNoTrasmisibles[enfermedad.id] || false}
                          onCheckedChange={(checked) => handleAntecedentePatologicoChange(`enfermedadesNoTrasmisibles.${enfermedad.id}`, checked)}
                        />
                        <label
                          htmlFor={`ent-${enfermedad.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {enfermedad.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Información Adicional</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">¿Recibe tratamiento médico actualmente?</label>
                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="tratamiento-si"
                            name="tratamiento"
                            value="Si"
                            checked={formData.antecedentesPersonalesPatologicos.tratamientoActual === 'Si'}
                            onChange={() => handleAntecedentePatologicoChange('tratamientoActual', 'Si')}
                            className="mr-2"
                          />
                          <label htmlFor="tratamiento-si">Sí</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="tratamiento-no"
                            name="tratamiento"
                            value="No"
                            checked={formData.antecedentesPersonalesPatologicos.tratamientoActual === 'No'}
                            onChange={() => handleAntecedentePatologicoChange('tratamientoActual', 'No')}
                            className="mr-2"
                          />
                          <label htmlFor="tratamiento-no">No</label>
                        </div>
                      </div>
                    </div>
                    
                    {formData.antecedentesPersonalesPatologicos.tratamientoActual === 'Si' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">¿Cuál tratamiento?</label>
                        <Textarea
                          placeholder="Describa el tratamiento médico actual..."
                          value={formData.antecedentesPersonalesPatologicos.cualTratamiento}
                          onChange={(e) => handleAntecedentePatologicoChange('cualTratamiento', e.target.value)}
                          className="w-full min-h-[80px]"
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">¿Hospitalizaciones previas?</label>
                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="hospitalizacion-si"
                            name="hospitalizacion"
                            value="Si"
                            checked={formData.antecedentesPersonalesPatologicos.hospitalizacionesPrevias === 'Si'}
                            onChange={() => handleAntecedentePatologicoChange('hospitalizacionesPrevias', 'Si')}
                            className="mr-2"
                          />
                          <label htmlFor="hospitalizacion-si">Sí</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="hospitalizacion-no"
                            name="hospitalizacion"
                            value="No"
                            checked={formData.antecedentesPersonalesPatologicos.hospitalizacionesPrevias === 'No'}
                            onChange={() => handleAntecedentePatologicoChange('hospitalizacionesPrevias', 'No')}
                            className="mr-2"
                          />
                          <label htmlFor="hospitalizacion-no">No</label>
                        </div>
                      </div>
                    </div>
                    
                    {formData.antecedentesPersonalesPatologicos.hospitalizacionesPrevias === 'Si' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Razón de la hospitalización:</label>
                        <Textarea
                          placeholder="Describa la razón de la hospitalización..."
                          value={formData.antecedentesPersonalesPatologicos.razonHospitalizacion}
                          onChange={(e) => handleAntecedentePatologicoChange('razonHospitalizacion', e.target.value)}
                          className="w-full min-h-[80px]"
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">¿Transfusiones sanguíneas?</label>
                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="transfusion-si"
                            name="transfusion"
                            value="Si"
                            checked={formData.antecedentesPersonalesPatologicos.transfusionesSanguineas === 'Si'}
                            onChange={() => handleAntecedentePatologicoChange('transfusionesSanguineas', 'Si')}
                            className="mr-2"
                          />
                          <label htmlFor="transfusion-si">Sí</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="transfusion-no"
                            name="transfusion"
                            value="No"
                            checked={formData.antecedentesPersonalesPatologicos.transfusionesSanguineas === 'No'}
                            onChange={() => handleAntecedentePatologicoChange('transfusionesSanguineas', 'No')}
                            className="mr-2"
                          />
                          <label htmlFor="transfusion-no">No</label>
                        </div>
                      </div>
                    </div>
                    
                    {formData.antecedentesPersonalesPatologicos.transfusionesSanguineas === 'Si' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Razón de la transfusión:</label>
                        <Textarea
                          placeholder="Describa la razón de la transfusión..."
                          value={formData.antecedentesPersonalesPatologicos.razonTransfusion}
                          onChange={(e) => handleAntecedentePatologicoChange('razonTransfusion', e.target.value)}
                          className="w-full min-h-[80px]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!showRedaccion && (
              <div className="p-6 flex justify-center gap-4">
                <Button onClick={validarYGenerarRedaccion} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
                  <span>Generar Redacción IA</span>
                </Button>
                <Button onClick={limpiarFormulario} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2">
                  <Eraser className="w-4 h-4" />
                  <span>Limpiar Formulario</span>
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
      
      <ConfirmationAlert
        open={alertOpen}
        onOpenChange={setAlertOpen}
        title="Información incompleta"
        description={
          <div>
            <p className="mb-2">Se han detectado las siguientes inconsistencias en la información:</p>
            <ul className="list-disc pl-5 space-y-1">
              {camposFaltantes.map((campo, index) => (
                <li key={index} className="text-red-500">{campo}</li>
              ))}
            </ul>
            <p className="mt-2">¿Desea continuar aún con esta información incompleta?</p>
          </div>
        }
        onConfirm={generarRedaccionIA}
      />
    </div>
  );
};

export default AntecedentesPersonalesPatologicos;
