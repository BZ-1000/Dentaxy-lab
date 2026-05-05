import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WordButton } from './components/WordButton';
import SintomasToggle from '../padecimiento/SintomasToggle';

export interface SistemaTegumentarioData {
  cambiosColoracion: string;
  cambiosColoracionEspecificaciones: string;
  sintomasTegumentarios: string[];
  cambiosUnas: string;
  cambiosLunares: string;
  lesionesPigmentadas: string;
}

export const redaccionTegumentarioSinSintomas = "El paciente no refiere cambios en la coloración de la piel ni presencia de erupciones, prurito, hiperhidrosis, pérdida de pelo o resequedad. No describe alteraciones en las uñas como fragilidad, quebraduras o deformidades. Niega cambios en lunares ni aparición de lesiones pigmentadas.";

export const generateTegumentarioRedaccion = (data: SistemaTegumentarioData, isHealthy: boolean): string => {
  if (isHealthy) {
    return redaccionTegumentarioSinSintomas;
  }

  let text = "";

  if (data.cambiosColoracion) {
    text += `${data.cambiosColoracion === "Sí" ? "Ha notado cambios en la coloración de la piel." : "No ha notado cambios en la coloración de la piel."} `;
    if (data.cambiosColoracion === "Sí" && data.cambiosColoracionEspecificaciones) {
      text += `Especificaciones de la coloración: ${data.cambiosColoracionEspecificaciones}. `;
    }
  }

  if (data.sintomasTegumentarios.includes("Ninguno") || data.sintomasTegumentarios.length === 0) {
    text += "El paciente niega otras alteraciones relacionadas al sistema tegumentario. Se investigó presencia de erupciones, prurito, hiperhidrosis, pérdida de cabello y piel seca. ";
  } else {
    text += `Otros síntomas presentes: ${data.sintomasTegumentarios.join(", ")}. `;
  }

  if (data.cambiosUnas) {
    text += `Cambios en uñas: ${data.cambiosUnas.toLowerCase()}. `;
  }

  if (data.cambiosLunares) {
    text += `${data.cambiosLunares === "Sí" ? "Presenta cambios en lunares." : "No presenta cambios en lunares."} `;
  }

  if (data.lesionesPigmentadas) {
    text += `${data.lesionesPigmentadas === "Sí" ? "Presenta lesiones pigmentadas." : "No presenta lesiones pigmentadas."} `;
  }

  return text.trim();
};

interface SistemaTegumentarioProps {
  data: SistemaTegumentarioData;
  isHealthy: boolean;
  onHealthyToggle: (checked: boolean) => void;
  onRadioChange: (field: string, value: string) => void;
  onCheckboxChange: (field: string, value: string, checked: boolean) => void;
  onTextChange: (field: string, value: string) => void;
}

export const SistemaTegumentario: React.FC<SistemaTegumentarioProps> = ({
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
        <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Sistema Tegumentario</h4>
        <SintomasToggle
          checked={isHealthy}
          onChange={onHealthyToggle}
        />
      </div>
      {!isHealthy && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Cambios en la Coloración de la Piel</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Sí" isSelected={data.cambiosColoracion === "Sí"} onClick={() => onRadioChange("cambiosColoracion", "Sí")} />
              <WordButton label="No" isSelected={data.cambiosColoracion === "No"} onClick={() => onRadioChange("cambiosColoracion", "No")} />
            </div>
            {data.cambiosColoracion === "Sí" && (
              <Textarea
                placeholder="Escriba especificaciones relacionadas..."
                value={data.cambiosColoracionEspecificaciones || ""}
                onChange={(e) => onTextChange("cambiosColoracionEspecificaciones", e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm mt-2"
                rows={2}
              />
            )}
          </div>
          <div>
            <Label>Síntomas Tegumentarios</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Erupciones" isSelected={data.sintomasTegumentarios.includes("Erupciones")} onClick={() => onCheckboxChange("sintomasTegumentarios", "Erupciones", !data.sintomasTegumentarios.includes("Erupciones"))} />
              <WordButton label="Prurito" isSelected={data.sintomasTegumentarios.includes("Prurito (comezón)")} onClick={() => onCheckboxChange("sintomasTegumentarios", "Prurito (comezón)", !data.sintomasTegumentarios.includes("Prurito (comezón)"))} />
              <WordButton label="Hiperhidrosis" isSelected={data.sintomasTegumentarios.includes("Hiperhidrosis (sudoración excesiva)")} onClick={() => onCheckboxChange("sintomasTegumentarios", "Hiperhidrosis (sudoración excesiva)", !data.sintomasTegumentarios.includes("Hiperhidrosis (sudoración excesiva)"))} />
              <WordButton label="Pérdida de Pelo" isSelected={data.sintomasTegumentarios.includes("Pérdida de pelo o vello")} onClick={() => onCheckboxChange("sintomasTegumentarios", "Pérdida de pelo o vello", !data.sintomasTegumentarios.includes("Pérdida de pelo o vello"))} />
              <WordButton label="Piel Seca" isSelected={data.sintomasTegumentarios.includes("Piel seca")} onClick={() => onCheckboxChange("sintomasTegumentarios", "Piel seca", !data.sintomasTegumentarios.includes("Piel seca"))} />
              <WordButton label="Ninguno" isSelected={data.sintomasTegumentarios.includes("Ninguno")} onClick={() => onCheckboxChange("sintomasTegumentarios", "Ninguno", !data.sintomasTegumentarios.includes("Ninguno"))} />
            </div>
          </div>
          <div>
            <Label>Cambios en uñas</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Frágiles" isSelected={data.cambiosUnas === "Frágiles"} onClick={() => onRadioChange("cambiosUnas", "Frágiles")} />
              <WordButton label="Quebradizas" isSelected={data.cambiosUnas === "Quebradizas"} onClick={() => onRadioChange("cambiosUnas", "Quebradizas")} />
              <WordButton label="Deformadas" isSelected={data.cambiosUnas === "Deformadas"} onClick={() => onRadioChange("cambiosUnas", "Deformadas")} />
            </div>
          </div>
          <div>
            <Label>Cambios en lunares</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Sí" isSelected={data.cambiosLunares === "Sí"} onClick={() => onRadioChange("cambiosLunares", "Sí")} />
              <WordButton label="No" isSelected={data.cambiosLunares === "No"} onClick={() => onRadioChange("cambiosLunares", "No")} />
            </div>
          </div>
          <div>
            <Label>Lesiones pigmentadas</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Sí" isSelected={data.lesionesPigmentadas === "Sí"} onClick={() => onRadioChange("lesionesPigmentadas", "Sí")} />
              <WordButton label="No" isSelected={data.lesionesPigmentadas === "No"} onClick={() => onRadioChange("lesionesPigmentadas", "No")} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
