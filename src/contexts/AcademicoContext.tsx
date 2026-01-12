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

  // Cargar sesión desde sessionStorage
  useEffect(() => {
    const storedSession = sessionStorage.getItem('demo_user_info');
    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession);
        setSesionUsuario({
          nombre: parsed.fullName || 'Usuario Demo',
          ubicacion: parsed.location || { lat: 0, lng: 0 },
          inicioSesion: new Date(parsed.createdAt || Date.now()),
          expiracion: new Date(parsed.expiresAt || Date.now() + 3600000)
        });
      } catch (e) {
        console.error('Error parsing session:', e);
      }
    }
  }, []);

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
    sessionStorage.removeItem('demo_user_info');
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
