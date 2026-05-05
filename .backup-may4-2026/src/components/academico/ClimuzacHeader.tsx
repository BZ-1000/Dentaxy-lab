import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Clock, Copy, ClipboardPaste, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDemoSession } from '@/hooks/useDemoSession';
import { motion, AnimatePresence } from 'framer-motion';

// --- Dentaxy Extension Card Component ---
const DentaxyExtensionCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    const handleCopySuccess = () => setHasCopied(true);
    window.addEventListener('dentaxy-copy-trigger', handleCopySuccess);
    return () => window.removeEventListener('dentaxy-copy-trigger', handleCopySuccess);
  }, []);
  const [titleText, setTitleText] = useState("Dentaxy.ai");

  useEffect(() => {
    if (!isExpanded) return;
    const interval = setInterval(() => {
      setTitleText(prev => prev === "Dentaxy.ai" ? "Dentaxy.com" : "Dentaxy.ai");
    }, 3000);
    return () => clearInterval(interval);
  }, [isExpanded]);

  useEffect(() => {
    const handleOpenExtension = () => setIsExpanded(true);
    window.addEventListener('dentaxy-open-extension', handleOpenExtension);
    return () => window.removeEventListener('dentaxy-open-extension', handleOpenExtension);
  }, []);

  return (
    <div className="relative">
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center"
          >
            <button
              onClick={() => setIsExpanded(true)}
              className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform"
            >
              <img src="/dentaxy-icon.png" alt="Dentaxy Extension" className="w-8 h-8 object-contain" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            className="absolute top-full right-0 mt-2 z-[100] bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-white/50 w-64 p-4 flex flex-col gap-3 origin-top-right"
            style={{ boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex items-center gap-3">
                <img src="/dentaxy-icon.png" alt="Dentaxy" className="w-7 h-7" />
                <span className="text-sm font-bold text-gray-800 tracking-tight flex items-center gap-1">
                  {titleText}
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="w-5 h-5 rounded-full bg-[#FF5F57] hover:bg-[#ff3b30] flex items-center justify-center transition-colors shadow-sm"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1 text-center py-1">
              <span className="text-[10px] text-gray-500 font-medium">Extension</span>
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-gray-700">
                <span>Dentaxy</span>
                <span className="text-gray-400">X</span>
                <span className="text-blue-600">Smile</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.dispatchEvent(new Event('dentaxy-copy-trigger'));
                  // setExtended(false); // Do NOT close on copy as requested
                }}
                disabled={!titleText.includes("Dentaxy.com")} // Only enable if ready? actually user wants it enabled if generated
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-all duration-200
                     hover:bg-gray-50 active:bg-gray-100 border-gray-200 text-gray-700
                   `}
              ><Copy className="w-3 h-3 mr-1" />
                Copiar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasCopied) {
                    window.dispatchEvent(new Event('dentaxy-paste-trigger'));
                  }
                }}
                disabled={!hasCopied}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-all duration-200
                    ${hasCopied
                    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-md'
                    : 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed'}
                  `}
              >
                <ClipboardPaste className="w-4 h-4" />
                <span className="font-semibold text-xs">Pegar</span>
              </button>
            </div>

            {/* Clear Button */}
            <button
              onClick={() => {
                const event = new CustomEvent('dentaxy-clear-trigger');
                window.dispatchEvent(event);
                setIsExpanded(false);
              }}
              className="w-full mt-1 py-1 text-[9px] text-red-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            >
              Limpiar Smile
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ClimuzacHeader: React.FC = () => {
  const navigate = useNavigate();
  const { fullName, expiresAt, isValid } = useDemoSession();
  const [tiempoRestante, setTiempoRestante] = useState<string>('--:--');

  useEffect(() => {
    if (!expiresAt) return;

    const calcularTiempo = () => {
      const ahora = new Date();
      const expira = new Date(expiresAt);
      const diff = expira.getTime() - ahora.getTime();

      if (diff <= 0) {
        setTiempoRestante('00:00');
        return;
      }

      const minutos = Math.floor(diff / 60000);
      const segundos = Math.floor((diff % 60000) / 1000);
      setTiempoRestante(`${minutos}:${segundos.toString().padStart(2, '0')}`);
    };

    calcularTiempo();
    const interval = setInterval(calcularTiempo, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const isLowTime = tiempoRestante !== '--:--' &&
    tiempoRestante !== '00:00' &&
    parseInt(tiempoRestante.split(':')[0]) < 5;

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border/50">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        {/* Left: Back button & Brand */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/academico')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Volver</span>
          </Button>

          {/* Dentaxy Brand (Text Only) */}
          <div className="flex items-center border-l border-gray-200 dark:border-white/10 pl-4 h-6">
            <span className="text-xs font-semibold tracking-tight text-gray-900 dark:text-gray-100 uppercase">
              Dentaxy Technologies
            </span>
          </div>
        </div>

        {/* Right: Session info */}
        <div className="flex items-center gap-3">

          {/* Extension Card (To Left of Timer) */}
          <DentaxyExtensionCard />

          {/* Timer */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono ${isLowTime
            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            : 'bg-muted text-muted-foreground'
            }`}>
            <Clock className={`h-3 w-3 ${isLowTime ? 'animate-pulse' : ''}`} />
            <span className="font-medium">{tiempoRestante}</span>
          </div>

          {/* User name */}
          {fullName && (
            <span className="hidden sm:block text-xs text-muted-foreground truncate max-w-[120px]">
              {fullName}
            </span>
          )}

          {/* Integration badge */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Zap className="h-3 w-3 text-emerald-500" />
            <span className="hidden lg:inline text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              Integración
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClimuzacHeader;
