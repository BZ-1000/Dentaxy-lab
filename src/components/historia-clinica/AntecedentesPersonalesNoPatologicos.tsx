
import React, { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Minus, Maximize2, X, Eraser, Copy, CheckCircle } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { ConfirmationAlert } from "@/components/ui/confirmation-alert";

interface AntecedentesPersonalesNoPatologicosProps {
  formData: FormDataState;
  handleAntecedenteChange: (field: string, value: any) => void;
  toggleService: (service: string) => void;
}

const AntecedentesPersonalesNoPatologicos = ({ 
  formData, 
  handleAntecedenteChange, 
  toggleService 
}: AntecedentesPersonalesNoPatologicosProps) => {
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

  const servicios = [
    { id: 'agua', label: 'Agua' },
    { id: 'luz', label: 'Luz' },
    { id: 'drenaje', label: 'Drenaje' },
    { id: 'transporte', label: 'Transporte' },
    { id: 'gas', label: 'Gas' },
    { id: 'internet', label: 'Internet' },
  ];

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
    const anpp = formData.antecedentesPersonalesNoPatologicos;
    
    if (!anpp.vivienda.tipo) {
      faltantes.push('Tipo de vivienda');
    }
    
    if (!anpp.alimentacion.tiempos) {
      faltantes.push('Tiempos de alimentación');
    }
    
    if (!anpp.habitosHigienicos.bañoDiario) {
      faltantes.push('Baño diario');
    }
    
    if (!anpp.habitosHigienicos.lavadoDental) {
      faltantes.push('Lavado dental');
    }
    
    if (anpp.servicios.length === 0) {
      faltantes.push('Servicios (al menos uno)');
    }
    
    if (!anpp.adicciones.alcohol.frecuencia && anpp.adicciones.alcohol.consume) {
      faltantes.push('Frecuencia de consumo de alcohol');
    }
    
    if (!anpp.adicciones.tabaco.frecuencia && anpp.adicciones.tabaco.consume) {
      faltantes.push('Frecuencia de consumo de tabaco');
    }
    
    if (anpp.adicciones.drogas.consume && !anpp.adicciones.drogas.tipo) {
      faltantes.push('Tipo de drogas que consume');
    }
    
    if (anpp.adicciones.drogas.consume && !anpp.adicciones.drogas.frecuencia) {
      faltantes.push('Frecuencia de consumo de drogas');
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
    const anpp = formData.antecedentesPersonalesNoPatologicos;
    
    // Vivienda
    let viviendaText = `Habita en casa ${anpp.vivienda.tipo}`;
    if (anpp.vivienda.habitantes) {
      viviendaText += ` con ${anpp.vivienda.habitantes} habitantes`;
    }
    if (anpp.vivienda.cuartos) {
      viviendaText += `, distribuidos en ${anpp.vivienda.cuartos} cuartos`;
    }
    viviendaText += '.';
    
    // Servicios
    let serviciosText = 'Cuenta con servicios de ';
    if (anpp.servicios.length > 0) {
      serviciosText += anpp.servicios.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ').replace(/,([^,]*)$/, ' y$1');
    } else {
      serviciosText = 'No reporta servicios.';
    }
    
    // Alimentación
    let alimentacionText = '';
    if (anpp.alimentacion.tiempos) {
      alimentacionText = `Realiza ${anpp.alimentacion.tiempos} tiempos de alimentación al día`;
      if (anpp.alimentacion.calidad) {
        alimentacionText += `, con una calidad ${anpp.alimentacion.calidad.toLowerCase()}`;
      }
      alimentacionText += '.';
    }
    
    // Hábitos higiénicos
    let higienicosText = '';
    if (anpp.habitosHigienicos.bañoDiario) {
      higienicosText += `Baño diario: ${anpp.habitosHigienicos.bañoDiario}. `;
    }
    if (anpp.habitosHigienicos.lavadoDental) {
      higienicosText += `Lavado dental: ${anpp.habitosHigienicos.lavadoDental} veces al día. `;
    }
    if (anpp.habitosHigienicos.cambioCepillo) {
      higienicosText += `Cambio de cepillo dental cada ${anpp.habitosHigienicos.cambioCepillo}.`;
    }
    
    // Adicciones
    let adiccionesText = '';
    if (anpp.adicciones.alcohol.consume) {
      adiccionesText += `Consume alcohol con frecuencia ${anpp.adicciones.alcohol.frecuencia.toLowerCase()}`;
      if (anpp.adicciones.alcohol.ultimoConsumo) {
        adiccionesText += `, último consumo ${anpp.adicciones.alcohol.ultimoConsumo}`;
      }
      adiccionesText += '. ';
    } else {
      adiccionesText += 'No consume alcohol. ';
    }
    
    if (anpp.adicciones.tabaco.consume) {
      adiccionesText += `Consume tabaco con frecuencia ${anpp.adicciones.tabaco.frecuencia.toLowerCase()}`;
      if (anpp.adicciones.tabaco.cantidadDiaria) {
        adiccionesText += `, ${anpp.adicciones.tabaco.cantidadDiaria} cigarrillos diarios`;
      }
      if (anpp.adicciones.tabaco.tiempoConsumo) {
        adiccionesText += `, desde hace ${anpp.adicciones.tabaco.tiempoConsumo}`;
      }
      adiccionesText += '. ';
    } else {
      adiccionesText += 'No consume tabaco. ';
    }
    
    if (anpp.adicciones.drogas.consume) {
      adiccionesText += `Consume ${anpp.adicciones.drogas.tipo} con frecuencia ${anpp.adicciones.drogas.frecuencia.toLowerCase()}`;
      if (anpp.adicciones.drogas.ultimoConsumo) {
        adiccionesText += `, último consumo ${anpp.adicciones.drogas.ultimoConsumo}`;
      }
      adiccionesText += '.';
    } else {
      adiccionesText += 'No consume drogas.';
    }
    
    // Armar la redacción completa
    const redaccionFinal = `${viviendaText} ${serviciosText}\n\n${alimentacionText}\n\nHábitos higiénicos: ${higienicosText}\n\nAdicciones: ${adiccionesText}`;
    
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
    handleAntecedenteChange('vivienda', { tipo: '', habitantes: '', cuartos: '' });
    handleAntecedenteChange('servicios', []);
    handleAntecedenteChange('alimentacion', { tiempos: '', calidad: '' });
    handleAntecedenteChange('habitosHigienicos', { bañoDiario: '', lavadoDental: '', cambioCepillo: '' });
    handleAntecedenteChange('adicciones.alcohol', { consume: false, frecuencia: '', ultimoConsumo: '' });
    handleAntecedenteChange('adicciones.tabaco', { consume: false, frecuencia: '', cantidadDiaria: '', tiempoConsumo: '' });
    handleAntecedenteChange('adicciones.drogas', { consume: false, tipo: '', frecuencia: '', ultimoConsumo: '' });
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
            <span className="text-gray-400">III.</span> ANTECEDENTES PERSONALES NO PATOLÓGICOS
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
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg space-y-4">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Vivienda</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
                      <select
                        value={formData.antecedentesPersonalesNoPatologicos.vivienda.tipo}
                        onChange={(e) => handleAntecedenteChange('vivienda.tipo', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Seleccione...</option>
                        <option value="Propia">Propia</option>
                        <option value="Rentada">Rentada</option>
                        <option value="Prestada">Prestada</option>
                        <option value="Compartida">Compartida</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Habitantes</label>
                      <Input
                        type="number"
                        min="1"
                        placeholder="Número de habitantes"
                        value={formData.antecedentesPersonalesNoPatologicos.vivienda.habitantes}
                        onChange={(e) => handleAntecedenteChange('vivienda.habitantes', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cuartos</label>
                      <Input
                        type="number"
                        min="1"
                        placeholder="Número de cuartos"
                        value={formData.antecedentesPersonalesNoPatologicos.vivienda.cuartos}
                        onChange={(e) => handleAntecedenteChange('vivienda.cuartos', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Servicios</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <button
                      onClick={() => toggleService('todos')}
                      className={`py-2 px-4 rounded-full transition-colors ${
                        servicios.every(s => formData.antecedentesPersonalesNoPatologicos.servicios.includes(s.id))
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      Todos
                    </button>
                    {servicios.map((servicio) => (
                      <button
                        key={servicio.id}
                        onClick={() => toggleService(servicio.id)}
                        className={`py-2 px-4 rounded-full transition-colors ${
                          formData.antecedentesPersonalesNoPatologicos.servicios.includes(servicio.id)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        {servicio.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Alimentación</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tiempos de alimentación</label>
                      <select
                        value={formData.antecedentesPersonalesNoPatologicos.alimentacion.tiempos}
                        onChange={(e) => handleAntecedenteChange('alimentacion.tiempos', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Seleccione...</option>
                        <option value="1">1 tiempo al día</option>
                        <option value="2">2 tiempos al día</option>
                        <option value="3">3 tiempos al día</option>
                        <option value="4">4 tiempos al día</option>
                        <option value="5 o más">5 o más tiempos al día</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Calidad</label>
                      <select
                        value={formData.antecedentesPersonalesNoPatologicos.alimentacion.calidad}
                        onChange={(e) => handleAntecedenteChange('alimentacion.calidad', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Seleccione...</option>
                        <option value="Buena">Buena</option>
                        <option value="Regular">Regular</option>
                        <option value="Mala">Mala</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Hábitos higiénicos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Baño diario</label>
                      <select
                        value={formData.antecedentesPersonalesNoPatologicos.habitosHigienicos.bañoDiario}
                        onChange={(e) => handleAntecedenteChange('habitosHigienicos.bañoDiario', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Seleccione...</option>
                        <option value="Sí">Sí</option>
                        <option value="No">No</option>
                        <option value="Ocasional">Ocasional</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lavado dental (veces al día)</label>
                      <select
                        value={formData.antecedentesPersonalesNoPatologicos.habitosHigienicos.lavadoDental}
                        onChange={(e) => handleAntecedenteChange('habitosHigienicos.lavadoDental', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Seleccione...</option>
                        <option value="0">Ninguna</option>
                        <option value="1">1 vez</option>
                        <option value="2">2 veces</option>
                        <option value="3">3 veces</option>
                        <option value="más de 3">Más de 3 veces</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cambio de cepillo dental</label>
                      <select
                        value={formData.antecedentesPersonalesNoPatologicos.habitosHigienicos.cambioCepillo}
                        onChange={(e) => handleAntecedenteChange('habitosHigienicos.cambioCepillo', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Seleccione...</option>
                        <option value="Cada mes">Cada mes</option>
                        <option value="Cada 3 meses">Cada 3 meses</option>
                        <option value="Cada 6 meses">Cada 6 meses</option>
                        <option value="Cada año">Cada año</option>
                        <option value="No lo cambia regularmente">No lo cambia regularmente</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Adicciones</h3>
                  <div className="space-y-6">
                    <div className="border-b pb-4">
                      <div className="flex items-center mb-3">
                        <input
                          type="checkbox"
                          id="consumeAlcohol"
                          checked={formData.antecedentesPersonalesNoPatologicos.adicciones.alcohol.consume}
                          onChange={(e) => handleAntecedenteChange('adicciones.alcohol.consume', e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor="consumeAlcohol" className="font-medium">Alcohol</label>
                      </div>
                      {formData.antecedentesPersonalesNoPatologicos.adicciones.alcohol.consume && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frecuencia</label>
                            <select
                              value={formData.antecedentesPersonalesNoPatologicos.adicciones.alcohol.frecuencia}
                              onChange={(e) => handleAntecedenteChange('adicciones.alcohol.frecuencia', e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Seleccione...</option>
                              <option value="Diaria">Diaria</option>
                              <option value="Semanal">Semanal</option>
                              <option value="Quincenal">Quincenal</option>
                              <option value="Mensual">Mensual</option>
                              <option value="Ocasional">Ocasional</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Último consumo</label>
                            <Input
                              placeholder="Ej: Hace 2 semanas"
                              value={formData.antecedentesPersonalesNoPatologicos.adicciones.alcohol.ultimoConsumo}
                              onChange={(e) => handleAntecedenteChange('adicciones.alcohol.ultimoConsumo', e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-b pb-4">
                      <div className="flex items-center mb-3">
                        <input
                          type="checkbox"
                          id="consumeTabaco"
                          checked={formData.antecedentesPersonalesNoPatologicos.adicciones.tabaco.consume}
                          onChange={(e) => handleAntecedenteChange('adicciones.tabaco.consume', e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor="consumeTabaco" className="font-medium">Tabaco</label>
                      </div>
                      {formData.antecedentesPersonalesNoPatologicos.adicciones.tabaco.consume && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frecuencia</label>
                            <select
                              value={formData.antecedentesPersonalesNoPatologicos.adicciones.tabaco.frecuencia}
                              onChange={(e) => handleAntecedenteChange('adicciones.tabaco.frecuencia', e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Seleccione...</option>
                              <option value="Diaria">Diaria</option>
                              <option value="Semanal">Semanal</option>
                              <option value="Ocasional">Ocasional</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cantidad diaria</label>
                            <Input
                              placeholder="Ej: 5 cigarrillos"
                              value={formData.antecedentesPersonalesNoPatologicos.adicciones.tabaco.cantidadDiaria}
                              onChange={(e) => handleAntecedenteChange('adicciones.tabaco.cantidadDiaria', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tiempo de consumo</label>
                            <Input
                              placeholder="Ej: 5 años"
                              value={formData.antecedentesPersonalesNoPatologicos.adicciones.tabaco.tiempoConsumo}
                              onChange={(e) => handleAntecedenteChange('adicciones.tabaco.tiempoConsumo', e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center mb-3">
                        <input
                          type="checkbox"
                          id="consumeDrogas"
                          checked={formData.antecedentesPersonalesNoPatologicos.adicciones.drogas.consume}
                          onChange={(e) => handleAntecedenteChange('adicciones.drogas.consume', e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor="consumeDrogas" className="font-medium">Drogas</label>
                      </div>
                      {formData.antecedentesPersonalesNoPatologicos.adicciones.drogas.consume && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
                            <Input
                              placeholder="Ej: Marihuana, Cocaína"
                              value={formData.antecedentesPersonalesNoPatologicos.adicciones.drogas.tipo}
                              onChange={(e) => handleAntecedenteChange('adicciones.drogas.tipo', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frecuencia</label>
                            <select
                              value={formData.antecedentesPersonalesNoPatologicos.adicciones.drogas.frecuencia}
                              onChange={(e) => handleAntecedenteChange('adicciones.drogas.frecuencia', e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Seleccione...</option>
                              <option value="Diaria">Diaria</option>
                              <option value="Semanal">Semanal</option>
                              <option value="Quincenal">Quincenal</option>
                              <option value="Mensual">Mensual</option>
                              <option value="Ocasional">Ocasional</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Último consumo</label>
                            <Input
                              placeholder="Ej: Hace 1 mes"
                              value={formData.antecedentesPersonalesNoPatologicos.adicciones.drogas.ultimoConsumo}
                              onChange={(e) => handleAntecedenteChange('adicciones.drogas.ultimoConsumo', e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
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
            <p className="mb-2">Faltan datos importantes para completar la historia clínica:</p>
            <ul className="list-disc pl-5 space-y-1">
              {camposFaltantes.map((campo, index) => (
                <li key={index} className="text-red-500">{campo}</li>
              ))}
            </ul>
            <p className="mt-2">¿Desea continuar aún sin completar estos campos?</p>
          </div>
        }
        onConfirm={generarRedaccionIA}
      />
    </div>
  );
};

export default AntecedentesPersonalesNoPatologicos;
