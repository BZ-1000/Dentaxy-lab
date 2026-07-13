/**
 * VaultLock.tsx — Dentaxy Technologies
 * ─────────────────────────────────────────────────────────────────────────────
 * Pantalla de bloqueo global de ultra-alta tecnología (The Vault Lock HUD Gate).
 * Edición especial: Ecosistema cerrado por desarrollo activo de Dentaxy.
 * Muestra cuenta regresiva dinámica hacia la fecha de lanzamiento (08/08/2026).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import InteractiveShader from '@/components/ui/crystal-shader';

// Token secreto cuando el Backdoor está activo
const BACKDOOR_TOKEN = '4444';
const SESSION_KEY = 'dentaxy_vault_unlocked';
const MAX_DIGITS = 4;

// Fecha de lanzamiento: 8 de Agosto de 2026
const TARGET_LAUNCH_DATE = '2026-08-08T00:00:00';

function isAlreadyUnlocked(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  } catch {
    return false;
  }
}

function persistUnlock() {
  try {
    sessionStorage.setItem(SESSION_KEY, 'true');
  } catch {
    // silent fail
  }
}

type ShaderMode = 'normal' | 'error' | 'success';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface VaultLockProps {
  children: React.ReactNode;
}

const VaultLock: React.FC<VaultLockProps> = ({ children }) => {
  const [unlocked, setUnlocked]     = useState<boolean>(isAlreadyUnlocked);
  const [digits, setDigits]         = useState<string[]>([]);
  const [shaderMode, setShaderMode] = useState<ShaderMode>('normal');
  const [fadeOut, setFadeOut]       = useState(false);
  const [showError, setShowError]   = useState(false);
  
  // Backdoor secreto
  const [isBackdoorActive, setIsBackdoorActive] = useState<boolean>(false);
  
  // Telemetría de construcción dinámica
  const [systemLog, setSystemLog] = useState<string>('COMPILANDO_CODIGO_DENTAXY_');
  const errorTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cuenta regresiva
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const difference = +new Date(TARGET_LAUNCH_DATE) - +new Date();
    let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }, []);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    if (unlocked) return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [unlocked, calculateTimeLeft]);

  // Rotación de logs enfocados en terminar Dentaxy
  useEffect(() => {
    if (unlocked) return;
    if (showError) return;
    
    const logs = isBackdoorActive 
      ? [
          'OVERRIDE_ACTIVO // ACCESO_DESARROLLADOR',
          'KERNEL.BYPASS: FORZANDO_LÓGICA_LOCAL',
          'COMPILACIÓN_PAUSADA: ESPERANDO_4444',
          'CONEXIÓN_DIRECTA: DENTAXY_CORE_MODULE',
        ]
      : [
          'COMPILANDO: SCRIPTS_DE_REDACCION_HISTORIAS',
          'ENCRIPTANDO: PRIVACIDAD_DATOS_MEDICOS',
          'DESARROLLO: OPTIMIZANDO_DENTAXY_SHOP',
          'ESTADO_PROCESO: BLOQUEADO_POR_CONSTRUCCIÓN',
          'MONITOR: SEED_ECOSYSTEM_SHIELD_ON',
          'MODULO: INTEGRANDO_IA_DETERMINISTA_UAZ',
          'SISTEMA: PREPARANDO_PRODUCCION_DENTAXY_2026'
        ];
    let i = 0;
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        setSystemLog(logs[i % logs.length]);
        i++;
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [unlocked, isBackdoorActive, showError]);

  useEffect(() => {
    return () => {
      if (errorTimeout.current) clearTimeout(errorTimeout.current);
    };
  }, []);

  const deleteDigit = useCallback(() => {
    setDigits(prev => prev.slice(0, -1));
  }, []);

  const clearDigits = useCallback(() => {
    setDigits([]);
  }, []);

  const validateToken = useCallback((input: string) => {
    if (isBackdoorActive && input === BACKDOOR_TOKEN) {
      setShaderMode('success');
      setSystemLog('ACCESO_CONCEDIDO // DESTRUCT_LOCK');
      setFadeOut(true);
      persistUnlock();
      setTimeout(() => setUnlocked(true), 850);
    } else {
      setShaderMode('error');
      setShowError(true);
      setSystemLog('ACCESO_RECHAZADO // ENTORNO_EN_DESARROLLO_SELLADO');
      
      if (errorTimeout.current) clearTimeout(errorTimeout.current);
      errorTimeout.current = setTimeout(() => {
        setShaderMode('normal');
        setShowError(false);
        setDigits([]);
        setSystemLog(isBackdoorActive ? 'ESPERANDO_TOKEN_OVERRIDE' : 'SISTEMA_BLOQUEADO_POR_DESARROLLO');
      }, 1500);
    }
  }, [isBackdoorActive]);

  const pressDigit = useCallback((num: string) => {
    setDigits(prev => {
      if (prev.length >= MAX_DIGITS) return prev;
      const next = [...prev, num];
      if (next.length === MAX_DIGITS) {
        setTimeout(() => validateToken(next.join('')), 50);
      }
      return next;
    });
  }, [validateToken]);

  // Teclado físico
  useEffect(() => {
    if (unlocked) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key >= '0' && e.key <= '9') pressDigit(e.key);
      if (e.key === 'Backspace') deleteDigit();
      if (e.key === 'Escape') clearDigits();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [unlocked, digits, pressDigit, deleteDigit, clearDigits]);

  const triggerBackdoor = () => {
    if (unlocked) return;
    setIsBackdoorActive(true);
    setSystemLog('MODO_DESARROLLADOR_BYPASS... ESPERANDO_LLAVE');
  };

  if (unlocked) return <>{children}</>;

  const shaderParams =
    shaderMode === 'error'
      ? { cellDensity: 32, animationSpeed: 3.5, warpFactor: 8.0, mouseInfluence: 3.0, errorAlert: 1.0 }
      : shaderMode === 'success'
      ? { cellDensity: 5,  animationSpeed: 0.02, warpFactor: 0.05, mouseInfluence: 0.05, errorAlert: 0.0 }
      : { cellDensity: 15, animationSpeed: 0.12, warpFactor: 1.2, mouseInfluence: 0.6, errorAlert: 0.0 };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-between overflow-y-auto bg-black select-none font-mono py-6 md:py-12">
      
      {/* ── GATILLO SECRETO OCULTO (ESQUINA SUPERIOR DERECHA DEL VIEWPORT) ── */}
      <div 
        onClick={triggerBackdoor}
        className="absolute top-0 right-0 w-16 h-16 z-50 cursor-default bg-transparent"
      />

      {/* ── FONDO DE SHADER PRINCIPAL (ROJO EN ERROR) ── */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-out"
        style={{ opacity: fadeOut ? 0 : 1 }}
      >
        <InteractiveShader {...shaderParams} />
      </div>

      {/* ── RESPLANDOR AMBIENTAL BLANCO (GLOW DE FONDO DETRÁS DE LA INTERFAZ) ── */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)] transition-opacity duration-1000"
        style={{ opacity: fadeOut ? 0 : 1 }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/15 to-black/85 z-10 pointer-events-none" />

      {/* ── OVERLAY DE AMENAZA ESTROBOSCÓPICO (ROJO EN ERROR) ── */}
      <div 
        className={[
          'absolute inset-0 z-15 pointer-events-none transition-all duration-300',
          showError 
            ? 'bg-red-950/20 backdrop-blur-[2px] opacity-100 animate-[pulse_0.4s_infinite]' 
            : 'bg-transparent opacity-0',
        ].join(' ')}
      />

      {/* ── 1. PARTE SUPERIOR: TITULO DE MARCA ENORME (ESTILO LANDING + LIQUID GLASS) ── */}
      <div 
        className="relative mt-2 md:mt-4 text-center px-4 w-full max-w-[95vw] flex flex-col items-center z-25 transition-all duration-700 ease-out"
        style={{
          opacity: fadeOut ? 0 : 1,
          transform: fadeOut ? 'translateY(-20px)' : 'translateY(0)',
        }}
      >
        <h1 className="text-[10vw] xs:text-[12vw] sm:text-[14vw] md:text-[16vw] lg:text-[16.5vw] font-black tracking-tighter bg-gradient-to-b from-white via-white/95 to-white/65 bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(255,255,255,0.2)] mb-0 leading-[0.85] uppercase whitespace-nowrap flex justify-center" style={{ fontFamily: "'Bruno Ace SC', sans-serif" }}>
          Dentaxy
        </h1>
        <p className="text-[2.5vw] xs:text-[3vw] sm:text-xs md:text-sm lg:text-base tracking-[0.2em] sm:tracking-[0.4em] uppercase bg-gradient-to-b from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent font-semibold mt-1 mb-2 flex justify-center" style={{ fontFamily: "'Bruno Ace SC', sans-serif" }}>
          Technologies
        </p>
      </div>

      {/* ── 2. PARTE CENTRAL: TECLADO DE ACCESO CENTRALIZADO (FLOTANTE ABAJO) ── */}
      <div
        className="relative z-20 w-full max-w-xs mx-auto px-4 flex-1 flex flex-col items-center justify-end pb-4 sm:pb-6 md:pb-8 gap-6 transition-all duration-700 ease-out"
        style={{
          opacity: fadeOut ? 0 : 1,
          transform: fadeOut ? 'scale(0.97)' : 'scale(1)',
        }}
      >
        {/* Slots de PIN: Recuadros HUD clásicos */}
        <div className="flex justify-center gap-3.5 mb-2 w-full">
          {Array.from({ length: MAX_DIGITS }).map((_, i) => {
            const filled = i < digits.length;
            return (
              <div
                key={i}
                className={[
                  'w-10 h-12 border transition-all duration-300 flex flex-col items-center justify-between py-1.5 relative',
                  filled
                    ? showError
                      ? 'border-red-500 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                      : 'border-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.25)]'
                    : 'border-zinc-800 bg-black/40',
                ].join(' ')}
              >
                <span className="text-[7px] text-zinc-500 tracking-tighter">SLT_0{i + 1}</span>
                <span className={`text-base font-bold ${filled ? (showError ? 'text-red-500 animate-pulse' : 'text-white') : 'text-zinc-850'}`}>
                  {filled ? '*' : '0'}
                </span>
                <div className={`w-4 h-0.5 transition-all duration-300 ${filled ? (showError ? 'bg-red-500' : 'bg-white') : 'bg-transparent'}`} />
              </div>
            );
          })}
        </div>

        {/* Teclado numérico HUD */}
        <div className="space-y-3.5 w-full flex flex-col items-center">
          {[
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
          ].map((row, rowIdx) => (
            <div key={rowIdx} className="flex justify-center gap-5 w-full">
              {row.map(num => (
                <VaultKey
                  key={num}
                  label={num}
                  onClick={() => pressDigit(num)}
                  disabled={digits.length >= MAX_DIGITS}
                  isAlert={showError}
                />
              ))}
            </div>
          ))}

          <div className="flex justify-center gap-5 w-full">
            <VaultKey
              label="DEL"
              onClick={deleteDigit}
              disabled={digits.length === 0}
              variant="action"
              isAlert={showError}
            />
            <VaultKey
              label="0"
              onClick={() => pressDigit('0')}
              disabled={digits.length >= MAX_DIGITS}
              isAlert={showError}
            />
            <VaultKey
              label="CLR"
              onClick={clearDigits}
              disabled={digits.length === 0}
              variant="action"
              isAlert={showError}
            />
          </div>
        </div>
      </div>

      {/* ── 3. ESQUINA INFERIOR IZQUIERDA: CONTADOR (T-MINUS) ASIMÉTRICO ── */}
      <div 
        className="absolute bottom-8 left-8 md:bottom-12 md:left-12 lg:left-16 z-20 text-left transition-all duration-700 ease-out hidden sm:block"
        style={{
          opacity: fadeOut ? 0 : 1,
          transform: fadeOut ? 'translateY(15px)' : 'translateY(0)',
        }}
      >
        <p className="text-[7.5px] text-zinc-500 tracking-[0.25em] mb-2 uppercase font-bold">
          LANZAMIENTO GLOBAL // T-MINUS
        </p>
        <div className="flex items-baseline justify-start gap-4 font-mono">
          <div className="flex flex-col items-start">
            <span className="text-xl font-light text-white tracking-tight leading-none">{timeLeft.days}</span>
            <span className="text-[6.5px] text-zinc-500 uppercase tracking-widest mt-1">Días</span>
          </div>
          <span className="text-zinc-850 text-base font-light relative -top-1">:</span>
          <div className="flex flex-col items-start">
            <span className="text-xl font-light text-white tracking-tight leading-none">{timeLeft.hours.toString().padStart(2, '0')}</span>
            <span className="text-[6.5px] text-zinc-500 uppercase tracking-widest mt-1">Horas</span>
          </div>
          <span className="text-zinc-850 text-base font-light relative -top-1">:</span>
          <div className="flex flex-col items-start">
            <span className="text-xl font-light text-white tracking-tight leading-none">{timeLeft.minutes.toString().padStart(2, '0')}</span>
            <span className="text-[6.5px] text-zinc-500 uppercase tracking-widest mt-1">Mins</span>
          </div>
          <span className="text-zinc-850 text-base font-light relative -top-1">:</span>
          <div className="flex flex-col items-start">
            <span className="text-xl font-light text-white tracking-tight leading-none">{timeLeft.seconds.toString().padStart(2, '0')}</span>
            <span className="text-[6.5px] text-zinc-500 uppercase tracking-widest mt-1">Segs</span>
          </div>
        </div>
      </div>

      {/* ── 4. ESQUINA INFERIOR DERECHA: CONSOLA DE LOGS ASIMÉTRICA ── */}
      <div 
        className="absolute bottom-8 right-8 md:bottom-12 md:right-12 lg:right-16 z-20 text-right transition-all duration-700 ease-out hidden sm:block"
        style={{
          opacity: fadeOut ? 0 : 1,
          transform: fadeOut ? 'translateY(15px)' : 'translateY(0)',
        }}
      >
        <p className="text-[7.5px] text-zinc-500 tracking-[0.25em] mb-2 uppercase font-bold">
          {showError ? 'ALERTA_ACCESO_PROHIBIDO' : isBackdoorActive ? 'MODO_DESARROLLADOR' : 'ESTADO_SISTEMA_DEX'}
        </p>
        <p className={`text-[10px] font-mono tracking-wider font-semibold transition-colors duration-300 ${showError ? 'text-red-500 animate-pulse' : 'text-zinc-400'}`}>
          &gt; {systemLog}
        </p>
      </div>

      {/* ── 5. MOBILE COMPATIBILITY FOOTER (PARA PANTALLAS MUY PEQUEÑAS) ── */}
      <div className="w-full flex justify-between items-center px-6 mt-4 z-20 sm:hidden">
        <div className="text-left">
          <p className="text-[6.5px] text-zinc-500 uppercase font-bold mb-0.5">T-MINUS</p>
          <p className="text-[10px] text-white font-mono">{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m</p>
        </div>
        <div className="text-right">
          <p className="text-[6.5px] text-zinc-500 uppercase font-bold mb-0.5">ESTADO</p>
          <p className="text-[10px] text-zinc-400 font-mono truncate max-w-[120px]">{systemLog}</p>
        </div>
      </div>

    </div>
  );
};

// ─── BOTÓN DE TECLADO HUD ───────────────────────────────────────────────────
interface VaultKeyProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'digit' | 'action';
  isAlert?: boolean;
}

const VaultKey: React.FC<VaultKeyProps> = ({
  label,
  onClick,
  disabled = false,
  variant = 'digit',
  isAlert = false,
}) => {
  const [pressing, setPressing] = useState(false);

  function handlePress() {
    if (disabled) return;
    setPressing(true);
    onClick();
    setTimeout(() => setPressing(false), 120);
  }

  const isAction = variant === 'action';

  return (
    <button
      onClick={handlePress}
      disabled={disabled}
      className={[
        'w-16 h-12 relative flex flex-col items-center justify-center transition-all duration-150',
        'border font-mono tracking-widest',
        disabled 
          ? 'border-zinc-900 bg-zinc-950/40 text-zinc-800 cursor-not-allowed opacity-20' 
          : isAlert 
            ? 'border-red-900 bg-red-950/30 text-red-500 hover:border-red-600 hover:bg-red-500/10'
            : 'border-zinc-800 bg-black/60 text-zinc-300 hover:border-white/50 hover:bg-white/5 hover:text-white',
        pressing ? (isAlert ? 'scale-95 border-red-500 bg-red-500/20 text-white' : 'scale-95 border-white bg-white/20 text-white') : '',
      ].join(' ')}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {!disabled && !isAction && (
        <span className={`absolute top-0.5 left-0.5 w-1 h-1 ${isAlert ? 'bg-red-700' : 'bg-zinc-700'}`} />
      )}
      
      <span className={isAction ? 'text-[11px] font-bold' : 'text-base font-light'}>
        {label}
      </span>
      
      {!isAction && !disabled && (
        <span className={`text-[7px] absolute bottom-0.5 tracking-tighter ${isAlert ? 'text-red-700' : 'text-zinc-650'}`}>
          0x0{label}
        </span>
      )}
    </button>
  );
};
export default VaultLock;
