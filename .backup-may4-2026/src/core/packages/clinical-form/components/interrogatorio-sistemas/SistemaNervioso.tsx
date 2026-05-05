import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WordButton } from './components/WordButton';
import SintomasToggle from '../padecimiento/SintomasToggle';

export interface SistemaNerviosoData {
  percepcionSentidos: string;
  horasSueno: string;
  trastornosSueno: string;
  trastornosSuenoEspecificaciones: string;
  estadoAnimo: string;
  parestesias: string;
  otrosSintomasNeurologicos: string[];
}

export const redaccionNerviosoSinSintomas = "El paciente percibe adecuadamente a través de los órganos de los sentidos. El patrón de sueño habitual se reporta sin alteraciones, negando trastornos del sueño. Su estado de ánimo se describe tranquilo. No presenta parestesias, convulsiones, temblores, ni problemas de memoria o concentración. Niega cambios en la personalidad o comportamiento, así como alteraciones en la coordinación motora.";

export const generateNerviosoRedaccion = (data: SistemaNerviosoData, isHealthy: boolean): string => {
  if (isHealthy) {
    return redaccionNerviosoSinSintomas;
  }

  let text = "";

  if (data.percepcionSentidos) {
    text += `${data.percepcionSentidos === "Sí" ? "Percibe" : "No percibe"} adecuadamente a través de los órganos de los sentidos. `;
  }

  if (data.horasSueno) {
    text += `El patrón de sueño habitual es de ${data.horasSueno} horas por noche. `;
  }

  if (data.trastornosSueno) {
    text += `${data.trastornosSueno === "Sí" ? "Presenta trastornos del sueño." : "No presenta trastornos del sueño."} `;
    if (data.trastornosSueno === "Sí" && data.trastornosSuenoEspecificaciones) {
      text += `Especificaciones de los trastornos de sueño: ${data.trastornosSuenoEspecificaciones}. `;
    }
  }

  if (data.estadoAnimo) {
    text += `Su estado de ánimo habitual se describe como ${data.estadoAnimo.toLowerCase()}. `;
  }

  if (data.parestesias) {
    text += `${data.parestesias === "Sí" ? "Presenta" : "No presenta"} parestesias (hormigueos, adormecimiento o pérdida de sensibilidad). `;
  }

  if (data.otrosSintomasNeurologicos.includes("Ninguno") || data.otrosSintomasNeurologicos.length === 0) {
    text += "El paciente niega otras alteraciones relacionadas al sistema nervioso, tales como convulsiones, temblores, problemas de memoria, cambios de personalidad o problemas de coordinación. ";
  } else {
    text += `Otros síntomas neurológicos reportados: ${data.otrosSintomasNeurologicos.join(", ")}. `;
  }

  return text.trim();
};

interface SistemaNerviosoProps {
  data: SistemaNerviosoData;
  isHealthy: boolean;
  onHealthyToggle: (checked: boolean) => void;
  onRadioChange: (field: string, value: string) => void;
  onCheckboxChange: (field: string, value: string, checked: boolean) => void;
  onTextChange: (field: string, value: string) => void;
}

export const SistemaNervioso: React.FC<SistemaNerviosoProps> = ({
  data,
  isHealthy,
  onHealthyToggle,
  onRadioChange,
  onCheckboxChange,
  onTextChange,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Sistema Nervioso</h4>
        <SintomasToggle
          checked={isHealthy}
          onChange={onHealthyToggle}
        />
      </div>
      {!isHealthy && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Percepción de los Sentidos</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Sí" isSelected={data.percepcionSentidos === "Sí"} onClick={() => onRadioChange("percepcionSentidos", "Sí")} />
              <WordButton label="No" isSelected={data.percepcionSentidos === "No"} onClick={() => onRadioChange("percepcionSentidos", "No")} />
            </div>
          </div>
          <div>
            <Label>Horas de Sueño</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Menos de 4" isSelected={data.horasSueno === "Menos de 4"} onClick={() => onRadioChange("horasSueno", "Menos de 4")} />
              <WordButton label="4 a 6" isSelected={data.horasSueno === "4 a 6"} onClick={() => onRadioChange("horasSueno", "4 a 6")} />
              <WordButton label="7 a 8" isSelected={data.horasSueno === "7 a 8"} onClick={() => onRadioChange("horasSueno", "7 a 8")} />
              <WordButton label="Más de 8" isSelected={data.horasSueno === "Más de 8"} onClick={() => onRadioChange("horasSueno", "Más de 8")} />
            </div>
          </div>
          <div>
            <Label>Trastornos del Sueño</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Sí" isSelected={data.trastornosSueno === "Sí"} onClick={() => onRadioChange("trastornosSueno", "Sí")} />
              <WordButton label="No" isSelected={data.trastornosSueno === "No"} onClick={() => onRadioChange("trastornosSueno", "No")} />
            </div>
            {data.trastornosSueno === "Sí" && (
              <Textarea
                placeholder="Escriba especificaciones relacionadas..."
                value={data.trastornosSuenoEspecificaciones || ""}
                onChange={(e) => onTextChange("trastornosSuenoEspecificaciones", e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm mt-2"
                rows={2}
              />
            )}
          </div>
          <div>
            <Label>Estado de Ánimo</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Tranquilo" isSelected={data.estadoAnimo === "Tranquilo"} onClick={() => onRadioChange("estadoAnimo", "Tranquilo")} />
              <WordButton label="Irritable" isSelected={data.estadoAnimo === "Irritable"} onClick={() => onRadioChange("estadoAnimo", "Irritable")} />
              <WordButton label="Aprensivo" isSelected={data.estadoAnimo === "Aprensivo"} onClick={() => onRadioChange("estadoAnimo", "Aprensivo")} />
              <WordButton label="Alegre" isSelected={data.estadoAnimo === "Alegre"} onClick={() => onRadioChange("estadoAnimo", "Alegre")} />
            </div>
          </div>
          <div>
            <Label>Parestesias</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Sí" isSelected={data.parestesias === "Sí"} onClick={() => onRadioChange("parestesias", "Sí")} />
              <WordButton label="No" isSelected={data.parestesias === "No"} onClick={() => onRadioChange("parestesias", "No")} />
            </div>
          </div>
          <div>
            <Label>Otros Síntomas Neurológicos</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Convulsiones" isSelected={data.otrosSintomasNeurologicos.includes("Convulsiones")} onClick={() => onCheckboxChange("otrosSintomasNeurologicos", "Convulsiones", !data.otrosSintomasNeurologicos.includes("Convulsiones"))} />
              <WordButton label="Temblores" isSelected={data.otrosSintomasNeurologicos.includes("Temblores")} onClick={() => onCheckboxChange("otrosSintomasNeurologicos", "Temblores", !data.otrosSintomasNeurologicos.includes("Temblores"))} />
              <WordButton label="Problemas de memoria o concentración" isSelected={data.otrosSintomasNeurologicos.includes("Problemas de memoria o concentración")} onClick={() => onCheckboxChange("otrosSintomasNeurologicos", "Problemas de memoria o concentración", !data.otrosSintomasNeurologicos.includes("Problemas de memoria o concentración"))} />
              <WordButton label="Cambios de personalidad o comportamiento" isSelected={data.otrosSintomasNeurologicos.includes("Cambios de personalidad o comportamiento")} onClick={() => onCheckboxChange("otrosSintomasNeurologicos", "Cambios de personalidad o comportamiento", !data.otrosSintomasNeurologicos.includes("Cambios de personalidad o comportamiento"))} />
              <WordButton label="Coordinación motora alterada" isSelected={data.otrosSintomasNeurologicos.includes("Coordinación motora alterada")} onClick={() => onCheckboxChange("otrosSintomasNeurologicos", "Coordinación motora alterada", !data.otrosSintomasNeurologicos.includes("Coordinación motora alterada"))} />
              <WordButton label="Ninguno" isSelected={data.otrosSintomasNeurologicos.includes("Ninguno")} onClick={() => onCheckboxChange("otrosSintomasNeurologicos", "Ninguno", !data.otrosSintomasNeurologicos.includes("Ninguno"))} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
