import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { chatWithAgent } from "@/services/gemini";
import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/hooks/use-theme";
import { useDexStore } from "@/stores/useDexStore";
import { getOrCreateSubfolder, listFiles, fetchDriveFileBlobUrl } from "@/utils/driveHelper";
import {
  normalizePatientName,
  splitNombreApellidos,
  detectDuplicate,
  looksLikeName,
  NON_NAME_WORDS,
} from "@/lib/dex/nombresMexicanos";

// ─── AudioContext Singleton — evita fuga de recursos (Bug #3) ────────────────
let _sharedAudioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  try {
    if (!_sharedAudioCtx || _sharedAudioCtx.state === 'closed') {
      _sharedAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // Chrome suspende el contexto si no hubo interacción reciente → resumir
    if (_sharedAudioCtx.state === 'suspended') {
      _sharedAudioCtx.resume().catch(() => {});
    }
    return _sharedAudioCtx;
  } catch {
    return null;
  }
}

// ─── Efectos de Sonido con Web Audio API (singleton AudioContext) ─────────────
const playActivationSound = () => {
  try {
    const audioCtx = getAudioCtx();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    const masterFilter = audioCtx.createBiquadFilter();
    masterFilter.type = 'lowpass';
    masterFilter.frequency.setValueAtTime(500, now);

    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.75, now);

    masterFilter.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    const delayNode = audioCtx.createDelay(0.1);
    const feedbackGain = audioCtx.createGain();
    delayNode.delayTime.setValueAtTime(0.022, now);
    feedbackGain.gain.setValueAtTime(0.4, now);
    delayNode.connect(feedbackGain);
    feedbackGain.connect(delayNode);
    delayNode.connect(masterFilter);

    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const oscTriangle = audioCtx.createOscillator();

    osc1.type = 'sine';
    osc2.type = 'sine';
    oscTriangle.type = 'triangle';

    const startFreq = 45;
    const endFreq = 160;
    osc1.frequency.setValueAtTime(startFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(endFreq, now + 0.6);
    osc2.frequency.setValueAtTime(startFreq, now);
    osc2.frequency.exponentialRampToValueAtTime(endFreq, now + 0.6);
    oscTriangle.frequency.setValueAtTime(startFreq, now);
    oscTriangle.frequency.exponentialRampToValueAtTime(endFreq, now + 0.6);

    osc1.detune.setValueAtTime(-20, now);
    osc2.detune.setValueAtTime(20, now);
    oscTriangle.detune.setValueAtTime(5, now);

    const localFilter = audioCtx.createBiquadFilter();
    localFilter.type = 'lowpass';
    localFilter.Q.setValueAtTime(1.0, now);
    localFilter.frequency.setValueAtTime(120, now);
    localFilter.frequency.exponentialRampToValueAtTime(500, now + 0.6);

    const energyGain = audioCtx.createGain();
    energyGain.gain.setValueAtTime(0.001, now);
    energyGain.gain.exponentialRampToValueAtTime(0.24, now + 0.08);
    energyGain.gain.setTargetAtTime(0, now + 0.12, 0.18);

    osc1.connect(localFilter);
    osc2.connect(localFilter);
    oscTriangle.connect(localFilter);
    localFilter.connect(energyGain);
    energyGain.connect(masterFilter);
    energyGain.connect(delayNode);

    osc1.start(now); osc2.start(now); oscTriangle.start(now);
    osc1.stop(now + 1.1); osc2.stop(now + 1.1); oscTriangle.stop(now + 1.1);
  } catch (error) {
    console.error("[DEX] Error en sonido de activación:", error);
  }
};

const playDeactivationSound = () => {
  try {
    const audioCtx = getAudioCtx();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    const masterFilter = audioCtx.createBiquadFilter();
    masterFilter.type = 'lowpass';
    masterFilter.frequency.setValueAtTime(500, now);
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.75, now);
    masterFilter.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    const delayNode = audioCtx.createDelay(0.1);
    const feedbackGain = audioCtx.createGain();
    delayNode.delayTime.setValueAtTime(0.022, now);
    feedbackGain.gain.setValueAtTime(0.4, now);
    delayNode.connect(feedbackGain);
    feedbackGain.connect(delayNode);
    delayNode.connect(masterFilter);

    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const oscTriangle = audioCtx.createOscillator();
    osc1.type = 'sine'; osc2.type = 'sine'; oscTriangle.type = 'triangle';

    osc1.frequency.setValueAtTime(170, now);
    osc1.frequency.exponentialRampToValueAtTime(45, now + 0.6);
    osc2.frequency.setValueAtTime(170, now);
    osc2.frequency.exponentialRampToValueAtTime(45, now + 0.6);
    oscTriangle.frequency.setValueAtTime(170, now);
    oscTriangle.frequency.exponentialRampToValueAtTime(45, now + 0.6);

    osc1.detune.setValueAtTime(-20, now);
    osc2.detune.setValueAtTime(20, now);
    oscTriangle.detune.setValueAtTime(5, now);

    const localFilter = audioCtx.createBiquadFilter();
    localFilter.type = 'lowpass';
    localFilter.frequency.setValueAtTime(500, now);
    localFilter.frequency.exponentialRampToValueAtTime(70, now + 0.6);

    const energyGain = audioCtx.createGain();
    energyGain.gain.setValueAtTime(0.24, now);
    energyGain.gain.setTargetAtTime(0, now + 0.05, 0.18);

    osc1.connect(localFilter); osc2.connect(localFilter); oscTriangle.connect(localFilter);
    localFilter.connect(energyGain);
    energyGain.connect(masterFilter);
    energyGain.connect(delayNode);

    // Whoosh de despresurización
    const sampleRate = audioCtx.sampleRate;
    const noiseDuration = 0.65;
    const noiseBuffer = audioCtx.createBuffer(1, sampleRate * noiseDuration, sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) noiseData[i] = Math.random() * 2 - 1;
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.Q.setValueAtTime(5.0, now);
    noiseFilter.frequency.setValueAtTime(450, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(80, now + 0.55);
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.08, now);
    noiseGain.gain.setTargetAtTime(0, now + 0.05, 0.15);
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterFilter);
    noiseGain.connect(delayNode);

    osc1.start(now); osc2.start(now); oscTriangle.start(now); noiseSource.start(now);
    osc1.stop(now + 1.1); osc2.stop(now + 1.1); oscTriangle.stop(now + 1.1); noiseSource.stop(now + 0.7);
  } catch (error) {
    console.error("[DEX] Error en sonido de desactivación:", error);
  }
};

// ─── Wake words: variantes fonéticas completas ───────────────────────────────
const MALE_TOKENS = [
  // Frases completas primero (mayor especificidad)
  'okey dex', 'ok dex', 'hey dex', 'oye dex', 'okay dex', 'escucha dex', 'ey dex',
  'okey decs', 'hey decs', 'ok decs', 'okey ex', 'ok ex', 'hey ex',
  // Tokens sueltos (Chrome confunde "dex" con estas palabras)
  'dex', 'decs', 'tex', 'lex', 'rex', 'des', 'next', 'the ex', 'deck', 'deex', 'nex', 'bex', 'vex',
  'dek', 'deps', 'deep', 'debts', 'sex', 'nets',
  'okeydex', 'okdex', 'heydex', 'jackson', 'okey jackson', 'texto', 'deksa', 'deksi'
];

const FEMALE_TOKENS = [
  // Frases completas primero
  'okey dexy', 'ok dexy', 'hey dexy', 'oye dexy', 'okay dexy', 'escucha dexy', 'ey dexy',
  'okey decsi', 'hey decsi', 'ok decsi', 'okey dexi', 'hey dexi', 'ok dexi', 'escucha dexi',
  // Tokens sueltos
  'dexy', 'dexi', 'decsi', 'texi', 'lexi', 'desi', 'sexy', 'pepsi', 'decky',
  'deexi', 'deaxi', 'beatsy', 'vexi', 'betsy', 'dixi', 'nexy', 'mexi',
  'okeyexi', 'okexi', 'okayexi', 'heyexi', 'okey jackson', 'jackson', 'jacksy', 'daisy',
  'deisy', 'dacy', 'okey daisy', 'okey deisy', 'ok deisy', 'taxi', 'yexi', 'bexy', 'daxy',
  'okey lexi', 'okey pepsi', 'dexi', 'dexis', 'dexia', 'texis', 'nexis'
];

const PHONETIC_FIXES: Record<string, string> = {
  "hondo grama": "odontograma",
  "odonto grama": "odontograma",
  "odontogramas": "odontograma",
  "exo doncia": "exodoncia",
  "extra doncia": "exodoncia",
  "orto doncia": "ortodoncia",
  "perio dontitis": "periodontitis",
  "perio dontal": "periodontal",
  "peri apical": "periapical",
  "endo doncia": "endodoncia",
  "pro filaxis": "profilaxis",
  "implanto logía": "implantología",
  "maxilo facial": "maxilofacial",
  "dentaxi": "dentaxy"
};

function normalizeMedicalTerms(text: string): string {
  let normalized = text;
  for (const [wrong, correct] of Object.entries(PHONETIC_FIXES)) {
    normalized = normalized.replace(new RegExp(`\\b${wrong}\\b`, 'gi'), correct);
  }
  return normalized;
}

/** Retorna true si el texto reciente contiene alguna frase de activación fonética */
function detectWake(text: string, gender: 'male' | 'female'): boolean {
  const t = text.toLowerCase().trim();
  const tokens = t.split(/\s+/);
  const recentText = tokens.slice(-8).join(' '); // Solo buscar en las últimas 8 palabras

  const tokensToMatch = gender === 'female' ? FEMALE_TOKENS : MALE_TOKENS;

  for (const token of tokensToMatch) {
    if (new RegExp(`(?:^|\\s)${token}(?:\\s|$|,|\\.|!|\\?)`, 'i').test(recentText)) return true;
  }
  return false;
}

/** Extrae el comando después del ÚLTIMO wake word fonético detectado */
function extractCommand(text: string, gender: 'male' | 'female'): string {
  let t = text.toLowerCase().trim();
  const tokensToMatch = gender === 'female' ? FEMALE_TOKENS : MALE_TOKENS;
  
  let lastWakeIndex = -1;
  let matchedWake = '';

  for (const token of tokensToMatch) {
    const regex = new RegExp(`(?:^|\\s)(${token})(?:\\s|$|,|\\.|!|\\?)`, 'gi');
    let match;
    while ((match = regex.exec(t)) !== null) {
      if (match.index > lastWakeIndex) {
        lastWakeIndex = match.index;
        matchedWake = match[1];
      }
    }
  }

  let cmd = t;
  if (lastWakeIndex !== -1) {
    cmd = t.slice(lastWakeIndex + matchedWake.length);
  }

  // Limpiar puntuación
  cmd = cmd.replace(/[.,/#!$%^&*;:{}=\-_`~()?¿¡]/g, ' ').replace(/\s+/g, ' ').trim();

  // Eliminar palabras de relleno aisladas o al inicio
  const fillers = ["okey", "okay", "ok", "hey", "oye", "a ver", "bueno", "pues", "este"];
  let words = cmd.split(' ');
  while(words.length > 0 && fillers.includes(words[0])) {
    words.shift();
  }
  
  return words.join(' ').trim();
}

// ─── Validación de comando: evitar reaccionar a frases sin sentido ───────────

/**
 * Mínimo de "palabras significativas" para que DEX procese un comando.
 * Una palabra significativa tiene ≥ 2 caracteres y no es stop-word.
 */
const MIN_MEANINGFUL_WORDS = 2;

/** Retorna true si el comando merece ser procesado */
function isMeaningfulCommand(cmd: string): boolean {
  if (!cmd || cmd.trim().length < 3) return false;
  const tokens = cmd.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const meaningful = tokens.filter(
    (t) => t.length >= 2 && !NON_NAME_WORDS.has(t)
  );
  return meaningful.length >= MIN_MEANINGFUL_WORDS;
}

/** Retorna true si el comando es una intención de agregar paciente */
function isAddPatientIntent(cmd: string): boolean {
  return (
    cmd.includes("agrega paciente") ||
    cmd.includes("agregar paciente") ||
    cmd.includes("nuevo paciente") ||
    cmd.includes("registra paciente") ||
    cmd.includes("registrar paciente") ||
    cmd.includes("añade paciente") ||
    cmd.includes("añadir paciente")
  );
}

// ─── Tipos de estado ──────────────────────────────────────────────────────────
type VoiceState = 'SLEEPING' | 'LISTENING_COMMAND' | 'PROCESSING' | 'SPEAKING';
type ConvState = 'IDLE' | 'WAITING_COMMAND' | 'ADD_PATIENT_NAME' | 'ADD_PATIENT_PHONE' | 'ADD_PATIENT_CONFIRM';

// ─── Componente principal ─────────────────────────────────────────────────────
export function GlobalDexBubble() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { theme } = useTheme();

  // DEX funciona en todas las rutas de la app y seed
  const isAppRoute = 
    location.pathname === "/app" || 
    location.pathname.startsWith("/app/") ||
    location.pathname === "/seed/app" ||
    location.pathname.startsWith("/seed/app/") ||
    location.pathname === "/seed/new" ||
    location.pathname.startsWith("/seed/new/") ||
    location.pathname.startsWith("/academico") ||
    location.pathname === "/core" ||
    location.pathname.startsWith("/singularity");
  
  const [isExpedienteOpen, setIsExpedienteOpen] = useState(false);

  useEffect(() => {
    const handleExpedienteState = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.isOpen !== undefined) {
        setIsExpedienteOpen(detail.isOpen);
      }
    };
    window.addEventListener('dex:expedienteState', handleExpedienteState);
    return () => window.removeEventListener('dex:expedienteState', handleExpedienteState);
  }, []);

  const shouldHide = !isAppRoute || isExpedienteOpen;

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('SLEEPING');

  // Visor de pantalla completa (ilustraciones y radiografías)
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [fullScreenTitle, setFullScreenTitle] = useState<string>('');

  // Bug #5 corregido: gender viene del store (única fuente de verdad), no useState local
  const storeGender = useDexStore(state => state.gender);
  const genderRef = useRef<'male' | 'female'>(storeGender);
  // Mantener ref siempre fresca cuando el store cambia
  useEffect(() => {
    genderRef.current = storeGender;
  }, [storeGender]);

  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>(storeGender);

  const [showMicModal, setShowMicModal] = useState(false);
  const [isMicReady, setIsMicReady] = useState(() => {
    return localStorage.getItem('dex_mic_intro_shown') === 'true';
  });

  // Bug #1 corregido: eliminado el removeItem de debugging que causaba que el
  // modal siempre apareciera y que el motor nunca arrancara en producción.

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('[DEX] Error al solicitar permisos de micrófono:', error);
      return false;
    }
  };

  useEffect(() => {
    if (shouldHide) return;
    const hasShown = localStorage.getItem('dex_mic_intro_shown') === 'true';
    if (!hasShown) {
      setShowMicModal(true);
    }
  }, [shouldHide, location.pathname]);

  // ── Refs de estado (siempre frescos, sin closures obsoletos) ──────────────
  const voiceStateRef = useRef<VoiceState>('SLEEPING');
  const convStateRef = useRef<ConvState>('IDLE');
  const tempPatientRef = useRef({ name: '', phone: '' });

  // ── Refs de timers ────────────────────────────────────────────────────────
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const commandTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listenDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const watchdogRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastResultTimeRef = useRef<number>(Date.now());

  // ── Refs de reconocimiento ────────────────────────────────────────────────
  const recRef = useRef<any>(null);
  const secondaryRecRef = useRef<any>(null); // Motor secundario keepalive
  const keepaliveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null); // Timer de lanzamiento del motor secundario
  const aliveRef = useRef(false);
  const suppressToggleRef = useRef(false);
  const isListeningRef = useRef(false);
  const isDraggingBubble = useRef(false);
  // Contador de errores not-allowed para no matar DEX con un error transitorio
  const notAllowedCountRef = useRef(0);
  const launchSRRef = useRef<(() => void) | null>(null);

  // ── Ref de función de procesamiento (siempre actualizado) ─────────────────
  const processVoiceRef = useRef<(text: string) => void>(() => {});

  // ── Zustand Store ─────────────────────────────────────────────────────────
  const { speakText, isSpeaking, setIsListening } = useDexStore();

  // ── Helpers de mic indicator ──────────────────────────────────────────────
  const micOn = useCallback(() => {
    isListeningRef.current = true;
    useDexStore.getState().setIsListening(true);
  }, []);

  const micOff = useCallback(() => {
    if (suppressToggleRef.current) return;
    isListeningRef.current = false;
    if (listenDebounceRef.current) clearTimeout(listenDebounceRef.current);
    listenDebounceRef.current = setTimeout(() => {
      if (!suppressToggleRef.current) useDexStore.getState().setIsListening(false);
    }, 300);
  }, []);

  // ── Setter de estado sincronizado (ref + React) ───────────────────────────
  const setVS = useCallback((s: VoiceState) => {
    voiceStateRef.current = s;
    setVoiceState(s);
  }, []);

  // ── Helpers de timers ─────────────────────────────────────────────────────
  const clearAllTimers = useCallback(() => {
    if (silenceTimerRef.current)   { clearTimeout(silenceTimerRef.current);   silenceTimerRef.current = null; }
    if (commandTimeoutRef.current) { clearTimeout(commandTimeoutRef.current); commandTimeoutRef.current = null; }
  }, []);

  const clearInactivity = useCallback(() => {
    if (inactivityTimerRef.current) { clearTimeout(inactivityTimerRef.current); inactivityTimerRef.current = null; }
  }, []);

  // ── goSleep: volver a modo reposo ────────────────────────────────────────
  const goSleep = useCallback((withSound = true) => {
    if (withSound) playDeactivationSound();
    clearAllTimers();
    clearInactivity();
    convStateRef.current = 'IDLE';
    tempPatientRef.current = { name: '', phone: '' };
    setVS('SLEEPING');
    setIsInteracting(false);
    setResponseMessage(null);
  }, [clearAllTimers, clearInactivity, setVS]);

  // ── Resetear timeout de inactividad ──────────────────────────────────────
  const resetInactivity = useCallback(() => {
    clearInactivity();
    const dur = convStateRef.current === 'IDLE' ? 4000 : 15000;
    inactivityTimerRef.current = setTimeout(() => {
      if (!useDexStore.getState().isSpeaking) goSleep(true);
    }, dur);
  }, [clearInactivity, goSleep]);

  // ── Cerrar el visor de pantalla completa con tecla Escape ─────────────────
  useEffect(() => {
    if (!fullScreenImage) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullScreenImage(null);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [fullScreenImage]);

  // ── Bridge: sincronizar el paciente activo al window para que DEX lo lea ──
  // SeedExpedienteInterface y SeedLanding disparan este evento cuando cambia el paciente
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.folderId) (window as any).__dex_active_patient_folder_id__ = detail.folderId;
      if (detail?.name)     (window as any).__dex_active_patient_name__ = detail.name;
    };
    window.addEventListener('dex:activePatient', handler);
    return () => window.removeEventListener('dex:activePatient', handler);
  }, []);

  // ────────────────────────────────────────────────────────────────────────
  // LÓGICA DE COMANDOS DE VOZ
  // ────────────────────────────────────────────────────────────────────────
  const handleSendMessageWithText = useCallback(async (text: string) => {
    if (!text.trim()) return;
    try {
      const response = await chatWithAgent(text, {}, []);
      if (response === "__NO_UNDERSTOOD__") {
        goSleep(true);
        return;
      }
      convStateRef.current = 'IDLE';
      setResponseMessage(response);
      speakText(response);
      resetInactivity();
    } catch {
      goSleep(true);
    }
  }, [speakText, resetInactivity, goSleep]);

  const handleSendMessage = useCallback(async () => {
    if (!chatInput.trim() || isLoading) return;
    const userQuery = chatInput;
    setChatInput("");
    setIsLoading(true);
    try {
      const response = await chatWithAgent(userQuery, {}, []);
      if (response === "__NO_UNDERSTOOD__") {
        setResponseMessage("No pude comprender esa instrucción.");
        speakText("No pude comprender esa instrucción.");
      } else {
        setResponseMessage(response);
        speakText(response);
      }
    } catch {
      setResponseMessage("No pude procesar esa pregunta!");
      speakText("No pude procesar esa pregunta!");
    } finally {
      setIsLoading(false);
      setChatInput("");
    }
  }, [chatInput, isLoading, speakText]);

  // ── Agregar paciente: capturar nombre con normalización inteligente ────────
  const handleAddPatientIntent = useCallback((data: string) => {
    // Abrir formulario visual en Seed con animación
    window.dispatchEvent(new CustomEvent('dex:openAddPatient'));

    if (data.length > 3) {
      const phoneRegex = /(?:tel[eé]fono|celular|numero|número)\s+(.+)/i;
      const match = data.match(phoneRegex);
      if (match) {
        const rawName = data.replace(match[0], "").trim();
        const normalizedName = normalizePatientName(rawName);
        tempPatientRef.current.name = normalizedName;
        tempPatientRef.current.phone = match[1].trim();
        convStateRef.current = 'ADD_PATIENT_CONFIRM';
        const msg = `Registrando a ${normalizedName} con teléfono ${match[1].trim()} ¿Confirma el registro?`;
        setResponseMessage(msg); speakText(msg);
      } else {
        const normalizedName = normalizePatientName(data);
        tempPatientRef.current.name = normalizedName;
        // Animar escritura del nombre en el formulario
        window.dispatchEvent(new CustomEvent('dex:fillForm', { detail: { nombre: normalizedName } }));
        convStateRef.current = 'ADD_PATIENT_PHONE';
        const msg = `Registrando a ${normalizedName} ¿Cuál es su teléfono?`;
        setResponseMessage(msg); speakText(msg);
      }
    } else {
      convStateRef.current = 'ADD_PATIENT_NAME';
      const msg = "¿Cuál es el nombre completo del paciente?";
      setResponseMessage(msg); speakText(msg);
    }
  }, [speakText]);

  const doCreatePatient = useCallback(() => {
    const nameSnap = tempPatientRef.current.name;
    const phoneSnap = tempPatientRef.current.phone;
    setResponseMessage("Creando expediente...");
    convStateRef.current = 'IDLE';
    tempPatientRef.current = { name: '', phone: '' };

    // Despachar para que el formulario se muestre procesando
    window.dispatchEvent(new CustomEvent('dex:submittingForm'));

    (async () => {
      try {
        const seedUserStr = sessionStorage.getItem('seed_user');
        let accessToken: string | null = null;
        if (seedUserStr) {
          try { accessToken = JSON.parse(seedUserStr).googleAccessToken; } catch (e) {}
        }

        // Derivar nombre + apellidos
        const { nombre, apellidos } = splitNombreApellidos(nameSnap);

        if (accessToken) {
          const q = encodeURIComponent("name = 'Dentaxy' and mimeType = 'application/vnd.google-apps.folder' and trashed = false");
          const rootRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id)`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          const rootData = await rootRes.json();
          let parentId: string | null = null;
          if (rootData.files && rootData.files.length > 0) {
            parentId = rootData.files[0].id;
          } else {
            const cr = await fetch('https://www.googleapis.com/drive/v3/files', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: 'Dentaxy', mimeType: 'application/vnd.google-apps.folder' })
            });
            parentId = (await cr.json()).id;
          }

          const folderName = apellidos
            ? `${apellidos.toUpperCase()}, ${nombre}`
            : nombre.toUpperCase();

          const patRes = await fetch('https://www.googleapis.com/drive/v3/files', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: folderName,
              mimeType: 'application/vnd.google-apps.folder',
              parents: [parentId],
              appProperties: { telefono: phoneSnap, motivo: 'Valoración inicial (DEX AI)', alergias: 'Ninguna' }
            })
          });
          if (patRes.ok) window.dispatchEvent(new Event('patientCreated'));
        }

        window.dispatchEvent(new CustomEvent('createNewPatientLocal', {
          detail: { name: nameSnap, nombre, apellidos, telefono: phoneSnap }
        }));
        const doneMsg = "¡Paciente registrado!";
        setResponseMessage(doneMsg); speakText(doneMsg);
        setTimeout(() => { setIsChatOpen(false); setResponseMessage(null); setIsInteracting(false); }, 4000);
      } catch {
        window.dispatchEvent(new CustomEvent('createNewPatientLocal', {
          detail: { name: nameSnap, telefono: phoneSnap }
        }));
        const doneMsg = "Paciente registrado localmente!";
        setResponseMessage(doneMsg); speakText(doneMsg);
        setTimeout(() => { setIsChatOpen(false); setResponseMessage(null); setIsInteracting(false); }, 4000);
      }
    })();
  }, [speakText]);

  const handleVoiceCommand = useCallback((cmd: string) => {
    if (!cmd) {
      const phrases = [
        "¡Dígame!",
        "¡Le escucho!",
        "¡Dígame!",
        "¡Aquí estoy!"
      ];
      const phrase = phrases[Math.floor(Math.random() * phrases.length)];
      setResponseMessage(phrase);
      speakText(phrase);
      convStateRef.current = 'WAITING_COMMAND';
      return;
    }

    const hardCancelPhrases = ["no nada", "no, nada", "olvídalo", "olvidalo", "cancelar todo"];
    if (hardCancelPhrases.some(p => cmd.includes(p))) {
      setIsInteracting(false);
      setResponseMessage(null);
      convStateRef.current = 'IDLE';
      tempPatientRef.current = { name: '', phone: '' };
      return;
    }

    // ── COMANDO VISUAL: Cerrar visor ──────────────────────────────────────────
    if (fullScreenImage && (cmd.includes('cerrar') || cmd.includes('cierra') || cmd.includes('quita') || cmd.includes('cierra imagen'))) {
      setFullScreenImage(null);
      const m = "¡Imagen cerrada!";
      setResponseMessage(m); speakText(m);
      goSleep(false);
      return;
    }

    // ── COMANDO VISUAL: Ilustraciones anatómicas locales ─────────────────────
    // Partes del diente — todas las variantes posibles
    const esDienteCmd =
      cmd.includes('partes del diente') ||
      cmd.includes('partes de un diente') ||
      cmd.includes('anatomia del diente') ||
      cmd.includes('anatomía del diente') ||
      cmd.includes('anatomia dental') ||
      cmd.includes('estructura del diente') ||
      cmd.includes('morfologia del diente') ||
      cmd.includes('capas del diente') ||
      cmd.includes('imagen del diente') ||
      cmd.includes('ilustración del diente') ||
      cmd.includes('ilustracion del diente') ||
      (cmd.includes('diente') && (cmd.includes('muestra') || cmd.includes('muestrame') || cmd.includes('muéstrame') || cmd.includes('ver') || cmd.includes('abre') || cmd.includes('enseña') || cmd.includes('ensena') || cmd.includes('imagen') || cmd.includes('ilustra'))) ||
      (cmd.includes('dientes') && (cmd.includes('muestra') || cmd.includes('ver') || cmd.includes('abre') || cmd.includes('imagen')));

    if (esDienteCmd) {
      const m = "Aquí tienes la ilustración de las partes del diente.";
      setResponseMessage(m);
      speakText(m);
      setFullScreenTitle('Partes del Diente');
      setFullScreenImage('/Ilustraciones DEX/Partes del diente .png');
      goSleep(false);
      return;
    }

    // Fases de la caries — todas las variantes posibles
    const esCariesCmd =
      cmd.includes('fases de la caries') ||
      cmd.includes('etapas de la caries') ||
      cmd.includes('estadios de la caries') ||
      cmd.includes('progresion de la caries') ||
      cmd.includes('progresión de la caries') ||
      cmd.includes('avance de la caries') ||
      cmd.includes('caries dental') ||
      cmd.includes('imagen de caries') ||
      cmd.includes('ilustración de caries') ||
      cmd.includes('ilustracion de caries') ||
      (cmd.includes('caries') && (cmd.includes('muestra') || cmd.includes('muestrame') || cmd.includes('muéstrame') || cmd.includes('ver') || cmd.includes('abre') || cmd.includes('enseña') || cmd.includes('ensena') || cmd.includes('imagen') || cmd.includes('ilustra') || cmd.includes('fases') || cmd.includes('etapas')));

    if (esCariesCmd) {
      const m = "Aquí tienes la ilustración de las fases de la caries dental.";
      setResponseMessage(m);
      speakText(m);
      setFullScreenTitle('Fases de la Caries Dental');
      setFullScreenImage('/Ilustraciones DEX/Fases de la caries dental.png');
      goSleep(false);
      return;
    }

    // ── COMANDO VISUAL: Radiografías desde Google Drive ───────────────────────
    // Detectar la INTENCIÓN de ver una radiografía (con o sin número)
    const esIntentRadio =
      cmd.includes('radiograf') ||
      cmd.includes('radio') ||
      cmd.includes('placa') ||
      cmd.includes('rx ') ||
      cmd.includes(' rx') ||
      cmd.includes('rayos x') ||
      cmd.includes('imagen de') ||
      cmd.includes('foto del') ||
      cmd.includes('foto de');

    const esAccionVer =
      cmd.includes('muestra') || cmd.includes('muestrame') ||
      cmd.includes('muéstrame') || cmd.includes('ver') ||
      cmd.includes('abre') || cmd.includes('enseña') ||
      cmd.includes('ensena') || cmd.includes('trae') ||
      cmd.includes('carga') || cmd.includes('mostrar') ||
      cmd.includes('abrir') || cmd.includes('desplegar') ||
      cmd.includes('quiero ver') || cmd.includes('pon') ||
      cmd.includes('poner') || cmd.includes('pon la');

    if (esIntentRadio && esAccionVer) {
      // Extraer número si viene incluido; si no, usar 1 (primera radiografía)
      const numMatch =
        cmd.match(/(\d+)\s*(?:ra|da|era|ava|ta|tha)?\s*radiograf/) ||
        cmd.match(/radiograf[ií]a[s]?\s+(?:n[uú]mero\s+)?(\d+)/) ||
        cmd.match(/radio\s+(?:n[uú]mero\s+)?(\d+)/) ||
        cmd.match(/placa\s+(?:n[uú]mero\s+)?(\d+)/) ||
        cmd.match(/rx\s+(?:n[uú]mero\s+)?(\d+)/) ||
        cmd.match(/rayos x\s+(\d+)/) ||
        cmd.match(/imagen\s+(\d+)/);

      const rawNum = numMatch ? (numMatch[1] || numMatch[2]) : '1';
      const idx = Math.max(0, parseInt(rawNum, 10) - 1);

      // Obtener paciente activo y token
      const seedUserStr = sessionStorage.getItem('seed_user');
      const seedUser = seedUserStr ? JSON.parse(seedUserStr) : null;
      const token = seedUser?.googleAccessToken;
      const activePatientId = (window as any).__dex_active_patient_folder_id__;
      const activePatientName = (window as any).__dex_active_patient_name__ || 'el paciente';

      if (!token) {
        const m = "No hay sesión de Google activa. Inicia sesión primero.";
        setResponseMessage(m); speakText(m); goSleep(false); return;
      }
      if (!activePatientId) {
        const m = "No hay paciente seleccionado. Selecciona un paciente primero.";
        setResponseMessage(m); speakText(m); goSleep(false); return;
      }

      const nLabel = idx + 1;
      setResponseMessage(`Buscando radiografía ${nLabel} de ${activePatientName}...`);
      speakText(`Buscando radiografía`);

      (async () => {
        try {
          const gabineteId = await getOrCreateSubfolder(activePatientId, 'Gabinete', token);
          const radioFolderId = await getOrCreateSubfolder(gabineteId, 'radiografias', token);
          const files = await listFiles(radioFolderId, token);
          const sorted = [...files].sort((a, b) =>
            new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime()
          );

          if (sorted.length === 0) {
            const m = `${activePatientName} no tiene radiografías en su expediente.`;
            setResponseMessage(m); speakText(m); goSleep(false); return;
          }
          if (idx >= sorted.length) {
            const m = `${activePatientName} solo tiene ${sorted.length} radiografía${sorted.length > 1 ? 's' : ''}.`;
            setResponseMessage(m); speakText(m); goSleep(false); return;
          }

          const file = sorted[idx];
          const blobUrl = await fetchDriveFileBlobUrl(file.id, token);
          setFullScreenTitle(`Radiografía ${nLabel} — ${activePatientName}`);
          setFullScreenImage(blobUrl);
          const doneMsg = `Radiografía ${nLabel} de ${activePatientName} lista.`;
          setResponseMessage(doneMsg);
          speakText(doneMsg);
          goSleep(false);
        } catch (e: any) {
          console.error('[DEX] Error cargando radiografía:', e);
          const m = `No pude cargar la radiografía: ${e.message}`;
          setResponseMessage(m); speakText(m); goSleep(false);
        }
      })();

      return;
    }

    // ── Flujo multi-paso de agregar paciente (requiere estado de conversación) ──
    if (isAddPatientIntent(cmd)) {
      const data = cmd.replace(/.*(?:agrega|agregar|nuevo|registra|registrar|añade|añadir)\s+paciente\s*/i, "").trim();
      handleAddPatientIntent(data);
      return;
    }

    // ── Cerrar / ocultar DEX ──────────────────────────────────────────────────
    if (cmd.includes("cerrar") || cmd.includes("quita") || cmd.includes("oculta")) {
      const m = "¡Entendido!";
      setResponseMessage(m); speakText(m);
      convStateRef.current = 'IDLE';
      return;
    }

    // ── TODO lo demás pasa por el motor local de gemini.ts ──────────────────
    handleSendMessageWithText(cmd);
  }, [speakText, handleAddPatientIntent, handleSendMessageWithText, fullScreenImage, goSleep]);

  const processVoiceInput = useCallback((text: string) => {
    const cleaned = text.trim();
    if (!cleaned) return;
    resetInactivity();

    const conv = convStateRef.current;
    if (conv === 'ADD_PATIENT_NAME') {
      // Validar que parece ser un nombre antes de procesar
      if (!looksLikeName(cleaned)) {
        const msg = "¡No escuché bien el nombre! ¿Puede repetir el nombre completo?";
        setResponseMessage(msg); speakText(msg);
        return;
      }
      handleAddPatientIntent(cleaned);
    } else if (conv === 'ADD_PATIENT_PHONE') {
      tempPatientRef.current.phone = cleaned;
      // Animar escritura del teléfono en el formulario
      window.dispatchEvent(new CustomEvent('dex:fillForm', { detail: { telefono: cleaned } }));
      convStateRef.current = 'ADD_PATIENT_CONFIRM';
      const msg = `Registrando a ${tempPatientRef.current.name} con teléfono ${cleaned} ¿Confirma el registro?`;
      setResponseMessage(msg); speakText(msg);
    } else if (conv === 'ADD_PATIENT_CONFIRM') {
      const toWords = (s: string) => s.split(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9]+/).filter(Boolean);
      const words = toWords(cleaned.toLowerCase());
      const confirmList = ["si", "sí", "claro", "confirmo", "confirmar", "confirma", "correcto", "ok", "okay", "dale", "perfecto", "adelante", "hazlo", "supuesto", "simon", "yes", "sip", "crear", "crea", "procede", "proceder", "graba", "grabar", "va", "andale", "ándale", "sure", "yep", "afirmativo"];
      const cancelList = ["no", "cancelar", "cancela", "olvidalo", "olvídalo", "detener", "parar"];
      if (confirmList.some(w => words.includes(w))) {
        doCreatePatient();
      } else if (cancelList.some(w => words.includes(w))) {
        const msg = "¡Registro cancelado!";
        setResponseMessage(msg); speakText(msg);
        convStateRef.current = 'IDLE';
        tempPatientRef.current = { name: '', phone: '' };
      }
    } else {
      handleVoiceCommand(cleaned);
    }
  }, [resetInactivity, handleAddPatientIntent, speakText, doCreatePatient, handleVoiceCommand]);

  // Siempre apuntar al render más reciente
  useEffect(() => { processVoiceRef.current = processVoiceInput; });

  // ────────────────────────────────────────────────────────────────────────
  // ── MOTOR DE VOZ DEX (arquitectura tipo Alexa) ────────────────────────
  // ────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (shouldHide || !isMicReady) return;

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      console.warn('[DEX] SpeechRecognition no disponible en este navegador.');
      return;
    }

    aliveRef.current = true;
    notAllowedCountRef.current = 0;

    // ── Función de lanzamiento del reconocimiento ──────────────────────
    const launch = () => {
      if (!aliveRef.current) return;

      if (recRef.current) {
        recRef.current.onstart  = null;
        recRef.current.onresult = null;
        recRef.current.onerror  = null;
        recRef.current.onend    = null;
        try { recRef.current.stop(); } catch (_) {}
        recRef.current = null;
      }

      const rec = new SR();
      recRef.current = rec;
      rec.continuous     = true;
      rec.interimResults = true;
      rec.lang           = 'es-MX';
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        suppressToggleRef.current = false;
        notAllowedCountRef.current = 0;
        micOn();
      };

      rec.onend = () => {
        micOff();
        if (!aliveRef.current) return;
        
        // Reinicio automático ultra-rápido (30ms) cuando Chrome corta la sesión (~60s)
        suppressToggleRef.current = true;
        if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
        restartTimerRef.current = setTimeout(() => {
          suppressToggleRef.current = false;
          if (aliveRef.current) launch();
        }, 30); // ⚡ Reducido de 100ms a 30ms
      };

      rec.onerror = (e: any) => {
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          notAllowedCountRef.current += 1;
          if (notAllowedCountRef.current >= 3) {
            console.warn('[DEX] Permiso denegado permanentemente.');
            aliveRef.current = false;
            micOff();
            return;
          }
        } else if (e.error === 'no-speech') {
          // Normal, ignorar
          return;
        } else if (e.error === 'aborted') {
          return; // Ya lo manejamos
        }
        
        // Reinicio seguro ante errores de red u otros
        micOff();
        if (!aliveRef.current) return;
        suppressToggleRef.current = true;
        if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
        restartTimerRef.current = setTimeout(() => {
          suppressToggleRef.current = false;
          if (aliveRef.current) launch();
        }, 500);
      };

      // Control de deduplicación — evita procesar el mismo comando dos veces
      let lastProcessedCommand = "";
      // Flag para no activar múltiples veces en el mismo utterance intermedio
      let wakeDetectedInCurrentUtterance = false;

      rec.onresult = (event: any) => {
        const lastResultIndex = event.results.length - 1;
        const result = event.results[lastResultIndex];
        const isFinal = result.isFinal;
        
        // Normalizar errores fonéticos comunes de la API de reconocimiento
        let rawText = result[0].transcript.toLowerCase().trim();
        const primaryText = normalizeMedicalTerms(rawText);

        lastResultTimeRef.current = Date.now();

        if (!primaryText) return;

        // ─── DEBUG DIRECTO EN DOM (Evitar render loop de React) ────────────
        const stateTag = voiceStateRef.current;
        const debugMsg = `[${stateTag}${isFinal ? ' FINAL' : ' interim'}] g=${genderRef.current}: "${primaryText}"`;
        const debugEl = document.getElementById('dex-debug-overlay');
        if (debugEl) {
          debugEl.innerText = debugMsg;
        }

        // Resetear flag de wake en cada utterance nuevo (solo cuando es final)
        if (isFinal) wakeDetectedInCurrentUtterance = false;

        // ─── BARGE-IN (Interrupción en cualquier momento crítico) ─────────────
        if (voiceStateRef.current === 'SPEAKING' || voiceStateRef.current === 'PROCESSING') {
          if (detectWake(primaryText, genderRef.current)) {
            useDexStore.getState().stopSpeaking();
            window.speechSynthesis.cancel();
            voiceStateRef.current = 'LISTENING_COMMAND';
            playActivationSound();
            setIsInteracting(true);
            setVoiceState('LISTENING_COMMAND');
            lastProcessedCommand = "";
            wakeDetectedInCurrentUtterance = true;
          }
          return;
        }

        // ─── SLEEPING: detectar wake word en INTERMEDIOS y FINALES ────────
        if (voiceStateRef.current === 'SLEEPING') {
          const wakeDetected = detectWake(primaryText, genderRef.current);
          if (!wakeDetected) return;
          
          if (wakeDetectedInCurrentUtterance) return;
          wakeDetectedInCurrentUtterance = true;

          // LOG CRÍTICO para asegurar que sí detectó y va a activar
          console.log('[DEX] ¡Wake word detectado! Pasando a LISTENING_COMMAND');
          if (debugEl) debugEl.innerText = `[ACTIVANDO] ${primaryText}`;

          voiceStateRef.current = 'LISTENING_COMMAND';
          playActivationSound();
          setIsInteracting(true);
          setVoiceState('LISTENING_COMMAND');
          lastProcessedCommand = "";

          // Si el mismo utterance que contiene el wake word trae un comando → ejecutar
          const cmd = extractCommand(primaryText, genderRef.current);
          if (cmd.length > 2 && isMeaningfulCommand(cmd)) {
            // Solo procesar comandos inmediatos si el resultado es final
            // (evitar ejecutar un comando que el usuario todavía está dictando)
            if (isFinal) {
              if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
              voiceStateRef.current = 'PROCESSING';
              setVoiceState('PROCESSING');
              lastProcessedCommand = cmd;
              setTimeout(() => { if (aliveRef.current) processVoiceRef.current(cmd); }, 50);
            } else {
              // Resultado intermedio con comando parcial — mostrar preview
              setResponseMessage(cmd);
            }
          } else {
            setResponseMessage('Escuchando...');
            convStateRef.current = 'WAITING_COMMAND';
            if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
            commandTimeoutRef.current = setTimeout(() => {
              if (voiceStateRef.current === 'LISTENING_COMMAND' && aliveRef.current) {
                goSleep(true);
              }
            }, 5000); // ⚡ Reducido de 8s a 5s
          }
          return;
        }

        // ─── LISTENING_COMMAND ───────────────────────────────────────────
        if (voiceStateRef.current === 'LISTENING_COMMAND') {
          const cmd = extractCommand(primaryText, genderRef.current);

          if (cmd) {
            setResponseMessage(cmd);
            if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
            commandTimeoutRef.current = setTimeout(() => {
              if (voiceStateRef.current === 'LISTENING_COMMAND' && aliveRef.current) {
                goSleep(true);
              }
            }, 5000); // ⚡ Reducido de 7s a 5s
          }

          const isMultiStep = ['ADD_PATIENT_NAME', 'ADD_PATIENT_PHONE', 'ADD_PATIENT_CONFIRM'].includes(convStateRef.current);
          const shouldProcess = isMultiStep ? cmd.length > 0 : cmd.length > 2;

          if (shouldProcess && isFinal && cmd !== lastProcessedCommand) {
            const isCtx = ['ADD_PATIENT_NAME', 'ADD_PATIENT_PHONE', 'ADD_PATIENT_CONFIRM'].includes(convStateRef.current);
            if (!isCtx && !isMeaningfulCommand(cmd)) {
              setResponseMessage('Escuchando...');
              return;
            }
            if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
            voiceStateRef.current = 'PROCESSING';
            setVoiceState('PROCESSING');
            lastProcessedCommand = cmd;
            processVoiceRef.current(cmd);
          }
        }
      };

      try {
        rec.start();
      } catch (err) {
        suppressToggleRef.current = false;
        if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
        restartTimerRef.current = setTimeout(launch, 500);
      }
    };

    launchSRRef.current = launch;

    // ── Motor secundario Keepalive (doble motor anti-gap) ─────────────────────
    // Si el motor principal lleva > 5s sin recibir audio en SLEEPING,
    // un motor secundario toma el relevo al instante cuando el principal muere.
    const launchKeepalive = () => {
      if (!aliveRef.current) return;
      if (keepaliveTimerRef.current) clearTimeout(keepaliveTimerRef.current);
      keepaliveTimerRef.current = setTimeout(() => {
        if (!aliveRef.current) return;
        if (voiceStateRef.current !== 'SLEEPING') {
          // No necesitamos keepalive si está activo
          launchKeepalive();
          return;
        }
        const timeSinceResult = Date.now() - lastResultTimeRef.current;
        if (timeSinceResult < 5000) {
          // Motor principal está vivo, revisar en 3s
          launchKeepalive();
          return;
        }
        // Motor principal parece sordo → lanzar motor secundario silencioso
        if (!secondaryRecRef.current) {
          try {
            const sec = new SR();
            secondaryRecRef.current = sec;
            sec.continuous = true;
            sec.interimResults = true;
            sec.lang = 'es-MX';
            sec.maxAlternatives = 1;
            sec.onresult = (event: any) => {
              // Actualizar timestamp — el motor secundario está recibiendo audio
              lastResultTimeRef.current = Date.now();
              // Pasar al procesador principal si detecta wake word
              const lastRes = event.results[event.results.length - 1];
              const rawText = normalizeMedicalTerms(lastRes[0].transcript.toLowerCase().trim());
              if (detectWake(rawText, genderRef.current) && voiceStateRef.current === 'SLEEPING') {
                // El motor secundario detectó el wake → lanzar motor principal fresco
                if (secondaryRecRef.current) {
                  try { secondaryRecRef.current.stop(); } catch (_) {}
                  secondaryRecRef.current = null;
                }
                launch(); // el motor principal se activará con el wake word ya capturado
              }
            };
            sec.onerror = () => {
              secondaryRecRef.current = null;
              launchKeepalive(); // Reintenta en 5s
            };
            sec.onend = () => {
              secondaryRecRef.current = null;
              // No reiniciar si el motor principal ya volvió a escuchar
              if (Date.now() - lastResultTimeRef.current > 3000) {
                launchKeepalive();
              }
            };
            sec.start();
            console.log('[DEX Keepalive] Motor secundario activado — motor principal sordo');
          } catch (_) {
            secondaryRecRef.current = null;
          }
        }
        launchKeepalive();
      }, 5000);
    };
    launchKeepalive();

    // ── Watchdog anti-deadlock (2x más rápido) ────────────────────────────────
    // Cada 4 segundos verifica que el motor esté activo; si no → lo resucita
    watchdogRef.current = setInterval(() => {
      if (!aliveRef.current) return;
      if (voiceStateRef.current === 'SPEAKING') return;

      const now = Date.now();
      const timeSinceLastResult = now - lastResultTimeRef.current;
      // Reinicio forzado si el motor se quedó 'sordo' por más de 8 segundos estando en SLEEPING
      const isStuckAndDeaf = timeSinceLastResult > 8000 && voiceStateRef.current === 'SLEEPING';

      if (!isListeningRef.current || isStuckAndDeaf) {
        console.warn('[DEX] Watchdog: mic inactivo o sordo, reiniciando...');
        lastResultTimeRef.current = Date.now();
        suppressToggleRef.current = false;
        // Limpiar motor secundario si existe
        if (secondaryRecRef.current) {
          try { secondaryRecRef.current.stop(); } catch (_) {}
          secondaryRecRef.current = null;
        }
        launch();
      }
    }, 4000); // ⚡ Reducido de 8s a 4s

    // Arrancar el motor
    launch();

    // Cleanup al desmontar o cambiar ruta
    return () => {
      aliveRef.current = false;
      suppressToggleRef.current = false;

      if (silenceTimerRef.current)    clearTimeout(silenceTimerRef.current);
      if (commandTimeoutRef.current)  clearTimeout(commandTimeoutRef.current);
      if (restartTimerRef.current)    clearTimeout(restartTimerRef.current);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (listenDebounceRef.current)  clearTimeout(listenDebounceRef.current);
      if (keepaliveTimerRef.current)  clearTimeout(keepaliveTimerRef.current); // ← limpieza del motor keepalive
      if (watchdogRef.current)        clearInterval(watchdogRef.current);

      // Apagar motor principal
      if (recRef.current) {
        recRef.current.onstart  = null;
        recRef.current.onresult = null;
        recRef.current.onerror  = null;
        recRef.current.onend    = null;
        try { recRef.current.abort(); } catch (_) {}
        recRef.current = null;
      }

      // Apagar motor secundario keepalive
      if (secondaryRecRef.current) {
        secondaryRecRef.current.onresult = null;
        secondaryRecRef.current.onerror  = null;
        secondaryRecRef.current.onend    = null;
        try { secondaryRecRef.current.abort(); } catch (_) {}
        secondaryRecRef.current = null;
      }

      useDexStore.getState().setIsListening(false);
    };
  }, [shouldHide, isMicReady, micOn, micOff, setVS, goSleep]);

  // ── Anti-eco: pausar mic mientras DEX habla ────────────────────────────
  useEffect(() => {
    if (shouldHide || !isMicReady) return;

    if (isSpeaking) {
      voiceStateRef.current = 'SPEAKING';
      setVoiceState('SPEAKING');
    } else {
      if (voiceStateRef.current !== 'SPEAKING') return;

      const nextState = convStateRef.current !== 'IDLE' ? 'LISTENING_COMMAND' : 'SLEEPING';
      if (nextState === 'LISTENING_COMMAND') {
        playActivationSound();
        setResponseMessage('Escuchando...');
        
        if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
        commandTimeoutRef.current = setTimeout(() => {
          if (voiceStateRef.current === 'LISTENING_COMMAND' && aliveRef.current) {
            goSleep(true);
          }
        }, 8000); // ⏱️ Aumentado de 4s a 8s tras hablar anti-eco
      } else {
        setResponseMessage(null);
      }
      voiceStateRef.current = nextState;
      setVoiceState(nextState);
    }
  }, [isSpeaking, shouldHide, isMicReady, setVS, goSleep]);

  if (shouldHide) return null;

  return (
    <>
      {/* ── DEBUG OVERLAY — Actualizado vía DOM para no congelar React ── */}
      <div
        id="dex-debug-overlay"
        className="fixed z-[10001] left-2 bottom-2 max-w-[340px] text-[10px] font-mono bg-black/80 text-green-400 rounded-lg px-3 py-1.5 pointer-events-none select-none truncate"
        style={{ maxWidth: '70vw', minHeight: '24px' }}
      >
        [DEX STARTING]
      </div>

      {/* ── Globo de Diálogo de Respuesta de DEX ── */}
      <AnimatePresence>
        {responseMessage && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed z-[9998] flex flex-col gap-2"
            style={{
              right:  isMobile ? 16 : 48,
              bottom: isMobile ? 132 : 132,
              width:  isMobile ? "calc(100vw - 32px)" : 360,
            }}
          >
            <div className="bg-slate-950/92 text-white rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.35)] border border-slate-800 backdrop-blur-md relative flex flex-col gap-2">
              <button
                onClick={() => setResponseMessage(null)}
                className="absolute top-2.5 right-2.5 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              {/* Indicador de estado */}
              <div className="flex items-center gap-2">
                <div className="text-[11px] font-mono text-[#00f5a0] tracking-widest uppercase">DEX AI</div>
                {voiceState === 'LISTENING_COMMAND' && (
                  <span className="flex gap-0.5 items-end h-3">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-0.5 bg-[#00f5a0] rounded-full animate-bounce" style={{ height: `${8 + i * 4}px`, animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </span>
                )}
                {voiceState === 'PROCESSING' && (
                  <span className="text-[10px] text-amber-400 font-mono animate-pulse">Procesando...</span>
                )}
              </div>
              <div className="text-[15px] leading-relaxed text-slate-100 pr-4 whitespace-pre-wrap font-medium">
                {responseMessage}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Burbuja / Barra de Chat Expandible ── */}
      <motion.div
        drag={!isChatOpen}
        dragMomentum={false}
        dragElastic={0.1}
        dragConstraints={{
          left: -window.innerWidth + 120,
          right: 20,
          top: -window.innerHeight + 120,
          bottom: 20
        }}
        onDragStart={() => {
          isDraggingBubble.current = true;
        }}
        onDragEnd={() => {
          setTimeout(() => {
            isDraggingBubble.current = false;
          }, 100);
        }}
        initial={false}
        animate={isChatOpen ? {
          width:        isMobile ? "calc(100vw - 32px)" : 480,
          height:       64,
          borderRadius: 32,
          y: 0,
          x: 0,
        } : {
          width: 102,
          height: 102,
          borderRadius: 51,
        }}
        whileHover={!isChatOpen ? {
          scale: 1.04,
        } : undefined}
        whileTap={!isChatOpen ? { scale: 0.96 } : undefined}
        transition={isChatOpen
          ? { type: "spring", stiffness: 140, damping: 20 }
          : { type: "tween", ease: "linear", duration: 0.2 }
        }
        className="fixed z-[9999] flex items-center cursor-pointer bg-transparent justify-center p-0"
        style={{
          right:  isMobile ? 16 : 48,
          bottom: isMobile ? 24 : 24,
          willChange: "transform, width, height",
        }}
        onClick={() => {
          if (!isChatOpen && !isDraggingBubble.current) {
            setIsChatOpen(true);
          }
        }}
      >
        {/* Contenedor interno: une flotación, brillo pulsátil y adaptabilidad de forma */}
        <div
          className={`w-full h-full flex items-center transition-all duration-300 ${
            isChatOpen
              ? "bg-white border border-slate-100 p-1 justify-start rounded-[32px]"
              : `bg-transparent justify-center p-0 rounded-full ${
                  theme === 'light' ? 'animate-float-glow-shadow' : 'animate-float-glow-purple'
                }`
          }`}
          style={{
            boxShadow: isChatOpen
              ? theme === 'light'
                ? '0 8px 32px rgba(0, 0, 0, 0.35), 0 0 15px rgba(0, 0, 0, 0.2)'
                : '0 8px 32px rgba(147, 51, 234, 0.2), 0 0 15px rgba(147, 51, 234, 0.1)'
              : undefined,
          }}
        >
          {/* Orbe de DEX */}
          <motion.div
            onClick={(e) => {
              if (isChatOpen) {
                e.stopPropagation();
                setIsChatOpen(false);
                setResponseMessage(null);
              }
            }}
            className="rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-transparent border-none shadow-none transition-all duration-300"
            style={{
              width:  isChatOpen ? 56 : 102,
              height: isChatOpen ? 56 : 102,
              willChange: "width, height",
            }}
          >
            <video
              src="/logos/Dentaxy AI.mp4"
              autoPlay
              muted
              playsInline
              loop
              className="w-full h-full object-cover select-none pointer-events-none mix-blend-multiply"
              style={{
                transform: "scale(1.25) translateZ(0)",
                WebkitTransform: "scale(1.25) translateZ(0)"
              }}
            />
          </motion.div>

          {/* Caja de entrada estilo ChatGPT */}
          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.12 }}
                className="flex-1 flex items-center ml-3 pr-2"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setChatInput(val);
                    // Disparar búsqueda en tiempo real para que el carrusel se filtre
                    window.dispatchEvent(new CustomEvent('dex:typingSearch', { detail: { query: val } }));
                  }}
                  placeholder="Pregunta lo que quieras"
                  className="flex-1 bg-transparent border-none outline-none text-slate-800 text-sm font-semibold placeholder-slate-400 py-1"
                  onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(); }}
                  autoFocus
                />
                {/* Micrófono decorativo */}
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
                {/* Botón enviar */}
                <button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || isLoading}
                  className="w-10 h-10 bg-black hover:bg-neutral-800 rounded-full flex items-center justify-center text-white transition-colors shrink-0 disabled:opacity-40"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="5"  y="10" width="2" height="4" rx="1" />
                    <rect x="9"  y="7"  width="2" height="10" rx="1" />
                    <rect x="13" y="5"  width="2" height="14" rx="1" />
                    <rect x="17" y="8"  width="2" height="8"  rx="1" />
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Modal Explicativo Neumórfico de Permisos de Micrófono ── */}
      <AnimatePresence>
        {showMicModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-[#e0e4eb] w-full max-w-lg rounded-[32px] p-8 shadow-[20px_20px_60px_rgba(163,177,198,0.75),_-20px_-20px_60px_rgba(255,255,255,0.95)] border border-white/40 text-neutral-800 relative overflow-hidden"
            >

              {/* Título de Marca estilo Bloqueo (Metálico / Bruno Ace SC) */}
              <div className="text-center mb-5 mt-0 select-none">
                <h2
                  className="text-4xl font-black tracking-tight text-neutral-700 mb-1 leading-none uppercase"
                  style={{ fontFamily: "'Bruno Ace SC', sans-serif" }}
                >
                  ASISTENTE DE VOZ
                </h2>
              </div>

              {/* Mensaje descriptivo */}
              <div className="space-y-5 text-[16px] leading-relaxed text-neutral-650 font-medium mb-8">
                <p>
                  Para usar tu asistente clínico manos libres, el micrófono de tu navegador debe permanecer activo.
                </p>

                {/* Selector de Asistente Neumórfico */}
                <div className="bg-white/15 p-5 rounded-3xl border border-white/20 shadow-[inset_1px_1px_3px_rgba(255,255,255,0.4)]">
                  <div className="text-center text-[15px] font-black text-neutral-700 mb-4 select-none tracking-wider uppercase">
                    Elige a tu asistente de voz:
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Opción Dex (Hombre) */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGender('male');
                        const store = useDexStore.getState();
                        store.setGender('male');
                        store.setDexVoice('es-MX-JorgeNeural');
                        // Despertar AudioContext dentro del user gesture
                        const ctx = getAudioCtx();
                        if (ctx && ctx.state === 'suspended') ctx.resume();
                        store.speakText("¡Hola! Responderé cuando escuche óquei decs jéy decs o simplemente decs!");
                      }}
                      className={`rounded-3xl p-5 transition-all duration-300 flex flex-col items-center gap-2.5 border select-none ${
                        selectedGender === 'male'
                          ? "bg-[#e0e4eb] text-neutral-950 shadow-[inset_4px_4px_8px_#beccd9,inset_-4px_-4px_8px_#ffffff] border-white/30"
                          : "bg-[#e0e4eb] text-neutral-600 shadow-[6px_6px_12px_#beccd9,_-6px_-6px_12px_#ffffff] hover:shadow-[3px_3px_6px_#beccd9,_-3px_-3px_6px_#ffffff] border-white/10 active:shadow-[inset_4px_4px_8px_#beccd9,inset_-4px_-4px_8px_#ffffff]"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-[#e0e4eb] shadow-[2px_2px_5px_rgba(163,177,198,0.55),_-2px_-2px_5px_rgba(255,255,255,1)] flex items-center justify-center relative">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`w-6 h-6 ${selectedGender === 'male' ? "text-neutral-800" : "text-neutral-400"}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="font-extrabold text-[16px] tracking-wide text-neutral-850">Dex</span>
                        <span className="text-[10px] text-neutral-500 uppercase tracking-widest mt-0.5 font-bold">Voz Masculina</span>
                      </div>
                    </button>

                    {/* Opción Dexy (Mujer) */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGender('female');
                        const store = useDexStore.getState();
                        store.setGender('female');
                        store.setDexVoice('es-MX-DaliaNeural');
                        // Despertar AudioContext dentro del user gesture
                        const ctx = getAudioCtx();
                        if (ctx && ctx.state === 'suspended') ctx.resume();
                        store.speakText("¡Hola! Responderé cuando escuche óquei decsi jéy decsi o simplemente decsi!");
                      }}
                      className={`rounded-3xl p-5 transition-all duration-300 flex flex-col items-center gap-2.5 border select-none ${
                        selectedGender === 'female'
                          ? "bg-[#e0e4eb] text-neutral-950 shadow-[inset_4px_4px_8px_#beccd9,inset_-4px_-4px_8px_#ffffff] border-white/30"
                          : "bg-[#e0e4eb] text-neutral-600 shadow-[6px_6px_12px_#beccd9,_-6px_-6px_12px_#ffffff] hover:shadow-[2px_2px_4px_#beccd9,_-2px_-2px_4px_#ffffff] border-white/10 active:shadow-[inset_4px_4px_8px_#beccd9,inset_-4px_-4px_8px_#ffffff]"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-[#e0e4eb] shadow-[2px_2px_5px_rgba(163,177,198,0.55),_-2px_-2px_5px_rgba(255,255,255,1)] flex items-center justify-center relative">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`w-6 h-6 ${selectedGender === 'female' ? "text-neutral-800" : "text-neutral-400"}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="font-extrabold text-[16px] tracking-wide text-neutral-850">Dexy</span>
                        <span className="text-[10px] text-neutral-500 uppercase tracking-widest mt-0.5 font-bold">Voz Femenina</span>
                      </div>
                    </button>
                  </div>

                </div>

                <p className="text-[14px] text-neutral-750 bg-white/45 p-4 rounded-2xl border border-white/45 shadow-[inset_1px_1px_3px_rgba(255,255,255,0.5)]">
                  ⚠️ <strong>Importante:</strong> Al presionar el botón de abajo, tu navegador te solicitará acceso. Selecciona <strong>Permitir</strong> para habilitar la experiencia completa.
                </p>
              </div>

              {/* Botón de acción neumórfico */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={async () => {
                    // Bug #2 + #5 corregido: configurar género en el store (fuente única)
                    // y arrancar el motor DENTRO del user gesture para evitar bloqueo de Chrome
                    const store = useDexStore.getState();
                    store.setGender(selectedGender);
                    if (selectedGender === 'male') {
                      store.setDexVoice('es-MX-JorgeNeural');
                    } else {
                      store.setDexVoice('es-MX-DaliaNeural');
                    }

                    // Despertar el AudioContext singleton DENTRO del user gesture
                    // Esto es fundamental para que Chrome no bloquee el audio
                    const ctx = getAudioCtx();
                    if (ctx && ctx.state === 'suspended') ctx.resume();

                    // Solicitar permiso nativo de micrófono
                    const granted = await requestMicrophonePermission();
                    localStorage.setItem('dex_mic_intro_shown', 'true');
                    setIsMicReady(true);
                    setShowMicModal(false);

                    // Arrancar el motor de reconocimiento DENTRO del user gesture (Bug #3)
                    // El useEffect lo reiniciará si es necesario, pero este primer arranque
                    // ocurre aquí para garantizar que Chrome no lo bloquee
                    setTimeout(() => {
                      if (launchSRRef.current) launchSRRef.current();
                    }, 100);

                    if (!granted) {
                      const activeName = selectedGender === 'female' ? 'Dexy' : 'Dex';
                      toast.warning(`Acceso al micrófono denegado. Puedes activarlo en la barra de direcciones de tu navegador para usar a ${activeName} por voz.`, {
                        duration: 6000,
                      });
                    }
                  }}
                  className="w-full bg-[#e0e4eb] text-neutral-800 rounded-2xl py-4 px-6 font-bold shadow-[6px_6px_12px_rgba(163,177,198,0.85),_-6px_-6px_12px_rgba(255,255,255,1)] hover:shadow-[3px_3px_6px_rgba(163,177,198,0.85),_-3px_-3px_6px_rgba(255,255,255,1)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.8),_inset_-4px_-4px_8px_rgba(255,255,255,1)] transition-all duration-300 flex items-center justify-center gap-2.5 text-base uppercase tracking-wider relative group"
                >
                  <span>Habilitar Micrófono</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  {/* Línea LED neumórfica debajo en hover */}
                  <div className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-[#00f5a0] blur-[1px] opacity-0 group-hover:opacity-80 transition-opacity duration-300 rounded-full" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── FULL SCREEN VIEWER (Ilustraciones y Radiografías via DEX) ─── */}
      <AnimatePresence>
        {fullScreenImage && (
          <motion.div
            key="dex-fullscreen-viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
            style={{
              background: 'rgba(0,0,0,0.82)',
              backdropFilter: 'blur(24px) saturate(0.7)',
              WebkitBackdropFilter: 'blur(24px) saturate(0.7)',
            }}
            onClick={() => setFullScreenImage(null)}
          >
            {/* Título */}
            {fullScreenTitle && (
              <motion.div
                initial={{ y: -16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.12 }}
                className="absolute top-5 left-1/2 -translate-x-1/2 text-white/75 text-sm font-semibold tracking-widest uppercase"
              >
                {fullScreenTitle}
              </motion.div>
            )}

            {/* Botón de cierre */}
            <button
              onClick={() => setFullScreenImage(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center text-white transition-all z-10 border border-white/20"
            >
              <X size={20} />
            </button>

            {/* Instrucción de cierre */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/30 text-xs font-medium tracking-wide">
              Di "Dex, cerrar imagen" · Presiona Esc · Haz clic fuera
            </div>

            {/* Imagen */}
            <motion.img
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              src={fullScreenImage}
              alt={fullScreenTitle || 'Vista clínica Dex'}
              className="max-w-[92vw] max-h-[86vh] object-contain rounded-2xl shadow-2xl select-none"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

