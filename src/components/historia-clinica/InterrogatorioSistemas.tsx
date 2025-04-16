import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Eraser, Copy, CheckCircle } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { AnimatedTextarea } from "@/components/ui/animated-textarea";

// Word button component for replacing checkboxes
const WordButton = ({ label, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 text-xs rounded-md transition-colors mb-1 mr-1 ${
        isSelected
          ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200"
          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      {label}
    </button>
  );
};

const InterrogatorioSistemas = ({ formData, handleInterrogatorioChange }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [redacciones, setRedacciones] = useState({
    aparatoDigestivo: "",
    aparatoRespiratorio: "",
    aparatoCardiovascular: "",
    aparatoGenitoUrinario: "",
    sistemaEndocrino: "",
    sistemaTegumentario: "",
    sistemaMusculoEsqueletico: "",
    sistemaNervioso: "",
  });
  const [copied, setCopied] = useState({
    aparatoDigestivo: false,
    aparatoRespiratorio: false,
    aparatoCardiovascular: false,
    aparatoGenitoUrinario: false,
    sistemaEndocrino: false,
    sistemaTegumentario: false,
    sistemaMusculoEsqueletico: false,
    sistemaNervioso: false,
  });
  const formRef = useRef(null);
  const redaccionesRef = useRef(null);
  const [formDataLocal, setFormDataLocal] = useState(formData.interrogatorioSistemas);

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
    const aparatoDigestivo = generateAparatoDigestivoText();
    const aparatoRespiratorio = generateAparatoRespiratorioText();
    const aparatoCardiovascular = generateAparatoCardiovascularText();
    const aparatoGenitoUrinario = generateAparatoGenitoUrinarioText();
    const sistemaEndocrino = generateSistemaEndocrinoText();
    const sistemaTegumentario = generateSistemaTegumentarioText();
    const sistemaMusculoEsqueletico = generateSistemaMusculoEsqueleticoText();
    const sistemaNervioso = generateSistemaNerviosoText();

    setRedacciones({
      aparatoDigestivo,
      aparatoRespiratorio,
      aparatoCardiovascular,
      aparatoGenitoUrinario,
      sistemaEndocrino,
      sistemaTegumentario,
      sistemaMusculoEsqueletico,
      sistemaNervioso,
    });
    setShowForm(false);

    if (redaccionesRef.current) {
      redaccionesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const generateAparatoDigestivoText = () => {
    const {
      tipoAlimentacion,
      patronMasticacion,
      percepcionGusto,
      salivacion,
      dificultadTragar,
      halitosis,
      sintomasDigestivos,
      frecuenciaEvacuacion,
    } = formDataLocal;

    let sintomasDigestivosText = sintomasDigestivos.length
      ? sintomasDigestivos.join(', ')
      : 'ninguno';

    return `El paciente sigue una dieta de tipo ${tipoAlimentacion}. Su patrón de masticación es ${patronMasticacion}. ${
      percepcionGusto === 'normal'
        ? 'No percibe alteraciones del gusto.'
        : percepcionGusto === 'disminucion'
        ? 'Presenta disminución o pérdida del gusto.'
        : 'Refiere sabores alterados (metálico, amargo, etc.).'
    } La salivación es ${salivacion}. ${
      dificultadTragar === 'no'
        ? 'No refiere dificultad al tragar.'
        : dificultadTragar === 'dificultad'
        ? 'Presenta dificultad sin dolor al tragar.'
        : 'Refiere dolor al tragar (odinofagia).'
    } ${halitosis === 'si' ? 'Presenta' : 'No presenta'} halitosis. Ha experimentado los siguientes síntomas digestivos: ${sintomasDigestivosText}. Refiere evacuar ${frecuenciaEvacuacion} veces al día.`;
  };

  const generateAparatoRespiratorioText = () => {
    const { tipoRespiracion, sintomasRespiratorios } = formDataLocal;

    let sintomasRespiratoriosText = sintomasRespiratorios.length
      ? sintomasRespiratorios.join(', ')
      : 'ninguno';

    return `El tipo de respiración habitual es ${tipoRespiracion}. Refiere presentar síntomas respiratorios como: ${sintomasRespiratoriosText}.`;
  };

  const generateAparatoCardiovascularText = () => {
    const {
      dolorPrecordial,
      lipotimia,
      ritmoCardiaco,
      sintomasCardiovasculares,
    } = formDataLocal;

    let sintomasCardiovascularesText = sintomasCardiovasculares.length
      ? sintomasCardiovasculares.join(', ')
      : 'ninguno';

    return `${
      dolorPrecordial === 'si'
        ? 'Refiere dolor precordial de tipo opresivo que irradia al cuello, dientes o brazos.'
        : 'No refiere dolor precordial.'
    } ${lipotimia === 'si' ? 'Ha presentado' : 'No ha presentado'} episodios de lipotimia. El ritmo cardíaco es ${ritmoCardiaco}. Sintomatología cardiovascular reportada: ${sintomasCardiovascularesText}.`;
  };

  const generateAparatoGenitoUrinarioText = () => {
    const {
      frecuenciaUrinaria,
      sintomasUrinarios,
      ultimaMenstruacion,
      dismenorrea,
      ultimoParto,
      antecedentesObstetricos,
    } = formDataLocal;

    let sintomasUrinariosText = sintomasUrinarios.length
      ? sintomasUrinarios.join(', ')
      : 'ninguno';

    return `El paciente refiere una frecuencia urinaria de ${frecuenciaUrinaria} veces al día. Síntomas urinarios presentes: ${sintomasUrinariosText}. ${
      ultimaMenstruacion
        ? `Fecha de última menstruación: ${ultimaMenstruacion}. Dismenorrea: ${dismenorrea}. Último parto: ${ultimoParto}. Antecedentes obstétricos: ${antecedentesObstetricos}.`
        : ''
    }`;
  };

  const generateSistemaEndocrinoText = () => {
    const {
      sintomasEndocrinos,
      cambiosPeso,
      intoleranciaTemperatura,
      diagnosticosEndocrinos,
    } = formDataLocal;

    let sintomasEndocrinosText = sintomasEndocrinos.length
      ? sintomasEndocrinos.join(', ')
      : 'ninguno';

    return `El paciente refiere los siguientes síntomas endocrinos: ${sintomasEndocrinosText}. Reporta ${cambiosPeso} de peso sin causa aparente. ${
      intoleranciaTemperatura === 'no'
        ? 'No presenta intolerancia al frío ni al calor.'
        : `Presenta intolerancia al ${intoleranciaTemperatura}.`
    } Antecedentes patológicos conocidos: ${diagnosticosEndocrinos}.`;
  };

  const generateSistemaTegumentarioText = () => {
    const { cambiosColoracionPiel, sintomasTegumentarios } = formDataLocal;

    let sintomasTegumentariosText = sintomasTegumentarios.length
      ? sintomasTegumentarios.join(', ')
      : 'ninguno';

    return `${
      cambiosColoracionPiel === 'si' ? 'Ha' : 'No ha'
    } notado cambios en la coloración de la piel. Otros síntomas presentes: ${sintomasTegumentariosText}.`;
  };

  const generateSistemaMusculoEsqueleticoText = () => {
    const { fracturasEsguinces, sintomasMusculoEsqueleticos } = formDataLocal;

    let sintomasMusculoEsqueleticosText = sintomasMusculoEsqueleticos.length
      ? sintomasMusculoEsqueleticos.join(', ')
      : 'ninguno';

    return `${
      fracturasEsguinces === 'no'
        ? 'No ha presentado fracturas ni esguinces.'
        : `Ha presentado fracturas o esguinces. Fecha y secuelas: ${fracturasEsguinces}.`
    } Sintomatología musculoesquelética actual: ${sintomasMusculoEsqueleticosText}.`;
  };

  const generateSistemaNerviosoText = () => {
    const {
      percepcionSentidos,
      horasSuenio,
      trastornosSuenio,
      estadoAnimo,
      parestesias,
    } = formDataLocal;

    return `${
      percepcionSentidos === 'si' ? 'Percibe' : 'No percibe'
    } adecuadamente a través de los órganos de los sentidos. El patrón de sueño habitual es de ${horasSuenio} horas por noche. ${
      trastornosSuenio === 'si' ? 'Presenta' : 'No presenta'
    } trastornos del sueño. Su carácter habitual se describe como ${estadoAnimo}. ${
      parestesias === 'si' ? 'Presenta' : 'No presenta'
    } parestesias (hormigueos, adormecimiento o pérdida de sensibilidad).`;
  };

  const handleCopy = (section) => {
    navigator.clipboard.writeText(redacciones[section]);
    setCopied((prev) => ({
      ...prev,
      [section]: true,
    }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [section]: false })), 2000);
  };

  const handleFormChange = (field, value) => {
    setFormDataLocal((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    handleInterrogatorioChange(field, value);
  };

  const handleWordButtonClick = (field, value) => {
    const currentValues = formDataLocal[field];
    let newValues;

    if (currentValues.includes(value)) {
      newValues = currentValues.filter((v) => v !== value);
    } else {
      newValues = [...currentValues, value];
    }

    handleFormChange(field, newValues);
  };

  const limpiarFormulario = () => {
    const emptyData = {
      tipoAlimentacion: "",
      patronMasticacion: "",
      percepcionGusto: "",
      salivacion: "",
      dificultadTragar: "",
      halitosis: "",
      sintomasDigestivos: [],
      frecuenciaEvacuacion: "",
      tipoRespiracion: "",
      sintomasRespiratorios: [],
      dolorPrecordial: "",
      lipotimia: "",
      ritmoCardiaco: "",
      sintomasCardiovasculares: [],
      frecuenciaUrinaria: "",
      sintomasUrinarios: [],
      ultimaMenstruacion: "",
      dismenorrea: "",
      ultimoParto: "",
      antecedentesObstetricos: "",
      sintomasEndocrinos: [],
      cambiosPeso: "",
      intoleranciaTemperatura: "",
      diagnosticosEndocrinos: "",
      cambiosColoracionPiel: "",
      sintomasTegumentarios: [],
      fracturasEsguinces: "",
      sintomasMusculoEsqueleticos: [],
      percepcionSentidos: "",
      horasSuenio: "",
      trastornosSuenio: "",
      estadoAnimo: "",
      parestesias: "",
    };

    setFormDataLocal(emptyData);

    Object.entries(emptyData).forEach(([key, value]) => {
      handleInterrogatorioChange(key, value);
    });
    setShowForm(true);
    setRedacciones({
      aparatoDigestivo: "",
      aparatoRespiratorio: "",
      aparatoCardiovascular: "",
      aparatoGenitoUrinario: "",
      sistemaEndocrino: "",
      sistemaTegumentario: "",
      sistemaMusculoEsqueletico: "",
      sistemaNervioso: "",
    });
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
              <button onClick={() => setShowForm(true)} className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${showForm ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}>
                Formulario
              </button>
              <button onClick={() => setShowForm(false)} className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${!showForm ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}>
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
            <span className="text-gray-400">VIII.</span> INTERROGATORIO POR APARATOS Y SISTEMAS
          </h2>
        </div>

        {!isMinimized && (
          <div className="p-6" ref={formRef}>
            {showForm ? (
              <div className="space-y-6">
                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2 text-justify">Aparato Digestivo</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tipo de Alimentación</Label>
                      <Select value={formDataLocal.tipoAlimentacion} onValueChange={(value) => handleFormChange('tipoAlimentacion', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blanda">Blanda</SelectItem>
                          <SelectItem value="fibrosa">Fibrosa</SelectItem>
                          <SelectItem value="combinada">Combinada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Patrón de Masticación</Label>
                      <Select value={formDataLocal.patronMasticacion} onValueChange={(value) => handleFormChange('patronMasticacion', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione patrón" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unilateral">Unilateral</SelectItem>
                          <SelectItem value="bilateral">Bilateral</SelectItem>
                          <SelectItem value="anterior">Anterior</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Percepción del Gusto</Label>
                      <Select value={formDataLocal.percepcionGusto} onValueChange={(value) => handleFormChange('percepcionGusto', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione percepción" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="disminucion">Disminución o pérdida del gusto</SelectItem>
                          <SelectItem value="alterado">Sabores alterados (metálico, amargo, etc.)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Salivación</Label>
                      <Select value={formDataLocal.salivacion} onValueChange={(value) => handleFormChange('salivacion', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione salivación" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="aumentada">Aumentada (hipersalivación)</SelectItem>
                          <SelectItem value="disminuida">Disminuida (xerostomía)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Dificultad o Dolor al Tragar</Label>
                      <Select value={formDataLocal.dificultadTragar} onValueChange={(value) => handleFormChange('dificultadTragar', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="dificultad">Dificultad sin dolor</SelectItem>
                          <SelectItem value="dolor">Dolor al tragar (odinofagia)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Halitosis</Label>
                      <Select value={formDataLocal.halitosis} onValueChange={(value) => handleFormChange('halitosis', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="si">Sí</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Síntomas Digestivos</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Distensión abdominal" isSelected={formDataLocal.sintomasDigestivos.includes('distension abdominal')} onClick={() => handleWordButtonClick('sintomasDigestivos', 'distension abdominal')} />
                        <WordButton label="Estreñimiento" isSelected={formDataLocal.sintomasDigestivos.includes('estreñimiento')} onClick={() => handleWordButtonClick('sintomasDigestivos', 'estreñimiento')} />
                        <WordButton label="Sensación de llenura" isSelected={formDataLocal.sintomasDigestivos.includes('sensacion de llenura')} onClick={() => handleWordButtonClick('sintomasDigestivos', 'sensacion de llenura')} />
                        <WordButton label="Acidez (pirosis)" isSelected={formDataLocal.sintomasDigestivos.includes('acidez')} onClick={() => handleWordButtonClick('sintomasDigestivos', 'acidez')} />
                        <WordButton label="Dolor abdominal" isSelected={formDataLocal.sintomasDigestivos.includes('dolor abdominal')} onClick={() => handleWordButtonClick('sintomasDigestivos', 'dolor abdominal')} />
                        <WordButton label="Náuseas" isSelected={formDataLocal.sintomasDigestivos.includes('nauseas')} onClick={() => handleWordButtonClick('sintomasDigestivos', 'nauseas')} />
                        <WordButton label="Vómitos" isSelected={formDataLocal.sintomasDigestivos.includes('vomitos')} onClick={() => handleWordButtonClick('sintomasDigestivos', 'vomitos')} />
                        <WordButton label="Reflujo" isSelected={formDataLocal.sintomasDigestivos.includes('reflujo')} onClick={() => handleWordButtonClick('sintomasDigestivos', 'reflujo')} />
                        <WordButton label="Ninguno" isSelected={formDataLocal.sintomasDigestivos.includes('ninguno')} onClick={() => handleWordButtonClick('sintomasDigestivos', 'ninguno')} />
                      </div>
                    </div>
                    <div>
                      <Label>Frecuencia de Evacuación</Label>
                      <Select value={formDataLocal.frecuenciaEvacuacion} onValueChange={(value) => handleFormChange('frecuenciaEvacuacion', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="menos de 1">Menos de 1 vez al día</SelectItem>
                          <SelectItem value="1 a 2">1 a 2 veces</SelectItem>
                          <SelectItem value="mas de 2">Más de 2 veces</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2 text-justify">Aparato Respiratorio</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tipo de Respiración</Label>
                      <Select value={formDataLocal.tipoRespiracion} onValueChange={(value) => handleFormChange('tipoRespiracion', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nasal">Nasal</SelectItem>
                          <SelectItem value="bucal">Bucal</SelectItem>
                          <SelectItem value="combinada">Combinada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Síntomas Respiratorios</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Obstrucción nasal" isSelected={formDataLocal.sintomasRespiratorios.includes('obstruccion nasal')} onClick={() => handleWordButtonClick('sintomasRespiratorios', 'obstruccion nasal')} />
                        <WordButton label="Secreción nasal" isSelected={formDataLocal.sintomasRespiratorios.includes('secrecion nasal')} onClick={() => handleWordButtonClick('sintomasRespiratorios', 'secrecion nasal')} />
                        <WordButton label="Congestión nasal" isSelected={formDataLocal.sintomasRespiratorios.includes('congestion nasal')} onClick={() => handleWordButtonClick('sintomasRespiratorios', 'congestion nasal')} />
                        <WordButton label="Sangrado nasal" isSelected={formDataLocal.sintomasRespiratorios.includes('sangrado nasal')} onClick={() => handleWordButtonClick('sintomasRespiratorios', 'sangrado nasal')} />
                        <WordButton label="Dificultad para respirar" isSelected={formDataLocal.sintomasRespiratorios.includes('dificultad para respirar')} onClick={() => handleWordButtonClick('sintomasRespiratorios', 'dificultad para respirar')} />
                        <WordButton label="Tos" isSelected={formDataLocal.sintomasRespiratorios.includes('tos')} onClick={() => handleWordButtonClick('sintomasRespiratorios', 'tos')} />
                        <WordButton label="Dolor en el pecho" isSelected={formDataLocal.sintomasRespiratorios.includes('dolor en el pecho')} onClick={() => handleWordButtonClick('sintomasRespiratorios', 'dolor en el pecho')} />
                        <WordButton label="Hernias" isSelected={formDataLocal.sintomasRespiratorios.includes('hernias')} onClick={() => handleWordButtonClick('sintomasRespiratorios', 'hernias')} />
                        <WordButton label="Flemas" isSelected={formDataLocal.sintomasRespiratorios.includes('flemas')} onClick={() => handleWordButtonClick('sintomasRespiratorios', 'flemas')} />
                        <WordButton label="Mucosidad" isSelected={formDataLocal.sintomasRespiratorios.includes('mucosidad')} onClick={() => handleWordButtonClick('sintomasRespiratorios', 'mucosidad')} />
                        <WordButton label="Cianosis" isSelected={formDataLocal.sintomasRespiratorios.includes('cianosis')} onClick={() => handleWordButtonClick('sintomasRespiratorios', 'cianosis')} />
                        <WordButton label="Ninguno" isSelected={formDataLocal.sintomasRespiratorios.includes('ninguno')} onClick={() => handleWordButtonClick('sintomasRespiratorios', 'ninguno')} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2 text-justify">Aparato Cardiovascular</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Dolor Precordial</Label>
                      <Select value={formDataLocal.dolorPrecordial} onValueChange={(value) => handleFormChange('dolorPrecordial', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="si">Sí, de tipo opresivo que irradia al cuello, dientes o brazos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Lipotimia</Label>
                      <Select value={formDataLocal.lipotimia} onValueChange={(value) => handleFormChange('lipotimia', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="si">Sí</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Ritmo Cardíaco</Label>
                      <Select value={formDataLocal.ritmoCardiaco} onValueChange={(value) => handleFormChange('ritmoCardiaco', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione ritmo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="taquicardia">Rápido (taquicardia &gt;100 lpm)</SelectItem>
                          <SelectItem value="bradicardia">Lento (bradicardia &lt;60 lpm)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Síntomas Cardiovasculares</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Mareos" isSelected={formDataLocal.sintomasCardiovasculares.includes('mareos')} onClick={() => handleWordButtonClick('sintomasCardiovasculares', 'mareos')} />
                        <WordButton label="Hinchazón" isSelected={formDataLocal.sintomasCardiovasculares.includes('hinchazon')} onClick={() => handleWordButtonClick('sintomasCardiovasculares', 'hinchazon')} />
                        <WordButton label="Moretones" isSelected={formDataLocal.sintomasCardiovasculares.includes('moretones')} onClick={() => handleWordButtonClick('sintomasCardiovasculares', 'moretones')} />
                        <WordButton label="Várices" isSelected={formDataLocal.sintomasCardiovasculares.includes('varices')} onClick={() => handleWordButtonClick('sintomasCardiovasculares', 'varices')} />
                        <WordButton label="Dolor de cabeza" isSelected={formDataLocal.sintomasCardiovasculares.includes('dolor de cabeza')} onClick={() => handleWordButtonClick('sintomasCardiovasculares', 'dolor de cabeza')} />
                        <WordButton label="Zumbidos en los oídos" isSelected={formDataLocal.sintomasCardiovasculares.includes('zumbidos')} onClick={() => handleWordButtonClick('sintomasCardiovasculares', 'zumbidos')} />
                        <WordButton label="Luces al cerrar los ojos" isSelected={formDataLocal.sintomasCardiovasculares.includes('luces')} onClick={() => handleWordButtonClick('sintomasCardiovasculares', 'luces')} />
                        <WordButton label="Palpitaciones" isSelected={formDataLocal.sintomasCardiovasculares.includes('palpitaciones')} onClick={() => handleWordButtonClick('sintomasCardiovasculares', 'palpitaciones')} />
                        <WordButton label="Ninguno" isSelected={formDataLocal.sintomasCardiovasculares.includes('ninguno')} onClick={() => handleWordButtonClick('sintomasCardiovasculares', 'ninguno')} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2 text-justify">Aparato Genito-Urinario</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Frecuencia Urinaria</Label>
                      <Select value={formDataLocal.frecuenciaUrinaria} onValueChange={(value) => handleFormChange('frecuenciaUrinaria', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="menos de 3">Menos de 3 veces</SelectItem>
                          <SelectItem value="3 a 6">3 a 6 veces</SelectItem>
                          <SelectItem value="mas de 6">Más de 6 veces</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Síntomas Urinarios</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Incontinencia" isSelected={formDataLocal.sintomasUrinarios.includes('incontinencia')} onClick={() => handleWordButtonClick('sintomasUrinarios', 'incontinencia')} />
                        <WordButton label="Dolor al orinar" isSelected={formDataLocal.sintomasUrinarios.includes('dolor al orinar')} onClick={() => handleWordButtonClick('sintomasUrinarios', 'dolor al orinar')} />
                        <WordButton label="Sangre en orina" isSelected={formDataLocal.sintomasUrinarios.includes('sangre en orina')} onClick={() => handleWordButtonClick('sintomasUrinarios', 'sangre en orina')} />
                        <WordButton label="Orina en exceso" isSelected={formDataLocal.sintomasUrinarios.includes('orina en exceso')} onClick={() => handleWordButtonClick('sintomasUrinarios', 'orina en exceso')} />
                        <WordButton label="Necesidad de orinar durante la noche" isSelected={formDataLocal.sintomasUrinarios.includes('necesidad de orinar durante la noche')} onClick={() => handleWordButtonClick('sintomasUrinarios', 'necesidad de orinar durante la noche')} />
                        <WordButton label="Dolor en la región lumbar" isSelected={formDataLocal.sintomasUrinarios.includes('dolor en la region lumbar')} onClick={() => handleWordButtonClick('sintomasUrinarios', 'dolor en la region lumbar')} />
                        <WordButton label="Ninguno" isSelected={formDataLocal.sintomasUrinarios.includes('ninguno')} onClick={() => handleWordButtonClick('sintomasUrinarios', 'ninguno')} />
                      </div>
                    </div>
                    <div>
                      <Label>Fecha de Última Menstruación</Label>
                      <input
                        type="date"
                        value={formDataLocal.ultimaMenstruacion}
                        onChange={(e) => handleFormChange('ultimaMenstruacion', e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <Label>Dismenorrea</Label>
                      <Select value={formDataLocal.dismenorrea} onValueChange={(value) => handleFormChange('dismenorrea', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="si">Sí</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Fecha de Último Parto</Label>
                      <input
                        type="date"
                        value={formDataLocal.ultimoParto}
                        onChange={(e) => handleFormChange('ultimoParto', e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <Label>Antecedentes Obstétricos</Label>
                      <Select value={formDataLocal.antecedentesObstetricos} onValueChange={(value) => handleFormChange('antecedentesObstetricos', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ninguno">Ninguno</SelectItem>
                          <SelectItem value="abortos">Abortos</SelectItem>
                          <SelectItem value="cesareas">Cesáreas</SelectItem>
                          <SelectItem value="ambos">Ambos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2 text-justify">Sistema Endocrino</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Síntomas Endocrinos</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Poliuria" isSelected={formDataLocal.sintomasEndocrinos.includes('poliuria')} onClick={() => handleWordButtonClick('sintomasEndocrinos', 'poliuria')} />
                        <WordButton label="Polidipsia" isSelected={formDataLocal.sintomasEndocrinos.includes('polidipsia')} onClick={() => handleWordButtonClick('sintomasEndocrinos', 'polidipsia')} />
                        <WordButton label="Polifagia" isSelected={formDataLocal.sintomasEndocrinos.includes('polifagia')} onClick={() => handleWordButtonClick('sintomasEndocrinos', 'polifagia')} />
                        <WordButton label="Ojos saltones" isSelected={formDataLocal.sintomasEndocrinos.includes('ojos saltones')} onClick={() => handleWordButtonClick('sintomasEndocrinos', 'ojos saltones')} />
                        <WordButton label="Nerviosismo" isSelected={formDataLocal.sintomasEndocrinos.includes('nerviosismo')} onClick={() => handleWordButtonClick('sintomasEndocrinos', 'nerviosismo')} />
                        <WordButton label="Temblores" isSelected={formDataLocal.sintomasEndocrinos.includes('temblores')} onClick={() => handleWordButtonClick('sintomasEndocrinos', 'temblores')} />
                        <WordButton label="Insomnio" isSelected={formDataLocal.sintomasEndocrinos.includes('insomnio')} onClick={() => handleWordButtonClick('sintomasEndocrinos', 'insomnio')} />
                        <WordButton label="Ninguno" isSelected={formDataLocal.sintomasEndocrinos.includes('ninguno')} onClick={() => handleWordButtonClick('sintomasEndocrinos', 'ninguno')} />
                      </div>
                    </div>
                    <div>
                      <Label>Cambios de Peso</Label>
                      <Select value={formDataLocal.cambiosPeso} onValueChange={(value) => handleFormChange('cambiosPeso', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="perdida">Pérdida de peso</SelectItem>
                          <SelectItem value="aumento">Aumento de peso</SelectItem>
                          <SelectItem value="sin cambios">Sin cambios</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Intolerancia a la Temperatura</Label>
                      <Select value={formDataLocal.intoleranciaTemperatura} onValueChange={(value) => handleFormChange('intoleranciaTemperatura', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="frío">Al frío</SelectItem>
                          <SelectItem value="calor">Al calor</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Diagnósticos Endocrinos</Label>
                      <Select value={formDataLocal.diagnosticosEndocrinos} onValueChange={(value) => handleFormChange('diagnosticosEndocrinos', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hipotiroidismo">Hipotiroidismo</SelectItem>
                          <SelectItem value="hipertiroidismo">Hipertiroidismo</SelectItem>
                          <SelectItem value="ninguno">Ninguno</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2 text-justify">Sistema Tegumentario</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Cambios en la Coloración de la Piel</Label>
                      <Select value={formDataLocal.cambiosColoracionPiel} onValueChange={(value) => handleFormChange('cambiosColoracionPiel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="si">Sí</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Síntomas Tegumentarios</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Erupciones" isSelected={formDataLocal.sintomasTegumentarios.includes('erupciones')} onClick={() => handleWordButtonClick('sintomasTegumentarios', 'erupciones')} />
                        <WordButton label="Comezón" isSelected={formDataLocal.sintomasTegumentarios.includes('comezon')} onClick={() => handleWordButtonClick('sintomasTegumentarios', 'comezon')} />
                        <WordButton label="Sudoración excesiva" isSelected={formDataLocal.sintomasTegumentarios.includes('sudoracion excesiva')} onClick={() => handleWordButtonClick('sintomasTegumentarios', 'sudoracion excesiva')} />
                        <WordButton label="Pérdida de cabello o vello" isSelected={formDataLocal.sintomasTegumentarios.includes('perdida de cabello o vello')} onClick={() => handleWordButtonClick('sintomasTegumentarios', 'perdida de cabello o vello')} />
                        <WordButton label="Piel seca" isSelected={formDataLocal.sintomasTegumentarios.includes('piel seca')} onClick={() => handleWordButtonClick('sintomasTegumentarios', 'piel seca')} />
                        <WordButton label="Ninguno" isSelected={formDataLocal.sintomasTegumentarios.includes('ninguno')} onClick={() => handleWordButtonClick('sintomasTegumentarios', 'ninguno')} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2 text-justify">Sistema Músculo-Esquelético</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Fracturas o Esguinces</Label>
                      <input
                        type="text"
                        value={formDataLocal.fracturasEsguinces}
                        onChange={(e) => handleFormChange('fracturasEsguinces', e.target.value)}
                        placeholder="Indique fecha y secuelas"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <Label>Síntomas Musculoesqueléticos</Label>
                      <div className="flex flex-wrap mt-1">
                        <WordButton label="Deformidad en las articulaciones" isSelected={formDataLocal.sintomasMusculoEsqueleticos.includes('deformidad en las articulaciones')} onClick={() => handleWordButtonClick('sintomasMusculoEsqueleticos', 'deformidad en las articulaciones')} />
                        <WordButton label="Dolor articular" isSelected={formDataLocal.sintomasMusculoEsqueleticos.includes('dolor articular')} onClick={() => handleWordButtonClick('sintomasMusculoEsqueleticos', 'dolor articular')} />
                        <WordButton label="Limitación en los movimientos" isSelected={formDataLocal.sintomasMusculoEsqueleticos.includes('limitacion en los movimientos')} onClick={() => handleWordButtonClick('sintomasMusculoEsqueleticos', 'limitacion en los movimientos')} />
                        <WordButton label="Ninguno" isSelected={formDataLocal.sintomasMusculoEsqueleticos.includes('ninguno')} onClick={() => handleWordButtonClick('sintomasMusculoEsqueleticos', 'ninguno')} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold mb-2 text-justify">Sistema Nervioso</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Percepción a través de los Sentidos</Label>
                      <Select value={formDataLocal.percepcionSentidos} onValueChange={(value) => handleFormChange('percepcionSentidos', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="si">Sí</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Horas de Sueño</Label>
                      <Select value={formDataLocal.horasSuenio} onValueChange={(value) => handleFormChange('horasSuenio', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="menos de 4">Menos de 4</SelectItem>
                          <SelectItem value="4 a 6">4 a 6</SelectItem>
                          <SelectItem value="7 a 8">7 a 8</SelectItem>
                          <SelectItem value="mas de 8">Más de 8</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Trastornos del Sueño</Label>
                      <Select value={formDataLocal.trastornosSuenio} onValueChange={(value) => handleFormChange('trastornosSuenio', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="si">Sí</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Estado de Ánimo</Label>
                      <Select value={formDataLocal.estadoAnimo} onValueChange={(value) => handleFormChange('estadoAnimo', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tranquilo">Tranquilo</SelectItem>
                          <SelectItem value="irritable">Irritable</SelectItem>
                          <SelectItem value="aprensivo">Aprensivo</SelectItem>
                          <SelectItem value="alegre">Alegre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Parestesias</Label>
                      <Select value={formDataLocal.parestesias} onValueChange={(value) => handleFormChange('parestesias', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="si">Sí</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button onClick={generarRedaccionIA} className="bg-blue-500 hover:bg-blue-600 text-white">
                    Generar Redacción IA
                  </Button>
                  <Button onClick={limpiarFormulario} variant="outline" className="ml-4 flex items-center gap-2">
                    <Eraser className="w-4 h-4" />
                    Limpiar formulario
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Aparato Digestivo</h4>
                    <button onClick={() => handleCopy('aparatoDigestivo')} className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.aparatoDigestivo ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.aparatoDigestivo}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Aparato Respiratorio</h4>
                    <button onClick={() => handleCopy('aparatoRespiratorio')} className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.aparatoRespiratorio ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.aparatoRespiratorio}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Aparato Cardiovascular</h4>
                    <button onClick={() => handleCopy('aparatoCardiovascular')} className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.aparatoCardiovascular ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.aparatoCardiovascular}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Aparato Genito-Urinario</h4>
                    <button onClick={() => handleCopy('aparatoGenitoUrinario')} className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.aparatoGenitoUrinario ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.aparatoGenitoUrinario}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Sistema Endocrino</h4>
                    <button onClick={() => handleCopy('sistemaEndocrino')} className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.sistemaEndocrino ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.sistemaEndocrino}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Sistema Tegumentario</h4>
                    <button onClick={() => handleCopy('sistemaTegumentario')} className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.sistemaTegumentario ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.sistemaTegumentario}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Sistema Músculo-Esquelético</h4>
                    <button onClick={() => handleCopy('sistemaMusculoEsqueletico')} className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.sistemaMusculoEsqueletico ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.sistemaMusculoEsqueletico}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Sistema Nervioso</h4>
                    <button onClick={() => handleCopy('sistemaNervioso')} className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                      {copied.sistemaNervioso ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatedTextarea
                    content={redacciones.sistemaNervioso}
                    className="min-h-[150px] bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full resize-none text-sm"
                    readOnly
                    textAlign="justify"
                  />
                </div>

                <div className="flex justify-center">
                  <Button onClick={() => setShowForm(true)} variant="outline" className="text-blue-500 border-blue-500">
                    Volver al Formulario
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default InterrogatorioSistemas;
