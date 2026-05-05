import React from 'react';
import { Label } from "@/components/ui/label";
import { WordButton } from './components/WordButton';
import SintomasToggle from '../padecimiento/SintomasToggle';

export interface AparatoGenitoUrinarioData {
  frecuenciaUrinaria: string;
  sintomasUrinarios: string[];
  urgenciaUrinaria: string;
  chorroUrinarioDebil: string;
  chorroUrinarioIntermitente: string;
  flujoVaginalUretral: string;
  infeccionesUrinarias: string;
  ultimaMenstruacion: string;
  dismenorrea: string;
  duracionMenstruacion: string;
  ultimoParto: string;
  antecedentesObstetricos: string;
}

export const redaccionGenitoUrinarioSinSintomas = "El paciente refiere una frecuencia urinaria entre 3 a 6 veces al día. Niega síntomas urinarios como incontinencia, disuria, hematuria, poliuria, nicturia o dolor lumbar. No presenta urgencia urinaria ni alteraciones en la fuerza o continuidad del chorro urinario. Niega flujo vaginal o uretral anormal, así como infecciones urinarias frecuentes. En el caso de pacientes masculinos, no aplica la sección de antecedentes menstruales u obstétricos. En caso de pacientes femeninos, refiere menstruaciones regulares, con última menstruación en fecha reciente, sin dismenorrea, con duración de 3 a 5 días. Niega antecedentes de abortos o cesáreas.";

export const generateGenitoUrinarioRedaccion = (data: AparatoGenitoUrinarioData, isHealthy: boolean): string => {
  if (isHealthy) {
    return redaccionGenitoUrinarioSinSintomas;
  }

  let text = `El paciente refiere una frecuencia urinaria de ${data.frecuenciaUrinaria || "[sin especificar]"} veces al día.`;

  if (data.sintomasUrinarios.includes("Ninguno")) {
    text += " El paciente niega alteraciones relacionadas al aparato genito-urinario. Se exploró la frecuencia urinaria, síntomas urinarios, urgencia urinaria, fuerza del chorro, infecciones recurrentes y flujo anormal.";
  } else {
    text += ` Síntomas urinarios presentes: ${data.sintomasUrinarios.join(", ")}.`;
  }

  if (data.urgenciaUrinaria) {
    text += ` ${data.urgenciaUrinaria === "Sí" ? "Presenta urgencia urinaria." : "No presenta urgencia urinaria."}`;
  }
  if (data.chorroUrinarioDebil) {
    text += ` ${data.chorroUrinarioDebil === "Sí" ? "Presenta chorro urinario débil." : "No presenta chorro urinario débil."}`;
  }
  if (data.chorroUrinarioIntermitente) {
    text += ` ${data.chorroUrinarioIntermitente === "Sí" ? "Presenta chorro urinario intermitente." : "No presenta chorro urinario intermitente."}`;
  }
  if (data.flujoVaginalUretral) {
    text += ` ${data.flujoVaginalUretral === "Sí" ? "Presenta flujo vaginal/uretral anormal." : "No presenta flujo vaginal/uretral anormal."}`;
  }
  if (data.infeccionesUrinarias) {
    text += ` ${data.infeccionesUrinarias === "Sí" ? "Presenta infecciones urinarias frecuentes." : "No presenta infecciones urinarias frecuentes."}`;
  }

  // Datos específicos femeninos, solo se incluyen si hay información para evitar ruido si es paciente masculino o si la paciente no los llena.
  if (data.ultimaMenstruacion || data.dismenorrea || data.duracionMenstruacion || data.ultimoParto || data.antecedentesObstetricos) {
    const obstetricoDetails = [];
    if (data.ultimaMenstruacion) obstetricoDetails.push(`Fecha de última menstruación: ${data.ultimaMenstruacion}`);
    if (data.dismenorrea) obstetricoDetails.push(`Dismenorrea: ${data.dismenorrea}`);
    if (data.duracionMenstruacion) obstetricoDetails.push(`Días de duración de menstruación: ${data.duracionMenstruacion}`);
    if (data.ultimoParto) obstetricoDetails.push(`Fecha de último parto: ${data.ultimoParto}`);
    if (data.antecedentesObstetricos) obstetricoDetails.push(`Antecedentes obstétricos: ${data.antecedentesObstetricos}`);

    text += ` Antecedentes gineco-obstétricos: ${obstetricoDetails.join(", ")}.`;
  }

  return text.trim();
};

interface AparatoGenitoUrinarioProps {
  data: AparatoGenitoUrinarioData;
  isHealthy: boolean;
  onHealthyToggle: (checked: boolean) => void;
  onRadioChange: (field: string, value: string) => void;
  onCheckboxChange: (field: string, value: string, checked: boolean) => void;
  onTextChange: (field: string, value: string) => void;
}

export const AparatoGenitoUrinario: React.FC<AparatoGenitoUrinarioProps> = ({
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
        <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Aparato Genito-Urinario</h4>
        <SintomasToggle
          checked={isHealthy}
          onChange={onHealthyToggle}
        />
      </div>
      {!isHealthy && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Frecuencia Urinaria</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Menos de 3 veces" isSelected={data.frecuenciaUrinaria === "Menos de 3"} onClick={() => onRadioChange("frecuenciaUrinaria", "Menos de 3")} />
              <WordButton label="3 a 6 veces" isSelected={data.frecuenciaUrinaria === "3 a 6"} onClick={() => onRadioChange("frecuenciaUrinaria", "3 a 6")} />
              <WordButton label="Más de 6 veces" isSelected={data.frecuenciaUrinaria === "Más de 6"} onClick={() => onRadioChange("frecuenciaUrinaria", "Más de 6")} />
            </div>
          </div>
          <div>
            <Label>Síntomas Urinarios</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Incontinencia" isSelected={data.sintomasUrinarios.includes("Incontinencia")} onClick={() => onCheckboxChange("sintomasUrinarios", "Incontinencia", !data.sintomasUrinarios.includes("Incontinencia"))} />
              <WordButton label="Disuria" isSelected={data.sintomasUrinarios.includes("Dolor al orinar (disuria)")} onClick={() => onCheckboxChange("sintomasUrinarios", "Dolor al orinar (disuria)", !data.sintomasUrinarios.includes("Dolor al orinar (disuria)"))} />
              <WordButton label="Hematuria" isSelected={data.sintomasUrinarios.includes("Sangre en orina (hematuria)")} onClick={() => onCheckboxChange("sintomasUrinarios", "Sangre en orina (hematuria)", !data.sintomasUrinarios.includes("Sangre en orina (hematuria)"))} />
              <WordButton label="Poliuria" isSelected={data.sintomasUrinarios.includes("Orina en exceso (poliuria)")} onClick={() => onCheckboxChange("sintomasUrinarios", "Orina en exceso (poliuria)", !data.sintomasUrinarios.includes("Orina en exceso (poliuria)"))} />
              <WordButton label="Nicturia" isSelected={data.sintomasUrinarios.includes("Orinar de noche (nicturia)")} onClick={() => onCheckboxChange("sintomasUrinarios", "Orinar de noche (nicturia)", !data.sintomasUrinarios.includes("Orinar de noche (nicturia)"))} />
              <WordButton label="Dolor Lumbar" isSelected={data.sintomasUrinarios.includes("Dolor lumbar")} onClick={() => onCheckboxChange("sintomasUrinarios", "Dolor lumbar", !data.sintomasUrinarios.includes("Dolor lumbar"))} />
              <WordButton label="Ninguno" isSelected={data.sintomasUrinarios.includes("Ninguno")} onClick={() => onCheckboxChange("sintomasUrinarios", "Ninguno", !data.sintomasUrinarios.includes("Ninguno"))} />
            </div>
          </div>
          <div>
            <Label>Urgencia urinaria</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Sí" isSelected={data.urgenciaUrinaria === "Sí"} onClick={() => onRadioChange("urgenciaUrinaria", "Sí")} />
              <WordButton label="No" isSelected={data.urgenciaUrinaria === "No"} onClick={() => onRadioChange("urgenciaUrinaria", "No")} />
            </div>
          </div>
          <div>
            <Label>Chorro urinario débil</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Sí" isSelected={data.chorroUrinarioDebil === "Sí"} onClick={() => onRadioChange("chorroUrinarioDebil", "Sí")} />
              <WordButton label="No" isSelected={data.chorroUrinarioDebil === "No"} onClick={() => onRadioChange("chorroUrinarioDebil", "No")} />
            </div>
          </div>
          <div>
            <Label>Chorro urinario intermitente</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Sí" isSelected={data.chorroUrinarioIntermitente === "Sí"} onClick={() => onRadioChange("chorroUrinarioIntermitente", "Sí")} />
              <WordButton label="No" isSelected={data.chorroUrinarioIntermitente === "No"} onClick={() => onRadioChange("chorroUrinarioIntermitente", "No")} />
            </div>
          </div>
          <div>
            <Label>Flujo vaginal/uretral anormal</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Sí" isSelected={data.flujoVaginalUretral === "Sí"} onClick={() => onRadioChange("flujoVaginalUretral", "Sí")} />
              <WordButton label="No" isSelected={data.flujoVaginalUretral === "No"} onClick={() => onRadioChange("flujoVaginalUretral", "No")} />
            </div>
          </div>
          <div>
            <Label>Infecciones urinarias frecuentes</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Sí" isSelected={data.infeccionesUrinarias === "Sí"} onClick={() => onRadioChange("infeccionesUrinarias", "Sí")} />
              <WordButton label="No" isSelected={data.infeccionesUrinarias === "No"} onClick={() => onRadioChange("infeccionesUrinarias", "No")} />
            </div>
          </div>
          <div>
            <Label>Fecha de Última Menstruación (solo pacientes mujeres)</Label>
            <input
              type="date"
              value={data.ultimaMenstruacion}
              onChange={(e) => onTextChange("ultimaMenstruacion", e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
            />
          </div>
          <div>
            <Label>Dismenorrea</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Sí" isSelected={data.dismenorrea === "Sí"} onClick={() => onRadioChange("dismenorrea", "Sí")} />
              <WordButton label="No" isSelected={data.dismenorrea === "No"} onClick={() => onRadioChange("dismenorrea", "No")} />
            </div>
          </div>
          <div>
            <Label>Días de duración de menstruación</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Menos de 3 días" isSelected={data.duracionMenstruacion === "Menos de 3 días"} onClick={() => onRadioChange("duracionMenstruacion", "Menos de 3 días")} />
              <WordButton label="3 a 5 días" isSelected={data.duracionMenstruacion === "3 a 5 días"} onClick={() => onRadioChange("duracionMenstruacion", "3 a 5 días")} />
              <WordButton label="Más de 5 días" isSelected={data.duracionMenstruacion === "Más de 5 días"} onClick={() => onRadioChange("duracionMenstruacion", "Más de 5 días")} />
            </div>
          </div>
          <div>
            <Label>Fecha de Último Parto</Label>
            <input
              type="date"
              value={data.ultimoParto}
              onChange={(e) => onTextChange("ultimoParto", e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
            />
          </div>
          <div>
            <Label>Antecedentes Obstétricos</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Ninguno" isSelected={data.antecedentesObstetricos === "Ninguno"} onClick={() => onRadioChange("antecedentesObstetricos", "Ninguno")} />
              <WordButton label="Abortos" isSelected={data.antecedentesObstetricos === "Abortos"} onClick={() => onRadioChange("antecedentesObstetricos", "Abortos")} />
              <WordButton label="Cesáreas" isSelected={data.antecedentesObstetricos === "Cesáreas"} onClick={() => onRadioChange("antecedentesObstetricos", "Cesáreas")} />
              <WordButton label="Ambos" isSelected={data.antecedentesObstetricos === "Ambos"} onClick={() => onRadioChange("antecedentesObstetricos", "Ambos")} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
