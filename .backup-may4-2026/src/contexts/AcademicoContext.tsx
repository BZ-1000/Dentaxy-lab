import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ClinicaUAO, getClinicaById } from '@/data/clinicasUAO';

interface SesionUsuario {
  nombre: string;
  ubicacion: { lat: number; lng: number; city?: string };
  inicioSesion: Date;
  expiracion: Date;
}

interface AcademicoContextType {
  clinicaActual: ClinicaUAO | null;
  setClinicaActual: (clinica: ClinicaUAO | null) => void;
  sesionUsuario: SesionUsuario | null;
  setSesionUsuario: (sesion: SesionUsuario | null) => void;
  tiempoRestante: number; // en segundos
  navegarAClinica: (clinicaId: string) => void;
  salirDemo: () => void;
}

const AcademicoContext = createContext<AcademicoContextType | undefined>(undefined);

interface AcademicoProviderProps {
  children: ReactNode;
}

export const AcademicoProvider: React.FC<AcademicoProviderProps> = ({ children }) => {
  const [clinicaActual, setClinicaActual] = useState<ClinicaUAO | null>(null);
  const [sesionUsuario, setSesionUsuario] = useState<SesionUsuario | null>(null);
  const [tiempoRestante, setTiempoRestante] = useState<number>(0);

  // Cargar sesión desde useDemoSession hook (se sincroniza automáticamente)
  // La sesión se puede establecer externamente
  const initializeSesion = (nombre: string, expiresAt: Date) => {
    setSesionUsuario({
      nombre,
      ubicacion: { lat: 0, lng: 0 },
      inicioSesion: new Date(),
      expiracion: expiresAt
    });
  };

  // Actualizar tiempo restante
  useEffect(() => {
    if (!sesionUsuario) return;

    const updateTime = () => {
      const now = new Date();
      const diff = Math.max(0, Math.floor((sesionUsuario.expiracion.getTime() - now.getTime()) / 1000));
      setTiempoRestante(diff);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [sesionUsuario]);

  const navegarAClinica = (clinicaId: string) => {
    const clinica = getClinicaById(clinicaId);
    if (clinica) {
      setClinicaActual(clinica);
    }
  };

  const salirDemo = () => {
    sessionStorage.removeItem('demo_session_token');
    sessionStorage.removeItem('demo_module');
    setClinicaActual(null);
    setSesionUsuario(null);
    window.location.href = '/hub';
  };

  return (
    <AcademicoContext.Provider
      value={{
        clinicaActual,
        setClinicaActual,
        sesionUsuario,
        setSesionUsuario,
        tiempoRestante,
        navegarAClinica,
        salirDemo
      }}
    >
      {children}
    </AcademicoContext.Provider>
  );
};

export const useAcademico = (): AcademicoContextType => {
  const context = useContext(AcademicoContext);
  if (!context) {
    throw new Error('useAcademico must be used within an AcademicoProvider');
  }
  return context;
};
