import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnalysisModeProvider } from '@/contexts/AnalysisModeContext';
import { ClimuzacHeader } from '@/components/academico/ClimuzacHeader';
import { DentaxyFormPanel } from '@/components/academico/DentaxyFormPanel';
import { SmileEspejoPanel, seccionesSmile } from '@/components/academico/SmileEspejoPanel';
import { useDemoSession } from '@/hooks/useDemoSession';
import { Loader2 } from 'lucide-react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';

export const ClimuzacView: React.FC = () => {
  const navigate = useNavigate();
  const { verifySession } = useDemoSession();

  const [sesionValida, setSesionValida] = useState<boolean | null>(null);
  const [smileData, setSmileData] = useState<Record<string, string>>({});
  const [smileFormData, setSmileFormData] = useState<any>(null); // New state for structured data
  const [seccionActual, setSeccionActual] = useState<string | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const verificar = async () => {
      const token = sessionStorage.getItem('demo_session_token');

      // Check existence
      if (!token) {
        setSesionValida(false);
        return;
      }

      setSesionValida(true);
    };
    verificar();
  }, []);

  const handleSeccionGenerada = (seccionId: string, contenido: string) => {
    setSmileData(prev => ({ ...prev, [seccionId]: contenido }));
    setSeccionActual(undefined);
  };

  const handleGeneracionIniciada = (seccionId: string) => {
    setSeccionActual(seccionId);
  };

  const handleGeneracionCompleta = (datos: Record<string, string>, formData?: any) => {
    // Merge data if empty is passed (workaround for DentaxyFormPanel)
    if (Object.keys(datos).length > 0) {
      setSmileData(datos);
    }
    if (formData) {
      setSmileFormData(formData);
    }
    setSeccionActual(undefined);
  };

  const handleGeneratingChange = (generating: boolean) => {
    setIsGenerating(generating);
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

        {/* Resizable Split View */}
        <ResizablePanelGroup
          direction="horizontal"
          className="flex-1 overflow-hidden"
        >
          {/* Left Panel: Dentaxy IA Form */}
          <ResizablePanel
            defaultSize={50}
            minSize={30}
            maxSize={70}
            className="overflow-hidden"
          >
            <DentaxyFormPanel
              onGeneracionCompleta={handleGeneracionCompleta}
              onSeccionGenerada={handleSeccionGenerada}
              onGeneracionIniciada={handleGeneracionIniciada}
              onGeneratingChange={handleGeneratingChange}
            />
          </ResizablePanel>

          {/* Minimalist Resize Handle */}
          <ResizableHandle
            withHandle
            className="w-1 bg-border/50 hover:bg-emerald-500/50 transition-colors duration-200 data-[resize-handle-active]:bg-emerald-500"
          />

          {/* Right Panel: Smile Mirror */}
          <ResizablePanel
            defaultSize={50}
            minSize={30}
            maxSize={70}
            className="overflow-hidden"
          >
            <SmileEspejoPanel
              contenidoRecibido={smileData}
              formData={smileFormData}
              seccionActual={seccionActual}
              todasCompletas={todasCompletas}
              isGenerating={isGenerating}
              copiedContent={smileData}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </AnalysisModeProvider>
  );
};

export default ClimuzacView;
