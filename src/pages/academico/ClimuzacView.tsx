import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnalysisModeProvider } from '@/contexts/AnalysisModeContext';
import { ClimuzacHeader } from '@/components/academico/ClimuzacHeader';
import { DentaxyFormPanel } from '@/components/academico/DentaxyFormPanel';
import { SmileEspejoPanel, seccionesSmile } from '@/components/academico/SmileEspejoPanel';
import { useDemoSession } from '@/hooks/useDemoSession';
import { Loader2 } from 'lucide-react';

export const ClimuzacView: React.FC = () => {
  const navigate = useNavigate();
  const { verifySession } = useDemoSession();
  
  const [sesionValida, setSesionValida] = useState<boolean | null>(null);
  const [smileData, setSmileData] = useState<Record<string, string>>({});
  const [seccionActual, setSeccionActual] = useState<string | undefined>(undefined);

  useEffect(() => {
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

  const handleSeccionGenerada = (seccionId: string, contenido: string) => {
    setSmileData(prev => ({ ...prev, [seccionId]: contenido }));
    setSeccionActual(undefined);
  };

  const handleGeneracionIniciada = (seccionId: string) => {
    setSeccionActual(seccionId);
  };

  const handleGeneracionCompleta = (datos: Record<string, string>) => {
    setSmileData(datos);
    setSeccionActual(undefined);
  };

  // Check if all sections are complete
  const todasCompletas = seccionesSmile.every(
    (s) => smileData[s.id]?.trim()
  );

  // Loading state
  if (sesionValida === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
          <p className="text-sm text-muted-foreground">Iniciando CLIMUZAC...</p>
        </div>
      </div>
    );
  }

  // Invalid session
  if (!sesionValida) {
    navigate('/academico');
    return null;
  }

  return (
    <AnalysisModeProvider>
      <div className="min-h-screen h-screen flex flex-col bg-background overflow-hidden">
        {/* Header */}
        <ClimuzacHeader />

        {/* Split View - Two panels */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
          {/* Left Panel: Dentaxy IA Form */}
          <div className="border-r border-border overflow-hidden order-2 lg:order-1">
            <DentaxyFormPanel
              onGeneracionCompleta={handleGeneracionCompleta}
              onSeccionGenerada={handleSeccionGenerada}
              onGeneracionIniciada={handleGeneracionIniciada}
            />
          </div>

          {/* Right Panel: Smile Mirror */}
          <div className="overflow-hidden order-1 lg:order-2">
            <SmileEspejoPanel
              contenidoRecibido={smileData}
              seccionActual={seccionActual}
              todasCompletas={todasCompletas}
            />
          </div>
        </div>
      </div>
    </AnalysisModeProvider>
  );
};

export default ClimuzacView;
