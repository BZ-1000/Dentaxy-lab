import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const familiares = [
  "Padre",
  "Madre",
  "Abuelo Paterno",
  "Abuela Paterna",
  "Abuelo Materno",
  "Abuela Materna",
];

const condiciones = ["Diabetes Mellitus", "Hipertensión Arterial", "Cáncer", "Otras"];

const FamiliaRow = ({ familiar }) => {
  const [isFinado, setIsFinado] = useState(false);
  const [causaMuerte, setCausaMuerte] = useState("");
  const [selecciones, setSelecciones] = useState([]);
  const [otraCondicion, setOtraCondicion] = useState("");

  const toggleSeleccion = (opcion) => {
    if (selecciones.includes(opcion)) {
      setSelecciones(selecciones.filter((item) => item !== opcion));
    } else {
      setSelecciones([...selecciones, opcion]);
    }
  };

  return (
    <div className="flex flex-col gap-2 border-b pb-4">
      <div className="grid grid-cols-6 gap-2">
        <span className="font-medium">{familiar}</span>
        <button
          className={`px-2 py-1.5 rounded-md border transition-colors ${
            isFinado ? "bg-red-500 text-white" : "bg-white"
          }`}
          onClick={() => {
            setIsFinado(!isFinado);
            if (!isFinado) setSelecciones([]);
          }}
        >
          Finado
        </button>
        {!isFinado &&
          condiciones.map((cond) => (
            <button
              key={cond}
              className={`px-2 py-1.5 rounded-md border transition-colors ${
                selecciones.includes(cond) ? "bg-blue-500 text-white" : "bg-white"
              }`}
              onClick={() => toggleSeleccion(cond)}
            >
              {cond}
            </button>
          ))}
      </div>
      {isFinado && (
        <Input
          value={causaMuerte}
          onChange={(e) => setCausaMuerte(e.target.value)}
          placeholder="Causa de fallecimiento"
          className="w-full border rounded-md px-2 py-1.5"
        />
      )}
      {selecciones.includes("Otras") && !isFinado && (
        <Input
          value={otraCondicion}
          onChange={(e) => setOtraCondicion(e.target.value)}
          placeholder="Especifique otras condiciones"
          className="w-full border rounded-md px-2 py-1.5"
        />
      )}
    </div>
  );
};

const AntecedentesHeredoFamiliares = () => {
  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-xl font-mplus font-normal mb-4">II.Antecedentes Heredo Familiares</h3>
      {familiares.map((familiar) => (
        <FamiliaRow key={familiar} familiar={familiar} />
      ))}
    </Card>
  );
};

export default AntecedentesHeredoFamiliares;
