import React from 'react';
import { DatosGenerales } from '@/types/historiaClinica';

export interface DatosGeneralesPacienteProps {
  data: DatosGenerales;
  onChange: (field: string, value: string) => void;
}

export const DatosGeneralesPaciente: React.FC<DatosGeneralesPacienteProps> = ({ data, onChange }) => {
  return (
    <div className="w-full bg-white px-2 py-8 md:px-8">
      <div className="mb-10">
        <h2 className="text-[28px] font-light tracking-tight text-zinc-900 mb-1">
          Datos Generales del Paciente
        </h2>
        <p className="text-sm text-zinc-400 font-light">
          Ingrese la información demográfica principal para aperturar el expediente clínico.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        {/* Nombre Completo */}
        <div className="flex flex-col relative group">
          <label className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 mb-1 transition-colors group-focus-within:text-emerald-600">
            Nombre completo
          </label>
          <input 
            type="text" 
            className="w-full text-base font-light text-zinc-800 bg-transparent border-b border-zinc-200 py-2 outline-none transition-all focus:border-emerald-500 placeholder-zinc-300"
            value={data.nombreCompleto || ''}
            onChange={(e) => onChange('nombreCompleto', e.target.value)}
            placeholder="Apellidos, Nombres"
          />
        </div>

        {/* Fecha de Nacimiento */}
        <div className="flex flex-col relative group">
          <label className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 mb-1 transition-colors group-focus-within:text-emerald-600">
            Fecha de nacimiento
          </label>
          <input 
            type="date" 
            className="w-full text-base font-light text-zinc-800 bg-transparent border-b border-zinc-200 py-2 outline-none transition-all focus:border-emerald-500"
            value={data.fechaNacimiento || ''}
            onChange={(e) => onChange('fechaNacimiento', e.target.value)}
          />
        </div>

        {/* Sexo */}
        <div className="flex flex-col relative group">
          <label className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 mb-1 transition-colors group-focus-within:text-emerald-600">
            Sexo
          </label>
          <select
            className="w-full text-base font-light text-zinc-800 bg-transparent border-b border-zinc-200 py-2 outline-none transition-all focus:border-emerald-500 appearance-none cursor-pointer"
            value={data.sexo || ''}
            onChange={(e) => onChange('sexo', e.target.value)}
          >
            <option value="" disabled className="text-zinc-300">Seleccionar sexo...</option>
            <option value="Femenino">Femenino</option>
            <option value="Masculino">Masculino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        {/* Estado Civil */}
        <div className="flex flex-col relative group">
          <label className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 mb-1 transition-colors group-focus-within:text-emerald-600">
            Estado Civil
          </label>
          <select
            className="w-full text-base font-light text-zinc-800 bg-transparent border-b border-zinc-200 py-2 outline-none transition-all focus:border-emerald-500 appearance-none cursor-pointer"
            value={data.estadoCivil || ''}
            onChange={(e) => onChange('estadoCivil', e.target.value)}
          >
            <option value="" disabled className="text-zinc-300">Seleccionar estado civil...</option>
            <option value="Soltero/a">Soltero/a</option>
            <option value="Casado/a">Casado/a</option>
            <option value="Divorciado/a">Divorciado/a</option>
            <option value="Viudo/a">Viudo/a</option>
            <option value="Unión Libre">Unión Libre</option>
          </select>
        </div>

        {/* Ocupación */}
        <div className="flex flex-col relative group">
          <label className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 mb-1 transition-colors group-focus-within:text-emerald-600">
            Ocupación
          </label>
          <input 
            type="text" 
            className="w-full text-base font-light text-zinc-800 bg-transparent border-b border-zinc-200 py-2 outline-none transition-all focus:border-emerald-500 placeholder-zinc-300"
            value={data.ocupacion || ''}
            onChange={(e) => onChange('ocupacion', e.target.value)}
            placeholder="Ej. Docente, Ingeniero, Estudiante"
          />
        </div>

        {/* Teléfono */}
        <div className="flex flex-col relative group">
          <label className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 mb-1 transition-colors group-focus-within:text-emerald-600">
            Teléfono Móvil
          </label>
          <input 
            type="tel" 
            className="w-full text-base font-light text-zinc-800 bg-transparent border-b border-zinc-200 py-2 outline-none transition-all focus:border-emerald-500 placeholder-zinc-300"
            value={data.telefono || ''}
            onChange={(e) => onChange('telefono', e.target.value)}
            placeholder="Ej. 55 1234 5678"
          />
        </div>

        {/* Correo Electrónico */}
        <div className="flex flex-col relative group">
          <label className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 mb-1 transition-colors group-focus-within:text-emerald-600">
            Correo Electrónico
          </label>
          <input 
            type="email" 
            className="w-full text-base font-light text-zinc-800 bg-transparent border-b border-zinc-200 py-2 outline-none transition-all focus:border-emerald-500 placeholder-zinc-300"
            value={data.correo || ''}
            onChange={(e) => onChange('correo', e.target.value)}
            placeholder="paciente@correo.com"
          />
        </div>

        {/* Contacto de Emergencia */}
        <div className="flex flex-col relative group">
          <label className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 mb-1 transition-colors group-focus-within:text-emerald-600">
            Contacto de Emergencia
          </label>
          <input 
            type="text" 
            className="w-full text-base font-light text-zinc-800 bg-transparent border-b border-zinc-200 py-2 outline-none transition-all focus:border-emerald-500 placeholder-zinc-300"
            value={data.contactoEmergencia || ''}
            onChange={(e) => onChange('contactoEmergencia', e.target.value)}
            placeholder="Nombre y Teléfono"
          />
        </div>

        {/* Domicilio (Ocupa dos columnas completas) */}
        <div className="flex flex-col relative group md:col-span-2 mt-4">
          <label className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 mb-1 transition-colors group-focus-within:text-emerald-600">
            Domicilio Completo
          </label>
          <textarea 
            className="w-full text-base font-light text-zinc-800 bg-transparent border-b border-zinc-200 py-2 outline-none transition-all focus:border-emerald-500 placeholder-zinc-300 resize-none min-h-[60px]"
            value={data.domicilio || ''}
            onChange={(e) => onChange('domicilio', e.target.value)}
            placeholder="Calle, Número, Colonia, Código Postal, Ciudad"
          />
        </div>
      </div>
    </div>
  );
};
