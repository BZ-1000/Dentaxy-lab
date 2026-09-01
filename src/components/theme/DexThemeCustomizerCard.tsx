import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Palette,
  Sun,
  Moon,
  RotateCcw,
  Sparkles,
  Sliders,
  Grid,
  Check,
  Eye,
} from "lucide-react";
import { useDexThemeStore, BackgroundStyle } from "@/store/useDexThemeStore";
import { cn } from "@/lib/utils";

interface DexThemeCustomizerCardProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACCENT_PRESETS = [
  { name: "Verde Neón",       hex: "#00f5a0", glow: "rgba(0, 245, 160, 0.85)" },
  { name: "Púrpura Místico",  hex: "#c084fc", glow: "rgba(192, 132, 252, 0.85)" },
  { name: "Cian Galáctico",   hex: "#00d2ff", glow: "rgba(0, 210, 255, 0.85)" },
  { name: "Fucsia Eléctrico", hex: "#ff007f", glow: "rgba(255, 0, 127, 0.85)" },
  { name: "Ámbar Eléctrico",  hex: "#ffaa00", glow: "rgba(255, 170, 0, 0.85)" },
  { name: "Blanco Puro",      hex: "#ffffff", glow: "rgba(255, 255, 255, 0.8)" },
  { name: "Negro Obsidiana",  hex: "#27272a", glow: "rgba(39, 39, 42, 0.9)" },
];

const INPUT_BG_PRESETS = [
  { name: "Negro Puro",    hex: "#000000" },
  { name: "Gris Cristal",  hex: "#18181b" },
  { name: "Blanco Nieve",  hex: "#ffffff" },
];

const BG_STYLE_OPTIONS: { id: BackgroundStyle; label: string; desc: string }[] = [
  { id: "dots-light",     label: "Blanco con Puntos",    desc: "Fondo blanco pulcro con cuadrícula" },
  { id: "dots-dark",      label: "Oscuro con Puntos",    desc: "Fondo oscuro con matriz de puntos" },
  { id: "gradient-dark",  label: "Degradado Galáctico",  desc: "Suave degradado oscuro espacial" },
  { id: "solid-dark",     label: "Sólido Oscuro",        desc: "Fondo negro minimalista profundo" },
];

export const DexThemeCustomizerCard: React.FC<DexThemeCustomizerCardProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    inputAccentColor,
    glowIntensity,
    glowRadius,
    bgStyle,
    isDarkMode,
    inputBgColor,
    setAccentColor,
    setGlowIntensity,
    setGlowRadius,
    setBgStyle,
    toggleDarkMode,
    setInputBgColor,
    resetToBaseTheme,
  } = useDexThemeStore();

  return (
    <AnimatePresence>
      {isOpen && (
        /* Contenedor flotante — idéntico al del drawer hamburguesa pero desde la derecha */
        <div className="fixed inset-x-0 top-16 sm:top-20 bottom-0 z-[90000] flex justify-end pointer-events-none">

          {/* Backdrop 100% transparente para cerrar sin desenfoque ni velo (igual que hamburguesa) */}
          <div
            className="absolute inset-0 bg-transparent pointer-events-auto"
            onClick={onClose}
          />

          {/* Panel flotante redondeado — mismo estilo exacto que el drawer hamburguesa */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-84 sm:w-96 bg-[#f1f3f5] h-[calc(100vh-5.5rem)] max-h-[calc(100vh-5.5rem)] shadow-2xl border border-slate-300/80 rounded-[28px] p-5 sm:p-6 flex flex-col justify-between overflow-y-auto z-20 font-sans my-3 mr-3 sm:mr-5 pointer-events-auto"
          >
            {/* ── ENCABEZADO ── */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  {/* Orbe de color activo — igual a las miniaturas del drawer */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-slate-200/80 shrink-0"
                    style={{
                      backgroundColor: inputAccentColor,
                      boxShadow: `0 0 18px ${inputAccentColor}60`,
                    }}
                  >
                    <Palette className="w-5 h-5 text-slate-950" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                      Personalización de Tema
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                      Consola DEX · Halo de Luz · Fondo
                    </p>
                  </div>
                </div>

                {/* Botón cerrar — idéntico al del drawer */}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* ── SECCIONES DE CONFIGURACIÓN ── */}
              <div className="space-y-4">

                {/* 1. COLOR DE ACENTO DEL INPUT */}
                <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      Acento del Input
                    </label>
                    <span
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700"
                    >
                      {inputAccentColor}
                    </span>
                  </div>

                  {/* Chips de colores preset */}
                  <div className="grid grid-cols-4 gap-2">
                    {ACCENT_PRESETS.map((preset) => {
                      const isSelected = inputAccentColor.toLowerCase() === preset.hex.toLowerCase();
                      return (
                        <button
                          key={preset.name}
                          onClick={() => setAccentColor(preset.hex, preset.glow)}
                          className={cn(
                            "h-10 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer",
                            isSelected
                              ? "border-slate-900 scale-105 shadow-md"
                              : "border-slate-200 hover:border-slate-400"
                          )}
                          style={{
                            backgroundColor: preset.hex,
                            boxShadow: isSelected ? `0 0 14px ${preset.glow}` : undefined,
                          }}
                          title={preset.name}
                        >
                          {isSelected && (
                            <Check
                              className={cn(
                                "w-4 h-4 stroke-[3]",
                                preset.hex === "#ffffff" || preset.hex === "#ffaa00"
                                  ? "text-slate-950"
                                  : "text-white"
                              )}
                            />
                          )}
                        </button>
                      );
                    })}

                    {/* Picker libre HTML5 */}
                    <div className="relative h-10 rounded-xl border-2 border-slate-200 hover:border-slate-400 overflow-hidden flex items-center justify-center bg-gradient-to-br from-pink-200 via-yellow-200 to-cyan-200 transition-all cursor-pointer">
                      <input
                        type="color"
                        value={inputAccentColor}
                        onChange={(e) => {
                          const hex = e.target.value;
                          const r = parseInt(hex.slice(1, 3), 16);
                          const g = parseInt(hex.slice(3, 5), 16);
                          const b = parseInt(hex.slice(5, 7), 16);
                          setAccentColor(hex, `rgba(${r}, ${g}, ${b}, 0.85)`);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Palette className="w-4 h-4 text-slate-700 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* 2. CONTROLES DEL HALO DE LUZ */}
                <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-xs">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-cyan-500" />
                    Halo de Luz
                  </label>

                  {/* Slider Intensidad */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>Intensidad</span>
                      <span className="text-cyan-600 font-bold">{glowIntensity}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={glowIntensity}
                      onChange={(e) => setGlowIntensity(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer h-2 rounded-lg"
                    />
                  </div>

                  {/* Slider Radio */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>Tamaño del Resplandor</span>
                      <span className="text-purple-600 font-bold">{glowRadius}px</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="120"
                      value={glowRadius}
                      onChange={(e) => setGlowRadius(Number(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer h-2 rounded-lg"
                    />
                  </div>
                </div>

                {/* 3. ESTILO DE FONDO */}
                <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-xs">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Grid className="w-3.5 h-3.5 text-emerald-500" />
                    Fondo Principal
                  </label>

                  <div className="space-y-2">
                    {BG_STYLE_OPTIONS.map((opt) => {
                      const isSelected = bgStyle === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setBgStyle(opt.id);
                            if (opt.id === "dots-light" && isDarkMode) toggleDarkMode(false);
                            else if (opt.id === "dots-dark" && !isDarkMode) toggleDarkMode(true);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between gap-3 p-2.5 rounded-2xl border transition-all cursor-pointer text-left",
                            isSelected
                              ? "bg-slate-900 border-slate-900 text-white shadow-md"
                              : "bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                          )}
                        >
                          <div>
                            <div className="text-xs font-bold leading-tight">{opt.label}</div>
                            <div className={cn("text-[10px] mt-0.5", isSelected ? "text-slate-400" : "text-slate-500")}>
                              {opt.desc}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. FONDO DEL INPUT CENTRAL */}
                <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-xs">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-amber-500" />
                    Fondo de Consola DEX
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {INPUT_BG_PRESETS.map((preset) => {
                      const isSelected = inputBgColor.toLowerCase() === preset.hex.toLowerCase();
                      return (
                        <button
                          key={preset.name}
                          onClick={() => setInputBgColor(preset.hex)}
                          className={cn(
                            "py-2.5 px-2 rounded-xl border-2 text-[10px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer shadow-xs",
                            isSelected ? "border-slate-900 scale-105 shadow-md" : "border-slate-200 hover:border-slate-400"
                          )}
                          style={{
                            backgroundColor: preset.hex,
                            color: preset.hex === "#ffffff" ? "#09090b" : "#ffffff",
                          }}
                        >
                          <span className="text-center leading-tight">{preset.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. MODO CLARO / OSCURO */}
                <button
                  onClick={() => toggleDarkMode()}
                  className="w-full py-3 px-4 rounded-full bg-white border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  {isDarkMode ? (
                    <>
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span>Cambiar a Modo Claro</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-indigo-500" />
                      <span>Cambiar a Modo Oscuro</span>
                    </>
                  )}
                </button>

              </div>
            </div>

            {/* ── FOOTER: RESTABLECER TEMA BASE ── */}
            <div className="pt-4 border-t border-slate-200/80 mt-4">
              <button
                onClick={resetToBaseTheme}
                className="w-full py-3 px-4 rounded-full bg-slate-900 hover:bg-rose-900 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restablecer Tema Base Dentaxy</span>
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
