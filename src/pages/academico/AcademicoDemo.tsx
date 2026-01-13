import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, AlertCircle } from 'lucide-react';
import { DemoHeader } from '@/components/academico/DemoHeader';
import { HeroAcademico } from '@/components/academico/HeroAcademico';
import { AdminPanelSimulado } from '@/components/academico/AdminPanelSimulado';
import { ClinicasGrid } from '@/components/academico/ClinicasGrid';
import { SesionActivaBar } from '@/components/academico/SesionActivaBar';
import { Button } from '@/components/ui/button';
import { useDemoSession } from '@/hooks/useDemoSession';

export const AcademicoDemoContent: React.FC = () => {
  const navigate = useNavigate();
  const [sesionValida, setSesionValida] = useState<boolean | null>(null);
  const { verifySession } = useDemoSession();

  useEffect(() => {
    const verificarSesion = async () => {
      const token = sessionStorage.getItem('demo_session_token');
      const module = sessionStorage.getItem('demo_module');

      if (!token) {
        setSesionValida(false);
        return;
      }

      if (module !== 'academico') {
        setSesionValida(false);
        return;
      }

      const isSessionValid = await verifySession(token);
      setSesionValida(isSessionValid);
    };

    verificarSesion();
  }, [verifySession]);

  // Loading
  if (sesionValida === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="h-10 w-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Verificando sesión Zero-Trust...</p>
        </motion.div>
      </div>
    );
  }

  // Invalid session
  if (!sesionValida) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-card border border-border rounded-3xl p-10 text-center shadow-2xl"
        >
          <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          
          <h2 className="text-2xl font-black mb-3">Acceso No Autorizado</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Para acceder al demo UAO SYNC necesitas un enlace de acceso válido 
            generado desde el panel de administración.
          </p>
          
          <div className="flex flex-col gap-4">
            <Button 
              onClick={() => navigate('/hub')} 
              className="w-full h-12 text-base font-semibold"
            >
              Volver al Hub
            </Button>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Shield className="h-3.5 w-3.5" />
              Sistema Zero-Trust activado
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Demo activo - Main view
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DemoHeader showBack={true} onBack={() => navigate('/hub')} />
      <AdminPanelSimulado />
      
      <main className="flex-1">
        <HeroAcademico />
        
        <div className="container px-4 pb-24">
          <ClinicasGrid />
        </div>
      </main>

      <SesionActivaBar />
    </div>
  );
};

export const AcademicoDemo: React.FC = () => {
  return <AcademicoDemoContent />;
};

export default AcademicoDemo;
