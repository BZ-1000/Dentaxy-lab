import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { DemoHeader } from '@/components/academico/DemoHeader';
import { HeroAcademico } from '@/components/academico/HeroAcademico';
import { AdminPanelSimulado } from '@/components/academico/AdminPanelSimulado';
import { ClinicasGrid } from '@/components/academico/ClinicasGrid';
import { useDemoGuard } from '@/hooks/useDemoGuard';

/**
 * Demo Académico (UAO SYNC)
 * 
 * Protegido por useDemoGuard: verifica token de sesión o libre acceso en Supabase.
 * El libre acceso se activa desde el panel admin Ecosystem → módulo 'academico'.
 */
export const AcademicoDemoContent: React.FC = () => {
  const navigate = useNavigate();
  const { isAllowed, isLoading: isGuardLoading } = useDemoGuard('academico');

  // Loading state
  if (isGuardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
          <p className="text-sm text-muted-foreground">Verificando sesión Zero-Trust...</p>
        </motion.div>
      </div>
    );
  }

  // Si no tiene acceso, useDemoGuard ya redirigió al hub — no renderizar nada
  if (!isAllowed) return null;

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
    </div>
  );
};

export const AcademicoDemo: React.FC = () => {
  return <AcademicoDemoContent />;
};

export default AcademicoDemo;
