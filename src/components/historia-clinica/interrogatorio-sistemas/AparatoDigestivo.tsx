import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SintomasToggle from '../padecimiento/SintomasToggle';
import { WordButton } from './components/WordButton';

interface AparatoDigestivoData {
  alimentacion: string;
  masticacion: string;
  percepcionGusto: string;
  percepcionGustoEspecificaciones: string;
  salivacion: string;
  deglusion: string;
  halitosis: string;
  halitosisEspecificaciones: string;
  sintomasDigestivos: string[];
  cambiosApetito: string;
  habitosAlimenticios: string;
  colorEvacuaciones: string;
  hematemesis: string;
  frecuenciaEvacuacion: string;
  frecuenciaEvacuacionEspecificaciones: string;
}

interface AparatoDigestivoProps {
  data: AparatoDigestivoData;
  isHealthy: boolean;
  onHealthyToggle: (checked: boolean) => void;
  onRadioChange: (field: string, value: string) => void;
  onCheckboxChange: (field: string, value: string, checked: boolean) => void;
  onTextChange: (field: string, value: string) => void;
}

export const redaccionDigestivoSinSintomas = "El paciente refiere llevar una alimentación combinada con adecuado consumo de alimentos blandos y fibrosos. Presenta un patrón de masticación bilateral, lo que permite un proceso adecuado de trituración de los alimentos. La percepción del gusto se mantiene íntegra, sin alteraciones referidas. La producción de saliva se percibe suficiente y constante, sin sensación de sequedad o exceso. No reporta dificultad ni dolor al deglutir. Niega halitosis. No presenta síntomas digestivos como distensión abdominal, estreñimiento, plenitud posprandial, pirosis, dolor abdominal, náusea, vómito ni reflujo. Mantiene un apetito estable, sin cambios referidos. En relación con los hábitos alimenticios, niega ingesta nocturna, picoteo frecuente o ayunos prolongados. Las evacuaciones se describen con color fisiológico, sin presencia de moco ni hematemesis. La frecuencia de evacuación es de 1 a 2 veces por día, lo que se considera dentro de parámetros funcionales.";

export const generateDigestivoRedaccion = (data: AparatoDigestivoData, isHealthy: boolean): string => {
  if (isHealthy) return redaccionDigestivoSinSintomas;

  const partes: string[] = [];

  if (data.alimentacion) {
    partes.push(`El paciente refiere alimentación de tipo ${data.alimentacion.toLowerCase()}.`);
  }
  
  if (data.masticacion) {
    partes.push(`Su patrón de masticación es ${data.masticacion.toLowerCase()}.`);
  }

  if (data.percepcionGusto) {
    let gustoText = "";
    if (data.percepcionGusto === "Normal") gustoText = "no percibe alteraciones del gusto";
    else if (data.percepcionGusto === "Disminución") gustoText = "hipogeusia";
    else if (data.percepcionGusto === "Alterados") gustoText = "disgeusia (sabores metálicos, amargos, etc.)";

    if (gustoText) {
      if (data.percepcionGustoEspecificaciones) {
        partes.push(`Manifiesta ${gustoText}, especificando: ${data.percepcionGustoEspecificaciones.trim()}.`);
      } else {
        partes.push(`Manifiesta ${gustoText}.`);
      }
    }
  }

  if (data.salivacion) {
    if (data.salivacion === "Normal") partes.push("La salivación se encuentra presente en cantidad y consistencia adecuadas.");
    else if (data.salivacion === "Aumentada") partes.push("Presenta salivación aumentada.");
    else if (data.salivacion === "Disminuida") partes.push("Presenta salivación disminuida.");
  }

  if (data.deglusion) {
    if (data.deglusion === "No") partes.push("No refiere dificultad ni dolor a la deglución.");
    else if (data.deglusion === "Dificultad") partes.push("Presenta dificultad a la deglución sin dolor asociado.");
    else if (data.deglusion === "Dolor") partes.push("Presenta dolor a la deglución (odinofagia).");
  }

  if (data.halitosis) {
    if (data.halitosis === "Sí") {
      if (data.halitosisEspecificaciones) {
        partes.push(`Presenta halitosis, reportada ${data.halitosisEspecificaciones.toLowerCase()}.`);
      } else {
        partes.push("Presenta halitosis.");
      }
    } else {
      partes.push("No presenta halitosis.");
    }
  }

  if (data.sintomasDigestivos && data.sintomasDigestivos.length > 0) {
    if (data.sintomasDigestivos.includes("Ninguno")) {
      partes.push("Niega distensión abdominal, estreñimiento, pirosis, dolor abdominal, náuseas o reflujo.");
    } else {
      partes.push(`Ha experimentado los siguientes síntomas digestivos: ${data.sintomasDigestivos.join(", ")}.`);
    }
  }

  if (data.cambiosApetito) {
    partes.push(`Refiere apetito ${data.cambiosApetito.toLowerCase()}.`);
  }

  if (data.habitosAlimenticios) {
    if (data.habitosAlimenticios === "Ninguno") {
      partes.push("No reporta hábitos alimenticios perjudiciales (ingesta nocturna, picoteo o ayunos).");
    } else {
      partes.push(`Hábitos alimenticios reportados: ${data.habitosAlimenticios.toLowerCase()}.`);
    }
  }

  if (data.colorEvacuaciones) {
    if (data.colorEvacuaciones === "Normal") partes.push("El color de las evacuaciones es normal (marrón y bien formado).");
    else if (data.colorEvacuaciones === "Oscuras") partes.push("El color de las evacuaciones es oscuro.");
    else if (data.colorEvacuaciones === "Claras") partes.push("El color de las evacuaciones es claro.");
    else if (data.colorEvacuaciones === "Presencia de moco") partes.push("Las evacuaciones presentan moco.");
  }

  if (data.hematemesis) {
    if (data.hematemesis === "Sí") partes.push("Presenta hematemesis (vómito con sangre).");
    else partes.push("No presenta hematemesis.");
  }

  if (data.frecuenciaEvacuacion) {
    if (data.frecuenciaEvacuacion === "Otra" && data.frecuenciaEvacuacionEspecificaciones) {
      partes.push(`Frecuencia de evacuación: ${data.frecuenciaEvacuacionEspecificaciones.trim()}.`);
    } else if (data.frecuenciaEvacuacion !== "Otra") {
      partes.push(`Refiere una frecuencia de evacuación de ${data.frecuenciaEvacuacion.toLowerCase()}.`);
    }
  }

  return partes.join(' ');
};

export const AparatoDigestivo: React.FC<AparatoDigestivoProps> = ({
  data,
  isHealthy,
  onHealthyToggle,
  onRadioChange,
  onCheckboxChange,
  onTextChange
}) => {
  return (
    <div className="bg-white dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Aparato Digestivo</h4>
        <SintomasToggle
          checked={isHealthy}
          onChange={onHealthyToggle}
        />
      </div>
      {!isHealthy && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Tipo de Alimentación</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Blanda" isSelected={data.alimentacion === "Blanda"} onClick={() => onRadioChange("alimentacion", "Blanda")} />
              <WordButton label="Fibrosa" isSelected={data.alimentacion === "Fibrosa"} onClick={() => onRadioChange("alimentacion", "Fibrosa")} />
              <WordButton label="Combinada" isSelected={data.alimentacion === "Combinada"} onClick={() => onRadioChange("alimentacion", "Combinada")} />
            </div>
          </div>
          <div>
            <Label>Patrón de Masticación</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Unilateral" isSelected={data.masticacion === "Unilateral"} onClick={() => onRadioChange("masticacion", "Unilateral")} />
              <WordButton label="Bilateral" isSelected={data.masticacion === "Bilateral"} onClick={() => onRadioChange("masticacion", "Bilateral")} />
              <WordButton label="Anterior" isSelected={data.masticacion === "Anterior"} onClick={() => onRadioChange("masticacion", "Anterior")} />
            </div>
          </div>
          <div>
            <Label>Percepción del Gusto</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Normal" isSelected={data.percepcionGusto === "Normal"} onClick={() => onRadioChange("percepcionGusto", "Normal")} />
              <WordButton label="Disminución" isSelected={data.percepcionGusto === "Disminución"} onClick={() => onRadioChange("percepcionGusto", "Disminución")} />
              <WordButton label="Alterados" isSelected={data.percepcionGusto === "Alterados"} onClick={() => onRadioChange("percepcionGusto", "Alterados")} />
            </div>
            {data.percepcionGusto === "Alterados" && (
              <Textarea
                placeholder="Escriba especificaciones relacionadas..."
                value={data.percepcionGustoEspecificaciones || ""}
                onChange={(e) => onTextChange("percepcionGustoEspecificaciones", e.target.value)}
                className="w-full p-2 border rounded-md mt-2"
              />
            )}
          </div>
          <div>
            <Label>Salivación</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Normal" isSelected={data.salivacion === "Normal"} onClick={() => onRadioChange("salivacion", "Normal")} />
              <WordButton label="Aumentada" isSelected={data.salivacion === "Aumentada"} onClick={() => onRadioChange("salivacion", "Aumentada")} />
              <WordButton label="Disminuida" isSelected={data.salivacion === "Disminuida"} onClick={() => onRadioChange("salivacion", "Disminuida")} />
            </div>
          </div>
          <div>
            <Label>Dificultad o Dolor al Tragar</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="No" isSelected={data.deglusion === "No"} onClick={() => onRadioChange("deglusion", "No")} />
              <WordButton label="Dificultad" isSelected={data.deglusion === "Dificultad"} onClick={() => onRadioChange("deglusion", "Dificultad")} />
              <WordButton label="Dolor" isSelected={data.deglusion === "Dolor"} onClick={() => onRadioChange("deglusion", "Dolor")} />
            </div>
          </div>
          <div>
            <Label>Halitosis (mal aliento)</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Sí" isSelected={data.halitosis === "Sí"} onClick={() => onRadioChange("halitosis", "Sí")} />
              <WordButton label="No" isSelected={data.halitosis === "No"} onClick={() => onRadioChange("halitosis", "No")} />
            </div>
            {data.halitosis === "Sí" && (
              <div className="flex flex-wrap mt-1">
                <WordButton label="Solo por las mañanas" isSelected={data.halitosisEspecificaciones === "Solo por las mañanas"} onClick={() => onRadioChange("halitosisEspecificaciones", "Solo por las mañanas")} />
                <WordButton label="Todo el tiempo" isSelected={data.halitosisEspecificaciones === "Todo el tiempo"} onClick={() => onRadioChange("halitosisEspecificaciones", "Todo el tiempo")} />
              </div>
            )}
          </div>
          <div className="col-span-2">
            <Label>Síntomas Digestivos</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Distensión Abdominal" isSelected={data.sintomasDigestivos.includes("Distensión abdominal")} onClick={() => onCheckboxChange("sintomasDigestivos", "Distensión abdominal", !data.sintomasDigestivos.includes("Distensión abdominal"))} />
              <WordButton label="Estreñimiento" isSelected={data.sintomasDigestivos.includes("Estreñimiento")} onClick={() => onCheckboxChange("sintomasDigestivos", "Estreñimiento", !data.sintomasDigestivos.includes("Estreñimiento"))} />
              <WordButton label="Plenitud Posprandial" isSelected={data.sintomasDigestivos.includes("Sensación de llenura después de comer")} onClick={() => onCheckboxChange("sintomasDigestivos", "Sensación de llenura después de comer", !data.sintomasDigestivos.includes("Sensación de llenura después de comer"))} />
              <WordButton label="Pirosis" isSelected={data.sintomasDigestivos.includes("Acidez (pirosis)")} onClick={() => onCheckboxChange("sintomasDigestivos", "Acidez (pirosis)", !data.sintomasDigestivos.includes("Acidez (pirosis)"))} />
              <WordButton label="Dolor Abdominal" isSelected={data.sintomasDigestivos.includes("Dolor abdominal")} onClick={() => onCheckboxChange("sintomasDigestivos", "Dolor abdominal", !data.sintomasDigestivos.includes("Dolor abdominal"))} />
              <WordButton label="Náusea" isSelected={data.sintomasDigestivos.includes("Náuseas")} onClick={() => onCheckboxChange("sintomasDigestivos", "Náuseas", !data.sintomasDigestivos.includes("Náuseas"))} />
              <WordButton label="Vómito" isSelected={data.sintomasDigestivos.includes("Vómitos")} onClick={() => onCheckboxChange("sintomasDigestivos", "Vómitos", !data.sintomasDigestivos.includes("Vómitos"))} />
              <WordButton label="Reflujo" isSelected={data.sintomasDigestivos.includes("Reflujo")} onClick={() => onCheckboxChange("sintomasDigestivos", "Reflujo", !data.sintomasDigestivos.includes("Reflujo"))} />
              <WordButton label="Ninguno" isSelected={data.sintomasDigestivos.includes("Ninguno")} onClick={() => onCheckboxChange("sintomasDigestivos", "Ninguno", !data.sintomasDigestivos.includes("Ninguno"))} />
            </div>
          </div>
          <div>
            <Label>Cambios en el apetito</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Aumentado" isSelected={data.cambiosApetito === "Aumentado"} onClick={() => onRadioChange("cambiosApetito", "Aumentado")} />
              <WordButton label="Disminuido" isSelected={data.cambiosApetito === "Disminuido"} onClick={() => onRadioChange("cambiosApetito", "Disminuido")} />
              <WordButton label="Sin cambios" isSelected={data.cambiosApetito === "Sin cambios"} onClick={() => onRadioChange("cambiosApetito", "Sin cambios")} />
            </div>
          </div>
          <div>
            <Label>Hábitos alimenticios</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Ingesta nocturna" isSelected={data.habitosAlimenticios === "Ingesta nocturna"} onClick={() => onRadioChange("habitosAlimenticios", "Ingesta nocturna")} />
              <WordButton label="Picoteo frecuente" isSelected={data.habitosAlimenticios === "Picoteo frecuente"} onClick={() => onRadioChange("habitosAlimenticios", "Picoteo frecuente")} />
              <WordButton label="Ayuno prolongado" isSelected={data.habitosAlimenticios === "Ayuno prolongado"} onClick={() => onRadioChange("habitosAlimenticios", "Ayuno prolongado")} />
              <WordButton label="Ninguno" isSelected={data.habitosAlimenticios === "Ninguno"} onClick={() => onRadioChange("habitosAlimenticios", "Ninguno")} />
            </div>
          </div>
          <div>
            <Label>Color de las evacuaciones</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Normal" isSelected={data.colorEvacuaciones === "Normal"} onClick={() => onRadioChange("colorEvacuaciones", "Normal")} />
              <WordButton label="Oscuras" isSelected={data.colorEvacuaciones === "Oscuras"} onClick={() => onRadioChange("colorEvacuaciones", "Oscuras")} />
              <WordButton label="Claras" isSelected={data.colorEvacuaciones === "Claras"} onClick={() => onRadioChange("colorEvacuaciones", "Claras")} />
              <WordButton label="Presencia de moco" isSelected={data.colorEvacuaciones === "Presencia de moco"} onClick={() => onRadioChange("colorEvacuaciones", "Presencia de moco")} />
            </div>
          </div>
          <div>
            <Label>Hematemesis (vómito con sangre)</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Sí" isSelected={data.hematemesis === "Sí"} onClick={() => onRadioChange("hematemesis", "Sí")} />
              <WordButton label="No" isSelected={data.hematemesis === "No"} onClick={() => onRadioChange("hematemesis", "No")} />
            </div>
          </div>
          <div className="col-span-2">
            <Label>Frecuencia de Evacuación</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Menos de 1 vez al día" isSelected={data.frecuenciaEvacuacion === "Menos de una vez al día"} onClick={() => onRadioChange("frecuenciaEvacuacion", "Menos de una vez al día")} />
              <WordButton label="1 a 2 veces" isSelected={data.frecuenciaEvacuacion === "1 a 2 veces"} onClick={() => onRadioChange("frecuenciaEvacuacion", "1 a 2 veces")} />
              <WordButton label="Más de 2 veces" isSelected={data.frecuenciaEvacuacion === "Más de 2 veces"} onClick={() => onRadioChange("frecuenciaEvacuacion", "Más de 2 veces")} />
              <WordButton label="Otra" isSelected={data.frecuenciaEvacuacion === "Otra"} onClick={() => onRadioChange("frecuenciaEvacuacion", "Otra")} />
            </div>
            {data.frecuenciaEvacuacion === "Otra" && (
              <Textarea
                placeholder="Escriba especificaciones relacionadas..."
                value={data.frecuenciaEvacuacionEspecificaciones || ""}
                onChange={(e) => onTextChange("frecuenciaEvacuacionEspecificaciones", e.target.value)}
                className="w-full p-2 border rounded-md mt-2"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
