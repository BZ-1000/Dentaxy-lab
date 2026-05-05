
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, Eraser } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/ui/voice-input";

interface AntecedentesAlergicosProps {
  formData: FormDataState;
  handleAntecedenteAlergicoChange?: (field: string, value: any) => void;
  onRedaccionGenerada?: (content: string) => void;
  onToggleViewMode?: () => void;
}

const AntecedentesAlergicos: React.FC<AntecedentesAlergicosProps> = ({
  formData,
  handleAntecedenteAlergicoChange,
  onRedaccionGenerada,
  onToggleViewMode
}) => {
  const [redaccionContent, setRedaccionContent] = useState('');

  // Toggle buttons
  const handleToggleButton = (field: string) => {
    if (handleAntecedenteAlergicoChange) {
      handleAntecedenteAlergicoChange(field, !formData.antecedentesAlergicos[field]);
    }
  };

  const handleToggleAllergyType = (type: 'medicamentos' | 'alimentos' | 'ambiente') => {
    if (handleAntecedenteAlergicoChange) {
      const currentValue = formData.antecedentesAlergicos.tiposAlergias?.[type] || false;
      handleAntecedenteAlergicoChange(`tiposAlergias.${type}`, !currentValue);
    }
  };

  const handleToggleAddiction = (type: 'tabaco' | 'alcohol' | 'drogas') => {
    if (handleAntecedenteAlergicoChange) {
      const currentValue = formData.antecedentesAlergicos.adicciones?.[type] || false;
      handleAntecedenteAlergicoChange(`adicciones.${type}`, !currentValue);
    }
  };

  const handleTextChange = (field: string, value: string) => {
    if (handleAntecedenteAlergicoChange) {
      handleAntecedenteAlergicoChange(field, value);
    }
  };

  const handleVoiceInput = (field: string) => (text: string) => {
    if (handleAntecedenteAlergicoChange) {
      const currentValue = formData.antecedentesAlergicos[field] || "";
      handleAntecedenteAlergicoChange(field, currentValue ? `${currentValue} ${text}` : text);
    }
  };

  // Check if any allergy type is selected
  const hasAnyAllergySelected =
    (formData.antecedentesAlergicos.tiposAlergias?.medicamentos || false) ||
    (formData.antecedentesAlergicos.tiposAlergias?.alimentos || false) ||
    (formData.antecedentesAlergicos.tiposAlergias?.ambiente || false);

  const generateRedaccion = () => {
    // Instant generation, removed setTimeout for snappy UX
    let content = "<strong>Antecedentes Alérgicos</strong><br/><br/>";

    const alergias = [];
    if (formData.antecedentesAlergicos.tiposAlergias?.medicamentos) alergias.push("medicamentos");
    if (formData.antecedentesAlergicos.tiposAlergias?.alimentos) alergias.push("alimentos");
    if (formData.antecedentesAlergicos.tiposAlergias?.ambiente) alergias.push("ambiente");

    let alergiasText = "";
    if (alergias.length > 0) {
      alergiasText += `El paciente presenta antecedentes de alergia a ${alergias.join(", ")}. `;
      if (formData.antecedentesAlergicos.cualesAlergias) {
        alergiasText += `Específicamente a: ${formData.antecedentesAlergicos.cualesAlergias}. `;
      }
      if (formData.antecedentesAlergicos.especificacionAlergias) {
        alergiasText += `Se manifiesta como: ${formData.antecedentesAlergicos.especificacionAlergias}. `;
      }
    } else {
      alergiasText += "El paciente no refiere antecedentes de alergias. ";
    }
    content += `<div style="text-align: justify;">${alergiasText}</div><br/>`;

    content += "<strong>Antecedentes de Anestesia</strong><br/>";
    let anestesiaText = "";
    if (formData.antecedentesAlergicos.administradoAnestesia) {
      anestesiaText += "Se le ha administrado anestesia previamente";
      if (formData.antecedentesAlergicos.tipoAnestesia) {
        anestesiaText += `: ${formData.antecedentesAlergicos.tipoAnestesia}. `;
      } else {
        anestesiaText += ". ";
      }
      if (formData.antecedentesAlergicos.reaccionAnestesia) {
        anestesiaText += "Presentó reacción adversa a la anestesia";
        if (formData.antecedentesAlergicos.descripcionReaccion) {
          anestesiaText += `: ${formData.antecedentesAlergicos.descripcionReaccion}. `;
        } else {
          anestesiaText += ". ";
        }
      } else {
        anestesiaText += "No presentó reacciones adversas a la anestesia. ";
      }
    } else {
      anestesiaText += "No se le ha administrado anestesia previamente. ";
    }
    content += `<div style="text-align: justify;">${anestesiaText}</div><br/>`;

    content += "<strong>Adicciones</strong><br/>";
    let adiccionesText = "";
    const adicciones = [];
    if (formData.antecedentesAlergicos.adicciones?.tabaco) adicciones.push("tabaco");
    if (formData.antecedentesAlergicos.adicciones?.alcohol) adicciones.push("alcohol");
    if (formData.antecedentesAlergicos.adicciones?.drogas) adicciones.push("drogas");

    if (adicciones.length > 0) {
      adiccionesText += `El paciente refiere adicción a: ${adicciones.join(", ")}. `;
      if (formData.antecedentesAlergicos.detallesAdicciones) {
        adiccionesText += `Detalles: ${formData.antecedentesAlergicos.detallesAdicciones}`;
      }
    } else {
      adiccionesText += "El paciente no refiere adicciones.";
    }
    content += `<div style="text-align: justify;">${adiccionesText}</div>`;

    if (onRedaccionGenerada) {
      onRedaccionGenerada(content);
    }
    if (onToggleViewMode) {
      onToggleViewMode();
    }
  };

  const limpiarFormulario = () => {
    // Logic to reset form (assuming parent handles it if we pass specific 'false' values or empty strings, or if there is a global reset. 
    // The original code didn't have a clear "reset" function exposed here.
    // But assuming we want to reset fields:
    if (handleAntecedenteAlergicoChange) {
      handleAntecedenteAlergicoChange("cualesAlergias", "");
      handleAntecedenteAlergicoChange("especificacionAlergias", "");
      handleAntecedenteAlergicoChange("tipoAnestesia", "");
      handleAntecedenteAlergicoChange("descripcionReaccion", "");
      handleAntecedenteAlergicoChange("detallesAdicciones", "");
      // Reset booleans
      handleAntecedenteAlergicoChange("administradoAnestesia", null); // Or false?
      handleAntecedenteAlergicoChange("reaccionAnestesia", null);

      // For nested objects like tiposAlergias and adicciones, we might need specific calls if the handler supports paths.
      // Based on `handleToggleAllergyType`, handled via "tiposAlergias.medicamentos".
      ['medicamentos', 'alimentos', 'ambiente'].forEach(t => handleAntecedenteAlergicoChange(`tiposAlergias.${t}`, false));
      ['tabaco', 'alcohol', 'drogas'].forEach(t => handleAntecedenteAlergicoChange(`adicciones.${t}`, false));
    }
  };

  return (
    <div className='bg-background dark:bg-background transition-colors duration-300' data-section-redaction="true" data-section-name="antecedentesAlergicos" data-formulario-section="antecedentes-alergicos">
      <div className="space-y-6">
        <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold mb-2 text-justify">Alergias</h4>

          <div>
            <h3 className="text-md font-medium mb-2">¿Ha presentado alguna reacción alérgica a alguno de los siguientes?</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { label: "Medicamentos", value: "medicamentos" },
                { label: "Alimentos", value: "alimentos" },
                { label: "Entorno ambiental", value: "ambiente" }
              ].map(item => (
                <button
                  key={item.value}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${formData.antecedentesAlergicos.tiposAlergias?.[item.value] ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
                  onClick={() => handleToggleAllergyType(item.value as any)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {hasAnyAllergySelected && (
            <>
              <div className="relative mt-4">
                <label className="block text-sm font-medium mb-1">¿Cuáles?</label>
                <div className="flex items-center">
                  <Textarea
                    value={formData.antecedentesAlergicos.cualesAlergias || ''}
                    onChange={e => handleTextChange('cualesAlergias', e.target.value)}
                    placeholder="Especifique qué medicamentos, alimentos o elementos ambientales"
                    className="min-h-[80px] flex-1"
                  />
                  <div className="ml-2">
                    <VoiceInput onTranscriptionComplete={handleVoiceInput('cualesAlergias')} />
                  </div>
                </div>
              </div>

              <div className="relative mt-4">
                <label className="block text-sm font-medium mb-1">¿A qué específicamente?</label>
                <div className="flex items-center">
                  <Textarea
                    value={formData.antecedentesAlergicos.especificacionAlergias || ''}
                    onChange={e => handleTextChange('especificacionAlergias', e.target.value)}
                    placeholder="Describa específicamente la alergia"
                    className="min-h-[80px] flex-1"
                  />
                  <div className="ml-2">
                    <VoiceInput onTranscriptionComplete={handleVoiceInput('especificacionAlergias')} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold mb-2 text-justify">Anestesia</h4>
          <div>
            <h3 className="text-md font-medium mb-2">¿Le han administrado anestesia general y/o local?</h3>
            <div className="flex gap-4">
              <button
                className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.antecedentesAlergicos.administradoAnestesia === true ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                onClick={() => handleToggleButton('administradoAnestesia')}
              >
                Sí
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.antecedentesAlergicos.administradoAnestesia === false ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                onClick={() => handleToggleButton('administradoAnestesia')}
              >
                No
              </button>
            </div>
          </div>

          {formData.antecedentesAlergicos.administradoAnestesia === true && (
            <div className="relative mt-4">
              <label className="block text-sm font-medium mb-1">Especifique el tipo de anestesia y procedimiento:</label>
              <div className="flex items-center">
                <Textarea
                  value={formData.antecedentesAlergicos.tipoAnestesia || ''}
                  onChange={e => handleTextChange('tipoAnestesia', e.target.value)}
                  placeholder="Tipo de anestesia y procedimiento"
                  className="min-h-[80px] flex-1"
                />
                <div className="ml-2">
                  <VoiceInput onTranscriptionComplete={handleVoiceInput('tipoAnestesia')} />
                </div>
              </div>
            </div>
          )}

          <div className="mt-4">
            <h3 className="text-md font-medium mb-2">¿Tuvo alguna reacción adversa a la anestesia?</h3>
            <div className="flex gap-4">
              <button
                className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.antecedentesAlergicos.reaccionAnestesia === true ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                onClick={() => handleToggleButton('reaccionAnestesia')}
              >
                Sí
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm transition-colors ${formData.antecedentesAlergicos.reaccionAnestesia === false ? 'bg-[#2ecc71] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                onClick={() => handleToggleButton('reaccionAnestesia')}
              >
                No
              </button>
            </div>
          </div>

          {formData.antecedentesAlergicos.reaccionAnestesia === true && (
            <div className="relative mt-4">
              <label className="block text-sm font-medium mb-1">Si respondió que sí, especifique la reacción:</label>
              <div className="flex items-center">
                <Textarea
                  value={formData.antecedentesAlergicos.descripcionReaccion || ''}
                  onChange={e => handleTextChange('descripcionReaccion', e.target.value)}
                  placeholder="Descripción de la reacción adversa"
                  className="min-h-[80px] flex-1"
                />
                <div className="ml-2">
                  <VoiceInput onTranscriptionComplete={handleVoiceInput('descripcionReaccion')} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold mb-2 text-justify">Adicciones</h4>
          <div>
            <h3 className="text-md font-medium mb-2">¿Tiene alguna adicción actual o pasada?</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { label: "Tabaco", value: "tabaco" },
                { label: "Alcohol", value: "alcohol" },
                { label: "Drogas", value: "drogas" }
              ].map(item => (
                <button
                  key={item.value}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${formData.antecedentesAlergicos.adicciones?.[item.value] ? 'bg-[#B3E5FC] hover:bg-[#B3E5FC]/80' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
                  onClick={() => handleToggleAddiction(item.value as any)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {(formData.antecedentesAlergicos.adicciones?.tabaco ||
            formData.antecedentesAlergicos.adicciones?.alcohol ||
            formData.antecedentesAlergicos.adicciones?.drogas) && (
              <div className="relative mt-4">
                <label className="block text-sm font-medium mb-1">Especifique tipo, frecuencia y duración:</label>
                <div className="flex items-center">
                  <Textarea
                    value={formData.antecedentesAlergicos.detallesAdicciones || ''}
                    onChange={e => handleTextChange('detallesAdicciones', e.target.value)}
                    placeholder="Detalles sobre adicciones"
                    className="min-h-[80px] flex-1"
                  />
                  <div className="ml-2">
                    <VoiceInput onTranscriptionComplete={handleVoiceInput('detallesAdicciones')} />
                  </div>
                </div>
              </div>
            )}
        </div>

      </div>

      {/* Footer Controls */}
      <div className="flex justify-end items-center gap-4 pt-10 opacity-90 transition-opacity">
        {onToggleViewMode && (
          <Button
            variant="outline"
            onClick={generateRedaccion}
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

export default AntecedentesAlergicos;
