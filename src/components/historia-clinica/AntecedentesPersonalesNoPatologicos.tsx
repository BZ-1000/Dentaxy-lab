import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Minus, Maximize2, X, Eraser, Copy, CheckCircle } from "lucide-react";
import { Typewriter } from "@/components/ui/typewriter-text";

interface AntecedentesPersonalesNoPatologicosProps {
  formData: any;
  handleAntecedenteChange: (field: string, value: any) => void;
  toggleService: (service: string) => void;
}

const AntecedentesPersonalesNoPatologicos = ({ formData, handleAntecedenteChange, toggleService }: AntecedentesPersonalesNoPatologicosProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showRedaccion, setShowRedaccion] = useState(false);
  const [redaccionIA, setRedaccionIA] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const redaccionRef = useRef(null);

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

  const generarRedaccionIA = () => {
    const servicios = formData.antecedentesPersonalesNoPatologicos.servicios;
    const higiene = formData.antecedentesPersonalesNoPatologicos.higiene;
    const alimentacion = formData.antecedentesPersonalesNoPatologicos.alimentacion;
    const actividadFisica = formData.antecedentesPersonalesNoPatologicos.actividadFisica;
    const tabaquismo = formData.antecedentesPersonalesNoPatologicos.tabaquismo;
    const alcoholismo = formData.antecedentesPersonalesNoPatologicos.alcoholismo;
    const toxicomanias = formData.antecedentesPersonalesNoPatologicos.toxicomanias;

    let textoGenerado = `El paciente cuenta con los servicios de: ${servicios.join(', ')}.
    En cuanto a su higiene bucal, manifiesta ${higiene.frecuencia} cepillados al día, utilizando ${higiene.elementos}.
    Su alimentación se basa en ${alimentacion.descripcion} con una frecuencia de ${alimentacion.frecuencia}.
    Realiza actividad física ${actividadFisica.tipo} con una duración de ${actividadFisica.duracion} y una frecuencia de ${actividadFisica.frecuencia}.
    ${tabaquismo.activo ? `El paciente fuma ${tabaquismo.cantidad} cigarros al día desde hace ${tabaquismo.tiempo}.` : 'El paciente no fuma.'}
    ${alcoholismo.activo ? `El paciente consume bebidas alcohólicas ${alcoholismo.frecuencia} desde hace ${alcoholismo.tiempo}, con una cantidad de ${alcoholismo.cantidad}.` : 'El paciente no consume alcohol.'}
    ${toxicomanias.activo ? `El paciente consume ${toxicomanias.sustancia} con una frecuencia de ${toxicomanias.frecuencia} desde hace ${toxicomanias.tiempo}.` : 'El paciente no consume sustancias tóxicas.'}`;

    setRedaccionIA(textoGenerado);
    setShowRedaccion(true);
    setTimeout(() => {
      redaccionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        window.scrollBy(0, -200);
      }, 300);
    }, 100);
  };

  const limpiarFormulario = () => {
    handleAntecedenteChange("servicios", []);
    handleAntecedenteChange("higiene.frecuencia", "");
    handleAntecedenteChange("higiene.elementos", "");
    handleAntecedenteChange("alimentacion.descripcion", "");
    handleAntecedenteChange("alimentacion.frecuencia", "");
    handleAntecedenteChange("actividadFisica.tipo", "");
    handleAntecedenteChange("actividadFisica.duracion", "");
    handleAntecedenteChange("actividadFisica.frecuencia", "");
    handleAntecedenteChange("tabaquismo.activo", false);
    handleAntecedenteChange("tabaquismo.cantidad", "");
    handleAntecedenteChange("tabaquismo.tiempo", "");
    handleAntecedenteChange("alcoholismo.activo", false);
    handleAntecedenteChange("alcoholismo.frecuencia", "");
    handleAntecedenteChange("alcoholismo.tiempo", "");
    handleAntecedenteChange("alcoholismo.cantidad", "");
    handleAntecedenteChange("toxicomanias.activo", false);
    handleAntecedenteChange("toxicomanias.sustancia", "");
    handleAntecedenteChange("toxicomanias.frecuencia", "");
    handleAntecedenteChange("toxicomanias.tiempo", "");
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
        setProgress(index / redaccionIA.length * 100);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [redaccionIA]);

  return (
    <div
      className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}
      data-section-redaction="true"
      data-section-name="antecedentesPersonalesNoPatologicos"
    >
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
            <span className="text-gray-400">III.</span> Antecedentes Personales No Patológicos
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
                  className="min-h-[200px] w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 p-2 rounded-md justify-text"
                  style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                  data-redaction-content
                >
                  {displayedText}
                </div>

                <Button
                  onClick={handleCopy}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 relative"
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
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Servicios:</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      className={`px-4 py-2 rounded-full border shadow-sm transition-colors text-sm font-medium ${
                        formData.antecedentesPersonalesNoPatologicos.servicios.includes('agua') ? "bg-blue-600 text-white" : "bg-white text-gray-700 border-gray-300"
                      }`}
                      onClick={() => toggleService('agua')}
                    >
                      Agua
                    </button>
                    <button
                      className={`px-4 py-2 rounded-full border shadow-sm transition-colors text-sm font-medium ${
                        formData.antecedentesPersonalesNoPatologicos.servicios.includes('luz') ? "bg-blue-600 text-white" : "bg-white text-gray-700 border-gray-300"
                      }`}
                      onClick={() => toggleService('luz')}
                    >
                      Luz
                    </button>
                    <button
                      className={`px-4 py-2 rounded-full border shadow-sm transition-colors text-sm font-medium ${
                        formData.antecedentesPersonalesNoPatologicos.servicios.includes('drenaje') ? "bg-blue-600 text-white" : "bg-white text-gray-700 border-gray-300"
                      }`}
                      onClick={() => toggleService('drenaje')}
                    >
                      Drenaje
                    </button>
                    <button
                      className={`px-4 py-2 rounded-full border shadow-sm transition-colors text-sm font-medium ${
                        formData.antecedentesPersonalesNoPatologicos.servicios.includes('transporte') ? "bg-blue-600 text-white" : "bg-white text-gray-700 border-gray-300"
                      }`}
                      onClick={() => toggleService('transporte')}
                    >
                      Transporte
                    </button>
                    <button
                      className={`px-4 py-2 rounded-full border shadow-sm transition-colors text-sm font-medium ${
                        formData.antecedentesPersonalesNoPatologicos.servicios.includes('internet') ? "bg-blue-600 text-white" : "bg-white text-gray-700 border-gray-300"
                      }`}
                      onClick={() => toggleService('internet')}
                    >
                      Internet
                    </button>
                    <button
                      className={`px-4 py-2 rounded-full border shadow-sm transition-colors text-sm font-medium ${
                        formData.antecedentesPersonalesNoPatologicos.servicios.includes('gas') ? "bg-blue-600 text-white" : "bg-white text-gray-700 border-gray-300"
                      }`}
                      onClick={() => toggleService('gas')}
                    >
                      Gas
                    </button>
                    <button
                      className={`px-4 py-2 rounded-full border shadow-sm transition-colors text-sm font-medium ${
                        formData.antecedentesPersonalesNoPatologicos.servicios.length === 6 ? "bg-green-600 text-white" : "bg-white text-gray-700 border-gray-300"
                      }`}
                      onClick={() => toggleService('todos')}
                    >
                      Todos
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold">Higiene:</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="higieneFrecuencia">Frecuencia de cepillado:</Label>
                    <Input
                      type="text"
                      id="higieneFrecuencia"
                      value={formData.antecedentesPersonalesNoPatologicos.higiene.frecuencia}
                      onChange={(e) => handleAntecedenteChange('higiene.frecuencia', e.target.value)}
                      placeholder="Ej: 3 veces al día"
                    />
                    <Label htmlFor="higieneElementos">Elementos de higiene:</Label>
                    <Input
                      type="text"
                      id="higieneElementos"
                      value={formData.antecedentesPersonalesNoPatologicos.higiene.elementos}
                      onChange={(e) => handleAntecedenteChange('higiene.elementos', e.target.value)}
                      placeholder="Ej: cepillo, hilo dental, enjuague bucal"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold">Alimentación:</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="alimentacionDescripcion">Descripción de la alimentación:</Label>
                    <Input
                      type="text"
                      id="alimentacionDescripcion"
                      value={formData.antecedentesPersonalesNoPatologicos.alimentacion.descripcion}
                      onChange={(e) => handleAntecedenteChange('alimentacion.descripcion', e.target.value)}
                      placeholder="Ej: balanceada, rica en carbohidratos, etc."
                    />
                    <Label htmlFor="alimentacionFrecuencia">Frecuencia de la alimentación:</Label>
                    <Input
                      type="text"
                      id="alimentacionFrecuencia"
                      value={formData.antecedentesPersonalesNoPatologicos.alimentacion.frecuencia}
                      onChange={(e) => handleAntecedenteChange('alimentacion.frecuencia', e.target.value)}
                      placeholder="Ej: 3 veces al día"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold">Actividad Física:</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="actividadFisicaTipo">Tipo de actividad física:</Label>
                    <Input
                      type="text"
                      id="actividadFisicaTipo"
                      value={formData.antecedentesPersonalesNoPatologicos.actividadFisica.tipo}
                      onChange={(e) => handleAntecedenteChange('actividadFisica.tipo', e.target.value)}
                      placeholder="Ej: caminar, correr, nadar, etc."
                    />
                    <Label htmlFor="actividadFisicaDuracion">Duración de la actividad física:</Label>
                    <Input
                      type="text"
                      id="actividadFisicaDuracion"
                      value={formData.antecedentesPersonalesNoPatologicos.actividadFisica.duracion}
                      onChange={(e) => handleAntecedenteChange('actividadFisica.duracion', e.target.value)}
                      placeholder="Ej: 30 minutos"
                    />
                    <Label htmlFor="actividadFisicaFrecuencia">Frecuencia de la actividad física:</Label>
                    <Input
                      type="text"
                      id="actividadFisicaFrecuencia"
                      value={formData.antecedentesPersonalesNoPatologicos.actividadFisica.frecuencia}
                      onChange={(e) => handleAntecedenteChange('actividadFisica.frecuencia', e.target.value)}
                      placeholder="Ej: 3 veces por semana"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold">Tabaquismo:</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="tabaquismoActivo">¿Es fumador activo?</Label>
                    <Input
                      type="checkbox"
                      id="tabaquismoActivo"
                      checked={formData.antecedentesPersonalesNoPatologicos.tabaquismo.activo}
                      onChange={(e) => handleAntecedenteChange('tabaquismo.activo', e.target.checked)}
                    />
                    {formData.antecedentesPersonalesNoPatologicos.tabaquismo.activo && (
                      <>
                        <Label htmlFor="tabaquismoCantidad">Cantidad de cigarros al día:</Label>
                        <Input
                          type="text"
                          id="tabaquismoCantidad"
                          value={formData.antecedentesPersonalesNoPatologicos.tabaquismo.cantidad}
                          onChange={(e) => handleAntecedenteChange('tabaquismo.cantidad', e.target.value)}
                          placeholder="Ej: 10"
                        />
                        <Label htmlFor="tabaquismoTiempo">Tiempo fumando:</Label>
                        <Input
                          type="text"
                          id="tabaquismoTiempo"
                          value={formData.antecedentesPersonalesNoPatologicos.tabaquismo.tiempo}
                          onChange={(e) => handleAntecedenteChange('tabaquismo.tiempo', e.target.value)}
                          placeholder="Ej: 5 años"
                        />
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold">Alcoholismo:</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="alcoholismoActivo">¿Consume alcohol activamente?</Label>
                    <Input
                      type="checkbox"
                      id="alcoholismoActivo"
                      checked={formData.antecedentesPersonalesNoPatologicos.alcoholismo.activo}
                      onChange={(e) => handleAntecedenteChange('alcoholismo.activo', e.target.checked)}
                    />
                    {formData.antecedentesPersonalesNoPatologicos.alcoholismo.activo && (
                      <>
                        <Label htmlFor="alcoholismoFrecuencia">Frecuencia de consumo:</Label>
                        <Input
                          type="text"
                          id="alcoholismoFrecuencia"
                          value={formData.antecedentesPersonalesNoPatologicos.alcoholismo.frecuencia}
                          onChange={(e) => handleAntecedenteChange('alcoholismo.frecuencia', e.target.value)}
                          placeholder="Ej: fines de semana"
                        />
                        <Label htmlFor="alcoholismoTiempo">Tiempo consumiendo alcohol:</Label>
                        <Input
                          type="text"
                          id="alcoholismoTiempo"
                          value={formData.antecedentesPersonalesNoPatologicos.alcoholismo.tiempo}
                          onChange={(e) => handleAntecedenteChange('alcoholismo.tiempo', e.target.value)}
                          placeholder="Ej: 10 años"
                        />
                        <Label htmlFor="alcoholismoCantidad">Cantidad de alcohol consumido:</Label>
                        <Input
                          type="text"
                          id="alcoholismoCantidad"
                          value={formData.antecedentesPersonalesNoPatologicos.alcoholismo.cantidad}
                          onChange={(e) => handleAntecedenteChange('alcoholismo.cantidad', e.target.value)}
                          placeholder="Ej: 2 cervezas"
                        />
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold">Toxicomanías:</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="toxicomaniasActivo">¿Consume sustancias tóxicas?</Label>
                    <Input
                      type="checkbox"
                      id="toxicomaniasActivo"
                      checked={formData.antecedentesPersonalesNoPatologicos.toxicomanias.activo}
                      onChange={(e) => handleAntecedenteChange('toxicomanias.activo', e.target.checked)}
                    />
                    {formData.antecedentesPersonalesNoPatologicos.toxicomanias.activo && (
                      <>
                        <Label htmlFor="toxicomaniasSustancia">Sustancia consumida:</Label>
                        <Input
                          type="text"
                          id="toxicomaniasSustancia"
                          value={formData.antecedentesPersonalesNoPatologicos.toxicomanias.sustancia}
                          onChange={(e) => handleAntecedenteChange('toxicomanias.sustancia', e.target.value)}
                          placeholder="Ej: marihuana"
                        />
                        <Label htmlFor="toxicomaniasFrecuencia">Frecuencia de consumo:</Label>
                        <Input
                          type="text"
                          id="toxicomaniasFrecuencia"
                          value={formData.antecedentesPersonalesNoPatologicos.toxicomanias.frecuencia}
                          onChange={(e) => handleAntecedenteChange('toxicomanias.frecuencia', e.target.value)}
                          placeholder="Ej: diario"
                        />
                        <Label htmlFor="toxicomaniasTiempo">Tiempo consumiendo:</Label>
                        <Input
                          type="text"
                          id="toxicomaniasTiempo"
                          value={formData.antecedentesPersonalesNoPatologicos.toxicomanias.tiempo}
                          onChange={(e) => handleAntecedenteChange('toxicomanias.tiempo', e.target.value)}
                          placeholder="Ej: 2 años"
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!showRedaccion && (
              <div className="p-6 flex justify-center gap-4">
                <Button onClick={generarRedaccionIA} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
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
    </div>
  );
};

export default AntecedentesPersonalesNoPatologicos;
