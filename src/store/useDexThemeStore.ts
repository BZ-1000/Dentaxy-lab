import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BackgroundStyle = "dots-light" | "dots-dark" | "gradient-light" | "gradient-dark" | "solid-dark" | "solid-light";

export interface DexThemeState {
  // Input Colors & Glow Controls
  inputAccentColor: string;
  inputGlowColor: string;
  glowIntensity: number; // 0 - 100
  glowRadius: number; // 10 - 120 (px)
  
  // Background & Theme Mode
  bgStyle: BackgroundStyle;
  isDarkMode: boolean;
  
  // Text & Caret
  inputBgColor: string;
  inputBorderColor: string;
  caretColor: string;
  textColor: string;
  placeholderColor: string;

  // Actions
  setAccentColor: (accentHex: string, glowRgb: string) => void;
  setGlowIntensity: (intensity: number) => void;
  setGlowRadius: (radius: number) => void;
  setBgStyle: (style: BackgroundStyle) => void;
  toggleDarkMode: (isDark?: boolean) => void;
  setInputBgColor: (bgColor: string) => void;
  setCustomTheme: (partial: Partial<DexThemeState>) => void;
  resetToBaseTheme: () => void;
}

// Configuración Base Dentaxy por Defecto
const BASE_THEME = {
  inputAccentColor: "#c084fc",
  inputGlowColor: "rgba(192, 132, 252, 0.7)",
  glowIntensity: 65,
  glowRadius: 55,
  bgStyle: "dots-light" as BackgroundStyle,
  isDarkMode: false,
  inputBgColor: "#000000",
  inputBorderColor: "rgba(255, 255, 255, 0.2)",
  caretColor: "#c084fc",
  textColor: "#ffffff",
  placeholderColor: "rgba(255, 255, 255, 0.65)",
};

export const useDexThemeStore = create<DexThemeState>()(
  persist(
    (set) => ({
      ...BASE_THEME,

      setAccentColor: (accentHex, glowRgb) =>
        set({
          inputAccentColor: accentHex,
          inputGlowColor: glowRgb,
          caretColor: accentHex,
        }),

      setGlowIntensity: (intensity) => set({ glowIntensity: intensity }),

      setGlowRadius: (radius) => set({ glowRadius: radius }),

      setBgStyle: (style) => set({ bgStyle: style }),

      toggleDarkMode: (override) =>
        set((state) => {
          const nextDark = override !== undefined ? override : !state.isDarkMode;
          const nextBgStyle: BackgroundStyle = nextDark
            ? state.bgStyle.includes("dots")
              ? "dots-dark"
              : "solid-dark"
            : state.bgStyle.includes("dots")
            ? "dots-light"
            : "solid-light";

          return {
            isDarkMode: nextDark,
            bgStyle: nextBgStyle,
          };
        }),

      setInputBgColor: (bgColor) =>
        set((state) => {
          // Adaptar contraste del texto según si el fondo del input es muy claro u oscuro
          const isLightBg = bgColor === "#ffffff" || bgColor === "#f4f4f5" || bgColor === "#e4e4e7";
          return {
            inputBgColor: bgColor,
            textColor: isLightBg ? "#09090b" : "#ffffff",
            placeholderColor: isLightBg ? "rgba(9, 9, 11, 0.55)" : "rgba(255, 255, 255, 0.65)",
            inputBorderColor: isLightBg ? "rgba(9, 9, 11, 0.2)" : "rgba(255, 255, 255, 0.2)",
          };
        }),

      setCustomTheme: (partial) => set((state) => ({ ...state, ...partial })),

      resetToBaseTheme: () => set({ ...BASE_THEME }),
    }),
    {
      name: "dentaxy-dex-theme-storage",
    }
  )
);
