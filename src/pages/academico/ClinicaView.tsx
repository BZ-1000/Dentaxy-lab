import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, FileText, Send } from 'lucide-react';
import { getClinicaById } from '@/data/clinicasUAO';
import { useAcademico } from '@/contexts/AcademicoContext';
import { DemoHeader } from '@/components/academico/DemoHeader';
import { ClinicaHeader } from '@/components/academico/ClinicaHeader';
import { SesionActivaBar } from '@/components/academico/SesionActivaBar';
import { SmileSimulacion } from '@/components/academico/SmileSimulacion';
import { VistaDocumento } from '@/components/academico/VistaDocumento';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

// Secciones simplificadas para el demo
const seccionesDemo = [
  { id: 'motivo', titulo: 'Motivo de Consulta' },
  { id: 'antecedentes', titulo: 'Antecedentes Patológicos' },
  { id: 'exploracion', titulo: 'Exploración Física' },
  { id: 'diagnostico', titulo: 'Diagnóstico' },
  { id: 'tratamiento', titulo: 'Plan de Tratamiento' }
];

export const ClinicaView: React.FC = () => {
  const { clinicaId } = useParams<{ clinicaId: string }>();
  const navigate = useNavigate();
  const { setClinicaActual } = useAcademico();
  
  const [contenido, setContenido] = useState<Record<string, string>>({});
  const [generando, setGenerando] = useState<string | null>(null);
  const [datosSmile, setDatosSmile] = useState<Record<string, string>>({});
  const [mostrarDocumento, setMostrarDocumento] = useState(false);

  const clinica = clinicaId ? getClinicaById(clinicaId) : null;

  useEffect(() => {
    if (clinica) {
      setClinicaActual(clinica);
    }
  }, [clinica, setClinicaActual]);

  if (!clinica) {
    navigate('/academico');
    return null;
  }

  const handleGenerarIA = async (seccionId: string, titulo: string) => {
    setGenerando(seccionId);
    
    // Simulación de generación IA
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const textoGenerado = generarTextoDemo(titulo);
    setContenido(prev => ({ ...prev, [seccionId]: textoGenerado }));
    
    // Si es CLIMUZAC, enviar a Smile
    if (clinica.tipo === 'integracion') {
      setTimeout(() => {
        setDatosSmile(prev => ({ ...prev, [titulo]: textoGenerado }));
      }, 500);
    }
    
    setGenerando(null);
  };

  const generarTextoDemo = (titulo: string): string => {
    const textos: Record<string, string> = {
      'Motivo de Consulta': 'Paciente acude a consulta refiriendo dolor dental localizado en zona posterior inferior derecha, de intensidad moderada, con evolución de aproximadamente una semana. El dolor se exacerba con estímulos térmicos fríos y durante la masticación.',
      'Antecedentes Patológicos': 'Sin antecedentes patológicos de importancia. Niega enfermedades crónico-degenerativas, alergias conocidas a medicamentos o intervenciones quirúrgicas previas. Estado de salud general aparentemente adecuado.',
      'Exploración Física': 'A la exploración se observa caries dental profunda en órgano dentario 46, con respuesta positiva a pruebas de vitalidad pulpar. Encía marginal con ligera inflamación localizada. Sin presencia de fístulas ni movilidad dental patológica.',
      'Diagnóstico': 'Pulpitis reversible en órgano dentario 46 secundaria a caries dental profunda. CIE-10: K04.0',
      'Plan de Tratamiento': 'Se propone tratamiento restaurador mediante eliminación de tejido carioso, protección pulpar indirecta con hidróxido de calcio y restauración definitiva con resina compuesta. Control a los 7 días para evaluar respuesta pulpar.'
    };
    return textos[titulo] || 'Texto generado automáticamente por el motor neuronal de Dentaxy.';
  };

  const handleGenerarHistoria = () => {
    setMostrarDocumento(true);
  };

  const isClimuzac = clinica.tipo === 'integracion';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DemoHeader showBack onBack={() => navigate('/academico')} />
      <ClinicaHeader clinica={clinica} onBack={() => navigate('/academico')} />

      <main className="flex-1 pb-16">
        {isClimuzac ? (
          // Vista dividida para CLIMUZAC
          <div className="flex h-[calc(100vh-180px)]">
            {/* Lado izquierdo - Smile */}
            <div className="w-1/2 border-r border-border">
              <SmileSimulacion datosRecibidos={datosSmile} />
            </div>

            {/* Lado derecho - Dentaxy */}
            <div className="w-1/2 overflow-y-auto">
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-bold">Formulario IA · Dentaxy</h2>
                </div>

                {seccionesDemo.map((seccion, index) => (
                  <motion.div
                    key={seccion.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">{seccion.titulo}</label>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleGenerarIA(seccion.id, seccion.titulo)}
                        disabled={generando === seccion.id}
                        className="text-xs"
                      >
                        {generando === seccion.id ? (
                          <span className="flex items-center gap-1">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              <Sparkles className="h-3 w-3" />
                            </motion.div>
                            Generando...
                          </span>
                        ) : (
                          <>
                            <Sparkles className="h-3 w-3 mr-1" />
                            Generar IA
                          </>
                        )}
                      </Button>
                    </div>
                    <Textarea
                      value={contenido[seccion.id] || ''}
                      onChange={(e) => setContenido(prev => ({ ...prev, [seccion.id]: e.target.value }))}
                      placeholder={`Escribir ${seccion.titulo.toLowerCase()}...`}
                      className="min-h-[100px] resize-none"
                    />
                    {datosSmile[seccion.titulo] && (
                      <div className="flex items-center gap-1 text-xs text-emerald-600">
                        <Send className="h-3 w-3" />
                        <span>Enviado a Smile</span>
                      </div>
                    )}
                  </motion.div>
                ))}

                <Button
                  onClick={handleGenerarHistoria}
                  className="w-full mt-6"
                  size="lg"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generar Historia Clínica
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Vista estándar para otras clínicas
          <div className="container max-w-4xl py-6 px-4">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">Formulario Clínico · {clinica.nombreCorto}</h2>
            </div>

            <div className="space-y-6">
              {seccionesDemo.map((seccion, index) => (
                <motion.div
                  key={seccion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">{seccion.titulo}</label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleGenerarIA(seccion.id, seccion.titulo)}
                      disabled={generando === seccion.id}
                      className="text-xs"
                    >
                      {generando === seccion.id ? (
                        <span className="flex items-center gap-1">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <Sparkles className="h-3 w-3" />
                          </motion.div>
                          Generando...
                        </span>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3 mr-1" />
                          Generar IA
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea
                    value={contenido[seccion.id] || ''}
                    onChange={(e) => setContenido(prev => ({ ...prev, [seccion.id]: e.target.value }))}
                    placeholder={`Escribir ${seccion.titulo.toLowerCase()}...`}
                    className="min-h-[100px] resize-none"
                  />
                </motion.div>
              ))}

              <Button
                onClick={handleGenerarHistoria}
                className="w-full mt-6"
                size="lg"
              >
                <FileText className="h-4 w-4 mr-2" />
                Generar Historia Clínica
              </Button>
            </div>
          </div>
        )}
      </main>

      <SesionActivaBar />

      {/* Modal de documento */}
      {mostrarDocumento && (
        <div onClick={() => setMostrarDocumento(false)}>
          <VistaDocumento
            clinica={clinica}
            datos={{
              paciente: 'Paciente Demo',
              contenido: Object.fromEntries(
                seccionesDemo.map(s => [s.titulo, contenido[s.id] || ''])
              )
            }}
            visible={mostrarDocumento}
          />
        </div>
      )}
    </div>
  );
};

export default ClinicaView;
