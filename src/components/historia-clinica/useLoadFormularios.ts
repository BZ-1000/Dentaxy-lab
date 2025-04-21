
import { useEffect, useState } from "react";
import { FormDataState } from "@/types/historiaClinica";

export const useLoadFormularios = () => {
  const [formularios, setFormularios] = useState<{ nombre: string; data: FormDataState }[]>([]);

  useEffect(() => {
    const savedForms: { nombre: string; data: FormDataState }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("formulario_")) {
        const nombre = key.replace("formulario_", "");
        const data = JSON.parse(localStorage.getItem(key) || "{}");
        savedForms.push({ nombre, data });
      }
    }
    setFormularios(savedForms);
  }, []);

  return formularios;
};

