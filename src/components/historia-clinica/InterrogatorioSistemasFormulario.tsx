import React from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // No usado directamente si usas WordButton
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";
import { FormValuesInterrogatorio } from '@/types/historiaClinica'; // Asegúrate que el tipo existe

// --- WordButton Component (movido aquí o importado si es global) ---
const WordButton = ({
    label,
    isSelected,
    onClick
}: {
    label: string;
    isSelected: boolean;
    onClick: () => void;
}) => {
    return (
        <button
            type="button" // Importante para no enviar formularios si estuviera dentro de <form>
            onClick={onClick}
            className={`px-2 py-1 text-xs rounded-md transition-colors mb-1 mr-1 ${isSelected ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
        >
            {label}
        </button>
    );
};
// --- Fin WordButton ---

interface InterrogatorioSistemasFormularioProps {
    formValues: FormValuesInterrogatorio;
    onRadioChange: (system: keyof FormValuesInterrogatorio, field: string, value: string) => void;
    onCheckboxChange: (system: keyof FormValuesInterrogatorio, field: string, value: string, checked: boolean) => void;
    onTextChange: (system: keyof FormValuesInterrogatorio, field: string, value: string) => void;
    onGenerate: () => void;
    onClear: () => void;
}

const InterrogatorioSistemasFormulario: React.FC<InterrogatorioSistemasFormularioProps> = ({
    formValues,
    onRadioChange,
    onCheckboxChange,
    onTextChange,
    onGenerate,
    onClear
}) => {

    // Helper para simplificar llamadas a handlers
    const handleRadio = (system: keyof FormValuesInterrogatorio, field: string, value: string) => () => onRadioChange(system, field, value);
    const handleCheckbox = (system: keyof FormValuesInterrogatorio, field: string, value: string) => {
        // Determina el estado actual para pasarlo al handler del padre
        const currentValues = formValues[system][field as keyof typeof formValues[typeof system]] as string[];
        const isCurrentlySelected = currentValues.includes(value);
        onCheckboxChange(system, field, value, !isCurrentlySelected);
    };
    const handleText = (system: keyof FormValuesInterrogatorio, field: string) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => onTextChange(system, field, e.target.value);


    return (
        <div className="space-y-6">
            {/* APARATO DIGESTIVO */}
            <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-3 text-justify">Aparato Digestivo</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Tipo de Alimentación */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Tipo de Alimentación</Label>
                        <div className="flex flex-wrap gap-1">
                             <WordButton label="Blanda" isSelected={formValues.digestivo.alimentacion === "Blanda"} onClick={handleRadio("digestivo", "alimentacion", "Blanda")} />
                             <WordButton label="Fibrosa" isSelected={formValues.digestivo.alimentacion === "Fibrosa"} onClick={handleRadio("digestivo", "alimentacion", "Fibrosa")} />
                             <WordButton label="Combinada" isSelected={formValues.digestivo.alimentacion === "Combinada"} onClick={handleRadio("digestivo", "alimentacion", "Combinada")} />
                        </div>
                    </div>
                     {/* Patrón de Masticación */}
                     <div>
                         <Label className="block mb-1 text-sm font-medium">Patrón de Masticación</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Unilateral" isSelected={formValues.digestivo.masticacion === "Unilateral"} onClick={handleRadio("digestivo", "masticacion", "Unilateral")} />
                             <WordButton label="Bilateral" isSelected={formValues.digestivo.masticacion === "Bilateral"} onClick={handleRadio("digestivo", "masticacion", "Bilateral")} />
                             <WordButton label="Anterior" isSelected={formValues.digestivo.masticacion === "Anterior"} onClick={handleRadio("digestivo", "masticacion", "Anterior")} />
                         </div>
                     </div>
                     {/* Percepción del Gusto */}
                    <div>
                         <Label className="block mb-1 text-sm font-medium">Percepción del Gusto</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Normal" isSelected={formValues.digestivo.percepcionGusto === "Normal"} onClick={handleRadio("digestivo", "percepcionGusto", "Normal")} />
                             <WordButton label="Disminución" isSelected={formValues.digestivo.percepcionGusto === "Disminucion"} onClick={handleRadio("digestivo", "percepcionGusto", "Disminucion")} />
                             <WordButton label="Alterados" isSelected={formValues.digestivo.percepcionGusto === "Alterados"} onClick={handleRadio("digestivo", "percepcionGusto", "Alterados")} />
                         </div>
                         {formValues.digestivo.percepcionGusto === "Alterados" && (
                             <Textarea
                                 placeholder="Especifique (metálico, amargo, etc.)"
                                 value={formValues.digestivo.percepcionGustoEspecificaciones}
                                 onChange={handleText("digestivo", "percepcionGustoEspecificaciones")}
                                 className="mt-2 w-full p-2 border rounded-md text-sm"
                                 rows={2}
                             />
                         )}
                     </div>
                    {/* Salivación */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Salivación</Label>
                        <div className="flex flex-wrap gap-1">
                             <WordButton label="Normal" isSelected={formValues.digestivo.salivacion === "Normal"} onClick={handleRadio("digestivo", "salivacion", "Normal")} />
                             <WordButton label="Aumentada" isSelected={formValues.digestivo.salivacion === "Aumentada"} onClick={handleRadio("digestivo", "salivacion", "Aumentada")} />
                             <WordButton label="Disminuida" isSelected={formValues.digestivo.salivacion === "Disminuida"} onClick={handleRadio("digestivo", "salivacion", "Disminuida")} />
                        </div>
                    </div>
                    {/* Dificultad o Dolor al Tragar */}
                    <div>
                         <Label className="block mb-1 text-sm font-medium">Dificultad o Dolor al Tragar</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="No" isSelected={formValues.digestivo.deglusion === "No"} onClick={handleRadio("digestivo", "deglusion", "No")} />
                             <WordButton label="Dificultad (sin dolor)" isSelected={formValues.digestivo.deglusion === "Dificultad"} onClick={handleRadio("digestivo", "deglusion", "Dificultad")} />
                             <WordButton label="Dolor (odinofagia)" isSelected={formValues.digestivo.deglusion === "Dolor"} onClick={handleRadio("digestivo", "deglusion", "Dolor")} />
                         </div>
                    </div>
                    {/* Halitosis */}
                    <div>
                         <Label className="block mb-1 text-sm font-medium">Halitosis (mal aliento)</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Sí" isSelected={formValues.digestivo.halitosis === "Sí"} onClick={handleRadio("digestivo", "halitosis", "Sí")} />
                             <WordButton label="No" isSelected={formValues.digestivo.halitosis === "No"} onClick={handleRadio("digestivo", "halitosis", "No")} />
                         </div>
                         {formValues.digestivo.halitosis === "Sí" && (
                             <div className="mt-2 flex flex-wrap gap-1">
                                 <WordButton label="Solo por las mañanas" isSelected={formValues.digestivo.halitosisEspecificaciones === "Solo por las mañanas"} onClick={handleRadio("digestivo", "halitosisEspecificaciones", "Solo por las mañanas")} />
                                 <WordButton label="Todo el tiempo" isSelected={formValues.digestivo.halitosisEspecificaciones === "Todo el tiempo"} onClick={handleRadio("digestivo", "halitosisEspecificaciones", "Todo el tiempo")} />
                             </div>
                         )}
                     </div>
                    {/* Síntomas Digestivos */}
                    <div className="sm:col-span-2">
                         <Label className="block mb-1 text-sm font-medium">Síntomas Digestivos Referidos</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Distensión Abdominal" isSelected={formValues.digestivo.sintomasDigestivos.includes("Distensión abdominal")} onClick={() => handleCheckbox("digestivo", "sintomasDigestivos", "Distensión abdominal")} />
                             <WordButton label="Estreñimiento" isSelected={formValues.digestivo.sintomasDigestivos.includes("Estreñimiento")} onClick={() => handleCheckbox("digestivo", "sintomasDigestivos", "Estreñimiento")} />
                             <WordButton label="Plenitud Posprandial" isSelected={formValues.digestivo.sintomasDigestivos.includes("Sensación de llenura después de comer")} onClick={() => handleCheckbox("digestivo", "sintomasDigestivos", "Sensación de llenura después de comer")} />
                             <WordButton label="Pirosis (acidez)" isSelected={formValues.digestivo.sintomasDigestivos.includes("Acidez (pirosis)")} onClick={() => handleCheckbox("digestivo", "sintomasDigestivos", "Acidez (pirosis)")} />
                             <WordButton label="Dolor Abdominal" isSelected={formValues.digestivo.sintomasDigestivos.includes("Dolor abdominal")} onClick={() => handleCheckbox("digestivo", "sintomasDigestivos", "Dolor abdominal")} />
                             <WordButton label="Náusea" isSelected={formValues.digestivo.sintomasDigestivos.includes("Náuseas")} onClick={() => handleCheckbox("digestivo", "sintomasDigestivos", "Náuseas")} />
                             <WordButton label="Vómito" isSelected={formValues.digestivo.sintomasDigestivos.includes("Vómitos")} onClick={() => handleCheckbox("digestivo", "sintomasDigestivos", "Vómitos")} />
                             <WordButton label="Reflujo" isSelected={formValues.digestivo.sintomasDigestivos.includes("Reflujo")} onClick={() => handleCheckbox("digestivo", "sintomasDigestivos", "Reflujo")} />
                             <WordButton label="Ninguno" isSelected={formValues.digestivo.sintomasDigestivos.includes("Ninguno")} onClick={() => handleCheckbox("digestivo", "sintomasDigestivos", "Ninguno")} />
                         </div>
                     </div>
                     {/* Cambios en el apetito */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Cambios en el apetito</Label>
                        <div className="flex flex-wrap gap-1">
                            <WordButton label="Aumentado" isSelected={formValues.digestivo.cambiosApetito === "Aumentado"} onClick={handleRadio("digestivo", "cambiosApetito", "Aumentado")} />
                            <WordButton label="Disminuido" isSelected={formValues.digestivo.cambiosApetito === "Disminuido"} onClick={handleRadio("digestivo", "cambiosApetito", "Disminuido")} />
                            <WordButton label="Sin cambios" isSelected={formValues.digestivo.cambiosApetito === "Sin cambios"} onClick={handleRadio("digestivo", "cambiosApetito", "Sin cambios")} />
                        </div>
                    </div>
                    {/* Hábitos alimenticios */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Hábitos alimenticios</Label>
                        <div className="flex flex-wrap gap-1">
                            <WordButton label="Ingesta nocturna" isSelected={formValues.digestivo.habitosAlimenticios === "Ingesta nocturna"} onClick={handleRadio("digestivo", "habitosAlimenticios", "Ingesta nocturna")} />
                            <WordButton label="Picoteo frecuente" isSelected={formValues.digestivo.habitosAlimenticios === "Picoteo frecuente"} onClick={handleRadio("digestivo", "habitosAlimenticios", "Picoteo frecuente")} />
                            <WordButton label="Ayuno prolongado" isSelected={formValues.digestivo.habitosAlimenticios === "Ayuno prolongado"} onClick={handleRadio("digestivo", "habitosAlimenticios", "Ayuno prolongado")} />
                            <WordButton label="Ninguno" isSelected={formValues.digestivo.habitosAlimenticios === "Ninguno"} onClick={handleRadio("digestivo", "habitosAlimenticios", "Ninguno")} />
                        </div>
                    </div>
                     {/* Color de las evacuaciones */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Color de las evacuaciones</Label>
                        <div className="flex flex-wrap gap-1">
                            <WordButton label="Normal (marrón)" isSelected={formValues.digestivo.colorEvacuaciones === "Normal"} onClick={handleRadio("digestivo", "colorEvacuaciones", "Normal")} />
                            <WordButton label="Oscuras (negras)" isSelected={formValues.digestivo.colorEvacuaciones === "Oscuras"} onClick={handleRadio("digestivo", "colorEvacuaciones", "Oscuras")} />
                            <WordButton label="Claras (pálidas)" isSelected={formValues.digestivo.colorEvacuaciones === "Claras"} onClick={handleRadio("digestivo", "colorEvacuaciones", "Claras")} />
                            <WordButton label="Con moco" isSelected={formValues.digestivo.colorEvacuaciones === "Presencia de moco"} onClick={handleRadio("digestivo", "colorEvacuaciones", "Presencia de moco")} />
                        </div>
                    </div>
                    {/* Hematemesis */}
                    <div>
                         <Label className="block mb-1 text-sm font-medium">Hematemesis (vómito con sangre)</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Sí" isSelected={formValues.digestivo.hematemesis === "Sí"} onClick={handleRadio("digestivo", "hematemesis", "Sí")} />
                             <WordButton label="No" isSelected={formValues.digestivo.hematemesis === "No"} onClick={handleRadio("digestivo", "hematemesis", "No")} />
                         </div>
                     </div>
                     {/* Frecuencia de Evacuación */}
                    <div>
                         <Label className="block mb-1 text-sm font-medium">Frecuencia de Evacuación Diaria</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="< 1 vez" isSelected={formValues.digestivo.frecuenciaEvacuacion === "Menos de una vez al día"} onClick={handleRadio("digestivo", "frecuenciaEvacuacion", "Menos de una vez al día")} />
                             <WordButton label="1 a 2 veces" isSelected={formValues.digestivo.frecuenciaEvacuacion === "1 a 2 veces"} onClick={handleRadio("digestivo", "frecuenciaEvacuacion", "1 a 2 veces")} />
                             <WordButton label="> 2 veces" isSelected={formValues.digestivo.frecuenciaEvacuacion === "Más de 2 veces"} onClick={handleRadio("digestivo", "frecuenciaEvacuacion", "Más de 2 veces")} />
                             <WordButton label="Otra" isSelected={formValues.digestivo.frecuenciaEvacuacion === "Otra"} onClick={handleRadio("digestivo", "frecuenciaEvacuacion", "Otra")} />
                         </div>
                         {formValues.digestivo.frecuenciaEvacuacion === "Otra" && (
                             <Textarea
                                 placeholder="Especifique frecuencia..."
                                 value={formValues.digestivo.frecuenciaEvacuacionEspecificaciones}
                                 onChange={handleText("digestivo", "frecuenciaEvacuacionEspecificaciones")}
                                 className="mt-2 w-full p-2 border rounded-md text-sm"
                                 rows={2}
                             />
                         )}
                     </div>

                </div>
            </div>

            {/* APARATO RESPIRATORIO */}
            <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                 <h4 className="text-lg font-semibold mb-3 text-justify">Aparato Respiratorio</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Tipo de Respiración */}
                    <div>
                         <Label className="block mb-1 text-sm font-medium">Tipo de Respiración Habitual</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Nasal" isSelected={formValues.respiratorio.tipoRespiracion === "Nasal"} onClick={handleRadio("respiratorio", "tipoRespiracion", "Nasal")} />
                             <WordButton label="Bucal" isSelected={formValues.respiratorio.tipoRespiracion === "Bucal"} onClick={handleRadio("respiratorio", "tipoRespiracion", "Bucal")} />
                             <WordButton label="Combinada" isSelected={formValues.respiratorio.tipoRespiracion === "Combinada"} onClick={handleRadio("respiratorio", "tipoRespiracion", "Combinada")} />
                         </div>
                     </div>
                    {/* Apnea del sueño */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Apnea del sueño (ronquido/pausas)</Label>
                        <div className="flex flex-wrap gap-1">
                            <WordButton label="Sí" isSelected={formValues.respiratorio.apneaSuenio === "Sí"} onClick={handleRadio("respiratorio", "apneaSuenio", "Sí")} />
                            <WordButton label="No" isSelected={formValues.respiratorio.apneaSuenio === "No"} onClick={handleRadio("respiratorio", "apneaSuenio", "No")} />
                        </div>
                    </div>
                    {/* Uso de oxígeno suplementario */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Uso de oxígeno suplementario</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Sí" isSelected={formValues.respiratorio.oxigenoSuplementario === "Sí"} onClick={handleRadio("respiratorio", "oxigenoSuplementario", "Sí")} />
                             <WordButton label="No" isSelected={formValues.respiratorio.oxigenoSuplementario === "No"} onClick={handleRadio("respiratorio", "oxigenoSuplementario", "No")} />
                         </div>
                     </div>
                     {/* Tos con expectoración */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Tos con expectoración (tipo)</Label>
                        <div className="flex flex-wrap gap-1">
                            <WordButton label="No presenta" isSelected={formValues.respiratorio.tosExpectoracion === ""} onClick={handleRadio("respiratorio", "tosExpectoracion", "")} />
                             <WordButton label="Transparente" isSelected={formValues.respiratorio.tosExpectoracion === "Transparente"} onClick={handleRadio("respiratorio", "tosExpectoracion", "Transparente")} />
                             <WordButton label="Amarilla" isSelected={formValues.respiratorio.tosExpectoracion === "Amarilla"} onClick={handleRadio("respiratorio", "tosExpectoracion", "Amarilla")} />
                             <WordButton label="Verdosa" isSelected={formValues.respiratorio.tosExpectoracion === "Verdosa"} onClick={handleRadio("respiratorio", "tosExpectoracion", "Verdosa")} />
                             <WordButton label="Hemoptoica (sangre)" isSelected={formValues.respiratorio.tosExpectoracion === "Hemoptoica"} onClick={handleRadio("respiratorio", "tosExpectoracion", "Hemoptoica")} />
                         </div>
                     </div>
                     {/* Síntomas Respiratorios */}
                    <div className="sm:col-span-2">
                         <Label className="block mb-1 text-sm font-medium">Síntomas Respiratorios Referidos</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Obstrucción Nasal" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Obstrucción nasal")} onClick={() => handleCheckbox("respiratorio", "sintomasRespiratorios", "Obstrucción nasal")} />
                             <WordButton label="Rinorrea" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Secreción nasal (rinorrea)")} onClick={() => handleCheckbox("respiratorio", "sintomasRespiratorios", "Secreción nasal (rinorrea)")} />
                             <WordButton label="Congestión Nasal" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Congestión nasal")} onClick={() => handleCheckbox("respiratorio", "sintomasRespiratorios", "Congestión nasal")} />
                             <WordButton label="Epistaxis (sangrado)" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Sangrado nasal (epistaxis)")} onClick={() => handleCheckbox("respiratorio", "sintomasRespiratorios", "Sangrado nasal (epistaxis)")} />
                             <WordButton label="Disnea (falta de aire)" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Dificultad para respirar (disnea)")} onClick={() => handleCheckbox("respiratorio", "sintomasRespiratorios", "Dificultad para respirar (disnea)")} />
                             <WordButton label="Tos (sin expectoración)" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Tos")} onClick={() => handleCheckbox("respiratorio", "sintomasRespiratorios", "Tos")} />
                             <WordButton label="Dolor Torácico" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Dolor en el pecho")} onClick={() => handleCheckbox("respiratorio", "sintomasRespiratorios", "Dolor en el pecho")} />
                             {/*<WordButton label="Hernias" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Hernias")} onClick={() => handleCheckbox("respiratorio", "sintomasRespiratorios", "Hernias")} />*/}
                             <WordButton label="Expectoración" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Flemas (expectoración)")} onClick={() => handleCheckbox("respiratorio", "sintomasRespiratorios", "Flemas (expectoración)")} />
                             {/* <WordButton label="Secreciones" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Mucosidad")} onClick={() => handleCheckbox("respiratorio", "sintomasRespiratorios", "Mucosidad")} /> */}
                             <WordButton label="Cianosis (color azulado)" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Coloración azulada en labios o piel (cianosis)")} onClick={() => handleCheckbox("respiratorio", "sintomasRespiratorios", "Coloración azulada en labios o piel (cianosis)")} />
                             <WordButton label="Ninguno" isSelected={formValues.respiratorio.sintomasRespiratorios.includes("Ninguno")} onClick={() => handleCheckbox("respiratorio", "sintomasRespiratorios", "Ninguno")} />
                         </div>
                     </div>
                 </div>
            </div>

            {/* APARATO CARDIOVASCULAR */}
            <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                 <h4 className="text-lg font-semibold mb-3 text-justify">Aparato Cardiovascular</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Dolor en el Pecho */}
                    <div>
                         <Label className="block mb-1 text-sm font-medium">Dolor en el Pecho</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Sí" isSelected={formValues.cardiovascular.dolorPecho === "Sí"} onClick={handleRadio("cardiovascular", "dolorPecho", "Sí")} />
                             <WordButton label="No" isSelected={formValues.cardiovascular.dolorPecho === "No"} onClick={handleRadio("cardiovascular", "dolorPecho", "No")} />
                         </div>
                     </div>
                    {/* Lipotimia (desmayo) */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Lipotimia (desmayo)</Label>
                        <div className="flex flex-wrap gap-1">
                             <WordButton label="Sí" isSelected={formValues.cardiovascular.lipotimia === "Sí"} onClick={handleRadio("cardiovascular", "lipotimia", "Sí")} />
                             <WordButton label="No" isSelected={formValues.cardiovascular.lipotimia === "No"} onClick={handleRadio("cardiovascular", "lipotimia", "No")} />
                         </div>
                     </div>
                     {/* Ritmo Cardíaco Percibido */}
                    <div>
                         <Label className="block mb-1 text-sm font-medium">Ritmo Cardíaco Percibido</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Normal" isSelected={formValues.cardiovascular.ritmoCardiaco === "Normal"} onClick={handleRadio("cardiovascular", "ritmoCardiaco", "Normal")} />
                             <WordButton label="Rápido (taquicardia)" isSelected={formValues.cardiovascular.ritmoCardiaco === "Rápido"} onClick={handleRadio("cardiovascular", "ritmoCardiaco", "Rápido")} />
                             <WordButton label="Lento (bradicardia)" isSelected={formValues.cardiovascular.ritmoCardiaco === "Lento"} onClick={handleRadio("cardiovascular", "ritmoCardiaco", "Lento")} />
                             <WordButton label="Irregular" isSelected={formValues.cardiovascular.ritmoCardiaco === "Irregular"} onClick={handleRadio("cardiovascular", "ritmoCardiaco", "Irregular")} />
                         </div>
                     </div>
                     {/* Presión arterial conocida */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Presión arterial conocida</Label>
                        <div className="flex flex-wrap gap-1">
                            <WordButton label="Alta" isSelected={formValues.cardiovascular.presionArterial === "Alta"} onClick={handleRadio("cardiovascular", "presionArterial", "Alta")} />
                            <WordButton label="Baja" isSelected={formValues.cardiovascular.presionArterial === "Baja"} onClick={handleRadio("cardiovascular", "presionArterial", "Baja")} />
                            <WordButton label="Normal" isSelected={formValues.cardiovascular.presionArterial === "Normal"} onClick={handleRadio("cardiovascular", "presionArterial", "Normal")} />
                            <WordButton label="No sabe" isSelected={formValues.cardiovascular.presionArterial === ""} onClick={handleRadio("cardiovascular", "presionArterial", "")} />
                        </div>
                    </div>
                    {/* Antecedentes de infarto */}
                     <div>
                        <Label className="block mb-1 text-sm font-medium">Antecedentes infarto/coronarios</Label>
                        <div className="flex flex-wrap gap-1">
                            <WordButton label="Sí" isSelected={formValues.cardiovascular.antecedentesInfarto === "Sí"} onClick={handleRadio("cardiovascular", "antecedentesInfarto", "Sí")} />
                            <WordButton label="No" isSelected={formValues.cardiovascular.antecedentesInfarto === "No"} onClick={handleRadio("cardiovascular", "antecedentesInfarto", "No")} />
                        </div>
                    </div>
                    {/* Fatiga fácil */}
                     <div>
                        <Label className="block mb-1 text-sm font-medium">Fatiga fácil con esfuerzo leve</Label>
                        <div className="flex flex-wrap gap-1">
                            <WordButton label="Sí" isSelected={formValues.cardiovascular.fatigaEsfuerzo === "Sí"} onClick={handleRadio("cardiovascular", "fatigaEsfuerzo", "Sí")} />
                            <WordButton label="No" isSelected={formValues.cardiovascular.fatigaEsfuerzo === "No"} onClick={handleRadio("cardiovascular", "fatigaEsfuerzo", "No")} />
                        </div>
                    </div>
                    {/* Síntomas Cardiovasculares */}
                    <div className="sm:col-span-2">
                         <Label className="block mb-1 text-sm font-medium">Otros Síntomas Cardiovasculares</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Mareos" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Mareos")} onClick={() => handleCheckbox("cardiovascular", "sintomasCardiovasculares", "Mareos")} />
                             <WordButton label="Edema (hinchazón)" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Hinchazón (edema)")} onClick={() => handleCheckbox("cardiovascular", "sintomasCardiovasculares", "Hinchazón (edema)")} />
                             <WordButton label="Equimosis (moretones)" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Moretones (equimosis)")} onClick={() => handleCheckbox("cardiovascular", "sintomasCardiovasculares", "Moretones (equimosis)")} />
                             <WordButton label="Várices" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Várices")} onClick={() => handleCheckbox("cardiovascular", "sintomasCardiovasculares", "Várices")} />
                             <WordButton label="Cefalea (dolor cabeza)" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Dolor de cabeza (cefalea)")} onClick={() => handleCheckbox("cardiovascular", "sintomasCardiovasculares", "Dolor de cabeza (cefalea)")} />
                             <WordButton label="Acúfenos (zumbidos)" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Zumbidos en los oídos (acúfenos)")} onClick={() => handleCheckbox("cardiovascular", "sintomasCardiovasculares", "Zumbidos en los oídos (acúfenos)")} />
                             <WordButton label="Fosfenos (luces)" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Luces al cerrar los ojos (fosfenos)")} onClick={() => handleCheckbox("cardiovascular", "sintomasCardiovasculares", "Luces al cerrar los ojos (fosfenos)")} />
                             <WordButton label="Palpitaciones" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Palpitaciones")} onClick={() => handleCheckbox("cardiovascular", "sintomasCardiovasculares", "Palpitaciones")} />
                             <WordButton label="Ninguno" isSelected={formValues.cardiovascular.sintomasCardiovasculares.includes("Ninguno")} onClick={() => handleCheckbox("cardiovascular", "sintomasCardiovasculares", "Ninguno")} />
                         </div>
                     </div>
                 </div>
            </div>

             {/* APARATO GENITO-URINARIO */}
            <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                 <h4 className="text-lg font-semibold mb-3 text-justify">Aparato Genito-Urinario</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                     {/* Frecuencia Urinaria */}
                    <div>
                         <Label className="block mb-1 text-sm font-medium">Frecuencia Urinaria (veces/día)</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="< 3" isSelected={formValues.genitoUrinario.frecuenciaUrinaria === "Menos de 3"} onClick={handleRadio("genitoUrinario", "frecuenciaUrinaria", "Menos de 3")} />
                             <WordButton label="3 a 6" isSelected={formValues.genitoUrinario.frecuenciaUrinaria === "3 a 6"} onClick={handleRadio("genitoUrinario", "frecuenciaUrinaria", "3 a 6")} />
                             <WordButton label="> 6" isSelected={formValues.genitoUrinario.frecuenciaUrinaria === "Más de 6"} onClick={handleRadio("genitoUrinario", "frecuenciaUrinaria", "Más de 6")} />
                         </div>
                     </div>
                    {/* Urgencia urinaria */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Urgencia urinaria</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Sí" isSelected={formValues.genitoUrinario.urgenciaUrinaria === "Sí"} onClick={handleRadio("genitoUrinario", "urgenciaUrinaria", "Sí")} />
                             <WordButton label="No" isSelected={formValues.genitoUrinario.urgenciaUrinaria === "No"} onClick={handleRadio("genitoUrinario", "urgenciaUrinaria", "No")} />
                         </div>
                     </div>
                     {/* Chorro urinario débil */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Chorro urinario débil</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Sí" isSelected={formValues.genitoUrinario.chorroUrinarioDebil === "Sí"} onClick={handleRadio("genitoUrinario", "chorroUrinarioDebil", "Sí")} />
                             <WordButton label="No" isSelected={formValues.genitoUrinario.chorroUrinarioDebil === "No"} onClick={handleRadio("genitoUrinario", "chorroUrinarioDebil", "No")} />
                         </div>
                     </div>
                     {/* Chorro urinario intermitente */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Chorro urinario intermitente</Label>
                        <div className="flex flex-wrap gap-1">
                             <WordButton label="Sí" isSelected={formValues.genitoUrinario.chorroUrinarioIntermitente === "Sí"} onClick={handleRadio("genitoUrinario", "chorroUrinarioIntermitente", "Sí")} />
                             <WordButton label="No" isSelected={formValues.genitoUrinario.chorroUrinarioIntermitente === "No"} onClick={handleRadio("genitoUrinario", "chorroUrinarioIntermitente", "No")} />
                         </div>
                     </div>
                     {/* Flujo vaginal/uretral anormal */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Flujo vaginal/uretral anormal</Label>
                        <div className="flex flex-wrap gap-1">
                             <WordButton label="Sí" isSelected={formValues.genitoUrinario.flujoVaginalUretral === "Sí"} onClick={handleRadio("genitoUrinario", "flujoVaginalUretral", "Sí")} />
                             <WordButton label="No" isSelected={formValues.genitoUrinario.flujoVaginalUretral === "No"} onClick={handleRadio("genitoUrinario", "flujoVaginalUretral", "No")} />
                         </div>
                     </div>
                     {/* Infecciones urinarias frecuentes */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Infecciones urinarias frecuentes</Label>
                        <div className="flex flex-wrap gap-1">
                             <WordButton label="Sí" isSelected={formValues.genitoUrinario.infeccionesUrinarias === "Sí"} onClick={handleRadio("genitoUrinario", "infeccionesUrinarias", "Sí")} />
                             <WordButton label="No" isSelected={formValues.genitoUrinario.infeccionesUrinarias === "No"} onClick={handleRadio("genitoUrinario", "infeccionesUrinarias", "No")} />
                         </div>
                     </div>
                    {/* Síntomas Urinarios */}
                    <div className="sm:col-span-2">
                         <Label className="block mb-1 text-sm font-medium">Otros Síntomas Urinarios</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Incontinencia" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Incontinencia")} onClick={() => handleCheckbox("genitoUrinario", "sintomasUrinarios", "Incontinencia")} />
                             <WordButton label="Disuria (dolor/ardor)" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Dolor al orinar (disuria)")} onClick={() => handleCheckbox("genitoUrinario", "sintomasUrinarios", "Dolor al orinar (disuria)")} />
                             <WordButton label="Hematuria (sangre)" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Sangre en orina (hematuria)")} onClick={() => handleCheckbox("genitoUrinario", "sintomasUrinarios", "Sangre en orina (hematuria)")} />
                             <WordButton label="Poliuria (orinar mucho)" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Orina en exceso (poliuria)")} onClick={() => handleCheckbox("genitoUrinario", "sintomasUrinarios", "Orina en exceso (poliuria)")} />
                             <WordButton label="Nicturia (orinar noche)" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Orinar de noche (nicturia)")} onClick={() => handleCheckbox("genitoUrinario", "sintomasUrinarios", "Orinar de noche (nicturia)")} />
                             <WordButton label="Dolor Lumbar" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Dolor lumbar")} onClick={() => handleCheckbox("genitoUrinario", "sintomasUrinarios", "Dolor lumbar")} />
                             <WordButton label="Ninguno" isSelected={formValues.genitoUrinario.sintomasUrinarios.includes("Ninguno")} onClick={() => handleCheckbox("genitoUrinario", "sintomasUrinarios", "Ninguno")} />
                         </div>
                     </div>
                     {/* --- Sección Gineco-Obstétrica --- */}
                     <h5 className="text-md font-semibold mt-3 sm:col-span-2 text-gray-600 dark:text-gray-400">Gineco-Obstétrico (si aplica)</h5>
                     {/* Fecha de Última Menstruación */}
                     <div>
                        <Label htmlFor="fum" className="block mb-1 text-sm font-medium">Fecha Última Menstruación (FUM)</Label>
                         <input
                             id="fum"
                             type="date"
                             value={formValues.genitoUrinario.ultimaMenstruacion}
                             onChange={handleText("genitoUrinario", "ultimaMenstruacion")}
                             className="w-full p-2 border rounded-md text-sm bg-white dark:bg-gray-800"
                         />
                     </div>
                     {/* Dismenorrea */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Dismenorrea (dolor menstrual)</Label>
                        <div className="flex flex-wrap gap-1">
                             <WordButton label="Sí" isSelected={formValues.genitoUrinario.dismenorrea === "Sí"} onClick={handleRadio("genitoUrinario", "dismenorrea", "Sí")} />
                             <WordButton label="No" isSelected={formValues.genitoUrinario.dismenorrea === "No"} onClick={handleRadio("genitoUrinario", "dismenorrea", "No")} />
                         </div>
                     </div>
                     {/* Duración de menstruación */}
                     <div>
                        <Label className="block mb-1 text-sm font-medium">Duración menstruación (días)</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="< 3" isSelected={formValues.genitoUrinario.duracionMenstruacion === "Menos de 3 días"} onClick={handleRadio("genitoUrinario", "duracionMenstruacion", "Menos de 3 días")} />
                             <WordButton label="3 a 5" isSelected={formValues.genitoUrinario.duracionMenstruacion === "3 a 5 días"} onClick={handleRadio("genitoUrinario", "duracionMenstruacion", "3 a 5 días")} />
                             <WordButton label="> 5" isSelected={formValues.genitoUrinario.duracionMenstruacion === "Más de 5 días"} onClick={handleRadio("genitoUrinario", "duracionMenstruacion", "Más de 5 días")} />
                         </div>
                     </div>
                     {/* Fecha de Último Parto */}
                     <div>
                        <Label htmlFor="fup" className="block mb-1 text-sm font-medium">Fecha Último Parto (FUP)</Label>
                        <input
                             id="fup"
                             type="date"
                             value={formValues.genitoUrinario.ultimoParto}
                             onChange={handleText("genitoUrinario", "ultimoParto")}
                             className="w-full p-2 border rounded-md text-sm bg-white dark:bg-gray-800"
                         />
                     </div>
                     {/* Antecedentes Obstétricos */}
                    <div className="sm:col-span-2">
                        <Label className="block mb-1 text-sm font-medium">Antecedentes Obstétricos</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Ninguno" isSelected={formValues.genitoUrinario.antecedentesObstetricos === "Ninguno"} onClick={handleRadio("genitoUrinario", "antecedentesObstetricos", "Ninguno")} />
                             <WordButton label="Gesta/Para/Aborto/Cesárea" isSelected={formValues.genitoUrinario.antecedentesObstetricos === "Gesta/Para/Aborto/Cesárea"} onClick={handleRadio("genitoUrinario", "antecedentesObstetricos", "Gesta/Para/Aborto/Cesárea")} />
                             {/* Podrías añadir campos específicos aquí si seleccionas la opción anterior */}
                         </div>
                         {formValues.genitoUrinario.antecedentesObstetricos === "Gesta/Para/Aborto/Cesárea" && (
                             <Textarea
                                 placeholder="Especifique G P A C (ej. G3 P2 A1 C1)"
                                 value={formValues.genitoUrinario.antecedentesObstetricosDetalle || ""} // Añade un campo 'antecedentesObstetricosDetalle' si es necesario
                                 onChange={handleText("genitoUrinario", "antecedentesObstetricosDetalle")}
                                 className="mt-2 w-full p-2 border rounded-md text-sm"
                                 rows={2}
                             />
                        )}
                    </div>
                 </div>
            </div>


            {/* SISTEMA ENDOCRINO */}
             <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                 <h4 className="text-lg font-semibold mb-3 text-justify">Sistema Endocrino</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Sudoración excesiva nocturna */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Sudoración excesiva nocturna</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Sí" isSelected={formValues.endocrino.sudoracionNocturna === "Sí"} onClick={handleRadio("endocrino", "sudoracionNocturna", "Sí")} />
                             <WordButton label="No" isSelected={formValues.endocrino.sudoracionNocturna === "No"} onClick={handleRadio("endocrino", "sudoracionNocturna", "No")} />
                         </div>
                     </div>
                     {/* Hirsutismo */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Hirsutismo (vello excesivo)</Label>
                        <div className="flex flex-wrap gap-1">
                             <WordButton label="Sí" isSelected={formValues.endocrino.hirsutismo === "Sí"} onClick={handleRadio("endocrino", "hirsutismo", "Sí")} />
                             <WordButton label="No" isSelected={formValues.endocrino.hirsutismo === "No"} onClick={handleRadio("endocrino", "hirsutismo", "No")} />
                         </div>
                     </div>
                     {/* Galactorrea */}
                     <div>
                        <Label className="block mb-1 text-sm font-medium">Galactorrea (secreción mamaria)</Label>
                        <div className="flex flex-wrap gap-1">
                             <WordButton label="Sí" isSelected={formValues.endocrino.galactorrea === "Sí"} onClick={handleRadio("endocrino", "galactorrea", "Sí")} />
                             <WordButton label="No" isSelected={formValues.endocrino.galactorrea === "No"} onClick={handleRadio("endocrino", "galactorrea", "No")} />
                         </div>
                     </div>
                     {/* Cambios en el ritmo menstrual */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Cambios ritmo menstrual</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="No aplica / Sin cambios" isSelected={formValues.endocrino.cambiosRitmoMenstrual === ""} onClick={handleRadio("endocrino", "cambiosRitmoMenstrual", "")} />
                             <WordButton label="Retrasos" isSelected={formValues.endocrino.cambiosRitmoMenstrual === "Retrasos"} onClick={handleRadio("endocrino", "cambiosRitmoMenstrual", "Retrasos")} />
                             <WordButton label="Amenorrea (ausencia)" isSelected={formValues.endocrino.cambiosRitmoMenstrual === "Amenorrea"} onClick={handleRadio("endocrino", "cambiosRitmoMenstrual", "Amenorrea")} />
                             <WordButton label="Ciclos cortos" isSelected={formValues.endocrino.cambiosRitmoMenstrual === "Ciclos cortos"} onClick={handleRadio("endocrino", "cambiosRitmoMenstrual", "Ciclos cortos")} />
                             <WordButton label="Ciclos largos" isSelected={formValues.endocrino.cambiosRitmoMenstrual === "Ciclos largos"} onClick={handleRadio("endocrino", "cambiosRitmoMenstrual", "Ciclos largos")} />
                         </div>
                     </div>
                     {/* Cambios de Peso */}
                    <div>
                         <Label className="block mb-1 text-sm font-medium">Cambios de Peso (sin causa)</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Pérdida" isSelected={formValues.endocrino.cambiosPeso === "Perdida"} onClick={handleRadio("endocrino", "cambiosPeso", "Perdida")} />
                             <WordButton label="Aumento" isSelected={formValues.endocrino.cambiosPeso === "Aumento"} onClick={handleRadio("endocrino", "cambiosPeso", "Aumento")} />
                             <WordButton label="No" isSelected={formValues.endocrino.cambiosPeso === "No"} onClick={handleRadio("endocrino", "cambiosPeso", "No")} />
                         </div>
                     </div>
                     {/* Intolerancia */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Intolerancia Frío/Calor</Label>
                        <div className="flex flex-wrap gap-1">
                            <WordButton label="Frío" isSelected={formValues.endocrino.intolerancia === "Frío"} onClick={handleRadio("endocrino", "intolerancia", "Frío")} />
                            <WordButton label="Calor" isSelected={formValues.endocrino.intolerancia === "Calor"} onClick={handleRadio("endocrino", "intolerancia", "Calor")} />
                            <WordButton label="No" isSelected={formValues.endocrino.intolerancia === "No"} onClick={handleRadio("endocrino", "intolerancia", "No")} />
                         </div>
                     </div>
                     {/* Condiciones Endocrinas */}
                     <div>
                        <Label className="block mb-1 text-sm font-medium">Condiciones Endocrinas Conocidas</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Diabetes" isSelected={formValues.endocrino.condicionesEndocrinas === "Diabetes"} onClick={handleRadio("endocrino", "condicionesEndocrinas", "Diabetes")} />
                             <WordButton label="Hipotiroidismo" isSelected={formValues.endocrino.condicionesEndocrinas === "Hipotiroidismo"} onClick={handleRadio("endocrino", "condicionesEndocrinas", "Hipotiroidismo")} />
                             <WordButton label="Hipertiroidismo" isSelected={formValues.endocrino.condicionesEndocrinas === "Hipertiroidismo"} onClick={handleRadio("endocrino", "condicionesEndocrinas", "Hipertiroidismo")} />
                             <WordButton label="Otra" isSelected={formValues.endocrino.condicionesEndocrinas === "Otra"} onClick={handleRadio("endocrino", "condicionesEndocrinas", "Otra")} />
                             <WordButton label="Ninguno" isSelected={formValues.endocrino.condicionesEndocrinas === "Ninguno"} onClick={handleRadio("endocrino", "condicionesEndocrinas", "Ninguno")} />
                         </div>
                         {formValues.endocrino.condicionesEndocrinas === "Otra" && (
                             <Textarea
                                 placeholder="Especifique condición..."
                                 value={formValues.endocrino.condicionesEndocrinasEspecificaciones || ""} // Añade campo si es necesario
                                 onChange={handleText("endocrino", "condicionesEndocrinasEspecificaciones")}
                                 className="mt-2 w-full p-2 border rounded-md text-sm"
                                 rows={2}
                             />
                        )}
                     </div>
                     {/* Síntomas Endocrinos */}
                    <div className="sm:col-span-2">
                         <Label className="block mb-1 text-sm font-medium">Otros Síntomas Endocrinos</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Poliuria (orinar mucho)" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Poliuria")} onClick={() => handleCheckbox("endocrino", "sintomasEndocrinos", "Poliuria")} />
                             <WordButton label="Polidipsia (mucha sed)" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Polidipsia")} onClick={() => handleCheckbox("endocrino", "sintomasEndocrinos", "Polidipsia")} />
                             <WordButton label="Polifagia (mucha hambre)" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Polifagia")} onClick={() => handleCheckbox("endocrino", "sintomasEndocrinos", "Polifagia")} />
                             <WordButton label="Exoftalmos (ojos saltones)" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Exoftalmos (ojos saltones)")} onClick={() => handleCheckbox("endocrino", "sintomasEndocrinos", "Exoftalmos (ojos saltones)")} />
                             <WordButton label="Nerviosismo" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Nerviosismo")} onClick={() => handleCheckbox("endocrino", "sintomasEndocrinos", "Nerviosismo")} />
                             <WordButton label="Temblores" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Temblores")} onClick={() => handleCheckbox("endocrino", "sintomasEndocrinos", "Temblores")} />
                             <WordButton label="Insomnio" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Insomnio")} onClick={() => handleCheckbox("endocrino", "sintomasEndocrinos", "Insomnio")} />
                             <WordButton label="Ninguno" isSelected={formValues.endocrino.sintomasEndocrinos.includes("Ninguno")} onClick={() => handleCheckbox("endocrino", "sintomasEndocrinos", "Ninguno")} />
                         </div>
                     </div>
                 </div>
             </div>


             {/* SISTEMA TEGUMENTARIO */}
             <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                 <h4 className="text-lg font-semibold mb-3 text-justify">Sistema Tegumentario (Piel y Anexos)</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                     {/* Cambios en la Coloración */}
                    <div>
                         <Label className="block mb-1 text-sm font-medium">Cambios Coloración Piel</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Sí" isSelected={formValues.tegumentario.cambiosColoracion === "Sí"} onClick={handleRadio("tegumentario", "cambiosColoracion", "Sí")} />
                             <WordButton label="No" isSelected={formValues.tegumentario.cambiosColoracion === "No"} onClick={handleRadio("tegumentario", "cambiosColoracion", "No")} />
                         </div>
                         {formValues.tegumentario.cambiosColoracion === "Sí" && (
                             <Textarea
                                 placeholder="Especifique (palidez, ictericia, cianosis, etc.)"
                                 value={formValues.tegumentario.cambiosColoracionEspecificaciones}
                                 onChange={handleText("tegumentario", "cambiosColoracionEspecificaciones")}
                                 className="mt-2 w-full p-2 border rounded-md text-sm"
                                 rows={2}
                             />
                         )}
                     </div>
                     {/* Cambios en uñas */}
                     <div>
                        <Label className="block mb-1 text-sm font-medium">Cambios en uñas</Label>
                        <div className="flex flex-wrap gap-1">
                            <WordButton label="No presenta" isSelected={formValues.tegumentario.cambiosUnas === ""} onClick={handleRadio("tegumentario", "cambiosUnas", "")} />
                            <WordButton label="Frágiles" isSelected={formValues.tegumentario.cambiosUnas === "Frágiles"} onClick={handleRadio("tegumentario", "cambiosUnas", "Frágiles")} />
                            <WordButton label="Quebradizas" isSelected={formValues.tegumentario.cambiosUnas === "Quebradizas"} onClick={handleRadio("tegumentario", "cambiosUnas", "Quebradizas")} />
                            <WordButton label="Deformadas" isSelected={formValues.tegumentario.cambiosUnas === "Deformadas"} onClick={handleRadio("tegumentario", "cambiosUnas", "Deformadas")} />
                            <WordButton label="Cambio color" isSelected={formValues.tegumentario.cambiosUnas === "Cambio color"} onClick={handleRadio("tegumentario", "cambiosUnas", "Cambio color")} />
                         </div>
                     </div>
                    {/* Cambios en lunares */}
                     <div>
                        <Label className="block mb-1 text-sm font-medium">Cambios en lunares</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Sí" isSelected={formValues.tegumentario.cambiosLunares === "Sí"} onClick={handleRadio("tegumentario", "cambiosLunares", "Sí")} />
                             <WordButton label="No" isSelected={formValues.tegumentario.cambiosLunares === "No"} onClick={handleRadio("tegumentario", "cambiosLunares", "No")} />
                         </div>
                     </div>
                     {/* Lesiones pigmentadas nuevas */}
                     <div>
                        <Label className="block mb-1 text-sm font-medium">Lesiones pigmentadas (nuevas/cambio)</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Sí" isSelected={formValues.tegumentario.lesionesPigmentadas === "Sí"} onClick={handleRadio("tegumentario", "lesionesPigmentadas", "Sí")} />
                             <WordButton label="No" isSelected={formValues.tegumentario.lesionesPigmentadas === "No"} onClick={handleRadio("tegumentario", "lesionesPigmentadas", "No")} />
                         </div>
                     </div>
                    {/* Síntomas Tegumentarios */}
                    <div className="sm:col-span-2">
                         <Label className="block mb-1 text-sm font-medium">Otros Síntomas Tegumentarios</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Erupciones" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Erupciones")} onClick={() => handleCheckbox("tegumentario", "sintomasTegumentarios", "Erupciones")} />
                             <WordButton label="Prurito (comezón)" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Prurito (comezón)")} onClick={() => handleCheckbox("tegumentario", "sintomasTegumentarios", "Prurito (comezón)")} />
                             <WordButton label="Hiperhidrosis (sudoración)" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Hiperhidrosis (sudoración excesiva)")} onClick={() => handleCheckbox("tegumentario", "sintomasTegumentarios", "Hiperhidrosis (sudoración excesiva)")} />
                             <WordButton label="Pérdida de Pelo/Vello" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Pérdida de pelo o vello")} onClick={() => handleCheckbox("tegumentario", "sintomasTegumentarios", "Pérdida de pelo o vello")} />
                             <WordButton label="Piel Seca" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Piel seca")} onClick={() => handleCheckbox("tegumentario", "sintomasTegumentarios", "Piel seca")} />
                             <WordButton label="Ninguno" isSelected={formValues.tegumentario.sintomasTegumentarios.includes("Ninguno")} onClick={() => handleCheckbox("tegumentario", "sintomasTegumentarios", "Ninguno")} />
                         </div>
                     </div>
                 </div>
             </div>

            {/* SISTEMA MÚSCULO-ESQUELÉTICO */}
            <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                 <h4 className="text-lg font-semibold mb-3 text-justify">Sistema Músculo-Esquelético</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                     {/* Fracturas o Esguinces */}
                     <div>
                        <Label className="block mb-1 text-sm font-medium">Antecedentes Fracturas / Esguinces</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Sí" isSelected={formValues.musculoEsqueletico.fracturas === "Sí"} onClick={handleRadio("musculoEsqueletico", "fracturas", "Sí")} />
                             <WordButton label="No" isSelected={formValues.musculoEsqueletico.fracturas === "No"} onClick={handleRadio("musculoEsqueletico", "fracturas", "No")} />
                         </div>
                     </div>
                      {/* Detalles de Fracturas */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Detalles (si hubo fracturas/esguinces)</Label>
                        <Textarea
                            placeholder="Tipo, localización, fecha aproximada..."
                            value={formValues.musculoEsqueletico.detallesFracturas}
                            onChange={handleText("musculoEsqueletico", "detallesFracturas")}
                            className="w-full p-2 border rounded-md text-sm"
                            rows={2}
                            disabled={formValues.musculoEsqueletico.fracturas !== "Sí"} // Deshabilitar si no hubo
                        />
                    </div>
                    {/* Rigidez matutina */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Rigidez matutina (duración)</Label>
                        <div className="flex flex-wrap gap-1">
                            <WordButton label="No presenta" isSelected={formValues.musculoEsqueletico.rigidezMatutina === ""} onClick={handleRadio("musculoEsqueletico", "rigidezMatutina", "")} />
                            <WordButton label="< 30 min" isSelected={formValues.musculoEsqueletico.rigidezMatutina === "Menos de 30 min"} onClick={handleRadio("musculoEsqueletico", "rigidezMatutina", "Menos de 30 min")} />
                            <WordButton label="> 30 min" isSelected={formValues.musculoEsqueletico.rigidezMatutina === "Más de 30 min"} onClick={handleRadio("musculoEsqueletico", "rigidezMatutina", "Más de 30 min")} />
                        </div>
                    </div>
                    {/* Debilidad muscular */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Debilidad muscular</Label>
                        <div className="flex flex-wrap gap-1">
                             <WordButton label="No" isSelected={formValues.musculoEsqueletico.debilidadMuscular === "No"} onClick={handleRadio("musculoEsqueletico", "debilidadMuscular", "No")} />
                             <WordButton label="Generalizada" isSelected={formValues.musculoEsqueletico.debilidadMuscular === "Generalizada"} onClick={handleRadio("musculoEsqueletico", "debilidadMuscular", "Generalizada")} />
                             <WordButton label="Localizada" isSelected={formValues.musculoEsqueletico.debilidadMuscular === "Localizada"} onClick={handleRadio("musculoEsqueletico", "debilidadMuscular", "Localizada")} />
                         </div>
                         {formValues.musculoEsqueletico.debilidadMuscular === "Localizada" && (
                             <Textarea
                                 placeholder="Especifique localización..."
                                 value={formValues.musculoEsqueletico.debilidadMuscularEspecifica || ""} // Añadir campo si es necesario
                                 onChange={handleText("musculoEsqueletico", "debilidadMuscularEspecifica")}
                                 className="mt-2 w-full p-2 border rounded-md text-sm"
                                 rows={1}
                             />
                         )}
                     </div>
                     {/* Limitaciones de Movimiento */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Limitaciones de Movimiento</Label>
                         <Textarea
                             placeholder="Describa articulación, tipo de limitación..."
                             value={formValues.musculoEsqueletico.limitacionesMovimiento}
                             onChange={handleText("musculoEsqueletico", "limitacionesMovimiento")}
                             className="w-full p-2 border rounded-md text-sm"
                             rows={2}
                         />
                     </div>
                    {/* Síntomas Musculoesqueléticos */}
                    <div className="sm:col-span-2">
                         <Label className="block mb-1 text-sm font-medium">Otros Síntomas Musculoesqueléticos</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Deformidad Articular" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Deformidad articular")} onClick={() => handleCheckbox("musculoEsqueletico", "sintomasMusculoEsqueleticos", "Deformidad articular")} />
                             <WordButton label="Dolor Articular (Artralgia)" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Dolor articular")} onClick={() => handleCheckbox("musculoEsqueletico", "sintomasMusculoEsqueleticos", "Dolor articular")} />
                             <WordButton label="Dolor Muscular (Mialgia)" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Dolor muscular")} onClick={() => handleCheckbox("musculoEsqueletico", "sintomasMusculoEsqueleticos", "Dolor muscular")} />
                             <WordButton label="Calambres frecuentes" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Calambres musculares frecuentes")} onClick={() => handleCheckbox("musculoEsqueletico", "sintomasMusculoEsqueleticos", "Calambres musculares frecuentes")} />
                             <WordButton label="Ninguno" isSelected={formValues.musculoEsqueletico.sintomasMusculoEsqueleticos.includes("Ninguno")} onClick={() => handleCheckbox("musculoEsqueletico", "sintomasMusculoEsqueleticos", "Ninguno")} />
                         </div>
                     </div>
                 </div>
             </div>

            {/* SISTEMA NERVIOSO */}
            <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                 <h4 className="text-lg font-semibold mb-3 text-justify">Sistema Nervioso</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                     {/* Percepción de los Sentidos */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Alteración Percepción Sentidos</Label>
                        <div className="flex flex-wrap gap-1">
                            <WordButton label="Sí" isSelected={formValues.nervioso.percepcionSentidos === "No"} onClick={handleRadio("nervioso", "percepcionSentidos", "No")} /> {/* Invertido: Sí hay alteración */}
                            <WordButton label="No" isSelected={formValues.nervioso.percepcionSentidos === "Sí"} onClick={handleRadio("nervioso", "percepcionSentidos", "Sí")} /> {/* Invertido: No hay alteración */}
                        </div>
                    </div>
                     {/* Horas de Sueño */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Horas de Sueño Promedio</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="< 4" isSelected={formValues.nervioso.horasSueno === "Menos de 4"} onClick={handleRadio("nervioso", "horasSueno", "Menos de 4")} />
                             <WordButton label="4 a 6" isSelected={formValues.nervioso.horasSueno === "4 a 6"} onClick={handleRadio("nervioso", "horasSueno", "4 a 6")} />
                             <WordButton label="7 a 8" isSelected={formValues.nervioso.horasSueno === "7 a 8"} onClick={handleRadio("nervioso", "horasSueno", "7 a 8")} />
                             <WordButton label="> 8" isSelected={formValues.nervioso.horasSueno === "Más de 8"} onClick={handleRadio("nervioso", "horasSueno", "Más de 8")} />
                         </div>
                     </div>
                     {/* Trastornos del Sueño */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Trastornos del Sueño</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Sí" isSelected={formValues.nervioso.trastornosSueno === "Sí"} onClick={handleRadio("nervioso", "trastornosSueno", "Sí")} />
                             <WordButton label="No" isSelected={formValues.nervioso.trastornosSueno === "No"} onClick={handleRadio("nervioso", "trastornosSueno", "No")} />
                         </div>
                         {formValues.nervioso.trastornosSueno === "Sí" && (
                             <Textarea
                                 placeholder="Especifique (insomnio, hipersomnia, pesadillas...)"
                                 value={formValues.nervioso.trastornosSuenoEspecificaciones}
                                 onChange={handleText("nervioso", "trastornosSuenoEspecificaciones")}
                                 className="mt-2 w-full p-2 border rounded-md text-sm"
                                 rows={2}
                             />
                         )}
                     </div>
                     {/* Estado de Ánimo */}
                    <div>
                         <Label className="block mb-1 text-sm font-medium">Estado de Ánimo Habitual</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Tranquilo" isSelected={formValues.nervioso.estadoAnimo === "Tranquilo"} onClick={handleRadio("nervioso", "estadoAnimo", "Tranquilo")} />
                             <WordButton label="Irritable" isSelected={formValues.nervioso.estadoAnimo === "Irritable"} onClick={handleRadio("nervioso", "estadoAnimo", "Irritable")} />
                             <WordButton label="Ansioso/Aprensivo" isSelected={formValues.nervioso.estadoAnimo === "Aprensivo"} onClick={handleRadio("nervioso", "estadoAnimo", "Aprensivo")} />
                             <WordButton label="Deprimido/Triste" isSelected={formValues.nervioso.estadoAnimo === "Deprimido"} onClick={handleRadio("nervioso", "estadoAnimo", "Deprimido")} />
                             <WordButton label="Alegre" isSelected={formValues.nervioso.estadoAnimo === "Alegre"} onClick={handleRadio("nervioso", "estadoAnimo", "Alegre")} />
                         </div>
                     </div>
                     {/* Parestesias */}
                    <div>
                        <Label className="block mb-1 text-sm font-medium">Parestesias (hormigueo/adorm.)</Label>
                        <div className="flex flex-wrap gap-1">
                             <WordButton label="Sí" isSelected={formValues.nervioso.parestesias === "Sí"} onClick={handleRadio("nervioso", "parestesias", "Sí")} />
                             <WordButton label="No" isSelected={formValues.nervioso.parestesias === "No"} onClick={handleRadio("nervioso", "parestesias", "No")} />
                         </div>
                         {formValues.nervioso.parestesias === "Sí" && (
                             <Textarea
                                 placeholder="Especifique localización..."
                                 value={formValues.nervioso.parestesiasEspecificaciones || ""} // Añadir campo
                                 onChange={handleText("nervioso", "parestesiasEspecificaciones")}
                                 className="mt-2 w-full p-2 border rounded-md text-sm"
                                 rows={1}
                             />
                         )}
                     </div>
                     {/* Otros Síntomas Neurológicos */}
                    <div className="sm:col-span-2">
                         <Label className="block mb-1 text-sm font-medium">Otros Síntomas Neurológicos</Label>
                         <div className="flex flex-wrap gap-1">
                             <WordButton label="Convulsiones" isSelected={formValues.nervioso.otrosSintomasNeurologicos.includes("Convulsiones")} onClick={() => handleCheckbox("nervioso", "otrosSintomasNeurologicos", "Convulsiones")} />
                             <WordButton label="Temblores" isSelected={formValues.nervioso.otrosSintomasNeurologicos.includes("Temblores")} onClick={() => handleCheckbox("nervioso", "otrosSintomasNeurologicos", "Temblores")} />
                             <WordButton label="Problemas memoria/conc." isSelected={formValues.nervioso.otrosSintomasNeurologicos.includes("Problemas de memoria o concentración")} onClick={() => handleCheckbox("nervioso", "otrosSintomasNeurologicos", "Problemas de memoria o concentración")} />
                             <WordButton label="Cambios personalidad" isSelected={formValues.nervioso.otrosSintomasNeurologicos.includes("Cambios de personalidad o comportamiento")} onClick={() => handleCheckbox("nervioso", "otrosSintomasNeurologicos", "Cambios de personalidad o comportamiento")} />
                             <WordButton label="Problemas coordinación" isSelected={formValues.nervioso.otrosSintomasNeurologicos.includes("Coordinación motora alterada")} onClick={() => handleCheckbox("nervioso", "otrosSintomasNeurologicos", "Coordinación motora alterada")} />
                             <WordButton label="Vértigo/Mareo" isSelected={formValues.nervioso.otrosSintomasNeurologicos.includes("Vértigo/Mareo")} onClick={() => handleCheckbox("nervioso", "otrosSintomasNeurologicos", "Vértigo/Mareo")} />
                             <WordButton label="Ninguno" isSelected={formValues.nervioso.otrosSintomasNeurologicos.includes("Ninguno")} onClick={() => handleCheckbox("nervioso", "otrosSintomasNeurologicos", "Ninguno")} />
                         </div>
                     </div>
                 </div>
             </div>

            {/* --- Botones de Acción --- */}
            <div className="flex justify-center items-center gap-4 pt-6">
                 <Button onClick={onGenerate} className="bg-blue-500 hover:bg-blue-600 text-white px-6">
                     Generar Redacción IA
                 </Button>
                 <Button onClick={onClear} variant="outline" className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700">
                     <Eraser className="w-4 h-4" />
                     Limpiar Formulario
                 </Button>
            </div>
        </div>
    );
};

export default InterrogatorioSistemasFormulario;