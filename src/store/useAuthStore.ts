import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DoctorProfile {
  name: string;
  email: string;
  picture: string;
  googleAccessToken?: string; // Token temporal para llamar a APIs de Google (Drive, Calendar)
}

interface AuthState {
  doctor: DoctorProfile | null;
  isAuthenticated: boolean;
  login: (doctor: DoctorProfile) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      doctor: null,
      isAuthenticated: false,
      login: (doctor) => set({ doctor, isAuthenticated: true }),
      logout: () => set({ doctor: null, isAuthenticated: false }),
      setAccessToken: (token) => set((state) => ({ 
        doctor: state.doctor ? { ...state.doctor, googleAccessToken: token } : null 
      })),
    }),
    {
      name: 'dentaxy-auth-storage', // Guardado en localStorage
    }
  )
);
