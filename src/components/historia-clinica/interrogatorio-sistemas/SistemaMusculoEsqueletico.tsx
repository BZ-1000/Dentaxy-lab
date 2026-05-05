import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WordButton } from './components/WordButton';
import SintomasToggle from '../padecimiento/SintomasToggle';

export interface SistemaMusculoEsqueleticoData {
  fracturas: string;
  detallesFracturas: string;
  sintomasMusculoEsqueleticos: string[];
  rigidezMatutina: string;
  debilidadMuscular: string;
  limitacionesMovimiento: string;
}

export const redaccionMusculoEsqueleticoSinSintomas = "El paciente no refiere antecedentes de fracturas o esguinces. No presenta síntomas musculoesqueléticos como deformidades articulares, dolor articular, calambres frecuentes ni rigidez matutina. No manifiesta debilidad muscular generalizada ni localizada. Tampoco refiere limitaciones de movimiento.";

export const generateMusculoEsqueleticoRedaccion = (data: SistemaMusculoEsqueleticoData, isHealthy: boolean): string => {
  if (isHealthy) {
    return redaccionMusculoEsqueleticoSinSintomas;
  }

  let text = "";

  if (data.fracturas) {
    text += `${data.fracturas === "No" ? "No ha presentado" : "Ha presentado"} fracturas o esguinces. `;
    if (data.fracturas === "Sí" && data.detallesFracturas) {
      text += `Se registran: ${data.detallesFracturas}. `;
    }
  }

  if (data.sintomasMusculoEsqueleticos.includes("Ninguno") || data.sintomasMusculoEsqueleticos.length === 0) {
    text += "El paciente niega otras alteraciones relacionadas al sistema músculo-esquelético. Se interrogó sobre deformidad o dolor articular, y calambres musculares con respuestas negativas. ";
  } else {
    text += `Sintomatología musculoesquelética actual: ${data.sintomasMusculoEsqueleticos.join(", ")}. `;
  }

  const detallesExtras = [];
  if (data.rigidezMatutina) detallesExtras.push(`Rigidez matutina: ${data.rigidezMatutina}`);
  if (data.debilidadMuscular) detallesExtras.push(`Debilidad muscular: ${data.debilidadMuscular}`);
  if (data.limitacionesMovimiento) detallesExtras.push(`Limitaciones de movimiento: ${data.limitacionesMovimiento}`);

  if (detallesExtras.length > 0) {
    text += `${detallesExtras.join(". ")}. `;
  }

  return text.trim();
};

interface SistemaMusculoEsqueleticoProps {
  data: SistemaMusculoEsqueleticoData;
  isHealthy: boolean;
  onHealthyToggle: (checked: boolean) => void;
  onRadioChange: (field: string, value: string) => void;
  onCheckboxChange: (field: string, value: string, checked: boolean) => void;
  onTextChange: (field: string, value: string) => void;
}

export const SistemaMusculoEsqueletico: React.FC<SistemaMusculoEsqueleticoProps> = ({
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
        <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Sistema Músculo-Esquelético</h4>
        <SintomasToggle
          checked={isHealthy}
          onChange={onHealthyToggle}
        />
      </div>
      {!isHealthy && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Fracturas o Esguinces</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Sí" isSelected={data.fracturas === "Sí"} onClick={() => onRadioChange("fracturas", "Sí")} />
              <WordButton label="No" isSelected={data.fracturas === "No"} onClick={() => onRadioChange("fracturas", "No")} />
            </div>
          </div>
          <div>
            <Label>Detalles de Fracturas</Label>
            {data.fracturas === "Sí" && (
              <Textarea
                placeholder="Escriba especificaciones relacionadas..."
                value={data.detallesFracturas || ""}
                onChange={(e) => onTextChange("detallesFracturas", e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm mt-2"
                rows={2}
              />
            )}
          </div>
          <div>
            <Label>Síntomas Musculoesqueléticos</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Deformidad Articular" isSelected={data.sintomasMusculoEsqueleticos.includes("Deformidad articular")} onClick={() => onCheckboxChange("sintomasMusculoEsqueleticos", "Deformidad articular", !data.sintomasMusculoEsqueleticos.includes("Deformidad articular"))} />
              <WordButton label="Dolor Articular" isSelected={data.sintomasMusculoEsqueleticos.includes("Dolor articular")} onClick={() => onCheckboxChange("sintomasMusculoEsqueleticos", "Dolor articular", !data.sintomasMusculoEsqueleticos.includes("Dolor articular"))} />
              <WordButton label="Calambres musculares frecuentes" isSelected={data.sintomasMusculoEsqueleticos.includes("Calambres musculares frecuentes")} onClick={() => onCheckboxChange("sintomasMusculoEsqueleticos", "Calambres musculares frecuentes", !data.sintomasMusculoEsqueleticos.includes("Calambres musculares frecuentes"))} />
              <WordButton label="Ninguno" isSelected={data.sintomasMusculoEsqueleticos.includes("Ninguno")} onClick={() => onCheckboxChange("sintomasMusculoEsqueleticos", "Ninguno", !data.sintomasMusculoEsqueleticos.includes("Ninguno"))} />
            </div>
          </div>
          <div>
            <Label>Rigidez matutina</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Menos de 30 min" isSelected={data.rigidezMatutina === "Menos de 30 min"} onClick={() => onRadioChange("rigidezMatutina", "Menos de 30 min")} />
              <WordButton label="Más de 30 min" isSelected={data.rigidezMatutina === "Más de 30 min"} onClick={() => onRadioChange("rigidezMatutina", "Más de 30 min")} />
            </div>
          </div>
          <div>
            <Label>Debilidad muscular</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Generalizada" isSelected={data.debilidadMuscular === "Generalizada"} onClick={() => onRadioChange("debilidadMuscular", "Generalizada")} />
              <WordButton label="Localizada" isSelected={data.debilidadMuscular === "Localizada"} onClick={() => onRadioChange("debilidadMuscular", "Localizada")} />
              <WordButton label="No" isSelected={data.debilidadMuscular === "No"} onClick={() => onRadioChange("debilidadMuscular", "No")} />
            </div>
          </div>
          <div>
            <Label>Limitaciones de Movimiento</Label>
            <Textarea
              placeholder="Escriba especificaciones sobre limitaciones de movimiento..."
              value={data.limitacionesMovimiento || ""}
              onChange={(e) => onTextChange("limitacionesMovimiento", e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm mt-2"
              rows={2}
            />
          </div>
        </div>
      )}
    </div>
  );
};
