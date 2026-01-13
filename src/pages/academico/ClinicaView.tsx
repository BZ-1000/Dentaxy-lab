import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, FileText, ArrowLeft, Zap, Send } from 'lucide-react';
import { getClinicaById, ClinicaUAO } from '@/data/clinicasUAO';
import { SmileSimulacion } from '@/components/academico/SmileSimulacion';
import { VistaDocumento } from '@/components/academico/VistaDocumento';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SesionActivaBar } from '@/components/academico/SesionActivaBar';
import { useDemoSession } from '@/hooks/useDemoSession';

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
  const { verifySession, isValid } = useDemoSession();
  
  const [clinica, setClinica] = useState<ClinicaUAO | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generandoIA, setGenerandoIA] = useState<string | null>(null);
  const [mostrarDocumento, setMostrarDocumento] = useState(false);
  const [datosSmile, setDatosSmile] = useState<Record<string, string>>({});
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
    
    // If CLIMUZAC, send to Smile
    if (clinica?.tipo === 'integracion') {
      const seccion = seccionesDemo.find(s => s.id === seccionId);
      if (seccion) {
        setTimeout(() => {
          setDatosSmile(prev => ({ ...prev, [seccion.titulo]: textoGenerado }));
        }, 500);
      }
    }
    
    setGenerandoIA(null);
  };

  const handleGenerarHistoria = () => {
    // Map form data to Smile sections
    const mappedData: Record<string, string> = {
      'Motivo de Consulta': formData.motivo || '',
      'Antecedentes Patológicos': formData.antecedentes || '',
      'Exploración Física': formData.exploracion || '',
      'Diagnóstico': formData.diagnostico || '',
      'Plan de Tratamiento': formData.tratamiento || '',
      'Observaciones': 'Historia clínica generada con asistencia de Dentaxy IA.',
    };
    
    setDatosSmile(mappedData);
    setMostrarDocumento(true);
  };

  // Loading or invalid session states
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

  if (!sesionValida) {
    navigate('/academico');
    return null;
  }

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

  // CLIMUZAC - Split view integration
  if (clinica.tipo === 'integracion') {
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
              <div>
                <h1 className="text-lg font-black">{clinica.nombre}</h1>
                <p className="text-xs text-muted-foreground">{clinica.subtitulo}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <Zap className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-xs font-medium text-emerald-600">Integración Activa</span>
            </div>
          </div>
        </header>

        {/* Split Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-64px-56px)]">
          {/* Left: Smile System (Legacy) */}
          <div className="border-r border-border overflow-hidden">
            <SmileSimulacion datosRecibidos={datosSmile} />
          </div>

          {/* Right: Dentaxy IA */}
          <div className="flex flex-col bg-gradient-to-br from-background to-emerald-500/5 overflow-hidden">
            {/* Dentaxy Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-white" />
                  <div>
                    <h2 className="text-lg font-black text-white">DENTAXY IA</h2>
                    <p className="text-xs text-white/80">Motor de Redacción Clínica</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Sections */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {seccionesDemo.map((seccion, index) => (
                <motion.div
                  key={seccion.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-foreground">
                      {seccion.titulo}
                    </label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleGenerarIA(seccion.id)}
                      disabled={generandoIA === seccion.id}
                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                    >
                      {generandoIA === seccion.id ? (
                        <div className="h-4 w-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                          Generar con IA
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea
                    value={formData[seccion.id] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [seccion.id]: e.target.value }))}
                    placeholder={seccion.placeholder}
                    className="min-h-[100px] resize-none border-border/50 focus:border-emerald-500/50"
                  />
                  {datosSmile[seccion.titulo] && (
                    <div className="flex items-center gap-1 text-xs text-emerald-600">
                      <Send className="h-3 w-3" />
                      <span>Enviado a Smile</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Action Footer */}
            <div className="p-6 border-t border-border/50 bg-background/50 flex-shrink-0">
              <Button
                onClick={handleGenerarHistoria}
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold"
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar a Sistema Smile
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-3">
                Los datos se transferirán automáticamente al sistema institucional
              </p>
            </div>
          </div>
        </div>

        <SesionActivaBar />

        {/* Document Modal */}
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
            <div>
              <h1 className="text-lg font-black">{clinica.nombre}</h1>
              <p className="text-xs text-muted-foreground">{clinica.subtitulo}</p>
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

      <SesionActivaBar />

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
