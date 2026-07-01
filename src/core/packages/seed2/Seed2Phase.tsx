import React from 'react';
import { useLocation } from 'react-router-dom';
import { AnalysisModeProvider } from '@/contexts/AnalysisModeContext';
import { Seed2FormPanel } from '@/components/seed2-form/Seed2FormPanel';
import { X } from 'lucide-react';

interface Seed2PhaseProps {
    patientData?: any;
    onClose?: () => void;
    isPopup?: boolean;
    intakeData?: { name?: string; reason?: string };
}

/**
 * Fase 5: Seed 2.0
 * 
 * Un clon funcional idéntico a demo/ai pero integrado nativamente
 * dentro del entorno protegido /core.
 */
export const Seed2Phase: React.FC<Seed2PhaseProps> = ({ patientData: propsPatientData, onClose, isPopup = false, intakeData }) => {
    const location = useLocation();
    const patientData = propsPatientData || location.state?.patientData || {
        nombreCompleto: intakeData?.name || "Juan Pérez (Datos de Demo)",
        edad: "35 años",
        genero: "Masculino",
        fechaNacimiento: "15/04/1989",
        ocupacion: "Ingeniero",
        telefono: "555-123-4567",
        motivoConsulta: intakeData?.reason || "Revisión general"
    };

    return (
        <AnalysisModeProvider>
            <div className={`w-full flex flex-col overflow-hidden relative ${isPopup ? 'h-full bg-transparent' : 'h-screen bg-background'}`}>
                {/* Seed2FormPanel ocupa toda la pantalla — sin header */}
                <Seed2FormPanel patientData={patientData} isPopup={isPopup} onClose={onClose} intakeData={intakeData} />
            </div>
        </AnalysisModeProvider>
    );
};
