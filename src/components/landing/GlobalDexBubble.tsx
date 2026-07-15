import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { chatWithAgent } from "@/services/gemini";
import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDexStore } from "@/stores/useDexStore";
import {
  normalizePatientName,
  splitNombreApellidos,
  detectDuplicate,
  looksLikeName,
  NON_NAME_WORDS,
} from "@/lib/dex/nombresMexicanos";

// ─── Efectos de Sonido con Web Audio API ─────────────────────────────────────
const playActivationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
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
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
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

// ─── Utilidad: limpiar texto transcrito ──────────────────────────────────────
const WAKE_PHRASES = [
  'okey dex', 'ok dex', 'hey dex', 'oye dex', 'okay dex', 'escucha dex',
  'okey sex', 'ok sex', 'hey sex',
  'okey lex', 'ok lex', 'hey lex',
  'okey rex', 'ok rex', 'hey rex',
  'okey deck', 'ok deck', 'hey deck',
  'oki dex', 'dex',
];

/** Retorna true si el texto contiene alguna frase de activación */
function detectWake(text: string): boolean {
  const t = text.toLowerCase().trim();
  // Frases compuestas primero
  if (WAKE_PHRASES.slice(0, -1).some(phrase => t.includes(phrase))) return true;
  // "dex" como token independiente (evita falsos positivos en palabras como "index")
  if (/(?:^|\s)dex(?:\s|$|,|\.|!|\?)/i.test(t)) return true;
  return false;
}

/** Extrae el comando después del wake word y limpia palabras de relleno */
function extractCommand(text: string): string {
  let cmd = text.toLowerCase().trim();
  for (const phrase of WAKE_PHRASES) {
    cmd = cmd.replace(new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '');
  }
  // eliminar "dex" suelto
  cmd = cmd.replace(/(?:^|\s)dex(?:\s|$|,|\.|!|\?)/gi, ' ');
  
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

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('SLEEPING');

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

  // ── Refs de reconocimiento ────────────────────────────────────────────────
  const recRef = useRef<any>(null);
  const aliveRef = useRef(false);
  const suppressToggleRef = useRef(false);
  const isListeningRef = useRef(false);
  // Contador de errores not-allowed para no matar DEX con un error transitorio
  const notAllowedCountRef = useRef(0);
  const launchSRRef = useRef<(() => void) | null>(null);

  // ── Ref de función de procesamiento (siempre actualizado) ─────────────────
  const processVoiceRef = useRef<(text: string) => void>(() => {});

  // ── Zustand Store ─────────────────────────────────────────────────────────
  const { speakText, isSpeaking, setIsListening } = useDexStore();

  // Rutas donde DEX no debe aparecer
  const isLanding = location.pathname === "/";
  const isAdmin   = location.pathname.startsWith("/admin");
  const isPatient = location.pathname.startsWith("/paciente") || location.pathname.startsWith("/x");
  const shouldHide = isLanding || isAdmin || isPatient;

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

  // ────────────────────────────────────────────────────────────────────────
  // LÓGICA DE COMANDOS DE VOZ
  // ────────────────────────────────────────────────────────────────────────
  const handleSendMessageWithText = useCallback(async (text: string) => {
    if (!text.trim()) return;
    try {
      const response = await chatWithAgent(text, {}, []);
      convStateRef.current = 'IDLE';
      setResponseMessage(response);
      speakText(response);
      resetInactivity();
    } catch {
      const m = "No pude procesar ese comando, Doctor. ¿Puede repetirlo?";
      convStateRef.current = 'IDLE';
      setResponseMessage(m);
      speakText(m);
    }
  }, [speakText, resetInactivity]);

  const handleSendMessage = useCallback(async () => {
    if (!chatInput.trim() || isLoading) return;
    const userQuery = chatInput;
    setChatInput("");
    setIsLoading(true);
    try {
      const response = await chatWithAgent(userQuery, {}, []);
      setResponseMessage(response);
      speakText(response);
    } catch {
      setResponseMessage("No pude procesar esa pregunta, Doctor.");
    } finally {
      setIsLoading(false);
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
        const msg = `Perfecto. Registrando a ${normalizedName} con teléfono ${match[1].trim()}. ¿Confirma el registro?`;
        setResponseMessage(msg); speakText(msg);
      } else {
        const normalizedName = normalizePatientName(data);
        tempPatientRef.current.name = normalizedName;
        // Animar escritura del nombre en el formulario
        window.dispatchEvent(new CustomEvent('dex:fillForm', { detail: { nombre: normalizedName } }));
        convStateRef.current = 'ADD_PATIENT_PHONE';
        const msg = `Nombre registrado: ${normalizedName}. ¿Cuál es su número de teléfono?`;
        setResponseMessage(msg); speakText(msg);
      }
    } else {
      convStateRef.current = 'ADD_PATIENT_NAME';
      const msg = "Claro Doctor, ¿Cuál es el nombre completo del paciente?";
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
        const doneMsg = "Paciente registrado exitosamente.";
        setResponseMessage(doneMsg); speakText(doneMsg);
        setTimeout(() => { setIsChatOpen(false); setResponseMessage(null); setIsInteracting(false); }, 4000);
      } catch {
        window.dispatchEvent(new CustomEvent('createNewPatientLocal', {
          detail: { name: nameSnap, telefono: phoneSnap }
        }));
        const doneMsg = "Paciente registrado en sistema local.";
        setResponseMessage(doneMsg); speakText(doneMsg);
        setTimeout(() => { setIsChatOpen(false); setResponseMessage(null); setIsInteracting(false); }, 4000);
      }
    })();
  }, [speakText]);

  const handleVoiceCommand = useCallback((cmd: string) => {
    if (!cmd) {
      const phrases = [
        "A la orden, Doctor.",
        "Dígame, Doctor, ¿en qué le asisto?",
        "A sus completas órdenes, Doctor.",
        "A su entera disposición, Doctor.",
        "Le escucho atentamente, Doctor.",
        "¿Qué se le ofrece, Doctor?",
        "Siempre a su disposición, Doctor.",
        "Listo para sus instrucciones, Doctor."
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

    // ── Flujo multi-paso de agregar paciente (requiere estado de conversación) ──
    if (isAddPatientIntent(cmd)) {
      const data = cmd.replace(/.*(?:agrega|agregar|nuevo|registra|registrar|añade|añadir)\s+paciente\s*/i, "").trim();
      handleAddPatientIntent(data);
      return;
    }

    // ── Cerrar / ocultar DEX ──────────────────────────────────────────────────
    if (cmd.includes("cerrar") || cmd.includes("quita") || cmd.includes("oculta")) {
      const m = "Entendido, Doctor.";
      setResponseMessage(m); speakText(m);
      convStateRef.current = 'IDLE';
      return;
    }

    // ── TODO lo demás pasa por el motor local de gemini.ts ──────────────────
    // (búsquedas, preguntas clínicas, navegación, etc.)
    // chatWithAgent es 100% local: despacha eventos y retorna texto al instante
    handleSendMessageWithText(cmd);
  }, [speakText, handleAddPatientIntent, handleSendMessageWithText]);

  const processVoiceInput = useCallback((text: string) => {
    const cleaned = text.trim();
    if (!cleaned) return;
    resetInactivity();

    const conv = convStateRef.current;
    if (conv === 'ADD_PATIENT_NAME') {
      // Validar que parece ser un nombre antes de procesar
      if (!looksLikeName(cleaned)) {
        const msg = "No escuché bien el nombre, Doctor. ¿Puede repetir el nombre completo del paciente?";
        setResponseMessage(msg); speakText(msg);
        return;
      }
      handleAddPatientIntent(cleaned);
    } else if (conv === 'ADD_PATIENT_PHONE') {
      tempPatientRef.current.phone = cleaned;
      // Animar escritura del teléfono en el formulario
      window.dispatchEvent(new CustomEvent('dex:fillForm', { detail: { telefono: cleaned } }));
      convStateRef.current = 'ADD_PATIENT_CONFIRM';
      const msg = `Perfecto. Registrando a ${tempPatientRef.current.name} con teléfono ${cleaned}. ¿Confirma el registro?`;
      setResponseMessage(msg); speakText(msg);
    } else if (conv === 'ADD_PATIENT_CONFIRM') {
      const toWords = (s: string) => s.split(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9]+/).filter(Boolean);
      const words = toWords(cleaned.toLowerCase());
      const confirmList = ["si", "sí", "claro", "confirmo", "confirmar", "confirma", "correcto", "ok", "okay", "dale", "perfecto", "adelante", "hazlo", "supuesto", "simon", "yes", "sip", "crear", "crea", "procede", "proceder", "graba", "grabar", "va", "andale", "ándale", "sure", "yep", "afirmativo"];
      const cancelList = ["no", "cancelar", "cancela", "olvidalo", "olvídalo", "detener", "parar"];
      if (confirmList.some(w => words.includes(w))) {
        doCreatePatient();
      } else if (cancelList.some(w => words.includes(w))) {
        const msg = "Registro cancelado, Doctor.";
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
    if (shouldHide) return;

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
      // Si DEX está hablando, no reiniciar (se retomará en el effect de isSpeaking)
      if (voiceStateRef.current === 'SPEAKING') return;

      // Limpiar instancia anterior sin efectos secundarios
      if (recRef.current) {
        recRef.current.onstart  = null;
        recRef.current.onresult = null;
        recRef.current.onerror  = null;
        recRef.current.onend    = null;
        try { recRef.current.abort(); } catch (_) {}
        recRef.current = null;
      }

      const rec = new SR();
      recRef.current = rec;
      rec.continuous     = true;
      rec.interimResults = true;
      rec.lang           = 'es-MX';
      rec.maxAlternatives = 3;

      rec.onstart = () => {
        suppressToggleRef.current = false;
        notAllowedCountRef.current = 0; // reset contador de errores al iniciar correctamente
        micOn();
        console.log('[DEX] Mic encendido, estado:', voiceStateRef.current);
      };

      rec.onend = () => {
        micOff();
        if (!aliveRef.current) return;
        if (voiceStateRef.current === 'SPEAKING') return;
        // Chrome cierra sesiones ~60s. Reiniciamos silenciosamente.
        suppressToggleRef.current = true;
        if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
        restartTimerRef.current = setTimeout(() => {
          suppressToggleRef.current = false;
          if (aliveRef.current) launch();
        }, 100);
      };

      rec.onerror = (e: any) => {
        console.warn('[DEX] Error de reconocimiento:', e.error);
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          notAllowedCountRef.current += 1;
          // Solo matar DEX si se confirma 3 veces consecutivas
          if (notAllowedCountRef.current >= 3) {
            console.warn('[DEX] Permiso de micrófono denegado 3 veces. DEX deshabilitado.');
            aliveRef.current = false;
            suppressToggleRef.current = false;
            micOff();
            return;
          }
          // Intentar reiniciar (puede ser error transitorio de contexto de audio)
          suppressToggleRef.current = true;
          if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
          restartTimerRef.current = setTimeout(() => {
            suppressToggleRef.current = false;
            if (aliveRef.current) launch();
          }, 1000);
          return;
        }
        // Para otros errores (aborted, network, etc.) reiniciar
        micOff();
        if (!aliveRef.current) return;
        suppressToggleRef.current = true;
        if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
        restartTimerRef.current = setTimeout(() => {
          suppressToggleRef.current = false;
          if (aliveRef.current && voiceStateRef.current !== 'SPEAKING') launch();
        }, 300);
      };

      // ── Handler principal de resultados ─────────────────────────────
      rec.onresult = (event: any) => {
        if (voiceStateRef.current === 'SPEAKING') return; // anti-eco

        // Recolectar todos los resultados nuevos del evento
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const isFinal = result.isFinal;

          // Obtener todas las alternativas de transcripción
          const transcripts: string[] = [];
          for (let j = 0; j < result.length; j++) {
            transcripts.push(result[j].transcript.toLowerCase().trim());
          }
          const primaryText = transcripts[0] || '';

          console.log(`[DEX] [${voiceStateRef.current}] "${primaryText}" (final: ${isFinal})`);

          // ─── SLEEPING: detectar wake word ──────────────────────────
          if (voiceStateRef.current === 'SLEEPING') {
            // Revisar todas las alternativas fonéticas
            const wakeHit = transcripts.some(t => detectWake(t));
            if (!wakeHit) continue;

            console.log('[DEX] ¡Wake word detectado! Activando...');
            
            // ── Activar INMEDIATAMENTE (síncronamente en el ref, sin esperar render) ──
            voiceStateRef.current = 'LISTENING_COMMAND'; // cambio inmediato en ref
            playActivationSound();                       // sonido instantáneo
            setIsInteracting(true);                      // React actualiza después
            setVoiceState('LISTENING_COMMAND');          // render de UI

            // Extraer comando inline (ej: "okey dex abre historial de García")
            const cmd = extractCommand(primaryText);
            console.log('[DEX] Comando inline extraído:', `"${cmd}"`);

            if (cmd.length > 2) {
              // Hay comando inmediato — verificar que no sea basura
              if (!isMeaningfulCommand(cmd)) {
                // Comando sin sentido (ej. ruido o muletilla) → ignorar y seguir escuchando
                console.log('[DEX] Comando inline sin sentido, ignorando:', cmd);
                setResponseMessage('Escuchando, Doctor...');
                convStateRef.current = 'WAITING_COMMAND';
                if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
                commandTimeoutRef.current = setTimeout(() => {
                  if (voiceStateRef.current === 'LISTENING_COMMAND' && aliveRef.current) {
                    goSleep(true);
                  }
                }, 4000);
                continue;
              }

              // Comando válido — procesar directamente
              if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
              if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
              voiceStateRef.current = 'PROCESSING';
              setVoiceState('PROCESSING');
              setTimeout(() => {
                if (aliveRef.current) processVoiceRef.current(cmd);
              }, 80); // mínimo delay para que el sonido de activación suene
            } else {
              // Sin comando inline — iniciar timeout de silencio de 4 segundos
              setResponseMessage('Escuchando, Doctor...');
              convStateRef.current = 'WAITING_COMMAND';
              
              if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
              commandTimeoutRef.current = setTimeout(() => {
                if (voiceStateRef.current === 'LISTENING_COMMAND' && aliveRef.current) {
                  console.log('[DEX] Timeout de silencio (4s). Volviendo a dormir.');
                  goSleep(true);
                }
              }, 4000);
            }
            continue; // Ya manejamos este bloque
          }

          // ─── LISTENING_COMMAND: capturar el comando ─────────────────
          if (voiceStateRef.current === 'LISTENING_COMMAND') {
            const cmd = extractCommand(primaryText);
            
            if (cmd) {
              setResponseMessage(cmd);
            }

            // Resetear el timeout de 4s mientras el usuario habla
            if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
            commandTimeoutRef.current = setTimeout(() => {
              if (voiceStateRef.current === 'LISTENING_COMMAND' && aliveRef.current) {
                console.log('[DEX] Timeout de silencio tras captura. Volviendo a dormir.');
                goSleep(true);
              }
            }, 4000);

            // Determinar si debemos procesar el comando basado en el contexto
            const isMultiStep = ['ADD_PATIENT_NAME', 'ADD_PATIENT_PHONE', 'ADD_PATIENT_CONFIRM'].includes(convStateRef.current);
            const shouldProcess = isMultiStep ? cmd.length > 0 : cmd.length > 2;

            if (shouldProcess) {
              if (isFinal) {
                // Resultado definitivo: verificar significado antes de ejecutar
                const isContext = ['ADD_PATIENT_NAME', 'ADD_PATIENT_PHONE', 'ADD_PATIENT_CONFIRM'].includes(convStateRef.current);
                if (!isContext && !isMeaningfulCommand(cmd)) {
                  // No tiene sentido → limpiar el texto y seguir esperando
                  console.log('[DEX] Comando final sin sentido, ignorando:', cmd);
                  setResponseMessage('Escuchando, Doctor...');
                  continue;
                }
                if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
                if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
                voiceStateRef.current = 'PROCESSING';
                setVoiceState('PROCESSING');
                processVoiceRef.current(cmd);
              } else {
                // Resultado provisional: esperar pausa de 1.2s para ejecutar
                if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
                silenceTimerRef.current = setTimeout(() => {
                  if (voiceStateRef.current === 'LISTENING_COMMAND' && aliveRef.current) {
                    const isCtx = ['ADD_PATIENT_NAME', 'ADD_PATIENT_PHONE', 'ADD_PATIENT_CONFIRM'].includes(convStateRef.current);
                    if (!isCtx && !isMeaningfulCommand(cmd)) {
                      setResponseMessage('Escuchando, Doctor...');
                      return;
                    }
                    if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
                    voiceStateRef.current = 'PROCESSING';
                    setVoiceState('PROCESSING');
                    processVoiceRef.current(cmd);
                  }
                }, 1200);
              }
            }
            continue;
          }
        }
      };

      try {
        rec.start();
        console.log('[DEX] SpeechRecognition iniciado.');
      } catch (err) {
        console.warn('[DEX] Error al iniciar SpeechRecognition, reintentando...', err);
        suppressToggleRef.current = false;
        if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
        restartTimerRef.current = setTimeout(launch, 500);
      }
    };

    launchSRRef.current = launch;

    // ── Watchdog anti-deadlock ────────────────────────────────────────────
    // Cada 8 segundos verifica que el motor esté activo; si no → lo resucita
    watchdogRef.current = setInterval(() => {
      if (!aliveRef.current) return;
      if (voiceStateRef.current === 'SPEAKING') return;
      if (!isListeningRef.current) {
        console.warn('[DEX] Watchdog: mic inactivo detectado, reiniciando...');
        suppressToggleRef.current = false;
        launch();
      }
    }, 8000);

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
      if (watchdogRef.current)        clearInterval(watchdogRef.current);

      if (recRef.current) {
        recRef.current.onstart  = null;
        recRef.current.onresult = null;
        recRef.current.onerror  = null;
        recRef.current.onend    = null;
        try { recRef.current.abort(); } catch (_) {}
        recRef.current = null;
      }

      useDexStore.getState().setIsListening(false);
    };
  }, [shouldHide, micOn, micOff, setVS, goSleep]);

  // ── Anti-eco: pausar mic mientras DEX habla ────────────────────────────
  useEffect(() => {
    if (shouldHide) return;

    if (isSpeaking) {
      // DEX está hablando — silenciar reconocimiento para evitar eco
      voiceStateRef.current = 'SPEAKING';
      setVoiceState('SPEAKING');
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      if (recRef.current && isListeningRef.current) {
        try { recRef.current.abort(); } catch (_) {}
      }
    } else {
      // DEX terminó de hablar
      if (voiceStateRef.current !== 'SPEAKING') return;

      // CRÍTICO: siempre limpiar suppress antes de reiniciar
      suppressToggleRef.current = false;

      // Determinar a qué estado volver
      const nextState = convStateRef.current !== 'IDLE' ? 'LISTENING_COMMAND' : 'SLEEPING';
      if (nextState === 'LISTENING_COMMAND') {
        playActivationSound();
        setResponseMessage('Escuchando, Doctor...');
        // Reiniciar timeout de 4s
        if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
        commandTimeoutRef.current = setTimeout(() => {
          if (voiceStateRef.current === 'LISTENING_COMMAND' && aliveRef.current) {
            goSleep(true);
          }
        }, 4000);
      } else {
        // nextState === 'SLEEPING'
        setTimeout(() => {
          if (voiceStateRef.current === 'SLEEPING' || voiceStateRef.current === 'SPEAKING') {
            setResponseMessage(null);
          }
        }, 1500);
      }
      voiceStateRef.current = nextState;
      setVoiceState(nextState);
      
      // Como abortamos el reconocimiento durante SPEAKING, onend se saltó el reinicio.
      // Debemos forzar el relanzamiento aquí explícitamente para que escuche de nuevo.
      if (aliveRef.current && !isListeningRef.current && launchSRRef.current) {
        // pequeño timeout para evitar colisión con el abort anterior en el API nativo
        setTimeout(() => {
          if (launchSRRef.current) launchSRRef.current();
        }, 50);
      }
    }
  }, [isSpeaking, shouldHide, setVS, goSleep]);

  if (shouldHide) return null;

  return (
    <>
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
          y: [0, -4, 0],
          x: [0, 2, 0, -2, 0],
          transition: {
            y: { repeat: Infinity, duration: 3.5, ease: "easeInOut" },
            x: { repeat: Infinity, duration: 4.5, ease: "easeInOut" }
          }
        }}
        whileHover={!isChatOpen ? {
          scale: 1.04,
        } : undefined}
        whileTap={!isChatOpen ? { scale: 0.96 } : undefined}
        transition={isChatOpen
          ? { type: "spring", stiffness: 140, damping: 20 }
          : { type: "tween", ease: "linear", duration: 0.2 }
        }
        className={`fixed z-[9999] flex items-center cursor-pointer ${
          isChatOpen
            ? "bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-100 p-1 justify-start"
            : "bg-transparent justify-center p-0"
        }`}
        style={{
          right:  isMobile ? 16 : 48,
          bottom: isMobile ? 24 : 24,
          willChange: "transform, width, height",
          // Shadow morado manejado por Framer solo cuando es orbe (no chat)
          boxShadow: isChatOpen ? undefined : '0 0 35px rgba(147,51,234,0.35)',
        }}
        onClick={() => { if (!isChatOpen) setIsChatOpen(true); }}
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
      </motion.div>
    </>
  );
}
