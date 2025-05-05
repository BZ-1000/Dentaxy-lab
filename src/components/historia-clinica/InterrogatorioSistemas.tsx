import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormDataState } from '@/types/historiaClinica';

interface InterrogatorioSistemasProps {
  formData: FormDataState;
  handleInterrogatorioChange: (system: string, value: string) => void;
}

const InterrogatorioSistemas = ({ formData, handleInterrogatorioChange }: InterrogatorioSistemasProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const isError = (name: string) => !!errors[name];

  const generateNarrative = () => {
    let narrative = "";

    if (formData.interrogatorioSistemas.cardiovascular) {
      narrative += "<strong>Sistema Cardiovascular:</strong> " + formData.interrogatorioSistemas.cardiovascular + "<br/><br/>";
    }

    if (formData.interrogatorioSistemas.respiratorio) {
      narrative += "<strong>Sistema Respiratorio:</strong> ";
      if (formData.interrogatorioSistemas.tosExpectoracion === "no presenta") {
        narrative += "No presenta tos con expectoración. ";
      } else if (formData.interrogatorioSistemas.tosExpectoracion) {
        narrative += `Presenta tos con expectoración ${formData.interrogatorioSistemas.tosExpectoracion}. `;
      }
      narrative += formData.interrogatorioSistemas.respiratorio + "<br/><br/>";
    }

    if (formData.interrogatorioSistemas.digestivo) {
      narrative += "<strong>Sistema Digestivo:</strong> " + formData.interrogatorioSistemas.digestivo + "<br/><br/>";
    }

    if (formData.interrogatorioSistemas.urinario) {
      narrative += "<strong>Sistema Urinario:</strong> " + formData.interrogatorioSistemas.urinario + "<br/><br/>";
    }

    if (formData.interrogatorioSistemas.musculoEsqueletico) {
      narrative += "<strong>Sistema Musculoesquelético:</strong> ";
      if (formData.interrogatorioSistemas.rigidezMatutina === "no presenta") {
        narrative += "No presenta rigidez matutina. ";
      } else if (formData.interrogatorioSistemas.rigidezMatutina) {
        narrative += `Presenta rigidez matutina con duración de ${formData.interrogatorioSistemas.rigidezMatutina}. `;
      }
      narrative += formData.interrogatorioSistemas.musculoEsqueletico + "<br/><br/>";
    }

    if (formData.interrogatorioSistemas.nervioso) {
      narrative += "<strong>Sistema Nervioso:</strong> " + formData.interrogatorioSistemas.nervioso + "<br/><br/>";
    }

    if (formData.interrogatorioSistemas.endocrino) {
      narrative += "<strong>Sistema Endocrino:</strong> ";
      if (formData.interrogatorioSistemas.cambiosMenstruales === "sin cambios") {
        narrative += "Sin cambios en el ritmo menstrual. ";
      } else if (formData.interrogatorioSistemas.cambiosMenstruales) {
        narrative += `Presenta ${formData.interrogatorioSistemas.cambiosMenstruales} en el ritmo menstrual. `;
      }
      narrative += formData.interrogatorioSistemas.endocrino + "<br/><br/>";
    }

    if (formData.interrogatorioSistemas.tegumentario) {
      narrative += "<strong>Sistema Tegumentario:</strong> ";
      if (formData.interrogatorioSistemas.cambiosUnas === "sin cambios") {
        narrative += "Sin cambios en las uñas. ";
      } else if (formData.interrogatorioSistemas.cambiosUnas) {
        narrative += `Presenta uñas ${formData.interrogatorioSistemas.cambiosUnas}. `;
      }
      narrative += formData.interrogatorioSistemas.tegumentario + "<br/><br/>";
    }

    if (formData.interrogatorioSistemas.habitosAlimenticios === "ninguno") {
      narrative += "<strong>Hábitos Alimenticios:</strong> Sin hábitos alimenticios relevantes, se interrogó específicamente por: ingesta nocturna, picoteo frecuente, ayuno prolongado.<br/><br/>";
    } else if (formData.interrogatorioSistemas.habitosAlimenticios) {
      narrative += `<strong>Hábitos Alimenticios:</strong> ${formData.interrogatorioSistemas.habitosAlimenticios}<br/><br/>`;
    }
    
    return <div dangerouslySetInnerHTML={{ __html: narrative }} />;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Interrogatorio por Sistemas</h2>
      <p className="mb-6 text-gray-500 dark:text-gray-400">
        Detalle los síntomas y signos relevantes de cada sistema del cuerpo.
      </p>

      {/* Cardiovascular System */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Sistema Cardiovascular</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <Label htmlFor="cardiovascular" className="block mb-2">
              Descripción
            </Label>
            <textarea
              id="cardiovascular"
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-50"
              placeholder="Ingrese detalles del sistema cardiovascular"
              value={formData.interrogatorioSistemas.cardiovascular || ""}
              onChange={(e) => handleInterrogatorioChange("cardiovascular", e.target.value)}
              {...register("interrogatorioSistemas.cardiovascular")}
            />
            {isError("interrogatorioSistemas.cardiovascular") && (
              <p className="text-red-500 text-sm mt-1">Este campo es requerido.</p>
            )}
          </div>
        </div>
      </div>

      {/* Respiratory System */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Sistema Respiratorio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <Label htmlFor="respiratorio" className="block mb-2">
              Descripción
            </Label>
            <textarea
              id="respiratorio"
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-50"
              placeholder="Ingrese detalles del sistema respiratorio"
              value={formData.interrogatorioSistemas.respiratorio || ""}
              onChange={(e) => handleInterrogatorioChange("respiratorio", e.target.value)}
              {...register("interrogatorioSistemas.respiratorio")}
            />
            {isError("interrogatorioSistemas.respiratorio") && (
              <p className="text-red-500 text-sm mt-1">Este campo es requerido.</p>
            )}
          </div>

          {/* Tos con expectoración - Updated with "No presenta" option */}
          <div className="mb-4">
            <Label htmlFor="tos-expectoracion" className="block mb-2">
              Tos con expectoración
            </Label>
            <RadioGroup
              className="flex flex-col space-y-1"
              value={formData.interrogatorioSistemas.tosExpectoracion || ""}
              onValueChange={(value) => handleInterrogatorioChange("tosExpectoracion", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no presenta" id="no-expectoracion" />
                <Label htmlFor="no-expectoracion">No presenta tos con expectoración</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="transparente" id="transparente" />
                <Label htmlFor="transparente">Transparente</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="amarilla" id="amarilla" />
                <Label htmlFor="amarilla">Amarilla</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="verdosa" id="verdosa" />
                <Label htmlFor="verdosa">Verdosa</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hemoptoica" id="hemoptoica" />
                <Label htmlFor="hemoptoica">Hemoptoica</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Digestive System */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Sistema Digestivo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <Label htmlFor="digestivo" className="block mb-2">
              Descripción
            </Label>
            <textarea
              id="digestivo"
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-50"
              placeholder="Ingrese detalles del sistema digestivo"
              value={formData.interrogatorioSistemas.digestivo || ""}
              onChange={(e) => handleInterrogatorioChange("digestivo", e.target.value)}
              {...register("interrogatorioSistemas.digestivo")}
            />
            {isError("interrogatorioSistemas.digestivo") && (
              <p className="text-red-500 text-sm mt-1">Este campo es requerido.</p>
            )}
          </div>
        </div>
      </div>

      {/* Urinary System */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Sistema Urinario</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <Label htmlFor="urinario" className="block mb-2">
              Descripción
            </Label>
            <textarea
              id="urinario"
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-50"
              placeholder="Ingrese detalles del sistema urinario"
              value={formData.interrogatorioSistemas.urinario || ""}
              onChange={(e) => handleInterrogatorioChange("urinario", e.target.value)}
              {...register("interrogatorioSistemas.urinario")}
            />
            {isError("interrogatorioSistemas.urinario") && (
              <p className="text-red-500 text-sm mt-1">Este campo es requerido.</p>
            )}
          </div>
        </div>
      </div>

      {/* Musculoskeletal System */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Sistema Musculoesquelético</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <Label htmlFor="musculoEsqueletico" className="block mb-2">
              Descripción
            </Label>
            <textarea
              id="musculoEsqueletico"
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-50"
              placeholder="Ingrese detalles del sistema musculoesquelético"
              value={formData.interrogatorioSistemas.musculoEsqueletico || ""}
              onChange={(e) => handleInterrogatorioChange("musculoEsqueletico", e.target.value)}
              {...register("interrogatorioSistemas.musculoEsqueletico")}
            />
            {isError("interrogatorioSistemas.musculoEsqueletico") && (
              <p className="text-red-500 text-sm mt-1">Este campo es requerido.</p>
            )}
          </div>

          {/* Rigidez matutina - Updated with "No presenta" option */}
          <div className="mb-4">
            <Label htmlFor="rigidez-matutina" className="block mb-2">
              Rigidez matutina
            </Label>
            <RadioGroup
              className="flex flex-col space-y-1"
              value={formData.interrogatorioSistemas.rigidezMatutina || ""}
              onValueChange={(value) => handleInterrogatorioChange("rigidezMatutina", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no presenta" id="no-rigidez" />
                <Label htmlFor="no-rigidez">No presenta rigidez matutina</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="menos de 30 min" id="menos-30" />
                <Label htmlFor="menos-30">Menos de 30 min</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="más de 30 min" id="mas-30" />
                <Label htmlFor="mas-30">Más de 30 min</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Nervous System */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Sistema Nervioso</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <Label htmlFor="nervioso" className="block mb-2">
              Descripción
            </Label>
            <textarea
              id="nervioso"
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-50"
              placeholder="Ingrese detalles del sistema nervioso"
              value={formData.interrogatorioSistemas.nervioso || ""}
              onChange={(e) => handleInterrogatorioChange("nervioso", e.target.value)}
              {...register("interrogatorioSistemas.nervioso")}
            />
            {isError("interrogatorioSistemas.nervioso") && (
              <p className="text-red-500 text-sm mt-1">Este campo es requerido.</p>
            )}
          </div>
        </div>
      </div>

      {/* Endocrine System */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Sistema Endocrino</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <Label htmlFor="endocrino" className="block mb-2">
              Descripción
            </Label>
            <textarea
              id="endocrino"
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-50"
              placeholder="Ingrese detalles del sistema endocrino"
              value={formData.interrogatorioSistemas.endocrino || ""}
              onChange={(e) => handleInterrogatorioChange("endocrino", e.target.value)}
              {...register("interrogatorioSistemas.endocrino")}
            />
            {isError("interrogatorioSistemas.endocrino") && (
              <p className="text-red-500 text-sm mt-1">Este campo es requerido.</p>
            )}
          </div>

          {/* Cambios en el ritmo menstrual - Updated with "Sin cambios" option */}
          <div className="mb-4">
            <Label htmlFor="cambios-menstruales" className="block mb-2">
              Cambios en el ritmo menstrual
            </Label>
            <RadioGroup
              className="flex flex-col space-y-1"
              value={formData.interrogatorioSistemas.cambiosMenstruales || ""}
              onValueChange={(value) => handleInterrogatorioChange("cambiosMenstruales", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sin cambios" id="sin-cambios-menstruales" />
                <Label htmlFor="sin-cambios-menstruales">Sin cambios en el ritmo menstrual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="retrasos" id="retrasos" />
                <Label htmlFor="retrasos">Retrasos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="amenorrea" id="amenorrea" />
                <Label htmlFor="amenorrea">Amenorrea</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ciclos cortos" id="ciclos-cortos" />
                <Label htmlFor="ciclos-cortos">Ciclos cortos</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Tegumentary System */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Sistema Tegumentario</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <Label htmlFor="tegumentario" className="block mb-2">
              Descripción
            </Label>
            <textarea
              id="tegumentario"
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-50"
              placeholder="Ingrese detalles del sistema tegumentario"
              value={formData.interrogatorioSistemas.tegumentario || ""}
              onChange={(e) => handleInterrogatorioChange("tegumentario", e.target.value)}
              {...register("interrogatorioSistemas.tegumentario")}
            />
            {isError("interrogatorioSistemas.tegumentario") && (
              <p className="text-red-500 text-sm mt-1">Este campo es requerido.</p>
            )}
          </div>

          {/* Cambios en uñas - Updated with "Sin cambios" option */}
          <div className="mb-4">
            <Label htmlFor="cambios-unas" className="block mb-2">
              Cambios en uñas
            </Label>
            <RadioGroup
              className="flex flex-col space-y-1"
              value={formData.interrogatorioSistemas.cambiosUnas || ""}
              onValueChange={(value) => handleInterrogatorioChange("cambiosUnas", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sin cambios" id="sin-cambios-unas" />
                <Label htmlFor="sin-cambios-unas">Sin cambios</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="frágiles" id="fragiles" />
                <Label htmlFor="fragiles">Frágiles</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="quebradizas" id="quebradizas" />
                <Label htmlFor="quebradizas">Quebradizas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="deformadas" id="deformadas" />
                <Label htmlFor="deformadas">Deformadas</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Hábitos alimenticios - Modify to include condition for "ninguno" */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Hábitos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <Label htmlFor="habitosAlimenticios" className="block mb-2">
              Hábitos Alimenticios
            </Label>
            <textarea
              id="habitosAlimenticios"
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-50"
              placeholder="Ingrese detalles de los hábitos alimenticios"
              value={formData.interrogatorioSistemas.habitosAlimenticios || ""}
              onChange={(e) => handleInterrogatorioChange("habitosAlimenticios", e.target.value)}
              {...register("interrogatorioSistemas.habitosAlimenticios")}
            />
            {isError("interrogatorioSistemas.habitosAlimenticios") && (
              <p className="text-red-500 text-sm mt-1">Este campo es requerido.</p>
            )}
          </div>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Narrativa del Interrogatorio por Sistemas</h3>
        <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          {generateNarrative()}
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default InterrogatorioSistemas;
