import { create } from 'zustand';
import { CLIQuestion } from '@/components/seed2-form/cli/useFormCLI';

interface CliState {
  isExpedienteMode: boolean;
  currentQuestion: CLIQuestion | null;
  submitAnswer: ((answer: string | number) => void) | null;
  setExpedienteMode: (isActive: boolean) => void;
  setCurrentQuestion: (question: CLIQuestion | null, submitFn: (answer: string | number) => void) => void;
}

export const useCliStore = create<CliState>((set) => ({
  isExpedienteMode: false,
  currentQuestion: null,
  submitAnswer: null,
  setExpedienteMode: (isActive) => set({ isExpedienteMode: isActive }),
  setCurrentQuestion: (question, submitFn) => set({ currentQuestion: question, submitAnswer: submitFn }),
}));
