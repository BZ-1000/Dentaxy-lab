import React from 'react';
import { Label } from "@/components/ui/label";
import { WordButton } from './components/WordButton';
import SintomasToggle from '../padecimiento/SintomasToggle';

export interface AparatoCardiovascularData {
  dolorToracico: string;
  dolorToracicoDetalle: string;
  lipotimia: string;
  lipotimiaDetalle: string;
  ritmoCardiaco: string;
  ritmoCardiacoDetalle: string;
  sintomasCardiovasculares: string[];
  sintomasCardiovascularesDetalle: string;
  presionArterial: string;
  antecedentesCardiovasculares: string[];
  antecedentesCardiovascularesDetalle: string;
  capacidadFuncional: string;
  capacidadFuncionalDetalle: string;
  disnea: string;
  disneaDetalle: string;
  otrosAntecedentes: string[];
  otrosAntecedentesDetalle: string;
}

export const redaccionCardiovascularSinSintomas = "El paciente no refiere dolor torácico ni en reposo ni en relación con el esfuerzo. No ha presentado episodios de lipotimia o síncope. Refiere no percibir irregularidades en el ritmo cardíaco, sin palpitaciones ni latidos acelerados o débiles. Niega síntomas cardiovasculares asociados como mareos, vértigo, edema en extremidades inferiores, várices, equimosis, cefalea relacionada a la presión arterial, acúfenos, fosfenos, visión borrosa o palpitaciones frecuentes. No cuenta con diagnóstico previo de hipertensión o hipotensión arterial. Niega antecedentes cardiovasculares como infarto, enfermedad coronaria, insuficiencia cardíaca o procedimientos relacionados. En cuanto a la capacidad funcional, no refiere fatiga con esfuerzos habituales. Niega disnea en cualquier circunstancia. No refiere uso de medicamentos cardiovasculares y niega antecedentes familiares relevantes.";

export const generateCardiovascularRedaccion = (data: AparatoCardiovascularData, isHealthy: boolean): string => {
  if (isHealthy) {
    return redaccionCardiovascularSinSintomas;
  }

  let text = "";

  // Dolor torácico
  if (data.dolorToracico === "No refiere dolor torácico") {
    text += "El paciente niega experimentar dolor torácico. ";
  } else if (data.dolorToracico) {
    const variaciones = [
      `El paciente refiere dolor torácico de tipo ${data.dolorToracico.replace('Dolor ', '').toLowerCase()}`,
      `Se documenta la presencia de dolor torácico caracterizado como ${data.dolorToracico.replace('Dolor ', '').toLowerCase()}`
    ];
    text += variaciones[Math.floor(Math.random() * variaciones.length)];

    if (data.dolorToracicoDetalle) {
      const conectores = ["especificando que", "señalado por el paciente con evolución de"];
      text += `, ${conectores[Math.floor(Math.random() * conectores.length)]} ${data.dolorToracicoDetalle}. `;
    } else {
      text += ". ";
    }
  }

  // Lipotimia o síncope
  if (data.lipotimia === "No ha presentado episodios") {
    text += "El paciente niega episodios de lipotimia o síncope. ";
  } else if (data.lipotimia) {
    const variaciones = [
      `El paciente refiere ${data.lipotimia.toLowerCase()}`,
      `Se reporta antecedente de ${data.lipotimia.toLowerCase()}`
    ];
    text += variaciones[Math.floor(Math.random() * variaciones.length)];

    if (data.lipotimiaDetalle) {
      const conectores = ["describiendo que", "con características mencionadas por el paciente como"];
      text += `, ${conectores[Math.floor(Math.random() * conectores.length)]} ${data.lipotimiaDetalle}. `;
    } else {
      text += ". ";
    }
  }

  // Ritmo cardíaco percibido
  if (data.ritmoCardiaco === "No percibe irregularidad en el ritmo cardíaco") {
    text += "El paciente no refiere alteraciones en la percepción del ritmo cardíaco. ";
  } else if (data.ritmoCardiaco) {
    const variaciones = [
      `El paciente refiere sensación de ${data.ritmoCardiaco.toLowerCase()}`,
      `Se identifica percepción subjetiva de ${data.ritmoCardiaco.toLowerCase()}`
    ];
    text += variaciones[Math.floor(Math.random() * variaciones.length)];

    if (data.ritmoCardiacoDetalle) {
      const conectores = ["detallando que", "manifestada con"];
      text += `, ${conectores[Math.floor(Math.random() * conectores.length)]} ${data.ritmoCardiacoDetalle}. `;
    } else {
      text += ". ";
    }
  }

  // Síntomas cardiovasculares asociados
  if (data.sintomasCardiovasculares.includes("Ninguno de los anteriores")) {
    text += "El paciente niega síntomas cardiovasculares asociados. ";
  } else if (data.sintomasCardiovasculares.length > 0) {
    const variaciones = [
      `El paciente refiere ${data.sintomasCardiovasculares.join(", ")}`,
      `Se documenta presencia de ${data.sintomasCardiovasculares.join(", ")}`
    ];
    text += variaciones[Math.floor(Math.random() * variaciones.length)];

    if (data.sintomasCardiovascularesDetalle) {
      const conectores = ["indicando que", "con evolución descrita como"];
      text += `, ${conectores[Math.floor(Math.random() * conectores.length)]} ${data.sintomasCardiovascularesDetalle}. `;
    } else {
      text += ". ";
    }
  }

  // Presión arterial conocida
  if (data.presionArterial === "Ha referido diagnóstico previo de hipertensión arterial") {
    text += "El paciente refiere antecedente de hipertensión arterial previamente diagnosticada. ";
  } else if (data.presionArterial === "Ha referido diagnóstico previo de hipotensión arterial") {
    text += "El paciente refiere antecedente de hipotensión arterial diagnosticada. ";
  } else if (data.presionArterial === "No cuenta con diagnóstico conocido de alteraciones en la presión arterial") {
    text += "El paciente no cuenta con diagnóstico conocido de alteraciones en la presión arterial. ";
  }

  // Antecedentes cardiovasculares
  if (data.antecedentesCardiovasculares.includes("Niega antecedentes cardiovasculares")) {
    text += "El paciente niega antecedentes personales de enfermedad cardiovascular. ";
  } else if (data.antecedentesCardiovasculares.length > 0) {
    const variaciones = [
      `El paciente presenta antecedente de ${data.antecedentesCardiovasculares.join(", ")}`,
      `Se registra antecedente de ${data.antecedentesCardiovasculares.join(", ")}`
    ];
    text += variaciones[Math.floor(Math.random() * variaciones.length)];

    if (data.antecedentesCardiovascularesDetalle) {
      const conectores = ["indicando que", "descrito por el paciente como"];
      text += `, ${conectores[Math.floor(Math.random() * conectores.length)]} ${data.antecedentesCardiovascularesDetalle}. `;
    } else {
      text += ". ";
    }
  }

  // Capacidad funcional
  if (data.capacidadFuncional === "No refiere fatiga con la actividad cotidiana") {
    text += "El paciente no presenta limitaciones en su capacidad funcional. ";
  } else if (data.capacidadFuncional) {
    const variaciones = [
      `El paciente refiere fatiga con esfuerzos ${data.capacidadFuncional.includes("leves") ? "leves" : "moderados"}`,
      `Se reporta disminución de la capacidad funcional caracterizada por fatiga con ${data.capacidadFuncional.includes("leves") ? "esfuerzos leves" : "esfuerzos moderados"}`
    ];
    text += variaciones[Math.floor(Math.random() * variaciones.length)];

    if (data.capacidadFuncionalDetalle) {
      const conectores = ["manifestando que", "detallada como"];
      text += `, ${conectores[Math.floor(Math.random() * conectores.length)]} ${data.capacidadFuncionalDetalle}. `;
    } else {
      text += ". ";
    }
  }

  // Disnea
  if (data.disnea === "No refiere dificultad respiratoria") {
    text += "El paciente niega dificultad respiratoria. ";
  } else if (data.disnea) {
    const variaciones = [
      `El paciente refiere disnea de tipo ${data.disnea.replace("Disnea ", "").toLowerCase()}`,
      `Se identifica dificultad respiratoria descrita como ${data.disnea.replace("Disnea ", "").toLowerCase()}`
    ];
    text += variaciones[Math.floor(Math.random() * variaciones.length)];

    if (data.disneaDetalle) {
      const conectores = ["señalando que", "con características clínicas de"];
      text += `, ${conectores[Math.floor(Math.random() * conectores.length)]} ${data.disneaDetalle}. `;
    } else {
      text += ". ";
    }
  }

  // Otros antecedentes relevantes
  if (data.otrosAntecedentes.includes("Niega antecedentes familiares relevantes")) {
    text += "El paciente niega antecedentes familiares relevantes ni uso actual de fármacos cardiovasculares. ";
  } else if (data.otrosAntecedentes.length > 0) {
    const variaciones = [
      `El paciente refiere ${data.otrosAntecedentes.join(", ")}`,
      `Se documenta antecedente de ${data.otrosAntecedentes.join(", ")}`
    ];
    text += variaciones[Math.floor(Math.random() * variaciones.length)];

    if (data.otrosAntecedentesDetalle) {
      const conectores = ["especificando que", "detallado por el paciente como"];
      text += `, ${conectores[Math.floor(Math.random() * conectores.length)]} ${data.otrosAntecedentesDetalle}. `;
    } else {
      text += ". ";
    }
  }

  return text.trim();
};

interface AparatoCardiovascularProps {
  data: AparatoCardiovascularData;
  isHealthy: boolean;
  onHealthyToggle: (checked: boolean) => void;
  onRadioChange: (field: string, value: string) => void;
  onCheckboxChange: (field: string, value: string, checked: boolean) => void;
  onTextareaChange: (field: string, value: string) => void;
}

export const AparatoCardiovascular: React.FC<AparatoCardiovascularProps> = ({
  data,
  isHealthy,
  onHealthyToggle,
  onRadioChange,
  onCheckboxChange,
  onTextareaChange,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Aparato Cardiovascular</h4>
        <SintomasToggle
          checked={isHealthy}
          onChange={onHealthyToggle}
        />
      </div>
      {!isHealthy && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Dolor torácico</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="No refiere dolor torácico" isSelected={data.dolorToracico === "No refiere dolor torácico"} onClick={() => onRadioChange("dolorToracico", "No refiere dolor torácico")} />
              <WordButton label="Dolor opresivo retroesternal" isSelected={data.dolorToracico === "Dolor opresivo retroesternal irradiado a brazo, cuello o mandíbula"} onClick={() => onRadioChange("dolorToracico", "Dolor opresivo retroesternal irradiado a brazo, cuello o mandíbula")} />
              <WordButton label="Dolor punzante precordial" isSelected={data.dolorToracico === "Dolor punzante localizado en región precordial"} onClick={() => onRadioChange("dolorToracico", "Dolor punzante localizado en región precordial")} />
              <WordButton label="Dolor en relación al esfuerzo" isSelected={data.dolorToracico === "Dolor en relación al esfuerzo físico"} onClick={() => onRadioChange("dolorToracico", "Dolor en relación al esfuerzo físico")} />
              <WordButton label="Dolor en reposo o nocturno" isSelected={data.dolorToracico === "Dolor en reposo o nocturno"} onClick={() => onRadioChange("dolorToracico", "Dolor en reposo o nocturno")} />
            </div>
            {data.dolorToracico && data.dolorToracico !== "No refiere dolor torácico" && (
              <div className="mt-2">
                <Label>Especificar características (intensidad, duración, desencadenantes, alivio, tiempo de evolución)</Label>
                <textarea
                  value={data.dolorToracicoDetalle || ""}
                  onChange={(e) => onTextareaChange("dolorToracicoDetalle", e.target.value)}
                  className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                  rows={2}
                  placeholder="Describa las características del dolor..."
                />
              </div>
            )}
          </div>

          <div>
            <Label>Lipotimia o síncope</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="No ha presentado episodios" isSelected={data.lipotimia === "No ha presentado episodios"} onClick={() => onRadioChange("lipotimia", "No ha presentado episodios")} />
              <WordButton label="Lipotimia ocasional" isSelected={data.lipotimia === "Lipotimia ocasional sin pérdida total de conciencia"} onClick={() => onRadioChange("lipotimia", "Lipotimia ocasional sin pérdida total de conciencia")} />
              <WordButton label="Síncope súbito" isSelected={data.lipotimia === "Síncope súbito con recuperación espontánea"} onClick={() => onRadioChange("lipotimia", "Síncope súbito con recuperación espontánea")} />
            </div>
            {data.lipotimia && data.lipotimia !== "No ha presentado episodios" && (
              <div className="mt-2">
                <Label>Especificar frecuencia, circunstancias, duración y síntomas asociados</Label>
                <textarea
                  value={data.lipotimiaDetalle || ""}
                  onChange={(e) => onTextareaChange("lipotimiaDetalle", e.target.value)}
                  className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                  rows={2}
                  placeholder="Describa la frecuencia, circunstancias y síntomas..."
                />
              </div>
            )}
          </div>

          <div>
            <Label>Ritmo cardíaco percibido</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="No percibe irregularidad" isSelected={data.ritmoCardiaco === "No percibe irregularidad en el ritmo cardíaco"} onClick={() => onRadioChange("ritmoCardiaco", "No percibe irregularidad en el ritmo cardíaco")} />
              <WordButton label="Latidos acelerados persistentes" isSelected={data.ritmoCardiaco === "Latidos acelerados persistentes"} onClick={() => onRadioChange("ritmoCardiaco", "Latidos acelerados persistentes")} />
              <WordButton label="Latidos lentos o débiles" isSelected={data.ritmoCardiaco === "Latidos lentos o débiles"} onClick={() => onRadioChange("ritmoCardiaco", "Latidos lentos o débiles")} />
              <WordButton label="Palpitaciones intermitentes" isSelected={data.ritmoCardiaco === "Episodios de palpitaciones intermitentes"} onClick={() => onRadioChange("ritmoCardiaco", "Episodios de palpitaciones intermitentes")} />
            </div>
            {data.ritmoCardiaco && data.ritmoCardiaco !== "No percibe irregularidad en el ritmo cardíaco" && (
              <div className="mt-2">
                <Label>Especificar inicio, frecuencia, duración, factores desencadenantes</Label>
                <textarea
                  value={data.ritmoCardiacoDetalle || ""}
                  onChange={(e) => onTextareaChange("ritmoCardiacoDetalle", e.target.value)}
                  className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                  rows={2}
                  placeholder="Describa inicio, frecuencia y desencadenantes..."
                />
              </div>
            )}
          </div>

          <div>
            <Label>Síntomas cardiovasculares asociados</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Mareos o vértigo recurrente" isSelected={data.sintomasCardiovasculares.includes("Mareos o vértigo recurrente")} onClick={() => onCheckboxChange("sintomasCardiovasculares", "Mareos o vértigo recurrente", !data.sintomasCardiovasculares.includes("Mareos o vértigo recurrente"))} />
              <WordButton label="Edema en extremidades inferiores" isSelected={data.sintomasCardiovasculares.includes("Edema en extremidades inferiores")} onClick={() => onCheckboxChange("sintomasCardiovasculares", "Edema en extremidades inferiores", !data.sintomasCardiovasculares.includes("Edema en extremidades inferiores"))} />
              <WordButton label="Equimosis o tendencia a hematomas" isSelected={data.sintomasCardiovasculares.includes("Equimosis o tendencia a hematomas")} onClick={() => onCheckboxChange("sintomasCardiovasculares", "Equimosis o tendencia a hematomas", !data.sintomasCardiovasculares.includes("Equimosis o tendencia a hematomas"))} />
              <WordButton label="Várices visibles o dolorosas" isSelected={data.sintomasCardiovasculares.includes("Várices visibles o dolorosas")} onClick={() => onCheckboxChange("sintomasCardiovasculares", "Várices visibles o dolorosas", !data.sintomasCardiovasculares.includes("Várices visibles o dolorosas"))} />
              <WordButton label="Cefalea relacionada a presión arterial" isSelected={data.sintomasCardiovasculares.includes("Cefalea relacionada a presión arterial")} onClick={() => onCheckboxChange("sintomasCardiovasculares", "Cefalea relacionada a presión arterial", !data.sintomasCardiovasculares.includes("Cefalea relacionada a presión arterial"))} />
              <WordButton label="Acúfenos (zumbido en los oídos)" isSelected={data.sintomasCardiovasculares.includes("Acúfenos (zumbido en los oídos)")} onClick={() => onCheckboxChange("sintomasCardiovasculares", "Acúfenos (zumbido en los oídos)", !data.sintomasCardiovasculares.includes("Acúfenos (zumbido en los oídos)"))} />
              <WordButton label="Fosfenos o visión borrosa transitoria" isSelected={data.sintomasCardiovasculares.includes("Fosfenos o visión borrosa transitoria")} onClick={() => onCheckboxChange("sintomasCardiovasculares", "Fosfenos o visión borrosa transitoria", !data.sintomasCardiovasculares.includes("Fosfenos o visión borrosa transitoria"))} />
              <WordButton label="Palpitaciones frecuentes" isSelected={data.sintomasCardiovasculares.includes("Palpitaciones frecuentes")} onClick={() => onCheckboxChange("sintomasCardiovasculares", "Palpitaciones frecuentes", !data.sintomasCardiovasculares.includes("Palpitaciones frecuentes"))} />
              <WordButton label="Ninguno de los anteriores" isSelected={data.sintomasCardiovasculares.includes("Ninguno de los anteriores")} onClick={() => onCheckboxChange("sintomasCardiovasculares", "Ninguno de los anteriores", !data.sintomasCardiovasculares.includes("Ninguno de los anteriores"))} />
            </div>
            {data.sintomasCardiovasculares.length > 0 && !data.sintomasCardiovasculares.includes("Ninguno de los anteriores") && (
              <div className="mt-2">
                <Label>Describir evolución, intensidad y relación con actividades</Label>
                <textarea
                  value={data.sintomasCardiovascularesDetalle || ""}
                  onChange={(e) => onTextareaChange("sintomasCardiovascularesDetalle", e.target.value)}
                  className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                  rows={2}
                  placeholder="Describa evolución y relación con actividades..."
                />
              </div>
            )}
          </div>

          <div>
            <Label>Presión arterial conocida</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Hipertensión arterial" isSelected={data.presionArterial === "Ha referido diagnóstico previo de hipertensión arterial"} onClick={() => onRadioChange("presionArterial", "Ha referido diagnóstico previo de hipertensión arterial")} />
              <WordButton label="Hipotensión arterial" isSelected={data.presionArterial === "Ha referido diagnóstico previo de hipotensión arterial"} onClick={() => onRadioChange("presionArterial", "Ha referido diagnóstico previo de hipotensión arterial")} />
              <WordButton label="Sin diagnóstico conocido" isSelected={data.presionArterial === "No cuenta con diagnóstico conocido de alteraciones en la presión arterial"} onClick={() => onRadioChange("presionArterial", "No cuenta con diagnóstico conocido de alteraciones en la presión arterial")} />
            </div>
          </div>

          <div>
            <Label>Antecedentes cardiovasculares</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Infarto agudo al miocardio" isSelected={data.antecedentesCardiovasculares.includes("Infarto agudo al miocardio")} onClick={() => onCheckboxChange("antecedentesCardiovasculares", "Infarto agudo al miocardio", !data.antecedentesCardiovasculares.includes("Infarto agudo al miocardio"))} />
              <WordButton label="Enfermedad coronaria" isSelected={data.antecedentesCardiovasculares.includes("Enfermedad coronaria (ej. angina de pecho)")} onClick={() => onCheckboxChange("antecedentesCardiovasculares", "Enfermedad coronaria (ej. angina de pecho)", !data.antecedentesCardiovasculares.includes("Enfermedad coronaria (ej. angina de pecho)"))} />
              <WordButton label="Insuficiencia cardíaca" isSelected={data.antecedentesCardiovasculares.includes("Insuficiencia cardíaca")} onClick={() => onCheckboxChange("antecedentesCardiovasculares", "Insuficiencia cardíaca", !data.antecedentesCardiovasculares.includes("Insuficiencia cardíaca"))} />
              <WordButton label="Procedimientos cardiovasculares" isSelected={data.antecedentesCardiovasculares.includes("Procedimientos cardiovasculares (cateterismo, bypass, angioplastía)")} onClick={() => onCheckboxChange("antecedentesCardiovasculares", "Procedimientos cardiovasculares (cateterismo, bypass, angioplastía)", !data.antecedentesCardiovasculares.includes("Procedimientos cardiovasculares (cateterismo, bypass, angioplastía)"))} />
              <WordButton label="Niega antecedentes cardiovasculares" isSelected={data.antecedentesCardiovasculares.includes("Niega antecedentes cardiovasculares")} onClick={() => onCheckboxChange("antecedentesCardiovasculares", "Niega antecedentes cardiovasculares", !data.antecedentesCardiovasculares.includes("Niega antecedentes cardiovasculares"))} />
            </div>
            {data.antecedentesCardiovasculares.length > 0 && !data.antecedentesCardiovasculares.includes("Niega antecedentes cardiovasculares") && (
              <div className="mt-2">
                <Label>Detallar año, tratamiento recibido, secuelas, hospitalizaciones</Label>
                <textarea
                  value={data.antecedentesCardiovascularesDetalle || ""}
                  onChange={(e) => onTextareaChange("antecedentesCardiovascularesDetalle", e.target.value)}
                  className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                  rows={2}
                  placeholder="Detallar año, tratamiento, secuelas..."
                />
              </div>
            )}
          </div>

          <div>
            <Label>Capacidad funcional</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Fatiga con esfuerzos leves" isSelected={data.capacidadFuncional === "Fatiga fácil con esfuerzos leves (caminar, subir escaleras cortas)"} onClick={() => onRadioChange("capacidadFuncional", "Fatiga fácil con esfuerzos leves (caminar, subir escaleras cortas)")} />
              <WordButton label="Fatiga con esfuerzos moderados" isSelected={data.capacidadFuncional === "Fatiga únicamente con esfuerzos moderados o intensos"} onClick={() => onRadioChange("capacidadFuncional", "Fatiga únicamente con esfuerzos moderados o intensos")} />
              <WordButton label="No refiere fatiga" isSelected={data.capacidadFuncional === "No refiere fatiga con la actividad cotidiana"} onClick={() => onRadioChange("capacidadFuncional", "No refiere fatiga con la actividad cotidiana")} />
            </div>
            {data.capacidadFuncional && data.capacidadFuncional !== "No refiere fatiga con la actividad cotidiana" && (
              <div className="mt-2">
                <Label>Especificar limitaciones, tiempo de inicio y progresión</Label>
                <textarea
                  value={data.capacidadFuncionalDetalle || ""}
                  onChange={(e) => onTextareaChange("capacidadFuncionalDetalle", e.target.value)}
                  className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                  rows={2}
                  placeholder="Especificar limitaciones y progresión..."
                />
              </div>
            )}
          </div>

          <div>
            <Label>Disnea (dificultad para respirar)</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="No refiere dificultad respiratoria" isSelected={data.disnea === "No refiere dificultad respiratoria"} onClick={() => onRadioChange("disnea", "No refiere dificultad respiratoria")} />
              <WordButton label="Disnea de esfuerzo leve" isSelected={data.disnea === "Disnea de esfuerzo leve"} onClick={() => onRadioChange("disnea", "Disnea de esfuerzo leve")} />
              <WordButton label="Disnea paroxística nocturna" isSelected={data.disnea === "Disnea paroxística nocturna"} onClick={() => onRadioChange("disnea", "Disnea paroxística nocturna")} />
              <WordButton label="Ortopnea" isSelected={data.disnea === "Ortopnea (dificultad respiratoria al estar acostado)"} onClick={() => onRadioChange("disnea", "Ortopnea (dificultad respiratoria al estar acostado)")} />
            </div>
            {data.disnea && data.disnea !== "No refiere dificultad respiratoria" && (
              <div className="mt-2">
                <Label>Especificar desencadenantes, duración, intensidad y tratamiento recibido</Label>
                <textarea
                  value={data.disneaDetalle || ""}
                  onChange={(e) => onTextareaChange("disneaDetalle", e.target.value)}
                  className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                  rows={2}
                  placeholder="Especificar desencadenantes, duración e intensidad..."
                />
              </div>
            )}
          </div>

          <div>
            <Label>Otros antecedentes relevantes</Label>
            <div className="flex flex-wrap mt-1">
              <WordButton label="Uso de medicamentos cardiovasculares" isSelected={data.otrosAntecedentes.includes("Uso actual o previo de medicamentos cardiovasculares")} onClick={() => onCheckboxChange("otrosAntecedentes", "Uso actual o previo de medicamentos cardiovasculares", !data.otrosAntecedentes.includes("Uso actual o previo de medicamentos cardiovasculares"))} />
              <WordButton label="Antecedentes familiares" isSelected={data.otrosAntecedentes.includes("Antecedentes familiares de enfermedad cardiovascular prematura")} onClick={() => onCheckboxChange("otrosAntecedentes", "Antecedentes familiares de enfermedad cardiovascular prematura", !data.otrosAntecedentes.includes("Antecedentes familiares de enfermedad cardiovascular prematura"))} />
              <WordButton label="Niega antecedentes familiares" isSelected={data.otrosAntecedentes.includes("Niega antecedentes familiares relevantes")} onClick={() => onCheckboxChange("otrosAntecedentes", "Niega antecedentes familiares relevantes", !data.otrosAntecedentes.includes("Niega antecedentes familiares relevantes"))} />
            </div>
            {data.otrosAntecedentes.length > 0 && !data.otrosAntecedentes.includes("Niega antecedentes familiares relevantes") && (
              <div className="mt-2">
                <Label>Especificar nombres de fármacos, dosis, parentesco y edad de presentación en familiares</Label>
                <textarea
                  value={data.otrosAntecedentesDetalle || ""}
                  onChange={(e) => onTextareaChange("otrosAntecedentesDetalle", e.target.value)}
                  className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                  rows={2}
                  placeholder="Especificar medicamentos, dosis, antecedentes familiares..."
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
