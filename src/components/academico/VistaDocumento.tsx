import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Calendar, User, MapPin, Stamp } from 'lucide-react';
import { ClinicaUAO } from '@/data/clinicasUAO';

interface VistaDocumentoProps {
  clinica: ClinicaUAO;
  datos: {
    paciente?: string;
    fecha?: string;
    contenido?: Record<string, string>;
  };
  visible: boolean;
}

export const VistaDocumento: React.FC<VistaDocumentoProps> = ({ 
  clinica, 
  datos,
  visible 
}) => {
  if (!visible) return null;

  const fechaActual = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-lg shadow-2xl"
      >
        {/* Documento estilo papel */}
        <div className="bg-white overflow-y-auto max-h-[90vh]">
          {/* Marca de agua */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <span className="text-8xl font-bold text-gray-900 rotate-[-30deg]">
              DENTAXY UAO
            </span>
          </div>

          {/* Header del documento */}
          <div className="relative border-b-2 border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Historia Clínica
                  </h1>
                  <p className="text-sm text-gray-500">
                    Universidad Autónoma de Zacatecas · UAO
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xs text-gray-500">Folio</div>
                <div className="font-mono text-sm font-bold text-gray-700">
                  HC-{Math.random().toString(36).substr(2, 8).toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Metadatos */}
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <div>
                <div className="text-[10px] text-gray-500 uppercase">Paciente</div>
                <div className="text-sm font-medium">{datos.paciente || 'Paciente Demo'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <div className="text-[10px] text-gray-500 uppercase">Fecha</div>
                <div className="text-sm font-medium">{fechaActual}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <div>
                <div className="text-[10px] text-gray-500 uppercase">Clínica</div>
                <div className="text-sm font-medium">{clinica.nombreCorto}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-400" />
              <div>
                <div className="text-[10px] text-gray-500 uppercase">Estado</div>
                <div className="text-sm font-medium text-emerald-600">Verificado</div>
              </div>
            </div>
          </div>

          {/* Contenido del documento */}
          <div className="relative p-6 space-y-6">
            {datos.contenido && Object.entries(datos.contenido).map(([titulo, contenido]) => (
              <div key={titulo} className="space-y-2">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-1">
                  {titulo}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed text-justify">
                  {contenido || 'Sin información registrada.'}
                </p>
              </div>
            ))}

            {!datos.contenido && (
              <div className="text-center py-8 text-gray-400">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Genera contenido para visualizar el documento</p>
              </div>
            )}
          </div>

          {/* Footer del documento */}
          <div className="relative border-t-2 border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Stamp className="h-4 w-4" />
                <span>Documento generado automáticamente · Dentaxy UAO Sync</span>
              </div>
              <div className="text-xs text-gray-400">
                Control institucional · Sin descarga permitida
              </div>
            </div>
          </div>
        </div>

        {/* Indicador de restricción */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className="bg-black/80 text-white text-xs px-4 py-2 rounded-full flex items-center gap-2">
            <Shield className="h-3 w-3" />
            Documento listo para expediente
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
