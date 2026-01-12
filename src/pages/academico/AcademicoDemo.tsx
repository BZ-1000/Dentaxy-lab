import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, AlertCircle } from 'lucide-react';
import { AcademicoProvider } from '@/contexts/AcademicoContext';
import { DemoHeader } from '@/components/academico/DemoHeader';
import { AdminPanelSimulado } from '@/components/academico/AdminPanelSimulado';
import { ClinicasGrid } from '@/components/academico/ClinicasGrid';
import { SesionActivaBar } from '@/components/academico/SesionActivaBar';
import { Button } from '@/components/ui/button';

const AcademicoDemoContent: React.FC = () => {
  const navigate = useNavigate();
  const [sesionValida, setSesionValida] = useState<boolean | null>(null);

  useEffect(() => {
    // Verificar sesión Zero-Trust
    const verificarSesion = () => {
      const token = sessionStorage.getItem('demo_session_token');
      const userInfo = sessionStorage.getItem('demo_user_info');

      if (!token || !userInfo) {
        setSesionValida(false);
        return;
      }

      try {
        const parsed = JSON.parse(userInfo);
        const expiracion = new Date(parsed.expiresAt);
        
        if (expiracion < new Date()) {
          setSesionValida(false);
          return;
        }

        // Verificar que el módulo sea académico
        if (parsed.module !== 'academico') {
          setSesionValida(false);
          return;
        }

        setSesionValida(true);
      } catch (e) {
        setSesionValida(false);
      }
    };

    verificarSesion();
  }, []);

  // Loading
  if (sesionValida === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Verificando sesión...</p>
        </motion.div>
      </div>
    );
  }

  // Sesión inválida
  if (!sesionValida) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          
          <h2 className="text-xl font-bold mb-2">Acceso No Autorizado</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Para acceder al demo UAO Sync necesitas un enlace de acceso válido 
            generado desde el panel de administración.
          </p>
          
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate('/hub')} className="w-full">
              Volver al Hub
            </Button>
            <p className="text-xs text-muted-foreground">
              <Shield className="inline h-3 w-3 mr-1" />
              Sistema Zero-Trust activado
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Demo activo
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DemoHeader />
      <AdminPanelSimulado />
      
      <main className="flex-1 container py-8 px-4 pb-20">
        <ClinicasGrid />
      </main>

      <SesionActivaBar />
    </div>
  );
};

export const AcademicoDemo: React.FC = () => {
  return (
    <AcademicoProvider>
      <AcademicoDemoContent />
    </AcademicoProvider>
  );
};

export default AcademicoDemo;
