import { create } from 'zustand';
import { CLIQuestion } from '@/components/seed2-form/cli/useFormCLI';

export interface CLISectionInfo {
  id: string;
  nombre: string;
}

interface CliState {
  isExpedienteMode: boolean;
  currentQuestion: CLIQuestion | null;
  submitAnswer: ((answer: string | number) => void) | null;
  goBack: (() => void) | null;
  setExpedienteMode: (isActive: boolean) => void;
  setCurrentQuestion: (question: CLIQuestion | null, submitFn: (answer: string | number) => void, goBackFn?: () => void) => void;
  
  // Nuevas propiedades para visualización de secciones, progreso y saltos de sección
  secciones: CLISectionInfo[];
  seccionActivaId: string;
  currentStep: number;
  totalSteps: number;
  setSecciones: (secciones: CLISectionInfo[]) => void;
  setSeccionActiva: (seccionId: string) => void;
  setProgreso: (currentStep: number, totalSteps: number) => void;
  
  onCambiarSeccion: ((seccionId: string) => void) | null;
  setOnCambiarSeccion: (fn: (seccionId: string) => void) => void;
}

export const useCliStore = create<CliState>((set) => ({
  isExpedienteMode: false,
  currentQuestion: null,
  submitAnswer: null,
  goBack: null,
  setExpedienteMode: (isActive) => set({ isExpedienteMode: isActive }),
  setCurrentQuestion: (question, submitFn, goBackFn) => set({ currentQuestion: question, submitAnswer: submitFn, goBack: goBackFn || null }),
  
  secciones: [],
  seccionActivaId: '',
  currentStep: 0,
  totalSteps: 0,
  setSecciones: (secciones) => set({ secciones }),
  setSeccionActiva: (seccionId) => set({ seccionActivaId: seccionId }),
  setProgreso: (currentStep, totalSteps) => set({ currentStep, totalSteps }),
  
  onCambiarSeccion: null,
  setOnCambiarSeccion: (fn) => set({ onCambiarSeccion: fn }),
}));
