import React from 'react';
import { Label } from "@/components/ui/label";
import { WordButton } from './components/WordButton';
import SintomasToggle from '../padecimiento/SintomasToggle';

export interface SistemaEndocrinoData {
  sintomasEndocrinos: string[];
  sudoracionNocturna: string;
  hirsutismo: string;
  galactorrea: string;
  cambiosRitmoMenstrual: string;
  cambiosPeso: string;
  intolerancia: string;
  condicionesEndocrinas: string;
}

export const redaccionEndocrinoSinSintomas = "El paciente niega síntomas endocrinos como poliuria, polidipsia, polifagia, exoftalmos, nerviosismo, temblores o insomnio. No refiere sudoraciones nocturnas excesivas. En caso de paciente femenino, no presenta hirsutismo ni galactorrea. Los ciclos menstruales se describen regulares, sin retrasos ni alteraciones. No se reportan cambios significativos de peso ni intolerancia a frío o calor. Niega diagnóstico de hipotiroidismo o hipertiroidismo.";

export const generateEndocrinoRedaccion = (data: SistemaEndocrinoData, isHealthy: boolean): string => {
  if (isHealthy) {
    return redaccionEndocrinoSinSintomas;
  }

  let text = "";

  if (data.sintomasEndocrinos.includes("Ninguno") || data.sintomasEndocrinos.length === 0) {
    text += "El paciente niega alteraciones relacionadas al sistema endocrino. Se indagó sobre poliuria, polidipsia, polifagia, exoftalmos, nerviosismo, temblores e insomnio, reportando negatividad en todos. ";
  } else {
    text += `El paciente refiere los siguientes síntomas endocrinos: ${data.sintomasEndocrinos.join(", ")}. `;
  }

  if (data.sudoracionNocturna) {
    text += `${data.sudoracionNocturna === "Sí" ? "Presenta sudoración excesiva nocturna." : "No presenta sudoración excesiva nocturna."} `;
  }

  if (data.hirsutismo || data.galactorrea || data.cambiosRitmoMenstrual) {
    const femenino = [];
    if (data.hirsutismo) femenino.push(data.hirsutismo === "Sí" ? "hirsutismo" : "sin hirsutismo");
    if (data.galactorrea) femenino.push(data.galactorrea === "Sí" ? "galactorrea" : "sin galactorrea");
    if (data.cambiosRitmoMenstrual) femenino.push(`cambios en el ritmo menstrual (${data.cambiosRitmoMenstrual})`);

    text += `En caso de paciente femenino: ${femenino.join(", ")}. `;
  }

  const pesoText = data.cambiosPeso === "No" ? "sin cambios de peso" : data.cambiosPeso === "Aumento" ? "aumento de peso" : data.cambiosPeso === "Perdida" ? "pérdida de peso" : "";
  const intoleranciaText = data.intolerancia === "No" ? "sin intolerancia a temperaturas extremas" : data.intolerancia === "Frío" ? "intolerancia al frío" : data.intolerancia === "Calor" ? "intolerancia al calor" : "";

  if (pesoText || intoleranciaText) {
    text += `Reporta ${[pesoText, intoleranciaText].filter(Boolean).join(" e ")}. `;
  }

  if (data.condicionesEndocrinas) {
    text += `Antecedentes patológicos conocidos: ${data.condicionesEndocrinas}. `;
  }

  return text.trim();
};

interface SistemaEndocrinoProps {
  data: SistemaEndocrinoData;
  isHealthy: boolean;
  onHealthyToggle: (checked: boolean) => void;
  onRadioChange: (field: string, value: string) => void;
  onCheckboxChange: (field: string, value: string, checked: boolean) => void;
}

export const SistemaEndocrino: React.FC<SistemaEndocrinoProps> = ({
  data,
  isHealthy,
  onHealthyToggle,
  onRadioChange,
  onCheckboxChange,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Sistema Endocrino</h4>
        <SintomasToggle
          checked={isHealthy}
          onChange={onHealthyToggle}
        />
      </div>
      {!isHealthy && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Síntomas Endocrinos</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Poliuria" isSelected={data.sintomasEndocrinos.includes("Poliuria")} onClick={() => onCheckboxChange("sintomasEndocrinos", "Poliuria", !data.sintomasEndocrinos.includes("Poliuria"))} />
              <WordButton label="Polidipsia" isSelected={data.sintomasEndocrinos.includes("Polidipsia")} onClick={() => onCheckboxChange("sintomasEndocrinos", "Polidipsia", !data.sintomasEndocrinos.includes("Polidipsia"))} />
              <WordButton label="Polifagia" isSelected={data.sintomasEndocrinos.includes("Polifagia")} onClick={() => onCheckboxChange("sintomasEndocrinos", "Polifagia", !data.sintomasEndocrinos.includes("Polifagia"))} />
              <WordButton label="Exoftalmos" isSelected={data.sintomasEndocrinos.includes("Exoftalmos (ojos saltones)")} onClick={() => onCheckboxChange("sintomasEndocrinos", "Exoftalmos (ojos saltones)", !data.sintomasEndocrinos.includes("Exoftalmos (ojos saltones)"))} />
              <WordButton label="Nerviosismo" isSelected={data.sintomasEndocrinos.includes("Nerviosismo")} onClick={() => onCheckboxChange("sintomasEndocrinos", "Nerviosismo", !data.sintomasEndocrinos.includes("Nerviosismo"))} />
              <WordButton label="Temblores" isSelected={data.sintomasEndocrinos.includes("Temblores")} onClick={() => onCheckboxChange("sintomasEndocrinos", "Temblores", !data.sintomasEndocrinos.includes("Temblores"))} />
              <WordButton label="Insomnio" isSelected={data.sintomasEndocrinos.includes("Insomnio")} onClick={() => onCheckboxChange("sintomasEndocrinos", "Insomnio", !data.sintomasEndocrinos.includes("Insomnio"))} />
              <WordButton label="Ninguno" isSelected={data.sintomasEndocrinos.includes("Ninguno")} onClick={() => onCheckboxChange("sintomasEndocrinos", "Ninguno", !data.sintomasEndocrinos.includes("Ninguno"))} />
            </div>
          </div>
          <div>
            <Label>Sudoración excesiva nocturna</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Sí" isSelected={data.sudoracionNocturna === "Sí"} onClick={() => onRadioChange("sudoracionNocturna", "Sí")} />
              <WordButton label="No" isSelected={data.sudoracionNocturna === "No"} onClick={() => onRadioChange("sudoracionNocturna", "No")} />
            </div>
          </div>
          <div>
            <Label>Hirsutismo (vello excesivo en mujeres)</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Sí" isSelected={data.hirsutismo === "Sí"} onClick={() => onRadioChange("hirsutismo", "Sí")} />
              <WordButton label="No" isSelected={data.hirsutismo === "No"} onClick={() => onRadioChange("hirsutismo", "No")} />
            </div>
          </div>
          <div>
            <Label>Galactorrea (secreción mamaria anormal)</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Sí" isSelected={data.galactorrea === "Sí"} onClick={() => onRadioChange("galactorrea", "Sí")} />
              <WordButton label="No" isSelected={data.galactorrea === "No"} onClick={() => onRadioChange("galactorrea", "No")} />
            </div>
          </div>
          <div>
            <Label>Cambios en el ritmo menstrual</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Retrasos" isSelected={data.cambiosRitmoMenstrual === "Retrasos"} onClick={() => onRadioChange("cambiosRitmoMenstrual", "Retrasos")} />
              <WordButton label="Amenorrea" isSelected={data.cambiosRitmoMenstrual === "Amenorrea"} onClick={() => onRadioChange("cambiosRitmoMenstrual", "Amenorrea")} />
              <WordButton label="Ciclos cortos" isSelected={data.cambiosRitmoMenstrual === "Ciclos cortos"} onClick={() => onRadioChange("cambiosRitmoMenstrual", "Ciclos cortos")} />
            </div>
          </div>
          <div>
            <Label>Cambios de Peso</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Pérdida" isSelected={data.cambiosPeso === "Perdida"} onClick={() => onRadioChange("cambiosPeso", "Perdida")} />
              <WordButton label="Aumento" isSelected={data.cambiosPeso === "Aumento"} onClick={() => onRadioChange("cambiosPeso", "Aumento")} />
              <WordButton label="No" isSelected={data.cambiosPeso === "No"} onClick={() => onRadioChange("cambiosPeso", "No")} />
            </div>
          </div>
          <div>
            <Label>Intolerancia</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Frío" isSelected={data.intolerancia === "Frío"} onClick={() => onRadioChange("intolerancia", "Frío")} />
              <WordButton label="Calor" isSelected={data.intolerancia === "Calor"} onClick={() => onRadioChange("intolerancia", "Calor")} />
              <WordButton label="No" isSelected={data.intolerancia === "No"} onClick={() => onRadioChange("intolerancia", "No")} />
            </div>
          </div>
          <div>
            <Label>Condiciones Endocrinas</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Hipotiroidismo" isSelected={data.condicionesEndocrinas === "Hipotiroidismo"} onClick={() => onRadioChange("condicionesEndocrinas", "Hipotiroidismo")} />
              <WordButton label="Hipertiroidismo" isSelected={data.condicionesEndocrinas === "Hipertiroidismo"} onClick={() => onRadioChange("condicionesEndocrinas", "Hipertiroidismo")} />
              <WordButton label="Ninguno" isSelected={data.condicionesEndocrinas === "Ninguno"} onClick={() => onRadioChange("condicionesEndocrinas", "Ninguno")} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
