import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, FileText, ArrowLeft } from 'lucide-react';
import { getClinicaById, ClinicaUAO } from '@/data/clinicasUAO';
import { VistaDocumento } from '@/components/academico/VistaDocumento';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useDemoSession } from '@/hooks/useDemoSession';
import { ClimuzacView } from '@/pages/academico/ClimuzacView';
const seccionesDemo = [
  { id: 'motivo', titulo: 'Motivo de Consulta', placeholder: 'El paciente refiere...' },
  { id: 'antecedentes', titulo: 'Antecedentes', placeholder: 'Antecedentes relevantes...' },
  { id: 'exploracion', titulo: 'Exploración Física', placeholder: 'A la exploración se observa...' },
  { id: 'diagnostico', titulo: 'Diagnóstico', placeholder: 'Se establece diagnóstico de...' },
  { id: 'tratamiento', titulo: 'Plan de Tratamiento', placeholder: 'Se propone...' },
];

export const ClinicaView: React.FC = () => {
  const { clinicaId } = useParams<{ clinicaId: string }>();
  const navigate = useNavigate();
  const { verifySession } = useDemoSession();

  const [clinica, setClinica] = useState<ClinicaUAO | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generandoIA, setGenerandoIA] = useState<string | null>(null);
  const [mostrarDocumento, setMostrarDocumento] = useState(false);
  const [sesionValida, setSesionValida] = useState<boolean | null>(null);

  useEffect(() => {
    // Verify session
    const verificar = async () => {
      const token = sessionStorage.getItem('demo_session_token');
      const module = sessionStorage.getItem('demo_module');

      if (!token || module !== 'academico') {
        setSesionValida(false);
        return;
      }

      const valid = await verifySession(token);
      setSesionValida(valid);
    };
    verificar();
  }, [verifySession]);

  useEffect(() => {
    if (clinicaId) {
      const clinicaData = getClinicaById(clinicaId);
      if (clinicaData) {
        setClinica(clinicaData);
      }
    }
  }, [clinicaId]);

  const handleGenerarIA = async (seccionId: string) => {
    setGenerandoIA(seccionId);

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500));

    const respuestasDemo: Record<string, string> = {
      motivo: 'Paciente masculino de 24 años que acude a consulta por presentar dolor dental en región posterior mandibular izquierda de 3 días de evolución, exacerbado con alimentos fríos y dulces.',
      antecedentes: 'Sin antecedentes patológicos de importancia. Niega alergias conocidas. Última visita dental hace aproximadamente 2 años.',
      exploracion: 'A la exploración intraoral se observa lesión cariosa clase II en órgano dentario 36 con exposición dentinaria. Percusión vertical positiva. Vitalidad pulpar presente.',
      diagnostico: 'Caries dental profunda en OD 36. Pulpitis reversible.',
      tratamiento: 'Se propone tratamiento restaurador con resina compuesta previa anestesia local. Se indica control en 2 semanas para evaluación.',
    };

    const textoGenerado = respuestasDemo[seccionId] || '';
    setFormData(prev => ({ ...prev, [seccionId]: textoGenerado }));
    setGenerandoIA(null);
  };

  const handleGenerarHistoria = () => {
    setMostrarDocumento(true);
  };

  // Loading state
  if (sesionValida === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Cargando nodo clínico...</p>
        </div>
      </div>
    );
  }

  // Invalid session
  if (!sesionValida) {
    navigate('/academico');
    return null;
  }

  // Clinic not found
  if (!clinica) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Clínica no encontrada</h2>
          <Button onClick={() => navigate('/academico')}>Volver</Button>
        </div>
      </div>
    );
  }

  // CLIMUZAC - Use specialized view for integration type
  if (clinica.tipo === 'integracion') {
    return <ClimuzacView />;
  }

  // Other clinics - Standard view
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/academico')}
              className="rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <img
                src="/lovable-uploads/3236de6d-a3e4-4b81-9c83-b32690d4212d.png"
                alt="Dentaxy"
                className="h-6 w-6"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold leading-none">DENTAXY</span>
                {clinica.nombre !== 'DENTAXY' && (
                  <span className="text-[10px] text-muted-foreground">{clinica.nombre}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container px-4 py-8 pb-24">
        <div className="max-w-3xl mx-auto">
          {/* Clinic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-card to-muted/30 border border-border/50"
          >
            <p className="text-muted-foreground italic">"{clinica.narrativa}"</p>
          </motion.div>

          {/* Form */}
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
                  <label className="text-sm font-semibold">{seccion.titulo}</label>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleGenerarIA(seccion.id)}
                    disabled={generandoIA === seccion.id}
                    className="text-primary hover:text-primary/80"
                  >
                    {generandoIA === seccion.id ? (
                      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                        Generar IA
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  value={formData[seccion.id] || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, [seccion.id]: e.target.value }))}
                  placeholder={seccion.placeholder}
                  className="min-h-[120px]"
                />
              </motion.div>
            ))}

            <Button
              onClick={handleGenerarHistoria}
              className="w-full h-12 mt-8"
            >
              <FileText className="h-4 w-4 mr-2" />
              Generar Historia Clínica
            </Button>
          </div>
        </div>
      </main>

      {mostrarDocumento && (
        <VistaDocumento
          clinica={clinica}
          datos={{
            paciente: 'Paciente Demo',
            contenido: {
              'Motivo de Consulta': formData.motivo || '',
              'Antecedentes': formData.antecedentes || '',
              'Exploración Física': formData.exploracion || '',
              'Diagnóstico': formData.diagnostico || '',
              'Plan de Tratamiento': formData.tratamiento || '',
            }
          }}
          visible={mostrarDocumento}
          onClose={() => setMostrarDocumento(false)}
        />
      )}
    </div>
  );
};

export default ClinicaView;
