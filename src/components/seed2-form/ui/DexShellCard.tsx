import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface DexShellCardProps {
  /** Nombre de la sección — se muestra como el título grande */
  title: string;
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onPrev?: () => void;
  canGoNext?: boolean;
  canGoPrev?: boolean;
  children: React.ReactNode;
}

/**
 * DexShellCard
 * Shell visual estilo Dex que envuelve cualquier formulario de sección.
 * Replica la estética del panel de confirmación de SeedChatConsole:
 * cabecera compacta tipo terminal + título grande + contenido + barra de navegación.
 */
export const DexShellCard: React.FC<DexShellCardProps> = ({
  title,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  canGoNext = false,
  canGoPrev = false,
  children,
}) => {
  // Nombre limpio: quitar el prefijo numérico "1. " si existe
  const cleanTitle = title.replace(/^\d+\.\s*/, '');

  return (
    <div
      className="w-full flex flex-col overflow-hidden"
      style={{
        background: 'var(--seed-card-bg, #ffffff)',
        borderRadius: '20px',
        border: '1px solid var(--seed-card-border, rgba(0,0,0,0.08))',
        boxShadow: 'var(--seed-card-shadow, 0 8px 32px -4px rgba(0,0,0,0.18)), inset 0 1px 0 var(--seed-card-border, rgba(255,255,255,0.6))',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* ── Cabecera compacta tipo terminal Dex ── */}
      <div className="flex items-center justify-between w-full px-[18px] pt-[10px] pb-[8px] border-b border-black/[0.06]">
        <div className="flex items-center gap-2.5">
          {/* Chip de paso */}
          <span className="text-[9.5px] font-bold tracking-wider uppercase text-slate-400 dark:text-zinc-500">
            Paso {currentStep + 1} de {totalSteps}
          </span>
          {/* Barra de progreso */}
          <div className="w-16 h-[3px] bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0ecf8e] rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
        <ChevronDown size={12} className="text-slate-300 dark:text-zinc-600" />
      </div>

      {/* ── Título de la sección ── */}
      <div className="px-[18px] pt-[14px] pb-[10px]">
        <h2 className="text-[19px] sm:text-[20px] font-medium text-slate-700 dark:text-zinc-200 leading-snug tracking-tight">
          {cleanTitle}
        </h2>
      </div>

      {/* ── Zona de contenido del formulario ── */}
      <div
        className="flex-1 overflow-y-auto px-[18px] pb-[10px]"
        style={{
          maxHeight: 'calc(100vh - 280px)',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        } as React.CSSProperties}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Barra inferior de navegación ── */}
      <div
        className="flex items-center justify-between px-[18px] py-[10px] border-t border-black/[0.06]"
        style={{ background: 'var(--seed-input-bg, rgba(248,248,248,0.8))' }}
      >
        {/* Botón Atrás */}
        <button
          type="button"
          onClick={onPrev}
          disabled={!canGoPrev}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 disabled:opacity-0 disabled:pointer-events-none transition-all cursor-pointer px-2 py-1"
        >
          <ArrowLeft size={13} />
          <span>Atrás</span>
        </button>

        {/* Botón Siguiente */}
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className="px-3.5 py-1.5 rounded-lg bg-[#0ecf8e] hover:bg-[#25dba0] disabled:opacity-40 disabled:pointer-events-none text-white text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-[#0ecf8e]/20"
        >
          <span>Siguiente</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};

export default DexShellCard;
