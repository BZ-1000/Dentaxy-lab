import React from 'react';
import { Label } from "@/components/ui/label";
import SintomasToggle from '../padecimiento/SintomasToggle';
import { WordButton } from './components/WordButton';

interface AparatoRespiratorioData {
  tipoRespiracion: string;
  sintomasRespiratorios: string[];
  apneaSuenio: string;
  oxigenoSuplementario: string;
  tosExpectoracion: string;
}

interface AparatoRespiratorioProps {
  data: AparatoRespiratorioData;
  isHealthy: boolean;
  onHealthyToggle: (checked: boolean) => void;
  onRadioChange: (field: string, value: string) => void;
  onCheckboxChange: (field: string, value: string, checked: boolean) => void;
}

export const redaccionRespiratorioSinSintomas = "El paciente refiere una respiración habitual por vía nasal, sin predominio de respiración bucal ni combinada. Niega síntomas respiratorios como obstrucción nasal, rinorrea, congestión, epistaxis, disnea, tos, dolor torácico, hernias, expectoraciones o secreciones. No manifiesta cianosis. No refiere ronquido ni pausas respiratorias durante el sueño, descartando apnea del sueño. No utiliza oxígeno suplementario. Niega tos con expectoración en cualquiera de sus variantes.";

export const generateRespiratorioRedaccion = (data: AparatoRespiratorioData, isHealthy: boolean): string => {
  if (isHealthy) return redaccionRespiratorioSinSintomas;

  const partes: string[] = [];

  if (data.tipoRespiracion) {
    if (data.tipoRespiracion === "Combinada") {
      partes.push("Mantiene una respiración habitual combinada (oro-nasal).");
    } else {
      partes.push(`El paciente refiere una respiración de tipo predominantemente ${data.tipoRespiracion.toLowerCase()}.`);
    }
  }

  if (data.sintomasRespiratorios && data.sintomasRespiratorios.length > 0) {
    if (data.sintomasRespiratorios.includes("Ninguno")) {
      partes.push("Niega síntomas como obstrucción nasal, disnea, tos, dolor torácico o cianosis.");
    } else {
      partes.push(`Presenta los siguientes síntomas respiratorios: ${data.sintomasRespiratorios.join(", ")}.`);
    }
  }

  if (data.apneaSuenio) {
    if (data.apneaSuenio === "Sí") partes.push("Presenta apnea del sueño (ronquidos o pausas al dormir).");
    else partes.push("No reporta apnea del sueño.");
  }

  if (data.oxigenoSuplementario) {
    if (data.oxigenoSuplementario === "Sí") partes.push("Requiere y utiliza oxígeno suplementario.");
    else partes.push("No utiliza oxígeno suplementario.");
  }

  if (data.tosExpectoracion) {
    partes.push(`Refiere tos con expectoración de características: ${data.tosExpectoracion.toLowerCase()}.`);
  }

  return partes.join(' ');
};

export const AparatoRespiratorio: React.FC<AparatoRespiratorioProps> = ({
  data,
  isHealthy,
  onHealthyToggle,
  onRadioChange,
  onCheckboxChange
}) => {
  return (
    <div className="bg-white dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Aparato Respiratorio</h4>
        <SintomasToggle
          checked={isHealthy}
          onChange={onHealthyToggle}
        />
      </div>
      {!isHealthy && (
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <Label>Tipo de Respiración</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Nasal" isSelected={data.tipoRespiracion === "Nasal"} onClick={() => onRadioChange("tipoRespiracion", "Nasal")} />
              <WordButton label="Bucal" isSelected={data.tipoRespiracion === "Bucal"} onClick={() => onRadioChange("tipoRespiracion", "Bucal")} />
              <WordButton label="Combinada" isSelected={data.tipoRespiracion === "Combinada"} onClick={() => onRadioChange("tipoRespiracion", "Combinada")} />
            </div>
          </div>
          <div className="col-span-2">
            <Label>Síntomas Respiratorios</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Obstrucción Nasal" isSelected={data.sintomasRespiratorios.includes("Obstrucción nasal")} onClick={() => onCheckboxChange("sintomasRespiratorios", "Obstrucción nasal", !data.sintomasRespiratorios.includes("Obstrucción nasal"))} />
              <WordButton label="Rinorrea" isSelected={data.sintomasRespiratorios.includes("Secreción nasal (rinorrea)")} onClick={() => onCheckboxChange("sintomasRespiratorios", "Secreción nasal (rinorrea)", !data.sintomasRespiratorios.includes("Secreción nasal (rinorrea)"))} />
              <WordButton label="Congestión Nasal" isSelected={data.sintomasRespiratorios.includes("Congestión nasal")} onClick={() => onCheckboxChange("sintomasRespiratorios", "Congestión nasal", !data.sintomasRespiratorios.includes("Congestión nasal"))} />
              <WordButton label="Epistaxis" isSelected={data.sintomasRespiratorios.includes("Epistaxis (sangrado nasal)")} onClick={() => onCheckboxChange("sintomasRespiratorios", "Epistaxis (sangrado nasal)", !data.sintomasRespiratorios.includes("Epistaxis (sangrado nasal)"))} />
              <WordButton label="Disnea" isSelected={data.sintomasRespiratorios.includes("Dificultad para respirar (disnea)")} onClick={() => onCheckboxChange("sintomasRespiratorios", "Dificultad para respirar (disnea)", !data.sintomasRespiratorios.includes("Dificultad para respirar (disnea)"))} />
              <WordButton label="Tos" isSelected={data.sintomasRespiratorios.includes("Tos")} onClick={() => onCheckboxChange("sintomasRespiratorios", "Tos", !data.sintomasRespiratorios.includes("Tos"))} />
              <WordButton label="Dolor Torácico" isSelected={data.sintomasRespiratorios.includes("Dolor torácico")} onClick={() => onCheckboxChange("sintomasRespiratorios", "Dolor torácico", !data.sintomasRespiratorios.includes("Dolor torácico"))} />
              <WordButton label="Hernias" isSelected={data.sintomasRespiratorios.includes("Hernias")} onClick={() => onCheckboxChange("sintomasRespiratorios", "Hernias", !data.sintomasRespiratorios.includes("Hernias"))} />
              <WordButton label="Expectoraciones" isSelected={data.sintomasRespiratorios.includes("Expectoraciones")} onClick={() => onCheckboxChange("sintomasRespiratorios", "Expectoraciones", !data.sintomasRespiratorios.includes("Expectoraciones"))} />
              <WordButton label="Secreciones" isSelected={data.sintomasRespiratorios.includes("Secreciones")} onClick={() => onCheckboxChange("sintomasRespiratorios", "Secreciones", !data.sintomasRespiratorios.includes("Secreciones"))} />
              <WordButton label="Cianosis" isSelected={data.sintomasRespiratorios.includes("Cianosis")} onClick={() => onCheckboxChange("sintomasRespiratorios", "Cianosis", !data.sintomasRespiratorios.includes("Cianosis"))} />
              <WordButton label="Ninguno" isSelected={data.sintomasRespiratorios.includes("Ninguno")} onClick={() => onCheckboxChange("sintomasRespiratorios", "Ninguno", !data.sintomasRespiratorios.includes("Ninguno"))} />
            </div>
          </div>
          <div>
            <Label>Apnea del sueño (ronquido o pausas al dormir)</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Sí" isSelected={data.apneaSuenio === "Sí"} onClick={() => onRadioChange("apneaSuenio", "Sí")} />
              <WordButton label="No" isSelected={data.apneaSuenio === "No"} onClick={() => onRadioChange("apneaSuenio", "No")} />
            </div>
          </div>
          <div>
            <Label>Uso de oxígeno suplementario</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Sí" isSelected={data.oxigenoSuplementario === "Sí"} onClick={() => onRadioChange("oxigenoSuplementario", "Sí")} />
              <WordButton label="No" isSelected={data.oxigenoSuplementario === "No"} onClick={() => onRadioChange("oxigenoSuplementario", "No")} />
            </div>
          </div>
          <div className="col-span-2">
            <Label>Tos con expectoración</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Transparente" isSelected={data.tosExpectoracion === "Transparente"} onClick={() => onRadioChange("tosExpectoracion", "Transparente")} />
              <WordButton label="Amarilla" isSelected={data.tosExpectoracion === "Amarilla"} onClick={() => onRadioChange("tosExpectoracion", "Amarilla")} />
              <WordButton label="Verdosa" isSelected={data.tosExpectoracion === "Verdosa"} onClick={() => onRadioChange("tosExpectoracion", "Verdosa")} />
              <WordButton label="Hemoptoica" isSelected={data.tosExpectoracion === "Hemoptoica"} onClick={() => onRadioChange("tosExpectoracion", "Hemoptoica")} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
