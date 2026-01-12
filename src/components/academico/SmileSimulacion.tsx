import React from 'react';
import { motion } from 'framer-motion';

interface SmileSeccion {
  titulo: string;
  placeholder: string;
}

const seccionesSmile: SmileSeccion[] = [
  { titulo: 'Motivo de Consulta', placeholder: 'Escribir motivo...' },
  { titulo: 'Antecedentes Patológicos', placeholder: 'Registrar antecedentes...' },
  { titulo: 'Exploración Física', placeholder: 'Describir hallazgos...' },
  { titulo: 'Diagnóstico', placeholder: 'Establecer diagnóstico...' },
  { titulo: 'Plan de Tratamiento', placeholder: 'Definir tratamiento...' },
  { titulo: 'Observaciones', placeholder: 'Notas adicionales...' }
];

interface SmileSimulacionProps {
  datosRecibidos?: Record<string, string>;
}

export const SmileSimulacion: React.FC<SmileSimulacionProps> = ({ datosRecibidos = {} }) => {
  return (
    <div className="h-full flex flex-col bg-[#f5f5f5] border-r border-gray-300">
      {/* Header estilo antiguo */}
      <div className="bg-[#e0e0e0] border-b border-gray-400 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-500 rounded" />
            <span className="font-sans text-sm font-bold text-gray-700 uppercase tracking-wide">
              SMILE · Sistema Clínico
            </span>
          </div>
          <span className="text-xs text-gray-500">v2.3.1</span>
        </div>
      </div>

      {/* Subtítulo */}
      <div className="bg-[#ebebeb] px-4 py-2 border-b border-gray-300">
        <span className="text-xs text-gray-600">
          Historia Clínica — Formulario Tradicional
        </span>
      </div>

      {/* Contenido - Formulario básico */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {seccionesSmile.map((seccion, index) => (
          <motion.div
            key={seccion.titulo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="space-y-1"
          >
            <label className="block text-xs font-bold text-gray-600 uppercase">
              {seccion.titulo}
            </label>
            <textarea
              value={datosRecibidos[seccion.titulo] || ''}
              readOnly={!!datosRecibidos[seccion.titulo]}
              placeholder={seccion.placeholder}
              className={`
                w-full h-24 px-3 py-2 text-sm
                bg-white border border-gray-400 rounded
                font-sans text-gray-800
                resize-none
                focus:outline-none focus:border-gray-500
                ${datosRecibidos[seccion.titulo] ? 'bg-yellow-50' : ''}
              `}
            />
            {datosRecibidos[seccion.titulo] && (
              <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Recibido desde Dentaxy
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-[#e0e0e0] border-t border-gray-400 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Sistema Tradicional</span>
          <span>Sin asistencia IA</span>
        </div>
      </div>
    </div>
  );
};
