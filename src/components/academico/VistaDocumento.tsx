import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Printer, CheckCircle, FileText, Shield, Calendar, User, MapPin, Stamp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClinicaUAO } from '@/data/clinicasUAO';

interface VistaDocumentoProps {
  clinica: ClinicaUAO;
  datos: {
    paciente?: string;
    fecha?: string;
    contenido?: Record<string, string>;
  };
  visible: boolean;
  onClose?: () => void;
}

export const VistaDocumento: React.FC<VistaDocumentoProps> = ({ 
  clinica, 
  datos,
  visible,
  onClose 
}) => {
  if (!visible) return null;

  const fechaActual = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose?.();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <h2 className="text-lg font-bold text-gray-900">Historia Clínica Generada</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full text-gray-600">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-gray-600">
                <Printer className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full text-gray-600">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Document Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)] bg-white">
            {/* Marca de agua */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
              <span className="text-8xl font-bold text-gray-900 rotate-[-30deg]">
                DENTAXY UAO
              </span>
            </div>

            {/* Document Header */}
            <div className="relative border-b-2 border-gray-200 p-8">
              <div className="flex items-center justify-center gap-6 mb-6">
                <img src="/logos/uao-uaz-logo.svg" alt="UAO UAZ" className="h-16 object-contain" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  HISTORIA CLÍNICA ODONTOLÓGICA
                </h1>
                <p className="text-sm text-gray-600">
                  {clinica.nombre} — {clinica.subtitulo}
                </p>
                <p className="text-xs text-gray-500 mt-2">{fechaActual}</p>
              </div>
            </div>

            {/* Metadatos */}
            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-[10px] text-gray-500 uppercase">Paciente</div>
                  <div className="text-sm font-medium text-gray-900">{datos.paciente || 'Paciente Demo'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-[10px] text-gray-500 uppercase">Fecha</div>
                  <div className="text-sm font-medium text-gray-900">{fechaActual}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-[10px] text-gray-500 uppercase">Clínica</div>
                  <div className="text-sm font-medium text-gray-900">{clinica.nombreCorto}</div>
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
            <div className="relative p-8 space-y-6">
              {datos.contenido && Object.entries(datos.contenido).map(([titulo, contenido]) => (
                contenido && (
                  <div key={titulo} className="space-y-2">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-1">
                      {titulo}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed text-justify">
                      {contenido}
                    </p>
                  </div>
                )
              ))}

              {(!datos.contenido || Object.values(datos.contenido).every(v => !v)) && (
                <div className="text-center py-8 text-gray-400">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Genera contenido para visualizar el documento</p>
                </div>
              )}
            </div>

            {/* Firmas */}
            <div className="px-8 pb-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="h-px bg-gray-400 w-48 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Firma del Alumno</p>
                </div>
                <div className="text-center">
                  <div className="h-px bg-gray-400 w-48 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Firma del Profesor</p>
                </div>
              </div>
            </div>

            {/* Footer del documento */}
            <div className="relative border-t-2 border-gray-200 p-6 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Stamp className="h-4 w-4" />
                  <span>Documento generado automáticamente · Dentaxy UAO Sync</span>
                </div>
                <div className="text-xs text-gray-400">
                  {clinica.ubicacion}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <Button onClick={handleClose} className="w-full bg-gray-900 hover:bg-gray-800 text-white">
              Cerrar Vista Previa
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
